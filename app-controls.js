// --- app-controls.js (BLOCK 1 OF 4) ---
// VERSION: 770 (FINAL ASSEMBLY: CONFIGURATION)

console.log("Controls v770: Loading Block 1...");

// --- TEAM CONFIGURATION RULES ---
const TEAM_CONFIG = {
    admin: { showTours: true, showAiBuilder: true, showManualBuilder: true, showScoping: true, calculatorMode: 'edit', showFilters: true, showLegend: true, defaultOpen: 'view-options-accordion' },
    enablement: { showTours: true, showAiBuilder: true, showManualBuilder: true, showScoping: false, calculatorMode: 'hidden', showFilters: true, showLegend: true, defaultOpen: 'view-options-accordion' },
    sales: { showTours: true, showAiBuilder: false, showManualBuilder: false, showScoping: true, calculatorMode: 'view', showFilters: true, showLegend: true, defaultOpen: 'view-options-accordion' },
    product: { showTours: true, showAiBuilder: true, showManualBuilder: true, showScoping: false, calculatorMode: 'hidden', showFilters: true, showLegend: true, defaultOpen: 'view-options-accordion' },
    services: { showTours: true, showAiBuilder: true, showManualBuilder: true, showScoping: true, calculatorMode: 'edit', showFilters: true, showLegend: true, defaultOpen: 'scoping-ui-container' }
};

function getUrlParam(param) { const urlParams = new URLSearchParams(window.location.search); return urlParams.get(param); }

// --- DATA MAPPINGS ---
const audienceKeyToDataValuesMap = { "GC": ["Contractor", "General Contractor", "GC"], "SC": ["SC", "Specialty Contractor"], "O": ["Owners", "Owner", "Owner Developer *Coming Soon", "O"], "RM": ["Resource Management"] };
const audienceDataToKeyMap = { "Contractor": "GC", "General Contractor": "GC", "GC": "GC", "SC": "SC", "Specialty Contractor": "SC", "Owners": "O", "Owner": "O", "Owner Developer *Coming Soon": "O", "O": "O", "Resource Management": "RM" };
const audienceKeyToLabelMap = { "GC": "General Contractor", "SC": "Specialty Contractor", "O": "Owner", "RM": "Resource Management" };

// --- STACK PRESETS ---
const STACK_PRESETS = {
    "legacy": { label: "Legacy Procore (PM Only)", tools: ["Drawings", "RFIs", "Submittals", "Directory", "Photos", "Daily Log", "Meetings"] },
    "competitor_a": { label: "Competitor Replacement (Field)", tools: ["Drawings", "Photos", "Punch List", "Inspections", "Observations"] },
    "manual": { label: "Manual / Excel Warrior", tools: ["Emails", "Documents", "Directory"] },
    "finance": { label: "ERP / Finance Focus", tools: ["Budget", "Commitments", "Direct Costs", "Invoicing", "ERP Systems"] }
};

// --- SOW CONFIGURATION ---
const SOW_QUESTIONS = [
    { id: "q-sop", label: "SOP Development", type: "cost", hrs: 140, cost: 35000, module: "MOD_SOP" },
    { id: "q-consulting", label: "Virtual Consulting", type: "cost", hrs: 400, cost: 100000, module: "MOD_CONSULTING" },
    { id: "q-admin", label: "Project Admin", type: "cost", hrs: 140, cost: 35000, module: "MOD_ADMIN" },
    { id: "q-integration", label: "Integration Consulting", type: "cost", hrs: 25, cost: 6250, module: "MOD_INTEGRATION" },
    { id: "q-custom", label: "Custom Solutions", type: "cost", hrs: 40, cost: 10000, module: "MOD_CUSTOM" },
    { id: "q-financials", label: "Complex Finance", type: "risk", factor: 0.3, target: "data" },
    { id: "q-ent", label: "Enterprise Scale", type: "risk", factor: 0.2, target: "change" }
];

const SOW_LIBRARY = {
    "NAM_GC_BASE": { title: "STATEMENT OF WORK (GC)", body: `<div class="sow-section"><h3>PARTIES</h3><p><strong>Provider:</strong> Procore Technologies, Inc.<br><strong>Client:</strong> {{Client Name}}</p></div><div class="sow-section"><h3>OVERVIEW</h3><p>Client is implementing project management software.</p></div><div class="sow-section"><h3>TERM</h3><p>36 months.</p></div>` },
    "NAM_OWNER_BASE": { title: "STATEMENT OF WORK (OWNER)", body: `<div class="sow-section"><h3>PARTIES</h3><p><strong>Provider:</strong> Procore Technologies, Inc.<br><strong>Client:</strong> {{Client Name}}</p></div><div class="sow-section"><h3>OVERVIEW</h3><p>Client requires specialized capital project controls.</p></div>` },
    "APAC_BASE": { title: "STATEMENT OF WORK (APAC)", body: `<div class="sow-section"><h3>PARTIES</h3><p><strong>Provider:</strong> Procore Technologies Pty Ltd.<br><strong>Client:</strong> {{Client Name}}</p></div><div class="sow-section"><h3>TERMS</h3><p>AUD/SGD. GST Exclusive.</p></div>` },
    "EMEA_BASE": { title: "STATEMENT OF WORK (EMEA)", body: `<div class="sow-section"><h3>PARTIES</h3><p><strong>Provider:</strong> Procore Technologies Ltd.<br><strong>Client:</strong> {{Client Name}}</p></div><div class="sow-section"><h3>TERMS</h3><p>GDPR Compliant. VAT Exclusive.</p></div>` },
    "MOD_SOP": { title: "SOP SERVICES", body: `<p>140 hours for SOP development.</p>` },
    "MOD_CONSULTING": { title: "VIRTUAL CONSULTING", body: `<p>400 hours virtual consulting.</p>` },
    "MOD_TRAINING": { title: "ONSITE TRAINING", body: `<p>15 days onsite training.</p>` },
    "MOD_INTEGRATION": { title: "INTEGRATION", body: `<p>25 hours integration consulting.</p>` },
    "MOD_CUSTOM": { title: "CUSTOM SOLUTIONS", body: `<p>40 hours custom dev.</p>` },
    "MOD_ADMIN": { title: "PROJECT ADMIN", body: `<p>140 hours Implementation Manager.</p>` }
};

function getSOWContent(sowData) {
    let baseKey = "NAM_GC_BASE";
    if (sowData.region === "APAC") baseKey = "APAC_BASE"; else if (sowData.region === "EMEA") baseKey = "EMEA_BASE"; else if (sowData.audience === "O") baseKey = "NAM_OWNER_BASE";
    let modules = [];
    if (sowData.activeModules) sowData.activeModules.forEach(modKey => { if (SOW_LIBRARY[modKey]) modules.push(SOW_LIBRARY[modKey]); });
    if (sowData.onsite > 0) modules.push(SOW_LIBRARY["MOD_TRAINING"]);
    return { base: SOW_LIBRARY[baseKey], modules: modules };
}
// --- app-controls.js (BLOCK 2 OF 4) ---
// VERSION: 770 (FINAL ASSEMBLY: INITIALIZATION)

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
            header.addEventListener('click', () => { if(typeof toggleAccordion === 'function') toggleAccordion(header.parentElement); });
        });

        injectControlsFooter();
        renderSOWQuestionnaire(); // Required for UI

        d3.select("#region-filter").on("change", onRegionChange);
        d3.select("#audience-filter").on("change", onAudienceChange);
        d3.select("#package-filter").on("change", onPackageChange); 
        d3.select("#persona-filter").on("change", () => { if (typeof updateGraph === 'function') updateGraph(true); });
        
        const ledToggle = d3.select("#toggle-procore-led");
        if (!ledToggle.empty()) ledToggle.on("change", function() { if (typeof app !== 'undefined') app.state.showProcoreLedOnly = this.checked; if (typeof updateGraph === 'function') updateGraph(true); });

        d3.select("#toggle-categories").on("click", toggleAllCategories);
        d3.select("#toggle-legend").on("click", toggleAllConnections);
        d3.select("#search-input").on("input", handleSearchInput);
        d3.select("#help-button").on("click", startOnboarding);
        d3.select("#left-panel-toggle").on("click", toggleLeftPanel);
        d3.select("#left-panel-expander").on("click", toggleLeftPanel);
        
        d3.select("#version-link").on("click", (e) => { e.preventDefault(); document.getElementById('credits-modal-overlay')?.classList.add('visible'); });
        d3.select("#credits-modal-close").on("click", () => { document.getElementById('credits-modal-overlay')?.classList.remove('visible'); });

        document.addEventListener('keydown', function(event) { if (event.shiftKey && (event.key === 'D' || event.key === 'd')) toggleDemoMode(); });

        const teamSelector = d3.select("#team-selector");
        if (!teamSelector.empty()) {
            const initialTeam = getUrlParam('team') || 'admin'; 
            teamSelector.property('value', initialTeam);
            setTimeout(() => applyTeamView(initialTeam), 250);
            teamSelector.on("change", function() { applyTeamView(this.value); });
        }
        
        waitForDataAndPopulate();

    } catch (e) { console.error("Controls: Critical Init Error:", e); }
}

function waitForDataAndPopulate() {
    let attempts = 0; const maxAttempts = 60;
    const interval = setInterval(() => {
        if (typeof packagingData !== 'undefined' && Array.isArray(packagingData)) {
            clearInterval(interval);
            populateRegionFilter(); populatePersonaFilter(); if(typeof populateCategoryFilters === 'function') populateCategoryFilters();
        } else {
            attempts++;
            if (attempts >= maxAttempts) { clearInterval(interval); console.error("Controls: Data Timeout."); d3.select("#region-filter").html('<option value="error">⚠ Data Failed</option>'); }
        }
    }, 250);
}

function injectControlsFooter() {
    const controls = d3.select("#controls");
    controls.selectAll(".footer-container").remove();
    const footer = controls.append("div").attr("class", "footer-container pt-5 mt-5 border-t border-gray-100 flex-shrink-0 space-y-3");

    footer.append("button").attr("id", "reset-view").attr("class", "w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg text-sm transition shadow-md").html('<i class="fas fa-sync-alt mr-2"></i> Reset View').on("click", resetView);
    footer.append("button").attr("id", "demo-toggle-btn").attr("class", "w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg text-xs transition flex items-center justify-center").html('<i class="fas fa-desktop mr-2"></i> Presentation Mode: OFF').on("click", toggleDemoMode);
    footer.append("div").attr("class", "text-center").append("a").attr("href", "#").attr("id", "version-link").attr("class", "text-[10px] text-gray-400 hover:text-gray-600 font-mono no-underline").text("v2.2 Enterprise").on("click", (e) => { e.preventDefault(); document.getElementById('credits-modal-overlay')?.classList.add('visible'); });
}

function toggleDemoMode() {
    const body = d3.select("body"); const isDemo = body.classed("demo-mode-active"); const btn = d3.select("#demo-toggle-btn");
    if (isDemo) {
        body.classed("demo-mode-active", false);
        d3.select("#scoping-ui-container").style("display", "block"); d3.select("#ai-workflow-builder-btn").style("display", "block"); d3.select("#manual-workflow-builder-btn").style("display", "block"); d3.select("#team-selector").property("disabled", false).style("opacity", 1);
        btn.classed("bg-green-600", false).classed("bg-gray-200", true).classed("text-white", false).classed("text-gray-600", true).html('<i class="fas fa-desktop mr-2"></i> Presentation Mode: OFF');
    } else {
        body.classed("demo-mode-active", true);
        d3.select("#scoping-ui-container").style("display", "none"); d3.select("#ai-workflow-builder-btn").style("display", "none"); d3.select("#manual-workflow-builder-btn").style("display", "none");
        applyTeamView('admin'); d3.select("#team-selector").property("disabled", true).style("opacity", 0.5);
        btn.classed("bg-gray-200", false).classed("bg-green-600", true).classed("text-gray-600", false).classed("text-white", true).html('<i class="fas fa-desktop mr-2"></i> Presentation Mode: ON');
    }
}
// --- app-controls.js (BLOCK 3 OF 4) ---
// VERSION: 770 (FINAL ASSEMBLY: SOW & GAP LOGIC)

function renderSOWQuestionnaire() {
    const revenueContainer = d3.select("#revenue-container");
    if(revenueContainer.empty()) return;
    revenueContainer.attr("class", "block w-full pt-2 border-t border-gray-200");
    revenueContainer.html("");
    
    revenueContainer.append("div").attr("id", "gap-pricing-toggle-container").attr("class", "mb-3 hidden bg-orange-50 p-2 rounded border border-orange-200");

    const complexityDiv = revenueContainer.append("div").attr("class", "mb-3 flex gap-2");
    ['Standard', 'Complex', 'Transform'].forEach(label => {
        const key = label.toLowerCase();
        complexityDiv.append("button").attr("id", `btn-${key}`).attr("class", `complexity-btn flex-1 py-1 text-[10px] font-bold uppercase rounded transition ${key === 'standard' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`).text(label).on("click", () => setComplexity(key));
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

function setComplexity(level) {
    if (app.state.calculatorMode === 'view') { if(typeof showToast === 'function') showToast("View Only Mode."); return; }
    const map = { 'standard': { mat: 1.0, data: 1.0, change: 1.0 }, 'complex': { mat: 1.4, data: 1.5, change: 1.3 }, 'transform': { mat: 1.8, data: 2.0, change: 1.8 } };
    const vals = map[level];
    if (vals) {
        document.getElementById('slider-maturity').value = vals.mat; document.getElementById('slider-data').value = vals.data; document.getElementById('slider-change').value = vals.change;
        calculateScoping();
        d3.selectAll('.complexity-btn').classed('bg-indigo-600 text-white', false).classed('bg-gray-200 text-gray-700', true);
        d3.select(`#btn-${level}`).classed('bg-gray-200 text-gray-700', false).classed('bg-indigo-600 text-white', true);
    }
}

function calculateScoping() {
    const isViewOnly = (app.state.calculatorMode === 'view');
    const sliderMaturity = document.getElementById('slider-maturity');
    if (sliderMaturity) {
        ['slider-maturity','slider-data','slider-change','onsite-input'].forEach(id => { const el = document.getElementById(id); if(el) el.disabled = isViewOnly; });
        d3.selectAll('.sow-question').property('disabled', isViewOnly);
        d3.selectAll('.complexity-btn').classed('opacity-50 cursor-not-allowed', isViewOnly);
    }
    if (!sliderMaturity) return;

    let mat = parseFloat(sliderMaturity.value); let data = parseFloat(document.getElementById('slider-data').value); let change = parseFloat(document.getElementById('slider-change').value);
    SOW_QUESTIONS.filter(q => q.type === 'risk').forEach(q => { const chk = document.getElementById(q.id); if (chk && chk.checked) { if (q.target === 'data') data += q.factor; if (q.target === 'change') change += q.factor; } });

    document.getElementById('val-maturity').innerText = mat.toFixed(1) + "x"; document.getElementById('val-data').innerText = data.toFixed(1) + "x"; document.getElementById('val-change').innerText = change.toFixed(1) + "x";

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
    } else gapToggle.classed("hidden", true).html("");

    if (isGapPricing) baseHours = gapAnalysis.gap.size * 6; 
    else {
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

    const customScopeHours = (app.customScope ? app.customScope.size : 0) * 5; 
    let servicesHours = 0; let servicesCost = 0; let activeModules = []; 
    SOW_QUESTIONS.filter(q => q.type === 'cost').forEach(q => { const chk = document.getElementById(q.id); if (chk && chk.checked) { servicesHours += q.hrs; servicesCost += q.cost; if (q.module) activeModules.push(q.module); } });

    const totalHoursRaw = baseHours + customScopeHours + servicesHours;
    let listContainer = document.getElementById('custom-scope-list-container');
    if (!listContainer) { const rc = document.getElementById('revenue-container'); if(rc) { listContainer = document.createElement('div'); listContainer.id = 'custom-scope-list-container'; listContainer.className = "mt-3 pt-2 border-t border-gray-200 text-xs"; rc.parentNode.insertBefore(listContainer, rc.nextSibling); } }
    
    if (listContainer) {
        let content = "";
        if (isGapPricing) content += `<div class="mb-1 p-1 bg-orange-100 rounded text-orange-800"><span class="font-bold">Gap Scope:</span> ${Array.from(gapAnalysis.gap).join(", ")}</div>`;
        if (app.customScope && app.customScope.size > 0) content += `<div class="mb-1"><span class="font-bold text-gray-500">Custom:</span> <span class="text-indigo-600">${Array.from(app.customScope).join(", ")}</span></div>`;
        listContainer.innerHTML = content; listContainer.style.display = content ? 'block' : 'none';
    }

    document.getElementById('base-tools-count').innerText = totalHoursRaw + " Hrs";
    const multiplier = (mat + data + change) / 3;
    const finalWeeks = Math.round(((totalHoursRaw * 1.5) / 3.5) * multiplier);
    document.getElementById('calc-weeks').innerText = finalWeeks;
    
    const impCost = (baseHours + customScopeHours) * 1.5 * multiplier * 250;
    const onsiteCount = parseInt(document.getElementById('onsite-input').value || 0);
    const totalSOW = impCost + (onsiteCount * 7500) + servicesCost;
    document.getElementById('sow-total').innerText = "$" + totalSOW.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0});

    app.currentSOW = {
        totalCost: totalSOW, weeks: finalWeeks, activeModules: activeModules, onsite: onsiteCount, isGapPricing: isGapPricing,
        ownedTools: Array.from(gapAnalysis.owned), targetTools: Array.from(gapAnalysis.target), gapTools: Array.from(gapAnalysis.gap)
    };
    refreshAccordionHeight();
}

function generateSOWPrintView() {
    if (!app.currentSOW) { alert("Configure scope first."); return; }
    const clientName = prompt("Client Name:", "Valued Client") || "Client";
    const logoInput = prompt("Logo URL:", "");
    const logoHtml = logoInput ? `<img src="${logoInput}" style="max-height: 50px;">` : `<div class="logo">PROCORE</div>`;
    const sow = app.currentSOW;
    const templateData = getSOWContent({ region: d3.select("#region-filter").property("value"), audience: d3.select("#audience-filter").property("value"), activeModules: sow.activeModules, onsite: sow.onsite }); 

    let gapHtml = "";
    if (sow.gapTools && sow.gapTools.length > 0) {
        gapHtml = `<div class="sow-section"><h3>Gap Analysis</h3><p><strong>Current:</strong> ${sow.ownedTools.join(", ") || "None"}</p><p><strong>Target:</strong> ${sow.targetTools.join(", ")}</p><p style="color:#c2410c; font-weight:bold;">Gap to Close: ${sow.gapTools.join(", ")}</p></div>`;
    }

    let modulesHtml = templateData.modules.map(m => `<div class="module">${m.body}</div>`).join('');
    let bodyContent = templateData.base.body.replace(/{{Client Name}}/g, clientName);

    const html = `<!DOCTYPE html><html><head><title>SOW</title><style>body{font-family:sans-serif;padding:40px;max-width:800px;margin:0 auto;} .header{display:flex;justify-content:space-between;border-bottom:3px solid #F36C23;padding-bottom:20px;margin-bottom:20px;} .total-box{background:#1f2937;color:white;padding:20px;text-align:right;border-radius:8px;} .module{background:#f9fafb;padding:15px;margin-bottom:15px;border:1px solid #eee;}</style></head><body><div class="header"><div>${logoHtml}</div><h1>${templateData.base.title}</h1></div>${bodyContent}${gapHtml}<h3>Scope</h3>${modulesHtml}<div class="total-box"><h2>Total: $${sow.totalCost.toLocaleString()}</h2><p>Est. Timeline: ${sow.weeks} Weeks</p></div><script>window.print();</script></body></html>`;
    const win = window.open('', '_blank'); if(win) { win.document.write(html); win.document.close(); }
}
// --- app-controls.js (BLOCK 4 OF 4) ---
// VERSION: 770 (FINAL ASSEMBLY: FILTERS & STACK BUILDER)

function toggleStackBuilderMode() {
    if (d3.select("#region-filter").property("value") === "all") { if(typeof showToast === 'function') showToast("Select Region first.", 3000); return; }
    app.state.isBuildingStack = !app.state.isBuildingStack;
    let btn = d3.select("#stack-builder-btn");
    
    if (app.state.isBuildingStack) {
        app.interactionState = 'building_stack';
        btn.classed("bg-green-600 hover:bg-green-700 text-white", true).classed("bg-white text-gray-700", false).html('<i class="fas fa-check-circle mr-2"></i> Done Selecting Tools');
        if(typeof showToast === 'function') showToast("Builder Active: Click tools.", 4000);
        
        const container = d3.select("#packaging-container").insert("div", "#stack-builder-btn + *").attr("id", "stack-preset-container").attr("class", "mb-4 p-3 bg-green-50 rounded border border-green-200");
        container.append("label").attr("class", "block text-xs font-bold text-green-800 mb-1").text("Quick Stack Presets");
        const select = container.append("select").attr("class", "w-full text-xs rounded p-1.5").on("change", function() { const k=this.value; if(k!=='none') applyStackPreset(k); });
        select.append("option").attr("value", "none").text("Select Preset...");
        Object.entries(STACK_PRESETS).forEach(([k, d]) => select.append("option").attr("value", k).text(d.label));
        d3.selectAll(".node").transition().duration(300).style("opacity", 0.4); highlightOwnedNodes();
    } else {
        app.interactionState = 'explore';
        btn.classed("bg-green-600 hover:bg-green-700 text-white", false).classed("bg-white text-gray-700", true).html('<i class="fas fa-layer-group mr-2 text-green-600"></i> Define Customer Stack');
        d3.select("#stack-preset-container").remove();
        if (typeof updateGraph === 'function') updateGraph(true);
        if (app.state.myStack.size > 0) { if(typeof showToast === 'function') showToast("Stack Saved.", 3000); calculateScoping(); }
    }
}

function applyStackPreset(key) {
    if (!STACK_PRESETS[key]) return;
    app.state.myStack.clear(); STACK_PRESETS[key].tools.forEach(t => app.state.myStack.add(t));
    highlightOwnedNodes(); if(typeof showToast === 'function') showToast(`Applied ${STACK_PRESETS[key].label}`);
}

function highlightOwnedNodes() {
    if (!app.node) return;
    app.node.transition().duration(200).style("opacity", d => app.state.myStack.has(d.id) ? 1 : 0.4).style("filter", d => app.state.myStack.has(d.id) ? "drop-shadow(0 0 6px rgba(77, 164, 70, 0.6))" : "none");
    app.node.select("path").style("stroke", d => app.state.myStack.has(d.id) ? "#4da446" : "#fff").style("stroke-width", d => app.state.myStack.has(d.id) ? 3 : 1);
}

function toggleStackItem(d) {
    if (!app.state.myStack) app.state.myStack = new Set();
    if (app.state.myStack.has(d.id)) app.state.myStack.delete(d.id); else app.state.myStack.add(d.id);
    highlightOwnedNodes();
}

function getGapAnalysis() {
    const filters = getActiveFilters(); const target = filters.packageTools || new Set(); const owned = app.state.myStack || new Set();
    const gap = new Set(); const matched = new Set(); const outlier = new Set();
    if (target.size > 0) {
        target.forEach(t => { if (owned.has(t)) matched.add(t); else gap.add(t); });
        owned.forEach(t => { if (!target.has(t)) outlier.add(t); });
    }
    return { owned, gap, matched, outlier, target };
}

function populateRegionFilter() {
    const rf = d3.select("#region-filter"); if (rf.empty()) return;
    rf.html('<option value="all">Select Region...</option>');
    if (typeof packagingData === 'undefined') return;
    const regions = new Set(); packagingData.forEach(p => regions.add(p.region === 'NAM' ? 'NAMER' : p.region));
    [...regions].sort().forEach(r => { let l = r; if(r==="EUR") l="EMEA"; rf.append("option").attr("value", r).text(l); });
}

function onRegionChange() {
    const r = d3.select(this).property("value"); const af = d3.select("#audience-filter"); const btn = d3.select("#stack-builder-btn");
    af.property("value", "all").property("disabled", r === "all").html('<option value="all">All Audiences</option>');
    d3.select("#package-selection-area").classed("hidden", true); d3.select("#package-checkboxes").html("");
    if(typeof app !== 'undefined') { app.state.myStack.clear(); if(app.state.isBuildingStack) toggleStackBuilderMode(); }
    clearPackageDetails();
    if (r !== "all") {
        btn.classed("bg-gray-100 text-gray-400 cursor-not-allowed", false).classed("bg-white text-gray-700 cursor-pointer", true).attr("disabled", null);
        const auds = new Set(); packagingData.filter(p => p.region === r || (r === 'NAMER' && p.region === 'NAM')).forEach(p => { const k = audienceDataToKeyMap[p.audience]; if(k) auds.add(k); });
        [...auds].sort().forEach(k => af.append("option").attr("value", k).text(audienceKeyToLabelMap[k]));
    } else btn.classed("bg-gray-100 text-gray-400 cursor-not-allowed", true).classed("bg-white text-gray-700 cursor-pointer", false).attr("disabled", true);
    if (typeof updateGraph === 'function') updateGraph(true);
}

function onAudienceChange() {
    const r = d3.select("#region-filter").property("value"); const a = d3.select(this).property("value");
    const pa = d3.select("#package-selection-area"); const pl = d3.select("#package-checkboxes");
    pl.html(""); clearPackageDetails();
    if (r !== 'all' && a !== 'all') {
        const keys = audienceKeyToDataValuesMap[a] || [];
        const pkgs = packagingData.filter(p => (p.region === r || (r === 'NAMER' && p.region === 'NAM')) && keys.includes(p.audience));
        if (pkgs.length > 0) {
            pa.classed("hidden", false);
            pkgs.sort((x,y) => x.package_name.localeCompare(y.package_name)).forEach(p => {
                const l = pl.append("label").attr("class", "flex items-center cursor-pointer py-1 hover:bg-gray-100 rounded px-1");
                l.append("input").attr("type", "checkbox").attr("value", p.package_name).attr("class", "form-checkbox h-4 w-4 text-indigo-600 package-checkbox mr-2").on("change", () => {
                    updatePackageAddOns(); if(typeof updateActivePackageState==='function') updateActivePackageState(); if(typeof updateGraph==='function') updateGraph(true); calculateScoping();
                });
                l.append("span").text(p.package_name);
            });
        } else pa.classed("hidden", true);
    } else pa.classed("hidden", true);
    if(typeof updateGraph === 'function') updateGraph(true);
}

function onPackageChange() { /* Legacy Handler - Unused but kept for safety */ }

function updatePackageAddOns() {
    if (app.state.isBuildingStack) toggleStackBuilderMode();
    const r = d3.select("#region-filter").property('value'); const a = d3.select("#audience-filter").property('value');
    const keys = audienceKeyToDataValuesMap[a] || [];
    const sels = d3.selectAll(".package-checkbox:checked").nodes().map(n => n.value);
    const addons = new Set(); const svcs = new Set();
    sels.forEach(n => { const p = packagingData.find(x => (x.region === r || (r === 'NAMER' && x.region === 'NAM')) && keys.includes(x.audience) && x.package_name === n); if(p) { (p['available_add-ons']||[]).forEach(x=>addons.add(x)); (p['available_services']||[]).forEach(x=>svcs.add(x)); } });
    
    const ac = d3.select("#add-ons-container"); const al = d3.select("#add-ons-checkboxes"); al.html("");
    if (addons.size > 0) { ac.classed("hidden", false); [...addons].sort().forEach(x => { const l = al.append("label").attr("class", "flex items-center cursor-pointer py-1"); l.append("input").attr("type", "checkbox").attr("value", x).attr("class", "form-checkbox h-5 w-5 text-orange-600 mr-3").on("change", ()=>{if(typeof updateGraph==='function') updateGraph(true); calculateScoping();}); l.append("span").text(x); }); } else ac.classed("hidden", true);

    const sc = d3.select("#package-services-container"); const sl = d3.select("#package-services-list"); sl.html("");
    if (svcs.size > 0) { sc.classed("hidden", false); [...svcs].sort().forEach(x => sl.append("div").attr("class", "flex items-center text-gray-700").html(`<i class="fas fa-check-circle text-green-500 mr-2"></i> ${x}`)); } else sc.classed("hidden", true);
    refreshAccordionHeight();
}

function getActiveFilters() {
    const r = d3.select("#region-filter").property('value'); const a = d3.select("#audience-filter").property('value'); const keys = audienceKeyToDataValuesMap[a] || [];
    const cats = d3.selectAll("#category-filters input:checked").nodes().map(e => e.value);
    const types = d3.selectAll(".legend-checkbox:checked").nodes().map(e => e.value);
    const led = d3.select("#toggle-procore-led").node()?.checked || false;
    let tools = null; let ledTools = new Set();
    if (r !== 'all' && a !== 'all') {
        const sels = d3.selectAll(".package-checkbox:checked").nodes().map(n => n.value);
        if (sels.length > 0) { tools = new Set(); sels.forEach(n => { const p = packagingData.find(x => (x.region === r || (r === 'NAMER' && x.region === 'NAM')) && keys.includes(x.audience) && x.package_name === n); if(p) { p.tools.forEach(t=>tools.add(t)); (p.procore_led_tools||[]).forEach(t=>ledTools.add(t)); } }); d3.selectAll("#add-ons-checkboxes input:checked").nodes().forEach(e=>tools.add(e.value)); }
    }
    return { categories: new Set(cats), persona: d3.select("#persona-filter").property('value'), audience: a, packageTools: tools, procoreLedTools: ledTools, connectionTypes: new Set(types), showProcoreLed: led };
}

function clearPackageDetails() {
    d3.select("#add-ons-checkboxes").html(""); d3.select("#package-services-list").html("");
    d3.select("#add-ons-container").classed('hidden', true); d3.select("#package-services-container").classed('hidden', true);
    if (app.customScope) app.customScope.clear(); d3.selectAll(".sow-question").property("checked", false);
    calculateScoping();
}

function refreshAccordionHeight() { const c = document.querySelector('#packaging-container').closest('.accordion-content'); if (c && c.parentElement.classList.contains('active')) c.style.maxHeight = c.scrollHeight + "px"; }

function populatePersonaFilter() {
    const pf = d3.select("#persona-filter"); if(pf.empty()) return; pf.html('<option value="all">All Personas</option>');
    const pers = new Set(); if(typeof nodesData!=='undefined') nodesData.forEach(n=>{if(n.personas) n.personas.forEach(p=>pers.add(p));});
    [...pers].sort().forEach(p => pf.append("option").attr("value", p).text(p));
}

function populateCategoryFilters() {
    const cf = d3.select("#category-filters"); if(cf.empty() || !app.categories) return; cf.html("");
    Object.keys(app.categories).sort().forEach(c => {
        const l = cf.append("label").attr("class", "flex items-center cursor-pointer py-1");
        l.append("input").attr("type", "checkbox").attr("checked", true).attr("value", c).attr("class", "form-checkbox h-5 w-5 text-orange-600 mr-3").on("change", ()=>{if(typeof updateGraph==='function') updateGraph(true)});
        l.append("span").attr("class", "legend-color").style("background-color", app.categories[c].color); l.append("span").text(c);
    });
}

function toggleAllCategories() { const c = d3.selectAll("#category-filters input"); c.property("checked", !c.nodes().every(n=>n.checked)); if(typeof updateGraph==='function') updateGraph(true); }
function toggleAllConnections() { const c = d3.selectAll(".legend-checkbox"); c.property("checked", !c.nodes().every(n=>n.checked)); if(typeof updateGraph==='function') updateGraph(true); }

function handleSearchInput() {
    const v = this.value.toLowerCase().trim(); const res = d3.select("#search-results");
    if(v.length<2) { res.html("").style("opacity",0).style("transform","scale(0.95)"); return; }
    const hits = nodesData.filter(d=>d.id.toLowerCase().includes(v)); res.html("");
    if(hits.length===0) res.append("div").attr("class","search-item text-sm text-gray-500").text("No results.");
    else hits.forEach(d => res.append("div").attr("class","search-item text-sm flex items-center").html(`<span class="legend-color" style="background-color:${app.categories[d.group].color}"></span>${d.id}`).on("click", ()=>selectNodeFromSearch(d)));
    res.style("opacity",1).style("transform","scale(1)");
}

function selectNodeFromSearch(d) {
    if(typeof stopTour==='function') stopTour();
    const n = app.simulation.nodes().find(x=>x.id===d.id);
    if(n) { app.interactionState='selected'; app.selectedNode=n; applyHighlight(n); if(typeof showInfoPanel==='function') showInfoPanel(n); centerViewOnNode(n); }
    else { if(typeof resetView==='function') resetView(); setTimeout(()=>selectNodeFromSearch(d), 500); }
    d3.select("#search-input").property("value",""); d3.select("#search-results").html("").style("opacity",0);
}

function updateActivePackageState() {
    if(typeof app==='undefined') return;
    const r=d3.select("#region-filter").property('value'); const a=d3.select("#audience-filter").property('value'); const keys=audienceKeyToDataValuesMap[a]||[];
    const n=d3.select(".package-checkbox:checked").property("value");
    if(n) app.currentPackage=packagingData.find(p=>(p.region===r||(r==='NAMER'&&p.region==='NAM')) && keys.includes(p.audience) && p.package_name===n); else app.currentPackage=null;
}

function resetView() {
    if(typeof stopTour==='function') stopTour();
    d3.select("#region-filter").property('value','all'); d3.select("#audience-filter").property('value','all').property("disabled",true).html('<option value="all">All Audiences</option>');
    d3.select("#package-selection-area").classed("hidden",true); d3.select("#package-checkboxes").html("");
    d3.selectAll("#category-filters input").property("checked",true);
    if(app.state.isBuildingStack) toggleStackBuilderMode(); app.state.myStack=new Set();
    d3.select("#stack-builder-btn").attr("disabled",true).classed("cursor-not-allowed",true);
    clearPackageDetails();
    if(typeof updateGraph==='function') updateGraph(false); if(typeof resetZoom==='function') resetZoom();
}

function applyTeamView(team) {
    const c = TEAM_CONFIG[team]; if(!c) return;
    d3.select("#tour-accordion").style("display", c.showTours?"block":"none");
    d3.select("#ai-workflow-builder-btn").style("display", c.showAiBuilder?"block":"none");
    d3.select("#manual-workflow-builder-btn").style("display", c.showManualBuilder?"block":"none");
    const sc = d3.select("#scoping-ui-container"); if(c.calculatorMode==='hidden') sc.classed("hidden",true); else { sc.classed("hidden",!c.showScoping); if(typeof app!=='undefined') { app.state.calculatorMode=c.calculatorMode; calculateScoping(); } }
    d3.select("#view-options-accordion").style("display", c.showLegend?"block":"none");
    // Hard Reset Accordions
    document.querySelectorAll('.accordion-content').forEach(e=>{e.style.maxHeight=0;e.style.opacity=0;e.parentElement.classList.remove('active');});
    const t=document.getElementById(c.defaultOpen); if(t) { t.classList.add('active'); t.querySelector('.accordion-content').style.maxHeight="500px"; t.querySelector('.accordion-content').style.opacity=1; }
}

function toggleCustomScopeItem(nodeId) {
    if(!app||!app.customScope) return;
    if(app.customScope.has(nodeId)) { app.customScope.delete(nodeId); if(typeof showToast==='function') showToast(`Removed ${nodeId}`); }
    else { app.customScope.add(nodeId); if(typeof showToast==='function') showToast(`Added ${nodeId}`); }
    if(typeof updateGraph==='function') updateGraph(false); calculateScoping();
}
