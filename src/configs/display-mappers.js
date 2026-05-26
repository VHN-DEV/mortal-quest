export const GENDER_MAP = {
    'male': 'Nam',
    'female': 'Nữ'
};

export const MOOD_MAP = {
    'normal': 'Bình thường',
    'happy': 'Vui vẻ',
    'sad': 'U sầu'
};

export const TECHNIQUE_TYPE_MAP = {
    'linh_luc': 'Linh Lực',
    'luyen_the': 'Luyện Thể',
    'than_thuc': 'Thần Thức',
    'don_thuat': 'Độn Thuật',
    'song_tu': 'Song Tu',
    'phu_tro': 'Phụ Trợ',
    'bi_phap': 'Bí Pháp',
    'secret': 'Bí Pháp'
};

export function getGenderLabel(gender) {
    return GENDER_MAP[gender] || gender || 'Nam';
}

export function getMoodLabel(mood) {
    return MOOD_MAP[mood] || mood || 'Bình thường';
}

export function getTechniqueTypeLabel(type) {
    return TECHNIQUE_TYPE_MAP[type] || type || '';
}

export function getTechniqueTypeSlug(type) {
    if (!type) return '';
    // If already a slug (exists as a key in TECHNIQUE_TYPE_MAP)
    if (TECHNIQUE_TYPE_MAP[type]) return type;
    
    // Otherwise look up key by value
    const entry = Object.entries(TECHNIQUE_TYPE_MAP).find(([_, val]) => val === type);
    return entry ? entry[0] : type;
}
