import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

const sourcePath = path.resolve("public/images/prof-harti-portrait-v3.svg");
const outputPath = path.resolve("public/images/prof-harti-portrait-final.webp");

const svg = await readFile(sourcePath, "utf8");
const match = svg.match(/href=["']data:image\/webp;base64,([^"']+)["']/i);

if (!match) {
  throw new Error("Embedded WebP portrait was not found in the SVG source");
}

const image = Buffer.from(match[1], "base64");

if (
  image.length < 16 ||
  image.subarray(0, 4).toString("ascii") !== "RIFF" ||
  image.subarray(8, 12).toString("ascii") !== "WEBP"
) {
  throw new Error("Extracted portrait is not a valid WebP file");
}

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, image);
console.log(`Portrait extracted: ${image.length} bytes -> ${outputPath}`);
