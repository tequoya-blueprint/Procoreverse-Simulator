/**
 * Procoreverse Data Module - Packages
 * VERSION: January 2026 GA (Restored Included Features + Full Audience Names)
 */
const packagingData = [
  // -------------------------
  // NAMER (North America)
  // -------------------------
  {
    "region": "NAMER", "audience": "General Contractor", "package_name": "Project Execution Essentials",
    "tools": ["Directory", "Drawings", "Specifications", "Submittals", "RFIs", "Photos", "Observations", "Daily Log", "Emails", "Forms", "Equipment", "Timesheets"],
    "procore_led_tools": ["Drawings", "RFIs", "Submittals", "Observations", "Daily Log", "Timesheets"],
    "included_features": ["Assist"],
    "available_add-ons": ["Procore Pay", "Resource Tracking", "Resource Planning", "Prequalifications", "ERP Systems"],
    "available_services": ["Professional Services Implementation (25 hrs.)"]
  },
  {
    "region": "NAMER", "audience": "General Contractor", "package_name": "Project Execution Enhanced",
    "tools": ["Directory", "Drawings", "Specifications", "Submittals", "RFIs", "Photos", "Observations", "Daily Log", "Emails", "Forms", "Equipment", "Timesheets", "Project Map", "Transmittals", "Schedule", "Correspondence", "Action Plans", "Meetings", "Punch List", "Inspections", "Incidents", "Bidding"],
    "procore_led_tools": ["Drawings", "RFIs", "Submittals", "Observations", "Daily Log", "Timesheets", "Schedule", "Correspondence", "Action Plans", "Punch List", "Inspections", "Bidding"],
    "included_features": ["Assist", "Training Center", "Premier Support Bronze"],
    "available_add-ons": ["Procore Pay", "Resource Tracking", "Resource Planning", "Prequalifications", "ERP Systems"],
    "available_services": ["Professional Services Implementation (44 hrs.)"]
  },
  {
    "region": "NAMER", "audience": "General Contractor", "package_name": "Project Execution Premier",
    "tools": ["Directory", "Drawings", "Specifications", "Submittals", "RFIs", "Photos", "Observations", "Daily Log", "Emails", "Forms", "Equipment", "Timesheets", "Project Map", "Transmittals", "Schedule", "Correspondence", "Action Plans", "Meetings", "Punch List", "Inspections", "Incidents", "Bidding", "Coordination Issues", "Models", "Analytics", "Insights"],
    "procore_led_tools": ["Drawings", "RFIs", "Submittals", "Observations", "Daily Log", "Timesheets", "Schedule", "Correspondence", "Action Plans", "Punch List", "Inspections", "Bidding", "Models", "Coordination Issues", "Analytics"],
    "included_features": ["Assist", "Training Center"],
    "available_add-ons": ["Procore Pay", "Resource Tracking", "Resource Planning", "Prequalifications", "ERP Systems"],
    "available_services": ["Professional Services Implementation (64 hrs.)"]
  },
  {
    "region": "NAMER", "audience": "General Contractor", "package_name": "Cost Management Enhanced",
    "tools": ["Documents", "Directory", "Tasks", "Conversations", "Prime Contracts", "Commitments", "Budget", "Change Events", "Invoicing", "Direct Costs", "Project Status Snapshots"],
    "procore_led_tools": ["Prime Contracts", "Commitments", "Budget", "Change Events", "Invoicing", "Direct Costs"],
    "included_features": ["Assist"],
    "available_add-ons": ["Procore Pay", "Resource Tracking", "Resource Planning", "ERP Systems"],
    "available_services": ["Professional Services Implementation (32 hrs.)"]
  },
  {
    "region": "NAMER", "audience": "General Contractor", "package_name": "Cost Management Premier",
    "tools": ["Documents", "Directory", "Tasks", "Conversations", "Prime Contracts", "Commitments", "Budget", "Change Events", "Invoicing", "Direct Costs", "Project Status Snapshots", "Estimating", "Bid Board", "Drawings", "Insights", "Analytics"],
    "procore_led_tools": ["Prime Contracts", "Commitments", "Budget", "Change Events", "Invoicing", "Direct Costs", "Estimating", "Analytics"],
    "included_features": ["Assist"],
    "available_add-ons": ["Procore Pay", "Resource Tracking", "Resource Planning", "ERP Systems"],
    "available_services": ["Professional Services Implementation (52 hrs.)"]
  },
  {
    "region": "NAMER", "audience": "General Contractor", "package_name": "Resource Management Premier",
    "tools": ["Documents", "Directory", "Tasks", "Conversations", "Project Map", "Timesheets", "Crews", "Equipment", "T&M Tickets", "Resource Tracking", "Resource Planning", "Analytics"],
    "procore_led_tools": ["Timesheets", "Crews", "Equipment", "T&M Tickets", "Resource Planning", "Analytics"],
    "included_features": [],
    "available_add-ons": [],
    "available_services": ["Professional Services Implementation (35 hrs.)"]
  },
  {
    "region": "NAMER", "audience": "Specialty Contractor", "package_name": "Project Execution Essentials",
    "tools": ["Directory", "Drawings", "Specifications", "Submittals", "RFIs", "Photos", "Observations", "Daily Log", "Emails", "Forms", "Equipment", "Timesheets", "T&M Tickets"],
    "procore_led_tools": ["Drawings", "RFIs", "Submittals", "Observations", "Daily Log", "Timesheets", "T&M Tickets"],
    "included_features": ["Assist"],
    "available_add-ons": ["Procore Pay", "Resource Tracking", "Resource Planning", "Prequalifications", "ERP Systems"],
    "available_services": ["Professional Services Implementation (25 hrs.)"]
  },
  {
    "region": "NAMER", "audience": "Specialty Contractor", "package_name": "Project Execution Enhanced",
    "tools": ["Directory", "Drawings", "Specifications", "Submittals", "RFIs", "Photos", "Observations", "Daily Log", "Emails", "Forms", "Equipment", "Timesheets", "T&M Tickets", "Project Map", "Transmittals", "Schedule", "Correspondence", "Action Plans", "Meetings", "Punch List", "Inspections", "Incidents", "Bidding"],
    "procore_led_tools": ["Drawings", "RFIs", "Submittals", "Observations", "Daily Log", "Timesheets", "Schedule", "Correspondence", "Action Plans", "T&M Tickets", "Punch List", "Inspections", "Bidding"],
    "included_features": ["Assist", "Training Center", "Premier Support Bronze"],
    "available_add-ons": ["Procore Pay", "Resource Tracking", "Resource Planning", "Prequalifications", "ERP Systems"],
    "available_services": ["Professional Services Implementation (44 hrs.)"]
  },
  {
    "region": "NAMER", "audience": "Specialty Contractor", "package_name": "Project Execution Premier",
    "tools": ["Directory", "Drawings", "Specifications", "Submittals", "RFIs", "Photos", "Observations", "Daily Log", "Emails", "Forms", "Equipment", "Timesheets", "T&M Tickets", "Project Map", "Transmittals", "Schedule", "Correspondence", "Action Plans", "Meetings", "Punch List", "Inspections", "Incidents", "Bidding", "Coordination Issues", "Models", "Analytics", "Insights"],
    "procore_led_tools": ["Drawings", "RFIs", "Submittals", "Observations", "Daily Log", "Timesheets", "Schedule", "Correspondence", "Action Plans", "Punch List", "Inspections", "Bidding", "Models", "Coordination Issues", "Analytics"],
    "included_features": ["Assist", "Training Center"],
    "available_add-ons": ["Procore Pay", "Resource Tracking", "Resource Planning", "Prequalifications", "ERP Systems"],
    "available_services": ["Professional Services Implementation (64 hrs.)"]
  },
  {
    "region": "NAMER", "audience": "Specialty Contractor", "package_name": "Cost Management Enhanced",
    "tools": ["Documents", "Directory", "Tasks", "Conversations", "Prime Contracts", "Commitments", "Budget", "Change Events", "Invoicing", "Direct Costs", "Project Status Snapshots"],
    "procore_led_tools": ["Prime Contracts", "Commitments", "Budget", "Change Events", "Invoicing", "Direct Costs"],
    "included_features": ["Assist"],
    "available_add-ons": ["Procore Pay", "Resource Tracking", "Resource Planning", "ERP Systems"],
    "available_services": ["Professional Services Implementation (32 hrs.)"]
  },
  {
    "region": "NAMER", "audience": "Specialty Contractor", "package_name": "Cost Management Premier",
    "tools": ["Documents", "Directory", "Tasks", "Conversations", "Prime Contracts", "Commitments", "Budget", "Change Events", "Invoicing", "Direct Costs", "Project Status Snapshots", "Estimating", "Bid Board", "Drawings", "Insights", "Analytics"],
    "procore_led_tools": ["Prime Contracts", "Commitments", "Budget", "Change Events", "Invoicing", "Direct Costs", "Estimating", "Analytics"],
    "included_features": ["Assist"],
    "available_add-ons": ["Procore Pay", "Resource Tracking", "Resource Planning", "ERP Systems"],
    "available_services": ["Professional Services Implementation (52 hrs.)"]
  },
  {
    "region": "NAMER", "audience": "Specialty Contractor", "package_name": "Resource Management Premier",
    "tools": ["Documents", "Directory", "Tasks", "Conversations", "Project Map", "Timesheets", "Crews", "Equipment", "T&M Tickets", "Resource Tracking", "Resource Planning", "Analytics"],
    "procore_led_tools": ["Timesheets", "Crews", "Equipment", "T&M Tickets", "Resource Planning", "Analytics"],
    "included_features": [],
    "available_add-ons": [],
    "available_services": ["Professional Services Implementation (35 hrs.)"]
  },
  {
    "region": "NAMER", "audience": "Owner", "package_name": "Project Execution Essentials",
    "tools": ["Directory", "Drawings", "Specifications", "Submittals", "RFIs", "Photos", "Observations", "Daily Log", "Emails", "Forms", "Equipment", "Timesheets"],
    "procore_led_tools": ["Drawings", "RFIs", "Submittals", "Observations", "Daily Log", "Timesheets"],
    "included_features": ["Assist"],
    "available_add-ons": ["Procore Pay", "Resource Tracking", "Resource Planning", "Prequalifications", "ERP Systems"],
    "available_services": ["Professional Services Implementation (25 hrs.)"]
  },
  {
    "region": "NAMER", "audience": "Owner", "package_name": "Project Execution Enhanced",
    "tools": ["Directory", "Drawings", "Specifications", "Submittals", "RFIs", "Photos", "Observations", "Daily Log", "Emails", "Forms", "Equipment", "Timesheets", "Project Map", "Transmittals", "Schedule", "Correspondence", "Action Plans", "Meetings", "Punch List", "Inspections", "Incidents", "Bidding"],
    "procore_led_tools": ["Drawings", "RFIs", "Submittals", "Observations", "Daily Log", "Timesheets", "Schedule", "Correspondence", "Action Plans", "Punch List", "Inspections", "Bidding"],
    "included_features": ["Assist", "Training Center", "Premier Support Bronze"],
    "available_add-ons": ["Procore Pay", "Resource Tracking", "Resource Planning", "Prequalifications", "ERP Systems"],
    "available_services": ["Professional Services Implementation (44 hrs.)"]
  },
  {
    "region": "NAMER", "audience": "Owner", "package_name": "Project Execution Premier",
    "tools": ["Directory", "Drawings", "Specifications", "Submittals", "RFIs", "Photos", "Observations", "Daily Log", "Emails", "Forms", "Equipment", "Timesheets", "Project Map", "Transmittals", "Schedule", "Correspondence", "Action Plans", "Meetings", "Punch List", "Inspections", "Incidents", "Bidding", "Coordination Issues", "Models", "Analytics", "Insights"],
    "procore_led_tools": ["Drawings", "RFIs", "Submittals", "Observations", "Daily Log", "Timesheets", "Schedule", "Correspondence", "Action Plans", "Punch List", "Inspections", "Bidding", "Models", "Coordination Issues", "Analytics"],
    "included_features": ["Assist", "Training Center"],
    "available_add-ons": ["Procore Pay", "Resource Tracking", "Resource Planning", "Prequalifications", "ERP Systems"],
    "available_services": ["Professional Services Implementation (64 hrs.)"]
  },
  {
    "region": "NAMER", "audience": "Owner", "package_name": "Cost Management Enhanced",
    "tools": ["Documents", "Directory", "Tasks", "Conversations", "Prime Contracts", "Commitments", "Budget", "Change Events", "Invoicing", "Direct Costs", "Project Status Snapshots"],
    "procore_led_tools": ["Prime Contracts", "Commitments", "Budget", "Change Events", "Invoicing", "Direct Costs"],
    "included_features": ["Assist"],
    "available_add-ons": ["Procore Pay", "Resource Tracking", "Resource Planning", "ERP Systems"],
    "available_services": ["Professional Services Implementation (32 hrs.)"]
  },
  {
    "region": "NAMER", "audience": "Owner", "package_name": "Cost Management Premier",
    "tools": ["Documents", "Directory", "Tasks", "Conversations", "Prime Contracts", "Commitments", "Budget", "Change Events", "Invoicing", "Direct Costs", "Project Status Snapshots", "Estimating", "Bid Board", "Drawings", "Insights", "Analytics"],
    "procore_led_tools": ["Prime Contracts", "Commitments", "Budget", "Change Events", "Invoicing", "Direct Costs", "Estimating", "Analytics"],
    "included_features": ["Assist"],
    "available_add-ons": ["Procore Pay", "Resource Tracking", "Resource Planning", "ERP Systems"],
    "available_services": ["Professional Services Implementation (52 hrs.)"]
  },
  {
    "region": "NAMER", "audience": "Owner", "package_name": "Resource Management Premier",
    "tools": ["Documents", "Directory", "Tasks", "Conversations", "Project Map", "Timesheets", "Crews", "Equipment", "T&M Tickets", "Resource Tracking", "Resource Planning", "Analytics"],
    "procore_led_tools": ["Timesheets", "Crews", "Equipment", "T&M Tickets", "Resource Planning", "Analytics"],
    "included_features": [],
    "available_add-ons": [],
    "available_services": ["Professional Services Implementation (35 hrs.)"]
  },

  // -------------------------
  // APAC (Australia / Asia)
  // -------------------------
  {
    "region": "APAC", "audience": "Contractor", "package_name": "Project Execution Essentials",
    "tools": ["Directory", "Drawings", "Specifications", "Photos", "Observations", "Daily Log", "Emails", "Forms", "Equipment", "Timesheets", "Punch List", "Inspections", "Incidents", "Instructions"],
    "procore_led_tools": ["Drawings", "Inspections", "Punch List", "Observations", "Daily Log", "Timesheets", "Equipment"],
    "included_features": ["Assist"],
    "available_add-ons": [],
    "available_services": ["Professional Services Implementation (32 hrs.)"]
  },
  {
    "region": "APAC", "audience": "Contractor", "package_name": "Project Execution Enhanced",
    "tools": ["Directory", "Drawings", "Specifications", "Photos", "Observations", "Daily Log", "Emails", "Forms", "Equipment", "Timesheets", "Punch List", "Inspections", "Incidents", "Instructions", "Submittals", "RFIs", "Project Map", "Transmittals", "Schedule", "Correspondence", "Action Plans", "Meetings", "Bidding"],
    "procore_led_tools": ["Drawings", "RFIs", "Submittals", "Observations", "Daily Log", "Schedule", "Correspondence", "Action Plans", "Punch List", "Inspections", "Bidding", "Analytics", "Equipment", "Timesheets", "Incidents", "Emails"],
    "included_features": ["Assist"],
    "available_add-ons": ["Procore Pay", "Resource Tracking", "Resource Planning", "Prequalifications", "ERP Systems"],
    "available_services": ["Professional Services Implementation (52 hrs.)"]
  },
  {
    "region": "APAC", "audience": "Contractor", "package_name": "Project Execution Enhanced w CDE",
    "tools": ["Directory", "Drawings", "Specifications", "Photos", "Observations", "Daily Log", "Emails", "Forms", "Equipment", "Timesheets", "Punch List", "Inspections", "Incidents", "Instructions", "Submittals", "RFIs", "Project Map", "Transmittals", "Schedule", "Correspondence", "Action Plans", "Meetings", "Bidding", "Documents"],
    "procore_led_tools": ["Drawings", "RFIs", "Submittals", "Observations", "Daily Log", "Schedule", "Correspondence", "Action Plans", "Punch List", "Inspections", "Bidding", "Analytics", "Equipment", "Timesheets", "Incidents", "Emails"],
    "included_features": ["Assist"],
    "available_add-ons": [],
    "available_services": ["Professional Services Implementation (50 hrs.)"]
  },
  {
    "region": "APAC", "audience": "Contractor", "package_name": "Project Execution Premier",
    "tools": ["Directory", "Drawings", "Specifications", "Photos", "Observations", "Daily Log", "Emails", "Forms", "Equipment", "Timesheets", "Punch List", "Inspections", "Incidents", "Instructions", "Submittals", "RFIs", "Project Map", "Transmittals", "Schedule", "Correspondence", "Action Plans", "Meetings", "Bidding", "Coordination Issues", "Models", "Analytics", "Insights"],
    "procore_led_tools": ["Drawings", "RFIs", "Submittals", "Observations", "Daily Log", "Timesheets", "Schedule", "Correspondence", "Action Plans", "Punch List", "Inspections", "Bidding", "Models", "Coordination Issues", "Training Center", "Analytics"],
    "included_features": ["Assist", "Training Center"],
    "available_add-ons": [],
    "available_services": ["Professional Services Implementation (64 hrs.)"]
  },
  {
    "region": "APAC", "audience": "Contractor", "package_name": "Project Execution Premier w CDE",
    "tools": ["Directory", "Drawings", "Specifications", "Photos", "Observations", "Daily Log", "Emails", "Forms", "Equipment", "Timesheets", "Punch List", "Inspections", "Incidents", "Instructions", "Submittals", "RFIs", "Project Map", "Transmittals", "Schedule", "Correspondence", "Action Plans", "Meetings", "Bidding", "Documents", "Coordination Issues", "Models", "Analytics", "Insights"],
    "procore_led_tools": ["Drawings", "RFIs", "Submittals", "Observations", "Daily Log", "Timesheets", "Schedule", "Correspondence", "Action Plans", "Punch List", "Inspections", "Bidding", "Equipment", "Models", "Coordination Issues", "Analytics"],
    "included_features": ["Assist", "Training Center"],
    "available_add-ons": [],
    "available_services": ["Professional Services Implementation (70 hrs.)"]
  },
  {
    "region": "APAC", "audience": "Contractor", "package_name": "Cost Management Enhanced",
    "tools": ["Documents", "Directory", "Tasks", "Conversations", "Prime Contracts", "Commitments", "Budget", "Change Events", "Invoicing", "Direct Costs", "Project Status Snapshots"],
    "procore_led_tools": ["Budget", "Prime Contracts", "Commitments", "Change Events", "Change Orders", "Invoicing", "Direct Costs"],
    "included_features": ["Assist"],
    "available_add-ons": [],
    "available_services": ["Professional Services Implementation (44 hrs.)"]
  },
  {
    "region": "APAC", "audience": "Contractor", "package_name": "Cost Management Premier",
    "tools": ["Documents", "Directory", "Tasks", "Conversations", "Prime Contracts", "Commitments", "Budget", "Change Events", "Invoicing", "Direct Costs", "Project Status Snapshots", "Estimating", "Bid Board", "Drawings", "Insights", "Analytics"],
    "procore_led_tools": ["Budget", "Prime Contracts", "Commitments", "Change Events", "Change Orders", "Invoicing", "Direct Costs", "Estimating", "Analytics"],
    "included_features": ["Assist"],
    "available_add-ons": [],
    "available_services": ["Professional Services Implementation (52 hrs.)"]
  },
  {
    "region": "APAC", "audience": "Contractor", "package_name": "Resource Management Premier",
    "tools": ["Documents", "Directory", "Tasks", "Conversations", "Project Map", "Timesheets", "Crews", "Equipment", "T&M Tickets", "Resource Tracking", "Resource Planning", "Analytics"],
    "procore_led_tools": ["Timesheets", "Crews", "Equipment", "T&M Tickets", "Resource Planning", "Analytics"],
    "included_features": [],
    "available_add-ons": [],
    "available_services": ["Professional Services Implementation (35 hrs.)"]
  },
  {
    "region": "APAC", "audience": "Owner", "package_name": "Project Execution Essentials",
    "tools": ["Directory", "Drawings", "Specifications", "Photos", "Observations", "Emails", "Schedule", "Correspondence", "Action Plans", "Meetings", "Punch List", "Inspections", "Instructions"],
    "procore_led_tools": ["Drawings", "Observations", "Punch List", "Inspections", "Correspondence", "Schedule", "Action Plans"],
    "included_features": ["Assist"],
    "available_add-ons": [],
    "available_services": ["Professional Services Implementation (25 hrs.)"]
  },
  {
    "region": "APAC", "audience": "Owner", "package_name": "Project Execution Enhanced",
    "tools": ["Directory", "Drawings", "Specifications", "Photos", "Observations", "Emails", "Schedule", "Correspondence", "Action Plans", "Meetings", "Punch List", "Inspections", "Instructions", "Submittals", "RFIs", "Daily Log", "Forms", "Project Map", "Transmittals", "Bidding"],
    "procore_led_tools": ["Drawings", "RFIs", "Submittals", "Observations", "Daily Log", "Correspondence", "Action Plans", "Bidding"],
    "included_features": ["Assist"],
    "available_add-ons": [],
    "available_services": ["Professional Services Implementation (44 hrs.)"]
  },
  {
    "region": "APAC", "audience": "Owner", "package_name": "Project Execution Enhanced w CDE",
    "tools": ["Directory", "Drawings", "Specifications", "Photos", "Observations", "Emails", "Schedule", "Correspondence", "Action Plans", "Meetings", "Punch List", "Inspections", "Instructions", "Submittals", "RFIs", "Daily Log", "Forms", "Project Map", "Transmittals", "Bidding", "Documents"],
    "procore_led_tools": ["Drawings", "RFIs", "Submittals", "Observations", "Daily Log", "Correspondence", "Action Plans", "Bidding"],
    "included_features": ["Assist"],
    "available_add-ons": [],
    "available_services": ["Professional Services Implementation (50 hrs.)"]
  },
  {
    "region": "APAC", "audience": "Owner", "package_name": "Project Execution Premier",
    "tools": ["Directory", "Drawings", "Specifications", "Photos", "Observations", "Emails", "Schedule", "Correspondence", "Action Plans", "Meetings", "Punch List", "Inspections", "Instructions", "Submittals", "RFIs", "Daily Log", "Forms", "Project Map", "Transmittals", "Bidding", "Coordination Issues", "Models", "Analytics", "Insights"],
    "procore_led_tools": ["Drawings", "RFIs", "Submittals", "Observations", "Daily Log", "Timesheets", "Schedule", "Correspondence", "Action Plans", "Punch List", "Inspections", "Bidding", "Equipment", "Models", "Coordination Issues", "Analytics"],
    "included_features": ["Assist", "Training Center"],
    "available_add-ons": [],
    "available_services": ["Professional Services Implementation (64 hrs.)"]
  },
  {
    "region": "APAC", "audience": "Owner", "package_name": "Project Execution Premier w CDE",
    "tools": ["Directory", "Drawings", "Specifications", "Photos", "Observations", "Emails", "Schedule", "Correspondence", "Action Plans", "Meetings", "Punch List", "Inspections", "Instructions", "Submittals", "RFIs", "Daily Log", "Forms", "Project Map", "Transmittals", "Bidding", "Documents", "Coordination Issues", "Models", "Analytics", "Insights"],
    "procore_led_tools": ["Drawings", "RFIs", "Submittals", "Observations", "Daily Log", "Timesheets", "Schedule", "Correspondence", "Action Plans", "Punch List", "Inspections", "Bidding", "Equipment", "Models", "Coordination Issues", "Analytics"],
    "included_features": ["Assist", "Training Center"],
    "available_add-ons": [],
    "available_services": ["Professional Services Implementation (70 hrs.)"]
  },
  {
    "region": "APAC", "audience": "Owner", "package_name": "Cost Management Enhanced",
    "tools": ["Documents", "Directory", "Tasks", "Conversations", "Prime Contracts", "Commitments", "Budget", "Change Events", "Invoicing", "Direct Costs", "Project Status Snapshots"],
    "procore_led_tools": ["Budget", "Prime Contracts", "Commitments", "Change Events", "Change Orders", "Invoicing", "Direct Costs"],
    "included_features": ["Assist"],
    "available_add-ons": [],
    "available_services": ["Professional Services Implementation (44 hrs.)"]
  },
  {
    "region": "APAC", "audience": "Owner", "package_name": "Cost Management Premier",
    "tools": ["Documents", "Directory", "Tasks", "Conversations", "Prime Contracts", "Commitments", "Budget", "Change Events", "Invoicing", "Direct Costs", "Project Status Snapshots", "Estimating", "Bid Board", "Drawings", "Insights", "Analytics"],
    "procore_led_tools": ["Budget", "Prime Contracts", "Commitments", "Change Events", "Change Orders", "Invoicing", "Direct Costs", "Estimating", "Analytics"],
    "included_features": ["Assist"],
    "available_add-ons": [],
    "available_services": []
  },
  {
    "region": "APAC", "audience": "Owner", "package_name": "Resource Management Premier",
    "tools": ["Documents", "Directory", "Tasks", "Conversations", "Project Map", "Timesheets", "Crews", "Equipment", "T&M Tickets", "Resource Tracking", "Resource Planning", "Analytics"],
    "procore_led_tools": ["Timesheets", "Crews", "Equipment", "T&M Tickets", "Resource Planning", "Analytics"],
    "included_features": [],
    "available_add-ons": [],
    "available_services": ["Professional Services Implementation (35 hrs.)"]
  },

  // -------------------------
  // EUR (Europe)
  // -------------------------
  {
    "region": "EUR", "audience": "Contractor", "package_name": "Project Execution Essentials",
    "tools": ["Directory", "Drawings", "Specifications", "RFIs", "Photos", "Observations", "Daily Log", "Forms", "Equipment", "Timesheets", "Instructions", "T&M Tickets", "Punch List", "Inspections", "Incidents", "BIM Docs Mobile"],
    "procore_led_tools": ["Drawings", "Observations", "Daily Log", "Punch List", "Inspections", "Equipment", "Timesheets"],
    "included_features": ["Assist"],
    "available_add-ons": [],
    "available_services": ["Professional Services Implementation (25 hrs.)"]
  },
  {
    "region": "EUR", "audience": "Contractor", "package_name": "Project Execution Enhanced",
    "tools": ["Directory", "Drawings", "Specifications", "RFIs", "Photos", "Observations", "Daily Log", "Forms", "Equipment", "Timesheets", "Instructions", "T&M Tickets", "Punch List", "Inspections", "Incidents", "BIM Docs Mobile", "Submittals", "Emails", "Project Map", "Transmittals", "Schedule", "Correspondence", "Action Plans", "Meetings", "Bidding"],
    "procore_led_tools": ["Drawings", "RFIs", "Submittals", "Observations", "Daily Log", "Schedule", "Correspondence", "Action Plans", "Punch List", "Inspections", "Bidding"],
    "included_features": ["Assist"],
    "available_add-ons": [],
    "available_services": ["Professional Services Implementation (44 hrs.)"]
  },
  {
    "region": "EUR", "audience": "Contractor", "package_name": "Project Execution Enhanced w PDM",
    "tools": ["Directory", "Drawings", "Specifications", "RFIs", "Photos", "Observations", "Daily Log", "Forms", "Equipment", "Timesheets", "Instructions", "T&M Tickets", "Punch List", "Inspections", "Incidents", "BIM Docs Mobile", "Submittals", "Emails", "Project Map", "Transmittals", "Schedule", "Correspondence", "Action Plans", "Meetings", "Bidding", "Documents"],
    "procore_led_tools": ["Drawings", "RFIs", "Submittals", "Observations", "Daily Log", "Schedule", "Correspondence", "Action Plans", "Punch List", "Inspections", "Bidding"],
    "included_features": ["Assist"],
    "available_add-ons": [],
    "available_services": ["Professional Services Implementation (50 hrs.)"]
  },
  {
    "region": "EUR", "audience": "Contractor", "package_name": "Project Execution Premier",
    "tools": ["Directory", "Drawings", "Specifications", "RFIs", "Photos", "Observations", "Daily Log", "Forms", "Equipment", "Timesheets", "Instructions", "T&M Tickets", "Punch List", "Inspections", "Incidents", "BIM Docs Mobile", "Submittals", "Emails", "Project Map", "Transmittals", "Schedule", "Correspondence", "Action Plans", "Meetings", "Bidding", "Coordination Issues", "Analytics", "Insights"],
    "procore_led_tools": ["Drawings", "RFIs", "Submittals", "Observations", "Daily Log", "Timesheets", "Schedule", "Correspondence", "Action Plans", "Punch List", "Inspections", "Bidding", "Equipment", "Models", "Coordination Issues", "Analytics"],
    "included_features": ["Assist", "Training Center"],
    "available_add-ons": [],
    "available_services": ["Professional Services Implementation (64 hrs.)"]
  },
  {
    "region": "EUR", "audience": "Contractor", "package_name": "Project Execution Premier w PDM",
    "tools": ["Directory", "Drawings", "Specifications", "RFIs", "Photos", "Observations", "Daily Log", "Forms", "Equipment", "Timesheets", "Instructions", "T&M Tickets", "Punch List", "Inspections", "Incidents", "BIM Docs Mobile", "Submittals", "Emails", "Project Map", "Transmittals", "Schedule", "Correspondence", "Action Plans", "Meetings", "Bidding", "Documents", "Coordination Issues", "Analytics", "Insights"],
    "procore_led_tools": ["Drawings", "RFIs", "Submittals", "Observations", "Daily Log", "Timesheets", "Schedule", "Correspondence", "Action Plans", "Punch List", "Inspections", "Bidding", "Equipment", "Models", "Coordination Issues", "Analytics"],
    "included_features": ["Assist", "Training Center"],
    "available_add-ons": [],
    "available_services": ["Professional Services Implementation (70 hrs.)"]
  },
  {
    "region": "EUR", "audience": "Contractor", "package_name": "Cost Management Enhanced",
    "tools": ["Prime Contracts", "Commitments", "Budget", "Change Events", "Invoicing", "Direct Costs"],
    "procore_led_tools": ["Budget", "Prime Contracts", "Commitments", "Change Events", "Change Orders", "Invoicing", "Direct Costs"],
    "included_features": ["Assist"],
    "available_add-ons": [],
    "available_services": ["Professional Services Implementation (44 hrs.)"]
  },
  {
    "region": "EUR", "audience": "Contractor", "package_name": "Cost Management Premier",
    "tools": ["Prime Contracts", "Commitments", "Budget", "Change Events", "Invoicing", "Direct Costs", "Estimating", "Analytics"],
    "procore_led_tools": ["Budget", "Prime Contracts", "Commitments", "Change Events", "Change Orders", "Invoicing", "Direct Costs", "Estimating", "Analytics"],
    "included_features": ["Assist"],
    "available_add-ons": [],
    "available_services": ["Professional Services Implementation (52 hrs.)"]
  },
  {
    "region": "EUR", "audience": "Contractor", "package_name": "Resource Management Premier",
    "tools": ["Documents", "Directory", "Tasks", "Conversations", "Project Map", "Timesheets", "Crews", "Equipment", "T&M Tickets", "Resource Tracking", "Resource Planning", "Analytics"],
    "procore_led_tools": ["Timesheets", "Crews", "Equipment", "T&M Tickets", "Resource Planning", "Analytics"],
    "included_features": [],
    "available_add-ons": [],
    "available_services": ["Professional Services Implementation (35 hrs.)"]
  },
  {
    "region": "EUR", "audience": "Owner", "package_name": "Project Execution Essentials",
    "tools": ["Directory", "Drawings", "Specifications", "Photos", "Observations", "Emails", "Schedule", "Correspondence", "Action Plans", "Meetings", "Punch List", "Inspections", "Instructions", "RFIs", "Submittals"],
    "procore_led_tools": ["Drawings", "Submittals", "Observations", "Punch List", "Inspections", "Correspondence", "Schedule"],
    "included_features": ["Assist"],
    "available_add-ons": [],
    "available_services": ["Professional Services Implementation (25 hrs.)"]
  },
  {
    "region": "EUR", "audience": "Owner", "package_name": "Project Execution Enhanced",
    "tools": ["Directory", "Drawings", "Specifications", "Photos", "Observations", "Emails", "Schedule", "Correspondence", "Action Plans", "Meetings", "Punch List", "Inspections", "Instructions", "RFIs", "Submittals", "Daily Log", "Forms", "Project Map", "Transmittals", "Bidding"],
    "procore_led_tools": ["Drawings", "RFIs", "Submittals", "Observations", "Daily Log", "Schedule", "Correspondence", "Action Plans", "Punch List", "Inspections", "Bidding"],
    "included_features": ["Assist"],
    "available_add-ons": [],
    "available_services": ["Professional Services Implementation (44 hrs.)"]
  },
  {
    "region": "EUR", "audience": "Owner", "package_name": "Project Execution Enhanced w CDE",
    "tools": ["Directory", "Drawings", "Specifications", "Photos", "Observations", "Emails", "Schedule", "Correspondence", "Action Plans", "Meetings", "Punch List", "Inspections", "Instructions", "RFIs", "Submittals", "Daily Log", "Forms", "Project Map", "Transmittals", "Bidding", "Documents"],
    "procore_led_tools": ["Drawings", "RFIs", "Submittals", "Observations", "Daily Log", "Schedule", "Correspondence", "Action Plans", "Punch List", "Inspections", "Bidding"],
    "included_features": ["Assist"],
    "available_add-ons": [],
    "available_services": ["Professional Services Implementation (50 hrs.)"]
  },
  {
    "region": "EUR", "audience": "Owner", "package_name": "Project Execution Premier",
    "tools": ["Directory", "Drawings", "Specifications", "Photos", "Observations", "Emails", "Schedule", "Correspondence", "Action Plans", "Meetings", "Punch List", "Inspections", "Instructions", "RFIs", "Submittals", "Daily Log", "Forms", "Project Map", "Transmittals", "Bidding", "Coordination Issues", "Models", "Analytics", "Insights"],
    "procore_led_tools": ["Drawings", "RFIs", "Submittals", "Observations", "Daily Log", "Timesheets", "Schedule", "Correspondence", "Action Plans", "Punch List", "Inspections", "Bidding", "Equipment", "Models", "Coordination Issues", "Analytics"],
    "included_features": ["Assist", "Training Center"],
    "available_add-ons": [],
    "available_services": ["Professional Services Implementation (64 hrs.)"]
  },
  {
    "region": "EUR", "audience": "Owner", "package_name": "Project Execution Premier w CDE",
    "tools": ["Directory", "Drawings", "Specifications", "Photos", "Observations", "Emails", "Schedule", "Correspondence", "Action Plans", "Meetings", "Punch List", "Inspections", "Instructions", "RFIs", "Submittals", "Daily Log", "Forms", "Project Map", "Transmittals", "Bidding", "Documents", "Coordination Issues", "Models", "Analytics", "Insights"],
    "procore_led_tools": ["Drawings", "RFIs", "Submittals", "Observations", "Daily Log", "Timesheets", "Schedule", "Correspondence", "Action Plans", "Punch List", "Inspections", "Bidding", "Equipment", "Models", "Coordination Issues", "Analytics"],
    "included_features": ["Assist", "Training Center"],
    "available_add-ons": [],
    "available_services": ["Professional Services Implementation (70 hrs.)"]
  },
  {
    "region": "EUR", "audience": "Owner", "package_name": "Cost Management Enhanced",
    "tools": ["Documents", "Directory", "Tasks", "Conversations", "Prime Contracts", "Commitments", "Budget", "Change Events", "Invoicing", "Direct Costs", "Project Status Snapshots"],
    "procore_led_tools": ["Budget", "Prime Contracts", "Commitments", "Change Events", "Change Orders", "Invoicing", "Direct Costs"],
    "included_features": ["Assist"],
    "available_add-ons": [],
    "available_services": ["Professional Services Implementation (44 hrs.)"]
  },
  {
    "region": "EUR", "audience": "Owner", "package_name": "Cost Management Premier",
    "tools": ["Documents", "Directory", "Tasks", "Conversations", "Prime Contracts", "Commitments", "Budget", "Change Events", "Invoicing", "Direct Costs", "Project Status Snapshots", "Estimating", "Bid Board", "Drawings", "Insights", "Analytics"],
    "procore_led_tools": ["Budget", "Prime Contracts", "Commitments", "Change Events", "Change Orders", "Invoicing", "Direct Costs", "Estimating", "Analytics"],
    "included_features": ["Assist"],
    "available_add-ons": [],
    "available_services": ["Professional Services Implementation (52 hrs.)"]
  },
  {
    "region": "EUR", "audience": "Owner", "package_name": "Resource Management Premier",
    "tools": ["Documents", "Directory", "Tasks", "Conversations", "Project Map", "Timesheets", "Crews", "Equipment", "T&M Tickets", "Resource Tracking", "Resource Planning", "Analytics"],
    "procore_led_tools": ["Timesheets", "Crews", "Equipment", "T&M Tickets", "Resource Planning", "Analytics"],
    "included_features": [],
    "available_add-ons": [],
    "available_services": ["Professional Services Implementation (35 hrs.)"]
  },

  // -------------------------
  // GLOBAL
  // -------------------------
  {
    "region": "Global", "audience": "Resource Management", "package_name": "Resource Tracking (ACV)",
    "tools": ["Documents", "Directory", "Tasks", "Conversations", "Project Map", "Timesheets", "Crews", "Equipment", "T&M Tickets", "Resource Tracking"],
    "procore_led_tools": ["Timesheets", "Crews", "Equipment", "T&M Tickets"],
    "included_features": ["Assist"],
    "available_add-ons": [],
    "available_services": ["Professional Services Implementation (25 hrs.)"]
  },
  {
    "region": "Global", "audience": "Resource Management", "package_name": "Resource Planning (ACV)",
    "tools": ["Documents", "Directory", "Tasks", "Conversations", "Project Map", "Equipment", "Resource Planning"],
    "procore_led_tools": ["Equipment", "Resource Planning"],
    "included_features": ["Assist"],
    "available_add-ons": [],
    "available_services": ["Professional Services Implementation (25 hrs.)"]
  },
  {
    "region": "Global", "audience": "Resource Management", "package_name": "Resource Management -Premier (ACV)",
    "tools": ["Documents", "Directory", "Tasks", "Conversations", "Project Map", "Timesheets", "Crews", "Equipment", "T&M Tickets", "Resource Tracking", "Resource Planning", "Analytics"],
    "procore_led_tools": ["Timesheets", "Crews", "Equipment", "T&M Tickets", "Resource Planning", "Analytics"],
    "included_features": ["Assist"],
    "available_add-ons": [],
    "available_services": ["Professional Services Implementation (35 hrs.)"]
  }
];
