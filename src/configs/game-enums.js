const createQuality = (id, name, color) => ({
    id,
    name,
    color,
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
    PHAM_KHI: createQuality('pham_khi', 'Phàm Khí', '#9E9E9E'),
    PHAP_KHI: createQuality('phap_khi', 'Pháp Khí', '#4CAF50'),
    LINH_KHI: createQuality('linh_khi', 'Linh Khí', '#2196F3'),
    PHAP_BAO: createQuality('phap_bao', 'Pháp Bảo', '#9C27B0'),
    CO_BAO: createQuality('co_bao', 'Cổ Bảo', '#FF9800'),
    LINH_BAO: createQuality('linh_bao', 'Linh Bảo', '#F44336'),
    THONG_THIEN_LINH_BAO: createQuality('thong_thien', 'Thông Thiên Linh Bảo', '#FF007F'),
    HUYEN_THIEN_CHI_BAO: createQuality('huyen_thien', 'Huyền Thiên Chi Bảo', '#9400D3'),
    TIEN_KHI: createQuality('tien_khi', 'Tiên Khí', '#00FFFF'),
    DANH_KHI: createQuality('danh_khi', 'Danh Khí', '#FFD700')
};

export const DAN_DUOC_QUALITIES = {
    PHAM: createQuality('pham', 'Phàm Phẩm', '#9E9E9E'),
    HA_PHAM: createQuality('ha_pham', 'Hạ Phẩm', '#4CAF50'),
    TRUNG_PHAM: createQuality('trung_pham', 'Trung Phẩm', '#2196F3'),
    THUONG_PHAM: createQuality('thuong_pham', 'Thượng Phẩm', '#9C27B0'),
    CUC_PHAM: createQuality('cuc_pham', 'Cực Phẩm', '#FF9800'),
    DAN_VAN: createQuality('dan_van', 'Đan Văn', '#F44336'),
    DAN_BAO: createQuality('dan_bao', 'Đan Bảo', '#FFD700'),
    TIEN_DAN: createQuality('tien_dan', 'Tiên Đan', '#00FFFF')
};

export const CONG_PHAP_QUALITIES = {
    PHAM_GIAI: createQuality('pham_giai', 'Phàm Giai', '#9E9E9E'),
    HOANG_GIAI: createQuality('hoang_giai', 'Hoàng Giai', '#4CAF50'),
    HUYEN_GIAI: createQuality('huyen_giai', 'Huyền Giai', '#2196F3'),
    DIA_GIAI: createQuality('dia_giai', 'Địa Giai', '#9C27B0'),
    THIEN_GIAI: createQuality('thien_giai', 'Thiên Giai', '#FF9800'),
    LINH_GIAI: createQuality('linh_giai', 'Linh Giai', '#F44336'),
    THANH_GIAI: createQuality('thanh_giai', 'Thánh Giai', '#FF007F'),
    TIEN_GIAI: createQuality('tien_giai', 'Tiên Giai', '#00FFFF'),
    DE_GIAI: createQuality('de_giai', 'Đế Giai', '#FFD700'),
    DAO_GIAI: createQuality('dao_giai', 'Đạo Giai', '#E0115F')
};

export const DI_HOA_QUALITIES = {
    DI_HOA: createQuality('di_hoa', 'Dị Hỏa', '#FF9800'),
    PHAM_HOA: createQuality('pham_hoa', 'Phàm Hỏa', '#9E9E9E'),
    LINH_HOA: createQuality('linh_hoa', 'Linh Hỏa', '#2196F3'),
    DIA_HOA: createQuality('dia_hoa', 'Địa Hỏa', '#9C27B0'),
    THIEN_HOA: createQuality('thien_hoa', 'Thiên Hỏa', '#FF3300'),
    THANH_HOA: createQuality('thanh_hoa', 'Thánh Hỏa', '#FF007F'),
    TIEN_HOA: createQuality('tien_hoa', 'Tiên Hỏa', '#00FFFF'),
    TIEN: createQuality('tien', 'Tiên', '#00FFFF'),
    DAO_HOA: createQuality('dao_hoa', 'Đạo Hỏa', '#FFD700'),
    HONG_MONG_TO_HOA: createQuality('hong_mong', 'Hồng Mông Tổ Hỏa', '#E0115F')
};

export const DI_LOI_QUALITIES = {
    PHAM_LOI: createQuality('pham_loi', 'Phàm Lôi', '#9E9E9E'),
    LINH_LOI: createQuality('linh_loi', 'Linh Lôi', '#2196F3'),
    DIA_LOI: createQuality('dia_loi', 'Địa Lôi', '#9C27B0'),
    THIEN_LOI: createQuality('thien_loi', 'Thiên Lôi', '#FF9800'),
    THANH_LOI: createQuality('thanh_loi', 'Thánh Lôi', '#FF007F'),
    TIEN_LOI: createQuality('tien_loi', 'Tiên Lôi', '#00FFFF'),
    TIEN: createQuality('tien', 'Tiên', '#00FFFF'),
    DAO_LOI: createQuality('dao_loi', 'Đạo Lôi', '#FFD700'),
    TO_LOI: createQuality('to_loi', 'Tổ Lôi', '#E0115F')
};

export const LINH_THU_QUALITIES = {
    PHAM_HUYET: createQuality('pham_huyet', 'Phàm Huyết', '#9E9E9E'),
    LINH_CAP: createQuality('linh_cap', 'Linh Cấp', '#2196F3'),
    DIA_CAP: createQuality('dia_cap', 'Địa Cấp', '#9C27B0'),
    THIEN_CAP: createQuality('thien_cap', 'Thiên Cấp', '#FF9800'),
    THANH_HUYET: createQuality('thanh_huyet', 'Thánh Huyết', '#FF007F'),
    TIEN_HUYET: createQuality('tien_huyet', 'Tiên Huyết', '#00FFFF'),
    THAN_HUYET: createQuality('than_huyet', 'Thần Huyết', '#FFD700')
};

export const ELEMENT_TYPES = {
    KIM: createQuality('kim', 'Kim', '#FFD700'),
    MOC: createQuality('moc', 'Mộc', '#4CAF50'),
    THUY: createQuality('thuy', 'Thủy', '#2196F3'),
    HOA: createQuality('hoa', 'Hỏa', '#F44336'),
    THO: createQuality('tho', 'Thổ', '#8B4513'),
    LOI: createQuality('loi', 'Lôi', '#9C27B0'),
    BANG: createQuality('bang', 'Băng', '#00FFFF'),
    PHONG: createQuality('phong', 'Phong', '#00E5FF'),
    DOC: createQuality('doc', 'Độc', '#A100C7'),
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
    PHAM: createQuality('pham', 'PHAM', '#9E9E9E'),
    LINH: createQuality('linh', 'LINH', '#2196F3'),
    DIA: createQuality('dia', 'DIA', '#9C27B0'),
    THIEN: createQuality('thien', 'THIEN', '#FF9800'),
    THANH: createQuality('thanh', 'THANH', '#FF007F'),
    TIEN: createQuality('tien', 'TIEN', '#00FFFF'),
    THAN: createQuality('than', 'THAN', '#FFD700')
};

export const LINH_THE_RARITIES = {
    THAN_THOAI: createQuality('than_thoai', 'Thần Thoại', '#E0115F'),
    THAN: createQuality('than', 'Thần', '#FFD700'),
    TIEN: createQuality('tien', 'Tiên', '#00FFFF'),
    THIEN: createQuality('thien', 'Thiên', '#FF9800'),
    DIA: createQuality('dia', 'Địa', '#9C27B0')
};
