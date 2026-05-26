export const CULTIVATION_PATHS = {
    // Main Paths
    orthodox: {
        id: 'orthodox',
        category: 'main',
        name: 'Pháp Tu (Chính Thống)',
        desc: 'Con đường tu luyện pháp lực chính thống. Tự do, ổn định, dung nạp linh khí thiên địa làm căn cơ.',
        currency: 'Linh lực',
        icon: '✨',
        races: ['HUMAN'],
        conflicts: ['ma_dao', 'quy_dao'],
        realmsKey: 'HUMAN',
        statModifiers: {}
    },
    ma_dao: {
        id: 'ma_dao',
        category: 'main',
        name: 'Ma Đạo (Ma Công)',
        desc: 'Nhánh tu luyện ma khí bá đạo. Tăng tiến cực nhanh nhưng dễ gặp tâm ma xâm nhập, kinh mạch nghịch hành.',
        currency: 'Ma khí',
        icon: '😈',
        races: ['HUMAN', 'DEMON'],
        conflicts: ['orthodox', 'quy_dao'],
        realmsKey: 'DEMON',
        statModifiers: {
            atkMult: 1.3,
            defMult: 0.9,
            tuViSpeed: 1.2,
            stabilityDecay: 1.5,
            breakthroughPenalty: -10 // -10% success chance
        }
    },
    quy_dao: {
        id: 'quy_dao',
        category: 'main',
        name: 'Quỷ Đạo (Âm Khí)',
        desc: 'Dùng âm khí, oán khí hoặc âm hồn tu luyện. Thi triển tà thuật, điều khiển thi quỷ, linh hồn.',
        currency: 'Âm khí',
        icon: '💀',
        races: ['HUMAN'],
        conflicts: ['orthodox', 'ma_dao'],
        realmsKey: 'GHOST',
        statModifiers: {
            hpMult: 1.2,
            spdMult: 1.2,
            healReceivedMult: 0.8
        }
    },
    yeu_tu: {
        id: 'yeu_tu',
        category: 'main',
        name: 'Yêu Tu (Yêu Lực)',
        desc: 'Con đường của yêu thú hóa hình, chú trọng rèn luyện thể chất dồi dào, đánh thức cổ huyết mạch.',
        currency: 'Yêu lực',
        icon: '🐾',
        races: ['YAO'],
        conflicts: ['orthodox', 'ma_dao', 'quy_dao'],
        realmsKey: 'YAO',
        statModifiers: {
            hpMult: 1.5,
            defMult: 1.2
        }
    },
    
    // Auxiliary general paths
    body: {
        id: 'body',
        category: 'auxiliary',
        name: 'Luyện Thể',
        desc: 'Cường hóa nhục thân, dùng huyết khí áp chế vạn pháp, tay không đỡ pháp bảo.',
        currency: 'Huyết khí',
        icon: '💪',
        races: ['HUMAN', 'YAO', 'DEMON'],
        conflicts: [],
        realmsKey: 'BODY',
        statModifiers: {}
    },
    soul: {
        id: 'soul',
        category: 'auxiliary',
        name: 'Thần Thức',
        desc: 'Mở rộng thần hải linh hồn, khống chế từ xa, thi triển ảo thuật thần hồn.',
        currency: 'Hồn lực',
        icon: '🧠',
        races: ['HUMAN', 'YAO', 'DEMON'],
        conflicts: [],
        realmsKey: 'SOUL',
        statModifiers: {}
    },

    // Specialized Paths
    sword: {
        id: 'sword',
        category: 'specialized',
        name: 'Kiếm Tu',
        desc: 'Lấy kiếm phá vạn pháp. Sát phạt chi thuật đệ nhất giới tu tiên, tấn công cực hạn.',
        currency: 'Kiếm ý',
        icon: '⚔️',
        races: ['HUMAN'],
        requiredMain: ['orthodox', 'ma_dao'],
        realmsKey: 'SWORD',
        statModifiers: {}
    },
    soul_path: {
        id: 'soul_path',
        category: 'specialized',
        name: 'Hồn Tu',
        desc: 'Con đường chuyên sâu tinh thần niệm lực, áp chế thần niệm đối thủ cực mạnh.',
        currency: 'Hồn linh',
        icon: '👻',
        races: ['HUMAN', 'YAO', 'DEMON'],
        requiredMain: [],
        realmsKey: 'SOUL_PATH',
        statModifiers: {}
    },
    buddhist: {
        id: 'buddhist',
        category: 'specialized',
        name: 'Phật Tu',
        desc: 'Tu luyện phật quang chính khí, kháng tính tâm ma vượt trội, hộ thân đệ nhất.',
        currency: 'Phật quang',
        icon: '☸️',
        races: ['HUMAN'],
        requiredMain: ['orthodox'],
        realmsKey: 'BUDDHIST',
        statModifiers: {
            defMult: 1.15,
            stabilityDecay: 0.5,
            breakthroughPenalty: 10 // +10% success chance
        }
    },
    confucian: {
        id: 'confucian',
        category: 'specialized',
        name: 'Nho Tu',
        desc: 'Tu luyện Hạo Nhiên Chính Khí. Nâng cao tốc độ ngộ đạo và thân pháp linh hoạt.',
        currency: 'Chính khí',
        icon: '📜',
        races: ['HUMAN'],
        requiredMain: ['orthodox'],
        realmsKey: 'CONFUCIAN',
        statModifiers: {
            comprehensionMult: 1.25,
            spdMult: 1.1
        }
    }
};
