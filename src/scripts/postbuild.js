import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import JavaScriptObfuscator from 'javascript-obfuscator';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.resolve(__dirname, '../../dist');
const ASSETS_DIR = path.join(DIST_DIR, 'assets');

const XOR_KEY = [0x5f, 0x3d, 0x4a, 0x22]; // Key 4-byte dùng để mã hóa XOR hình ảnh

// Hàm đệ quy quét các file
function getFilesRecursively(dir, filterFn) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFilesRecursively(filePath, filterFn));
    } else {
      if (!filterFn || filterFn(filePath)) {
        results.push(filePath);
      }
    }
  });
  return results;
}

async function run() {
  console.log('\n==================================================');
  console.log('⚡ KHỞI ĐỘNG QUY TRÌNH BẢO MẬT HẬU BUILD (POSTBUILD) ⚡');
  console.log('==================================================\n');

  if (!fs.existsSync(DIST_DIR)) {
    console.error(`✗ Không tìm thấy thư mục build: ${DIST_DIR}. Vui lòng chạy npm run build trước.`);
    process.exit(1);
  }

  // ----------------------------------------------------
  // BƯỚC 1: LÀM RỐI CODE JAVASCRIPT (JS OBFUSCATION)
  // ----------------------------------------------------
  console.log('[Tầng 1] Tiến hành làm rối code JavaScript...');
  const jsFiles = getFilesRecursively(ASSETS_DIR, (p) => p.endsWith('.js'));
  
  jsFiles.forEach((filePath) => {
    const fileName = path.basename(filePath);
    
    // Bỏ qua các file thư viện ngoài (vendor) để tránh phình dung lượng lớn và giảm thời gian build
    if (fileName.startsWith('vendor-') || fileName.startsWith('polyfills-')) {
      console.log(`  - Bỏ qua file thư viện: ${fileName}`);
      return;
    }

    console.log(`  -> Đang làm rối: ${fileName}`);
    try {
      const code = fs.readFileSync(filePath, 'utf8');
      const obfuscatedResult = JavaScriptObfuscator.obfuscate(code, {
        compact: true,
        controlFlowFlattening: false, // Tắt để tăng tốc build tối đa (từ vài phút xuống vài giây)
        deadCodeInjection: false,
        debugProtection: false, // Tránh crash trong Android WebView
        disableConsoleOutput: false,
        identifierNamesGenerator: 'hexadecimal',
        rotateStringArray: true,
        selfDefending: true,
        stringArray: true,
        stringArrayEncoding: ['rc4'],
        stringArrayThreshold: 0.75,
        unicodeEscapeSequence: false
      });
      fs.writeFileSync(filePath, obfuscatedResult.getObfuscatedCode(), 'utf8');
      console.log(`  ✓ Đã hoàn tất làm rối: ${fileName}`);
    } catch (err) {
      console.error(`  ✗ Lỗi làm rối file ${fileName}:`, err.message);
    }
  });

  // ----------------------------------------------------
  // BƯỚC 2: MÃ HÓA HÌNH ẢNH (XOR ENCRYPTION)
  // ----------------------------------------------------
  console.log('\n[Tầng 2] Tiến hành mã hóa hình ảnh và đổi extension thành .dat...');
  const imageExtensions = /\.(webp|png|jpg|jpeg|gif|svg)$/i;
  const imageFiles = getFilesRecursively(ASSETS_DIR, (p) => imageExtensions.test(p));

  let encryptedCount = 0;
  imageFiles.forEach((filePath) => {
    const fileName = path.basename(filePath);
    
    try {
      const buffer = fs.readFileSync(filePath);
      
      // Mã hóa XOR từng byte trực tiếp trên buffer
      for (let i = 0; i < buffer.length; i++) {
        buffer[i] = buffer[i] ^ XOR_KEY[i % XOR_KEY.length];
      }
      
      // Đổi đuôi thành .dat để che giấu định dạng ảnh gốc
      const datPath = filePath.replace(imageExtensions, '.dat');
      fs.writeFileSync(datPath, buffer);
      
      // Xóa file ảnh gốc (.webp, .png, v.v.)
      fs.unlinkSync(filePath);
      encryptedCount++;
    } catch (err) {
      console.error(`  ✗ Lỗi mã hóa ảnh ${fileName}:`, err.message);
    }
  });
  console.log(`  ✓ Đã mã hóa thành công ${encryptedCount} file hình ảnh thành .dat và xóa file gốc.`);

  // ----------------------------------------------------
  // BƯỚC 3: TẠO SERVICE WORKER (sw.js)
  // ----------------------------------------------------
  console.log('\n[Tầng 2] Đang khởi tạo Service Worker (sw.js)...');
  const swContent = `/**
 * Service Worker - Mortal Quest
 * Tự động bắt request hình ảnh, chuyển đổi đường dẫn sang .dat,
 * tải dữ liệu đã mã hóa và thực hiện giải mã XOR ở runtime.
 */

const KEY = [${XOR_KEY.join(', ')}];

self.addEventListener('install', (event) => {
  console.log('[SW] Installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Activated');
  event.waitUntil(self.clients.claim());
});

// Hàm giải mã XOR
function decrypt(arrayBuffer) {
  const view = new DataView(arrayBuffer);
  const keyLen = KEY.length;
  for (let i = 0; i < view.byteLength; i++) {
    view.setUint8(i, view.getUint8(i) ^ KEY[i % keyLen]);
  }
  return arrayBuffer;
}

// Lấy MIME type của ảnh
function getMimeType(path) {
  const lowercasePath = path.toLowerCase();
  if (lowercasePath.endsWith('.webp')) return 'image/webp';
  if (lowercasePath.endsWith('.png')) return 'image/png';
  if (lowercasePath.endsWith('.jpg') || lowercasePath.endsWith('.jpeg')) return 'image/jpeg';
  if (lowercasePath.endsWith('.gif')) return 'image/gif';
  if (lowercasePath.endsWith('.svg')) return 'image/svg+xml';
  return 'application/octet-stream';
}

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  const pathname = url.pathname;

  // Chỉ bắt các request hình ảnh cục bộ
  if (
    url.origin === self.location.origin &&
    /\\.(webp|png|jpg|jpeg|gif|svg)$/i.test(pathname)
  ) {
    // Map URL từ .webp/.png sang .dat tương ứng
    const datPathname = pathname.replace(/\\.(webp|png|jpg|jpeg|gif|svg)$/i, '.dat');
    const datUrl = new URL(datPathname, url.origin).toString();

    event.respondWith(
      fetch(datUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Không thể tải file mã hóa: ' + response.status + ' ' + response.statusText);
          }
          return response.arrayBuffer();
        })
        .then((buffer) => {
          const decrypted = decrypt(buffer);
          const mimeType = getMimeType(pathname);
          return new Response(decrypted, {
            status: 200,
            statusText: 'OK',
            headers: {
              'Content-Type': mimeType,
              'Cache-Control': 'max-age=31536000'
            }
          });
        })
        .catch((error) => {
          console.error('[SW] Lỗi chặn và giải mã tài nguyên:', error);
          // Fallback tải request gốc nếu giải mã thất bại
          return fetch(event.request);
        })
    );
  }
});
`;

  fs.writeFileSync(path.join(DIST_DIR, 'sw.js'), swContent, 'utf8');
  console.log('  ✓ Đã sinh file dist/sw.js thành công.');

  // ----------------------------------------------------
  // BƯỚC 4: TIÊM BOOTSTRAP ĐĂNG KÝ SW VÀO dist/index.html
  // ----------------------------------------------------
  console.log('\n[Tầng 2] Đang tiêm mã kích hoạt Service Worker vào dist/index.html...');
  const htmlPath = path.join(DIST_DIR, 'index.html');
  if (fs.existsSync(htmlPath)) {
    let html = fs.readFileSync(htmlPath, 'utf8');
    
    // Tìm thẻ script type="module" trỏ đến file JS chính của Vite
    const scriptRegex = /<script type="module" [^>]*src="([^"]+)"[^>]*><\/script>/i;
    const match = html.match(scriptRegex);
    
    if (match) {
      const mainScriptSrc = match[1];
      console.log(`  - Tìm thấy thẻ script chính: ${mainScriptSrc}`);
      
      const bootstrapScript = `
    <!-- Quy trình kích hoạt Service Worker giải mã trước khi khởi chạy Game -->
    <script>
      (function() {
        const scriptSrc = "${mainScriptSrc}";
        
        function loadGame() {
          console.log('[Bootstrap] Đang load mã nguồn game chính...');
          const s = document.createElement('script');
          s.type = 'module';
          s.crossOrigin = 'anonymous';
          s.src = scriptSrc;
          document.head.appendChild(s);
        }
        
        if ('serviceWorker' in navigator) {
          navigator.serviceWorker.register('./sw.js').then(function(reg) {
            console.log('[Bootstrap] Đăng ký Service Worker thành công');
            
            // Nếu Service Worker đã kiểm soát trang rồi, bắt đầu load game luôn
            if (navigator.serviceWorker.controller) {
              console.log('[Bootstrap] Service Worker đã kiểm soát trang. Bắt đầu game.');
              loadGame();
            } else {
              // Nếu Service Worker vừa được cài đặt lần đầu, đợi controllerchange rồi reload lại
              // để Service Worker bắt đầu kiểm soát toàn bộ request tài nguyên từ đầu.
              console.log('[Bootstrap] Đang chờ Service Worker kích hoạt kiểm soát...');
              navigator.serviceWorker.addEventListener('controllerchange', function() {
                console.log('[Bootstrap] Service Worker đã kích hoạt! Reload để áp dụng giải mã...');
                window.location.reload();
              });
            }
          }).catch(function(err) {
            console.error('[Bootstrap] Đăng ký Service Worker thất bại, load game trực tiếp:', err);
            loadGame();
          });
        } else {
          console.log('[Bootstrap] Browser không hỗ trợ Service Worker, load game trực tiếp.');
          loadGame();
        }
      })();
    </script>
      `;
      
      // Thay thế thẻ script nguyên bản bằng script bootstrap
      html = html.replace(scriptRegex, bootstrapScript);
      fs.writeFileSync(htmlPath, html, 'utf8');
      console.log('  ✓ Đã tiêm mã bootstrap đăng ký SW thành công.');
    } else {
      console.warn('  ⚠ CẢNH BÁO: Không tìm thấy thẻ script chính trong index.html để tiêm bootstrap.');
    }
  }

  console.log('\n==================================================');
  console.log('🎉 QUY TRÌNH BẢO MẬT ĐÃ HOÀN TẤT THÀNH CÔNG! 🎉');
  console.log('==================================================\n');
}

run().catch((err) => {
  console.error('✗ Gặp lỗi nghiêm trọng trong quy trình postbuild:', err);
  process.exit(1);
});
