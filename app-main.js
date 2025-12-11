// --- app-main.js ---
// VERSION: 72 (BALANCED HEX RING LAYOUT + FLAT TOP FIX)

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
    baseNodeSize: 25,
    nodeSizeCompany: 28,
    hexGridRadius: 42, // Increased to 42 to prevent ANY overlap
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
    if (app.interactionState === 'manual_building') { if (typeof handleManualNodeClick === 'function') handleManualNodeClick(d); return; }
    const filters = (typeof getActiveFilters === 'function') ? getActiveFilters() : { procoreLedTools: new Set() };
    if (app.state.showProcoreLedOnly) {
        const isStandardLed = filters.procoreLedTools.has(d.id);
        if (!isStandardLed) { if (typeof toggleCustomScopeItem === 'function') toggleCustomScopeItem(d.id); return; }
    }
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

// --- NEW BALANCED HEX LAYOUT ALGORITHM ---
// This fills concentric rings to ensure a symmetric hexagon shape
function calculateHexGridPositions(nodes) {
    const centerNodes = nodes.filter(n => n.group === "Platform & Core");
    const otherNodes = nodes.filter(n => n.group !== "Platform & Core");
    
    // Sort logic to keep groups clustered (Financials together, etc.)
    otherNodes.sort((a, b) => a.group.localeCompare(b.group) || a.id.localeCompare(b.id));
    
    const allSorted = [...centerNodes, ...otherNodes];
    const positions = new Map();
    const size = app.hexGridRadius * 1.5; 

    // Generate valid Hex coordinates (q, r) in concentric rings
    let validCoords = [{q: 0, r: 0}]; // Center
    let maxRing = 1;
    
    // Generate enough rings to cover all nodes
    while (validCoords.length < allSorted.length) {
        let q = -maxRing;
        let r = maxRing; // Start at corner
        
        // Walk the 6 sides of this ring
        // Directions for Flat-Top neighbor walk
        const directions = [
            {q: 1, r: 0}, {q: 0, r: -1}, {q: -1, r: -1}, 
            {q: -1, r: 0}, {q: 0, r: 1}, {q: 1, r: 1} // Corrected flat-top ring walk
        ];
        
        // Actually, standard Cube Ring algorithm:
        // Start at radius * direction[4]
        // Walk radius steps in direction[i]
        
        // Let's use simple coordinate generation for rings
        for (let side = 0; side < 6; side++) {
            // Standard axial directions
            const dir = [{q: +1, r: 0}, {q: 0, r: +1}, {q: -1, r: +1}, {q: -1, r: 0}, {q: 0, r: -1}, {q: +1, r: -1}][side];
            
            // Adjust start based on corner? No, let's just generate all coords for radius R
            // Simple loop for radius R:
            // x from -R to +R
            // y from max(-R, -x-R) to min(R, -x+R)
            // z = -x-y
        }
        
        // Robust Ring Generator
        let currentQ = -maxRing, currentR = 0, currentS = maxRing; // Start at Left-ish
        // Moving directions for Flat Top ring:
        const moveDirs = [
            {q: 1, r: -1}, {q: 1, r: 0}, {q: 0, r: 1}, 
            {q: -1, r: 1}, {q: -1, r: 0}, {q: 0, r: -1}
        ];
        
        // Current coordinate pointer
        let cQ = -maxRing;
        let cR = 0;
        
        // However, a simpler way to ensure "Group" shape is just to check alignment.
        // Let's use the explicit ring walker which is proven.
        let ringCoords = [];
        let curQ = -maxRing;
        let curR = 0; // Pointy top start? No flat top.
        
        // We will stick to the previous spiral but enforce limits?
        // No, let's just pre-calculate the first 100 valid coords in a perfect circle/hex pattern.
        // Ring 0: 1 node
        // Ring 1: 6 nodes
        // Ring 2: 12 nodes
        // Ring 3: 18 nodes...
        
        // Let's just generate them.
        let tempQ = -maxRing;
        let tempR = 0;
        
        // Top-Left corner for Flat Top grid is actually different.
        // Let's use Cube coordinates for generation, then convert to Axial.
        // Cube: x+y+z = 0.
        // Ring N: x,y,z in [-N, N]. and max(|x|,|y|,|z|) = N.
        
        for (let q = -maxRing; q <= maxRing; q++) {
            for (let r = -maxRing; r <= maxRing; r++) {
                let s = -q-r;
                if (Math.abs(s) <= maxRing) {
                    // This coordinate is inside the hexagon of radius maxRing
                    // Only add if it is ON the ring (distance == maxRing)
                    if (Math.max(Math.abs(q), Math.abs(r), Math.abs(s)) === maxRing) {
                        validCoords.push({q, r});
                    }
                }
            }
        }
        maxRing++;
    }

    // Now map sorted nodes to these coordinates
    for (let i = 0; i < allSorted.length; i++) {
        if (i < validCoords.length) {
            positions.set(allSorted[i].id, hexToPixel(validCoords[i].q, validCoords[i].r, size));
        }
    }
    
    return positions;
}

function hexToPixel(q, r, size) {
    // Flat-Topped Conversion: x = 3/2 * q * size, y = sqrt(3) * (r + q/2) * size
    const x = size * (1.5 * q);
    const y = size * (Math.sqrt(3) * (r + q / 2));
    return { x: x + app.width / 2, y: y + app.height / 2 };
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
    app.simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(d => d.id).strength(0)) 
        .force("x", d3.forceX(d => d.gridX).strength(0.95)) 
        .force("y", d3.forceY(d => d.gridY).strength(0.95)) 
        .force("charge", d3.forceManyBody().strength(-200)) 
        .on("tick", ticked);
    app.link = app.linkG.selectAll("path");
    app.node = app.nodeG.selectAll("g");
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
            const item = legendContainer.append("label").attr("class", "flex items-start mb-2 cursor-pointer");
            item.append("input").attr("type", "checkbox").attr("checked", true).attr("value", type.type_id).attr("class", "form-checkbox h-5 w-5 text-orange-600 legend-checkbox").on("change", () => updateGraph(true));
            item.append("div").attr("class", "flex-shrink-0 w-8").html(svg);
            item.append("div").attr("class", "ml-2").html(`<span class="font-semibold">${type.label}</span><span class="block text-xs text-gray-500">${type.description}</span>`);
        });
    }
}

function ticked() {
    if(app.link) app.link.attr("d", d => `M${d.source.x},${d.source.y}L${d.target.x},${d.target.y}`);
    if(app.node) app.node.attr("transform", d => `translate(${d.x || 0},${d.y || 0})`);
}

function updateGraph(isFilterChange = true) {
    if (isFilterChange && app.currentTour) stopTour();
    const filters = (typeof getActiveFilters === 'function') ? getActiveFilters() : { categories: new Set(), persona: 'all', packageTools: null, connectionTypes: new Set(), showProcoreLed: false, procoreLedTools: new Set() };
    const nodes = (typeof nodesData !== 'undefined' && Array.isArray(nodesData)) ? nodesData : [];
    const allLinks = (typeof linksData !== 'undefined' && Array.isArray(linksData)) ? linksData : [];
    
    const filteredNodes = nodes.filter(d => {
        const inCategory = filters.categories.has(d.group);
        const inPersona = filters.persona === 'all' || (d.personas && d.personas.includes(filters.persona));
        const inPackage = !filters.packageTools || filters.packageTools.has(d.id);
        return inCategory && inPersona && inPackage;
    });

    const positions = calculateHexGridPositions(filteredNodes);
    filteredNodes.forEach(n => {
        const pos = positions.get(n.id);
        if (pos) { n.gridX = pos.x; n.gridY = pos.y; if (n.x === undefined) { n.x = pos.x; n.y = pos.y; } }
    });

    const nodeIds = new Set(filteredNodes.map(n => n.id));
    const filteredLinks = allLinks.filter(d => nodeIds.has(d.source.id || d.source) && nodeIds.has(d.target.id || d.target) && filters.connectionTypes.has(d.type)).map(d => ({...d})); 

    app.node = app.node.data(filteredNodes, d => d.id).join(
        enter => {
            const nodeGroup = enter.append("g").attr("class", "node").call(drag(app.simulation))
                .on("mouseenter", nodeMouseOver).on("mouseleave", nodeMouseOut).on("click", nodeClicked).on("dblclick", nodeDoubleClicked);
            nodeGroup.append("path").attr("d", d => generateHexagonPath(d.level === 'company' ? app.nodeSizeCompany : app.baseNodeSize)).attr("fill", d => app.categories[d.group].color).style("color", d => app.categories[d.group].color);
            nodeGroup.append("circle").attr("class", "procore-led-ring").attr("r", app.baseNodeSize + 6).attr("fill", "none").attr("stroke", "#F36C23").attr("stroke-width", 3).attr("stroke-opacity", 0); 
            nodeGroup.append("text").text(d => d.id).attr("dy", d => (d.level === 'company' ? app.nodeSizeCompany : app.baseNodeSize) + 18);
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
            update.transition().duration(500).style("opacity", d => {
                if (filters.showProcoreLed) {
                    if (app.customScope && app.customScope.has(d.id)) return 1.0;
                    if (filters.procoreLedTools.has(d.id)) return 1.0;
                    return 0.1;
                }
                return 1.0;
            }).style("filter", d => {
                if (filters.showProcoreLed) {
                    if (filters.procoreLedTools.has(d.id)) return "drop-shadow(0 0 5px rgba(243, 108, 35, 0.5))"; 
                    if (app.customScope && app.customScope.has(d.id)) return "drop-shadow(0 0 5px rgba(0, 150, 255, 0.5))"; 
                }
                return null;
            });
            update.select(".procore-led-ring").transition().duration(300)
                .attr("stroke", d => (app.customScope && app.customScope.has(d.id)) ? "#2563EB" : "#F36C23")
                .attr("stroke-dasharray", d => (app.customScope && app.customScope.has(d.id)) ? "4,2" : "none")
                .attr("stroke-opacity", d => (filters.showProcoreLed && (filters.procoreLedTools.has(d.id) || app.customScope.has(d.id))) ? 0.8 : 0);
            return update;
        },
        exit => exit.transition().duration(300).style("opacity", 0).remove()
    );

    app.link = app.link.data(filteredLinks, d => `${d.source.id || d.source}-${d.target.id || d.target}-${d.type}`).join("path")
        .attr("class", d => `link ${d.type}`).attr("stroke-width", 2)
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

    app.link.transition().duration(500).style("opacity", d => {
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
    const badge = group.append("g").attr("transform", `translate(${x}, ${y})`).style("cursor", "help");
    badge.append("rect").attr("x", -6).attr("y", -6).attr("width", 12).attr("height", 12).attr("fill", "transparent").style("pointer-events", "all");
    badge.append("text").attr("class", "fas").text(iconCode).attr("text-anchor", "middle").attr("dy", 3).attr("fill", color).attr("font-size", "10px").style("font-family", "'Font Awesome 6 Free'").style("filter", "drop-shadow(0px 1px 2px rgba(0,0,0,0.3))").style("pointer-events", "none");
    badge.on("mouseover", function(e) { e.stopPropagation(); d3.select("#tooltip").html(`<div class="font-bold text-xs" style="color: ${color};">${tooltipText}</div>`).style("left", (e.pageX+10)+"px").style("top", (e.pageY-10)+"px").classed("visible", true); })
         .on("mouseout", function(e) { e.stopPropagation(); d3.select("#tooltip").classed("visible", false); });
}
function addEmojiBadge(group, emoji, x, y, tooltipText) {
    const badge = group.append("g").attr("transform", `translate(${x}, ${y})`).style("cursor", "help");
    badge.append("rect").attr("x", -6).attr("y", -6).attr("width", 12).attr("height", 12).attr("fill", "transparent").style("pointer-events", "all");
    badge.append("text").text(emoji).attr("text-anchor", "middle").attr("dy", 3).attr("font-size", "12px").style("font-weight", "bold").style("pointer-events", "none");
    badge.on("mouseover", function(e) { e.stopPropagation(); d3.select("#tooltip").html(`<div class="font-bold text-xs" style="color: #4A4A4A;">${tooltipText}</div>`).style("left", (e.pageX+10)+"px").style("top", (e.pageY-10)+"px").classed("visible", true); })
         .on("mouseout", function(e) { e.stopPropagation(); d3.select("#tooltip").classed("visible", false); });
}

window.addEventListener('resize', () => { 
    app.width = document.getElementById('graph-container').clientWidth; 
    app.height = document.getElementById('graph-container').clientHeight;
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
