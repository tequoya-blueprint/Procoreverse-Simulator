// --- procoreverse_data_links.js ---
// VERSION: Safe Restore + Related Items Fix

/**
 * SECTION 1: The Legend Data
 * Defines the visual style of the lines.
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
    "description": "Conversion workflow. A specific, formal workflow that transforms one item type into another.",
    "visual_style": "Dashed line, one arrow"
  },
  {
    "type_id": "syncs",
    "label": "Syncs",
    "description": "Two-way data synchronization.",
    "visual_style": "Solid line, two arrows"
  },
  {
    "type_id": "pushes-data-to",
    "label": "Pushes Data To",
    "description": "One-way data push for reporting or aggregation.",
    "visual_style": "Solid line, one arrow"
  },
  {
    "type_id": "pulls-data-from",
    "label": "Pulls Data From",
    "description": "The origin tool looks up data from the destination tool.",
    "visual_style": "Dotted line, one arrow"
  },
  {
    "type_id": "attaches-links",
    "label": "Attaches/Links",
    "description": "Related Items. The origin tool links to an existing record from the destination tool.",
    "visual_style": "Dotted line, one arrow"
  },
  {
    "type_id": "feeds",
    "label": "Feeds",
    "description": "Reporting flow. Data is consumed by an intelligence platform.",
    "visual_style": "Solid line, one arrow, gray"
  }
];

/**
 * SECTION 2: The Connections (Links)
 * Only includes core connections verified to work.
 */
const linksData = [
  // --- RESOURCE & FIELD ---
  { "source": "Crews", "target": "Timesheets", "type": "pushes-data-to", "dataFlow": "Crews data populates Timesheets." },
  { "source": "Timesheets", "target": "Daily Log", "type": "syncs", "dataFlow": "Syncs labor hours with Daily Log." },
  { "source": "Timesheets", "target": "Budget", "type": "pushes-data-to", "dataFlow": "Labor costs update the project budget." },
  { "source": "T&M Tickets", "target": "Change Events", "type": "creates", "dataFlow": "Generates a Change Event for out-of-scope work." },
  { "source": "Resource Planning", "target": "Directory", "type": "pulls-data-from", "dataFlow": "Utilizes Directory contacts for allocation." },

  // --- PROJECT MANAGEMENT (The "Related Items" Fix) ---
  { "source": "Drawings", "target": "RFIs", "type": "attaches-links", "dataFlow": "RFIs are linked directly to locations on Drawings." },
  { "source": "Submittals", "target": "Drawings", "type": "attaches-links", "dataFlow": "Approved submittals are linked to drawing sheets." },
  { "source": "Drawings", "target": "Observations", "type": "creates", "dataFlow": "Dropping a pin on a drawing creates an Observation." },
  { "source": "RFIs", "target": "Change Events", "type": "converts-to", "dataFlow": "An RFI can be converted into a Change Event." },
  { "source": "RFIs", "target": "Potential Change Orders", "type": "converts-to", "dataFlow": "RFIs can initiate the PCO process." },
  
  // --- FINANCIAL ---
  { "source": "Direct Costs", "target": "Budget", "type": "pushes-data-to", "dataFlow": "Direct Cost invoices update the Budget." },
  { "source": "Commitments", "target": "Budget", "type": "pushes-data-to", "dataFlow": "Committed costs reserve funds in the Budget." },
  { "source": "Change Events", "target": "Budget", "type": "pushes-data-to", "dataFlow": "Change Events populate the Estimated Cost." },
  { "source": "Prime Contracts", "target": "Invoicing", "type": "creates", "dataFlow": "Owner Invoices are generated from the Prime Contract." },
  { "source": "Commitments", "target": "Invoicing", "type": "creates", "dataFlow": "Subcontractor Invoices are generated against the Commitment." },
  
  // --- CORE & ANALYTICS ---
  { "source": "Documents", "target": "Drawings", "type": "feeds", "dataFlow": "PDFs in Documents are processed into Drawings." },
  { "source": "Budget", "target": "Analytics", "type": "feeds", "dataFlow": "Financial data feeds Analytics reports." },
  { "source": "Daily Log", "target": "Analytics", "type": "feeds", "dataFlow": "Field logs feed performance dashboards." },
  { "source": "Observations", "target": "Insights", "type": "feeds", "dataFlow": "Open item trends are visualized in Insights." }
];
