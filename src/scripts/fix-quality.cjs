const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../../src/configs/item-data.js');
let content = fs.readFileSync(filePath, 'latin1');

// Mapping from old (latin1-encoded) quality strings to new ones
// Old values detected from diagnostic, new values are the 8-tier system
const replacements = [
    ["quality: 'Danh B\u00e1\u00ba\u00a3o'",              "quality: 'Ti\u00c3\u00aan Kh\u00c3\u00ad'"],          // Danh Bảo → Tiên Khí
    ["quality: 'Danh Kh\u00c3\u00ad'",                   "quality: 'Linh B\u00e1\u00ba\u00a3o'"],               // Danh Khí → Linh Bảo
    ["quality: 'Ho\u00c3\u00a0n M\u00e1\u00bb\u00b9'",   "quality: 'C\u00e1\u00bb\u0095 B\u00e1\u00ba\u00a3o'"], // Hoàn Mỹ → Cổ Bảo
    ["quality: 'Truy\u00e1\u00bb\u0081n Thuy\u00e1\u00ba\u00bft'", "quality: 'Th\u00c3\u00b4ng Thi\u00c3\u00aan Linh B\u00e1\u00ba\u00a3o'"], // Truyền Thuyết → Thông Thiên Linh Bảo
    ["quality: 'Th\u00e1\u00ba\u00a7n Tho\u00e1\u00ba\u00a1i'", "quality: 'Ti\u00c3\u00aan Kh\u00c3\u00ad'"],     // Thần Thoại → Tiên Khí
    ["quality: 'C\u00e1\u00bb\u00b1c Ph\u00e1\u00ba\u00a9m'",  "quality: 'Ti\u00c3\u00aan Kh\u00c3\u00ad'"],    // Cực Phẩm → Tiên Khí
    ["quality: 'Ti\u00c3\u00aan'",                        "quality: 'Ti\u00c3\u00aan Kh\u00c3\u00ad'"],          // Tiên → Tiên Khí  (must come AFTER Thần Thoại)
    ["quality: 'Th\u00e1\u00ba\u00a7n'",                 "quality: 'Linh B\u00e1\u00ba\u00a3o'"],               // Thần → Linh Bảo
    ["quality: 'Tinh Ph\u00e1\u00ba\u00a9m'",            "quality: 'Ph\u00c3\u00a1p Kh\u00c3\u00ad'"],          // Tinh Phẩm → Pháp Khí
    ["quality: 'Huy\u00e1\u00bb\u0081n'",                "quality: 'Linh Kh\u00c3\u00ad'"],                     // Huyền → Linh Khí
];

let total = 0;
replacements.forEach(([from, to]) => {
    const parts = content.split(from);
    const count = parts.length - 1;
    if (count > 0) {
        content = parts.join(to);
        console.log(`  ✓ (${count} chỗ)`);
        total += count;
    }
});

fs.writeFileSync(filePath, content, 'latin1');
console.log(`\nHoàn tất: ${total} chỗ được thay thế.`);

// Verify
const verify = content.match(/quality: '[^']+'/g) || [];
const unique = [...new Set(verify)].sort();
console.log('\nCác quality còn lại:');
unique.forEach(q => console.log(' ', q));
