import fs from 'fs';
import path from 'path';

const fileContent = fs.readFileSync('src/configs/map-data.js', 'utf8');

// Simple regex parser to find location IDs and names
const locRegex = /id:\s*'([^']+)',\s*name:\s*'([^']+)'/g;
const locations = [];
let match;
while ((match = locRegex.exec(fileContent)) !== null) {
    locations.push({ id: match[1], name: match[2] });
}

console.log(`--- Total locations in file: ${locations.length} ---`);
locations.forEach((loc, index) => {
    console.log(`${index + 1}. [${loc.id}] -> ${loc.name}`);
});
