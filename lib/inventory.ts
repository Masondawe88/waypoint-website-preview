/* ============================================================
   WAYPOINT & Co. — Unified Inventory Model · v1.2
   One content model across AIR, SEA and STAY.
   Mirrors the future Sanity document shape 1:1 — when the CMS
   is hydrated, this file becomes a fetch, not a rewrite.

   Governance (unchanged from v1.0 freeze):
   · No fabricated rates — pricing renders POA/on-application
     until commercially confirmed (`priceConfirmed`).
   · Type-level aircraft figures are public type data, labelled
     indicative; the specific aircraft is subject to mission
     review and operator availability.
   · No stock imagery — tonal frames carry shot briefs.
   ============================================================ */

export type Category = "air" | "sea" | "stay";

export type InventoryItem = {
  /* ---- shared fields (all categories) ---- */
  category: Category;
  name: string;
  slug: string;
  heroBrief: string;          // shot brief for the tonal frame (photography commission)
  tone: [string, string, string]; // gradient stops for the tonal frame
  location: string;           // display location / home base
  region: string;             // region slug (australia, pacific, europe, united-states, new-zealand)
  destinations: string[];     // related destination slugs
  capacityLabel: string;      // e.g. "Up to 9 guests"
  priceLabel: string;         // e.g. "Rate on application", "Indicative charter rate"
  priceAmount?: string;       // only when commercially confirmed
  priceUnit?: string;         // "per hour" | "per day" | "per week" | "per night"
  priceConfirmed: boolean;    // false ⇒ never render a number
  /* ---- V2 indicative pricing framework (values render ONLY when priceConfirmed) ---- */
  pricing?: {
    priceFrom?: number;         // e.g. 8500 — only when commercially confirmed
    currency?: string;          // "AUD"
    priceUnit?: "per hour" | "per sector" | "per day" | "per night" | "per week" | "per journey" | "package" | "POA";
    priceQualifier?: string;    // e.g. "Indicative · subject to dates, routing and season"
    minimumTerm?: string;
    seasonalNote?: string;
    repositioningNote?: string;
    includedSummary?: string;   // confirmed inclusions only
    excludedSummary?: string;
    pricingVisibility?: "public" | "on-request" | "hidden";
    priceOnApplication?: boolean;
  };
  essence: string;            // one-line editorial essence
  description: string;        // longer editorial paragraph
  specs: { label: string; value: string; indicative?: boolean }[];
  status: "by-enquiry" | "register-interest" | "seasonal" | "coming-soon";
  featured: boolean;
  order: number;
  useCase: string;            // key mission / use case line
  relatedJourneys: string[];  // journey slugs
  attribution?: string;       // commercial-relationship line where required
  seasons?: { where: string; when: string }[]; // seasonal operating pattern (never hard-code one base where seasonal)
  locationMode?: "based" | "seasonal" | "arrangement";
  imagery?: "no-imagery" | "tonal-placeholder" | "ai-draft" | "ai-approved"
    | "real-draft" | "real-approved" | "replacement-required" | "complete";
  /* ---- category-specific (optional) ---- */
  air?: { type: string; rangeLabel: string; baseLabel: string; baseCode?: string; payloadLabel?: string };
  sea?: { dayCharter: boolean; overnightGuests?: string; sizeLabel?: string; dayGuestsLabel?: string; sleepsLabel?: string };
  stay?: { bedrooms?: string; stayType: string; minimumStay?: string };
};

export const STATUS_LABEL: Record<InventoryItem["status"], string> = {
  "by-enquiry": "Available by enquiry",
  "register-interest": "Register interest",
  seasonal: "Seasonal availability",
  "coming-soon": "Joining the collection",
};

/* ============================================================
   REPRESENTATIVE INVENTORY — real / approved assets only
   ============================================================ */

export const INVENTORY: InventoryItem[] = [
  /* ------------------------- AIR ------------------------- */
  {
    category: "air",
    name: "Citation CJ4",
    slug: "citation-cj4",
    heroBrief: "SHOT · CJ4 ON REMOTE APRON, FIRST LIGHT · 16:10",
    tone: ["#55606A", "#8D9598", "#C4CDC4"],
    location: "Based · Sunshine Coast",
    region: "australia",
    destinations: ["sydney", "whitsundays", "noosa", "tasmania"],
    capacityLabel: "8 guests",
    priceLabel: "From AUD $5,500 per hour",
    priceConfirmed: true,
    pricing: { priceFrom: 5500, currency: "AUD", priceUnit: "per hour", priceQualifier: "Indicative charter rate. Final pricing depends on routing, positioning, airport charges, crew requirements and aircraft availability.", pricingVisibility: "public", priceOnApplication: false },
    essence: "Light-jet speed for the sectors you fly most.",
    description:
      "A proven light jet for fast domestic movements — capital to capital, coast to island, same-day returns. Efficient, private and quietly capable, with access to most sealed regional airports.",
    specs: [
      { label: "Class", value: "Light jet" },
      { label: "Guests", value: "8" }, { label: "Payload", value: "890 kg" },
      { label: "Range", value: "≈ 2,000 nm", indicative: true },
      { label: "Cruise", value: "≈ 450 kt", indicative: true },
      { label: "Baggage", value: "Generous for class", indicative: true },
      { label: "Crew", value: "Two pilots" },
      { label: "Example sector", value: "Sydney → Hamilton Island" },
    ],
    status: "by-enquiry",
    featured: true,
    order: 1,
    useCase: "Fast domestic sectors · same-day returns",
    relatedJourneys: ["island-arrival", "harbour-connection"],
    attribution:
      "Accessed through selected operators. Final aircraft subject to mission review and availability.",
    air: { type: "Light jet", rangeLabel: "≈ 2,000 nm · indicative", baseLabel: "Sunshine Coast", baseCode: "MCY", payloadLabel: "890 kg payload" },
  },
  {
    category: "air",
    name: "Challenger 605",
    slug: "challenger-605",
    heroBrief: "SHOT · LARGE-CABIN WING OVER WATER, CRUISE · 16:10",
    tone: ["#2E3640", "#5E6B75", "#9AA5AD"],
    location: "Based · Gold Coast",
    region: "australia",
    destinations: ["sydney", "whitsundays", "tasmania"],
    capacityLabel: "12 guests",
    priceLabel: "From AUD $9,900 per hour",
    priceConfirmed: true,
    pricing: { priceFrom: 9900, currency: "AUD", priceUnit: "per hour", priceQualifier: "Indicative charter rate. Final pricing depends on routing, positioning, airport charges, crew requirements and aircraft availability.", pricingVisibility: "public", priceOnApplication: false },
    essence: "A large cabin for the long way there.",
    description:
      "Wide-body comfort across long domestic and international sectors — a settled cabin for working, dining and resting, with the range to cross to Asia and the Pacific in one considered movement.",
    specs: [
      { label: "Class", value: "Large cabin" },
      { label: "Guests", value: "12" },
      { label: "Range", value: "≈ 4,000 nm", indicative: true },
      { label: "Cruise", value: "≈ 470 kt", indicative: true },
      { label: "Crew", value: "Two pilots · cabin crew by sector" },
      { label: "Example sector", value: "Sydney → Singapore" },
    ],
    status: "by-enquiry",
    featured: true,
    order: 2,
    useCase: "Long-range · international journeys",
    relatedJourneys: ["southern-latitude"],
    attribution:
      "Accessed through selected operators. Final aircraft subject to mission review and availability.",
    air: { type: "Large-cabin jet", rangeLabel: "≈ 4,000 nm · indicative", baseLabel: "Gold Coast", baseCode: "OOL" },
  },
  {
    category: "air",
    name: "King Air B200",
    slug: "king-air-b200",
    heroBrief: "SHOT · TURBOPROP ON ISLAND STRIP, PROPS TURNING · 16:10",
    tone: ["#6A6C60", "#A39A82", "#D6CDB8"],
    location: "Based · Cairns",
    region: "australia",
    destinations: ["whitsundays", "noosa", "outback", "great-barrier-reef"],
    capacityLabel: "10 guests",
    priceLabel: "From AUD $3,500 per hour",
    priceConfirmed: true,
    pricing: { priceFrom: 3500, currency: "AUD", priceUnit: "per hour", priceQualifier: "Indicative charter rate. Final pricing depends on routing, positioning, airport charges, crew requirements and aircraft availability.", pricingVisibility: "public", priceOnApplication: false },
    essence: "The strip the jets can't reach is where this begins.",
    description:
      "The workhorse of remote Australia — island strips, station country and regional sectors beyond the network. Soft-luggage configuration, two-crew operations, and access where the timetable has never been.",
    specs: [
      { label: "Class", value: "Turboprop" },
      { label: "Guests", value: "10" },
      { label: "Access", value: "Short & unsealed strips" },
      { label: "Crew", value: "Two-crew operations" },
      { label: "Example sector", value: "Sunshine Coast → Hamilton Island" },
    ],
    status: "by-enquiry",
    featured: true,
    order: 3,
    useCase: "Remote & island access · regional sectors",
    relatedJourneys: ["island-arrival"],
    attribution:
      "Accessed through selected operators. Final aircraft subject to mission review and availability.",
    air: { type: "Turboprop", rangeLabel: "Regional · remote", baseLabel: "Cairns", baseCode: "CNS" },
  },

  /* ------------------------- SEA ------------------------- */
  {
    category: "sea",
    name: "M/Y ALANI",
    slug: "alani",
    heroBrief: "SHOT · ALANI AT ANCHOR, WHITEHAVEN ASTERN, 0700 · 16:10",
    tone: ["#3E5F5C", "#8FB3AE", "#C2D5D0"],
    location: "Whitsundays · Queensland",
    region: "australia",
    destinations: ["whitsundays", "great-barrier-reef"],
    capacityLabel: "Up to 35 day guests · Sleeps 6",
    priceLabel: "From AUD $1,800 per hour",
    priceConfirmed: true,
    pricing: { priceFrom: 1800, currency: "AUD", priceUnit: "per hour", priceQualifier: "Indicative charter rate. Final pricing depends on duration, cruising area, catering, beverages, guest requirements and availability.", pricingVisibility: "public", priceOnApplication: false },
    essence: "The flagship, at home in the passage.",
    description:
      "ALANI is the house flagship — crewed charter through the seventy-four islands, from Whitehaven at first light to the still anchorages of Hook and the outer reef when the weather opens. The passage, crossed at your own pace.",
    specs: [
      { label: "Charter", value: "Overnight · crewed" },
      { label: "Waters", value: "Whitsundays · Outer Reef" },
      { label: "Size", value: "82 ft · Motor yacht" }, { label: "Day guests", value: "Up to 35" }, { label: "Sleeps", value: "6" },
    ],
    status: "by-enquiry",
    featured: true,
    order: 1,
    useCase: "Island passages · reef journeys",
    relatedJourneys: ["island-passage", "island-arrival"],
    sea: { dayCharter: false, overnightGuests: "Sleeps 6", sizeLabel: "82 ft", dayGuestsLabel: "Up to 35 day guests", sleepsLabel: "Sleeps 6" },
  },
  {
    category: "sea",
    name: "Capelli Stradivari 52",
    slug: "capelli-stradivari-52",
    heroBrief: "SHOT · STRADIVARI 52 UNDERWAY, NOOSA RIVER MOUTH · 16:10",
    tone: ["#7E9287", "#C9B295", "#E6E0D2"],
    location: "Noosa · summer / Hamilton Island · Mar–Nov",
    region: "australia",
    destinations: ["noosa", "whitsundays"],
    seasons: [
      { when: "Summer", where: "Noosa" },
      { when: "Mar–Nov", where: "Hamilton Island" },
    ],
    locationMode: "seasonal",
    capacityLabel: "Up to 12 day guests · Day charter only",
    priceLabel: "From AUD $1,200 per hour",
    priceConfirmed: true,
    pricing: { priceFrom: 1200, currency: "AUD", priceUnit: "per hour", priceQualifier: "Indicative charter rate. Final pricing depends on duration, cruising area, catering, beverages, guest requirements and availability.", pricingVisibility: "public", priceOnApplication: false, seasonalNote: "Seasonal operation applies" },
    essence: "The day, taken to the water.",
    description:
      "The house day-charter hero — island lunches, sunset runs, proposals, corporate afternoons and coastal exploration. Noosa through the summer; Hamilton Island from March to November.",
    specs: [
      { label: "Charter", value: "Day · crewed" },
      { label: "Season", value: "Noosa · summer / Hamilton · Mar–Nov" },
      { label: "Size", value: "52 ft · Power boat" }, { label: "Day guests", value: "Up to 12" }, { label: "Charter", value: "Day charter only" },
    ],
    status: "seasonal",
    featured: true,
    order: 2,
    useCase: "Day charters · island lunches · sunset",
    relatedJourneys: ["coastal-interlude"],
    sea: { dayCharter: true, sizeLabel: "52 ft", dayGuestsLabel: "Up to 12 day guests", sleepsLabel: "Day charter only" },
  },
  {
    category: "sea",
    name: "M/Y ANASA",
    slug: "anasa",
    heroBrief: "SHOT · ANASA BOW-ON, AEGEAN LIGHT · 16:10",
    tone: ["#2E3640", "#5E8A86", "#C2D5D0"],
    location: "Mediterranean",
    region: "europe",
    seasons: [{ when: "Future seasons", where: "Mediterranean" }],
    locationMode: "seasonal",
    destinations: ["mediterranean", "greek-islands"],
    capacityLabel: "Guests by arrangement",
    priceLabel: "Register interest",
    priceConfirmed: false,
    essence: "The house, one day, in older waters.",
    description:
      "ANASA is the Mediterranean chapter to come — registered interest shapes her first seasons. The same house standard, a hemisphere away.",
    specs: [
      { label: "Charter", value: "Overnight · crewed" },
      { label: "Waters", value: "Mediterranean" },
      { label: "Season one", value: "By registration" },
    ],
    status: "register-interest",
    featured: false,
    order: 4,
    useCase: "Mediterranean seasons · future",
    relatedJourneys: [],
    sea: { dayCharter: false },
  },

  /* ------------------------- STAY ------------------------- */
  {
    category: "stay",
    name: "The Cowries",
    slug: "the-cowries",
    heroBrief: "SHOT · TERRACE OVER THE PASSAGE, LATE LIGHT · 16:10",
    tone: ["#BCC7C4", "#7C8B8F", "#D8CFC0"],
    location: "Hamilton Island · Whitsundays",
    region: "australia",
    destinations: ["whitsundays"],
    capacityLabel: "Guests on enquiry",
    priceLabel: "Nightly rate on application",
    priceConfirmed: false,
    essence: "The island at your door; the passage beyond the terrace.",
    description:
      "An island residence above the water — open living, framed ocean views, minutes from marina and runway. The point of return for an island-and-sea journey.",
    specs: [
      { label: "Setting", value: "Elevated · oceanfront" },
      { label: "Bedrooms", value: "Confirmed on enquiry" },
      { label: "Best with", value: "ALANI · helicopter arrival" },
    ],
    status: "by-enquiry",
    featured: true,
    order: 1,
    useCase: "Island living · yacht connection",
    relatedJourneys: ["island-passage", "island-arrival"],
    attribution: "Available by arrangement through selected owners and managers.",
    stay: { stayType: "Island residence" },
  },
  {
    category: "stay",
    name: "JASMINE",
    slug: "jasmine",
    heroBrief: "SHOT · POOL EDGE MEETING THE PASSAGE, MIDDAY · 16:10",
    tone: ["#D5D4C6", "#8FB3AE", "#C4B69C"],
    location: "Hamilton Island · Whitsundays",
    region: "australia",
    destinations: ["whitsundays"],
    capacityLabel: "Guests on enquiry",
    priceLabel: "Nightly rate on application",
    priceConfirmed: false,
    essence: "Water on both horizons.",
    description:
      "A Hamilton Island residence built around its pool line and the passage beyond — long lunches, open rooms and the island's quiet end of day.",
    specs: [
      { label: "Setting", value: "Poolside · island" },
      { label: "Bedrooms", value: "Confirmed on enquiry" },
      { label: "Best with", value: "Day charter · private chef" },
    ],
    status: "by-enquiry",
    featured: true,
    order: 2,
    useCase: "Families · gathered stays",
    relatedJourneys: ["island-passage"],
    attribution: "Available by arrangement through selected owners and managers.",
    stay: { stayType: "Island residence" },
  },
  {
    category: "stay",
    name: "ONE W",
    slug: "one-w",
    heroBrief: "SHOT · ARCHITECTURAL THRESHOLD, MORNING SHADOW · 16:10",
    tone: ["#DCD4C3", "#98A096", "#C2D5D0"],
    location: "Hamilton Island · Whitsundays",
    region: "australia",
    destinations: ["whitsundays"],
    capacityLabel: "Guests on enquiry",
    priceLabel: "Nightly rate on application",
    priceConfirmed: false,
    essence: "Architecture first; the island follows.",
    description:
      "A considered architectural stay on Hamilton Island — clean thresholds, framed light and a quieter register of island living.",
    specs: [
      { label: "Setting", value: "Architectural · island" },
      { label: "Bedrooms", value: "Confirmed on enquiry" },
      { label: "Best with", value: "Helicopter arrival · reef day" },
    ],
    status: "by-enquiry",
    featured: false,
    order: 3,
    useCase: "Couples · design-led stays",
    relatedJourneys: ["island-arrival"],
    attribution: "Available by arrangement through selected owners and managers.",
    stay: { stayType: "Architectural stay" },
  },
  {
    category: "stay",
    name: "Mountain Majesty",
    slug: "mountain-majesty",
    heroBrief: "SHOT · ALPINE GREAT ROOM, SNOW LIGHT THROUGH GLASS · 16:10",
    tone: ["#3E4640", "#6E6759", "#D8CFC0"],
    location: "South Lake Tahoe · United States",
    region: "united-states",
    destinations: ["mountain-west"],
    capacityLabel: "Guests on enquiry",
    priceLabel: "Nightly rate on application",
    priceConfirmed: false,
    essence: "The mountains, held behind glass.",
    description:
      "An alpine residence at South Lake Tahoe — snow light, timber volumes and the Sierra at the windows. The first mark of the house's future-facing American chapter.",
    specs: [
      { label: "Setting", value: "Alpine · lakeside region" },
      { label: "Bedrooms", value: "Confirmed on enquiry" },
      { label: "Season", value: "Winter & summer characters" },
    ],
    status: "by-enquiry",
    featured: false,
    order: 4,
    useCase: "Alpine escapes · gathered winters",
    relatedJourneys: [],
    attribution: "Available by arrangement through selected owners and managers.",
    stay: { stayType: "Alpine residence" },
  },
  {
    category: "stay",
    name: "Tasmanian Slow Stay",
    slug: "tasmanian-slow-stay",
    heroBrief: "SHOT · STONE HEARTH LIT, WEATHER AT THE GLASS · 16:10",
    tone: ["#3E4640", "#56534B", "#A9703C"],
    location: "Tasmania",
    region: "australia",
    destinations: ["tasmania"],
    capacityLabel: "Guests on enquiry",
    priceLabel: "Nightly rate on application",
    priceConfirmed: false,
    essence: "Stone and timber holding warmth against the weather.",
    description:
      "A slow stay in the island's wine and wilderness country — firelight after dark, deep windows, and the southern table close by. Final residence selected to the journey.",
    specs: [
      { label: "Setting", value: "Wine & wilderness country" },
      { label: "Bedrooms", value: "Confirmed on enquiry" },
      { label: "Best with", value: "Private guide · chef-led dining" },
    ],
    status: "by-enquiry",
    featured: true,
    order: 5,
    useCase: "Slow stays · food & wine",
    relatedJourneys: ["southern-latitude"],
    attribution: "Available by arrangement through selected owners and managers.",
    stay: { stayType: "Slow stay" },
  },
  {
    category: "air",
    name: "EC130",
    slug: "ec130",
    heroBrief: "SHOT · EC130 — REAL ASSET PHOTOGRAPHY REQUIRED · 16:10",
    tone: ["#4D4A42", "#7C7466", "#B8AC93"],
    location: "Based · Sunshine Coast",
    region: "australia",
    destinations: ["noosa"],
    capacityLabel: "4 guests",
    priceLabel: "From AUD $4,000 per hour",
    priceConfirmed: true,
    pricing: { priceFrom: 4000, currency: "AUD", priceUnit: "per hour", priceQualifier: "Indicative charter rate. Final pricing depends on routing, positioning, airport charges, crew requirements and aircraft availability.", pricingVisibility: "public", priceOnApplication: false },
    essence: "Rotary access from the coast — beach, vineyard, vessel.",
    description: "A single-engine helicopter based on the Sunshine Coast for transfers, scenic access and connections fixed-wing cannot make. Final routing confirmed to pad approvals and conditions.",
    specs: [{ label: "Type", value: "Helicopter" }, { label: "Guests", value: "4" }, { label: "Payload", value: "400 kg" }, { label: "Base", value: "Sunshine Coast" }],
    status: "by-enquiry",
    featured: false,
    order: 5,
    useCase: "Transfers · scenic · coastal access",
    relatedJourneys: [],
    air: { type: "Helicopter", rangeLabel: "Transfer & scenic", baseLabel: "Sunshine Coast", baseCode: "MCY", payloadLabel: "400 kg payload" },
  },
  {
    category: "air",
    name: "Pilatus PC-12",
    slug: "pilatus-pc-12",
    heroBrief: "SHOT · PILATUS PC-12 — REAL ASSET PHOTOGRAPHY REQUIRED · 16:10",
    tone: ["#55606A", "#8D9598", "#C4CDC4"],
    location: "Based · Melbourne",
    region: "australia",
    destinations: ["tasmania"],
    capacityLabel: "8 guests",
    priceLabel: "From AUD $4,000 per hour",
    priceConfirmed: true,
    pricing: { priceFrom: 4000, currency: "AUD", priceUnit: "per hour", priceQualifier: "Indicative charter rate. Final pricing depends on routing, positioning, airport charges, crew requirements and aircraft availability.", pricingVisibility: "public", priceOnApplication: false },
    essence: "Single-engine reach with a cabin that works.",
    description: "The workhorse of long regional sectors from Melbourne — pressurised comfort, short-strip capability and southern reach across Victoria, Tasmania and the coast.",
    specs: [{ label: "Type", value: "Single-engine turboprop" }, { label: "Guests", value: "8" }, { label: "Base", value: "Melbourne" }],
    status: "by-enquiry",
    featured: false,
    order: 6,
    useCase: "Regional sectors · southern Australia",
    relatedJourneys: [],
    air: { type: "Turboprop", rangeLabel: "Regional · long sectors", baseLabel: "Melbourne", baseCode: "MEL" },
  },
  {
    category: "air",
    name: "Gulfstream G650",
    slug: "gulfstream-g650",
    heroBrief: "SHOT · GULFSTREAM G650 — REAL ASSET PHOTOGRAPHY REQUIRED · 16:10",
    tone: ["#2E3640", "#5E6B75", "#9AA5AD"],
    location: "Based · Sydney",
    region: "australia",
    destinations: ["sydney"],
    capacityLabel: "14 guests",
    priceLabel: "From AUD $15,500 per hour",
    priceConfirmed: true,
    pricing: { priceFrom: 15500, currency: "AUD", priceUnit: "per hour", priceQualifier: "Indicative charter rate. Final pricing depends on routing, positioning, airport charges, crew requirements and aircraft availability.", pricingVisibility: "public", priceOnApplication: false },
    essence: "Intercontinental range, one cabin.",
    description: "Ultra-long-range capability from Sydney — nonstop reach across the Pacific and into Asia, with a cabin arranged for working, dining and rest at altitude.",
    specs: [{ label: "Type", value: "Ultra-long-range jet" }, { label: "Guests", value: "14" }, { label: "Base", value: "Sydney" }],
    status: "by-enquiry",
    featured: false,
    order: 7,
    useCase: "Intercontinental · ultra-long-range",
    relatedJourneys: [],
    air: { type: "Ultra-long-range jet", rangeLabel: "Intercontinental", baseLabel: "Sydney", baseCode: "SYD" },
  },
  {
    category: "air",
    name: "Robinson R44",
    slug: "robinson-r44",
    heroBrief: "SHOT · ROBINSON R44 — REAL ASSET PHOTOGRAPHY REQUIRED · 16:10",
    tone: ["#6A6C60", "#A39A82", "#D6CDB8"],
    location: "Based · Hamilton Island",
    region: "australia",
    destinations: ["whitsundays"],
    capacityLabel: "Guest capacity confirmed on enquiry",
    priceLabel: "From AUD $2,500 per hour",
    priceConfirmed: true,
    pricing: { priceFrom: 2500, currency: "AUD", priceUnit: "per hour", priceQualifier: "Indicative charter rate. Final pricing depends on routing, positioning, airport charges, crew requirements and aircraft availability.", pricingVisibility: "public", priceOnApplication: false },
    essence: "The island's light rotary — reef and beach within minutes.",
    description: "Light helicopter charter from Hamilton Island for scenic passages, Whitehaven arrivals and short island transfers. Guest configuration confirmed on enquiry.",
    specs: [{ label: "Type", value: "Helicopter" }, { label: "Base", value: "Hamilton Island" }, { label: "Guests", value: "Confirmed on enquiry" }],
    status: "by-enquiry",
    featured: false,
    order: 8,
    useCase: "Island scenic · short transfers",
    relatedJourneys: [],
    air: { type: "Helicopter", rangeLabel: "Island scenic", baseLabel: "Hamilton Island", baseCode: "HTI" },
  },
  {
    category: "air",
    name: "Robinson R66",
    slug: "robinson-r66",
    heroBrief: "SHOT · ROBINSON R66 — REAL ASSET PHOTOGRAPHY REQUIRED · 16:10",
    tone: ["#4D4A42", "#7C7466", "#B8AC93"],
    location: "Based · Hamilton Island",
    region: "australia",
    destinations: ["whitsundays"],
    capacityLabel: "Guest capacity confirmed on enquiry",
    priceLabel: "From AUD $3,000 per hour",
    priceConfirmed: true,
    pricing: { priceFrom: 3000, currency: "AUD", priceUnit: "per hour", priceQualifier: "Indicative charter rate. Final pricing depends on routing, positioning, airport charges, crew requirements and aircraft availability.", pricingVisibility: "public", priceOnApplication: false },
    essence: "Turbine rotary over the passage.",
    description: "Turbine helicopter charter from Hamilton Island — reef flights, outer-island access and vessel connections across the Whitsundays. Guest configuration confirmed on enquiry.",
    specs: [{ label: "Type", value: "Turbine helicopter" }, { label: "Base", value: "Hamilton Island" }, { label: "Guests", value: "Confirmed on enquiry" }],
    status: "by-enquiry",
    featured: false,
    order: 9,
    useCase: "Reef flights · vessel connections",
    relatedJourneys: [],
    air: { type: "Helicopter", rangeLabel: "Reef & island", baseLabel: "Hamilton Island", baseCode: "HTI" },
  },
  {
    category: "sea",
    name: "M/Y RASCAL",
    slug: "rascal",
    heroBrief: "SHOT · M/Y RASCAL — REAL ASSET PHOTOGRAPHY REQUIRED · 16:10",
    tone: ["#3E5F5C", "#8FB3AE", "#C2D5D0"],
    location: "Operating · Hamilton Island & Sydney",
    region: "australia",
    destinations: ["whitsundays", "sydney"],
    capacityLabel: "Up to 75 day guests · Sleeps 8",
    priceLabel: "From AUD $2,500 per hour",
    priceConfirmed: true,
    pricing: { priceFrom: 2500, currency: "AUD", priceUnit: "per hour", priceQualifier: "Indicative charter rate. Final pricing depends on duration, cruising area, catering, beverages, guest requirements and availability.", pricingVisibility: "public", priceOnApplication: false, seasonalNote: "Seasonal operation applies" },
    essence: "The event platform of the fleet.",
    description: "A 112-foot motor yacht carrying up to seventy-five day guests — harbour events in Sydney, passage days in the Whitsundays, and term charter for eight. Seasonal operation between both regions.",
    specs: [{ label: "Size", value: "112 ft · Motor yacht" }, { label: "Operating region", value: "Hamilton Island & Sydney" }, { label: "Day guests", value: "Up to 75" }, { label: "Sleeps", value: "8" }, { label: "Season", value: "Seasonal operation applies" }],
    status: "by-enquiry",
    featured: true,
    order: 5,
    useCase: "Term & day charter",
    relatedJourneys: [],
    sea: { dayCharter: false, sizeLabel: "112 ft", dayGuestsLabel: "Up to 75 day guests", sleepsLabel: "Sleeps 8" },
  },
  {
    category: "sea",
    name: "M/Y NISI",
    slug: "nisi",
    heroBrief: "SHOT · M/Y NISI — REAL ASSET PHOTOGRAPHY REQUIRED · 16:10",
    tone: ["#3E5F5C", "#8FB3AE", "#C2D5D0"],
    location: "Operating · Hamilton Island",
    region: "australia",
    destinations: ["whitsundays"],
    capacityLabel: "Up to 12 day guests · Sleeps 8",
    priceLabel: "From AUD $1,700 per hour",
    priceConfirmed: true,
    pricing: { priceFrom: 1700, currency: "AUD", priceUnit: "per hour", priceQualifier: "Indicative charter rate. Final pricing depends on duration, cruising area, catering, beverages, guest requirements and availability.", pricingVisibility: "public", priceOnApplication: false },
    essence: "A settled cabin count and the passage at the bow.",
    description: "A 24.9-metre motor yacht at Hamilton Island — twelve by day, eight overnight, and the islands arranged around her pace.",
    specs: [{ label: "Size", value: "24.9 m · Motor yacht" }, { label: "Operating region", value: "Hamilton Island" }, { label: "Day guests", value: "Up to 12" }, { label: "Sleeps", value: "8" }],
    status: "by-enquiry",
    featured: false,
    order: 6,
    useCase: "Term & day charter",
    relatedJourneys: [],
    sea: { dayCharter: false, sizeLabel: "24.9 m", dayGuestsLabel: "Up to 12 day guests", sleepsLabel: "Sleeps 8" },
  },
  {
    category: "sea",
    name: "M/Y AIX",
    slug: "aix",
    heroBrief: "SHOT · M/Y AIX — REAL ASSET PHOTOGRAPHY REQUIRED · 16:10",
    tone: ["#3E5F5C", "#8FB3AE", "#C2D5D0"],
    location: "Operating · Hamilton Island & Sydney",
    region: "australia",
    destinations: ["whitsundays", "sydney"],
    capacityLabel: "Guest capacity confirmed on enquiry · Sleeps 10",
    priceLabel: "Price on application",
    priceConfirmed: false,
    pricing: { currency: "AUD", priceUnit: "POA", priceQualifier: "Indicative charter rate. Final pricing depends on duration, cruising area, catering, beverages, guest requirements and availability.", pricingVisibility: "public", priceOnApplication: true, seasonalNote: "Seasonal operation applies" },
    essence: "The largest of the house's waters.",
    description: "A 44.5-metre motor yacht operating seasonally between Hamilton Island and Sydney — ten overnight, day arrangements to the occasion. Rate on application.",
    specs: [{ label: "Size", value: "44.5 m · Motor yacht" }, { label: "Operating region", value: "Hamilton Island & Sydney" }, { label: "Day guests", value: "Confirmed on enquiry" }, { label: "Sleeps", value: "10" }, { label: "Season", value: "Seasonal operation applies" }],
    status: "by-enquiry",
    featured: false,
    order: 7,
    useCase: "Term & day charter",
    relatedJourneys: [],
    sea: { dayCharter: false, sizeLabel: "44.5 m", dayGuestsLabel: "Guest capacity confirmed on enquiry", sleepsLabel: "Sleeps 10" },
  },
  {
    category: "sea",
    name: "M/Y AURA",
    slug: "aura",
    heroBrief: "SHOT · M/Y AURA — REAL ASSET PHOTOGRAPHY REQUIRED · 16:10",
    tone: ["#3E5F5C", "#8FB3AE", "#C2D5D0"],
    location: "Operating · Hamilton Island & Sydney",
    region: "australia",
    destinations: ["whitsundays", "sydney"],
    capacityLabel: "Guest capacity confirmed on enquiry",
    priceLabel: "Price on application",
    priceConfirmed: false,
    pricing: { currency: "AUD", priceUnit: "POA", priceQualifier: "Indicative charter rate. Final pricing depends on duration, cruising area, catering, beverages, guest requirements and availability.", pricingVisibility: "public", priceOnApplication: true, seasonalNote: "Seasonal operation applies" },
    essence: "Between the harbour and the passage.",
    description: "A 27-metre motor yacht moving seasonally between Sydney and the Whitsundays. Capacity and rate confirmed on enquiry.",
    specs: [{ label: "Size", value: "27 m · Motor yacht" }, { label: "Operating region", value: "Hamilton Island & Sydney" }, { label: "Day guests", value: "Confirmed on enquiry" }, { label: "Season", value: "Seasonal operation applies" }],
    status: "by-enquiry",
    featured: false,
    order: 8,
    useCase: "Day charter",
    relatedJourneys: [],
    sea: { dayCharter: false, sizeLabel: "27 m", dayGuestsLabel: "Guest capacity confirmed on enquiry" },
  },
  {
    category: "sea",
    name: "M/Y IMPULSIVE",
    slug: "impulsive",
    heroBrief: "SHOT · M/Y IMPULSIVE — REAL ASSET PHOTOGRAPHY REQUIRED · 16:10",
    tone: ["#3E5F5C", "#8FB3AE", "#C2D5D0"],
    location: "Operating · Hamilton Island",
    region: "australia",
    destinations: ["whitsundays"],
    capacityLabel: "Guest capacity confirmed on enquiry",
    priceLabel: "Price on application",
    priceConfirmed: false,
    pricing: { currency: "AUD", priceUnit: "POA", priceQualifier: "Indicative charter rate. Final pricing depends on duration, cruising area, catering, beverages, guest requirements and availability.", pricingVisibility: "public", priceOnApplication: true },
    essence: "Forty metres, held at the islands.",
    description: "A 40.2-metre motor yacht based at Hamilton Island. Capacity and rate confirmed on enquiry.",
    specs: [{ label: "Size", value: "40.2 m · Motor yacht" }, { label: "Operating region", value: "Hamilton Island" }, { label: "Day guests", value: "Confirmed on enquiry" }],
    status: "by-enquiry",
    featured: false,
    order: 9,
    useCase: "Day charter",
    relatedJourneys: [],
    sea: { dayCharter: false, sizeLabel: "40.2 m", dayGuestsLabel: "Guest capacity confirmed on enquiry" },
  },
  {
    category: "sea",
    name: "M/Y MURCIELAGO",
    slug: "murcielago",
    heroBrief: "SHOT · M/Y MURCIELAGO — REAL ASSET PHOTOGRAPHY REQUIRED · 16:10",
    tone: ["#3E5F5C", "#8FB3AE", "#C2D5D0"],
    location: "Operating · Hamilton Island",
    region: "australia",
    destinations: ["whitsundays"],
    capacityLabel: "Guest capacity confirmed on enquiry",
    priceLabel: "Price on application",
    priceConfirmed: false,
    pricing: { currency: "AUD", priceUnit: "POA", priceQualifier: "Indicative charter rate. Final pricing depends on duration, cruising area, catering, beverages, guest requirements and availability.", pricingVisibility: "public", priceOnApplication: true, seasonalNote: "Seasonal operation applies" },
    essence: "An 82-footer with the passage as home water.",
    description: "An 82-foot motor yacht operating seasonally from Hamilton Island. Capacity and rate confirmed on enquiry.",
    specs: [{ label: "Size", value: "82 ft · Motor yacht" }, { label: "Operating region", value: "Hamilton Island" }, { label: "Day guests", value: "Confirmed on enquiry" }, { label: "Season", value: "Seasonal operation applies" }],
    status: "by-enquiry",
    featured: false,
    order: 10,
    useCase: "Day charter",
    relatedJourneys: [],
    sea: { dayCharter: false, sizeLabel: "82 ft", dayGuestsLabel: "Guest capacity confirmed on enquiry" },
  },
  {
    category: "sea",
    name: "M/Y ONEWORLD",
    slug: "oneworld",
    heroBrief: "SHOT · M/Y ONEWORLD — REAL ASSET PHOTOGRAPHY REQUIRED · 16:10",
    tone: ["#3E5F5C", "#8FB3AE", "#C2D5D0"],
    location: "Operating · Hamilton Island & Sydney",
    region: "australia",
    destinations: ["whitsundays", "sydney"],
    capacityLabel: "Guest capacity confirmed on enquiry",
    priceLabel: "Price on application",
    priceConfirmed: false,
    pricing: { currency: "AUD", priceUnit: "POA", priceQualifier: "Indicative charter rate. Final pricing depends on duration, cruising area, catering, beverages, guest requirements and availability.", pricingVisibility: "public", priceOnApplication: true, seasonalNote: "Seasonal operation applies" },
    essence: "Two regions, one standard.",
    description: "A 31.5-metre motor yacht moving seasonally between Hamilton Island and Sydney. Capacity and rate confirmed on enquiry.",
    specs: [{ label: "Size", value: "31.5 m · Motor yacht" }, { label: "Operating region", value: "Hamilton Island & Sydney" }, { label: "Day guests", value: "Confirmed on enquiry" }, { label: "Season", value: "Seasonal operation applies" }],
    status: "by-enquiry",
    featured: false,
    order: 11,
    useCase: "Day charter",
    relatedJourneys: [],
    sea: { dayCharter: false, sizeLabel: "31.5 m", dayGuestsLabel: "Guest capacity confirmed on enquiry" },
  },
  {
    category: "stay",
    name: "HTI Residence",
    slug: "hti-residence",
    heroBrief: "SHOT · HTI RESIDENCE — REAL ASSET PHOTOGRAPHY REQUIRED · 16:10",
    tone: ["#BCC7C4", "#7C8B8F", "#D8CFC0"],
    location: "Hamilton Island",
    region: "australia",
    destinations: ["whitsundays"],
    capacityLabel: "Sleeps 10 · 3-night minimum",
    priceLabel: "From AUD $4,500 per night",
    priceConfirmed: true,
    pricing: { priceFrom: 4500, currency: "AUD", priceUnit: "per night", priceQualifier: "Indicative accommodation rate. Minimum stay, season, guest count, service requirements and availability may affect the final proposal.", pricingVisibility: "public", priceOnApplication: false },
    essence: "A private island house for ten.",
    description: "A private standalone residence on Hamilton Island sleeping ten, three-night minimum. Full residence details confirmed on enquiry.",
    specs: [{ label: "Type", value: "Private standalone house" }, { label: "Sleeps", value: "10" }, { label: "Minimum stay", value: "3 nights" }, { label: "Location", value: "Hamilton Island" }],
    status: "by-enquiry",
    featured: false,
    order: 6,
    useCase: "Private residence",
    relatedJourneys: [],
    stay: { stayType: "Private standalone house", minimumStay: "3 nights" },
  },
  {
    category: "stay",
    name: "NOOSA Residence",
    slug: "noosa-residence",
    heroBrief: "SHOT · NOOSA RESIDENCE — REAL ASSET PHOTOGRAPHY REQUIRED · 16:10",
    tone: ["#BCC7C4", "#7C8B8F", "#D8CFC0"],
    location: "Noosa",
    region: "australia",
    destinations: ["noosa"],
    capacityLabel: "Sleeps 12 · 3-night minimum",
    priceLabel: "From AUD $9,500 per night",
    priceConfirmed: true,
    pricing: { priceFrom: 9500, currency: "AUD", priceUnit: "per night", priceQualifier: "Indicative accommodation rate. Minimum stay, season, guest count, service requirements and availability may affect the final proposal.", pricingVisibility: "public", priceOnApplication: false },
    essence: "Noosa held privately, for twelve.",
    description: "A private standalone residence at Noosa sleeping twelve, three-night minimum. Full residence details confirmed on enquiry.",
    specs: [{ label: "Type", value: "Private standalone house" }, { label: "Sleeps", value: "12" }, { label: "Minimum stay", value: "3 nights" }, { label: "Location", value: "Noosa" }],
    status: "by-enquiry",
    featured: false,
    order: 7,
    useCase: "Private residence",
    relatedJourneys: [],
    stay: { stayType: "Private standalone house", minimumStay: "3 nights" },
  },
  {
    category: "stay",
    name: "SYD Residence",
    slug: "syd-residence",
    heroBrief: "SHOT · SYD RESIDENCE — REAL ASSET PHOTOGRAPHY REQUIRED · 16:10",
    tone: ["#BCC7C4", "#7C8B8F", "#D8CFC0"],
    location: "Sydney",
    region: "australia",
    destinations: ["sydney"],
    capacityLabel: "Sleeps 6 · 3-night minimum",
    priceLabel: "From AUD $5,000 per night",
    priceConfirmed: true,
    pricing: { priceFrom: 5000, currency: "AUD", priceUnit: "per night", priceQualifier: "Indicative accommodation rate. Minimum stay, season, guest count, service requirements and availability may affect the final proposal.", pricingVisibility: "public", priceOnApplication: false },
    essence: "The harbour city with a private address.",
    description: "A private standalone residence in Sydney sleeping six, three-night minimum. Full residence details confirmed on enquiry.",
    specs: [{ label: "Type", value: "Private standalone house" }, { label: "Sleeps", value: "6" }, { label: "Minimum stay", value: "3 nights" }, { label: "Location", value: "Sydney" }],
    status: "by-enquiry",
    featured: false,
    order: 8,
    useCase: "Private residence",
    relatedJourneys: [],
    stay: { stayType: "Private standalone house", minimumStay: "3 nights" },
  },
  {
    category: "stay",
    name: "TASMANIA LODGE",
    slug: "tasmania-lodge",
    heroBrief: "SHOT · TASMANIA LODGE — REAL ASSET PHOTOGRAPHY REQUIRED · 16:10",
    tone: ["#BCC7C4", "#7C8B8F", "#D8CFC0"],
    location: "Tasmania",
    region: "australia",
    destinations: ["tasmania"],
    capacityLabel: "Sleeps 2 · 3-night minimum",
    priceLabel: "From AUD $2,500 per night",
    priceConfirmed: true,
    pricing: { priceFrom: 2500, currency: "AUD", priceUnit: "per night", priceQualifier: "Indicative accommodation rate. Minimum stay, season, guest count, service requirements and availability may affect the final proposal.", pricingVisibility: "public", priceOnApplication: false },
    essence: "A lodge built for two.",
    description: "A private standalone lodge in Tasmania for two guests, three-night minimum. Full residence details confirmed on enquiry.",
    specs: [{ label: "Type", value: "Private standalone house" }, { label: "Sleeps", value: "2" }, { label: "Minimum stay", value: "3 nights" }, { label: "Location", value: "Tasmania" }],
    status: "by-enquiry",
    featured: false,
    order: 9,
    useCase: "Private residence",
    relatedJourneys: [],
    stay: { stayType: "Private standalone house", minimumStay: "3 nights" },
  },
  {
    category: "stay",
    name: "TASMANIA GOLF",
    slug: "tasmania-golf",
    heroBrief: "SHOT · TASMANIA GOLF — REAL ASSET PHOTOGRAPHY REQUIRED · 16:10",
    tone: ["#BCC7C4", "#7C8B8F", "#D8CFC0"],
    location: "Tasmania",
    region: "australia",
    destinations: ["tasmania"],
    capacityLabel: "Sleeps 14 · 3-night minimum",
    priceLabel: "From AUD $4,500 per night",
    priceConfirmed: true,
    pricing: { priceFrom: 4500, currency: "AUD", priceUnit: "per night", priceQualifier: "Indicative accommodation rate. Minimum stay, season, guest count, service requirements and availability may affect the final proposal.", pricingVisibility: "public", priceOnApplication: false },
    essence: "Fourteen beds beside the fairways.",
    description: "A private standalone house in Tasmania sleeping fourteen, three-night minimum, close to the island's celebrated golf country. Full details confirmed on enquiry.",
    specs: [{ label: "Type", value: "Private standalone house" }, { label: "Sleeps", value: "14" }, { label: "Minimum stay", value: "3 nights" }, { label: "Location", value: "Tasmania" }],
    status: "by-enquiry",
    featured: false,
    order: 10,
    useCase: "Private residence",
    relatedJourneys: [],
    stay: { stayType: "Private standalone house", minimumStay: "3 nights" },
  },
];

/* Category-default pricing scaffolds — units and qualifiers only; priceFrom stays
   unset until commercially confirmed via the asset-confirmation register. */
for (const it of INVENTORY) {
  if (!it.pricing) {
    it.pricing = {
      currency: "AUD",
      priceUnit: it.category === "air" ? "per hour" : it.category === "sea" ? (it.sea?.dayCharter ? "per day" : "per day") : "per night",
      priceOnApplication: true,
      pricingVisibility: "public",
      priceQualifier: "Indicative once confirmed \u00B7 subject to dates, routing, guests, season and availability",
    };
  }
}

/* ---------------- helpers ---------------- */
export const byCategory = (c: Category) =>
  INVENTORY.filter((i) => i.category === c).sort(
    (a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order
  );

export const bySlug = (c: Category, slug: string) =>
  INVENTORY.find((i) => i.category === c && i.slug === slug);

export const byDestination = (dest: string) =>
  INVENTORY.filter((i) => i.destinations.includes(dest)).sort(
    (a, b) => Number(b.featured) - Number(a.featured) || a.order - b.order
  );

export const CATEGORY_META: Record<
  Category,
  { title: string; browsePath: string; browseLabel: string; viewLabel: string; kind: string }
> = {
  air: { title: "The AIR Fleet", browsePath: "/air/fleet", browseLabel: "Browse the fleet", viewLabel: "View aircraft", kind: "aircraft-category" },
  sea: { title: "The SEA Fleet", browsePath: "/sea/fleet", browseLabel: "Browse the fleet", viewLabel: "View yacht", kind: "vessel" },
  stay: { title: "The STAY Collection", browsePath: "/stay/collection", browseLabel: "Browse the collection", viewLabel: "View stay", kind: "residence" },
};


/* ---- V2 pricing display: one function, governed. Renders a real "From AUD $X per unit"
   only when the item is commercially confirmed; otherwise the intentional POA label. ---- */
export function priceDisplay(i: InventoryItem): { line: string; qualifier: string } {
  const p = i.pricing;
  if (i.priceConfirmed && p?.priceFrom && p.currency && p.priceUnit && p.priceUnit !== "POA") {
    return {
      line: `From ${p.currency} $${p.priceFrom.toLocaleString()} ${p.priceUnit}`,
      qualifier: p.priceQualifier || "Indicative \u00B7 subject to dates, routing, season and availability",
    };
  }
  return {
    line: i.priceLabel,
    qualifier: p?.priceQualifier || "Confirmed to your dates on enquiry \u00B7 reviewed by a person",
  };
}

/* Pricing bands for browsing (renders in filters only when priced inventory exists). */
export const PRICE_BANDS = [
  { id: "u5", label: "Under $5,000", min: 0, max: 5000 },
  { id: "5-10", label: "$5,000\u2013$10,000", min: 5000, max: 10000 },
  { id: "10-25", label: "$10,000\u2013$25,000", min: 10000, max: 25000 },
  { id: "25-50", label: "$25,000\u2013$50,000", min: 25000, max: 50000 },
  { id: "50p", label: "$50,000+", min: 50000, max: Infinity },
];
export const hasPricedInventory = (items: InventoryItem[]) =>
  items.some((i) => i.priceConfirmed && i.pricing?.priceFrom);

/* V2.1 — confirmed pricing bands (workbook-driven). */
export const CATEGORY_BANDS: Record<Category, { id: string; label: string; min: number; max: number }[]> = {
  air: [
    { id: "a1", label: "Under AUD $4,000", min: 0, max: 4000 },
    { id: "a2", label: "AUD $4,000\u2013$7,499", min: 4000, max: 7500 },
    { id: "a3", label: "AUD $7,500\u2013$11,999", min: 7500, max: 12000 },
    { id: "a4", label: "AUD $12,000+", min: 12000, max: Infinity },
  ],
  sea: [
    { id: "s1", label: "Under AUD $1,500", min: 0, max: 1500 },
    { id: "s2", label: "AUD $1,500\u2013$1,999", min: 1500, max: 2000 },
    { id: "s3", label: "AUD $2,000+", min: 2000, max: Infinity },
  ],
  stay: [
    { id: "t1", label: "Under AUD $3,000", min: 0, max: 3000 },
    { id: "t2", label: "AUD $3,000\u2013$5,999", min: 3000, max: 6000 },
    { id: "t3", label: "AUD $6,000+", min: 6000, max: Infinity },
  ],
};
export const RATE_DISCLOSURE =
  "All rates are indicative, subject to availability and confirmed in writing after dates, routing and requirements are reviewed.";
