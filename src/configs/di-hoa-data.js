import { DI_HOA_QUALITIES } from './item-classification.js';
/**
 * DỮ LIỆU DỊ HỎA BẢNG (23 LOẠI DỊ HỎA)
 * Dựa trên tác phẩm Đấu Phá Thương Khung
 */

export const DI_HOA_DATA = [
    {
        rank: 1,
        name: "Đà Xá Cổ Đế",
        id: "da_xa_co_de",
        color: "Vạn Sắc (Hợp thể vạn hỏa)",
        flameColor: "#ff6b00",
        glowColor: "#ff00ff",
        description: "Vị thế tối cao trong vạn hỏa, là vua của các loài lửa. Thực tế nó là một loại dị hỏa sinh ra từ linh khí thiên địa, sau đó thôn phệ toàn bộ 22 loại dị hỏa khác để đạt đến cảnh giới tối cao.",
        origin: "Thiên địa linh khí tích tụ",
        special: "Thao túng vạn hỏa, thực lực tương đương Đấu Đế. Tự xưng là Đế Viêm.",
        rarity: DI_HOA_QUALITIES.HONG_MONG_TO_HOA
    },
    {
        rank: 2,
        name: "Hư Vô Thôn Viêm",
        id: "hu_vo_thon_viem",
        color: "Hắc Sắc (Đen)",
        flameColor: "#111111",
        glowColor: "#7a00ff",
        description: "Sinh ra trong hư vô, không có hình dạng cố định, có khả năng thôn phệ vạn vật, ngay cả không gian và thời gian cũng không ngoại lệ.",
        origin: "Hư vô không gian",
        special: "Thôn phệ linh hồn và đấu khí, giúp người sở hữu duy trì huyết mạch gia tộc.",
        rarity: DI_HOA_QUALITIES.DAO_HOA
    },
    {
        rank: 3,
        name: "Tịnh Liên Yêu Hỏa",
        id: "tinh_lien_yeu_hoa",
        color: "Nhũ Bạch Sắc (Trắng sữa)",
        flameColor: "#f8f8ff",
        glowColor: "#ffffff",
        description: "Dị hỏa thần bí có khả năng tịnh hóa vạn vật. Bất kỳ thứ gì dính phải đều bị thanh lọc thành hư vô. Có linh trí cực cao, có thể hóa thành hình người.",
        origin: "Yêu Hỏa không gian",
        special: "Tịnh hóa vạn vật, thi triển Mộng Yểm Thiên Vụ khiến hàng triệu người chìm trong ảo giác.",
        rarity: DI_HOA_QUALITIES.DAO_HOA
    },
    {
        rank: 4,
        name: "Kim Đế Phần Thiên Viêm",
        id: "kim_de_phan_thien_viem",
        color: "Kim Sắc (Vàng kim)",
        flameColor: "#ffd700",
        glowColor: "#ffae00",
        description: "Ngọn lửa truyền thừa của Cổ tộc, nổi tiếng với khả năng đốt cháy cả không gian và đấu khí. Là một trong những loại dị hỏa đáng sợ nhất thời cổ đại.",
        origin: "Cổ giới truyền thừa",
        special: "Thiêu rụi không gian cường giả Đấu Thánh tạo ra.",
        rarity: DI_HOA_QUALITIES.DAO_HOA
    },
    {
        rank: 5,
        name: "Sinh Linh Chi Diễm",
        id: "sinh_linh_chi_diem",
        color: "Lục Sắc (Xanh lá)",
        flameColor: "#32cd32",
        glowColor: "#00ff88",
        description: "Khác với các loại dị hỏa mang tính hủy diệt, ngọn lửa này mang theo sức sống mãnh liệt. Có thể khiến hạt giống dược liệu nảy mầm và trưởng thành trong chớp mắt.",
        origin: "Thế giới thực vật, nơi linh khí nồng đậm",
        special: "Trường thọ chi hỏa, gia tăng tuổi thọ cực lớn cho người sở hữu, hỗ trợ luyện đan hoàn mỹ.",
        rarity: DI_HOA_QUALITIES.TIEN_HOA
    },
    {
        rank: 6,
        name: "Bát Hoang Phá Diệt Diễm",
        id: "bat_hoang_pha_diet_diem",
        color: "Hắc Sắc (Đen tuyền)",
        flameColor: "#2b2b2b",
        glowColor: "#ff4500",
        description: "Ngọn lửa mang tính phá hoại cực lớn, thường được dùng để tạo ra những đôi cánh lửa khổng lồ bá đạo tuyệt luân.",
        origin: "Viêm tộc truyền thừa",
        special: "Sức công kích vật lý và hỏa lực cực kỳ cường hãn.",
        rarity: DI_HOA_QUALITIES.TIEN_HOA
    },
    {
        rank: 7,
        name: "Cửu U Kim Tổ Hỏa",
        id: "cuu_u_kim_to_hoa",
        color: "Kim Sắc Sẫm (Vàng đậm)",
        flameColor: "#d4af37",
        glowColor: "#ffd700",
        description: "Ngọn lửa lâu đời của Viêm tộc, có khả năng kết hợp với các loại dị hỏa khác để tạo ra uy lực kinh thiên động địa.",
        origin: "U minh địa giới",
        special: "Kim tính cực mạnh, khắc chế các loại kim khí pháp bảo.",
        rarity: DI_HOA_QUALITIES.TIEN_HOA
    },
    {
        rank: 8,
        name: "Hồng Liên Nghiệp Hỏa",
        id: "hong_lien_nghiep_hoa",
        color: "Đỏ Thẫm (Sen đỏ)",
        flameColor: "#dc143c",
        glowColor: "#ff3366",
        description: "Ngọn lửa có hình dạng như đóa sen đỏ, sinh ra từ nghiệp lực của nhân gian. Có khả năng thiêu đốt tội lỗi và nghiệp chướng.",
        origin: "Nơi tụ tập nghiệp lực nhân gian",
        special: "Tấn công trực tiếp vào linh hồn và tâm trí kẻ thù.",
        rarity: DI_HOA_QUALITIES.TIEN_HOA
    },
    {
        rank: 9,
        name: "Tam Thiên Diễm Thương Hỏa",
        id: "tam_thien_diem_thuong_hoa",
        color: "Tử Đen (Tím đen)",
        flameColor: "#6f00ff",
        glowColor: "#c000ff",
        description: "Sinh ra từ tinh hoa của các vì sao trên bầu trời, có thể hấp thụ sức mạnh tinh tú để trở nên bất tử. Còn được gọi là Bất Tử Hỏa.",
        origin: "Tinh không vô tận",
        special: "Bất tử thể chất, phục hồi vết thương siêu tốc cho người sở hữu.",
        rarity: DI_HOA_QUALITIES.TIEN_HOA
    },
    {
        rank: 10,
        name: "Cửu U Phong Viêm",
        id: "cuu_u_phong_viem",
        color: "Xanh Đen",
        flameColor: "#003b46",
        glowColor: "#00e5ff",
        description: "Sự kết hợp kỳ lạ giữa gió và lửa sinh ra từ vực thẳm Cửu U. Tiếng gió rít của nó có thể làm xao động tâm trí đối phương.",
        origin: "Vực thẳm Cửu U",
        special: "Tốc độ cực nhanh, gây nhiễu loạn cảm xúc kẻ địch bằng âm thanh.",
        rarity: DI_HOA_QUALITIES.TIEN_HOA
    },
    {
        rank: 11,
        name: "Cốt Lôi Linh Hỏa",
        id: "cot_loi_linh_hoa",
        color: "Trắng Xám (Lửa xương)",
        flameColor: "#d8d8d8",
        glowColor: "#8ec5ff",
        description: "Ngọn lửa kết hợp giữa hàn khí lạnh lẽo và hỏa khí nóng rực, chỉ xuất hiện vào lúc giao thoa âm dương 10 năm một lần.",
        origin: "Cực âm địa cực",
        special: "Đóng băng linh hồn trong khi thiêu đốt thể xác.",
        rarity: DI_HOA_QUALITIES.TIEN_HOA
    },
    {
        rank: 12,
        name: "Cửu Long Lôi Cương Hỏa",
        id: "cuu_long_loi_cuong_hoa",
        color: "Ngân Sắc (Bạc)",
        flameColor: "#c0c0c0",
        glowColor: "#ffffff",
        description: "Ngọn lửa mang theo uy áp của rồng và sức mạnh của sấm sét. Chứa đựng chín con hỏa long ngân sắc bên trong.",
        origin: "Phần Viêm Cốc",
        special: "Trấn áp linh hồn, mang theo lôi điện lực tàn phá.",
        rarity: DI_HOA_QUALITIES.TIEN_HOA
    },
    {
        rank: 13,
        name: "Quy Linh Địa Hỏa",
        id: "quy_linh_dia_hoa",
        color: "Nâu Đen",
        flameColor: "#5c4033",
        glowColor: "#8b4513",
        description: "Ngọn lửa có hình dạng như mai rùa khổng lồ, ẩn chứa sức phòng ngự địa chất ngàn năm.",
        origin: "Địa tầng nham thạch",
        special: "Phòng ngự tuyệt đối, khắc chế thủy hệ.",
        rarity: DI_HOA_QUALITIES.THIEN_HOA
    },
    {
        rank: 14,
        name: "Vẫn Lạc Tâm Viêm",
        id: "van_lac_tam_viem",
        color: "Vô Sắc (Trong suốt)",
        flameColor: "#ffffff",
        glowColor: "#ff8800",
        description: "Được mệnh danh là 'Công cụ gian lận tu luyện', ngọn lửa này sinh ra từ tâm, có thể tôi luyện đấu khí ngày đêm không ngừng.",
        origin: "Địa tâm nham tương",
        special: "Tăng tốc độ tu luyện cực lớn, triệu hồi hỏa tâm thiêu đốt nội tạng đối thủ.",
        rarity: DI_HOA_QUALITIES.THIEN_HOA
    },
    {
        rank: 15,
        name: "Hải Tâm Diễm",
        id: "hai_tam_diem",
        color: "Thâm Lam (Xanh biển)",
        flameColor: "#0066ff",
        glowColor: "#00c3ff",
        description: "Ngọn lửa kỳ lạ sinh ra từ đáy biển sâu, nơi giao thoa giữa thủy và hỏa linh khí.",
        origin: "Vực thẳm đại dương",
        special: "Hỏa lực mang đặc tính của nước, biến hóa khôn lường.",
        rarity: DI_HOA_QUALITIES.THIEN_HOA
    },
    {
        rank: 16,
        name: "Hỏa Vân Thủy Viêm",
        id: "hoa_van_thuy_viem",
        color: "Xanh Nhạt",
        flameColor: "#87cefa",
        glowColor: "#b0ffff",
        description: "Ngọn lửa trông như đám mây trôi nổi trên mặt nước, mang vẻ đẹp thoát tục nhưng chứa đựng sức nóng đáng sợ.",
        origin: "Vân hải mịt mù",
        special: "Khả năng ẩn nấp và tấn công bất ngờ.",
        rarity: DI_HOA_QUALITIES.THIEN_HOA
    },
    {
        rank: 17,
        name: "Phần Thiên Liệt Diễm",
        id: "phan_thien_liet_diem",
        color: "Đỏ Thẫm",
        flameColor: "#ff2400",
        glowColor: "#ff6600",
        description: "Sinh ra từ tâm núi lửa hoạt động hàng vạn năm, mang theo cơn giận dữ của lòng đất.",
        origin: "Miệng núi lửa cổ đại",
        special: "Diện tích sát thương cực rộng, có thể gây ra núi lửa phun trào.",
        rarity: DI_HOA_QUALITIES.THIEN_HOA
    },
    {
        rank: 18,
        name: "Phong Lôi Nộ Diễm",
        id: "phong_loi_no_diem",
        color: "Xanh Bạc",
        flameColor: "#9be7ff",
        glowColor: "#ffffff",
        description: "Ra đời trong mắt bão của những cơn lốc xoáy sa mạc, kết hợp sức mạnh của gió và lửa.",
        origin: "Sa mạc bão tố",
        special: "Tốc độ và sức xuyên phá cực cao.",
        rarity: DI_HOA_QUALITIES.DIA_HOA
    },
    {
        rank: 19,
        name: "Thanh Liên Địa Tâm Hỏa",
        id: "thanh_lien_dia_tam_hoa",
        color: "Thanh Sắc (Xanh ngọc)",
        flameColor: "#00b894",
        glowColor: "#00ffd5",
        description: "Ngàn năm nở một đóa sen xanh dưới lòng đất. Uy lực có thể gây ra chấn động địa tầng.",
        origin: "Địa tâm dung nham",
        special: "Giúp bình tâm tĩnh khí khi tu luyện, tránh tẩu hỏa nhập ma.",
        rarity: DI_HOA_QUALITIES.DIA_HOA
    },
    {
        rank: 20,
        name: "Long Phượng Phệ Thiên Viêm",
        id: "long_phuong_diem",
        color: "Hỗn Sắc",
        flameColor: "#ff6b00",
        glowColor: "#ffd700",
        description: "Truyền thuyết kể rằng ngọn lửa này sinh ra từ nơi táng thân của Long tộc và Phượng tộc cổ đại.",
        origin: "Viễn cổ di tích",
        special: "Mang theo uy áp viễn cổ, áp chế ma thú.",
        rarity: DI_HOA_QUALITIES.DIA_HOA
    },
    {
        rank: 21,
        name: "Lục Đạo Luân Hồi Diễm",
        id: "luc_dao_luan_hoi_diem",
        color: "Xám Tro",
        flameColor: "#808080",
        glowColor: "#d3d3d3",
        description: "Ngọn lửa chứa đựng quy luật luân hồi, có thể khiến đối thủ rơi vào vòng xoáy thời gian.",
        origin: "Luân hồi chi địa",
        special: "Khả năng tước đoạt sinh mệnh lực.",
        rarity: DI_HOA_QUALITIES.LINH_HOA
    },
    {
        rank: 22,
        name: "Vạn Thú Linh Hỏa",
        id: "van_thu_linh_hoa",
        color: "Đỏ Rực",
        flameColor: "#ff3030",
        glowColor: "#ff8800",
        description: "Sinh ra từ linh hồn của vạn con ma thú, mang theo bản năng chiến đấu hoang dã.",
        origin: "Vạn Thú cương",
        special: "Triệu hồi linh ảnh ma thú hỗ trợ chiến đấu.",
        rarity: DI_HOA_QUALITIES.LINH_HOA
    },
    {
        rank: 23,
        name: "Huyền Hoàng Viêm",
        id: "huyen_hoang_viem",
        color: "Thâm Hoàng (Vàng đen)",
        flameColor: "#b8860b",
        glowColor: "#ffd700",
        description: "Ngọn lửa mang khí tức của đất trời sơ khai, tuy xếp cuối bảng nhưng vẫn vượt xa phàm hỏa.",
        origin: "Địa mạch sơ khai",
        special: "Căn cơ vững chãi, hỗ trợ rèn luyện thể chất.",
        rarity: DI_HOA_QUALITIES.PHAM_HOA
    }
];

export const getDiHoaByRank = (rank) => DI_HOA_DATA.find(d => d.rank === rank);
export const getDiHoaById = (id) => DI_HOA_DATA.find(d => d.id === id);
