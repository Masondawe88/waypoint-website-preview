/* ============================================================
   WAYPOINT & Co. — The World: destination hierarchy · v1.2
   Region → destination → inventory / journeys / editorial.
   Australia leads. NZ + Pacific are the natural next expansion.
   Europe + US are intentionally future-facing — never falsely
   populated. `state` controls the treatment:
     open    — full destination page with inventory
     horizon — page exists; honest "opening" copy, enquiry only
     future  — listed in the atlas; no page yet
   ============================================================ */

export type DestState = "open" | "horizon" | "future";

export type Destination = {
  slug: string;
  name: string;
  region: string;
  state: DestState;
  essence: string;
  tone: [string, string, string];
  journeys?: { slug: string; title: string }[];
  experiences?: string[];
  fullWorld?: string; // route of a full master-template world, if built
};

export type Region = {
  slug: string;
  name: string;
  state: DestState; // the region's overall treatment
  note: string;
  destinations: Destination[];
};

const d = (
  slug: string, name: string, region: string, state: DestState,
  essence: string, tone: [string, string, string],
  extra: Partial<Destination> = {}
): Destination => ({ slug, name, region, state, essence, tone, ...extra });

export const REGIONS: Region[] = [
  {
    slug: "australia",
    name: "Australia",
    state: "open",
    note: "The primary world — where the house lives.",
    destinations: [
      d("whitsundays", "The Whitsundays", "australia", "open",
        "Seventy-four islands inside the reef's shelter.",
        ["#8FB3AE", "#C2D5D0", "#EDE6D6"],
        {
          fullWorld: "/world/whitsundays",
          journeys: [
            { slug: "island-passage", title: "Island Passage" },
            { slug: "island-arrival", title: "Island Arrival" },
          ],
          experiences: ["Whitehaven", "Hook Island", "Hayman Island", "Outer Reef"],
        }),
      d("sydney", "Sydney", "australia", "open",
        "The harbour city, best understood from the water.",
        ["#4E5A64", "#8B98A3", "#C9C4B7"],
        {
          journeys: [{ slug: "harbour-connection", title: "Harbour Connection" }],
          experiences: ["Harbour evenings", "Dining", "Events", "Private access"],
        }),
      d("noosa", "Noosa", "australia", "open",
        "Coast, river and hinterland within one unhurried stay.",
        ["#A9B08C", "#C9B295", "#E6E0D2"],
        {
          journeys: [{ slug: "coastal-interlude", title: "Coastal Interlude" }],
          experiences: ["River mornings", "Hinterland", "Wellness", "Private dining"],
        }),
      d("tasmania", "Tasmania", "australia", "open",
        "Architecture, wilderness and the feeling of being far away.",
        ["#3E4640", "#56534B", "#A9703C"],
        {
          journeys: [{ slug: "southern-latitude", title: "Southern Latitude" }],
          experiences: ["Cool-climate wine", "Wilderness", "Firelight", "The southern table"],
        }),
      d("byron-bay", "Byron Bay", "australia", "horizon",
        "The cape, the hinterland, the slower coast.", ["#A9B08C", "#C9C6AB", "#E6E0D2"]),
      d("great-barrier-reef", "Great Barrier Reef", "australia", "horizon",
        "A different scale of blue.", ["#3E5F5C", "#5E8A86", "#C2D5D0"]),
      d("islands", "Australian Islands", "australia", "horizon",
        "Lord Howe, Kangaroo, and the coasts between.", ["#7C8B8F", "#C2D5D0", "#EDE6D6"]),
      d("outback", "The Outback", "australia", "horizon",
        "Station country, reached on its own terms.", ["#7C7466", "#B8AC93", "#D6CDB8"]),
      d("central-australia", "Central Australia", "australia", "horizon",
        "The centre, at first light.", ["#8A6F52", "#B8AC93", "#E0CDB0"]),
      d("adelaide", "Adelaide & Wine Country", "australia", "horizon",
        "The vines an hour from the runway.", ["#6A6C60", "#A39A82", "#D6CDB8"]),
    ],
  },
  {
    slug: "new-zealand",
    name: "New Zealand",
    state: "horizon",
    note: "The natural next expansion — across the Tasman.",
    destinations: [
      d("queenstown", "Queenstown", "new-zealand", "horizon",
        "Alpine water, vertical light.", ["#3E4640", "#6E7B75", "#C4CDC4"]),
      d("central-otago", "Central Otago", "new-zealand", "horizon",
        "Pinot country between the ranges.", ["#56534B", "#A39A82", "#D6CDB8"]),
      d("bay-of-islands", "Bay of Islands", "new-zealand", "horizon",
        "One hundred and forty-four reasons to sail north.", ["#5E8A86", "#8FB3AE", "#E6E0D2"]),
      d("auckland", "Auckland", "new-zealand", "future",
        "The city of sails.", ["#4E5A64", "#8B98A3", "#C9C4B7"]),
      d("southern-alps", "Southern Alps", "new-zealand", "future",
        "The divide, by air.", ["#3E4640", "#7C8B8F", "#E9EBE6"]),
    ],
  },
  {
    slug: "pacific",
    name: "Pacific",
    state: "horizon",
    note: "Open water north — Fiji first.",
    destinations: [
      d("fiji", "Fiji", "pacific", "horizon",
        "Three hundred islands, one word for welcome.", ["#5E8A86", "#8FB3AE", "#EDE6D6"]),
      d("french-polynesia", "French Polynesia", "pacific", "future",
        "The far blue.", ["#3E5F5C", "#8FB3AE", "#C2D5D0"]),
      d("new-caledonia", "New Caledonia", "pacific", "future",
        "The lagoon behind the reef.", ["#5E8A86", "#C2D5D0", "#E6E0D2"]),
      d("vanuatu", "Vanuatu", "pacific", "future",
        "Volcano light.", ["#4D4A42", "#7C7466", "#B8AC93"]),
      d("norfolk-island", "Norfolk Island", "pacific", "future",
        "The pines above the swell.", ["#3E4640", "#6A6C60", "#C4CDC4"]),
    ],
  },
  {
    slug: "europe",
    name: "Europe",
    state: "future",
    note: "Intentionally future-facing — ANASA's waters, when the time comes.",
    destinations: [
      d("mediterranean", "Mediterranean", "europe", "horizon",
        "Older waters, the same standard. ANASA's future season.", ["#2E3640", "#5E8A86", "#C2D5D0"]),
      d("french-riviera", "French Riviera", "europe", "future",
        "The original coastline.", ["#5E6B75", "#9AA5AD", "#E6E0D2"]),
      d("greek-islands", "Greek Islands", "europe", "future",
        "White light on white stone.", ["#8B98A3", "#C2D5D0", "#EFEDE4"]),
      d("italy", "Italy", "europe", "future",
        "The long peninsula.", ["#6A6C60", "#A39A82", "#D6CDB8"]),
      d("balearics", "Balearics", "europe", "future",
        "Islands with their own hours.", ["#5E8A86", "#C9B295", "#E6E0D2"]),
      d("croatia", "Croatia", "europe", "future",
        "A thousand islands, one coast.", ["#4E5A64", "#8FB3AE", "#D8CFC0"]),
      d("alps", "The Alps", "europe", "future",
        "Winter, properly.", ["#3E4640", "#7C8B8F", "#E9EBE6"]),
    ],
  },
  {
    slug: "united-states",
    name: "United States",
    state: "future",
    note: "One residence already stands — the rest arrives deliberately.",
    destinations: [
      d("mountain-west", "Mountain West", "united-states", "horizon",
        "Tahoe, the Rockies, snow light. Mountain Majesty stands here.",
        ["#3E4640", "#6E6759", "#D8CFC0"]),
      d("california", "California", "united-states", "future",
        "The long coast.", ["#C9B295", "#D6CDB8", "#E6E0D2"]),
      d("new-york", "New York", "united-states", "future",
        "The vertical city.", ["#2E3640", "#5E6B75", "#B3B0A7"]),
      d("florida", "Florida", "united-states", "future",
        "Water at the door.", ["#5E8A86", "#C2D5D0", "#EFEDE4"]),
      d("hawaii", "Hawai\u02BBi", "united-states", "future",
        "The far islands.", ["#3E5F5C", "#8FB3AE", "#C9B295"]),
    ],
  },
];

export const allDestinations = (): Destination[] =>
  REGIONS.flatMap((r) => r.destinations);

export const destBySlug = (slug: string): Destination | undefined =>
  allDestinations().find((x) => x.slug === slug);
