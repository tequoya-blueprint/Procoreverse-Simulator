// --- procoreverse_data_links.js ---
// VERSION FINAL: Corrected IDs (Project Map, etc.) and full Legend styling.

/**
 * SECTION 1: The Legend Data
 * This controls the visual style of the lines (Dashed, Solid, Colors).
 * app-main.js uses this to draw the graph.
 */
const legendData = [
  {
    "type_id": "creates",
    "label": "Creates",
    "description": "Workflow trigger. An item in the source tool automatically creates a starting record in the destination tool.",
    "visual_style": "Dashed line, one arrow"
  },
  {
    "type_id": "converts-to",
    "label": "Converts To",
    "description": "Conversion workflow. A specific, formal workflow that transforms one item type into another (e.g., RFI to Change Event).",
    "visual_style": "Dashed line, one arrow"
  },
  {
    "type_id": "syncs",
    "label": "Syncs",
    "description": "Two-way data synchronization. Data is actively shared and updated between two tools.",
    "visual_style": "Solid line, two arrows"
  },
  {
    "type_id": "pushes-data-to",
    "label": "Pushes Data To",
    "description": "One-way data push. Data from the origin is pushed to the destination tool for reporting or aggregation.",
    "visual_style": "Solid line, one arrow"
  },
  {
    "type_id": "pulls-data-from",
    "label": "Pulls Data From",
    "description": "One-way data pull. The origin tool looks up data from the destination tool during item creation.",
    "visual_style": "Dotted line, one arrow"
  },
  {
    "type_id": "attaches-links",
    "label": "Attaches/Links",
    "description": "Related Items. The origin tool links to an existing record from the destination tool for reference.",
    "visual_style": "Dotted line, one arrow"
  },
  {
    "type_id": "feeds",
    "label": "Feeds",
    "description": "Reporting flow. Data is consumed by an intelligence or analytics platform.",
    "visual_style": "Solid line, one arrow, gray"
  }
];

/**
 * SECTION 2: The Connections (Links)
 * Defines which nodes connect to which. 
 * CRITICAL: 'source' and 'target' must match the 'id' in procoreverse_data_nodes.js EXACTLY.
 */
const linksData = [
  // --- RESOURCE MANAGEMENT & FIELD ---
  { "source": "Crews", "target": "Timesheets", "type": "pushes-data-to", "dataFlow": "Crews data populates Timesheets for organized labor tracking." },
  { "source": "Timesheets", "target": "Daily Log", "type": "syncs", "dataFlow": "Syncs labor hours with Daily Log's manpower entries." },
  { "source": "Timesheets", "target": "Budget", "type": "pushes-data-to", "dataFlow": "Labor costs from Timesheets update the project budget in real-time." },
  { "source": "T&M Tickets", "target": "Change Events", "type": "creates", "dataFlow": "Generates a Change Event to track costs for out-of-scope work." },
  { "source": "Resource Planning", "target": "Directory", "type": "pulls-data-from", "dataFlow": "Utilizes Directory contacts for Resource and equipment allocation." },
  { "source": "Resource Tracking", "target": "Timesheets", "type": "syncs", "dataFlow": "Field production quantities sync with labor hours." },

  // --- PROJECT MANAGEMENT (RFIs, Submittals, Drawings) ---
  { "source": "Drawings", "target": "RFIs", "type": "attaches-links", "dataFlow": "RFIs are linked directly to specific areas on Drawings." },
  { "source": "Drawings", "target": "Observations", "type": "creates", "dataFlow": "Dropping a pin on a drawing can create a new Observation." },
  { "source": "Drawings", "target": "Punch List", "type": "creates", "dataFlow": "Punch List items are pinned to locations on the Drawings." },
  { "source": "RFIs", "target": "Change Events", "type": "converts-to", "dataFlow": "An RFI with cost impact can be converted into a Change Event." },
  { "source": "RFIs", "target": "Potential Change Orders", "type": "converts-to", "dataFlow": "RFIs can initiate the PCO process." },
  { "source": "Submittals", "target": "Drawings", "type": "attaches-links", "dataFlow": "Approved submittals are linked to the relevant drawing sheets." },
  
  // --- QUALITY & SAFETY ---
  { "source": "Observations", "target": "Punch List", "type": "converts-to", "dataFlow": "Unresolved observations can be elevated to Punch List items." },
  { "source": "Incidents", "target": "Daily Log", "type": "pushes-data-to", "dataFlow": "Incident reports automatically generate entries in the Daily Log." },
  { "source": "Inspections", "target": "Observations", "type": "creates", "dataFlow": "Failed inspection items can automatically create Observations." },
  { "source": "Forms", "target": "Documents", "type": "pushes-data-to", "dataFlow": "Completed forms are archived in the Documents tool." },
  
  // --- FINANCIAL MANAGEMENT ---
  { "source": "Direct Costs", "target": "Budget", "type": "pushes-data-to", "dataFlow": "Direct Cost invoices update the 'Actual Cost' column in the Budget." },
  { "source": "Commitments", "target": "Budget", "type": "pushes-data-to", "dataFlow": "Committed costs (Subcontracts/POs) reserve funds in the Budget." },
  { "source": "Change Events", "target": "Budget", "type": "pushes-data-to", "dataFlow": "Change Events populate the 'Estimated Cost' in the Budget." },
  { "source": "Prime Contracts", "target": "Invoicing", "type": "creates", "dataFlow": "Owner Invoices are generated based on the Prime Contract SOV." },
  { "source": "Commitments", "target": "Invoicing", "type": "creates", "dataFlow": "Subcontractor Invoices are generated against the Commitment." },
  { "source": "Procore Pay", "target": "Invoicing", "type": "syncs", "dataFlow": "Payments disbursed via Procore Pay update the Invoice status." },
  { "source": "Procore Pay", "target": "ERP Systems", "type": "syncs", "dataFlow": "Payment data syncs back to the ERP for reconciliation." },
  
  // --- CORE & PLATFORM ---
  { "source": "Directory", "target": "Permissions", "type": "feeds", "dataFlow": "The Directory controls user access levels and permissions." },
  { "source": "Documents", "target": "Drawings", "type": "feeds", "dataFlow": "Source PDF sheets are uploaded to Documents before being processed into Drawings." },
  { "source": "Project Map", "target": "Drawings", "type": "attaches-links", "dataFlow": "Drawings can be geo-located on the Project Map." },
  { "source": "Emails", "target": "Correspondence", "type": "converts-to", "dataFlow": "Inbound emails can be converted into formal Correspondence records." },
  
  // --- INTELLIGENCE & ANALYTICS ---
  { "source": "Budget", "target": "Analytics", "type": "feeds", "dataFlow": "Financial data feeds cross-project Analytics reports." },
  { "source": "Daily Log", "target": "Analytics", "type": "feeds", "dataFlow": "Manpower and weather logs feed project performance dashboards." },
  { "source": "Observations", "target": "Insights", "type": "feeds", "dataFlow": "Open item trends are visualized in AI-driven Insights." }
];
