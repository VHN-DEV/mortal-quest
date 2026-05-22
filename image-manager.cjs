const http = require('http');
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
                
                let extraCounter = 1;
                function getFreeExtraName(ext) {
                    while (true) {
                        const name = `locations_extra_${extraCounter}${ext}`;
                        if (!fs.existsSync(path.join(imagesDir, name))) return name;
                        extraCounter++;
                    }
                }

                payload.files.forEach(f => {
                    const match = f.data.match(/^data:image\/([a-zA-Z0-9]+);base64,(.+)$/);
                    if (!match) return;
                    let ext = '.' + match[1];
                    if (ext === '.jpeg') ext = '.jpg';
                    
                    const base64Data = match[2];
                    const buffer = Buffer.from(base64Data, 'base64');
                    
                    const newName = getFreeExtraName(ext);
                    fs.writeFileSync(path.join(imagesDir, newName), buffer);
                });

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
            <div class="locations-panel" id="loc-list">
                <!-- Locations loaded here -->
                <div style="text-align: center; padding: 20px; color: #888;">Đang tải dữ liệu...</div>
            </div>
            
            <div class="gallery-panel">
                <h2 style="margin-top: 0;">Thư viện ảnh <span id="gallery-count" style="font-size: 14px; color: #888; font-weight: normal;"></span></h2>
                <p style="color: #aaa; margin-bottom: 20px;">1. Chọn một địa điểm ở cột trái.<br>2. Click vào bức ảnh bên dưới để gán cho địa điểm đó.</p>
                
                <div style="background: #333; padding: 15px; border-radius: 6px; margin-bottom: 20px; position: sticky; top: -20px; z-index: 5; display: flex; gap: 20px; align-items: flex-start;">
                    <div style="flex: 1;">
                        <h3 style="color: #fff; margin: 0 0 10px 0;">
                            Đang chọn ảnh cho: <span id="selected-loc-name" style="color: #4db8ff;">Vui lòng chọn địa điểm</span>
                        </h3>
                        <p id="selected-loc-desc" style="color: #aaa; font-size: 14px; margin: 0; line-height: 1.4;"></p>
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
        let cacheBuster = Date.now();

        async function init() {
            const res = await fetch('/api/data');
            appData = await res.json();
            renderLocations();
            renderGallery();
        }

        function renderLocations() {
            const container = document.getElementById('loc-list');
            container.innerHTML = '';
            
            appData.locations.forEach(loc => {
                const isModified = changes[loc.slug] !== undefined;
                const currentImgFile = isModified ? changes[loc.slug] : loc.currentImage;
                const imgSrc = currentImgFile ? \`/api/images/\${encodeURIComponent(currentImgFile)}?t=\${cacheBuster}\` : '';
                
                const div = document.createElement('div');
                div.className = \`location-item \${activeLocationSlug === loc.slug ? 'active' : ''}\`;
                div.onclick = () => selectLocation(loc.slug);
                
                div.innerHTML = \`
                    <img src="\${imgSrc}" class="loc-img-preview" onerror="this.style.opacity=0.3">
                    <div class="loc-info">
                        <h3>\${loc.name} \${isModified ? '<span style="color:#ff9900;font-size:12px;">(Đã sửa)</span>' : ''}</h3>
                        <p>\${loc.description || 'Chưa có mô tả'}</p>
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

            // Sort so unassigned/extra images are first? Or just alphabetically.
            const sortedImages = [...appData.allImages].sort((a, b) => {
                const aIsExtra = a.includes('locations_extra_');
                const bIsExtra = b.includes('locations_extra_');
                if (aIsExtra && !bIsExtra) return -1;
                if (!aIsExtra && bIsExtra) return 1;
                return a.localeCompare(b);
            });

            sortedImages.forEach(img => {
                const div = document.createElement('div');
                
                // Is it the selected image for the active location?
                const isSelectedForActive = currentImgForActive === img;
                
                const assignedTo = assignedImages[img];
                
                div.className = \`gallery-item \${isSelectedForActive ? 'selected' : ''} \${assignedTo && !isSelectedForActive ? 'assigned' : ''}\`;
                div.onclick = () => assignImage(img);
                
                div.innerHTML = \`
                    \${assignedTo ? \`<div class="assigned-badge">\${assignedTo}</div>\` : ''}
                    <img src="/api/images/\${encodeURIComponent(img)}?t=\${cacheBuster}" loading="lazy">
                    <div class="filename">\${img}</div>
                \`;
                container.appendChild(div);
            });
        }

        function selectLocation(slug) {
            activeLocationSlug = slug;
            const loc = appData.locations.find(l => l.slug === slug);
            document.getElementById('selected-loc-name').innerText = loc.name;
            document.getElementById('selected-loc-desc').innerText = loc.description || 'Chưa có mô tả';
            renderLocations();
            renderGallery();
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
            const payload = Object.keys(changes).map(slug => ({
                locationSlug: slug,
                newImageFilename: changes[slug]
            }));

            if (payload.length === 0) return;

            const saveBtn = document.getElementById('save-btn');
            saveBtn.disabled = true;
            saveBtn.innerText = 'Đang lưu...';

            try {
                const res = await fetch('/api/save', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                
                if (res.ok) {
                    changes = {}; // Reset changes
                    document.getElementById('unsaved-warning').style.display = 'none';
                    showToast();
                    cacheBuster = Date.now(); // Force browser to bypass cache for new images
                    await init(); // Reload data
                } else {
                    const data = await res.json();
                    alert('Lỗi: ' + data.message);
                }
            } catch (e) {
                alert('Lỗi kết nối: ' + e.message);
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
                    showToast('Đã tải ảnh lên thành công!');
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

        init();
    </script>
</body>
</html>
`;
