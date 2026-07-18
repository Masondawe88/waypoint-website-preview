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
  air?: { type: string; rangeLabel: string; baseLabel: string };
  sea?: { dayCharter: boolean; overnightGuests?: string };
  stay?: { bedrooms?: string; stayType: string };
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
    location: "East Coast · Australia",
    region: "australia",
    destinations: ["sydney", "whitsundays", "noosa", "tasmania"],
    capacityLabel: "7–8 guests",
    priceLabel: "Indicative charter rate on application",
    priceConfirmed: false,
    essence: "Light-jet speed for the sectors you fly most.",
    description:
      "A proven light jet for fast domestic movements — capital to capital, coast to island, same-day returns. Efficient, private and quietly capable, with access to most sealed regional airports.",
    specs: [
      { label: "Class", value: "Light jet" },
      { label: "Typical guests", value: "7–8" },
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
    air: { type: "Light jet", rangeLabel: "≈ 2,000 nm · indicative", baseLabel: "East Coast, Australia" },
  },
  {
    category: "air",
    name: "Challenger 605",
    slug: "challenger-605",
    heroBrief: "SHOT · LARGE-CABIN WING OVER WATER, CRUISE · 16:10",
    tone: ["#2E3640", "#5E6B75", "#9AA5AD"],
    location: "Australia · International",
    region: "australia",
    destinations: ["sydney", "whitsundays", "tasmania"],
    capacityLabel: "10–12 guests",
    priceLabel: "Rate on application",
    priceConfirmed: false,
    essence: "A large cabin for the long way there.",
    description:
      "Wide-body comfort across long domestic and international sectors — a settled cabin for working, dining and resting, with the range to cross to Asia and the Pacific in one considered movement.",
    specs: [
      { label: "Class", value: "Large cabin" },
      { label: "Typical guests", value: "10–12" },
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
    air: { type: "Large-cabin jet", rangeLabel: "≈ 4,000 nm · indicative", baseLabel: "Australia · International" },
  },
  {
    category: "air",
    name: "King Air B200",
    slug: "king-air-b200",
    heroBrief: "SHOT · TURBOPROP ON ISLAND STRIP, PROPS TURNING · 16:10",
    tone: ["#6A6C60", "#A39A82", "#D6CDB8"],
    location: "Queensland · Australia",
    region: "australia",
    destinations: ["whitsundays", "noosa", "outback", "great-barrier-reef"],
    capacityLabel: "Up to 9 guests",
    priceLabel: "Indicative charter rate on application",
    priceConfirmed: false,
    essence: "The strip the jets can't reach is where this begins.",
    description:
      "The workhorse of remote Australia — island strips, station country and regional sectors beyond the network. Soft-luggage configuration, two-crew operations, and access where the timetable has never been.",
    specs: [
      { label: "Class", value: "Turboprop" },
      { label: "Typical guests", value: "Up to 9 · soft luggage" },
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
    air: { type: "Turboprop", rangeLabel: "Regional · remote", baseLabel: "Queensland, Australia" },
  },
  {
    category: "air",
    name: "Twin-Engine Helicopter",
    slug: "twin-helicopter",
    heroBrief: "SHOT · HELICOPTER OVER REEF EDGE, DOOR VIEW · 16:10",
    tone: ["#4D4A42", "#7C7466", "#B8AC93"],
    location: "East Coast · Australia",
    region: "australia",
    destinations: ["whitsundays", "sydney", "noosa", "great-barrier-reef"],
    capacityLabel: "2–6 guests",
    priceLabel: "Rate on application",
    priceConfirmed: false,
    essence: "Continue where fixed-wing ends.",
    description:
      "Airport to yacht, runway to residence, city to sandbar — rotary charter closes the final distance. Scenic access, island transfers and arrivals no runway can offer.",
    specs: [
      { label: "Class", value: "Rotary" },
      { label: "Typical guests", value: "2–6 · light luggage" },
      { label: "Access", value: "Helipads, vessels, approved sites" },
      { label: "Example sector", value: "Hamilton Island → Whitehaven" },
    ],
    status: "by-enquiry",
    featured: false,
    order: 4,
    useCase: "Transfers · scenic · yacht connections",
    relatedJourneys: ["island-passage"],
    attribution:
      "Accessed through selected operators. Final aircraft subject to mission review and availability.",
    air: { type: "Helicopter", rangeLabel: "Transfer & scenic", baseLabel: "East Coast, Australia" },
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
    capacityLabel: "Guests by arrangement",
    priceLabel: "Charter rate on application",
    priceConfirmed: false,
    essence: "The flagship, at home in the passage.",
    description:
      "ALANI is the house flagship — crewed charter through the seventy-four islands, from Whitehaven at first light to the still anchorages of Hook and the outer reef when the weather opens. The passage, crossed at your own pace.",
    specs: [
      { label: "Charter", value: "Overnight · crewed" },
      { label: "Waters", value: "Whitsundays · Outer Reef" },
      { label: "Specifications", value: "Provided on enquiry" },
    ],
    status: "by-enquiry",
    featured: true,
    order: 1,
    useCase: "Island passages · reef journeys",
    relatedJourneys: ["island-passage", "island-arrival"],
    sea: { dayCharter: false, overnightGuests: "By arrangement" },
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
    capacityLabel: "Day guests by configuration",
    priceLabel: "Seasonal pricing · on application",
    priceConfirmed: false,
    essence: "The day, taken to the water.",
    description:
      "The house day-charter hero — island lunches, sunset runs, proposals, corporate afternoons and coastal exploration. Noosa through the summer; Hamilton Island from March to November.",
    specs: [
      { label: "Charter", value: "Day · crewed" },
      { label: "Season", value: "Noosa · summer / Hamilton · Mar–Nov" },
      { label: "Specifications", value: "Provided on enquiry" },
    ],
    status: "seasonal",
    featured: true,
    order: 2,
    useCase: "Day charters · island lunches · sunset",
    relatedJourneys: ["coastal-interlude"],
    sea: { dayCharter: true },
  },
  {
    category: "sea",
    name: "Sydney Harbour Yacht",
    slug: "sydney-harbour-yacht",
    heroBrief: "SHOT · FOREDECK, BRIDGE AND OPERA HOUSE BEYOND, DUSK · 16:10",
    tone: ["#4E5A64", "#8B98A3", "#C9C4B7"],
    location: "Sydney Harbour",
    region: "australia",
    destinations: ["sydney"],
    locationMode: "arrangement",
    capacityLabel: "Guests by vessel",
    priceLabel: "Rate on application",
    priceConfirmed: false,
    essence: "The harbour, from the only vantage that matters.",
    description:
      "A selected partner vessel for harbour charters — evenings on the water, events, and the city understood from its own centre. Final vessel confirmed to the occasion.",
    specs: [
      { label: "Charter", value: "Day & evening" },
      { label: "Waters", value: "Sydney Harbour" },
      { label: "Vessel", value: "Selected to the occasion" },
    ],
    status: "by-enquiry",
    featured: false,
    order: 3,
    useCase: "Harbour evenings · events · entertaining",
    relatedJourneys: ["harbour-connection"],
    attribution: "Accessed through our trusted partner network.",
    sea: { dayCharter: true },
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
];

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
