import { ELEMENT_TYPES } from './item-classification.js';
export const ROOT_TYPES = {
    BASIC: [ELEMENT_TYPES.KIM, ELEMENT_TYPES.MOC, ELEMENT_TYPES.THUY, ELEMENT_TYPES.HOA, ELEMENT_TYPES.THO],
    MUTATED: [ELEMENT_TYPES.LOI, ELEMENT_TYPES.BANG, ELEMENT_TYPES.PHONG, ELEMENT_TYPES.DOC, ELEMENT_TYPES.HUYET, ELEMENT_TYPES.YIN, ELEMENT_TYPES.DUONG]
};

export const ROOT_QUALITIES = {
    'Tạp': { multiplier: 0.5, color: '#9ca3af' },
    'Hạ phẩm': { multiplier: 0.8, color: '#4ade80' },
    'Trung phẩm': { multiplier: 1.2, color: '#3b82f6' },
    'Thượng phẩm': { multiplier: 1.8, color: '#a855f7' },
    'Địa': { multiplier: 2.5, color: '#f59e0b' },
    'Thiên': { multiplier: 4.0, color: '#ec4899' },
    'Tiên': { multiplier: 7.0, color: '#ef4444' }
};

export const PHYSIQUES = [
    { id: 'dao_the', name: 'Tiên Thiên Đạo Thể', desc: 'Tăng mạnh tốc độ hấp thụ linh khí.', bonus: { tvps: 2.0 } },
    { id: 'thanh_the', name: 'Hoang Cổ Thánh Thể', desc: 'Sinh mệnh cực cao, thể tu mạnh mẽ.', bonus: { maxHp: 500, atk: 50 } },
    { id: 'huyen_the', name: 'Cửu Âm Huyền Thể', desc: 'Phù hợp công pháp âm hàn, tăng phòng thủ.', bonus: { def: 30, mana: 100 } },
    { id: 'huyet_mach', name: 'Chân Long Huyết Mạch', desc: 'Uy áp rồng thần, tăng mạnh sức chiến đấu.', bonus: { atk: 100, spd: 20 } },
    { id: 'co_tinh', name: 'Thiên Sát Cô Tinh', desc: 'Dễ gặp nguy hiểm nhưng cơ duyên cực cao.', bonus: { luck: 50, atk: 30 } },
    { id: 'menh_tu', name: 'Thiên Mệnh Chi Tử', desc: 'Khí vận toàn diện, được thiên đạo che chở.', bonus: { luck: 100, tvps: 1.5 } },
    { id: 'phe_linh', name: 'Phệ Linh Thể', desc: 'Có thể hấp thụ linh lực từ vạn vật.', bonus: { tvps: 3.0, mana: -20 } },
    { id: 'tuyet_mach', name: 'Tuyệt Mạch Chi Thể', desc: 'Khó tu luyện nhưng ẩn chứa tiềm năng nghịch thiên.', bonus: { tvps: 0.2, maxHp: 200 } }
];

export const ORIGINS = [
    { 
        id: 'pham_nhan', 
        name: 'Phàm nhân nghèo', 
        desc: 'Không có tài nguyên nhưng ít nhân quả.', 
        resources: { lingShi: 10, items: [] } 
    },
    { 
        id: 'gia_toc', 
        name: 'Hậu duệ gia tộc', 
        desc: 'Có công pháp khởi đầu và linh thạch.', 
        resources: { lingShi: 500, items: ['dan_phat_co_ban'] } 
    },
    { 
        id: 'thuong_hoi', 
        name: 'Con cháu thương hội', 
        desc: 'Rất nhiều linh thạch để bắt đầu.', 
        resources: { lingShi: 2000, items: [] } 
    },
    { 
        id: 'ma_dao', 
        name: 'Hậu duệ ma đạo', 
        desc: 'Mạnh mẽ nhưng dễ bị truy sát.', 
        resources: { lingShi: 200, items: ['ma_cong_so_cap'], atk: 20 } 
    },
    { 
        id: 'chuyen_sinh', 
        name: 'Chuyển sinh đại năng', 
        desc: 'Mang theo ký ức và ngộ tính tiền kiếp.', 
        resources: { lingShi: 100, tvps: 2.0 } 
    },
    { 
        id: 'tu_hon', 
        name: 'Phế vật bị từ hôn', 
        desc: 'Khởi đầu thấp nhưng ý chí nghịch tập mạnh mẽ.', 
        resources: { lingShi: 0, luck: 80, stats: { atk: -5 } } 
    }
];

export const TALENTS = [
    { id: 'ngo_tinh', name: 'Ngộ tính cực cao', bonus: { tvps: 1.5 } },
    { id: 'luyen_dan', name: 'Luyện đan thiên tài', bonus: { alchemySuccess: 0.2 } },
    { id: 'kiem_dao', name: 'Kiếm đạo kỳ tài', bonus: { atk: 30 } },
    { id: 'than_thuc', name: 'Thần thức mạnh', bonus: { mana: 100 } },
    { id: 'than_phap', name: 'Thân pháp cao', bonus: { spd: 20 } }
];
