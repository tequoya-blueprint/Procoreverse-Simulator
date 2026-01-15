// --- app-main.js ---
// VERSION: 1185 (FIX: PROCORE DOMAIN WHITELIST + PASSWORD BYPASS)

// --- SECURITY PROTOCOL ---
(function() {
    // 1. CONFIGURATION
    // UPDATED: Now allows any page on the Procore Confluence domain by default.
    const ALLOWED_CONTEXTS = [
        "confluence.procore.com", // Safe: Allows any internal Procore Confluence page
        "localhost",              // Dev
        "127.0.0.1"               // Dev
    ];
    
    // 2. DEVELOPER PASSWORD (The "Master Key")
    // Enter this if you ever get locked out (e.g. opening file locally)
    const DEV_PASSWORD = "Procore2025!"; 

    // 3. CONTEXT CHECK
    const referrer = document.referrer || ""; 
    const currentHost = window.location.hostname;
    
    let isAuthorized = false;
    
    // A. Check Host (Localhost)
    if (currentHost.includes("localhost") || currentHost.includes("127.0.0.1")) {
        isAuthorized = true;
    }
    // B. Check Referrer (Confluence)
    // We check if the referrer INCLUDES any of the allowed strings.
    else if (ALLOWED_CONTEXTS.some(allowed => referrer.includes(allowed))) {
        isAuthorized = true;
    }
    // C. Check LocalStorage (Saved Developer Token)
    else if (localStorage.getItem("procoreverse_dev_token") === DEV_PASSWORD) {
        console.log("Security: Developer Token Verified. Access Granted.");
        isAuthorized = true;
    }

    if (!isAuthorized) {
        // RENDER LOCK SCREEN
        document.body.innerHTML = `
            <div style="height:100vh;background:#000;color:#FF5200;display:flex;flex-direction:column;justify-content:center;align-items:center;font-family:sans-serif;text-align:center;padding:20px;">
                <h1 style="font-size:2rem;margin-bottom:1rem;text-transform:uppercase;letter-spacing:2px;">⚠️ Environment Locked</h1>
                <p style="color:white;max-width:500px;line-height:1.5;">
                    The Simulator is detecting an unauthorized location.<br>
                    <span style="color:#666;font-size:0.8rem;">(Detected Context: ${referrer ? referrer : 'Direct/Unknown'})</span>
                </p>
                
                <div style="margin-top:30px; display:flex; flex-direction:column; align-items:center;">
                    <p style="color:#fff;font-size:0.8rem;margin-bottom:10px;">Developer Override</p>
                    <input type="password" id="dev-pass" placeholder="Enter Passcode" style="padding:10px;border-radius:4px;border:none;text-align:center;width:200px;margin-bottom:10px;">
                    <button onclick="attemptUnlock()" style="background:#FF5200;color:white;border:none;padding:10px 20px;border-radius:4px;cursor:pointer;font-weight:bold;">UNLOCK</button>
                    <p id="error-msg" style="color:red;font-size:0.8rem;margin-top:10px;opacity:0;">Invalid Passcode</p>
                </div>
            </div>
        `;

        window.attemptUnlock = function() {
            const input = document.getElementById("dev-pass").value;
            if (input === DEV_PASSWORD) {
                localStorage.setItem("procoreverse_dev_token", DEV_PASSWORD);
                window.location.reload(); 
            } else {
                const msg = document.getElementById("error-msg");
                msg.style.opacity = 1;
                setTimeout(() => msg.style.opacity = 0, 2000);
            }
        };

        throw new Error("Procoreverse Security: Context Mismatch. Awaiting Override.");
    }
})();

console.log("App Main 1185: Security Passed. Initializing Core...");

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
    state: { showProcoreLedOnly: false, myStack: new Set(), isBuildingStack: false },
    customScope: new Set() 
};

// --- 1. CORE INTERACTION HANDLERS ---
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
    event.stopPropagation();
    
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

// --- 2. LOCALIZATION HELPER ---
function getLocalizedLabel(nodeId) {
    if (typeof REGIONAL_CONFIG !== 'undefined') {
        const regionDropdown = document.getElementById("region-filter");
        if (regionDropdown) {
            const regionCode = regionDropdown.value;
            let configKey = "NAMER";
            if (regionCode === "EUR") configKey = "EMEA";
            if (regionCode === "APAC") configKey = "APAC";
            
            const config = REGIONAL_CONFIG[configKey];
            if (config && config.dictionary && config.dictionary[nodeId]) {
                return config.dictionary[nodeId];
            }
        }
    }
    return nodeId;
}

// --- 3. D3 DRAG LOGIC ---
function drag(simulation) {
  function dragstarted(event) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    event.subject.fx = event.subject.x;
    event.subject.fy = event.subject.y;
  }
  
  function dragged(event) {
    event.subject.fx = event.x;
    event.subject.fy = event.y;
  }
  
  function dragended(event) {
    if (!event.active) simulation.alphaTarget(0);
    event.subject.fx = null;
    event.subject.fy = null;
  }
  
  return d3.drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
}

// --- 4. SETUP & LAYOUT ---
function setupCategories() {
    const colorMap = { 
        "Preconstruction": "#CEC4A1",       
        "Project Management": "#F36C23",    
        "Financial Management": "#8D6E63",  
        "Workforce Management": "#566578",  
        "Quality & Safety": "#566578",      
        "Platform & Core": "#757575",       
        "Construction Intelligence": "#4A4A4A", 
        "External Integrations": "#B0B0B0", 
        "Helix": "#607D8B",                 
        "Project Execution": "#F36C23",     
        "Resource Management": "#566578",   
        "Emails": "#c94b4b",                
        "Project Map": "#F36C23",
        "External Tech": "#2d3748" 
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
        "Emails": { angle: 210, dist: 1.3 },
        "External Tech": { angle: 180, dist: 1.5 }
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
    defs.append("marker").attr("id", "arrow-highlighted").attr("viewBox", "0 -5 10 10").attr("refX", app.arrowRefX).attr("markerWidth", 5).attr("markerHeight", 5).attr("orient", "auto").append("path").attr("d", "M0,-5L10,0L0,5").attr("fill", "var(--procore-orange)");
    defs.append("marker").attr("id", "arrow-candidate").attr("viewBox", "0 -5 10 10").attr("refX", app.arrowRefX).attr("markerWidth", 5).attr("markerHeight", 5).attr("orient", "auto").append("path").attr("d", "M0,-5L10,0L0,5").attr("fill", "#2563EB");
}

function populateLegend() {
    const legendContainer = d3.select("#connection-legend");
    legendContainer.html(""); 
    if (typeof legendData === 'undefined' || !Array.isArray(legendData)) return;

    const legendSVGs = {
        "creates": "<svg width='24' height='10'><line x1='0' y1='5' x2='20' y2='5' stroke='var(--procore-orange)' stroke-width='2' stroke-dasharray='4,3'></line><path d='M17,2 L23,5 L17,8' stroke='var(--procore-orange)' stroke-width='2' fill='none'></path></svg>",
        "converts-to": "<svg width='24' height='10'><line x1='0' y1='5' x2='20' y2='5' stroke='var(--procore-orange)' stroke-width='2' stroke-dasharray='8,4'></line><path d='M17,2 L23,5 L17,8' stroke='var(--procore-orange)' stroke-width='2' fill='none'></path></svg>",
        "syncs": "<svg width='24' height='10'><path d='M3,2 L9,5 L3,8' stroke='var(--procore-metal)' stroke-width='2' fill='none'></path><line x1='6' y1='5' x2='18' y2='5' stroke='var(--procore-metal)' stroke-width='2'></line><path d='M21,2 L15,5 L21,8' stroke='var(--procore-metal)' stroke-width='2' fill='none'></path></svg>",
        "pushes-data-to": "<svg width='24' height='10'><line x1='0' y1='5' x2='20' y2='5' stroke='var(--procore-orange)' stroke-width='2'></line><path d='M17,2 L23,5 L17,8' stroke='var(--procore-orange)' stroke-width='2' fill='none'></path></svg>",
        "pulls-data-from": "<svg width='24' height='10'><line x1='0' y1='5' x2='20' y2='5' stroke='#a0a0a0' stroke-width='2' stroke-dasharray='2,4'></line><path d='M17,2 L23,5 L17,8' stroke='#a0a0a0' stroke-width='2' fill='none'></path></svg>",
        "attaches-links": "<svg width='24' height='10'><line x1='0' y1='5' x2='20' y2='5' stroke='#a0a0a0' stroke-width='2' stroke-dasharray='1,3'></line><path d='M17,2 L23,5 L17,8' stroke='#a0a0a0' stroke-width='2' fill='none'></path></svg>",
        "feeds": "<svg width='24' height='10'><line x1='0' y1='5' x2='20' y2='5' stroke='#4A4A4A' stroke-width='2'></line><path d='M17,2 L23,5 L17,8' stroke='#4A4A4A' stroke-width='2' fill='none'></path></svg>"
    };
    
    legendData.forEach(type => {
        const svg = legendSVGs[type.type_id] || "";
        const item = legendContainer.append("label").attr("class", "flex items-center mb-3 cursor-pointer");
        item.append("input").attr("type", "checkbox").attr("checked", true).attr("value", type.type_id).attr("class", "form-checkbox h-4 w-4 text-orange-600 legend-checkbox mr-3").on("change", () => updateGraph(true));
        item.append("div").attr("class", "flex-shrink-0 w-8").html(svg);
        item.append("div").attr("class", "ml-2").html(`<span class="font-semibold">${type.label}</span><span class="block text-xs text-gray-500">${type.description}</span>`);
    });
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

    // 1. Data Retrieval
    const filters = (typeof getActiveFilters === 'function') ? getActiveFilters() : { categories: new Set(), persona: 'all', packageTools: null, connectionTypes: new Set(), showProcoreLed: false, procoreLedTools: new Set(), excludedTools: new Set() };
    const nodes = (typeof nodesData !== 'undefined' && Array.isArray(nodesData)) ? nodesData : [];
    const allLinks = (typeof linksData !== 'undefined' && Array.isArray(linksData)) ? linksData : [];
    
    // 2. Logic Check: Gap Mode & Active Package
    const gapAnalysis = (typeof getGapAnalysis === 'function') ? getGapAnalysis() : { owned: new Set(), gap: new Set(), matched: new Set(), outlier: new Set() };
    const isGapMode = gapAnalysis.owned.size > 0 && (filters.packageTools && filters.packageTools.size > 0);
    const isBuilderMode = app.state && app.state.isBuildingStack;
    const isPackageActive = filters.packageTools && filters.packageTools.size > 0;

    // 3. Define "Active Nodes"
    let activeNodeIds = new Set();
    
    // --- V2.3: FILTER OUT EXCLUDED TOOLS FROM "ALL" LIST ---
    const validNodes = nodes.filter(n => !filters.excludedTools || !filters.excludedTools.has(n.id));
    
    if (isBuilderMode) {
        activeNodeIds = new Set(validNodes.map(n => n.id)); 
    } else if (isGapMode) {
        activeNodeIds = new Set([...gapAnalysis.matched, ...gapAnalysis.gap, ...gapAnalysis.outlier]);
    } else if (isPackageActive) {
        activeNodeIds = filters.packageTools;
    } else {
        activeNodeIds = new Set(validNodes.map(n => n.id));
    }

    // 4. STABLE FILTERING
    const filteredNodes = nodes.filter(d => {
        const inCategory = filters.categories.has(d.group);
        const inPersona = filters.persona === 'all' || (d.personas && d.personas.includes(filters.persona));
        const isExcluded = filters.excludedTools && filters.excludedTools.has(d.id);
        return inCategory && inPersona && !isExcluded; 
    });

    const nodeIds = new Set(filteredNodes.map(n => n.id));
    const filteredLinks = allLinks.filter(d => nodeIds.has(d.source.id || d.source) && nodeIds.has(d.target.id || d.target) && filters.connectionTypes.has(d.type)).map(d => ({...d})); 

    // 5. D3 Update - Nodes
    app.node = app.node.data(filteredNodes, d => d.id).join(
        enter => {
            const nodeGroup = enter.append("g").attr("class", "node")
                .on("mouseenter", nodeMouseOver).on("mouseleave", nodeMouseOut)
                .on("click", nodeClicked).on("dblclick", nodeDoubleClicked)
                .call(drag(app.simulation)); 

            nodeGroup.append("path")
                .attr("d", d => {
                    const size = d.level === 'company' ? app.nodeSizeCompany : app.baseNodeSize;
                    if (d.group === "External Tech") {
                        return `M0,-${size}L${size},0L0,${size}L-${size},0Z`; 
                    }
                    return generateHexagonPath(size);
                })
                .attr("fill", d => app.categories[d.group].color)
                .style("color", d => app.categories[d.group].color);
            
            nodeGroup.append("circle").attr("class", "procore-led-ring").attr("r", app.baseNodeSize + 6).attr("fill", "none").attr("stroke", "#F36C23").attr("stroke-width", 3).attr("stroke-opacity", 0); 
            
            nodeGroup.append("text")
                .text(d => getLocalizedLabel(d.id))
                .attr("dy", d => (d.level === 'company' ? app.nodeSizeCompany : app.baseNodeSize) + 18);

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
            if (isBuilderMode) {
                update.transition().duration(500)
                    .style("opacity", d => app.state.myStack.has(d.id) ? 1.0 : 0.4) 
                    .style("filter", d => app.state.myStack.has(d.id) ? "drop-shadow(0 0 6px rgba(77, 164, 70, 0.6))" : "none");
                update.select("path").transition().duration(500)
                    .style("stroke", d => app.state.myStack.has(d.id) ? "#4da446" : "#ffffff")
                    .style("stroke-width", d => app.state.myStack.has(d.id) ? 3 : 2);
                update.select(".procore-led-ring").attr("stroke-opacity", 0);
                return update;
            }

            update.classed("pulsing-gap", d => isGapMode && gapAnalysis.gap.has(d.id));

            update.transition().duration(500)
            .style("opacity", d => {
                if (activeNodeIds.has(d.id)) return 1.0;
                return 0.15; 
            })
            .style("filter", d => {
                if (isGapMode) {
                    if (gapAnalysis.matched.has(d.id)) return "drop-shadow(0 0 4px rgba(77, 164, 70, 0.6))"; 
                    if (gapAnalysis.gap.has(d.id)) return "drop-shadow(0 0 12px rgba(243, 108, 35, 1.0))"; 
                    if (gapAnalysis.outlier.has(d.id)) return "drop-shadow(0 0 4px rgba(86, 101, 120, 0.6))"; 
                }
                if (filters.showProcoreLed) {
                    if (filters.procoreLedTools.has(d.id)) return "drop-shadow(0 0 5px rgba(243, 108, 35, 0.5))"; 
                    if (app.customScope && app.customScope.has(d.id)) return "drop-shadow(0 0 5px rgba(0, 150, 255, 0.5))"; 
                }
                return null;
            });
            
            update.select("text").text(d => getLocalizedLabel(d.id));

            update.select("path").transition().duration(500)
                .style("stroke", d => {
                    if (isGapMode) {
                        if (gapAnalysis.matched.has(d.id)) return "#4da446"; 
                        if (gapAnalysis.gap.has(d.id)) return "#F36C23";   
                        if (gapAnalysis.outlier.has(d.id)) return "#566578"; 
                    }
                    return "#ffffff"; 
                })
                .style("stroke-width", d => {
                    if (isGapMode && gapAnalysis.gap.has(d.id)) return 4;
                    return 2;
                });
            
            update.select(".procore-led-ring").transition().duration(300)
                .attr("stroke", d => (app.customScope && app.customScope.has(d.id)) ? "#2563EB" : "#F36C23")
                .attr("stroke-dasharray", d => (app.customScope && app.customScope.has(d.id)) ? "4,2" : "none")
                .attr("stroke-opacity", d => {
                    if (!activeNodeIds.has(d.id)) return 0; 
                    return (filters.showProcoreLed && (filters.procoreLedTools.has(d.id) || app.customScope.has(d.id))) ? 0.8 : 0;
                });
            return update;
        },
        exit => exit.transition().duration(300).style("opacity", 0).remove()
    );

    // 6. D3 Update - Links
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

    app.link.transition().duration(500)
        .style("opacity", d => {
            if (isBuilderMode) return 0.15;
            const s = d.source.id || d.source;
            const t = d.target.id || d.target;
            const sActive = activeNodeIds.has(s);
            const tActive = activeNodeIds.has(t);
            if (sActive && tActive) {
                if (filters.showProcoreLed && !isGapMode) {
                    const sLed = filters.procoreLedTools.has(s) || app.customScope.has(s);
                    const tLed = filters.procoreLedTools.has(t) || app.customScope.has(t);
                    return (sLed && tLed) ? 0.6 : 0.05;
                }
                return 0.6;
            }
            return 0; 
        })
        .style("stroke-opacity", d => { 
             if (isBuilderMode) return 0.15;
             const s = d.source.id || d.source;
             const t = d.target.id || d.target;
             const sActive = activeNodeIds.has(s);
             const tActive = activeNodeIds.has(t);
             if (sActive && tActive) {
                 if (filters.showProcoreLed && !isGapMode) {
                    const sLed = filters.procoreLedTools.has(s) || app.customScope.has(s);
                    const tLed = filters.procoreLedTools.has(t) || app.customScope.has(t);
                    return (sLed && tLed) ? 0.8 : 0.05;
                 }
                 return 0.8;
             }
             return 0; 
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
