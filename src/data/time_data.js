export const HOURS = [
    { id: 'ty', name: 'Giờ Tý', period: 'Night', description: 'Âm khí cực thịnh, vạn vật tĩnh lặng.' },
    { id: 'suu', name: 'Giờ Sửu', period: 'Night', description: 'Linh khí lắng đọng, thích hợp ngưng tụ.' },
    { id: 'dan', name: 'Giờ Dần', period: 'Night', description: 'Bình minh sắp tới, âm dương giao thoa.' },
    { id: 'mao', name: 'Giờ Mão', period: 'Day', description: 'Mặt trời mọc, vạn vật thức tỉnh.' },
    { id: 'thin', name: 'Giờ Thìn', period: 'Day', description: 'Khí lành vây quanh, thành trì náo nhiệt.' },
    { id: 'ti', name: 'Giờ Tỵ', period: 'Day', description: 'Dương khí thăng hoa, linh dược sinh trưởng.' },
    { id: 'ngo', name: 'Giờ Ngọ', period: 'Day', description: 'Cực dương chi thời, hỏa hệ cường đại.' },
    { id: 'mui', name: 'Giờ Mùi', period: 'Day', description: 'Nắng gắt dần tan, vạn vật bình ổn.' },
    { id: 'than', name: 'Giờ Thân', period: 'Day', description: 'Hoàng hôn buông xuống, mây trôi hờ hững.' },
    { id: 'dau', name: 'Giờ Dậu', period: 'Day', description: 'Mặt trời lặn, tà dương chiếu rọi.' },
    { id: 'tuat', name: 'Giờ Tuất', period: 'Night', description: 'Màn đêm bao phủ, yêu thú bắt đầu hoạt động.' },
    { id: 'hoi', name: 'Giờ Hợi', period: 'Night', description: 'Vạn vật nghỉ ngơi, bóng tối ngự trị.' }
];

export const SEASONS = [
    { 
        id: 'spring', 
        name: 'Mùa Xuân', 
        color: '#4ade80',
        bonus: { herbGrowth: 1.5, woodElement: 1.2, tvps: 1.2 },
        description: 'Vạn vật sinh sôi, linh thảo trưởng thành nhanh chóng. Linh khí dồi dào.'
    },
    { 
        id: 'summer', 
        name: 'Mùa Hạ', 
        color: '#f87171',
        bonus: { fireElement: 1.5, alchemySuccess: 1.1, tvps: 1.0 },
        description: 'Nắng gắt như thiêu, hỏa hệ linh lực bạo động.'
    },
    { 
        id: 'autumn', 
        name: 'Mùa Thu', 
        color: '#fbbf24',
        bonus: { breakthroughSuccess: 1.1, metalElement: 1.2, tvps: 1.5 },
        description: 'Khí trời mát mẻ, linh khí ổn định, thích hợp đột phá và tu luyện.'
    },
    { 
        id: 'winter', 
        name: 'Mùa Đông', 
        color: '#60a5fa',
        bonus: { iceElement: 1.5, waterElement: 1.2, tvps: 0.8 },
        description: 'Băng giá bao trùm, linh khí lắng đọng, tu luyện chậm lại.'
    }
];

export const PHENOMENA = [
    {
        id: 'spiritual_tide',
        name: 'Linh Khí Triều',
        chance: 0.05,
        duration: 120, // minutes
        effect: { tvps: 2.0 },
        description: 'Linh khí nồng đậm bùng phát toàn thế giới!'
    },
    {
        id: 'blood_moon',
        name: 'Huyết Nguyệt',
        chance: 0.03,
        duration: 60,
        effect: { enemyStrength: 1.5, karmaLoss: 2.0 },
        description: 'Mặt trăng máu hiện thế, yêu ma bạo loạn!'
    },
    {
        id: 'eclipse',
        name: 'Nhật Thực',
        chance: 0.02,
        duration: 30,
        effect: { yinEnergy: 2.0 },
        description: 'Mặt trời bị che khuất, âm khí tràn ngập.'
    }
];
