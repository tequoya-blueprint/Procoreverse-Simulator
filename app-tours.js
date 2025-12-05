// --- app-tours.js ---
// VERSION 13: Fixed AI Integration (JSON Sanitization + Node Awareness)

// Flatten tours for easy access

function initializeTourControls() {
    // Populate dropdowns
    const platformGroup = d3.select("#platform-tours");
    const packageGroup = d3.select("#package-tours");
    
    // 1. SAFETY CHECK: Only try to load Platform tours if they exist
    if (tours.platform) {
        Object.entries(tours.platform).forEach(([id, tour]) => {
            platformGroup.append("option").attr("value", id).text(tour.name);
        });
    }

    // 2. SAFETY CHECK: Only try to load Package tours if they exist
    // (This was causing your crash because tours.packages was undefined)
    if (tours.packages) {
        Object.entries(tours.packages).forEach(([id, tour]) => {
            packageGroup.append("option").attr("value", id).text(tour.name);
        });
    }

    // Event Listeners
    d3.select("#tour-select").on("change", function() {
        const tourId = this.value;
        if (tourId === "none") {
            stopTour();
        } else {
            // Check both standard and AI tours
            // Ensure we look in flatTours (Global) or fallback to tours.ai
            const tourData = (typeof flatTours !== 'undefined' ? flatTours[tourId] : null) || (tours.ai ? tours.ai[tourId] : null);
            
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
    
    // Close modal on outside click
    aiModalOverlay.on("click", function(e) { 
        if (e.target === this) aiModalOverlay.classed("visible", false); 
    });
    
    d3.select("#ai-workflow-generate").on("click", generateAiWorkflow);
}
function updateTourDropdown(visiblePackageTools) {
    const packageGroup = d3.select("#package-tours");
    if (!visiblePackageTools) {
        packageGroup.style("display", "none");
        return;
    }
    
    // Logic to show tours relevant to the selected package could go here
    // For now, we simply unhide the group if a package is selected
    packageGroup.style("display", "block");
}

// --- AI GENERATION LOGIC ---

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

    // 1. Gather Valid Node IDs to prevent hallucination
    const validNodes = nodesData.map(n => n.id).join(", ");

    // 2. Construct the Prompt
    const systemPrompt = `You are a Procore Platform Architect. 
    Create a linear step-by-step workflow tour based on the user's request.
    
    CRITICAL RULES:
    1. You may ONLY use these exact Tool Names (Node IDs): [${validNodes}].
    2. Do not invent tools. If a step implies an external tool, use 'ERP Systems' or 'Documents'.
    3. Return ONLY valid JSON. No Markdown formatting. No backticks.
    
    JSON Structure:
    {
      "name": "Short Descriptive Title",
      "steps": [
        { "nodeId": "Exact Tool Name", "info": "Description of action taken here." }
      ]
    }`;

    const userPrompt = `User Request: "${input}"`;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${app.apiKey}`;
    const payload = {
        contents: [{ parts: [{ text: userPrompt }] }],
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

        // 3. CLEAN THE JSON (Remove Markdown fences if present)
        rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();

        const newTour = JSON.parse(rawText);

        if (newTour && newTour.steps && newTour.steps.length > 0) {
            // Success! Register the tour.
            const tourId = `ai_tour_${Date.now()}`;
            newTour.name = `✨ ${newTour.name}`;
            
            // Add to AI tours object and flat list
            if (!tours.ai) tours.ai = {};
            tours.ai[tourId] = newTour; 
            flatTours[tourId] = newTour; 

            // Update UI
            d3.select("#ai-tours").append("option").attr("value", tourId).text(newTour.name);
            d3.select("#tour-select").property("value", tourId);
            
            // Close modal and Start
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

// --- TOUR EXECUTION LOGIC ---

function previewTour(tourData) {
    stopTour(); // Clear any existing state
    app.currentTour = tourData;
    app.currentStep = -1; // Ready to start
    app.interactionState = 'tour_preview';
    
    // Highlight all nodes involved in the tour
    const nodeIds = new Set(tourData.steps.map(s => s.nodeId));
    
    app.node.transition().duration(500)
        .style("opacity", d => nodeIds.has(d.id) ? 1 : 0.1);
        
    app.link.transition().duration(500)
        .style("stroke-opacity", 0.05);

    // Show Tour Control Panel
    const controls = d3.select("#tour-controls");
    controls.style("display", "flex")
            .html(`
                <div class="text-sm font-semibold text-gray-700">
                    ${tourData.name} <span class="font-normal text-gray-500">(${tourData.steps.length} steps)</span>
                </div>
                <button id="start-tour-btn" class="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 px-4 rounded shadow-md transition">
                    Start Tour <i class="fas fa-play ml-1"></i>
                </button>
            `);

    d3.select("#start-tour-btn").on("click", startTour);
    
    // Ensure Accordion is expanded
    resizeTourAccordion();
}

function startTour() {
    app.interactionState = 'tour';
    app.currentStep = 0;
    
    // Update controls to Next/Prev
    const controls = d3.select("#tour-controls");
    controls.html(`
        <button id="tour-prev" class="text-gray-500 hover:text-gray-700 px-3 py-1 disabled:opacity-30"><i class="fas fa-chevron-left"></i></button>
        <span id="tour-step-indicator" class="text-xs font-semibold text-gray-600">1 / ${app.currentTour.steps.length}</span>
        <button id="tour-next" class="text-gray-500 hover:text-gray-700 px-3 py-1 disabled:opacity-30"><i class="fas fa-chevron-right"></i></button>
    `);
    
    // Re-bind listeners for the new buttons
    d3.select("#tour-prev").on("click", () => {
        if (app.currentStep > 0) { app.currentStep--; runTourStep(); }
    });
    d3.select("#tour-next").on("click", () => {
        if (app.currentTour && app.currentStep < app.currentTour.steps.length - 1) { app.currentStep++; runTourStep(); }
    });

    runTourStep();
}

function runTourStep() {
    const step = app.currentTour.steps[app.currentStep];
    const nodeData = app.simulation.nodes().find(n => n.id === step.nodeId);
    
    // Update Controls Text
    d3.select("#tour-step-indicator").text(`${app.currentStep + 1} / ${app.currentTour.steps.length}`);
    d3.select("#tour-prev").property("disabled", app.currentStep === 0);
    d3.select("#tour-next").property("disabled", app.currentStep === app.currentTour.steps.length - 1);

    if (nodeData) {
        // Trigger the selection logic from app-d3-helpers
        // We simulate a click but manually handle the Info Panel content
        
        // 1. Center View
        if(typeof centerViewOnNode === 'function') centerViewOnNode(nodeData);

        // 2. Highlight Logic (Manual override to keep non-active steps dim)
        app.node.transition().duration(300).style("opacity", d => d.id === step.nodeId ? 1 : 0.1);
        
        // 3. Show Custom Tour Info in Panel
        if(typeof showInfoPanel === 'function') showInfoPanel(nodeData); // Load standard data first
        
        // 4. Override specific elements for the Tour context
        const tourBox = d3.select("#tour-info-box");
        tourBox.style("display", "block");
        d3.select("#tour-info-text").text(step.info);
        
        // Scroll top
        d3.select("#info-panel").node().scrollTop = 0;
    }
}

function stopTour() {
    app.currentTour = null;
    app.currentStep = -1;
    app.interactionState = 'explore';
    
    d3.select("#tour-controls").style("display", "none");
    d3.select("#tour-info-box").style("display", "none");
    d3.select("#tour-select").property("value", "none");
    
    if(typeof resetHighlight === 'function') resetHighlight();
    if(typeof resetZoom === 'function') resetZoom();
}

function resizeTourAccordion() {
    const content = document.querySelector('#tour-container').closest('.accordion-content');
    if (content && content.parentElement.classList.contains('active')) {
        content.style.maxHeight = content.scrollHeight + "px";
    }
}
