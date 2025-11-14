// --- procoreverse_data_packages.js ---
// Defines all packaging, add-ons, and services by region.
// Data sourced from https://gist.githubusercontent.com/tequoya-blueprint/a16f0d5397861e035ed4f4b7/raw/a3564814cebc36b772067a0cbd543e794b374ee7/gistfile2.txt

const packagingData = {
  "NAM": {
    "GC": {
      "Project Execution Essentials": {
        "tools": ["Drawings", "RFIs", "Submittals", "Daily Log", "Photos", "Inspections", "Observations", "Punch List", "Documents", "Specifications", "Directory", "Admin", "My-Tasks", "Home", "Reporting"],
        "services": ["Assist", "Training Center", "Premier Support Bronze"],
        "addOns": ["BIM", "Coordination Issues", "Schedule", "Forms", "Action Plans", "Correspondence", "Meetings", "Transmittals"]
      },
      "Project Management Essentials": {
        "tools": ["Drawings", "RFIs", "Submittals", "Daily Log", "Photos", "Inspections", "Observations", "Punch List", "Documents", "Specifications", "Directory", "Admin", "My-Tasks", "Home", "Reporting", "Prime Contract", "Commitments", "Change Events", "Change Orders", "Budget", "Invoicing", "T&M Tickets", "Schedule", "Meetings"],
        "services": ["Assist", "Training Center", "Premier Support Bronze"],
        "addOns": ["BIM", "Coordination Issues", "Forms", "Action Plans", "Correspondence", "Transmittals", "Direct Costs", "Estimating", "Bid Management", "Prequalification", "Procore Pay", "Analytics"]
      },
      "Project Management": {
        "tools": ["Drawings", "RFIs", "Submittals", "Daily Log", "Photos", "Inspections", "Observations", "Punch List", "Documents", "Specifications", "Directory", "Admin", "My-Tasks", "Home", "Reporting", "Prime Contract", "Commitments", "Change Events", "Change Orders", "Budget", "Invoicing", "T&M Tickets", "Schedule", "Meetings", "Forms", "Action Plans", "Correspondence", "Transmittals", "Analytics"],
        "services": ["Assist", "Training Center", "Premier Support Bronze"],
        "addOns": ["BIM", "Coordination Issues", "Direct Costs", "Estimating", "Bid Management", "Prequalification", "Procore Pay"]
      },
      "Project Management Plus": {
        "tools": ["Drawings", "RFIs", "Submittals", "Daily Log", "Photos", "Inspections", "Observations", "Punch List", "Documents", "Specifications", "Directory", "Admin", "My-Tasks", "Home", "Reporting", "Prime Contract", "Commitments", "Change Events", "Change Orders", "Budget", "Invoicing", "T&M Tickets", "Schedule", "Meetings", "Forms", "Action Plans", "Correspondence", "Transmittals", "Analytics", "BIM", "Coordination Issues", "Estimating", "Bid Management", "Prequalification"],
        "services": ["Assist", "Training Center", "Premier Support Bronze"],
        "addOns": ["Direct Costs", "Procore Pay"]
      }
    },
    "SC": {
      "Project Execution Essentials": {
        "tools": ["Drawings", "RFIs", "Submittals", "Daily Log", "Photos", "Inspections", "Observations", "Punch List", "Documents", "Specifications", "Directory", "Admin", "My-Tasks", "Home", "Reporting", "T&M Tickets", "Correspondence", "Schedule", "Forms"],
        "services": ["Assist", "Training Center", "Premier Support Bronze"],
        "addOns": ["BIM", "Coordination Issues", "Action Plans", "Meetings", "Transmittals", "Crews", "Timesheets", "MyTime", "Field Productivity", "Equipment", "Workforce Planning"]
      },
      "Project Management Essentials": {
        "tools": ["Drawings", "RFIs", "Submittals", "Daily Log", "Photos", "Inspections", "Observations", "Punch List", "Documents", "Specifications", "Directory", "Admin", "My-Tasks", "Home", "Reporting", "T&M Tickets", "Correspondence", "Schedule", "Forms", "Prime Contract", "Commitments", "Change Events", "Change Orders", "Budget", "Invoicing", "Meetings"],
        "services": ["Assist", "Training Center", "Premier Support Bronze"],
        "addOns": ["BIM", "Coordination Issues", "Action Plans", "Transmittals", "Direct Costs", "Estimating", "Bid Management", "Procore Pay", "Analytics", "Crews", "Timesheets", "MyTime", "Field Productivity", "Equipment", "Workforce Planning"]
      },
      "Financial Management Essentials": {
        "tools": ["Drawings", "RFIs", "Submittals", "Daily Log", "Photos", "Inspections", "Observations", "Punch List", "Documents", "Specifications", "Directory", "Admin", "My-Tasks", "Home", "Reporting", "T&M Tickets", "Correspondence", "Schedule", "Forms", "Prime Contract", "Commitments", "Change Events", "Change Orders", "Budget", "Invoicing", "Meetings", "Direct Costs", "Estimating", "Bid Management", "Procore Pay", "Analytics"],
        "services": ["Assist", "Training Center", "Premier Support Bronze"],
        "addOns": ["BIM", "Coordination Issues", "Action Plans", "Transmittals", "Crews", "Timesheets", "MyTime", "Field Productivity", "Equipment", "Workforce Planning"]
      }
    },
    "O": {
      "Owner Essentials": {
        "tools": ["Drawings", "RFIs", "Submittals", "Photos", "Inspections", "Observations", "Punch List", "Documents", "Specifications", "Directory", "Admin", "My-Tasks", "Home", "Reporting", "Prime Contract", "Commitments", "Change Events", "Change Orders", "Budget", "Invoicing", "Schedule", "Meetings", "Correspondence", "Transmittals", "Analytics", "Bid Management", "Prequalification"],
        "services": ["Assist", "Training Center", "Premier Support Bronze"],
        "addOns": ["BIM", "Coordination Issues", "Estimating"]
      }
    }
  },
  "EMEA": {
    "GC": {
      "Project Execution Essentials": {
        "tools": ["Drawings", "RFIs", "Submittals", "Daily Log", "Photos", "Inspections", "Observations", "Punch List", "Documents", "Specifications", "Directory", "Admin", "My-Tasks", "Home", "Reporting"],
        "services": ["Assist", "Training Center", "Premier Support Bronze"],
        "addOns": ["BIM", "Coordination Issues", "Schedule", "Forms", "Action Plans", "Correspondence", "Meetings", "Transmittals"]
      },
      "Project Management Essentials": {
        "tools": ["Drawings", "RFIs", "Submittals", "Daily Log", "Photos", "Inspections", "Observations", "Punch List", "Documents", "Specifications", "Directory", "Admin", "My-Tasks", "Home", "Reporting", "Prime Contract", "Commitments", "Change Events", "Change Orders", "Budget", "Invoicing", "T&M Tickets", "Schedule", "Meetings"],
        "services": ["Assist", "Training Center", "Premier Support Bronze"],
        "addOns": ["BIM", "Coordination Issues", "Forms", "Action Plans", "Correspondence", "Transmittals", "Direct Costs", "Estimating", "Bid Management", "Prequalification", "Procore Pay", "Analytics"]
      },
      "Project Management": {
        "tools": ["Drawings", "RFIs", "Submittals", "Daily Log", "Photos", "Inspections", "Observations", "Punch List", "Documents", "Specifications", "Directory", "Admin", "My-Tasks", "Home", "Reporting", "Prime Contract", "Commitments", "Change Events", "Change Orders", "Budget", "Invoicing", "T&M Tickets", "Schedule", "Meetings", "Forms", "Action Plans", "Correspondence", "Transmittals", "Analytics"],
        "services": ["Assist", "Training Center", "Premier Support Bronze"],
        "addOns": ["BIM", "Coordination Issues", "Direct Costs", "Estimating", "Bid Management", "Prequalification", "Procore Pay"]
      },
      "Project Management Plus": {
        "tools": ["Drawings", "RFIs", "Submittals", "Daily Log", "Photos", "Inspections", "Observations", "Punch List", "Documents", "Specifications", "Directory", "Admin", "My-Tasks", "Home", "Reporting", "Prime Contract", "Commitments", "Change Events", "Change Orders", "Budget", "Invoicing", "T&M Tickets", "Schedule", "Meetings", "Forms", "Action Plans", "Correspondence", "Transmittals", "Analytics", "BIM", "Coordination Issues", "Estimating", "Bid Management", "Prequalification"],
        "services": ["Assist", "Training Center", "Premier Support Bronze"],
        "addOns": ["Direct Costs", "Procore Pay"]
      }
    },
    "SC": {
      "Project Execution Essentials": {
        "tools": ["Drawings", "RFIs", "Submittals", "Daily Log", "Photos", "Inspections", "Observations", "Punch List", "Documents", "Specifications", "Directory", "Admin", "My-Tasks", "Home", "Reporting", "T&M Tickets", "Correspondence", "Schedule", "Forms"],
        "services": ["Assist", "Training Center", "Premier Support Bronze"],
        "addOns": ["BIM", "Coordination Issues", "Action Plans", "Meetings", "Transmittals", "Crews", "Timesheets", "MyTime", "Field Productivity", "Equipment", "Workforce Planning"]
      },
      "Project Management Essentials": {
        "tools": ["Drawings", "RFIs", "Submittals", "Daily Log", "Photos", "Inspections", "Observations", "Punch List", "Documents", "Specifications", "Directory", "Admin", "My-Tasks", "Home", "Reporting", "T&M Tickets", "Correspondence", "Schedule", "Forms", "Prime Contract", "Commitments", "Change Events", "Change Orders", "Budget", "Invoicing", "Meetings"],
        "services": ["Assist", "Training Center", "Premier Support Bronze"],
        "addOns": ["BIM", "Coordination Issues", "Action Plans", "Transmittals", "Direct Costs", "Estimating", "Bid Management", "Procore Pay", "Analytics", "Crews", "Timesheets", "MyTime", "Field Productivity", "Equipment", "Workforce Planning"]
      }
    },
    "O": {
       "Owner Essentials": {
        "tools": ["Drawings", "RFIs", "Submittals", "Photos", "Inspections", "Observations", "Punch List", "Documents", "Specifications", "Directory", "Admin", "My-Tasks", "Home", "Reporting", "Prime Contract", "Commitments", "Change Events", "Change Orders", "Budget", "Invoicing", "Schedule", "Meetings", "Correspondence", "Transmittals", "Analytics", "Bid Management", "Prequalification"],
        "services": ["Assist", "Training Center", "Premier Support Bronze"],
        "addOns": ["BIM", "Coordination Issues", "Estimating"]
      }
    }
  },
  "APAC": {
    "GC": {
      "Project Execution Essentials": {
        "tools": ["Drawings", "RFIs", "Submittals", "Daily Log", "Photos", "Inspections", "Observations", "Punch List", "Documents", "Specifications", "Directory", "Admin", "My-Tasks", "Home", "Reporting"],
        "services": ["Assist", "Training Center", "Premier Support Bronze"],
        "addOns": ["BIM", "Coordination Issues", "Schedule", "Forms", "Action Plans", "Correspondence", "Meetings", "Transmittals"]
      },
      "Project Management Essentials": {
        "tools": ["Drawings", "RFIs", "Submittals", "Daily Log", "Photos", "Inspections", "Observations", "Punch List", "Documents", "Specifications", "Directory", "Admin", "My-Tasks", "Home", "Reporting", "Prime Contract", "Commitments", "Change Events", "Change Orders", "Budget", "Invoicing", "T&M Tickets", "Schedule", "Meetings"],
        "services": ["Assist", "Training Center", "Premier Support Bronze"],
        "addOns": ["BIM", "Coordination Issues", "Forms", "Action Plans", "Correspondence", "Transmittals", "Direct Costs", "Estimating", "Bid Management", "Prequalification", "Procore Pay", "Analytics"]
      },
      "Project Management": {
        "tools": ["Drawings", "RFIs", "Submittals", "Daily Log", "Photos", "Inspections", "Observations", "Punch List", "Documents", "Specifications", "Directory", "Admin", "My-Tasks", "Home", "Reporting", "Prime Contract", "Commitments", "Change Events", "Change Orders", "Budget", "Invoicing", "T&M Tickets", "Schedule", "Meetings", "Forms", "Action Plans", "Correspondence", "Transmittals", "Analytics"],
        "services": ["Assist", "Training Center", "Premier Support Bronze"],
        "addOns": ["BIM", "Coordination Issues", "Direct Costs", "Estimating", "Bid Management", "Prequalification", "Procore Pay"]
      },
      "Project Management Plus": {
        "tools": ["Drawings", "RFIs", "Submittals", "Daily Log", "Photos", "Inspections", "Observations", "Punch List", "Documents", "Specifications", "Directory", "Admin", "My-Tasks", "Home", "Reporting", "Prime Contract", "Commitments", "Change Events", "Change Orders", "Budget", "Invoicing", "T&M Tickets", "Schedule", "Meetings", "Forms", "Action Plans", "Correspondence", "Transmittals", "Analytics", "BIM", "Coordination Issues", "Estimating", "Bid Management", "Prequalification"],
        "services": ["Assist", "Training Center", "Premier Support Bronze"],
        "addOns": ["Direct Costs", "Procore Pay"]
      }
    },
    "SC": {
       "Project Execution Essentials": {
        "tools": ["Drawings", "RFIs", "Submittals", "Daily Log", "Photos", "Inspections", "Observations", "Punch List", "Documents", "Specifications", "Directory", "Admin", "My-Tasks", "Home", "Reporting", "T&M Tickets", "Correspondence", "Schedule", "Forms"],
        "services": ["Assist", "Training Center", "Premier Support Bronze"],
        "addOns": ["BIM", "Coordination Issues", "Action Plans", "Meetings", "Transmittals", "Crews", "Timesheets", "MyTime", "Field Productivity", "Equipment", "Workforce Planning"]
      }
    },
    "O": {
       "Owner Essentials": {
        "tools": ["Drawings", "RFIs", "Submittals", "Photos", "Inspections", "Observations", "Punch List", "Documents", "Specifications", "Directory", "Admin", "My-Tasks", "Home", "Reporting", "Prime Contract", "Commitments", "Change Events", "Change Orders", "Budget", "Invoicing", "Schedule", "Meetings", "Correspondence", "Transmittals", "Analytics", "Bid Management", "Prequalification"],
        "services": ["Assist", "Training Center", "Premier Support Bronze"],
        "addOns": ["BIM", "Coordination Issues", "Estimating"]
      }
    }
  }
};
