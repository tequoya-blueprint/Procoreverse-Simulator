// --- app-panel.js ---
// VERSION: 550 (FIXED: RESTORED MISSING FUNCTIONS & TEMPLATES)

function initializeInfoPanel() {
    const closeBtn = d3.select("#info-close");
    if (!closeBtn.empty()) {
        closeBtn.on("click", () => {
            if (typeof resetHighlight === 'function') {
                resetHighlight(true);
            } else {
                hideInfoPanel();
            }
        });
    }
}

function hideInfoPanel() {
    d3.select("#info-panel").classed("visible", false);
}

function showInfoPanel(d) {
    const infoPanel = d3.select("#info-panel");
    
    // 1. Reveal Panel & Reset Scroll
    infoPanel.classed("visible", true);
    infoPanel.node().scrollTop = 0; 

    // 2. Set Header (Title & Color)
    const color = (app.categories && app.categories[d.group]) ? app.categories[d.group].color : '#999';
    infoPanel.select("#info-title").html(
        `<span class="legend-color" style="background-color:${color}; margin-top: 5px;"></span>${d.id}`
    );
    infoPanel.select("#info-category").text(d.group);

    // 3. Set Level Badge
    const levelHtml = d.level 
        ? `<span class="text-xs font-semibold inline-block py-1.5 px-3 uppercase rounded-full text-gray-700 bg-gray-100 border border-gray-200">
            ${d.level} Level
           </span>` 
        : "";
    infoPanel.select("#info-level-container").html(levelHtml);

    // 4. Set Description
    infoPanel.select("#info-description").text(d.description || "No description available.");

    // 5. Render Support Links (Handle multiple URLs split by pipe |)
    const linkContainer = infoPanel.select("#info-link-container").html("");
    if (d.supportDocUrl && d.supportDocUrl.trim() !== "") {
        const urls = d.supportDocUrl.split("|");
        urls.forEach((url, index) => {
            const label = urls.length > 1 ? `Procore Support (${index + 1})` : "Procore Support";
            linkContainer.append("a")
                .attr("href", url.trim())
                .attr("target", "_blank")
                .attr("class", "text-blue-600 hover:text-blue-800 text-base font-medium block transition mb-1")
                .html(`<i class="fas fa-life-ring mr-3"></i> ${label}`);
        });
    }
    
    // 6. Render Case Study Link
    const caseStudyContainer = infoPanel.select("#case-study-link-container").html("");
    if (d.caseStudyUrl && d.caseStudyUrl.trim() !== "") { 
        caseStudyContainer.append("a")
            .attr("href", d.caseStudyUrl)
            .attr("target", "_blank")
            .attr("class", "text-orange-600 hover:text-orange-800 text-base font-medium block transition")
            .html(`<i class="fas fa-book-open mr-3"></i> Case Study`);
    }
    
    // 7. Render "What's New" Link
    const whatsNewContainer = infoPanel.select("#whats-new-link-container").html("");
    if (d.whatsNewUrl && d.whatsNewUrl.trim() !== "") { 
        whatsNewContainer.append("a")
            .attr("href", d.whatsNewUrl)
            .attr("target", "_blank")
            .attr("class", "text-indigo-600 hover:text-indigo-800 text-base font-medium block transition")
            .html(`<i class="fas fa-bullhorn mr-3"></i> What's New`);
    }

    // 8. Populate Connections
    populateConnectionList(d);
}

function populateConnectionList(d) {
    if (!app.simulation) return;

    // Filter links connected to this node
    const connections = app.simulation.force("link").links().filter(l => 
        (l.source.id === d.id || l.target.id === d.id) || 
        (l.source === d || l.target === d)
    );
    
    const connectionList = d3.select("#info-connections").html("");

    if (connections.length > 0) {
        connections.forEach(l => {
            // Determine "Other" Node
            const isSource = (l.source.id === d.id || l.source === d);
            const otherNode = isSource ? l.target : l.source;
            const otherId = otherNode.id || otherNode; // Handle object vs string
            
            // Determine Direction & Icon
            let iconHtml = "";
            let directionClass = "text-gray-400";
            
            if (l.type === 'syncs') {
                iconHtml = '<i class="fas fa-exchange-alt mx-2" title="Two-way Sync"></i>';
                directionClass = "text-procore-metal";
            } else if (isSource) {
                // Outgoing
                iconHtml = '<i class="fas fa-arrow-right mx-2" title="Outgoing"></i>';
            } else {
                // Incoming
                iconHtml = '<i class="fas fa-arrow-left mx-2" title="Incoming"></i>';
            }

            // Lookup Friendly Type Label
            let typeLabel = l.type;
            if (typeof legendData !== 'undefined') {
                const connType = legendData.find(t => t.type_id === l.type);
                if (connType) typeLabel = connType.label;
            }

            // Create List Item
            const li = connectionList.append("li")
                .attr("class", "py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition cursor-pointer px-2 -mx-2 rounded")
                .on("mouseenter", function() { 
                    if(typeof highlightConnection === 'function') highlightConnection(this, d); 
                }) 
                .on("mouseleave", () => { 
                    // Only reset if we are not in a locked mode
                    if(app.interactionState === 'selected' && typeof resetHighlight === 'function') {
                        // Keep the selected node highlighted, just remove the specific connection hover?
                        // Actually, standard behavior is usually sufficient.
                    }
                })
                .on("click", function() {
                    // Navigate to the connected node
                    if (typeof nodeClicked === 'function') {
                        nodeClicked(new Event('click'), otherNode);
                    }
                });

            li.html(`
                <div class="flex justify-between items-center mb-1">
                    <div class="flex items-center font-semibold text-gray-700">
                        ${!isSource && l.type !== 'syncs' ? iconHtml : ''}
                        <span>${otherId}</span>
                        ${isSource || l.type === 'syncs' ? iconHtml : ''}
                    </div>
                    <span class="text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        ${typeLabel}
                    </span>
                </div>
                <div class="text-xs text-gray-500 pl-1 border-l-2 border-gray-200 ml-1">
                    ${l.dataFlow || "Data connection"}
                </div>
            `);
        });
    } else {
        connectionList.append("li")
            .attr("class", "text-sm text-gray-400 italic py-2")
            .text("No direct connections found.");
    }
}
