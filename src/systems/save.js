const SAVE_KEY = 'mortal_quest_save';

export const SaveSystem = {
    save: (data) => {
        localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    },
    load: () => {
        const saved = localStorage.getItem(SAVE_KEY);
        return saved ? JSON.parse(saved) : null;
    },
    clear: () => {
        localStorage.removeItem(SAVE_KEY);
    }
};
