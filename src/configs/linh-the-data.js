/**
 * DỮ LIỆU CHƯ THIÊN LINH THỂ LỤC (15 LOẠI LINH THỂ)
 */

import { LINH_THE_RARITIES } from './game-enums.js';

export const LINH_THE_DATA = [
    {
        rank: 1,
        name: "Hỗn Độn Thể",
        id: "hon_don_the",
        title: "Vạn Thể Chi Tổ",
        description: "Thể chất đứng đầu chư thiên, sinh ra từ hỗn độn. Có thể diễn hóa vạn vật, cắn nuốt vạn pháp, không bị bất kỳ quy luật nào trói buộc.",
        special: "Dung hợp vạn pháp, thiên địa đồng thọ.",
        rarity: LINH_THE_RARITIES.THAN_THOAI
    },
    {
        rank: 2,
        name: "Tiên Thiên Thánh Thể Đạo Thai",
        id: "tien_thien_thanh_the_dao_thai",
        title: "Thiên Sinh Cận Đạo",
        description: "Sự kết hợp hoàn hảo giữa Thánh Thể và Đạo Thai. Sinh ra đã gần gũi với Đại Đạo, tốc độ tu luyện và cảm ngộ pháp tắc vô đối.",
        special: "Cảm ngộ pháp tắc x10, linh lực vô tận.",
        rarity: LINH_THE_RARITIES.THAN_THOAI
    },
    {
        rank: 3,
        name: "Vĩnh Hằng Tiên Thể",
        id: "vinh_hang_tien_the",
        title: "Bất Diệt Tiên Khu",
        description: "Thân thể đạt đến cảnh giới vĩnh hằng, không già không chết, bất hủ bất diệt. Dù chỉ còn một giọt huyết cũng có thể trọng sinh.",
        special: "Bất tử bất diệt, phục hồi cực tốc.",
        rarity: LINH_THE_RARITIES.THAN
    },
    {
        rank: 4,
        name: "Hoang Cổ Thánh Thể",
        id: "hoang_co_thanh_the",
        title: "Chiến Thần Nhân Tộc",
        description: "Chiến thể mạnh nhất của nhân tộc, chuyên khắc chế các loại dị thể khác. Thân thể cường hãn, khí huyết như rồng, trấn áp chư thiên.",
        special: "Khắc chế dị tượng, thân thể vô địch.",
        rarity: LINH_THE_RARITIES.THAN
    },
    {
        rank: 5,
        name: "Hồng Mông Đạo Thể",
        id: "hong_mong_dao_the",
        title: "Khởi Nguyên Chi Thể",
        description: "Mang trong mình khí Hồng Mông khởi nguyên. Có thể nhìn thấu bản chất của vạn vật và nắm giữ sức mạnh khai thiên lập địa.",
        special: "Khí Hồng Mông hộ thể, vạn tà bất xâm.",
        rarity: LINH_THE_RARITIES.THAN
    },
    {
        rank: 6,
        name: "Thần Vương Thể",
        id: "than_vuong_the",
        title: "Vương Giả Thiên Sinh",
        description: "Sinh ra đã mang cốt cách của thần vương. Có thể triệu hoán thần ảnh vương giả, trấn áp địch thủ bằng uy áp tuyệt đối.",
        special: "Thần Vương Tịnh Thổ, trấn áp vạn địch.",
        rarity: LINH_THE_RARITIES.TIEN
    },
    {
        rank: 7,
        name: "Thương Thiên Phách Thể",
        id: "thuong_thien_phach_the",
        title: "Bá Đạo Vô Song",
        description: "Đối trọng truyền kiếp của Hoang Cổ Thánh Thể. Mang trong mình dòng máu bá đạo, ý chí chiến đấu cuồng nhiệt, càng đánh càng mạnh.",
        special: "Phách đạo tuyệt luân, chiến ý ngất trời.",
        rarity: LINH_THE_RARITIES.TIEN
    },
    {
        rank: 8,
        name: "Luân Hồi Thể",
        id: "luan_hoi_the",
        title: "Chấp Chưởng Sinh Tử",
        description: "Thể chất nắm giữ quy luật luân hồi. Có thể nhìn thấu tiền kiếp hậu thế, điều khiển sinh tử lực lượng của đối phương.",
        special: "Luân Hồi Nhãn, nghịch chuyển sinh tử.",
        rarity: LINH_THE_RARITIES.TIEN
    },
    {
        rank: 9,
        name: "Vận Mệnh Hư Vô Giả",
        id: "van_menh_hu_vo",
        title: "Thiên Cơ Bất Hiện",
        description: "Kẻ nằm ngoài vận mệnh, không bị thiên cơ nhìn thấu, không bị nhân quả ràng buộc. Là biến số lớn nhất của thiên địa.",
        special: "Nhân quả bất dính, vận mệnh hư vô.",
        rarity: LINH_THE_RARITIES.TIEN
    },
    {
        rank: 10,
        name: "Thôn Thiên Thể",
        id: "thon_thien_the",
        title: "Thôn Phệ Vạn Vật",
        description: "Có khả năng thôn phệ mọi loại thể chất, linh lực và bảo vật để cường hóa bản thân. Con đường tu luyện đầy rẫy sự thôn phệ.",
        special: "Thôn phệ vạn thể, thành tựu ma công.",
        rarity: LINH_THE_RARITIES.THIEN
    },
    {
        rank: 11,
        name: "Tu La Huyết Thể",
        id: "tu_la_huyet_the",
        title: "Sát Lục Thành Đạo",
        description: "Sinh ra từ huyết hải, lấy sát lục làm đạo. Càng giết chóc, sức mạnh và sát khí càng tăng cao không giới hạn.",
        special: "Sát lục lĩnh vực, huyết khí ngợp trời.",
        rarity: LINH_THE_RARITIES.THIEN
    },
    {
        rank: 12,
        name: "Thái Âm Tiên Thể",
        id: "thai_am_tien_the",
        title: "Cực Âm Chi Chủ",
        description: "Thể chất mang sức mạnh cực âm tinh thuần nhất. Có thể đóng băng cả thời gian và không gian bằng hàn khí thái âm.",
        special: "Thái Âm Chi Lực, đông cứng vạn pháp.",
        rarity: LINH_THE_RARITIES.THIEN
    },
    {
        rank: 13,
        name: "Thái Dương Thần Thể",
        id: "thai_duong_than_the",
        title: "Đại Nhật Chi Khu",
        description: "Đối trọng của Thái Âm, mang sức mạnh cực dương nóng bỏng. Thân thể như một mặt trời nhỏ, thiêu rụi mọi thứ cản đường.",
        special: "Thái Dương Chân Hỏa, phần thiên diệt thế.",
        rarity: LINH_THE_RARITIES.THIEN
    },
    {
        rank: 14,
        name: "Hư Không Thể",
        id: "hu_khong_the",
        title: "Hành Giả Không Gian",
        description: "Bẩm sinh đã hòa mình vào hư không. Có thể tự do đi lại giữa các không gian, vạn pháp bất khả chạm tới.",
        special: "Hư không độ bộ, không gian chấn nát.",
        rarity: LINH_THE_RARITIES.DIA
    },
    {
        rank: 15,
        name: "Thiên Lôi Chi Thể",
        id: "thien_loi_the",
        title: "Lôi Phạt Hóa Thân",
        description: "Cơ thể được rèn giũa từ thiên lôi. Có thể điều khiển sấm sét của thiên kiếp để trừng phạt chúng sinh.",
        special: "Thiên lôi thối thể, lôi phạt vô tình.",
        rarity: LINH_THE_RARITIES.DIA
    }
];

export const getLinhTheByRank = (rank) => LINH_THE_DATA.find(d => d.rank === rank);
export const getLinhTheById = (id) => LINH_THE_DATA.find(d => d.id === id);
