import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const imagePath = path.resolve("public/images/prof-harti-portrait-final.webp");
let image = await readFile(imagePath);

if (
  image.length < 10000 ||
  image.subarray(0, 4).toString("ascii") !== "RIFF" ||
  image.subarray(8, 12).toString("ascii") !== "WEBP"
) {
  throw new Error("Tracked Prof Harti portrait is missing or invalid");
}

const declaredSize = image.readUInt32LE(4) + 8;

// The Git blob transport may drop the final RIFF padding byte. Restore it safely.
if (declaredSize === image.length + 1) {
  image = Buffer.concat([image, Buffer.from([0])]);
  await writeFile(imagePath, image);
}

if (declaredSize !== image.length) {
  throw new Error(`Portrait is truncated: expected ${declaredSize} bytes, got ${image.length}`);
}

console.log(`Portrait verified: ${image.length} bytes -> ${imagePath}`);
