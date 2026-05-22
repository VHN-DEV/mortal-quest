const http = require('http');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const projectRoot = __dirname;
const imagesDir = path.join(projectRoot, 'src', 'assets', 'images', 'locations');
const mapDataPath = path.join(projectRoot, 'src', 'configs', 'map-data.js');

function parseMapData() {
    const mapDataStr = fs.readFileSync(mapDataPath, 'utf8');
    const lines = mapDataStr.split('\n');
    let currentLoc = {};
    const locs = [];

    for (const line of lines) {
        const idMatch = line.match(/id:\s*['"]([^'"]+)['"]/);
        if (idMatch) {
            if (currentLoc.slug) locs.push(currentLoc);
            currentLoc = { slug: idMatch[1] }; // id is fallback slug
        }
        
        const nameMatch = line.match(/name:\s*['"]([^'"]+)['"]/);
        if (nameMatch) currentLoc.name = nameMatch[1];
        
        const descMatch = line.match(/description:\s*['"]([^'"]+)['"]/);
        if (descMatch) currentLoc.description = descMatch[1];

        const slugMatch = line.match(/slug:\s*['"]([^'"]+)['"]/);
        if (slugMatch) currentLoc.slug = slugMatch[1];
        
        const qiMatch = line.match(/elementQi:\s*({[^}]+})/);
        if (qiMatch) {
            try { currentLoc.elementQi = JSON.parse(qiMatch[1]); } catch(e) {}
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
        
        // Match locations with their current image if exists
        const enrichedLocations = locations.map(loc => {
            let currentImage = null;
            if (files.includes(`${loc.slug}.webp`)) currentImage = `${loc.slug}.webp`;
            else if (files.includes(`${loc.slug}.png`)) currentImage = `${loc.slug}.png`;
            return { ...loc, currentImage };
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ locations: enrichedLocations, allImages: files }));
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
                    const { slug, newSlug, name, description, elementQi } = payload;
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
                            if (line.match(/name:\s*['"]/)) {
                                lines[i] = line.replace(/name:\s*(['"])[^'"]*\\1/, `name: "${name}"`);
                            }
                            if (line.match(/description:\s*['"]/)) {
                                lines[i] = line.replace(/description:\s*(['"])[^'"]*\\1/, `description: "${description}"`);
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
                
                let fileContent = fs.readFileSync(mapDataPath, 'utf8');
                const idIndex = fileContent.indexOf(`id: "${slug}"`);
                if (idIndex === -1) throw new Error('Location not found in source file');
                
                const blockStartIndex = fileContent.lastIndexOf('{', idIndex);
                let brackets = 0;
                let blockEndIndex = -1;
                for (let i = blockStartIndex; i < fileContent.length; i++) {
                    if (fileContent[i] === '{') brackets++;
                    if (fileContent[i] === '}') brackets--;
                    if (brackets === 0) {
                        blockEndIndex = i;
                        break;
                    }
                }
                
                if (blockEndIndex !== -1) {
                    let nextCharIdx = blockEndIndex + 1;
                    while(fileContent[nextCharIdx] === ' ' || fileContent[nextCharIdx] === '\\r' || fileContent[nextCharIdx] === '\\n') nextCharIdx++;
                    if (fileContent[nextCharIdx] === ',') nextCharIdx++;
                    
                    fileContent = fileContent.substring(0, blockStartIndex) + fileContent.substring(nextCharIdx);
                    fs.writeFileSync(mapDataPath, fileContent, 'utf8');
                }
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
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h2 style="margin: 0;">Thư viện ảnh <span id="gallery-count" style="font-size: 14px; color: #888; font-weight: normal;"></span></h2>
                    <div style="display: flex; gap: 5px;">
                        <input type="text" id="search-img" placeholder="Tìm tên file ảnh..." style="width: 250px; padding: 8px; border-radius: 4px; border: 1px solid #444; background: #222; color: #fff; box-sizing: border-box;" oninput="renderGallery()">
                        <button class="btn" style="padding: 8px;" onclick="toggleImgSort()" title="Sắp xếp A-Z">A-Z</button>
                    </div>
                </div>
                <p style="color: #aaa; margin-bottom: 20px;">1. Chọn một địa điểm ở cột trái.<br>2. Click vào bức ảnh bên dưới để gán cho địa điểm đó.</p>
                
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
                        <textarea id="edit-loc-desc" placeholder="Mô tả địa điểm..." rows="3" style="width: 100%; padding: 8px; border-radius: 4px; border: 1px solid #555; background: #222; color: #fff; resize: vertical; box-sizing: border-box;" oninput="markInfoDirty()"></textarea>
                        
                        <div style="font-size: 13px; color: #aaa; margin-top: 5px;">Tỉ lệ linh khí (0-100%):</div>
                        <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 5px;" id="qi-inputs">
                            <span style="color:#555; font-size:13px;">Chọn địa điểm để xem</span>
                        </div>
                    </div>
                    <img id="large-preview" style="width: 500px; height: 320px; object-fit: cover; border-radius: 6px; border: 2px solid #555; background: #000; display: none;" />
                </div>

                <div class="gallery-grid" id="gallery-list">
                    <!-- Gallery loaded here -->
                </div>
            </div>
        </div>
    </div>

    <div class="toast" id="toast">Cập nhật thành công!</div>

    <script>
        let appData = { locations: [], allImages: [] };
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

            // Find which images are currently assigned to what
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
                
                // Is it the selected image for the active location?
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

        function selectLocation(slug) {
            activeLocationSlug = slug;
            const loc = appData.locations.find(l => l.slug === slug);
            const pendingInfo = infoChanges[slug];
            
            document.getElementById('selected-loc-name').innerText = pendingInfo ? pendingInfo.name : loc.name;
            document.getElementById('edit-loc-slug').value = loc.slug;
            document.getElementById('edit-loc-new-slug').value = pendingInfo && pendingInfo.newSlug ? pendingInfo.newSlug : loc.slug;
            document.getElementById('edit-loc-name').value = pendingInfo ? pendingInfo.name : loc.name;
            document.getElementById('edit-loc-desc').value = pendingInfo ? pendingInfo.description : (loc.description || '');
            document.getElementById('btn-delete-loc').style.display = 'block';
            
            const qiContainer = document.getElementById('qi-inputs');
            qiContainer.innerHTML = '';
            
            const qiData = pendingInfo ? pendingInfo.elementQi : loc.elementQi;
            
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

        function autoGenerateSlug() {
            const name = document.getElementById('edit-loc-name').value;
            const newSlug = name.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9 ]/g, "").trim().replace(/\\s+/g, "_");
            document.getElementById('edit-loc-new-slug').value = newSlug;
            markInfoDirty();
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

            infoChanges[activeLocationSlug] = {
                name: document.getElementById('edit-loc-name').value,
                newSlug: document.getElementById('edit-loc-new-slug').value,
                description: document.getElementById('edit-loc-desc').value,
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
            const name = prompt('Nhập tên địa điểm mới:');
            if (!name) return;
            
            const slug = name.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "").replace(/đ/g, "d").replace(/[^a-z0-9 ]/g, "").trim().replace(/\\s+/g, "_");
            
            const desc = prompt('Nhập mô tả (có thể để trống):');
            
            // Hardcode or ask for world
            const worldMap = {
                '1': 'nhan_gioi',
                '2': 'linh_gioi',
                '3': 'tien_gioi',
                '4': 'ma_gioi',
                '5': 'khong_gian_khe_nut'
            };
            const w = prompt('Chọn Thế giới (nhập số):\\n1. Nhân Giới\\n2. Linh Giới\\n3. Tiên Giới\\n4. Ma Giới\\n5. Giới diện song song', '1');
            const worldId = worldMap[w];
            
            if (!worldId) { alert('Chọn thế giới không hợp lệ'); return; }
            
            addLocation(slug, name, desc || '', worldId);
        }

        async function addLocation(slug, name, description, worldId) {
            try {
                const res = await fetch('/api/locations/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ slug, name, description, worldId })
                });
                if (res.ok) {
                    showToast('Đã thêm địa điểm thành công!');
                    await init(); // reload data
                    selectLocation(slug); // automatically select the new location
                } else {
                    const data = await res.json();
                    alert('Lỗi thêm địa điểm: ' + data.message);
                }
            } catch (e) { alert('Lỗi kết nối: ' + e.message); }
        }

        init();
    </script>
</body>
</html>
`;
