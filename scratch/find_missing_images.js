import fs from 'fs';
import path from 'path';

const mapDataPath = './src/configs/map-data.js';
const imagesDir = './src/assets/images/locations';

const content = fs.readFileSync(mapDataPath, 'utf8');

// Using a robust regex to parse out the fields
// Locations are defined inside list of objects.
// Let's match: id, name, image (which calls getLocImg('imgId'))
const locationRegex = /id:\s*'([^']+)',\s*name:\s*'([^']+)',[\s\S]*?image:\s*getLocImg\('([^']+)'\)/g;

const locations = [];
let match;
while ((match = locationRegex.exec(content)) !== null) {
    locations.push({
        id: match[1],
        name: match[2],
        imgId: match[3]
    });
}

const existingImages = new Set(
    fs.readdirSync(imagesDir)
      .filter(file => file.endsWith('.webp'))
      .map(file => path.basename(file, '.webp'))
);

const missingOwn = [];
locations.forEach(loc => {
    const hasOwnFile = existingImages.has(loc.id);
    const usesSameId = loc.id === loc.imgId;
    if (!hasOwnFile || !usesSameId) {
        missingOwn.push({
            id: loc.id,
            name: loc.name,
            imgId: loc.imgId,
            hasOwnFile,
            usesSameId
        });
    }
});

const report = {
    totalLocations: locations.length,
    existingImagesCount: existingImages.size,
    missingOwnCount: missingOwn.length,
    missingOwnList: missingOwn
};

fs.writeFileSync('./scratch/missing_images_report.json', JSON.stringify(report, null, 2), 'utf8');
console.log(`Saved report. Total missing unique images: ${missingOwn.length}`);
