/**
 * Procoreverse Data Module - Tool Definitions
 * BASELINE VERSION: 1.1 (Rich Content + Standardized Features)
 */
const nodesData = [

  // --- [Group: External Tech] (NEW LAYER) ---
  {
    "id": "External ERP",
    "group": "External Tech",
    "level": "company",
    "description": "Third-party Accounting or ERP system (e.g., Sage, Viewpoint, CMiC).",
    "personas": ["fm", "owner", "admin"],
    "features": [],
    "supportDocUrl": "",
    "whatsNewUrl": ""
  },
  {
    "id": "External Scheduling",
    "group": "External Tech",
    "level": "project",
    "description": "Third-party Scheduling tool (e.g., P6, MS Project, Asta).",
    "personas": ["pm", "super", "owner"],
    "features": [],
    "supportDocUrl": "",
    "whatsNewUrl": ""
  },
  {
    "id": "External Estimating",
    "group": "External Tech",
    "level": "project",
    "description": "Third-party estimating software (e.g., HeavyBid, Stack, OST).",
    "personas": ["estimator", "pm"],
    "features": [],
    "supportDocUrl": "",
    "whatsNewUrl": ""
  },
  {
    "id": "External Document Management",
    "group": "External Tech",
    "level": "company",
    "description": "External Common Data Environment (CDE) or Cloud Storage (e.g., SharePoint, Box, Dropbox).",
    "personas": ["pm", "admin", "owner"],
    "features": [],
    "supportDocUrl": "",
    "whatsNewUrl": ""
  },
  {
    "id": "External Resource Coordination",
    "group": "External Tech",
    "level": "company",
    "description": "Spreadsheets or point solutions for labor and workforce planning.",
    "personas": ["super", "sub"],
    "features": [],
    "supportDocUrl": "",
    "whatsNewUrl": ""
  },
  {
    "id": "External Safety",
    "group": "External Tech",
    "level": "project",
    "description": "Point solutions for safety inspections, forms, and incident tracking.",
    "personas": ["super", "safety"],
    "features": [],
    "supportDocUrl": "",
    "whatsNewUrl": ""
  },
  {
    "id": "External BIM",
    "group": "External Tech",
    "level": "project",
    "description": "Third-party model viewing or clash detection software (e.g., Navisworks, Revizto).",
    "personas": ["design", "pm"],
    "features": [],
    "supportDocUrl": "",
    "whatsNewUrl": ""
  },
  {
    "id": "External Bidding",
    "group": "External Tech",
    "level": "company",
    "description": "Third-party Bid Solicitation tool (e.g., BuildingConnected, iSqFt).",
    "personas": ["estimator", "pm"],
    "features": [],
    "supportDocUrl": "",
    "whatsNewUrl": ""
  },
  
  // --- [Group: External Integrations] ---
  {
    "id": "ERP Connectors",
    "group": "External Integrations",
    "level": "company",
    "description": "Connection to external ERP or accounting system (e.g., Sage, Viewpoint).",
    "personas": ["fm"],
    "features": [],
    "caseStudyUrl": "",
    "supportDocUrl": "",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Accounting+Integrations"
  },

  // --- [Group: Financial Management] ---
  {
    "id": "Budget",
    "group": "Financial Management",
    "level": "project",
    "description": "Real-time view of project financial health, tracking data like budgets, costs, and forecasts.",
    "personas": ["fm", "pm", "owner"],
    "features": [],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/budget-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Project+Financials"
  },
  {
    "id": "Change Events",
    "group": "Financial Management",
    "level": "project",
    "description": "Captures any event that could impact cost or schedule.",
    "personas": ["pm", "fm", "super", "sub", "design"],
    "features": ["mobile", "assist"],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/change-events-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Project+Financials"
  },
  {
    "id": "Change Orders",
    "group": "Financial Management",
    "level": "project",
    "description": "Manages the entire change order process (PCOs, CCOs).",
    "personas": ["fm", "pm", "owner", "sub"],
    "features": [],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/change-orders-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Project+Financials"
  },
  {
    "id": "Commitments",
    "group": "Financial Management",
    "level": "project",
    "description": "Manages subcontracts and purchase orders, establishing committed costs for the project.",
    "personas": ["fm", "pm", "sub"],
    "features": ["mobile", "assist"],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/commitments-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Project+Financials"
  },
  {
    "id": "Direct Costs",
    "group": "Financial Management",
    "level": "company",
    "description": "Tracks project costs (e.g., labor, materials) not associated with a commitment.",
    "personas": ["fm", "pm"],
    "features": ["assist"],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/direct-costs-company/ | https://v2.support.procore.com/product-manuals/directory-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Project+Financials"
  },
  {
    "id": "Invoicing",
    "group": "Financial Management",
    "level": "project",
    "description": "Manages billing upstream (to owners) and downstream (from subcontractors).",
    "personas": ["fm", "owner", "pm", "sub"],
    "features": ["assist"],
    "caseStudyUrl": "https://www.procore.com/casestudies/allen-harrison-company",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/invoicing-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Invoice+Management"
  },
  {
    "id": "Prime Contracts",
    "group": "Financial Management",
    "level": "project",
    "description": "Manages the primary contract and funding sources.",
    "personas": ["fm", "pm", "owner"],
    "features": ["mobile", "assist"],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/prime-contracts-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Project+Financials"
  },
  {
    "id": "Procore Pay",
    "group": "Financial Management",
    "level": "company",
    "description": "Centralizes lien waivers, payment requirements, payment holds, and invoice payments for payors.",
    "personas": ["pm", "fm", "owner"],
    "features": [],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/payments-company/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Pay"
  },
  {
    "id": "Project Status Snapshots",
    "group": "Financial Management",
    "level": "project",
    "description": "Simplifies how your team monitors and reviews project status snapshots of budgets.",
    "personas": ["pm", "fm", "owner"],
    "features": [],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/project-status-snapshots/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Project+Financials"
  },

  // --- [Group: Helix] ---
  {
    "id": "Analytics",
    "group": "Helix",
    "level": "company",
    "description": "Provides BI and predictive insights via interactive dashboards.",
    "personas": ["pm", "fm", "owner"],
    "features": [],
    "caseStudyUrl": "https://www.procore.com/casestudies/commodore-builders-analytics",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/analytics-company/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Analytics"
  },
  {
    "id": "Insights",
    "group": "Helix",
    "level": "project",
    "description": "Helps spot risks early, understand performance trends, and take action.",
    "personas": ["pm", "fm", "owner"],
    "features": [],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/insights/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Insights"
  },

  // --- [Group: Platform & Core] ---
  {
    "id": "Models",
    "group": "Platform & Core",
    "level": "project",
    "description": "Provides access to 3D BIM models for coordination and reference.",
    "personas": ["pm", "super", "design"],
    "features": ["mobile", "assist"],
    "caseStudyUrl": "https://www.procore.com/casestudies/bailey-harris-construction",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/models-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=BIM"
  },
  {
    "id": "Documents",
    "group": "Platform & Core",
    "level": "company",
    "description": "Centralized repository for all project documents.",
    "personas": ["pm", "super", "fm", "owner", "sub", "design"],
    "features": ["mobile", "assist"],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/documents-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new"
  },
  {
    "id": "Coordination Issues",
    "group": "Platform & Core",
    "level": "project",
    "description": "Identifies, tracks, and resolves clashes in 3D models.",
    "personas": ["pm", "super", "design"],
    "features": ["mobile", "assist"],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/coordination-issues-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Design+Coordination"
  },
  {
    "id": "Daily Log",
    "group": "Platform & Core",
    "level": "project",
    "description": "Daily diary for the jobsite: manpower, weather, notes.",
    "personas": ["super", "pm", "sub"],
    "features": ["mobile", "assist"],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/daily-log-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new"
  },
  {
    "id": "Directory",
    "group": "Platform & Core",
    "level": "company",
    "description": "Central contact list and permissions management.",
    "personas": ["pm", "fm", "super", "owner", "sub", "design"],
    "features": ["mobile", "assist"],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/directory-company/",
    "whatsNewUrl": "https://www.procore.com/whats-new"
  },
  {
    "id": "Forms",
    "group": "Platform & Core",
    "level": "project",
    "description": "Digital custom project forms (checklists, reports).",
    "personas": ["super", "pm", "sub"],
    "features": [],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/forms-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new"
  },
  {
    "id": "Project Map",
    "group": "Platform & Core",
    "level": "project",
    "description": "Enhances project execution by visually showing your Procore items on a map.",
    "personas": ["pm", "super", "owner", "sub", "design"],
    "features": ["mobile"],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/procore-maps/",
    "whatsNewUrl": "https://www.procore.com/whats-new"
  },
  {
    "id": "Photos",
    "group": "Platform & Core",
    "level": "project",
    "description": "Central repository for all jobsite photos.",
    "personas": ["pm", "super", "owner", "sub", "design"],
    "features": ["mobile", "assist"],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/photos-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new"
  },
  {
    "id": "Projects",
    "group": "Platform & Core",
    "level": "company",
    "description": "The central hub for managing all projects.",
    "personas": ["pm", "fm", "owner"],
    "features": [],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/portfolio-company/",
    "whatsNewUrl": "https://www.procore.com/whats-new"
  },
  {
    "id": "Tasks",
    "group": "Platform & Core",
    "level": "project",
    "description": "Allows you to track and manage action items throughout the lifespan of the project.",
    "personas": [],
    "features": ["mobile", "assist"],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/tasks-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new"
  },
  {
    "id": "Conversations",
    "group": "Platform & Core",
    "level": "project",
    "description": "Provides a convenient solution for messaging across projects.",
    "personas": [],
    "features": ["mobile"],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/conversations-company/",
    "whatsNewUrl": "https://www.procore.com/whats-new"
  },
  {
    "id": "Training Center",
    "group": "Platform & Core",
    "level": "project",
    "description": "Procore's integrated learning management system.",
    "personas": [],
    "features": [],
    "caseStudyUrl": "",
    "supportDocUrl": "",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Training+Center"
  },
  {
    "id": "Premier Support Bronze",
    "group": "Platform & Core",
    "level": "project",
    "description": "Standard support package included with certain tiers.",
    "personas": [],
    "features": [],
    "caseStudyUrl": "",
    "supportDocUrl": "",
    "whatsNewUrl": ""
  },
  {
    "id": "Workflows",
    "group": "Platform & Core",
    "level": "company",
    "description": "Custom approval workflows for various tools (e.g., Submittals, Invoicing, RFIs).",
    "personas": ["pm", "fm", "admin"],
    "features": [],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/workflows-company/",
    "whatsNewUrl": "https://www.procore.com/whats-new"
  },

  // --- [Group: Preconstruction] ---
  {
    "id": "Cost Catalog",
    "group": "Preconstruction",
    "level": "company",
    "description": "Allows you to easily store pricing and other data for materials, labor, etc.",
    "personas": ["pm", "estimator", "fm"],
    "features": [],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/cost-catalog-company/",
    "whatsNewUrl": "https://www.procore.com/whats-new"
  },
  {
    "id": "Bid Board",
    "group": "Preconstruction",
    "level": "company",
    "description": "Allows you to easily view and manage all bids for your company.",
    "personas": ["pm", "estimator", "fm"],
    "features": [],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/bid-board-company/",
    "whatsNewUrl": "https://www.procore.com/whats-new"
  },
  {
    "id": "Bidding",
    "group": "Preconstruction",
    "level": "project",
    "description": "Streamlines sending bid packages, collecting bids, and awarding contracts.",
    "personas": ["fm", "pm", "sub"],
    "features": ["assist"],
    "caseStudyUrl": "https://www.procore.com/casestudies/gilbane",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/bidding-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Bid+Management"
  },
  {
    "id": "Estimating",
    "group": "Preconstruction",
    "level": "project",
    "description": "Creates accurate cost estimates and forecasts to build competitive bids.",
    "personas": ["fm", "pm", "estimator"],
    "features": [],
    "caseStudyUrl": "https://www.procore.com/casestudies/gardner-builders",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/estimating-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Estimating"
  },
  {
    "id": "Prequalifications",
    "group": "Preconstruction",
    "level": "company",
    "description": "Assesses and manages the qualifications and risk of subcontractors.",
    "personas": ["pm", "fm"],
    "features": [],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/prequalifications-company/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Prequalification"
  },
  {
    "id": "Procore Construction Network",
    "group": "Preconstruction",
    "level": "company",
    "description": "Directory to find contractors and partners.",
    "personas": ["pm", "fm", "estimator", "owner"],
    "features": [],
    "caseStudyUrl": "https://www.procore.com/casestudies/peridot-mechanical",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/procore-construction-network/",
    "whatsNewUrl": "https://www.procore.com/whats-new"
  },

  // --- [Group: Project Execution] ---
  {
    "id": "Correspondence",
    "group": "Project Execution",
    "level": "project",
    "description": "Central hub for managing all project communications.",
    "personas": ["pm", "super", "owner", "sub", "design"],
    "features": ["mobile", "assist"],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/correspondence-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new"
  },
  {
    "id": "Drawings",
    "group": "Project Execution",
    "level": "project",
    "description": "Ensures the team works from the latest plans with version control and markups.",
    "personas": ["pm", "super", "owner", "sub", "design", "fm"],
    "features": ["mobile", "assist", "connect"],
    "caseStudyUrl": "https://www.procore.com/casestudies/asturian-group",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/drawings-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new"
  },
  {
    "id": "Emails",
    "group": "Project Execution",
    "level": "project",
    "description": "Control your communications and manage all project-related emails.",
    "personas": ["pm", "super", "owner", "sub"],
    "features": ["assist"],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/emails-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new"
  },
  {
    "id": "Instructions",
    "group": "Project Execution",
    "level": "project",
    "description": "Provides team members with the ability to capture and record instructions (Regional).",
    "personas": ["pm", "fm", "owner", "super"],
    "features": [],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/instructions-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new"
  },
  {
    "id": "Meetings",
    "group": "Project Execution",
    "level": "project",
    "description": "Organizes meetings, tracks attendance, assigns action items.",
    "personas": ["pm", "super", "owner", "sub", "design"],
    "features": ["mobile", "assist"],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/meetings-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new"
  },
  {
    "id": "RFIs",
    "group": "Project Execution",
    "level": "project",
    "description": "Manages Requests for Information to clarify plans.",
    "personas": ["pm", "super", "owner", "sub", "design"],
    "features": ["mobile", "assist", "connect"],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/rfi-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Project+Management"
  },
  {
    "id": "Schedule",
    "group": "Project Execution",
    "level": "company",
    "description": "Manages the project schedule and tracks progress.",
    "personas": ["pm", "super", "owner", "sub"],
    "features": ["mobile"],
    "caseStudyUrl": "https://www.procore.com/casestudies/cyberco",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/schedule-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Project+Management"
  },
  {
    "id": "Specifications",
    "group": "Project Execution",
    "level": "project",
    "description": "Stores and manages the project's technical specifications.",
    "personas": ["pm", "super", "sub", "design"],
    "features": ["mobile", "assist"],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/specifications-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Project+Management"
  },
  {
    "id": "Submittals",
    "group": "Project Execution",
    "level": "project",
    "description": "Manages the review and approval process for project submittals.",
    "personas": ["pm", "super", "owner", "sub", "design"],
    "features": ["mobile", "assist"],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/submittals-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Project+Management"
  },
  {
    "id": "Transmittals",
    "group": "Project Execution",
    "level": "project",
    "description": "Keep documented records of any project-related correspondence.",
    "personas": ["pm", "fm", "owner"],
    "features": [],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/transmittals-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Project+Management"
  },

  // --- [Group: Quality & Safety] ---
  {
    "id": "Action Plans",
    "group": "Quality & Safety",
    "level": "project",
    "description": "Creates multi-step plans for standardizing processes.",
    "personas": ["pm", "super"],
    "features": ["mobile", "assist"],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/action-plans-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Quality+%26+Safety"
  },
  {
    "id": "Incidents",
    "group": "Quality & Safety",
    "level": "project",
    "description": "Logs and tracks all project incidents and safety violations.",
    "personas": ["super", "pm"],
    "features": ["mobile", "assist"],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/incidents-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Quality+%26+Safety"
  },
  {
    "id": "Inspections",
    "group": "Quality & Safety",
    "level": "company",
    "description": "Creates quality and safety inspection checklists.",
    "personas": ["super", "pm", "sub"],
    "features": ["mobile", "assist"],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/inspections-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Quality+%26+Safety"
  },
  {
    "id": "Observations",
    "group": "Quality & Safety",
    "level": "project",
    "description": "Documents non-conforming work or safety issues.",
    "personas": ["super", "pm", "owner", "sub", "design"],
    "features": ["mobile", "assist"],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/observations-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Quality+%26+Safety"
  },
  {
    "id": "Punch List",
    "group": "Quality & Safety",
    "level": "project",
    "description": "Manages the punch list process to track deficient items.",
    "personas": ["super", "pm", "owner", "sub", "design"],
    "features": ["mobile", "assist"],
    "caseStudyUrl": "https://www.procore.com/casestudies/ameresco",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/punch-list-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Quality+%26+Safety"
  },

  // --- [Group: Resource Management] ---
  {
    "id": "Crews",
    "group": "Resource Management",
    "level": "project",
    "description": "Organize labor resources into crews for easier management and assignment.",
    "personas": ["super", "sub"],
    "features": ["mobile", "assist"],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/crews-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Resource+Planning"
  },
  {
    "id": "Equipment",
    "group": "Resource Management",
    "level": "company",
    "description": "Tracks owned and rented equipment usage and costs.",
    "personas": ["super", "fm"],
    "features": ["mobile"],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/equipment-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Resource+Planning"
  },
  {
    "id": "MyTime",
    "group": "Resource Management",
    "level": "project",
    "description": "Mobile tool for individual workers to clock in/out.",
    "personas": ["super", "sub"],
    "features": [],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/my-time-ios/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Resource+Planning"
  },
  {
    "id": "Resource Planning",
    "group": "Resource Management",
    "level": "company",
    "description": "Schedule and dispatch resources and equipment across projects.",
    "personas": ["pm", "super"],
    "features": ["mobile"],
    "caseStudyUrl": "https://www.procore.com/casestudies/prime-build-Resource-planning",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/resource-planning-company/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Resource+Planning"
  },
  {
    "id": "Resource Tracking",
    "group": "Resource Management",
    "level": "company",
    "description": "Allows you to track and manage your production quantities.",
    "personas": ["pm", "fm", "super"],
    "features": [],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/timesheets-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Resource+Tracking"
  },
  {
    "id": "T&M Tickets",
    "group": "Resource Management",
    "level": "project",
    "description": "Tracks out-of-scope work, capturing labor, equipment, and material costs.",
    "personas": ["pm", "super", "fm", "sub"],
    "features": ["mobile", "assist"],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/tm-tickets-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Resource+Planning"
  },
  {
    "id": "Timesheets",
    "group": "Resource Management",
    "level": "company",
    "description": "Collects worker hours on-site for payroll and project costing.",
    "personas": ["fm", "super", "sub"],
    "features": ["mobile", "assist"],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/timesheets-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Resource+Planning"
  }
];
