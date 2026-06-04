/**
 * DỮ LIỆU CHƯ THIÊN LINH THỂ LỤC
 */

import { LINH_THE_RARITIES } from './game-enums.js';

export const LINH_THE_DATA = [
    {
        rank: 1,
        name: "Hỗn Độn Thể",
        id: "hon_don_the",
        title: "Vạn Thể Chi Tổ",
        description: "Thể chất sinh ra từ hỗn độn sơ khai, dung hợp vạn đạo, không chịu bất kỳ quy tắc nào trói buộc.",
        special: "Thôn phệ vạn pháp, tự diễn thiên đạo.",
        rarity: LINH_THE_RARITIES.THAN_THOAI
    },
    {
        rank: 2,
        name: "Tiên Thiên Thánh Thể Đạo Thai",
        id: "tien_thien_thanh_the_dao_thai",
        title: "Thiên Sinh Cận Đạo",
        description: "Kết hợp hoàn mỹ giữa thánh thể và đạo thai, sinh ra đã gần với đại đạo.",
        special: "Cảm ngộ pháp tắc cực hạn, tu luyện vô song.",
        rarity: LINH_THE_RARITIES.THAN_THOAI
    },
    {
        rank: 3,
        name: "Tiên Thiên Đạo Thai",
        id: "tien_thien_dao_thai",
        title: "Đạo Thai Nguyên Sơ",
        description: "Được thiên địa thai nghén từ sơ khai, thân hòa đại đạo tự nhiên.",
        special: "Vạn pháp tự thông, đạo vận vô tận.",
        rarity: LINH_THE_RARITIES.THAN_THOAI
    },
    {
        rank: 4,
        name: "Hồng Mông Đạo Thể",
        id: "hong_mong_dao_the",
        title: "Khởi Nguyên Chi Thể",
        description: "Mang khí Hồng Mông nguyên thủy, chạm tới bản nguyên vũ trụ.",
        special: "Khí Hồng Mông hộ thể, khai thiên lập địa.",
        rarity: LINH_THE_RARITIES.THAN_THOAI
    },
    {
        rank: 5,
        name: "Luân Hồi Thể",
        id: "luan_hoi_the",
        title: "Chưởng Sinh Tử Luân Hồi",
        description: "Nắm giữ luân hồi chi lực, nhìn thấu sinh tử tiền kiếp.",
        special: "Luân hồi bất diệt, nghịch chuyển sinh tử.",
        rarity: LINH_THE_RARITIES.THAN
    },
    {
        rank: 6,
        name: "Vĩnh Hằng Tiên Thể",
        id: "vinh_hang_tien_the",
        title: "Bất Diệt Tiên Khu",
        description: "Thân thể đạt tới vĩnh hằng bất hoại, gần như không thể tiêu diệt.",
        special: "Tái sinh vô hạn, bất tử bất diệt.",
        rarity: LINH_THE_RARITIES.THAN
    },
    {
        rank: 7,
        name: "Vận Mệnh Hư Vô Giả",
        id: "van_menh_hu_vo",
        title: "Thoát Ly Nhân Quả",
        description: "Không thuộc thiên cơ, không bị nhân quả chi phối.",
        special: "Vận mệnh vô hiệu hóa, biến số tối cao.",
        rarity: LINH_THE_RARITIES.THAN
    },
    {
        rank: 8,
        name: "Hoang Cổ Thánh Thể",
        id: "hoang_co_thanh_the",
        title: "Chiến Thần Nhân Tộc",
        description: "Thánh thể chiến đấu cực mạnh, chuyên khắc chế dị thể.",
        special: "Kháng áp lực cực hạn, chiến đấu càng mạnh.",
        rarity: LINH_THE_RARITIES.THAN
    },
    {
        rank: 9,
        name: "Thương Thiên Phách Thể",
        id: "thuong_thien_phach_the",
        title: "Bá Đạo Chi Thể",
        description: "Càng chiến càng mạnh, ý chí áp đảo thiên địa.",
        special: "Chiến ý vô hạn, phá giới chiến đấu.",
        rarity: LINH_THE_RARITIES.THAN
    },
    {
        rank: 10,
        name: "Thôn Thiên Thể",
        id: "thon_thien_the",
        title: "Thôn Phệ Chi Đạo",
        description: "Có thể thôn phệ vạn vật để tiến hóa bản thân.",
        special: "Thôn phệ linh lực, tiến hóa vô hạn.",
        rarity: LINH_THE_RARITIES.THAN
    },
    {
        rank: 11,
        name: "Thần Vương Thể",
        id: "than_vuong_the",
        title: "Vương Giả Thiên Sinh",
        description: "Mang uy áp vương giả, trấn áp quần hùng.",
        special: "Vương uy áp chế, chiến lực bộc phát.",
        rarity: LINH_THE_RARITIES.TIEN
    },
    {
        rank: 12,
        name: "Thiên Mệnh Đạo Thể",
        id: "thien_menh_dao_the",
        title: "Khí Vận Chi Tử",
        description: "Được thiên địa khí vận ưu ái tuyệt đối.",
        special: "Gặp hung hóa cát, cơ duyên vô tận.",
        rarity: LINH_THE_RARITIES.TIEN
    },
    {
        rank: 13,
        name: "Hư Không Thể",
        id: "hu_khong_the",
        title: "Không Gian Chi Tử",
        description: "Thân hòa hư không, thao túng không gian.",
        special: "Dịch chuyển tức thời, ẩn thân tuyệt đối.",
        rarity: LINH_THE_RARITIES.TIEN
    },
    {
        rank: 14,
        name: "Thái Âm Tiên Thể",
        id: "thai_am_tien_the",
        title: "Cực Âm Chi Chủ",
        description: "Nắm giữ lực lượng cực âm tuyệt đối.",
        special: "Đóng băng thời không cục bộ.",
        rarity: LINH_THE_RARITIES.TIEN
    },
    {
        rank: 15,
        name: "Thái Dương Thần Thể",
        id: "thai_duong_than_the",
        title: "Đại Nhật Chi Thể",
        description: "Như mặt trời sống, thiêu diệt vạn vật.",
        special: "Hỏa diễm cực hạn, phần thiên diệt địa.",
        rarity: LINH_THE_RARITIES.TIEN
    },
    {
        rank: 16,
        name: "Thiên Sinh Kiếm Thể",
        id: "thien_sinh_kiem_the",
        title: "Kiếm Đạo Chí Tôn",
        description: "Thiên sinh kiếm đạo thân thể.",
        special: "Nhất kiếm phá vạn pháp.",
        rarity: LINH_THE_RARITIES.TIEN
    },
    {
        rank: 17,
        name: "Thiên Lôi Chi Thể",
        id: "thien_loi_the",
        title: "Lôi Phạt Chi Thể",
        description: "Khống chế thiên lôi chi lực.",
        special: "Thiên kiếp chi lôi hộ thể.",
        rarity: LINH_THE_RARITIES.TIEN
    },
    {
        rank: 18,
        name: "Tiên Linh Thể",
        id: "tien_linh_the",
        title: "Tiên Khí Thân Thể",
        description: "Sinh ra gần với tiên khí.",
        special: "Tu luyện tốc độ cực nhanh.",
        rarity: LINH_THE_RARITIES.TIEN
    },
    {
        rank: 19,
        name: "Cửu Khiếu Linh Lung Thể",
        id: "cuu_khieu_linh_long_the",
        title: "Linh Căn Tuyệt Đỉnh",
        description: "Hấp thu linh khí cực nhanh.",
        special: "Linh khí tự hội.",
        rarity: LINH_THE_RARITIES.TIEN
    },
    {
        rank: 20,
        name: "Thanh Liên Đạo Thể",
        id: "thanh_lien_dao_the",
        title: "Tâm Cảnh Thuần Tịnh",
        description: "Không nhiễm tâm ma.",
        special: "Ngộ đạo cực nhanh.",
        rarity: LINH_THE_RARITIES.TIEN
    },
    {
        rank: 21,
        name: "Thiên Cơ Thể",
        id: "thien_co_the",
        title: "Động Sát Thiên Cơ",
        description: "Nhìn thấy vận mệnh biến hóa.",
        special: "Dự đoán tương lai.",
        rarity: LINH_THE_RARITIES.THIEN
    },
    {
        rank: 22,
        name: "Chiến Thần Thể",
        id: "chien_than_the",
        title: "Bất Diệt Chiến Ý",
        description: "Càng chiến càng mạnh.",
        special: "Chiến đấu tiến hóa.",
        rarity: LINH_THE_RARITIES.THIEN
    },
    {
        rank: 23,
        name: "Tu La Huyết Thể",
        id: "tu_la_huyet_the",
        title: "Sát Lục Chi Thể",
        description: "Lấy sát lục làm sức mạnh.",
        special: "Giết chóc tăng lực.",
        rarity: LINH_THE_RARITIES.THIEN
    },
    {
        rank: 24,
        name: "Tinh Thần Thể",
        id: "tinh_than_the",
        title: "Tinh Hải Chi Lực",
        description: "Mượn sức mạnh tinh không.",
        special: "Tinh lực vô tận.",
        rarity: LINH_THE_RARITIES.THIEN
    },
    {
        rank: 25,
        name: "Kim Cang Bất Hoại Thể",
        id: "kim_cang_bat_hoai_the",
        title: "Bất Phá Kim Thân",
        description: "Phòng ngự cực hạn.",
        special: "Gần như bất tử phòng ngự.",
        rarity: LINH_THE_RARITIES.THIEN
    },
    {
        rank: 26,
        name: "Cửu U Minh Thể",
        id: "cuu_u_minh_the",
        title: "Minh Giới Chi Thể",
        description: "Khống chế tử khí.",
        special: "Thao túng linh hồn.",
        rarity: LINH_THE_RARITIES.THIEN
    },
    {
        rank: 27,
        name: "Băng Phách Thần Thể",
        id: "bang_phach_than_the",
        title: "Hàn Băng Chi Chủ",
        description: "Đóng băng vạn vật.",
        special: "Hàn khí tuyệt đối.",
        rarity: LINH_THE_RARITIES.THIEN
    },
    {
        rank: 28,
        name: "Xích Viêm Thần Thể",
        id: "xich_viem_than_the",
        title: "Hỏa Diễm Chi Chủ",
        description: "Hỏa diễm cực hạn.",
        special: "Thiêu đốt thần hồn.",
        rarity: LINH_THE_RARITIES.THIEN
    },
    {
        rank: 29,
        name: "Thuần Dương Thể",
        id: "thuan_duong_the",
        title: "Chí Dương Chi Thể",
        description: "Khắc chế tà ma.",
        special: "Dương khí hộ thể.",
        rarity: LINH_THE_RARITIES.THIEN
    },
    {
        rank: 30,
        name: "Huyền Âm Thể",
        id: "huyen_am_the",
        title: "Cực Âm Chi Thể",
        description: "Âm khí ăn mòn.",
        special: "Suy yếu đối thủ.",
        rarity: LINH_THE_RARITIES.THIEN
    }
];

export const getLinhTheByRank = (rank) => LINH_THE_DATA.find(d => d.rank === rank);
export const getLinhTheById = (id) => LINH_THE_DATA.find(d => d.id === id);
