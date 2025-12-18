// --- app-controls.js ---
// VERSION: 900 (CURRENCY LOGIC + REGION LABEL UPDATE)

// --- REGIONAL CONFIGURATION (SOURCE OF TRUTH) ---
const REGIONAL_CONFIG = {
    "EMEA": {
        "label": "Europe",
        "legal_entity": "Procore Technologies, Inc.",
        "jurisdiction": "England",
        "currency": "GBP",
        "tax_term": "VAT",
        "data_protection": "GDPR Compliant",
        "exclusions": ["Procore Pay", "Procore Construction Network", "Premier Bronze Support"],
        "dictionary": {
            "Bidding": "Tendering",
            "Change Events": "Variations",
            "Daily Log": "Site Diary",
            "Schedule": "Programme",
            "ERP Connectors": "Accounting Integrations",
            "Bid Board": "Tender Board",
            "Punch List": "Snag List",
            "Prime Contracts": "Main Contract",
            "T&M Tickets": "Daywork Sheets"
        }
    },
    "APAC": {
        "label": "APAC",
        "legal_entity": "Procore Technologies, Inc.",
        "jurisdiction": "Australia",
        "currency": "AUD",
        "tax_term": "GST",
        "data_protection": "Standard Privacy",
        "exclusions": ["Procore Pay", "Procore Construction Network", "Premier Bronze Support"],
        "dictionary": {
            "Bidding": "Tendering",
            "Change Events": "Variations",
            "Daily Log": "Site Diary",
            "Schedule": "Programme",
            "ERP Connectors": "Accounting Integrations",
            "Bid Board": "Tender Board",
            "Punch List": "Defect List",
            "Prime Contracts": "Main Contract",
            "T&M Tickets": "Daywork Sheets",
            "Crews": "Site Teams"
        }
    },
    "NAMER": {
        "label": "NAMER (North America)", // <--- UPDATED LABEL
        "legal_entity": "Procore Technologies, Inc.",
        "jurisdiction": "Delaware",
        "currency": "USD",
        "tax_term": "Tax",
        "data_protection": "Standard",
        "exclusions": [],
        "dictionary": {}
    }
};

// --- TEAM CONFIGURATION RULES (RBAC) ---
const TEAM_CONFIG = {
    admin: { 
        showTours: true, showAiBuilder: true, showManualBuilder: true, 
        showScoping: true, calculatorMode: 'edit',
        showFilters: true, showLegend: true, defaultOpen: 'view-options-accordion' 
    },
    enablement: { 
        showTours: true, showAiBuilder: true, showManualBuilder: true, 
        showScoping: false, calculatorMode: 'hidden',
        showFilters: true, showLegend: true, defaultOpen: 'view-options-accordion' 
    },
    sales: { 
        showTours: true, showAiBuilder: false, showManualBuilder: false, 
        showScoping: true, calculatorMode: 'view', // VIEW ONLY
        showFilters: true, showLegend: true, defaultOpen: 'view-options-accordion' 
    },
    product: { 
        showTours: true, showAiBuilder: true, showManualBuilder: true, 
        showScoping: false, calculatorMode: 'hidden',
        showFilters: true, showLegend: true, defaultOpen: 'view-options-accordion' 
    },
    services: { 
        showTours: true, showAiBuilder: true, showManualBuilder: true, 
        showScoping: true, calculatorMode: 'edit', // FULL EDIT
        showFilters: true, showLegend: true, defaultOpen: 'scoping-ui-container' 
    }
};

function getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// --- DATA MAPPING CONSTANTS ---
const audienceKeyToDataValuesMap = {
    "GC": ["Contractor", "General Contractor", "GC"],
    "SC": ["SC", "Specialty Contractor"],
    "O": ["Owners", "Owner", "Owner Developer *Coming Soon", "O"],
    "RM": ["Resource Management"] 
};

const audienceDataToKeyMap = {
    "Contractor": "GC", "General Contractor": "GC", "GC": "GC",
    "SC": "SC", "Specialty Contractor": "SC",
    "Owners": "O", "Owner": "O", "Owner Developer *Coming Soon": "O", "O": "O", 
    "Resource Management": "RM"
};

const audienceKeyToLabelMap = {
    "GC": "General Contractor",
    "SC": "Specialty Contractor",
    "O": "Owner",
    "RM": "Resource Management"
};

// --- STACK PRESETS (RAPID SCOPING) ---
const STACK_PRESETS = {
    "legacy": { 
        label: "Legacy Procore (PM Only)", 
        // Note: "Meetings" is the correct Node ID
        tools: ["Drawings", "RFIs", "Submittals", "Directory", "Photos", "Daily Log", "Meetings"] 
    },
    "competitor_a": { 
        label: "Competitor Replacement (Field)", 
        tools: ["Drawings", "Photos", "Punch List", "Inspections", "Observations"] 
    },
    "manual": { 
        label: "Manual / Excel Warrior", 
        tools: ["Emails", "Documents", "Directory"] 
    },
    "finance": {
        label: "ERP / Finance Focus",
        tools: ["Budget", "Commitments", "Direct Costs", "Invoicing", "ERP Connectors"]
    }
};

// --- SOW QUESTIONNAIRE CONFIGURATION ---
const SOW_QUESTIONS = [
    { id: "q-sop", label: "SOP Development", type: "cost", hrs: 140, cost: 35000, module: "MOD_SOP" },
    { id: "q-consulting", label: "Virtual Consulting", type: "cost", hrs: 400, cost: 100000, module: "MOD_CONSULTING" },
    { id: "q-admin", label: "Project Admin", type: "cost", hrs: 140, cost: 35000, module: "MOD_ADMIN" },
    { id: "q-integration", label: "Integration Consulting", type: "cost", hrs: 25, cost: 6250, module: "MOD_INTEGRATION" },
    { id: "q-custom", label: "Custom Solutions", type: "cost", hrs: 40, cost: 10000, module: "MOD_CUSTOM" },
    
    // Risk Factors (Modifiers)
    { id: "q-financials", label: "Complex Finance", type: "risk", factor: 0.3, target: "data" },
    { id: "q-ent", label: "Enterprise Scale", type: "risk", factor: 0.2, target: "change" }
];

// --- SOW TEMPLATE LIBRARY (FULL TEXT) ---
const SOW_LIBRARY = {
    "MOD_SOP": {
        title: "STANDARD OPERATING PROCEDURE (SOP) SERVICES",
        body: `
        <p>Provider will provide up to one-hundred forty (140) hours towards developing Client Standard Operating Procedures with Provider's Strategic Product Consultants (SPCs) and one (1) named Training Management Specialist.</p>
        <p><strong>Included Services:</strong></p>
        <ul>
            <li>Planning & discovery to align on timelines and outcomes.</li>
            <li>Virtual consultation services to provide guidance on SOPs and best practices.</li>
            <li>Documentation of SOPs within the Provider's training/knowledge center product.</li>
            <li>General Q&A with Client’s internal team.</li>
        </ul>
        <p><strong>Exclusions:</strong> Ongoing SOP management greater than 140 hours; Data entry; Staff augmentation.</p>
        `
    },
    "MOD_CONSULTING": {
        title: "VIRTUAL CONSULTING SERVICES",
        body: `
        <p>Provider will provide up to four-hundred (400) additional hours of Virtual Consulting Services. These hours are led by Strategic Product Consultants.</p>
        <p><strong>Usage:</strong></p>
        <ul>
            <li>Additional training sessions and deep dives on standard toolsets.</li>
            <li>Expert review of Client’s systems, processes, and operations.</li>
            <li>Usage monitoring and reviews with Client’s key stakeholders.</li>
            <li>Project administration duties, including coordination, planning, and management of project execution.</li>
        </ul>
        <p><strong>Expiration:</strong> Consulting hours must be used within thirty-six (36) months of service start date.</p>
        `
    },
    "MOD_TRAINING": {
        title: "ONSITE TRAINING SERVICES",
        body: `
        <p>Provider will provide fifteen (15) days of onsite training led by an Implementation Manager or Strategic Consultant. Generally, four (4) weeks advance notice is required for scheduling.</p>
        <p><strong>Anticipated Schedule:</strong></p>
        <ol>
            <li><strong>Kickoff, Discovery and Planning Workshop (3 Days):</strong> To set project expectations and outline a project plan.</li>
            <li><strong>SOP End-User Trainings (6 Days):</strong> "Train the Trainer" workshops informed by the SOPs being developed.</li>
            <li><strong>Business Health Checks (6 Days):</strong> Stakeholder meetings to review milestone status and adoption progress.</li>
        </ol>
        <p><strong>Terms:</strong> Includes expenses. Limited to twenty (20) Client participants per session.</p>
        `
    },
    "MOD_INTEGRATION": {
        title: "INTEGRATION CONSULTING",
        body: `
        <p>Provider will provide up to twenty-five (25) hours of virtual Integration Consulting led by a Solutions Architect to assist with scoping and planning for Client’s anticipated integrations.</p>
        <p><strong>Included Services:</strong></p>
        <ul>
            <li>Integration discovery and planning for the tool suite.</li>
            <li>Guidance on integration best practices.</li>
            <li>Virtual Developer training on webhooks, authentication, or REST web services.</li>
            <li>Data migration feasibility analysis and guidance.</li>
        </ul>
        <p><strong>Exclusions:</strong> Actual integration code development.</p>
        `
    },
    "MOD_CUSTOM": {
        title: "CUSTOM SOLUTIONS",
        body: `
        <p>Provider will provide up to forty (40) hours for custom form and workflow development.</p>
        <p><strong>Scope:</strong></p>
        <ul>
            <li>Customizing PDF item outputs.</li>
            <li>Creation of custom tools and custom workflows.</li>
        </ul>
        <p><strong>IP Rights:</strong> Any intellectual property created shall be owned solely by Provider, provided that Client is granted a non-exclusive right to use any custom forms/tools solely for internal business purposes.</p>
        <p><strong>Expiration:</strong> Custom solutions hours must be used within twelve (12) months of service start date.</p>
        `
    },
    "MOD_ADMIN": {
        title: "PROJECT ADMINISTRATION",
        body: `
        <p>An Implementation Manager (IM) will be assigned for up to 140 virtual hours to partner with consultants in overseeing deliverables, timelines, and resource allocation.</p>
        <p><strong>Responsibilities:</strong></p>
        <ul>
            <li>Coordinating services, deliverables, and resource scheduling.</li>
            <li>Driving milestone progress in the Project Plan.</li>
            <li>Progress calls, coaching, and KPI monitoring.</li>
            <li>Evaluation and guidance on developing Standard Operating Procedures.</li>
        </ul>
        `
    }
};

// --- INITIALIZATION ---
function initializeControls() {
    if (typeof app !== 'undefined') {
        app.customScope = new Set();
        if (!app.state) app.state = {};
        if (!app.state.myStack) app.state.myStack = new Set();
        app.state.calculatorMode = 'edit'; 
    }
    
    // Accordion Setup
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => { if(typeof toggleAccordion === 'function') toggleAccordion(header.parentElement); });
    });

    populateRegionFilter(0); 
    populatePersonaFilter();
    renderSOWQuestionnaire();
    injectControlsFooter(); 
   
    // Filter Listeners
    d3.select("#region-filter").on("change", onRegionChange);
    d3.select("#audience-filter").on("change", onAudienceChange);
    d3.select("#package-filter").on("change", onPackageChange); 
    d3.select("#persona-filter").on("change", () => { if (typeof updateGraph === 'function') updateGraph(true) });
    
    // Procore-Led Toggle
    const ledToggle = d3.select("#toggle-procore-led");
    if (!ledToggle.empty()) {
        ledToggle.on("change", function() {
            if (typeof app !== 'undefined') app.state.showProcoreLedOnly = this.checked;
            if (typeof updateGraph === 'function') updateGraph(true);
        });
    }
   
    populateCategoryFilters();
    d3.select("#toggle-categories").on("click", toggleAllCategories);
    d3.select("#toggle-legend").on("click", toggleAllConnections);
    d3.select("#search-input").on("input", handleSearchInput);
    
    const teamSelector = d3.select("#team-selector");
    if (!teamSelector.empty()) {
        const initialTeam = getUrlParam('team') || 'admin'; 
        if (TEAM_CONFIG[initialTeam]) {
            teamSelector.property('value', initialTeam);
            setTimeout(() => applyTeamView(initialTeam), 100);
        }
        teamSelector.on("change", function() { applyTeamView(this.value); });
    }

    d3.select("body").on("click", (e) => {
        if (e.target && !document.getElementById('search-container').contains(e.target)) {
            d3.select("#search-results").html("").style("opacity", 0).style("transform", "scale(0.95)");
        }
    });

    d3.select("#help-button").on("click", startOnboarding);
    d3.select("#left-panel-toggle").on("click", toggleLeftPanel);
    d3.select("#left-panel-expander").on("click", toggleLeftPanel);
    
    // Credits Modal Logic
    const creditsOverlay = document.getElementById('credits-modal-overlay');
    if(creditsOverlay) {
        d3.select("#credits-modal-close").on("click", () => creditsOverlay.classList.remove('visible'));
    }

    // DEMO MODE LISTENER (Shift + D)
    document.addEventListener('keydown', function(event) {
        if (event.shiftKey && (event.key === 'D' || event.key === 'd')) {
            toggleDemoMode();
        }
    });

    const inputs = ['slider-maturity', 'slider-data', 'slider-change', 'onsite-input'];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.addEventListener('input', calculateScoping);
    });
    
    setTimeout(() => {
        const existingBtn = d3.select("#stack-builder-btn");
        if (existingBtn.empty()) {
             const container = d3.select("#packaging-container"); 
             if (!container.empty()) {
                container.insert("button", ":first-child")
                    .attr("id", "stack-builder-btn")
                    .attr("class", "w-full mb-4 font-bold py-2 px-4 rounded shadow transition ease-in-out duration-150 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50")
                    .html('<i class="fas fa-layer-group mr-2 text-green-600"></i> Define Customer Stack')
                    .on("click", toggleStackBuilderMode);
             }
        }
    }, 500);
}

// --- NEW: DYNAMIC FOOTER INJECTION ---
function injectControlsFooter() {
    const controls = d3.select("#controls");
    
    // Clean up any existing footer elements to prevent duplicates
    controls.select("#reset-view").remove();
    controls.select("#demo-toggle-btn").remove();
    controls.select("#version-link").remove();
    controls.select(".pt-5.mt-5.border-t").remove();

    // Create container
    const footer = controls.append("div")
        .attr("class", "pt-5 mt-5 border-t border-gray-100 flex-shrink-0 space-y-3");

    // 1. Reset Button (Full Width)
    footer.append("button")
        .attr("id", "reset-view")
        .attr("class", "w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg text-sm transition shadow-md")
        .html('<i class="fas fa-sync-alt mr-2"></i> Reset View')
        .on("click", resetView);

    // 2. Presentation Mode Toggle (Full Width)
    footer.append("button")
        .attr("id", "demo-toggle-btn")
        .attr("class", "w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg text-xs transition flex items-center justify-center")
        .html('<i class="fas fa-desktop mr-2"></i> Presentation Mode: OFF')
        .on("click", toggleDemoMode);

    // 3. Version Link (Centered)
    footer.append("div")
        .attr("class", "text-center")
        .append("a")
        .attr("href", "#")
        .attr("id", "version-link")
        .attr("class", "text-[10px] text-gray-400 hover:text-gray-600 font-mono no-underline")
        .text("v2.3 Localized")
        .on("click", (e) => {
            e.preventDefault();
            const modal = document.getElementById('credits-modal-overlay');
            if(modal) modal.classList.add('visible');
        });
}

// --- DEMO MODE TOGGLE ---
function toggleDemoMode() {
    const body = d3.select("body");
    const isDemo = body.classed("demo-mode-active");
    const btn = d3.select("#demo-toggle-btn");
    
    if (isDemo) {
        // DISABLE
        body.classed("demo-mode-active", false);
        d3.select("#scoping-ui-container").style("display", "block"); 
        d3.select("#ai-workflow-builder-btn").style("display", "block");
        d3.select("#manual-workflow-builder-btn").style("display", "block");
        d3.select("#team-selector").property("disabled", false).style("opacity", 1);
        
        // Visuals
        btn.classed("bg-green-600 hover:bg-green-700 text-white", false)
           .classed("bg-gray-200 hover:bg-gray-300 text-gray-700", true);
        btn.html('<i class="fas fa-desktop mr-2"></i> Presentation Mode: OFF');
        
        if(typeof showToast === 'function') showToast("Demo Mode Deactivated.");
    } else {
        // ENABLE
        body.classed("demo-mode-active", true);
        d3.select("#scoping-ui-container").style("display", "none"); 
        d3.select("#ai-workflow-builder-btn").style("display", "none"); 
        d3.select("#manual-workflow-builder-btn").style("display", "none"); 
        
        // Force Admin view to ensure graph elements are visible
        applyTeamView('admin'); 
        d3.select("#team-selector").property("disabled", true).style("opacity", 0.5);
        
        // Visuals
        btn.classed("bg-gray-200 hover:bg-gray-300 text-gray-700", false)
           .classed("bg-green-600 hover:bg-green-700 text-white", true);
        btn.html('<i class="fas fa-desktop mr-2"></i> Presentation Mode: ON');
        
        if(typeof showToast === 'function') showToast("Demo Mode Active.");
    }
}

// --- CUSTOM SCOPE MANAGER ---
function toggleCustomScopeItem(nodeId) {
    if (!app || !app.customScope) return;
    if (app.customScope.has(nodeId)) {
        app.customScope.delete(nodeId);
        if(typeof showToast === 'function') showToast(`Removed ${nodeId} from Custom Scope`);
    } else {
        app.customScope.add(nodeId);
        if(typeof showToast === 'function') showToast(`Added ${nodeId} to Custom Scope`);
    }
    if (typeof updateGraph === 'function') updateGraph(false); 
    calculateScoping();
}

// --- GAP ANALYSIS V2 MANAGER ---
function toggleStackBuilderMode() {
    if (d3.select("#region-filter").property("value") === "all") {
        if(typeof showToast === 'function') showToast("Please select a Region first.", 3000);
        return;
    }

    app.state.isBuildingStack = !app.state.isBuildingStack;
    
    let btn = d3.select("#stack-builder-btn");
    
    if (app.state.isBuildingStack) {
        // --- ACTIVATE BUILDER MODE ---
        app.interactionState = 'building_stack';
        
        btn.classed("bg-green-600 hover:bg-green-700 text-white border-green-700", true)
           .classed("bg-white text-gray-700 border-gray-300 hover:bg-gray-50", false)
           .html('<i class="fas fa-check-circle mr-2"></i> Done Selecting Tools');
        
        if(typeof showToast === 'function') showToast("Builder Active: Click tools the customer CURRENTLY owns.", 4000);
        
        // --- NEW: INJECT PRESET DROPDOWN ---
        const presetContainer = d3.select("#packaging-container").insert("div", "#stack-builder-btn + *")
            .attr("id", "stack-preset-container")
            .attr("class", "mb-4 p-3 bg-green-50 rounded border border-green-200");
            
        presetContainer.append("label").attr("class", "block text-xs font-bold text-green-800 mb-1 uppercase").text("Quick Stack Presets");
        
        const select = presetContainer.append("select")
            .attr("class", "w-full text-xs border-green-300 rounded p-1.5 focus:ring-green-500 focus:border-green-500 bg-white")
            .on("change", function() {
                const key = this.value;
                if (key === 'none') return;
                applyStackPreset(key);
            });
            
        select.append("option").attr("value", "none").text("Select a Starting Point...");
        Object.entries(STACK_PRESETS).forEach(([key, data]) => {
            select.append("option").attr("value", key).text(data.label);
        });

        d3.selectAll(".node").transition().duration(300).style("opacity", 0.4);
        highlightOwnedNodes();
        
    } else {
        // --- DEACTIVATE BUILDER MODE ---
        app.interactionState = 'explore';
        
        btn.classed("bg-green-600 hover:bg-green-700 text-white border-green-700", false)
           .classed("bg-white text-gray-700 border-gray-300 hover:bg-gray-50", true)
           .html('<i class="fas fa-layer-group mr-2 text-green-600"></i> Define Customer Stack');
        
        // Remove Preset Dropdown
        d3.select("#stack-preset-container").remove();
        
        // Return to normal view
        if (typeof updateGraph === 'function') updateGraph(true);
        if (app.state.myStack.size > 0 && typeof showToast === 'function') {
            showToast("Stack Saved! Select a Package to see Gaps.", 3000);
            calculateScoping(); // Triggers Gap Check
        }
    }
}

function applyStackPreset(key) {
    if (!STACK_PRESETS[key]) return;
    const tools = STACK_PRESETS[key].tools;
    app.state.myStack.clear();
    tools.forEach(toolId => app.state.myStack.add(toolId));
    highlightOwnedNodes();
    if(typeof showToast === 'function') showToast(`Applied ${STACK_PRESETS[key].label}`);
}

function toggleStackItem(d) {
    if (!app.state.myStack) app.state.myStack = new Set();
    
    if (app.state.myStack.has(d.id)) {
        app.state.myStack.delete(d.id);
    } else {
        app.state.myStack.add(d.id);
    }
    highlightOwnedNodes();
}

function highlightOwnedNodes() {
    if (!app.node) return;
    
    app.node.transition().duration(200)
        .style("opacity", d => app.state.myStack.has(d.id) ? 1 : 0.4) 
        .style("filter", d => app.state.myStack.has(d.id) ? "drop-shadow(0 0 6px rgba(77, 164, 70, 0.6))" : "none") // Brand Green
        .select("path")
        .style("stroke", d => app.state.myStack.has(d.id) ? "#4da446" : "#fff") // Brand Green
        .style("stroke-width", d => app.state.myStack.has(d.id) ? 3 : 1);
}

// UPDATED LOGIC: Calculates Gap, Matched, and OUTLIERS
function getGapAnalysis() {
    const filters = getActiveFilters(); 
    const targetPackageTools = filters.packageTools || new Set();
    
    const owned = app.state.myStack || new Set();
    
    const gap = new Set();      // In Package, NOT Owned (Upsell)
    const matched = new Set();  // In Package, AND Owned (Safe)
    const outlier = new Set();  // NOT in Package, BUT Owned (Legacy/Extra)
    
    if (targetPackageTools.size > 0) {
        targetPackageTools.forEach(toolId => {
            if (owned.has(toolId)) {
                matched.add(toolId);
            } else {
                gap.add(toolId);
            }
        });
        
        // Calculate Outliers
        owned.forEach(toolId => {
            if (!targetPackageTools.has(toolId)) {
                outlier.add(toolId);
            }
        });
    }
    
    return { owned, gap, matched, outlier, target: targetPackageTools };
}

// --- SOW V2: COMPLEXITY & T-SHIRT SIZING ---
function setComplexity(level) {
    // Only allow if not in Read-Only mode
    if (app.state.calculatorMode === 'view') {
        if(typeof showToast === 'function') showToast("View Only: Complexity cannot be edited.");
        return;
    }

    const map = {
        'standard': { mat: 1.0, data: 1.0, change: 1.0 },
        'complex': { mat: 1.4, data: 1.5, change: 1.3 },
        'transform': { mat: 1.8, data: 2.0, change: 1.8 }
    };
    const vals = map[level];
    if (vals) {
        document.getElementById('slider-maturity').value = vals.mat;
        document.getElementById('slider-data').value = vals.data;
        document.getElementById('slider-change').value = vals.change;
        calculateScoping();
        // Update Button States
        d3.selectAll('.complexity-btn').classed('bg-indigo-600 text-white', false).classed('bg-gray-200 text-gray-700', true);
        d3.select(`#btn-${level}`).classed('bg-gray-200 text-gray-700', false).classed('bg-indigo-600 text-white', true);
    }
}

function renderSOWQuestionnaire() {
    const revenueContainer = d3.select("#revenue-container");
    if(revenueContainer.empty()) return;

    revenueContainer.attr("class", "block w-full pt-2 border-t border-gray-200");
    revenueContainer.html("");
    
    // --- GAP PRICING TOGGLE (DYNAMIC) ---
    revenueContainer.append("div")
        .attr("id", "gap-pricing-toggle-container")
        .attr("class", "mb-3 hidden bg-orange-50 p-2 rounded border border-orange-200");

    // --- COMPLEXITY BUTTONS (SOW V2) ---
    const complexityDiv = revenueContainer.append("div").attr("class", "mb-3 flex gap-2");
    ['Standard', 'Complex', 'Transform'].forEach(label => {
        const key = label.toLowerCase();
        complexityDiv.append("button")
            .attr("id", `btn-${key}`)
            .attr("class", `complexity-btn flex-1 py-1 text-[10px] font-bold uppercase rounded transition ${key === 'standard' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`)
            .text(label)
            .on("click", () => setComplexity(key));
    });

    const settingsGroup = revenueContainer.append("div").attr("class", "mb-1 w-full");
    const onsiteRow = settingsGroup.append("div").attr("class", "mb-3 border-b border-gray-100 pb-3");
    onsiteRow.append("label").attr("class", "text-[10px] font-bold text-gray-500 uppercase block mb-1").text("On-Site Visits ($7.5k each)");
    onsiteRow.append("input")
        .attr("type", "number")
        .attr("id", "onsite-input")
        .attr("value", "0")
        .attr("min", "0")
        .attr("class", "w-full p-1.5 text-sm border rounded text-center bg-white focus:ring-indigo-500 focus:border-indigo-500")
        .on("input", calculateScoping);
    
    settingsGroup.append("div").attr("class", "text-[10px] font-bold text-gray-500 uppercase mb-2").text("Service Qualifiers");
    const gridDiv = settingsGroup.append("div").attr("class", "grid grid-cols-2 gap-x-2 gap-y-2 w-full");
    
    SOW_QUESTIONS.forEach(q => {
        const label = gridDiv.append("label").attr("class", "flex items-start cursor-pointer hover:bg-gray-100 rounded p-1 w-full");
        
        label.append("input")
            .attr("type", "checkbox")
            .attr("id", q.id)
            .attr("class", "form-checkbox h-3.5 w-3.5 text-indigo-600 sow-question rounded mt-0.5 flex-shrink-0 focus:ring-indigo-500")
            .on("change", calculateScoping);
        
        const textCol = label.append("div").attr("class", "ml-2 flex flex-col min-w-0");
        textCol.append("span").attr("class", "text-[11px] text-gray-700 font-medium leading-tight truncate").text(q.label).attr("title", q.label);
        
        if (q.type === 'cost') {
             textCol.append("span").attr("class", "text-[9px] text-gray-400 mt-0.5").text("+$" + (q.cost/1000) + "k");
        }
    });
    
    // --- PRINT BUTTON MOVED TO TOTAL BOX ---
    const totalBox = d3.select("#sow-total").select(function() { return this.parentNode; });
    if (!totalBox.empty()) {
        totalBox.select("#print-sow-mini-btn").remove(); 
        
        totalBox.append("button")
            .attr("id", "print-sow-mini-btn")
            .attr("class", "w-full mt-3 bg-indigo-700 hover:bg-indigo-600 text-white font-semibold py-1.5 rounded text-[11px] flex items-center justify-center transition shadow-sm border border-indigo-600")
            .html('<i class="fas fa-print mr-2"></i> Print Estimate')
            .on("click", generateSOWPrintView);
    }

    setTimeout(refreshAccordionHeight, 50);
}

// --- SCOPING CALCULATOR (WITH SMART GAP LOGIC) ---
function calculateScoping() {
    // 1. Setup & Permissions
    const isViewOnly = (app.state.calculatorMode === 'view');
    const sliderMaturity = document.getElementById('slider-maturity');
    if (sliderMaturity) {
        ['slider-maturity','slider-data','slider-change','onsite-input'].forEach(id => { 
            const el = document.getElementById(id); if(el) el.disabled = isViewOnly; 
        });
        d3.selectAll('.sow-question').property('disabled', isViewOnly);
        d3.selectAll('.complexity-btn').classed('opacity-50 cursor-not-allowed', isViewOnly);
    }
    if (!sliderMaturity) return;

    // 2. Read Risk Factors
    let mat = parseFloat(sliderMaturity.value); 
    let data = parseFloat(document.getElementById('slider-data').value); 
    let change = parseFloat(document.getElementById('slider-change').value);

    SOW_QUESTIONS.filter(q => q.type === 'risk').forEach(q => { 
        const chk = document.getElementById(q.id); 
        if (chk && chk.checked) { 
            if (q.target === 'data') data += q.factor; 
            if (q.target === 'change') change += q.factor; 
        } 
    });

    document.getElementById('val-maturity').innerText = mat.toFixed(1) + "x"; 
    document.getElementById('val-data').innerText = data.toFixed(1) + "x"; 
    document.getElementById('val-change').innerText = change.toFixed(1) + "x";

    // 3. Determine Base Scope (Gap vs Full)
    let baseHours = 0;
    const gapAnalysis = getGapAnalysis();
    const gapToggle = d3.select("#gap-pricing-toggle-container");
    let isGapPricing = false;

    if (gapAnalysis.gap.size > 0) {
        gapToggle.classed("hidden", false);
        if (gapToggle.html() === "") {
             gapToggle.html(`<label class="flex items-center cursor-pointer justify-between"><span class="text-xs font-bold text-orange-800"><i class="fas fa-exclamation-triangle mr-1"></i> Scope Gap Only? (${gapAnalysis.gap.size} tools)</span><input type="checkbox" id="use-gap-pricing" class="form-checkbox h-4 w-4 text-orange-600 focus:ring-orange-500 rounded"></label>`);
             d3.select("#use-gap-pricing").on("change", calculateScoping);
        }
        isGapPricing = d3.select("#use-gap-pricing").property("checked");
    } else {
        gapToggle.classed("hidden", true).html("");
    }

    if (isGapPricing) {
        // GAP LOGIC: Only charge for missing tools (e.g. 8 hours per tool)
        baseHours = gapAnalysis.gap.size * 8; 
    } else {
        // STANDARD LOGIC: Use Package Base Hours
        const region = d3.select("#region-filter").property('value');
        const audience = d3.select("#audience-filter").property('value');
        if (region !== 'all' && audience !== 'all') {
            const audienceDataKeys = audienceKeyToDataValuesMap[audience] || [];
            d3.selectAll(".package-checkbox:checked").each(function() {
                const pkgName = this.value;
                const pkg = packagingData.find(p => (p.region === region || (region === 'NAMER' && p.region === 'NAM')) && audienceDataKeys.includes(p.audience) && p.package_name === pkgName);
                if (pkg && pkg["available_services"] && pkg["available_services"].length > 0) {
                    const match = pkg["available_services"][0].match(/(\d+)\s*hrs/);
                    if (match) baseHours += parseInt(match[1], 10);
                }
            });
        }
    }

    // 4. Add Services & Custom
    const customScopeHours = (app.customScope ? app.customScope.size : 0) * 5; 
    let servicesHours = 0; let servicesCost = 0; let activeModules = []; 
    SOW_QUESTIONS.filter(q => q.type === 'cost').forEach(q => { 
        const chk = document.getElementById(q.id); 
        if (chk && chk.checked) { 
            servicesHours += q.hrs; servicesCost += q.cost; if (q.module) activeModules.push(q.module); 
        } 
    });

    // 5. Calculate Final Totals
    const totalHoursRaw = baseHours + customScopeHours + servicesHours;
    
    // Update UI List
    let listContainer = document.getElementById('custom-scope-list-container');
    if (!listContainer) { 
        const rc = document.getElementById('revenue-container'); 
        if(rc) { listContainer = document.createElement('div'); listContainer.id = 'custom-scope-list-container'; listContainer.className = "mt-3 pt-2 border-t border-gray-200 text-xs"; rc.parentNode.insertBefore(listContainer, rc.nextSibling); } 
    }
    
    if (listContainer) {
        let content = "";
        if (isGapPricing) content += `<div class="mb-1 p-1 bg-orange-100 rounded text-orange-800"><span class="font-bold">Gap Scope:</span> ${Array.from(gapAnalysis.gap).join(", ")}</div>`;
        if (app.customScope && app.customScope.size > 0) content += `<div class="mb-1"><span class="font-bold text-gray-500">Custom:</span> <span class="text-indigo-600">${Array.from(app.customScope).join(", ")}</span></div>`;
        listContainer.innerHTML = content; listContainer.style.display = content ? 'block' : 'none';
    }

    document.getElementById('base-tools-count').innerText = totalHoursRaw + " Hrs";
    
    // 6. Multipliers & Cost
    const multiplier = (mat + data + change) / 3;
    const finalWeeks = Math.round(((totalHoursRaw * 1.5) / 3.5) * multiplier);
    document.getElementById('calc-weeks').innerText = finalWeeks;
    
    const impCost = (baseHours + customScopeHours) * 1.5 * multiplier * 250;
    const onsiteCount = parseInt(document.getElementById('onsite-input').value || 0);
    const totalSOW = impCost + (onsiteCount * 7500) + servicesCost;
    
    // 7. DYNAMIC CURRENCY DISPLAY (V2.3 Update)
    const region = d3.select("#region-filter").property('value');
    // Map "EUR" from dropdown -> "EMEA" config key if needed
    const configKey = (region === 'EUR') ? 'EMEA' : (region === 'all' ? 'NAMER' : region);
    const conf = REGIONAL_CONFIG[configKey] || REGIONAL_CONFIG["NAMER"];
    const prefix = conf.currency === 'USD' ? '$' : (conf.currency + ' ');
    
    document.getElementById('sow-total').innerText = prefix + totalSOW.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0});

    app.currentSOW = {
        totalCost: totalSOW, weeks: finalWeeks, activeModules: activeModules, onsite: onsiteCount, isGapPricing: isGapPricing,
        ownedTools: Array.from(gapAnalysis.owned), targetTools: Array.from(gapAnalysis.target), gapTools: Array.from(gapAnalysis.gap)
    };
    refreshAccordionHeight();
}

// --- PRINT SOW (BRANDING + TEMPLATES) ---
function generateSOWPrintView() {
    if (!app.currentSOW) { alert("Please configure a scope first."); return; }
    
    // V2.3: REGIONAL DYNAMIC LOOKUP
    const region = d3.select("#region-filter").property('value');
    // Map "EUR" -> "EMEA" here as well
    const configKey = (region === 'EUR') ? 'EMEA' : (region === 'all' ? 'NAMER' : region);
    const regionConfig = REGIONAL_CONFIG[configKey] || REGIONAL_CONFIG["NAMER"];
    
    const clientName = prompt("Enter Client/Customer Name:", "Valued Client") || "Valued Client";
    const logoInput = prompt("Enter Client Logo URL (leave blank for default):", "");
    
    const logoHtml = (logoInput && logoInput.trim() !== "") 
        ? `<img src="${logoInput}" style="max-height: 50px; margin-bottom: 10px;">` 
        : `<div class="logo">PROCORE</div>`;

    const sow = app.currentSOW;
    const today = new Date().toLocaleDateString();
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) { alert("Please allow popups to print the SOW."); return; }

    let modulesHtml = "";
    if (sow.activeModules) {
        sow.activeModules.forEach(modKey => {
            const mod = SOW_LIBRARY[modKey];
            if(mod) {
                 modulesHtml += `<div class="module"><h3>${mod.title}</h3>${mod.body}</div>`;
            }
        });
    }
    if (sow.onsite > 0) {
        modulesHtml += `<div class="module"><h3>${SOW_LIBRARY.MOD_TRAINING.title}</h3>${SOW_LIBRARY.MOD_TRAINING.body}</div>`;
    }

    // Dynamic SOW Body based on Region Configuration
    let bodyContent = `
        <div class="sow-section">
            <h3>PARTIES</h3>
            <p><strong>Provider:</strong> ${regionConfig.legal_entity}<br>
            <strong>Client:</strong> ${clientName}</p>
        </div>
        <div class="sow-section">
            <h3>REGIONAL TERMS</h3>
            <ul>
                <li><strong>Jurisdiction:</strong> ${regionConfig.jurisdiction}</li>
                <li><strong>Currency:</strong> ${regionConfig.currency}</li>
                <li><strong>Tax:</strong> All fees exclusive of ${regionConfig.tax_term}</li>
                <li><strong>Data Protection:</strong> ${regionConfig.data_protection}</li>
            </ul>
        </div>
        <div class="sow-section">
            <h3>OVERVIEW</h3>
            <p>Client and Provider agree to the custom scope of services outlined below to support Client's standardization and implementation initiatives.</p>
        </div>
    `;

    // --- EXECUTIVE GAP REPORT (NEW) ---
    let gapReportHtml = "";
    if (sow.gapTools && sow.gapTools.length > 0) {
        gapReportHtml = `
        <div class="sow-section" style="page-break-after: avoid;">
            <h3>Platform Maturity Assessment</h3>
            <div style="display: flex; gap: 10px; font-size: 11px;">
                <div style="flex: 1; border: 1px solid #e5e7eb; border-radius: 4px; overflow: hidden;">
                    <div style="background: #4da446; color: white; padding: 5px 8px; font-weight: bold; text-transform: uppercase;">Current State</div>
                    <div style="padding: 10px; background: #f0fdf4;">${sow.ownedTools.length > 0 ? sow.ownedTools.join(", ") : "No tools selected."}</div>
                </div>
                <div style="flex: 1; border: 1px solid #e5e7eb; border-radius: 4px; overflow: hidden;">
                    <div style="background: #2563EB; color: white; padding: 5px 8px; font-weight: bold; text-transform: uppercase;">Target Package</div>
                    <div style="padding: 10px; background: #eff6ff;">${sow.targetTools.length > 0 ? sow.targetTools.join(", ") : "No target package."}</div>
                </div>
                <div style="flex: 1; border: 1px solid #e5e7eb; border-radius: 4px; overflow: hidden;">
                    <div style="background: #F36C23; color: white; padding: 5px 8px; font-weight: bold; text-transform: uppercase;">Critical Gap</div>
                    <div style="padding: 10px; background: #fff7ed; font-weight: 600; color: #c2410c;">${sow.gapTools.join(", ")}</div>
                </div>
            </div>
        </div>`;
    }

    // Inject Custom Gap Messaging if applicable
    if (sow.isGapPricing) {
        bodyContent += `
        <div class="sow-section" style="background: #fff7ed; padding: 10px; border-left: 4px solid #f97316; margin-bottom: 20px;">
            <h3>Targeted Implementation Scope</h3>
            <p>This Statement of Work is specifically scoped to implement the delta between the Client's current stack and the target Package.</p>
        </div>`;
    }

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>SOW: ${clientName}</title>
        <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #333; line-height: 1.5; max-width: 800px; margin: 0 auto; }
            .header { border-bottom: 3px solid #F36C23; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
            .logo { font-size: 24px; font-weight: 800; color: #F36C23; letter-spacing: -0.5px; }
            .title { font-size: 14px; text-transform: uppercase; color: #888; letter-spacing: 1px; }
            h3 { font-size: 14px; font-weight: 700; text-transform: uppercase; color: #555; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 30px; }
            p, li { font-size: 13px; }
            .sow-section { margin-bottom: 20px; }
            .module { background: #f9fafb; border: 1px solid #e5e7eb; padding: 15px; margin-bottom: 15px; border-radius: 4px; }
            .module h2 { font-size: 16px; margin-top: 0; color: #111827; }
            .total-box { background: #1f2937; color: white; padding: 20px; border-radius: 8px; text-align: right; margin-top: 40px; }
            .total-cost { font-size: 32px; font-weight: 800; margin-top: 5px; }
            .disclaimer { margin-top: 50px; font-size: 10px; color: #999; text-align: center; border-top: 1px solid #eee; padding-top: 10px; }
        </style>
    </head>
    <body>
        <div class="header">
            <div>${logoHtml}</div>
            <div class="title">STATEMENT OF WORK - ${regionConfig.label}</div>
        </div>
        ${bodyContent}
        ${gapReportHtml}
        <h3>Scope of Services</h3>
        ${modulesHtml}
        <div class="total-box">
            <div style="font-size: 12px; text-transform: uppercase; font-weight: bold; opacity: 0.8;">Total Implementation Investment</div>
            <div class="total-cost">${regionConfig.currency === 'USD' ? '$' : regionConfig.currency + ' '}${sow.totalCost.toLocaleString()}</div>
            <div style="font-size: 14px; margin-top: 5px; opacity: 0.8;">Est. Timeline: ${sow.weeks} Weeks</div>
        </div>
        <div class="disclaimer">
            This document is a rough order of magnitude (ROM) estimate for simulation purposes only. <br>
            It does not constitute a binding contract or formal Statement of Work. Pricing is subject to change.
        </div>
        <script>window.print();</script>
    </body>
    </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
}

// --- TEAM VIEW MANAGER ---
function applyTeamView(team) {
    const config = TEAM_CONFIG[team];
    if (!config) return;

    d3.select("#tour-accordion").style("display", config.showTours ? "block" : "none");
    d3.select("#ai-workflow-builder-btn").style("display", config.showAiBuilder ? "block" : "none");
    d3.select("#ai-tours").style("display", config.showAiBuilder ? "block" : "none");
    
    const manualBtn = d3.select("#manual-workflow-builder-btn");
    if (!manualBtn.empty()) {
        manualBtn.style("display", config.showManualBuilder ? "block" : "none");
    }

    const scopingContainer = d3.select("#scoping-ui-container");
    if (config.calculatorMode === 'hidden') {
        scopingContainer.classed("hidden", true);
    } else {
        scopingContainer.classed("hidden", !config.showScoping);
        if (typeof app !== 'undefined' && app.state) {
            app.state.calculatorMode = config.calculatorMode;
            calculateScoping(); 
        }
    }
    
    // LEGEND ACCESS FIX (Explicitly Handle Visibility)
    d3.select("#view-options-accordion").style("display", config.showLegend ? "block" : "none");

    document.querySelectorAll('.accordion-item').forEach(item => item.classList.remove('active'));
    
    const target = document.getElementById(config.defaultOpen);
    if (target) {
        target.classList.add('active');
        const content = target.querySelector('.accordion-content');
        if (content) content.style.maxHeight = content.scrollHeight + "px";
    }
}

// --- UI HELPER FUNCTIONS ---
function toggleAllConnections() {
    const checkboxes = d3.selectAll(".legend-checkbox");
    if (checkboxes.empty()) return;
    const allChecked = checkboxes.nodes().every(node => node.checked);
    checkboxes.property("checked", !allChecked);
    if (typeof updateGraph === 'function') updateGraph(true);
}

let allCategoriesChecked = true;
function toggleAllCategories() {
    allCategoriesChecked = !allCategoriesChecked;
    d3.selectAll("#category-filters input").property("checked", allCategoriesChecked);
    if (typeof updateGraph === 'function') updateGraph(true);
}

function populateRegionFilter(retryCount = 0) {
    // FIX: Retry mechanism if data isn't loaded yet
    if (typeof packagingData === 'undefined') {
        if (retryCount < 20) { // Increased check limit
            setTimeout(() => populateRegionFilter(retryCount + 1), 100);
        } else {
            console.error("Procoreverse: Packaging Data failed to load.");
        }
        return;
    }
    const regionFilter = d3.select("#region-filter");
    if (regionFilter.empty()) return;
    
    // Clear existing to prevent duplicates on re-run
    regionFilter.html('<option value="all">Select Region...</option>');

    // Force order: NAMER, EMEA, APAC
    ["NAMER", "EUR", "APAC"].forEach(region => {
        let label = region;
        if (region === "NAMER") label = "NAMER (North America)"; // <--- UPDATED LABEL
        if (region === "EUR") label = "EMEA (Europe)";
        if (region === "APAC") label = "APAC (Australia/Asia)";
        regionFilter.append("option").attr("value", region).text(label);
    });
}

// --- HIERARCHY ENFORCER: LEVEL 1 (Region) ---
function onRegionChange() {
    const region = d3.select(this).property("value");
    const audienceFilter = d3.select("#audience-filter");
    const stackBtn = d3.select("#stack-builder-btn");
    
    // 1. Reset Downstream Filters
    audienceFilter.property("value", "all").property("disabled", region === "all");
    audienceFilter.html('<option value="all">All Audiences</option>');
    
    d3.select("#package-selection-area").classed("hidden", true);
    d3.select("#package-checkboxes").html("");
    
    // 2. Reset App State (Stack, etc.)
    if(typeof app !== 'undefined') {
        app.state.myStack.clear();
        if (app.state.isBuildingStack) toggleStackBuilderMode(); // Turn off if on
    }
    clearPackageDetails();
    
    // 3. Configure Audience based on Region
    if (region !== "all") {
        // Unlock Stack Builder
        stackBtn.classed("bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed", false)
                .classed("bg-white text-gray-700 border-gray-300 hover:bg-gray-50 cursor-pointer", true)
                .attr("disabled", null);

        const availableAudiences = new Set();
        packagingData.filter(pkg => 
            pkg.region === region || (region === 'NAMER' && pkg.region === 'NAM')
        ).forEach(pkg => {
            const audKey = audienceDataToKeyMap[pkg.audience];
            if (audKey) availableAudiences.add(audKey);
        });

        [...availableAudiences].sort().forEach(audKey => {
             audienceFilter.append("option").attr("value", audKey).text(audienceKeyToLabelMap[audKey]);
        });
    } else {
        // Disable Stack Builder if no region
        stackBtn.classed("bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed", true)
                .classed("bg-white text-gray-700 border-gray-300 hover:bg-gray-50 cursor-pointer", false)
                .attr("disabled", true);
    }
    
    if (typeof updateGraph === 'function') updateGraph(true);
}

// --- HIERARCHY ENFORCER: LEVEL 2 (Audience) ---
function onAudienceChange() {
    const region = d3.select("#region-filter").property("value");
    const audience = d3.select(this).property("value");
    const packageArea = d3.select("#package-selection-area");
    const packageList = d3.select("#package-checkboxes");
    
    packageList.html("");
    clearPackageDetails();
    
    const audienceDataKeys = audienceKeyToDataValuesMap[audience] || [];
    
    if (region !== 'all' && audience !== 'all') {
        const packages = packagingData.filter(pkg =>
            (pkg.region === region || (region === 'NAMER' && pkg.region === 'NAM')) && 
            audienceDataKeys.includes(pkg.audience)
        );
        
        if (packages.length > 0) {
            packageArea.classed("hidden", false);
            packages.sort((a, b) => a.package_name.localeCompare(b.package_name)).forEach(pkg => {
                const label = packageList.append("label")
                    .attr("class", "flex items-center cursor-pointer py-1 hover:bg-gray-100 rounded px-1");
                
                label.append("input")
                    .attr("type", "checkbox")
                    .attr("value", pkg.package_name)
                    .attr("class", "form-checkbox h-4 w-4 text-indigo-600 package-checkbox mr-2")
                    .on("change", () => {
                        updatePackageAddOns();
                        if(typeof updateActivePackageState === 'function') updateActivePackageState(); 
                        if (typeof updateGraph === 'function') updateGraph(true);
                        calculateScoping();
                    });
                label.append("span").text(pkg.package_name);
            });
        } else {
            packageArea.classed("hidden", true);
        }
    } else {
        packageArea.classed("hidden", true);
    }
    if (typeof updateGraph === 'function') updateGraph(true);
}

// FIX: AUTO-EXIT BUILDER MODE ON PACKAGE SELECTION
function onPackageChange() {
    if (app.state.isBuildingStack) toggleStackBuilderMode(); // FORCE OFF
    
    const region = d3.select("#region-filter").property('value');
    const audience = d3.select("#audience-filter").property('value');
    const pkgName = d3.select("#package-filter").property('value');
    clearPackageDetails();
    if (region !== 'all' && audience !== 'all' && pkgName !== 'all') {
        const audienceDataKeys = audienceKeyToDataValuesMap[audience] || [];
        const packageInfo = packagingData.find(pkg =>
            pkg.region === region && audienceDataKeys.includes(pkg.audience) && pkg.package_name === pkgName
        );
        if (packageInfo) populateAddOnsAndServices(packageInfo); 
    }
    refreshAccordionHeight();
    if (typeof updateGraph === 'function') updateGraph(true);
    calculateScoping();
}

function updatePackageAddOns() {
    // FORCE EXIT BUILDER MODE HERE TOO (Since this is triggered by checkboxes)
    if (app.state.isBuildingStack) toggleStackBuilderMode();

    const region = d3.select("#region-filter").property('value');
    const audience = d3.select("#audience-filter").property('value');
    const audienceDataKeys = audienceKeyToDataValuesMap[audience] || [];
    const selectedPackageNames = d3.selectAll(".package-checkbox:checked").nodes().map(n => n.value);
    
    // --- V2.3 EXCLUSION LOGIC ---
    let regionExclusions = [];
    if (region === 'EUR') regionExclusions = REGIONAL_CONFIG["EMEA"].exclusions;
    else if (region === 'APAC') regionExclusions = REGIONAL_CONFIG["APAC"].exclusions;
    // ---------------------------

    const allAddOns = new Set();
    const allServices = new Set();
    
    selectedPackageNames.forEach(pkgName => {
        const pkg = packagingData.find(p => 
            (p.region === region || (region === 'NAMER' && p.region === 'NAM')) && 
            audienceDataKeys.includes(p.audience) && 
            p.package_name === pkgName
        );
        if (pkg) {
            const addOns = pkg['available_add-ons'] || pkg['available_add_ons'] || pkg['add_ons'] || [];
            addOns.forEach(a => {
                if (!regionExclusions.includes(a)) { // APPLY EXCLUSION CHECK
                    allAddOns.add(a);
                }
            });
            const services = pkg['available_services'] || [];
            services.forEach(s => allServices.add(s));
        }
    });
    
    const addOnsContainer = d3.select("#add-ons-container");
    const addOnsCheckboxes = d3.select("#add-ons-checkboxes");
    addOnsCheckboxes.html("");
    
    if (allAddOns.size > 0) {
        addOnsContainer.classed('hidden', false);
        [...allAddOns].sort().forEach(addOn => {
            const label = addOnsCheckboxes.append("label").attr("class", "flex items-center cursor-pointer py-1");
            label.append("input").attr("type", "checkbox").attr("value", addOn)
                .attr("class", "form-checkbox h-5 w-5 text-orange-600 transition rounded mr-3 focus:ring-orange-500")
                .on("change", () => {
                    if (typeof updateGraph === 'function') updateGraph(true);
                    calculateScoping();
                });
            label.append("span").attr("class", "text-gray-700").text(addOn);
        });
    } else {
        addOnsContainer.classed('hidden', true);
    }
    
    const servicesContainer = d3.select("#package-services-container");
    const servicesList = d3.select("#package-services-list");
    servicesList.html("");
    
    if (allServices.size > 0) {
        servicesContainer.classed('hidden', false);
        [...allServices].sort().forEach(service => {
            servicesList.append("div").attr("class", "flex items-center text-gray-700")
                .html(`<i class="fas fa-check-circle text-green-500 mr-2"></i> ${service}`);
        });
    } else {
        servicesContainer.classed('hidden', true);
    }
    refreshAccordionHeight();
}

function getActiveFilters() {
    const region = d3.select("#region-filter").property('value');
    const audience = d3.select("#audience-filter").property('value');
    const audienceDataKeys = audienceKeyToDataValuesMap[audience] || [];
    
    const activeCategories = d3.selectAll("#category-filters input:checked").nodes().map(el => el.value);
    const activeConnectionTypes = d3.selectAll(".legend-checkbox:checked").nodes().map(el => el.value);
    
    const toggleNode = d3.select("#toggle-procore-led").node();
    const showProcoreLed = toggleNode ? toggleNode.checked : false;

    let packageTools = null;
    let procoreLedTools = new Set();
    
    if (region !== 'all' && audience !== 'all') {
        const selectedPackageNames = d3.selectAll(".package-checkbox:checked").nodes().map(n => n.value);
        if (selectedPackageNames.length > 0) {
            packageTools = new Set();
            selectedPackageNames.forEach(pkgName => {
                const pkg = packagingData.find(p => 
                    (p.region === region || (region === 'NAMER' && p.region === 'NAM')) && 
                    audienceDataKeys.includes(p.audience) && 
                    p.package_name === pkgName
                );
                if (pkg) {
                    pkg.tools.forEach(t => packageTools.add(t));
                    if (pkg.procore_led_tools) {
                        pkg.procore_led_tools.forEach(t => procoreLedTools.add(t));
                    }
                }
            });
            const selectedAddOns = d3.selectAll("#add-ons-checkboxes input:checked").nodes().map(el => el.value);
            selectedAddOns.forEach(addOn => packageTools.add(addOn));
        }
    }

    return {
        categories: new Set(activeCategories),
        persona: d3.select("#persona-filter").property('value'),
        audience: audience,
        packageTools: packageTools,
        procoreLedTools: procoreLedTools,
        connectionTypes: new Set(activeConnectionTypes),
        showProcoreLed: showProcoreLed
    };
}

function clearPackageDetails() {
    d3.select("#add-ons-checkboxes").html("");
    d3.select("#package-services-list").html("");
    d3.select("#add-ons-container").classed('hidden', true);
    d3.select("#package-services-container").classed('hidden', true);
    if (app && app.customScope) app.customScope.clear();
    d3.selectAll(".sow-question").property("checked", false);
    
    // RESET COMPLEXITY
    d3.selectAll('.complexity-btn').classed('bg-indigo-600 text-white', false).classed('bg-gray-200 text-gray-700', true);
    d3.select('#btn-standard').classed('bg-gray-200 text-gray-700', false).classed('bg-indigo-600 text-white', true);
    
    calculateScoping();
}

function refreshAccordionHeight() {
    const content = document.querySelector('#packaging-container').closest('.accordion-content');
    if (content && content.parentElement.classList.contains('active')) {
        content.style.maxHeight = content.scrollHeight + "px";
    }
}

function populatePersonaFilter() {
    if (typeof nodesData === 'undefined') return;
    const personaFilter = d3.select("#persona-filter");
    if(personaFilter.empty()) return;

    personaFilter.html('<option value="all">All Personas</option>');
    const allPersonas = new Set();
    if (typeof nodesData !== 'undefined' && Array.isArray(nodesData)) {
        nodesData.forEach(node => {
            if (node.personas) node.personas.forEach(p => allPersonas.add(p));
        });
    }
    [...allPersonas].sort().forEach(p => {
        const personaMap = {
            "pm": "Project Manager (GC)", "super": "Superintendent (GC)", "fm": "Financial Manager (GC)",
            "sub": "Specialty Contractor", "design": "Design Team", "owner": "Owner", "admin": "Admin", "estimator": "Estimator"
        };
        personaFilter.append("option").attr("value", p).text(personaMap[p] || p);
    });
}

function populateCategoryFilters() {
    const filtersContainer = d3.select("#category-filters");
    if(filtersContainer.empty() || typeof app === 'undefined' || !app.categories) return;
    filtersContainer.html("");
    Object.keys(app.categories).sort().forEach(cat => {
        const label = filtersContainer.append("label").attr("class", "flex items-center cursor-pointer py-1");
        label.append("input").attr("type", "checkbox").attr("checked", true).attr("value", cat)
            .attr("class", "form-checkbox h-5 w-5 text-orange-600 transition rounded mr-3 focus:ring-orange-500")
            .on("change", () => {if (typeof updateGraph === 'function') updateGraph(true)});
        label.append("span").attr("class", "legend-color").style("background-color", app.categories[cat].color);
        label.append("span").attr("class", "text-gray-700").text(cat);
    });
}

function resetView() {
    if (typeof stopTour === 'function') stopTour();
    d3.select("#region-filter").property('value', 'all');
    d3.select("#audience-filter").property('value', 'all').property("disabled", true).html('<option value="all">All Audiences</option>');
    d3.select("#persona-filter").property('value', 'all');
    
    d3.select("#package-selection-area").classed("hidden", true);
    d3.select("#package-checkboxes").html("");
    
    d3.select("#toggle-procore-led").property("checked", false);
    if(typeof app !== 'undefined') app.state.showProcoreLedOnly = false;
    
    d3.selectAll("#category-filters input").property("checked", true);
    d3.selectAll(".legend-checkbox").property("checked", true);
    allCategoriesChecked = true;
    
    d3.selectAll(".sow-question").property("checked", false);
    
    // RESET STACK
    if (app.state && app.state.isBuildingStack) toggleStackBuilderMode();
    app.state.myStack = new Set();
    d3.select("#stack-builder-btn").attr("disabled", true).classed("cursor-not-allowed", true);
    
    // RESET GAP TOGGLE (CLEANUP)
    d3.select("#gap-pricing-toggle-container").classed("hidden", true).html("");
    
    // RESET COMPLEXITY
    d3.selectAll('.complexity-btn').classed('bg-indigo-600 text-white', false).classed('bg-gray-200 text-gray-700', true);
    d3.select('#btn-standard').classed('bg-gray-200 text-gray-700', false).classed('bg-indigo-600 text-white', true);
    
    clearPackageDetails();
    if (typeof updateGraph === 'function') updateGraph(false);
    if (typeof resetZoom === 'function') resetZoom();
}

function handleSearchInput() {
    if (typeof nodesData === 'undefined') return;
    const searchInput = this.value.toLowerCase().trim();
    const searchResults = d3.select("#search-results");
    if (searchInput.length < 2) {
        searchResults.html("").style("opacity", 0).style("transform", "scale(0.95)");
        return;
    }
    const results = nodesData.filter(d => d.id.toLowerCase().includes(searchInput));
    searchResults.html("");
    if (results.length === 0) {
        searchResults.append("div").attr("class", "search-item text-sm text-gray-500").text("No results found.");
    } else {
        results.forEach(d => {
            searchResults.append("div").attr("class", "search-item text-sm flex items-center")
                .html(`<span class="legend-color" style="background-color:${app.categories[d.group].color};"></span>${d.id}`)
                .on("click", () => selectNodeFromSearch(d));
        });
    }
    searchResults.style("opacity", 1).style("transform", "scale(1)");
}

function selectNodeFromSearch(d) {
    if (typeof stopTour === 'function') stopTour();
    if(typeof app !== 'undefined' && app.simulation) {
        const isVisible = app.simulation.nodes().some(n => n.id === d.id);
        if (!isVisible) {
            if(typeof showToast === 'function') showToast(`"${d.id}" is hidden by filters. Resetting view.`, 3000);
            resetView();
        }
        setTimeout(() => {
            const nodeData = app.simulation.nodes().find(n => n.id === d.id);
            if (nodeData) {
                app.interactionState = 'selected';
                app.selectedNode = nodeData;
                applyHighlight(nodeData);
                if (typeof showInfoPanel === 'function') showInfoPanel(nodeData); 
                centerViewOnNode(nodeData);
            }
        }, isVisible ? 0 : 600);
    }
    d3.select("#search-input").property("value", "");
    d3.select("#search-results").html("").style("opacity", 0).style("transform", "scale(0.95)");
}

function updateActivePackageState() {
    if (typeof app === 'undefined') return;
    const region = d3.select("#region-filter").property('value');
    const audience = d3.select("#audience-filter").property('value');
    const audienceDataKeys = audienceKeyToDataValuesMap[audience] || [];
    const firstChecked = d3.select(".package-checkbox:checked");
    
    if (!firstChecked.empty()) {
        const pkgName = firstChecked.property("value");
        const pkg = packagingData.find(p => 
            (p.region === region || (region === 'NAMER' && p.region === 'NAM')) && 
            audienceDataKeys.includes(p.audience) && 
            p.package_name === pkgName
        );
        app.currentPackage = pkg;
    } else {
        app.currentPackage = null;
    }
}
// --- app-controls.js END ---
