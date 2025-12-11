// --- app-utils.js ---
// VERSION: 57 (SMART ACCORDION & UTILITIES)

// --- Tooltips ---
function showTooltip(e, d) {
    const tooltip = d3.select("#tooltip");
    tooltip.html(`
        <div class="font-bold text-lg mb-1">${d.id}</div>
        <div class="text-sm text-gray-300">${d.description || "No description."}</div>
    `)
    .style("left", (e.pageX + 20) + "px")
    .style("top", (e.pageY - 10) + "px")
    .classed("visible", true);
}

function hideTooltip() {
    d3.select("#tooltip").classed("visible", false);
}

// --- Toasts ---
function showToast(message, duration = 3000) {
    const t = d3.select("#toast-notification");
    t.text(message).classed("show", true);
    setTimeout(() => t.classed("show", false), duration);
}

// --- Layout Toggles ---
function toggleLeftPanel() {
    const leftPanel = d3.select("#controls");
    const expander = d3.select("#left-panel-expander");
    
    // Check if currently hidden
    const isHidden = leftPanel.classed("hidden") || leftPanel.style("opacity") === "0";
    
    if (isHidden) {
        // Show Panel
        leftPanel.classed("hidden", false)
            .style("opacity", 0)
            .style("transform", "translateX(-20px)")
            .transition().duration(300)
            .style("opacity", 1)
            .style("transform", "translateX(0)");
        expander.classed("hidden", true);
    } else {
        // Hide Panel
        leftPanel.transition().duration(300)
            .style("opacity", 0)
            .style("transform", "translateX(-20px)")
            .on("end", () => leftPanel.classed("hidden", true));
        expander.classed("hidden", false);
    }
}

/**
 * SMART ACCORDION LOGIC
 * Handles animation and overflow clipping to prevent ghosting.
 */
function toggleAccordion(item) {
    const content = item.querySelector('.accordion-content');
    const isActive = item.classList.contains('active');

    if (!isActive) {
        // OPENING
        // 1. Close siblings
        const parent = item.parentElement;
        parent.querySelectorAll('.accordion-item.active').forEach(sibling => {
            if (sibling !== item) toggleAccordion(sibling); // Close others
        });

        // 2. Open this one
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 30 + "px"; // Add buffer
        
        // 3. Wait for animation, then allow overflow (for dropdowns)
        setTimeout(() => {
            if (item.classList.contains('active')) {
                content.classList.add('overflow-visible');
            }
        }, 300); // Matches CSS transition time

    } else {
        // CLOSING
        // 1. Immediate clip (Fixes ghosting)
        content.classList.remove('overflow-visible');
        
        // 2. Collapse
        content.style.maxHeight = 0;
        item.classList.remove('active');
    }
}

/**
 * Helper to force open an item (used in onboarding)
 */
function openAccordionItemById(itemId) {
    const item = document.getElementById(itemId);
    if (!item || item.classList.contains('active')) return;
    toggleAccordion(item);
}

// --- Onboarding / Tour Logic ---
let onboardingStep = 0;

function startOnboarding(e) {
    if (e) e.stopPropagation();
    if(typeof resetView === 'function') resetView();
    
    // Reset state
    onboardingStep = 0;
    nextOnboardingStep();
}

function nextOnboardingStep() {
    hideTooltip(); // Clear any existing
    
    const steps = [
        { el: "graph-container", msg: "Welcome to the Procoreverse! This map visualizes how all Procore tools connect.", pos: "center" },
        { el: "search-container", msg: "Find any tool instantly using the search bar.", pos: "right" },
        { el: "tour-accordion", msg: "Use Process Maps to visualize common workflows like RFI to Budget.", pos: "right", action: "tour-accordion" },
        { el: "ai-workflow-builder-btn", msg: "Try the AI Builder! Describe any workflow, and the AI will map it for you.", pos: "right" },
        { el: "filter-accordion", msg: "Configure the scope: Select Regions, Audiences, and Packages.", pos: "right", action: "filter-accordion" },
        { el: "scoping-ui-container", msg: "Use the SOW Generator to estimate implementation timelines and costs.", pos: "right" },
        { el: "view-options-accordion", msg: "Use the Legend to understand connection types and colors.", pos: "right", action: "view-options-accordion" }
    ];

    if (onboardingStep >= steps.length) {
        endOnboarding();
        return;
    }

    const step = steps[onboardingStep];
    
    // Handle auto-opening accordions
    if (step.action) openAccordionItemById(step.action);

    showOnboardingTooltip(step.el, step.msg, step.pos);
    onboardingStep++;
}

function endOnboarding() {
    hideTooltip();
    showToast("You're ready to explore!", 3000);
}

function showOnboardingTooltip(elementId, message, position = 'right') {
    const element = document.getElementById(elementId);
    if (!element) return;

    const tooltip = d3.select("#tooltip");
    const rect = element.getBoundingClientRect();
    const w = window.innerWidth;
    const h = window.innerHeight;
    let top, left;

    // Calculate Position
    if (position === 'center') {
        top = h / 2;
        left = w / 2;
    } else {
        // Right side of element
        top = rect.top + (rect.height / 2);
        left = rect.right + 15;
    }

    const content = `
        <div class="text-base leading-relaxed mb-3">${message}</div>
        <div class="flex justify-between items-center pt-2 border-t border-gray-700">
            <button id="onboarding-skip" class="text-xs text-gray-400 hover:text-white">Skip</button>
            <button id="onboarding-next" class="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1 rounded text-xs font-bold">Next</button>
        </div>`;

    tooltip.html(content)
        .style("top", `${top}px`)
        .style("left", `${left}px`)
        .classed("visible", true);

    // Corrections for alignment
    if (position === 'center') {
        tooltip.style("transform", "translate(-50%, -50%)");
    } else {
        tooltip.style("transform", "translateY(-50%)");
    }

    document.getElementById("onboarding-next").onclick = nextOnboardingStep;
    document.getElementById("onboarding-skip").onclick = endOnboarding;
}
