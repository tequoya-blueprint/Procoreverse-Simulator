// --- app-main.js ---
// VERSION 28: Fixes "d is not defined" error using .each()

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
    apiKey: "AIzaSyCZx6YBE0qwuRd0Jl8HJQ580MUFbANtygA" 
};

// --- Color & Category Definitions ---
function setupCategories() {
    const rootStyles = getComputedStyle(document.documentElement);
    const procoreColors = { 
        orange: rootStyles.getPropertyValue('--procore-orange').trim(), 
        lumber: rootStyles.getPropertyValue('--procore-lumber').trim(), 
        earth: rootStyles.getPropertyValue('--procore-earth').trim(), 
        metal: rootStyles.getPropertyValue('--procore-metal').trim() 
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

// --- D3 Simulation Setup ---
function initializeSimulation() {
    const container = document.getElementById('graph-container');
    app.width = container.clientWidth;
    app.height = container.clientHeight;

    app.svg = d3.select("#procore-graph");
    app.g = app.svg.append("g");
    app.linkG = app.g.append("g").attr("class", "links");
    app.nodeG = app.g.append("g").attr("class", "nodes");

    setupMarkers(); 

    app.zoom = d3.zoom()
        .scaleExtent([0.2, 4])
        .on("zoom", (event) => {
            app.g.attr("transform", event.transform);
            const currentScale = event.transform.k;
            app.node.selectAll("text").style("opacity", currentScale < 0.5 ? 0 : 1);
        });
    app.svg.call(app.zoom);

    app.simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(d => d.id).distance(130).strength(0.9))
        .force("charge", d3.forceManyBody().strength(-800))
        .force("center", d3.forceCenter(app.width / 2, app.height / 2))
        .force("collision", d3.forceCollide().radius(app.nodeCollisionRadius).strength(0.8))
        .on("tick", ticked);

    app.link = app.linkG.selectAll("path");
    app.node = app.nodeG.selectAll("g");

    setFoci();
}

// --- Marker & Legend Setup ---
function setupMarkers() {
    const defs = app.svg.select("defs");

    const arrowColors = {
        "creates": "var(--procore-orange)", "converts-to": "var(--procore-orange)", "pushes-data-to": "var(--procore-orange)",
        "pulls-data-from": app.defaultArrowColor, "attaches-links": app.defaultArrowColor,
        "feeds": "#4A4A4A", "syncs": "var(--procore-metal)"
    };

    if (typeof legendData !== 'undefined' && Array.isArray(legendData)) {
        legendData.forEach(type => {
            const style = type && type.visual_style ? type.visual_style : '';
            const color = arrowColors[type.type_id] || app.defaultArrowColor;

            if (type && type.type_id && style.includes("one arrow")) {
                defs.append("marker")
                    .attr("id", `arrow-${type.type_id}`)
                    .attr("viewBox", "0 -5 10 10").attr("refX", app.arrowRefX).attr("markerWidth", 5).attr("markerHeight", 5).attr("orient", "auto")
                    .append("path").attr("d", "M0,-5L10,0L0,5").attr("fill", color);
            }
        });
    }

    defs.append("marker").attr("id", "arrow-highlighted").attr("viewBox", "0 -5 10 10").attr("refX", app.arrowRefX).attr("markerWidth", 5).attr("markerHeight", 5).attr("orient", "auto")
        .append("path").attr("d", "M0,-5L10,0L0,5").attr("fill", "var(--procore-orange)");
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
            if (type && type.type_id) {
                const svg = legendSVGs[type.type_id] || "<svg width='24' height='10'><line x1='0' y1='5' x2='24' y2='5' stroke='#a0a0a0' stroke-width='2'></line></svg>";

                const item = legendContainer.append("label").attr("class", "flex items-start mb-2 cursor-pointer").attr("title", type.description);
                
                item.append("input").attr("type", "checkbox").attr("checked", true).attr("value", type.type_id)
                    .attr("class", "form-checkbox h-5 w-5 text-orange-600 transition rounded mr-3 mt-0.5 focus:ring-orange-500 legend-checkbox")
                    .on("change", () => updateGraph(true)); 

                item.append("div").attr("class", "flex-shrink-0 w-8").html(svg);
                item.append("div").attr("class", "ml-2").html(`
                    <span class="font-semibold">${type.label}</span>
                    <span class="block text-xs text-gray-500 leading-snug">${type.description}</span>
                `);
            }
        });
    }
}


// --- Foci & Clustering ---
function setFoci() {
    const container = document.getElementById('graph-container');
    app.width = container.clientWidth;
    app.height = container.clientHeight;
    
    if (app.simulation) {
        app.simulation.force("center", d3.forceCenter(app.width / 2, app.height / 2));
    }

    const layout = {
        "Platform & Core": { x: 0.5, y: 0.5 }, "Financial Management": { x: 0.75, y: 0.3 }, "Preconstruction": { x: 0.5, y: 0.15 },
        "Project Management": { x: 0.25, y: 0.3 }, "Quality & Safety": { x: 0.25, y: 0.7 }, "Workforce Management": { x: 0.75, y: 0.7 },
        "Construction Intelligence": { x: 0.5, y: 0.85 }, "External Integrations": { x: 0.9, y: 0.5 },
        "Helix": { x: 0.1, y: 0.5 }, "Project Execution": { x: 0.25, y: 0.3 }, "Resource Management": { x: 0.75, y: 0.7 }, "Emails": { x: 0.1, y: 0.1 },
        "Project Map": { x: 0.25, y: 0.5 } 
    };

    Object.keys(app.categories).forEach(key => {
        app.categoryFoci[key] = {
            x: app.width * (layout[key]?.x || 0.5), 
            y: app.height * (layout[key]?.y || 0.5)
        };
    });
}

function forceCluster(alpha) {
    return function(d) {
        const focus = app.categoryFoci[d.group];
        if (!focus) return;
        let k = alpha * 0.2; 
        d.vx -= (d.x - focus.x) * k;
        d.vy -= (d.y - focus.y) * k;
    };
}

// --- Simulation Tick ---
function ticked() {
    if (app.simulation && app.simulation.alpha() > 0.05) {
        app.simulation.nodes().forEach(forceCluster(app.simulation.alpha()));
    }
    if(app.link) app.link.attr("d", d => `M${d.source.x},${d.source.y}L${d.target.x},${d.target.y}`);
    if(app.node) app.node.attr("transform", d => `translate(${d.x || 0},${d.y || 0})`);
}

// --- Main Graph Update Function ---
function updateGraph(isFilterChange = true) {
    if (isFilterChange && app.currentTour) stopTour();

    const filters = (typeof getActiveFilters === 'function') ? getActiveFilters() : { categories: new Set(), persona: 'all', packageTools: null, connectionTypes: new Set() };

    const nodes = (typeof nodesData !== 'undefined' && Array.isArray(nodesData)) ? nodesData : [];
    const allLinks = (typeof linksData !== 'undefined' && Array.isArray(linksData)) ? linksData : [];

    const filteredNodes = nodes.filter(d => {
        const inCategory = filters.categories.has(d.group);
        const inPersona = filters.persona === 'all' || (d.personas && d.personas.includes(filters.persona));
        
        const inPackage = !filters.packageTools || filters.packageTools.has(d.id);
        
        return inCategory && inPersona && inPackage;
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
                    .on("click", nodeClicked); 
                
                nodeGroup.append("path")
                    .attr("d", d => generateHexagonPath(d.level === 'company' ? app.nodeSizeCompany : app.baseNodeSize)) 
                    .attr("fill", d => app.categories[d.group].color)
                    .style("color", d => app.categories[d.group].color);
                
                nodeGroup.append("text")
                    .text(d => d.id)
                    .attr("dy", d => (d.level === 'company' ? app.nodeSizeCompany : app.baseNodeSize) + 18);

                // --- PROCORE CONNECT BADGE & HOVER LOGIC (FIXED) ---
                // We must iterate over the created nodes to access 'd' (datum) and 'this' (element)
                nodeGroup.each(function(d) {
                    if (d.id === "Drawings" || d.id === "RFIs") {
                        const g = d3.select(this);
                        
                        const badgeGroup = g.append("g")
                            .attr("transform", `translate(16, -18)`)
                            .style("cursor", "help"); 
                        
                        badgeGroup.append("circle")
                            .attr("r", 7)
                            .attr("fill", "white")
                            .attr("stroke", "#2563EB")
                            .attr("stroke-width", 1.5);
                            
                        badgeGroup.append("text")
                            .attr("class", "fas")
                            .text("\uf0c1")
                            .attr("text-anchor", "middle")
                            .attr("dy", 3) 
                            .attr("fill", "#2563EB")
                            .attr("font-size", "9px")
                            .style("font-family", "'Font Awesome 6 Free'");

                        // HOVER EVENT: Show custom tooltip
                        badgeGroup.on("mouseover", function(event) {
                            event.stopPropagation(); // Prevent main node tooltip
                            const tooltip = d3.select("#tooltip");
                            tooltip.html(`
                                <div class="font-bold text-sm mb-1" style="color: #2563EB;">
                                    <i class="fas fa-link mr-1"></i> Procore Connect
                                </div>
                                <div class="text-xs text-gray-200" style="max-width: 180px;">
                                    Syncs items across different accounts (e.g., General Contractor to Owner).
                                </div>
                            `)
                            .style("left", (event.pageX + 15) + "px")
                            .style("top", (event.pageY - 10) + "px")
                            .classed("visible", true);
                        })
                        .on("mouseout", function(event) {
                            event.stopPropagation();
                            d3.select("#tooltip").classed("visible", false);
                        });
                    }
                });
                // ---------------------------------------------
                
                nodeGroup.style("opacity", 0).transition().duration(500).style("opacity", 1);
                return nodeGroup;
            },
            update => update,
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

    app.simulation.nodes(filteredNodes);
    app.simulation.force("link").links(filteredLinks);
    app.simulation.alpha(1).restart();
    
    if(typeof updateTourDropdown === 'function') {
        updateTourDropdown(filters.packageTools); 
    }
    resetHighlight(); 
}

// --- Window & Initial Load ---
window.addEventListener('resize', () => {
    setFoci();
    if(app.simulation) {
        app.simulation.alpha(0.5).restart();
    }
});

// --- Main Initialization Function ---
document.addEventListener('DOMContentLoaded', () => {
    setupCategories();
    initializeSimulation(); 
    
    if(typeof initializeControls === 'function') initializeControls(); 
    if(typeof initializeInfoPanel === 'function') initializeInfoPanel(); 
    if(typeof initializeTourControls === 'function') initializeTourControls(); 
    
    populateLegend();
    updateGraph(false); 

    setTimeout(() => {
        const loadingOverlay = document.getElementById('loading-overlay');
        if (loadingOverlay) loadingOverlay.classList.add('hidden');
    }, 1500);

    const helpButton = d3.select("#help-button");
    if (helpButton.node() && !localStorage.getItem('procoreverseV2_Visited')) {
        helpButton.classed('initial-pulse', true);
        localStorage.setItem('procoreverseV2_Visited', 'true');
    }
});
