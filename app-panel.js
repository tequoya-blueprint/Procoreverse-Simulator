// --- app-panel.js ---
// Manages the right-side info panel, including populating data
// and handling AI explanations.

/**
 * Initializes the info panel event listeners.
 */
function initializeInfoPanel() {
    d3.select("#info-close").on("click", resetHighlight);
}

/**
 * Shows and populates the info panel with data from the selected node.
 * @param {Object} d - The node data object.
 */
function showInfoPanel(d) {
    const infoPanel = d3.select("#info-panel");
    infoPanel.classed("visible", true);

    // --- Populate Header ---
    infoPanel.select("#info-title").html(
        `<span class="legend-color" style="background-color:${app.categories[d.group].color}; margin-top: 5px;"></span>${d.id}`
    );
    infoPanel.select("#info-category").text(d.group);

    // Level Badge
    infoPanel.select("#info-level-container").html(
        d.level ? `<span class="text-xs font-semibold inline-block py-1.5 px-3 uppercase rounded-full text-gray-700 bg-gray-100 border border-gray-200">${d.level} Level</span>` : ""
    );

    // --- Populate Body ---
    infoPanel.select("#info-description").text(d.description || "No description available.");

    // Support Link
    const linkContainer = infoPanel.select("#info-link-container").html("");
    if (d.supportUrl) {
        linkContainer.append("a")
            .attr("href", d.supportUrl)
            .attr("target", "_blank")
            .attr("class", "text-blue-600 hover:text-blue-800 text-base font-medium block transition")
            .html(`<i class="fas fa-life-ring mr-3"></i> Procore Support & Documentation`);
    }

    // Case Study Link
    const caseStudyContainer = infoPanel.select("#case-study-link-container").html("");
    if (d.caseStudyUrl) { // Note: Your node data doesn't have this yet, but this adds support
        caseStudyContainer.append("a")
            .attr("href", d.caseStudyUrl)
            .attr("target", "_blank")
            .attr("class", "text-orange-600 hover:text-orange-800 text-base font-medium block transition")
            .html(`<i class="fas fa-book-open mr-3"></i> Read Customer Case Study`);
    }

    // --- Populate Connections ---
    populateConnectionList(d);
}

/**
 * Populates the connections list in the info panel for the selected node.
 * @param {Object} d - The node data object.
 */
function populateConnectionList(d) {
    const connections = app.simulation.force("link").links().filter(l => 
        l.source.id === d.id || l.target.id === d.id
    );
    const connectionList = d3.select("#info-connections").html("");

    if (connections.length > 0) {
        connections.forEach(l => {
            const otherNode = l.source.id === d.id ? l.target : l.source;
            const direction = l.source.id === d.id ? 'out' : 'in';
            const connType = connectionTypes.find(t => t.id === l.type);

            // Determine arrow icon
            let arrowIcon = '';
            if (connType) {
                if (connType.id === 'sync-bi' || connType.id === 'create_link_bi') {
                    arrowIcon = '<i class="fas fa-exchange-alt text-orange-500 mx-3"></i>';
                } else if (direction === 'out') {
                    arrowIcon = '<i class="fas fa-long-arrow-alt-right text-orange-500 mx-3"></i>';
                } else {
                    arrowIcon = '<i class="fas fa-long-arrow-alt-left text-orange-500 mx-3"></i>';
                }
            }

            const li = connectionList.append("li")
                .attr("data-other-node-id", otherNode.id)
                .attr("data-type", l.type)
                .on("mouseenter", function() { highlightConnection(this, d); })
                .on("mouseleave", () => resetHighlight(false)); // Don't hide panel

            // Title (e.g., Budget --> Commitments)
            li.append("div")
                .attr("class", "flex items-center font-semibold text-gray-800 pointer-events-none group-hover:text-black transition")
                .html(direction === 'out' ?
                    `<span>${d.id}</span>${arrowIcon}<span>${otherNode.id}</span>` :
                    `<span>${otherNode.id}</span>${arrowIcon}<span>${d.id}</span>`
                );
            
            // Dataflow Description
            if (l.dataFlow) {
                li.append("div")
                    .attr("class", "text-sm text-gray-600 mt-2 ml-4 pl-3 border-l-2 border-gray-200 pointer-events-none leading-relaxed")
                    .text(l.dataFlow);
            }
        });

        // --- AI Explanation Button ---
        const aiContainer = d3.select("#ai-explanation-container").html("");
        aiContainer.append("button")
            .attr("id", "ai-explain-btn")
            .attr("class", "w-full mt-4 btn-indigo")
            .html('<i class="fas fa-magic mr-2"></i> Explain These Connections')
            .on("click", () => getAiExplanation(d, connections));
        
        aiContainer.append("div")
            .attr("id", "ai-explanation-content")
            .attr("class", "hidden"); // Hidden by default

    } else {
        connectionList.append("li").text("No direct connections found in current view.");
        d3.select("#ai-explanation-container").html(""); // Clear AI button
    }
}

/**
 * Hides the info panel.
 */
function hideInfoPanel() {
    d3.select("#info-panel").classed("visible", false);
    d3.select("#tour-info-box").style("display", "none");
}

/**
 * Calls the Gemini AI API to get an explanation of connections.
 * @param {Object} node - The selected node data.
 * @param {Array} connections - The list of connection link objects.
 */
async function getAiExplanation(node, connections) {
    const button = d3.select("#ai-explain-btn");
    const contentArea = d3.select("#ai-explanation-content");
    
    button.property("disabled", true).html(`<i class="fas fa-spinner fa-spin mr-2"></i>Analyzing...`);
    contentArea.html("").classed("hidden", false); // Show and clear

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
            body: JSON.stringify({ contents: [{ parts: [{ text: userQuery }] }] })
        });

        if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

        const result = await response.json();
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

        if (text) {
            // Basic markdown conversion
            const htmlContent = text
                .replace(/\n/g, '<br>')
                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>'); // Bold
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
