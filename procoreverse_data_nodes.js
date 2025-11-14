// --- procoreverse_data_nodes.js ---
// Defines all tools (nodes) in the visualization.

const nodesData = [
  // --- Platform & Core ---
  {
    "id": "Documents",
    "group": "Platform & Core",
    "level": "Project",
    "description": "Centralized repository for all project documents, including plans, specs, and photos.",
    "personas": ["pm", "super", "fm", "owner", "sub", "design"],
    "audience": ["GC", "SC", "O"],
    "supportUrl": "https://support.procore.com/products/procore-project-documents"
  },
  {
    "id": "Drawings",
    "group": "Platform & Core",
    "level": "Project",
    "description": "Ensures the team works from the latest plans with version control, markups, and linking.",
    "personas": ["pm", "super", "owner", "sub", "design"],
    "audience": ["GC", "SC", "O"],
    "supportUrl": "https://support.procore.com/products/procore-project-drawings"
  },
  {
    "id": "Specifications",
    "group": "Platform & Core",
    "level": "Project",
    "description": "Stores and manages the project's technical specifications with versioning and search.",
    "personas": ["pm", "super", "sub", "design"],
    "audience": ["GC", "SC", "O"],
    "supportUrl": "httpss://support.procore.com/products/procore-project-specifications"
  },
  {
    "id": "Directory",
    "group": "Platform & Core",
    "level": "Company",
    "description": "Central contact list and permissions management for all users and companies.",
    "personas": ["pm", "fm", "super", "owner", "sub", "design"],
    "audience": ["GC", "SC", "O"],
    "supportUrl": "https://support.procore.com/products/procore-company-directory"
  },
  {
    "id": "Admin",
    "group": "Platform & Core",
    "level": "Company",
    "description": "Manages company-level settings, tool configurations, templates, and permissions.",
    "personas": ["admin"],
    "audience": ["GC", "SC", "O"],
    "supportUrl": "https://support.procore.com/products/procore-company-admin"
  },
  {
    "id": "Forms",
    "group": "Platform & Core",
    "level": "Project",
    "description": "Digital custom project forms (checklists, reports) for field and office use.",
    "personas": ["super", "pm", "sub"],
    "audience": ["GC", "SC", "O"],
    "supportUrl": "httpss://support.procore.com/products/procore-project-forms"
  },
  {
    "id": "Photos",
    "group": "Platform & Core",
    "level": "Project",
    "description": "Central repository for all jobsite photos, linkable to other tools and drawings.",
    "personas": ["pm", "super", "owner", "sub", "design"],
    "audience": ["GC", "SC", "O"],
    "supportUrl": "httpss://support.procore.com/products/procore-project-photos"
  },
  {
    "id": "Workflows",
    "group": "Platform & Core",
    "level": "Company",
    "description": "Custom approval workflows for various tools (e.g., Submittals, Invoicing, RFIs).",
    "personas": ["pm", "fm", "admin"],
    "audience": ["GC", "SC", "O"],
    "supportUrl": "httpss://support.procore.com/products/procore-company-workflows"
  },
  {
    "id": "Custom Tools",
    "group": "Platform & Core",
    "level": "Project",
    "description": "Build custom tools and applications within the Procore platform to meet unique needs.",
    "personas": ["admin", "pm"],
    "audience": ["GC", "SC", "O"],
    "supportUrl": "httpss://support.procore.com/products/procore-project-custom-tools"
  },
  {
    "id": "Procore Sync",
    "group": "Platform & Core",
    "level": "Company",
    "description": "Desktop application for syncing files between your computer and Procore Documents.",
    "personas": ["pm", "super", "design"],
    "audience": ["GC", "SC", "O"],
    "supportUrl": "https://support.procore.com/products/procore-procore-sync"
  },
  {
    "id": "My-Tasks",
    "group": "Platform & Core",
    "level": "Project",
    "description": "A personal dashboard aggregating all assigned tasks (e.g., from Observations, Punch) for a user.",
    "personas": ["pm", "super", "sub", "design"],
    "audience": ["GC", "SC", "O"],
    "supportUrl": "https://support.procore.com/products/procore-project-tasks"
  },

  // --- Project Management ---
  {
    "id": "Daily Log",
    "group": "Project Management",
    "level": "Project",
    "description": "Daily diary for the jobsite: manpower, weather, notes, equipment, and incidents.",
    "personas": ["super", "pm", "sub"],
    "audience": ["GC", "SC"],
    "supportUrl": "https://support.procore.com/products/procore-project-daily-log"
  },
  {
    "id": "RFIs",
    "group": "Project Management",
    "level": "Project",
    "description": "Manages Requests for Information to clarify plans and resolve issues.",
    "personas": ["pm", "super", "owner", "sub", "design"],
    "audience": ["GC", "SC", "O"],
    "supportUrl": "httpss://support.procore.com/products/procore-project-rfis"
  },
  {
    "id": "Submittals",
    "group": "Project Management",
    "level": "Project",
    "description": "Manages the review and approval process for project submittals (e.g., shop drawings, materials).",
    "personas": ["pm", "super", "owner", "sub", "design"],
    "audience": ["GC", "SC", "O"],
    "supportUrl": "https://support.procore.com/products/procore-project-submittals"
  },
  {
    "id": "Meetings",
    "group": "Project Management",
    "level": "Project",
    "description": "Organizes meetings, tracks attendance, assigns action items, and distributes minutes.",
    "personas": ["pm", "super", "owner", "sub", "design"],
    "audience": ["GC", "SC", "O"],
    "supportUrl": "https://support.procore.com/products/procore-project-meetings"
  },
  {
    "id": "Schedule",
    "group": "Project Management",
    "level": "Project",
    "description": "Manages the project schedule, tracks progress, and links tasks to other items.",
    "personas": ["pm", "super", "owner", "sub"],
    "audience": ["GC", "SC", "O"],
    "supportUrl": "httpss://support.procore.com/products/procore-project-schedule"
  },
  {
    "id": "Correspondence",
    "group": "Project Management",
    "level": "Project",
    "description": "Central hub for managing all formal project communications and tracking threads.",
    "personas": ["pm", "super", "owner", "sub", "design"],
    "audience": ["GC", "SC", "O"],
    "supportUrl": "httpss://support.procore.com/products/procore-project-correspondence"
  },
  {
    "id": "Transmittals",
    "group": "Project Management",
    "level": "Project",
    "description": "Create and track transmittals for sending documents to project stakeholders.",
    "personas": ["pm", "design"],
    "audience": ["GC", "SC", "O"],
    "supportUrl": "httpss://support.procore.com/products/procore-project-transmittals"
  },
  {
    "id": "Prime Contract",
    "group": "Financial Management",
    "level": "Project",
    "description": "Manages the primary contract with the Owner, including SOV, changes, and invoicing.",
    "personas": ["fm", "pm", "owner"],
    "audience": ["GC", "O"],
    "supportUrl": "httpss://support.procore.com/products/procore-project-prime-contract"
  },
  {
    "id": "Budget",
    "group": "Financial Management",
    "level": "Project",
    "description": "Real-time view of project financial health, tracking budgets, costs, and forecasts.",
    "personas": ["fm", "pm", "owner"],
    "audience": ["GC", "O"],
    "supportUrl": "httpss://support.procore.com/products/procore-project-budget"
  },
  {
    "id": "Commitments",
    "group": "Financial Management",
    "level": "Project",
    "description": "Manages subcontracts and purchase orders, establishing committed costs for the project.",
    "personas": ["fm", "pm", "sub"],
    "audience": ["GC", "SC", "O"],
    "supportUrl": "httpss://support.procore.com/products/procore-project-commitments"
  },
  {
    "id": "Change Events",
    "group": "Financial Management",
    "level": "Project",
    "description": "Captures and manages any event that could impact cost or schedule, forming the basis for change orders.",
    "personas": ["pm", "fm", "super", "sub", "design"],
    "audience": ["GC", "SC", "O"],
    "supportUrl": "httpss://support.procore.com/products/procore-project-change-events"
  },
  {
    "id": "Change Orders",
    "group": "Financial Management",
    "level": "Project",
    "description": "Manages the entire change order process, including PCOs, CCOs, and OCOs.",
    "personas": ["fm", "pm", "owner", "sub"],
    "audience": ["GC", "SC", "O"],
    "supportUrl": "httpss://support.procore.com/products/procore-project-change-orders"
  },
  {
    "id": "Invoicing",
    "group": "Financial Management",
    "level": "Project",
    "description": "Manages billing upstream (to owners) and downstream (from subcontractors).",
    "personas": ["fm", "owner", "pm", "sub"],
    "audience": ["GC", "SC", "O"],
    "supportUrl": "httpss://support.procore.com/products/procore-project-invoicing"
  },
  {
    "id": "Direct Costs",
    "group": "Financial Management",
    "level": "Project",
    "description": "Tracks project costs (e.g., labor, materials) not associated with a commitment.",
    "personas": ["fm", "pm"],
    "audience": ["GC", "O"],
    "supportUrl": "httpss://support.procore.com/products/procore-project-direct-costs"
  },
  {
    "id": "Procore Pay",
    "group": "Financial Management",
    "level": "Company",
    "description": "Automates payments to subcontractors and vendors, and manages lien waivers.",
    "personas": ["fm", "sub"],
    "audience": ["GC", "SC"],
    "supportUrl": "https://support.procore.com/products/procore-procore-pay"
  },

  // --- Quality & Safety ---
  {
    "id": "Inspections",
    "group": "Quality & Safety",
    "level": "Project",
    "description": "Creates and manages quality and safety inspection checklists and templates.",
    "personas": ["super", "pm", "sub"],
    "audience": ["GC", "SC", "O"],
    "supportUrl": "httpss://support.procore.com/products/procore-project-inspections"
  },
  {
    "id": "Observations",
    "group": "Quality & Safety",
    "level": "Project",
    "description": "Documents non-conforming work, safety issues, or other site observations.",
    "personas": ["super", "pm", "owner", "sub", "design"],
    "audience": ["GC", "SC", "O"],
    "supportUrl": "httpss://support.procore.com/products/procore-project-observations"
  },
  {
    "id": "Punch List",
    "group": "Quality & Safety",
    "level": "Project",
    "description": "Manages the punch list (snag list) process to track deficient items through to resolution.",
    "personas": ["super", "pm", "owner", "sub", "design"],
    "audience": ["GC", "SC", "O"],
    "supportUrl": "httpss://support.procore.com/products/procore-project-punch-list"
  },
  {
    "id": "Incidents",
    "group": "Quality & Safety",
    "level": "Project",
    "description": "Logs and tracks all project incidents, such as injuries, accidents, and safety violations.",
    "personas": ["super", "pm"],
    "audience": ["GC", "SC", "O"],
    "supportUrl": "httpss://support.procore.com/products/procore-project-incidents"
  },
  {
    "id": "Action Plans",
    "group": "Quality & Safety",
    "level": "Project",
    "description": "Creates multi-step plans for quality and safety processes, referencing other Procore items.",
    "personas": ["pm", "super"],
    "audience": ["GC", "SC"],
    "supportUrl": "httpss://support.procore.com/products/procore-project-action-plans"
  },

  // --- Workforce Management ---
  {
    "id": "Timesheets",
    "group": "Workforce Management",
    "level": "Project",
    "description": "Collects worker hours on-site, providing accurate labor data for payroll and project costing.",
    "personas": ["fm", "super", "sub"],
    "audience": ["GC", "SC"],
    "supportUrl": "httpss://support.procore.com/products/procore-project-timesheets"
  },
  {
    "id": "MyTime",
    "group": "Workforce Management",
    "level": "Project",
    "description": "Mobile tool for individual workers to clock in/out, syncing with Timesheets.",
    "personas": ["super", "sub"],
    "audience": ["GC", "SC"],
    "supportUrl": "https://support.procore.com/products/procore-my-time"
  },
  {
    "id": "Crews",
    "group": "Workforce Management",
    "level": "Project",
    "description": "Organize labor resources into crews for easier management and time entry.",
    "personas": ["super", "sub"],
    "audience": ["GC", "SC"],
    "supportUrl": "httpss://support.procore.com/products/procore-project-crews"
  },
  {
    "id": "T&M Tickets",
    "group": "Workforce Management",
    "level": "Project",
    "description": "Tracks out-of-scope work, capturing labor, equipment, and material costs for T&M billing.",
    "personas": ["pm", "super", "fm", "sub"],
    "audience": ["GC", "SC"],
    "supportUrl": "httpss://support.procore.com/products/procore-project-tm-tickets"
  },
  {
    "id": "Workforce Planning",
    "group": "Workforce Management",
    "level": "Company",
    "description": "Company-level tool to schedule and dispatch workforce and equipment across projects.",
    "personas": ["pm", "super", "admin"],
    "audience": ["GC", "SC"],
    "supportUrl": "httpss://support.procore.com/products/procore-company-workforce-planning"
  },
  {
    "id": "Equipment",
    "group": "Workforce Management",
    "level": "Project",
    "description": "Tracks owned and rented equipment usage, costs, and maintenance.",
    "personas": ["super", "fm"],
    "audience": ["GC", "SC"],
    "supportUrl": "httpss://support.procore.com/products/procore-project-equipment"
  },
  {
    "id": "Field Productivity",
    "group": "Workforce Management",
    "level": "Project",
    "description": "Compares budgeted production quantities and hours with actuals from Timesheets to track labor performance.",
    "personas": ["pm", "super"],
    "audience": ["GC", "SC"],
    "supportUrl": "httpss://support.procore.com/products/procore-project-field-productivity"
  },
  
  // --- Preconstruction ---
  {
    "id": "Bid Management",
    "group": "Preconstruction",
    "level": "Company",
    "description": "Streamlines sending bid packages, collecting bids, and awarding contracts.",
    "personas": ["fm", "pm", "sub"],
    "audience": ["GC", "SC", "O"],
    "supportUrl": "httpss://support.procore.com/products/procore-company-bid-management"
  },
  {
    "id": "Prequalification",
    "group": "Preconstruction",
    "level": "Company",
    "description": "Assesses and manages the qualifications and risk of subcontractors and vendors.",
    "personas": ["pm", "fm"],
    "audience": ["GC", "O"],
    "supportUrl": "httpss://support.procore.com/products/procore-company-prequalification"
  },
  {
    "id": "Estimating",
    "group": "Preconstruction",
    "level": "Project",
    "description": "Creates accurate cost estimates and forecasts with digital takeoff to build competitive bids.",
    "personas": ["fm", "pm"],
    "audience": ["GC", "SC", "O"],
    "supportUrl": "httpss://support.procore.com/products/procore-project-estimating"
  },
  {
    "id": "BIM",
    "group": "Preconstruction",
    "level": "Project",
    "description": "Provides access to 3D BIM models in the field for coordination and issue tracking.",
    "personas": ["pm", "super", "design"],
    "audience": ["GC", "SC", "O"],
    "supportUrl": "httpss://support.procore.com/products/procore-project-bim"
  },
  {
    "id": "Coordination Issues",
    "group": "Preconstruction",
    "level": "Project",
    "description": "Identifies, tracks, and resolves clashes and issues in 3D models.",
    "personas": ["pm", "super", "design"],
    "audience": ["GC", "SC", "O"],
    "supportUrl": "httpss://support.procore.com/products/procore-project-coordination-issues"
  },

  // --- Construction Intelligence ---
  {
    "id": "Analytics",
    "group": "Construction Intelligence",
    "level": "Company",
    "description": "Provides BI and predictive insights via interactive dashboards across all Procore tools.",
    "personas": ["pm", "fm", "owner", "admin"],
    "audience": ["GC", "SC", "O"],
    "supportUrl": "httpss://support.procore.com/products/procore-company-analytics"
  },
  {
    "id": "Reporting",
    "group": "Construction Intelligence",
    "level": "Company",
    "description": "Create and schedule custom reports across multiple projects and tools.",
    "personas": ["pm", "fm", "owner", "admin"],
    "audience": ["GC", "SC", "O"],
    "supportUrl": "httpss://support.procore.com/products/procore-company-reporting"
  },
  {
    "id": "Portfolio",
    "group": "Construction Intelligence",
    "level": "Company",
    "description": "The central hub for managing and reporting on all projects in your portfolio.",
    "personas": ["pm", "fm", "owner", "admin"],
    "audience": ["GC", "SC", "O"],
    "supportUrl": "httpss://support.procore.com/products/procore-company-portfolio"
  },
  {
    "id": "Home",
    "group": "Construction Intelligence",
    "level": "Company",
    "description": "A centralized dashboard for users to access key information and tasks across all their projects.",
    "personas": ["pm", "fm",".super", "owner", "sub", "design"],
    "audience": ["GC", "SC", "O"],
    "supportUrl": "https://support.procore.com/products/procore-home"
  },

  // --- External Integrations ---
  {
    "id": "ERP Integrations",
    "group": "External Integrations",
    "level": "Company",
    "description": "Connection to external ERP or accounting systems (e.g., Sage, Viewpoint, QuickBooks).",
    "personas": ["fm", "admin"],
    "audience": ["GC", "SC", "O"],
    "supportUrl": "https://support.procore.com/products/procore-erp-integrations"
  },
  {
    "id": "App Marketplace",
    "group": "External Integrations",
    "level": "Company",
    "description": "Hub for third-party applications that integrate with Procore, enhancing platform capabilities.",
    "personas": ["pm", "fm", "super", "admin"],
    "audience": ["GC", "SC", "O"],
    "supportUrl": "https://procore.com/app-marketplace"
  },
  {
    "id": "Scheduling Integration",
    "group": "External Integrations",
    "level": "Project",
    "description": "Integration with external scheduling tools (e.g., P6, Microsoft Project, Asta).",
    "personas": ["pm"],
    "audience": ["GC", "SC", "O"],
    "supportUrl": "https:"
  }
];
