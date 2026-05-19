import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MAP_DATA_PATH = path.resolve(__dirname, '../configs/map-data.js');
const LOCATIONS_DIR = path.resolve(__dirname, '../assets/images/locations');

// Read map-data.js content
let content = fs.readFileSync(MAP_DATA_PATH, 'utf8');

// We want to evaluate the WORLDS object to inspect the locations
// Let's write a simple regex or evaluate it. Since it uses ESM imports, we can parse it using regex.
const locRegex = /id:\s*'([^']+)',\s*name:\s*'([^']+)'/g;
let match;
const locations = [];

while ((match = locRegex.exec(content)) !== null) {
    const id = match[1];
    const name = match[2];
    locations.push({ id, name });
}

console.log(`Total locations found: ${locations.length}`);

const missing = [];
const existing = [];

for (const loc of locations) {
    const imgPath = path.join(LOCATIONS_DIR, `${loc.id}.webp`);
    if (!fs.existsSync(imgPath)) {
        missing.push(loc);
    } else {
        existing.push(loc);
    }
}

console.log(`Existing images: ${existing.length}`);
console.log(`Missing images: ${missing.length}`);

console.log('\n--- Missing Image Locations ---');
missing.forEach((loc, idx) => {
    console.log(`${idx + 1}. [${loc.id}] -> ${loc.name}`);
});

fs.writeFileSync(
    path.join(__dirname, 'missing_images.json'),
    JSON.stringify(missing, null, 2)
);
