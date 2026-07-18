/* WAYPOINT & Co. — image classification system · v1.4
   Mirrors content/image-register.json and the Sanity waypointImage schema. */
export type ImageClassification =
  | "REAL_ASSET" | "REAL_DESTINATION" | "AI_EDITORIAL" | "AI_CONCEPT" | "TONAL_PLACEHOLDER";

export type ImageryStatus =
  | "no-imagery" | "tonal-placeholder" | "ai-draft" | "ai-approved"
  | "real-draft" | "real-approved" | "replacement-required" | "complete";

export type ImageRecord = {
  imageId: string;
  classification: ImageClassification;
  sourceType?: "operator" | "owner" | "licensed" | "house-shoot" | "ai" | null;
  sourceName?: string | null;
  photographer?: string | null;
  rightsStatus: "NOT_CLEARED" | "CLEARED" | "LICENSED" | "OWNED";
  approvalStatus: "UNAPPROVED" | "INTERNAL_APPROVED" | "OWNER_APPROVED" | "PUBLISH_APPROVED";
  aiGenerated: boolean;
  aiModel?: string | null;
  generationPrompt?: string | null;
  generationDate?: string | null;
  assetAccuracyRequired: boolean;
  publicAltText: string;            // the ONLY text from a record that may render publicly
  internalShotBrief?: string | null; // never rendered in production
  focalPoint?: { x: number; y: number } | "center";
  mobileCrop?: string | null;
  publicationStatus: "NOT_PUBLISHED" | "PUBLISHED" | "TEMPORARY_PUBLISHED";
  replacementDependency?: string | null; // required when TEMPORARY_PUBLISHED
};

/* Shot briefs render only in development or when explicitly enabled for internal review. */
export const showInternalBriefs = () =>
  process.env.NODE_ENV === "development" ||
  process.env.NEXT_PUBLIC_SHOW_SHOT_BRIEFS === "true";

/* Publication gate — mirrors Sanity validation, enforced app-side too. */
export function canPublish(r: ImageRecord): { ok: boolean; reason?: string } {
  if (!r.publicAltText) return { ok: false, reason: "Public images require alt text" };
  if (r.approvalStatus !== "PUBLISH_APPROVED") return { ok: false, reason: "Unapproved images cannot publish" };
  if (r.classification === "REAL_ASSET" && r.rightsStatus === "NOT_CLEARED")
    return { ok: false, reason: "REAL_ASSET requires cleared rights" };
  if (r.aiGenerated && (!r.aiModel || !r.generationPrompt || !r.generationDate))
    return { ok: false, reason: "AI imagery requires provenance" };
  if (r.publicationStatus === "TEMPORARY_PUBLISHED" && !r.replacementDependency)
    return { ok: false, reason: "Temporary images require a replacement note" };
  return { ok: true };
}
