// --- app-main.js ---
// VERSION 36: Badges & Package-Defined Rings

const app = {
    simulation: null, svg: null, zoom: null, g: null, linkG: null, nodeG: null, node: null, link: null,
    width: 0, height: 0, categories: {}, categoryFoci: {}, baseNodeSize: 25, nodeSizeCompany: 28,
    nodeCollisionRadius: 60, arrowRefX: 34, defaultArrowColor: "#a0a0a0",
    interactionState: 'explore', selectedNode: null, currentTour: null, currentStep: -1,
    apiKey: "AIzaSyCZx6YBE0qwuRd0Jl8HJQ580MUFbANtygA" 
};

function setupCategories() {
    const rootStyles = getComputedStyle(document.documentElement);
    const procoreColors = { 
        orange: rootStyles.getPropertyValue('--procore-orange').trim(), 
        lumber: rootStyles.getPropertyValue('--procore-lumber').trim(), 
        earth: rootStyles.getPropertyValue('--procore-earth').trim(), 
        metal: rootStyles.getPropertyValue('--procore-metal').trim() 
    };
    const colorMap = {
        "Preconstruction": procoreColors.lumber, "Project Management": procoreColors.orange,
        "Financial Management": procoreColors.earth, "Workforce Management": "#3a8d8c", 
        "Quality & Safety": "#5B8D7E", "Platform & Core": "#757575",
        "Construction Intelligence": "#4A4A4A", "External Integrations": "#B0B0B0",
        "Helix": procoreColors.metal, "Project Execution": procoreColors.orange,
        "Resource Management": procoreColors.metal, "Emails": "#c94b4b", "Project Map": procoreColors.orange 
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

function initializeSimulation() {
    const container = document.getElementById('graph-container');
    app.width = container.clientWidth;
    app.height = container.clientHeight;
    app.svg = d3.select("#procore-graph");
    app.g = app.svg.append("g");
    app.linkG = app.g.append("g").attr("class", "links");
    app.nodeG = app.g.append("g").attr("class", "nodes");
    setupMarkers(); 
    app.zoom = d3.zoom().scaleExtent([0.2, 4]).on("zoom", (event) => {
        app.g.attr("transform", event.transform);
        app.node.selectAll("text").style("opacity", event.transform.k < 0.5 ? 0 : 1);
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

function setupMarkers() {
    const defs = app.svg.select("defs");
    const arrowColors = {
        "creates": "var(--procore-orange)", "converts-to": "var(--procore-orange)", "pushes-data-to": "var(--procore-orange)",
        "pulls-data-from": app.defaultArrowColor, "attaches-links": app.defaultArrowColor,
        "feeds": "#4A4A4A", "syncs": "var(--procore-metal)"
    };
    if (typeof legendData !== 'undefined' && Array.isArray(legendData)) {
        legendData.forEach(type => {
            const style = type.visual_style || '';
            const color = arrowColors[type.type_id] || app.defaultArrowColor;
            if (type.type_id && style.includes("one arrow")) {
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
    // Standard legend
}

function setFoci() {
    const container = document.getElementById('graph-container');
    app.width = container.clientWidth;
    app.height = container.clientHeight;
    if (app.simulation) app.simulation.force("center", d3.forceCenter(app.width / 2, app.height / 2));
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

function ticked() {
    if (app.simulation && app.simulation.alpha() > 0.05) {
        app.simulation.nodes().forEach(forceCluster(app.simulation.alpha()));
    }
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

    const nodeIds = new Set(filteredNodes.map(n => n.id));
    
    const filteredLinks = allLinks.filter(d => 
        nodeIds.has(d.source.id || d.source) && 
        nodeIds.has(d.target.id || d.target) &&
        filters.connectionTypes.has(d.type) 
    ).map(d => ({...d})); 

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
                
                // PROCORE LED RING
                // Logic: Checks if node is in the procoreLedTools Set passed from filters
                nodeGroup.append("circle")
                    .attr("class", "procore-led-ring")
                    .attr("r", app.baseNodeSize + 6)
                    .attr("fill", "none")
                    .attr("stroke", "#9333ea") // Purple
                    .attr("stroke-width", 3)
                    .attr("stroke-opacity", 0); 

                nodeGroup.append("text")
                    .text(d => d.id)
                    .attr("dy", d => (d.level === 'company' ? app.nodeSizeCompany : app.baseNodeSize) + 18);

                // --- BADGES ---
                nodeGroup.each(function(d) {
                    const g = d3.select(this);
                    let badgeOffset = 14;

                    // 1. Procore Connect
                    if (d.id === "Drawings" || d.id === "RFIs" || (d.features && d.features.includes("connect"))) {
                        addBadge(g, "\uf0c1", "#2563EB", badgeOffset, -18, "Procore Connect");
                        badgeOffset += 12;
                    }

                    // 2. Mobile (Bottom Right)
                    if (d.features && d.features.includes("mobile")) {
                        addBadge(g, "\uf3cd", "#4A4A4A", 14, 10, "Available on Mobile");
                    }

                    // 3. Assist (Top Left) - Sparkles
                    if (d.features && d.features.includes("assist")) {
                        addBadge(g, "\uf005", "#eab308", -18, -14, "Enhanced with Assist AI"); 
                    }
                });
                
                nodeGroup.style("opacity", 0).transition().duration(500).style("opacity", 1);
                return nodeGroup;
            },
            update => {
                // Update Ring based on Filters
                update.select(".procore-led-ring")
                    .transition().duration(300)
                    .attr("stroke-opacity", d => (filters.showProcoreLed && filters.procoreLedTools.has(d.id)) ? 0.8 : 0);
                return update;
            },
            exit => exit.transition().duration(300).style("opacity", 0).remove()
        );

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
    
    if(typeof updateTourDropdown === 'function') updateTourDropdown(filters.packageTools); 
    resetHighlight(); 
}

function addBadge(group, iconCode, color, x, y, tooltipText) {
    const badge = group.append("g").attr("transform", `translate(${x}, ${y})`).style("cursor", "help");
    badge.append("circle").attr("r", 6).attr("fill", "white").attr("stroke", color).attr("stroke-width", 1);
    badge.append("text").attr("class", "fas").text(iconCode).attr("text-anchor", "middle").attr("dy", 3).attr("fill", color).attr("font-size", "8px");
    
    badge.on("mouseover", (event) => {
        event.stopPropagation();
        const tooltip = d3.select("#tooltip");
        tooltip.html(`<div class="font-bold text-xs" style="color:${color}">${tooltipText}</div>`)
               .style("left", (event.pageX + 10) + "px").style("top", (event.pageY - 10) + "px").classed("visible", true);
    }).on("mouseout", (e) => { e.stopPropagation(); d3.select("#tooltip").classed("visible", false); });
}

window.addEventListener('resize', () => { setFoci(); if(app.simulation) app.simulation.alpha(0.5).restart(); });

document.addEventListener('DOMContentLoaded', () => {
    setupCategories(); initializeSimulation(); 
    if(typeof initializeControls === 'function') initializeControls(); 
    if(typeof initializeInfoPanel === 'function') initializeInfoPanel(); 
    if(typeof initializeTourControls === 'function') initializeTourControls(); 
    populateLegend(); updateGraph(false); 
    setTimeout(() => { const l = document.getElementById('loading-overlay'); if (l) l.classList.add('hidden'); }, 1500);
    const help = d3.select("#help-button");
    if (help.node() && !localStorage.getItem('procoreverseV2_Visited')) {
        help.classed('initial-pulse', true); localStorage.setItem('procoreverseV2_Visited', 'true');
    }
});
