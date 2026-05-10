export const ENERGY_TYPES = {
    "linh_khi": {
        id: "linh_khi",
        name: "Linh Khí",
        description: "Loại khí phổ biến nhất, là nền tảng tu luyện của đa số tu sĩ.",
        icon: "✨",
        subTypes: ["Kim", "Mộc", "Thủy", "Hỏa", "Thổ", "Lôi", "Băng", "Phong", "Độc"],
        stability: 1.0,
        danger: 0.0,
        uses: ["Tu luyện cơ bản", "Khôi phục linh lực", "Duy trì trận pháp", "Nuôi dưỡng linh thảo"],
        source: ["Linh mạch", "Linh nhãn", "Tụ linh trận", "Linh thạch"]
    },
    "ma_khi": {
        id: "ma_khi",
        name: "Ma Khí",
        description: "Năng lượng của ma đạo và tà tu. Cuồng bạo, dễ phản phệ.",
        icon: "🌑",
        stability: 0.4,
        danger: 0.7,
        pros: ["Tăng chiến lực cực nhanh", "Dễ đột phá", "Phù hợp cấm thuật"],
        cons: ["Sinh tâm ma", "Ăn mòn thần trí", "Dễ mất kiểm soát"],
        source: ["Ma vực", "Thi thể cổ", "Oán khí", "Huyết tế"]
    },
    "yeu_khi": {
        id: "yeu_khi",
        name: "Yêu Khí",
        description: "Khí tức của yêu thú và yêu tộc. Mang dã tính mạnh, chứa huyết mạch lực lượng.",
        icon: "🐾",
        stability: 0.6,
        danger: 0.3,
        uses: ["Luyện thể", "Bồi dưỡng linh thú", "Tu luyện yêu công"],
        source: ["Yêu thú", "Yêu đan", "Thập Vạn Đại Sơn"]
    },
    "hao_nhien_chinh_khi": {
        id: "hao_nhien_chinh_khi",
        name: "Hạo Nhiên Chính Khí",
        description: "Chính khí thiên địa, khắc chế ma khí, tà khí và oán khí.",
        icon: "☀️",
        stability: 1.5,
        danger: 0.0,
        uses: ["Trấn tà", "Thanh tâm", "Gia tăng chống tâm ma"],
        requirement: { realm: 10, description: "Đạo tâm mạnh, chính niệm" }
    },
    "han_khi": {
        id: "han_khi",
        name: "Hàn Khí",
        description: "Năng lượng cực hàn, có thể đóng băng linh lực và hủy hoại kinh mạch.",
        icon: "❄️",
        stability: 0.7,
        danger: 0.4,
        uses: ["Tu luyện băng hệ", "Luyện thể cực hàn", "Chế tạo hàn thuộc tính pháp bảo"],
        source: ["Hàn vực", "Băng cốc", "Thái âm bí cảnh"]
    },
    "viem_khi": {
        id: "viem_khi",
        name: "Viêm Khí / Hỏa Khí",
        description: "Năng lượng nóng cực mạnh, cuồng bạo và phá hủy.",
        icon: "🔥",
        stability: 0.5,
        danger: 0.5,
        uses: ["Luyện đan", "Luyện khí", "Hỏa hệ công pháp"],
        source: ["Núi lửa", "Địa hỏa mạch", "Dị hỏa"]
    },
    "loi_khi": {
        id: "loi_khi",
        name: "Lôi Khí",
        description: "Khí tức lôi đình thiên địa. Cuồng bạo cực mạnh, khó hấp thu.",
        icon: "⚡",
        stability: 0.3,
        danger: 0.8,
        uses: ["Luyện thể", "Độ kiếp", "Khắc chế tà vật"],
        requirement: { realm: 14, description: "Chiến lực cực mạnh mới có thể hấp thu" }
    },
    "kiem_khi": {
        id: "kiem_khi",
        name: "Kiếm Khí",
        description: "Khí tức riêng của kiếm tu, sắc bén và chuyên phá phòng ngự.",
        icon: "🗡️",
        stability: 0.8,
        danger: 0.2,
        uses: ["Dưỡng kiếm", "Tạo kiếm ý", "Hình thành kiếm vực"]
    },
    "hon_khi": {
        id: "hon_khi",
        name: "Hồn Khí / Thần Hồn Chi Lực",
        description: "Năng lượng liên quan thần thức và linh hồn.",
        icon: "🔮",
        stability: 0.9,
        danger: 0.4,
        uses: ["Hồn tu", "Huyễn thuật", "Điều khiển khôi lỗi", "Điều khiển pháp bảo"],
        risk: "Dễ bị phản phệ thần hồn"
    },
    "tu_khi": {
        id: "tu_khi",
        name: "Tử Khí",
        description: "Khí tức tử vong, ăn mòn sinh cơ.",
        icon: "💀",
        stability: 0.4,
        danger: 0.9,
        uses: ["Tu luyện tử đạo", "Thi triển nguyền rủa"],
        result: "Dễ tạo thi tu / quỷ tu"
    },
    "sinh_khi": {
        id: "sinh_khi",
        name: "Sinh Khí",
        description: "Khí tức sinh mệnh, hồi phục và trị liệu.",
        icon: "🌱",
        stability: 1.5,
        danger: 0.0,
        uses: ["Trị liệu", "Hồi phục", "Trồng linh dược"],
        valuation: "Rất được luyện đan sư coi trọng"
    },
    "khong_gian_chi_khi": {
        id: "khong_gian_chi_khi",
        name: "Không Gian Chi Khí",
        description: "Năng lượng không gian cực hiếm, rất khó khống chế.",
        icon: "🌀",
        stability: 0.2,
        danger: 0.9,
        uses: ["Thuấn di", "Không gian pháp bảo", "Không gian trận pháp"],
        requirement: { realm: 22, description: "Lĩnh ngộ không gian quy tắc" }
    },
    "thoi_gian_chi_khi": {
        id: "thoi_gian_chi_khi",
        name: "Thời Gian Chi Khí",
        description: "Lực lượng tối cao, rủi ro bị thiên đạo phản phệ rất lớn.",
        icon: "⏳",
        stability: 0.1,
        danger: 1.0,
        uses: ["Gia tốc thời gian", "Đình chỉ thời gian ngắn", "Kéo dài tuổi thọ"],
        requirement: { realm: 38, description: "Chạm tới thời gian pháp tắc" }
    },
    "hon_don_khi": {
        id: "hon_don_khi",
        name: "Hỗn Độn Khí",
        description: "Khí tức nguyên sơ, bao hàm vạn đạo, có thể diễn hóa mọi thuộc tính.",
        icon: "🌌",
        stability: 0.5,
        danger: 0.9,
        pros: ["Tu luyện cực mạnh", "Linh lực chất lượng cao nhất"],
        cons: ["Rất khó hấp thu", "Dễ nổ thân thể"],
        requirement: { realm: 30, description: "Đạo thể đặc biệt hoặc Đại năng cổ đại" }
    },
    "tien_khi": {
        id: "tien_khi",
        name: "Tiên Khí",
        description: "Năng lượng của Tiên Giới, chất lượng vượt xa linh khí.",
        icon: "💎",
        stability: 1.3,
        danger: 0.1,
        uses: ["Tu luyện tiên pháp", "Nuôi tiên khí", "Đột phá tiên cảnh"],
        note: "Nhân giới rất khó xuất hiện"
    },
    "hong_mong_tu_khi": {
        id: "hong_mong_tu_khi",
        name: "Hồng Mông Tử Khí",
        description: "Khí tức truyền thuyết tối cao, mang đạo vận thiên địa và thiên mệnh.",
        icon: "💜",
        stability: 2.0,
        danger: 0.0,
        uses: ["Thành đạo", "Lĩnh ngộ pháp tắc", "Tăng khí vận nghịch thiên"],
        rarity: "Truyền thuyết tối cao"
    }
};

export const QI_PURITY = {
    "TAP": { id: "tap", name: "Tạp Khí", multiplier: 0.5, description: "Chứa nhiều tạp chất." },
    "TINH_THUAN": { id: "tinh_thuan", name: "Tinh Thuần", multiplier: 1.0, description: "Dễ hấp thu." },
    "CUC_PHAM": { id: "cuc_pham", name: "Cực Phẩm", multiplier: 2.0, description: "Chất lượng cực cao." },
    "DAO": { id: "dao", name: "Đạo Khí", multiplier: 5.0, description: "Mang đạo vận." }
};

export const QI_CONFLICTS = [
    { type1: "han_khi", type2: "viem_khi", severity: 0.8 },
    { type1: "hao_nhien_chinh_khi", type2: "ma_khi", severity: 1.0 },
    { type1: "sinh_khi", type2: "tu_khi", severity: 0.9 },
    { type1: "loi_khi", type2: "tu_khi", severity: 0.7 },
    { type1: "hao_nhien_chinh_khi", type2: "tu_khi", severity: 0.8 },
    { type1: "loi_khi", type2: "ma_khi", severity: 0.6 }
];

export const getEnergyTypeById = (id) => ENERGY_TYPES[id];
