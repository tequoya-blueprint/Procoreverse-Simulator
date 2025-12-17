// --- app-main.js ---
// VERSION: 910 (BRAND ALIGNED: NO GREEN/TEAL/LAVENDER)

console.log("App Main 910: Loading...");

const app = {
    simulation: null,
    svg: null,
    zoom: null,
    g: null,
    linkG: null,
    nodeG: null,
    node: null,
    link: null,
    width: 0,
    height: 0,
    categories: {}, 
    categoryFoci: {}, 
    baseNodeSize: 25,
    nodeSizeCompany: 28,
    nodeCollisionRadius: 60, 
    arrowRefX: 34, 
    defaultArrowColor: "#a0a0a0",
    interactionState: 'explore', 
    selectedNode: null,
    currentTour: null,
    currentStep: -1,
    apiKey: "AIzaSyCZx6YBE0qwuRd0Jl8HJQ580MUFbANtygA", // Note: Ensure API Key security in prod
    state: { showProcoreLedOnly: false, myStack: new Set(), isBuildingStack: false },
    customScope: new Set() 
};

// --- 1. CORE INTERACTION HANDLERS ---

// BACKGROUND CLICK HANDLER (Fixes Sticky Clicking)
function handleBackgroundClick(event) {
    // Only reset if we are in a simple selection state
    if (app.interactionState === 'selected') {
        if (typeof resetHighlight === 'function') resetHighlight(true);
    }
}

function nodeMouseOver(event, d) {
    if (['tour', 'tour_preview', 'selected', 'manual_building'].includes(app.interactionState)) return;
    if (typeof showTooltip === 'function') showTooltip(event, d);
    if (app.interactionState === 'explore' && typeof applyHighlight === 'function') applyHighlight(d);
}

function nodeMouseOut(event, d) {
    if (['tour', 'tour_preview', 'selected', 'manual_building'].includes(app.interactionState)) return;
    if (typeof hideTooltip === 'function') hideTooltip();
    if (app.interactionState === 'explore' && typeof resetHighlight === 'function') resetHighlight();
}

function nodeClicked(event, d) {
    event.stopPropagation(); // Keep this to prevent immediate background click trigger
    
    if (app.interactionState === 'manual_building') { 
        if (typeof handleManualNodeClick === 'function') handleManualNodeClick(d);
        if (typeof showInfoPanel === 'function') showInfoPanel(d);
        return; 
    }

    if (app.state && app.state.isBuildingStack) {
        if (typeof toggleStackItem === 'function') toggleStackItem(d);
        if (typeof highlightOwnedNodes === 'function') highlightOwnedNodes(); 
        return; 
    }
    
    const filters = (typeof getActiveFilters === 'function') ? getActiveFilters() : { procoreLedTools: new Set() };
    if (app.state.showProcoreLedOnly) {
        const isStandardLed = filters.procoreLedTools.has(d.id);
        if (!isStandardLed) { if (typeof toggleCustomScopeItem === 'function') toggleCustomScopeItem(d.id); return; }
    }
    
    if (app.selectedNode === d) { 
        if(typeof resetHighlight === 'function') resetHighlight(); 
    } else {
        app.interactionState = 'selected';
        app.selectedNode = d;
        if(typeof applyHighlight === 'function') applyHighlight(d);
        if (typeof showInfoPanel === 'function') showInfoPanel(d); 
        if(typeof centerViewOnNode === 'function') centerViewOnNode(d);
        d3.select('#graph-container').classed('selection-active', true);
    }
}

function nodeDoubleClicked(event, d) {
    event.stopPropagation();
}

// --- 2. SETUP & LAYOUT ---
function setupCategories() {
    // UPDATED BRAND PALETTE (STRICT)
    // Removed: Lavender, Teal, Green
    // Added: Lumber, Earth, Metal, Charcoal, Procore Blue
    const colorMap = { 
        "Preconstruction": "#CEC4A1",        // Lumber (Replaces Lavender)
        "Project Management": "#FF5200",     // Procore Orange
        "Financial Management": "#8D6E5B",   // Earth
        "Workforce Management": "#566578",   // Metal (Replaces Teal)
        "Quality & Safety": "#4A4A4A",       // Charcoal (Replaces Dark Teal)
        "Platform & Core": "#757575",        // Mid Grey
        "Construction Intelligence": "#111827", // Black/Darkest Grey
        "External Integrations": "#B0B0B0",  // Light Grey
        "Helix": "#607D8B",                  // Blue-Grey Metal
        "Project Execution": "#FF5200",      // Orange
        "Resource Management": "#566578",    // Metal
        "Emails": "#c94b4b",                 // Red (Utility)
        "Project Map": "#FF5200"             // Orange
    };

    app.categories = {}; 
    if (typeof nodesData !== 'undefined' && Array.isArray(nodesData)) {
        nodesData.forEach(node => { 
            if (!app.categories[node.group]) {
                const color = colorMap[node.group] || "#999";
                app.categories[node.group] = { color: color }; 
            }
        });
    }
}

function setHexFoci() {
    const container = document.getElementById('graph-container');
    if(!container) return;
    app.width = container.clientWidth;
    app.height = container.clientHeight;
    const cx = app.width / 2;
    const cy = app.height / 2;
    const radius = Math.min(app.width, app.height) * 0.38; 
    
    // Adjusted layout to prevent overlap with new colors
    const layoutMap = {
        "Platform & Core": { angle: 0, dist: 0 },
        "Preconstruction": { angle: -90, dist: 1 },       
        "Project Management": { angle: -30, dist: 1 },    
        "Financial Management": { angle: 30, dist: 1 },   
        "Construction Intelligence": { angle: 90, dist: 1 }, 
        "Resource Management": { angle: 150, dist: 1 },   
        "Quality & Safety": { angle: 210, dist: 1 },      
        "Helix": { angle: 90, dist: 0.6 }, 
        "Project Execution": { angle: -30, dist: 0.6 }, 
        "Workforce Management": { angle: 150, dist: 0.7 }, 
        "Project Map": { angle: -60, dist: 0.5 },
        "External Integrations": { angle: 30, dist: 1.3 }, 
        "Emails": { angle: 210, dist: 1.3 } 
    };
    Object.keys(app.categories).forEach(cat => {
        const config = layoutMap[cat] || { angle: 0, dist: 0 };
        const rad = (config.angle * Math.PI) / 180;
        app.categoryFoci[cat] = { x: cx + (radius * config.dist) * Math.cos(rad), y: cy + (radius * config.dist) * Math.sin(rad) };
    });
}

function forceCluster(alpha) {
    return function(d) {
        const focus = app.categoryFoci[d.group];
        if (!focus) return;
        const k = alpha * 0.12; 
        d.vx -= (d.x - focus.x) * k;
        d.vy -= (d.y - focus.y) * k;
    };
}

function initializeSimulation() {
    const container = document.getElementById('graph-container');
    if (!container) return; 
    
    // Add Background Click Listener
    container.addEventListener('click', handleBackgroundClick);

    app.width = container.clientWidth;
    app.height = container.clientHeight;
    app.svg = d3.select("#procore-graph");
    app.g = app.svg.append("g");
    app.linkG = app.g.append("g").attr("class", "links");
    app.nodeG = app.g.append("g").attr("class", "nodes");
    setupMarkers(); 
    app.zoom = d3.zoom().scaleExtent([0.1, 4]).on("zoom", (event) => {
        app.g.attr("transform", event.transform);
        app.node.selectAll("text").style("opacity", event.transform.k < 0.4 ? 0 : 1);
    });
    app.svg.call(app.zoom);
    app.simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(d => d.id).distance(100).strength(0.2))
        .force("charge", d3.forceManyBody().strength(-900))
        .force("collision", d3.forceCollide().radius(app.nodeCollisionRadius).strength(1))
        .force("center", d3.forceCenter(app.width / 2, app.height / 2))
        .on("tick", ticked);
    app.link = app.linkG.selectAll("path");
    app.node = app.nodeG.selectAll("g");
    setHexFoci();
}

function setupMarkers() {
    const defs = app.svg.select("defs");
    const arrowColors = { "creates": "var(--procore-orange)", "converts-to": "var(--procore-orange)", "pushes-data-to": "var(--procore-orange)", "pulls-data-from": app.defaultArrowColor, "attaches-links": app.defaultArrowColor, "feeds": "#4A4A4A", "syncs": "var(--procore-metal)" };
    if (typeof legendData !== 'undefined' && Array.isArray(legendData)) {
        legendData.forEach(type => {
            const color = arrowColors[type.type_id] || app.defaultArrowColor;
            if (type && type.type_id && (type.visual_style.includes("one arrow") || type.visual_style.includes("two arrows"))) {
                defs.append("marker").attr("id", `arrow-${type.type_id}`).attr("viewBox", "0 -5 10 10").attr("refX", app.arrowRefX).attr("markerWidth", 5).attr("markerHeight", 5).attr("orient", "auto").append("path").attr("d", "M0,-5L10,0L0,5").attr("fill", color);
                if (type.visual_style.includes("two arrows")) {
                    defs.append("marker").attr("id", `arrow-start-${type.type_id}`).attr("viewBox", "0 -5 10 10").attr("refX", -app.arrowRefX + 10).attr("markerWidth", 5).attr("markerHeight", 5).attr("orient", "auto").append("path").attr("d", "M10,-5L0,0L10,5").attr("fill", color);
                }
            }
        });
    }
    // Updated Highlight Color (Orange is brand safe for interactions)
    defs.append("marker").attr("id", "arrow-highlighted").attr("viewBox", "0 -5 10 10").attr("refX", app.arrowRefX).attr("markerWidth", 5).attr("markerHeight", 5).attr("orient", "auto").append("path").attr("d", "M0,-5L10,0L0,5").attr("fill", "var(--procore-orange)");
    defs.append("marker").attr("id", "arrow-candidate").attr("viewBox", "0 -5 10 10").attr("refX", app.arrowRefX).attr("markerWidth", 5).attr("markerHeight", 5).attr("orient", "auto").append("path").attr("d", "M0,-5L10,0L0,5").attr("fill", "#2563EB");
}

function ticked() {
    if (app.simulation && app.simulation.alpha() > 0.05) {
        app.simulation.nodes().forEach(forceCluster(app.simulation.alpha()));
    }
    if(app.link) app.link.attr("d", d => `M${d.source.x},${d.source.y}L${d.target.x},${d.target.y}`);
    if(app.node) app.node.attr("transform", d => `translate(${d.x || 0},${d.y || 0})`);
}

function updateGraph(isFilterChange = true) {
    if (isFilterChange && app.currentTour && typeof stopTour === 'function') stopTour();
    
    if (app.interactionState === 'manual_building') return;

    // 1. Retrieve Filters & Data
    const filters = (typeof getActiveFilters === 'function') ? getActiveFilters() : { categories: new Set(), persona: 'all', packageTools: null, connectionTypes: new Set(), showProcoreLed: false, procoreLedTools: new Set() };
    const nodes = (typeof nodesData !== 'undefined' && Array.isArray(nodesData)) ? nodesData : [];
    const allLinks = (typeof linksData !== 'undefined' && Array.isArray(linksData)) ? linksData : [];
    
    // 2. GAP ANALYSIS (No Green - Blue/Metal Logic)
    const gapAnalysis = (typeof getGapAnalysis === 'function') ? getGapAnalysis() : { owned: new Set(), gap: new Set(), matched: new Set(), outlier: new Set() };
    const isGapMode = gapAnalysis.owned.size > 0 && (filters.packageTools && filters.packageTools.size > 0);
    const isBuilderMode = app.state && app.state.isBuildingStack;

    // 3. Filter Nodes (Ghosting Logic - Keep structure visible)
    // We now filter differently: We want to KEEP all nodes in the data array so they don't jump around,
    // but we will zero-out their opacity if they are filtered out.
    // However, D3 Force requires nodes to be in the array to calculate positions.
    // Strategy: Filter normally for strict removal, but for "Package Views", use opacity.
    
    const filteredNodes = nodes.filter(d => {
        // Strict Category/Persona filters still remove nodes
        const inCategory = filters.categories.has(d.group);
        const inPersona = filters.persona === 'all' || (d.personas && d.personas.includes(filters.persona));
        return inCategory && inPersona;
    });

    const nodeIds = new Set(filteredNodes.map(n => n.id));
    const filteredLinks = allLinks.filter(d => nodeIds.has(d.source.id || d.source) && nodeIds.has(d.target.id || d.target) && filters.connectionTypes.has(d.type)).map(d => ({...d})); 

    // 4. D3 Join & Update
    app.node = app.node.data(filteredNodes, d => d.id).join(
        enter => {
            const nodeGroup = enter.append("g").attr("class", "node")
                .on("mouseenter", nodeMouseOver)
                .on("mouseleave", nodeMouseOut)
                .on("click", nodeClicked)
                .on("dblclick", nodeDoubleClicked)
                .call(drag(app.simulation)); 

            nodeGroup.append("path").attr("d", d => generateHexagonPath(d.level === 'company' ? app.nodeSizeCompany : app.baseNodeSize)).attr("fill", d => app.categories[d.group].color).style("color", d => app.categories[d.group].color);
            nodeGroup.append("circle").attr("class", "procore-led-ring").attr("r", app.baseNodeSize + 6).attr("fill", "none").attr("stroke", "#F36C23").attr("stroke-width", 3).attr("stroke-opacity", 0); 
            nodeGroup.append("text").text(d => d.id).attr("dy", d => (d.level === 'company' ? app.nodeSizeCompany : app.baseNodeSize) + 18);
            
            nodeGroup.each(function(d) {
                const g = d3.select(this);
                let badgeOffset = 14;
                if (d.id === "Drawings" || d.id === "RFIs" || (d.features && d.features.includes("connect"))) { addBadge(g, "\uf0c1", "#2563EB", badgeOffset, -18, "Procore Connect", d); badgeOffset += 12; }
                if (d.features && d.features.includes("mobile")) { addBadge(g, "\uf3cd", "#4A4A4A", 14, 10, "Available on Mobile", d); }
                if (d.features && d.features.includes("assist")) { addEmojiBadge(g, "✦", -18, -14, "Enhanced with Assist AI", d); }
            });
            nodeGroup.style("opacity", 0).transition().duration(500).style("opacity", 1);
            return nodeGroup;
        },
        update => {
            // PRIORITY 1: STACK BUILDER (Owned = Blue/Metal, Not Green)
            if (isBuilderMode) {
                update.transition().duration(500)
                    .style("opacity", d => app.state.myStack.has(d.id) ? 1.0 : 0.4) 
                    .style("filter", d => app.state.myStack.has(d.id) ? "drop-shadow(0 0 6px rgba(0, 112, 243, 0.6))" : "none"); // Blue Shadow
                
                update.select("path").transition().duration(500)
                    .style("stroke", d => app.state.myStack.has(d.id) ? "#0070f3" : "#ffffff") // Procore Blue
                    .style("stroke-width", d => app.state.myStack.has(d.id) ? 3 : 2);
                    
                update.select(".procore-led-ring").attr("stroke-opacity", 0);
                return update;
            }

            // PRIORITY 2: GAP ANALYSIS (Ghosting for Package Filtering)
            update.classed("pulsing-gap", d => isGapMode && gapAnalysis.gap.has(d.id));

            update.transition().duration(500)
            .style("opacity", d => {
                // If a package is selected, check if this node is in it.
                // If NOT in package (and not an outlier owned item), GHOST IT (Opacity 0.1) instead of removing.
                if (filters.packageTools && filters.packageTools.size > 0) {
                     const isRelevant = filters.packageTools.has(d.id) || (gapAnalysis.outlier && gapAnalysis.outlier.has(d.id));
                     if (!isRelevant) return 0.1; // Ghost non-package items
                }

                if (isGapMode) {
                    if (gapAnalysis.matched.has(d.id)) return 1.0; 
                    if (gapAnalysis.gap.has(d.id)) return 1.0;     
                    if (gapAnalysis.outlier.has(d.id)) return 1.0; 
                    return 0.1; 
                }
                
                // Procore Led Logic
                if (filters.showProcoreLed) {
                    if (app.customScope && app.customScope.has(d.id)) return 1.0;
                    if (filters.procoreLedTools.has(d.id)) return 1.0;
                    return 0.2; // Dim non-Procore led
                }
                return 1.0;
            })
            .style("filter", d => {
                if (isGapMode) {
                    // Matched = Blue Glow (No Green)
                    if (gapAnalysis.matched.has(d.id)) return "drop-shadow(0 0 6px rgba(0, 112, 243, 0.6))"; 
                    // GAP = Orange Glow
                    if (gapAnalysis.gap.has(d.id)) return "drop-shadow(0 0 12px rgba(243, 108, 35, 1.0))"; 
                    // Outlier = Metal Glow
                    if (gapAnalysis.outlier.has(d.id)) return "drop-shadow(0 0 4px rgba(86, 101, 120, 0.6))"; 
                }
                return null;
            });

            // STROKE COLORING (NO GREEN)
            update.select("path")
                .transition().duration(500)
                .style("stroke", d => {
                    if (isGapMode) {
                        if (gapAnalysis.matched.has(d.id)) return "#0070f3"; // Blue
                        if (gapAnalysis.gap.has(d.id)) return "#F36C23";   // Orange
                        if (gapAnalysis.outlier.has(d.id)) return "#566578"; // Metal
                    }
                    return "#ffffff"; 
                });
            
            update.select(".procore-led-ring").transition().duration(300)
                .attr("stroke", d => (app.customScope && app.customScope.has(d.id)) ? "#2563EB" : "#F36C23")
                .attr("stroke-dasharray", d => (app.customScope && app.customScope.has(d.id)) ? "4,2" : "none")
                .attr("stroke-opacity", d => {
                    // Hide rings if node is ghosted
                    if (filters.packageTools && filters.packageTools.size > 0 && !filters.packageTools.has(d.id) && !gapAnalysis.outlier.has(d.id)) return 0;
                    
                    if (isGapMode) return 0; 
                    return (filters.showProcoreLed && (filters.procoreLedTools.has(d.id) || app.customScope.has(d.id))) ? 0.8 : 0;
                });
            return update;
        },
        exit => exit.transition().duration(300).style("opacity", 0).remove()
    );

    // LINKS UPDATE (Ghosting links attached to ghosted nodes)
    app.link = app.link.data(filteredLinks, d => `${d.source.id || d.source}-${d.target.id || d.target}-${d.type}`).join("path")
        .attr("class", d => `link ${d.type}`).attr("stroke-width", 2)
        .style("pointer-events", "none") 
        .attr("stroke", d => {
            if (typeof legendData === 'undefined') return app.defaultArrowColor;
            const legend = legendData.find(l => l.type_id === d.type);
            if (!legend) return app.defaultArrowColor;
            if (legend.type_id === "feeds") return "#4A4A4A";
            if (legend.visual_style.includes("solid") && !legend.visual_style.includes("gray")) return "var(--procore-orange)";
            if (legend.type_id === "syncs") return "var(--procore-metal)";
            return app.defaultArrowColor;
        })
        .attr("stroke-dasharray", d => {
            if (typeof legendData === 'undefined') return "none";
            const legend = legendData.find(l => l.type_id === d.type);
            if (!legend) return "none";
            if (d.type === "creates") return "4,3";
            if (d.type === "converts-to") return "8,4";
            if (d.type === "pulls-data-from") return "2,4";
            if (d.type === "attaches-links") return "1,3";
            return "none";
        })
        .attr("marker-end", d => {
            if (typeof legendData === 'undefined') return null;
            const legend = legendData.find(l => l.type_id === d.type);
            if (!legend) return null;
            if (legend.visual_style.includes("one arrow") || legend.visual_style.includes("two arrows")) return `url(#arrow-${d.type})`;
            return null;
        })
        .attr("marker-start", d => {
            if (typeof legendData === 'undefined') return null;
            const legend = legendData.find(l => l.type_id === d.type);
            if (!legend) return null;
            if (legend.visual_style.includes("two arrows")) return `url(#arrow-start-${d.type})`;
            return null;
        });

    app.link.transition().duration(500).style("opacity", d => {
        // Ghost links if endpoints are ghosted
        if (filters.packageTools && filters.packageTools.size > 0) {
            const s = d.source.id || d.source;
            const t = d.target.id || d.target;
            // If either endpoint is NOT in the package/outlier list, ghost the link
            const sVisible = filters.packageTools.has(s) || (gapAnalysis.outlier && gapAnalysis.outlier.has(s));
            const tVisible = filters.packageTools.has(t) || (gapAnalysis.outlier && gapAnalysis.outlier.has(t));
            if (!sVisible || !tVisible) return 0.02;
        }

        if (isBuilderMode) return 0.15;
        if (isGapMode) return 0.5; 
        
        if (filters.showProcoreLed) {
            const s = d.source.id || d.source;
            const t = d.target.id || d.target;
            const activeS = filters.procoreLedTools.has(s) || app.customScope.has(s);
            const activeT = filters.procoreLedTools.has(t) || app.customScope.has(t);
            return (activeS && activeT) ? 0.6 : 0.05;
        }
        return 0.6;
    });

    app.nodeG.raise(); 

    app.simulation.nodes(filteredNodes);
    app.simulation.force("link").links(filteredLinks);
    app.simulation.alpha(1).restart();
    if(typeof updateTourDropdown === 'function') updateTourDropdown(filters.packageTools); 
}

function addBadge(group, iconCode, color, x, y, tooltipText, d) {
    const badge = group.append("g").attr("transform", `translate(${x}, ${y})`).style("cursor", "help").style("pointer-events", "all");
    badge.append("rect").attr("x", -6).attr("y", -6).attr("width", 12).attr("height", 12).attr("fill", "transparent");
    badge.append("text").attr("class", "fas").text(iconCode).attr("text-anchor", "middle").attr("dy", 3).attr("fill", color).attr("font-size", "10px").style("font-family", "'Font Awesome 6 Free'").style("filter", "drop-shadow(0px 1px 2px rgba(0,0,0,0.3))").style("pointer-events", "none");
    badge.on("mouseover", function(e) { e.stopPropagation(); d3.select("#tooltip").html(`<div class="font-bold text-xs" style="color: ${color};">${tooltipText}</div>`).style("left", (e.pageX+10)+"px").style("top", (e.pageY-10)+"px").classed("visible", true); })
         .on("mouseout", function(e) { e.stopPropagation(); d3.select("#tooltip").classed("visible", false); });
    badge.on("click", function(e) { nodeClicked(e, d); });
}

function addEmojiBadge(group, emoji, x, y, tooltipText, d) {
    const badge = group.append("g").attr("transform", `translate(${x}, ${y})`).style("cursor", "help").style("pointer-events", "all");
    badge.append("rect").attr("x", -6).attr("y", -6).attr("width", 12).attr("height", 12).attr("fill", "transparent");
    badge.append("text").text(emoji).attr("text-anchor", "middle").attr("dy", 3).attr("font-size", "12px").style("font-weight", "bold").style("pointer-events", "none");
    badge.on("mouseover", function(e) { e.stopPropagation(); d3.select("#tooltip").html(`<div class="font-bold text-xs" style="color: #4A4A4A;">${tooltipText}</div>`).style("left", (e.pageX+10)+"px").style("top", (e.pageY-10)+"px").classed("visible", true); })
         .on("mouseout", function(e) { e.stopPropagation(); d3.select("#tooltip").classed("visible", false); });
    badge.on("click", function(e) { nodeClicked(e, d); });
}

window.addEventListener('resize', () => { 
    app.width = document.getElementById('graph-container').clientWidth; 
    app.height = document.getElementById('graph-container').clientHeight;
    setHexFoci(); 
    if(app.simulation) app.simulation.alpha(0.5).restart();
});

document.addEventListener('DOMContentLoaded', () => {
    setupCategories();
    initializeSimulation(); 
    if(typeof initializeControls === 'function') initializeControls(); 
    if(typeof initializeInfoPanel === 'function') initializeInfoPanel(); 
    if(typeof initializeTourControls === 'function') initializeTourControls(); 
    if(typeof populateLegend === 'function') populateLegend(); 
    updateGraph(false); 
    setTimeout(() => { document.getElementById('loading-overlay')?.classList.add('hidden'); }, 1500);
    const helpButton = d3.select("#help-button");
    if (helpButton.node() && !localStorage.getItem('procoreverseV2_Visited')) {
        helpButton.classed('initial-pulse', true);
        localStorage.setItem('procoreverseV2_Visited', 'true');
    }
});
