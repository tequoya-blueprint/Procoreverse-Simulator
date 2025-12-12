// --- app-main.js ---
// --- app-main.js ---
// VERSION: 110 (LEGEND ALIGNMENT FIX)

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
    apiKey: "AIzaSyCZx6YBE0qwuRd0Jl8HJQ580MUFbANtygA",
    state: { showProcoreLedOnly: false },
    customScope: new Set() 
};

function setupCategories() {
    const rootStyles = getComputedStyle(document.documentElement);
    const procoreColors = { 
        orange: rootStyles.getPropertyValue('--procore-orange').trim() || "#F36C23", 
        lumber: rootStyles.getPropertyValue('--procore-lumber').trim() || "#D1C4E9", 
        earth: rootStyles.getPropertyValue('--procore-earth').trim() || "#8D6E63", 
        metal: rootStyles.getPropertyValue('--procore-metal').trim() || "#607D8B"
    };
    const colorMap = { "Preconstruction": procoreColors.lumber, "Project Management": procoreColors.orange, "Financial Management": procoreColors.earth, "Workforce Management": "#3a8d8c", "Quality & Safety": "#5B8D7E", "Platform & Core": "#757575", "Construction Intelligence": "#4A4A4A", "External Integrations": "#B0B0B0", "Helix": procoreColors.metal, "Project Execution": procoreColors.orange, "Resource Management": procoreColors.metal, "Emails": "#c94b4b", "Project Map": procoreColors.orange };
    app.categories = {}; 
    if (typeof nodesData !== 'undefined' && Array.isArray(nodesData)) {
        nodesData.forEach(node => { if (!app.categories[node.group]) app.categories[node.group] = { color: colorMap[node.group] || "#" + Math.floor(Math.random()*16777215).toString(16) }; });
    }
}

function nodeClicked(event, d) {
    event.stopPropagation();
    
    // 1. STACK BUILDER INTERCEPT (NEW)
    // If in builder mode, clicks simply toggle "Owned" status
    if (app.state && app.state.isBuildingStack) {
        if (typeof toggleStackItem === 'function') toggleStackItem(d);
        return; 
    }

    // 2. MANUAL BUILDING (Existing)
    if (app.interactionState === 'manual_building') { 
        if (typeof handleManualNodeClick === 'function') handleManualNodeClick(d); 
        return; 
    }
    
    // 3. STANDARD LOGIC (Existing)
    const filters = (typeof getActiveFilters === 'function') ? getActiveFilters() : { procoreLedTools: new Set() };
    
    // Handle "Procore Led" scope toggling
    if (app.state.showProcoreLedOnly) {
        const isStandardLed = filters.procoreLedTools.has(d.id);
        if (!isStandardLed) { if (typeof toggleCustomScopeItem === 'function') toggleCustomScopeItem(d.id); return; }
    }
    
    // Standard Selection & Info Panel
    if (app.selectedNode === d) { resetHighlight(); } 
    else {
        app.interactionState = 'selected';
        app.selectedNode = d;
        applyHighlight(d);
        if (typeof showInfoPanel === 'function') showInfoPanel(d); 
        centerViewOnNode(d);
        d3.select('#graph-container').classed('selection-active', true);
    }
}

// --- SEMANTIC LAYOUT: HEXAGONAL CLUSTERS ---
function setHexFoci() {
    const container = document.getElementById('graph-container');
    if(!container) return;
    app.width = container.clientWidth;
    app.height = container.clientHeight;
    
    const cx = app.width / 2;
    const cy = app.height / 2;
    const radius = Math.min(app.width, app.height) * 0.38; 

    // Arrangement: Platform Center, others in a Hexagon Ring
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
        app.categoryFoci[cat] = {
            x: cx + (radius * config.dist) * Math.cos(rad),
            y: cy + (radius * config.dist) * Math.sin(rad)
        };
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

    // PHYSICS CONFIGURATION
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
            if (type && type.type_id && type.visual_style.includes("one arrow")) {
                defs.append("marker").attr("id", `arrow-${type.type_id}`).attr("viewBox", "0 -5 10 10").attr("refX", app.arrowRefX).attr("markerWidth", 5).attr("markerHeight", 5).attr("orient", "auto").append("path").attr("d", "M0,-5L10,0L0,5").attr("fill", color);
            }
        });
    }
    defs.append("marker").attr("id", "arrow-highlighted").attr("viewBox", "0 -5 10 10").attr("refX", app.arrowRefX).attr("markerWidth", 5).attr("markerHeight", 5).attr("orient", "auto").append("path").attr("d", "M0,-5L10,0L0,5").attr("fill", "var(--procore-orange)");
}

function populateLegend() {
    const legendContainer = d3.select("#connection-legend");
    legendContainer.html(""); 
    const legendSVGs = {
        "creates": "<svg width='24' height='10'><line x1='0' y1='5' x2='20' y2='5' stroke='var(--procore-orange)' stroke-width='2' stroke-dasharray='4,3'></line><path d='M17,2 L23,5 L17,8' stroke='var(--procore-orange)' stroke-width='2' fill='none'></path></svg>",
        "converts-to": "<svg width='24' height='10'><line x1='0' y1='5' x2='20' y2='5' stroke='var(--procore-orange)' stroke-width='2' stroke-dasharray='8,4'></line><path d='M17,2 L23,5 L17,8' stroke='var(--procore-orange)' stroke-width='2' fill='none'></path></svg>",
        "syncs": "<svg width='24' height='10'><path d='M3,2 L9,5 L3,8' stroke='var(--procore-metal)' stroke-width='2' fill='none'></path><line x1='6' y1='5' x2='18' y2='5' stroke='var(--procore-metal)' stroke-width='2'></line><path d='M21,2 L15,5 L21,8' stroke='var(--procore-metal)' stroke-width='2' fill='none'></path></svg>",
        "pushes-data-to": "<svg width='24' height='10'><line x1='0' y1='5' x2='20' y2='5' stroke='var(--procore-orange)' stroke-width='2'></line><path d='M17,2 L23,5 L17,8' stroke='var(--procore-orange)' stroke-width='2' fill='none'></path></svg>",
        "pulls-data-from": "<svg width='24' height='10'><line x1='0' y1='5' x2='20' y2='5' stroke='#a0a0a0' stroke-width='2' stroke-dasharray='2,4'></line><path d='M17,2 L23,5 L17,8' stroke='#a0a0a0' stroke-width='2' fill='none'></path></svg>",
        "attaches-links": "<svg width='24' height='10'><line x1='0' y1='5' x2='20' y2='5' stroke='#a0a0a0' stroke-width='2' stroke-dasharray='1,3'></line><path d='M17,2 L23,5 L17,8' stroke='#a0a0a0' stroke-width='2' fill='none'></path></svg>",
        "feeds": "<svg width='24' height='10'><line x1='0' y1='5' x2='20' y2='5' stroke='#4A4A4A' stroke-width='2'></line><path d='M17,2 L23,5 L17,8' stroke='#4A4A4A' stroke-width='2' fill='none'></path></svg>"
    };
    if (typeof legendData !== 'undefined' && Array.isArray(legendData)) {
        legendData.forEach(type => {
            const svg = legendSVGs[type.type_id] || "";
            // UPDATED CLASS: added 'items-center' and 'mb-3'
            const item = legendContainer.append("label").attr("class", "flex items-center mb-3 cursor-pointer");
            // UPDATED CLASS: added 'mr-3' to input for spacing
            item.append("input").attr("type", "checkbox").attr("checked", true).attr("value", type.type_id).attr("class", "form-checkbox h-4 w-4 text-orange-600 legend-checkbox mr-3").on("change", () => updateGraph(true));
            item.append("div").attr("class", "flex-shrink-0 w-8").html(svg);
            item.append("div").attr("class", "ml-2").html(`<span class="font-semibold">${type.label}</span><span class="block text-xs text-gray-500">${type.description}</span>`);
        });
    }
}

function ticked() {
    if (app.simulation && app.simulation.alpha() > 0.05) {
        app.simulation.nodes().forEach(forceCluster(app.simulation.alpha()));
    }
    if(app.link) app.link.attr("d", d => `M${d.source.x},${d.source.y}L${d.target.x},${d.target.y}`);
    if(app.node) app.node.attr("transform", d => `translate(${d.x || 0},${d.y || 0})`);
}

function updateGraph(isFilterChange = true) {
    if (isFilterChange && app.currentTour) stopTour();
    
    // 1. Retrieve Filters & Data
    const filters = (typeof getActiveFilters === 'function') ? getActiveFilters() : { categories: new Set(), persona: 'all', packageTools: null, connectionTypes: new Set(), showProcoreLed: false, procoreLedTools: new Set() };
    const nodes = (typeof nodesData !== 'undefined' && Array.isArray(nodesData)) ? nodesData : [];
    const allLinks = (typeof linksData !== 'undefined' && Array.isArray(linksData)) ? linksData : [];
    
    // 2. GAP ANALYSIS PRE-CALCULATION (NEW)
    // Check if we are in "Gap Mode" (Stack exists + Package Selected)
    const gapAnalysis = (typeof getGapAnalysis === 'function') ? getGapAnalysis() : { owned: new Set(), gap: new Set() };
    // We are in Gap Mode if the user has defined a stack AND selected a package
    const isGapMode = gapAnalysis.owned.size > 0 && (filters.packageTools && filters.packageTools.size > 0);

    // 3. Filter Nodes (Ghost Mode Logic: We keep ALL nodes in data, but change visibility)
    // If NOT in Gap Mode, we filter normally. If IN Gap Mode, we might want to keep more nodes visible for context.
    const filteredNodes = nodes.filter(d => {
        const inCategory = filters.categories.has(d.group);
        const inPersona = filters.persona === 'all' || (d.personas && d.personas.includes(filters.persona));
        
        // STANDARD PACKAGE FILTERING
        // If a package is selected, we usually hide non-package tools.
        // However, if in Gap Mode, we want to see Owned tools even if they aren't in the new package (Legacy tools).
        const inPackage = !filters.packageTools || filters.packageTools.has(d.id) || (isGapMode && gapAnalysis.owned.has(d.id));
        
        return inCategory && inPersona && inPackage;
    });

    const nodeIds = new Set(filteredNodes.map(n => n.id));
    const filteredLinks = allLinks.filter(d => nodeIds.has(d.source.id || d.source) && nodeIds.has(d.target.id || d.target) && filters.connectionTypes.has(d.type)).map(d => ({...d})); 

    // 4. D3 Join & Update
    app.node = app.node.data(filteredNodes, d => d.id).join(
        enter => {
            const nodeGroup = enter.append("g").attr("class", "node").call(drag(app.simulation))
                .on("mouseenter", nodeMouseOver).on("mouseleave", nodeMouseOut).on("click", nodeClicked).on("dblclick", nodeDoubleClicked);
            nodeGroup.append("path").attr("d", d => generateHexagonPath(d.level === 'company' ? app.nodeSizeCompany : app.baseNodeSize)).attr("fill", d => app.categories[d.group].color).style("color", d => app.categories[d.group].color);
            nodeGroup.append("circle").attr("class", "procore-led-ring").attr("r", app.baseNodeSize + 6).attr("fill", "none").attr("stroke", "#F36C23").attr("stroke-width", 3).attr("stroke-opacity", 0); 
            nodeGroup.append("text").text(d => d.id).attr("dy", d => (d.level === 'company' ? app.nodeSizeCompany : app.baseNodeSize) + 18);
            
            // Badges
            nodeGroup.each(function(d) {
                const g = d3.select(this);
                let badgeOffset = 14;
                if (d.id === "Drawings" || d.id === "RFIs" || (d.features && d.features.includes("connect"))) { addBadge(g, "\uf0c1", "#2563EB", badgeOffset, -18, "Procore Connect"); badgeOffset += 12; }
                if (d.features && d.features.includes("mobile")) { addBadge(g, "\uf3cd", "#4A4A4A", 14, 10, "Available on Mobile"); }
                if (d.features && d.features.includes("assist")) { addEmojiBadge(g, "✦", -18, -14, "Enhanced with Assist AI"); }
            });
            nodeGroup.style("opacity", 0).transition().duration(500).style("opacity", 1);
            return nodeGroup;
        },
        update => {
            // TRANSITION START
            update.transition().duration(500)
            
            // --- GHOST MODE: OPACITY ---
            .style("opacity", d => {
                if (isGapMode) {
                    // 1. Owned Tools = Full Opacity (Value Protected)
                    if (gapAnalysis.owned.has(d.id)) return 1.0; 
                    // 2. Gap Tools (In Package, Not Owned) = Full Opacity (The Upsell)
                    if (gapAnalysis.gap.has(d.id)) return 1.0;   
                    // 3. Ghost Tools (In Package but filtered out by something else? OR Legacy?) 
                    // Actually, standard filtering handles "In Package". 
                    // So anything remaining is likely relevant. 
                    return 0.15; // Fallback for edge cases
                }
                
                // Fallback to Procore-Led Dimming (Existing Logic)
                if (filters.showProcoreLed) {
                    if (app.customScope && app.customScope.has(d.id)) return 1.0;
                    if (filters.procoreLedTools.has(d.id)) return 1.0;
                    return 0.1;
                }
                return 1.0;
            })

            // --- GHOST MODE: GLOW & SHADOW ---
            .style("filter", d => {
                if (isGapMode) {
                    // GREEN GLOW for Owned
                    if (gapAnalysis.owned.has(d.id)) return "drop-shadow(0 0 3px rgba(34, 197, 94, 0.5))"; 
                    // ORANGE PULSE for Gap (Upsell)
                    if (gapAnalysis.gap.has(d.id)) return "drop-shadow(0 0 8px rgba(243, 108, 35, 0.9))"; 
                }
                // Procore Led Glows
                if (filters.showProcoreLed) {
                    if (filters.procoreLedTools.has(d.id)) return "drop-shadow(0 0 5px rgba(243, 108, 35, 0.5))"; 
                    if (app.customScope && app.customScope.has(d.id)) return "drop-shadow(0 0 5px rgba(0, 150, 255, 0.5))"; 
                }
                return null;
            });

            // --- GHOST MODE: BORDERS (STROKE) ---
            update.select("path")
                .transition().duration(500)
                .style("stroke", d => {
                    if (isGapMode) {
                        if (gapAnalysis.owned.has(d.id)) return "#22c55e"; // Green Border
                        if (gapAnalysis.gap.has(d.id)) return "#F36C23";   // Orange Border
                    }
                    return "#ffffff"; // Default White
                })
                .style("stroke-width", d => {
                    if (isGapMode && gapAnalysis.gap.has(d.id)) return 4; // Thickest for Upsell
                    if (isGapMode && gapAnalysis.owned.has(d.id)) return 3; // Medium for Owned
                    return 2;
                });

            // --- RING LOGIC (Ensure no conflict) ---
            update.select(".procore-led-ring").transition().duration(300)
                .attr("stroke", d => (app.customScope && app.customScope.has(d.id)) ? "#2563EB" : "#F36C23")
                .attr("stroke-dasharray", d => (app.customScope && app.customScope.has(d.id)) ? "4,2" : "none")
                .attr("stroke-opacity", d => {
                    if (isGapMode) return 0; // Reduce noise in Gap Mode
                    return (filters.showProcoreLed && (filters.procoreLedTools.has(d.id) || app.customScope.has(d.id))) ? 0.8 : 0;
                });
                
            return update;
        },
        exit => exit.transition().duration(300).style("opacity", 0).remove()
    );

    // 5. Update Links (Dim irrelevant links in Gap Mode)
    app.link = app.link.data(filteredLinks, d => `${d.source.id || d.source}-${d.target.id || d.target}-${d.type}`).join("path")
        .attr("class", d => `link ${d.type}`).attr("stroke-width", 2)
        .attr("stroke", d => {
            // Keep existing coloring
            const legend = legendData.find(l => l.type_id === d.type);
            if (!legend) return app.defaultArrowColor;
            if (legend.type_id === "feeds") return "#4A4A4A";
            if (legend.visual_style.includes("solid") && !legend.visual_style.includes("gray")) return "var(--procore-orange)";
            if (legend.type_id === "syncs") return "var(--procore-metal)";
            return app.defaultArrowColor;
        })
        .attr("stroke-dasharray", d => {
            // Keep existing dashes
            const legend = legendData.find(l => l.type_id === d.type);
            if (!legend) return "none";
            if (d.type === "creates") return "4,3";
            if (d.type === "converts-to") return "8,4";
            if (d.type === "pulls-data-from") return "2,4";
            if (d.type === "attaches-links") return "1,3";
            return "none";
        })
        .attr("marker-end", d => {
            const legend = legendData.find(l => l.type_id === d.type);
            if (!legend) return null;
            if (legend.visual_style.includes("one arrow")) return `url(#arrow-${d.type})`;
            return null;
        });

    // Link Opacity Transitions
    app.link.transition().duration(500).style("opacity", d => {
        if (isGapMode) {
            // Dim links significantly to focus on the Nodes (Gap vs Owned)
            return 0.15;
        }
        if (filters.showProcoreLed) {
            const s = d.source.id || d.source;
            const t = d.target.id || d.target;
            const activeS = filters.procoreLedTools.has(s) || app.customScope.has(s);
            const activeT = filters.procoreLedTools.has(t) || app.customScope.has(t);
            return (activeS && activeT) ? 0.6 : 0.05;
        }
        return 0.6;
    });

    app.simulation.nodes(filteredNodes);
    app.simulation.force("link").links(filteredLinks);
    app.simulation.alpha(1).restart();
    if(typeof updateTourDropdown === 'function') updateTourDropdown(filters.packageTools); 
    resetHighlight(); 
}

function addBadge(group, iconCode, color, x, y, tooltipText) {
    const badge = group.append("g").attr("transform", `translate(${x}, ${y})`).style("cursor", "help").style("pointer-events", "all");
    badge.append("rect").attr("x", -6).attr("y", -6).attr("width", 12).attr("height", 12).attr("fill", "transparent");
    badge.append("text").attr("class", "fas").text(iconCode).attr("text-anchor", "middle").attr("dy", 3).attr("fill", color).attr("font-size", "10px").style("font-family", "'Font Awesome 6 Free'").style("filter", "drop-shadow(0px 1px 2px rgba(0,0,0,0.3))").style("pointer-events", "none");
    badge.on("mouseover", function(e) { e.stopPropagation(); d3.select("#tooltip").html(`<div class="font-bold text-xs" style="color: ${color};">${tooltipText}</div>`).style("left", (e.pageX+10)+"px").style("top", (e.pageY-10)+"px").classed("visible", true); })
         .on("mouseout", function(e) { e.stopPropagation(); d3.select("#tooltip").classed("visible", false); });
}
function addEmojiBadge(group, emoji, x, y, tooltipText) {
    const badge = group.append("g").attr("transform", `translate(${x}, ${y})`).style("cursor", "help").style("pointer-events", "all");
    badge.append("rect").attr("x", -6).attr("y", -6).attr("width", 12).attr("height", 12).attr("fill", "transparent");
    badge.append("text").text(emoji).attr("text-anchor", "middle").attr("dy", 3).attr("font-size", "12px").style("font-weight", "bold").style("pointer-events", "none");
    badge.on("mouseover", function(e) { e.stopPropagation(); d3.select("#tooltip").html(`<div class="font-bold text-xs" style="color: #4A4A4A;">${tooltipText}</div>`).style("left", (e.pageX+10)+"px").style("top", (e.pageY-10)+"px").classed("visible", true); })
         .on("mouseout", function(e) { e.stopPropagation(); d3.select("#tooltip").classed("visible", false); });
}

window.addEventListener('resize', () => { 
    app.width = document.getElementById('graph-container').clientWidth; 
    app.height = document.getElementById('graph-container').clientHeight;
    setHexFoci(); // Recalculate foci centers on resize
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
