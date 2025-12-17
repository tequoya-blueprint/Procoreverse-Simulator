// --- app-d3-helpers.js ---
// VERSION: 600 (COMPLETE: SPOTLIGHT, DRAG, & HIGHLIGHT HELPERS)

// 1. SHAPE GENERATOR
function generateHexagonPath(size) {
    const points = Array.from({length: 6}, (_, i) => {
        const a = (Math.PI / 180 * (60 * i)); 
        return [size * Math.cos(a), size * Math.sin(a)];
    });
    return "M" + points.map(p => p.join(",")).join("L") + "Z";
}

// 2. DRAG BEHAVIOR
function drag(simulation) {
    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x; 
        d.fy = d.y;
        if (typeof hideTooltip === 'function') hideTooltip(); 
    }
    
    function dragged(event, d) { 
        d.fx = event.x; 
        d.fy = event.y; 
    }
    
    function dragended(event, d) {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null; 
        d.fy = null;
    }
    
    return d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended);
}

// 3. STANDARD HIGHLIGHT (One Node + Neighbors)
function applyHighlight(d) {
    if (!app.simulation) return;
    
    const connectedNodeIds = new Set([d.id]);
    const connectedLinks = new Set();
    
    app.simulation.force("link").links().forEach(l => {
        if (l.source.id === d.id || l.target.id === d.id) {
            connectedNodeIds.add(l.source.id);
            connectedNodeIds.add(l.target.id);
            connectedLinks.add(l);
        }
    });

    app.node.transition().duration(300)
        .style("opacity", n => connectedNodeIds.has(n.id) ? 1 : 0.1);
        
    app.link.transition().duration(300)
        .style("stroke-opacity", l => connectedLinks.has(l) ? 1 : 0.05)
        .attr("marker-end", l => { 
            if (!connectedLinks.has(l)) return null; 
            return `url(#arrow-highlighted)`; 
        });
}

// 4. SPOTLIGHT HIGHLIGHT (Specific Pair A <-> B)
// This is the function required for the Side Panel Hover effect
function highlightConnectionPair(nodeA, nodeB) {
    if (!app.simulation || !nodeA || !nodeB) return;

    // A. Highlight ONLY the two specific nodes
    app.node.transition().duration(200).style("opacity", n => {
        return (n.id === nodeA.id || n.id === nodeB.id) ? 1 : 0.1;
    });

    // B. Highlight ONLY the specific link(s) between them
    app.link.transition().duration(200)
        .style("stroke-opacity", l => {
            const s = l.source.id || l.source;
            const t = l.target.id || l.target;
            
            // Check for connection in either direction
            const isMatch = (s === nodeA.id && t === nodeB.id) || (s === nodeB.id && t === nodeA.id);
            return isMatch ? 1 : 0.05;
        })
        .style("opacity", l => {
            const s = l.source.id || l.source;
            const t = l.target.id || l.target;
            const isMatch = (s === nodeA.id && t === nodeB.id) || (s === nodeB.id && t === nodeA.id);
            return isMatch ? 1 : 0.05;
        });
}

// 5. RESET VIEW
function resetHighlight(hidePanel = true) {
    // Safety check: Don't reset if we are in a special mode
    if (!hidePanel && ['tour', 'tour_preview', 'selected', 'manual_building', 'building_stack'].includes(app.interactionState)) return; 
    
    app.interactionState = 'explore';
    app.selectedNode = null;

    // Reset Nodes
    if (app.node) {
        app.node.classed("selected", false);
        // If we have filters active, run updateGraph to restore filtered state
        // Otherwise just fade everything back in
        if (typeof updateGraph === 'function') updateGraph(false); 
        else app.node.transition().duration(400).style("opacity", 1);
    }

    // Reset Links
    if (app.link) {
        app.link.classed("highlighted", false).classed("pulsing", false);
        app.link.transition().duration(400)
            .style("stroke-opacity", 0.6)
            .style("stroke-width", 2)
            .attr("marker-end", d => {
                if (typeof legendData !== 'undefined') {
                     const legend = legendData.find(l => l.type_id === d.type);
                     if (legend && legend.visual_style.includes("one arrow")) return `url(#arrow-${d.type})`;
                }
                return null;
            });
    }

    // Close Panel
    if (hidePanel) { 
        if (typeof hideInfoPanel === 'function') d3.select("#info-panel").classed("visible", false); 
    }
    
    d3.select('#graph-container').classed('selection-active', false);
}

// 6. CAMERA HELPERS
function centerViewOnNode(d) {
    if (!d || d.x == null || d.y == null || !app.svg || !app.zoom) return;
    
    const scale = 1.5; 
    const x = app.width / 2 - d.x * scale;
    const y = app.height / 2 - d.y * scale;
    
    app.svg.transition().duration(800)
        .ease(d3.easeCubicInOut)
        .call(app.zoom.transform, d3.zoomIdentity.translate(x, y).scale(scale));
}

function resetZoom() {
    if (app.svg && app.zoom) { 
        app.svg.transition().duration(1000)
            .ease(d3.easeCubicInOut)
            .call(app.zoom.transform, d3.zoomIdentity); 
    }
}
