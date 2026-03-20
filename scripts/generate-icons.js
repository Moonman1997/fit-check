import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const svgPath = path.join(__dirname, '..', 'public', 'icon.svg');
const svgBuffer = fs.readFileSync(svgPath);

const sizes = [16, 32, 48, 128];

async function generate() {
  for (const size of sizes) {
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(path.join(__dirname, '..', 'public', `icon-${size}.png`));
    console.log(`Generated icon-${size}.png`);
  }
}

generate();
