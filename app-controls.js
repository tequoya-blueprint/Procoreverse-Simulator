// --- app-controls.js ---
// VERSION: 210 (FULL VERBOSITY: SOW LIBRARY & LOGIC)

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
    "O": ["Owners", "Owner", "Owner Developer *Coming Soon", "O"]
};

const audienceDataToKeyMap = {
    "Contractor": "GC", "General Contractor": "GC", "GC": "GC",
    "SC": "SC", "Specialty Contractor": "SC",
    "Owners": "O", "Owner": "O", "Owner Developer *Coming Soon": "O"
};

const audienceKeyToLabelMap = {
    "GC": "General Contractor",
    "SC": "Specialty Contractor",
    "O": "Owner"
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
    // 1. LEGAL WRAPPERS
    "NAM_GC_BASE": {
        title: "STATEMENT OF WORK (GENERAL CONTRACTOR)",
        body: `
        <div class="sow-section">
            <h3>PARTIES</h3>
            <p><strong>Provider:</strong> Procore Technologies, Inc., a Delaware corporation.<br>
            <strong>Client:</strong> {{Client Name}}</p>
        </div>
        <div class="sow-section">
            <h3>OVERVIEW</h3>
            <p>Client is currently implementing project management software products and has identified a need for standardizing processes and content. To support Client’s strategic initiative, Client and Provider agree to the custom scope of services outlined below.</p>
        </div>
        <div class="sow-section">
            <h3>TERM</h3>
            <p>Unless otherwise noted in a specific module, access to resources and service hours must be used within thirty-six (36) months of the service start date.</p>
        </div>
        <div class="sow-section">
            <h3>GOVERNING TERMS</h3>
            <p>This SOW is governed by the Master Services Agreement ("MSA") or Subscription Terms currently in place between the parties. All fees are in USD.</p>
        </div>
        `
    },
    "NAM_OWNER_BASE": {
        title: "STATEMENT OF WORK (OWNER/DEVELOPER)",
        body: `
        <div class="sow-section">
            <h3>PARTIES</h3>
            <p><strong>Provider:</strong> Procore Technologies, Inc.<br>
            <strong>Client:</strong> {{Client Name}}</p>
        </div>
        <div class="sow-section">
            <h3>OVERVIEW</h3>
            <p>Client requires specialized assistance to standardize capital project controls and financial workflows. Client and Provider agree to the custom scope of services outlined below to ensure successful onboarding of future assets.</p>
        </div>
        <div class="sow-section">
            <h3>TERM</h3>
            <p>Services outlined herein are valid for thirty-six (36) months from execution.</p>
        </div>
        <div class="sow-section">
            <h3>GOVERNING TERMS</h3>
            <p>This SOW is governed by the Master Services Agreement ("MSA") executed by the Client. All fees are in USD.</p>
        </div>
        `
    },
    "APAC_BASE": {
        title: "STATEMENT OF WORK (APAC)",
        body: `
        <div class="sow-section">
            <h3>PARTIES</h3>
            <p><strong>Provider:</strong> Procore Technologies Pty Ltd.<br>
            <strong>Client:</strong> {{Client Name}}</p>
        </div>
        <div class="sow-section">
            <h3>OVERVIEW</h3>
            <p>Client and Provider agree to the custom scope of services outlined below.</p>
        </div>
        <div class="sow-section">
            <h3>REGIONAL TERMS</h3>
            <ul>
                <li><strong>Currency:</strong> All fees are listed in AUD/SGD unless otherwise specified.</li>
                <li><strong>GST/Tax:</strong> Fees are exclusive of Goods and Services Tax (GST).</li>
                <li><strong>Jurisdiction:</strong> This agreement is governed by the laws of New South Wales (or relevant APAC jurisdiction).</li>
            </ul>
        </div>
        <div class="sow-section">
            <h3>TERM</h3>
            <p>Services must be utilized within thirty-six (36) months of the service start date.</p>
        </div>
        `
    },
    "EMEA_BASE": {
        title: "STATEMENT OF WORK (EMEA)",
        body: `
        <div class="sow-section">
            <h3>PARTIES</h3>
            <p><strong>Provider:</strong> Procore Technologies Ltd.<br>
            <strong>Client:</strong> {{Client Name}}</p>
        </div>
        <div class="sow-section">
            <h3>OVERVIEW</h3>
            <p>Client and Provider agree to the custom scope of services outlined below to support Client's standardization and implementation initiatives.</p>
        </div>
        <div class="sow-section">
            <h3>REGIONAL TERMS</h3>
            <ul>
                <li><strong>Data Protection:</strong> Both parties agree to comply with all applicable provisions of the General Data Protection Regulation (GDPR).</li>
                <li><strong>VAT:</strong> All fees are exclusive of VAT.</li>
                <li><strong>Jurisdiction:</strong> This agreement is governed by the laws of England and Wales.</li>
            </ul>
        </div>
        <div class="sow-section">
            <h3>TERM</h3>
            <p>Services must be utilized within thirty-six (36) months of the service start date.</p>
        </div>
        `
    },

    // 2. SCOPE MODULES
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

// --- DYNAMIC CONTENT ASSEMBLER ---
function getSOWContent(sowData) {
    // 1. Determine Base Wrapper (Region + Audience)
    let baseKey = "NAM_GC_BASE"; // Default
    if (sowData.region === "APAC") baseKey = "APAC_BASE";
    else if (sowData.region === "EMEA") baseKey = "EMEA_BASE";
    else if (sowData.audience === "O") baseKey = "NAM_OWNER_BASE";

    // 2. Determine Modules (Services)
    let modules = [];
    
    // Look up modules based on the IDs saved in sowData.activeModules
    if (sowData.activeModules && sowData.activeModules.length > 0) {
        sowData.activeModules.forEach(modKey => {
            if (SOW_LIBRARY[modKey]) {
                modules.push(SOW_LIBRARY[modKey]);
            }
        });
    }
    
    // Check Onsite Input specially
    if (sowData.onsite > 0) modules.push(SOW_LIBRARY["MOD_TRAINING"]);

    // Fallback: If modules list is empty, default to nothing
    return { base: SOW_LIBRARY[baseKey], modules: modules };
}

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

    populateRegionFilter();
    populatePersonaFilter();
    renderSOWQuestionnaire();
   
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

    d3.select("#reset-view").on("click", resetView);
    d3.select("#help-button").on("click", startOnboarding);
    d3.select("#left-panel-toggle").on("click", toggleLeftPanel);
    d3.select("#left-panel-expander").on("click", toggleLeftPanel);

    const inputs = ['slider-maturity', 'slider-data', 'slider-change', 'onsite-input'];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if(el) el.addEventListener('input', calculateScoping);
    });
    
    // Init Stack Builder Button
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

// --- CUSTOM SCOPE MANAGER ---
function toggleCustomScopeItem(nodeId) {
    if (!app || !app.customScope) return;
    if (app.customScope.has(nodeId)) app.customScope.delete(nodeId);
    else app.customScope.add(nodeId);
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
        app.interactionState = 'building_stack';
        btn.classed("bg-green-600 hover:bg-green-700 text-white border-green-700", true)
           .classed("bg-white text-gray-700 border-gray-300 hover:bg-gray-50", false)
           .html('<i class="fas fa-check-circle mr-2"></i> Done Selecting Tools');
        if(typeof showToast === 'function') showToast("Builder Active: Click tools the customer CURRENTLY owns.", 4000);
        d3.selectAll(".node").transition().duration(300).style("opacity", 0.4);
        highlightOwnedNodes();
    } else {
        app.interactionState = 'explore';
        btn.classed("bg-green-600 hover:bg-green-700 text-white border-green-700", false)
           .classed("bg-white text-gray-700 border-gray-300 hover:bg-gray-50", true)
           .html('<i class="fas fa-layer-group mr-2 text-green-600"></i> Define Customer Stack');
        if (typeof updateGraph === 'function') updateGraph(true);
        if (app.state.myStack.size > 0 && typeof showToast === 'function') showToast("Stack Saved! Select a Package to see Gaps & Outliers.", 3000);
    }
}

function toggleStackItem(d) {
    if (!app.state.myStack) app.state.myStack = new Set();
    if (app.state.myStack.has(d.id)) app.state.myStack.delete(d.id);
    else app.state.myStack.add(d.id);
    highlightOwnedNodes();
}

function highlightOwnedNodes() {
    if (!app.node) return;
    app.node.transition().duration(200)
        .style("opacity", d => app.state.myStack.has(d.id) ? 1 : 0.4) 
        .style("filter", d => app.state.myStack.has(d.id) ? "drop-shadow(0 0 6px rgba(77, 164, 70, 0.6))" : "none") 
        .select("path")
        .style("stroke", d => app.state.myStack.has(d.id) ? "#4da446" : "#fff") 
        .style("stroke-width", d => app.state.myStack.has(d.id) ? 3 : 1);
}

function getGapAnalysis() {
    const filters = getActiveFilters(); 
    const targetPackageTools = filters.packageTools || new Set();
    const owned = app.state.myStack || new Set();
    const gap = new Set(); const matched = new Set(); const outlier = new Set();
    
    if (targetPackageTools.size > 0) {
        targetPackageTools.forEach(toolId => {
            if (owned.has(toolId)) matched.add(toolId);
            else gap.add(toolId);
        });
        owned.forEach(toolId => {
            if (!targetPackageTools.has(toolId)) outlier.add(toolId);
        });
    }
    return { owned, gap, matched, outlier, target: targetPackageTools };
}

// --- SOW V2: COMPLEXITY ---
function setComplexity(level) {
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
        d3.selectAll('.complexity-btn').classed('bg-indigo-600 text-white', false).classed('bg-gray-200 text-gray-700', true);
        d3.select(`#btn-${level}`).classed('bg-gray-200 text-gray-700', false).classed('bg-indigo-600 text-white', true);
    }
}

function renderSOWQuestionnaire() {
    const revenueContainer = d3.select("#revenue-container");
    if(revenueContainer.empty()) return;
    revenueContainer.attr("class", "block w-full pt-2 border-t border-gray-200").html("");
    
    // Complexity Buttons
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
    onsiteRow.append("input").attr("type", "number").attr("id", "onsite-input").attr("value", "0").attr("min", "0").attr("class", "w-full p-1.5 text-sm border rounded text-center bg-white focus:ring-indigo-500 focus:border-indigo-500").on("input", calculateScoping);
    
    settingsGroup.append("div").attr("class", "text-[10px] font-bold text-gray-500 uppercase mb-2").text("Service Qualifiers");
    const gridDiv = settingsGroup.append("div").attr("class", "grid grid-cols-2 gap-x-2 gap-y-2 w-full");
    
    SOW_QUESTIONS.forEach(q => {
        const label = gridDiv.append("label").attr("class", "flex items-start cursor-pointer hover:bg-gray-100 rounded p-1 w-full");
        label.append("input").attr("type", "checkbox").attr("id", q.id).attr("class", "form-checkbox h-3.5 w-3.5 text-indigo-600 sow-question rounded mt-0.5 flex-shrink-0 focus:ring-indigo-500").on("change", calculateScoping);
        const textCol = label.append("div").attr("class", "ml-2 flex flex-col min-w-0");
        textCol.append("span").attr("class", "text-[11px] text-gray-700 font-medium leading-tight truncate").text(q.label).attr("title", q.label);
        if (q.type === 'cost') textCol.append("span").attr("class", "text-[9px] text-gray-400 mt-0.5").text("+$" + (q.cost/1000) + "k");
    });
    
    const totalBox = d3.select("#sow-total").select(function() { return this.parentNode; });
    if (!totalBox.empty()) {
        totalBox.select("#print-sow-mini-btn").remove(); 
        totalBox.append("button").attr("id", "print-sow-mini-btn").attr("class", "w-full mt-3 bg-indigo-700 hover:bg-indigo-600 text-white font-semibold py-1.5 rounded text-[11px] flex items-center justify-center transition shadow-sm border border-indigo-600").html('<i class="fas fa-print mr-2"></i> Print Estimate').on("click", generateSOWPrintView);
    }
    setTimeout(refreshAccordionHeight, 50);
}

// --- SCOPING CALCULATOR (WITH RBAC) ---
function calculateScoping() {
    const isViewOnly = (app.state.calculatorMode === 'view');
    const sliderMaturity = document.getElementById('slider-maturity');
    const sliderData = document.getElementById('slider-data');
    const sliderChange = document.getElementById('slider-change');
    const onsiteInput = document.getElementById('onsite-input');
    
    if (sliderMaturity) {
        [sliderMaturity, sliderData, sliderChange, onsiteInput].forEach(el => { if(el) el.disabled = isViewOnly; });
        d3.selectAll('.sow-question').property('disabled', isViewOnly);
        d3.selectAll('.complexity-btn').classed('opacity-50 cursor-not-allowed', isViewOnly);
    }

    if (!sliderMaturity) return;

    let mat = parseFloat(sliderMaturity.value);
    let data = parseFloat(sliderData.value);
    let change = parseFloat(sliderChange.value);

    SOW_QUESTIONS.filter(q => q.type === 'risk').forEach(q => {
        const checkbox = document.getElementById(q.id);
        if (checkbox && checkbox.checked) {
            if (q.target === 'data') data += q.factor;
            if (q.target === 'change') change += q.factor;
        }
    });

    const valMat = document.getElementById('val-maturity'); if(valMat) valMat.innerText = mat.toFixed(1) + "x";
    const valData = document.getElementById('val-data'); if(valData) valData.innerText = data.toFixed(1) + "x";
    const valChange = document.getElementById('val-change'); if(valChange) valChange.innerText = change.toFixed(1) + "x";

    let baseHours = 0;
    const region = d3.select("#region-filter").property('value');
    const audience = d3.select("#audience-filter").property('value');
    
    if (region !== 'all' && audience !== 'all') {
        const audienceDataKeys = audienceKeyToDataValuesMap[audience] || [];
        d3.selectAll(".package-checkbox:checked").each(function() {
            const pkgName = this.value;
            const pkg = packagingData.find(p => 
                (p.region === region || (region === 'NAMER' && p.region === 'NAM')) && 
                audienceDataKeys.includes(p.audience) && 
                p.package_name === pkgName
            );
            if (pkg && pkg["available_services"] && pkg["available_services"].length > 0) {
                const match = pkg["available_services"][0].match(/(\d+)\s*hrs/);
                if (match) baseHours += parseInt(match[1], 10);
            }
        });
    }

    const customToolCount = app.customScope ? app.customScope.size : 0;
    const customScopeHours = customToolCount * 5; 
    let servicesHours = 0; let servicesCost = 0;
    let activeModules = []; // NEW: Track selected modules

    SOW_QUESTIONS.filter(q => q.type === 'cost').forEach(q => {
        const checkbox = document.getElementById(q.id);
        if (checkbox && checkbox.checked) {
            servicesHours += q.hrs;
            servicesCost += q.cost;
            if (q.module) activeModules.push(q.module); // Capture ID
        }
    });

    const totalHoursRaw = baseHours + customScopeHours + servicesHours;

    let listContainer = document.getElementById('custom-scope-list-container');
    if (!listContainer) {
        const revenueContainer = document.getElementById('revenue-container');
        if(revenueContainer) {
            listContainer = document.createElement('div');
            listContainer.id = 'custom-scope-list-container';
            listContainer.className = "mt-3 pt-2 border-t border-gray-200 text-xs";
            revenueContainer.parentNode.insertBefore(listContainer, revenueContainer.nextSibling);
        }
    }
    
    if (listContainer) {
        let content = "";
        if (customToolCount > 0) {
            content += `<div class="mb-1"><span class="font-bold text-gray-500">Custom Tools:</span> <span class="text-indigo-600 font-semibold">${Array.from(app.customScope).join(", ")}</span></div>`;
        }
        const activeServices = SOW_QUESTIONS.filter(q => q.type === 'cost' && document.getElementById(q.id)?.checked).map(q => q.label);
        if (activeServices.length > 0) {
             content += `<div class="mb-1"><span class="font-bold text-gray-500">Services:</span> <span class="text-gray-700">${activeServices.join(", ")}</span></div>`;
        }
        listContainer.innerHTML = content;
        listContainer.style.display = content ? 'block' : 'none';
    }

    const baseLabel = document.getElementById('base-tools-count');
    if (baseLabel) {
        baseLabel.parentElement.innerHTML = `Total Scope: <span id="base-tools-count" class="font-bold text-gray-700">${totalHoursRaw} Hrs</span>`;
    }

    const PREP_FACTOR = 1.5; 
    const CONSULTING_VELOCITY = 3.5; 
    const combinedMultiplier = (mat + data + change) / 3; 
    const totalEffortHours = totalHoursRaw * PREP_FACTOR;
    const baseWeeks = (totalEffortHours / CONSULTING_VELOCITY); 
    const finalWeeks = Math.round(baseWeeks * combinedMultiplier);

    const calcWeeks = document.getElementById('calc-weeks');
    if(calcWeeks) calcWeeks.innerText = finalWeeks;

    const hourlyRate = 250; 
    const implementationCost = (baseHours + customScopeHours) * PREP_FACTOR * combinedMultiplier * hourlyRate;
    const onsiteCount = parseInt(onsiteInput ? onsiteInput.value : 0) || 0;
    const onsiteCost = onsiteCount * 7500;
    
    const totalSOW = implementationCost + onsiteCost + servicesCost;
    
    const sowDisplay = document.getElementById('sow-total');
    if(sowDisplay) {
        sowDisplay.innerText = "$" + totalSOW.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0});
    }

    app.currentSOW = {
        totalHours: totalHoursRaw, weeks: finalWeeks, totalCost: totalSOW, region: region, audience: audience,
        packages: d3.selectAll(".package-checkbox:checked").nodes().map(n => n.value),
        customTools: Array.from(app.customScope || []),
        services: SOW_QUESTIONS.filter(q => q.type === 'cost' && document.getElementById(q.id)?.checked).map(q => q.label),
        activeModules: activeModules, // Pass the IDs to the printer
        onsite: onsiteCount, multipliers: { mat: mat.toFixed(1), data: data.toFixed(1), change: change.toFixed(1) }
    };
    
    refreshAccordionHeight();
}

// --- PRINT SOW (BRANDING + TEMPLATES) ---
function generateSOWPrintView() {
    if (!app.currentSOW) { alert("Please configure a scope first."); return; }
    
    const clientName = prompt("Enter Client/Customer Name:", "Valued Client") || "Valued Client";
    const logoInput = prompt("Enter Client Logo URL (leave blank for default):", "");
    
    const logoHtml = (logoInput && logoInput.trim() !== "") 
        ? `<img src="${logoInput}" style="max-height: 50px; margin-bottom: 10px;">` 
        : `<div class="logo">PROCORE</div>`;

    const sow = app.currentSOW;
    const templateData = getSOWContent(sow); 
    const today = new Date().toLocaleDateString();
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) { alert("Please allow popups to print the SOW."); return; }

    let modulesHtml = "";
    templateData.modules.forEach(mod => {
        modulesHtml += `<div class="module">
            ${mod.body}
        </div>`;
    });

    let bodyContent = templateData.base.body
        .replace(/{{Client Name}}/g, clientName)
        .replace(/{{Date}}/g, today);

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>SOW: ${templateData.base.title}</title>
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
            <div class="title">${templateData.base.title}</div>
        </div>
        ${bodyContent}
        <h3>Scope of Services</h3>
        ${modulesHtml}
        <div class="total-box">
            <div style="font-size: 12px; text-transform: uppercase; font-weight: bold; opacity: 0.8;">Total Implementation Investment</div>
            <div class="total-cost">$${sow.totalCost.toLocaleString()}</div>
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

    // Handle Calculator Visibility & Mode
    const scopingContainer = d3.select("#scoping-ui-container");
    if (config.calculatorMode === 'hidden') {
        scopingContainer.classed("hidden", true);
    } else {
        scopingContainer.classed("hidden", !config.showScoping);
        if (typeof app !== 'undefined' && app.state) {
            app.state.calculatorMode = config.calculatorMode;
            calculateScoping(); // Re-run to apply disabled states
        }
    }

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

function populateRegionFilter() {
    if (typeof packagingData === 'undefined') return;
    const regionFilter = d3.select("#region-filter");
    if (regionFilter.empty()) return;

    const regions = new Set();
    packagingData.forEach(pkg => {
        if (pkg.region === 'NAM') regions.add('NAMER'); 
        else regions.add(pkg.region);
    });

    [...regions].sort().forEach(region => {
        let label = region;
        if (region === "EUR") label = "EMEA";
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
            addOns.forEach(a => allAddOns.add(a));
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
