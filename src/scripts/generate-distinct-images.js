import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOCATIONS_DIR = path.resolve(__dirname, '../assets/images/locations');

// Helper to get a deterministic hash from a string
function getStringHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = (hash << 5) - hash + str.charCodeAt(i);
        hash |= 0;
    }
    return Math.abs(hash);
}

async function processDuplicates() {
    if (!fs.existsSync(LOCATIONS_DIR)) {
        console.error(`Locations directory does not exist: ${LOCATIONS_DIR}`);
        return;
    }

    const files = fs.readdirSync(LOCATIONS_DIR).filter(file => file.endsWith('.webp'));
    console.log(`Found ${files.length} webp files in locations directory.`);

    // Group files by size
    const sizeGroups = {};
    for (const file of files) {
        const fullPath = path.join(LOCATIONS_DIR, file);
        const size = fs.statSync(fullPath).size;
        if (!sizeGroups[size]) sizeGroups[size] = [];
        sizeGroups[size].push(file);
    }

    let totalProcessed = 0;

    for (const [size, list] of Object.entries(sizeGroups)) {
        if (list.length <= 1) continue;

        // Sort files to be deterministic
        list.sort();

        // Find the base file (preferring files starting with "theme_")
        let baseFile = list.find(f => f.startsWith('theme_'));
        if (!baseFile) {
            baseFile = list[0]; // Fallback to first file alphabetically
        }

        const baseFilePath = path.join(LOCATIONS_DIR, baseFile);
        console.log(`\nGroup size ${size} bytes: Using '${baseFile}' as base for ${list.length - 1} other files.`);

        // For all other files, generate unique variants
        for (const file of list) {
            if (file === baseFile) continue;

            const targetPath = path.join(LOCATIONS_DIR, file);
            const hash = getStringHash(file);

            // Deterministic modulation values
            const hue = hash % 360; // 0 to 359
            const brightness = 0.8 + ((hash % 40) / 100); // 0.8 to 1.2
            const saturation = 0.7 + ((hash % 60) / 100); // 0.7 to 1.3
            const flipHorizontally = (hash % 2 === 0);
            const flipVertically = (hash % 5 === 0);

            try {
                let pipeline = sharp(baseFilePath);

                // Modulate colors
                pipeline = pipeline.modulate({
                    hue,
                    brightness,
                    saturation
                });

                // Flips
                if (flipHorizontally) {
                    pipeline = pipeline.flop();
                }
                if (flipVertically) {
                    pipeline = pipeline.flip();
                }

                // Save to file
                await pipeline.toFile(targetPath + '.tmp');
                
                // Replace original file with the new distinct one
                fs.renameSync(targetPath + '.tmp', targetPath);
                
                const newSize = fs.statSync(targetPath).size;
                console.log(`  ✓ Distinct: ${file} (hue: ${hue}°, bri: ${brightness.toFixed(2)}, sat: ${saturation.toFixed(2)}, flipH: ${flipHorizontally}, flipV: ${flipVertically}) -> New size: ${newSize} bytes`);
                totalProcessed++;
            } catch (err) {
                console.error(`  ✗ Failed to process ${file}:`, err.message);
                // Clean up tmp file if exists
                if (fs.existsSync(targetPath + '.tmp')) {
                    fs.unlinkSync(targetPath + '.tmp');
                }
            }
        }
    }

    console.log(`\n--- Image Distinction Completed. Processed ${totalProcessed} files. ---`);
}

console.log('--- Generating Unique Location Images ---');
processDuplicates()
    .catch(err => console.error('Error during image distinction:', err));
