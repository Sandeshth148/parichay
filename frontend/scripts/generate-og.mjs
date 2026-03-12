/**
 * Generates public/og-image.png from public/og-image.svg
 * Run: node scripts/generate-og.mjs
 * Requires: npm install --save-dev sharp
 */
import sharp from "sharp";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const svgPath = resolve(__dirname, "../public/og-image.svg");
const pngPath = resolve(__dirname, "../public/og-image.png");

const svg = readFileSync(svgPath);

await sharp(svg)
  .resize(1200, 630)
  .png({ compressionLevel: 8 })
  .toFile(pngPath);

console.log("✓ OG image generated → public/og-image.png (1200×630)");
