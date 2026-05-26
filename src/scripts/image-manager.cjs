// node src/scripts/image-manager.cjs
const http = require('http');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..', '..');
const imagesDir = path.join(projectRoot, 'src', 'assets', 'images', 'locations');
const mapDataPath = path.join(projectRoot, 'src', 'configs', 'map-data.js');

function parseMapData() {
    const mapDataStr = fs.readFileSync(mapDataPath, 'utf8');
    const lines = mapDataStr.split('\n');
    let currentLoc = {};
    const locs = [];
    let currentWorldId = null;

    for (const line of lines) {
        const worldMatch = line.match(/^\s*'([^']+)':\s*\{/);
        if (worldMatch) {
            currentWorldId = worldMatch[1];
        }

        const idMatch = line.match(/id:\s*['"]([^'"]+)['"]/);
        if (idMatch) {
            if (currentLoc.slug) locs.push(currentLoc);
            currentLoc = { slug: idMatch[1], worldId: currentWorldId };
        }

        const nameMatch = line.match(/name:\s*['"]([^'"]+)['"]/);
        if (nameMatch) currentLoc.name = nameMatch[1];

        const descMatch = line.match(/description:\s*['"]([^'"]+)['"]/);
        if (descMatch) currentLoc.description = descMatch[1];

        const slugMatch = line.match(/slug:\s*['"]([^'"]+)['"]/);
        if (slugMatch) currentLoc.slug = slugMatch[1];

        const minRealmMatch = line.match(/minRealm:\s*(\d+)/);
        if (minRealmMatch) currentLoc.minRealm = parseInt(minRealmMatch[1], 10);

        const dangerMatch = line.match(/danger:\s*['"]([^'"]+)['"]/);
        if (dangerMatch) currentLoc.danger = dangerMatch[1];

        const regionIdMatch = line.match(/regionId:\s*['"]([^'"]+)['"]/);
        if (regionIdMatch) currentLoc.regionId = regionIdMatch[1];

        const regionNameMatch = line.match(/regionName:\s*['"]([^'"]+)['"]/);
        if (regionNameMatch) currentLoc.regionName = regionNameMatch[1];

        const subRegionIdMatch = line.match(/subRegionId:\s*['"]([^'"]+)['"]/);
        if (subRegionIdMatch) currentLoc.subRegionId = subRegionIdMatch[1];

        const subRegionNameMatch = line.match(/subRegionName:\s*['"]([^'"]+)['"]/);
        if (subRegionNameMatch) currentLoc.subRegionName = subRegionNameMatch[1];

        const resourcesMatch = line.match(/resources:\s*(\[[^\]]*\])/);
        if (resourcesMatch) {
            try { currentLoc.resources = JSON.parse(resourcesMatch[1].replace(/'/g, '"')); } catch (e) { }
        }

        const energiesMatch = line.match(/energies:\s*(\[.*?\])/);
        if (energiesMatch) {
            try { currentLoc.energies = JSON.parse(energiesMatch[1].replace(/'/g, '"')); } catch (e) { }
        }

        const eventProbsMatch = line.match(/eventProbs:\s*(\{.*?\})/);
        if (eventProbsMatch) {
            try { currentLoc.eventProbs = JSON.parse(eventProbsMatch[1].replace(/'/g, '"')); } catch (e) { }
        }

        const qiMatch = line.match(/elementQi:\s*({[^}]+})/);
        if (qiMatch) {
            try { currentLoc.elementQi = JSON.parse(qiMatch[1]); } catch (e) { }
        }
    }
    if (currentLoc.slug) locs.push(currentLoc);
    return locs;
}

const server = http.createServer((req, res) => {
    // CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    if (req.url === '/' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(htmlUI);
        return;
    }

    if (req.url === '/api/data' && req.method === 'GET') {
        const locations = parseMapData();
        const files = fs.readdirSync(imagesDir).filter(f => f.match(/\.(webp|png|jpg)$/));

        const hierarchy = {
            'nhan_gioi': { name: 'Nhân Giới', regions: {} },
            'linh_gioi': { name: 'Linh Giới', regions: {} },
            'tien_gioi': { name: 'Tiên Giới', regions: {} },
            'ma_gioi': { name: 'Ma Giới', regions: {} },
            'khong_gian_khe_nut': { name: 'Không Gian Khe Nứt', regions: {} }
        };
        for (const loc of locations) {
            const w = loc.worldId;
            if (!w || !hierarchy[w]) continue;
            if (loc.regionId) {
                if (!hierarchy[w].regions[loc.regionId]) {
                    hierarchy[w].regions[loc.regionId] = { name: loc.regionName || loc.regionId, subRegions: {} };
                }
                if (loc.subRegionId) {
                    hierarchy[w].regions[loc.regionId].subRegions[loc.subRegionId] = loc.subRegionName || loc.subRegionId;
                }
            }
        }

        const enrichedLocations = locations.map(loc => {
            let currentImage = null;
            if (loc.slug && files.includes(`${loc.slug}.webp`)) currentImage = `${loc.slug}.webp`;
            else if (loc.slug && files.includes(`${loc.slug}.png`)) currentImage = `${loc.slug}.png`;
            return { ...loc, currentImage };
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ locations: enrichedLocations, allImages: files, hierarchy: hierarchy }));
        return;
    }

    if (req.url.startsWith('/api/images/') && req.method === 'GET') {
        let filename = req.url.replace('/api/images/', '');
        if (filename.includes('?')) filename = filename.split('?')[0];
        filename = decodeURIComponent(filename);
        const filePath = path.join(imagesDir, filename);
        if (fs.existsSync(filePath)) {
            const ext = path.extname(filename).toLowerCase();
            const mimeType = ext === '.png' ? 'image/png' : ext === '.jpg' ? 'image/jpeg' : 'image/webp';
            res.writeHead(200, { 'Content-Type': mimeType });
            fs.createReadStream(filePath).pipe(res);
        } else {
            res.writeHead(404);
            res.end('Not found');
        }
        return;
    }

    if (req.url === '/api/save' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const changes = JSON.parse(body); // Array of { locationSlug, newImageFilename }

                // For safety, let's do a swap using temporary names
                // If a user assigns image A to location B, we rename A to B.webp
                // If B.webp already existed, it becomes unused and should be renamed to locations_extra_X.webp

                const allFiles = fs.readdirSync(imagesDir);
                let extraCounter = 1;
                function getFreeExtraName() {
                    while (true) {
                        const name = `locations_extra_${extraCounter}.webp`;
                        if (!fs.existsSync(path.join(imagesDir, name))) return name;
                        extraCounter++;
                    }
                }

                // Map of what the files are CURRENTLY named on disk, and what we want to name them to
                const renameMap = [];

                changes.forEach(change => {
                    const sourcePath = path.join(imagesDir, change.newImageFilename);
                    const targetName = `${change.locationSlug}.webp`;
                    const targetPath = path.join(imagesDir, targetName);

                    if (sourcePath !== targetPath && fs.existsSync(sourcePath)) {
                        // If target already exists and is NOT part of the sources we are picking, 
                        // we need to move it to a safe location first
                        if (fs.existsSync(targetPath)) {
                            // Find if targetPath is being used as a source for another location in this batch
                            const isSourceForAnother = changes.find(c => c.newImageFilename === targetName);
                            if (!isSourceForAnother) {
                                // It's completely replaced, so move to extra
                                const safeName = getFreeExtraName();
                                fs.renameSync(targetPath, path.join(imagesDir, safeName));
                            }
                        }

                        renameMap.push({ src: sourcePath, target: targetPath });
                    }
                });

                // Execute renames safely using temp files
                const tempPaths = [];
                renameMap.forEach((r, idx) => {
                    const temp = path.join(imagesDir, `temp_admin_swap_${idx}.webp`);
                    fs.renameSync(r.src, temp);
                    tempPaths.push({ temp, target: r.target });
                });

                tempPaths.forEach(r => {
                    fs.renameSync(r.temp, r.target);
                });

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, message: `Updated ${changes.length} locations!` }));
            } catch (err) {
                console.error(err);
                res.writeHead(500);
                res.end(JSON.stringify({ success: false, message: err.message }));
            }
        });
        return;
    }

    if (req.url === '/api/upload' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const payload = JSON.parse(body);
                if (!payload.files || !Array.isArray(payload.files)) throw new Error('Invalid payload');

                // Build a map of existing hashes
                const existingFiles = fs.readdirSync(imagesDir).filter(f => f.match(/\.(webp|png|jpg)$/));
                const existingHashes = {};
                existingFiles.forEach(file => {
                    const buffer = fs.readFileSync(path.join(imagesDir, file));
                    const hash = crypto.createHash('sha256').update(buffer).digest('hex');
                    if (!existingHashes[hash]) existingHashes[hash] = file;
                });

                let extraCounter = 1;
                function getFreeExtraName(ext) {
                    while (true) {
                        const name = `locations_extra_${extraCounter}${ext}`;
                        if (!fs.existsSync(path.join(imagesDir, name))) return name;
                        extraCounter++;
                    }
                }

                const uploaded = [];
                const duplicates = [];

                payload.files.forEach(f => {
                    const match = f.data.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
                    if (!match) {
                        duplicates.push(`❌ Tệp "${f.name}" không phải là định dạng ảnh hợp lệ.`);
                        return;
                    }
                    let ext = '.' + match[1];
                    if (ext === '.jpeg') ext = '.jpg';

                    const base64Data = match[2];
                    const buffer = Buffer.from(base64Data, 'base64');
                    const hash = crypto.createHash('sha256').update(buffer).digest('hex');

                    if (existingHashes[hash]) {
                        duplicates.push(`⚠️ Ảnh "${f.name}" bị trùng lặp nội dung với ảnh đang có sẵn: "${existingHashes[hash]}"`);
                        return;
                    }

                    const newName = getFreeExtraName(ext);
                    fs.writeFileSync(path.join(imagesDir, newName), buffer);
                    existingHashes[hash] = newName;
                    uploaded.push(f.name);
                });

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true, uploaded, duplicates }));
            } catch (err) {
                console.error(err);
                res.writeHead(500);
                res.end(JSON.stringify({ success: false, message: err.message }));
            }
        });
        return;
    }

    if (req.url === '/api/delete' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const payload = JSON.parse(body);
                if (!payload.filename) throw new Error('Missing filename');
                const safeFilename = path.basename(payload.filename);
                const filePath = path.join(imagesDir, safeFilename);
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                }
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            } catch (err) {
                console.error(err);
                res.writeHead(500);
                res.end(JSON.stringify({ success: false, message: err.message }));
            }
        });
        return;
    }

    if (req.url === '/api/locations/update-batch' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const payloadArray = JSON.parse(body);
                if (!Array.isArray(payloadArray)) throw new Error('Invalid payload');

                const lines = fs.readFileSync(mapDataPath, 'utf8').split('\n');

                for (const payload of payloadArray) {
                    const { slug, newSlug, name, description, isNew, worldId, minRealm, danger, regionId, regionName, subRegionId, subRegionName, resources, energies, eventProbs, elementQi } = payload;

                    const finalId = newSlug || slug;

                    if (isNew) {
                        const objStr = `            {
                id: "${finalId}",
                name: "${name}",
                minRealm: ${minRealm || 0},
                danger: "${danger || 'an_toan'}",
                image: getLocImg("${finalId}"),
                description: "${description || ''}",
                resources: ${JSON.stringify(resources || [])},
                energies: ${JSON.stringify(energies || []).replace(/"([^"]+)":/g, '$1:')},
                elementQi: ${JSON.stringify(elementQi || {}).replace(/,/g, ', ').replace(/:/g, ': ').replace(/{/, '{ ').replace(/}/, ' }')},
                eventProbs: ${JSON.stringify(eventProbs || { combat: 0, loot: 0, npc: 0, empty: 0 }).replace(/"([^"]+)":/g, '$1:')},
                regionId: "${regionId || ''}",
                regionName: "${regionName || ''}",
                subRegionId: "${subRegionId || ''}",
                subRegionName: "${subRegionName || ''}"
            },`;

                        let inWorldBlock = false;
                        for (let i = 0; i < lines.length; i++) {
                            if (lines[i].match(new RegExp(`^\\s*'${worldId}':\\s*\\{`))) {
                                inWorldBlock = true;
                            }
                            if (inWorldBlock && lines[i].match(/locations:\s*\[/)) {
                                lines.splice(i + 1, 0, objStr);
                                break;
                            }
                        }
                        continue;
                    }

                    let inTargetBlock = false;
                    for (let i = 0; i < lines.length; i++) {
                        const line = lines[i];
                        if (line.match(new RegExp(`id:\\s*['"]${slug}['"]`))) {
                            inTargetBlock = true;
                            if (newSlug && newSlug !== slug) {
                                lines[i] = line.replace(/id:\s*(['"])[^'"]*\\1/, `id: "${newSlug}"`);
                            }
                            continue;
                        }
                        if (inTargetBlock) {
                            if (newSlug && newSlug !== slug && line.match(/image:\s*getLocImg\(['"]/)) {
                                lines[i] = line.replace(/getLocImg\(['"][^'"]+['"]\)/, `getLocImg("${newSlug}")`);
                            }
                            if (line.match(/name:\s*['"]/)) lines[i] = line.replace(/name:\s*(['"])[^'"]*\\1/, `name: "${name}"`);
                            if (line.match(/description:\s*['"]/)) lines[i] = line.replace(/description:\s*(['"])[^'"]*\\1/, `description: "${description}"`);
                            if (line.match(/minRealm:\s*\d+/)) lines[i] = line.replace(/minRealm:\s*\d+/, `minRealm: ${minRealm}`);
                            if (line.match(/danger:\s*['"]/)) lines[i] = line.replace(/danger:\s*(['"])[^'"]*\\1/, `danger: "${danger}"`);
                            if (line.match(/regionId:\s*['"]/)) lines[i] = line.replace(/regionId:\s*(['"])[^'"]*\\1/, `regionId: "${regionId}"`);
                            if (line.match(/regionName:\s*['"]/)) lines[i] = line.replace(/regionName:\s*(['"])[^'"]*\\1/, `regionName: "${regionName}"`);
                            if (line.match(/subRegionId:\s*['"]/)) lines[i] = line.replace(/subRegionId:\s*(['"])[^'"]*\\1/, `subRegionId: "${subRegionId}"`);
                            if (line.match(/subRegionName:\s*['"]/)) lines[i] = line.replace(/subRegionName:\s*(['"])[^'"]*\\1/, `subRegionName: "${subRegionName}"`);

                            if (resources && line.match(/resources:\s*\[/)) {
                                lines[i] = line.replace(/resources:\s*\[[^\]]*\]/, `resources: ${JSON.stringify(resources)}`);
                            }
                            if (energies && line.match(/energies:\s*\[/)) {
                                lines[i] = line.replace(/energies:\s*\[.*?\]/, `energies: ${JSON.stringify(energies).replace(/"([^"]+)":/g, '$1:')}`);
                            }
                            if (eventProbs && line.match(/eventProbs:\s*\{/)) {
                                lines[i] = line.replace(/eventProbs:\s*\{.*?\}/, `eventProbs: ${JSON.stringify(eventProbs).replace(/"([^"]+)":/g, '$1:')}`);
                            }
                            if (elementQi && line.match(/elementQi:\s*{/)) {
                                const formattedQi = JSON.stringify(elementQi).replace(/,/g, ', ').replace(/:/g, ': ').replace(/{/, '{ ').replace(/}/, ' }');
                                lines[i] = line.replace(/elementQi:\s*{[^}]+}/, `elementQi: ${formattedQi}`);
                            }
                            if (line.match(/^\\s*id:\\s*['"]/) || line.match(/^\\s*},?\\s*$/)) {
                                break;
                            }
                        }
                    }

                    if (newSlug && newSlug !== slug) {
                        const oldPathWebp = path.join(imagesDir, `${slug}.webp`);
                        const newPathWebp = path.join(imagesDir, `${newSlug}.webp`);
                        if (fs.existsSync(oldPathWebp)) fs.renameSync(oldPathWebp, newPathWebp);

                        const oldPathPng = path.join(imagesDir, `${slug}.png`);
                        const newPathPng = path.join(imagesDir, `${newSlug}.png`);
                        if (fs.existsSync(oldPathPng)) fs.renameSync(oldPathPng, newPathPng);
                    }
                }

                fs.writeFileSync(mapDataPath, lines.join('\n'), 'utf8');
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            } catch (err) {
                res.writeHead(500);
                res.end(JSON.stringify({ success: false, message: err.message }));
            }
        });
        return;
    }

    if (req.url === '/api/locations/delete' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const { slug } = JSON.parse(body);
                if (!slug) throw new Error('Missing slug');

                const fileContent = fs.readFileSync(mapDataPath, 'utf8');
                const idIdx = fileContent.indexOf(`id: "${slug}"`);
                if (idIdx === -1) throw new Error('Location not found in source file');

                const blockStart = fileContent.lastIndexOf('{', idIdx);
                if (blockStart === -1) throw new Error('Block start not found');

                let brackets = 0;
                let blockEnd = -1;
                for (let i = blockStart; i < fileContent.length; i++) {
                    if (fileContent[i] === '{') brackets++;
                    else if (fileContent[i] === '}') brackets--;
                    if (brackets === 0) {
                        blockEnd = i;
                        break;
                    }
                }
                if (blockEnd === -1) throw new Error('Block end not found');

                // Determine removal range, also swallow following comma and whitespace
                let removeStart = blockStart;
                let removeEnd = blockEnd + 1;
                while (/[\s\r\n]/.test(fileContent[removeEnd])) removeEnd++;
                if (fileContent[removeEnd] === ',') removeEnd++;

                const newContent = fileContent.slice(0, removeStart) + fileContent.slice(removeEnd);
                fs.writeFileSync(mapDataPath, newContent, 'utf8');

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            } catch (err) {
                res.writeHead(500);
                res.end(JSON.stringify({ success: false, message: err.message }));
            }
        });
        return;
    }

    if (req.url === '/api/locations/add' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk.toString(); });
        req.on('end', () => {
            try {
                const { slug, name, description, worldId } = JSON.parse(body);
                if (!slug || !name || !worldId) throw new Error('Missing required fields');

                let fileContent = fs.readFileSync(mapDataPath, 'utf8');
                const worldIndex = fileContent.indexOf(`'${worldId}':`);
                if (worldIndex === -1) throw new Error('World ID not found');
                const locArrIndex = fileContent.indexOf('locations: [', worldIndex);
                if (locArrIndex === -1) throw new Error('Locations array not found in world');

                const insertPos = locArrIndex + 'locations: ['.length;
                const newBlock = `
            {
                id: "${slug}",
                name: "${name}",
                minRealm: 0,
                danger: "an_toan",
                image: getLocImg("${slug}"),
                description: "${description}",
                resources: [],
                energies: [],
                elementQi: { "Kim": 20, "Mộc": 20, "Thủy": 20, "Hỏa": 20, "Thổ": 20, "Phong": 0, "Lôi": 0, "Băng": 0, "Quang": 0, "Ám": 0 },
                eventProbs: { "combat": 0.05, "loot": 0.25, "npc": 0.1, "empty": 0.6 }
            },`;
                fileContent = fileContent.substring(0, insertPos) + newBlock + fileContent.substring(insertPos);
                fs.writeFileSync(mapDataPath, fileContent, 'utf8');

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: true }));
            } catch (err) {
                res.writeHead(500);
                res.end(JSON.stringify({ success: false, message: err.message }));
            }
        });
        return;
    }

    res.writeHead(404);
    res.end('Not found');
});

const PORT = 3000;
server.listen(PORT, () => {
    console.log(`\n\n==========================================`);
    console.log(`✅ VISUAL IMAGE MAPPER CHẠY THÀNH CÔNG!`);
    console.log(`👉 Vui lòng mở trình duyệt và truy cập:`);
    console.log(`   http://localhost:${PORT}`);
    console.log(`==========================================\n\n`);
});


const htmlUI = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mortal Quest - Image Manager</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #121212; color: #e0e0e0; margin: 0; display: flex; height: 100vh; overflow: hidden; }
        header { background: #1e1e1e; padding: 15px 20px; display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #333; z-index: 10; }
        .container { display: flex; flex: 1; height: calc(100vh - 60px); }
        .locations-panel { width: 25%; border-right: 1px solid #333; overflow-y: auto; background: #1a1a1a; padding: 10px; }
        .gallery-panel { width: 75%; overflow-y: auto; padding: 20px; background: #121212; }
        
        h1 { margin: 0; font-size: 20px; color: #4db8ff; }
        .btn { background: #0078d4; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-weight: bold; font-size: 14px; }
        .btn:hover { background: #0086f0; }
        .btn-success { background: #107c10; }
        .btn-success:hover { background: #128e12; }

        .location-item { background: #252526; margin-bottom: 10px; padding: 10px; border-radius: 6px; cursor: pointer; border: 2px solid transparent; display: flex; gap: 15px; }
        .location-item:hover { background: #2d2d30; }
        .location-item.active { border-color: #0078d4; background: #1e2d3d; }
        .loc-img-preview { width: 100px; height: 75px; object-fit: cover; border-radius: 4px; background: #000; flex-shrink: 0; }
        .loc-info h3 { margin: 0 0 5px 0; font-size: 16px; color: #fff; }
        .loc-info p { margin: 0; font-size: 12px; color: #aaa; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .loc-slug { font-family: monospace; color: #4db8ff; font-size: 11px; margin-top: 5px; display: inline-block; background: #111; padding: 2px 5px; border-radius: 3px; }

        .gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 15px; }
        .gallery-item { background: #252526; border-radius: 6px; overflow: hidden; cursor: pointer; border: 2px solid transparent; transition: 0.2s; position: relative; }
        .gallery-item:hover { border-color: #555; transform: translateY(-2px); }
        .gallery-item.selected { border-color: #0078d4; }
        .gallery-item.assigned { opacity: 0.5; }
        .gallery-item img { width: 100%; height: 130px; object-fit: cover; display: block; }
        .gallery-item .filename { padding: 8px; font-size: 11px; font-family: monospace; text-align: center; color: #ccc; word-break: break-all; }
        .gallery-item .assigned-badge { position: absolute; top: 5px; right: 5px; background: #0078d4; color: white; font-size: 10px; padding: 2px 6px; border-radius: 10px; }
        .gallery-item .delete-btn { position: absolute; top: 5px; left: 5px; background: rgba(220, 53, 69, 0.8); color: white; border-radius: 50%; width: 22px; height: 22px; display: flex; justify-content: center; align-items: center; font-size: 12px; z-index: 2; opacity: 0; transition: opacity 0.2s; }
        .gallery-item:hover .delete-btn { opacity: 1; }
        .gallery-item .delete-btn:hover { background: #dc3545; transform: scale(1.1); }

        .toast { position: fixed; bottom: 20px; right: 20px; background: #107c10; color: white; padding: 12px 20px; border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.5); opacity: 0; transition: opacity 0.3s; pointer-events: none; }
        .toast.show { opacity: 1; }
    </style>
</head>
<body>
    <div style="display: flex; flex-direction: column; width: 100%;">
        <header>
            <h1>Mortal Quest - Location Image Mapper</h1>
            <div style="display: flex; gap: 10px; align-items: center;">
                <span id="unsaved-warning" style="color: #ff9900; font-size: 13px; display: none;">⚠️ Có thay đổi chưa lưu!</span>
                <label class="btn" style="background:#5c2d91; cursor:pointer;">
                    Tải Ảnh Lên
                    <input type="file" multiple accept="image/*" style="display:none" onchange="uploadFiles(event)">
                </label>
                <button class="btn btn-success" id="save-btn" onclick="saveChanges()">Lưu Thay Đổi</button>
            </div>
        </header>
        
        <div class="container">
            <div class="locations-panel">
                <div style="padding-bottom: 15px; position: sticky; top: -10px; background: #1a1a1a; z-index: 10; display: flex; gap: 5px;">
                    <input type="text" id="search-loc" placeholder="Tìm địa điểm..." style="flex: 1; padding: 8px; border-radius: 4px; border: 1px solid #444; background: #222; color: #fff; box-sizing: border-box;" oninput="renderLocations()">
                    <button class="btn" style="padding: 8px;" onclick="toggleLocSort()" title="Sắp xếp A-Z">A-Z</button>
                    <button class="btn btn-success" style="padding: 8px;" onclick="openAddLocationModal()" title="Thêm địa điểm mới">+</button>
                </div>
                <div id="loc-list">
                    <!-- Locations loaded here -->
                    <div style="text-align: center; padding: 20px; color: #888;">Đang tải dữ liệu...</div>
                </div>
            </div>
            
            <div class="gallery-panel">
                <div style="background: #333; padding: 15px; border-radius: 6px; margin-bottom: 20px; position: sticky; top: -20px; z-index: 5; display: flex; gap: 20px; align-items: flex-start;">
                    <div style="flex: 1; display: flex; flex-direction: column; gap: 10px;" id="location-editor-panel">
                        <div style="display: flex; justify-content: space-between;">
                            <h3 style="color: #fff; margin: 0;">Đang chọn ảnh cho: <span id="selected-loc-name" style="color: #4db8ff;">Vui lòng chọn địa điểm</span></h3>
                            <button class="btn" style="padding: 4px 8px; font-size: 12px; background: #dc3545; display: none;" id="btn-delete-loc" onclick="deleteActiveLocation()">Xóa Địa Điểm</button>
                        </div>
                        <input type="hidden" id="edit-loc-slug">
                        <div style="display: flex; gap: 10px;">
                            <input type="text" id="edit-loc-name" placeholder="Tên địa điểm" style="flex: 1; padding: 8px; border-radius: 4px; border: 1px solid #555; background: #222; color: #fff;" oninput="autoGenerateSlug()">
                            <input type="text" id="edit-loc-new-slug" placeholder="Slug (id)" style="width: 150px; padding: 8px; border-radius: 4px; border: 1px solid #555; background: #222; color: #aaa;" oninput="markInfoDirty()" title="Bạn có thể sửa slug tự động">
                        </div>
                        <div style="display: flex; gap: 10px;">
                            <select id="edit-loc-world" style="padding: 8px; border-radius: 4px; border: 1px solid #555; background: #222; color: #fff;" onchange="updateRegionSelects()">
                                <option value="nhan_gioi">Nhân Giới</option>
                                <option value="linh_gioi">Linh Giới</option>
                                <option value="tien_gioi">Tiên Giới</option>
                                <option value="ma_gioi">Ma Giới</option>
                                <option value="khong_gian_khe_nut">Không Gian Khe Nứt</option>
                            </select>
                            <input type="number" id="edit-loc-min-realm" placeholder="Cảnh giới tối thiểu" style="width: 150px; padding: 8px; border-radius: 4px; border: 1px solid #555; background: #222; color: #fff;" oninput="markInfoDirty()">
                            <select id="edit-loc-danger" style="flex: 1; padding: 8px; border-radius: 4px; border: 1px solid #555; background: #222; color: #fff;" onchange="markInfoDirty()">
                                <option value="an_toan">An Toàn</option>
                                <option value="ha_cap">Hạ Cấp</option>
                                <option value="trung_cap">Trung Cấp</option>
                                <option value="cao_cap">Cao Cấp</option>
                                <option value="nguy_hiem">Nguy Hiểm</option>
                                <option value="cuc_ky_nguy_hiem">Cực Kỳ Nguy Hiểm</option>
                                <option value="tu_dia">Tử Địa</option>
                            </select>
                        </div>
                        <div style="display: flex; gap: 10px;">
                            <select id="edit-loc-region-select" style="flex: 1; padding: 8px; border-radius: 4px; border: 1px solid #555; background: #222; color: #fff;" onchange="onRegionChange()">
                            </select>
                            <input type="text" id="edit-loc-region-custom-name" placeholder="Tên Châu Lục mới" style="display:none; flex: 1; padding: 8px; border-radius: 4px; border: 1px solid #555; background: #222; color: #fff;" oninput="onCustomRegionInput()">
                            <input type="text" id="edit-loc-region-custom-id" placeholder="ID (slug) mới" style="display:none; flex: 1; padding: 8px; border-radius: 4px; border: 1px solid #555; background: #222; color: #aaa;" oninput="markInfoDirty()">
                        </div>
                        <div style="display: flex; gap: 10px;">
                            <select id="edit-loc-subregion-select" style="flex: 1; padding: 8px; border-radius: 4px; border: 1px solid #555; background: #222; color: #fff;" onchange="onSubRegionChange()">
                            </select>
                            <input type="text" id="edit-loc-subregion-custom-name" placeholder="Tên Quốc Gia mới" style="display:none; flex: 1; padding: 8px; border-radius: 4px; border: 1px solid #555; background: #222; color: #fff;" oninput="onCustomSubRegionInput()">
                            <input type="text" id="edit-loc-subregion-custom-id" placeholder="ID (slug) mới" style="display:none; flex: 1; padding: 8px; border-radius: 4px; border: 1px solid #555; background: #222; color: #aaa;" oninput="markInfoDirty()">
                        </div>
                        <textarea id="edit-loc-desc" placeholder="Mô tả địa điểm..." rows="2" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #555; background: #222; color: #fff; resize: vertical; box-sizing: border-box;" oninput="markInfoDirty()"></textarea>
                        <input type="text" id="edit-loc-resources" placeholder="Tài nguyên (cách nhau dấu phẩy. VD: Linh Thảo, Quặng Sắt)" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #555; background: #222; color: #fff; box-sizing: border-box;" oninput="markInfoDirty()">
                        <textarea id="edit-loc-energies" placeholder='Năng lượng (JSON). VD: [{"type":"linh_khi","concentration":5,"purity":"TAP"}]' rows="2" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #555; background: #222; color: #fff; resize: vertical; box-sizing: border-box; font-family: monospace;" oninput="markInfoDirty()"></textarea>
                        
                        <div style="display: flex; gap: 10px; align-items: center;">
                            <span style="color:#aaa; font-size:13px; width: 60px;">Event %:</span>
                            <input type="number" id="prob-combat" placeholder="Combat" step="0.01" min="0" max="1" style="flex:1; background:#222; border:1px solid #555; color:#fff; padding:4px;" oninput="markInfoDirty()" title="Tỷ lệ Combat (0-1)">
                            <input type="number" id="prob-loot" placeholder="Loot" step="0.01" min="0" max="1" style="flex:1; background:#222; border:1px solid #555; color:#fff; padding:4px;" oninput="markInfoDirty()" title="Tỷ lệ Loot (0-1)">
                            <input type="number" id="prob-npc" placeholder="NPC" step="0.01" min="0" max="1" style="flex:1; background:#222; border:1px solid #555; color:#fff; padding:4px;" oninput="markInfoDirty()" title="Tỷ lệ NPC (0-1)">
                            <input type="number" id="prob-empty" placeholder="Empty" step="0.01" min="0" max="1" style="flex:1; background:#222; border:1px solid #555; color:#fff; padding:4px;" oninput="markInfoDirty()" title="Tỷ lệ Trống (0-1)">
                        </div>

                        <div style="font-size: 13px; color: #aaa; margin-top: 5px;">Tỉ lệ linh khí (0-100%):</div>
                        <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 5px;" id="qi-inputs">
                            <span style="color:#555; font-size:13px;">Chọn địa điểm để xem</span>
                        </div>
                    </div>
                    <img id="large-preview" style="width: 500px; height: 320px; object-fit: cover; border-radius: 6px; border: 2px solid #555; background: #000; display: none;" />
                </div>
                    
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; position: sticky; top: -20px; z-index: 5; background: #333;">
                    <h2 style="margin: 0;">Thư viện ảnh <span id="gallery-count" style="font-size: 14px; color: #888; font-weight: normal;"></span></h2>
                    <div style="display: flex; gap: 5px;">
                        <input type="text" id="search-img" placeholder="Tìm tên file ảnh..." style="width: 250px; padding: 8px; border-radius: 4px; border: 1px solid #444; background: #222; color: #fff; box-sizing: border-box;" oninput="renderGallery()">
                        <button class="btn" style="padding: 8px;" onclick="toggleImgSort()" title="Sắp xếp A-Z">A-Z</button>
                    </div>
                </div>

                <div class="gallery-grid" id="gallery-list">
                    <!-- Gallery loaded here -->
                </div>
            </div>
        </div>
    </div>

    <div class="toast" id="toast">Cập nhật thành công!</div>

    <script>
        let appData = { locations: [], allImages: [], hierarchy: {} };
        let activeLocationSlug = null;
        let changes = {}; // slug -> newImageFilename
        let infoChanges = {}; // slug -> info
        let cacheBuster = Date.now();
        let sortLocAlpha = false;
        let sortImgAlpha = false;

        function toggleLocSort() {
            sortLocAlpha = !sortLocAlpha;
            document.getElementById('search-loc').nextElementSibling.style.background = sortLocAlpha ? '#107c10' : '#0078d4';
            renderLocations();
        }

        function toggleImgSort() {
            sortImgAlpha = !sortImgAlpha;
            document.getElementById('search-img').nextElementSibling.style.background = sortImgAlpha ? '#107c10' : '#0078d4';
            renderGallery();
        }

        async function init() {
            const res = await fetch('/api/data');
            appData = await res.json();
            renderLocations();
            renderGallery();
        }

        function renderLocations() {
            const container = document.getElementById('loc-list');
            if (!container) return;
            container.innerHTML = '';
            
            const searchTerm = (document.getElementById('search-loc')?.value || '').toLowerCase();
            const sortedLocs = sortLocAlpha 
                ? [...appData.locations].sort((a, b) => a.name.localeCompare(b.name))
                : [...appData.locations];
            
            sortedLocs.forEach(loc => {
                if (searchTerm && !loc.name.toLowerCase().includes(searchTerm) && !loc.slug.toLowerCase().includes(searchTerm)) return;

                const isModifiedImg = changes[loc.slug] !== undefined;
                const isModifiedInfo = infoChanges[loc.slug] !== undefined;
                const currentImgFile = isModifiedImg ? changes[loc.slug] : loc.currentImage;
                const imgSrc = currentImgFile ? \`/api/images/\${encodeURIComponent(currentImgFile)}?t=\${cacheBuster}\` : '';
                
                const div = document.createElement('div');
                div.className = \`location-item \${activeLocationSlug === loc.slug ? 'active' : ''}\`;
                div.onclick = () => selectLocation(loc.slug);
                
                const dispName = isModifiedInfo ? infoChanges[loc.slug].name : loc.name;
                const dispDesc = isModifiedInfo ? infoChanges[loc.slug].description : (loc.description || 'Chưa có mô tả');
                
                div.innerHTML = \`
                    <img src="\${imgSrc}" class="loc-img-preview" onerror="this.style.opacity=0.3">
                    <div class="loc-info">
                        <h3>\${dispName} \${(isModifiedImg || isModifiedInfo) ? '<span style="color:#ff9900;font-size:12px;">(Đã sửa)</span>' : ''}</h3>
                        <p>\${dispDesc}</p>
                        <span class="loc-slug">\${loc.slug}</span>
                    </div>
                \`;
                container.appendChild(div);
            });
        }

        function renderGallery() {
            const container = document.getElementById('gallery-list');
            document.getElementById('gallery-count').innerText = \`(\${appData.allImages.length} ảnh)\`;
            container.innerHTML = '';

            const activeLoc = appData.locations.find(l => l.slug === activeLocationSlug);
            const currentImgForActive = activeLoc ? (changes[activeLoc.slug] || activeLoc.currentImage) : null;

            const largePreview = document.getElementById('large-preview');
            if (currentImgForActive) {
                largePreview.src = \`/api/images/\${encodeURIComponent(currentImgForActive)}?t=\${cacheBuster}\`;
                largePreview.style.display = 'block';
            } else {
                largePreview.style.display = 'none';
            }

            const assignedImages = {};
            appData.locations.forEach(l => {
                if (changes[l.slug]) {
                    assignedImages[changes[l.slug]] = l.name;
                } else if (l.currentImage) {
                    assignedImages[l.currentImage] = l.name;
                }
            });

            const searchTerm = (document.getElementById('search-img')?.value || '').toLowerCase();
            const sortedImages = [...appData.allImages].sort((a, b) => {
                if (sortImgAlpha) {
                    return a.localeCompare(b);
                } else {
                    const aIsExtra = a.includes('locations_extra_');
                    const bIsExtra = b.includes('locations_extra_');
                    if (aIsExtra && !bIsExtra) return -1;
                    if (!aIsExtra && bIsExtra) return 1;
                    return a.localeCompare(b);
                }
            });

            sortedImages.forEach(img => {
                if (searchTerm && !img.toLowerCase().includes(searchTerm)) return;

                const div = document.createElement('div');
                const isSelectedForActive = currentImgForActive === img;
                const assignedTo = assignedImages[img];
                
                div.className = \`gallery-item \${isSelectedForActive ? 'selected' : ''} \${assignedTo && !isSelectedForActive ? 'assigned' : ''}\`;
                div.onclick = () => assignImage(img);
                
                div.innerHTML = \`
                    \${assignedTo ? \`<div class="assigned-badge">\${assignedTo}</div>\` : ''}
                    \${!assignedTo ? \`<div class="delete-btn" onclick="event.stopPropagation(); deleteImage('\${img}')" title="Xóa ảnh này">🗑️</div>\` : ''}
                    <img src="/api/images/\${encodeURIComponent(img)}?t=\${cacheBuster}" loading="lazy">
                    <div class="filename">\${img}</div>
                \`;
                container.appendChild(div);
            });
        }

        function autoGenerateSlug() {
            const name = document.getElementById('edit-loc-name').value;
            const newSlug = name.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9 ]/g, "").trim().replace(/\\s+/g, "_");
            document.getElementById('edit-loc-new-slug').value = newSlug;
            markInfoDirty();
        }

        function updateRegionSelects() {
            const worldId = document.getElementById('edit-loc-world').value;
            const regionSelect = document.getElementById('edit-loc-region-select');
            
            regionSelect.innerHTML = '<option value="">-- Không có Châu Lục --</option>';
            
            const worldData = appData.hierarchy && appData.hierarchy[worldId];
            if (worldData && worldData.regions) {
                for (const [rId, rData] of Object.entries(worldData.regions)) {
                    regionSelect.innerHTML += \`<option value="\${rId}">\${rData.name}</option>\`;
                }
            }
            regionSelect.innerHTML += '<option value="__custom__">+ Thêm Châu Lục Mới</option>';
            
            onRegionChange();
        }

        function onRegionChange() {
            const worldId = document.getElementById('edit-loc-world').value;
            const regionId = document.getElementById('edit-loc-region-select').value;
            
            const customName = document.getElementById('edit-loc-region-custom-name');
            const customId = document.getElementById('edit-loc-region-custom-id');
            
            if (regionId === '__custom__') {
                customName.style.display = 'block';
                customId.style.display = 'block';
            } else {
                customName.style.display = 'none';
                customId.style.display = 'none';
            }
            
            const subSelect = document.getElementById('edit-loc-subregion-select');
            subSelect.innerHTML = '<option value="">-- Không có Quốc Gia --</option>';
            
            if (regionId && regionId !== '__custom__') {
                const rData = appData.hierarchy[worldId]?.regions[regionId];
                if (rData && rData.subRegions) {
                    for (const [srId, srName] of Object.entries(rData.subRegions)) {
                        subSelect.innerHTML += \`<option value="\${srId}">\${srName}</option>\`;
                    }
                }
            }
            subSelect.innerHTML += '<option value="__custom__">+ Thêm Quốc Gia Mới</option>';
            
            onSubRegionChange();
        }

        function onSubRegionChange() {
            const srId = document.getElementById('edit-loc-subregion-select').value;
            const customName = document.getElementById('edit-loc-subregion-custom-name');
            const customId = document.getElementById('edit-loc-subregion-custom-id');
            
            if (srId === '__custom__') {
                customName.style.display = 'block';
                customId.style.display = 'block';
            } else {
                customName.style.display = 'none';
                customId.style.display = 'none';
            }
            markInfoDirty();
        }

        function onCustomRegionInput() {
            const name = document.getElementById('edit-loc-region-custom-name').value;
            const slug = name.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9 ]/g, "").trim().replace(/\\s+/g, "_");
            document.getElementById('edit-loc-region-custom-id').value = slug;
            markInfoDirty();
        }

        function onCustomSubRegionInput() {
            const name = document.getElementById('edit-loc-subregion-custom-name').value;
            const slug = name.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9 ]/g, "").trim().replace(/\\s+/g, "_");
            document.getElementById('edit-loc-subregion-custom-id').value = slug;
            markInfoDirty();
        }

        function selectLocation(slug) {
            activeLocationSlug = slug;
            const loc = appData.locations.find(l => l.slug === slug);
            const pendingInfo = infoChanges[slug];
            
            document.getElementById('selected-loc-name').innerText = pendingInfo ? pendingInfo.name : loc.name;
            document.getElementById('edit-loc-slug').value = loc.slug;
            document.getElementById('edit-loc-new-slug').value = pendingInfo && pendingInfo.newSlug ? pendingInfo.newSlug : loc.slug;
            document.getElementById('edit-loc-name').value = pendingInfo ? pendingInfo.name : loc.name;
            
            const p = pendingInfo || {};
            const worldId = p.worldId || loc.worldId || 'nhan_gioi';
            document.getElementById('edit-loc-world').value = worldId;
            updateRegionSelects();
            
            const rId = p.regionId || loc.regionId || '';
            const rSelect = document.getElementById('edit-loc-region-select');
            if (rId && !Array.from(rSelect.options).some(o => o.value === rId)) {
                rSelect.value = '__custom__';
                onRegionChange();
                document.getElementById('edit-loc-region-custom-name').value = p.regionName || loc.regionName || '';
                document.getElementById('edit-loc-region-custom-id').value = rId;
            } else {
                rSelect.value = rId;
                onRegionChange();
            }

            const srId = p.subRegionId || loc.subRegionId || '';
            const srSelect = document.getElementById('edit-loc-subregion-select');
            if (srId && !Array.from(srSelect.options).some(o => o.value === srId)) {
                srSelect.value = '__custom__';
                onSubRegionChange();
                document.getElementById('edit-loc-subregion-custom-name').value = p.subRegionName || loc.subRegionName || '';
                document.getElementById('edit-loc-subregion-custom-id').value = srId;
            } else {
                srSelect.value = srId;
                onSubRegionChange();
            }

            document.getElementById('edit-loc-min-realm').value = p.minRealm !== undefined ? p.minRealm : (loc.minRealm || 0);
            document.getElementById('edit-loc-danger').value = p.danger || loc.danger || 'an_toan';
            document.getElementById('edit-loc-desc').value = p.description !== undefined ? p.description : (loc.description || '');
            
            const resArr = p.resources !== undefined ? p.resources : (loc.resources || []);
            document.getElementById('edit-loc-resources').value = resArr.join(', ');
            
            const eneArr = p.energies !== undefined ? p.energies : (loc.energies || []);
            document.getElementById('edit-loc-energies').value = JSON.stringify(eneArr);
            
            const ep = p.eventProbs || loc.eventProbs || { combat:0, loot:0, npc:0, empty:0 };
            document.getElementById('prob-combat').value = ep.combat || 0;
            document.getElementById('prob-loot').value = ep.loot || 0;
            document.getElementById('prob-npc').value = ep.npc || 0;
            document.getElementById('prob-empty').value = ep.empty || 0;

            document.getElementById('btn-delete-loc').style.display = 'block';
            
            const qiContainer = document.getElementById('qi-inputs');
            qiContainer.innerHTML = '';
            
            const qiData = p.elementQi || loc.elementQi;
            
            if (qiData) {
                for (const key of Object.keys(qiData)) {
                    qiContainer.innerHTML += \`
                        <div style="display: flex; align-items: center; gap: 5px; background: #222; padding: 2px 5px; border-radius: 3px; border: 1px solid #444;">
                            <span style="color:#ccc; width:40px; font-size:12px;">\${key}</span>
                            <input type="number" min="0" max="100" id="qi-\${key}" value="\${qiData[key]}" style="width: 100%; background: transparent; border: none; color: #fff; outline: none; text-align: right; font-size:12px;" onchange="markInfoDirty()" oninput="markInfoDirty()">
                        </div>
                    \`;
                }
            } else {
                qiContainer.innerHTML = '<span style="color:#555; font-size:13px;">Địa điểm này không có thuộc tính linh khí.</span>';
            }

            renderLocations();
            renderGallery();
        }

        function markInfoDirty() {
            if (!activeLocationSlug) return;
            
            let elementQi = null;
            const qiContainer = document.getElementById('qi-inputs');
            if (!qiContainer.innerHTML.includes('không có thuộc tính')) {
                elementQi = {};
                const inputs = qiContainer.querySelectorAll('input[type="number"]');
                inputs.forEach(inp => {
                    const key = inp.id.replace('qi-', '');
                    elementQi[key] = parseInt(inp.value) || 0;
                });
            }

            const resStr = document.getElementById('edit-loc-resources').value;
            const resources = resStr ? resStr.split(',').map(s => s.trim()).filter(s => s) : [];
            
            let energies = [];
            try { energies = JSON.parse(document.getElementById('edit-loc-energies').value || '[]'); } catch(e) {}
            
            const eventProbs = {
                combat: parseFloat(document.getElementById('prob-combat').value) || 0,
                loot: parseFloat(document.getElementById('prob-loot').value) || 0,
                npc: parseFloat(document.getElementById('prob-npc').value) || 0,
                empty: parseFloat(document.getElementById('prob-empty').value) || 0
            };

            const isNewLoc = appData.locations.find(l => l.slug === activeLocationSlug)?.isNew;
            
            let regionId = document.getElementById('edit-loc-region-select').value;
            let regionName = '';
            if (regionId && regionId !== '__custom__') {
                const sel = document.getElementById('edit-loc-region-select');
                regionName = sel.options[sel.selectedIndex].text;
            } else if (regionId === '__custom__') {
                regionName = document.getElementById('edit-loc-region-custom-name').value;
                regionId = document.getElementById('edit-loc-region-custom-id').value;
            }

            let subRegionId = document.getElementById('edit-loc-subregion-select').value;
            let subRegionName = '';
            if (subRegionId && subRegionId !== '__custom__') {
                const sel = document.getElementById('edit-loc-subregion-select');
                subRegionName = sel.options[sel.selectedIndex].text;
            } else if (subRegionId === '__custom__') {
                subRegionName = document.getElementById('edit-loc-subregion-custom-name').value;
                subRegionId = document.getElementById('edit-loc-subregion-custom-id').value;
            }

            infoChanges[activeLocationSlug] = {
                isNew: isNewLoc,
                name: document.getElementById('edit-loc-name').value,
                newSlug: document.getElementById('edit-loc-new-slug').value,
                description: document.getElementById('edit-loc-desc').value,
                worldId: document.getElementById('edit-loc-world').value,
                minRealm: parseInt(document.getElementById('edit-loc-min-realm').value) || 0,
                danger: document.getElementById('edit-loc-danger').value,
                regionName: regionName,
                regionId: regionId,
                subRegionName: subRegionName,
                subRegionId: subRegionId,
                resources: resources,
                energies: energies,
                eventProbs: eventProbs,
                elementQi: elementQi
            };

            document.getElementById('unsaved-warning').style.display = 'block';
            document.getElementById('selected-loc-name').innerText = infoChanges[activeLocationSlug].name;
        }

        function assignImage(imgFilename) {
            if (!activeLocationSlug) {
                alert('Vui lòng chọn một địa điểm ở cột bên trái trước!');
                return;
            }
            
            // Check if another location already has this image
            const existingLoc = appData.locations.find(l => l.slug !== activeLocationSlug && (changes[l.slug] === imgFilename || (!changes[l.slug] && l.currentImage === imgFilename)));
            if (existingLoc) {
                if (!confirm(\`Ảnh này đang được dùng cho "\${existingLoc.name}". Bạn có chắc chắn muốn lấy nó cho địa điểm hiện tại?\`)) {
                    return;
                }
            }

            changes[activeLocationSlug] = imgFilename;
            document.getElementById('unsaved-warning').style.display = 'block';
            renderLocations();
            renderGallery();
        }

        async function saveChanges() {
            const imgPayload = Object.keys(changes).map(slug => {
                const pendingInfo = infoChanges[slug];
                const finalSlug = pendingInfo && pendingInfo.newSlug ? pendingInfo.newSlug : slug;
                return {
                    locationSlug: finalSlug,
                    newImageFilename: changes[slug]
                };
            });
            
            const infoPayload = Object.keys(infoChanges).map(slug => ({
                slug: slug,
                ...infoChanges[slug]
            }));

            if (imgPayload.length === 0 && infoPayload.length === 0) return;

            const saveBtn = document.getElementById('save-btn');
            saveBtn.disabled = true;
            saveBtn.innerText = 'Đang lưu...';

            try {
                if (infoPayload.length > 0) {
                    const resInfo = await fetch('/api/locations/update-batch', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(infoPayload)
                    });
                    if (!resInfo.ok) throw new Error('Lỗi lưu text địa điểm');
                }

                if (imgPayload.length > 0) {
                    const resImg = await fetch('/api/save', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(imgPayload)
                    });
                    if (!resImg.ok) throw new Error('Lỗi lưu ảnh');
                }

                showToast('Lưu thành công!');
                changes = {};
                infoChanges = {};
                document.getElementById('unsaved-warning').style.display = 'none';
                cacheBuster = Date.now();
                await init();
            } catch (err) {
                alert('Lỗi: ' + err.message);
            } finally {
                saveBtn.disabled = false;
                saveBtn.innerText = 'Lưu Thay Đổi';
            }
        }

        function showToast(msg = 'Cập nhật thành công!') {
            const toast = document.getElementById('toast');
            toast.innerText = msg;
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3000);
        }

        async function uploadFiles(event) {
            const files = event.target.files;
            if (!files || files.length === 0) return;
            
            const fileData = [];
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const reader = new FileReader();
                const base64 = await new Promise(resolve => {
                    reader.onload = e => resolve(e.target.result);
                    reader.readAsDataURL(file);
                });
                fileData.push({ name: file.name, data: base64 });
            }

            event.target.value = ''; // Reset input
            
            try {
                const res = await fetch('/api/upload', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ files: fileData })
                });
                if (res.ok) {
                    const data = await res.json();
                    let msg = '';
                    if (data.uploaded && data.uploaded.length > 0) {
                        msg += '✅ Đã tải lên thành công ' + data.uploaded.length + ' ảnh mới.\\n\\n';
                    }
                    if (data.duplicates && data.duplicates.length > 0) {
                        msg += 'Từ chối tải lên:\\n' + data.duplicates.join('\\n');
                    }
                    
                    if (data.duplicates && data.duplicates.length > 0) {
                        alert(msg);
                    } else if (data.uploaded && data.uploaded.length > 0) {
                        showToast('Đã tải ảnh lên thành công!');
                    }
                    
                    cacheBuster = Date.now();
                    await init(); // reload gallery
                } else {
                    const data = await res.json();
                    alert('Lỗi tải lên: ' + data.message);
                }
            } catch (e) {
                alert('Lỗi kết nối: ' + e.message);
            }
        }

        async function deleteImage(imgFilename) {
            if (!confirm('Bạn có chắc chắn muốn xóa vĩnh viễn ảnh "' + imgFilename + '" không? Hành động này không thể hoàn tác.')) return;
            
            try {
                const res = await fetch('/api/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ filename: imgFilename })
                });
                if (res.ok) {
                    showToast('Đã xóa ảnh thành công!');
                    cacheBuster = Date.now();
                    await init(); // reload gallery
                } else {
                    const data = await res.json();
                    alert('Lỗi khi xóa: ' + data.message);
                }
            } catch (e) {
                alert('Lỗi kết nối: ' + e.message);
            }
        }

        async function deleteActiveLocation() {
            const slug = document.getElementById('edit-loc-slug').value;
            const name = document.getElementById('edit-loc-name').value;
            if (!slug) return;
            
            if (!confirm('Bạn có CỰC KỲ CHẮC CHẮN muốn xóa vĩnh viễn địa điểm "' + name + '" khỏi hệ thống không? Toàn bộ dữ liệu của nó sẽ bị xóa khỏi map-data.js!')) return;
            
            try {
                const res = await fetch('/api/locations/delete', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ slug })
                });
                if (res.ok) {
                    showToast('Đã xóa địa điểm thành công!');
                    activeLocationSlug = null;
                    document.getElementById('location-editor-panel').style.display = 'none';
                    await init(); // reload data
                } else {
                    const data = await res.json();
                    alert('Lỗi xóa địa điểm: ' + data.message);
                }
            } catch (e) { alert('Lỗi kết nối: ' + e.message); }
        }

        function openAddLocationModal() {
            const newSlug = 'new_location_' + Date.now();
            const loc = {
                slug: newSlug,
                id: newSlug,
                name: 'Địa điểm mới',
                isNew: true,
                worldId: 'nhan_gioi',
                minRealm: 0,
                danger: 'an_toan',
                elementQi: { "Kim": 0, "Mộc": 0, "Thủy": 0, "Hỏa": 0, "Thổ": 0, "Phong": 0, "Lôi": 0, "Băng": 0, "Quang": 0, "Ám": 0 },
                eventProbs: { combat:0, loot:0, npc:0, empty:0 },
                resources: [],
                energies: []
            };
            appData.locations.unshift(loc);
            renderLocations();
            selectLocation(newSlug);
            markInfoDirty();
        }

        init();
    </script>
</body>
</html>
`;
