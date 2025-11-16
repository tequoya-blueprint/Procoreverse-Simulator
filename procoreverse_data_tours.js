// --- procoreverse_data_tours.js ---
// Defines all platform and package-specific workflow tours.
// FIX: Corrected a missing quote on line 69 ("T&M Tickets")

const tours = {
  platform: {
    pco: {
      name: "RFI to Change Order",
      steps: [
        { nodeId: "Drawings", info: "A discrepancy is found on the Drawings, and an RFI is created from a markup." },
        { nodeId: "RFIs", info: "The RFI is sent to the design team, who confirms a change in scope is required." },
        { nodeId: "Change Events", info: "A Change Event is created from the RFI to start tracking the potential cost and schedule impact." },
        { nodeId: "Bidding", info: "Quotes are requested from subcontractors (via Bidding) to price the change." },
        { nodeId: "Change Orders", info: "A formal Prime Change Order (PCO) is generated, bundling all costs, and sent to the Owner for approval." },
        { nodeId: "Budget", info: "Once approved, the Change Order automatically updates the project Budget in real-time." }
      ]
    },
    invoice_approval: {
      name: "Subcontractor Invoice Approval",
      steps: [
        { nodeId: "Commitments", info: "A subcontractor is invited to bill against their Commitment (Subcontract)." },
        { nodeId: "Invoicing", info: "The subcontractor submits their invoice (pay application) against the Commitment's Schedule of Values." },
        { nodeId: "Workflows", info: "The invoice is automatically routed via predefined Workflows to the Project Manager for review." },
        { nodeId: "ERP Integrations", info: "Once approved, the invoice and payment status are synced to the external ERP/Accounting system." },
        { nodeId: "Procore Pay", info: "Alternatively, the approved invoice can be queued for payment disbursement using Procore Pay." }
      ]
    },
    submittal: {
      name: "Submittal Review Process",
      steps: [
        { nodeId: "Specifications", info: "The project specifications define the required submittals for each trade." },
        { nodeId: "Submittals", info: "The GC creates submittal packages from the specs and assigns them to the subcontractors." },
        { nodeId: "Workflows", info: "The sub's response is routed via Workflows to the design team for review and approval." },
        { nodeId: "Drawings", info: "The 'Approved' submittal is linked to its location on the Drawings for easy field access." }
      ]
    },
    safety_incident: {
      name: "Safety Incident Reporting",
      steps: [
        { nodeId: "Daily Log", info: "A safety incident occurs on site and is immediately noted in the Daily Log." },
        { nodeId: "Incidents", info: "A detailed Incident report is created, documenting the event, personnel, and conditions." },
        { nodeId: "Photos", info: "Photos of the incident scene are attached to the Incident report for documentation." },
        { nodeId: "Observations", info: "A Safety Observation is created from the Incident to track the required corrective actions." },
        { nodeId: "Analytics", info: "Incident data is aggregated in Analytics to identify safety trends and risks across projects." }
      ]
    }
  },
  // Package-specific tours
  package: {
    // NAM - Project Execution Essentials
    "nam-exec-essentials-quality": {
      "name": "Field Quality Process",
      "steps": [
        { "nodeId": "Drawings", "info": "A superintendent walks the site and pins an issue to the Drawings." },
        { "nodeId": "Observations", "info": "An 'Observation' is created from the pin, noting the non-conforming work." },
        { "nodeId": "My-Tasks", "info": "The Observation automatically assigns a Task to the subcontractor responsible." },
        { "nodeId": "Photos", "info": "The subcontractor fixes the work, attaches a photo as proof, and closes the Task." },
        { "nodeId": "Inspections", "info": "The superintendent verifies the fix during their next 'Inspection' walk." }
      ]
    },
    // NAM - Project Management Essentials
    "nam-pm-essentials-change": {
      "name": "Change Event Management",
      "steps": [
        { "nodeId": "RFIs", "info": "An RFI response confirms a change, initiating the financial process." },
        { "nodeId": "Change Events", "info": "A 'Change Event' is created to track the potential cost." },
        { "nodeId": "Commitments", "info": "A Commitment Change Order (CCO) is created to get pricing from the subcontractor." },
        { "nodeId": "Change Orders", "info": "The PCO is created and sent to the owner for approval." },
        // --- THIS LINE IS NOW FIXED ---
        { "nodeId": "T&M Tickets", "info": "The superintendent tracks the extra work being done in the field using a T&M Ticket." }
      ]
    }
    // Add more package-specific tours here...
  },
  // AI-generated tours (initially empty)
  ai: {}
};

// Helper to flatten the nested tours structure for easier access by ID
const flatTours = {
  ...tours.platform,
  ...tours.package,
  ...tours.ai
};
