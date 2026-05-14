import { Preferences } from '@capacitor/preferences';

// Import local audio assets
import hitSound from '../assets/audio/combat_hit.mp3';
import critSound from '../assets/audio/combat_crit.mp3';
import breakthroughSound from '../assets/audio/breakthrough.mp3';
import successSound from '../assets/audio/success.mp3';
import clickSound from '../assets/audio/click.mp3';
import moveSound from '../assets/audio/move.mp3';
import levelupSound from '../assets/audio/levelup.mp3';
import bgmMain from '../assets/audio/bgm_main.mp3';
import bgmBattle from '../assets/audio/bgm_battle.mp3';
import bgmStart from '../assets/audio/bgm_start.mp3';

export class AudioManager {
    constructor() {
        this.bgm = null;
        this.currentBgmSource = null;
        this.isMuted = false;
        this.volume = 0.5;
        this.sfxVolume = 0.7;
        
        this.sounds = {
            combat_hit: hitSound,
            combat_crit: critSound,
            breakthrough: breakthroughSound,
            success: successSound,
            click: clickSound,
            move: moveSound,
            levelup: levelupSound
        };

        this.playlists = {
            main: bgmMain,
            battle: bgmBattle,
            start: bgmStart
        };

        this.init();
    }


    async init() {
        const { value: muted } = await Preferences.get({ key: 'mortal_quest_muted' });
        this.isMuted = muted === 'true';
        
        const { value: vol } = await Preferences.get({ key: 'mortal_quest_volume' });
        if (vol) this.volume = parseFloat(vol);
    }

    playBgm(key) {
        const source = this.playlists[key];
        if (!source || this.currentBgmSource === source) return;

        if (this.bgm) {
            this.fadeOutAndStop();
        }

        this.currentBgmSource = source;
        this.bgm = new Audio(source);
        this.bgm.loop = true;
        this.bgm.volume = 0;
        
        if (!this.isMuted) {
            this.bgm.play().catch(e => console.warn('BGM play failed:', e));
            this.fadeIn();
        }
    }

    playSfx(key) {
        if (this.isMuted) return;
        const source = this.sounds[key] || key;
        if (!source) return;

        const audio = new Audio(source);
        audio.volume = this.sfxVolume;
        audio.play().catch(e => console.warn('SFX play failed:', e));
    }

    fadeIn() {
        if (!this.bgm) return;
        let vol = 0;
        const interval = setInterval(() => {
            vol += 0.05;
            if (vol >= this.volume) {
                this.bgm.volume = this.volume;
                clearInterval(interval);
            } else {
                this.bgm.volume = vol;
            }
        }, 100);
    }

    fadeOutAndStop() {
        if (!this.bgm) return;
        const oldBgm = this.bgm;
        let vol = oldBgm.volume;
        const interval = setInterval(() => {
            vol -= 0.05;
            if (vol <= 0) {
                oldBgm.volume = 0;
                oldBgm.pause();
                clearInterval(interval);
            } else {
                oldBgm.volume = vol;
            }
        }, 100);
    }

    async toggleMute() {
        this.isMuted = !this.isMuted;
        await Preferences.set({ key: 'mortal_quest_muted', value: this.isMuted.toString() });
        
        if (this.isMuted) {
            if (this.bgm) this.bgm.pause();
        } else {
            if (this.bgm) this.bgm.play().catch(e => console.warn('BGM resume failed:', e));
        }
        return this.isMuted;
    }

    playClick() {
        this.playSfx('click');
    }
}

export const audioManager = new AudioManager();
