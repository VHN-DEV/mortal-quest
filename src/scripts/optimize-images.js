import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Path relative to this script in /scripts directory
const ASSETS_DIR = path.resolve(__dirname, '../assets/images');

async function convertDir(dir) {
    if (!fs.existsSync(dir)) return;
    
    const files = fs.readdirSync(dir);
    
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            await convertDir(fullPath);
        } else if (/\.(png|jpg|jpeg)$/i.test(file)) {
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
                
                // Remove original file after successful conversion
                fs.unlinkSync(fullPath); 
                console.log(`✓ Converted and removed original: ${file}`);
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
