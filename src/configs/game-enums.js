const createQuality = (id, name, color, extra = {}) => ({
    id,
    name,
    color,
    ...extra,
    [Symbol.toPrimitive](hint) {
        return this.name;
    },
    toString() {
        return this.name;
    },
    includes(str) {
        return this.name.includes(str);
    }
});

export const PHAP_BAO_QUALITIES = {
    PHAM_KHI: createQuality('pham_khi', 'Phàm Khí', '#9E9E9E', { cssClass: 'pham-khi', bgClass: 'bg-gray-400', glowClass: '' }),
    PHAP_KHI: createQuality('phap_khi', 'Pháp Khí', '#4CAF50', { cssClass: 'phap-khi', bgClass: 'bg-green-500', glowClass: '' }),
    LINH_KHI: createQuality('linh_khi', 'Linh Khí', '#2196F3', { cssClass: 'linh-khi', bgClass: 'bg-blue-500', glowClass: '' }),
    PHAP_BAO: createQuality('phap_bao', 'Pháp Bảo', '#9C27B0', { cssClass: 'phap-bao', bgClass: 'bg-purple-500', glowClass: 'quality-purple-500' }),
    CO_BAO: createQuality('co_bao', 'Cổ Bảo', '#FF9800', { cssClass: 'co-bao', bgClass: 'bg-orange-500', glowClass: 'quality-orange-500' }),
    LINH_BAO: createQuality('linh_bao', 'Linh Bảo', '#F44336', { cssClass: 'linh-bao', bgClass: 'bg-red-500', glowClass: 'quality-red-500' }),
    THONG_THIEN_LINH_BAO: createQuality('thong_thien', 'Thông Thiên Linh Bảo', '#FF007F', { cssClass: 'thong-thien', bgClass: 'bg-cultivation-gold', glowClass: 'quality-cultivation-gold' }),
    HUYEN_THIEN_CHI_BAO: createQuality('huyen_thien', 'Huyền Thiên Chi Bảo', '#9400D3', { cssClass: 'danh-khi', bgClass: 'bg-purple-900', glowClass: '' }),
    TIEN_KHI: createQuality('tien_khi', 'Tiên Khí', '#00FFFF', { cssClass: 'tien-khi', bgClass: 'bg-cyan-400', glowClass: 'quality-cyan-400' }),
    DANH_KHI: createQuality('danh_khi', 'Danh Khí', '#FFD700', { cssClass: 'danh-khi', bgClass: 'bg-yellow-500', glowClass: '' })
};

export const DAN_DUOC_QUALITIES = {
    PHAM: createQuality('pham', 'Phàm Phẩm', '#9E9E9E', { cssClass: 'pham', bgClass: 'bg-gray-400', glowClass: '' }),
    HA_PHAM: createQuality('ha_pham', 'Hạ Phẩm', '#4CAF50', { cssClass: 'hoang', bgClass: 'bg-green-500', glowClass: '' }),
    TRUNG_PHAM: createQuality('trung_pham', 'Trung Phẩm', '#2196F3', { cssClass: 'huyen', bgClass: 'bg-blue-500', glowClass: '' }),
    THUONG_PHAM: createQuality('thuong_pham', 'Thượng Phẩm', '#9C27B0', { cssClass: 'dia', bgClass: 'bg-purple-500', glowClass: 'quality-purple-500' }),
    CUC_PHAM: createQuality('cuc_pham', 'Cực Phẩm', '#FF9800', { cssClass: 'thien', bgClass: 'bg-orange-500', glowClass: 'quality-orange-500' }),
    DAN_VAN: createQuality('dan_van', 'Đan Văn', '#F44336', { cssClass: 'linh-bao', bgClass: 'bg-red-500', glowClass: 'quality-red-500' }),
    DAN_BAO: createQuality('dan_bao', 'Đan Bảo', '#FFD700', { cssClass: 'than', bgClass: 'bg-cultivation-gold', glowClass: 'quality-cultivation-gold' }),
    TIEN_DAN: createQuality('tien_dan', 'Tiên Đan', '#00FFFF', { cssClass: 'tien', bgClass: 'bg-cyan-400', glowClass: 'quality-cyan-400' })
};

export const CONG_PHAP_QUALITIES = {
    PHAM_GIAI: createQuality('pham_giai', 'Phàm Giai', '#9E9E9E', { cssClass: 'pham-khi', bgClass: 'bg-gray-400', glowClass: '' }),
    HOANG_GIAI: createQuality('hoang_giai', 'Hoàng Giai', '#4CAF50', { cssClass: 'phap-khi', bgClass: 'bg-green-500', glowClass: '' }),
    HUYEN_GIAI: createQuality('huyen_giai', 'Huyền Giai', '#2196F3', { cssClass: 'linh-khi', bgClass: 'bg-blue-500', glowClass: '' }),
    DIA_GIAI: createQuality('dia_giai', 'Địa Giai', '#9C27B0', { cssClass: 'phap-bao', bgClass: 'bg-purple-500', glowClass: 'quality-purple-500' }),
    THIEN_GIAI: createQuality('thien_giai', 'Thiên Giai', '#FF9800', { cssClass: 'co-bao', bgClass: 'bg-orange-500', glowClass: 'quality-orange-500' }),
    LINH_GIAI: createQuality('linh_giai', 'Linh Giai', '#F44336', { cssClass: 'linh-bao', bgClass: 'bg-red-500', glowClass: 'quality-red-500' }),
    THANH_GIAI: createQuality('thanh_giai', 'Thánh Giai', '#FF007F', { cssClass: 'thong-thien', bgClass: 'bg-cultivation-gold', glowClass: 'quality-cultivation-gold' }),
    TIEN_GIAI: createQuality('tien_giai', 'Tiên Giai', '#00FFFF', { cssClass: 'tien-khi', bgClass: 'bg-cyan-400', glowClass: 'quality-cyan-400' }),
    DE_GIAI: createQuality('de_giai', 'Đế Giai', '#FFD700', { cssClass: 'danh-khi', bgClass: 'bg-yellow-500', glowClass: '' }),
    DAO_GIAI: createQuality('dao_giai', 'Đạo Giai', '#E0115F', { cssClass: 'danh-khi', bgClass: 'bg-rose-600', glowClass: '' })
};

export const DI_HOA_QUALITIES = {
    DI_HOA: createQuality('di_hoa', 'Dị Hỏa', '#FF9800', { cssClass: 'co-bao', bgClass: 'bg-orange-500', glowClass: 'quality-orange-500' }),
    PHAM_HOA: createQuality('pham_hoa', 'Phàm Hỏa', '#9E9E9E', { cssClass: 'pham-khi', bgClass: 'bg-gray-400', glowClass: '' }),
    LINH_HOA: createQuality('linh_hoa', 'Linh Hỏa', '#2196F3', { cssClass: 'linh-khi', bgClass: 'bg-blue-500', glowClass: '' }),
    DIA_HOA: createQuality('dia_hoa', 'Địa Hỏa', '#9C27B0', { cssClass: 'phap-bao', bgClass: 'bg-purple-500', glowClass: 'quality-purple-500' }),
    THIEN_HOA: createQuality('thien_hoa', 'Thiên Hỏa', '#FF3300', { cssClass: 'co-bao', bgClass: 'bg-orange-500', glowClass: 'quality-orange-500' }),
    THANH_HOA: createQuality('thanh_hoa', 'Thánh Hỏa', '#FF007F', { cssClass: 'thong-thien', bgClass: 'bg-cultivation-gold', glowClass: 'quality-cultivation-gold' }),
    TIEN_HOA: createQuality('tien_hoa', 'Tiên Hỏa', '#00FFFF', { cssClass: 'tien-khi', bgClass: 'bg-cyan-400', glowClass: 'quality-cyan-400' }),
    TIEN: createQuality('tien', 'Tiên', '#00FFFF', { cssClass: 'tien-khi', bgClass: 'bg-cyan-400', glowClass: 'quality-cyan-400' }),
    DAO_HOA: createQuality('dao_hoa', 'Đạo Hỏa', '#FFD700', { cssClass: 'danh-khi', bgClass: 'bg-yellow-500', glowClass: '' }),
    HONG_MONG_TO_HOA: createQuality('hong_mong', 'Hồng Mông Tổ Hỏa', '#E0115F', { cssClass: 'danh-khi', bgClass: 'bg-rose-600', glowClass: '' })
};

export const DI_LOI_QUALITIES = {
    PHAM_LOI: createQuality('pham_loi', 'Phàm Lôi', '#9E9E9E', { cssClass: 'pham-khi', bgClass: 'bg-gray-400', glowClass: '' }),
    LINH_LOI: createQuality('linh_loi', 'Linh Lôi', '#2196F3', { cssClass: 'linh-khi', bgClass: 'bg-blue-500', glowClass: '' }),
    DIA_LOI: createQuality('dia_loi', 'Địa Lôi', '#9C27B0', { cssClass: 'phap-bao', bgClass: 'bg-purple-500', glowClass: 'quality-purple-500' }),
    THIEN_LOI: createQuality('thien_loi', 'Thiên Lôi', '#FF9800', { cssClass: 'co-bao', bgClass: 'bg-orange-500', glowClass: 'quality-orange-500' }),
    THANH_LOI: createQuality('thanh_loi', 'Thánh Lôi', '#FF007F', { cssClass: 'thong-thien', bgClass: 'bg-cultivation-gold', glowClass: 'quality-cultivation-gold' }),
    TIEN_LOI: createQuality('tien_loi', 'Tiên Lôi', '#00FFFF', { cssClass: 'tien-khi', bgClass: 'bg-cyan-400', glowClass: 'quality-cyan-400' }),
    TIEN: createQuality('tien', 'Tiên', '#00FFFF', { cssClass: 'tien-khi', bgClass: 'bg-cyan-400', glowClass: 'quality-cyan-400' }),
    DAO_LOI: createQuality('dao_loi', 'Đạo Lôi', '#FFD700', { cssClass: 'danh-khi', bgClass: 'bg-yellow-500', glowClass: '' }),
    TO_LOI: createQuality('to_loi', 'Tổ Lôi', '#E0115F', { cssClass: 'danh-khi', bgClass: 'bg-rose-600', glowClass: '' })
};

export const LINH_THU_QUALITIES = {
    PHAM_HUYET: createQuality('pham_huyet', 'Phàm Huyết', '#9E9E9E', { cssClass: 'pham-khi', bgClass: 'bg-gray-400', glowClass: '' }),
    LINH_CAP: createQuality('linh_cap', 'Linh Cấp', '#2196F3', { cssClass: 'linh-khi', bgClass: 'bg-blue-500', glowClass: '' }),
    DIA_CAP: createQuality('dia_cap', 'Địa Cấp', '#9C27B0', { cssClass: 'phap-bao', bgClass: 'bg-purple-500', glowClass: 'quality-purple-500' }),
    THIEN_CAP: createQuality('thien_cap', 'Thiên Cấp', '#FF9800', { cssClass: 'co-bao', bgClass: 'bg-orange-500', glowClass: 'quality-orange-500' }),
    THANH_HUYET: createQuality('thanh_huyet', 'Thánh Huyết', '#FF007F', { cssClass: 'thong-thien', bgClass: 'bg-cultivation-gold', glowClass: 'quality-cultivation-gold' }),
    TIEN_HUYET: createQuality('tien_huyet', 'Tiên Huyết', '#00FFFF', { cssClass: 'tien-khi', bgClass: 'bg-cyan-400', glowClass: 'quality-cyan-400' }),
    THAN_HUYET: createQuality('than_huyet', 'Thần Huyết', '#FFD700', { cssClass: 'danh-khi', bgClass: 'bg-yellow-500', glowClass: '' })
};

export const ELEMENT_TYPES = {
    KIM: createQuality('kim', 'Kim', '#fcd34d', { bg: 'rgba(252, 211, 77, 0.1)', border: 'rgba(252, 211, 77, 0.25)', shadow: 'rgba(252, 211, 77, 0.15)' }),
    MOC: createQuality('moc', 'Mộc', '#4ade80', { bg: 'rgba(74, 222, 128, 0.1)', border: 'rgba(74, 222, 128, 0.25)', shadow: 'rgba(74, 222, 128, 0.15)' }),
    THUY: createQuality('thuy', 'Thủy', '#3b82f6', { bg: 'rgba(59, 130, 246, 0.1)', border: 'rgba(59, 130, 246, 0.25)', shadow: 'rgba(59, 130, 246, 0.15)' }),
    HOA: createQuality('hoa', 'Hỏa', '#ef4444', { bg: 'rgba(239, 68, 68, 0.1)', border: 'rgba(239, 68, 68, 0.25)', shadow: 'rgba(239, 68, 68, 0.15)' }),
    THO: createQuality('tho', 'Thổ', '#d97706', { bg: 'rgba(217, 119, 6, 0.1)', border: 'rgba(217, 119, 6, 0.25)', shadow: 'rgba(217, 119, 6, 0.15)' }),
    LOI: createQuality('loi', 'Lôi', '#a855f7', { bg: 'rgba(168, 85, 247, 0.1)', border: 'rgba(168, 85, 247, 0.25)', shadow: 'rgba(168, 85, 247, 0.15)' }),
    BANG: createQuality('bang', 'Băng', '#06b6d4', { bg: 'rgba(6, 182, 212, 0.1)', border: 'rgba(6, 182, 212, 0.25)', shadow: 'rgba(6, 182, 212, 0.15)' }),
    PHONG: createQuality('phong', 'Phong', '#94a3b8', { bg: 'rgba(148, 163, 184, 0.1)', border: 'rgba(148, 163, 184, 0.25)', shadow: 'rgba(148, 163, 184, 0.15)' }),
    DOC: createQuality('doc', 'Độc', '#10b981', { bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.25)', shadow: 'rgba(16, 185, 129, 0.15)' }),
    QUANG: createQuality('quang', 'Quang', '#FFFDE7'),
    AM: createQuality('am', 'Ám', '#212121'),
    YIN: createQuality('yin', 'Âm', '#78909C'),
    HUYET: createQuality('huyet', 'Huyết', '#B71C1C'),
    DUONG: createQuality('duong', 'Dương', '#FF8F00'),
    THAI_AM: createQuality('thai_am', 'Thái Âm', '#37474F'),
    NEUTRAL: createQuality('neutral', 'Neutral', '#9E9E9E'),
    TAP: createQuality('tap', 'Tạp', '#757575')
};

export const QUALITY_TYPES = {
    PHAM_PHAM: 'Phàm Phẩm',
    HA_PHAM: 'Hạ Phẩm',
    TRUNG_PHAM: 'Trung Phẩm',
    THUONG_PHAM: 'Thượng Phẩm',
    CUC_PHAM: 'Cực Phẩm',
    HOAN_MY: 'Hoàn Mỹ',
    TIEN_PHAM: 'Tiên Phẩm'
};

export const NPC_PERSONALITIES_KEYS = {
    LANH_LUNG: 'lanh_lung',
    CHINH_TRUC: 'chinh_truc',
    THAM_LAM: 'tham_lam',
    KIEU_NGAO: 'kieu_ngao',
    DIEN_CUONG: 'dien_cuong',
    DA_NGHI: 'da_nghi',
    TRUNG_THANH: 'trung_thanh',
    HOA_NHA: 'hoa_nha',
    QUY_QUYET: 'quy_quyet'
};

export const NPC_GOALS_KEYS = {
    BAO_THU: 'bao_thu',
    THANH_TIEN: 'thanh_tien',
    TIM_TRUYEN_THUA: 'tim_truyen_thua',
    CHAN_HUNG_TON_MON: 'chan_hung_tong_mon',
    TIM_DAO_LU: 'tim_dao_lu'
};

export const BEAST_BLOODLINES = {
    PHAM: createQuality('pham', 'PHAM', '#9E9E9E', { cssClass: 'pham' }),
    LINH: createQuality('linh', 'LINH', '#2196F3', { cssClass: 'linh-khi' }),
    DIA: createQuality('dia', 'DIA', '#9C27B0', { cssClass: 'phap-bao' }),
    THIEN: createQuality('thien', 'THIEN', '#FF9800', { cssClass: 'co-bao' }),
    THANH: createQuality('thanh', 'THANH', '#FF007F', { cssClass: 'thong-thien' }),
    TIEN: createQuality('tien', 'TIEN', '#00FFFF', { cssClass: 'tien-khi' }),
    THAN: createQuality('than', 'THAN', '#FFD700', { cssClass: 'danh-khi' })
};

export const LINH_THE_RARITIES = {
    THAN_THOAI: createQuality('than_thoai', 'Thần Thoại', '#E0115F', { cssClass: 'danh-khi' }),
    THAN: createQuality('than', 'Thần', '#FFD700', { cssClass: 'danh-khi' }),
    TIEN: createQuality('tien', 'Tiên', '#00FFFF', { cssClass: 'tien-khi' }),
    THIEN: createQuality('thien', 'Thiên', '#FF9800', { cssClass: 'co-bao' }),
    DIA: createQuality('dia', 'Địa', '#9C27B0', { cssClass: 'phap-bao' })
};

export const STATUS_EFFECT_CATEGORIES = {
    BUFF: createQuality('BUFF', 'Tăng Cường', '#10B981', { borderClass: 'border-cyan-500/30', bgClass: 'bg-cyan-500/10', textClass: 'text-cyan-400', shadowClass: 'shadow-[0_0_8px_rgba(6,182,212,0.2)]' }),
    DEBUFF: createQuality('DEBUFF', 'Suy Yếu', '#EF4444', { borderClass: 'border-red-500/30', bgClass: 'bg-red-500/10', textClass: 'text-red-400', shadowClass: 'shadow-[0_0_8px_rgba(239,68,68,0.2)]' }),
    BODY: createQuality('BODY', 'Thể Chất', '#F59E0B', { borderClass: 'border-yellow-600/30', bgClass: 'bg-yellow-600/10', textClass: 'text-yellow-500', shadowClass: 'shadow-[0_0_8px_rgba(217,119,6,0.2)]' }),
    SOUL: createQuality('SOUL', 'Thần Hồn', '#8B5CF6', { borderClass: 'border-purple-500/30', bgClass: 'bg-purple-500/10', textClass: 'text-purple-400', shadowClass: 'shadow-[0_0_8px_rgba(168,85,247,0.2)]' }),
    QI: createQuality('QI', 'Nguyên Khí', '#EC4899', { borderClass: 'border-orange-500/30', bgClass: 'bg-orange-500/10', textClass: 'text-orange-400', shadowClass: 'shadow-[0_0_8px_rgba(249,115,22,0.2)]' }),
    ELEMENTAL: createQuality('ELEMENTAL', 'Ngũ Hành', '#3B82F6', { borderClass: 'border-green-500/30', bgClass: 'bg-green-500/10', textClass: 'text-green-400', shadowClass: 'shadow-[0_0_8px_rgba(34,197,94,0.2)]' }),
    CONTROL: createQuality('CONTROL', 'Khống Chế', '#6B7280', { borderClass: 'border-amber-500/30', bgClass: 'bg-amber-500/10', textClass: 'text-amber-400', shadowClass: 'shadow-[0_0_8px_rgba(245,158,11,0.2)]' }),
    TRIBULATION: createQuality('TRIBULATION', 'Thiên Kiếp', '#EF4444', { borderClass: 'border-purple-600/40 bg-purple-950/20 text-purple-300 animate-pulse border-double', bgClass: '', textClass: '', shadowClass: 'shadow-[0_0_12px_rgba(147,51,234,0.4)]' })
};

export const SPIRIT_STONE_GRADES = {
    HA: createQuality('HA', 'Hạ Phẩm Linh Thạch', '#4fd1c5', { shortName: 'Hạ', value: 1, multiplier: 1, nextGrade: 'TRUNG', cssClass: 'text-qi-blue' }),
    TRUNG: createQuality('TRUNG', 'Trung Phẩm Linh Thạch', '#a855f7', { shortName: 'Trung', value: 100, multiplier: 100, nextGrade: 'THUONG', cssClass: 'text-qi-purple' }),
    THUONG: createQuality('THUONG', 'Thượng Phẩm Linh Thạch', '#f6ad55', { shortName: 'Thượng', value: 10000, multiplier: 10000, nextGrade: 'CUC', cssClass: 'text-cultivation-gold' }),
    CUC: createQuality('CUC', 'Cực Phẩm Linh Thạch', '#f472b6', { shortName: 'Cực', value: 1000000, multiplier: 1000000, nextGrade: 'TIEN', cssClass: 'text-pink-400' }),
    TIEN: createQuality('TIEN', 'Tiên Tinh', '#10b981', { shortName: 'Tiên', value: 100000000, multiplier: 100000000, nextGrade: 'HON_DON', cssClass: 'text-emerald-400' }),
    HON_DON: createQuality('HON_DON', 'Hỗn Độn Tinh', '#6366f1', { shortName: 'Hỗn', value: 10000000000, multiplier: 10000000000, nextGrade: 'HONG_MONG', cssClass: 'text-indigo-400' }),
    HONG_MONG: createQuality('HONG_MONG', 'Hồng Mông Linh Tinh', '#a855f7', { shortName: 'Hồng', value: 1000000000000, multiplier: 1000000000000, nextGrade: null, cssClass: 'text-purple-500' })
};

export const SPIRIT_STONE_QUALITIES = {
    TAP: createQuality('TAP', 'Tạp Chất', '#9ca3af', { multiplier: 0.5, cssClass: 'pham' }),
    BINH_THUONG: createQuality('BINH_THUONG', 'Bình Thường', '#ffffff', { multiplier: 1.0, cssClass: 'pham' }),
    TINH_THUAN: createQuality('TINH_THUAN', 'Tinh Thuần', '#60a5fa', { multiplier: 2.0, cssClass: 'huyen' }),
    HOAN_MY: createQuality('HOAN_MY', 'Hoàn Mỹ', '#fbbf24', { multiplier: 5.0, cssClass: 'thien' })
};

export const PUPPET_GRADES = {
    PHAM: createQuality('PHAM', 'Phàm Cấp', '#9ca3af', { multiplier: 1, cssClass: 'pham' }),
    LINH: createQuality('LINH', 'Linh Cấp', '#2196F3', { multiplier: 2, cssClass: 'linh-khi' }),
    HUYEN: createQuality('HUYEN', 'Huyền Cấp', '#9C27B0', { multiplier: 4, cssClass: 'huyen' }),
    DIA: createQuality('DIA', 'Địa Cấp', '#FF9800', { multiplier: 8, cssClass: 'dia' }),
    THIEN: createQuality('THIEN', 'Thiên Cấp', '#F44336', { multiplier: 15, cssClass: 'thien' }),
    THANH: createQuality('THANH', 'Thánh Cấp', '#FF007F', { multiplier: 30, cssClass: 'thong-thien' }),
    TIEN: createQuality('TIEN', 'Tiên Cấp', '#00FFFF', { multiplier: 100, cssClass: 'tien-khi' })
};

export const PUPPET_TYPES = {
    COMBAT: createQuality('COMBAT', 'Chiến Đấu', '#F44336', { icon: '⚔️' }),
    GUARD: createQuality('GUARD', 'Hộ Vệ', '#2196F3', { icon: '🛡️' }),
    ALCHEMY: createQuality('ALCHEMY', 'Luyện Đan', '#4CAF50', { icon: '🧪' }),
    MINING: createQuality('MINING', 'Khai Khoáng', '#FF9800', { icon: '⛏️' }),
    SCOUT: createQuality('SCOUT', 'Trinh Sát', '#9C27B0', { icon: '👁️' }),
    SMITHING: createQuality('SMITHING', 'Luyện Khí', '#795548', { icon: '⚒️' }),
    FLIGHT: createQuality('FLIGHT', 'Phi Hành', '#00FFFF', { icon: '🦅' }),
    WAR: createQuality('WAR', 'Chiến Tranh', '#E91E63', { icon: '🏯' })
};

export const BEAST_TYPES = {
    LINH_TRUNG: createQuality('LINH_TRUNG', 'Linh Trùng', '#4CAF50'),
    KY_TRUNG: createQuality('KY_TRUNG', 'Kỳ Trùng', '#9C27B0'),
    LINH_THU: createQuality('LINH_THU', 'Linh Thú', '#2196F3'),
    DI_THU: createQuality('DI_THU', 'Dị Thú', '#FF9800'),
    THAN_THU: createQuality('THAN_THU', 'Thần Thú', '#F44336')
};

export const ROOT_QUALITIES = {
    'Tạp': createQuality('tap', 'Tạp', '#9ca3af', { multiplier: 0.5, cssClass: 'pham' }),
    'Hạ phẩm': createQuality('ha_pham', 'Hạ phẩm', '#4ade80', { multiplier: 0.8, cssClass: 'pham' }),
    'Trung phẩm': createQuality('trung_pham', 'Trung phẩm', '#3b82f6', { multiplier: 1.2, cssClass: 'hoang' }),
    'Thượng phẩm': createQuality('thuong_pham', 'Thượng phẩm', '#a855f7', { multiplier: 1.8, cssClass: 'huyen' }),
    'Địa': createQuality('dia', 'Địa', '#f59e0b', { multiplier: 2.5, cssClass: 'dia' }),
    'Thiên': createQuality('thien', 'Thiên', '#ec4899', { multiplier: 4.0, cssClass: 'thien' }),
    'Tiên': createQuality('tien', 'Tiên', '#ef4444', { multiplier: 7.0, cssClass: 'tien' })
};

export const MORALITY_SCALES = {
    DAI_THIEN: createQuality('dai_thien', 'Đại Thiện', '#34d399', { min: 800, max: 1000, description: 'Tâm hoài chúng sinh, được thiên đạo che chở.' }),
    THIEN: createQuality('thien', 'Thiên', '#10b981', { min: 300, max: 800, description: 'Hành hiệp trượng nghĩa, là tấm gương sáng.' }),
    TRUNG_LAP: createQuality('trung_lap', 'Trung Lập', '#94a3b8', { min: -300, max: 300, description: 'Tâm không vướng bận, tùy tâm sở dục.' }),
    AC: createQuality('ac', 'Ác', '#f43f5e', { min: -800, max: -300, description: 'Sát nghiệp quấn thân, người người căm phẫn.' }),
    DAI_AC: createQuality('dai_ac', 'Đại Ác', '#e11d48', { min: -1000, max: -800, description: 'Tội ác tày trời, thiên địa không dung.' }),
    MA_DAU: createQuality('ma_dau', 'Ma Đầu', '#9f1239', { min: -Infinity, max: -1000, description: 'Tuyệt diệt nhân tính, hóa thân thành ma.' })
};

export const KARMA_TYPES = {
    THIEN_DUYEN: createQuality('THIEN_DUYEN', 'Thiện Duyên', '#10b981'),
    AC_DUYEN: createQuality('AC_DUYEN', 'Ác Duyên', '#f43f5e'),
    SU_DO: createQuality('SU_DO', 'Sư Đồ Nhân Quả', '#6366f1'),
    DAO_LU: createQuality('DAO_LU', 'Đạo Lữ Nhân Quả', '#fbcfe8'),
    HUYET_CUU: createQuality('HUYET_CUU', 'Huyết Cừu Nhân Quả', '#be123c'),
    TRUYEN_THUA: createQuality('TRUYEN_THUA', 'Truyền Thừa Nhân Quả', '#fbbf24'),
    THIEN_DAO: createQuality('THIEN_DAO', 'Thiên Đạo Nhân Quả', '#0ea5e9')
};

export const ITEM_TYPES_METADATA = {
    linh_thach: createQuality('linh_thach', 'Linh Thạch', '#9E9E9E'),
    dan_duoc: createQuality('dan_duoc', 'Linh Đan / Thánh Quả', '#9E9E9E'),
    sach_cong_phap: createQuality('sach_cong_phap', 'Công Pháp / Thần Thông', '#9E9E9E'),
    weapon: createQuality('weapon', 'Binh Khí', '#9E9E9E', { alternativeName: 'Pháp Bảo / Thần Binh' }),
    armor: createQuality('armor', 'Phòng Giáp', '#9E9E9E', { alternativeName: 'Pháp Y / Bảo Giáp' }),
    accessory: createQuality('accessory', 'Trang Sức', '#9E9E9E', { alternativeName: 'Linh Sức / Trang Sức' }),
    treasure: createQuality('treasure', 'Thiên Tài Địa Bảo', '#9E9E9E'),
    formation: createQuality('formation', 'Trận Đồ', '#9E9E9E'),
    puppet: createQuality('puppet', 'Cơ Quan / Khôi Lỗi', '#9E9E9E'),
    phap_bao_cong: createQuality('phap_bao_cong', 'Chủ Chiến', '#FF9800', { alternativeName: 'Pháp Bảo Chủ Chiến' }),
    phap_bao_thu: createQuality('phap_bao_thu', 'Hộ Thân', '#2196F3', { alternativeName: 'Pháp Bảo Hộ Thân' }),
    phap_bao_phi_hanh: createQuality('phap_bao_phi_hanh', 'Phi Hành', '#00FFFF', { alternativeName: 'Phi Hành Pháp Bảo' }),
    spaceArtifact: createQuality('spaceArtifact', 'Càn Khôn Pháp Bảo', '#9C27B0'),
    phap_bao_khong_gian: createQuality('phap_bao_khong_gian', 'Không Gian', '#9C27B0', { alternativeName: 'Không Gian Pháp Bảo' }),
    phap_bao_tran: createQuality('phap_bao_tran', 'Trận Đạo', '#FF5722', { alternativeName: 'Trận Đạo Pháp Bảo' }),
    phap_bao_phu_tro: createQuality('phap_bao_phu_tro', 'Phụ Trợ', '#4CAF50', { alternativeName: 'Phụ Trợ Pháp Bảo' }),
    phap_bao_hon: createQuality('phap_bao_hon', 'Hồn Đạo', '#E91E63', { alternativeName: 'Hồn Đạo Pháp Bảo' }),
    nguyen_lieu: createQuality('nguyen_lieu', 'Linh Vật / Tài Nguyên', '#9E9E9E'),
    linh_chung: createQuality('linh_chung', 'Linh Chủng', '#9E9E9E'),
    head: createQuality('head', 'Mão/Đỉnh', '#9E9E9E'),
    shoes: createQuality('shoes', 'Hài/Bộ', '#9E9E9E'),
    necklace: createQuality('necklace', 'Anh Lạc', '#9E9E9E')
};

export const GAME_STATS = {
    atk: createQuality('atk', 'Công Kích', '#9E9E9E'),
    def: createQuality('def', 'Phòng Thủ', '#9E9E9E'),
    spd: createQuality('spd', 'Tốc Độ', '#9E9E9E'),
    hp: createQuality('hp', 'Khí Huyết', '#9E9E9E'),
    maxHp: createQuality('maxHp', 'Khí Huyết Tăng', '#9E9E9E'),
    mana: createQuality('mana', 'Linh Lực', '#9E9E9E'),
    maxMana: createQuality('maxMana', 'Linh Lực Tăng', '#9E9E9E'),
    tuViSpeed: createQuality('tuViSpeed', 'Tốc Độ Tu Luyện', '#9E9E9E'),
    tvps: createQuality('tvps', 'Tốc Độ Tu Luyện', '#9E9E9E'),
    tu_vi_speed: createQuality('tu_vi_speed', 'Tốc Độ Tu Luyện', '#9E9E9E'),
    soulExpSpeed: createQuality('soulExpSpeed', 'Tốc Độ Thần Thức', '#9E9E9E'),
    spirit: createQuality('spirit', 'Thần Thức', '#9E9E9E'),
    critRate: createQuality('critRate', 'Tỷ Lệ Bạo Kích', '#9E9E9E'),
    critChance: createQuality('critChance', 'Tỉ Lệ Bạo Kích', '#9E9E9E'),
    critDamage: createQuality('critDamage', 'Sát Thương Bạo Kích', '#9E9E9E'),
    pierce: createQuality('pierce', 'Xuyên Thấu', '#9E9E9E'),
    slots: createQuality('slots', 'Ô Chứa Đồ', '#9E9E9E'),
    formationPower: createQuality('formationPower', 'Trận Pháp Uy Lực', '#9E9E9E'),
    soulRepress: createQuality('soulRepress', 'Thần Hồn Áp Chế', '#9E9E9E'),
    costMana: createQuality('costMana', 'Tiêu Hao Linh Lực', '#9E9E9E'),
    dodge: createQuality('dodge', 'Né Tránh', '#9E9E9E'),
    karma: createQuality('karma', 'Khí Vận/Nghiệp Lực', '#9E9E9E'),
    maxAge: createQuality('maxAge', 'Thọ Nguyên Thêm', '#9E9E9E'),
    allRes: createQuality('allRes', 'Kháng Tất Cả', '#9E9E9E'),
    luck: createQuality('luck', 'Khí Vận', '#9E9E9E'),
    lifespan: createQuality('lifespan', 'Thọ Nguyên', '#9E9E9E'),
    life_span: createQuality('life_span', 'Thọ Nguyên', '#9E9E9E'),
    qiAbsorb: createQuality('qiAbsorb', 'Hấp Thụ Linh Khí', '#9E9E9E'),
    qi_absorb: createQuality('qi_absorb', 'Hấp Thụ Linh Khí', '#9E9E9E'),
    alchemyBonus: createQuality('alchemyBonus', 'Tỉ Lệ Luyện Đan', '#9E9E9E'),
    alchemy_success: createQuality('alchemy_success', 'Tỉ Lệ Luyện Đan', '#9E9E9E'),
    smithingBonus: createQuality('smithingBonus', 'Tỉ Lệ Luyện Khí', '#9E9E9E'),
    smithing_success: createQuality('smithing_success', 'Tỉ Lệ Luyện Khí', '#9E9E9E'),
    breakthroughRate: createQuality('breakthroughRate', 'Tỉ Lệ Đột Phá', '#9E9E9E'),
    breakthrough_rate: createQuality('breakthrough_rate', 'Tỉ Lệ Đột Phá', '#9E9E9E'),
    coldRes: createQuality('coldRes', 'Băng Kháng', '#9E9E9E'),
    thunderRes: createQuality('thunderRes', 'Lôi Kháng', '#9E9E9E'),
    fireRes: createQuality('fireRes', 'Hỏa Kháng', '#9E9E9E'),
    poisonRes: createQuality('poisonRes', 'Độc Kháng', '#9E9E9E'),
    spiritRoot: createQuality('spiritRoot', 'Cải Tạo Linh Căn', '#9E9E9E'),
    stamina: createQuality('stamina', 'Thể Lực', '#9E9E9E'),
    alchemySuccess: createQuality('alchemySuccess', 'Tỉ Lệ Luyện Đan', '#9E9E9E'),
    bodyExpSpeed: createQuality('bodyExpSpeed', 'Tốc Độ Luyện Thể', '#9E9E9E'),
    critDmg: createQuality('critDmg', 'Sát Thương Bạo Kích', '#9E9E9E'),
    lifeSteal: createQuality('lifeSteal', 'Hút Máu', '#9E9E9E'),
    soulPierce: createQuality('soulPierce', 'Thần Hồn Xuyên Thấu', '#9E9E9E'),
    daoVun: createQuality('daoVun', 'Đạo Vận', '#9E9E9E'),
    murderQi: createQuality('murderQi', 'Sát Khí', '#9E9E9E'),
    fireDmg: createQuality('fireDmg', 'Sát Thương Hỏa', '#9E9E9E'),
    waterDmg: createQuality('waterDmg', 'Sát Thương Thủy', '#9E9E9E'),
    thunderDmg: createQuality('thunderDmg', 'Sát Thương Lôi', '#9E9E9E'),
    spdPercent: createQuality('spdPercent', 'Tốc Độ (%)', '#9E9E9E'),
    avoidRate: createQuality('avoidRate', 'Né Tránh', '#9E9E9E'),
    techniqueMastery: createQuality('techniqueMastery', 'Lĩnh Ngộ Công Pháp', '#9E9E9E'),
    breakthroughChance: createQuality('breakthroughChance', 'Tỉ Lệ Đột Phá', '#9E9E9E'),
    comprehension: createQuality('comprehension', 'Ngộ Tính', '#9E9E9E'),
    daoTam: createQuality('daoTam', 'Đạo Tâm', '#9E9E9E'),
    divineSense: createQuality('divineSense', 'Thần Thức', '#9E9E9E'),
    physique: createQuality('physique', 'Căn Cốt', '#9E9E9E')
};

export const RACE_VISUALS = {
    HUMAN: { icon: '👨‍👩‍👧‍👦', color: '#60a5fa' },
    DEMON: { icon: '👿', color: '#ef4444' },
    YAO: { icon: '🦊', color: '#34d399' },
    SPIRIT_BEAST: { icon: '🦊', color: '#34d399' },
    DRAGON: { icon: '🐲', color: '#fbbf24' }
};
