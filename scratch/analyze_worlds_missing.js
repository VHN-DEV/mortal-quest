import fs from 'fs';
import path from 'path';

const mapDataPath = './src/configs/map-data.js';
const imagesDir = './src/assets/images/locations';
const content = fs.readFileSync(mapDataPath, 'utf8');

const existingImages = new Set(
    fs.readdirSync(imagesDir)
      .filter(file => file.endsWith('.webp'))
      .map(file => path.basename(file, '.webp'))
);

// We want to parse the WORLDS structure. Since it's a JS object, let's parse it block by block.
// A simple state machine or regex to find the blocks:
// 'nhan_gioi': { ... locations: [ { ... } ] }
// Let's find the locations block for each world.
const worldBlocks = {};
const worldKeys = ['nhan_gioi', 'linh_gioi', 'tien_gioi', 'ma_gioi'];

worldKeys.forEach(worldKey => {
    const startIndex = content.indexOf(`'${worldKey}':`);
    if (startIndex === -1) return;
    
    // Find where the next world block starts, or the end of the file
    let endIndex = content.length;
    worldKeys.forEach(otherKey => {
        if (otherKey === worldKey) return;
        const otherIndex = content.indexOf(`'${otherKey}':`, startIndex);
        if (otherIndex !== -1 && otherIndex < endIndex) {
            endIndex = otherIndex;
        }
    });
    
    const worldBlock = content.substring(startIndex, endIndex);
    
    // Parse locations inside this world block
    const locationRegex = /id:\s*'([^']+)',\s*name:\s*'([^']+)',[\s\S]*?image:\s*getLocImg\('([^']+)'\)/g;
    const locations = [];
    let match;
    while ((match = locationRegex.exec(worldBlock)) !== null) {
        locations.push({
            id: match[1],
            name: match[2],
            imgId: match[3]
        });
    }
    
    worldBlocks[worldKey] = locations;
});

console.log('Breakdown of locations by World:');
for (const [worldKey, locations] of Object.entries(worldBlocks)) {
    const missing = [];
    locations.forEach(loc => {
        const hasOwnFile = existingImages.has(loc.id);
        const usesSameId = loc.id === loc.imgId;
        if (!hasOwnFile || !usesSameId) {
            missing.push(loc);
        }
    });
    console.log(`\n=== World: ${worldKey} (${locations.length} total locations, ${missing.length} missing own images) ===`);
    missing.slice(0, 15).forEach(loc => {
        console.log(`  - [${loc.id}] ${loc.name} -> uses ${loc.imgId}`);
    });
    if (missing.length > 15) {
        console.log(`  ... and ${missing.length - 15} more`);
    }
}
