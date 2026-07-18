/* WAYPOINT image document · v1.4 — classification, rights, provenance, publication gates. */
export default {
  name: "waypointImage",
  title: "Image",
  type: "document",
  fields: [
    { name: "imageId", title: "Image ID (register)", type: "string", validation: (R: any) => R.required() },
    { name: "classification", title: "Classification", type: "string",
      options: { list: ["REAL_ASSET", "REAL_DESTINATION", "AI_EDITORIAL", "AI_CONCEPT", "TONAL_PLACEHOLDER"] },
      validation: (R: any) => R.required() },
    { name: "file", title: "Image", type: "image", options: { hotspot: true } },
    { name: "sourceType", type: "string", options: { list: ["operator", "owner", "licensed", "house-shoot", "ai"] } },
    { name: "sourceName", type: "string" },
    { name: "photographer", type: "string" },
    { name: "rightsStatus", type: "string",
      options: { list: ["NOT_CLEARED", "CLEARED", "LICENSED", "OWNED"] }, initialValue: "NOT_CLEARED" },
    { name: "approvalStatus", type: "string",
      options: { list: ["UNAPPROVED", "INTERNAL_APPROVED", "OWNER_APPROVED", "PUBLISH_APPROVED"] }, initialValue: "UNAPPROVED" },
    { name: "aiGenerated", type: "boolean", initialValue: false },
    { name: "aiModel", type: "string", hidden: ({ document }: any) => !document?.aiGenerated },
    { name: "generationPrompt", type: "text", hidden: ({ document }: any) => !document?.aiGenerated },
    { name: "generationDate", type: "date", hidden: ({ document }: any) => !document?.aiGenerated },
    { name: "assetAccuracyRequired", type: "boolean", initialValue: false },
    { name: "publicAltText", title: "Public alt text", type: "string" },
    { name: "internalShotBrief", title: "Shot brief (internal only)", type: "text" },
    { name: "caption", title: "Public caption", type: "string" },
    { name: "mobileCrop", type: "string" },
    { name: "desktopCrop", type: "string" },
    { name: "socialCrop", type: "string" },
    { name: "publicationStatus", type: "string",
      options: { list: ["NOT_PUBLISHED", "PUBLISHED", "TEMPORARY_PUBLISHED"] }, initialValue: "NOT_PUBLISHED" },
    { name: "replacementDependency", title: "Replacement requirement (temporary images)", type: "string" },
    { name: "relatedAsset", type: "reference", to: [{ type: "inventoryItem" }] },
    { name: "relatedDestination", type: "reference", to: [{ type: "destination" }] },
  ],
  validation: (Rule: any) =>
    Rule.custom((doc: any) => {
      if (!doc) return true;
      if (doc.publicationStatus !== "NOT_PUBLISHED") {
        if (!doc.publicAltText) return "Public images require alt text";
        if (doc.approvalStatus !== "PUBLISH_APPROVED") return "Unapproved images cannot publish";
      }
      if (doc.classification === "REAL_ASSET" && doc.publicationStatus !== "NOT_PUBLISHED" &&
          doc.rightsStatus === "NOT_CLEARED") return "REAL_ASSET requires cleared rights before publishing";
      if (doc.aiGenerated && (!doc.aiModel || !doc.generationPrompt || !doc.generationDate))
        return "AI-generated imagery requires provenance (model, prompt, date)";
      if (doc.publicationStatus === "TEMPORARY_PUBLISHED" && !doc.replacementDependency)
        return "Temporary images require a replacement note";
      if (doc.classification === "AI_CONCEPT" && doc.assetAccuracyRequired)
        return "Named-asset factual imagery cannot be AI_CONCEPT";
      return true;
    }),
};
