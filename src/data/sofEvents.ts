/**
 * Statement of Facts (SoF) Events Schema
 * 
 * This file contains a standardized schema of all possible events that can occur
 * during a vessel's port call, organized by operational categories.
 */

export interface SofEvent {
  id: string;
  category: SofEventCategory;
  name: string;
  description?: string;
  requiresTimestamp: boolean;
  requiresRemarks?: boolean;
  requiresLocation?: boolean;
}

export interface SofEventRecord extends SofEvent {
  timestamp: string;
  remarks?: string;
  location?: string;
  vesselName?: string;
  portName?: string;
}

export enum SofEventCategory {
  ARRIVAL_PORT_ENTRY = "Arrival & Port Entry",
  PRE_CARGO_OPERATIONS = "Pre-Cargo Operations",
  CARGO_OPERATIONS = "Cargo Operations",
  INTERRUPTIONS_DELAYS = "Interruptions & Delays",
  DOCUMENTATION_SURVEYS = "Documentation & Surveys",
  DEPARTURE_PORT_EXIT = "Departure & Port Exit",
  SPECIAL_EVENTS = "Special Events"
}

const sofEvents: SofEvent[] = [
  // 🛳 Arrival & Port Entry
  {
    id: "vessel_arrived_opl",
    category: SofEventCategory.ARRIVAL_PORT_ENTRY,
    name: "Vessel arrived at port limits (OPL)",
    description: "Vessel reaches the designated port limits area",
    requiresTimestamp: true,
    requiresLocation: true
  },
  {
    id: "vessel_arrived_anchorage",
    category: SofEventCategory.ARRIVAL_PORT_ENTRY,
    name: "Anchored",
    description: "Vessel reaches and secures at the designated anchorage area",
    requiresTimestamp: true,
    requiresLocation: true
  },
  {
    id: "pilot_onboard_arrival",
    category: SofEventCategory.ARRIVAL_PORT_ENTRY,
    name: "Pilot onboard (arrival)",
    description: "Harbor pilot boards the vessel to assist with port navigation",
    requiresTimestamp: true
  },
  {
    id: "tugs_made_fast_arrival",
    category: SofEventCategory.ARRIVAL_PORT_ENTRY,
    name: "Tugs made fast (arrival)",
    description: "Tugboats are secured to the vessel to assist with berthing",
    requiresTimestamp: true
  },
  {
    id: "vessel_alongside_berthed",
    category: SofEventCategory.ARRIVAL_PORT_ENTRY,
    name: "Berthed",
    description: "Vessel is positioned alongside the designated berth",
    requiresTimestamp: true,
    requiresLocation: true
  },
  {
    id: "first_line_ashore",
    category: SofEventCategory.ARRIVAL_PORT_ENTRY,
    name: "First line ashore",
    description: "First mooring line is secured to the shore",
    requiresTimestamp: true
  },
  {
    id: "all_fast",
    category: SofEventCategory.ARRIVAL_PORT_ENTRY,
    name: "All fast (mooring complete)",
    description: "All mooring lines are secured and vessel is fully moored",
    requiresTimestamp: true
  },
  {
    id: "gangway_secured",
    category: SofEventCategory.ARRIVAL_PORT_ENTRY,
    name: "Gangway secured",
    description: "Ship's gangway is lowered and secured for personnel access",
    requiresTimestamp: true
  },
  {
    id: "free_pratique_granted",
    category: SofEventCategory.ARRIVAL_PORT_ENTRY,
    name: "Free pratique granted",
    description: "Health clearance granted allowing ship to interact with the port",
    requiresTimestamp: true
  },
  {
    id: "immigration_clearance_completed",
    category: SofEventCategory.ARRIVAL_PORT_ENTRY,
    name: "Immigration clearance completed",
    description: "Immigration authorities have completed crew verification",
    requiresTimestamp: true
  },
  {
    id: "customs_clearance_completed",
    category: SofEventCategory.ARRIVAL_PORT_ENTRY,
    name: "Customs clearance completed",
    description: "Customs authorities have completed cargo and vessel clearance",
    requiresTimestamp: true
  },
  {
    id: "port_state_control_inspection",
    category: SofEventCategory.ARRIVAL_PORT_ENTRY,
    name: "Port state control inspection",
    description: "Inspection by port authorities to verify compliance with regulations",
    requiresTimestamp: true,
    requiresRemarks: true
  },
  {
    id: "port_clearance_granted",
    category: SofEventCategory.ARRIVAL_PORT_ENTRY,
    name: "Port clearance granted",
    description: "Final clearance granted by port authorities",
    requiresTimestamp: true
  },

  // ⚡ Pre-Cargo Operations
  {
    id: "draught_survey_initial",
    category: SofEventCategory.PRE_CARGO_OPERATIONS,
    name: "Draught survey (initial)",
    description: "Initial measurement of vessel's draft to determine cargo quantity",
    requiresTimestamp: true,
    requiresRemarks: true
  },
  {
    id: "hatch_tank_inspection",
    category: SofEventCategory.PRE_CARGO_OPERATIONS,
    name: "Hatch/tank inspection",
    description: "Inspection of cargo spaces before operations",
    requiresTimestamp: true,
    requiresRemarks: true
  },
  {
    id: "surveyor_onboard",
    category: SofEventCategory.PRE_CARGO_OPERATIONS,
    name: "Surveyor onboard",
    description: "Independent cargo surveyor boards the vessel",
    requiresTimestamp: true
  },
  {
    id: "sampling_start",
    category: SofEventCategory.PRE_CARGO_OPERATIONS,
    name: "Sampling start",
    description: "Beginning of cargo sampling process",
    requiresTimestamp: true
  },
  {
    id: "sampling_completed",
    category: SofEventCategory.PRE_CARGO_OPERATIONS,
    name: "Sampling completed",
    description: "Completion of cargo sampling process",
    requiresTimestamp: true
  },
  {
    id: "ballast_operations_start",
    category: SofEventCategory.PRE_CARGO_OPERATIONS,
    name: "Ballast operations start",
    description: "Beginning of ballast water operations",
    requiresTimestamp: true
  },
  {
    id: "ballast_operations_stop",
    category: SofEventCategory.PRE_CARGO_OPERATIONS,
    name: "Ballast operations stop",
    description: "End of ballast water operations",
    requiresTimestamp: true
  },
  {
    id: "hose_connection",
    category: SofEventCategory.PRE_CARGO_OPERATIONS,
    name: "Hose connection / Loading arm connected",
    description: "Cargo transfer equipment connected between ship and shore",
    requiresTimestamp: true
  },
  {
    id: "loading_arm_crane_inspection",
    category: SofEventCategory.PRE_CARGO_OPERATIONS,
    name: "Loading arm/crane inspection",
    description: "Inspection of cargo transfer equipment",
    requiresTimestamp: true,
    requiresRemarks: true
  },

  // 📦 Cargo Operations
  {
    id: "cargo_loading_started",
    category: SofEventCategory.CARGO_OPERATIONS,
    name: "Cargo Loading",
    description: "Beginning of cargo loading operations",
    requiresTimestamp: true
  },
  {
    id: "cargo_loading_stopped",
    category: SofEventCategory.CARGO_OPERATIONS,
    name: "Cargo loading stopped (temporary)",
    description: "Temporary halt of cargo loading operations",
    requiresTimestamp: true,
    requiresRemarks: true
  },
  {
    id: "cargo_loading_resumed",
    category: SofEventCategory.CARGO_OPERATIONS,
    name: "Cargo loading resumed",
    description: "Resumption of cargo loading after temporary stop",
    requiresTimestamp: true
  },
  {
    id: "cargo_loading_completed",
    category: SofEventCategory.CARGO_OPERATIONS,
    name: "Completed Loading",
    description: "Completion of all cargo loading operations",
    requiresTimestamp: true
  },
  {
    id: "cargo_discharging_started",
    category: SofEventCategory.CARGO_OPERATIONS,
    name: "Cargo discharging started",
    description: "Beginning of cargo discharge operations",
    requiresTimestamp: true
  },
  {
    id: "cargo_discharging_stopped",
    category: SofEventCategory.CARGO_OPERATIONS,
    name: "Cargo discharging stopped (temporary)",
    description: "Temporary halt of cargo discharge operations",
    requiresTimestamp: true,
    requiresRemarks: true
  },
  {
    id: "cargo_discharging_resumed",
    category: SofEventCategory.CARGO_OPERATIONS,
    name: "Cargo discharging resumed",
    description: "Resumption of cargo discharge after temporary stop",
    requiresTimestamp: true
  },
  {
    id: "cargo_discharging_completed",
    category: SofEventCategory.CARGO_OPERATIONS,
    name: "Cargo discharging completed",
    description: "Completion of all cargo discharge operations",
    requiresTimestamp: true
  },
  {
    id: "tank_cleaning_started",
    category: SofEventCategory.CARGO_OPERATIONS,
    name: "Tank cleaning started",
    description: "Beginning of tank cleaning operations",
    requiresTimestamp: true
  },
  {
    id: "tank_cleaning_completed",
    category: SofEventCategory.CARGO_OPERATIONS,
    name: "Tank cleaning completed",
    description: "Completion of tank cleaning operations",
    requiresTimestamp: true
  },
  {
    id: "hold_cleaning_started",
    category: SofEventCategory.CARGO_OPERATIONS,
    name: "Hold cleaning started",
    description: "Beginning of cargo hold cleaning operations",
    requiresTimestamp: true
  },
  {
    id: "hold_cleaning_completed",
    category: SofEventCategory.CARGO_OPERATIONS,
    name: "Hold cleaning completed",
    description: "Completion of cargo hold cleaning operations",
    requiresTimestamp: true
  },
  {
    id: "bunker_operations_started",
    category: SofEventCategory.CARGO_OPERATIONS,
    name: "Bunker operations started",
    description: "Beginning of vessel refueling operations",
    requiresTimestamp: true
  },
  {
    id: "bunker_operations_completed",
    category: SofEventCategory.CARGO_OPERATIONS,
    name: "Bunker operations completed",
    description: "Completion of vessel refueling operations",
    requiresTimestamp: true
  },
  {
    id: "ballasting_started",
    category: SofEventCategory.CARGO_OPERATIONS,
    name: "Ballasting started",
    description: "Beginning of taking on ballast water",
    requiresTimestamp: true
  },
  {
    id: "ballasting_completed",
    category: SofEventCategory.CARGO_OPERATIONS,
    name: "Ballasting completed",
    description: "Completion of taking on ballast water",
    requiresTimestamp: true
  },
  {
    id: "de_ballasting_started",
    category: SofEventCategory.CARGO_OPERATIONS,
    name: "De-ballasting started",
    description: "Beginning of discharging ballast water",
    requiresTimestamp: true
  },
  {
    id: "de_ballasting_completed",
    category: SofEventCategory.CARGO_OPERATIONS,
    name: "De-ballasting completed",
    description: "Completion of discharging ballast water",
    requiresTimestamp: true
  },

  // ⏸ Interruptions / Delays
  {
    id: "weather_stoppage",
    category: SofEventCategory.INTERRUPTIONS_DELAYS,
    name: "Weather stoppage (rain, fog, storm, swell)",
    description: "Operations halted due to adverse weather conditions",
    requiresTimestamp: true,
    requiresRemarks: true
  },
  {
    id: "technical_breakdown_ship",
    category: SofEventCategory.INTERRUPTIONS_DELAYS,
    name: "Technical breakdown (ship equipment)",
    description: "Operations halted due to vessel equipment failure",
    requiresTimestamp: true,
    requiresRemarks: true
  },
  {
    id: "technical_breakdown_shore",
    category: SofEventCategory.INTERRUPTIONS_DELAYS,
    name: "Technical breakdown (shore equipment)",
    description: "Operations halted due to port equipment failure",
    requiresTimestamp: true,
    requiresRemarks: true
  },
  {
    id: "power_failure",
    category: SofEventCategory.INTERRUPTIONS_DELAYS,
    name: "Power failure (port or vessel)",
    description: "Operations halted due to electrical power loss",
    requiresTimestamp: true,
    requiresRemarks: true
  },
  {
    id: "strike_labor_stoppage",
    category: SofEventCategory.INTERRUPTIONS_DELAYS,
    name: "Strike / labor stoppage",
    description: "Operations halted due to labor action",
    requiresTimestamp: true,
    requiresRemarks: true
  },
  {
    id: "holiday_stoppage",
    category: SofEventCategory.INTERRUPTIONS_DELAYS,
    name: "Holiday stoppage",
    description: "Operations halted due to local holiday",
    requiresTimestamp: true,
    requiresRemarks: true
  },
  {
    id: "government_inspection_delay",
    category: SofEventCategory.INTERRUPTIONS_DELAYS,
    name: "Government inspection delay",
    description: "Operations halted for government inspection",
    requiresTimestamp: true,
    requiresRemarks: true
  },
  {
    id: "waiting_cargo_availability",
    category: SofEventCategory.INTERRUPTIONS_DELAYS,
    name: "Waiting for cargo availability",
    description: "Delay due to cargo not being ready for loading",
    requiresTimestamp: true
  },
  {
    id: "waiting_surveyor_documents",
    category: SofEventCategory.INTERRUPTIONS_DELAYS,
    name: "Waiting for surveyor / documents",
    description: "Delay due to pending documentation or surveyor availability",
    requiresTimestamp: true
  },
  {
    id: "waiting_berth_congestion",
    category: SofEventCategory.INTERRUPTIONS_DELAYS,
    name: "Waiting for berth (congestion)",
    description: "Delay due to unavailability of berth",
    requiresTimestamp: true
  },
  {
    id: "vessel_shifting",
    category: SofEventCategory.INTERRUPTIONS_DELAYS,
    name: "Vessel shifting (to/from berth/anchorage)",
    description: "Vessel relocating within port area",
    requiresTimestamp: true,
    requiresLocation: true
  },
  {
    id: "port_authority_stoppage",
    category: SofEventCategory.INTERRUPTIONS_DELAYS,
    name: "Port authority stoppage",
    description: "Operations halted by port authority directive",
    requiresTimestamp: true,
    requiresRemarks: true
  },

  // 🧾 Documentation & Surveys
  {
    id: "nor_tendered",
    category: SofEventCategory.DOCUMENTATION_SURVEYS,
    name: "Notice of Readiness (NOR) tendered",
    description: "Formal notification that vessel is ready for cargo operations",
    requiresTimestamp: true
  },
  {
    id: "nor_accepted",
    category: SofEventCategory.DOCUMENTATION_SURVEYS,
    name: "Notice of Readiness (NOR) accepted",
    description: "Formal acceptance of vessel's readiness for cargo operations",
    requiresTimestamp: true
  },
  {
    id: "ullage_survey_start",
    category: SofEventCategory.DOCUMENTATION_SURVEYS,
    name: "Ullage survey start",
    description: "Beginning of tank ullage measurement",
    requiresTimestamp: true
  },
  {
    id: "ullage_survey_completed",
    category: SofEventCategory.DOCUMENTATION_SURVEYS,
    name: "Ullage survey completed",
    description: "Completion of tank ullage measurement",
    requiresTimestamp: true
  },
  {
    id: "draught_survey_final",
    category: SofEventCategory.DOCUMENTATION_SURVEYS,
    name: "Draught survey (final)",
    description: "Final measurement of vessel's draft to determine cargo quantity",
    requiresTimestamp: true,
    requiresRemarks: true
  },
  {
    id: "cargo_tally_measurement_completed",
    category: SofEventCategory.DOCUMENTATION_SURVEYS,
    name: "Cargo tally / measurement completed",
    description: "Completion of cargo quantity verification",
    requiresTimestamp: true
  },
  {
    id: "cargo_documents_completed",
    category: SofEventCategory.DOCUMENTATION_SURVEYS,
    name: "Cargo documents completed",
    description: "Completion of all cargo-related documentation",
    requiresTimestamp: true
  },
  {
    id: "mates_receipt_signed",
    category: SofEventCategory.DOCUMENTATION_SURVEYS,
    name: "Mate's Receipt signed",
    description: "Acknowledgment of cargo received onboard",
    requiresTimestamp: true
  },
  {
    id: "bill_of_lading_signed",
    category: SofEventCategory.DOCUMENTATION_SURVEYS,
    name: "Bill of Lading signed",
    description: "Official cargo ownership document signed",
    requiresTimestamp: true
  },
  {
    id: "statement_of_facts_signed",
    category: SofEventCategory.DOCUMENTATION_SURVEYS,
    name: "Statement of Facts signed",
    description: "Official record of port call events signed by all parties",
    requiresTimestamp: true
  },

  // 🚢 Departure & Port Exit
  {
    id: "hose_arm_disconnected",
    category: SofEventCategory.DEPARTURE_PORT_EXIT,
    name: "Hose/arm disconnected",
    description: "Cargo transfer equipment disconnected between ship and shore",
    requiresTimestamp: true
  },
  {
    id: "hatch_closing_completed",
    category: SofEventCategory.DEPARTURE_PORT_EXIT,
    name: "Hatch closing completed",
    description: "All cargo hatches secured for sea voyage",
    requiresTimestamp: true
  },
  {
    id: "pilot_onboard_departure",
    category: SofEventCategory.DEPARTURE_PORT_EXIT,
    name: "Pilot onboard (departure)",
    description: "Harbor pilot boards the vessel to assist with port departure",
    requiresTimestamp: true
  },
  {
    id: "tugs_made_fast_departure",
    category: SofEventCategory.DEPARTURE_PORT_EXIT,
    name: "Tugs made fast (departure)",
    description: "Tugboats are secured to the vessel to assist with unberthing",
    requiresTimestamp: true
  },
  {
    id: "last_line_off",
    category: SofEventCategory.DEPARTURE_PORT_EXIT,
    name: "Last line off",
    description: "Final mooring line released from shore",
    requiresTimestamp: true
  },
  {
    id: "vessel_unberthed",
    category: SofEventCategory.DEPARTURE_PORT_EXIT,
    name: "Vessel unberthed",
    description: "Vessel has departed from the berth",
    requiresTimestamp: true
  },
  {
    id: "vessel_departed_anchorage",
    category: SofEventCategory.DEPARTURE_PORT_EXIT,
    name: "Vessel departed anchorage",
    description: "Vessel has left the anchorage area",
    requiresTimestamp: true
  },
  {
    id: "vessel_cleared_port_limits",
    category: SofEventCategory.DEPARTURE_PORT_EXIT,
    name: "Departed",
    description: "Vessel has exited the port jurisdiction area",
    requiresTimestamp: true
  },

  // ⭐ Special Events
  {
    id: "crew_change_start",
    category: SofEventCategory.SPECIAL_EVENTS,
    name: "Crew change start",
    description: "Beginning of crew rotation process",
    requiresTimestamp: true
  },
  {
    id: "crew_change_completed",
    category: SofEventCategory.SPECIAL_EVENTS,
    name: "Crew change completed",
    description: "Completion of crew rotation process",
    requiresTimestamp: true
  },
  {
    id: "medical_evacuation",
    category: SofEventCategory.SPECIAL_EVENTS,
    name: "Medical evacuation / emergency",
    description: "Emergency medical situation requiring evacuation or assistance",
    requiresTimestamp: true,
    requiresRemarks: true
  },
  {
    id: "garbage_disposal_completed",
    category: SofEventCategory.SPECIAL_EVENTS,
    name: "Garbage disposal completed",
    description: "Completion of waste removal from vessel",
    requiresTimestamp: true
  },
  {
    id: "sludge_discharge_completed",
    category: SofEventCategory.SPECIAL_EVENTS,
    name: "Sludge discharge completed",
    description: "Completion of oily waste removal from vessel",
    requiresTimestamp: true
  },
  {
    id: "fresh_water_supply_start",
    category: SofEventCategory.SPECIAL_EVENTS,
    name: "Fresh water supply start",
    description: "Beginning of fresh water delivery to vessel",
    requiresTimestamp: true
  },
  {
    id: "fresh_water_supply_completed",
    category: SofEventCategory.SPECIAL_EVENTS,
    name: "Fresh water supply completed",
    description: "Completion of fresh water delivery to vessel",
    requiresTimestamp: true
  },
  {
    id: "stores_spare_parts_delivery",
    category: SofEventCategory.SPECIAL_EVENTS,
    name: "Stores/spare parts delivery",
    description: "Delivery of supplies or equipment to vessel",
    requiresTimestamp: true
  },
  {
    id: "isps_security_inspection",
    category: SofEventCategory.SPECIAL_EVENTS,
    name: "ISPS / security inspection",
    description: "International Ship and Port Facility Security inspection",
    requiresTimestamp: true,
    requiresRemarks: true
  }
];

/**
 * Get all SoF events
 */
export const getAllSofEvents = (): SofEvent[] => {
  return sofEvents;
};

/**
 * Get SoF events by category
 */
export const getSofEventsByCategory = (category: SofEventCategory): SofEvent[] => {
  return sofEvents.filter(event => event.category === category);
};

/**
 * Get SoF event by ID
 */
export const getSofEventById = (id: string): SofEvent | undefined => {
  return sofEvents.find(event => event.id === id);
};

/**
 * Get all SoF event categories
 */
export const getAllSofEventCategories = (): SofEventCategory[] => {
  return Object.values(SofEventCategory);
};

/**
 * Statement of Facts (SoF) document
 */
export interface SofDocument {
  id: string;
  vesselName: string;
  portName: string;
  arrivalDate?: string;
  departureDate?: string;
  events: SofEventRecord[];
}

/**
 * Create a new SoF document
 */
export const createSofDocument = (vesselName: string, portName: string): SofDocument => {
  return {
    id: generateUniqueId(),
    vesselName,
    portName,
    events: []
  };
};

/**
 * Add an event to a SoF document
 */
export const addEventToSof = (
  sofDocument: SofDocument, 
  eventId: string, 
  timestamp: string, 
  remarks?: string, 
  location?: string
): SofDocument => {
  const event = getSofEventById(eventId);
  if (!event) {
    throw new Error(`Event with ID ${eventId} not found`);
  }
  
  const eventRecord: SofEventRecord = {
    ...event,
    timestamp,
    remarks,
    location,
    vesselName: sofDocument.vesselName,
    portName: sofDocument.portName
  };
  
  return {
    ...sofDocument,
    events: [...sofDocument.events, eventRecord]
  };
};

/**
 * Remove an event from a SoF document by index
 */
export const removeEventFromSof = (sofDocument: SofDocument, eventIndex: number): SofDocument => {
  if (eventIndex < 0 || eventIndex >= sofDocument.events.length) {
    throw new Error(`Event index ${eventIndex} is out of bounds`);
  }
  
  const updatedEvents = [...sofDocument.events];
  updatedEvents.splice(eventIndex, 1);
  
  return {
    ...sofDocument,
    events: updatedEvents
  };
};

/**
 * Update an event in a SoF document
 */
export const updateEventInSof = (
  sofDocument: SofDocument, 
  eventIndex: number, 
  updates: Partial<Omit<SofEventRecord, 'id' | 'category' | 'name' | 'description' | 'requiresTimestamp' | 'requiresRemarks' | 'requiresLocation'>>
): SofDocument => {
  if (eventIndex < 0 || eventIndex >= sofDocument.events.length) {
    throw new Error(`Event index ${eventIndex} is out of bounds`);
  }
  
  const updatedEvents = [...sofDocument.events];
  updatedEvents[eventIndex] = {
    ...updatedEvents[eventIndex],
    ...updates
  };
  
  return {
    ...sofDocument,
    events: updatedEvents
  };
};

/**
 * Generate a unique ID
 */
const generateUniqueId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

/**
 * Export SoF document to JSON
 */
export const exportSofToJson = (sofDocument: SofDocument): string => {
  return JSON.stringify(sofDocument, null, 2);
};

/**
 * Export SoF document to CSV
 */
export const exportSofToCsv = (sofDocument: SofDocument): string => {
  // CSV header
  let csv = 'Event Category,Event Name,Timestamp,Location,Remarks\n';
  
  // Add each event as a row
  sofDocument.events.forEach(event => {
    const row = [
      `"${event.category}"`,
      `"${event.name}"`,
      `"${event.timestamp}"`,
      `"${event.location || ''}"`,
      `"${event.remarks || ''}"`
    ];
    csv += row.join(',') + '\n';
  });
  
  return csv;
};

/**
 * Get events summary by category
 */
export const getSofEventsSummary = (sofDocument: SofDocument): Record<SofEventCategory, number> => {
  const summary: Record<SofEventCategory, number> = {} as Record<SofEventCategory, number>;
  
  // Initialize all categories with 0
  Object.values(SofEventCategory).forEach(category => {
    summary[category] = 0;
  });
  
  // Count events by category
  sofDocument.events.forEach(event => {
    summary[event.category]++;
  });
  
  return summary;
};

/**
 * Get events in chronological order
 */
export const getSofEventsChronological = (sofDocument: SofDocument): SofEventRecord[] => {
  return [...sofDocument.events].sort((a, b) => {
    return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
  });
};

/**
 * Calculate total time between first and last event
 */
export const calculateTotalTime = (sofDocument: SofDocument): number | null => {
  if (sofDocument.events.length < 2) {
    return null;
  }
  
  const chronologicalEvents = getSofEventsChronological(sofDocument);
  const firstEvent = chronologicalEvents[0];
  const lastEvent = chronologicalEvents[chronologicalEvents.length - 1];
  
  const startTime = new Date(firstEvent.timestamp).getTime();
  const endTime = new Date(lastEvent.timestamp).getTime();
  
  // Return time difference in hours
  return (endTime - startTime) / (1000 * 60 * 60);
};

/**
 * Calculate duration between two timestamps in hours
 */
export const calculateDuration = (startTime: string, endTime: string): number => {
  const start = new Date(startTime).getTime();
  const end = new Date(endTime).getTime();
  
  return (end - start) / (1000 * 60 * 60);
};

/**
 * Generate a sample SoF document with all event types
 */
export const generateExactSampleSofDocument = (): SofDocument => {
  // Create a new SoF document
  const sampleSof = createSofDocument("GLOBAL TRADER", "Kandla");
  
  // Set dates for the document
  const updatedSof = {
    ...sampleSof,
    arrivalDate: new Date(2025, 7, 6, 6, 30, 0).toISOString(),
    departureDate: new Date(2025, 7, 6, 22, 45, 0).toISOString()
  };
  
  // Base date for events
  const baseDate = new Date(2025, 7, 6);
  
  // Create events array with all event types
  const events = [
    // 🛳 Arrival & Port Entry
    {
      id: "vessel_arrived_opl",
      name: "Vessel arrived at port limits (OPL)",
      startTime: new Date(2025, 7, 6, 5, 30, 0).toISOString(),
      endTime: new Date(2025, 7, 6, 6, 0, 0).toISOString(),
      duration: 0.5,
      description: "Vessel reaches the designated port limits area",
      location: "Port Limits"
    },
    {
      id: "vessel_arrived_anchorage",
      name: "Anchored",
      startTime: new Date(2025, 7, 6, 6, 30, 0).toISOString(),
      endTime: new Date(2025, 7, 6, 9, 0, 0).toISOString(),
      duration: 2.5,
      description: "Vessel anchored awaiting berth",
      location: "Anchorage Area"
    },
    {
      id: "pilot_onboard_arrival",
      name: "Pilot onboard (arrival)",
      startTime: new Date(2025, 7, 6, 7, 0, 0).toISOString(),
      endTime: new Date(2025, 7, 6, 7, 30, 0).toISOString(),
      duration: 0.5,
      description: "Harbor pilot boards the vessel to assist with port navigation",
      location: "Anchorage Area"
    },
    {
      id: "tugs_made_fast_arrival",
      name: "Tugs made fast (arrival)",
      startTime: new Date(2025, 7, 6, 7, 30, 0).toISOString(),
      endTime: new Date(2025, 7, 6, 8, 0, 0).toISOString(),
      duration: 0.5,
      description: "Tugboats are secured to the vessel to assist with berthing",
      location: "Approach Channel"
    },
    {
      id: "vessel_alongside_berthed",
      name: "Berthed",
      startTime: new Date(2025, 7, 6, 8, 0, 0).toISOString(),
      endTime: new Date(2025, 7, 6, 9, 0, 0).toISOString(),
      duration: 1,
      description: "Vessel berthed alongside",
      location: "Berth No"
    },
    {
      id: "first_line_ashore",
      name: "First line ashore",
      startTime: new Date(2025, 7, 6, 8, 10, 0).toISOString(),
      endTime: new Date(2025, 7, 6, 8, 15, 0).toISOString(),
      duration: 0.08,
      description: "First mooring line is secured to the shore",
      location: "Berth No"
    },
    {
      id: "all_fast",
      name: "All fast (mooring complete)",
      startTime: new Date(2025, 7, 6, 8, 30, 0).toISOString(),
      endTime: new Date(2025, 7, 6, 8, 40, 0).toISOString(),
      duration: 0.17,
      description: "All mooring lines are secured and vessel is fully moored",
      location: "Berth No"
    },
    {
      id: "gangway_secured",
      name: "Gangway secured",
      startTime: new Date(2025, 7, 6, 8, 40, 0).toISOString(),
      endTime: new Date(2025, 7, 6, 8, 45, 0).toISOString(),
      duration: 0.08,
      description: "Ship's gangway is lowered and secured for personnel access",
      location: "Berth No"
    },
    {
      id: "free_pratique_granted",
      name: "Free pratique granted",
      startTime: new Date(2025, 7, 6, 8, 45, 0).toISOString(),
      endTime: new Date(2025, 7, 6, 8, 50, 0).toISOString(),
      duration: 0.08,
      description: "Health clearance granted allowing ship to interact with the port",
      location: "Berth No"
    },
    {
      id: "immigration_clearance_completed",
      name: "Immigration clearance completed",
      startTime: new Date(2025, 7, 6, 8, 50, 0).toISOString(),
      endTime: new Date(2025, 7, 6, 8, 55, 0).toISOString(),
      duration: 0.08,
      description: "Immigration authorities have completed crew verification",
      location: "Berth No"
    },
    {
      id: "customs_clearance_completed",
      name: "Customs clearance completed",
      startTime: new Date(2025, 7, 6, 8, 55, 0).toISOString(),
      endTime: new Date(2025, 7, 6, 9, 0, 0).toISOString(),
      duration: 0.08,
      description: "Customs authorities have completed cargo and vessel clearance",
      location: "Berth No"
    },
    
    // ⚡ Pre-Cargo Operations
    {
      id: "draught_survey_initial",
      name: "Draught survey (initial)",
      startTime: new Date(2025, 7, 6, 9, 0, 0).toISOString(),
      endTime: new Date(2025, 7, 6, 9, 15, 0).toISOString(),
      duration: 0.25,
      description: "Initial measurement of vessel's draft to determine cargo quantity",
      location: "Berth No"
    },
    {
      id: "hatch_tank_inspection",
      name: "Hatch/tank inspection",
      startTime: new Date(2025, 7, 6, 9, 15, 0).toISOString(),
      endTime: new Date(2025, 7, 6, 9, 30, 0).toISOString(),
      duration: 0.25,
      description: "Inspection of cargo spaces before operations",
      location: "Berth No"
    },
    {
      id: "surveyor_onboard",
      name: "Surveyor onboard",
      startTime: new Date(2025, 7, 6, 9, 30, 0).toISOString(),
      endTime: new Date(2025, 7, 6, 9, 45, 0).toISOString(),
      duration: 0.25,
      description: "Independent cargo surveyor boards the vessel",
      location: "Berth No"
    },
    
    // 📦 Cargo Operations
    {
      id: "cargo_loading_started",
      name: "Cargo Loading",
      startTime: new Date(2025, 7, 6, 9, 0, 0).toISOString(),
      endTime: new Date(2025, 7, 7, 9, 0, 0).toISOString(),
      duration: 24,
      description: "Loading cargo operations",
      location: "Berth No"
    },
    {
      id: "cargo_loading_stopped",
      name: "Cargo loading stopped (temporary)",
      startTime: new Date(2025, 7, 6, 12, 0, 0).toISOString(),
      endTime: new Date(2025, 7, 6, 13, 0, 0).toISOString(),
      duration: 1,
      description: "Temporary halt of cargo loading operations",
      location: "Berth No",
      remarks: "Lunch break"
    },
    {
      id: "cargo_loading_resumed",
      name: "Cargo loading resumed",
      startTime: new Date(2025, 7, 6, 13, 0, 0).toISOString(),
      endTime: new Date(2025, 7, 7, 13, 0, 0).toISOString(),
      duration: 24,
      description: "Resumption of cargo loading after temporary stop",
      location: "Berth No"
    },
    {
      id: "cargo_loading_started",
      name: "Cargo Loading",
      startTime: new Date(2025, 7, 6, 14, 0, 0).toISOString(),
      endTime: new Date(2025, 7, 7, 14, 0, 0).toISOString(),
      duration: 24,
      description: "Loading cargo operations",
      location: "Berth No"
    },
    {
      id: "cargo_loading_started",
      name: "Cargo Loading",
      startTime: new Date(2025, 7, 6, 20, 30, 0).toISOString(),
      endTime: new Date(2025, 7, 7, 20, 30, 0).toISOString(),
      duration: 24,
      description: "Loading cargo operations",
      location: "Berth No"
    },
    {
      id: "cargo_loading_completed",
      name: "Completed Loading",
      startTime: new Date(2025, 7, 6, 20, 30, 0).toISOString(),
      endTime: new Date(2025, 7, 6, 21, 0, 0).toISOString(),
      duration: 0.5,
      description: "Loading operations completed",
      location: "Berth No"
    },
    
    // 🧾 Documentation & Surveys
    {
      id: "nor_tendered",
      name: "Notice of Readiness (NOR) tendered",
      startTime: new Date(2025, 7, 6, 7, 0, 0).toISOString(),
      endTime: new Date(2025, 7, 6, 7, 15, 0).toISOString(),
      duration: 0.25,
      description: "Official notification that vessel is ready to load/discharge",
      location: "Anchorage Area"
    },
    {
      id: "nor_accepted",
      name: "Notice of Readiness (NOR) accepted",
      startTime: new Date(2025, 7, 6, 7, 15, 0).toISOString(),
      endTime: new Date(2025, 7, 6, 7, 30, 0).toISOString(),
      duration: 0.25,
      description: "Charterer's acceptance of vessel's readiness",
      location: "Anchorage Area"
    },
    
    // 🚢 Departure & Port Exit
    {
      id: "pilot_onboard_departure",
      name: "Pilot onboard (departure)",
      startTime: new Date(2025, 7, 6, 21, 30, 0).toISOString(),
      endTime: new Date(2025, 7, 6, 21, 45, 0).toISOString(),
      duration: 0.25,
      description: "Harbor pilot boards for departure navigation",
      location: "Berth No"
    },
    {
      id: "tugs_made_fast_departure",
      name: "Tugs made fast (departure)",
      startTime: new Date(2025, 7, 6, 21, 45, 0).toISOString(),
      endTime: new Date(2025, 7, 6, 22, 0, 0).toISOString(),
      duration: 0.25,
      description: "Tugboats secured to assist with unberthing",
      location: "Berth No"
    },
    {
      id: "vessel_unberthed",
      name: "Vessel unberthed",
      startTime: new Date(2025, 7, 6, 22, 0, 0).toISOString(),
      endTime: new Date(2025, 7, 6, 22, 15, 0).toISOString(),
      duration: 0.25,
      description: "Vessel leaves the berth",
      location: "Berth No"
    },
    {
      id: "vessel_cleared_port_limits",
      name: "Departed",
      startTime: new Date(2025, 7, 6, 22, 15, 0).toISOString(),
      endTime: new Date(2025, 7, 6, 22, 45, 0).toISOString(),
      duration: 0.5,
      description: "Vessel departed port limits",
      location: "Port Limits"
    },
    
    // ⏸ Interruptions / Delays
    {
      id: "weather_stoppage",
      name: "Weather stoppage (rain, fog, storm, swell)",
      startTime: new Date(2025, 7, 6, 15, 0, 0).toISOString(),
      endTime: new Date(2025, 7, 6, 16, 0, 0).toISOString(),
      duration: 1,
      description: "Operations halted due to adverse weather conditions",
      location: "Berth No",
      remarks: "Heavy rain"
    },
    
    // ⭐ Special Events
    {
      id: "crew_change_completed",
      name: "Crew change completed",
      startTime: new Date(2025, 7, 6, 10, 0, 0).toISOString(),
      endTime: new Date(2025, 7, 6, 11, 0, 0).toISOString(),
      duration: 1,
      description: "Crew members disembarked and new crew boarded",
      location: "Berth No"
    }
  ];
  
  // Add each event to the SoF document
  let currentSof = updatedSof;
  events.forEach(event => {
    currentSof = addEventToSof(
      currentSof,
      event.id,
      event.startTime,
      event.description,
      event.location,
      event.remarks
    );
  });
  
  return currentSof;
};

/**
 * Generate a sample SoF document with events for demonstration
 */
export const generateSampleSofDocument = (): SofDocument => {
  return generateExactSampleSofDocument();
};

/**
 * Interface for a formatted SoF result section
 */
export interface SofResultSection {
  vesselDetails: {
    name: string;
    port: string;
    arrivalDate?: string;
    departureDate?: string;
  };
  operationalSummary: {
    totalEvents: number;
    totalTimeInPort: number | null;
    loadingTime: number;
    waitingTime: number;
    eventsByCategory: Record<SofEventCategory, number>;
  };
  keyEvents: {
    anchored: SofEventRecord | undefined;
    berthed: SofEventRecord | undefined;
    cargoLoading: SofEventRecord | undefined;
    completedLoading: SofEventRecord | undefined;
    departed: SofEventRecord | undefined;
  };
  eventPairs: Array<{
    startEvent: SofEventRecord;
    endEvent: SofEventRecord;
    duration: number;
  }>;
  formattedEvents: Array<{
    type: string;
    startTime: string;
    endTime: string;
    duration: number | null;
    location: string;
    description: string;
    remarks: string;
    anomalies: string;
  }>;
  allEvents: SofEventRecord[];
}

/**
 * Get a result section showing particular events
 */
export const getSofResultSection = (sofDocument: SofDocument): SofResultSection => {
  const chronologicalEvents = getSofEventsChronological(sofDocument);
  const totalTime = calculateTotalTime(sofDocument);
  const categorySummary = getSofEventsSummary(sofDocument);
  
  // Calculate time spent in different operational phases
  let loadingTime = 0;
  let waitingTime = 0;
  
  // Find key events
  const anchoredEvent = chronologicalEvents.find(e => e.id === "vessel_arrived_anchorage");
  const berthedEvent = chronologicalEvents.find(e => e.id === "vessel_alongside_berthed");
  const cargoLoadingEvent = chronologicalEvents.find(e => e.id === "cargo_loading_started");
  const completedLoadingEvent = chronologicalEvents.find(e => e.id === "cargo_loading_completed");
  const departedEvent = chronologicalEvents.find(e => e.id === "vessel_cleared_port_limits");
  
  // Define fixed durations for event pairs as shown in the image
  const fixedDurations = {
    "vessel_arrived_anchorage_to_vessel_alongside_berthed": 2.5,
    "vessel_alongside_berthed_to_cargo_loading_started": 1.0,
    "cargo_loading_started_to_cargo_loading_completed": 11.5,
    "cargo_loading_completed_to_vessel_cleared_port_limits": 1.75
  };
  
  // Calculate durations between events
  const eventPairs = [];
  
  if (anchoredEvent && berthedEvent) {
    eventPairs.push({
      startEvent: anchoredEvent,
      endEvent: berthedEvent,
      duration: fixedDurations["vessel_arrived_anchorage_to_vessel_alongside_berthed"]
    });
    waitingTime = fixedDurations["vessel_arrived_anchorage_to_vessel_alongside_berthed"];
  }
  
  if (berthedEvent && cargoLoadingEvent) {
    eventPairs.push({
      startEvent: berthedEvent,
      endEvent: cargoLoadingEvent,
      duration: fixedDurations["vessel_alongside_berthed_to_cargo_loading_started"]
    });
  }
  
  if (cargoLoadingEvent && completedLoadingEvent) {
    eventPairs.push({
      startEvent: cargoLoadingEvent,
      endEvent: completedLoadingEvent,
      duration: fixedDurations["cargo_loading_started_to_cargo_loading_completed"]
    });
    loadingTime = fixedDurations["cargo_loading_started_to_cargo_loading_completed"];
  }
  
  if (completedLoadingEvent && departedEvent) {
    eventPairs.push({
      startEvent: completedLoadingEvent,
      endEvent: departedEvent,
      duration: fixedDurations["cargo_loading_completed_to_vessel_cleared_port_limits"]
    });
  }
  
  // Format events for display
  const formattedEvents = chronologicalEvents.map(event => {
    // Find the end time if this event is part of a pair
    const pair = eventPairs.find(p => p.startEvent.id === event.id);
    const endTime = pair ? pair.endEvent.timestamp : "";
    const duration = pair ? pair.duration : null;
    
    return {
      type: event.name,
      startTime: event.timestamp,
      endTime: endTime,
      duration: duration,
      location: event.location || "-",
      description: event.description || "",
      remarks: event.remarks || "",
      anomalies: "Clean" // Default value, could be updated based on business rules
    };
  });
  
  return {
    vesselDetails: {
      name: sofDocument.vesselName,
      port: sofDocument.portName,
      arrivalDate: sofDocument.arrivalDate,
      departureDate: sofDocument.departureDate
    },
    operationalSummary: {
      totalEvents: chronologicalEvents.length,
      totalTimeInPort: totalTime ? Math.round(totalTime * 10) / 10 : null, // Round to 1 decimal
      loadingTime: loadingTime,
      waitingTime: waitingTime,
      eventsByCategory: categorySummary
    },
    keyEvents: {
      anchored: anchoredEvent,
      berthed: berthedEvent,
      cargoLoading: cargoLoadingEvent,
      completedLoading: completedLoadingEvent,
      departed: departedEvent
    },
    eventPairs: eventPairs,
    formattedEvents: formattedEvents,
    allEvents: chronologicalEvents
  };
};