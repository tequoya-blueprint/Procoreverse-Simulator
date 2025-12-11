// --- app-main.js ---
// VERSION: 67 (HEXAGONAL GRID + SCOPING + SPARKLE FIX)

// --- Global App State ---
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
    // categoryFoci is no longer used for positioning
    baseNodeSize: 25,
    nodeSizeCompany: 28,
    hexGridRadius: 35, // Grid spacing
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

// --- Color & Category Definitions ---
function setupCategories() {
    const rootStyles = getComputedStyle(document.documentElement);
    const procoreColors = { 
        orange: rootStyles.getPropertyValue('--procore-orange').trim() || "#F36C23", 
        lumber: rootStyles.getPropertyValue('--procore-lumber').trim() || "#D1C4E9", 
        earth: rootStyles.getPropertyValue('--procore-earth').trim() || "#8D6E63", 
        metal: rootStyles.getPropertyValue('--procore-metal').trim() || "#607D8B"
    };

    const colorMap = {
        "Preconstruction": procoreColors.lumber,
        "Project Management": procoreColors.orange,
        "Financial Management": procoreColors.earth,
        "Workforce Management": "#3a8d8c", 
        "Quality & Safety": "#5B8D7E", 
        "Platform & Core": "#757575",
        "Construction Intelligence": "#4A4A4A",
        "External Integrations": "#B0B0B0",
        "Helix": procoreColors.metal, 
        "Project Execution": procoreColors.orange,
        "Resource Management": procoreColors.metal,
        "Emails": "#c94b4b",
        "Project Map": procoreColors.orange 
    };
    
    app.categories = {}; 
    if (typeof nodesData !== 'undefined' && Array.isArray(nodesData)) {
        nodesData.forEach(node => {
            if (!app.categories[node.group]) {
                app.categories[node.group] = { 
                    color: colorMap[node.group] || "#" + Math.floor(Math.random()*16777215).toString(16)
                };
            }
        });
    }
}

// --- CLICK HANDLER ---
function nodeClicked(event, d) {
    event.stopPropagation();
    
    // 1. MANUAL BUILDER MODE
    if (app.interactionState === 'manual_building') {
        if (typeof handleManualNodeClick === 'function') handleManualNodeClick(d); 
        return; 
    }

    // 2. SCOPING MODE
    const filters = (typeof getActiveFilters === 'function') ? getActiveFilters() : { procoreLedTools: new Set() };
    if (app.state.showProcoreLedOnly) {
        const isStandardLed = filters.procoreLedTools.has(d.id);
        if (!isStandardLed) {
            if (typeof toggleCustomScopeItem === 'function') toggleCustomScopeItem(d.id);
            return; 
        }
    }

    // 3. STANDARD SELECTION
    if (app.selectedNode === d) {
        resetHighlight();
    } else {
        app.interactionState = 'selected';
        app.selectedNode = d;
        applyHighlight(d);
        if (typeof showInfoPanel === 'function') showInfoPanel(d); 
        centerViewOnNode(d);
        d3.select('#graph-container').classed('selection-active', true);
    }
}

// --- HEX GRID LOGIC ---
function calculateHexGridPositions(nodes) {
    // 1. Separate Center (Platform) vs. Others
    const centerNodes = nodes.filter(n => n.group === "Platform & Core");
    const otherNodes = nodes.filter(n => n.group !== "Platform & Core");
    
    // Sort others by group to keep colors clustered
    otherNodes.sort((a, b) => a.group.localeCompare(b.group) || a.id.localeCompare(b.id));
    
    const allSorted = [...centerNodes, ...otherNodes];
    const positions = new Map();

    // Axial Coordinates (q, r) logic for spiral
    // flat-topped neighbors directions
    const directions = [
        {q: +1, r: 0}, {q: 0, r: +1}, {q: -1, r: +1}, 
        {q: -1, r: 0}, {q: 0, r: -1}, {q: +1, r: -1}
    ];

    const size = app.hexGridRadius * 1.8; // Spacing multiplier

    let i = 0;
    let layer = 0;
    
    // Spiral algorithm
    while (i < allSorted.length) {
        if (layer === 0) {
            positions.set(allSorted[i].id, hexToPixel(0, 0, size));
            i++;
        } else {
            let q_s = -layer; 
            let r_s = layer; // Start corner
            
            for (let j = 0; j < 6; j++) { // 6 sides
                for (let k = 0; k < layer; k++) { // nodes per side
                    if (i >= allSorted.length) break;
                    
                    positions.set(allSorted[i].id, hexToPixel(q_s, r_s, size));
                    i++;
                    
                    // Move to next spot in ring
                    q_s += directions[j].q;
                    r_s += directions[j].r;
                }
            }
        }
        layer++;
    }
    return positions;
}

function hexToPixel(q, r, size) {
    // Flat-topped orientation
    const x = size * (3./2 * q);
    const y = size * (Math.sqrt(3)/2 * q + Math.sqrt(3) * r);
    return { x: x + app.width / 2, y: y + app.height / 2 };
}

// --- D3 Simulation Setup ---
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

    app.zoom = d3.zoom()
        .scaleExtent([0.1, 4]) 
        .on("zoom", (event) => {
            app.g.attr("transform", event.transform);
            const currentScale = event.transform.k;
            app.node.selectAll("text").style("opacity", currentScale < 0.4 ? 0 : 1);
        });
    app.svg.call(app.zoom);

    // Initial Physics: Pull to grid
    app.simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(d => d.id).strength(0)) 
        .force("x", d3.forceX(d => d.gridX).strength(0.8)) 
        .force("y", d3.forceY(d => d.gridY).strength(0.8)) 
        .force("charge", d3.forceManyBody().strength(-100)) 
        .on("tick", ticked);

    app.link = app.linkG.selectAll("path");
    app.node = app.nodeG.selectAll("g");
}

// --- Marker Setup ---
function setupMarkers() {
    const defs = app.svg.select("defs");
    const arrowColors = {
        "creates": "var(--procore-orange)", "converts-to": "var(--procore-orange)", 
        "pushes-data-to": "var(--procore-orange)", "pulls-data-from": app.defaultArrowColor, 
        "attaches-links": app.defaultArrowColor, "feeds": "#4A4A4A", "syncs": "var(--procore-metal)"
    };
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

// --- LEGEND ---
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
            const item = legendContainer.append("label").attr("class", "flex items-start mb-2 cursor-pointer");
            item.append("input").attr("type", "checkbox").attr("checked", true).attr("value", type.type_id).attr("class", "form-checkbox h-5 w-5 text-orange-600 legend-checkbox").on("change", () => updateGraph(true));
            item.append("div").attr("class", "flex-shrink-0 w-8").html(svg);
            item.append("div").attr("class", "ml-2").html(`<span class="font-semibold">${type.label}</span><span class="block text-xs text-gray-500">${type.description}</span>`);
        });
    }
}

// --- Tick Function ---
function ticked() {
    if(app.link) app.link.attr("d", d => `M${d.source.x},${d.source.y}L${d.target.x},${d.target.y}`);
    if(app.node) app.node.attr("transform", d => `translate(${d.x || 0},${d.y || 0})`);
}

// --- Main Graph Update ---
function updateGraph(isFilterChange = true) {
    if (isFilterChange && app.currentTour) stopTour();

    const filters = (typeof getActiveFilters === 'function') 
        ? getActiveFilters() 
        : { categories: new Set(), persona: 'all', packageTools: null, connectionTypes: new Set(), showProcoreLed: false, procoreLedTools: new Set() };

    const nodes = (typeof nodesData !== 'undefined' && Array.isArray(nodesData)) ? nodesData : [];
    const allLinks = (typeof linksData !== 'undefined' && Array.isArray(linksData)) ? linksData : [];

    // Filter Logic
    const filteredNodes = nodes.filter(d => {
        const inCategory = filters.categories.has(d.group);
        const inPersona = filters.persona === 'all' || (d.personas && d.personas.includes(filters.persona));
        const inPackage = !filters.packageTools || filters.packageTools.has(d.id);
        return inCategory && inPersona && inPackage;
    });

    // --- HEX GRID CALCULATION ---
    const positions = calculateHexGridPositions(filteredNodes);
    filteredNodes.forEach(n => {
        const pos = positions.get(n.id);
        if (pos) {
            n.gridX = pos.x;
            n.gridY = pos.y;
            if (n.x === undefined) { n.x = pos.x; n.y = pos.y; }
        }
    });

    const nodeIds = new Set(filteredNodes.map(n => n.id));
    const filteredLinks = allLinks.filter(d => 
        nodeIds.has(d.source.id || d.source) && 
        nodeIds.has(d.target.id || d.target) &&
        filters.connectionTypes.has(d.type) 
    ).map(d => ({...d})); 

    // --- D3 Data Join: Nodes ---
    app.node = app.node.data(filteredNodes, d => d.id)
        .join(
            enter => {
                const nodeGroup = enter.append("g")
                    .attr("class", "node")
                    .call(drag(app.simulation)) 
                    .on("mouseenter", nodeMouseOver) 
                    .on("mouseleave", nodeMouseOut) 
                    .on("click", nodeClicked) 
                    .on("dblclick", nodeDoubleClicked); 
                
                nodeGroup.append("path")
                    .attr("d", d => generateHexagonPath(d.level === 'company' ? app.nodeSizeCompany : app.baseNodeSize)) 
                    .attr("fill", d => app.categories[d.group].color)
                    .style("color", d => app.categories[d.group].color);
                
                nodeGroup.append("circle")
                    .attr("class", "procore-led-ring")
                    .attr("r", app.baseNodeSize + 6)
                    .attr("fill", "none")
                    .attr("stroke", "#F36C23") 
                    .attr("stroke-width", 3)
                    .attr("stroke-opacity", 0); 

                nodeGroup.append("text")
                    .text(d => d.id)
                    .attr("dy", d => (d.level === 'company' ? app.nodeSizeCompany : app.baseNodeSize) + 18);

                nodeGroup.each(function(d) {
                    const g = d3.select(this);
                    let badgeOffset = 14;
                    if (d.id === "Drawings" || d.id === "RFIs" || (d.features && d.features.includes("connect"))) {
                        addBadge(g, "\uf0c1", "#2563EB", badgeOffset, -18, "Procore Connect");
                        badgeOffset += 12;
                    }
                    if (d.features && d.features.includes("mobile")) {
                        addBadge(g, "\uf3cd", "#4A4A4A", 14, 10, "Available on Mobile");
                    }
                    if (d.features && d.features.includes("assist")) {
                        const orangeGroups = ["Project Management", "Financial Management", "Project Execution", "Project Map"];
                        const isOrange = orangeGroups.includes(d.group);
                        const contrastColor = isOrange ? "#FFFFFF" : "#FFD700"; 
                        addBadge(g, "\uf005", contrastColor, -18, -14, "Enhanced with Assist AI");
                    }
                });
                
                nodeGroup.style("opacity", 0).transition().duration(500).style("opacity", 1);
                return nodeGroup;
            },
            update => {
                update.transition().duration(500)
                    .style("opacity", d => {
                        if (filters.showProcoreLed) {
                            if (app.customScope && app.customScope.has(d.id)) return 1.0;
                            if (filters.procoreLedTools.has(d.id)) return 1.0;
                            return 0.1;
                        }
                        return 1.0;
                    })
                    .style("filter", d => {
                        if (filters.showProcoreLed) {
                            if (filters.procoreLedTools.has(d.id)) return "drop-shadow(0 0 5px rgba(243, 108, 35, 0.5))"; 
                            if (app.customScope && app.customScope.has(d.id)) return "drop-shadow(0 0 5px rgba(0, 150, 255, 0.5))"; 
                        }
                        return null;
                    });
                update.select(".procore-led-ring")
                    .transition().duration(300)
                    .attr("stroke", d => (app.customScope && app.customScope.has(d.id)) ? "#2563EB" : "#F36C23")
                    .attr("stroke-dasharray", d => (app.customScope && app.customScope.has(d.id)) ? "4,2" : "none")
                    .attr("stroke-opacity", d => (filters.showProcoreLed && (filters.procoreLedTools.has(d.id) || app.customScope.has(d.id))) ? 0.8 : 0);
                return update;
            },
            exit => exit.transition().duration(300).style("opacity", 0).remove()
        );

    // --- D3 Data Join: Links ---
    app.link = app.link.data(filteredLinks, d => `${d.source.id || d.source}-${d.target.id || d.target}-${d.type}`)
        .join("path")
        .attr("class", d => `link ${d.type}`) 
        .attr("stroke-width", 2)
        .attr("stroke", d => {
            const legend = legendData.find(l => l.type_id === d.type);
            if (!legend) return app.defaultArrowColor;
            if (legend.type_id === "feeds") return "#4A4A4A";
            if (legend.visual_style.includes("solid") && !legend.visual_style.includes("gray")) return "var(--procore-orange)";
            if (legend.type_id === "syncs") return "var(--procore-metal)";
            return app.defaultArrowColor;
        })
        .attr("stroke-dasharray", d => {
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

    app.link.transition().duration(500)
        .style("opacity", d => {
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

// Badge Helpers
function addBadge(group, iconCode, color, x, y, tooltipText) {
    const badge = group.append("g").attr("transform", `translate(${x}, ${y})`).style("cursor", "help");
    badge.append("text").attr("class", "fas").text(iconCode).attr("text-anchor", "middle").attr("dy", 3).attr("fill", color).attr("font-size", "10px").style("font-family", "'Font Awesome 6 Free'").style("filter", "drop-shadow(0px 1px 2px rgba(0,0,0,0.3))");
    badge.on("mouseover", function(e) { e.stopPropagation(); d3.select("#tooltip").html(`<div class="font-bold text-xs" style="color: ${color};">${tooltipText}</div>`).style("left", (e.pageX+10)+"px").style("top", (e.pageY-10)+"px").classed("visible", true); })
         .on("mouseout", function(e) { e.stopPropagation(); d3.select("#tooltip").classed("visible", false); });
}
function addEmojiBadge(group, emoji, x, y, tooltipText) {
    const badge = group.append("g").attr("transform", `translate(${x}, ${y})`).style("cursor", "help");
    badge.append("text").text(emoji).attr("text-anchor", "middle").attr("dy", 3).attr("font-size", "12px");
    badge.on("mouseover", function(e) { e.stopPropagation(); d3.select("#tooltip").html(`<div class="font-bold text-xs" style="color: #eab308;">${tooltipText}</div>`).style("left", (e.pageX+10)+"px").style("top", (e.pageY-10)+"px").classed("visible", true); })
         .on("mouseout", function(e) { e.stopPropagation(); d3.select("#tooltip").classed("visible", false); });
}

window.addEventListener('resize', () => { 
    app.width = document.getElementById('graph-container').clientWidth; 
    app.height = document.getElementById('graph-container').clientHeight;
    // Recalculate grid positions on resize
    if(app.simulation) updateGraph(false);
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
