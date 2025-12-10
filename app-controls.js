// --- app-controls.js ---
// VERSION: FULLY VERIFIED & SAFE

const TEAM_CONFIG = {
    admin: { showTours: true, showAiBuilder: true, showManualBuilder: true, showScoping: true, showFilters: true, showLegend: true, defaultOpen: 'filter-accordion' },
    enablement: { showTours: true, showAiBuilder: true, showManualBuilder: true, showScoping: false, showFilters: true, showLegend: true, defaultOpen: 'tour-accordion' },
    sales: { showTours: false, showAiBuilder: false, showManualBuilder: false, showScoping: false, showFilters: true, showLegend: true, defaultOpen: 'filter-accordion' },
    product: { showTours: true, showAiBuilder: true, showManualBuilder: true, showScoping: false, showFilters: true, showLegend: true, defaultOpen: 'tour-accordion' },
    services: { showTours: true, showAiBuilder: false, showManualBuilder: true, showScoping: true, showFilters: true, showLegend: true, defaultOpen: 'filter-accordion' }
};

function getUrlParam(param) { return new URLSearchParams(window.location.search).get(param); }

const audienceDataToKeyMap = { "Contractor": "GC", "General Contractor": "GC", "GC": "GC", "SC": "SC", "Specialty Contractor": "SC", "Owners": "O", "Owner": "O", "Owner Developer *Coming Soon": "O" };
const audienceKeyToLabelMap = { "GC": "General Contractor", "SC": "Specialty Contractor", "O": "Owner" };
const audienceKeyToDataValuesMap = { "GC": ["Contractor", "General Contractor", "GC"], "SC": ["SC", "Specialty Contractor"], "O": ["Owners", "Owner", "Owner Developer *Coming Soon"] };

function initializeControls() {
    // Accordion Logic
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => { if(typeof toggleAccordion === 'function') toggleAccordion(header.parentElement); });
    });

    populateRegionFilter();
    
    // Bind Event Listeners
    d3.select("#region-filter").on("change", onRegionChange);
    d3.select("#audience-filter").on("change", onAudienceChange);
    d3.select("#persona-filter").on("change", () => {if (typeof updateGraph === 'function') updateGraph(true)});
    
    // Procore-Led Toggle Listener
    d3.select("#toggle-procore-led").on("change", () => {if (typeof updateGraph === 'function') updateGraph(true)});

    populateCategoryFilters();
    d3.select("#toggle-categories").on("click", toggleAllCategories);
    d3.select("#toggle-legend").on("click", toggleAllConnections);
    d3.select("#search-input").on("input", handleSearchInput);
    
    // Team Selector Logic
    const teamSelector = d3.select("#team-selector");
    const initialTeam = getUrlParam('team') || 'admin'; 
    if (TEAM_CONFIG[initialTeam]) {
        teamSelector.property('value', initialTeam);
        setTimeout(() => applyTeamView(initialTeam), 100);
    }
    teamSelector.on("change", function() { applyTeamView(this.value); });

    // Search Dismissal
    d3.select("body").on("click", (e) => {
        if (e.target && !document.getElementById('search-container').contains(e.target)) {
            d3.select("#search-results").html("").style("opacity", 0).style("transform", "scale(0.95)");
        }
    });

    // Button Listeners
    d3.select("#reset-view").on("click", resetView);
    d3.select("#help-button").on("click", startOnboarding);
    d3.select("#left-panel-toggle").on("click", toggleLeftPanel);
    d3.select("#left-panel-expander").on("click", toggleLeftPanel);

    // Scoping Calculator Listeners (Safe Check)
    const sliderMaturity = document.getElementById('slider-maturity');
    const sliderData = document.getElementById('slider-data');
    const sliderChange = document.getElementById('slider-change');
    
    if(sliderMaturity) sliderMaturity.addEventListener('input', calculateScoping);
    if(sliderData) sliderData.addEventListener('input', calculateScoping);
    if(sliderChange) sliderChange.addEventListener('input', calculateScoping);
}

function calculateScoping() {
    const sliderMaturity = document.getElementById('slider-maturity');
    const sliderData = document.getElementById('slider-data');
    const sliderChange = document.getElementById('slider-change');
    
    // Exit if elements missing (prevents crash)
    if (!sliderMaturity || !sliderData || !sliderChange) return;

    const mat = parseFloat(sliderMaturity.value);
    const data = parseFloat(sliderData.value);
    const change = parseFloat(sliderChange.value);

    // Update Label Text
    const valMat = document.getElementById('val-maturity');
    if(valMat) valMat.innerText = mat + "x";
    
    const valData = document.getElementById('val-data');
    if(valData) valData.innerText = data + "x";
    
    const valChange = document.getElementById('val-change');
    if(valChange) valChange.innerText = change + "x";

    // Logic: Sum hours from selected packages
    let baseHours = 0;
    let addOnCount = 0;
    
    const region = d3.select("#region-filter").property('value');
    const audience = d3.select("#audience-filter").property('value');
    
    if (region !== 'all' && audience !== 'all') {
        const audienceDataKeys = audienceKeyToDataValuesMap[audience] || [];
        
        d3.selectAll(".package-checkbox:checked").each(function() {
            const pkgName = this.value;
            const pkg = packagingData.find(p => p.region === region && audienceDataKeys.includes(p.audience) && p.package_name === pkgName);
            if (pkg && pkg["available_services"] && pkg["available_services"].length > 0) {
                // Regex to find "25 hrs"
                const match = pkg["available_services"][0].match(/(\d+)\s*hrs/);
                if (match) baseHours += parseInt(match[1], 10);
            }
        });
        
        addOnCount = d3.selectAll("#add-ons-checkboxes input:checked").size();
    }

    // Update UI
    const baseLabel = document.getElementById('base-tools-count');
    if (baseLabel) {
        if (baseHours > 0) {
            baseLabel.parentElement.innerHTML = `Base Scope: <span id="base-tools-count" class="font-bold text-gray-700">${baseHours} Hrs</span> + ${addOnCount} Add-ons`;
        } else {
            baseLabel.innerText = "0 Hrs";
        }
    }

    if (baseHours === 0) {
        const calcWeeks = document.getElementById('calc-weeks');
        if(calcWeeks) calcWeeks.innerText = "0";
        return;
    }

    // Calculation Formula
    const baseWeeks = (baseHours / 3) + (addOnCount * 2); 
    const combinedMultiplier = (mat + data + change) / 3; 
    const finalWeeks = Math.round(baseWeeks * combinedMultiplier);
    
    const calcWeeks = document.getElementById('calc-weeks');
    if(calcWeeks) calcWeeks.innerText = finalWeeks;
}

function applyTeamView(team) {
    const config = TEAM_CONFIG[team];
    if (!config) return;
    
    d3.select("#tour-accordion").style("display", config.showTours ? "block" : "none");
    d3.select("#ai-workflow-builder-btn").style("display", config.showAiBuilder ? "block" : "none");
    d3.select("#ai-tours").style("display", config.showAiBuilder ? "block" : "none"); 
    
    const manualBtn = d3.select("#manual-workflow-builder-btn");
    if (!manualBtn.empty()) manualBtn.style("display", config.showManualBuilder ? "block" : "none");
    
    d3.select("#scoping-ui-container").classed("hidden", !config.showScoping);
    
    document.querySelectorAll('.accordion-item').forEach(item => item.classList.remove('active'));
    const target = document.getElementById(config.defaultOpen);
    if (target) {
        target.classList.add('active');
        const content = target.querySelector('.accordion-content');
        if (content) content.style.maxHeight = content.scrollHeight + "px";
    }
}

// --- HELPER FUNCTIONS ---

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
    const regionFilter = d3.select("#region-filter");
    const regions = [...new Set(packagingData.map(pkg => pkg.region))];
    regions.sort().forEach(region => {
        let label = region;
        if (region === "EUR") label = "EMEA";
        if (region === "NAMER") label = "NAM";
        regionFilter.append("option").attr("value", region).text(label);
    });
}

function onRegionChange() {
    const region = d3.select(this).property("value");
    const audienceFilter = d3.select("#audience-filter");
    
    // Reset Filters
    audienceFilter.property("value", "all").property("disabled", region === "all");
    audienceFilter.html('<option value="all">All Audiences</option>');
    d3.select("#package-selection-area").classed("hidden", true);
    d3.select("#package-checkboxes").html("");
    
    clearPackageDetails();
    
    if (region !== "all") {
        const availableAudiences = new Set();
        packagingData.filter(pkg => pkg.region === region).forEach(pkg => {
            const audKey = audienceDataToKeyMap[pkg.audience];
            if (audKey) availableAudiences.add(audKey);
        });
        [...availableAudiences].sort().forEach(audKey => {
             audienceFilter.append("option").attr("value", audKey).text(audienceKeyToLabelMap[audKey]);
        });
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
            pkg.region === region && audienceDataKeys.includes(pkg.audience)
        );
        
        if (packages.length > 0) {
            packageArea.classed("hidden", false);
            
            packages.sort((a, b) => a.package_name.localeCompare(b.package_name)).forEach(pkg => {
                const label = packageList.append("label").attr("class", "flex items-center cursor-pointer py-1 hover:bg-gray-100 rounded px-1");
                label.append("input")
                    .attr("type", "checkbox")
                    .attr("value", pkg.package_name)
                    .attr("class", "form-checkbox h-4 w-4 text-indigo-600 package-checkbox mr-2")
                    .on("change", () => {
                        updatePackageAddOns();
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

function updatePackageAddOns() {
    const region = d3.select("#region-filter").property('value');
    const audience = d3.select("#audience-filter").property('value');
    const audienceDataKeys = audienceKeyToDataValuesMap[audience] || [];
    
    const selectedPackageNames = d3.selectAll(".package-checkbox:checked").nodes().map(n => n.value);
    
    const allAddOns = new Set();
    const allServices = new Set();
    
    selectedPackageNames.forEach(pkgName => {
        const pkg = packagingData.find(p => p.region === region && audienceDataKeys.includes(p.audience) && p.package_name === pkgName);
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
    
    const content = document.querySelector('#packaging-container').closest('.accordion-content');
    if (content) content.style.maxHeight = "1000px"; 
}

function getActiveFilters() {
    const region = d3.select("#region-filter").property('value');
    const audience = d3.select("#audience-filter").property('value');
    const audienceDataKeys = audienceKeyToDataValuesMap[audience] || [];
    
    const activeCategories = d3.selectAll("#category-filters input:checked").nodes().map(el => el.value);
    const activeConnectionTypes = d3.selectAll(".legend-checkbox:checked").nodes().map(el => el.value);
    
    // SAFE TOGGLE CHECK
    const toggleNode = d3.select("#toggle-procore-led").node();
    const showProcoreLed = toggleNode ? toggleNode.checked : false;

    let packageTools = null;
    let procoreLedTools = new Set();
    
    if (region !== 'all' && audience !== 'all') {
        const selectedPackageNames = d3.selectAll(".package-checkbox:checked").nodes().map(n => n.value);
        
        if (selectedPackageNames.length > 0) {
            packageTools = new Set();
            
            selectedPackageNames.forEach(pkgName => {
                const pkg = packagingData.find(p => p.region === region && audienceDataKeys.includes(p.audience) && p.package_name === pkgName);
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
    calculateScoping();
}

function populatePersonaFilter() {
    const personaFilter = d3.select("#persona-filter");
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
    filtersContainer.html("");
    if (typeof app !== 'undefined' && app.categories) {
        Object.keys(app.categories).sort().forEach(cat => {
            const label = filtersContainer.append("label").attr("class", "flex items-center cursor-pointer py-1");
            label.append("input").attr("type", "checkbox").attr("checked", true).attr("value", cat)
                .attr("class", "form-checkbox h-5 w-5 text-orange-600 transition rounded mr-3 focus:ring-orange-500")
                .on("change", () => {if (typeof updateGraph === 'function') updateGraph(true)});
            label.append("span").attr("class", "legend-color").style("background-color", app.categories[cat].color);
            label.append("span").attr("class", "text-gray-700").text(cat);
        });
    }
}

function resetView() {
    if (typeof stopTour === 'function') stopTour();
    d3.select("#region-filter").property('value', 'all');
    d3.select("#audience-filter").property('value', 'all').property("disabled", true).html('<option value="all">All Audiences</option>');
    d3.select("#persona-filter").property('value', 'all');
    
    d3.select("#package-selection-area").classed("hidden", true);
    d3.select("#package-checkboxes").html("");
    
    d3.select("#toggle-procore-led").property("checked", false);
    
    d3.selectAll("#category-filters input").property("checked", true);
    toggleAllConnections(); 
    d3.selectAll(".legend-checkbox").property("checked", true);
    allCategoriesChecked = true;
    clearPackageDetails();
    if (typeof updateGraph === 'function') updateGraph(false);
    if (typeof resetZoom === 'function') resetZoom();
}

function handleSearchInput() {
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
    const isVisible = app.simulation.nodes().some(n => n.id === d.id);
    if (!isVisible) {
        showToast(`"${d.id}" is hidden by filters. Resetting view.`, 3000);
        resetView();
    }
    setTimeout(() => {
        const nodeData = app.simulation.nodes().find(n => n.id === d.id);
        if (nodeData) {
            if (typeof nodeClicked === 'function') nodeClicked(new Event('click'), nodeData);
        }
    }, isVisible ? 0 : 600);
    d3.select("#search-input").property("value", "");
    d3.select("#search-results").html("").style("opacity", 0).style("transform", "scale(0.95)");
}
