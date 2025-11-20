// --- app-utils.js ---
// VERSION 8: Final Stable Accordion Logic (Relies on CSS for fixed height).

function showTooltip(e, d) {
    const tooltip = d3.select("#tooltip");
    tooltip.html(`
        <div class="font-bold text-lg mb-1">${d.id}</div>
        <div class="text-sm text-gray-300">${d.description}</div>
    `)
    .style("left", (e.pageX + 20) + "px")
    .style("top", (e.pageY - 10) + "px")
    .classed("visible", true);
}

function hideTooltip() {
    d3.select("#tooltip").classed("visible", false);
}

function showToast(message, duration = 3000) {
    const t = d3.select("#toast-notification");
    t.text(message).classed("show", true);
    setTimeout(() => t.classed("show", false), duration);
}

function toggleLeftPanel() {
    const leftPanel = d3.select("#controls");
    const leftPanelToggle = d3.select("#left-panel-toggle");
    const leftPanelExpander = d3.select("#left-panel-expander");

    const isCurrentlyCollapsed = leftPanel.classed("collapsed");
    leftPanel.classed("collapsed", !isCurrentlyCollapsed);
    leftPanelToggle.attr('title', !isCurrentlyCollapsed ? 'Expand Controls' : 'Collapse Panel');
    leftPanelExpander.classed('hidden', isCurrentlyCollapsed);
}

/**
 * Toggles the state of an accordion item (Main Logic).
 */
function toggleAccordion(item) {
    const isActive = item.classList.contains('active');

    if (!isActive) {
        item.classList.add('active');
        // Let CSS handle the large max-height
    } else {
        item.classList.remove('active');
        // Let CSS handle the max-height: 0
    }
}

/**
 * Opens a specific accordion item by its ID (Used for Onboarding).
 */
function openAccordionItemById(itemId) {
    const item = document.getElementById(itemId);
    if (!item || item.classList.contains('active')) return;
    
    // Just add the class, CSS handles the rest
    item.classList.add('active');
}

// --- Onboarding (Interface Tour) Logic ---
let onboardingStep = 0;

function startOnboarding(e) {
    if (e) e.stopPropagation();
    if (app.interactionState !== 'explore') resetHighlight();
    d3.select("#help-button").classed('initial-pulse', false);
    onboardingStep = 0;
    nextOnboardingStep();
}

function nextOnboardingStep() {
    hideTooltip();
    switch (onboardingStep) {
        case 0:
            showOnboardingTooltip("graph-container", "Welcome to the Procoreverse Simulator! This map visualizes how all Procore tools connect and share data. You can zoom and drag the map.", "center");
            break;
        case 1:
            showOnboardingTooltip("graph-container", "Hover over a tool (hexagon) to preview connections. Click a tool to lock the selection and view details in the right panel.", "center");
            break;
        case 2:
            showOnboardingTooltip("search-container", "Looking for a specific tool? Use the search bar to find and center it instantly.", "right");
            break;
        case 3:
            openAccordionItemById('tour-accordion');
            showOnboardingTooltip("tour-container", "Use Guided Tours to visualize common construction workflows step-by-step.", "right");
            break;
        case 4:
            showOnboardingTooltip("ai-workflow-builder-btn", "Try the AI Builder! Describe any workflow in plain English, and the AI will generate a custom tour for you.", "right");
            break;
        case 5:
            openAccordionItemById('filter-accordion');
            showOnboardingTooltip("filter-accordion", "Focus the map by filtering tools relevant to specific regional packages, personas, or audiences.", "right");
            break;
        case 6:
            openAccordionItemById('view-options-accordion');
            showOnboardingTooltip("view-options-accordion", "Toggle categories on or off to simplify the view and consult the connection legend here.", "right");
            break;
        default:
            endOnboarding();
    }
    onboardingStep++;
}

function endOnboarding() {
    hideTooltip();
}

function showOnboardingTooltip(elementId, message, position = 'right') {
    const element = document.getElementById(elementId);
    if (!element) return;

    const tooltip = d3.select("#tooltip");
    const rect = element.getBoundingClientRect();
    const w = window.innerWidth;
    const h = window.innerHeight;
    let top, left;

    if (position === 'right') {
        top = rect.top + rect.height / 2;
        left = rect.right + 20;
    } else if (position === 'center') {
        top = h / 2;
        left = w / 2;
    }

    const content = `
        <div class="text-base leading-relaxed">${message}</div>
        <div class="tooltip-buttons">
            <button id="onboarding-skip">Skip Tour</button>
            <button id="onboarding-next">Next</button>
        </div>`;

    tooltip.html(content)
        .style("top", `${top}px`)
        .style("left", `${left}px`)
        .classed("visible", true);

    if (position === 'right') {
        tooltip.style("transform", "translateY(-50%)");
    } else if (position === 'center') {
        tooltip.style("transform", "translate(-50%, -50%)");
    }

    d3.select("#onboarding-next").on("click", nextOnboardingStep);
    d3.select("#onboarding-skip").on("click", endOnboarding);
}
