import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../Header';
import { HeroSection } from '../HeroSection';
import { AboutSection } from '../AboutSection';
import { TimelineSection } from '../TimelineSection';
import { CriticalitySection } from '../CriticalitySection';
import { AISection } from '../AISection';
import { FeaturesSection } from '../FeaturesSection';
import { InputsSection } from '../InputsSection';
import { TestimonialsSection } from '../TestimonialsSection';
import { BenefitsSection } from '../BenefitsSection';
import { MissionSection } from '../MissionSection';
import { CTASection } from '../CTASection';
import { Footer } from '../Footer';
import { Chatbot } from './Chatbot';

export interface ActionCommand {
  type: string;
  payload?: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  suggestions?: string[];
  action?: ActionCommand; // Optional action command for the UI
}

export class ChatbotService {
  private static instance: ChatbotService;
  private conversationHistory: ChatMessage[] = [];

  private constructor() {
    // Initialize with a welcome message if history is empty
    if (this.conversationHistory.length === 0) {
      this.conversationHistory.push({
        id: '1',
        text: "Hello! I'm your SoF Assistant. I can help you with document processing, maritime terminology, and answer questions about laytime calculations. How can I assist you today?",
        sender: 'bot',
        timestamp: new Date(),
        suggestions: this.getInitialSuggestions()
      });
    }
  }

  public static getInstance(): ChatbotService {
    if (!ChatbotService.instance) {
      ChatbotService.instance = new ChatbotService();
    }
    return ChatbotService.instance;
  }

  public generateResponse(userMessage: string): Promise<string> {
    // Store user message in history
    this.conversationHistory.push({
      id: Date.now().toString(),
      text: userMessage,
      sender: 'user',
      timestamp: new Date()
    });

    // Simulate API delay for realistic experience
    await new Promise((resolve: (value: void) => void) => setTimeout(resolve, 800 + Math.random() * 1500));

    const response = this.getContextualResponse(userMessage.toLowerCase());
    
    // Store bot response in history (action will be added by Chatbot component)
    this.conversationHistory.push({
      id: (Date.now() + 1).toString(),
      text: response,
      sender: 'bot',
      timestamp: new Date()
    });

    return response;
  }

  private getContextualResponse(message: string): string {
    // Define patterns and their corresponding responses/actions
    const patterns = [
      {
        keywords: ['upload', 'file', 'document', 'process new'],
        response: this.getUploadHelp(),
        action: { type: 'NAVIGATE', payload: 'upload' }
      },
      {
        keywords: ['format', 'support', 'type', 'what files'],
        response: this.getFormatInfo()
      },
      {
        keywords: ['laytime', 'calculation', 'demurrage', 'despatch'],
        response: this.getLaytimeInfo()
      },
      {
        keywords: ['status', 'processing', 'progress', 'active jobs'],
        response: this.getProcessingInfo(),
        action: { type: 'NAVIGATE', payload: 'processing' }
      },
      {
        keywords: ['event', 'extract', 'maritime events', 'what do you extract'],
        response: this.getEventInfo()
      },
      {
        keywords: ['error', 'problem', 'issue', 'trouble', 'fix'],
        response: this.getTroubleshootingInfo()
      },
      {
        keywords: ['download', 'export', 'save', 'get data'],
        response: this.getDownloadInfo(),
        action: { type: 'NAVIGATE', payload: 'results' }
      },
      {
        keywords: ['help', 'support', 'assistance', 'guide'],
        response: this.getGeneralHelp()
      },
      {
        keywords: ['hello', 'hi', 'hey', 'greetings'],
        response: this.getGreeting()
      },
      {
        keywords: ['thank', 'thanks', 'appreciate'],
        response: this.getThankYou()
      },
      {
        keywords: ['price', 'cost', 'pricing', 'plan', 'subscription'],
        response: this.getPricingInfo()
      },
      {
        keywords: ['security', 'privacy', 'data protection'],
        response: this.getSecurityInfo()
      },
      {
        keywords: ['api', 'integration', 'developer', 'connect'],
        response: this.getAPIInfo()
      },
      {
        keywords: ['analytics', 'insights', 'trends', 'charts'],
        response: this.getAnalyticsInfo(),
        action: { type: 'NAVIGATE', payload: 'analytics' }
      },
      {
        keywords: ['history', 'past files', 'previous documents'],
        response: this.getHistoryInfo(),
        action: { type: 'NAVIGATE', payload: 'history' }
      },
      {
        keywords: ['settings', 'configure', 'preferences'],
        response: this.getSettingsInfo(),
        action: { type: 'NAVIGATE', payload: 'settings' }
      },
      {
        keywords: ['about us', 'company', 'mission', 'team'],
        response: this.getAboutUsInfo()
      },
      {
        keywords: ['contact', 'reach out', 'get in touch'],
        response: this.getContactInfo()
      },
      {
        keywords: ['features', 'capabilities', 'what can you do'],
        response: this.getFeaturesInfo()
      },
      {
        keywords: ['benefits', 'advantages', 'why use'],
        response: this.getBenefitsInfo()
      },
      {
        keywords: ['roadmap', 'future', 'updates'],
        response: this.getRoadmapInfo()
      },
      {
        keywords: ['documentation', 'docs', 'manual'],
        response: this.getDocumentationInfo()
      },
      {
        keywords: ['feedback', 'suggest', 'improve'],
        response: this.getFeedbackInfo()
      },
      {
        keywords: ['vessel info', 'ship details', 'vessel type', 'ship classification'],
        response: this.getVesselInfo()
      },
      {
        keywords: ['port info', 'port details', 'berth', 'terminal', 'jetty'],
        response: this.getPortInfo()
      },
      {
        keywords: ['weather delay', 'bad weather', 'storm', 'weather working day'],
        response: this.getWeatherDelayInfo()
      },
      {
        keywords: ['nor', 'notice of readiness', 'tendering'],
        response: this.getNORInfo()
      },
      {
        keywords: ['demurrage calculation', 'demurrage rate', 'demurrage claim'],
        response: this.getDemurrageCalculationInfo()
      },
      {
        keywords: ['maritime terminology', 'shipping terms', 'glossary', 'definitions', 'abbreviations'],
        response: this.getMaritimeTerminologyInfo()
      },
      {
        keywords: ['charter party', 'cp', 'charterparty', 'voyage charter', 'time charter', 'bareboat charter', 'contract of affreightment'],
        response: this.getCharterPartyInfo()
      },
      {
        keywords: ['incoterms', 'trade terms', 'fob', 'cif', 'cfr', 'fas', 'exw', 'ddp', 'dap', 'shipping terms'],
        response: this.getIncotermsInfo()
      },
      {
        keywords: ['cargo types', 'cargo classification', 'bulk cargo', 'break bulk', 'container cargo', 'liquid cargo'],
        response: this.getCargoTypesInfo()
      }
    ];

    // Find matching pattern
    for (const pattern of patterns) {
      if (pattern.keywords.some(keyword => message.includes(keyword))) {
        let responseText = pattern.response;
        if (pattern.action) {
          responseText += ` [ACTION:${pattern.action.type}:${pattern.action.payload || ''}]`;
        }
        return responseText;
      }
    }

    // Default response with helpful suggestions
    return this.getDefaultResponse();
  }

  // --- Knowledge Base Responses ---

  public getInitialSuggestions(): string[] {
    return [
      "How do I upload a document?",
      "What file formats are supported?",
      "Explain laytime calculations",
      "Show processing status",
      "Maritime terminology help",
      "Tell me about charter party types",
      "Explain common Incoterms",
      "What vessel information do you track?",
      "How do you handle weather delays?",
      "What is Notice of Readiness?",
      "What cargo types do you support?"
    ];
  }
  
  private getMaritimeTerminologyInfo(): string {
    return `**📚 Maritime Terminology**

**Laytime Terms:**
• **Laytime** - The time allowed for loading/discharging cargo
• **Demurrage** - Compensation paid when laytime is exceeded
• **Despatch** - Reward paid when operations complete before laytime expires
• **Laycan** - The period between the earliest and latest dates when a vessel can present for loading
• **Reversible Laytime** - When loading and discharging time is combined
• **SHINC** - Sundays and Holidays Included
• **SHEX** - Sundays and Holidays Excluded
• **WIPON** - Whether In Port Or Not
• **WCCON** - Whether Customs Cleared Or Not
• **WIFPON** - Whether In Free Pratique Or Not
• **FHEX** - Fridays and Holidays Excluded (used in Muslim countries)
• **DLOSP** - Dropping Last Outward Sea Pilot
• **AFSPS** - All Fast, Secured, Pilot Station

**Vessel Operation Terms:**
• **ETA** - Estimated Time of Arrival
• **ETD** - Estimated Time of Departure
• **NOR** - Notice of Readiness
• **SOF** - Statement of Facts
• **Laydays** - The days allowed for loading/discharging
• **Ullage** - The empty space in a cargo tank
• **Draft/Draught** - The depth of a vessel below the waterline
• **Trim** - The difference between forward and aft draft
• **Freeboard** - Distance from waterline to main deck
• **Air Draft** - Height from waterline to highest point of vessel
• **DWAT/DWT** - Deadweight Tonnage
• **GT** - Gross Tonnage
• **NT** - Net Tonnage
• **LOA** - Length Overall
• **Beam** - Width of the vessel at its widest point

**Charter Party Types:**
• **Voyage Charter** - Hiring a vessel for a specific voyage
• **Time Charter** - Hiring a vessel for a specific period
• **Bareboat Charter** - Hiring a vessel without crew
• **Contract of Affreightment (COA)** - Agreement to carry specific quantities of cargo
• **Consecutive Voyage Charter** - Multiple voyages in sequence
• **Slot Charter** - Hiring specific container slots on a vessel

**Incoterms:**
• **FOB** - Free On Board
• **CIF** - Cost, Insurance, and Freight
• **CFR** - Cost and Freight
• **FAS** - Free Alongside Ship
• **DDP** - Delivered Duty Paid
• **EXW** - Ex Works
• **DAP** - Delivered At Place
• **CIP** - Carriage and Insurance Paid To

**Port Operations:**
• **Berth** - Designated location where vessel docks
• **Layberth** - Berth used for idle vessels
• **Anchorage** - Designated waiting area for vessels
• **Fenders** - Protective cushioning between vessel and berth
• **Bollards** - Posts on quay for securing mooring lines
• **Stevedores** - Workers who load and unload cargo
• **Pilot** - Local expert who guides vessels in port waters
• **Tug** - Small powerful boat used to maneuver larger vessels
• **Draft Survey** - Measurement of vessel's displacement to determine cargo weight
• **Free Pratique** - Permission given to a ship to enter port after health clearance

**Cargo Types:**
• **Bulk Cargo** - Unpackaged homogeneous cargo
• **Break Bulk** - Cargo transported in packages or units
• **Neo-Bulk** - Cargo that is pre-packaged, counted as units
• **Containerized** - Cargo transported in standard containers
• **Ro-Ro** - Roll-on/Roll-off cargo like vehicles
• **Liquid Bulk** - Liquid cargoes transported in tankers
• **Reefer Cargo** - Refrigerated cargo requiring temperature control

**Documentation:**
• **B/L** - Bill of Lading
• **CP** - Charter Party
• **NOR** - Notice of Readiness
• **SOF** - Statement of Facts
• **LOP** - Letter of Protest
• **LOI** - Letter of Indemnity
• **Mate's Receipt** - Receipt for cargo loaded aboard a vessel
• **Sea Waybill** - Non-negotiable transport document
• **Time Sheet** - Record of laytime used

Understanding these terms is essential for accurate interpretation of shipping documents and charter parties.`;
  }

  private getCharterPartyInfo(): string {
    return `**📄 Charter Party Information**

**What is a Charter Party?**
A charter party (CP) is a contract between a shipowner and a charterer for the hire of a vessel. It outlines the terms, conditions, rights, and obligations of both parties during the charter period.

**Main Types of Charter Parties:**

**1. Voyage Charter Party:**
• Vessel hired for specific voyage(s) from loading to discharge port
• Freight paid per ton of cargo or as lump sum
• Shipowner responsible for vessel costs and operations
• Key clauses: laytime, demurrage, freight payment, loading/discharge ports
• Common forms: GENCON, ASBATANKVOY, COAL-OREVOY

**2. Time Charter Party:**
• Vessel hired for a specific period (months/years)
• Hire paid per day/month regardless of vessel utilization
• Charterer directs vessel's commercial operation
• Shipowner maintains vessel and provides crew
• Key clauses: hire payment, off-hire, trading limits, redelivery
• Common forms: NYPE, BALTIME, BOXTIME

**3. Bareboat/Demise Charter:**
• Charterer takes full control of vessel including crewing
• Charterer responsible for all operating costs
• Shipowner only maintains ownership title
• Long-term arrangement (often years)
• Common forms: BARECON

**4. Contract of Affreightment (COA):**
• Agreement to carry specific quantities of cargo
• Multiple voyages over a period of time
• Shipowner free to use any suitable vessel
• Based on cargo quantity rather than specific vessel

**Important Charter Party Clauses:**
• **Laytime & Demurrage** - Time allowed for loading/discharging
• **Safe Port Warranty** - Guarantee of port safety
• **Force Majeure** - Provisions for extraordinary circumstances
• **Deviation** - Allowed route changes
• **Seaworthiness** - Vessel condition warranty
• **Arbitration** - Dispute resolution mechanism
• **Laycan** - Vessel presentation window
• **Ice Clause** - Provisions for ice conditions
• **War Risks** - Provisions for war/conflict areas

**How We Process Charter Parties:**
• Extract key terms and conditions
• Identify laytime definitions and exceptions
• Determine demurrage/despatch rates
• Capture specific requirements for NOR
• Identify allowed cargo operations times
• Extract any special terms or exceptions

Understanding the charter party is essential for accurate laytime and demurrage calculations.`;
  }

  private getIncotermsInfo(): string {
    return `**🌐 Incoterms Information**

**What are Incoterms?**
Incoterms (International Commercial Terms) are standardized trade terms published by the International Chamber of Commerce (ICC) that define the responsibilities of sellers and buyers for the delivery of goods under sales contracts.

**Current Version: Incoterms 2020**

**Key Incoterms in Maritime Shipping:**

**1. FOB (Free On Board):**
• Seller delivers goods on board the vessel
• Risk transfers when goods cross ship's rail
• Seller clears goods for export
• Buyer arranges and pays for shipping, insurance, import duties
• Commonly used for bulk cargo and container shipments

**2. CIF (Cost, Insurance and Freight):**
• Seller pays costs and freight to bring goods to destination port
• Seller must procure minimum insurance coverage
• Risk transfers when goods are loaded on vessel
• Buyer responsible for import clearance and delivery to final destination
• Popular for letter of credit transactions

**3. CFR (Cost and Freight):**
• Similar to CIF but without insurance requirement
• Seller pays for transport to named port
• Risk transfers when goods are loaded on vessel
• Buyer arranges insurance and handles import formalities

**4. FAS (Free Alongside Ship):**
• Seller delivers goods alongside vessel at named port
• Seller handles export clearance
• Risk transfers when goods are placed alongside the ship
• Buyer handles loading costs and all subsequent transportation
• Often used for heavy lift or bulk cargo

**5. EXW (Ex Works):**
• Minimal obligation for seller
• Buyer responsible for all transportation and risks
• Seller makes goods available at their premises
• Not ideal for international shipping but sometimes used

**6. DAP (Delivered at Place):**
• Seller delivers goods ready for unloading at named place
• Seller bears all risks until delivery
• Buyer responsible for import clearance and duties
• Useful for door-to-door deliveries

**7. DDP (Delivered Duty Paid):**
• Maximum obligation for seller
• Seller responsible for delivering goods to named destination with import duties paid
• Seller bears all costs and risks
• Buyer simply receives goods at named destination

**Importance in Maritime Documentation:**
• Determines transfer of risk between parties
• Clarifies who pays for freight, insurance, duties
• Establishes documentation responsibilities
• Affects laytime commencement in some cases
• Critical for proper invoicing and payment terms

Incoterms should always be specified with named place and Incoterms version (e.g., "FOB Shanghai Incoterms 2020").`;
  }

  private getCargoTypesInfo(): string {
    return `**📦 Cargo Types Information**

**Major Cargo Classifications:**

**1. Bulk Cargo:**
• Unpackaged homogeneous cargo loaded directly into vessel's hold
• Not individually counted, typically measured by weight or volume
• Examples: coal, grain, ore, cement, fertilizers
• Vessel types: bulk carriers, ore carriers
• Loading/discharge: typically via conveyor belts, grabs, or pneumatic systems
• Special considerations: trim, stability, cargo shifting, liquefaction risks

**2. Break Bulk Cargo:**
• Non-containerized cargo packed in units
• Individually counted pieces handled separately
• Examples: bagged goods, drums, crates, machinery, steel products
• Vessel types: general cargo vessels, multi-purpose vessels
• Loading/discharge: ship's cranes, shore cranes, forklifts
• Special considerations: proper stowage, securing, protection from elements

**3. Neo-Bulk Cargo:**
• Homogeneous cargo items that are counted as units
• Examples: vehicles, lumber, paper rolls, steel coils
• Vessel types: specialized carriers (car carriers, forest product carriers)
• Loading/discharge: specialized ramps, cranes with specific attachments
• Special considerations: securing against movement, protection from damage

**4. Containerized Cargo:**
• Cargo packed in standard shipping containers (20ft, 40ft, etc.)
• Standardized handling and intermodal transport
• Examples: manufactured goods, consumer products, some commodities
• Vessel types: container ships, feeder vessels
• Loading/discharge: container gantry cranes, specialized terminal equipment
• Special considerations: weight distribution, dangerous goods segregation

**5. Liquid Bulk Cargo:**
• Liquid cargoes transported in tanks
• Examples: crude oil, petroleum products, chemicals, edible oils, LNG
• Vessel types: tankers, product carriers, chemical tankers, gas carriers
• Loading/discharge: pipeline systems, pumps
• Special considerations: tank cleaning, product segregation, vapor control

**6. Ro-Ro (Roll-on/Roll-off) Cargo:**
• Wheeled cargo that can be driven on and off the vessel
• Examples: cars, trucks, trailers, heavy machinery
• Vessel types: Ro-Ro vessels, car carriers, ferries
• Loading/discharge: vessel ramps, shore ramps
• Special considerations: lashing, securing against movement

**7. Project Cargo:**
• Large, heavy, high-value, critical pieces of equipment
• Often requires special handling due to size/weight
• Examples: turbines, generators, reactors, large machinery
• Vessel types: heavy lift vessels, multi-purpose vessels
• Loading/discharge: specialized heavy lift cranes, floating cranes
• Special considerations: detailed lift plans, engineering studies

**8. Refrigerated Cargo (Reefer):**
• Temperature-controlled cargo
• Examples: fruits, vegetables, meat, fish, dairy, pharmaceuticals
• Vessel types: reefer vessels, container ships with reefer plugs
• Loading/discharge: specialized handling to maintain cold chain
• Special considerations: temperature monitoring, pre-cooling, ventilation

**9. Dangerous Goods:**
• Cargo that poses safety risks during transport
• Classified according to IMDG Code (International Maritime Dangerous Goods)
• Examples: explosives, gases, flammable liquids, toxic substances
• Special considerations: segregation, special stowage, documentation

**Cargo Documentation:**
• Bill of Lading (B/L)
• Cargo Manifest
• Dangerous Goods Declaration (when applicable)
• Packing List
• Certificate of Origin
• Phytosanitary/Health Certificates (when applicable)

Proper cargo classification is essential for determining appropriate vessel type, handling equipment, stowage requirements, and documentation.`;
  }

  public getSuggestionsForLastBotMessage(): string[] {
    // This can be made smarter based on the last bot message's topic
    const lastBotMessage = this.conversationHistory[this.conversationHistory.length - 1];
    if (lastBotMessage && lastBotMessage.sender === 'bot') {
      const text = lastBotMessage.text.toLowerCase();
      if (text.includes('upload')) return ["Show me the upload page", "What's the max file size?", "Can I upload multiple files?"];
      if (text.includes('laytime')) return ["What is demurrage?", "How accurate are calculations?", "Can I see an example?"];
      if (text.includes('status')) return ["Take me to processing status", "How long does it take?", "What if a job fails?"];
      if (text.includes('download')) return ["Show me my results", "Download as CSV", "What data is included?"];
      if (text.includes('analytics')) return ["Show me analytics", "What kind of charts are there?", "How is data visualized?"];
      if (text.includes('error') || text.includes('troubleshooting')) return ["Contact support", "Clear my data", "What are common upload errors?"];
      if (text.includes('api')) return ["Show API docs", "How to integrate?", "What are webhooks?"];
      if (text.includes('pricing')) return ["Tell me about the free trial", "How to get a custom quote?", "What are enterprise features?"];
      if (text.includes('security')) return ["Is my data safe?", "Are you GDPR compliant?", "Do you store my documents?"];
      if (text.includes('features')) return ["Tell me about AI extraction", "What is template-agnostic parsing?", "How is data structured?"];
      if (text.includes('benefits')) return ["How does it save time?", "How does it reduce errors?", "What about audit readiness?"];
      if (text.includes('history')) return ["Show my processing history", "Can I search history?", "Export all history"];
      if (text.includes('settings')) return ["Show settings page", "Can I change output format?", "Data retention policy"];
      if (text.includes('cargo') || text.includes('cargo types')) return ["Tell me about bulk cargo", "How is liquid cargo handled?", "What about containerized cargo?"];
      if (text.includes('maritime terminology')) return ["Explain common shipping terms", "What are laytime abbreviations?", "Tell me about vessel classifications"];
      if (text.includes('charter party')) return ["What is a voyage charter?", "Explain time charter party", "What's a bareboat charter?"];
      if (text.includes('incoterms')) return ["Explain FOB terms", "What is CIF?", "How do Incoterms affect shipping?"];
    }
    return this.getInitialSuggestions(); // Fallback to general suggestions
  }

  private getUploadHelp(): string {
    return `**📤 Document Upload Guide**

**Step-by-Step Process:**
1. Navigate to the 'Upload' section
2. Drag & drop your files or click 'Browse'
3. Select PDF or Word documents (max 10MB each)
4. Click 'Process Files' to start extraction

**Supported Formats:**
• PDF (.pdf) - Most common SoF format
• Word (.docx, .doc) - Microsoft Word documents

**Tips for Best Results:**
✅ Ensure text is clear and readable
✅ Include proper timestamps and dates
✅ Use standard maritime terminology
✅ Multiple files can be processed simultaneously

Would you like to go to the upload page now?`;
  }

  private getFormatInfo(): string {
    return `**📋 Supported File Formats**

**Primary Formats:**
• **PDF (.pdf)** - Recommended format
• **Word Documents (.docx, .doc)** - Full support

**File Requirements:**
• Maximum size: 10MB per file
• Text-based documents (not scanned images)
• Clear, readable content
• Standard character encoding

**Template Compatibility:**
✅ Any SoF template or format
✅ Custom company formats
✅ International standards
✅ Multi-language documents (English preferred)

**Processing Capabilities:**
• Batch processing (multiple files)
• Real-time extraction
• Template-agnostic analysis
• Automatic event detection

Having trouble with a specific format?`;
  }

  private getLaytimeInfo(): string {
    return `**⏱️ Laytime Calculations Explained**

**What is Laytime?**
Laytime is the time allowed for loading/discharging cargo operations.

**Our System Calculates:**
📊 **Time Analysis:**
• Total laytime used
• Waiting time at anchorage
• Actual cargo operation time
• Weather delays and interruptions

📈 **Financial Impact:**
• Demurrage (overtime charges)
• Despatch (time saved bonuses)
• Port efficiency metrics
• Cost analysis

**Extracted Events:**
⚓ Anchoring periods
🚢 Berth arrival/departure
📦 Loading/discharge operations
🌊 Weather delays
⛽ Bunker operations

**Accuracy Features:**
• Automatic time zone detection
• Holiday and weekend calculations
• Laytime exceptions handling
• Industry-standard formulas

Need help with specific calculations?`;
  }

  private getProcessingInfo(): string {
    return `**🔄 Processing Status Guide**

**How to Monitor Progress:**
1. **Processing Tab** - Real-time job status
2. **Progress Bars** - Visual completion indicators
3. **Notifications** - Automatic alerts
4. **Email Updates** - Optional notifications

**Processing Stages:**
1. **Upload** (0-10%) - File validation
2. **Text Extraction** (10-40%) - Document parsing
3. **Event Detection** (40-70%) - AI analysis
4. **Data Structuring** (70-90%) - Result formatting
5. **Completion** (100%) - Ready for download

**Typical Processing Times:**
• Simple SoF: 30-60 seconds
• Complex documents: 1-3 minutes
• Batch processing: 2-5 minutes per file

**Status Indicators:**
🟡 Processing - Currently analyzing
🟢 Completed - Ready for download
🔴 Failed - Check error details
⏸️ Queued - Waiting in line

Would you like to view the processing status now?`;
  }

  private getEventInfo(): string {
    return `**⚓ Maritime Events We Extract**

**Core Operations:**
🚢 **Vessel Movements:**
• Port arrival/departure
• Anchoring periods
• Berth allocation
• Shifting operations

📦 **Cargo Operations:**
• Loading commencement/completion
• Discharge start/finish
• Cargo type identification
• Quantity measurements

⏰ **Time Events:**
• Notice of Readiness (NOR)
• Laytime commencement
• Interruptions and delays
• Weather time

🏗️ **Port Operations:**
• Pilot boarding/disembarkation
• Tug assistance
• Line handling
• Documentation completion

**Data Extracted:**
• Precise timestamps
• Duration calculations
• Location details
• Event descriptions
• Responsible parties

**Accuracy Rate:** 98.5% event detection

Want to know about specific event types?`;
  }

  private getTroubleshootingInfo(): string {
    return `**🔧 Troubleshooting Guide**

**Common Issues & Solutions:**

**❌ Upload Problems:**
• File too large → Compress or split document
• Unsupported format → Convert to PDF/Word
• Network error → Check internet connection
• Browser issues → Try different browser

**❌ Processing Failures:**
• Poor text quality → Use higher resolution scan
• Corrupted file → Try re-saving document
• Missing timestamps → Verify SoF completeness
• Language issues → English documents preferred

**❌ No Events Found:**
• Document not a valid SoF → Check document type
• Scanned image → Use text-based documents
• Non-standard format → Contact support
• Missing key information → Verify content

**❌ Incorrect Results:**
• Review original document quality
• Check for unusual formatting
• Verify maritime terminology usage
• Report issues for AI improvement

**Quick Fixes:**
1. Refresh the page
2. Clear browser cache
3. Try a different file
4. Contact support team

Still having issues?`;
  }

  private getDownloadInfo(): string {
    return `**💾 Download & Export Options**

**Available Formats:**

📊 **JSON Format:**
• Complete structured data
• Vessel and port information
• Detailed event timeline
• Perfect for API integration
• Machine-readable format

📈 **CSV Format:**
• Spreadsheet-compatible
• Event timeline data
• Easy Excel analysis
• Great for reporting
• Human-readable format

**Download Process:**
1. Go to 'Results' tab
2. Select processed file
3. Choose format (JSON/CSV)
4. Click download button
5. File saves to Downloads folder

**Data Includes:**
• Event timestamps
• Duration calculations
• Location details
• Vessel information
• Port details
• Processing metadata

Would you like to view your processed results now?`;
  }

  private getGeneralHelp(): string {
    return `**🤝 SoF Assistant Help Center**

**I can help you with:**

📋 **Document Processing:**
• Upload procedures and requirements
• File format questions and support
• Processing status and monitoring
• Error troubleshooting and solutions

⚓ **Maritime Knowledge:**
• Laytime calculations and analysis
• SoF terminology and definitions
• Port operations and procedures
• Industry best practices

🔧 **Technical Support:**
• Platform features and navigation
• Data export and integration
• Account settings and preferences
• API documentation and usage

💡 **Quick Tips:**
• Use specific questions for better help
• Mention your exact issue or goal
• Ask about features you want to learn
• Request examples or demonstrations

**Popular Questions:**
• "How do I upload a document?"
• "What file formats are supported?"
• "Explain laytime calculations"
• "Show me processing status"

**Contact Options:**
• Chat with me anytime
• Email support team
• Browse documentation
• Schedule a demo

What would you like to know more about?`;
  }

  private getGreeting(): string {
    const greetings = [
      "Hello! 👋 I'm your SoF Assistant, ready to help with maritime document processing!",
      "Hi there! 🚢 Welcome to SoF Extractor. How can I assist you today?",
      "Greetings! ⚓ I'm here to help with your laytime intelligence needs.",
      "Hey! 🌊 Ready to make your maritime operations more efficient?",
      "Welcome aboard! 🛳️ I'm your AI assistant for SoF processing questions."
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  private getThankYou(): string {
    const responses = [
      "You're very welcome! 😊 I'm always here to help with your maritime needs.",
      "Happy to help! 🚢 Feel free to ask if you have more questions.",
      "My pleasure! ⚓ That's what I'm here for - making your work easier.",
      "Glad I could assist! 🌊 Don't hesitate to reach out anytime.",
      "You're welcome! 🛳️ I'm here 24/7 for all your SoF processing questions."
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getPricingInfo(): string {
    return `**💰 Pricing & Plans**

**Current Offering:**
🆓 **Free Trial** - Full access to all features
• Process up to 10 documents
• All extraction features included
• JSON/CSV export options
• Email support

**Enterprise Features:**
🏢 **Custom Solutions:**
• Unlimited document processing
• API access and integration
• Priority support
• Custom reporting
• White-label options
• On-premise deployment

**Value Proposition:**
💡 **ROI Benefits:**
• Reduce manual processing time by 95%
• Eliminate human errors
• Faster laytime calculations
• Improved operational efficiency
• Better dispute resolution

**Contact Sales:**
📧 Get a custom quote based on your needs
📞 Schedule a demo to see the platform
💬 Discuss volume discounts
🤝 Explore partnership opportunities

Ready to discuss pricing for your organization?`;
  }

  private getSecurityInfo(): string {
    return `**🔒 Security & Privacy**

**Data Protection:**
🛡️ **Security Measures:**
• End-to-end encryption
• Secure file transmission
• Regular security audits
• GDPR compliance
• SOC 2 Type II certified

🗃️ **Data Handling:**
• Files processed in secure environment
• Automatic deletion after processing
• No permanent storage of documents
• User-controlled data retention
• Audit trail maintenance

**Privacy Commitment:**
✅ **We Never:**
• Share your documents with third parties
• Use your data for training without consent
• Store files longer than necessary
• Access your data without permission

✅ **We Always:**
• Encrypt data in transit and at rest
• Follow industry best practices
• Provide transparent privacy policies
• Give you control over your data

**Compliance:**
• GDPR (General Data Protection Regulation)
• CCPA (California Consumer Privacy Act)
• Maritime industry standards
• International data protection laws

**Questions about security?** Contact our security team for detailed information.`;
  }

  private getAPIInfo(): string {
    return `**🔌 API & Integration**

**Developer Resources:**

📚 **API Documentation:**
• RESTful API endpoints
• Authentication methods
• Request/response examples
• Error handling guides
• Rate limiting information

🛠️ **Integration Options:**
• **Webhook notifications** - Real-time updates
• **Batch processing** - Multiple file handling
• **Custom endpoints** - Tailored solutions
• **SDK libraries** - Multiple programming languages

**Common Use Cases:**
🔄 **Automated Workflows:**
• Document upload automation
• Processing status monitoring
• Result retrieval and storage
• Integration with existing systems

📊 **Data Integration:**
• ERP system connections
• Database synchronization
• Reporting tool integration
• Business intelligence platforms

**Getting Started:**
1. **API Key** - Request developer access
2. **Documentation** - Review integration guides
3. **Testing** - Use sandbox environment
4. **Implementation** - Deploy to production

**Support:**
• Developer documentation
• Code examples and tutorials
• Technical support team
• Community forums

Ready to integrate SoF Extractor into your systems?`;
  }

  private getAnalyticsInfo(): string {
    return `**📈 Analytics & Insights**

Our analytics dashboard provides valuable insights into your document processing activities:

**Key Metrics:**
• Total files processed
• Total events extracted
• Data processed volume
• Average events per file

**Visualizations:**
• Processing activity timeline (last 7 days)
• Event type distribution (pie chart)
• File size vs. events extracted (bar chart)
• Top performing files by events

**Benefits:**
• Monitor operational efficiency
• Identify trends and patterns
• Optimize document workflows
• Make data-driven decisions

Would you like to view the analytics dashboard?`;
  }

  private getHistoryInfo(): string {
    return `**📜 Processing History**

The history view allows you to:

• **Browse all processed files**
• **Search** by filename, vessel, or port
• **Filter and sort** by date, name, or event count
• **Download** individual processed files (JSON/CSV)
• **Export all data** for comprehensive analysis

This feature helps you keep track of all your past document processing activities.

Would you like to go to your processing history?`;
  }

  private getSettingsInfo(): string {
    return `**⚙️ Application Settings**

In the settings section, you can configure:

• **Processing Settings:** Max file size, default output format, language, timezone
• **Notification Settings:** Email notifications, auto-download
• **Data Retention:** How long processed files are kept
• **Data Management:** Export/Import/Clear all processed data
• **API Information:** Backend endpoint, supported formats, processing engine details

These settings allow you to customize the platform to your specific needs.

Would you like to adjust your settings now?`;
  }

  private getAboutUsInfo(): string {
    return `**ℹ️ About SoF Event Extractor**

We are a team dedicated to revolutionizing maritime logistics through AI-powered solutions. Our mission is to empower maritime professionals with intelligent tools that transform unstructured data into strategic assets, fostering efficiency, transparency, and accuracy across global port operations.

**Our Vision:** To drive a new era of data-driven decision-making in the maritime industry.

**Key Principles:** Accuracy, Efficiency, Innovation, and User Empowerment.

Learn more about our journey and commitment to the maritime sector.`;
  }

  private getContactInfo(): string {
    return `**📞 Contact Us**

We're here to help! You can reach us through:

• **Email:** support@sofextractor.com
• **Sales Inquiries:** sales@sofextractor.com
• **Phone:** +1 (555) 123-4567 (Mon-Fri, 9 AM - 5 PM EST)
• **Online Form:** Visit our website's contact page

Feel free to reach out for any questions, support, or partnership opportunities.`;
  }

  private getFeaturesInfo(): string {
    return `**✨ Key Features of SoF Event Extractor**

• **AI-Based Extraction:** Advanced AI/ML/NLP for accurate data parsing.
• **Structured Data Output:** Transform unstructured data into CSV, JSON, XML.
• **Template-Agnostic Parsing:** Understands various SoF formats without predefined templates.
• **Real-time Processing:** Instant extraction and analysis.
• **User Authentication:** Secure login and signup.
• **Analytics Dashboard:** Comprehensive insights and statistics.
• **Multi-format Support:** PDF, DOCX, DOC.

What feature would you like to know more about?`;
  }

  private getBenefitsInfo(): string {
    return `**🌟 Key Benefits of Using SoF Event Extractor**

• **Zero Manual Entry:** Eliminate tedious and error-prone manual data extraction.
• **Faster Claims Processing:** Expedite calculations with instant access to structured data.
• **Audit-Ready Data:** Generate consistent and transparent records for compliance.
• **Global Template Compatibility:** Process documents from diverse templates with high accuracy.
• **Reduced Disputes:** Accurate data minimizes financial disagreements.
• **Improved Efficiency:** Streamline operations and save valuable time.

Experience these benefits firsthand with our free trial!`;
  }

  private getRoadmapInfo(): string {
    return `**🗺️ Our Product Roadmap**

We are continuously improving SoF Event Extractor! Upcoming features include:

• **Advanced AI Models:** Even higher accuracy and new event types.
• **Customizable Reports:** Tailor reports to your specific needs.
• **Multi-language Support:** Expanding beyond English, French, Spanish.
• **Integration Hub:** More direct integrations with popular maritime platforms.
• **Mobile App:** Process documents on the go.
• **User Collaboration:** Share and review documents with your team.

Stay tuned for exciting updates!`;
  }

  private getDocumentationInfo(): string {
    return `**📚 Documentation & Resources**

Our comprehensive documentation includes:

• **User Guides:** Step-by-step instructions for using the platform.
• **API Reference:** Detailed information for developers integrating our API.
• **Tutorials:** Walkthroughs for common tasks and advanced features.
• **FAQs:** Answers to frequently asked questions.
• **Troubleshooting:** Solutions for common issues.

You can access our full documentation from the sidebar or footer.`;
  }

  private getFeedbackInfo(): string {
    return `**💬 We Value Your Feedback!**

Your input helps us improve SoF Event Extractor. You can provide feedback by:

• **Using the thumbs up/down icons** on my messages.
• **Sending an email** to feedback@sofextractor.com.
• **Contacting our support team** with suggestions or bug reports.
• **Participating in user surveys** (we'll notify you when available).

Thank you for helping us make the platform better!`;
  }

  private getVesselInfo(): string {
    return `**🚢 Vessel Information Extraction**

Our system extracts key vessel details from your SoF documents, including:

• **Vessel Name:** The official name of the ship.
• **IMO Number:** The unique International Maritime Organization identification number.
• **Flag:** The country under which the vessel is registered.
• **DWT (Deadweight Tonnage):** The maximum weight of cargo, fuel, and supplies a ship can carry.
• **Vessel Type:** Bulk carrier, tanker, container ship, etc.
• **Gross Tonnage (GT):** The total enclosed volume of the ship.
• **Net Tonnage (NT):** The volume of cargo spaces.
• **Length Overall (LOA):** The maximum length of the vessel.

**Classification Societies:**
• Lloyd's Register (LR)
• American Bureau of Shipping (ABS)
• DNV GL
• Bureau Veritas (BV)
• Nippon Kaiji Kyokai (ClassNK)

This information helps in cross-referencing and comprehensive reporting.`;
  }

  private getPortInfo(): string {
    return `**⚓ Port Information Extraction**

We identify and extract relevant port details from your documents, such as:

• **Port Name:** The name of the port where operations occurred.
• **Country:** The country where the port is located.
• **Port Code:** Unique identifier for the port (e.g., UN/LOCODE).
• **Terminal details:** Specific terminal information.
• **Berth number:** Where the vessel was positioned.
• **Port agent:** Local representative details.
• **Port restrictions:** Any operational limitations.

**Port Terminology:**
• **Berth:** Designated location where a vessel docks
• **Quay:** Structure built parallel to the shoreline for loading/unloading
• **Jetty:** Structure extending into water for vessel berthing
• **Terminal:** Specialized area for handling specific cargo types
• **Draft:** Vertical distance between waterline and keel
• **Air Draft:** Height from water surface to highest point of vessel
• **Fenders:** Protective cushioning between vessel and berth
• **Bollards:** Short posts for securing vessel mooring lines

Accurate port information is crucial for logistics and compliance.`;
  }

  private getWeatherDelayInfo(): string {
    return `**🌧️ Weather Delays in Laytime**

Our system is designed to identify and account for weather-related delays mentioned in SoF documents. This includes:

• **Rain, wind, storm, fog:** Any adverse weather conditions that impact operations.
• **Start and end times of weather events:** For precise calculation of non-countable laytime.
• **Impact on operations:** Descriptions of how weather affected loading/discharge.

**Weather Working Day (WWD):**
A common charter party term where laytime only counts during weather conditions suitable for cargo operations. This means:
• Weather delays don't count against laytime
• Must be documented in SoF with specific times
• Requires evidence of actual weather conditions
• Local port authority often confirms weather status

**Common Weather Delay Types:**
• High winds (typically >25-30 knots)
• Heavy rain affecting cargo integrity
• Lightning (safety hazard)
• Fog (reduced visibility)
• Snow/ice (deck safety issues)
• Extreme temperatures
• High seas/swells (>2-3 meters)
• Tropical storms and cyclones

Accurate weather delay extraction helps in fair laytime calculation and dispute resolution.`;
  }

  private getNORInfo(): string {
    return `**📄 Notice of Readiness (NOR)**

The Notice of Readiness (NOR) is a crucial document in maritime shipping. It's a formal notification from the ship's master to the charterer (or their agent) that the vessel has arrived at the port, is ready in all respects (physically and legally), and is prepared to load or discharge cargo.

Our system aims to identify the issuance and acceptance times of NOR within the SoF to accurately determine the commencement of laytime.`;
  }

  private getDemurrageCalculationInfo(): string {
    return `**💰 Demurrage Calculation**

**What is Demurrage?**
Demurrage is a financial charge applied when a vessel stays at berth longer than the agreed laytime for loading/discharging operations.

**Calculation Formula:**
Demurrage = (Used Time - Allowed Time) × Daily Demurrage Rate

**Key Components:**
• Allowed laytime (as per charter party)
• Actual time used
• Demurrage rate (USD per day)
• Exceptions and deductions
• Time counting method

**Our System:**
• Automatically extracts relevant timestamps
• Applies charter party terms
• Calculates exact time differences
• Accounts for exceptions (weather, holidays)
• Provides detailed breakdown

**Time Counting Methods:**
• **SHINC** - Sundays and Holidays Included
• **SHEX** - Sundays and Holidays Excluded
• **FHINC** - Fridays and Holidays Included (Middle East)
• **FHEX** - Fridays and Holidays Excluded (Middle East)
• **24 Hours** - Continuous counting
• **Weather Working Day** - Excludes weather delays

**Common Exceptions:**
• Force majeure events
• Port restrictions
• Weather delays
• Mechanical breakdowns
• Strikes and labor disputes
• Shifting time between berths

Demurrage calculations are critical for financial settlements between vessel owners and charterers.`;
  }

  private getDefaultResponse(): string {
    const responses = [
      `I'd love to help! I specialize in SoF document processing and maritime operations. 

**Try asking about:**
• "How do I upload documents?" [ACTION:NAVIGATE:upload]
• "What events can you extract?"
• "Explain laytime calculations"
• "Show me processing status" [ACTION:NAVIGATE:processing]
• "What file formats work?"

What specific question do you have?`,

      `That's an interesting question! I'm here to help with maritime document processing.

**I can assist with:**
📄 Document upload and processing
⚓ Maritime terminology and operations
📊 Laytime calculations and analysis
🔧 Platform features and troubleshooting

Could you be more specific about what you'd like to know?`,

      `I'm your SoF processing expert! While I didn't catch the exact details of your question, I'm here to help.

**Popular topics I can help with:**
• File upload procedures [ACTION:NAVIGATE:upload]
• Processing status monitoring [ACTION:NAVIGATE:processing]
• Event extraction capabilities
• Download and export options [ACTION:NAVIGATE:results]
• Troubleshooting issues

What would you like to learn about?`
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  public getConversationHistory(): ChatMessage[] {
    return [...this.conversationHistory];
  }

  public clearHistory(): void {
    this.conversationHistory = [
      {
        id: '1',
        text: "Hello! I'm your SoF Assistant. I can help you with document processing, maritime terminology, and answer questions about laytime calculations. How can I assist you today?",
        sender: 'bot',
        timestamp: new Date(),
        suggestions: this.getInitialSuggestions()
      }
    ];
  }
}
