import fs from 'fs';

const mapDataPath = './src/configs/map-data.js';
const content = fs.readFileSync(mapDataPath, 'utf8');

// We want to find the WORLDS structure.
// Let's count locations in each world and list the ones that share images.
// A simpler way: we'll parse map-data.js and extract the hierarchy.
// Let's look for WORLDS = { ... }
// We can use a Node script to import the file since it's ES6. 
// But map-data.js imports asset-data.js, which imports other things. To run it directly, we can use a dynamic import or convert it, or write a quick regex parser.

const worldRegex = /'([^']+)':\s*\{\s*name:\s*'([^']+)'/g;
let match;
console.log('Worlds defined in game:');
while ((match = worldRegex.exec(content)) !== null) {
    console.log(`- World Key: ${match[1]} | Name: ${match[2]}`);
}
