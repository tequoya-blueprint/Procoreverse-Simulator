// --- app-tours.js ---
// VERSION 2: Simplifies tour dropdown logic.

/**
 * Initializes event listeners for tour controls and the AI modal.
 */
function initializeTourControls() {
    // Tour selection
    d3.select("#tour-select").on("change", function() {
        const tourId = this.value;
        if (tourId === "none") {
            stopTour();
        } else {
            // Find the tour data from the flattened map
            const tourData = flatTours[tourId];
            if (tourData) {
                startTour(tourData);
            }
        }
    });

    // Tour step controls
    d3.select("#tour-prev").on("click", () => {
        if (app.currentStep > 0) {
            app.currentStep--;
            runTourStep();
        }
    });
    d3.select("#tour-next").on("click", () => {
        if (app.currentTour && app.currentStep < app.currentTour.steps.length - 1) {
            app.currentStep++;
            runTourStep();
        }
    });

    // AI Modal controls
    const aiModalOverlay = d3.select("#ai-modal-overlay");
    d3.select("#ai-workflow-builder-btn").on("click", () => aiModalOverlay.classed("visible", true));
    d3.select("#ai-modal-close").on("click", () => aiModalOverlay.classed("visible", false));
    aiModalOverlay.on("click", function(e) {
        if (e.target === this) aiModalOverlay.classed("visible", false);
    });
    d3.select("#ai-workflow-generate").on("click", generateAiWorkflow);
}

/**
 * Updates the tour dropdown to show/hide platform vs. package tours.
 */
function updateTourDropdown(packageTools) {
    const tourSelect = d3.select("#tour-select");
    const platformTours = d3.select("#platform-tours").html("");
    const packageTours = d3.select("#package-tours").html("");
    const aiTours = d3.select("#ai-tours").html("");

    let platformTourCount = 0;
    let packageTourCount = 0;
    let aiTourCount = 0;

    // Populate Platform Tours
    Object.entries(tours.platform).forEach(([tourId, tourData]) => {
        platformTours.append("option").attr("value", tourId).text(tourData.name);
        platformTourCount++;
    });

    // Populate Package Tours (only if a package is selected)
    if (packageTools) {
        Object.entries(tours.package).forEach(([tourId, tourData]) => {
            // Check if all nodes for this tour are in the selected package
            const isTourVisible = tourData.steps.every(step => packageTools.has(step.nodeId));
            if (isTourVisible) {
                packageTours.append("option").attr("value", tourId).text(tourData.name);
                packageTourCount++;
            }
        });
    }
    
    // Populate AI Tours
    Object.entries(tours.ai).forEach(([tourId, tourData]) => {
        aiTours.append("option").attr("value", tourId).text(tourData.name);
        aiTourCount++;
    });

    // Show/hide the package tour optgroup
    d3.select("#package-tours").style("display", packageTourCount > 0 ? "" : "none");
    d3.select("#ai-tours").style("display", aiTourCount > 0 ? "" : "none");


    // If the currently selected tour is no longer valid, stop it
    const selectedTourValue = tourSelect.property("value");
    if (selectedTourValue !== 'none' && !flatTours[selectedTourValue]) {
        stopTour();
    }
}

/**
 * Starts a selected workflow tour.
 * @param {Object} tourData - The data object for the tour.
 */
function startTour(tourData) {
    app.interactionState = 'tour_starting'; // Intermediate state
    
    // Reset filters to ensure tour nodes are visible
    resetView(); 
    app.interactionState = 'tour_starting'; // override resetView's 'explore'
    
    // Ensure all required tools for the tour are visible
    const tourNodes = new Set(tourData.steps.map(s => s.nodeId));
    let filtersChanged = false;

    // Check categories
    const tourCategories = new Set(tourData.steps.map(s => nodesData.find(n => n.id === s.nodeId).group));
    d3.selectAll("#category-filters input").each(function() {
        if (tourCategories.has(this.value) && !this.checked) {
            this.checked = true;
            filtersChanged = true;
        }
    });

    // If filters had to change, update the graph
    if (filtersChanged) {
        updateGraph(false);
    }
    
    app.currentTour = tourData;
    app.currentStep = 0;
    app.interactionState = 'tour';
    
    d3.select("#tour-controls").style("display", "flex");
    d3.select('#graph-container').classed('selection-active', true);

    // Run the first step
    setTimeout(runTourStep, filtersChanged ? 600 : 100);
}

/**
 * Stops the currently active tour.
 */
function stopTour() {
    if (!app.currentTour) return;
    
    app.interactionState = 'explore';
    app.currentTour = null;
    app.currentStep = -1;

    d3.select("#tour-controls").style("display", "none");
    d3.select("#tour-select").property('value', 'none');
    d3.select("#tour-info-box").style("display", "none");
    
    resetHighlight(); // From app-d3-helpers.js
}

/**
 * Executes the logic for the current tour step.
 */
function runTourStep() {
    if (!app.currentTour) return;
    
    const step = app.currentTour.steps[app.currentStep];
    const nodeData = app.simulation.nodes().find(n => n.id === step.nodeId);
    if (!nodeData) {
        console.warn(`Tour step node "${step.nodeId}" not found in simulation.`);
        return;
    }

    const tourNodeIds = new Set(app.currentTour.steps.map(s => s.nodeId));
    const opacity = 0.05; // Strong fade

    // Highlight only tour nodes
    app.node.transition().duration(500).style("opacity", n => tourNodeIds.has(n.id) ? 1 : opacity);
    app.node.classed("selected", n => n.id === nodeData.id);

    // Fade all links, then highlight the one for this step
    app.link.classed("pulsing", false).classed("highlighted", false)
        .transition().duration(500)
        .style("stroke-opacity", opacity)
        .attr("marker-end", null);

    if (app.currentStep > 0) {
        const prevStep = app.currentTour.steps[app.currentStep - 1];
        
        // Find the link connecting previous and current step
        const stepLink = app.link.filter(l =>
            (l.source.id === prevStep.nodeId && l.target.id === step.nodeId) ||
            (l.source.id === step.nodeId && l.target.id === prevStep.nodeId)
        );

        if (!stepLink.empty()) {
            stepLink.classed("pulsing", true)
                .transition().duration(500)
                .style("stroke-opacity", 1)
                .attr("marker-end", l => `url(#arrow-highlighted)`);
        }
    }

    // Update UI
    showInfoPanel(nodeData); // From app-panel.js
    d3.select("#tour-info-box").style("display", "block");
    d3.select("#tour-info-text").text(step.info);
    centerViewOnNode(nodeData); // From app-d3-helpers.js
    
    // Update tour controls
    d3.select("#tour-step").text(`${app.currentStep + 1} / ${app.currentTour.steps.length}`);
    d3.select("#tour-prev").property("disabled", app.currentStep === 0);
    d3.select("#tour-next").property("disabled", app.currentStep === app.currentTour.steps.length - 1);
}

/**
 * Handles the AI Workflow Generation logic.
 */
async function generateAiWorkflow() {
    const button = d3.select("#ai-workflow-generate");
    const status = d3.select("#ai-modal-status");
    const userInput = d3.select("#ai-workflow-input").property("value");

    if (!userInput.trim()) {
        status.text("Please describe a workflow.");
        return;
    }

    button.property("disabled", true).html(`<i class="fas fa-spinner fa-spin mr-2"></i>Generating...`);
    status.html(`Analyzing... <span class="inline-block align-middle h-4 w-1 bg-gray-600 ml-1 border-r-2 border-gray-600 blinking-cursor"></span>`);
    
    const availableTools = nodesData.map(n => n.id).join(", ");
    const systemPrompt = `You are a Procore Platform expert. Generate a guided workflow tour based on the user's request. The tour must be a sequence of steps using ONLY the Procore tools listed. Output MUST be a valid JSON object adhering to the provided schema. The 'info' for each step must be a concise, one-sentence explanation of the action.`;
    const userQuery = `Generate a workflow for: "${userInput}". Available tools: ${availableTools}.`;
    
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${app.apiKey}`;

    const payload = {
        contents: [{ parts: [{ text: userQuery }] }],
        system_instruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
            responseMimeType: "application/json",
            responseSchema: {
                type: "OBJECT",
                properties: {
                    name: { type: "STRING" },
                    steps: {
                        type: "ARRAY",
                        items: {
                            type: "OBJECT",
                            properties: {
                                nodeId: { type: "STRING" },
                                info: { type: "STRING" }
                            },
                            required: ["nodeId", "info"]
                        }
                    }
                },
                required: ["name", "steps"]
            }
        }
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

        const result = await response.json();
        const newTour = JSON.parse(result.candidates[0].content.parts[0].text);

        if (newTour && newTour.steps && newTour.steps.length > 0) {
            // Validate that all tools exist
            const isValidTour = newTour.steps.every(step => nodesData.some(n => n.id === step.nodeId));
            
            if (!isValidTour) {
                status.text("The AI used non-existent tools. Please rephrase.");
            } else {
                // Success: Add and start the new tour
                const tourId = `ai_tour_${Date.now()}`;
                newTour.name = `✨ ${newTour.name}`;
                
                tours.ai[tourId] = newTour; // Add to AI category
                flatTours[tourId] = newTour; // Add to flattened map

                d3.select("#ai-tours").append("option")
                    .attr("value", tourId)
                    .text(newTour.name);
                
                d3.select("#tour-select").property("value", tourId);
                startTour(newTour);
                
                d3.select("#ai-modal-overlay").classed("visible", false);
                d3.select("#ai-workflow-input").property("value", "");
                status.text("");
            }
        } else {
            throw new Error("AI returned invalid tour structure.");
        }
    } catch (error) {
        console.error("AI Workflow generation failed:", error);
        status.text("Sorry, I couldn't create a tour for that. Please try again.");
    }

    button.property("disabled", false).text("Generate Tour");
}
