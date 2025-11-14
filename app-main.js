// --- app-main.js ---
// The core D3.js application logic, simulation setup, and main render loop.

// --- Global App State ---
// This object will hold the main application state, making it accessible
// across the modular files.
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
    arrowRefX: 34, // nodeSizeCompany + 6
    defaultArrowColor: "#a0a0a0",
    interactionState: 'explore', // 'explore', 'selected', 'tour'
    selectedNode: null,
    currentTour: null,
    currentStep: -1,
    apiKey: "AIzaSyCkAIR6TdQfs5q515M7AROv1LDq1qEhwKc" // Your API key
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

    app.categories = {
        "Preconstruction": { color: procoreColors.lumber },
        "Project Management": { color: procoreColors.orange },
        "Financial Management": { color: procoreColors.earth },
        "Workforce Management": { color: procoreColors.metal },
        "Quality & Safety": { color: "#5B8D7E" }, // A construction green
        "Platform & Core": { color: "#757575" },
        "Construction Intelligence": { color: "#4A4A4A" },
        "External Integrations": { color: "#B0B0B0" }
    };
}

// --- D3 Simulation Setup ---
function initializeSimulation() {
    const container = document.getElementById('graph-container');
    app.width = container.clientWidth;
    app.height = container.clientHeight;

    // Main SVG setup
    app.svg = d3.select("#procore-graph");
    app.g = app.svg.append("g");
    app.linkG = app.g.append("g").attr("class", "links");
    app.nodeG = app.g.append("g").attr("class", "nodes");

    setupMarkers();

    // Zoom behavior
    app.zoom = d3.zoom()
        .scaleExtent([0.2, 4])
        .on("zoom", (event) => {
            app.g.attr("transform", event.transform);
            // Hide text on zoom out for performance and clarity
            const currentScale = event.transform.k;
            app.node.selectAll("text").style("opacity", currentScale < 0.5 ? 0 : 1);
        });
    app.svg.call(app.zoom);

    // Force simulation
    app.simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(d => d.id).distance(130).strength(0.9))
        .force("charge", d3.forceManyBody().strength(-800))
        .force("center", d3.forceCenter(app.width / 2, app.height / 2))
        .force("collision", d3.forceCollide().radius(app.nodeCollisionRadius).strength(0.8))
        .on("tick", ticked);

    // Initialize node and link selections
    app.link = app.linkG.selectAll("path");
    app.node = app.nodeG.selectAll("g");

    // Set initial cluster points
    setFoci();
}

// --- Marker & Legend Setup ---
function setupMarkers() {
    const defs = app.svg.select("defs");

    // Create a marker for each connection type
    connectionTypes.forEach(type => {
        let color = type.id.includes('process') || type.id.includes('sync-update') ? 'var(--procore-orange)' : app.defaultArrowColor;
        
        if (type.id.includes('sync-update')) color = '#4f46e5';
        if (type.id === 'read' || type.id === 'sync' || type.id === 'sync-bi' || type.id === 'create_link_bi') return; // No arrowheads

        defs.append("marker")
            .attr("id", `arrow-${type.id}`)
            .attr("viewBox", "0 -5 10 10")
            .attr("refX", app.arrowRefX)
            .attr("markerWidth", 5)
            .attr("markerHeight", 5)
            .attr("orient", "auto")
            .append("path")
            .attr("d", "M0,-5L10,0L0,5")
            .attr("fill", color);
    });

    // Special marker for highlighted state
    defs.append("marker")
        .attr("id", "arrow-highlighted")
        .attr("viewBox", "0 -5 10 10")
        .attr("refX", app.arrowRefX)
        .attr("markerWidth", 5)
        .attr("markerHeight", 5)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-5L10,0L0,5")
        .attr("fill", "var(--procore-orange)");
}

function populateLegend() {
    const legendContainer = d3.select("#connection-legend");
    legendContainer.html(""); // Clear existing

    connectionTypes.forEach(type => {
        const item = legendContainer.append("div")
            .attr("class", "flex items-center")
            .attr("title", type.description);
        
        item.node().innerHTML = `
            ${type.svg}
            <span class="ml-3">${type.label}</span>
        `;
    });
}

// --- Foci & Clustering ---
function setFoci() {
    const container = document.getElementById('graph-container');
    app.width = container.clientWidth;
    app.height = container.clientHeight;
    app.simulation.force("center", d3.forceCenter(app.width / 2, app.height / 2));

    const layout = {
        "Platform & Core": { x: 0.5, y: 0.5 },
        "Financial Management": { x: 0.75, y: 0.3 },
        "Preconstruction": { x: 0.5, y: 0.15 },
        "Project Management": { x: 0.25, y: 0.3 },
        "Quality & Safety": { x: 0.25, y: 0.7 },
        "Workforce Management": { x: 0.75, y: 0.7 },
        "Construction Intelligence": { x: 0.5, y: 0.85 },
        "External Integrations": { x: 0.9, y: 0.5 }
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
        let k = alpha * 0.2; // Strength of clustering
        d.vx -= (d.x - focus.x) * k;
        d.vy -= (d.y - focus.y) * k;
    };
}

// --- Simulation Tick ---
function ticked() {
    // Apply clustering force
    if (app.simulation.alpha() > 0.05) {
        app.simulation.nodes().forEach(forceCluster(app.simulation.alpha()));
    }

    // Update positions
    app.link.attr("d", d => `M${d.source.x},${d.source.y}L${d.target.x},${d.target.y}`);
    app.node.attr("transform", d => `translate(${d.x || 0},${d.y || 0})`);
}

// --- Main Graph Update Function ---
function updateGraph(isFilterChange = true) {
    if (isFilterChange && app.currentTour) stopTour();

    // Get filter values from app-controls.js
    const filters = getActiveFilters();

    // Apply filters
    const filteredNodes = nodesData.filter(d => {
        const inCategory = filters.categories.has(d.group);
        const inPersona = filters.persona === 'all' || (d.personas && d.personas.includes(filters.persona));
        const inAudience = filters.audience === 'all' || (d.audience && d.audience.includes(filters.audience));
        const inPackage = !filters.packageTools || filters.packageTools.has(d.id);
        return inCategory && inPersona && inAudience && inPackage;
    });

    const nodeIds = new Set(filteredNodes.map(n => n.id));
    const filteredLinks = linksData.filter(d => 
        nodeIds.has(d.source.id || d.source) && 
        nodeIds.has(d.target.id || d.target)
    ).map(d => ({...d})); // Create copies

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
                
                // Hexagon path
                nodeGroup.append("path")
                    .attr("d", d => generateHexagonPath(d.level === 'Company' ? app.nodeSizeCompany : app.baseNodeSize))
                    .attr("fill", d => app.categories[d.group].color)
                    .style("color", d => app.categories[d.group].color); // For 'currentColor' CSS
                
                // Text label
                nodeGroup.append("text")
                    .text(d => d.id)
                    .attr("dy", d => (d.level === 'Company' ? app.nodeSizeCompany : app.baseNodeSize) + 18);
                
                // Entrance animation
                nodeGroup.style("opacity", 0).transition().duration(500).style("opacity", 1);
                return nodeGroup;
            },
            update => update,
            exit => exit.transition().duration(300).style("opacity", 0).remove()
        );

    // --- D3 Data Join: Links ---
    app.link = app.link.data(filteredLinks, d => `${d.source.id || d.source}-${d.target.id || d.target}-${d.type}`)
        .join("path")
        .attr("class", d => `link ${d.type.includes('create') ? 'create' : ''}`)
        .attr("stroke-width", 2)
        .attr("marker-end", d => {
            if (d.type === 'sync-bi' || d.type === 'read' || d.type === 'sync' || d.type === 'create_link_bi') return null;
            return `url(#arrow-${d.type})`;
        });

    // Update simulation
    app.simulation.nodes(filteredNodes);
    app.simulation.force("link").links(filteredLinks);
    app.simulation.alpha(1).restart();
    
    // Update UI elements
    updateTourDropdown(filters.packageTools);
    resetHighlight();
}

// --- Window & Initial Load ---
window.addEventListener('resize', () => {
    setFoci();
    app.simulation.alpha(0.5).restart();
});

// --- Main Initialization Function ---
document.addEventListener('DOMContentLoaded', () => {
    setupCategories();
    initializeSimulation();
    initializeControls(); // From app-controls.js
    initializeInfoPanel(); // From app-panel.js
    initializeTourControls(); // From app-tours.js
    
    populateLegend();
    updateGraph(false); // Initial graph render

    // Hide loading screen
    setTimeout(() => {
        document.getElementById('loading-overlay').classList.add('hidden');
    }, 1500);

    // Check for first visit
    if (!localStorage.getItem('procoreverseV2_Visited')) {
        d3.select("#help-button").classed('initial-pulse', true);
        localStorage.setItem('procoreverseV2_Visited', 'true');
    }
});
