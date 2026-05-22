import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Path relative to this script in /scripts directory
const ASSETS_DIR = path.resolve(__dirname, '../assets/images');
const TRASH_DIR = path.resolve(__dirname, '../assets/old_images');

if (!fs.existsSync(TRASH_DIR)) {
    fs.mkdirSync(TRASH_DIR, { recursive: true });
}

async function convertDir(dir) {
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            await convertDir(fullPath);
        } else if (/\.(png|jpg|jpeg|jfif)$/i.test(file)) {
            const ext = path.extname(file);
            const baseName = path.basename(file, ext);
            const targetPath = path.join(dir, `${baseName}.webp`);

            try {
                // Only convert if webp doesn't exist or is older than original
                if (!fs.existsSync(targetPath) || fs.statSync(fullPath).mtime > fs.statSync(targetPath).mtime) {
                    console.log(`Optimizing: ${file} -> ${baseName}.webp`);
                    await sharp(fullPath)
                        .webp({ quality: 80 })
                        .toFile(targetPath);
                    console.log(`✓ Converted: ${file}`);
                }

                // Move original file to old_images after successful conversion
                let finalTrashPath = path.join(TRASH_DIR, file);
                let counter = 1;
                while (fs.existsSync(finalTrashPath)) {
                    finalTrashPath = path.join(TRASH_DIR, `${baseName}_${counter}${ext}`);
                    counter++;
                }
                fs.renameSync(fullPath, finalTrashPath);
                console.log(`✓ Moved original to old_images: ${file}`);
            } catch (err) {
                console.error(`✗ Failed to convert ${file}:`, err.message);
            }
        }
    }
}

console.log('--- Image Optimization Start ---');
convertDir(ASSETS_DIR)
    .then(() => console.log('--- Image Optimization Completed ---'))
    .catch(err => console.error('Error during optimization:', err));
