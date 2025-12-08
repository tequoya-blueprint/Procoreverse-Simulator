// --- app-tours.js ---
// VERSION 30: Terminology Shift ("Process Maps" instead of "Workflows")

function initializeTourControls() {
    const platformGroup = d3.select("#platform-tours");
    const packageGroup = d3.select("#package-tours");
    
    // Load Standard Data
    if (typeof tours !== 'undefined' && tours.platform) {
        Object.entries(tours.platform).forEach(([id, tour]) => platformGroup.append("option").attr("value", id).text(tour.name));
    }
    if (typeof tours !== 'undefined' && tours.packages) {
        Object.entries(tours.packages).forEach(([id, tour]) => packageGroup.append("option").attr("value", id).text(tour.name));
    }

    loadSavedTours();

    d3.select("#tour-select").on("change", function() {
        const tourId = this.value;
        if (tourId === "none") {
            stopTour();
        } else {
            let tourData = null;
            if (typeof flatTours !== 'undefined' && flatTours[tourId]) tourData = flatTours[tourId];
            else if (typeof tours !== 'undefined' && tours.ai && tours.ai[tourId]) tourData = tours.ai[tourId];
            else if (typeof tours !== 'undefined') {
                 if (tours.platform && tours.platform[tourId]) tourData = tours.platform[tourId];
                 if (tours.packages && tours.packages[tourId]) tourData = tours.packages[tourId];
            }
            if (tourData) previewTour(tourData);
        }
    });

    d3.select("#tour-prev").on("click", () => { if (app.currentStep > 0) { app.currentStep--; runTourStep(); } });
    d3.select("#tour-next").on("click", () => { if (app.currentTour && app.currentStep < app.currentTour.steps.length - 1) { app.currentStep++; runTourStep(); } });

    // AI Modal Controls
    const aiModalOverlay = d3.select("#ai-modal-overlay");
    d3.select("#ai-workflow-builder-btn").on("click", () => aiModalOverlay.classed("visible", true));
    d3.select("#ai-modal-close").on("click", () => aiModalOverlay.classed("visible", false));
    aiModalOverlay.on("click", function(e) { if (e.target === this) aiModalOverlay.classed("visible", false); });
    d3.select("#ai-workflow-generate").on("click", generateAiWorkflow);

    // --- MANUAL BUILDER BUTTON (UPDATED TEXT) ---
    const container = d3.select("#tour-container");
    container.append("button")
        .attr("id", "manual-workflow-builder-btn")
        .attr("class", "w-full mt-2 btn-indigo bg-gray-600 hover:bg-gray-700") 
        .style("display", "none") 
        // Renamed to "Build Custom Process"
        .html('<i class="fas fa-hand-pointer mr-2"></i> Build Custom Process')
        .on("click", startManualBuilder);
}

// --- PERSISTENCE ---
function loadSavedTours() {
    const saved = localStorage.getItem('procoreverse_saved_tours');
    if (saved) {
        try {
            const parsedTours = JSON.parse(saved);
            const aiGroup = d3.select("#ai-tours");
            if (!tours.ai) tours.ai = {};
            Object.entries(parsedTours).forEach(([id, tour]) => {
                tours.ai[id] = tour;
                aiGroup.append("option").attr("value", id).text(tour.name);
            });
        } catch (e) { console.error(e); }
    }
}

function saveCurrentTour() {
    if (!app.currentTour) return;
    let tourId = app.currentTour.id;
    if (!tourId) {
        tourId = `custom_tour_${Date.now()}`;
        app.currentTour.id = tourId;
    }
    if (!tours.ai) tours.ai = {};
    tours.ai[tourId] = app.currentTour;

    let saved = {};
    const existing = localStorage.getItem('procoreverse_saved_tours');
    if (existing) { try { saved = JSON.parse(existing); } catch(e) {} }
    saved[tourId] = app.currentTour;
    localStorage.setItem('procoreverse_saved_tours', JSON.stringify(saved));
    
    const aiGroup = d3.select("#ai-tours");
    if (aiGroup.select(`option[value="${tourId}"]`).empty()) {
        aiGroup.append("option").attr("value", tourId).text(app.currentTour.name);
    }
    d3.select("#tour-select").property("value", tourId);
    
    // Updated Toast Message
    if(typeof showToast === 'function') showToast("Process Saved!");
    d3.selectAll(".save-tour-btn").property("disabled", true).html('<i class="fas fa-check mr-2"></i>Saved');
}

// --- MANUAL BUILDER LOGIC ---

let manualBuilderSteps = [];

function startManualBuilder() {
    stopTour(); 
    app.interactionState = 'manual_building';
    manualBuilderSteps = [];
    
    app.node.transition().duration(500).style("opacity", 0.3);
    app.link.transition().duration(500).style("stroke-opacity", 0.05);

    const controls = d3.select("#tour-controls");
    controls.style("display", "block").html(`
        <div class="bg-gray-800 text-white p-3 rounded-lg shadow-inner mb-2">
            <div class="flex justify-between items-center mb-2">
                <span class="font-bold text-xs uppercase tracking-wide text-gray-400">Recording Mode</span>
                <span id="manual-step-count" class="bg-indigo-600 px-2 py-0.5 rounded text-xs font-bold">0 Steps</span>
            </div>
            <p class="text-sm italic text-gray-300">Click tools in the graph to map your custom process.</p>
        </div>
        <div class="flex gap-2">
            <button id="cancel-manual-btn" class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold py-2 rounded">Cancel</button>
            <button id="finish-manual-btn" class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 rounded disabled:opacity-50" disabled>Finish & Save</button>
        </div>
    `);

    d3.select("#cancel-manual-btn").on("click", stopTour);
    d3.select("#finish-manual-btn").on("click", finishManualBuilder);
    
    if(typeof resizeTourAccordion === 'function') resizeTourAccordion();
    if(typeof showToast === 'function') showToast("Click on nodes to build your process map.");
}

function handleManualNodeClick(d) {
    manualBuilderSteps.push({
        nodeId: d.id,
        info: `Maps to ${d.id} tool.` 
    });

    d3.select("#manual-step-count").text(`${manualBuilderSteps.length} Steps`);
    d3.select("#finish-manual-btn").property("disabled", false);

    app.node.transition().duration(300).style("opacity", n => {
        return manualBuilderSteps.some(s => s.nodeId === n.id) ? 1 : 0.3;
    });

    if (manualBuilderSteps.length > 1) {
        const prevId = manualBuilderSteps[manualBuilderSteps.length - 2].nodeId;
        const currId = d.id;
        app.link.transition().duration(300)
            .style("stroke-opacity", l => {
                const s = l.source.id || l.source;
                const t = l.target.id || l.target;
                return 0.05; 
            });
        
        const activeIds = new Set(manualBuilderSteps.map(s => s.nodeId));
        app.link.transition().duration(300)
            .style("stroke-opacity", l => {
                const s = l.source.id || l.source;
                const t = l.target.id || l.target;
                return (activeIds.has(s) && activeIds.has(t)) ? 1 : 0.05;
            })
            .attr("stroke", l => {
                const s = l.source.id || l.source;
                const t = l.target.id || l.target;
                return (activeIds.has(s) && activeIds.has(t)) ? "var(--procore-orange)" : "#a0a0a0";
            });
    }
}

function finishManualBuilder() {
    // Updated Prompt Text
    const name = prompt("Enter a name for this Custom Process:", "New SOP Process");
    if (!name) return;

    const newTour = {
        name: `📝 ${name}`, 
        steps: manualBuilderSteps,
        id: `custom_${Date.now()}`
    };

    app.currentTour = newTour;
    saveCurrentTour(); 
    previewTour(newTour); 
}

// --- STANDARD TOUR LOGIC ---
function previewTour(tourData) {
    stopTour(false); 
    app.currentTour = tourData;
    app.currentStep = -1; 
    app.interactionState = 'tour_preview';
    
    const nodeIds = new Set(tourData.steps.map(s => s.nodeId));
    app.node.transition().duration(500).style("opacity", d => nodeIds.has(d.id) ? 1 : 0.1);
    app.link.transition().duration(500).style("stroke-opacity", l => {
        const s = l.source.id || l.source;
        const t = l.target.id || l.target;
        return (nodeIds.has(s) && nodeIds.has(t)) ? 1 : 0.05;
    }).attr("stroke", l => {
        const s = l.source.id || l.source;
        const t = l.target.id || l.target;
        return (nodeIds.has(s) && nodeIds.has(t)) ? "var(--procore-orange)" : "#a0a0a0";
    }).attr("marker-end", l => {
         const s = l.source.id || l.source;
         const t = l.target.id || l.target;
         if (nodeIds.has(s) && nodeIds.has(t)) return `url(#arrow-highlighted)`;
         const legend = legendData.find(leg => leg.type_id === l.type);
         return (legend && legend.visual_style.includes("one arrow")) ? `url(#arrow-${l.type})` : null;
    });

    let isSaved = false;
    if (tours.ai) isSaved = Object.values(tours.ai).some(t => t.name === tourData.name);

    const controls = d3.select("#tour-controls");
    controls.style("display", "block").html(`
        <div class="flex flex-col gap-3 pb-2">
            <div class="w-full">
                <div class="text-sm font-bold text-gray-800 leading-snug break-words">${tourData.name}</div>
                <div class="text-xs text-gray-500 mt-1">${tourData.steps.length} steps</div>
            </div>
            <div class="flex items-center gap-2 w-full">
                <button class="save-tour-btn flex-1 bg-white hover:bg-gray-50 text-indigo-600 border border-indigo-200 text-xs font-bold py-2 px-2 rounded shadow-sm transition flex items-center justify-center" title="Save to Browser"><i class="fas fa-save mr-2"></i> Save</button>
                <button id="start-tour-btn" class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 px-2 rounded shadow-md transition flex items-center justify-center">Start <i class="fas fa-play ml-2"></i></button>
            </div>
        </div>
    `);

    d3.select("#start-tour-btn").on("click", startTour);
    d3.selectAll(".save-tour-btn").on("click", saveCurrentTour);
    if (isSaved) d3.selectAll(".save-tour-btn").property("disabled", true).html('<i class="fas fa-check mr-2"></i>Saved');
    resizeTourAccordion();
}

function startTour() {
    app.interactionState = 'tour';
    app.currentStep = 0;
    d3.select("#tour-controls").style("display", "flex").html(`
        <button id="tour-prev" class="text-gray-500 hover:text-gray-700 px-3 py-1 disabled:opacity-30"><i class="fas fa-chevron-left"></i></button>
        <span id="tour-step-indicator" class="text-xs font-semibold text-gray-600">1 / ${app.currentTour.steps.length}</span>
        <button id="tour-next" class="text-gray-500 hover:text-gray-700 px-3 py-1 disabled:opacity-30"><i class="fas fa-chevron-right"></i></button>
        <button class="save-tour-btn hidden ml-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-1 px-3 rounded shadow-md transition items-center" title="Save this Process"><i class="fas fa-save mr-2"></i> Save</button>
    `);
    d3.select("#tour-prev").on("click", () => { if (app.currentStep > 0) { app.currentStep--; runTourStep(); } });
    d3.select("#tour-next").on("click", () => { if (app.currentTour && app.currentStep < app.currentTour.steps.length - 1) { app.currentStep++; runTourStep(); } });
    
    let isSaved = false;
    if (tours.ai) isSaved = Object.values(tours.ai).some(t => t.name === app.currentTour.name);
    if (isSaved) d3.selectAll(".save-tour-btn").property("disabled", true).html('<i class="fas fa-check mr-2"></i>Saved');
    else d3.selectAll(".save-tour-btn").on("click", saveCurrentTour);

    runTourStep();
    resizeTourAccordion();
}

function runTourStep() {
    const step = app.currentTour.steps[app.currentStep];
    const nodeData = app.simulation.nodes().find(n => n.id === step.nodeId);
    d3.select("#tour-step-indicator").text(`${app.currentStep + 1} / ${app.currentTour.steps.length}`);
    d3.select("#tour-prev").property("disabled", app.currentStep === 0);
    d3.select("#tour-next").property("disabled", app.currentStep === app.currentTour.steps.length - 1);

    const isLastStep = (app.currentStep === app.currentTour.steps.length - 1);
    const saveBtn = d3.select("#tour-controls .save-tour-btn");
    if (isLastStep) saveBtn.classed("hidden", false).classed("flex", true);
    else saveBtn.classed("hidden", true).classed("flex", false);

    if (nodeData) {
        if(typeof centerViewOnNode === 'function') centerViewOnNode(nodeData);
        const activeNodeIds = new Set();
        activeNodeIds.add(step.nodeId);
        let prevNodeId = null;
        if (app.currentStep > 0) {
            prevNodeId = app.currentTour.steps[app.currentStep - 1].nodeId;
            activeNodeIds.add(prevNodeId);
        }
        const tourNodeIds = new Set(app.currentTour.steps.map(s => s.nodeId));
        app.node.transition().duration(300).style("opacity", d => {
            if (activeNodeIds.has(d.id)) return 1;
            if (tourNodeIds.has(d.id)) return 0.15;
            return 0.05;
        });
        app.link.transition().duration(300).style("stroke-opacity", l => {
            const s = l.source.id || l.source;
            const t = l.target.id || l.target;
            const isActiveLink = prevNodeId && ((s === prevId && t === step.nodeId) || (s === step.nodeId && t === prevId));
            return isActiveLink ? 1 : 0.02;
        }).attr("stroke", l => {
            const s = l.source.id || l.source;
            const t = l.target.id || l.target;
            const isActiveLink = prevNodeId && ((s === prevId && t === step.nodeId) || (s === step.nodeId && t === prevId));
            return isActiveLink ? "var(--procore-orange)" : "#a0a0a0";
        }).attr("marker-end", l => {
            const s = l.source.id || l.source;
            const t = l.target.id || l.target;
            const isActiveLink = prevNodeId && ((s === prevId && t === step.nodeId) || (s === step.nodeId && t === prevId));
            if (isActiveLink) return `url(#arrow-highlighted)`;
            return null; 
        });
        if(typeof showInfoPanel === 'function') showInfoPanel(nodeData); 
        const tourBox = d3.select("#tour-info-box").style("display", "block");
        d3.select("#tour-info-text").text(step.info);
        d3.select("#info-panel").node().scrollTop = 0;
    }
}

function stopTour(fullReset = true) {
    if (fullReset) {
        app.currentTour = null;
        app.currentStep = -1;
        app.interactionState = 'explore';
        d3.select("#tour-controls").style("display", "none");
        d3.select("#tour-info-box").style("display", "none");
        d3.select("#tour-select").property("value", "none");
        if(typeof resetHighlight === 'function') resetHighlight();
        if(typeof resetZoom === 'function') resetZoom();
    }
    resizeTourAccordion();
}

function resizeTourAccordion() {
    const content = document.querySelector('#tour-container').closest('.accordion-content');
    if (content && content.parentElement.classList.contains('active')) {
        requestAnimationFrame(() => content.style.maxHeight = (content.scrollHeight + 30) + "px");
    }
}

// --- AI GENERATION ---

async function generateAiWorkflow() {
    const input = d3.select("#ai-workflow-input").property("value").trim();
    const status = d3.select("#ai-modal-status");
    const generateBtn = d3.select("#ai-workflow-generate");

    if (!input) {
        status.text("Please describe a process first.").classed("text-red-500", true);
        return;
    }

    status.text("Analyzing Procore platform...").classed("text-red-500", false).classed("text-indigo-600", true);
    generateBtn.property("disabled", true).classed("opacity-50", true);

    const validNodes = nodesData.map(n => n.id).join(", ");
    
    // --- UPDATED SYSTEM PROMPT: Uses "Process" Terminology ---
    const exampleWorkflow = JSON.stringify({
        name: "Change Management Process",
        steps: [
            { nodeId: "Drawings", info: "A discrepancy is identified on the Drawings in the field." },
            { nodeId: "RFIs", info: "An RFI is created to request clarification from the Design Team." },
            { nodeId: "Change Events", info: "The RFI results in a cost, creating a Change Event." },
            { nodeId: "Change Orders", info: "A Prime Change Order is generated for Owner approval." },
            { nodeId: "Budget", info: "The approved Change Order updates the Budget." }
        ]
    });

    const systemPrompt = `You are a Procore Platform Architect. 
    Create a linear step-by-step business process map based on the user's request.
    
    CRITICAL RULES:
    1. You may ONLY use these exact Tool Names (Node IDs): [${validNodes}].
    2. Do not invent tools. If a step implies an external tool, use 'ERP Systems' or 'Documents'.
    3. Return ONLY valid JSON. No Markdown.
    
    GUIDANCE & STYLE:
    - Mimic the logical flow of this example: ${exampleWorkflow}
    - Ensure steps follow the flow of data.
    - Use "Process" terminology instead of "Workflow" (e.g. "Invoice Process", not "Invoice Workflow").
    - Keep descriptions concise (under 20 words).
    
    JSON Structure:
    {
      "name": "Short Descriptive Title",
      "steps": [
        { "nodeId": "Exact Tool Name", "info": "Description of action taken here." }
      ]
    }`;

    // Using Verified Lite Model
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite-preview-02-05:generateContent?key=${app.apiKey}`;

    const payload = {
        contents: [{ parts: [{ text: `User Request: "${input}"` }] }],
        system_instruction: { parts: [{ text: systemPrompt }] },
        generationConfig: { responseMimeType: "application/json" }
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

        const result = await response.json();
        let rawText = result.candidates[0].content.parts[0].text;
        rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();

        const newTour = JSON.parse(rawText);

        if (newTour && newTour.steps && newTour.steps.length > 0) {
            const tourId = `ai_tour_${Date.now()}`;
            newTour.name = `✨ ${newTour.name}`;
            newTour.id = tourId; 

            // Preview Only
            d3.select("#ai-modal-overlay").classed("visible", false);
            d3.select("#ai-workflow-input").property("value", "");
            status.text("");
            
            previewTour(newTour);

        } else {
            throw new Error("AI returned invalid process structure.");
        }

    } catch (error) {
        console.error("AI Process generation failed:", error);
        status.text("Error generating process map. Please try again.").classed("text-red-500", true);
    } finally {
        generateBtn.property("disabled", false).classed("opacity-50", false);
    }
}
