// --- procoreverse_data_packages.js ---
// Defines all packaging, add-ons, and services by region.
// Data sourced from https://gist.githubusercontent.com/tequoya-blueprint/a16f0d5397861e035ed4f4b7/raw/a3564814cebc36b772067a0cbd543e794b374ee7/gistfile2.txt

const packagingData = [
  {
    "region": "NAMER",
    "audience": "General Contractor",
    "package_name": "Project Execution Essentials",
    "tools": [
      "Drawings",
      "Specifications",
      "Submittals",
      "RFIs",
      "Photos",
      "Observations",
      "Daily Log",
      "Emails",
      "Forms",
      "Equipment",
      "Timesheets"
    ],
    "included_features": [],
    "available_add-ons": [
      "Procore Pay",
      "Resource Tracking",
      "Resource Planning",
      "Prequalifications",
      "ERP Systems"
    ],
    "available_services": [
      "Professional Services Implementation (25 hrs.)"
    ]
  },
  {
    "region": "NAMER",
    "audience": "General Contractor",
    "package_name": "Project Execution Enhanced",
    "tools": [
      "Drawings",
      "Specifications",
      "Submittals",
      "RFIs",
      "Photos",
      "Observations",
      "Daily Log",
      "Emails",
      "Forms",
      "Equipment",
      "Timesheets",
      "Project Map",
      "Transmittals",
      "Schedule",
      "Correspondence",
      "Action Plans",
      "Meetings",
      "Punch List",
      "Inspections",
      "Incidents",
      "Bidding"
    ],
    "included_features": [
      "Assist",
      "Training Center",
      "Premier Support Bronze"
    ],
    "available_add-ons": [
      "Procore Pay",
      "Resource Tracking",
      "Resource Planning",
      "Prequalifications",
      "ERP Systems"
    ],
    "available_services": [
      "Professional Services Implementation (44 hrs.)"
    ]
  },
  {
    "region": "NAMER",
    "audience": "General Contractor",
    "package_name": "Project Execution Premier",
    "tools": [
      "Drawings",
      "Specifications",
      "Submittals",
      "RFIs",
      "Photos",
      "Observations",
      "Daily Log",
      "Emails",
      "Forms",
      "Equipment",
      "Timesheets",
      "Project Map",
      "Transmittals",
      "Schedule",
      "Correspondence",
      "Action Plans",
      "Meetings",
      "Punch List",
      "Inspections",
      "Incidents",
      "Bidding",
      "Coordination Issues",
      "Models",
      "Analytics",
      "Insights"
    ],
    "included_features": [
      "Assist",
      "Training Center"
    ],
    "available_add-ons": [
      "Procore Pay",
      "Resource Tracking",
      "Resource Planning",
      "Prequalifications",
      "ERP Systems"
    ],
    "available_services": [
      "Professional Services Implementation (64 hrs.)"
    ]
  },
  {
    "region": "NAMER",
    "audience": "General Contractor",
    "package_name": "Cost Management Enhanced",
    "tools": [
      "Documents",
      "Directory",
      "Tasks",
      "Conversations",
      "Prime Contracts",
      "Commitments",
      "Budget",
      "Change Events",
      "Invoicing",
      "Direct Costs",
      "Project Status Snapshots"
    ],
    "included_features": [
      "Assist"
    ],
    "available_add-ons": [
      "Procore Pay",
      "Resource Tracking",
      "Resource Planning",
      "ERP Systems"
    ],
    "available_services": [
      "Professional Services Implementation (32 hrs.)"
    ]
  },
  {
    "region": "NAMER",
    "audience": "General Contractor",
    "package_name": "Cost Management Premier",
    "tools": [
      "Documents",
      "Directory",
      "Tasks",
      "Conversations",
      "Prime Contracts",
      "Commitments",
      "Budget",
      "Change Events",
      "Invoicing",
      "Direct Costs",
      "Project Status Snapshots",
      "Estimating",
      "Bid Board",
      "Drawings",
      "Insights",
      "Analytics"
    ],
    "included_features": [
      "Assist"
    ],
    "available_add-ons": [
      "Procore Pay",
      "Resource Tracking",
      "Resource Planning",
      "ERP Systems"
    ],
    "available_services": [
      "Professional Services Implementation (52 hrs.)"
    ]
  },
  {
    "region": "NAMER",
    "audience": "General Contractor",
    "package_name": "Resource Management Premier",
    "tools": [
      "Documents",
      "Directory",
      "Tasks",
      "Conversations",
      "Project Map",
      "Timesheets",
      "Crews",
      "Equipment",
      "T&M Tickets",
      "Resource Tracking",
      "Resource Planning",
      "Analytics"
    ],
    "included_features": [],
    "available_add-ons": [],
    "available_services": [
      "Professional Services Implementation (35 hrs.)"
    ]
  },
  {
    "region": "NAMER",
    "audience": "Specialty Contractor",
    "package_name": "Project Execution Essentials",
    "tools": [
      "Drawings",
      "Specifications",
      "Submittals",
      "RFIs",
      "Photos",
      "Observations",
      "Daily Log",
      "Emails",
      "Forms",
      "Equipment",
      "Timesheets",
      "T&M Tickets"
    ],
    "included_features": [],
    "available_add-ons": [
      "Procore Pay",
      "Resource Tracking",
      "Resource Planning",
      "Prequalifications",
      "ERP Systems"
    ],
    "available_services": [
      "Professional Services Implementation (25 hrs.)"
    ]
  },
  {
    "region": "NAMER",
    "audience": "Specialty Contractor",
    "package_name": "Project Execution Enhanced",
    "tools": [
      "Drawings",
      "Specifications",
      "Submittals",
      "RFIs",
      "Photos",
      "Observations",
      "Daily Log",
      "Emails",
      "Forms",
      "Equipment",
      "Timesheets",
      "T&M Tickets",
      "Project Map",
      "Transmittals",
      "Schedule",
      "Correspondence",
      "Action Plans",
      "Meetings",
      "Punch List",
      "Inspections",
      "Incidents",
      "Bidding"
    ],
    "included_features": [
      "Assist"
    ],
    "available_add-ons": [
      "Procore Pay",
      "Resource Tracking",
      "Resource Planning",
      "Prequalifications",
      "ERP Systems"
    ],
    "available_services": [
      "Professional Services Implementation (44 hrs.)"
    ]
  },
  {
    "region": "NAMER",
    "audience": "Specialty Contractor",
    "package_name": "Project Execution Premier",
    "tools": [
      "Drawings",
      "Specifications",
      "Submittals",
      "RFIs",
      "Photos",
      "Observations",
      "Daily Log",
      "Emails",
      "Forms",
      "Equipment",
      "Timesheets",
      "T&M Tickets",
      "Project Map",
      "Transmittals",
      "Schedule",
      "Correspondence",
      "Action Plans",
      "Meetings",
      "Punch List",
      "Inspections",
      "Incidents",
      "Bidding",
      "Coordination Issues",
      "Models",
      "Analytics",
      "Insights"
    ],
    "included_features": [
      "Assist",
      "Training Center"
    ],
    "available_add-ons": [
      "Procore Pay",
      "Resource Tracking",
      "Resource Planning",
      "Prequalifications",
      "ERP Systems"
    ],
    "available_services": [
      "Professional Services Implementation (64 hrs.)"
    ]
  },
  {
    "region": "NAMER",
    "audience": "Specialty Contractor",
    "package_name": "Cost Management Enhanced",
    "tools": [
      "Documents",
      "Directory",
      "Tasks",
      "Conversations",
      "Prime Contracts",
      "Commitments",
      "Budget",
      "Change Events",
      "Invoicing",
      "Direct Costs",
      "Project Status Snapshots"
    ],
    "included_features": [
      "Assist"
    ],
    "available_add-ons": [
      "Procore Pay",
      "Resource Tracking",
      "Resource Planning",
      "ERP Systems"
    ],
    "available_services": [
      "Professional Services Implementation (32 hrs.)"
    ]
  },
  {
    "region": "NAMER",
    "audience": "Specialty Contractor",
    "package_name": "Cost Management Premier",
    "tools": [
      "Documents",
      "Directory",
      "Tasks",
      "Conversations",
      "Prime Contracts",
      "Commitments",
      "Budget",
      "Change Events",
      "Invoicing",
      "Direct Costs",
      "Project Status Snapshots",
      "Estimating",
      "Bid Board",
      "Drawings",
      "Insights",
      "Analytics"
    ],
    "included_features": [
      "Assist"
    ],
    "available_add-ons": [
      "Procore Pay",
      "Resource Tracking",
      "Resource Planning",
      "ERP Systems"
    ],
    "available_services": [
      "Professional Services Implementation (52 hrs.)"
    ]
  },
  {
    "region": "NAMER",
    "audience": "Specialty Contractor",
    "package_name": "Resource Management Premier",
    "tools": [
      "Documents",
      "Directory",
      "Tasks",
      "Conversations",
      "Project Map",
      "Timesheets",
      "Crews",
      "Equipment",
      "T&M Tickets",
      "Resource Tracking",
      "Resource Planning",
      "Analytics"
    ],
    "included_features": [],
    "available_add-ons": [],
    "available_services": [
      "Professional Services Implementation (35 hrs.)"
    ]
  },
  {
    "region": "NAMER",
    "audience": "Owner",
    "package_name": "Project Execution Essentials",
    "tools": [
      "Drawings",
      "Specifications",
      "Photos",
      "Observations",
      "Emails",
      "Schedule",
      "Correspondence",
      "Action Plans",
      "Meetings",
      "Punch List",
      "Inspections"
    ],
    "included_features": [],
    "available_add-ons": [
      "Procore Pay",
      "Resource Tracking",
      "Resource Planning",
      "Prequalifications",
      "ERP Systems"
    ],
    "available_services": [
      "Professional Services Implementation (25 hrs.)"
    ]
  },
  {
    "region": "NAMER",
    "audience": "Owner",
    "package_name": "Project Execution Enhanced",
    "tools": [
      "Drawings",
      "Specifications",
      "Photos",
      "Observations",
      "Emails",
      "Schedule",
      "Correspondence",
      "Action Plans",
      "Meetings",
      "Punch List",
      "Inspections",
      "Submittals",
      "RFIs",
      "Daily Log",
      "Forms",
      "Project Map",
      "Transmittals",
      "Bidding"
    ],
    "included_features": [
      "Assist"
    ],
    "available_add-ons": [
      "Procore Pay",
      "Resource Tracking",
      "Resource Planning",
      "Prequalifications",
      "ERP Systems"
    ],
    "available_services": [
      "Professional Services Implementation (44 hrs.)"
    ]
  },
  {
    "region": "NAMER",
    "audience": "Owner",
    "package_name": "Project Execution Premier",
    "tools": [
      "Drawings",
      "Specifications",
      "Photos",
      "Observations",
      "Emails",
      "Schedule",
      "Correspondence",
      "Action Plans",
      "Meetings",
      "Punch List",
      "Inspections",
      "Submittals",
      "RFIs",
      "Daily Log",
      "Forms",
      "Project Map",
      "Transmittals",
      "Bidding",
      "Coordination Issues",
      "Models",
      "Analytics",
      "Insights"
    ],
    "included_features": [
      "Assist",
      "Training Center"
    ],
    "available_add-ons": [
      "Procore Pay",
      "Resource Tracking",
      "Resource Planning",
      "Prequalifications",
      "ERP Systems"
    ],
    "available_services": [
      "Professional Services Implementation (64 hrs.)"
    ]
  },
  {
    "region": "NAMER",
    "audience": "Owner",
    "package_name": "Cost Management Enhanced",
    "tools": [
      "Documents",
      "Directory",
      "Tasks",
      "Conversations",
      "Prime Contracts",
      "Commitments",
      "Budget",
      "Change Events",
      "Invoicing",
      "Direct Costs",
      "Project Status Snapshots"
    ],
    "included_features": [
      "Assist"
    ],
    "available_add-ons": [
      "Procore Pay",
      "Resource Tracking",
      "Resource Planning",
      "ERP Systems"
    ],
    "available_services": [
      "Professional Services Implementation (32 hrs.)"
    ]
  },
  {
    "region": "NAMER",
    "audience": "Owner",
    "package_name": "Cost Management Premier",
    "tools": [
      "Documents",
      "Directory",
      "Tasks",
      "Conversations",
      "Prime Contracts",
      "Commitments",
      "Budget",
      "Change Events",
      "Invoicing",
      "Direct Costs",
      "Project Status Snapshots",
      "Estimating",
      "Bid Board",
      "Drawings",
      "Insights",
      "Analytics"
    ],
    "included_features": [
      "Assist"
    ],
    "available_add-ons": [
      "Procore Pay",
      "Resource Tracking",
      "Resource Planning",
      "ERP Systems"
    ],
    "available_services": [
      "Professional Services Implementation (52 hrs.)"
    ]
  },
  {
    "region": "NAMER",
    "audience": "Owner",
    "package_name": "Resource Management Premier",
    "tools": [
      "Documents",
      "Directory",
      "Tasks",
      "Conversations",
      "Project Map",
      "Timesheets",
      "Crews",
      "Equipment",
      "T&M Tickets",
      "Resource Tracking",
      "Resource Planning",
      "Analytics"
    ],
    "included_features": [],
    "available_add-ons": [],
    "available_services": [
      "Professional Services Implementation (35 hrs.)"
    ]
  },
  {
    "region": "NAMER",
    "audience": "Owner Developer *Coming Soon",
    "package_name": "Project Execution Enhanced",
    "tools": [
      "Documents",
      "Directory",
      "Tasks",
      "Conversations",
      "Drawings",
      "Specifications",
      "Submittals",
      "RFIs",
      "Photos",
      "Observations",
      "Daily Log",
      "Emails",
      "Forms",
      "Project Map",
      "Transmittals",
      "Instructions",
      "Schedule",
      "Correspondence",
      "Action Plans",
      "Meetings",
      "Punch List",
      "Inspections",
      "Bidding",
      "Analytics"
    ],
    "included_features": [
      "Assist"
    ],
    "available_add-ons": [
      "Procore Pay",
      "Resource Tracking",
      "Resource Planning",
      "Prequalifications",
      "ERP Systems"
    ],
    "available_services": [
      "Professional Services Implementation (65 hrs.)"
    ]
  },
  {
    "region": "NAMER",
    "audience": "Owner Developer *Coming Soon",
    "package_name": "Cost Management Enhanced",
    "tools": [
      "Documents",
      "Directory",
      "Tasks",
      "Conversations",
      "Prime Contracts",
      "Commitments",
      "Budget",
      "Change Events",
      "Invoicing",
      "Project Status Snapshots",
      "Direct Costs",
      "Analytics"
    ],
    "included_features": [
      "Assist"
    ],
    "available_add-ons": [
      "Procore Pay",
      "Resource Tracking",
      "Resource Planning",
      "Prequalifications",
      "ERP Systems"
    ],
    "available_services": [
      "Professional Services Implementation (65 hrs.)"
    ]
  },
  {
    "region": "NAMER",
    "audience": "Owner Developer *Coming Soon",
    "package_name": "Project Execution Premier",
    "tools": [
      "Documents",
      "Directory",
      "Tasks",
      "Conversations",
      "Drawings",
      "Specifications",
      "Submittals",
      "RFIs",
      "Photos",
      "Observations",
      "Daily Log",
      "Emails",
      "Forms",
      "Equipment",
      "Timesheets",
      "Project Map",
      "Transmittals",
      "T&M Tickets",
      "Schedule",
      "Correspondence",
      "Action Plans",
      "Meetings",
      "Punch List",
      "Inspections",
      "Incidents",
      "Bidding",
      "Coordination Issues",
      "Models",
      "Insights",
      "Analytics"
    ],
    "included_features": [
      "Assist",
      "Training Center",
      "Premier Support Bronze"
    ],
    "available_add-ons": [
      "Procore Pay",
      "Resource Tracking",
      "Resource Planning",
      "Prequalifications",
      "ERP Systems"
    ],
    "available_services": [
      "Professional Services Implementation (64 hrs.)"
    ]
  },
  {
    "region": "NAMER",
    "audience": "Owner Developer *Coming Soon",
    "package_name": "Cost Management Premier",
    "tools": [
      "Documents",
      "Directory",
      "Tasks",
      "Conversations",
      "Prime Contracts",
      "Commitments",
      "Budget",
      "Change Events",
      "Invoicing",
      "Project Status Snapshots",
      "Direct Costs",
      "Estimating",
      "Bid Board",
      "Insights",
      "Analytics"
    ],
    "included_features": [
      "Assist"
    ],
    "available_add-ons": [
      "Procore Pay",
      "Resource Tracking",
      "Resource Planning",
      "Prequalifications",
      "ERP Systems"
    ],
    "available_services": [
      "Professional Services Implementation (65 hrs.)"
    ]
  },
  {
    "region": "APAC",
    "audience": "Contractor",
    "package_name": "Project Execution Essentials",
    "tools": [
      "Drawings",
      "Specifications",
      "Photos",
      "Observations",
      "Daily Log",
      "Emails",
      "Forms",
      "Equipment",
      "Timesheets",
      "Punch List",
      "Inspections",
      "Incidents",
      "Instructions"
    ],
    "included_features": [],
    "available_add-ons": [],
    "available_services": [
      "Professional Services Implementation (32 hrs.)"
    ]
  },
  {
    "region": "APAC",
    "audience": "Contractor",
    "package_name": "Project Execution Enhanced",
    "tools": [
      "Drawings",
      "Specifications",
      "Photos",
      "Observations",
      "Daily Log",
      "Emails",
      "Forms",
      "Equipment",
      "Timesheets",
      "Punch List",
      "Inspections",
      "Incidents",
      "Instructions",
      "Submittals",
      "RFIs",
      "Project Map",
      "Transmittals",
      "Schedule",
      "Correspondence",
      "Action Plans",
      "Meetings",
      "Bidding"
    ],
    "included_features": [
      "Assist"
    ],
    "available_add-ons": [
      "Procore Pay",
      "Resource Tracking",
      "Resource Planning",
      "Prequalifications",
      "ERP Systems"
    ],
    "available_services": [
      "Professional Services Implementation (52 hrs.)"
    ]
  },
  {
    "region": "APAC",
    "audience": "Contractor",
    "package_name": "Project Execution Enhanced w CDE",
    "tools": [
      "Drawings",
      "Specifications",
      "Photos",
      "Observations",
      "Daily Log",
      "Emails",
      "Forms",
      "Equipment",
      "Timesheets",
      "Punch List",
      "Inspections",
      "Incidents",
      "Instructions",
      "Submittals",
      "RFIs",
      "Project Map",
      "Transmittals",
      "Schedule",
      "Correspondence",
      "Action Plans",
      "Meetings",
      "Bidding",
      "Documents"
    ],
    "included_features": [
      "Assist"
    ],
    "available_add-ons": [],
    "available_services": []
  },
  {
    "region": "APAC",
    "audience": "Contractor",
    "package_name": "Project Execution Premier",
    "tools": [
      "Drawings",
      "Specifications",
      "Photos",
      "Observations",
      "Daily Log",
      "Emails",
      "Forms",
      "Equipment",
      "Timesheets",
      "Punch List",
      "Inspections",
      "Incidents",
      "Instructions",
      "Submittals",
      "RFIs",
      "Project Map",
      "Transmittals",
      "Schedule",
      "Correspondence",
      "Action Plans",
      "Meetings",
      "Bidding",
      "Coordination Issues",
      "Models",
      "Analytics",
      "Insights"
    ],
    "included_features": [
      "Assist",
      "Training Center"
    ],
    "available_add-ons": [],
    "available_services": []
  },
  {
    "region": "APAC",
    "audience": "Contractor",
    "package_name": "Project Execution Premier w CDE",
    "tools": [
      "Drawings",
      "Specifications",
      "Photos",
      "Observations",
      "Daily Log",
      "Emails",
      "Forms",
      "Equipment",
      "Timesheets",
      "Punch List",
      "Inspections",
      "Incidents",
      "Instructions",
      "Submittals",
      "RFIs",
      "Project Map",
      "Transmittals",
      "Schedule",
      "Correspondence",
      "Action Plans",
      "Meetings",
      "Bidding",
      "Documents",
      "Coordination Issues",
      "Models",
      "Analytics",
      "Insights"
    ],
    "included_features": [
      "Assist",
      "Training Center"
    ],
    "available_add-ons": [],
    "available_services": []
  },
  {
    "region": "APAC",
    "audience": "Contractor",
    "package_name": "Cost Management Enhanced",
    "tools": [
      "Documents",
      "Directory",
      "Tasks",
      "Conversations",
      "Prime Contracts",
      "Commitments",
      "Budget",
      "Change Events",
      "Invoicing",
      "Direct Costs",
      "Project Status Snapshots"
    ],
    "included_features": [
      "Assist"
    ],
    "available_add-ons": [],
    "available_services": []
  },
  {
    "region": "APAC",
    "audience": "Contractor",
    "package_name": "Cost Management Premier",
    "tools": [
      "Documents",
      "Directory",
      "Tasks",
      "Conversations",
      "Prime Contracts",
      "Commitments",
      "Budget",
      "Change Events",
      "Invoicing",
      "Direct Costs",
      "Project Status Snapshots",
      "Estimating",
      "Bid Board",
      "Drawings",
      "Insights",
      "Analytics"
    ],
    "included_features": [
      "Assist"
    ],
    "available_add-ons": [],
    "available_services": []
  },
  {
    "region": "APAC",
    "audience": "Contractor",
    "package_name": "Resource Management Premier",
    "tools": [
      "Documents",
      "Directory",
      "Tasks",
      "Conversations",
      "Project Map",
      "Timesheets",
      "Crews",
      "Equipment",
      "T&M Tickets",
      "Resource Tracking",
      "Resource Planning",
      "Analytics"
    ],
    "included_features": [],
    "available_add-ons": [],
    "available_services": []
  },
  {
    "region": "APAC",
    "audience": "Owner",
    "package_name": "Project Execution Essentials",
    "tools": [
      "Drawings",
      "Specifications",
      "Photos",
      "Observations",
      "Emails",
      "Schedule",
      "Correspondence",
      "Action Plans",
      "Meetings",
      "Punch List",
      "Inspections",
      "Instructions"
    ],
    "included_features": [],
    "available_add-ons": [],
    "available_services": []
  },
  {
    "region": "APAC",
    "audience": "Owner",
    "package_name": "Project Execution Enhanced",
    "tools": [
      "Drawings",
      "Specifications",
      "Photos",
      "Observations",
      "Emails",
      "Schedule",
      "Correspondence",
      "Action Plans",
      "Meetings",
      "Punch List",
      "Inspections",
      "Instructions",
      "Submittals",
      "RFIs",
      "Daily Log",
      "Forms",
      "Project Map",
      "Transmittals",
      "Bidding"
    ],
    "included_features": [
      "Assist"
    ],
    "available_add-ons": [],
    "available_services": []
  },
  {
    "region": "APAC",
    "audience": "Owner",
    "package_name": "Project Execution Enhanced w CDE",
    "tools": [
      "Drawings",
      "Specifications",
      "Photos",
      "Observations",
      "Emails",
      "Schedule",
      "Correspondence",
      "Action Plans",
      "Meetings",
      "Punch List",
      "Inspections",
      "Instructions",
      "Submittals",
      "RFIs",
      "Daily Log",
      "Forms",
      "Project Map",
      "Transmittals",
      "Bidding",
      "Documents"
    ],
    "included_features": [
      "Assist"
    ],
    "available_add-ons": [],
    "available_services": []
  },
  {
    "region": "APAC",
    "audience": "Owner",
    "package_name": "Project Execution Premier",
    "tools": [
      "Drawings",
      "Specifications",
      "Photos",
      "Observations",
      "Emails",
      "Schedule",
      "Correspondence",
      "Action Plans",
      "Meetings",
      "Punch List",
      "Inspections",
      "Instructions",
      "Submittals",
      "RFIs",
      "Daily Log",
      "Forms",
      "Project Map",
      "Transmittals",
      "Bidding",
      "Coordination Issues",
      "Models",
      "Analytics",
      "Insights"
    ],
    "included_features": [
      "Assist",
      "Training Center"
    ],
    "available_add-ons": [],
    "available_services": []
  },
  {
    "region": "APAC",
    "audience": "Owner",
    "package_name": "Project Execution Premier w CDE",
    "tools": [
      "Drawings",
      "Specifications",
      "Photos",
      "Observations",
      "Emails",
      "Schedule",
      "Correspondence",
      "Action Plans",
      "Meetings",
      "Punch List",
      "Inspections",
      "Instructions",
      "Submittals",
      "RFIs",
      "Daily Log",
      "Forms",
      "Project Map",
      "Transmittals",
      "Bidding",
      "Documents",
      "Coordination Issues",
      "Models",
      "Analytics",
      "Insights"
    ],
    "included_features": [
      "Assist",
      "Training Center"
    ],
    "available_add-ons": [],
    "available_services": []
  },
  {
    "region": "APAC",
    "audience": "Owner",
    "package_name": "Cost Management Enhanced",
    "tools": [
      "Documents",
      "Directory",
      "Tasks",
      "Conversations",
      "Prime Contracts",
      "Commitments",
      "Budget",
      "Change Events",
      "Invoicing",
      "Direct Costs",
      "Project Status Snapshots"
    ],
    "included_features": [
      "Assist"
    ],
    "available_add-ons": [],
    "available_services": []
  },
  {
    "region": "APAC",
    "audience": "Owner",
    "package_name": "Cost Management Premier",
    "tools": [
      "Documents",
      "Directory",
      "Tasks",
      "Conversations",
      "Prime Contracts",
      "Commitments",
      "Budget",
      "Change Events",
      "Invoicing",
      "Direct Costs",
      "Project Status Snapshots",
      "Estimating",
      "Bid Board",
      "Drawings",
      "Insights",
      "Analytics"
    ],
    "included_features": [
      "Assist"
    ],
    "available_add-ons": [],
    "available_services": []
  },
  {
    "region": "APAC",
    "audience": "Owner",
    "package_name": "Resource Management Premier",
    "tools": [
      "Documents",
      "Directory",
      "Tasks",
      "Conversations",
      "Project Map",
      "Timesheets",
      "Crews",
      "Equipment",
      "T&M Tickets",
      "Resource Tracking",
      "Resource Planning",
      "Analytics"
    ],
    "included_features": [],
    "available_add-ons": [],
    "available_services": []
  },
  {
    "region": "EUR",
    "audience": "Contractor",
    "package_name": "Project Execution Essentials",
    "tools": [
      "Drawings",
      "Specifications",
      "RFIs",
      "Photos",
      "Observations",
      "Daily Log",
      "Forms",
      "Equipment",
      "Timesheets",
      "Instructions",
      "T&M Tickets",
      "Punch List",
      "Inspections",
      "Incidents",
      "Models"
    ],
    "included_features": [],
    "available_add-ons": [],
    "available_services": []
  },
  {
    "region": "EUR",
    "audience": "Contractor",
    "package_name": "Project Execution Enhanced",
    "tools": [
      "Drawings",
      "Specifications",
      "RFIs",
      "Photos",
      "Observations",
      "Daily Log",
      "Forms",
      "Equipment",
      "Timesheets",
      "Instructions",
      "T&M Tickets",
      "Punch List",
      "Inspections",
      "Incidents",
      "Models",
      "Submittals",
      "Emails",
      "Project Map",
      "Transmittals",
      "Schedule",
      "Correspondence",
      "Action Plans",
      "Meetings",
      "Bidding"
    ],
    "included_features": [
      "Assist"
    ],
    "available_add-ons": [],
    "available_services": []
  },
  {
    "region": "EUR",
    "audience": "Contractor",
    "package_name": "Project Execution Enhanced w PDM",
    "tools": [
      "Drawings",
      "Specifications",
      "RFIs",
      "Photos",
      "Observations",
      "Daily Log",
      "Forms",
      "Equipment",
      "Timesheets",
      "Instructions",
      "T&M Tickets",
      "Punch List",
      "Inspections",
      "Incidents",
      "Models",
      "Submittals",
      "Emails",
      "Project Map",
      "Transmittals",
      "Schedule",
      "Correspondence",
      "Action Plans",
      "Meetings",
      "Bidding",
      "Documents"
    ],
    "included_features": [
      "Assist"
    ],
    "available_add-ons": [],
    "available_services": []
  },
  {
    "region": "EUR",
    "audience": "Contractor",
    "package_name": "Project Execution Premier",
    "tools": [
      "Drawings",
      "Specifications",
      "RFIs",
      "Photos",
      "Observations",
      "Daily Log",
      "Forms",
      "Equipment",
      "Timesheets",
      "Instructions",
      "T&M Tickets",
      "Punch List",
      "Inspections",
      "Incidents",
      "Models",
      "Submittals",
      "Emails",
      "Project Map",
      "Transmittals",
      "Schedule",
      "Correspondence",
      "Action Plans",
      "Meetings",
      "Bidding",
      "Coordination Issues",
      "Analytics",
      "Insights"
    ],
    "included_features": [
      "Assist",
      "Training Center"
    ],
    "available_add-ons": [],
    "available_services": []
  },
  {
    "region": "EUR",
    "audience": "Contractor",
    "package_name": "Project Execution Premier w PDM",
    "tools": [
      "Drawings",
      "Specifications",
      "RFIs",
      "Photos",
      "Observations",
      "Daily Log",
      "Forms",
      "Equipment",
      "Timesheets",
      "Instructions",
      "T&M Tickets",
      "Punch List",
      "Inspections",
      "Incidents",
      "Models",
      "Submittals",
      "Emails",
      "Project Map",
      "Transmittals",
      "Schedule",
      "Correspondence",
      "Action Plans",
      "Meetings",
      "Bidding",
      "Documents",
      "Coordination Issues",
      "Analytics",
      "Insights"
    ],
    "included_features": [
      "Assist",
      "Training Center"
    ],
    "available_add-ons": [],
    "available_services": []
  },
  {
    "region": "EUR",
    "audience": "Contractor",
    "package_name": "Cost Management Enhanced",
    "tools": [
      "Prime Contracts",
      "Commitments",
      "Budget",
      "Change Events",
      "Invoicing",
      "Direct Costs"
    ],
    "included_features": [],
    "available_add-ons": [],
    "available_services": []
  },
  {
    "region": "EUR",
    "audience": "Contractor",
    "package_name": "Cost Management Premier",
    "tools": [
      "Prime Contracts",
      "Commitments",
      "Budget",
      "Change Events",
      "Invoicing",
      "Direct Costs",
      "Estimating",
      "Analytics"
    ],
    "included_features": [],
    "available_add-ons": [],
    "available_services": []
  },
  {
    "region": "EUR",
    "audience": "Contractor",
    "package_name": "Resource Management Premier",
    "tools": [
      "Documents",
      "Directory",
      "Tasks",
      "Conversations",
      "Project Map",
      "Timesheets",
      "Crews",
      "Equipment",
      "T&M Tickets",
      "Resource Tracking",
      "Resource Planning",
      "Analytics"
    ],
    "included_features": [],
    "available_add-ons": [],
    "available_services": []
  },
  {
    "region": "EUR",
    "audience": "Owner",
    "package_name": "Project Execution Essentials",
    "tools": [
      "Drawings",
      "Specifications",
      "Photos",
      "Observations",
      "Emails",
      "Schedule",
      "Correspondence",
      "Action Plans",
      "Meetings",
      "Punch List",
      "Inspections",
      "Instructions"
    ],
    "included_features": [],
    "available_add-ons": [],
    "available_services": []
  },
  {
    "region": "EUR",
    "audience": "Owner",
    "package_name": "Project Execution Enhanced",
    "tools": [
      "Drawings",
      "Specifications",
      "Photos",
      "Observations",
      "Emails",
      "Schedule",
      "Correspondence",
      "Action Plans",
      "Meetings",
      "Punch List",
      "Inspections",
      "Instructions",
      "Submittals",
      "RFIs",
      "Daily Log",
      "Forms",
      "Project Map",
      "Transmittals",
      "Bidding"
    ],
    "included_features": [
      "Assist"
    ],
    "available_add-ons": [],
    "available_services": []
  },
  {
    "region": "EUR",
    "audience": "Owner",
    "package_name": "Project Execution Enhanced w CDE",
    "tools": [
      "Drawings",
      "Specifications",
      "Photos",
      "Observations",
      "Emails",
      "Schedule",
      "Correspondence",
      "Action Plans",
      "Meetings",
      "Punch List",
      "Inspections",
      "Instructions",
      "Submittals",
      "RFIs",
      "Daily Log",
      "Forms",
      "Project Map",
      "Transmittals",
      "Bidding",
      "Documents"
    ],
    "included_features": [
      "Assist"
    ],
    "available_add-ons": [],
    "available_services": []
  },
  {
    "region": "EUR",
    "audience": "Owner",
    "package_name": "Project Execution Premier",
    "tools": [
      "Drawings",
      "Specifications",
      "Photos",
      "Observations",
      "Emails",
      "Schedule",
      "Correspondence",
      "Action Plans",
      "Meetings",
      "Punch List",
      "Inspections",
      "Instructions",
      "Submittals",
      "RFIs",
      "Daily Log",
      "Forms",
      "Project Map",
      "Transmittals",
      "Bidding",
      "Coordination Issues",
      "Models",
      "Analytics",
      "Insights"
    ],
    "included_features": [
      "Assist",
      "Training Center"
    ],
    "available_add-ons": [],
    "available_services": []
  },
  {
    "region": "EUR",
    "audience": "Owner",
    "package_name": "Project Execution Premier w CDE",
    "tools": [
      "Drawings",
      "Specifications",
      "Photos",
      "Observations",
      "Emails",
      "Schedule",
      "Correspondence",
      "Action Plans",
      "Meetings",
      "Punch List",
      "Inspections",
      "Instructions",
      "Submittals",
      "RFIs",
      "Daily Log",
      "Forms",
      "Project Map",
      "Transmittals",
      "Bidding",
      "Documents",
      "Coordination Issues",
      "Models",
      "Analytics",
      "Insights"
    ],
    "included_features": [
      "Assist",
      "Training Center"
    ],
    "available_add-ons": [],
    "available_services": []
  },
  {
    "region": "EUR",
    "audience": "Owner",
    "package_name": "Cost Management Enhanced",
    "tools": [
      "Documents",
      "Directory",
      "Tasks",
      "Conversations",
      "Prime Contracts",
      "Commitments",
      "Budget",
      "Change Events",
      "Invoicing",
      "Direct Costs",
      "Project Status Snapshots"
    ],
    "included_features": [
      "Assist"
    ],
    "available_add-ons": [],
    "available_services": []
  },
  {
    "region": "EUR",
    "audience": "Owner",
    "package_name": "Cost Management Premier",
    "tools": [
      "Documents",
      "Directory",
      "Tasks",
      "Conversations",
      "Prime Contracts",
      "Commitments",
      "Budget",
      "Change Events",
      "Invoicing",
      "Direct Costs",
      "Project Status Snapshots",
      "Estimating",
      "Bid Board",
      "Drawings",
      "Insights",
      "Analytics"
    ],
    "included_features": [
      "Assist"
    ],
    "available_add-ons": [],
    "available_services": []
  },
  {
    "region": "EUR",
    "audience": "Owner",
    "package_name": "Resource Management Premier",
    "tools": [
      "Documents",
      "Directory",
      "Tasks",
      "Conversations",
      "Project Map",
      "Timesheets",
      "Crews",
      "Equipment",
      "T&M Tickets",
      "Resource Tracking",
      "Resource Planning",
      "Analytics"
    ],
    "included_features": [],
    "available_add-ons": [],
    "available_services": []
  },
  {
    "region": "Global",
    "audience": "Resource Management",
    "package_name": "Resource Tracking (ACV)",
    "tools": [
      "Documents",
      "Directory",
      "Tasks",
      "Conversations",
      "Assist",
      "Project Map",
      "Timesheets",
      "Crews",
      "Equipment",
      "T&M Tickets",
      "Resource Tracking"
    ],
    "included_features": [
      "Assist"
    ],
    "available_add-ons": [],
    "available_services": []
  },
  {
    "region": "Global",
    "audience": "Resource Management",
    "package_name": "Resource Planning (ACV)",
    "tools": [
      "Documents",
      "Directory",
      "Tasks",
      "Conversations",
      "Assist",
      "Project Map",
      "Equipment",
      "Resource Planning"
    ],
    "included_features": [
      "Assist"
    ],
    "available_add-ons": [],
    "available_services": []
  },
  {
    "region": "Global",
    "audience": "Resource Management",
    "package_name": "Resource Management -Premier (ACV)",
    "tools": [
      "Documents",
      "Directory",
      "Tasks",
      "Conversations",
      "Assist",
      "Project Map",
      "Timesheets",
      "Crews",
      "Equipment",
      "T&M Tickets",
      "Resource Tracking",
      "Resource Planning",
      "Analytics"
    ],
    "included_features": [
      "Assist"
    ],
    "available_add-ons": [],
    "available_services": []
  }
];
