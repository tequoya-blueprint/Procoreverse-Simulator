// --- app-controls.js ---
// VERSION 15: Fixes Add-Ons data key mismatch ("available_add-ons").

// --- DATA MAPPING CONSTANTS ---
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

const audienceKeyToDataValuesMap = {
    "GC": ["Contractor", "General Contractor", "GC"],
    "SC": ["SC", "Specialty Contractor"],
    "O": ["Owners", "Owner", "Owner Developer *Coming Soon"]
};

function initializeControls() {
    // --- Accordion Setup ---
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            if(typeof toggleAccordion === 'function') toggleAccordion(header.parentElement);
        });
    });

    populateRegionFilter();
    populatePersonaFilter();
   
    d3.select("#region-filter").on("change", onRegionChange);
    d3.select("#audience-filter").on("change", onAudienceChange);
    d3.select("#package-filter").on("change", onPackageChange);
    d3.select("#persona-filter").on("change", () => {if (typeof updateGraph === 'function') updateGraph(true)});
   
    populateCategoryFilters();
    d3.select("#toggle-categories").on("click", toggleAllCategories);
    d3.select("#toggle-legend").on("click", toggleAllConnections);

    d3.select("#search-input").on("input", handleSearchInput);
    d3.select("body").on("click", (e) => {
        if (e.target && !document.getElementById('search-container').contains(e.target)) {
            d3.select("#search-results").html("").style("opacity", 0).style("transform", "scale(0.95)");
        }
    });

    d3.select("#reset-view").on("click", resetView);
    d3.select("#help-button").on("click", startOnboarding);
    d3.select("#left-panel-toggle").on("click", toggleLeftPanel);
    d3.select("#left-panel-expander").on("click", toggleLeftPanel);
}

function toggleAllConnections() {
    let allConnectionsChecked = true;
    const firstBox = d3.select(".legend-checkbox").node();
    if (firstBox) {
        allConnectionsChecked = !firstBox.checked;
    }
   
    d3.selectAll(".legend-checkbox").property("checked", allConnectionsChecked);
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
    const packageFilter = d3.select("#package-filter");
   
    audienceFilter.property("value", "all").property("disabled", region === "all");
    packageFilter.property("value", "all").property("disabled", true).html('<option value="all">All Packages</option>');
    audienceFilter.html('<option value="all">All Audiences</option>');
   
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
    const packageFilter = d3.select("#package-filter");

    packageFilter.html('<option value="all">All Packages</option>');
    packageFilter.property("disabled", true);
   
    clearPackageDetails();

    const audienceDataKeys = audienceKeyToDataValuesMap[audience] || [];

    if (region !== 'all' && audience !== 'all') {
        const packages = packagingData.filter(pkg =>
            pkg.region === region && audienceDataKeys.includes(pkg.audience)
        );
        if (packages.length > 0) {
            packages.sort((a, b) => a.package_name.localeCompare(b.package_name)).forEach(pkg => {
                packageFilter.append("option").attr("value", pkg.package_name).text(pkg.package_name);
            });
            packageFilter.property("disabled", false);
        }
    }
    if (typeof updateGraph === 'function') updateGraph(true);
}

function onPackageChange() {
    const region = d3.select("#region-filter").property('value');
    const audience = d3.select("#audience-filter").property('value');
    const pkgName = d3.select("#package-filter").property('value');

    clearPackageDetails();

    if (region !== 'all' && audience !== 'all' && pkgName !== 'all') {
        const audienceDataKeys = audienceKeyToDataValuesMap[audience] || [];
        const packageInfo = packagingData.find(pkg =>
            pkg.region === region && audienceDataKeys.includes(pkg.audience) && pkg.package_name === pkgName
        );

        if (packageInfo) {
            populateAddOnsAndServices(packageInfo);
        }
    }
   
    refreshAccordionHeight();
    if (typeof updateGraph === 'function') updateGraph(true);
}

function populateAddOnsAndServices(packageInfo) {
    const addOnsContainer = d3.select("#add-ons-container");
    const addOnsCheckboxes = d3.select("#add-ons-checkboxes");
    const servicesContainer = d3.select("#package-services-container");
    const servicesList = d3.select("#package-services-list");

    // FIX: Included "available_add-ons" which is the specific key used in the data file.
    const addOns = packageInfo['available_add-ons'] || 
                   packageInfo['available_add_ons'] ||
                   packageInfo['available-add-ons'] ||
                   packageInfo['available_addons'] ||
                   packageInfo['available-addons'] ||
                   packageInfo['add_ons'] ||
                   [];

    const services = packageInfo['available_services'] ||
                     packageInfo['available-services'] ||
                     [];

    if (addOns && addOns.length > 0) {
        addOns.forEach(addOn => {
            const label = addOnsCheckboxes.append("label").attr("class", "flex items-center cursor-pointer py-1");
            label.append("input").attr("type", "checkbox").attr("value", addOn)
                .attr("class", "form-checkbox h-5 w-5 text-orange-600 transition rounded mr-3 focus:ring-orange-500")
                .on("change", () => {if (typeof updateGraph === 'function') updateGraph(true)});
            label.append("span").attr("class", "text-gray-700").text(addOn);
        });
        addOnsContainer.classed('hidden', false);
    }

    if (services && services.length > 0) {
        services.forEach(service => {
            servicesList.append("div").attr("class", "flex items-center text-gray-700")
                .html(`<i class="fas fa-check-circle text-green-500 mr-2"></i> ${service}`);
        });
        servicesContainer.classed('hidden', false);
    }
}

function clearPackageDetails() {
    d3.select("#add-ons-checkboxes").html("");
    d3.select("#package-services-list").html("");
    d3.select("#add-ons-container").classed('hidden', true);
    d3.select("#package-services-container").classed('hidden', true);
    if(typeof refreshAccordionHeight === 'function') refreshAccordionHeight();
}

function refreshAccordionHeight() {
    const content = document.querySelector('#packaging-container').closest('.accordion-content');
    if (content && content.parentElement.classList.contains('active')) {
        content.style.maxHeight = content.scrollHeight + "px";
    }
}

function getActiveFilters() {
    const region = d3.select("#region-filter").property('value');
    const audience = d3.select("#audience-filter").property('value');
    const pkgName = d3.select("#package-filter").property('value');
   
    const activeCategories = d3.selectAll("#category-filters input:checked").nodes().map(el => el.value);
    const activeConnectionTypes = d3.selectAll(".legend-checkbox:checked").nodes().map(el => el.value);
   
    let packageTools = null;

    if (region !== 'all' && audience !== 'all' && pkgName !== 'all') {
        const audienceDataKeys = audienceKeyToDataValuesMap[audience] || [];
        const packageInfo = packagingData.find(pkg =>
            pkg.region === region && audienceDataKeys.includes(pkg.audience) && pkg.package_name === pkgName
        );
       
        if (packageInfo) {
            packageTools = new Set(packageInfo.tools);
           
            const selectedAddOns = d3.selectAll("#add-ons-checkboxes input:checked").nodes().map(el => el.value);
            selectedAddOns.forEach(addOn => packageTools.add(addOn));
        }
    }

    return {
        categories: new Set(activeCategories),
        persona: d3.select("#persona-filter").property('value'),
        audience: audience,
        packageTools: packageTools,
        connectionTypes: new Set(activeConnectionTypes)
    };
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

let allCategoriesChecked = true;
function toggleAllCategories() {
    allCategoriesChecked = !allCategoriesChecked;
    d3.selectAll("#category-filters input").property("checked", allCategoriesChecked);
    if (typeof updateGraph === 'function') updateGraph(true);
}

function resetView() {
    if (typeof stopTour === 'function') stopTour();
   
    d3.select("#region-filter").property('value', 'all');
    d3.select("#audience-filter").property('value', 'all').property("disabled", true).html('<option value="all">All Audiences</option>');
    d3.select("#persona-filter").property('value', 'all');
    d3.select("#package-filter").property('value', 'all').property('disabled', true).html('<option value="all">All Packages</option>');
    d3.selectAll("#category-filters input").property("checked", true);
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
