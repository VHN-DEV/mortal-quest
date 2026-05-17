import fs from 'fs';

const fileContent = fs.readFileSync('src/configs/map-data.js', 'utf8');

// Parse all location ids and names
const locRegex = /id:\s*'([^']+)',\s*name:\s*'([^']+)'/g;
const locations = [];
let match;
while ((match = locRegex.exec(fileContent)) !== null) {
    locations.push({ id: match[1], name: match[2].toLowerCase() });
}

const checklist = {
    "Nhân Giới": [
        "Thái Nam Tiểu Hội", "Gia tộc tu tiên", "Hoàng Phong Cốc", "Linh Thú Sơn", "Thanh Hư Môn",
        "Cự Kiếm Môn", "Hóa Đao Ổ", "Thiên Khuyết Bảo", "Yểm Nguyệt Tông", "Trúc Cơ Thánh Địa",
        "Huyết Sắc Cấm Địa", "Thái Nhạc Sơn Mạch", "Mặc phủ", "Thần Thủ Cốc", "Hoàng Long Sơn",
        "Nguyên Vũ Quốc", "Tử Kim Quốc", "Xa Kỵ Quốc", "Mộ Lan Thảo Nguyên", "Thiên La Quốc",
        "Cửu Quốc Minh", "Quỷ Linh Môn", "Hợp Hoan Tông", "Ma Diễm Môn", "Thiên Sát Tông",
        "Ngự Linh Tông", "Chính Đạo Minh", "Thiên Đạo Minh", "Khôn Ngô Sơn", "Hư Thiên Điện",
        "Côn Ngô Điện", "Đại Tấn biên cảnh", "Thiên Nam Tu Tiên Giới", "Yêu thú hải vực",
        "Hải đảo nhỏ", "Linh khoáng đảo", "Hải yêu sào huyệt", "Kỳ Uyên Đảo", "Thiên Tinh Thành",
        "Diệu Âm Môn", "Nghịch Tinh Minh", "Tinh Cung", "Huyền Cốt Đảo", "Hư Thiên Đỉnh",
        "Quỷ Vụ", "Hải thú cấm khu", "Kình Thiên Ma Hải", "Thượng cổ truyền tống trận",
        "Hải vực thượng cổ", "Tấn Kinh", "Chính Ma Thập Đạo", "Phật Tông", "Nho Môn",
        "Thái Nhất Môn", "Cửu U Tông", "Âm La Tông", "Đại Tấn Hoàng Thành", "Thiên Cơ Các",
        "Thiên Ma Thành", "Vạn Yêu Cốc", "Côn Ngô Sơn", "Đại Tấn linh mạch", "Bắc Dạ Tiểu Cực Cung",
        "Tiểu Cực Cung", "Thiên Lan Thảo Nguyên", "Không gian tiết điểm", "Băng Hải", "Bắc Minh Đảo",
        "Băng Uyên", "Hàn Ly Đài", "Cực Hàn Chi Địa", "Đột Ngột tộc", "Mộ Lan nhân", "Thánh Điện",
        "Tế đàn", "Thảo nguyên chiến trường", "Cổ ma phong ấn", "Thượng cổ di tích", "Phật môn di chỉ",
        "Sa hải bí cảnh", "Hải thú lãnh địa", "Hải tộc", "Hắc vụ hải vực", "Không gian loạn lưu",
        "Giới diện thông đạo", "Phi thăng thông đạo"
    ],
    "Linh Giới": [
        "Thiên Uyên Thành", "Thiên Nguyên Cảnh", "Nhân tộc 13 thiên thành", "Thánh đảo",
        "Thánh Hoàng Thành", "Quảng Hàn Giới", "Phi Linh Tộc chiến trường", "Nhân Yêu lưỡng tộc",
        "Thiên Hồ tộc", "Thiên Bằng tộc", "Cự Viên tộc", "Giao Long tộc", "Côn Bằng lãnh địa",
        "Chân Linh thế giới", "Vạn Yêu Sơn Mạch", "Ma Nguyên Hải", "Thánh Tổ Ma Cung",
        "Ma Giới thông đạo", "Huyết Thiên Đại Lục", "Ma vực chiến trường", "Mộc Tộc", "Giác Xi Tộc",
        "Ảnh Tộc", "Dạ Xoa Tộc", "Phi Linh Tộc", "Hải Vương Tộc", "Cự Linh Tộc", "Minh Hà Chi Địa",
        "Chân Linh Chi Huyệt", "Hư Không Chi Địa", "Ma Uyên", "Thượng cổ chiến trường", "Tiên Phủ",
        "Chân Tiên động phủ", "Tiên gia dược viên", "Thái cổ chiến trường", "Tiếp dẫn điện",
        "Phi thăng quảng trường", "Giới diện đại trận"
    ],
    "Ma Giới": [
        "Thánh Tổ Ma Cung", "Ma Uyên", "Huyết Hải", "Thi Cốt Sơn", "Ma Long Cốc", "Hắc Ám Thánh Thành",
        "Huyết Hà", "Hắc Ma Hải", "Ma thú lãnh địa", "Ma linh khu", "Thánh Tổ", "Ma Quân", "Ma Tôn",
        "Ma Vệ", "Ma tộc quân đoàn", "Giới diện khe nứt", "Không gian tiết điểm", "Xâm lấn chiến trường",
        "Chân Ma điện", "Ma thần tế đàn", "Ma hóa bí cảnh"
    ],
    "Tiên Giới": [
        "Bắc Hàn Tiên Vực", "Cửu Nguyên Quan", "Luân Hồi Điện", "Thiên Đình", "Chân Tiên giới",
        "Kim Tiên vực", "Thái Ất Tiên vực", "Đại La cảnh", "Tiên phủ", "Thời Gian pháp tắc khu",
        "Không Gian pháp tắc khu", "Luân Hồi pháp tắc khu", "Hỗn Độn hư không"
    ]
};

console.log("=== THỐNG KÊ RÀ SOÁT ĐỊA ĐIỂM ===");

for (const [world, items] of Object.entries(checklist)) {
    console.log(`\n--- ${world} ---`);
    const missing = [];
    for (const item of items) {
        const itemLower = item.toLowerCase();
        // Check if any existing location name contains the checklist item or vice versa
        const found = locations.find(loc => {
            return loc.name.includes(itemLower) || itemLower.includes(loc.name) ||
                   (itemLower === "mộ lan nhân" && loc.name.includes("mộ lan")) ||
                   (itemLower === "đột ngột tộc" && loc.name.includes("đột ngột")) ||
                   (itemLower === "chân tiên giới" && loc.name.includes("chân tiên cảnh"));
        });
        
        if (!found) {
            missing.push(item);
        }
    }
    if (missing.length === 0) {
        console.log("✅ Đầy đủ 100%!");
    } else {
        console.log(`❌ Thiếu (${missing.length} địa điểm):`, missing);
    }
}
