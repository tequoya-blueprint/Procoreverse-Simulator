/** * Procoreverse Data Module (Part 2/3)
 * This file contains all the connection links from SECTION 2
 * and the legend data from SECTION 3.
 * (This block is now corrected for all typos)
 */
 
// --- [SECTION 2] - All Connection Links ---
const linksData = [
  {
    "source": "Crews",
    "target": "Timesheets",
    "type": "pushes-data-to",
    "dataFlow": "Crews data populates Timesheets for organized labor tracking."
  },
  {
    "source": "Timesheets",
    "target": "Daily Log",
    "type": "syncs",
    "dataFlow": "Syncs labor hours with Daily Log's manpower entries."
  },
  {
    "source": "Timesheets",
    "target": "Budget",
    "type": "pushes-data-to",
    "dataFlow": "Labor costs from Timesheets update the project budget."
  },
  {
    "source": "MyTime",
    "target": "Timesheets",
    "type": "syncs",
    "dataFlow": "Individual time entries sync to centralized project timesheets."
  },
  {
    "source": "T&M Tickets",
    "target": "Change Events",
    "type": "creates",
    "dataFlow": "Generates a Change Event to track costs for out-of-scope work."
  },
  {
    "source": "Resource Planning",
    "target": "Directory",
    "type": "pulls-data-from",
    "dataFlow": "Utilizes Directory contacts for Resource and equipment allocation."
  },
  {
    "source": "Budget",
    "target": "Timesheets",
    "type": "pulls-data-from",
    "dataFlow": "Provides budgeted hours and quantities for logging and tracking against actuals."
  },
  {
    "source": "Timesheets",
    "target": "Budget",
    "type": "pulls-data-from",
    "dataFlow": "Provides timesheets hours show in the Budget tool when a cost type is applied to a time entry."
  },
  {
    "source": "Timesheets",
    "target": "T&M Tickets",
    "type": "pushes-data-to",
    "dataFlow": "Populates labor hours for out-of-scope work tracking."
  },
  {
    "source": "Timesheets",
    "target": "Equipment",
    "type": "syncs",
    "dataFlow": "Tracks equipment usage time against labor hours."
  },
  {
    "source": "Projects",
    "target": "Resource Planning",
    "type": "syncs",
    "dataFlow": "Syncs project list for resource allocation."
  },
  {
    "source": "Equipment",
    "target": "Resource Planning",
    "type": "pushes-data-to",
    "dataFlow": "Provides list of available equipment for scheduling."
  },
  {
    "source": "Equipment",
    "target": "Daily Log",
    "type": "pushes-data-to",
    "dataFlow": "Populates equipment usage in daily logs."
  },
  {
    "source": "Equipment",
    "target": "Inspections",
    "type": "attaches-links",
    "dataFlow": "Link equipment to inspections."
  },
  {
    "source": "RFIs",
    "target": "Change Events",
    "type": "creates",
    "dataFlow": "RFIs with cost implications can initiate a Change Event."
  },
  {
    "source": "Observations",
    "target": "Change Events",
    "type": "creates",
    "dataFlow": "Observations with cost implications can initiate a Change Event."
  },
  {
    "source": "Meetings",
    "target": "Change Events",
    "type": "creates",
    "dataFlow": "Meetings with cost implications can initiate a Change Event."
  },
  {
    "source": "Correspondence",
    "target": "Change Events",
    "type": "creates",
    "dataFlow": "Correspondence with cost implications can initiate a Change Event."
  },
  {
    "source": "Change Events",
    "target": "Change Orders",
    "type": "syncs",
    "dataFlow": "Aggregates potential costs from events and generates formal Change Orders (PCOs/CCOs)."
  },
  {
    "source": "Change Orders",
    "target": "Prime Contracts",
    "type": "pushes-data-to",
    "dataFlow": "Approved Prime Change Orders update the Prime Contract value."
  },
  {
    "source": "Change Orders",
    "target": "Commitments",
    "type": "pushes-data-to",
    "dataFlow": "Approved Commitment Change Orders update Subcontract/PO values."
  },
  {
    "source": "Change Orders",
    "target": "Budget",
    "type": "pushes-data-to",
    "dataFlow": "Approved Change Orders officially adjust budget line items."
  },
  {
    "source": "Commitments",
    "target": "Budget",
    "type": "pushes-data-to",
    "dataFlow": "Tracks committed costs against the budget."
  },
  {
    "source": "Direct Costs",
    "target": "Budget",
    "type": "pushes-data-to",
    "dataFlow": "Tracks actual costs against the budget."
  },
  {
    "source": "Commitments",
    "target": "Invoicing",
    "type": "syncs",
    "dataFlow": "Subcontractor invoices are billed against Commitment Schedules of Value (SOVs)."
  },
  {
    "source": "Prime Contracts",
    "target": "Invoicing",
    "type": "syncs",
    "dataFlow": "Owner invoices are billed against the Prime Contract SOV."
  },
  {
    "source": "Change Events",
    "target": "Budget",
    "type": "pushes-data-to",
    "dataFlow": "Potential costs from Change Events are reflected in budget forecasts."
  },
  {
    "source": "Change Events",
    "target": "Commitments",
    "type": "creates",
    "dataFlow": "Can generate Commitment Change Orders (CCOs) for subcontractors."
  },
  {
    "source": "Direct Costs",
    "target": "Prime Contracts",
    "type": "attaches-links",
    "dataFlow": "Can prefill line items on a Prime Contract."
  },
  {
    "source": "Prequalifications",
    "target": "Bidding",
    "type": "pushes-data-to",
    "dataFlow": "Qualified vendors can be invited to bid packages."
  },
  {
    "source": "Estimating",
    "target": "Bidding",
    "type": "creates",
    "dataFlow": "Generates bid packages based on cost estimates."
  },
  {
    "source": "Bidding",
    "target": "Commitments",
    "type": "converts-to",
    "dataFlow": "Awarded bids are converted into Subcontracts or Purchase Orders."
  },
  {
    "source": "Estimating",
    "target": "Budget",
    "type": "creates",
    "dataFlow": "Generates the initial project budget from the final estimate."
  },
  {
    "source": "Estimating",
    "target": "Change Events",
    "type": "creates",
    "dataFlow": "Create Change Events directly from an estimate for potential scope changes."
  },
  {
    "source": "Estimating",
    "target": "Prime Contracts",
    "type": "creates",
    "dataFlow": "Generates the Prime Contract Schedule of Values from the final estimate."
  },
  {
    "source": "Bidding",
    "target": "Procore Construction Network",
    "type": "pulls-data-from",
    "dataFlow": "Find and invite bidders from the Procore Construction Network."
  },
  {
    "source": "Bidding",
    "target": "Directory",
    "type": "syncs",
    "dataFlow": "Pulls bidders from and adds new bidders to the Directory."
  },
  {
    "source": "Estimating",
    "target": "Drawings",
    "type": "pulls-data-from",
    "dataFlow": "Pulls drawings for creating takeoffs."
  },
  {
    "source": "Estimating",
    "target": "Documents",
    "type": "pulls-data-from",
    "dataFlow": "Pulls models and other documents for estimating."
  },
  {
    "source": "Drawings",
    "target": "RFIs",
    "type": "creates",
    "dataFlow": "Create RFIs from drawing markups; answered RFIs link back to the drawing."
  },
  {
    "source": "Drawings",
    "target": "Observations",
    "type": "creates",
    "dataFlow": "Pin Observation items to specific locations on drawings."
  },
  {
    "source": "Drawings",
    "target": "Punch List",
    "type": "creates",
    "dataFlow": "Pin Punch-List items to specific locations on drawings."
  },
  {
    "source": "Drawings",
    "target": "Submittals",
    "type": "attaches-links",
    "dataFlow": "Link approved submittals to drawings for easy field reference."
  },
  {
    "source": "Specifications",
    "target": "Submittals",
    "type": "converts-to",
    "dataFlow": "The submittal register can be generated directly from project spec sections."
  },
  {
    "source": "Models",
    "target": "Coordination Issues",
    "type": "creates",
    "dataFlow": "Identifies, tracks, and manages clashes and other model issues."
  },
  {
    "source": "Models",
    "target": "Observations",
    "type": "creates",
    "dataFlow": "Create observations from within the 3D model environment."
  },
  {
    "source": "Coordination Issues",
    "target": "RFIs",
    "type": "converts-to",
    "dataFlow": "Elevates complex model issues to RFIs for formal clarification."
  },
  {
    "source": "Inspections",
    "target": "Observations",
    "type": "creates",
    "dataFlow": "Failed inspection items can automatically generate Observations for tracking."
  },
  {
    "source": "Incidents",
    "target": "Observations",
    "type": "creates",
    "dataFlow": "Incidents can generate follow-up Observations for corrective actions."
  },
  {
    "source": "Action Plans",
    "target": "Inspections",
    "type": "creates",
    "dataFlow": "Action Plans can create new Inspections as part of a required process."
  },
  {
    "source": "Specifications",
    "target": "Action Plans",
    "type": "attaches-links",
    "dataFlow": "Reference Specifications as supporting items within an Action Plan."
  },
  {
    "source": "Drawings",
    "target": "Action Plans",
    "type": "attaches-links",
    "dataFlow": "Reference Drawings as supporting items within an Action Plan."
  },
  {
    "source": "Submittals",
    "target": "Action Plans",
    "type": "attaches-links",
    "dataFlow": "Reference Submittals as supporting items within an Action Plan."
  },
  {
    "source": "Correspondence",
    "target": "Action Plans",
    "type": "attaches-links",
    "dataFlow": "Reference Correspondence as supporting items within an Action Plan."
  },
  {
    "source": "Forms",
    "target": "Action Plans",
    "type": "attaches-links",
    "dataFlow": "Reference Forms as supporting items within an Action Plan."
  },
  {
    "source": "Meetings",
    "target": "Action Plans",
    "type": "attaches-links",
    "dataFlow": "Reference Meetings as supporting items within an ActionPlan."
  },
  {
    "source": "Documents",
    "target": "Action Plans",
    "type": "attaches-links",
    "dataFlow": "Reference Documents as supporting items within an Action Plan."
  },
  {
    "source": "Correspondence",
    "target": "RFIs",
    "type": "creates",
    "dataFlow": "Create a new RFI from a correspondence, or link to an existing one."
  },
  {
    "source": "Drawings",
    "target": "Correspondence",
    "type": "creates",
    "dataFlow": "Create or link correspondence items directly on drawings."
  },
  {
    "source": "Drawings",
    "target": "Inspections",
    "type": "syncs",
    "dataFlow": "Link inspections to specific areas on drawings."
  },
  {
    "source": "Drawings",
    "target": "Coordination Issues",
    "type": "creates",
    "dataFlow": "Create or link coordination issues from drawing markups."
  },
  {
    "source": "Drawings",
    "target": "Photos",
    "type": "syncs",
    "dataFlow": "Attach photos to drawings and vice-versa."
  },
  {
    "source": "Photos",
    "target": "Observations",
    "type": "creates",
    "dataFlow": "Create a new observation with an attached photo."
  },
  {
    "source": "Photos",
    "target": "Punch List",
    "type": "creates",
    "dataFlow": "Create a new punch item with an attached photo."
  },
  {
    "source": "Photos",
    "target": "RFIs",
    "type": "creates",
    "dataFlow": "Create a new RFI with an attached photo."
  },
  {
    "source": "Photos",
    "target": "Change Events",
    "type": "creates",
    "dataFlow": "Create a new change event with an attached photo."
  },
  {
    "source": "Photos",
    "target": "Correspondence",
    "type": "creates",
    "dataFlow": "Create a new correspondence with an attached photo."
  },
  {
    "source": "Photos",
    "target": "Incidents",
    "type": "creates",
    "dataFlow": "Create a new incident with an attached photo."
  },
  {
    "source": "Photos",
    "target": "T&M Tickets",
    "type": "creates",
    "dataFlow": "Create a new T&M Ticket with an attached photo."
  },
  {
    "source": "Inspections",
    "target": "Specifications",
    "type": "attaches-links",
    "dataFlow": "Link inspections to relevant spec sections."
  },
  {
    "source": "Daily Log",
    "target": "Commitments",
    "type": "attaches-links",
    "dataFlow": "Productivity data can be linked to commitments."
  },
  {
    "source": "Daily Log",
    "target": "Schedule",
    "type": "attaches-links",
    "dataFlow": "Link daily log entries to schedule tasks."
  },
  {
    "source": "Models",
    "target": "Drawings",
    "type": "syncs",
    "dataFlow": "Overlay 2D drawings on 3D models for comparison."
  },
  {
    "source": "Coordination Issues",
    "target": "Observations",
    "type": "creates",
    "dataFlow": "A coordination issue can be used to create a new observation."
  },
  {
    "source": "Documents",
    "target": "Drawings",
    "type": "pushes-data-to",
    "dataFlow": "PDFs stored in Documents can be uploaded to the Drawings tool for version control."
  },
  {
    "source": "Photos",
    "target": "Daily Log",
    "type": "attaches-links",
    "dataFlow": "Attach photos to Daily Log entries for visual documentation."
  },
  {
    "source": "Drawings",
    "target": "Documents",
    "type": "attaches-links",
    "dataFlow": "Link supporting documents to drawings."
  },
  {
    "source": "Documents",
    "target": "Specifications",
    "type": "creates",
    "dataFlow": "Create spec sections from documents."
  },
  {
    "source": "Directory",
    "target": "Daily Log",
    "type": "attaches-links",
    "dataFlow": "Save phone calls made from Directory to Daily Log (mobile)."
  },
  {
    "source": "Documents",
    "target": "Models",
    "type": "creates",
    "dataFlow": "Upload models from the Documents tool."
  },
  {
    "source": "Budget",
    "target": "ERP Systems",
    "type": "syncs",
    "dataFlow": "Syncs Budget data with the company's main financial records."
  },
  {
    "source": "Commitments",
    "target": "ERP Systems",
    "type": "syncs",
    "dataFlow": "Syncs Commitments data with the company's main financial records."
  },
  {
    "source": "Invoicing",
    "target": "ERP Systems",
    "type": "syncs",
    "dataFlow": "Syncs Invoicing data with the company's main financial records."
  },
  {
    "source": "RFIs",
    "target": "Analytics",
    "type": "feeds",
    "dataFlow": "Pushes rfi data for cross-tool analysis and insights."
  },
  {
    "source": "Submittals",
    "target": "Analytics",
    "type": "feeds",
    "dataFlow": "Pushes submittals data for cross-tool analysis and insights."
  },
  {
    "source": "Daily Log",
    "target": "Analytics",
    "type": "feeds",
    "dataFlow": "Pushes daily log data for cross-tool analysis and insights."
  },
  {
    "source": "Incidents",
    "target": "Analytics",
    "type": "feeds",
    "dataFlow": "Pushes incidents data for cross-tool analysis and insights."
  },
  {
    "source": "Observations",
    "target": "Analytics",
    "type": "feeds",
    "dataFlow": "Pushes observations data for cross-tool analysis and insights."
  },
  {
    "source": "Inspections",
    "target": "Analytics",
    "type": "feeds",
    "dataFlow": "Pushes inspections data for cross-tool analysis and insights."
  },
  {
    "source": "Punch List",
    "target": "Analytics",
    "type": "feeds",
    "dataFlow": "Pushes punch list data for cross-tool analysis and insights."
  },
  {
    "source": "Budget",
    "target": "Analytics",
    "type": "feeds",
    "dataFlow": "Pushes budget data for cross-tool analysis and insights."
  },
  {
    "source": "Change Orders",
    "target": "Analytics",
    "type": "feeds",
    "dataFlow": "Pushes change orders data for cross-tool analysis and insights."
  },
  {
    "source": "Timesheets",
    "target": "Analytics",
    "type": "feeds",
    "dataFlow": "Pushes timesheets data for cross-tool analysis and insights."
  },
  {
    "source": "Timesheets",
    "target": "Analytics",
    "type": "feeds",
    "dataFlow": "Pushes Timesheets data for cross-tool analysis and insights."
  },
  {
    "source": "Commitments",
    "target": "Analytics",
    "type": "feeds",
    "dataFlow": "Pushes commitments data for cross-tool analysis and insights."
  },
  {
    "source": "Direct Costs",
    "target": "Analytics",
    "type": "feeds",
    "dataFlow": "Pushes direct costs data for cross-tool analysis and insights."
  },
  {
    "source": "Emails",
    "target": "Change Events",
    "type": "creates",
    "dataFlow": "Create change event from email correspondence for"
  },
  {
    "source": "Estimating",
    "target": "Change Events",
    "type": "creates",
    "dataFlow": "Link change order estimate to an existing change event for tracking."
  },
  {
    "source": "Budget",
    "target": "Change Events",
    "type": "creates",
    "dataFlow": "Creates change events from budget line item"
  },
  {
    "source": "Drawings",
    "target": "Punch List",
    "type": "creates",
    "dataFlow": "Create punch list item from drawings."
  },
  {
    "source": "Drawings",
    "target": "Coordination Issues",
    "type": "creates",
    "dataFlow": "Create coordination issue from drawings."
  },
  {
    "source": "Action Plans",
    "target": "Correspondence",
    "type": "creates",
    "dataFlow": "Creates correspondence from action plan."
  },
  {
    "source": "Action Plans",
    "target": "Forms",
    "type": "creates",
    "dataFlow": "Create form from action plan."
  },
  {
    "source": "Action Plans",
    "target": "Meetings",
    "type": "creates",
    "dataFlow": "Create a meeting from action plan."
  },
  {
    "source": "Action Plans",
    "target": "Observations",
    "type": "creates",
    "dataFlow": "Create observation from action plan."
  },
  {
    "source": "Action Plans",
    "target": "Photos",
    "type": "attaches-links",
    "dataFlow": "Create Photos from action plan."
  },
  {
    "source": "Invoicing",
    "target": "Procore Pay",
    "type": "creates",
    "dataFlow": "Invoice can be queued for payment disbursement using Procore Pay"
  },
  {
    "source": "Procore Pay",
    "target": "ERP Systems",
    "type": "syncs",
    "dataFlow": "Payment status is synced in the ERP system."
  },
  {
  "source": "Drawings",
  "target": "Bidding",
  "type": "pulls-data-from",
  "dataFlow": "Pulls drawings to include in Bid Packages."
}
];

// --- [SECTION 3] - Connection Type Legend ---
const legendData = [
  {
    "type_id": "creates",
    "label": "Creates",
    "description": "One-way item creation. Data from the origin tool is used to pre-populate fields in a new item in the destination tool.",
    "visual_style": "Dashed line, one arrow"
  },
  {
    "type_id": "converts-to",
    "label": "Converts To",
    "description": "One-way item conversion/generation. A specific, formal workflow that transforms one item type into another, or bulk-generates items from a source.",
    "visual_style": "Dashed line, one arrow"
  },
  {
    "type_id": "syncs",
    "label": "Syncs",
    "description": "Two-way data synchronization. Data is actively shared and updated (often automatically) between two tools.",
    "visual_style": "Solid line, two arrows"
  },
  {
    "type_id": "pushes-data-to",
    "label": "Pushes Data To",
    "description": "One-way data push/aggregation. Data from the origin tool is pushed to and aggregated by the destination tool, typically for reporting, costing, or rollup.",
    "visual_style": "Solid line, one arrow"
  },
  {
    "type_id": "pulls-data-from",
    "label": "Pulls Data From",
    "description": "One-way data pull/lookup. The origin tool pulls data (e.g., from a library, directory, or list) from the destination tool during item creation.",
    "visual_style": "Dotted line, one arrow"
  },
  {
    "type_id": "attaches-links",
    "label": "Attaches/Links",
    "description": "Attachment or linking. The origin tool links to or attaches an existing record from the destination tool.",
    "visual_style": "Dotted line, one arrow"
  },
  {
    "type_id": "feeds",
    "label": "Feeds",
    "description": "Reporting data flow. The origin tool's data is consumed by a data intelligence or business intelligence platform for analysis.",
    "visual_style": "Solid line, one arrow, gray"
  }
];
