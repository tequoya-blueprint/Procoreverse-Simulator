// --- app-controls.js ---
// Manages all interactions for the left control panel (filters, search, accordions).

/**
 * Initializes all event listeners for the control panel.
 */
function initializeControls() {
    // --- Accordion Setup ---
    document.querySelectorAll('.accordion-header').forEach(header => {
        header.addEventListener('click', () => {
            toggleAccordion(header.parentElement);
        });
    });

    // --- Filter Dropdowns ---
    populatePersonaFilter();
    d3.select("#region-filter").on("change", updatePackageFilters);
    d3.select("#audience-filter").on("change", updatePackageFilters);
    d3.select("#package-filter").on("change", () => updateGraph(true));
    d3.select("#persona-filter").on("change", () => updateGraph(true));
    
    // --- Category Filters ---
    populateCategoryFilters();
    d3.select("#toggle-categories").on("click", toggleAllCategories);

    // --- Search ---
    d3.select("#search-input").on("input", handleSearchInput);
    d3.select("body").on("click", (e) => {
        // Close search results when clicking outside
        if (!document.getElementById('search-container').contains(e.target)) {
            d3.select("#search-results").html("").style("opacity", 0).style("transform", "scale(0.95)");
        }
    });

    // --- Buttons ---
    d3.select("#reset-view").on("click", resetView);
    d3.select("#help-button").on("click", startOnboarding);
    d3.select("#left-panel-toggle").on("click", toggleLeftPanel);
    d3.select("#left-panel-expander").on("click", toggleLeftPanel);
}

/**
 * Populates the persona filter dropdown from node data.
 */
function populatePersonaFilter() {
    const personaFilter = d3.select("#persona-filter");
    const allPersonas = new Set();
    nodesData.forEach(node => {
        if (node.personas) {
            node.personas.forEach(p => allPersonas.add(p));
        }
    });

    // Sort and add to dropdown
    [...allPersonas].sort().forEach(p => {
        // A simple map for more user-friendly names
        const personaMap = {
            "pm": "Project Manager (GC)",
            "super": "Superintendent (GC)",
            "fm": "Financial Manager (GC)",
            "sub": "Specialty Contractor",
            "design": "Design Team",
            "owner": "Owner",
            "admin": "Admin"
        };
        personaFilter.append("option")
            .attr("value", p)
            .text(personaMap[p] || p);
    });
}

/**
 * Populates the category filter checkboxes.
 */
function populateCategoryFilters() {
    const filtersContainer = d3.select("#category-filters");
    Object.keys(app.categories).sort().forEach(cat => {
        const label = filtersContainer.append("label").attr("class", "flex items-center cursor-pointer py-1");
        
        label.append("input")
            .attr("type", "checkbox")
            .attr("checked", true)
            .attr("value", cat)
            .attr("class", "form-checkbox h-5 w-5 text-orange-600 transition rounded mr-3 focus:ring-orange-500")
            .on("change", () => updateGraph(true));
        
        label.append("span")
            .attr("class", "legend-color")
            .style("background-color", app.categories[cat].color);
        
        label.append("span").attr("class", "text-gray-700").text(cat);
    });
}

/**
 * Toggles all category checkboxes on or off.
 */
let allCategoriesChecked = true;
function toggleAllCategories() {
    allCategoriesChecked = !allCategoriesChecked;
    d3.selectAll("#category-filters input").property("checked", allCategoriesChecked);
    updateGraph(true);
}

/**
 * Updates the package filter dropdown based on region and audience.
 */
function updatePackageFilters() {
    const region = d3.select("#region-filter").property("value");
    const audience = d3.select("#audience-filter").property("value");
    const packageFilter = d3.select("#package-filter");
    
    packageFilter.html(""); // Clear options
    packageFilter.append("option").attr("value", "all").text("All Packages");

    if (region !== 'all' && audience !== 'all' && packagingData[region] && packagingData[region][audience]) {
        const packages = packagingData[region][audience];
        Object.keys(packages).forEach(pkgName => {
            packageFilter.append("option").attr("value", pkgName).text(pkgName);
        });
        packageFilter.property("disabled", false);
    } else {
        packageFilter.property("disabled", true);
    }
    
    // Trigger a graph update as filters have changed
    updateGraph(true);
}

/**
 * Gathers all active filter values.
 * @returns {Object} An object containing all active filter settings.
 */
function getActiveFilters() {
    const region = d3.select("#region-filter").property('value');
    const audience = d3.select("#audience-filter").property('value');
    const pkg = d3.select("#package-filter").property('value');
    
    const activeCategories = new Set(
        d3.selectAll("#category-filters input:checked").nodes().map(el => el.value)
    );
    
    let packageTools = null;
    const addOnsContainer = d3.select("#add-ons-container");
    const addOnsCheckboxes = d3.select("#add-ons-checkboxes");
    const servicesContainer = d3.select("#package-services-container");
    const servicesList = d3.select("#package-services-list");

    if (region !== 'all' && audience !== 'all' && pkg !== 'all') {
        const packageInfo = packagingData[region]?.[audience]?.[pkg];
        if (packageInfo) {
            packageTools = new Set(packageInfo.tools);
            
            // Handle Add-Ons
            const selectedAddOns = d3.selectAll("#add-ons-checkboxes input:checked")
                .nodes()
                .map(el => el.value);
            selectedAddOns.forEach(addOn => packageTools.add(addOn));
            
            // Populate and show add-ons
            addOnsCheckboxes.html("");
            if (packageInfo.addOns && packageInfo.addOns.length > 0) {
                packageInfo.addOns.forEach(addOn => {
                    const label = addOnsCheckboxes.append("label").attr("class", "flex items-center cursor-pointer py-1");
                    label.append("input")
                        .attr("type", "checkbox")
                        .attr("value", addOn)
                        .attr("class", "form-checkbox h-5 w-5 text-orange-600 transition rounded mr-3 focus:ring-orange-500")
                        .on("change", () => updateGraph(true));
                    label.append("span").attr("class", "text-gray-700").text(addOn);
                });
                addOnsContainer.classed('hidden', false);
            } else {
                addOnsContainer.classed('hidden', true);
            }

            // Populate and show services
            servicesList.html("");
            if (packageInfo.services && packageInfo.services.length > 0) {
                packageInfo.services.forEach(service => {
                    servicesList.append("div")
                        .attr("class", "flex items-center text-gray-700")
                        .html(`<i class="fas fa-check-circle text-green-500 mr-2"></i> ${service}`);
                });
                servicesContainer.classed('hidden', false);
            } else {
                servicesContainer.classed('hidden', true);
            }

        }
    } else {
        addOnsContainer.classed('hidden', true);
        servicesContainer.classed('hidden', true);
    }

    return {
        categories: activeCategories,
        persona: d3.select("#persona-filter").property('value'),
        audience: audience,
        packageTools: packageTools
    };
}

/**
 * Resets all filters and the camera view.
 */
function resetView() {
    stopTour(); // From app-tours.js
    
    // Reset filters
    d3.select("#region-filter").property('value', 'all');
    d3.select("#audience-filter").property('value', 'all');
    d3.select("#persona-filter").property('value', 'all');
    d3.select("#package-filter").property('value', 'all').property('disabled', true);
    d3.selectAll("#category-filters input").property("checked", true);
    allCategoriesChecked = true;

    // Clear package extras
    d3.select("#add-ons-container").classed('hidden', true);
    d3.select("#package-services-container").classed('hidden', true);

    // Update graph and reset view
    updateGraph(false);
    resetZoom(); // From app-d3-helpers.js
}

/**
 * Handles user input in the search bar.
 */
function handleSearchInput() {
    const searchInput = this.value.toLowerCase().trim();
    const searchResults = d3.select("#search-results");

    if (searchInput.length < 2) {
        searchResults.html("").style("opacity", 0).style("transform", "scale(0.95)");
        return;
    }

    const results = nodesData.filter(d => d.id.toLowerCase().includes(searchInput));
    searchResults.html(""); // Clear old results

    if (results.length === 0) {
        searchResults.append("div").attr("class", "search-item text-sm text-gray-500").text("No results found.");
    } else {
        results.forEach(d => {
            searchResults.append("div")
                .attr("class", "search-item text-sm flex items-center")
                .html(`<span class="legend-color" style="background-color:${app.categories[d.group].color};"></span>${d.id}`)
                .on("click", () => selectNodeFromSearch(d));
        });
    }
    
    searchResults.style("opacity", 1).style("transform", "scale(1)");
}

/**
 * Selects a node from the search results.
 * @param {Object} d - The node data object.
 */
function selectNodeFromSearch(d) {
    if (app.interactionState === 'tour') stopTour();
    
    const isVisible = app.simulation.nodes().some(n => n.id === d.id);
    
    if (!isVisible) {
        showToast(`"${d.id}" is hidden by filters. Resetting view.`, 3000);
        resetView();
    }
    
    // Wait for graph update if resetView was called
    setTimeout(() => {
        const nodeData = app.simulation.nodes().find(n => n.id === d.id);
        if (nodeData) {
            // Manually trigger click event
            nodeClicked(new Event('click'), nodeData);
        }
    }, isVisible ? 0 : 600); // Delay if graph needs update

    // Clear search
    d3.select("#search-input").property("value", "");
    d3.select("#search-results").html("").style("opacity", 0).style("transform", "scale(0.95)");
}
