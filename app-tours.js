// --- app-tours.js ---
// VERSION 25: Added "Few-Shot" Training Examples to AI Prompt

function initializeTourControls() {
    const platformGroup = d3.select("#platform-tours");
    const packageGroup = d3.select("#package-tours");
    
    // 1. Load Standard Data
    if (typeof tours !== 'undefined' && tours.platform) {
        Object.entries(tours.platform).forEach(([id, tour]) => {
            platformGroup.append("option").attr("value", id).text(tour.name);
        });
    }

    if (typeof tours !== 'undefined' && tours.packages) {
        Object.entries(tours.packages).forEach(([id, tour]) => {
            packageGroup.append("option").attr("value", id).text(tour.name);
        });
    }

    // 2. Load Saved AI Tours
    loadSavedTours();

    // 3. Dropdown Logic
    d3.select("#tour-select").on("change", function() {
        const tourId = this.value;
        if (tourId === "none") {
            stopTour();
        } else {
            let tourData = null;
            if (typeof flatTours !== 'undefined' && flatTours[tourId]) {
                tourData = flatTours[tourId];
            } else if (typeof tours !== 'undefined' && tours.ai && tours.ai[tourId]) {
                tourData = tours.ai[tourId];
            } else if (typeof tours !== 'undefined') {
                 if (tours.platform && tours.platform[tourId]) tourData = tours.platform[tourId];
                 if (tours.packages && tours.packages[tourId]) tourData = tours.packages[tourId];
            }

            if (tourData) {
                previewTour(tourData);
            }
        }
    });

    d3.select("#tour-prev").on("click", () => {
        if (app.currentStep > 0) { app.currentStep--; runTourStep(); }
    });
    
    d3.select("#tour-next").on("click", () => {
        if (app.currentTour && app.currentStep < app.currentTour.steps.length - 1) { app.currentStep++; runTourStep(); }
    });

    // AI Modal Controls
    const aiModalOverlay = d3.select("#ai-modal-overlay");
    d3.select("#ai-workflow-builder-btn").on("click", () => aiModalOverlay.classed("visible", true));
    d3.select("#ai-modal-close").on("click", () => aiModalOverlay.classed("visible", false));
    aiModalOverlay.on("click", function(e) { if (e.target === this) aiModalOverlay.classed("visible", false); });
    d3.select("#ai-workflow-generate").on("click", generateAiWorkflow);
}

// --- PERSISTENCE LOGIC ---

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
        } catch (e) {
            console.error("Failed to load saved tours:", e);
        }
    }
}

function saveCurrentTour() {
    if (!app.currentTour) return;

    let tourId = app.currentTour.id;
    if (!tourId) {
        tourId = `ai_tour_${Date.now()}`;
        app.currentTour.id = tourId;
    }

    if (!tours.ai) tours.ai = {};
    tours.ai[tourId] = app.currentTour;

    let saved = {};
    const existing = localStorage.getItem('procoreverse_saved_tours');
    if (existing) {
        try { saved = JSON.parse(existing); } catch(e) {}
    }
    saved[tourId] = app.currentTour;
    localStorage.setItem('procoreverse_saved_tours', JSON.stringify(saved));
    
    const aiGroup = d3.select("#ai-tours");
    if (aiGroup.select(`option[value="${tourId}"]`).empty()) {
        aiGroup.append("option").attr("value", tourId).text(app.currentTour.name);
    }
    d3.select("#tour-select").property("value", tourId);

    if(typeof showToast === 'function') {
        showToast("Workflow Saved!");
    } else {
        alert("Workflow Saved!");
    }

    d3.selectAll(".save-tour-btn").property("disabled", true).html('<i class="fas fa-check mr-2"></i>Saved');
}

// --- TOUR PREVIEW ---

function previewTour(tourData) {
    stopTour(false); 
    
    app.currentTour = tourData;
    app.currentStep = -1; 
    app.interactionState = 'tour_preview';
    
    const nodeIds = new Set(tourData.steps.map(s => s.nodeId));
    
    app.node.transition().duration(500)
        .style("opacity", d => nodeIds.has(d.id) ? 1 : 0.1);
        
    app.link.transition().duration(500)
        .style("stroke-opacity", l => {
            const sourceId = l.source.id || l.source;
            const targetId = l.target.id || l.target;
            return (nodeIds.has(sourceId) && nodeIds.has(targetId)) ? 1 : 0.05;
        })
        .attr("stroke", l => {
            const sourceId = l.source.id || l.source;
            const targetId = l.target.id || l.target;
            return (nodeIds.has(sourceId) && nodeIds.has(targetId)) ? "var(--procore-orange)" : "#a0a0a0";
        })
        .attr("marker-end", l => {
             const sourceId = l.source.id || l.source;
             const targetId = l.target.id || l.target;
             if (nodeIds.has(sourceId) && nodeIds.has(targetId)) return `url(#arrow-highlighted)`;
             const legend = legendData.find(leg => leg.type_id === l.type);
             return (legend && legend.visual_style.includes("one arrow")) ? `url(#arrow-${l.type})` : null;
        });

    let isSaved = false;
    if (tours.ai) {
        isSaved = Object.values(tours.ai).some(t => t.name === tourData.name);
    }

    const controls = d3.select("#tour-controls");
    controls.style("display", "block") 
            .html(`
                <div class="flex flex-col gap-3 pb-2">
                    <div class="w-full">
                        <div class="text-sm font-bold text-gray-800 leading-snug break-words">
                            ${tourData.name}
                        </div>
                        <div class="text-xs text-gray-500 mt-1">${tourData.steps.length} steps</div>
                    </div>
                    
                    <div class="flex items-center gap-2 w-full">
                        <button class="save-tour-btn flex-1 bg-white hover:bg-gray-50 text-indigo-600 border border-indigo-200 text-xs font-bold py-2 px-2 rounded shadow-sm transition flex items-center justify-center" title="Save to Browser">
                            <i class="fas fa-save mr-2"></i> Save
                        </button>
                        <button id="start-tour-btn" class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 px-2 rounded shadow-md transition flex items-center justify-center">
                            Start <i class="fas fa-play ml-2"></i>
                        </button>
                    </div>
                </div>
            `);

    d3.select("#start-tour-btn").on("click", startTour);
    d3.selectAll(".save-tour-btn").on("click", saveCurrentTour);
    
    if (isSaved) {
        d3.selectAll(".save-tour-btn").property("disabled", true).html('<i class="fas fa-check mr-2"></i>Saved');
    }
    
    resizeTourAccordion();
}

function startTour() {
    app.interactionState = 'tour';
    app.currentStep = 0;
    
    d3.select("#tour-controls")
      .style("display", "flex") 
      .html(`
        <button id="tour-prev" class="text-gray-500 hover:text-gray-700 px-3 py-1 disabled:opacity-30"><i class="fas fa-chevron-left"></i></button>
        <span id="tour-step-indicator" class="text-xs font-semibold text-gray-600">1 / ${app.currentTour.steps.length}</span>
        <button id="tour-next" class="text-gray-500 hover:text-gray-700 px-3 py-1 disabled:opacity-30"><i class="fas fa-chevron-right"></i></button>
        
        <button class="save-tour-btn hidden ml-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-1 px-3 rounded shadow-md transition items-center" title="Save this Tour">
            <i class="fas fa-save mr-2"></i> Save
        </button>
    `);
    
    d3.select("#tour-prev").on("click", () => {
        if (app.currentStep > 0) { app.currentStep--; runTourStep(); }
    });
    d3.select("#tour-next").on("click", () => {
        if (app.currentTour && app.currentStep < app.currentTour.steps.length - 1) { app.currentStep++; runTourStep(); }
    });
    
    let isSaved = false;
    if (tours.ai) isSaved = Object.values(tours.ai).some(t => t.name === app.currentTour.name);
    if (isSaved) {
         d3.selectAll(".save-tour-btn").property("disabled", true).html('<i class="fas fa-check mr-2"></i>Saved');
    } else {
         d3.selectAll(".save-tour-btn").on("click", saveCurrentTour);
    }

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
    
    if (isLastStep) {
        saveBtn.classed("hidden", false).classed("flex", true);
    } else {
        saveBtn.classed("hidden", true).classed("flex", false);
    }

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

        app.link.transition().duration(300)
            .style("stroke-opacity", l => {
                const sourceId = l.source.id || l.source;
                const targetId = l.target.id || l.target;
                
                const isActiveLink = prevNodeId && 
                    ((sourceId === prevNodeId && targetId === step.nodeId) || 
                     (sourceId === step.nodeId && targetId === prevNodeId));
                     
                return isActiveLink ? 1 : 0.02;
            })
            .attr("stroke", l => {
                const sourceId = l.source.id || l.source;
                const targetId = l.target.id || l.target;
                const isActiveLink = prevNodeId && 
                    ((sourceId === prevNodeId && targetId === step.nodeId) || 
                     (sourceId === step.nodeId && targetId === prevNodeId));
                return isActiveLink ? "var(--procore-orange)" : "#a0a0a0";
            })
            .attr("marker-end", l => {
                const sourceId = l.source.id || l.source;
                const targetId = l.target.id || l.target;
                const isActiveLink = prevNodeId && 
                    ((sourceId === prevNodeId && targetId === step.nodeId) || 
                     (sourceId === step.nodeId && targetId === prevNodeId));

                 if (isActiveLink) return `url(#arrow-highlighted)`;
                 return null; 
            });

        if(typeof showInfoPanel === 'function') showInfoPanel(nodeData); 
        
        const tourBox = d3.select("#tour-info-box");
        tourBox.style("display", "block");
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
        requestAnimationFrame(() => {
             content.style.maxHeight = (content.scrollHeight + 30) + "px";
        });
    }
}

// --- AI GENERATION ---

async function generateAiWorkflow() {
    const input = d3.select("#ai-workflow-input").property("value").trim();
    const status = d3.select("#ai-modal-status");
    const generateBtn = d3.select("#ai-workflow-generate");

    if (!input) {
        status.text("Please describe a workflow first.").classed("text-red-500", true);
        return;
    }

    status.text("Analyzing Procore platform...").classed("text-red-500", false).classed("text-indigo-600", true);
    generateBtn.property("disabled", true).classed("opacity-50", true);

    const validNodes = nodesData.map(n => n.id).join(", ");
    
    // --- UPDATED SYSTEM PROMPT WITH EXAMPLES ---
    const exampleWorkflow = JSON.stringify({
        name: "Change Management Flow",
        steps: [
            { nodeId: "Drawings", info: "A discrepancy is identified on the Drawings in the field." },
            { nodeId: "RFIs", info: "An RFI is created to request clarification from the Design Team." },
            { nodeId: "Change Events", info: "The RFI results in a cost, creating a Change Event." },
            { nodeId: "Change Orders", info: "A Prime Change Order is generated for Owner approval." },
            { nodeId: "Budget", info: "The approved Change Order updates the Budget." }
        ]
    });

    const systemPrompt = `You are a Procore Platform Architect. 
    Create a linear step-by-step workflow tour based on the user's request.
    
    CRITICAL RULES:
    1. You may ONLY use these exact Tool Names (Node IDs): [${validNodes}].
    2. Do not invent tools. If a step implies an external tool, use 'ERP Systems' or 'Documents'.
    3. Return ONLY valid JSON. No Markdown.
    
    GUIDANCE & STYLE:
    - Mimic the logical flow of this example: ${exampleWorkflow}
    - Ensure steps follow the flow of data (e.g. Field -> Financials -> Analytics).
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
            throw new Error("AI returned invalid tour structure.");
        }

    } catch (error) {
        console.error("AI Workflow generation failed:", error);
        status.text("Error generating tour. Please try again.").classed("text-red-500", true);
    } finally {
        generateBtn.property("disabled", false).classed("opacity-50", false);
    }
}
