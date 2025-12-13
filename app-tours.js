// --- app-tours.js ---
// VERSION: 160 (FIXED: SPOTLIGHT MODE & DIRECTIONAL FLOW)

function initializeTourControls() {
    const platformGroup = d3.select("#platform-tours");
    const packageGroup = d3.select("#package-tours");
    const aiGroup = d3.select("#ai-tours"); 
    
    // Load Standard Tours
    if (typeof tours !== 'undefined' && tours.platform) {
        Object.entries(tours.platform).forEach(([id, tour]) => platformGroup.append("option").attr("value", id).text(tour.name));
    }
    if (typeof tours !== 'undefined' && tours.packages) {
        Object.entries(tours.packages).forEach(([id, tour]) => packageGroup.append("option").attr("value", id).text(tour.name));
    }

    // Load AI/Saved Tours
    if (typeof tours !== 'undefined' && tours.ai) {
        Object.entries(tours.ai).forEach(([id, tour]) => {
            if (aiGroup.select(`option[value="${id}"]`).empty()) {
                aiGroup.append("option").attr("value", id).text("✨ " + tour.name);
            }
        });
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

    // AI Modal Triggers
    const aiModalOverlay = d3.select("#ai-modal-overlay");
    d3.select("#ai-workflow-builder-btn").on("click", () => aiModalOverlay.classed("visible", true));
    d3.select("#ai-modal-close").on("click", () => aiModalOverlay.classed("visible", false));
    aiModalOverlay.on("click", function(e) { if (e.target === this) aiModalOverlay.classed("visible", false); });
    d3.select("#ai-workflow-generate").on("click", generateAiWorkflow);

    // Manual Builder Trigger
    const container = d3.select("#tour-container");
    if (container.select("#manual-workflow-builder-btn").empty()) {
        container.append("button")
            .attr("id", "manual-workflow-builder-btn")
            .attr("class", "w-full mt-2 btn-indigo bg-gray-600 hover:bg-gray-700") 
            .style("display", "none") 
            .html('<i class="fas fa-hand-pointer mr-2"></i> Build Custom Process')
            .on("click", startManualBuilder);
    }
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
                if(aiGroup.select(`option[value="${id}"]`).empty()) {
                    aiGroup.append("option").attr("value", id).text(tour.name);
                }
            });
        } catch (e) { console.error(e); }
    }
}

function saveCurrentTour() {
    if (!app.currentTour) return;
    let tourId = app.currentTour.id;
    if (!tourId || tourId.startsWith('custom_')) {
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
    
    if(typeof showToast === 'function') showToast("Process Saved!");
    d3.selectAll(".save-tour-btn").property("disabled", true).html('<i class="fas fa-check mr-2"></i>Saved');
}

// --- MANUAL BUILDER LOGIC ---
let manualBuilderSteps = [];

function startManualBuilder() {
    stopTour(false); 
    app.interactionState = 'manual_building';
    manualBuilderSteps = [];
    
    // Force a "Clean Slate" update first
    if (typeof updateGraph === 'function') updateGraph(false);

    // Initial Visual State: 
    // 1. Show Nodes clearly
    // 2. Hide ALL lines initially (reduce clutter until a node is picked)
    setTimeout(() => {
        app.node.transition().duration(500)
            .style("opacity", 1)
            .style("filter", null);
            
        app.link.transition().duration(500)
            .style("stroke-opacity", 0.05) // Faded background
            .attr("stroke", "#a0a0a0")
            .attr("stroke-width", 1);
    }, 100);

    const controls = d3.select("#tour-controls");
    controls.style("display", "block").html(`
        <div class="bg-gray-800 text-white p-3 rounded-lg shadow-inner mb-2">
            <div class="flex justify-between items-center mb-2">
                <span class="font-bold text-xs uppercase tracking-wide text-gray-400">Recording Mode</span>
                <span id="manual-step-count" class="bg-indigo-600 px-2 py-0.5 rounded text-xs font-bold">0 Steps</span>
            </div>
            <p class="text-sm italic text-gray-300">Select a tool to begin. Possible connections will light up.</p>
        </div>
        <div class="flex gap-2">
            <button id="cancel-manual-btn" class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-bold py-2 rounded">Cancel</button>
            <button id="finish-manual-btn" class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2 rounded disabled:opacity-50" disabled>Finish & Preview</button>
        </div>
    `);

    d3.select("#cancel-manual-btn").on("click", () => stopTour(true));
    d3.select("#finish-manual-btn").on("click", finishManualBuilder);
    
    if(typeof resizeTourAccordion === 'function') resizeTourAccordion();
}

function handleManualNodeClick(d) {
    const existingIndex = manualBuilderSteps.findIndex(s => s.nodeId === d.id);
    
    if (existingIndex !== -1) {
        // Remove Step
        manualBuilderSteps.splice(existingIndex, 1);
        if(typeof showToast === 'function') showToast(`Removed step: ${d.id}`);
    } else {
        // Add Step
        // Validation: Is this connected to the previous step? (Optional, but good for UX)
        // For now, we allow free selection, but we highlight valid ones.
        
        const desc = d.description || `Standard workflow step involving the ${d.id} tool.`;
        manualBuilderSteps.push({ nodeId: d.id, info: desc });
        
        // Pulse effect
        d3.select(event.target).transition().duration(100).attr("r", 30).transition().duration(100).attr("r", 25);
    }
    updateManualBuilderVisuals();
}

function updateManualBuilderVisuals() {
    d3.select("#manual-step-count").text(`${manualBuilderSteps.length} Steps`);
    d3.select("#finish-manual-btn").property("disabled", manualBuilderSteps.length === 0);

    const activeIds = new Set(manualBuilderSteps.map(s => s.nodeId));
    
    // --- DETERMINE CANDIDATES (POSSIBLE NEXT STEPS) ---
    const candidateNodes = new Set();
    const candidateLinks = new Set();
    
    if (manualBuilderSteps.length > 0) {
        const lastNodeId = manualBuilderSteps[manualBuilderSteps.length - 1].nodeId;
        
        // Loop through all links to find valid connections from LastNode
        app.simulation.force("link").links().forEach(l => {
            const s = l.source.id || l.source;
            const t = l.target.id || l.target;
            
            // LOGIC: Data flows FROM source TO target.
            // Valid Next Step: Source == LastNode
            if (s === lastNodeId && !activeIds.has(t)) {
                candidateNodes.add(t);
                candidateLinks.add(`${s}-${t}`);
            }
            
            // LOGIC: 'Syncs' are bi-directional.
            if (l.type === 'syncs' && t === lastNodeId && !activeIds.has(s)) {
                candidateNodes.add(s);
                candidateLinks.add(`${s}-${t}`); // Add both keys to be safe
                candidateLinks.add(`${t}-${s}`);
            }
        });
    }

    // 1. UPDATE NODES
    app.node.transition().duration(200)
        .style("opacity", n => {
            if (activeIds.has(n.id)) return 1.0; // Selected
            if (candidateNodes.has(n.id)) return 0.9; // Possible Next Step
            return 0.2; // Irrelevant
        })
        .style("filter", n => {
            if (activeIds.has(n.id)) return "drop-shadow(0 0 6px #F36C23)"; // Orange Glow (Path)
            if (candidateNodes.has(n.id)) return "drop-shadow(0 0 5px #2563EB)"; // Blue Glow (Candidate)
            return "grayscale(100%)"; // Grey out others
        });

    // 2. UPDATE LINKS (The "Spotlight")
    
    // Identify links involved in the current path
    const pathLinks = new Set();
    for (let i = 0; i < manualBuilderSteps.length - 1; i++) {
        const u = manualBuilderSteps[i].nodeId;
        const v = manualBuilderSteps[i+1].nodeId;
        pathLinks.add(`${u}-${v}`);
        pathLinks.add(`${v}-${u}`);
    }

    app.link.transition().duration(200)
        .style("stroke-opacity", l => {
            const s = l.source.id || l.source;
            const t = l.target.id || l.target;
            const key = `${s}-${t}`; const rKey = `${t}-${s}`;
            
            if (pathLinks.has(key) || pathLinks.has(rKey)) return 1.0; // Existing Path = Visible
            if (candidateLinks.has(key) || candidateLinks.has(rKey)) return 0.8; // Candidate Path = Visible
            return 0.02; // Everything else = Hidden
        })
        .attr("stroke", l => {
            const s = l.source.id || l.source;
            const t = l.target.id || l.target;
            const key = `${s}-${t}`; const rKey = `${t}-${s}`;
            
            if (pathLinks.has(key) || pathLinks.has(rKey)) return "var(--procore-orange)";
            if (candidateLinks.has(key) || candidateLinks.has(rKey)) return "#2563EB"; // Blue for next steps
            return "#a0a0a0";
        })
        .attr("stroke-width", l => {
            const s = l.source.id || l.source;
            const t = l.target.id || l.target;
            const key = `${s}-${t}`; const rKey = `${t}-${s}`;
            
            if (pathLinks.has(key) || pathLinks.has(rKey)) return 3;
            if (candidateLinks.has(key) || candidateLinks.has(rKey)) return 2;
            return 1;
        })
        .attr("marker-end", l => {
             const s = l.source.id || l.source;
             const t = l.target.id || l.target;
             const key = `${s}-${t}`; const rKey = `${t}-${s}`;
             
             if (pathLinks.has(key) || pathLinks.has(rKey)) return `url(#arrow-highlighted)`;
             // Show markers for candidates too so user knows direction
             if (candidateLinks.has(key) || candidateLinks.has(rKey)) {
                 const legend = legendData.find(leg => leg.type_id === l.type);
                 return (legend && legend.visual_style.includes("one arrow")) ? `url(#arrow-${l.type})` : null;
             }
             return null;
        });
}

function finishManualBuilder() {
    const name = prompt("Enter a name for this Custom Process:", "New SOP Process");
    if (!name) return;
    const newTour = { name: `📝 ${name}`, steps: manualBuilderSteps, id: `custom_${Date.now()}` };
    app.currentTour = newTour;
    saveCurrentTour(); 
    
    // Force immediate preview
    setTimeout(() => previewTour(newTour), 100);
}

// --- PREVIEW & RUN LOGIC ---
function previewTour(tourData) {
    stopTour(false); 
    app.currentTour = tourData;
    app.currentStep = -1; 
    app.interactionState = 'tour_preview';
    
    const nodeIds = new Set(tourData.steps.map(s => s.nodeId));
    const tourLinkKeys = new Set();
    for(let i=0; i<tourData.steps.length-1; i++) {
        const u = tourData.steps[i].nodeId;
        const v = tourData.steps[i+1].nodeId;
        tourLinkKeys.add(`${u}-${v}`); tourLinkKeys.add(`${v}-${u}`);
    }

    app.node.transition().duration(500).style("opacity", d => nodeIds.has(d.id) ? 1 : 0.1);
    app.link.transition().duration(500)
        .style("stroke-opacity", l => {
            const s = l.source.id || l.source;
            const t = l.target.id || l.target;
            const key = `${s}-${t}`; const rKey = `${t}-${s}`;
            return (tourLinkKeys.has(key) || tourLinkKeys.has(rKey)) ? 1 : 0.05;
        })
        .attr("stroke", l => {
            const s = l.source.id || l.source;
            const t = l.target.id || l.target;
            const key = `${s}-${t}`; const rKey = `${t}-${s}`;
            return (tourLinkKeys.has(key) || tourLinkKeys.has(rKey)) ? "var(--procore-orange)" : "#a0a0a0";
        })
        .attr("marker-end", l => {
             const s = l.source.id || l.source;
             const t = l.target.id || l.target;
             const key = `${s}-${t}`; const rKey = `${t}-${s}`;
             if (tourLinkKeys.has(key) || tourLinkKeys.has(rKey)) return `url(#arrow-highlighted)`;
             return null;
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
            <button id="export-sop-btn" class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold py-2 rounded border border-gray-300 transition flex items-center justify-center mt-2"><i class="fas fa-file-alt mr-2"></i> Generate SOP Document</button>
        </div>
    `);

    d3.select("#start-tour-btn").on("click", startTour);
    d3.selectAll(".save-tour-btn").on("click", saveCurrentTour);
    d3.select("#export-sop-btn").on("click", generateSOP); 
    
    if (isSaved) d3.selectAll(".save-tour-btn").property("disabled", true).html('<i class="fas fa-check mr-2"></i>Saved');
    resizeTourAccordion();
}

// --- SOP GENERATOR V2 ---
function generateSOP() {
    if (!app.currentTour) return;
    
    const clientName = prompt("Enter Client/Customer Name:", "Valued Client") || "Valued Client";
    const logoInput = prompt("Enter Client Logo URL (leave blank for default):", "");
    const logoHtml = (logoInput && logoInput.trim() !== "") 
        ? `<img src="${logoInput}" style="max-height: 50px; margin-bottom: 10px;">` 
        : `<div class="logo" style="font-size: 24px; font-weight: 800; color: #F36C23; letter-spacing: -0.5px;">PROCORE</div>`;
    
    const tour = app.currentTour;
    const date = new Date().toLocaleDateString();
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) { alert("Please allow popups to download the SOP."); return; }

    let stepsHtml = "";
    tour.steps.forEach((step, index) => {
        const nodeData = app.simulation.nodes().find(n => n.id === step.nodeId);
        const supportLink = (nodeData && nodeData.supportDocUrl) 
            ? `<div class="step-link" style="margin-left: 34px; font-size: 12px;"><a href="${nodeData.supportDocUrl}" target="_blank" style="color: #2563EB; text-decoration: none;">View Standard Procedure <i class="fas fa-external-link-alt"></i></a></div>` 
            : "";

        stepsHtml += `
            <div class="step" style="margin-bottom: 20px; padding: 15px; background: #f9f9f9; border-left: 4px solid #F36C23; border-radius: 4px;">
                <div class="step-header" style="display: flex; align-items: center; margin-bottom: 8px;">
                    <span class="step-num" style="background: #F36C23; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; margin-right: 10px;">${index + 1}</span>
                    <span class="step-tool" style="font-weight: 700; font-size: 16px; color: #333;">${step.nodeId}</span>
                </div>
                <div class="step-desc" style="font-size: 14px; color: #555; margin-left: 34px; margin-bottom: 8px;">${step.info}</div>
                ${supportLink}
            </div>
        `;
    });

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>SOP: ${tour.name}</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
        <style>
            body { font-family: 'Inter', sans-serif; padding: 40px; color: #333; line-height: 1.6; max-width: 800px; margin: 0 auto; }
            .header { border-bottom: 3px solid #F36C23; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
            .logo { font-size: 24px; font-weight: 800; color: #F36C23; letter-spacing: -0.5px; }
            .doc-title { font-size: 28px; font-weight: 700; margin-top: 5px; color: #111; }
            .client-name { font-size: 14px; color: #666; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; }
            .section { margin-bottom: 30px; }
            .section-title { font-size: 14px; font-weight: 700; text-transform: uppercase; color: #555; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-bottom: 15px; }
            .footer { margin-top: 50px; font-size: 10px; color: #999; text-align: center; border-top: 1px solid #eee; padding-top: 10px; }
        </style>
    </head>
    <body>
        <div class="header">
            <div>
                ${logoHtml}
                <div class="doc-title">${tour.name.replace(/^[✨📝]\s*/, '')}</div>
            </div>
            <div style="text-align: right;">
                <div class="client-name">Prepared For: ${clientName}</div>
                <div style="font-size: 12px; color: #888;">Generated ${date}</div>
            </div>
        </div>
        
        <div class="section">
            <div class="section-title">1. Purpose & Scope</div>
            <p>This Standard Operating Procedure (SOP) outlines the required workflow for the <strong>${tour.name.replace(/^[✨📝]\s*/, '')}</strong> process using the Procore Platform. It is intended to standardize data entry and ensure compliance across the <strong>${clientName}</strong> project portfolio.</p>
        </div>

        <div class="section">
            <div class="section-title">2. Procedure Steps</div>
            ${stepsHtml}
        </div>

        <div class="section">
            <div class="section-title">3. Approval</div>
            <div style="display: flex; justify-content: space-between; margin-top: 40px;">
                <div style="border-top: 1px solid #ccc; width: 45%; padding-top: 5px; font-size: 12px; color: #888;">Process Owner Signature</div>
                <div style="border-top: 1px solid #ccc; width: 45%; padding-top: 5px; font-size: 12px; color: #888;">Date</div>
            </div>
        </div>

        <div class="footer">
            Generated by Procoreverse Simulator. Confidential and Proprietary.
        </div>
        <script>window.print();</script>
    </body>
    </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
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
    saveBtn.classed("hidden", !isLastStep).classed("flex", isLastStep);

    if (nodeData) {
        if(typeof centerViewOnNode === 'function') centerViewOnNode(nodeData);
        
        const activeNodeId = step.nodeId;
        const pastNodeIds = new Set(app.currentTour.steps.slice(0, app.currentStep).map(s => s.nodeId));
        const allTourNodeIds = new Set(app.currentTour.steps.map(s => s.nodeId));
        
        app.node.transition().duration(400).style("opacity", d => {
            if (d.id === activeNodeId) return 1;     
            if (pastNodeIds.has(d.id)) return 0.4;   
            if (allTourNodeIds.has(d.id)) return 0.1;
            return 0.02;                             
        });
        
        let prevNodeId = app.currentStep > 0 ? app.currentTour.steps[app.currentStep - 1].nodeId : null;
        
        app.link.transition().duration(400)
            .style("stroke-opacity", l => {
                const s = l.source.id || l.source;
                const t = l.target.id || l.target;
                const isActiveLink = prevNodeId && ((s === prevNodeId && t === activeNodeId) || (s === activeNodeId && t === prevNodeId));
                if (isActiveLink) return 1;
                const isHistoryLink = pastNodeIds.has(s) && pastNodeIds.has(t); 
                if (isHistoryLink) return 0.2;
                return 0.01;
            })
            .attr("stroke", l => {
                const s = l.source.id || l.source;
                const t = l.target.id || l.target;
                const isActiveLink = prevNodeId && ((s === prevNodeId && t === activeNodeId) || (s === activeNodeId && t === prevNodeId));
                return isActiveLink ? "var(--procore-orange)" : "#a0a0a0";
            })
            .style("stroke-width", l => {
                const s = l.source.id || l.source;
                const t = l.target.id || l.target;
                const isActiveLink = prevNodeId && ((s === prevNodeId && t === activeNodeId) || (s === activeNodeId && t === prevNodeId));
                return isActiveLink ? 3 : 2;
            })
            .attr("marker-end", l => {
                const s = l.source.id || l.source;
                const t = l.target.id || l.target;
                const isActiveLink = prevNodeId && ((s === prevNodeId && t === activeNodeId) || (s === activeNodeId && t === prevNodeId));
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
    const systemPrompt = `You are a Procore Platform Architect. Create a linear step-by-step business process map based on the user's request. CRITICAL RULES: 1. You may ONLY use these exact Tool Names (Node IDs): [${validNodes}]. 2. Do not invent tools. 3. Return ONLY valid JSON. JSON Structure: { "name": "Short Title", "steps": [ { "nodeId": "Exact Tool Name", "info": "Description" } ] }`;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${app.apiKey}`;

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
