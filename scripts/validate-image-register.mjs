// v1.4 register validation — provenance, publication, named-asset accuracy, crops, alt text
import { readFileSync } from "fs";
const reg = JSON.parse(readFileSync("content/image-register.json", "utf8")).records;
let errs = [];
for (const r of reg) {
  if (!r.publicAltText) errs.push(`${r.imageId}: missing alt text`);
  if (!r.mobileCrop) errs.push(`${r.imageId}: missing mobile crop`);
  if (r.classification === "REAL_ASSET") {
    if (r.aiGenerated) errs.push(`${r.imageId}: REAL_ASSET marked aiGenerated`);
    if (r.aiPrompt) errs.push(`${r.imageId}: REAL_ASSET carries an AI prompt`);
    if (!r.rightsRequirement) errs.push(`${r.imageId}: REAL_ASSET missing rights requirement`);
    if (!r.assetAccuracyRequired) errs.push(`${r.imageId}: REAL_ASSET must require accuracy`);
  }
  if (r.aiGenerated && r.status !== "TONAL_PLACEHOLDER_LIVE" && !(r.aiModel && r.generationDate))
    errs.push(`${r.imageId}: AI image without provenance`);
  if (r.publicationStatus === "TEMPORARY_PUBLISHED" && !r.replacementDependency)
    errs.push(`${r.imageId}: temporary without replacement note`);
}
if (errs.length) { console.error("REGISTER INVALID:\n" + errs.join("\n")); process.exit(1); }
console.log(`register valid: ${reg.length} records, 0 violations`);
