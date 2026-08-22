import { readFile, writeFile, mkdir } from "node:fs/promises";
import { createHash } from "node:crypto";
import path from "node:path";

const outputPath = path.resolve("public/images/prof-harti-portrait-final.webp");
const chunksDir = path.resolve("assets/portrait-11");
const parts = [];

for (let i = 0; i < 6; i += 1) {
  const name = `part-${String(i).padStart(2, "0")}.txt`;
  parts.push((await readFile(path.join(chunksDir, name), "utf8")).trim());
}

const image = Buffer.from(parts.join(""), "base64");

if (
  image.length !== 20398 ||
  image.subarray(0, 4).toString("ascii") !== "RIFF" ||
  image.subarray(8, 12).toString("ascii") !== "WEBP"
) {
  throw new Error(`Portrait 11 reconstruction failed: got ${image.length} bytes`);
}

const digest = createHash("sha256").update(image).digest("hex");
if (digest !== "f6d40e752b31ab1c948c21ce0484ee3bd8ea772f57dd31a17f5470c6da8f4a9c") {
  throw new Error(`Portrait 11 integrity check failed: ${digest}`);
}

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, image);
console.log(`Portrait 11 restored: ${image.length} bytes -> ${outputPath}`);
