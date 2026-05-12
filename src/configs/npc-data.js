import { ASSETS } from './asset-data.js';

export const NPC_PERSONALITIES = {
    'lanh_lung': { id: 'lanh_lung', name: 'Lạnh lùng', desc: 'Ít nói, khó gần, nhưng hành động dứt khoát.' },
    'chinh_truc': { id: 'chinh_truc', name: 'Chính trực', desc: 'Coi trọng đạo lý, ghét kẻ gian tà.' },
    'tham_lam': { id: 'tham_lam', name: 'Tham lam', desc: 'Dễ bị lợi dụ bởi linh thạch và bảo vật.' },
    'kieu_ngao': { id: 'kieu_ngao', name: 'Kiêu ngạo', desc: 'Coi thường kẻ yếu, không chịu khuất phục.' },
    'dien_cuong': { id: 'dien_cuong', name: 'Điên cuồng', desc: 'Hành động khó đoán, dễ rơi vào trạng thái bạo tẩu.' },
    'da_nghi': { id: 'da_nghi', name: 'Đa nghi', desc: 'Khó tin tưởng người khác, luôn đề phòng.' },
    'trung_thanh': { id: 'trung_thanh', name: 'Trung thành', desc: 'Một khi đã kết giao sẽ không bao giờ phản bội.' },
    'hoa_nha': { id: 'hoa_nha', name: 'Hòa nhã', desc: 'Dễ kết bạn, luôn giúp đỡ người khác.' },
    'quy_quyet': { id: 'quy_quyet', name: 'Quỷ quyệt', desc: 'Thích dùng mưu mẹo, không từ thủ đoạn.' }
};

export const NPC_GOALS = {
    'bao_thu': { id: 'bao_thu', name: 'Báo thù', desc: 'Tìm kiếm kẻ thù để rửa hận.' },
    'thanh_tien': { id: 'thanh_tien', name: 'Thành tiên', desc: 'Dồn toàn lực vào tu luyện.' },
    'tim_truyen_thua': { id: 'tim_truyen_thua', name: 'Tìm truyền thừa', desc: 'Khám phá bí cảnh, tìm kiếm di sản cổ đại.' },
    'chan_hung_tong_mon': { id: 'chan_hung_tong_mon', name: 'Chấn hưng tông môn', desc: 'Làm rạng danh tông môn của mình.' },
    'tim_dao_lu': { id: 'tim_dao_lu', name: 'Tìm đạo lữ', desc: 'Mong muốn tìm được người cùng tu hành.' }
};

export const NPC_RELATIONSHIP_LEVELS = [
    { id: 'huyet_hai_tham_thu', name: 'Huyết hải thâm thù', min: -100, max: -81, color: '#ff0000' },
    { id: 'thu_dich', name: 'Thù địch', min: -80, max: -51, color: '#ff4444' },
    { id: 'cam_ghet', name: 'Căm ghét', min: -50, max: -21, color: '#ff8888' },
    { id: 'xa_la', name: 'Xa lạ', min: -20, max: 20, color: '#aaaaaa' },
    { id: 'quen_biet', name: 'Quen biết', min: 21, max: 40, color: '#88ff88' },
    { id: 'dong_minh', name: 'Đồng minh', min: 41, max: 60, color: '#44ff44' },
    { id: 'bang_huu', name: 'Bằng hữu', min: 61, max: 80, color: '#00ff00' },
    { id: 'sinh_tu_chi_giao', name: 'Sinh tử chi giao', min: 81, max: 100, color: '#ffff00' }
];

export const NPC_SPECIAL_RELATIONS = {
    'dao_lu': { name: 'Đạo lữ', desc: 'Bạn đời cùng tu hành.' },
    'su_do': { name: 'Sư đồ', desc: 'Mối quan hệ thầy trò.' },
    'gia_toc': { name: 'Gia tộc', desc: 'Người cùng dòng máu.' },
    'chu_to': { name: 'Chủ tớ', desc: 'Mối quan hệ khế ước.' }
};

export const NPC_TEMPLATES = {
    'tan_tu': {
        type: 'tan_tu',
        title: 'Tán Tu',
        portrait: ASSETS.portraits.cultivator_male,
        personalities: ['hoa_nha', 'da_nghi', 'tham_lam'],
        roles: ['Sword', 'Mage'],
        storyArcs: ['truy_sat', 'tim_su_phu'],
        dialogues: {
            'meet': ['Đạo hữu xin dừng bước! Cảnh đẹp thế này, có muốn cùng đàm đạo không?', 'Gặp nhau là cái duyên, đạo hữu có thấy linh khí ở đây rất lạ không?'],
            'friendly': ['Chúng ta quả là tâm đầu ý hợp!', 'Đạo hữu, đây là chút tâm ý của ta.'],
            'hostile': ['Muốn cướp của ta? Ngươi còn non lắm!', 'Hôm nay ta sẽ cho ngươi biết thế nào là lễ độ!'],
            'memory_helped': ['Lần trước đa tạ đạo hữu đã tương trợ.', 'Hành động hiệp nghĩa của đạo hữu, ta vẫn luôn ghi nhớ.'],
            'memory_betrayed': ['Kẻ phản bội như ngươi, còn dám vác mặt đến đây?', 'Hừ, ta đã nhìn lầm ngươi rồi!']
        }
    },
    'ma_tu': {
        type: 'ma_tu',
        title: 'Ma Tu',
        portrait: ASSETS.portraits.demon,
        personalities: ['dien_cuong', 'quy_quyet'],
        roles: ['Sword', 'Mage', 'Tank'],
        storyArcs: ['tranh_ba', 'bao_thu'],
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
        personalities: ['hoa_nha', 'da_nghi'],
        roles: ['Mage'],
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
        personalities: ['lanh_lung', 'chinh_truc'],
        roles: ['Sword', 'Mage', 'Tank', 'Healer'],
        dialogues: {
            'meet': ['Hậu sinh khả úy, tư chất của ngươi không tệ.', 'Tu tiên là con đường gian nan, ngươi đã sẵn sàng chưa?'],
            'friendly': ['Nếu ngươi muốn nhập môn, ta có thể tiến cử.'],
            'hostile': ['Ngươi dám xúc phạm uy nghiêm tông môn ta?']
        }
    },
    'thien_kieu': {
        type: 'thien_kieu',
        title: 'Thiên Kiêu',
        portrait: ASSETS.portraits.cultivator_female,
        personalities: ['kieu_ngao', 'chinh_truc'],
        roles: ['Sword', 'Mage'],
        isFateChild: true,
        dialogues: {
            'meet': ['Ngươi cũng là người tu hành sao? Trông thật bình thường.', 'Tránh ra, đừng cản đường ta tìm kiếm cơ duyên.'],
            'friendly': ['Không ngờ ở nơi hẻo lánh này lại gặp được người như ngươi.', 'Nếu có thể đuổi kịp bước chân ta, ta sẽ coi ngươi là đối thủ.'],
            'hostile': ['Ngươi muốn khiêu chiến ta? Thật nực cười!']
        }
    }
};

