import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MAP_DATA_PATH = path.resolve(__dirname, '../configs/map-data.js');
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

// Function to map a location to a theme
function getThemeForLocation(loc, worldId) {
    const id = loc.id.toLowerCase();
    const name = loc.name.toLowerCase();

    // 1. Demonic / Dark / Blood themes
    if (
        id.includes('ma') || name.includes('ma') ||
        id.includes('huyet') || name.includes('huyet') ||
        id.includes('u_') || name.includes('u ') || name.includes('uđô') ||
        id.includes('sat') || name.includes('sát') ||
        id.includes('quy') || name.includes('quỷ') ||
        id.includes('uyen') || name.includes('uyên') ||
        id.includes('cot') || name.includes('cốt') ||
        id.includes('diem_la') || name.includes('diêm la') ||
        id.includes('am_son') || name.includes('âm sơn')
    ) {
        if (id.includes('thanh') || id.includes('dien') || name.includes('thành') || name.includes('điện')) {
            return 'theme_ma_thanh.webp';
        }
        if (id.includes('hai') || name.includes('hải') || id.includes('pool') || id.includes('tri')) {
            return 'theme_huyet_hai.webp';
        }
        return 'theme_ma_uyen.webp';
    }

    // 2. Battlegrounds / Towers
    if (
        id.includes('chien_truong') || name.includes('chiến trường') ||
        id.includes('thap') || name.includes('tháp') ||
        id.includes('ai_') || name.includes('ải')
    ) {
        return 'theme_chien_truong.webp';
    }

    // 3. Space / Time / Rift / Rules
    if (
        id.includes('khong_gian') || name.includes('không gian') ||
        id.includes('khe_nut') || name.includes('khe nứt') ||
        id.includes('tue_nguyet') || name.includes('tuế nguyệt') ||
        id.includes('phap_tac') || name.includes('pháp tắc') ||
        id.includes('di_tich') || name.includes('di tích') ||
        id.includes('tran_ngon') || name.includes('chân ngôn')
    ) {
        return 'theme_khong_gian.webp';
    }

    // 4. Oceans / Islands / Watery locations
    if (
        id.includes('hai') || name.includes('hải') ||
        id.includes('dao') || name.includes('đảo') ||
        id.includes('tri') || name.includes('trì') ||
        id.includes('song') || name.includes('sông') || name.includes('hà') ||
        id.includes('minh_ha') || name.includes('nại hà')
    ) {
        return 'theme_hai_toc.webp';
    }

    // 5. Cities / Towns / Sects / Palaces
    if (
        id.includes('thanh') || name.includes('thành') ||
        id.includes('tong') || name.includes('tông') ||
        id.includes('mon') || name.includes('môn') ||
        id.includes('cung') || name.includes('cung') ||
        id.includes('phu') || name.includes('phủ') ||
        id.includes('trang') || name.includes('trang') ||
        id.includes('bao') || name.includes('bảo') ||
        id.includes('vien') || name.includes('viện') ||
        id.includes('bang') || name.includes('bang')
    ) {
        if (worldId === 'tien_gioi') {
            return 'theme_tien_phu.webp';
        }
        return 'theme_linh_thanh.webp';
    }

    // 6. Natural regions / Mountains / Valleys / Forests
    if (
        id.includes('son') || name.includes('sơn') || name.includes('núi') ||
        id.includes('coc') || name.includes('cốc') || name.includes('thung lũng') ||
        id.includes('lam') || name.includes('lâm') || name.includes('rừng') ||
        id.includes('vuc') || name.includes('vực') ||
        id.includes('thao_nguyen') || name.includes('thảo nguyên') ||
        id.includes('luc') || name.includes('lục')
    ) {
        if (worldId === 'tien_gioi') {
            return 'theme_tien_vuc.webp';
        }
        return 'theme_linh_ngoai.webp';
    }

    // 7. World-based fallbacks
    if (worldId === 'tien_gioi') {
        return 'theme_tien_vuc.webp';
    }
    if (worldId === 'ma_gioi') {
        return 'theme_ma_uyen.webp';
    }
    if (worldId === 'song_song') {
        return 'theme_khong_gian.webp';
    }

    return 'theme_linh_ngoai.webp';
}

async function run() {
    const content = fs.readFileSync(MAP_DATA_PATH, 'utf8');

    // Split by world keys to associate each location with its world
    const worlds = [
        { key: 'nhan_gioi', start: content.search(/'nhan_gioi'\s*:/) },
        { key: 'linh_gioi', start: content.search(/'linh_gioi'\s*:/) },
        { key: 'tien_gioi', start: content.search(/'tien_gioi'\s*:/) },
        { key: 'ma_gioi', start: content.search(/'ma_gioi'\s*:/) },
        { key: 'song_song', start: content.search(/'song_song'\s*:/) },
    ].sort((a, b) => a.start - b.start);

    console.log('World start positions:');
    worlds.forEach(w => console.log(`  ${w.key}: ${w.start}`));

    // Find end of each world block
    for (let i = 0; i < worlds.length; i++) {
        worlds[i].end = (i < worlds.length - 1) ? worlds[i + 1].start : content.length;
    }

    const locations = [];
    for (const world of worlds) {
        if (world.start === -1) continue;
        const worldContent = content.substring(world.start, world.end);
        
        const locRegex = /id:\s*'([^']+)',\s*name:\s*'([^']+)'/g;
        let match;
        while ((match = locRegex.exec(worldContent)) !== null) {
            locations.push({
                id: match[1],
                name: match[2],
                worldId: world.key
            });
        }
    }

    console.log(`Successfully parsed map data with ${locations.length} total locations.`);

    let missingCount = 0;
    let generatedCount = 0;

    for (const loc of locations) {
        const targetPath = path.join(LOCATIONS_DIR, `${loc.id}.webp`);
        
        if (!fs.existsSync(targetPath)) {
            missingCount++;
            const themeFile = getThemeForLocation(loc, loc.worldId);
            const themePath = path.join(LOCATIONS_DIR, themeFile);
            
            if (!fs.existsSync(themePath)) {
                console.error(`  ✗ Base theme file not found: ${themePath}`);
                continue;
            }

            const hash = getStringHash(loc.id);

            // Deterministic modulation values
            const hue = hash % 360; 
            const brightness = 0.85 + ((hash % 30) / 100); 
            const saturation = 0.75 + ((hash % 50) / 100); 
            
            const flipHorizontally = (hash % 2 === 0);
            const flipVertically = (hash % 7 === 0);

            try {
                let pipeline = sharp(themePath);

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

                // Convert to WebP and write to file
                await pipeline
                    .webp({ quality: 80 })
                    .toFile(targetPath);

                console.log(`  ✓ Generated '${loc.id}.webp' for "${loc.name}" (World: ${loc.worldId}) using base '${themeFile}' (hue: ${hue}°, bri: ${brightness.toFixed(2)}, sat: ${saturation.toFixed(2)})`);
                generatedCount++;
            } catch (err) {
                console.error(`  ✗ Failed to generate image for ${loc.id}:`, err.message);
            }
        }
    }

    console.log(`\n--- Completed. Missing: ${missingCount}, Generated: ${generatedCount} ---`);
}

run().catch(err => {
    console.error('Error running image generator:', err);
});
