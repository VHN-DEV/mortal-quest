const SAVE_KEY = 'mortal_quest_save';

export const SaveSystem = {
    save: (data) => {
        localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    },
    load: () => {
        try {
            const saved = localStorage.getItem(SAVE_KEY);
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            console.error('Lỗi khi tải dữ liệu Thiên Cơ:', e);
            return null;
        }
    },
    clear: () => {
        localStorage.removeItem(SAVE_KEY);
        localStorage.removeItem('mortal_quest_current_screen');
        localStorage.removeItem('mortal_quest_map_view');
    }
};
