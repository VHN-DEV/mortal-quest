const createQuality = (id, name, color, extra = {}) => {
    const quality = {
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
        },
        is(value) {
            if (!value) return false;
            if (typeof value === 'object') {
                return value.id === this.id || value.name === this.name;
            }
            const valStr = String(value).toLowerCase();
            return this.id.toLowerCase() === valStr || this.name.toLowerCase() === valStr;
        }
    };
    return Object.freeze(quality);
};

export const PHAP_BAO_QUALITIES = Object.freeze({
    PHAM_KHI: createQuality('pham_khi', 'Phàm Khí', '#9E9E9E', { sortOrder: 1, cssClass: 'pham-khi', bgClass: 'bg-gray-400', glowClass: '', filterClass: 'text-gray-400 border-gray-500/20 bg-gray-500/5' }),
    PHAP_KHI: createQuality('phap_khi', 'Pháp Khí', '#4CAF50', { sortOrder: 2, cssClass: 'phap-khi', bgClass: 'bg-green-500', glowClass: '', filterClass: 'text-green-400 border-green-500/20 bg-green-500/5' }),
    LINH_KHI: createQuality('linh_khi', 'Linh Khí', '#2196F3', { sortOrder: 3, cssClass: 'linh-khi', bgClass: 'bg-blue-500', glowClass: '', filterClass: 'text-qi-blue border-qi-blue/20 bg-qi-blue/5' }),
    PHAP_BAO: createQuality('phap_bao', 'Pháp Bảo', '#9C27B0', { sortOrder: 4, cssClass: 'phap-bao', bgClass: 'bg-purple-500', glowClass: 'quality-purple-500', filterClass: 'text-purple-400 border-purple-500/20 bg-purple-500/5' }),
    CO_BAO: createQuality('co_bao', 'Cổ Bảo', '#FF9800', { sortOrder: 5, cssClass: 'co-bao', bgClass: 'bg-orange-500', glowClass: 'quality-orange-500', filterClass: 'text-orange-400 border-orange-500/20 bg-orange-500/5' }),
    LINH_BAO: createQuality('linh_bao', 'Linh Bảo', '#F44336', { sortOrder: 6, cssClass: 'linh-bao', bgClass: 'bg-red-500', glowClass: 'quality-red-500', filterClass: 'text-red-400 border-red-500/20 bg-red-500/5' }),
    THONG_THIEN_LINH_BAO: createQuality('thong_thien', 'Thông Thiên Linh Bảo', '#FF007F', { sortOrder: 7, cssClass: 'thong-thien', bgClass: 'bg-cultivation-gold', glowClass: 'quality-cultivation-gold', filterClass: 'text-cultivation-gold border-cultivation-gold/20 bg-cultivation-gold/5 font-bold shimmer-gold' }),
    HUYEN_THIEN_CHI_BAO: createQuality('huyen_thien', 'Huyền Thiên Chi Bảo', '#9400D3', { sortOrder: 8, cssClass: 'danh-khi', bgClass: 'bg-purple-900', glowClass: '', filterClass: 'text-purple-300 border-purple-900/30 bg-purple-950/25 font-bold' }),
    TIEN_KHI: createQuality('tien_khi', 'Tiên Khí', '#00FFFF', { sortOrder: 9, cssClass: 'tien-khi', bgClass: 'bg-cyan-400', glowClass: 'quality-cyan-400', filterClass: 'text-pink-400 border-pink-500/20 bg-pink-500/5' }),
    DANH_KHI: createQuality('danh_khi', 'Danh Khí', '#FFD700', { sortOrder: 10, cssClass: 'danh-khi', bgClass: 'bg-yellow-500', glowClass: '', filterClass: 'text-yellow-400 border-yellow-500/20 bg-yellow-500/5 font-bold' })
});

export const DAN_DUOC_QUALITIES = Object.freeze({
    PHAM: createQuality('pham', 'Phàm Phẩm', '#9E9E9E', { sortOrder: 1, cssClass: 'pham', bgClass: 'bg-gray-400', glowClass: '' }),
    HA_PHAM: createQuality('ha_pham', 'Hạ Phẩm', '#4CAF50', { sortOrder: 2, cssClass: 'hoang', bgClass: 'bg-green-500', glowClass: '' }),
    TRUNG_PHAM: createQuality('trung_pham', 'Trung Phẩm', '#2196F3', { sortOrder: 3, cssClass: 'huyen', bgClass: 'bg-blue-500', glowClass: '' }),
    THUONG_PHAM: createQuality('thuong_pham', 'Thượng Phẩm', '#9C27B0', { sortOrder: 4, cssClass: 'dia', bgClass: 'bg-purple-500', glowClass: 'quality-purple-500' }),
    CUC_PHAM: createQuality('cuc_pham', 'Cực Phẩm', '#FF9800', { sortOrder: 5, cssClass: 'thien', bgClass: 'bg-orange-500', glowClass: 'quality-orange-500' }),
    DAN_VAN: createQuality('dan_van', 'Đan Văn', '#F44336', { sortOrder: 6, cssClass: 'linh-bao', bgClass: 'bg-red-500', glowClass: 'quality-red-500' }),
    DAN_BAO: createQuality('dan_bao', 'Đan Bảo', '#FFD700', { sortOrder: 7, cssClass: 'than', bgClass: 'bg-cultivation-gold', glowClass: 'quality-cultivation-gold' }),
    TIEN_DAN: createQuality('tien_dan', 'Tiên Đan', '#00FFFF', { sortOrder: 8, cssClass: 'tien', bgClass: 'bg-cyan-400', glowClass: 'quality-cyan-400' })
});

export const CONG_PHAP_QUALITIES = Object.freeze({
    PHAM_GIAI: createQuality('pham_giai', 'Phàm Giai', '#9E9E9E', { sortOrder: 1, cssClass: 'pham-khi', bgClass: 'bg-gray-400', glowClass: '' }),
    HOANG_GIAI: createQuality('hoang_giai', 'Hoàng Giai', '#4CAF50', { sortOrder: 2, cssClass: 'phap-khi', bgClass: 'bg-green-500', glowClass: '' }),
    HUYEN_GIAI: createQuality('huyen_giai', 'Huyền Giai', '#2196F3', { sortOrder: 3, cssClass: 'linh-khi', bgClass: 'bg-blue-500', glowClass: '' }),
    DIA_GIAI: createQuality('dia_giai', 'Địa Giai', '#9C27B0', { sortOrder: 4, cssClass: 'phap-bao', bgClass: 'bg-purple-500', glowClass: 'quality-purple-500' }),
    THIEN_GIAI: createQuality('thien_giai', 'Thiên Giai', '#FF9800', { sortOrder: 5, cssClass: 'co-bao', bgClass: 'bg-orange-500', glowClass: 'quality-orange-500' }),
    LINH_GIAI: createQuality('linh_giai', 'Linh Giai', '#F44336', { sortOrder: 6, cssClass: 'linh-bao', bgClass: 'bg-red-500', glowClass: 'quality-red-500' }),
    THANH_GIAI: createQuality('thanh_giai', 'Thánh Giai', '#FF007F', { sortOrder: 7, cssClass: 'thong-thien', bgClass: 'bg-cultivation-gold', glowClass: 'quality-cultivation-gold' }),
    TIEN_GIAI: createQuality('tien_giai', 'Tiên Giai', '#00FFFF', { sortOrder: 8, cssClass: 'tien-khi', bgClass: 'bg-cyan-400', glowClass: 'quality-cyan-400' }),
    DE_GIAI: createQuality('de_giai', 'Đế Giai', '#FFD700', { sortOrder: 9, cssClass: 'danh-khi', bgClass: 'bg-yellow-500', glowClass: '' }),
    DAO_GIAI: createQuality('dao_giai', 'Đạo Giai', '#E0115F', { sortOrder: 10, cssClass: 'danh-khi', bgClass: 'bg-rose-600', glowClass: '' })
});

export const DI_HOA_QUALITIES = Object.freeze({
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
});

export const DI_LOI_QUALITIES = Object.freeze({
    PHAM_LOI: createQuality('pham_loi', 'Phàm Lôi', '#9E9E9E', { cssClass: 'pham-khi', bgClass: 'bg-gray-400', glowClass: '' }),
    LINH_LOI: createQuality('linh_loi', 'Linh Lôi', '#2196F3', { cssClass: 'linh-khi', bgClass: 'bg-blue-500', glowClass: '' }),
    DIA_LOI: createQuality('dia_loi', 'Địa Lôi', '#9C27B0', { cssClass: 'phap-bao', bgClass: 'bg-purple-500', glowClass: 'quality-purple-500' }),
    THIEN_LOI: createQuality('thien_loi', 'Thiên Lôi', '#FF9800', { cssClass: 'co-bao', bgClass: 'bg-orange-500', glowClass: 'quality-orange-500' }),
    THANH_LOI: createQuality('thanh_loi', 'Thánh Lôi', '#FF007F', { cssClass: 'thong-thien', bgClass: 'bg-cultivation-gold', glowClass: 'quality-cultivation-gold' }),
    TIEN_LOI: createQuality('tien_loi', 'Tiên Lôi', '#00FFFF', { cssClass: 'tien-khi', bgClass: 'bg-cyan-400', glowClass: 'quality-cyan-400' }),
    TIEN: createQuality('tien', 'Tiên', '#00FFFF', { cssClass: 'tien-khi', bgClass: 'bg-cyan-400', glowClass: 'quality-cyan-400' }),
    DAO_LOI: createQuality('dao_loi', 'Đạo Lôi', '#FFD700', { cssClass: 'danh-khi', bgClass: 'bg-yellow-500', glowClass: '' }),
    TO_LOI: createQuality('to_loi', 'Tổ Lôi', '#E0115F', { cssClass: 'danh-khi', bgClass: 'bg-rose-600', glowClass: '' })
});

export const LINH_THU_QUALITIES = Object.freeze({
    PHAM_HUYET: createQuality('pham_huyet', 'Phàm Huyết', '#9E9E9E', { cssClass: 'pham-khi', bgClass: 'bg-gray-400', glowClass: '' }),
    LINH_CAP: createQuality('linh_cap', 'Linh Cấp', '#2196F3', { cssClass: 'linh-khi', bgClass: 'bg-blue-500', glowClass: '' }),
    DIA_CAP: createQuality('dia_cap', 'Địa Cấp', '#9C27B0', { cssClass: 'phap-bao', bgClass: 'bg-purple-500', glowClass: 'quality-purple-500' }),
    THIEN_CAP: createQuality('thien_cap', 'Thiên Cấp', '#FF9800', { cssClass: 'co-bao', bgClass: 'bg-orange-500', glowClass: 'quality-orange-500' }),
    THANH_HUYET: createQuality('thanh_huyet', 'Thánh Huyết', '#FF007F', { cssClass: 'thong-thien', bgClass: 'bg-cultivation-gold', glowClass: 'quality-cultivation-gold' }),
    TIEN_HUYET: createQuality('tien_huyet', 'Tiên Huyết', '#00FFFF', { cssClass: 'tien-khi', bgClass: 'bg-cyan-400', glowClass: 'quality-cyan-400' }),
    THAN_HUYET: createQuality('than_huyet', 'Thần Huyết', '#FFD700', { cssClass: 'danh-khi', bgClass: 'bg-yellow-500', glowClass: '' })
});

export const ELEMENT_TYPES = Object.freeze({
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
});

export const QUALITY_TYPES = Object.freeze({
    PHAM_PHAM: 'Phàm Phẩm',
    HA_PHAM: 'Hạ Phẩm',
    TRUNG_PHAM: 'Trung Phẩm',
    THUONG_PHAM: 'Thượng Phẩm',
    CUC_PHAM: 'Cực Phẩm',
    HOAN_MY: 'Hoàn Mỹ',
    TIEN_PHAM: 'Tiên Phẩm'
});

export const NPC_PERSONALITIES_KEYS = Object.freeze({
    LANH_LUNG: 'lanh_lung',
    CHINH_TRUC: 'chinh_truc',
    THAM_LAM: 'tham_lam',
    KIEU_NGAO: 'kieu_ngao',
    DIEN_CUONG: 'dien_cuong',
    DA_NGHI: 'da_nghi',
    TRUNG_THANH: 'trung_thanh',
    HOA_NHA: 'hoa_nha',
    QUY_QUYET: 'quy_quyet'
});

export const NPC_GOALS_KEYS = Object.freeze({
    BAO_THU: 'bao_thu',
    THANH_TIEN: 'thanh_tien',
    TIM_TRUYEN_THUA: 'tim_truyen_thua',
    CHAN_HUNG_TON_MON: 'chan_hung_tong_mon',
    TIM_DAO_LU: 'tim_dao_lu'
});

export const BEAST_BLOODLINES = Object.freeze({
    PHAM: createQuality('pham', 'PHAM', '#9E9E9E', { cssClass: 'pham' }),
    LINH: createQuality('linh', 'LINH', '#2196F3', { cssClass: 'linh-khi' }),
    DIA: createQuality('dia', 'DIA', '#9C27B0', { cssClass: 'phap-bao' }),
    THIEN: createQuality('thien', 'THIEN', '#FF9800', { cssClass: 'co-bao' }),
    THANH: createQuality('thanh', 'THANH', '#FF007F', { cssClass: 'thong-thien' }),
    TIEN: createQuality('tien', 'TIEN', '#00FFFF', { cssClass: 'tien-khi' }),
    THAN: createQuality('than', 'THAN', '#FFD700', { cssClass: 'danh-khi' })
});

export const LINH_THE_RARITIES = Object.freeze({
    THAN_THOAI: createQuality('than_thoai', 'Thần Thoại', '#E0115F', { cssClass: 'danh-khi' }),
    THAN: createQuality('than', 'Thần', '#FFD700', { cssClass: 'danh-khi' }),
    TIEN: createQuality('tien', 'Tiên', '#00FFFF', { cssClass: 'tien-khi' }),
    THIEN: createQuality('thien', 'Thiên', '#FF9800', { cssClass: 'co-bao' }),
    DIA: createQuality('dia', 'Địa', '#9C27B0', { cssClass: 'phap-bao' })
});

export const STATUS_EFFECT_CATEGORIES = Object.freeze({
    BUFF: createQuality('BUFF', 'Tăng Cường', '#10B981', { borderClass: 'border-cyan-500/30', bgClass: 'bg-cyan-500/10', textClass: 'text-cyan-400', shadowClass: 'shadow-[0_0_8px_rgba(6,182,212,0.2)]' }),
    DEBUFF: createQuality('DEBUFF', 'Suy Yếu', '#EF4444', { borderClass: 'border-red-500/30', bgClass: 'bg-red-500/10', textClass: 'text-red-400', shadowClass: 'shadow-[0_0_8px_rgba(239,68,68,0.2)]' }),
    BODY: createQuality('BODY', 'Thể Chất', '#F59E0B', { borderClass: 'border-yellow-600/30', bgClass: 'bg-yellow-600/10', textClass: 'text-yellow-500', shadowClass: 'shadow-[0_0_8px_rgba(217,119,6,0.2)]' }),
    SOUL: createQuality('SOUL', 'Thần Hồn', '#8B5CF6', { borderClass: 'border-purple-500/30', bgClass: 'bg-purple-500/10', textClass: 'text-purple-400', shadowClass: 'shadow-[0_0_8px_rgba(168,85,247,0.2)]' }),
    QI: createQuality('QI', 'Nguyên Khí', '#EC4899', { borderClass: 'border-orange-500/30', bgClass: 'bg-orange-500/10', textClass: 'text-orange-400', shadowClass: 'shadow-[0_0_8px_rgba(249,115,22,0.2)]' }),
    ELEMENTAL: createQuality('ELEMENTAL', 'Ngũ Hành', '#3B82F6', { borderClass: 'border-green-500/30', bgClass: 'bg-green-500/10', textClass: 'text-green-400', shadowClass: 'shadow-[0_0_8px_rgba(34,197,94,0.2)]' }),
    CONTROL: createQuality('CONTROL', 'Khống Chế', '#6B7280', { borderClass: 'border-amber-500/30', bgClass: 'bg-amber-500/10', textClass: 'text-amber-400', shadowClass: 'shadow-[0_0_8px_rgba(245,158,11,0.2)]' }),
    TRIBULATION: createQuality('TRIBULATION', 'Thiên Kiếp', '#EF4444', { borderClass: 'border-purple-600/40 bg-purple-950/20 text-purple-300 animate-pulse border-double', bgClass: '', textClass: '', shadowClass: 'shadow-[0_0_12px_rgba(147,51,234,0.4)]' })
});

export const SPIRIT_STONE_GRADES = Object.freeze({
    HA: createQuality('HA', 'Hạ Phẩm Linh Thạch', '#4fd1c5', { shortName: 'Hạ', value: 1, multiplier: 1, nextGrade: 'TRUNG', cssClass: 'text-qi-blue' }),
    TRUNG: createQuality('TRUNG', 'Trung Phẩm Linh Thạch', '#a855f7', { shortName: 'Trung', value: 100, multiplier: 100, nextGrade: 'THUONG', cssClass: 'text-qi-purple' }),
    THUONG: createQuality('THUONG', 'Thượng Phẩm Linh Thạch', '#f6ad55', { shortName: 'Thượng', value: 10000, multiplier: 10000, nextGrade: 'CUC', cssClass: 'text-cultivation-gold' }),
    CUC: createQuality('CUC', 'Cực Phẩm Linh Thạch', '#f472b6', { shortName: 'Cực', value: 1000000, multiplier: 1000000, nextGrade: 'TIEN', cssClass: 'text-pink-400' }),
    TIEN: createQuality('TIEN', 'Tiên Tinh', '#10b981', { shortName: 'Tiên', value: 100000000, multiplier: 100000000, nextGrade: 'HON_DON', cssClass: 'text-emerald-400' }),
    HON_DON: createQuality('HON_DON', 'Hỗn Độn Tinh', '#6366f1', { shortName: 'Hỗn', value: 10000000000, multiplier: 10000000000, nextGrade: 'HONG_MONG', cssClass: 'text-indigo-400' }),
    HONG_MONG: createQuality('HONG_MONG', 'Hồng Mông Linh Tinh', '#a855f7', { shortName: 'Hồng', value: 1000000000000, multiplier: 1000000000000, nextGrade: null, cssClass: 'text-purple-500' })
});

export const SPIRIT_STONE_QUALITIES = Object.freeze({
    TAP: createQuality('TAP', 'Tạp Chất', '#9ca3af', { multiplier: 0.5, cssClass: 'pham' }),
    BINH_THUONG: createQuality('BINH_THUONG', 'Bình Thường', '#ffffff', { multiplier: 1.0, cssClass: 'pham' }),
    TINH_THUAN: createQuality('TINH_THUAN', 'Tinh Thuần', '#60a5fa', { multiplier: 2.0, cssClass: 'huyen' }),
    HOAN_MY: createQuality('HOAN_MY', 'Hoàn Mỹ', '#fbbf24', { multiplier: 5.0, cssClass: 'thien' })
});

export const PUPPET_GRADES = Object.freeze({
    PHAM: createQuality('PHAM', 'Phàm Cấp', '#9ca3af', { multiplier: 1, cssClass: 'pham' }),
    LINH: createQuality('LINH', 'Linh Cấp', '#2196F3', { multiplier: 2, cssClass: 'linh-khi' }),
    HUYEN: createQuality('HUYEN', 'Huyền Cấp', '#9C27B0', { multiplier: 4, cssClass: 'huyen' }),
    DIA: createQuality('DIA', 'Địa Cấp', '#FF9800', { multiplier: 8, cssClass: 'dia' }),
    THIEN: createQuality('THIEN', 'Thiên Cấp', '#F44336', { multiplier: 15, cssClass: 'thien' }),
    THANH: createQuality('THANH', 'Thánh Cấp', '#FF007F', { multiplier: 30, cssClass: 'thong-thien' }),
    TIEN: createQuality('TIEN', 'Tiên Cấp', '#00FFFF', { multiplier: 100, cssClass: 'tien-khi' })
});

export const PUPPET_TYPES = Object.freeze({
    COMBAT: createQuality('COMBAT', 'Chiến Đấu', '#F44336', { icon: '⚔️' }),
    GUARD: createQuality('GUARD', 'Hộ Vệ', '#2196F3', { icon: '🛡️' }),
    ALCHEMY: createQuality('ALCHEMY', 'Luyện Đan', '#4CAF50', { icon: '🧪' }),
    MINING: createQuality('MINING', 'Khai Khoáng', '#FF9800', { icon: '⛏️' }),
    SCOUT: createQuality('SCOUT', 'Trinh Sát', '#9C27B0', { icon: '👁️' }),
    SMITHING: createQuality('SMITHING', 'Luyện Khí', '#795548', { icon: '⚒️' }),
    FLIGHT: createQuality('FLIGHT', 'Phi Hành', '#00FFFF', { icon: '🦅' }),
    WAR: createQuality('WAR', 'Chiến Tranh', '#E91E63', { icon: '🏯' })
});

export const BEAST_TYPES = Object.freeze({
    LINH_TRUNG: createQuality('LINH_TRUNG', 'Linh Trùng', '#4CAF50'),
    KY_TRUNG: createQuality('KY_TRUNG', 'Kỳ Trùng', '#9C27B0'),
    LINH_THU: createQuality('LINH_THU', 'Linh Thú', '#2196F3'),
    DI_THU: createQuality('DI_THU', 'Dị Thú', '#FF9800'),
    THAN_THU: createQuality('THAN_THU', 'Thần Thú', '#F44336')
});

export const ROOT_QUALITIES = Object.freeze({
    TAP: createQuality('tap', 'Tạp', '#9ca3af', { sortOrder: 1, multiplier: 0.5, cssClass: 'pham' }),
    HA_PHAM: createQuality('ha_pham', 'Hạ phẩm', '#4ade80', { sortOrder: 2, multiplier: 0.8, cssClass: 'pham' }),
    TRUNG_PHAM: createQuality('trung_pham', 'Trung phẩm', '#3b82f6', { sortOrder: 3, multiplier: 1.2, cssClass: 'hoang' }),
    THUONG_PHAM: createQuality('thuong_pham', 'Thượng phẩm', '#a855f7', { sortOrder: 4, multiplier: 1.8, cssClass: 'huyen' }),
    DIA: createQuality('dia', 'Địa', '#f59e0b', { sortOrder: 5, multiplier: 2.5, cssClass: 'dia' }),
    THIEN: createQuality('thien', 'Thiên', '#ec4899', { sortOrder: 6, multiplier: 4.0, cssClass: 'thien' }),
    TIEN: createQuality('tien', 'Tiên', '#ef4444', { sortOrder: 7, multiplier: 7.0, cssClass: 'tien' })
});

export const MORALITY_SCALES = Object.freeze({
    DAI_THIEN: createQuality('dai_thien', 'Đại Thiện', '#34d399', { min: 800, max: 1000, description: 'Tâm hoài chúng sinh, được thiên đạo che chở.' }),
    THIEN: createQuality('thien', 'Thiên', '#10b981', { min: 300, max: 800, description: 'Hành hiệp trượng nghĩa, là tấm gương sáng.' }),
    TRUNG_LAP: createQuality('trung_lap', 'Trung Lập', '#94a3b8', { min: -300, max: 300, description: 'Tâm không vướng bận, tùy tâm sở dục.' }),
    AC: createQuality('ac', 'Ác', '#f43f5e', { min: -800, max: -300, description: 'Sát nghiệp quấn thân, người người căm phẫn.' }),
    DAI_AC: createQuality('dai_ac', 'Đại Ác', '#e11d48', { min: -1000, max: -800, description: 'Tội ác tày trời, thiên địa không dung.' }),
    MA_DAO: createQuality('ma_dau', 'Ma Đầu', '#9f1239', { min: -Infinity, max: -1000, description: 'Tuyệt diệt nhân tính, hóa thân thành ma.' })
});

export const KARMA_TYPES = Object.freeze({
    THIEN_DUYEN: createQuality('THIEN_DUYEN', 'Thiện Duyên', '#10b981'),
    AC_DUYEN: createQuality('AC_DUYEN', 'Ác Duyên', '#f43f5e'),
    SU_DO: createQuality('SU_DO', 'Sư Đồ Nhân Quả', '#6366f1'),
    DAO_LU: createQuality('DAO_LU', 'Đạo Lữ Nhân Quả', '#fbcfe8'),
    HUYET_CUU: createQuality('HUYET_CUU', 'Huyết Cừu Nhân Quả', '#be123c'),
    TRUYEN_THUA: createQuality('TRUYEN_THUA', 'Truyền Thừa Nhân Quả', '#fbbf24'),
    THIEN_DAO: createQuality('THIEN_DAO', 'Thiên Đạo Nhân Quả', '#0ea5e9')
});

export const ITEM_TYPES_METADATA = Object.freeze({
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
});

export const GAME_STATS = Object.freeze({
    atk: createQuality('atk', 'Công Kích', '#9E9E9E'),
    def: createQuality('def', 'Phòng Thủ', '#9E9E9E'),
    spd: createQuality('spd', 'Tốc Độ', '#9E9E9E'),
    hp: createQuality('hp', 'Khí Huyết', '#9E9E9E'),
    maxHp: createQuality('maxHp', 'Khí Huyết Tăng', '#9E9E9E'),
    mana: createQuality('mana', 'Linh Lực', '#9E9E9E'),
    maxMana: createQuality('maxMana', 'Linh Lực Tăng', '#9E9E9E'),
    tuViSpeed: createQuality('tuViSpeed', 'Tốc Độ Tu Luyện', '#9E9E9E'),
    soulExpSpeed: createQuality('soulExpSpeed', 'Tốc Độ Thần Thức', '#9E9E9E'),
    spirit: createQuality('spirit', 'Thần Thức', '#9E9E9E'),
    critRate: createQuality('critRate', 'Tỷ Lệ Bạo Kích', '#9E9E9E'),
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
    qiAbsorb: createQuality('qiAbsorb', 'Hấp Thụ Linh Khí', '#9E9E9E'),
    alchemySuccess: createQuality('alchemySuccess', 'Tỉ Lệ Luyện Đan', '#9E9E9E'),
    smithingBonus: createQuality('smithingBonus', 'Tỉ Lệ Luyện Khí', '#9E9E9E'),
    breakthroughChance: createQuality('breakthroughChance', 'Tỉ Lệ Đột Phá', '#9E9E9E'),
    coldRes: createQuality('coldRes', 'Băng Kháng', '#9E9E9E'),
    thunderRes: createQuality('thunderRes', 'Lôi Kháng', '#9E9E9E'),
    fireRes: createQuality('fireRes', 'Hỏa Kháng', '#9E9E9E'),
    poisonRes: createQuality('poisonRes', 'Độc Kháng', '#9E9E9E'),
    spiritRoot: createQuality('spiritRoot', 'Cải Tạo Linh Căn', '#9E9E9E'),
    stamina: createQuality('stamina', 'Thể Lực', '#9E9E9E'),
    bodyExpSpeed: createQuality('bodyExpSpeed', 'Tốc Độ Luyện Thể', '#9E9E9E'),
    critDmg: createQuality('critDmg', 'Sát Thương Bạo Kích', '#9E9E9E'),
    lifeSteal: createQuality('lifeSteal', 'Hút Máu', '#9E9E9E'),
    soulPierce: createQuality('soulPierce', 'Thần Hồn Xuyên Thấu', '#9E9E9E'),
    daoVun: createQuality('daoVun', 'Đạo Vận', '#9E9E9E'),
    murderQi: createQuality('murderQi', 'Sát Khí', '#9E9E9E'),
    fireDmg: createQuality('fireDmg', 'Sát Thương Hỏa', '#9E9E9E'),
    waterDmg: createQuality('waterDmg', 'Sát Thương Thủy', '#9E9E9E'),
    thunderDmg: createQuality('thunderDmg', 'Sát Thương Lôi', '#9E9E9E'),
    woodDmg: createQuality('woodDmg', 'Sát Thương Mộc', '#9E9E9E'),
    earthDmg: createQuality('earthDmg', 'Sát Thương Thổ', '#9E9E9E'),
    windDmg: createQuality('windDmg', 'Sát Thương Phong', '#9E9E9E'),
    metalDmg: createQuality('metalDmg', 'Sát Thương Kim', '#9E9E9E'),
    iceDmg: createQuality('iceDmg', 'Sát Thương Băng', '#9E9E9E'),
    poisonDmg: createQuality('poisonDmg', 'Sát Thương Độc', '#9E9E9E'),
    swordDmg: createQuality('swordDmg', 'Sát Thương Kiếm', '#9E9E9E'),
    talismanSuccess: createQuality('talismanSuccess', 'Tỉ Lệ Vẽ Phù', '#9E9E9E'),
    puppetBonus: createQuality('puppetBonus', 'Tỉ Lệ Chế Khôi Lỗi', '#9E9E9E'),
    successRate: createQuality('successRate', 'Tỷ Lệ Thành Công', '#9E9E9E'),
    spdPercent: createQuality('spdPercent', 'Tốc Độ (%)', '#9E9E9E'),
    techniqueMastery: createQuality('techniqueMastery', 'Lĩnh Ngộ Công Pháp', '#9E9E9E'),
    comprehension: createQuality('comprehension', 'Ngộ Tính', '#9E9E9E'),
    daoTam: createQuality('daoTam', 'Đạo Tâm', '#9E9E9E'),
    physique: createQuality('physique', 'Căn Cốt', '#9E9E9E')
});

export const SMITHING_LEVELS = Object.freeze({
    NHAP_MON_LUYEN_KHI_SU: createQuality('nhap_mon_luyen_khi_su', 'Nhập Môn Luyện Khí Sư', '#9ca3af', { bonusRate: 0 }),
    NHAT_GIAI_LUYEN_KHI_SU: createQuality('nhat_giai_luyen_khi_su', 'Nhất Giai Luyện Khí Sư', '#4ade80', { bonusRate: 0.05 }),
    NHI_GIAI_LUYEN_KHI_SU: createQuality('nhi_giai_luyen_khi_su', 'Nhị Giai Luyện Khí Sư', '#3b82f6', { bonusRate: 0.10 }),
    TAM_GIAI_LUYEN_KHI_SU: createQuality('tam_giai_luyen_khi_su', 'Tam Giai Luyện Khí Sư', '#a855f7', { bonusRate: 0.15 }),
    TU_GIAI_LUYEN_KHI_SU: createQuality('tu_giai_luyen_khi_su', 'Tứ Giai Luyện Khí Sư', '#f59e0b', { bonusRate: 0.20 }),
    NGU_GIAI_LUYEN_KHI_SU: createQuality('ngu_giai_luyen_khi_su', 'Ngũ Giai Luyện Khí Sư', '#ec4899', { bonusRate: 0.25 }),
    LUC_GIAI_LUYEN_KHI_SU: createQuality('luc_giai_luyen_khi_su', 'Lục Giai Luyện Khí Sư', '#ef4444', { bonusRate: 0.30 }),
    THAT_GIAI_LUYEN_KHI_SU: createQuality('that_giai_luyen_khi_su', 'Thất Giai Luyện Khí Sư', '#FF007F', { bonusRate: 0.35 }),
    BAT_GIAI_LUYEN_KHI_SU: createQuality('bat_giai_luyen_khi_su', 'Bát Giai Luyện Khí Sư', '#00FFFF', { bonusRate: 0.40 }),
    CUU_GIAI_LUYEN_KHI_SU: createQuality('cuu_giai_luyen_khi_su', 'Cửu Giai Luyện Khí Sư', '#FFD700', { bonusRate: 0.50 }),
    TIEN_GIAI_LUYEN_KHI_SU: createQuality('tien_giai_luyen_khi_su', 'Tiên Giai Luyện Khí Sư', '#E0115F', { bonusRate: 0.70 }),
    THAN_GIAI_LUYEN_KHI_SU: createQuality('than_giai_luyen_khi_su', 'Thần Giai Luyện Khí Sư', '#ffffff', { bonusRate: 1.00 })
});

export const ALCHEMY_LEVELS = Object.freeze({
    NHAT_PHAM_LUYEN_DUOC_SU: createQuality('nhat_pham_luyen_duoc_su', 'Nhất Phẩm Luyện Dược Sư', '#4ade80', { bonusRate: 0.05 }),
    NHI_PHAM_LUYEN_DUOC_SU: createQuality('nhi_pham_luyen_duoc_su', 'Nhị Phẩm Luyện Dược Sư', '#3b82f6', { bonusRate: 0.10 }),
    TAM_PHAM_LUYEN_DUOC_SU: createQuality('tam_pham_luyen_duoc_su', 'Tam Phẩm Luyện Dược Sư', '#a855f7', { bonusRate: 0.15 }),
    TU_PHAM_LUYEN_DUOC_SU: createQuality('tu_pham_luyen_duoc_su', 'Tứ Phẩm Luyện Dược Sư', '#f59e0b', { bonusRate: 0.20 }),
    NGU_PHAM_LUYEN_DUOC_SU: createQuality('ngu_pham_luyen_duoc_su', 'Ngũ Phẩm Luyện Dược Sư', '#ec4899', { bonusRate: 0.25 }),
    LUC_PHAM_LUYEN_DUOC_SU: createQuality('luc_pham_luyen_duoc_su', 'Lục Phẩm Luyện Dược Sư', '#ef4444', { bonusRate: 0.30 }),
    THAT_PHAM_LUYEN_DUOC_SU: createQuality('that_pham_luyen_duoc_su', 'Thất Phẩm Luyện Dược Sư', '#FF007F', { bonusRate: 0.35 }),
    BAT_PHAM_LUYEN_DUOC_SU: createQuality('bat_pham_luyen_duoc_su', 'Bát Phẩm Luyện Dược Sư', '#00FFFF', { bonusRate: 0.40 }),
    CUU_PHAM_LUYEN_DUOC_SU: createQuality('cuu_pham_luyen_duoc_su', 'Cửu Phẩm Luyện Dược Sư', '#FFD700', { bonusRate: 0.50 }),
    DE_PHAM_LUYEN_DUOC_DAI_TONG_SU: createQuality('de_pham_luyen_duoc_dai_tong_su', 'Đế Phẩm Luyện Dược Đại Tông Sư', '#E0115F', { bonusRate: 0.70 }),
    TIEN_PHAM_DAN_THAN: createQuality('tien_pham_dan_than', 'Tiên Phẩm Đan Thần', '#ffffff', { bonusRate: 1.00 })
});

export const PHYSIQUE_GRADES = Object.freeze({
    'PHAM': createQuality('pham', 'Phàm Thể', '#9ca3af', { multiplier: 1.0, sortOrder: 1 }),
    'LINH': createQuality('linh', 'Linh Thể', '#4ade80', { multiplier: 1.5, sortOrder: 2 }),
    'BAO': createQuality('bao', 'Bảo Thể', '#3b82f6', { multiplier: 2.2, sortOrder: 3 }),
    'CHIEN': createQuality('chien', 'Chiến Thể', '#a855f7', { multiplier: 3.0, sortOrder: 4 }),
    'THANH': createQuality('thanh', 'Thánh Thể', '#f59e0b', { multiplier: 4.5, sortOrder: 5 }),
    'DAO': createQuality('dao', 'Đạo Thể', '#ec4899', { multiplier: 7.0, sortOrder: 6 }),
    'TIEN': createQuality('tien', 'Tiên Thể', '#ef4444', { multiplier: 12.0, sortOrder: 7 }),
    'HONG_MONG': createQuality('hong_mong', 'Hồng Mông Thể', '#ffffff', { multiplier: 25.0, sortOrder: 8 })
});

export const PHYSIQUE_STAGES = Object.freeze({
    'SO_KHAI': createQuality('so_khai', 'Sơ Khai', '#9ca3af', { multiplier: 1.0, sortOrder: 1 }),
    'TIEU_THANH': createQuality('tieu_thanh', 'Tiểu Thành', '#4ade80', { multiplier: 1.5, sortOrder: 2 }),
    'DAI_THANH': createQuality('dai_thanh', 'Đại Thành', '#3b82f6', { multiplier: 2.5, sortOrder: 3 }),
    'VIEN_MAN': createQuality('vien_man', 'Viên Mãn', '#a855f7', { multiplier: 4.0, sortOrder: 4 }),
    'HOAN_MY': createQuality('hoan_my', 'Hoàn Mỹ', '#f59e0b', { multiplier: 7.0, sortOrder: 5 })
});

export const PHYSIQUE_CATEGORIES = Object.freeze({
    'PHAM': 'Phàm Thể',
    'LINH': 'Linh Thể',
    'BAO': 'Bảo Thể',
    'CHIEN': 'Chiến Thể',
    'THANH': 'Thánh Thể',
    'DAO': 'Đạo Thể',
    'MA': 'Ma Thể',
    'HON': 'Hồn Thể',
    'YEU': 'Yêu Thể',
    'CAM_KY': 'Cấm Kỵ Thể Chất'
});

export const HOURS_ENUM = Object.freeze({
    TY: createQuality('ty', 'Giờ Tý', '#9ca3af', { period: 'Night', description: 'Âm khí cực thịnh, vạn vật tĩnh lặng.' }),
    SUU: createQuality('suu', 'Giờ Sửu', '#9ca3af', { period: 'Night', description: 'Linh khí lắng đọng, thích hợp ngưng tụ.' }),
    DAN: createQuality('dan', 'Giờ Dần', '#9ca3af', { period: 'Night', description: 'Bình minh sắp tới, âm dương giao thoa.' }),
    MAO: createQuality('mao', 'Giờ Mão', '#4ade80', { period: 'Day', description: 'Mặt trời mọc, vạn vật thức tỉnh.' }),
    THIN: createQuality('thin', 'Giờ Thìn', '#4ade80', { period: 'Day', description: 'Khí lành vây quanh, thành trì náo nhiệt.' }),
    TI: createQuality('ti', 'Giờ Tỵ', '#4ade80', { period: 'Day', description: 'Dương khí thăng hoa, linh dược sinh trưởng.' }),
    NGO: createQuality('ngo', 'Giờ Ngọ', '#4ade80', { period: 'Day', description: 'Cực dương chi thời, hỏa hệ cường đại.' }),
    MUI: createQuality('mui', 'Giờ Mùi', '#4ade80', { period: 'Day', description: 'Nắng gắt dần tan, vạn vật bình ổn.' }),
    THAN: createQuality('than', 'Giờ Thân', '#4ade80', { period: 'Day', description: 'Hoàng hôn buông xuống, mây trôi hờ hững.' }),
    DAU: createQuality('dau', 'Giờ Dậu', '#4ade80', { period: 'Day', description: 'Mặt trời lặn, tà dương chiếu rọi.' }),
    TUAT: createQuality('tuat', 'Giờ Tuất', '#9ca3af', { period: 'Night', description: 'Màn đêm bao phủ, yêu thú bắt đầu hoạt động.' }),
    HOI: createQuality('hoi', 'Giờ Hợi', '#9ca3af', { period: 'Night', description: 'Vạn vật nghỉ ngơi, bóng tối ngự trị.' })
});

export const SEASONS_ENUM = Object.freeze({
    SPRING: createQuality('spring', 'Mùa Xuân', '#4ade80', { 
        bonus: { herbGrowth: 1.5, woodElement: 1.2, tvps: 1.2 },
        description: 'Vạn vật sinh sôi, linh thảo trưởng thành nhanh chóng. Linh khí dồi dào.'
    }),
    SUMMER: createQuality('summer', 'Mùa Hạ', '#f87171', { 
        bonus: { fireElement: 1.5, alchemySuccess: 1.1, tvps: 1.0 },
        description: 'Nắng gắt như thiêu, hỏa hệ linh lực bạo động.'
    }),
    AUTUMN: createQuality('autumn', 'Mùa Thu', '#fbbf24', { 
        bonus: { breakthroughSuccess: 1.1, metalElement: 1.2, tvps: 1.5 },
        description: 'Khí trời mát mẻ, linh khí ổn định, thích hợp đột phá và tu luyện.'
    }),
    WINTER: createQuality('winter', 'Mùa Đông', '#60a5fa', { 
        bonus: { iceElement: 1.5, waterElement: 1.2, tvps: 0.8 },
        description: 'Băng giá bao trùm, linh khí lắng đọng, tu luyện chậm lại.'
    })
});

export const PHENOMENA_ENUM = Object.freeze({
    SPIRITUAL_TIDE: createQuality('spiritual_tide', 'Linh Khí Triều', '#a855f7', {
        chance: 0.05,
        duration: 120, // minutes
        effect: { tvps: 2.0 },
        description: 'Linh khí nồng đậm bùng phát toàn thế giới!'
    }),
    BLOOD_MOON: createQuality('blood_moon', 'Huyết Nguyệt', '#ef4444', {
        chance: 0.03,
        duration: 60,
        effect: { enemyStrength: 1.5, karmaLoss: 2.0 },
        description: 'Mặt trăng máu hiện thế, yêu ma bạo loạn!'
    }),
    ECLIPSE: createQuality('eclipse', 'Nhật Thực', '#7e22ce', {
        chance: 0.02,
        duration: 30,
        effect: { yinEnergy: 2.0 },
        description: 'Mặt trời bị che khuất, âm khí tràn ngập.'
    })
});

export const SPIRIT_STONE_ATTRIBUTES_ENUM = Object.freeze({
    'NORMAL': createQuality('normal', 'Vô Thuộc Tính', '#9ca3af', { bonus: 1.0 }),
    'FIRE': createQuality('fire', 'Hỏa', '#ef4444', { bonus: 1.2 }),
    'ICE': createQuality('ice', 'Băng', '#06b6d4', { bonus: 1.2 }),
    'WOOD': createQuality('wood', 'Mộc', '#4ade80', { bonus: 1.2 }),
    'METAL': createQuality('metal', 'Kim', '#fcd34d', { bonus: 1.2 }),
    'EARTH': createQuality('earth', 'Thổ', '#d97706', { bonus: 1.2 }),
    'LIGHTNING': createQuality('lightning', 'Lôi', '#a855f7', { bonus: 1.5 }),
    'DEMON': createQuality('demon', 'Ma Khí', '#212121', { bonus: 1.5 }),
    'IMMORTAL': createQuality('immortal', 'Tiên Khí', '#00FFFF', { bonus: 2.0 })
});


export const NPC_ROLES = Object.freeze({
    TANK: createQuality('Tank', 'Hộ Vệ', '#3b82f6', { hpMult: 1.6, defMult: 1.5, atkMult: 0.8 }),
    HEALER: createQuality('Healer', 'Trị Liệu', '#10b981', { hpMult: 0.9, atkMult: 0.6, spdMult: 1.1 }),
    SWORD: createQuality('Sword', 'Kiếm Tu', '#ef4444', { atkMult: 1.4, spdMult: 1.2 }),
    MAGE: createQuality('Mage', 'Pháp Sư', '#a855f7', { hpMult: 1.0, defMult: 1.0, atkMult: 1.0, spdMult: 1.0 })
});

export const NPC_PERSONALITIES_ENUM = Object.freeze({
    LANH_LUNG: createQuality('lanh_lung', 'Lạnh lùng', '#9ca3af', { desc: 'Ít nói, khó gần, nhưng hành động dứt khoát.' }),
    CHINH_TRUC: createQuality('chinh_truc', 'Chính trực', '#10b981', { desc: 'Coi trọng đạo lý, ghét kẻ gian tà.' }),
    THAM_LAM: createQuality('tham_lam', 'Tham lam', '#f59e0b', { desc: 'Dễ bị lợi dụ bởi linh thạch và bảo vật.' }),
    KIEU_NGAO: createQuality('kieu_ngao', 'Kiêu ngạo', '#a855f7', { desc: 'Coi thường kẻ yếu, không chịu khuất phục.' }),
    DIEN_CUONG: createQuality('dien_cuong', 'Điên cuồng', '#ef4444', { desc: 'Hành động khó đoán, dễ rơi vào trạng thái bạo tẩu.' }),
    DA_NGHI: createQuality('da_nghi', 'Đa nghi', '#6b7280', { desc: 'Khó tin tưởng người khác, luôn đề phòng.' }),
    TRUNG_THANH: createQuality('trung_thanh', 'Trung thành', '#3b82f6', { desc: 'Một khi đã kết giao sẽ không bao giờ phản bội.' }),
    HOA_NHA: createQuality('hoa_nha', 'Hòa nhã', '#34d399', { desc: 'Dễ kết bạn, luôn giúp đỡ người khác.' }),
    QUY_QUYET: createQuality('quy_quyet', 'Quỷ quyệt', '#8b5cf6', { desc: 'Thích dùng mưu mẹo, không từ thủ đoạn.' })
});

export const NPC_GOALS_ENUM = Object.freeze({
    BAO_THU: createQuality('bao_thu', 'Báo thù', '#ef4444', { desc: 'Tìm kiếm kẻ thù để rửa hận.' }),
    THANH_TIEN: createQuality('thanh_tien', 'Thành tiên', '#3b82f6', { desc: 'Dồn toàn lực vào tu luyện.' }),
    TIM_TRUYEN_THUA: createQuality('tim_truyen_thua', 'Tìm truyền thừa', '#fbbf24', { desc: 'Khám phá bí cảnh, tìm kiếm di sản cổ đại.' }),
    CHAN_HUNG_TON_MON: createQuality('chan_hung_tong_mon', 'Chấn hưng tông môn', '#10b981', { desc: 'Làm rạng danh tông môn của mình.' }),
    TIM_DAO_LU: createQuality('tim_dao_lu', 'Tìm đạo lữ', '#ec4899', { desc: 'Mong muốn tìm được người cùng tu hành.' })
});

export const NPC_SPECIAL_RELATIONS_ENUM = Object.freeze({
    DAO_LU: createQuality('dao_lu', 'Đạo lữ', '#fbcfe8', { desc: 'Bạn đời cùng tu hành.' }),
    SU_DO: createQuality('su_do', 'Sư đồ', '#6366f1', { desc: 'Mối quan hệ thầy trò.' }),
    GIA_TOC: createQuality('gia_toc', 'Gia tộc', '#3b82f6', { desc: 'Người cùng dòng máu.' }),
    CHU_TO: createQuality('chu_to', 'Chủ tớ', '#10b981', { desc: 'Mối quan hệ khế ước.' })
});

export const TALISMAN_LEVELS = Object.freeze({
    NHAP_MON_PHU_SU: createQuality('nhap_mon_phu_su', 'Nhập Môn Phù Sư', '#9ca3af', { bonusRate: 0 }),
    NHAT_GIAI_PHU_SU: createQuality('nhat_giai_phu_su', 'Nhất Giai Phù Sư', '#4ade80', { bonusRate: 0.05 }),
    NHI_GIAI_PHU_SU: createQuality('nhi_giai_phu_su', 'Nhị Giai Phù Sư', '#3b82f6', { bonusRate: 0.10 }),
    TAM_GIAI_PHU_SU: createQuality('tam_giai_phu_su', 'Tam Giai Phù Sư', '#a855f7', { bonusRate: 0.15 }),
    TU_GIAI_PHU_SU: createQuality('tu_giai_phu_su', 'Tứ Giai Phù Sư', '#f59e0b', { bonusRate: 0.20 }),
    NGU_GIAI_PHU_SU: createQuality('ngu_giai_phu_su', 'Ngũ Giai Phù Sư', '#ec4899', { bonusRate: 0.25 }),
    LUC_GIAI_PHU_SU: createQuality('luc_giai_phu_su', 'Lục Giai Phù Sư', '#ef4444', { bonusRate: 0.30 }),
    THAT_GIAI_PHU_SU: createQuality('that_giai_phu_su', 'Thất Giai Phù Sư', '#FF007F', { bonusRate: 0.35 }),
    BAT_GIAI_PHU_SU: createQuality('bat_giai_phu_su', 'Bát Giai Phù Sư', '#00FFFF', { bonusRate: 0.40 }),
    CUU_GIAI_PHU_SU: createQuality('cuu_giai_phu_su', 'Cửu Giai Phù Sư', '#FFD700', { bonusRate: 0.50 }),
    TIEN_GIAI_PHU_SU: createQuality('tien_giai_phu_su', 'Tiên Giai Phù Sư', '#E0115F', { bonusRate: 0.70 }),
    THAN_GIAI_PHU_SU: createQuality('than_giai_phu_su', 'Thần Giai Phù Sư', '#ffffff', { bonusRate: 1.00 })
});

export const PUPPET_MAKING_LEVELS = Object.freeze({
    NHAP_MON_KHOI_LOI_SU: createQuality('nhap_mon_khoi_loi_su', 'Nhập Môn Khôi Lỗi Sư', '#9ca3af', { bonusRate: 0 }),
    NHAT_GIAI_KHOI_LOI_SU: createQuality('nhat_giai_khoi_loi_su', 'Nhất Giai Khôi Lỗi Sư', '#4ade80', { bonusRate: 0.05 }),
    NHI_GIAI_KHOI_LOI_SU: createQuality('nhi_giai_khoi_loi_su', 'Nhị Giai Khôi Lỗi Sư', '#3b82f6', { bonusRate: 0.10 }),
    TAM_GIAI_KHOI_LOI_SU: createQuality('tam_giai_khoi_loi_su', 'Tam Giai Khôi Lỗi Sư', '#a855f7', { bonusRate: 0.15 }),
    TU_GIAI_KHOI_LOI_SU: createQuality('tu_giai_khoi_loi_su', 'Tứ Giai Khôi Lỗi Sư', '#f59e0b', { bonusRate: 0.20 }),
    NGU_GIAI_KHOI_LOI_SU: createQuality('ngu_giai_khoi_loi_su', 'Ngũ Giai Khôi Lỗi Sư', '#ec4899', { bonusRate: 0.25 }),
    LUC_GIAI_KHOI_LOI_SU: createQuality('luc_giai_khoi_loi_su', 'Lục Giai Khôi Lỗi Sư', '#ef4444', { bonusRate: 0.30 }),
    THAT_GIAI_KHOI_LOI_SU: createQuality('that_giai_khoi_loi_su', 'Thất Giai Khôi Lỗi Sư', '#FF007F', { bonusRate: 0.35 }),
    BAT_GIAI_KHOI_LOI_SU: createQuality('bat_giai_khoi_loi_su', 'Bát Giai Khôi Lỗi Sư', '#00FFFF', { bonusRate: 0.40 }),
    CUU_GIAI_KHOI_LOI_SU: createQuality('cuu_giai_khoi_loi_su', 'Cửu Giai Khôi Lỗi Sư', '#FFD700', { bonusRate: 0.50 }),
    TIEN_GIAI_KHOI_LOI_SU: createQuality('tien_giai_khoi_loi_su', 'Tiên Giai Khôi Lỗi Sư', '#E0115F', { bonusRate: 0.70 }),
    THAN_GIAI_KHOI_LOI_SU: createQuality('than_giai_khoi_loi_su', 'Thần Giai Khôi Lỗi Sư', '#ffffff', { bonusRate: 1.00 })
});

export const BEAST_LEVELS = Object.freeze({
    AU_THE: createQuality('au_the', 'Ấu Thể', '#9ca3af'),
    NHAT_GIAI: createQuality('nhat_giai', 'Nhất Giai', '#4ade80'),
    NHI_GIAI: createQuality('nhi_giai', 'Nhị Giai', '#3b82f6'),
    TAM_GIAI: createQuality('tam_giai', 'Tam Giai', '#a855f7'),
    TU_GIAI: createQuality('tu_giai', 'Tứ Giai', '#f59e0b'),
    NGU_GIAI: createQuality('ngu_giai', 'Ngũ Giai', '#ec4899'),
    LUC_GIAI: createQuality('luc_giai', 'Lục Giai', '#ef4444'),
    THAT_GIAI: createQuality('that_giai', 'Thất Giai', '#FF007F'),
    BAT_GIAI: createQuality('bat_giai', 'Bát Giai', '#00FFFF'),
    CUU_GIAI: createQuality('cuu_giai', 'Cửu Giai', '#FFD700'),
    TIEN_GIAI: createQuality('tien_giai', 'Tiên Giai', '#E0115F'),
    THAN_GIAI: createQuality('than_giai', 'Thần Giai', '#ffffff')
});

export const RACES_ENUM = Object.freeze({
    HUMAN: createQuality('HUMAN', 'Nhân Tộc', '#60a5fa', { cost: 0, desc: 'Linh hồn hoàn chỉnh nhất, thích hợp tu luyện mọi loại công pháp. Tốc độ lĩnh ngộ ổn định.', bonus: { tvps: 1.0, soulExpSpeed: 1.1 } }),
    YAO: createQuality('YAO', 'Yêu Tộc', '#34d399', { cost: 40, desc: 'Hóa hình từ yêu thú, thân thể cực mạnh, thọ nguyên dài. Có khả năng thức tỉnh huyết mạch thần thú.', bloodline: 'LINH', bonus: { maxHp: 500, def: 50, maxAge: 1000, tvps: 0.9 } }),
    DEMON: createQuality('DEMON', 'Ma Tộc', '#ef4444', { cost: 60, desc: 'Chủng tộc của bản năng và sức mạnh hủy diệt. Tốc độ thăng tiến cực nhanh nhưng dễ bị tâm ma quấy phá.', bloodline: 'CHAN', bonus: { atk: 150, tvps: 1.3, karma: -200, maxAge: 500 } })
});

export const CREATION_BLOODLINES_ENUM = Object.freeze({
    PHAM: createQuality('PHAM', 'Phàm Huyết', '#9ca3af', { multiplier: 1.0 }),
    LINH: createQuality('LINH', 'Linh Huyết', '#4ade80', { multiplier: 1.5 }),
    DIA: createQuality('DIA', 'Địa Huyết', '#3b82f6', { multiplier: 2.5 }),
    THIEN: createQuality('THIEN', 'Thiên Huyết', '#ec4899', { multiplier: 4.0 }),
    VUONG: createQuality('VUONG', 'Vương Huyết', '#f59e0b', { multiplier: 6.5 }),
    HOANG: createQuality('HOANG', 'Hoàng Huyết', '#eab308', { multiplier: 10.0 }),
    THANH: createQuality('THANH', 'Thánh Huyết', '#a855f7', { multiplier: 18.0 }),
    DE: createQuality('DE', 'Đế Huyết', '#ef4444', { multiplier: 35.0 }),
    TIEN_LINH: createQuality('TIEN_LINH', 'Tiên Linh Huyết', '#06b6d4', { multiplier: 70.0 }),
    THAI_CO: createQuality('THAI_CO', 'Thái Cổ Huyết', '#ffffff', { multiplier: 150.0 })
});

export const DEMON_BLOODLINES_ENUM = Object.freeze({
    PHAM: createQuality('PHAM', 'Phàm Ma Huyết', '#9ca3af', { multiplier: 1.0 }),
    CHAN: createQuality('CHAN', 'Chân Ma Huyết', '#4ade80', { multiplier: 1.8 }),
    THIEN: createQuality('THIEN', 'Thiên Ma Huyết', '#3b82f6', { multiplier: 3.5 }),
    CO: createQuality('CO', 'Cổ Ma Huyết', '#a855f7', { multiplier: 7.0 }),
    THANH: createQuality('THANH', 'Thánh Ma Huyết', '#f59e0b', { multiplier: 15.0 }),
    THAN: createQuality('THAN', 'Ma Thần Huyết', '#ef4444', { multiplier: 40.0 }),
    NGUYEN_SO: createQuality('NGUYEN_SO', 'Nguyên Sơ Ma Huyết', '#ffffff', { multiplier: 100.0 })
});

export const NPC_RELATIONSHIP_LEVELS_ENUM = Object.freeze({
    HUYET_HAI_THAM_THU: createQuality('huyet_hai_tham_thu', 'Huyết hải thâm thù', '#ff0000', { min: -100, max: -81 }),
    THU_DICH: createQuality('thu_dich', 'Thù địch', '#ff4444', { min: -80, max: -51 }),
    CAM_GHET: createQuality('cam_ghet', 'Căm ghét', '#ff8888', { min: -50, max: -21 }),
    XA_LA: createQuality('xa_la', 'Xa lạ', '#aaaaaa', { min: -20, max: 20 }),
    QUEN_BIET: createQuality('quen_biet', 'Quen biết', '#88ff88', { min: 21, max: 40 }),
    DONG_MINH: createQuality('dong_minh', 'Đồng minh', '#44ff44', { min: 41, max: 60 }),
    BANG_HUU: createQuality('bang_huu', 'Bằng hữu', '#00ff00', { min: 61, max: 80 }),
    SINH_TU_CHI_GIAO: createQuality('sinh_tu_chi_giao', 'Sinh tử chi giao', '#ffff00', { min: 81, max: 100 })
});

export const RACE_VISUALS = Object.freeze({
    HUMAN: { icon: '👨‍👩‍👧‍👦', color: '#60a5fa' },
    DEMON: { icon: '👿', color: '#ef4444' },
    YAO: { icon: '🦊', color: '#34d399' },
    SPIRIT_BEAST: { icon: '🦊', color: '#34d399' },
    DRAGON: { icon: '🐲', color: '#fbbf24' }
});


export const CRAFTING_QUALITIES = Object.freeze({
    HA_PHAM: createQuality('ha_pham', 'Hạ Phẩm', '#4CAF50', { sortOrder: 2, cssClass: 'hoang', bgClass: 'bg-green-500', glowClass: '' }),
    TRUNG_PHAM: createQuality('trung_pham', 'Trung Phẩm', '#2196F3', { sortOrder: 3, cssClass: 'huyen', bgClass: 'bg-blue-500', glowClass: '' }),
    THUONG_PHAM: createQuality('thuong_pham', 'Thượng Phẩm', '#9C27B0', { sortOrder: 4, cssClass: 'dia', bgClass: 'bg-purple-500', glowClass: 'quality-purple-500' }),
    CUC_PHAM: createQuality('cuc_pham', 'Cực Phẩm', '#FF9800', { sortOrder: 5, cssClass: 'thien', bgClass: 'bg-orange-500', glowClass: 'quality-orange-500' }),
    HOAN_MY: createQuality('hoan_my', 'Hoàn Mỹ', '#FF007F', { sortOrder: 6, cssClass: 'thong-thien', bgClass: 'bg-cultivation-gold', glowClass: 'quality-cultivation-gold' }),
    TIEN_PHAM: createQuality('tien_pham', 'Tiên Phẩm', '#00FFFF', { sortOrder: 7, cssClass: 'tien', bgClass: 'bg-cyan-400', glowClass: 'quality-cyan-400' })
});

export const CORPSE_LEVELS = Object.freeze({
    NHAP_MON: createQuality('nhap_mon', 'Nhập Môn Thi Sư', '#9ca3af'),
    NHAT_GIAI: createQuality('nhat_giai', 'Nhất Giai Thi Sư', '#4ade80'),
    NHI_GIAI: createQuality('nhi_giai', 'Nhị Giai Thi Sư', '#3b82f6'),
    TAM_GIAI: createQuality('tam_giai', 'Tam Giai Thi Sư', '#a855f7'),
    TU_GIAI: createQuality('tu_giai', 'Tứ Giai Thi Sư', '#f59e0b'),
    NGU_GIAI: createQuality('ngu_giai', 'Ngũ Giai Thi Sư', '#ec4899'),
    LUC_GIAI: createQuality('luc_giai', 'Lục Giai Thi Sư', '#ef4444'),
    THAT_GIAI: createQuality('that_giai', 'Thất Giai Thi Sư', '#FF007F'),
    BAT_GIAI: createQuality('bat_giai', 'Bát Giai Thi Sư', '#00FFFF'),
    CUU_GIAI: createQuality('cuu_giai', 'Cửu Giai Thi Sư', '#FFD700'),
    TIEN_GIAI: createQuality('tien_giai', 'Tiên Giai Thi Sư', '#E0115F'),
    THAN_GIAI: createQuality('than_giai', 'Thần Giai Thi Sư', '#ffffff')
});

export const TOWER_LEVELS = Object.freeze({
    FLOOR_1: Object.freeze({
        floor: 1,
        name: "Ngoại Tháp - Tầng 1",
        description: "Nơi tập trung các luyện dược sư trẻ tuổi tài năng.",
        minAlchemyLevel: 3,
        rewards: Object.freeze({ expMult: 1.2 })
    }),
    FLOOR_2: Object.freeze({
        floor: 2,
        name: "Nội Tháp - Tầng 2",
        description: "Chỉ dành cho những người có thần thức mạnh mẽ.",
        minAlchemyLevel: 5,
        rewards: Object.freeze({ expMult: 1.5, qualityBonus: 0.1 })
    }),
    FLOOR_3: Object.freeze({
        floor: 3,
        name: "Thánh Đan Điện",
        description: "Nơi cư ngụ của các bậc Đan Thánh.",
        minAlchemyLevel: 7,
        rewards: Object.freeze({ expMult: 2.0, qualityBonus: 0.25 })
    })
});

export const TOWER_MASTERS = Object.freeze({
    HUYEN_LINH_TU: Object.freeze({
        id: 'huyen_linh_tu',
        name: 'Huyền Linh Tử',
        title: 'Đan Thánh',
        description: 'Bậc thầy về dung hợp dị hỏa.',
        requirements: Object.freeze({ alchemyLevel: 6, hasFlame: true })
    })
});

// ─────────────────────────────────────────────────────────────────────────────
// COMBAT STANCES — Chiến Thế Hệ Thống (Module 1)
// ─────────────────────────────────────────────────────────────────────────────
export const COMBAT_STANCES = Object.freeze({
    NONE: Object.freeze({
        id: 'NONE',
        name: 'Vô Thế',
        icon: '⚬',
        color: '#9ca3af',
        atkMult: 1.0,
        defMult: 1.0,
        manaRegen: 0,
        manaCostMult: 1.0,
        desc: 'Trạng thái tự nhiên, không thiên về công hay thủ.',
        pathRestriction: null,       // null = available to all
        pathBonus: null              // { path, bonus: {} }
    }),
    SAT: Object.freeze({
        id: 'SAT',
        name: 'Công Sát Thế',
        icon: '⚔️',
        color: '#ef4444',
        atkMult: 1.3,
        defMult: 0.7,
        manaRegen: 0,
        manaCostMult: 0.9,
        desc: 'Toàn lực tập trung vào tấn công. Công kích +30%, Phòng ngự -30%, Linh Lực tiêu hao -10%.',
        pathRestriction: null,
        pathBonus: {
            path: 'sword',
            bonus: { swordIntentDmg: 0.15 }  // +15% sword-intent damage
        }
    }),
    THU: Object.freeze({
        id: 'THU',
        name: 'Hộ Thân Thế',
        icon: '🛡️',
        color: '#3b82f6',
        atkMult: 0.8,
        defMult: 1.4,
        manaRegen: 0.03,             // 3% mana regen per hit absorbed
        manaCostMult: 1.0,
        desc: 'Phòng thủ toàn diện. Phòng ngự +40%, Công kích -20%, mỗi đòn nhận phản hồi 3% Linh Lực.',
        pathRestriction: null,
        pathBonus: {
            path: 'buddhist',
            bonus: { shieldAmt: 0.05 }  // +5% shield amount on defend
        }
    }),
    DINH: Object.freeze({
        id: 'DINH',
        name: 'Thiền Định Thế',
        icon: '🧘',
        color: '#a855f7',
        atkMult: 0.9,
        defMult: 1.0,
        manaRegen: 0.05,             // 5% max mana regen per turn
        manaCostMult: 0.8,
        desc: 'Nội tâm bình lặng. Linh Lực hồi +5%/lượt, Bí Pháp uy lực +20%, Linh Lực tiêu hao -20%, giảm Tâm Ma tích tụ.',
        pathRestriction: null,
        pathBonus: {
            path: 'confucian',
            bonus: { comprehensionBonus: 0.1 }  // +10% technique damage scaling
        }
    })
});

// ─────────────────────────────────────────────────────────────────────────────
// COMBAT EVENTS — Thiên Địa Dị Biến (Module 2)
// ─────────────────────────────────────────────────────────────────────────────
export const COMBAT_EVENTS = Object.freeze({
    LINH_KHI_BAO_DONG: Object.freeze({
        id: 'LINH_KHI_BAO_DONG',
        name: 'Linh Khí Bạo Động',
        icon: '🌀',
        color: '#a855f7',
        logColor: 'text-purple-400',
        // Fires with 25% chance every 3 turns (checked in processTurnStatus)
        chancePerCheck: 0.25,
        checkInterval: 3,            // every N turns
        // Condition: always eligible (checked before roll)
        condition: (combat) => true,
        desc: 'Linh khí thiên địa bạo loạn bất ngờ! Cả hai bên chịu ảnh hưởng ngẫu nhiên.'
    }),
    THIEN_LOI_HOI_KICH: Object.freeze({
        id: 'THIEN_LOI_HOI_KICH',
        name: 'Thiên Lôi Hội Kích',
        icon: '⚡',
        color: '#fbbf24',
        logColor: 'text-yellow-300',
        chancePerCheck: 0.40,
        checkInterval: 1,
        condition: (combat) =>
            ['SPIRIT_BEAST', 'DRAGON'].includes(combat.enemy?.race) &&
            combat.enemy?.hp < combat.enemy?.maxHp * 0.4,
        desc: 'Kẻ địch yêu tộc trọng thương, Thiên Đạo giáng xuống một đạo thiên lôi!'
    }),
    TAM_MA_TA_AP: Object.freeze({
        id: 'TAM_MA_TA_AP',
        name: 'Tâm Ma Tà Áp',
        icon: '🩸',
        color: '#be123c',
        logColor: 'text-rose-400',
        chancePerCheck: 0.30,
        checkInterval: 2,
        condition: (combat) =>
            (combat.player?.heartDemon || 0) > 30 &&
            combat.playerStance !== 'DINH',  // Thiền Định Thế blocks this
        desc: 'Tâm ma nhân lúc giao chiến trỗi dậy, khí huyết chấn động nhưng pháp lực bạo tăng!'
    }),
    LINH_KHI_TRIEU: Object.freeze({
        id: 'LINH_KHI_TRIEU',
        name: 'Linh Khí Triều',
        icon: '🌿',
        color: '#10b981',
        logColor: 'text-emerald-400',
        chancePerCheck: 1.0,         // always triggers when environment matches
        checkInterval: 3,
        condition: (combat) => combat.environment === 'SPIRITUAL_TIDE',
        desc: 'Linh khí nồng đậm như triều dâng, Linh Lực hồi phục nhanh chóng!'
    }),
    SAT_KHI_TU_TAP: Object.freeze({
        id: 'SAT_KHI_TU_TAP',
        name: 'Sát Khí Tụ Tập',
        icon: '⚔️',
        color: '#dc2626',
        logColor: 'text-red-400',
        chancePerCheck: 0.50,
        checkInterval: 1,
        condition: (combat) => combat.enemy?.hp < combat.enemy?.maxHp * 0.2,
        desc: 'Kẻ địch nguy cấp, sát khí bạo tụ! Mọi đòn tấn công đều thêm uy lực!'
    })
});

// Helper to safely get the name of a quality (handling string or object)
export const getQualityName = (quality) => {
    if (!quality) return '';
    return typeof quality === 'object' ? (quality.name || '') : String(quality);
};

// Helper to safely get the id of a quality (handling string or object)
export const getQualityId = (quality) => {
    if (!quality) return '';
    return typeof quality === 'object' ? (quality.id || '') : String(quality);
};

// Helper to compare two qualities safely (by id or name, case-insensitive)
export const compareQuality = (q1, q2) => {
    if (!q1 || !q2) return false;
    const id1 = typeof q1 === 'object' ? q1.id : String(q1);
    const id2 = typeof q2 === 'object' ? q2.id : String(q2);
    const name1 = typeof q1 === 'object' ? q1.name : String(q1);
    const name2 = typeof q2 === 'object' ? q2.name : String(q2);
    
    return id1.toLowerCase() === id2.toLowerCase() || name1.toLowerCase() === name2.toLowerCase();
};

// Helper to safely get the quality object from registry by id or name
export const getQualityObject = (quality) => {
    if (!quality) return null;
    if (typeof quality === 'object') return quality;
    const str = String(quality).toLowerCase();
    for (const group of [
        CRAFTING_QUALITIES, DAN_DUOC_QUALITIES, PHAP_BAO_QUALITIES, CONG_PHAP_QUALITIES, 
        DI_HOA_QUALITIES, DI_LOI_QUALITIES, LINH_THU_QUALITIES, 
        ROOT_QUALITIES, SPIRIT_STONE_GRADES, SPIRIT_STONE_QUALITIES, 
        PUPPET_GRADES, BEAST_BLOODLINES, LINH_THE_RARITIES,
        PHYSIQUE_GRADES, PHYSIQUE_STAGES, ALCHEMY_LEVELS, 
        SMITHING_LEVELS, HOURS_ENUM, SEASONS_ENUM, 
        PHENOMENA_ENUM, SPIRIT_STONE_ATTRIBUTES_ENUM, NPC_RELATIONSHIP_LEVELS_ENUM,
        NPC_ROLES, NPC_PERSONALITIES_ENUM, NPC_GOALS_ENUM, NPC_SPECIAL_RELATIONS_ENUM,
        TALISMAN_LEVELS, PUPPET_MAKING_LEVELS, BEAST_LEVELS,
        RACES_ENUM, CREATION_BLOODLINES_ENUM, DEMON_BLOODLINES_ENUM,
        CORPSE_LEVELS
    ]) {
        for (const q of Object.values(group)) {
            if (q.id.toLowerCase() === str || q.name.toLowerCase() === str) {
                return q;
            }
        }
    }
    return null;
};

// Helper to get sort priority for a quality
export const getQualitySortOrder = (quality) => {
    if (!quality) return 0;
    if (typeof quality === 'object' && quality.sortOrder !== undefined) {
        return quality.sortOrder;
    }
    const qObj = getQualityObject(quality);
    if (qObj && qObj.sortOrder !== undefined) {
        return qObj.sortOrder;
    }
    return 0;
};
