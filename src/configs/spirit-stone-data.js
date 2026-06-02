import { SPIRIT_STONE_GRADES, SPIRIT_STONE_QUALITIES } from './game-enums.js';

export { SPIRIT_STONE_GRADES, SPIRIT_STONE_QUALITIES };

export const CONVERSION_RATE = 100; // Tỷ lệ quy đổi giữa các cấp



export const SPIRIT_STONE_ATTRIBUTES = {
    'NORMAL': { id: 'NORMAL', name: 'Vô Thuộc Tính', bonus: 1.0 },
    'FIRE': { id: 'FIRE', name: 'Hỏa', bonus: 1.2 },
    'ICE': { id: 'ICE', name: 'Băng', bonus: 1.2 },
    'WOOD': { id: 'WOOD', name: 'Mộc', bonus: 1.2 },
    'METAL': { id: 'METAL', name: 'Kim', bonus: 1.2 },
    'EARTH': { id: 'EARTH', name: 'Thổ', bonus: 1.2 },
    'LIGHTNING': { id: 'LIGHTNING', name: 'Lôi', bonus: 1.5 },
    'DEMON': { id: 'DEMON', name: 'Ma Khí', bonus: 1.5 },
    'IMMORTAL': { id: 'IMMORTAL', name: 'Tiên Khí', bonus: 2.0 }
};
