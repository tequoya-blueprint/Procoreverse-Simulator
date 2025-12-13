// --- app-controls.js ---
// VERSION: 170 (SOW V2: CONDITIONAL TEMPLATES & RBAC)

// --- TEAM CONFIGURATION RULES ---
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
const audienceDataToKeyMap = { "Contractor": "GC", "General Contractor": "GC", "GC": "GC", "SC": "SC", "Specialty Contractor": "SC", "Owners": "O", "Owner": "O", "Owner Developer *Coming Soon": "O" };
const audienceKeyToLabelMap = { "GC": "General Contractor", "SC": "Specialty Contractor", "O": "Owner" };

// --- SOW QUESTIONNAIRE CONFIGURATION ---
const SOW_QUESTIONS = [
    { id: "q-erp", label: "ERP Connector", type: "cost", hrs: 20, cost: 5000 },
    { id: "q-analytics", label: "Analytics", type: "cost", hrs: 10, cost: 2500 },
    { id: "q-integration", label: "Custom Integration", type: "cost", hrs: 15, cost: 5000 },
    { id: "q-reports", label: "Custom Reports", type: "cost", hrs: 8, cost: 1500 },
    { id: "q-ras", label: "RAS / Data Pop", type: "cost", hrs: 40, cost: 6000 },
    { id: "q-pdf", label: "Custom PDFs", type: "cost", hrs: 6, cost: 1200 },
    { id: "q-sop", label: "SOP Docs", type: "cost", hrs: 20, cost: 3000 },
    { id: "q-admin", label: "Dedicated Admin", type: "risk", factor: -0.2, target: "change" }, 
    { id: "q-financials", label: "Complex Finance", type: "risk", factor: 0.3, target: "data" } 
];

// --- CONDITIONAL TEMPLATE LOGIC ---
function getSOWTemplate(sowData) {
    // Default Template
    let templateId = "STD_IMPL";
    let title = "Standard Implementation SOW";
    let terms = "Standard Professional Services Terms apply.";

    // Logic: Region + Audience + Key Add-ons determine the template
    if (sowData.region === "APAC") {
        templateId = "APAC_STD";
        title = "APAC Service Agreement";
        terms = " governed by APAC localized terms.";
    } 
    
    if (sowData.packages.some(p => p.includes("Premier"))) {
        templateId = "PREMIER_ENT";
        title = "Premier Enterprise Implementation";
        terms = "Includes dedicated consultant and weekly status calls.";
    }

    if (sowData.services.includes("ERP Connector")) {
        templateId += "_ERP";
        title += " + ERP Integration";
        terms += " Includes technical validation phase for ERP.";
    }

    if (sowData.services.includes("Custom Integration")) {
        templateId += "_CUSTOM";
        title += " (Custom Scope)";
        terms += " Custom development requires separate sign-off on technical specs.";
    }

    return { id: templateId, title: title, terms: terms };
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

    SOW_QUESTIONS.filter(q => q.type === 'cost').forEach(q => {
        const checkbox = document.getElementById(q.id);
        if (checkbox && checkbox.checked) {
            servicesHours += q.hrs;
            servicesCost += q.cost;
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
        onsite: onsiteCount, multipliers: { mat: mat.toFixed(1), data: data.toFixed(1), change: change.toFixed(1) }
    };
    
    refreshAccordionHeight();
}

// --- PRINT SOW LOGIC (CONDITIONAL TEMPLATES) ---
function generateSOWPrintView() {
    if (!app.currentSOW) {
        alert("Please configure a scope first.");
        return;
    }
    const sow = app.currentSOW;
    const template = getSOWTemplate(sow); // Retrieve the conditional template
    const today = new Date().toLocaleDateString();

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
        alert("Please allow popups to print the SOW.");
        return;
    }

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>${template.title}</title>
        <style>
            body { font-family: 'Helvetica Neue', Arial, sans-serif; padding: 40px; color: #333; line-height: 1.5; }
            .header { border-bottom: 3px solid #F36C23; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-end; }
            .logo { font-size: 24px; font-weight: 800; color: #F36C23; letter-spacing: -0.5px; }
            .title { font-size: 14px; text-transform: uppercase; color: #888; letter-spacing: 1px; }
            .doc-id { font-size: 10px; color: #aaa; margin-top: 5px; }
            h2 { font-size: 18px; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px; color: #555; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 30px; }
            .item { margin-bottom: 8px; font-size: 14px; }
            .label { font-weight: bold; color: #555; display: inline-block; width: 140px; }
            .total-box { background: #f9f9f9; padding: 20px; border-radius: 8px; text-align: right; margin-top: 40px; border: 1px solid #eee; }
            .total-cost { font-size: 32px; font-weight: 800; color: #111; margin-top: 5px; }
            .terms-box { margin-top: 30px; padding: 15px; background: #fff5f0; border-left: 4px solid #F36C23; font-size: 12px; color: #666; }
            .disclaimer { margin-top: 50px; font-size: 10px; color: #999; text-align: center; border-top: 1px solid #eee; padding-top: 10px; }
        </style>
    </head>
    <body>
        <div class="header">
            <div>
                <div class="logo">PROCORE</div>
                <div class="doc-id">Template ID: ${template.id}</div>
            </div>
            <div class="title">${template.title} • ${today}</div>
        </div>
        
        <div class="grid">
            <div>
                <h2>Client Profile</h2>
                <div class="item"><span class="label">Region:</span> ${sow.region}</div>
                <div class="item"><span class="label">Audience:</span> ${sow.audience}</div>
                <div class="item"><span class="label">Complexity:</span> Mat: ${sow.multipliers.mat}, Data: ${sow.multipliers.data}, Chg: ${sow.multipliers.change}</div>
            </div>
            <div>
                 <h2>Project Scope</h2>
                 <div class="item"><span class="label">Packages:</span> ${sow.packages.length > 0 ? sow.packages.join(", ") : "None"}</div>
                 <div class="item"><span class="label">Custom Tools:</span> ${sow.customTools.length > 0 ? sow.customTools.join(", ") : "None"}</div>
                 <div class="item"><span class="label">Add-on Services:</span> ${sow.services.length > 0 ? sow.services.join(", ") : "None"}</div>
                 <div class="item"><span class="label">On-Site Visits:</span> ${sow.onsite}</div>
            </div>
        </div>

        <div class="terms-box">
            <strong>Applicable Terms:</strong> ${template.terms}
        </div>

        <div class="total-box">
            <div style="font-size: 12px; text-transform: uppercase; color: #888; font-weight: bold;">Estimated Implementation Investment</div>
            <div class="total-cost">$${sow.totalCost.toLocaleString()}</div>
            <div style="font-size: 14px; color: #666; margin-top: 5px;">Est. Timeline: ${sow.weeks} Weeks</div>
        </div>

        <div class="disclaimer">
            This document is a rough order of magnitude (ROM) estimate for simulation purposes only. <br>
            It does not constitute a binding contract or formal Statement of Work. Pricing is subject to change.
        </div>

        <script>
            window.print();
        </script>
    </body>
    </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
}

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
