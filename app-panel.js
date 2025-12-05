// --- app-panel.js ---
// VERSION 5: Adds "What's New" link support.

function initializeInfoPanel() {
    d3.select("#info-close").on("click", () => resetHighlight(true)); 
}

function showInfoPanel(d) {
    const infoPanel = d3.select("#info-panel");
    infoPanel.classed("visible", true);
    infoPanel.node().scrollTop = 0; 

    // Header
    infoPanel.select("#info-title").html(
        `<span class="legend-color" style="background-color:${app.categories[d.group].color}; margin-top: 5px;"></span>${d.id}`
    );
    infoPanel.select("#info-category").text(d.group);

    infoPanel.select("#info-level-container").html(
        d.level ? `<span class="text-xs font-semibold inline-block py-1.5 px-3 uppercase rounded-full text-gray-700 bg-gray-100 border border-gray-200">${d.level} Level</span>` : ""
    );

    // Body
    infoPanel.select("#info-description").text(d.description || "No description available.");

    // 1. Support Link
    const linkContainer = infoPanel.select("#info-link-container").html("");
    if (d.supportDocUrl && d.supportDocUrl.trim() !== "") {
        linkContainer.append("a")
            .attr("href", d.supportDocUrl)
            .attr("target", "_blank")
            .attr("class", "text-blue-600 hover:text-blue-800 text-base font-medium block transition")
            .html(`<i class="fas fa-life-ring mr-3"></i> Procore Support & Documentation`);
    }

    // 2. Case Study Link
    const caseStudyContainer = infoPanel.select("#case-study-link-container").html("");
    if (d.caseStudyUrl && d.caseStudyUrl.trim() !== "") { 
        caseStudyContainer.append("a")
            .attr("href", d.caseStudyUrl)
            .attr("target", "_blank")
            .attr("class", "text-orange-600 hover:text-orange-800 text-base font-medium block transition")
            .html(`<i class="fas fa-book-open mr-3"></i> Read Customer Case Study`);
    }

    // 3. NEW: What's New Link
    const whatsNewContainer = infoPanel.select("#whats-new-link-container").html("");
    if (d.whatsNewUrl && d.whatsNewUrl.trim() !== "") { 
        whatsNewContainer.append("a")
            .attr("href", d.whatsNewUrl)
            .attr("target", "_blank")
            .attr("class", "text-indigo-600 hover:text-indigo-800 text-base font-medium block transition")
            .html(`<i class="fas fa-bullhorn mr-3"></i> Review Product Updates`);
    }

    populateConnectionList(d);
}

function populateConnectionList(d) {
    const connections = app.simulation.force("link").links().filter(l => 
        l.source.id === d.id || l.target.id === d.id
    );
    const connectionList = d3.select("#info-connections").html("");

    if (connections.length > 0) {
        connections.forEach(l => {
            const otherNode = l.source.id === d.id ? l.target : l.source;
            const direction = l.source.id === d.id ? 'out' : 'in'; // 'out' if d is Source, 'in' if d is Target
            const connType = legendData.find(t => t.type_id === l.type);

            let arrowIcon = '';
            if (connType) {
                if (connType.visual_style.includes("two arrows")) {
                    // Bi-directional icon
                    arrowIcon = '<i class="fas fa-exchange-alt text-orange-500 mx-3"></i>'; 
                } else if (direction === 'out') {
                    // Outbound/Push icon for one-way flows
                    arrowIcon = '<i class="fas fa-sign-out-alt text-red-500 mx-3"></i>'; 
                } else {
                    // Inbound/Pull icon for one-way flows
                    arrowIcon = '<i class="fas fa-sign-in-alt text-green-500 mx-3"></i>'; 
                }
            }

            const li = connectionList.append("li")
                .attr("data-other-node-id", otherNode.id)
                .attr("data-type", l.type)
                .on("mouseenter", function() { highlightConnection(this, d); }) 
                .on("mouseleave", () => resetHighlight(false)); 

            // Display: Always show (Other Node) Icon (Selected Node)
            li.append("div")
                .attr("class", "flex items-center font-semibold text-gray-800 pointer-events-none group-hover:text-black transition")
                .html(`
                    <span>${otherNode.id}</span>
                    ${arrowIcon}
                    <span>${d.id}</span>
                `);
            
            if (l.dataFlow) {
                li.append("div")
                    .attr("class", "text-sm text-gray-600 mt-2 ml-4 pl-3 border-l-2 border-gray-200 pointer-events-none leading-relaxed")
                    .text(l.dataFlow);
            }
        });

        const aiContainer = d3.select("#ai-explanation-container").html("");
        aiContainer.append("button")
            .attr("id", "ai-explain-btn")
            .attr("class", "w-full mt-4 btn-indigo")
            .html('<i class="fas fa-magic mr-2"></i> Explain These Connections')
            .on("click", () => getAiExplanation(d, connections));
        
        aiContainer.append("div")
            .attr("id", "ai-explanation-content")
            .attr("class", "hidden"); 

    } else {
        connectionList.append("li").text("No direct connections found in current view.");
        d3.select("#ai-explanation-container").html("");
    }
}

function hideInfoPanel() {
    d3.select("#info-panel").classed("visible", false);
    d3.select("#tour-info-box").style("display", "none");
}

async function getAiExplanation(node, connections) {
    const button = d3.select("#ai-explain-btn");
    const contentArea = d3.select("#ai-explanation-content");
    
    button.property("disabled", true).html(`<i class="fas fa-spinner fa-spin mr-2"></i>Analyzing...`);
    contentArea.html("").classed("hidden", false);

    const connectionsText = connections.map(c => {
        const otherNodeId = c.source.id === node.id ? c.target.id : c.source.id;
        const direction = c.source.id === node.id ? "to" : "from";
        return `- Connection ${direction} ${otherNodeId}: ${c.dataFlow}`;
    }).join("\n");

    const userQuery = `As a Procore expert, provide a concise, high-level summary (max 5 sentences) explaining how the "${node.id}" tool works with its connections. Focus on the value of these data flows. Do not just list the connections.
    Connections:
    ${connectionsText}`;
    
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${app.apiKey}`;
    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

        const result = await response.json();
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (text) {
            const htmlContent = text
                .replace(/\n/g, '<br>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); 
            contentArea.html(htmlContent);
        } else {
            throw new Error("No text returned from API.");
        }

    } catch (error) {
        console.error("Gemini API call failed:", error);
        contentArea.html("Sorry, I couldn't generate an explanation at this time. Please try again later.");
    }
    
    button.property("disabled", false).html('<i class="fas fa-magic mr-2"></i> Explain These Connections');
}
