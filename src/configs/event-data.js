export const EVENTS = [
    {
        id: 'ancient_cave',
        name: 'Phát hiện động phủ cổ',
        type: 'loot',
        description: 'Ngươi vô tình phát hiện một động phủ bị bỏ hoang từ vạn năm trước.',
        result: (player) => {
            const reward = Math.floor(player.tuViPerSecond * 100);
            player.tuVi += reward;
            return `Ngươi tìm thấy một ít linh đan cũ, nhận được ${reward} tu vi!`;
        }
    },
    {
        id: 'herb_discovery',
        name: 'Tìm thấy linh thảo',
        type: 'loot',
        description: 'Một gốc Linh Thảo đang tỏa hương thơm ngào ngạt giữa vách đá.',
        result: (player) => {
            player.inventory.addItem('linh_thao_thap', 2);
            return 'Ngươi hái được 2x Linh Thảo (Thấp)!';
        }
    },
    {
        id: 'ancient_manual',
        name: 'Nhặt được bí kíp công pháp',
        type: 'loot',
        description: 'Bên cạnh một bộ xương khô héo, ngươi tìm thấy một cuốn sách rách nát.',
        result: (player) => {
            const reward = Math.floor(player.tuViPerSecond * 500);
            const techPoints = 5;
            player.tuVi += reward;
            player.techniquePoints = (player.techniquePoints || 0) + techPoints;
            return `Ngươi lĩnh hội được một phần công pháp, nhận được ${reward} tu vi và ${techPoints} điểm công pháp!`;
        }
    },
    {
        id: 'spiritual_spring',
        name: 'Gặp linh tuyền',
        type: 'buff',
        description: 'Một hồ nước nhỏ tỏa ra linh khí đậm đặc.',
        result: (player) => {
            player.hp = player.maxHp;
            player.mana = player.maxMana;
            return 'Uống một ngụm nước suối, trạng thái của ngươi đã hồi phục hoàn toàn!';
        }
    },
    {
        id: 'ambush',
        name: 'Bị tà tu phục kích',
        type: 'combat',
        description: 'Một tên tà tu nhảy ra từ bụi rậm, ánh mắt tham lam nhìn chằm chằm vào túi trữ vật của ngươi.'
    },
    {
        id: 'wild_beast',
        name: 'Gặp yêu thú hăng máu',
        type: 'combat',
        description: 'Tiếng gầm rú vang lên, một con yêu thú đói khát đang lao về phía ngươi.'
    },
    {
        id: 'mysterious_merchant',
        name: 'Gặp thương nhân thần bí',
        type: 'npc',
        description: 'Một lão già gầy gò với chiếc túi lớn vẫy tay chào ngươi.',
        result: () => 'Lão già cười khà khà: "Hữu duyên thiên lý năng tương ngộ, có muốn mua gì không?" (Tính năng giao dịch sắp ra mắt)'
    }
];

export const getRandomEvent = (probs) => {
    const rand = Math.random();
    // Simplified logic to pick from types
    if (rand < probs.combat) {
        const combatEvents = EVENTS.filter(e => e.type === 'combat');
        return combatEvents[Math.floor(Math.random() * combatEvents.length)];
    }
    if (rand < probs.combat + probs.loot) {
        const lootEvents = EVENTS.filter(e => e.type === 'loot' || e.type === 'buff');
        return lootEvents[Math.floor(Math.random() * lootEvents.length)];
    }
    if (rand < probs.combat + probs.loot + probs.npc) {
        const npcEvents = EVENTS.filter(e => e.type === 'npc');
        return npcEvents[Math.floor(Math.random() * npcEvents.length)];
    }
    return null;
};
