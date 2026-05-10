export const NPC_STORIES = {
    'truy_sat': {
        name: 'Đào Thoát Ma Thủ',
        steps: [
            {
                id: 1,
                desc: 'Đạo hữu, ta đang bị Ma đạo truy sát, xin hãy cứu giúp!',
                options: [
                    { text: 'Hỗ trợ đánh đuổi Ma tu', karma: 10, relation: 20, next: 2 },
                    { text: 'Lạnh lùng bỏ đi', karma: -5, relation: -10, next: null }
                ]
            },
            {
                id: 2,
                desc: 'Đa tạ cứu mạng! Ta có chút bí mật về một kho tàng ma đạo, đạo hữu có muốn cùng đi?',
                options: [
                    { text: 'Đồng hành tầm bảo', relation: 30, next: 3 },
                    { text: 'Từ chối nhận thưởng', relation: 10, next: null }
                ]
            },
            {
                id: 3,
                desc: 'Chúng ta đã tới bí cảnh. Đây là truyền thừa cổ đại!',
                options: [
                    { text: 'Cùng chia sẻ truyền thừa', relation: 50, reward: { tuVi: 5000 }, next: 'complete' },
                    { text: 'Giết người đoạt bảo', karma: -100, relation: -200, reward: { tuVi: 10000, items: ['ma_cong_thuong_cap'] }, next: 'betrayed' }
                ]
            }
        ]
    },
    'tim_su_phu': {
        name: 'Vạn Lý Tìm Sư',
        steps: [
            {
                id: 1,
                desc: 'Sư phụ ta mất tích đã lâu, nghe nói ông ấy từng xuất hiện ở gần đây...',
                options: [
                    { text: 'Giúp tìm kiếm manh mối', relation: 15, next: 2 },
                    { text: 'Ta bận rồi', relation: 0, next: null }
                ]
            }
        ]
    }
};
