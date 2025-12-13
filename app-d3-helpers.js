// --- app-d3-helpers.js ---
// VERSION: 370 (CLEANED: REMOVED CONFLICTING LOGIC)

/**
 * Generates a Hexagon Path (Flat-Top/Bottom).
 */
function generateHexagonPath(size) {
    const points = Array.from({length: 6}, (_, i) => {
        const a = (Math.PI / 180 * (60 * i)); 
        return [size * Math.cos(a), size * Math.sin(a)];
    });
    return "M" + points.map(p => p.join(",")).join("L") + "Z";
}

/**
 * Standard D3 Drag behavior.
 */
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

/**
 * Visual Highlight Logic.
 * Used by app-main.js to dim unconnected nodes.
 */
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

    const opacity = 0.1; 
    
    // Dim unrelated nodes
    app.node.transition().duration(300)
        .style("opacity", n => connectedNodeIds.has(n.id) ? 1 : opacity);
    
    // Highlight specific links
    app.link.transition().duration(300)
        .style("stroke-opacity", l => connectedLinks.has(l) ? 1 : opacity * 0.5)
        .attr("marker-end", l => {
            if (!connectedLinks.has(l)) return null;
            return `url(#arrow-highlighted)`;
        });
}

/**
 * Resets the graph to neutral state.
 */
function resetHighlight(hidePanel = true) {
    // PROTECTED STATES: Do not reset visuals if we are in a special mode
    if (!hidePanel && ['tour', 'tour_preview', 'selected', 'manual_building', 'building_stack'].includes(app.interactionState)) return; 

    app.interactionState = 'explore';
    app.selectedNode = null;
    
    if (app.node) {
        app.node.classed("selected", false);
        // Let updateGraph handle opacity based on filters
        if (typeof updateGraph === 'function') updateGraph(false);
        else app.node.transition().duration(400).style("opacity", 1);
    }
    
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
        
    if (hidePanel) {
        if (typeof hideInfoPanel === 'function') {
            d3.select("#info-panel").classed("visible", false);
        }
    }
    
    d3.select('#graph-container').classed('selection-active', false);
}

function centerViewOnNode(d) {
    if (!d || d.x == null || d.y == null || !app.svg || !app.zoom) return;
    
    const scale = 1.5; 
    const x = app.width / 2 - d.x * scale;
    const y = app.height / 2 - d.y * scale;
    
    app.svg.transition().duration(800).ease(d3.easeCubicInOut)
        .call(app.zoom.transform, d3.zoomIdentity.translate(x, y).scale(scale));
}

function resetZoom() {
    if (app.svg && app.zoom) {
        app.svg.transition().duration(1000).ease(d3.easeCubicInOut)
            .call(app.zoom.transform, d3.zoomIdentity);
    }
}
