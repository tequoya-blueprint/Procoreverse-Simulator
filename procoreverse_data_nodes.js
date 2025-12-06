/**
 * Procoreverse Data Module (Part 1/3)
 * This file contains all the tool nodes from SECTION 1.
 */

// --- [SECTION 1] - All Tool Nodes ---
const nodesData = [

  // --- [Group: External Integrations] ---
  {
    "id": "ERP Systems",
    "group": "External Integrations",
    "level": "company",
    "description": "Connection to external ERP or accounting system (e.G., Sage, Viewpoint).",
    "personas": [
      "fm"
    ],
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
    "personas": [
      "fm",
      "pm",
      "owner"
    ],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/budget-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Project+Financials"
     },
  {
    "id": "Change Events",
    "group": "Financial Management",
    "level": "project",
    "description": "Captures any event that could impact cost or schedule.",
    "personas": [
      "pm",
      "fm",
      "super",
      "sub",
      "design"
    ],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/change-events-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Project+Financials"
  },
  {
    "id": "Change Orders",
    "group": "Financial Management",
    "level": "project",
    "description": "Manages the entire change order process (PCOs, CCOs).",
    "personas": [
      "fm",
      "pm",
      "owner",
      "sub"
    ],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/change-orders-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Project+Financials"
  },
  {
    "id": "Commitments",
    "group": "Financial Management",
    "level": "project",
    "description": "Manages subcontracts and purchase orders, establishing committed costs for the project.",
    "personas": [
      "fm",
      "pm",
      "sub"
    ],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/commitments-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Project+Financials"
  },
  {
    "id": "Direct Costs",
    "group": "Financial Management",
    "level": "company",
    "description": "Tracks project costs (e.g., labor, materials) not associated with a commitment.",
    "personas": [
      "fm",
      "pm"
    ],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/direct-costs-company/ | https://v2.support.procore.com/product-manuals/directory-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Project+Financials"
  },
  {
    "id": "Invoicing",
    "group": "Financial Management",
    "level": "project",
    "description": "Manages billing upstream (to owners) and downstream (from subcontractors).",
    "personas": [
      "fm",
      "owner",
      "pm",
      "sub"
    ],
    "caseStudyUrl": "https://www.procore.com/casestudies/allen-harrison-company",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/invoicing-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Invoice+Management"
  },
  {
    "id": "Prime Contracts",
    "group": "Financial Management",
    "level": "project",
    "description": "Manages the primary contract and funding sources.",
    "personas": [
      "fm",
      "pm",
      "owner"
    ],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/prime-contracts-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Project+Financials"
  },
  {
    "id": "Procore Pay",
    "group": "Financial Management",
    "level": "company",
    "description": "Centralizes lien waivers, payment requirements, payment holds, and invoice payments for payors, and allows payees to securely link their bank accounts to get paid.",
    "personas": [
      "pm",
      "fm",
      "owner"
    ],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/payments-company/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Pay"
  },
  {
    "id": "Project Status Snapshots",
    "group": "Financial Management",
    "level": "project",
    "description": "Simplifies how your team monitors and reviews project status snapshots of budgets for all your company's projects.",
    "personas": [
      "pm",
      "fm",
      "owner"
    ],
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
    "personas": [
      "pm",
      "fm",
      "owner"
    ],
    "caseStudyUrl": "https://www.procore.com/casestudies/commodore-builders-analytics",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/analytics-company/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Analytics"
  },
  {
    "id": "Insights",
    "group": "Helix",
    "level": "project",
    "description": "Help you spot risks early, understand performance trends, and take action;  bringing the most critical patterns to the surface without guesswork or manual digging.",
    "personas": [
      "pm",
      "fm",
      "owner"
    ],
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
    "personas": [
      "pm",
      "super",
      "design"
    ],
    "caseStudyUrl": "https://www.procore.com/casestudies/bailey-harris-construction",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/models-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=BIM"
  },
  {
    "id": "Documents",
    "group": "Platform & Core",
    "level": "company",
    "description": "Centralized repository for all project documents.",
    "personas": [
      "pm",
      "super",
      "fm",
      "owner",
      "sub",
      "design"
    ],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/document-management-project/ | https://v2.support.procore.com/product-manuals/documents-company/ | https://v2.support.procore.com/product-manuals/documents-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new"
  },
  {
    "id": "Coordination Issues",
    "group": "Platform & Core",
    "level": "project",
    "description": "Identifies, tracks, and resolves clashes in 3D models.",
    "personas": [
      "pm",
      "super",
      "design"
    ],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/coordination-issues-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Design+Coordination"
  },
  {
    "id": "Daily Log",
    "group": "Platform & Core",
    "level": "project",
    "description": "Daily diary for the jobsite: manpower, weather, notes.",
    "personas": [
      "super",
      "pm",
      "sub"
    ],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/daily-log-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new"
  },
  {
    "id": "Directory",
    "group": "Platform & Core",
    "level": "company",
    "description": "Central contact list and permissions management.",
    "personas": [
      "pm",
      "fm",
      "super",
      "owner",
      "sub",
      "design"
    ],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/directory-company/ | https://v2.support.procore.com/product-manuals/directory-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new"
  },
  {
    "id": "Forms",
    "group": "Platform & Core",
    "level": "project",
    "description": "Digital custom project forms (checklists, reports).",
    "personas": [
      "super",
      "pm",
      "sub"
    ],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/forms-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new"
  },
  {
    "id": "Project Map",
    "group": "Platform & Core",
    "level": "project",
    "description": "Enhances project execution by visually showing your Procore items on a map, facilitating better planning, execution, and monitoring of construction projects.",
    "personas": [
      "pm",
      "super",
      "owner",
      "sub",
      "design"
    ],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/procore-maps/",
    "whatsNewUrl": "https://www.procore.com/whats-new"
  },
  {
    "id": "Photos",
    "group": "Platform & Core",
    "level": "project",
    "description": "Central repository for all jobsite photos.",
    "personas": [
      "pm",
      "super",
      "owner",
      "sub",
      "design"
    ],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/photos-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new"
  },
  {
    "id": "Projects",
    "group": "Platform & Core",
    "level": "company",
    "description": "The central hub for managing all projects.",
    "personas": [
      "pm",
      "fm",
      "owner"
    ],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/portfolio-company/",
    "whatsNewUrl": "https://www.procore.com/whats-new"
  },
  {
    "id": "Tasks",
    "group": "Platform & Core",
    "level": "project",
    "description": "A llows you to track and manage action items throughout the lifespan of the project.",
    "personas": [],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/tasks-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new"
  },
  {
    "id": "Conversations",
    "group": "Platform & Core",
    "level": "project",
    "description": "P rovides a convenient solution for messaging across projects within Procore's web and mobile applications.",
    "personas": [],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/conversations-company/",
    "whatsNewUrl": "https://www.procore.com/whats-new"
  },
  {
    "id": "Assist",
    "group": "Platform & Core",
    "level": "project",
    "description": "Procore's AI-driven assistant; it responds to questions asked in a conversational style, like the kind of question you might ask a coworker",
    "personas": [],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/assist-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Assist"
  },
  {
    "id": "Training Center",
    "group": "Platform & Core",
    "level": "project",
    "description": "TBD",
    "personas": [],
    "caseStudyUrl": "",
    "supportDocUrl": "",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Training+Center"
  },
  {
    "id": "Premier Support Bronze",
    "group": "Platform & Core",
    "level": "project",
    "description": "TBD",
    "personas": [],
    "caseStudyUrl": "",
    "supportDocUrl": "",
    "whatsNewUrl": ""
  },
{
    "id": "Workflows",
    "group": "Platform & Core",
    "level": "company",
    "description": "Custom approval workflows for various tools (e.g., Submittals, Invoicing, RFIs).",
    "personas": [ "pm", "fm", "admin" ],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/workflows-company/",
    "whatsNewUrl": "https://www.procore.com/whats-new"
  },
  
  // --- [Group: Preconstruction] ---
  {
    "id": "Bid Board",
    "group": "Preconstruction",
    "level": "company",
    "description": "Allows you to easily view and manage all bids for your company.",
    "personas": [
      "pm",
      "estimator",
      "fm"
    ],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/bid-board-company/",
    "whatsNewUrl": "https://www.procore.com/whats-new"
  },
  {
    "id": "Bidding",
    "group": "Preconstruction",
    "level": "project",
    "description": "Streamlines sending bid packages, collecting bids, and awarding contracts.",
    "personas": [
      "fm",
      "pm",
      "sub"
    ],
    "caseStudyUrl": "https://www.procore.com/casestudies/gilbane",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/bidding-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Bid+Management"
  },
  {
    "id": "Estimating",
    "group": "Preconstruction",
    "level": "project",
    "description": "Creates accurate cost estimates and forecasts to build competitive bids. Sub-features include digital takeoff and proposal generation.",
    "personas": [
      "fm",
      "pm",
      "estimator"
    ],
    "caseStudyUrl": "https://www.procore.com/casestudies/gardner-builders",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/estimating-project/ | https://v2.support.procore.com/product-manuals/cost-catalog-company/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Estimating"
  },
  {
    "id": "Prequalifications",
    "group": "Preconstruction",
    "level": "company",
    "description": "Assesses and manages the qualifications and risk of subcontractors.",
    "personas": [
      "pm",
      "fm"
    ],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/prequalifications-company/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Prequalification"
  },
  {
    "id": "Procore Construction Network",
    "group": "Preconstruction",
    "level": "company",
    "description": "Procore Construction Network: directory to find contractors and partners.",
    "personas": [
      "pm",
      "fm",
      "estimator",
      "owner"
    ],
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
    "personas": [
      "pm",
      "super",
      "owner",
      "sub",
      "design"
    ],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/correspondence-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new"
  },
  {
    "id": "Drawings",
    "group": "Project Execution",
    "level": "project",
    "description": "Ensures the team works from the latest plans with version control and markups.",
    "personas": [
      "pm",
      "super",
      "owner",
      "sub",
      "design",
      "fm"
    ],
    "caseStudyUrl": "https://www.procore.com/casestudies/asturian-group",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/drawings-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new"
  },
  {
    "id": "Emails",
    "group": "Project Execution",
    "level": "project",
    "description": "Control your communications and manage all project-related emails using one centralized email client.",
    "personas": [
      "pm",
      "super",
      "owner",
      "sub"
    ],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/emails-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new"
  },
  {
    "id": "Instructions",
    "group": "Project Execution",
    "level": "project",
    "description": "Provides team members on a construction project with the ability to capture and record all types of instructions Available in Australia, New Zealand, and Canada.",
    "personas": [
      "pm",
      "fm",
      "owner",
      "super"
    ],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/instructions-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new"
  },
  {
    "id": "Meetings",
    "group": "Project Execution",
    "level": "project",
    "description": "Organizes meetings, tracks attendance, assigns action items.",
    "personas": [
      "pm",
      "super",
      "owner",
      "sub",
      "design"
    ],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/meetings-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new"
  },
  {
    "id": "RFIs",
    "group": "Project Execution",
    "level": "project",
    "description": "Manages Requests for Information to clarify plans.",
    "personas": [
      "pm",
      "super",
      "owner",
      "sub",
      "design"
    ],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/rfi-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Project+Management"
  },
  {
    "id": "Schedule",
    "group": "Project Execution",
    "level": "company",
    "description": "Manages the project schedule and track progress.",
    "personas": [
      "pm",
      "super",
      "owner",
      "sub"
    ],
    "caseStudyUrl": "https://www.procore.com/casestudies/cyberco",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/schedule-company/ | https://v2.support.procore.com/product-manuals/schedule-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Project+Management"
  },
  {
    "id": "Specifications",
    "group": "Project Execution",
    "level": "project",
    "description": "Stores and manages the project's technical specifications.",
    "personas": [
      "pm",
      "super",
      "sub",
      "design"
    ],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/specifications-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Project+Management"
  },
  {
    "id": "Submittals",
    "group": "Project Execution",
    "level": "project",
    "description": "Manages the review and approval process for project submittals.",
    "personas": [
      "pm",
      "super",
      "owner",
      "sub",
      "design"
    ],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/submittals-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Project+Management"
  },
  {
    "id": "Transmittals",
    "group": "Project Execution",
    "level": "project",
    "description": "Keep documented records of any project-related correspondence with Procore's Transmittals tool.",
    "personas": [
      "pm",
      "fm",
      "owner"
    ],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/transmittals-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Project+Management"
  },

  // --- [Group: Quality & Safety] ---
  {
    "id": "Action Plans",
    "group": "Quality & Safety",
    "level": "project",
    "description": "Creates multi-step plans for standardizing processes, referencing other Procore items.",
    "personas": [
      "pm",
      "super"
    ],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/action-plans-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Quality+%26+Safety"
  },
  {
    "id": "Incidents",
    "group": "Quality & Safety",
    "level": "project",
    "description": "Logs and tracks all project incidents and safety violations.",
    "personas": [
      "super",
      "pm"
    ],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/incidents-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Quality+%26+Safety"
  },
  {
    "id": "Inspections",
    "group": "Quality & Safety",
    "level": "company",
    "description": "Creates quality and safety inspection checklists.",
    "personas": [
      "super",
      "pm",
      "sub"
    ],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/inspections-company/ | https://v2.support.procore.com/product-manuals/inspections-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Quality+%26+Safety"
  },
  {
    "id": "Observations",
    "group": "Quality & Safety",
    "level": "project",
    "description": "Documents non-conforming work or safety issues.",
    "personas": [
      "super",
      "pm",
      "owner",
      "sub",
      "design"
    ],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/observations-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Quality+%26+Safety"
  },
  {
    "id": "Punch List",
    "group": "Quality & Safety",
    "level": "project",
    "description": "Manages the punch list process to track deficient items.",
    "personas": [
      "super",
      "pm",
      "owner",
      "sub",
      "design"
    ],
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
    "personas": [
      "super",
      "sub"
    ],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/crews-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Resource+Planning"
  },
  {
    "id": "Equipment",
    "group": "Resource Management",
    "level": "company",
    "description": "Tracks owned and rented equipment usage and costs.",
    "personas": [
      "super",
      "fm"
    ],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/equipment-company/ | https://v2.support.procore.com/product-manuals/equipment-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Equipment",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Resource+Planning"
  },
  {
    "id": "MyTime",
    "group": "Resource Management",
    "level": "project",
    "description": "Mobile tool for individual workers to clock in/out.",
    "personas": [
      "super",
      "sub"
    ],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/my-time-ios/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Resource+Planning"
  },
  {
    "id": "Resource Planning",
    "group": "Resource Management",
    "level": "company",
    "description": "Schedule and dispatch resources and equipment across projects.",
    "personas": [
      "pm",
      "super"
    ],
    "caseStudyUrl": "https://www.procore.com/casestudies/prime-build-Resource-planning",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/resource-planning-company/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Resource+Planning"
  },
  {
    "id": "Resource Tracking",
    "group": "Resource Management",
    "level": "company",
    "description": "Allows you to  track and manage your production quantities.",
    "personas": [
      "pm",
      "fm",
      "super"
    ],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/timesheets-company/ | https://v2.support.procore.com/product-manuals/timesheets-project/ |",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Resource+Tracking"
  },
  {
    "id": "T&M Tickets",
    "group": "Resource Management",
    "level": "project",
    "description": "Tracks out-of-scope work, capturing labor, equipment, and material costs.",
    "personas": [
      "pm",
      "super",
      "fm",
      "sub"
    ],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/tm-tickets-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Resource+Planning"
  },
  {
    "id": "Timesheets",
    "group": "Resource Management",
    "level": "company",
    "description": "Collects worker hours on-site, providing accurate labor data (e.g., labor hours, cost codes) for payroll and project costing.",
    "personas": [
      "fm",
      "super",
      "sub"
    ],
    "caseStudyUrl": "",
    "supportDocUrl": "https://v2.support.procore.com/product-manuals/timecard-company/ | https://v2.support.procore.com/product-manuals/timesheets-company/ | https://v2.support.procore.com/product-manuals/timesheets-project/",
    "whatsNewUrl": "https://www.procore.com/whats-new?products=Resource+Planning"
  }
];
