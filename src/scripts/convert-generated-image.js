import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const source = process.argv[2];
const destName = process.argv[3];

if (!source || !destName) {
    console.error("Usage: node src/scripts/convert-generated-image.js <source_path> <dest_name>");
    process.exit(1);
}

const destPath = path.join('src/assets/images/locations', `${destName}.webp`);

sharp(source)
    .webp({ quality: 85 })
    .toFile(destPath)
    .then(() => {
        console.log(`Successfully converted ${source} -> ${destPath}`);
    })
    .catch(err => {
        console.error("Error during image conversion:", err);
        // Fallback to simple copy if sharp fails
        fs.copyFileSync(source, path.join('src/assets/images/locations', `${destName}.png`));
        console.log(`Fallback: Copied ${source} -> ${destName}.png`);
    });
