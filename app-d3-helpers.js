// --- app-d3-helpers.js ---
// VERSION: 72 (FLAT-TOP ROTATION RESTORED)

/**
 * Generates a Hexagon Path with FLAT TOP and BOTTOM.
 * Rotates the standard points by 30 degrees (PI/6).
 */
function generateHexagonPath(size) {
    const points = Array.from({length: 6}, (_, i) => {
        // Offset by 30 degrees (PI/6) to align edges horizontally
        const a = (Math.PI / 180 * (60 * i)) + (Math.PI / 6); 
        return [size * Math.cos(a), size * Math.sin(a)];
    });
    return "M" + points.map(p => p.join(",")).join("L") + "Z";
}

function drag(simulation) {
    function dragstarted(event, d) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
        if (typeof hideTooltip === 'function') hideTooltip(); 
    }
    function dragged(event, d) { d.fx = event.x; d.fy = event.y; }
    function dragended(event, d) { if (!event.active) simulation.alphaTarget(0); }
    return d3.drag().on("start", dragstarted).on("drag", dragged).on("end", dragended);
}

function nodeClicked(event, d) {
    event.stopPropagation();
    if (app.interactionState === 'manual_building') {
        if (typeof handleManualNodeClick === 'function') handleManualNodeClick(d); 
        return; 
    }
    // Standard Selection Logic (Fallback)
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

function nodeDoubleClicked(event, d) { event.stopPropagation(); }

function nodeMouseOver(event, d) {
    if (['tour', 'tour_preview', 'selected', 'manual_building'].includes(app.interactionState)) return;
    if (typeof showTooltip === 'function') showTooltip(event, d);
    if (app.interactionState === 'explore') applyHighlight(d);
}

function nodeMouseOut() {
    if (['tour', 'tour_preview', 'selected', 'manual_building'].includes(app.interactionState)) return;
    if (typeof hideTooltip === 'function') hideTooltip();
    if (app.interactionState === 'explore') resetHighlight();
}

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
    app.node.transition().duration(300).style("opacity", n => connectedNodeIds.has(n.id) ? 1 : opacity);
    app.link.transition().duration(300).style("stroke-opacity", l => connectedLinks.has(l) ? 1 : opacity * 0.5)
        .attr("marker-end", l => { if (!connectedLinks.has(l)) return null; return `url(#arrow-highlighted)`; });
}

function highlightConnection(element, d) { if (!app.simulation) return; }

function resetHighlight(hidePanel = true) {
    if (!hidePanel && ['tour', 'tour_preview', 'selected', 'manual_building'].includes(app.interactionState)) return; 
    app.interactionState = 'explore';
    app.selectedNode = null;
    if (app.node) { app.node.classed("selected", false); app.node.transition().duration(400).style("opacity", 1); }
    if (app.link) {
        app.link.classed("highlighted", false).classed("pulsing", false);
        app.link.transition().duration(400).style("stroke-opacity", 0.6).style("stroke-width", 2)
            .attr("marker-end", d => {
                if (typeof legendData !== 'undefined') {
                     const legend = legendData.find(l => l.type_id === d.type);
                     if (legend && legend.visual_style.includes("one arrow")) return `url(#arrow-${d.type})`;
                }
                return null;
            });
    }
    if (hidePanel) { if (typeof hideInfoPanel === 'function') hideInfoPanel(); }
    d3.select('#graph-container').classed('selection-active', false);
}

function centerViewOnNode(d) {
    if (!d || d.x == null || d.y == null || !app.svg || !app.zoom) return;
    const scale = 1.5; 
    const x = app.width / 2 - d.x * scale;
    const y = app.height / 2 - d.y * scale;
    app.svg.transition().duration(800).ease(d3.easeCubicInOut).call(app.zoom.transform, d3.zoomIdentity.translate(x, y).scale(scale));
}

function resetZoom() {
    if (app.svg && app.zoom) { app.svg.transition().duration(1000).ease(d3.easeCubicInOut).call(app.zoom.transform, d3.zoomIdentity); }
}
