import { ASSETS } from './assets.js';

export const NPC_TEMPLATES = {
    'tan_tu': {
        type: 'tan_tu',
        title: 'Tán Tu',
        portrait: ASSETS.portraits.cultivator_male,
        personalities: ['Nhiệt tình', 'Cẩn trọng', 'Tham lam'],
        dialogues: {
            'meet': ['Đạo hữu xin dừng bước! Cảnh đẹp thế này, có muốn cùng đàm đạo không?', 'Gặp nhau là cái duyên, đạo hữu có thấy linh khí ở đây rất lạ không?'],
            'friendly': ['Chúng ta quả là tâm đầu ý hợp!', 'Đạo hữu, đây là chút tâm ý của ta.'],
            'hostile': ['Muốn cướp của ta? Ngươi còn non lắm!', 'Hôm nay ta sẽ cho ngươi biết thế nào là lễ độ!']
        }
    },
    'ma_tu': {
        type: 'ma_tu',
        title: 'Ma Tu',
        portrait: ASSETS.portraits.demon,
        personalities: ['Hung tàn', 'Quỷ quyệt'],
        dialogues: {
            'meet': ['Hừ, lại một tên kiến hôi nữa nộp mạng.', 'Giao túi đồ ra đây, ta sẽ cho ngươi chết thanh thản.'],
            'friendly': ['Ngươi có tố chất ma đạo đấy...', 'Thú vị, kẻ như ngươi mà cũng muốn làm bạn với ta?'],
            'hostile': ['Vạn hồn quy nhất! Chết đi!']
        }
    },
    'thuong_nhan': {
        type: 'thuong_nhan',
        title: 'Thương Nhân Thần Bí',
        portrait: ASSETS.portraits.merchant,
        personalities: ['Hòa nhã'],
        dialogues: {
            'meet': ['Lại đây đạo hữu, đồ tốt giá hời đây!', 'Chỗ ta không thiếu thứ gì, chỉ thiếu linh thạch của ngươi thôi.'],
            'friendly': ['Khách quen có khác, ta sẽ bớt cho ngươi.'],
            'hostile': ['Ngươi dám quấy phá việc làm ăn của ta?']
        }
    },
    'sect_elder': {
        type: 'sect_elder',
        title: 'Trưởng Lão Tông Môn',
        portrait: ASSETS.portraits.sect_elder,
        personalities: ['Uy nghiêm', 'Thanh cao'],
        dialogues: {
            'meet': ['Hậu sinh khả úy, tư chất của ngươi không tệ.', 'Tu tiên là con đường gian nan, ngươi đã sẵn sàng chưa?'],
            'friendly': ['Nếu ngươi muốn nhập môn, ta có thể tiến cử.'],
            'hostile': ['Ngươi dám xúc phạm uy nghiêm tông môn ta?']
        }
    }
};
