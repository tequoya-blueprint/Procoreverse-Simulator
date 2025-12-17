// --- app-controls.js (PART 1 OF 3) ---
// VERSION: 760 (FINAL REPAIR: PART 1 - CONFIGURATION)

console.log("Controls v760: Loading Part 1...");

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

// --- DATA MAPPINGS ---
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

// --- STACK PRESETS ---
const STACK_PRESETS = {
    "legacy": { label: "Legacy Procore (PM Only)", tools: ["Drawings", "RFIs", "Submittals", "Directory", "Photos", "Daily Log", "Meetings"] },
    "competitor_a": { label: "Competitor Replacement (Field)", tools: ["Drawings", "Photos", "Punch List", "Inspections", "Observations"] },
    "manual": { label: "Manual / Excel Warrior", tools: ["Emails", "Documents", "Directory"] },
    "finance": { label: "ERP / Finance Focus", tools: ["Budget", "Commitments", "Direct Costs", "Invoicing", "ERP Systems"] }
};

// --- SOW QUESTIONNAIRE ---
const SOW_QUESTIONS = [
    { id: "q-sop", label: "SOP Development", type: "cost", hrs: 140, cost: 35000, module: "MOD_SOP" },
    { id: "q-consulting", label: "Virtual Consulting", type: "cost", hrs: 400, cost: 100000, module: "MOD_CONSULTING" },
    { id: "q-admin", label: "Project Admin", type: "cost", hrs: 140, cost: 35000, module: "MOD_ADMIN" },
    { id: "q-integration", label: "Integration Consulting", type: "cost", hrs: 25, cost: 6250, module: "MOD_INTEGRATION" },
    { id: "q-custom", label: "Custom Solutions", type: "cost", hrs: 40, cost: 10000, module: "MOD_CUSTOM" },
    { id: "q-financials", label: "Complex Finance", type: "risk", factor: 0.3, target: "data" },
    { id: "q-ent", label: "Enterprise Scale", type: "risk", factor: 0.2, target: "change" }
];

// --- SOW TEMPLATE LIBRARY ---
const SOW_LIBRARY = {
    "NAM_GC_BASE": {
        title: "STATEMENT OF WORK (GENERAL CONTRACTOR)",
        body: `<div class="sow-section"><h3>PARTIES</h3><p><strong>Provider:</strong> Procore Technologies, Inc., a Delaware corporation.<br><strong>Client:</strong> {{Client Name}}</p></div><div class="sow-section"><h3>OVERVIEW</h3><p>Client is implementing project management software products. To support Client’s strategic initiative, Client and Provider agree to the custom scope below.</p></div><div class="sow-section"><h3>TERM</h3><p>Services valid for 36 months.</p></div>`
    },
    "NAM_OWNER_BASE": {
        title: "STATEMENT OF WORK (OWNER/DEVELOPER)",
        body: `<div class="sow-section"><h3>PARTIES</h3><p><strong>Provider:</strong> Procore Technologies, Inc.<br><strong>Client:</strong> {{Client Name}}</p></div><div class="sow-section"><h3>OVERVIEW</h3><p>Client requires specialized assistance for capital project controls.</p></div><div class="sow-section"><h3>TERM</h3><p>Services outlined herein are valid for 36 months.</p></div>`
    },
    "APAC_BASE": {
        title: "STATEMENT OF WORK (APAC)",
        body: `<div class="sow-section"><h3>PARTIES</h3><p><strong>Provider:</strong> Procore Technologies Pty Ltd.<br><strong>Client:</strong> {{Client Name}}</p></div><div class="sow-section"><h3>REGIONAL TERMS</h3><ul><li><strong>Currency:</strong> AUD/SGD.</li><li><strong>GST:</strong> Fees are exclusive of GST.</li><li><strong>Jurisdiction:</strong> New South Wales.</li></ul></div>`
    },
    "EMEA_BASE": {
        title: "STATEMENT OF WORK (EMEA)",
        body: `<div class="sow-section"><h3>PARTIES</h3><p><strong>Provider:</strong> Procore Technologies Ltd.<br><strong>Client:</strong> {{Client Name}}</p></div><div class="sow-section"><h3>REGIONAL TERMS</h3><ul><li><strong>Data Protection:</strong> GDPR Compliant.</li><li><strong>VAT:</strong> Fees are exclusive of VAT.</li><li><strong>Jurisdiction:</strong> England and Wales.</li></ul></div>`
    },
    "MOD_SOP": { title: "SOP SERVICES", body: `<p>140 hours for SOP development.</p>` },
    "MOD_CONSULTING": { title: "VIRTUAL CONSULTING", body: `<p>400 hours of virtual consulting.</p>` },
    "MOD_TRAINING": { title: "ONSITE TRAINING", body: `<p>15 days onsite training.</p>` },
    "MOD_INTEGRATION": { title: "INTEGRATION CONSULTING", body: `<p>25 hours integration consulting.</p>` },
    "MOD_CUSTOM": { title: "CUSTOM SOLUTIONS", body: `<p>40 hours custom dev.</p>` },
    "MOD_ADMIN": { title: "PROJECT ADMIN", body: `<p>140 hours Implementation Manager.</p>` }
};

function getSOWContent(sowData) {
    let baseKey = "NAM_GC_BASE";
    if (sowData.region === "APAC") baseKey = "APAC_BASE";
    else if (sowData.region === "EMEA") baseKey = "EMEA_BASE";
    else if (sowData.audience === "O") baseKey = "NAM_OWNER_BASE";

    let modules = [];
    if (sowData.activeModules) {
        sowData.activeModules.forEach(modKey => {
            if (SOW_LIBRARY[modKey]) modules.push(SOW_LIBRARY[modKey]);
        });
    }
    if (sowData.onsite > 0) modules.push(SOW_LIBRARY["MOD_TRAINING"]);
    return { base: SOW_LIBRARY[baseKey], modules: modules };
}
// --- app-controls.js (PART 2 OF 3) ---
// VERSION: 760 (FINAL REPAIR: PART 2 - INITIALIZATION)

// --- INITIALIZATION CORE ---
function initializeControls() {
    console.log("Controls: Initializing...");
    
    try {
        if (typeof app !== 'undefined') {
            app.customScope = new Set();
            if (!app.state) app.state = {};
            if (!app.state.myStack) app.state.myStack = new Set();
            app.state.calculatorMode = 'edit'; 
        }

        document.querySelectorAll('.accordion-header').forEach(header => {
            header.addEventListener('click', () => { 
                if(typeof toggleAccordion === 'function') toggleAccordion(header.parentElement); 
            });
        });

        // INJECT UI
        injectControlsFooter();
        renderSOWQuestionnaire();

        // LISTENERS
        d3.select("#region-filter").on("change", onRegionChange);
        d3.select("#audience-filter").on("change", onAudienceChange);
        d3.select("#package-filter").on("change", onPackageChange); 
        d3.select("#persona-filter").on("change", () => { if (typeof updateGraph === 'function') updateGraph(true); });
        
        const ledToggle = d3.select("#toggle-procore-led");
        if (!ledToggle.empty()) {
            ledToggle.on("change", function() {
                if (typeof app !== 'undefined') app.state.showProcoreLedOnly = this.checked;
                if (typeof updateGraph === 'function') updateGraph(true);
            });
        }

        d3.select("#toggle-categories").on("click", toggleAllCategories);
        d3.select("#toggle-legend").on("click", toggleAllConnections);
        d3.select("#search-input").on("input", handleSearchInput);
        d3.select("#help-button").on("click", startOnboarding);
        d3.select("#left-panel-toggle").on("click", toggleLeftPanel);
        d3.select("#left-panel-expander").on("click", toggleLeftPanel);
        
        // CREDITS MODAL
        d3.select("#version-link").on("click", (e) => {
            e.preventDefault();
            document.getElementById('credits-modal-overlay')?.classList.add('visible');
        });
        d3.select("#credits-modal-close").on("click", () => {
            document.getElementById('credits-modal-overlay')?.classList.remove('visible');
        });

        // DEMO MODE SHORTCUT
        document.addEventListener('keydown', function(event) {
            if (event.shiftKey && (event.key === 'D' || event.key === 'd')) toggleDemoMode();
        });

        // TEAM SELECTOR
        const teamSelector = d3.select("#team-selector");
        if (!teamSelector.empty()) {
            const initialTeam = getUrlParam('team') || 'admin'; 
            teamSelector.property('value', initialTeam);
            setTimeout(() => applyTeamView(initialTeam), 250);
            teamSelector.on("change", function() { applyTeamView(this.value); });
        }
        
        // START DATA POLLING
        waitForDataAndPopulate();

    } catch (e) {
        console.error("Controls: Critical Init Error:", e);
    }
}

// --- DATA WAITING ENGINE ---
function waitForDataAndPopulate() {
    let attempts = 0;
    const maxAttempts = 60; 
    
    const interval = setInterval(() => {
        if (typeof packagingData !== 'undefined' && Array.isArray(packagingData)) {
            clearInterval(interval);
            console.log("Controls: Data loaded. Populating...");
            populateRegionFilter();
            populatePersonaFilter(); 
            if(typeof populateCategoryFilters === 'function') populateCategoryFilters();
        } else {
            attempts++;
            if (attempts >= maxAttempts) {
                clearInterval(interval);
                console.error("Controls: Data Timeout.");
                d3.select("#region-filter").html('<option value="error">⚠ Data Failed</option>');
            }
        }
    }, 250);
}

// --- FOOTER INJECTION ---
function injectControlsFooter() {
    const controls = d3.select("#controls");
    controls.selectAll(".footer-container").remove();

    const footer = controls.append("div")
        .attr("class", "footer-container pt-5 mt-5 border-t border-gray-100 flex-shrink-0 space-y-3");

    footer.append("button")
        .attr("id", "reset-view")
        .attr("class", "w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg text-sm transition shadow-md")
        .html('<i class="fas fa-sync-alt mr-2"></i> Reset View')
        .on("click", resetView);

    footer.append("button")
        .attr("id", "demo-toggle-btn")
        .attr("class", "w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg text-xs transition flex items-center justify-center")
        .html('<i class="fas fa-desktop mr-2"></i> Presentation Mode: OFF')
        .on("click", toggleDemoMode);

    footer.append("div")
        .attr("class", "text-center")
        .append("a")
        .attr("href", "#")
        .attr("id", "version-link")
        .attr("class", "text-[10px] text-gray-400 hover:text-gray-600 font-mono no-underline")
        .text("v2.2 Enterprise")
        .on("click", (e) => {
            e.preventDefault();
            document.getElementById('credits-modal-overlay')?.classList.add('visible');
        });
}

function toggleDemoMode() {
    const body = d3.select("body");
    const isDemo = body.classed("demo-mode-active");
    const btn = d3.select("#demo-toggle-btn");
    
    if (isDemo) {
        body.classed("demo-mode-active", false);
        d3.select("#scoping-ui-container").style("display", "block"); 
        d3.select("#ai-workflow-builder-btn").style("display", "block");
        d3.select("#manual-workflow-builder-btn").style("display", "block");
        d3.select("#team-selector").property("disabled", false).style("opacity", 1);
        btn.classed("bg-green-600 hover:bg-green-700 text-white", false).classed("bg-gray-200 hover:bg-gray-300 text-gray-700", true).html('<i class="fas fa-desktop mr-2"></i> Presentation Mode: OFF');
    } else {
        body.classed("demo-mode-active", true);
        d3.select("#scoping-ui-container").style("display", "none"); 
        d3.select("#ai-workflow-builder-btn").style("display", "none"); 
        d3.select("#manual-workflow-builder-btn").style("display", "none"); 
        applyTeamView('admin'); 
        d3.select("#team-selector").property("disabled", true).style("opacity", 0.5);
        btn.classed("bg-gray-200 hover:bg-gray-300 text-gray-700", false).classed("bg-green-600 hover:bg-green-700 text-white", true).html('<i class="fas fa-desktop mr-2"></i> Presentation Mode: ON');
    }
}
// --- app-controls.js (PART 3 OF 3) ---
// VERSION: 760 (FINAL REPAIR: PART 3 - LOGIC)

// --- REGION & AUDIENCE LOGIC ---
function populateRegionFilter() {
    const regionFilter = d3.select("#region-filter");
    if (regionFilter.empty()) return;
    regionFilter.html('<option value="all">Select Region...</option>');
    if (typeof packagingData === 'undefined') return;

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

function onRegionChange() {
    const region = d3.select(this).property("value");
    const audienceFilter = d3.select("#audience-filter");
    const stackBtn = d3.select("#stack-builder-btn");
    
    audienceFilter.property("value", "all").property("disabled", region === "all").html('<option value="all">All Audiences</option>');
    d3.select("#package-selection-area").classed("hidden", true);
    d3.select("#package-checkboxes").html("");
    
    if(typeof app !== 'undefined') {
        app.state.myStack.clear();
        if (app.state.isBuildingStack) toggleStackBuilderMode();
    }
    clearPackageDetails();
    
    if (region !== "all") {
        stackBtn.classed("bg-gray-100 text-gray-400 cursor-not-allowed", false).classed("bg-white text-gray-700 cursor-pointer", true).attr("disabled", null);
        const availableAudiences = new Set();
        packagingData.filter(pkg => pkg.region === region || (region === 'NAMER' && pkg.region === 'NAM')).forEach(pkg => {
            const audKey = audienceDataToKeyMap[pkg.audience];
            if (audKey) availableAudiences.add(audKey);
        });
        [...availableAudiences].sort().forEach(audKey => {
             audienceFilter.append("option").attr("value", audKey).text(audienceKeyToLabelMap[audKey]);
        });
    } else {
        stackBtn.classed("bg-gray-100 text-gray-400 cursor-not-allowed", true).classed("bg-white text-gray-700 cursor-pointer", false).attr("disabled", true);
    }
    if (typeof updateGraph === 'function') updateGraph(true);
}

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
                const label = packageList.append("label").attr("class", "flex items-center cursor-pointer py-1 hover:bg-gray-100 rounded px-1");
                label.append("input").attr("type", "checkbox").attr("value", pkg.package_name).attr("class", "form-checkbox h-4 w-4 text-indigo-600 package-checkbox mr-2").on("change", () => {
                    updatePackageAddOns();
                    if(typeof updateActivePackageState === 'function') updateActivePackageState(); 
                    if (typeof updateGraph === 'function') updateGraph(true);
                    calculateScoping();
                });
                label.append("span").text(pkg.package_name);
            });
        } else packageArea.classed("hidden", true);
    } else packageArea.classed("hidden", true);
    if (typeof updateGraph === 'function') updateGraph(true);
}

function onPackageChange() {
    if (app.state.isBuildingStack) toggleStackBuilderMode(); 
    const region = d3.select("#region-filter").property('value');
    const audience = d3.select("#audience-filter").property('value');
    const pkgName = d3.select("#package-filter").property('value');
    clearPackageDetails();
    if (region !== 'all' && audience !== 'all' && pkgName !== 'all') {
        const audienceDataKeys = audienceKeyToDataValuesMap[audience] || [];
        const packageInfo = packagingData.find(pkg => pkg.region === region && audienceDataKeys.includes(pkg.audience) && pkg.package_name === pkgName);
        if (packageInfo) populateAddOnsAndServices(packageInfo); 
    }
    refreshAccordionHeight();
    if (typeof updateGraph === 'function') updateGraph(true);
    calculateScoping();
}

function updatePackageAddOns() {
    if (app.state.isBuildingStack) toggleStackBuilderMode();
    const region = d3.select("#region-filter").property('value');
    const audience = d3.select("#audience-filter").property('value');
    const audienceDataKeys = audienceKeyToDataValuesMap[audience] || [];
    const selectedPackageNames = d3.selectAll(".package-checkbox:checked").nodes().map(n => n.value);
    const allAddOns = new Set();
    const allServices = new Set();
    selectedPackageNames.forEach(pkgName => {
        const pkg = packagingData.find(p => (p.region === region || (region === 'NAMER' && p.region === 'NAM')) && audienceDataKeys.includes(p.audience) && p.package_name === pkgName);
        if (pkg) {
            (pkg['available_add-ons'] || pkg['available_add_ons'] || pkg['add_ons'] || []).forEach(a => allAddOns.add(a));
            (pkg['available_services'] || []).forEach(s => allServices.add(s));
        }
    });
    const addOnsContainer = d3.select("#add-ons-container");
    const addOnsCheckboxes = d3.select("#add-ons-checkboxes");
    addOnsCheckboxes.html("");
    if (allAddOns.size > 0) {
        addOnsContainer.classed('hidden', false);
        [...allAddOns].sort().forEach(addOn => {
            const label = addOnsCheckboxes.append("label").attr("class", "flex items-center cursor-pointer py-1");
            label.append("input").attr("type", "checkbox").attr("value", addOn).attr("class", "form-checkbox h-5 w-5 text-orange-600 transition rounded mr-3 focus:ring-orange-500").on("change", () => {
                if (typeof updateGraph === 'function') updateGraph(true);
                calculateScoping();
            });
            label.append("span").attr("class", "text-gray-700").text(addOn);
        });
    } else addOnsContainer.classed('hidden', true);
    
    const servicesContainer = d3.select("#package-services-container");
    const servicesList = d3.select("#package-services-list");
    servicesList.html("");
    if (allServices.size > 0) {
        servicesContainer.classed('hidden', false);
        [...allServices].sort().forEach(service => {
            servicesList.append("div").attr("class", "flex items-center text-gray-700").html(`<i class="fas fa-check-circle text-green-500 mr-2"></i> ${service}`);
        });
    } else servicesContainer.classed('hidden', true);
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
                const pkg = packagingData.find(p => (p.region === region || (region === 'NAMER' && p.region === 'NAM')) && audienceDataKeys.includes(p.audience) && p.package_name === pkgName);
                if (pkg) {
                    pkg.tools.forEach(t => packageTools.add(t));
                    if (pkg.procore_led_tools) pkg.procore_led_tools.forEach(t => procoreLedTools.add(t));
                }
            });
            d3.selectAll("#add-ons-checkboxes input:checked").nodes().forEach(el => packageTools.add(el.value));
        }
    }
    return { categories: new Set(activeCategories), persona: d3.select("#persona-filter").property('value'), audience: audience, packageTools: packageTools, procoreLedTools: procoreLedTools, connectionTypes: new Set(activeConnectionTypes), showProcoreLed: showProcoreLed };
}

// --- SCOPING & CALCULATORS ---
function renderSOWQuestionnaire() {
    const revenueContainer = d3.select("#revenue-container");
    if(revenueContainer.empty()) return;

    revenueContainer.attr("class", "block w-full pt-2 border-t border-gray-200");
    revenueContainer.html("");
    
    revenueContainer.append("div").attr("id", "gap-pricing-toggle-container").attr("class", "mb-3 hidden bg-orange-50 p-2 rounded border border-orange-200");

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
        label.append("input").attr("type", "checkbox").attr("id", q.id).attr("class", "form-checkbox h-3.5 w-3.5 text-indigo-600 sow-question rounded mt-0.5 flex-shrink-0 focus:ring-indigo-500").on("change", calculateScoping);
        const textCol = label.append("div").attr("class", "ml-2 flex flex-col min-w-0");
        textCol.append("span").attr("class", "text-[11px] text-gray-700 font-medium leading-tight truncate").text(q.label).attr("title", q.label);
        if (q.type === 'cost') textCol.append("span").attr("class", "text-[9px] text-gray-400 mt-0.5").text("+$" + (q.cost/1000) + "k");
    });
    
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
    const gapAnalysis = getGapAnalysis();
    const gapToggleContainer = d3.select("#gap-pricing-toggle-container");
    let isGapPricing = false;

    if (gapAnalysis.gap.size > 0) {
        gapToggleContainer.classed("hidden", false);
        if (gapToggleContainer.html() === "") {
             gapToggleContainer.html(`
                <label class="flex items-center cursor-pointer justify-between">
                    <span class="text-xs font-bold text-orange-800"><i class="fas fa-exclamation-triangle mr-1"></i> Scope Gap Only? (${gapAnalysis.gap.size} tools)</span>
                    <input type="checkbox" id="use-gap-pricing" class="form-checkbox h-4 w-4 text-orange-600 focus:ring-orange-500 rounded">
                </label>`);
             d3.select("#use-gap-pricing").on("change", calculateScoping);
        }
        isGapPricing = d3.select("#use-gap-pricing").property("checked");
    } else {
        gapToggleContainer.classed("hidden", true).html("");
    }

    const region = d3.select("#region-filter").property('value');
    const audience = d3.select("#audience-filter").property('value');
    
    if (isGapPricing) {
        baseHours = gapAnalysis.gap.size * 6;
    } else {
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

    const customToolCount = app.customScope ? app.customScope.size : 0;
    const customScopeHours = customToolCount * 5; 
    let servicesHours = 0; let servicesCost = 0;
    let activeModules = []; 

    SOW_QUESTIONS.filter(q => q.type === 'cost').forEach(q => {
        const checkbox = document.getElementById(q.id);
        if (checkbox && checkbox.checked) {
            servicesHours += q.hrs; servicesCost += q.cost; if (q.module) activeModules.push(q.module);
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
        if (isGapPricing) content += `<div class="mb-1 p-1 bg-orange-100 rounded text-orange-800"><span class="font-bold">Gap Scope:</span> ${Array.from(gapAnalysis.gap).join(", ")}</div>`;
        if (customToolCount > 0) content += `<div class="mb-1"><span class="font-bold text-gray-500">Custom Tools:</span> <span class="text-indigo-600 font-semibold">${Array.from(app.customScope).join(", ")}</span></div>`;
        const activeServices = SOW_QUESTIONS.filter(q => q.type === 'cost' && document.getElementById(q.id)?.checked).map(q => q.label);
        if (activeServices.length > 0) content += `<div class="mb-1"><span class="font-bold text-gray-500">Services:</span> <span class="text-gray-700">${activeServices.join(", ")}</span></div>`;
        listContainer.innerHTML = content;
        listContainer.style.display = content ? 'block' : 'none';
    }

    const baseLabel = document.getElementById('base-tools-count');
    if (baseLabel) baseLabel.parentElement.innerHTML = `Total Scope: <span id="base-tools-count" class="font-bold text-gray-700">${totalHoursRaw} Hrs</span>`;

    const PREP_FACTOR = 1.5; 
    const CONSULTING_VELOCITY = 3.5; 
    const combinedMultiplier = (mat + data + change) / 3; 
    const implementationCost = (baseHours + customScopeHours) * PREP_FACTOR * combinedMultiplier * 250;
    const onsiteCount = parseInt(onsiteInput ? onsiteInput.value : 0) || 0;
    const totalSOW = implementationCost + (onsiteCount * 7500) + servicesCost;
    
    const sowDisplay = document.getElementById('sow-total');
    if(sowDisplay) sowDisplay.innerText = "$" + totalSOW.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0});

    app.currentSOW = {
        totalHours: totalHoursRaw, weeks: Math.round(((totalHoursRaw * PREP_FACTOR) / CONSULTING_VELOCITY) * combinedMultiplier), 
        totalCost: totalSOW, region: region, audience: audience,
        packages: d3.selectAll(".package-checkbox:checked").nodes().map(n => n.value),
        customTools: Array.from(app.customScope || []),
        services: SOW_QUESTIONS.filter(q => q.type === 'cost' && document.getElementById(q.id)?.checked).map(q => q.label),
        activeModules: activeModules, onsite: onsiteCount, isGapPricing: isGapPricing,
        ownedTools: Array.from(gapAnalysis.owned), targetTools: Array.from(gapAnalysis.target), gapTools: Array.from(gapAnalysis.gap)
    };
    refreshAccordionHeight();
}

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

// --- UTILITIES ---
function clearPackageDetails() {
    d3.select("#add-ons-checkboxes").html(""); d3.select("#package-services-list").html("");
    d3.select("#add-ons-container").classed('hidden', true); d3.select("#package-services-container").classed('hidden', true);
    if (app && app.customScope) app.customScope.clear();
    d3.selectAll(".sow-question").property("checked", false);
    d3.selectAll('.complexity-btn').classed('bg-indigo-600 text-white', false).classed('bg-gray-200 text-gray-700', true);
    d3.select('#btn-standard').classed('bg-gray-200 text-gray-700', false).classed('bg-indigo-600 text-white', true);
    calculateScoping();
}

function refreshAccordionHeight() {
    const content = document.querySelector('#packaging-container').closest('.accordion-content');
    if (content && content.parentElement.classList.contains('active')) content.style.maxHeight = content.scrollHeight + "px";
}

function updateActivePackageState() {
    if (typeof app === 'undefined') return;
    const region = d3.select("#region-filter").property('value');
    const audience = d3.select("#audience-filter").property('value');
    const audienceDataKeys = audienceKeyToDataValuesMap[audience] || [];
    const firstChecked = d3.select(".package-checkbox:checked");
    if (!firstChecked.empty()) {
        const pkgName = firstChecked.property("value");
        app.currentPackage = packagingData.find(p => (p.region === region || (region === 'NAMER' && p.region === 'NAM')) && audienceDataKeys.includes(p.audience) && p.package_name === pkgName);
    } else app.currentPackage = null;
}

function resetView() {
    if (typeof stopTour === 'function') stopTour();
    d3.select("#region-filter").property('value', 'all');
    d3.select("#audience-filter").property('value', 'all').property("disabled", true).html('<option value="all">All Audiences</option>');
    d3.select("#persona-filter").property('value', 'all');
    d3.select("#package-selection-area").classed("hidden", true); d3.select("#package-checkboxes").html("");
    d3.select("#toggle-procore-led").property("checked", false); if(typeof app !== 'undefined') app.state.showProcoreLedOnly = false;
    d3.selectAll("#category-filters input").property("checked", true); d3.selectAll(".legend-checkbox").property("checked", true); allCategoriesChecked = true;
    d3.selectAll(".sow-question").property("checked", false);
    if (app.state && app.state.isBuildingStack) toggleStackBuilderMode();
    app.state.myStack = new Set();
    d3.select("#stack-builder-btn").attr("disabled", true).classed("cursor-not-allowed", true);
    d3.select("#gap-pricing-toggle-container").classed("hidden", true).html("");
    clearPackageDetails();
    if (typeof updateGraph === 'function') updateGraph(false);
    if (typeof resetZoom === 'function') resetZoom();
}

function handleSearchInput() {
    if (typeof nodesData === 'undefined') return;
    const searchInput = this.value.toLowerCase().trim();
    const searchResults = d3.select("#search-results");
    if (searchInput.length < 2) { searchResults.html("").style("opacity", 0).style("transform", "scale(0.95)"); return; }
    const results = nodesData.filter(d => d.id.toLowerCase().includes(searchInput));
    searchResults.html("");
    if (results.length === 0) searchResults.append("div").attr("class", "search-item text-sm text-gray-500").text("No results found.");
    else {
        results.forEach(d => {
            searchResults.append("div").attr("class", "search-item text-sm flex items-center").html(`<span class="legend-color" style="background-color:${app.categories[d.group].color};"></span>${d.id}`).on("click", () => selectNodeFromSearch(d));
        });
    }
    searchResults.style("opacity", 1).style("transform", "scale(1)");
}

function selectNodeFromSearch(d) {
    if (typeof stopTour === 'function') stopTour();
    if(typeof app !== 'undefined' && app.simulation) {
        const isVisible = app.simulation.nodes().some(n => n.id === d.id);
        if (!isVisible) { if(typeof showToast === 'function') showToast(`"${d.id}" is hidden by filters. Resetting view.`, 3000); resetView(); }
        setTimeout(() => {
            const nodeData = app.simulation.nodes().find(n => n.id === d.id);
            if (nodeData) {
                app.interactionState = 'selected'; app.selectedNode = nodeData; applyHighlight(nodeData);
                if (typeof showInfoPanel === 'function') showInfoPanel(nodeData); centerViewOnNode(nodeData);
            }
        }, isVisible ? 0 : 600);
    }
    d3.select("#search-input").property("value", ""); d3.select("#search-results").html("").style("opacity", 0).style("transform", "scale(0.95)");
}

function toggleStackBuilderMode() {
    if (d3.select("#region-filter").property("value") === "all") {
        if(typeof showToast === 'function') showToast("Please select a Region first.", 3000);
        return;
    }
    app.state.isBuildingStack = !app.state.isBuildingStack;
    let btn = d3.select("#stack-builder-btn");
    
    if (app.state.isBuildingStack) {
        app.interactionState = 'building_stack';
        btn.classed("bg-green-600 hover:bg-green-700 text-white border-green-700", true).classed("bg-white text-gray-700 border-gray-200", false).html('<i class="fas fa-check-circle mr-2"></i> Done Selecting Tools');
        if(typeof showToast === 'function') showToast("Builder Active: Click tools the customer CURRENTLY owns.", 4000);
        
        const presetContainer = d3.select("#packaging-container").insert("div", "#stack-builder-btn + *").attr("id", "stack-preset-container").attr("class", "mb-4 p-3 bg-green-50 rounded border border-green-200");
        presetContainer.append("label").attr("class", "block text-xs font-bold text-green-800 mb-1 uppercase").text("Quick Stack Presets");
        const select = presetContainer.append("select").attr("class", "w-full text-xs border-green-300 rounded p-1.5 focus:ring-green-500 focus:border-green-500 bg-white")
            .on("change", function() { const key = this.value; if (key === 'none') return; applyStackPreset(key); });
        select.append("option").attr("value", "none").text("Select a Starting Point...");
        Object.entries(STACK_PRESETS).forEach(([key, data]) => { select.append("option").attr("value", key).text(data.label); });

        d3.selectAll(".node").transition().duration(300).style("opacity", 0.4);
        highlightOwnedNodes();
    } else {
        app.interactionState = 'explore';
        btn.classed("bg-green-600 hover:bg-green-700 text-white border-green-700", false).classed("bg-white text-gray-700 border-gray-300 hover:bg-gray-50", true).html('<i class="fas fa-layer-group mr-2 text-green-600"></i> Define Customer Stack');
        d3.select("#stack-preset-container").remove();
        if (typeof updateGraph === 'function') updateGraph(true);
        if (app.state.myStack.size > 0 && typeof showToast === 'function') {
            showToast("Stack Saved! Select a Package to see Gaps.", 3000);
            calculateScoping(); 
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
    if (app.state.myStack.has(d.id)) app.state.myStack.delete(d.id);
    else app.state.myStack.add(d.id);
    highlightOwnedNodes();
}

function highlightOwnedNodes() {
    if (!app.node) return;
    app.node.transition().duration(200)
        .style("opacity", d => app.state.myStack.has(d.id) ? 1 : 0.4) 
        .style("filter", d => app.state.myStack.has(d.id) ? "drop-shadow(0 0 6px rgba(77, 164, 70, 0.6))" : "none")
        .select("path").style("stroke", d => app.state.myStack.has(d.id) ? "#4da446" : "#fff").style("stroke-width", d => app.state.myStack.has(d.id) ? 3 : 1);
}

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

function populateCategoryFilters() {
    const filtersContainer = d3.select("#category-filters");
    if(filtersContainer.empty() || typeof app === 'undefined' || !app.categories) return;
    filtersContainer.html("");
    Object.keys(app.categories).sort().forEach(cat => {
        const label = filtersContainer.append("label").attr("class", "flex items-center cursor-pointer py-1");
        label.append("input").attr("type", "checkbox").attr("checked", true).attr("value", cat).attr("class", "form-checkbox h-5 w-5 text-orange-600 transition rounded mr-3 focus:ring-orange-500").on("change", () => {if (typeof updateGraph === 'function') updateGraph(true)});
        label.append("span").attr("class", "legend-color").style("background-color", app.categories[cat].color);
        label.append("span").attr("class", "text-gray-700").text(cat);
    });
}

function toggleAllCategories() {
    allCategoriesChecked = !allCategoriesChecked;
    d3.selectAll("#category-filters input").property("checked", allCategoriesChecked);
    if (typeof updateGraph === 'function') updateGraph(true);
}

function toggleAllConnections() {
    const checkboxes = d3.selectAll(".legend-checkbox");
    if (checkboxes.empty()) return;
    const allChecked = checkboxes.nodes().every(node => node.checked);
    checkboxes.property("checked", !allChecked);
    if (typeof updateGraph === 'function') updateGraph(true);
}
