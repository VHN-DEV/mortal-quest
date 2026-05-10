import { ASSETS } from './asset-data.js';

export const SECTS = {
    'thien_kiem_tong': {
        id: 'thien_kiem_tong',
        name: 'Thiên Kiếm Tông',
        description: 'Tông môn kiếm đạo đứng đầu Nhân Giới, chú trọng công kích và tốc độ.',
        minRealm: 5,
        bonus: { atk: 10, spd: 5 },
        portrait: ASSETS.backgrounds.sect,
        missions: [
            { id: 'tk_1', name: 'Tuần tra ngoại môn', desc: 'Đuổi khéo bọn yêu thú quấy phá ruộng linh thảo.', reward: { contribution: 10, lingShi: 50 }, stamina: 20 },
            { id: 'tk_2', name: 'Rèn luyện kiếm ý', desc: 'Đứng dưới thác nước luyện kiếm 4 canh giờ.', reward: { contribution: 20, tuVi: 500 }, stamina: 40 }
        ]
    },
    'huyen_am_coc': {
        id: 'huyen_am_coc',
        name: 'Huyền Âm Cốc',
        description: 'Nơi tập hợp các tu sĩ ma đạo, quỷ quyệt và khó lường.',
        minRealm: 5,
        bonus: { def: 10, maxHp: 50 },
        portrait: ASSETS.backgrounds.cave,
        missions: [
            { id: 'ha_1', name: 'Thu thập âm khí', desc: 'Vào sâu trong cốc thu thập u minh chi khí.', reward: { contribution: 15, lingShi: 70 }, stamina: 25 },
            { id: 'ha_2', name: 'Luyện chế thi khôi', desc: 'Hỗ trợ trưởng lão luyện chế khôi lỗi.', reward: { contribution: 25, tuVi: 600 }, stamina: 45 }
        ]
    }
};

export const getSectById = (id) => SECTS[id];
