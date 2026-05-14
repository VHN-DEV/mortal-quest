/**
 * DỮ LIỆU DỊ LÔI BẢNG (10 LOẠI DỊ LÔI)
 */

export const DI_LOI_DATA = [
    {
        rank: 1,
        name: "Hỗn Độn Tử Tiêu Thần Lôi",
        id: "hon_don_tu_tieu",
        color: "Tím Đậm (Tử Sắc)",
        description: "Hủy diệt thiên địa, mang lực lượng khai thiên lập địa. Là thủy tổ của vạn lôi, có thể phá vỡ mọi quy luật không gian và thời gian.",
        origin: "Hỗn độn sơ khai",
        special: "Lực lượng khai thiên, hủy diệt vạn vật chỉ trong một ý niệm.",
        rarity: "Thần Thoại"
    },
    {
        rank: 2,
        name: "Cửu Tiêu Diệt Thế Lôi",
        id: "cuu_tiao_diet_the",
        color: "Huyết Sắc (Đỏ máu)",
        description: "Ngọn lôi mang theo ý chí của thiên đạo, chuyên dùng để trừng phạt những kẻ nghịch thiên. Có khả năng triệu hoán thiên kiếp diện rộng.",
        origin: "Thiên đạo ý chí",
        special: "Triệu hoán thiên kiếp, uy áp thiên đạo áp chế mọi sinh linh.",
        rarity: "Thần"
    },
    {
        rank: 3,
        name: "Thái Hư Hư Không Lôi",
        id: "thai_hu_hu_khong",
        color: "Bạc Trắng (Ngân Sắc)",
        description: "Loại lôi điện có khả năng xuyên thấu không gian, trực tiếp công kích vào thần hồn của đối phương mà không bị cản trở bởi phòng ngự vật lý.",
        origin: "Hư không vô tận",
        special: "Xuyên thấu không gian, công kích thần hồn tuyệt đối.",
        rarity: "Thần"
    },
    {
        rank: 4,
        name: "Đại Nhật Kim Ô Lôi",
        id: "dai_nhat_kim_o",
        color: "Vàng Kim",
        description: "Lôi điện mang theo sức mạnh của mặt trời cổ đại, là sự kết hợp hoàn hảo giữa lôi và hỏa thuộc tính.",
        origin: "Thái dương tinh hoa",
        special: "Lôi hỏa song thuộc tính, thiêu rụi và tê liệt mục tiêu đồng thời.",
        rarity: "Tiên"
    },
    {
        rank: 5,
        name: "Huyền Âm Cửu U Minh Lôi",
        id: "huyen_am_cuu_u",
        color: "Hắc Sắc (Đen)",
        description: "Âm lôi sinh ra từ nơi sâu nhất của Cửu U địa phủ, mang theo hơi thở của cái chết và sự lạnh lẽo thấu xương.",
        origin: "Cửu U địa phủ",
        special: "Ăn mòn sinh mệnh, đóng băng linh hồn.",
        rarity: "Tiên"
    },
    {
        rank: 6,
        name: "Thanh Minh Ất Mộc Thần Lôi",
        id: "thanh_minh_at_moc",
        color: "Xanh Lục (Thanh Sắc)",
        description: "Ngọn lôi hiếm hoi mang theo sinh cơ mãnh liệt của Mộc thuộc tính, vừa có khả năng chữa lành vừa có khả năng diệt sát tàn khốc.",
        origin: "Tiên thiên mộc tinh",
        special: "Sinh cơ phục hồi và diệt sát tàn khốc song hành.",
        rarity: "Tiên"
    },
    {
        rank: 7,
        name: "Bắc Minh Hàn Sát Lôi",
        id: "bac_minh_han_sat",
        color: "Xanh Băng (Hàn Sắc)",
        description: "Lôi điện mang theo hàn khí cực âm từ vùng Bắc Minh hoang dã, có thể đóng băng vạn vật ngay lập tức khi va chạm.",
        origin: "Bắc Minh hàn cực",
        special: "Lôi mang hàn khí cực âm, đông cứng cả linh lực.",
        rarity: "Thiên"
    },
    {
        rank: 8,
        name: "Tử Cực Ma Diệt Lôi",
        id: "tu_cuc_ma_diet",
        color: "Tím Đen",
        description: "Chí tôn lôi điện của Ma đạo, mang theo sự tàn bạo và ý chí hủy diệt điên cuồng.",
        origin: "Ma vực thẳm sâu",
        special: "Gia tăng sát thương ma đạo, phá hủy tâm trí.",
        rarity: "Thiên"
    },
    {
        rank: 9,
        name: "Thiên Cương Chính Pháp Lôi",
        id: "thien_cuong_chinh_phap",
        color: "Vàng Sáng",
        description: "Ngọn lôi đại diện cho công lý và sự chính trực, là khắc tinh lớn nhất của mọi loài tà ma ngoại đạo.",
        origin: "Chính khí thiên địa",
        special: "Khắc chế tà ma tuyệt đối, gia tăng sát thương lên yêu ma.",
        rarity: "Địa"
    },
    {
        rank: 10,
        name: "Xích Viêm Bạo Lôi",
        id: "xich_viem_bao_loi",
        color: "Đỏ Rực",
        description: "Thiên lôi mang theo nhiệt lượng của dung nham, nổ tung với sức mạnh tàn phá cực kỳ khủng khiếp.",
        origin: "Tâm núi lửa cổ",
        special: "Sát thương diện rộng, nhiệt lượng cực cao.",
        rarity: "Địa"
    }
];

export const getDiLoiByRank = (rank) => DI_LOI_DATA.find(d => d.rank === rank);
export const getDiLoiById = (id) => DI_LOI_DATA.find(d => d.id === id);
