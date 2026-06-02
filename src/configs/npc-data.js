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
    },
    'ma_than': {
        type: 'ma_than',
        title: 'Thần Linh Ma Tộc',
        portrait: ASSETS.portraits.demon,
        personalities: ['lanh_lung', 'kieu_ngao'],
        roles: ['Sword', 'Mage'],
        dialogues: {
            'meet': ['Phàm nhân bé nhỏ, ngươi dám đứng trước tôn nhan của Ma Thần?', 'Ý chí của ta chính là quy luật của vương quốc này.'],
            'friendly': ['Ngươi có chút tiềm năng để trở thành tín đồ của ta.'],
            'hostile': ['Thái Sơ Ma Chưởng! Hãy tan thành tro bụi!']
        }
    },
    'ma_vuong': {
        type: 'ma_vuong',
        title: 'Chủ Tể Ma Quốc',
        portrait: ASSETS.portraits.demon,
        personalities: ['kieu_ngao', 'quy_quyet'],
        roles: ['Sword', 'Tank'],
        dialogues: {
            'meet': ['Vương triều của ta kéo dài vạn dặm, tiên ma đều phải kính sợ.', 'Có việc gì dâng lên Bản Vương?'],
            'friendly': ['Bản Vương rất hài lòng với lòng trung thành của ngươi.'],
            'hostile': ['Dám khiêu chiến uy quyền hoàng tộc Ma tộc? Chết!']
        }
    },
    'ma_tuong': {
        type: 'ma_tuong',
        title: 'Hộ Quốc Ma Tướng',
        portrait: ASSETS.portraits.demon,
        personalities: ['lanh_lung', 'dien_cuong'],
        roles: ['Sword', 'Tank', 'Mage'],
        dialogues: {
            'meet': ['Bản Tướng canh giữ nơi này vạn năm, kẻ xâm nhập đều phải chết!', 'Ngươi mang sát khí của ma đạo, tốt lắm.'],
            'friendly': ['Nếu ngươi muốn lập công, bản tướng có thể trọng dụng.'],
            'hostile': ['Lưỡi kiếm ma quân sẽ nhuốm máu của ngươi!']
        }
    },
    'ma_binh': {
        type: 'ma_binh',
        title: 'Tinh Binh Ma Tộc',
        portrait: ASSETS.portraits.demon,
        personalities: ['dien_cuong', 'lanh_lung'],
        roles: ['Sword', 'Tank'],
        dialogues: {
            'meet': ['Tránh ra! Việc quân khẩn cấp!', 'Kẻ nào dám bén mảng đến lãnh địa ma quân?'],
            'friendly': ['Cùng nhau vì Ma giới chiến đấu!'],
            'hostile': ['Sát! Tiêu diệt kẻ xâm lược!']
        }
    },
    'ma_dan': {
        type: 'ma_dan',
        title: 'Bình Dân Ma Tộc',
        portrait: ASSETS.portraits.demon,
        personalities: ['hoa_nha', 'tham_lam', 'da_nghi'],
        roles: ['Mage', 'Healer'],
        dialogues: {
            'meet': ['Cuộc sống ở Ma giới thật tàn khốc, nhưng chúng ta vẫn phải sinh tồn.', 'Có linh thạch hắc ám không? Ta muốn đổi bảo vật.'],
            'friendly': ['Ngươi quả là một ma nhân tốt tính.'],
            'hostile': ['Đừng tưởng bình dân thì dễ bắt nạt!']
        }
    }
};

export const SPECIAL_NPCS = {
    'han_phi_vu': {
        id: 'han_phi_vu',
        name: 'Hàn Phi Vũ',
        gender: 'Nam',
        title: 'Thanh Nh Nhàn Tán Tu',
        portrait: ASSETS.portraits.han_phi_vu,
        personality: NPC_PERSONALITIES_KEYS.DA_NGHI,
        goal: NPC_GOALS_KEYS.THANH_TIEN,
        role: 'Kiếm Tu',
        isRomanceable: true,
        desc: 'Một vị tán tu bí ẩn, hành sự cẩn trọng, tâm cơ thâm trầm. Luôn mang theo một chiếc bình nhỏ màu xanh bên mình.',
        dialogues: {
            'meet': ['Đạo hữu, tu tiên giới hiểm ác, tốt nhất đừng nên quá tin tưởng bất kỳ ai.', 'Gặp gỡ là duyên, nhưng duyên phận cũng có khi là họa.'],
            'friendly': ['Trên con đường trường sinh cô độc này, có ngươi làm bạn cũng không tệ.'],
            'romance': ['Nếu ngươi nguyện ý, chúng ta có thể cùng nhau tìm kiếm đại đạo.'],
            'special_move': ['Thanh Nguyên Kiếm Quyết!']
        }
    },
    'bach_tu_linh': {
        id: 'bach_tu_linh',
        name: 'Bạch Tử Linh',
        gender: 'Nam',
        title: 'Đan Đạo Thiên Tài',
        portrait: ASSETS.portraits.bach_tu_linh,
        personality: NPC_PERSONALITIES_KEYS.HOA_NHA,
        goal: NPC_GOALS_KEYS.TIM_TRUYEN_THUA,
        role: 'Luyện Đan Sư',
        isRomanceable: true,
        desc: 'Trưởng lão trẻ tuổi nhất của Đan Hà Phái, thiên phú luyện đan cực cao, khí chất ôn nhu như ngọc.',
        dialogues: {
            'meet': ['Mùi linh dược trên người đạo hữu thật đặc biệt, có muốn cùng ta trao đổi tâm đắc luyện đan không?', 'Đan đạo cũng như nhân sinh, cần nhất là sự kiên trì.'],
            'friendly': ['Đây là đan dược ta mới luyện thành, tặng cho đạo hữu phòng thân.'],
            'romance': ['Lòng ta đã định, đời này chỉ nguyện cùng ngươi kết làm đạo lữ.'],
            'special_move': ['Cửu Chuyển Kim Đan Hỏa!']
        }
    },
    'du_nhuoc_nhan': {
        id: 'du_nhuoc_nhan',
        name: 'Du Nhược Nhan',
        gender: 'Nữ',
        title: 'Lạc Nhạn Tiên Tử',
        portrait: ASSETS.portraits.du_nhuoc_nhan,
        personality: NPC_PERSONALITIES_KEYS.KIEU_NGAO,
        goal: NPC_GOALS_KEYS.CHAN_HUNG_TON_MON,
        role: 'Âm Nhạc Tu',
        isRomanceable: true,
        desc: 'Đại sư tỷ của Linh Âm Các, sở hữu dung mạo tuyệt thế và khả năng dùng tiếng đàn điều khiển linh khí.',
        dialogues: {
            'meet': ['Tiếng đàn của ta không dành cho kẻ phàm phu tục tử.', 'Ngươi có thể nghe hiểu ý vị trong khúc nhạc này sao?'],
            'friendly': ['Khúc nhạc này, ta chỉ đàn cho một mình ngươi nghe.'],
            'romance': ['Thế gian vạn dặm, tâm ta chỉ gửi gắm nơi tiếng đàn và... nơi ngươi.'],
            'special_move': ['Thiên Ma Cầm Âm!']
        }
    },
    'phuong_ca': {
        id: 'phuong_ca',
        name: 'Phương Ca',
        gender: 'Nữ',
        title: 'Vạn Bảo Các Chủ',
        portrait: ASSETS.portraits.phuong_ca,
        personality: NPC_PERSONALITIES_KEYS.QUY_QUYET,
        goal: NPC_GOALS_KEYS.TIM_DAO_LU,
        role: 'Trận Pháp Sư',
        isRomanceable: true,
        desc: 'Thương nhân bí ẩn nắm giữ vạn bảo, tinh thông trận pháp, tính tình biến hóa khôn lường.',
        dialogues: {
            'meet': ['Trên đời này không có gì là không thể mua được bằng linh thạch, kể cả mạng sống.', 'Muốn xem bảo vật của ta? Phải xem ngươi có đủ thành ý không.'],
            'friendly': ['Lần này ta sẽ giảm giá cho ngươi, coi như là phí kết giao.'],
            'romance': ['Vạn bảo của ta đều thuộc về ta, còn ta... thuộc về ngươi.'],
            'special_move': ['Bát Quái Tru Tiên Trận!']
        }
    },
    'phuong_vu': {
        id: 'phuong_vu',
        name: 'Phương Vũ',
        gender: 'Nữ',
        title: 'Tuyệt Thế Kiếm Cơ',
        portrait: ASSETS.portraits.phuong_vu,
        personality: NPC_PERSONALITIES_KEYS.LANH_LUNG,
        goal: NPC_GOALS_KEYS.BAO_THU,
        role: 'Kiếm Tu',
        isRomanceable: true,
        desc: 'Một nữ kiếm tu lãnh đạm, kiếm ý lạnh thấu xương, một lòng vì kiếm, không vướng hồng trần.',
        dialogues: {
            'meet': ['Kiếm của ta chỉ dùng để giết người, không dùng để đàm đạo.', 'Ngươi có thể đỡ được một kiếm của ta không?'],
            'friendly': ['Kiếm ý của ngươi... có chút hơi ấm.'],
            'romance': ['Đời này, kiếm là mạng, ngươi là tâm.'],
            'special_move': ['Vạn Kiếm Quy Tông!']
        }
    },
    'tran_tu_huyen': {
        id: 'tran_tu_huyen',
        name: 'Trần Tử Huyền',
        gender: 'Nữ',
        title: 'U Minh Thánh Nữ',
        portrait: ASSETS.portraits.tran_tu_huyen,
        personality: NPC_PERSONALITIES_KEYS.DIEN_CUONG,
        goal: NPC_GOALS_KEYS.CHAN_HUNG_TON_MON,
        role: 'Phù Lục Sư',
        isRomanceable: true,
        desc: 'Thánh nữ của Ma Đạo tông môn, hành sự tàn độc nhưng lại có thiên phú về phù lục chi đạo.',
        dialogues: {
            'meet': ['Máu của ngươi... trông thật rực rỡ.', 'Muốn nếm thử uy lực của Ma Phù không?'],
            'friendly': ['Ngươi thật thú vị, ta không nỡ giết ngươi nữa rồi.'],
            'romance': ['Dù là tiên hay ma, ta chỉ muốn cùng ngươi đi đến tận cùng.'],
            'special_move': ['U Minh Huyết Phù!']
        }
    },
    'xich_nguyet': {
        id: 'xich_nguyet',
        name: 'Xích Nguyệt',
        gender: 'Nữ',
        title: 'Yêu Tộc Chiến Cơ',
        portrait: ASSETS.portraits.xich_nguyet,
        personality: NPC_PERSONALITIES_KEYS.TRUNG_THANH,
        goal: NPC_GOALS_KEYS.BAO_THU,
        role: 'Luyện Thể',
        isRomanceable: true,
        desc: 'Chiến binh mạnh mẽ nhất của Lang tộc, sở hữu sức mạnh nhục thân kinh người và ý chí kiên định.',
        dialogues: {
            'meet': ['Kẻ yếu không có quyền lên tiếng ở đây.', 'Ngươi có đủ sức mạnh để khiến ta phục tùng không?'],
            'friendly': ['Ngươi đã chứng minh được bản lĩnh của mình.'],
            'romance': ['Tộc của ta chỉ có một bạn đời duy nhất, và ta đã chọn ngươi.'],
            'special_move': ['Thiên Lang Khiếu Nguyệt!']
        }
    },
    'han_lap': {
        id: 'han_lap',
        name: 'Hàn Lập',
        gender: 'Nam',
        title: 'Qingyuan Phủ Chủ',
        portrait: ASSETS.portraits.han_lap,
        personality: NPC_PERSONALITIES_KEYS.DA_NGHI,
        goal: NPC_GOALS_KEYS.THANH_TIEN,
        role: 'Kiếm Tu',
        isRomanceable: false,
        desc: 'Palace Master của Thanh Nguyên Đường, hành sự vô cùng cẩn trọng, thực lực sâu khôn lường, sở hữu thần bí chí bảo.',
        dialogues: {
            'meet': ['Đạo hữu có việc gì? Tại hạ chỉ là một tu sĩ bình thường đi ngang qua.', 'Cẩn thận vẫn hơn. Trên đời này, không có gì là hoàn toàn an toàn.'],
            'friendly': ['Đạo hữu nói năng thành thật, tính tình hợp ý. Đây là mấy viên Chân Nguyên Đan ta tự tay luyện chế, tặng cho ngươi.'],
            'romance': ['Đạo tâm của ta kiên cố như sắt đá, không bàn chuyện hồng trần.'],
            'special_move': ['Thanh Trúc Phong Vân Kiếm Trận!']
        }
    },
    'tu_linh': {
        id: 'tu_linh',
        name: 'Tử Linh Tiên Tử',
        gender: 'Nữ',
        title: 'Đệ Nhất Diệu Nhân',
        portrait: ASSETS.portraits.tu_linh,
        personality: NPC_PERSONALITIES_KEYS.HOA_NHA,
        goal: NPC_GOALS_KEYS.THANH_TIEN,
        role: 'Pháp Sư',
        isRomanceable: true,
        desc: 'Nữ tử sở hữu dung nhan tuyệt mỹ nhất Tinh Giới, tính tình ôn nhu thanh nhã, tri âm tri kỷ của Hàn Lập.',
        dialogues: {
            'meet': ['Thiếp thân Tử Linh, xin kính chào đạo hữu. Không biết hôm nay có duyên đàm đạo?', 'Con đường tu tiên thật nhiều chông gai, gặp được đạo hữu quả là niềm vui.'],
            'friendly': ['Cùng đạo hữu trò chuyện thật khiến thiếp thân cảm thấy vui vẻ khôn xiết.'],
            'romance': ['Gặp gỡ chàng giữa nhân gian đầy rẫy sóng gió này, chính là nhân duyên lớn nhất cuộc đời thiếp.'],
            'special_move': ['Thiên Diệu Linh Hồn Vũ!']
        }
    },
    'kiem_vo_tam': {
        id: 'kiem_vo_tam',
        name: 'Kiếm Vô Tâm',
        gender: 'Nam',
        title: 'Vô Tình Kiếm Khách',
        portrait: ASSETS.portraits.kiem_vo_tam,
        personality: NPC_PERSONALITIES_KEYS.LANH_LUNG,
        goal: NPC_GOALS_KEYS.BAO_THU,
        role: 'Kiếm Tu',
        isRomanceable: false,
        desc: 'Kiếm tu cuồng nhiệt của Thiên Kiếm Tông, một lòng tìm kiếm cực hạn kiếm đạo, hành sự dứt khoát lạnh lùng.',
        dialogues: {
            'meet': ['Kiếm của ta chỉ dùng để sát địch. Tránh ra!', 'Ngươi có muốn thử xem kiếm của ta nhanh thế nào không?'],
            'friendly': ['Ngươi cũng có khí khái kiếm tu. Có nhã hứng luận bàn vài kiếm?'],
            'romance': ['Hồng phấn giai nhân chỉ là mây khói, ta chỉ bầu bạn cùng kiếm.'],
            'special_move': ['Vạn Kiếm Quy Tông!']
        }
    },
    'vo_danh': {
        id: 'vo_danh',
        name: 'Vô Danh Đạo Nhân',
        gender: 'Nam',
        title: 'Thần Bí Cao Nhân',
        portrait: ASSETS.portraits.vo_danh,
        personality: NPC_PERSONALITIES_KEYS.CHINH_TRUC,
        goal: NPC_GOALS_KEYS.TIM_TRUYEN_THUA,
        role: 'Trận Pháp Sư',
        isRomanceable: false,
        desc: 'Vị cao nhân lánh đời lai lịch bí ẩn, tinh thông thiên địa trận pháp và cổ thuật kỳ bí.',
        dialogues: {
            'meet': ['Thế sự như bàn cờ, một quân cờ nhỏ cũng có thể chuyển xoay càn khôn.', 'Hữu duyên thiên lý năng tương ngộ, vô duyên đối diện bất tương phùng.'],
            'friendly': ['Ngộ tính của ngươi rất tốt, có muốn nghe ta giảng giải về bát quái trận pháp?'],
            'romance': ['Đạo pháp vô biên, tu đạo vạn năm, hồng trần dĩ vãng...'],
            'special_move': ['Thiên Địa Cửu Cung Trận!']
        }
    },
    'bang_nguyet': {
        id: 'bang_nguyet',
        name: 'Băng Nguyệt Tiên Tử',
        gender: 'Nữ',
        title: 'Cực Hàn Cung Chủ',
        portrait: ASSETS.portraits.bang_nguyet,
        personality: NPC_PERSONALITIES_KEYS.LANH_LUNG,
        goal: NPC_GOALS_KEYS.THANH_TIEN,
        role: 'Pháp Sư',
        isRomanceable: true,
        desc: 'Cung chủ trẻ tuổi của Cực Cung, băng cơ ngọc cốt, quanh năm tu luyện nơi băng giá tột cùng.',
        dialogues: {
            'meet': ['Nơi này hàn khí cực thịnh, phàm nhân không nên ở lâu.', 'Ta thích sự yên tĩnh, xin đừng làm phiền ta tu luyện.'],
            'friendly': ['Ngươi không sợ hàn băng chi lực của ta sao? Tính tình thật là kiên định.'],
            'romance': ['Băng giá vạn năm trong lòng ta, tựa hồ đang dần tan chảy dưới sự ấm áp của ngươi.'],
            'special_move': ['Cực Băng Tuyệt Diệt Kích!']
        }
    },
    'thanh_lien': {
        id: 'thanh_lien',
        name: 'Thanh Liên',
        gender: 'Nữ',
        title: 'Tịnh Độ Thánh Nữ',
        portrait: ASSETS.portraits.thanh_lien,
        personality: NPC_PERSONALITIES_KEYS.CHINH_TRUC,
        goal: NPC_GOALS_KEYS.CHAN_HUNG_TON_MON,
        role: 'Phù Lục Sư',
        isRomanceable: true,
        desc: 'Thánh nữ của Phật Tông Tịnh Thổ, thánh thiện từ bi, sở hữu khả năng tịnh hóa tà ma ngoại đạo.',
        dialogues: {
            'meet': ['A Di Đà Phật. Đạo hữu ấn đường có chút đen, có cần bần ni tịnh hóa sát khí?', 'Chúng sinh bình đẳng, tu tiên trước tiên phải tu tâm.'],
            'friendly': ['Tâm tính của đạo hữu rất lương thiện, phật tổ sẽ bảo hộ cho ngươi.'],
            'romance': ['Dù là đệ tử phật môn, nhưng duyên trần đã kết, bần ni nguyện cùng đạo hữu đồng hành.'],
            'special_move': ['Cửu Phẩm Thanh Liên Phù!']
        }
    },
    'thanh_nhi': {
        id: 'thanh_nhi',
        name: 'Thanh Nhi',
        gender: 'Nữ',
        title: 'Linh Hồ Đệ Tử',
        portrait: ASSETS.portraits.thanh_nhi,
        personality: NPC_PERSONALITIES_KEYS.HOA_NHA,
        goal: NPC_GOALS_KEYS.TIM_DAO_LU,
        role: 'Trị Liệu Sư',
        isRomanceable: true,
        desc: 'Thiếu nữ Linh Hồ tộc ngây thơ hoạt bát, tinh thông mộc hệ linh thuật và y thuật trị liệu.',
        dialogues: {
            'meet': ['Chào đạo hữu! Nhìn kìa, bông hoa kia thật đẹp phải không?', 'Ngươi có muốn thử bánh ngọt ta tự làm không? Rất ngon đó!'],
            'friendly': ['Có đạo hữu ở bên, Thanh Nhi cảm thấy rất an toàn và vui vẻ!'],
            'romance': ['Thanh Nhi muốn cùng đạo hữu ngắm hoa xuân, thưởng tuyết đông suốt đời suốt kiếp.'],
            'special_move': ['Vạn Vật Hồi Xuân Thuật!']
        }
    },
    'bach_minh_anh': {
        id: 'bach_minh_anh',
        name: 'Bạch Minh Anh',
        gender: 'Nữ',
        title: 'Thái Nhất Kiếm Cơ',
        portrait: ASSETS.portraits.bach_minh_anh,
        personality: NPC_PERSONALITIES_KEYS.KIEU_NGAO,
        goal: NPC_GOALS_KEYS.CHAN_HUNG_TON_MON,
        role: 'Kiếm Tu',
        isRomanceable: true,
        desc: 'Thiên tài xuất chúng kiêu ngạo hạt nhân Thái Nhất Môn, ngộ tính kiếm đạo thượng thừa.',
        dialogues: {
            'meet': ['Chỉ với tu vi đó mà cũng muốn bắt chuyện với ta?', 'Kiếm pháp của ta là đệ nhất, không tin cứ thử xem!'],
            'friendly': ['Cũng tạm được, coi như ngươi có chút bản lĩnh để đứng cạnh ta.'],
            'romance': ['Trong mắt ta từng chỉ có kiếm, nhưng giờ... đã có thêm một bóng hình.'],
            'special_move': ['Thái Nhất Huyền Thiên Kiếm!']
        }
    },
    'han_vien': {
        id: 'han_vien',
        name: 'Hàn Viên',
        gender: 'Nam',
        title: 'Thanh Nhàn Ma Tu',
        portrait: ASSETS.portraits.han_vien,
        personality: NPC_PERSONALITIES_KEYS.QUY_QUYET,
        goal: NPC_GOALS_KEYS.TIM_TRUYEN_THUA,
        role: 'Trận Pháp Sư',
        isRomanceable: false,
        desc: 'Vị ma tu quỷ quyệt giỏi ẩn nấp hành tung, ưa thích thám hiểm cổ mộ bí cảnh.',
        dialogues: {
            'meet': ['Khặc khặc, cẩn thận kẻo giẫm phải cạm bẫy của ta nhé.', 'Ma pháp trận này ta vừa bố trí xong, ngươi chớ táy máy.'],
            'friendly': ['Tính khí ngươi thật thú vị, ta sẽ chia cho ngươi 3 phần chiến lợi phẩm mộ cổ lần này.'],
            'romance': ['Ta là ma tu hung tàn, không thích nhi nữ tình trường.'],
            'special_move': ['Hắc Ma Sát Trận!']
        }
    },
    'lan_anh': {
        id: 'lan_anh',
        name: 'Lan Anh Tiên Tử',
        gender: 'Nữ',
        title: 'Đan Hà Thánh Nữ',
        portrait: ASSETS.portraits.lan_anh,
        personality: NPC_PERSONALITIES_KEYS.HOA_NHA,
        goal: NPC_GOALS_KEYS.TIM_DAO_LU,
        role: 'Luyện Đan Sư',
        isRomanceable: true,
        desc: 'Dược sư trưởng lão tài hoa ôn hòa Đan Hà Phái, đam mê chăm sóc linh dược và đan dược.',
        dialogues: {
            'meet': ['Chào đạo hữu, linh thảo này là Đan Vân Thảo rất quý hiếm.', 'Tu tiên giới cần nhất là đan dược hộ mệnh, đạo hữu đã chuẩn bị chưa?'],
            'friendly': ['Ta vừa luyện xong một lò dưỡng thần đan, tặng cho đạo hữu dưỡng thần.'],
            'romance': ['Luyện đan ngàn năm cũng không sánh bằng một khắc ngọt ngào bên đạo hữu.'],
            'special_move': ['Đan Hà Vạn Hỏa Trận!']
        }
    },
    'minh_nguyet': {
        id: 'minh_nguyet',
        name: 'Minh Nguyệt',
        gender: 'Nữ',
        title: 'Yểm Nguyệt Đệ Tử',
        portrait: ASSETS.portraits.minh_nguyet,
        personality: NPC_PERSONALITIES_KEYS.HOA_NHA,
        goal: NPC_GOALS_KEYS.THANH_TIEN,
        role: 'Pháp Sư',
        isRomanceable: true,
        desc: 'Môn đồ kiệt xuất Yểm Nguyệt Tông, dung mạo thanh khiết và giỏi ảo thuật thuật.',
        dialogues: {
            'meet': ['Đạo hữu xin chào. Cảnh trăng đêm nay thật đẹp, thích hợp đàm đạo.', 'Yểm nguyệt chi thuật ảo diệu khôn lường, đạo hữu chớ để sa vào ảo cảnh.'],
            'friendly': ['Đạo hữu thật chính trực, khiến thiếp thân cảm thấy vô cùng thoải mái.'],
            'romance': ['Trong ảo cảnh đẹp đẽ nhất của thiếp thân, người nắm tay thiếp chính là chàng.'],
            'special_move': ['Yểm Nguyệt Ảo Vũ Thuật!']
        }
    },
    'bach_thanh_anh': {
        id: 'bach_thanh_anh',
        name: 'Bạch Thanh Ảnh',
        gender: 'Nữ',
        title: 'Hàn Nguyệt Tiên Tử',
        portrait: ASSETS.portraits.bach_thanh_anh,
        personality: NPC_PERSONALITIES_KEYS.LANH_LUNG,
        goal: NPC_GOALS_KEYS.THANH_TIEN,
        role: 'Băng Hệ Tu Sĩ',
        isRomanceable: true,
        desc: 'Nữ tu sĩ tài sắc vẹn toàn đến từ Hàn Nguyệt Cung, tinh thông băng hệ công pháp, tính tình lạnh lùng nhưng nội tâm ấm áp.',
        dialogues: {
            'meet': ['Ngươi là ai? Đừng lại gần, hàn khí quanh ta có thể đông cứng linh lực.', 'Băng thiên tuyết địa là nơi ta tu luyện, phàm nhân chớ quấy nhiễu.'],
            'friendly': ['Ngươi... là người đầu tiên không sợ hàn khí của ta.'],
            'romance': ['Băng tâm ngàn năm, chỉ vì ngươi mà tan chảy. Từ nay thiên hạ phong tuyết, ta nguyện cùng ngươi đối mặt.'],
            'special_move': ['Vạn Lý Băng Phong!']
        }
    },
    'dong_ninh': {
        id: 'dong_ninh',
        name: 'Đông Ninh',
        gender: 'Nữ',
        title: 'Lãnh Sương Tiên Tử',
        portrait: ASSETS.portraits.dong_ninh,
        personality: NPC_PERSONALITIES_KEYS.LANH_LUNG,
        goal: NPC_GOALS_KEYS.THANH_TIEN,
        role: 'Băng Hệ Tu Sĩ',
        isRomanceable: true,
        desc: 'Truyền nhân Băng Linh tộc, dung mạo tuyệt mỹ nhưng tính cách thanh lãnh như băng tuyết ngàn năm.',
        dialogues: {
            'meet': ['Hàn khí của ta có thể làm đóng băng kinh mạch, đạo hữu đừng lại gần.', 'Linh thú ở đây đang ngủ say, xin đừng làm phiền chúng.'],
            'friendly': ['Ngươi là người đầu tiên chịu đựng được hàn sương thiên phú của ta mà không lùi bước.'],
            'romance': ['Băng thiên tuyết địa cô độc ngàn năm, nay nguyện cùng đạo hữu chia sẻ ấm áp này.'],
            'special_move': ['Cực Hàn Băng Long Phá!']
        }
    },
    'han_chan_quan': {
        id: 'han_chan_quan',
        name: 'Hàn Chân Quân',
        gender: 'Nam',
        title: 'Huyền Minh Chân Quân',
        portrait: ASSETS.portraits.han_chan_quan,
        personality: NPC_PERSONALITIES_KEYS.CHINH_TRUC,
        goal: NPC_GOALS_KEYS.CHAN_HUNG_TON_MON,
        role: 'Trưởng Lão',
        isRomanceable: false,
        desc: 'Vị đại năng lánh đời sở hữu tu vi thông thiên triệt địa, bảo hộ một phương bình an.',
        dialogues: {
            'meet': ['Hậu bối có chí khí. Đi trên con đường nghịch thiên tu hành, đạo tâm phải vững.', 'Tu hành không chỉ luyện khí, mà còn là luyện tâm.'],
            'friendly': ['Lão phu rất thưởng thức sự tiến bộ của ngươi. Hãy nhận lấy bình đan dược này.'],
            'special_move': ['Huyền Minh Thần Lôi!']
        }
    },
    'han_thien_quan': {
        id: 'han_thien_quan',
        name: 'Hàn Thiên Quân',
        gender: 'Nam',
        title: 'Lôi Đình Vô Thượng',
        portrait: ASSETS.portraits.han_thien_quan,
        personality: NPC_PERSONALITIES_KEYS.KIEU_NGAO,
        goal: NPC_GOALS_KEYS.THANH_TIEN,
        role: 'Lôi Tu',
        isRomanceable: false,
        desc: 'Chưởng khống thiên lôi chi lực, tính cách cương trực bá đạo, ghét nhất tà ma ngoại đạo.',
        dialogues: {
            'meet': ['Thiên lôi cuồn cuộn, kẻ lười nhác tu luyện sẽ bị thiên kiếp đánh tan tành!', 'Ngươi có muốn thử tiếp một chiêu thiên lôi của lão phu?'],
            'friendly': ['Khí khái không tệ, dám đón nhận lôi uy của lão phu.'],
            'special_move': ['Cửu Thiên Huyền Sát Đại Lôi Tiệp!']
        }
    },
    'hang_nga': {
        id: 'hang_nga',
        name: 'Hằng Nga',
        gender: 'Nữ',
        title: 'Quảng Hàn Tiên Tử',
        portrait: ASSETS.portraits.hang_nga,
        personality: NPC_PERSONALITIES_KEYS.LANH_LUNG,
        goal: NPC_GOALS_KEYS.THANH_TIEN,
        role: 'Pháp Sư',
        isRomanceable: true,
        desc: 'Tuyệt thế tiên tử cô độc ngự trị tại Quảng Hàn Cung, sở hữu năng lực nguyệt quang huyền diệu.',
        dialogues: {
            'meet': ['Nguyệt quang thanh lãnh, chiếu sáng nhân gian cô quạnh.', 'Ngươi tìm kiếm tiên đạo, có biết tiên giới cũng tịch mịch vô ngần?'],
            'friendly': ['Có người trò chuyện dưới ánh trăng thanh, Quảng Hàn Cung cũng bớt đi vài phần lạnh lẽo.'],
            'romance': ['Nguyện làm chim liền cánh, cùng đạo hữu ngao du vạn dặm tinh không dưới ánh trăng kia.'],
            'special_move': ['Nguyệt Hoa Vô Ảnh Biến!']
        }
    },
    'hua_lap_quoc': {
        id: 'hua_lap_quoc',
        name: 'Hứa Lập Quốc',
        gender: 'Nam',
        title: 'Sát Lục Ma Hồn',
        portrait: ASSETS.portraits.hua_lap_quoc,
        personality: NPC_PERSONALITIES_KEYS.QUY_QUYET,
        goal: NPC_GOALS_KEYS.BAO_THU,
        role: 'Ma Hồn',
        isRomanceable: false,
        desc: 'Linh hồn kiếm linh lanh lợi quỷ quyệt, am hiểu xu nịnh nhưng cũng là đệ nhất sát thủ ma đạo.',
        dialogues: {
            'meet': ['Ối chao! Chủ nhân anh minh thần võ, vạn tuế vạn vạn tuế... Ơ, không phải chủ nhân ta à? Đe dọa ai đấy!', 'Ta là Hứa Lập Quốc, đệ nhất ma hồn tôn quý!'],
            'friendly': ['Đạo hữu quả là anh tuấn phi phàm, có cần ta đi ám sát kẻ thù của ngươi không? Giá cả hữu nghị.'],
            'special_move': ['Sát Lục Ma Kích!']
        }
    },
    'lieu_mi': {
        id: 'lieu_mi',
        name: 'Liễu Mi',
        gender: 'Nữ',
        title: 'Thiên Sát Nữ Ma',
        portrait: ASSETS.portraits.lieu_mi,
        personality: NPC_PERSONALITIES_KEYS.DIEN_CUONG,
        goal: NPC_GOALS_KEYS.BAO_THU,
        role: 'Ma Tu',
        isRomanceable: true,
        desc: 'Nữ ma tu hành sự tàn nhẫn điên cuồng, oán hận thâm sâu, thân thế tràn ngập bi kịch.',
        dialogues: {
            'meet': ['Đàn ông thế gian đều là kẻ bội bạc! Chết đi!... Khoan đã, ngươi có vẻ khác biệt.', 'Đừng nhìn ta bằng ánh mắt đó, ta sẽ móc mắt ngươi ra đấy.'],
            'friendly': ['Ngươi không sợ ta sao? Kẻ điên cuồng như ta cũng cần một tri kỷ.'],
            'romance': ['Ta nguyện vì ngươi nhuốm máu cả thiên hạ, nhưng nếu ngươi phản bội, ta sẽ cùng ngươi đồng quy vu tận.'],
            'special_move': ['Thiên Sát Ma Quang Phá!']
        }
    },
    'lieu_nguyet_nhi': {
        id: 'lieu_nguyet_nhi',
        name: 'Liễu Nguyệt Nhi',
        gender: 'Nữ',
        title: 'Diệu Âm Tiên Cô',
        portrait: ASSETS.portraits.lieu_nguyet_nhi,
        personality: NPC_PERSONALITIES_KEYS.HOA_NHA,
        goal: NPC_GOALS_KEYS.TIM_DAO_LU,
        role: 'Âm Nhạc Tu Sĩ',
        isRomanceable: true,
        desc: 'Cựu môn đồ Diệu Âm Môn, thanh tao thoát tục, gảy đàn tỳ bà khống chế thần hồn kẻ địch.',
        dialogues: {
            'meet': ['Một khúc tỳ bà tiễn hồng trần, đạo hữu có muốn lắng nghe khúc nhạc thanh tâm?', 'Âm luật cũng là một đạo, dung hợp giữa đất trời.'],
            'friendly': ['Đạo hữu thấu hiểu tiếng đàn của thiếp thân, chính là bá nha tử kỳ tái thế.'],
            'romance': ['Từ nay về sau, tiếng đàn của thiếp thân chỉ gảy cho một mình đạo hữu thưởng thức.'],
            'special_move': ['Diệu Âm Nhiếp Hồn Khúc!']
        }
    },
    'ly_mo_uyen': {
        id: 'ly_mo_uyen',
        name: 'Lý Mộ Uyển',
        gender: 'Nữ',
        title: 'Đan Đạo Tông Sư',
        portrait: ASSETS.portraits.ly_mo_uyen,
        personality: NPC_PERSONALITIES_KEYS.HOA_NHA,
        goal: NPC_GOALS_KEYS.TIM_DAO_LU,
        role: 'Luyện Đan Sư',
        isRomanceable: true,
        desc: 'Tuyệt thế đan sư ôn nhu hiền thục, cả đời tình sâu nghĩa nặng với Vương Lâm, ngưng kết đan đạo đỉnh phong.',
        dialogues: {
            'meet': ['Thiếp thân Lý Mộ Uyển, đang tìm kiếm linh dược để luyện chế đan dược.', 'Đạo hữu sắc mặt có chút tái, đan dược này hi vọng có thể giúp được ngươi.'],
            'friendly': ['Có đạo hữu bồi bạn đàm đạo đan thuật, thiếp thân cảm thấy vô cùng vui mừng.'],
            'romance': ['Dù thiên đạo có diệt, luân hồi có chuyển, thiếp vẫn nguyện canh giữ bên chàng mãi mãi.'],
            'special_move': ['Cửu Chuyển Đan Hỏa Trận!']
        }
    },
    'nam_cung_uyen': {
        id: 'nam_cung_uyen',
        name: 'Nam Cung Uyển',
        gender: 'Nữ',
        title: 'Yểm Nguyệt Cựu Tổ',
        portrait: ASSETS.portraits.nam_cung_uyen,
        personality: NPC_PERSONALITIES_KEYS.LANH_LUNG,
        goal: NPC_GOALS_KEYS.THANH_TIEN,
        role: 'Pháp Sư',
        isRomanceable: true,
        desc: 'Trưởng lão của Yểm Nguyệt Tông, dung nhan vô song, cùng Hàn Lập trải qua nhiều kiếp nạn san sẻ đạo lữ.',
        dialogues: {
            'meet': ['Bản cung Nam Cung Uyển. Đạo hữu đến đây có việc gì khẩn cầu?', 'Luân Hồi Thần Công bá đạo dị thường, chớ có coi thường.'],
            'friendly': ['Ngươi quả là người cẩn trọng, tính khí rất giống một người quen của ta.'],
            'romance': ['Mấy ngàn năm tu vi cũng không đổi được một khắc cùng người sánh vai bước qua nhân gian.'],
            'special_move': ['Tố Nữ Luân Hồi Công!']
        }
    },
    'natra': {
        id: 'natra',
        name: 'Natra',
        gender: 'Nam',
        title: 'Tam Thái Tử',
        portrait: ASSETS.portraits.natra,
        personality: NPC_PERSONALITIES_KEYS.DIEN_CUONG,
        goal: NPC_GOALS_KEYS.BAO_THU,
        role: 'Chiến Sĩ',
        isRomanceable: false,
        desc: 'Thần tướng chiến đấu cường đại, sinh ra từ hoa sen, tính tình kiêu ngạo hiếu chiến, sức mạnh vô song.',
        dialogues: {
            'meet': ['Bản thái tử chính là Natra! Ai dám cản đường lôi hỏa thương của ta?', 'Chiến đấu là bản năng của ta, ngươi muốn luận bàn không?'],
            'friendly': ['Ha ha! Sảng khoái! Ngươi có tư cách làm bằng hữu chiến đấu của ta.'],
            'special_move': ['Hỗn Thiên Dải Lụa Càn Khôn Vòng!']
        }
    },
    'ngan_nguyet': {
        id: 'ngan_nguyet',
        name: 'Ngân Nguyệt',
        gender: 'Nữ',
        title: 'Linh Hồ Thánh Nữ',
        portrait: ASSETS.portraits.ngan_nguyet,
        personality: NPC_PERSONALITIES_KEYS.TRUNG_THANH,
        goal: NPC_GOALS_KEYS.TIM_DAO_LU,
        role: 'Triệu Hoán Sư',
        isRomanceable: true,
        desc: 'Linh hồ chuyển thế tôn quý, luôn trung thành tuyệt đối bồi bạn bên cạnh Hàn Lập.',
        dialogues: {
            'meet': ['Ngân Nguyệt bái kiến đạo hữu. Thiếp thân luôn ẩn nấp trong khí linh bảo vật.', 'Đừng lo lắng, Ngân Nguyệt không có ác ý đâu.'],
            'friendly': ['Có thể bồi bạn bên cạnh đạo hữu là niềm vinh hạnh của thiếp thân.'],
            'romance': ['Dù là linh thể hay phàm nhân, Ngân Nguyệt nguyện đời đời kiếp kiếp làm bạn đồng hành cùng chàng.'],
            'special_move': ['Linh Hồ Huyễn Ảnh Tiệp!']
        }
    },
    'ngao_at': {
        id: 'ngao_at',
        name: 'Ngao Ất',
        gender: 'Nam',
        title: 'Đông Hải Long Tử',
        portrait: ASSETS.portraits.ngao_at,
        personality: NPC_PERSONALITIES_KEYS.KIEU_NGAO,
        goal: NPC_GOALS_KEYS.CHAN_HUNG_TON_MON,
        role: 'Long Tộc Tu Sĩ',
        isRomanceable: false,
        desc: 'Thái tử Đông Hải Long tộc kiêu ngạo tôn quý, sở hữu huyết mạch chân long cực kỳ nồng đậm.',
        dialogues: {
            'meet': ['Long tộc chí tôn không dung thứ cho sự bất kính của phàm nhân!', 'Linh thạch hạ phẩm kia mà cũng dám đem ra trước mặt ta?'],
            'friendly': ['Ngươi có chút khí tức khiến bản thái tử cảm thấy thoải mái.'],
            'special_move': ['Chân Long Nộ Hống!']
        }
    },
    'thien_van_tu': {
        id: 'thien_van_tu',
        name: 'Thiên Vân Tử',
        gender: 'Nam',
        title: 'Thiên Vân Tông Chủ',
        portrait: ASSETS.portraits.thien_van_tu,
        personality: NPC_PERSONALITIES_KEYS.CHINH_TRUC,
        goal: NPC_GOALS_KEYS.CHAN_HUNG_TON_MON,
        role: 'Tông Chủ',
        isRomanceable: false,
        desc: 'Tông chủ chính trực của Thiên Vân Tông, luôn dốc lòng vì sự hưng thịnh của môn phái và đệ tử.',
        dialogues: {
            'meet': ['Chào mừng đạo hữu ghé thăm Thiên Vân Tông. Mong rằng ngươi thu hoạch được cơ duyên.', 'Đại cục vi trọng, làm người tu hành chớ nên ích kỷ.'],
            'friendly': ['Tấm lòng nghĩa hiệp của đạo hữu quả thực đáng quý. Thiên Vân Tông luôn mở rộng cửa đón chào.'],
            'special_move': ['Thiên Vân Vô Cực Trận!']
        }
    },
    'tieu_ngan_nguyet': {
        id: 'tieu_ngan_nguyet',
        name: 'Tiểu Ngân Nguyệt',
        gender: 'Nữ',
        title: 'Cửu Vĩ Linh Hồ',
        portrait: ASSETS.portraits.tieu_ngan_nguyet,
        personality: NPC_PERSONALITIES_KEYS.HOA_NHA,
        goal: NPC_GOALS_KEYS.TIM_DAO_LU,
        role: 'Trị Liệu Sư',
        isRomanceable: true,
        desc: 'Ấn ký Cửu Vĩ hồ linh nhỏ bé ngây thơ xinh xắn, thích ăn linh quả và dạo chơi.',
        dialogues: {
            'meet': ['Chào đạo hữu! Người có linh quả ngon ngon cho ta ăn không nha?', 'Ngân Nguyệt thích chơi đùa cùng ngươi nhất!'],
            'friendly': ['Oa, đạo hữu tốt bụng quá, Ngân Nguyệt sẽ giúp người trị thương nè.'],
            'romance': ['Mãi mãi bám lấy đạo hữu, không bao giờ buông ra đâu nha!'],
            'special_move': ['Cửu Vĩ Linh Hộ Hồi Xuân!']
        }
    },
    'tu_do_nam': {
        id: 'tu_do_nam',
        name: 'Tư Đồ Nam',
        gender: 'Nam',
        title: 'Thiên Sát Tà Tôn',
        portrait: ASSETS.portraits.tu_do_nam,
        personality: NPC_PERSONALITIES_KEYS.QUY_QUYET,
        goal: NPC_GOALS_KEYS.TIM_TRUYEN_THUA,
        role: 'Tiên Nhân Hồn Thể',
        isRomanceable: false,
        desc: 'Lão tổ anh linh tà phái tự do phóng khoáng, tính khí quái đản bất tuân thiên địa đạo lý.',
        dialogues: {
            'meet': ['Khặc khặc! Bản tôn Tư Đồ Nam lại xuất thế rồi! Tiểu tử kia, có muốn bái bản tôn làm sư phụ?', 'Tu tiên là nghịch thiên nhi hành, tu cái gì phật đạo chính nghĩa giả tạo đó!'],
            'friendly': ['Ngươi thật có cá tính của ma tu tà tôn ta. Rất hợp khẩu vị lão phu.'],
            'special_move': ['Thiên Sát Tà Quang Diệt!']
        }
    },
    'vuong_co_than': {
        id: 'vuong_co_than',
        name: 'Vương Cô Thần',
        gender: 'Nam',
        title: 'Cô Thần Kiếm Chủ',
        portrait: ASSETS.portraits.vuong_co_than,
        personality: NPC_PERSONALITIES_KEYS.LANH_LUNG,
        goal: NPC_GOALS_KEYS.BAO_THU,
        role: 'Kiếm Tu',
        isRomanceable: false,
        desc: 'Kiếm khách cô độc tuyệt đỉnh môn phái, lấy sát lục rèn giũa ý chí kiếm đạo của bản thân.',
        dialogues: {
            'meet': ['Độc hành cô độc chính là số mệnh của kiếm khách.', 'Kiếm xuất vỏ là phải thấy máu.'],
            'friendly': ['Ta ngửi thấy ý chí kiếm đạo mãnh liệt từ ngươi. Chúng ta cùng rèn kiếm nhé.'],
            'special_move': ['Tuyệt Mệnh Cô Thần Nhất Kiếm!']
        }
    },
    'vuong_ma_than': {
        id: 'vuong_ma_than',
        name: 'Vương Ma Thần',
        gender: 'Nam',
        title: 'Cổ Thần Thần Lực',
        portrait: ASSETS.portraits.vuong_ma_than,
        personality: NPC_PERSONALITIES_KEYS.LANH_LUNG,
        goal: NPC_GOALS_KEYS.CHAN_HUNG_TON_MON,
        role: 'Thần Lực Luyện Thể',
        isRomanceable: false,
        desc: 'Cổ thần vĩ đại chấn nhiếp bát hoang, nhục thân khai thiên lập địa lực lượng cực hạn.',
        dialogues: {
            'meet': ['Cổ Thần ý chí không thể lay chuyển! Kẻ yếu đuối kia hãy lui ra.', 'Một quyền khai thiên, một chưởng tịch diệt.'],
            'friendly': ['Sức mạnh của ngươi tuy nhỏ bé nhưng ý chí rất đáng khen ngợi.'],
            'special_move': ['Cổ Thần Khai Thiên Quyền!']
        }
    },
    'vuong_ma_tu': {
        id: 'vuong_ma_tu',
        name: 'Vương Ma Tử',
        gender: 'Nam',
        title: 'Sát Tinh Vương Lâm',
        portrait: ASSETS.portraits.vuong_ma_tu,
        personality: NPC_PERSONALITIES_KEYS.DA_NGHI,
        goal: NPC_GOALS_KEYS.BAO_THU,
        role: 'Luyện Thể Kiếm Tu',
        isRomanceable: false,
        desc: 'Sát tinh Vương Lâm khét tiếng tàn ác vô tình với kẻ địch nhưng nặng tình nặng nghĩa với người thân thương.',
        dialogues: {
            'meet': ['Tu tiên giới kẻ mạnh ăn thịt kẻ yếu. Cút đi trước khi sát khí của ta quét sạch ngươi.', 'Lý Mộ Uyển là nghịch lân của ta. Kẻ nào chạm vào nàng ta tru di cửu tộc!'],
            'friendly': ['Ngươi giúp ta bảo hộ Mộ Uyển, ân tình này Vương Lâm khắc cốt ghi tâm.'],
            'special_move': ['Cực Cảnh Sát Lục Khí!']
        }
    }
};

