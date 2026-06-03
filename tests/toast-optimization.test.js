import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UISystem } from '../src/ui/ui-system.js';
import { audioManager } from '../src/utils/audio-manager.js';

// Mock GSAP and Capacitor Preferences to avoid issues in happy-dom environment
vi.mock('gsap', () => {
    const gsapMock = {
        fromTo: vi.fn(),
        to: vi.fn(),
        delayedCall: vi.fn(() => ({
            kill: vi.fn()
        })),
        killTweensOf: vi.fn()
    };
    return {
        gsap: gsapMock,
        default: gsapMock
    };
});

vi.mock('@capacitor/preferences', () => {
    return {
        Preferences: {
            get: vi.fn(),
            set: vi.fn()
        }
    };
});

vi.mock('../src/utils/audio-manager.js', () => {
    return {
        audioManager: {
            playSfx: vi.fn()
        }
    };
});

describe('UISystem Toast Notification Optimizations', () => {
    let uiSystem;

    beforeEach(() => {
        // Set up DOM nodes required by UISystem constructor
        document.body.innerHTML = `
            <div id="notification-container"></div>
            <div id="modal-overlay"></div>
            <div id="modal-content"></div>
            <div id="modal-icon"></div>
            <div id="modal-title"></div>
            <div id="modal-message"></div>
            <div id="modal-btn-confirm"></div>
            <div id="modal-btn-cancel"></div>
            <div id="modal-input-container"></div>
            <div id="modal-input"></div>
            <div id="loading-overlay"></div>
            <div id="time-era"></div>
            <div id="time-date"></div>
            <div id="time-season"></div>
            <div id="time-hour"></div>
            <div id="time-period"></div>
            <div id="time-phenomenon"></div>
            <div id="global-tooltip"></div>
            <div id="app"></div>
        `;

        vi.clearAllMocks();
        uiSystem = new UISystem();
    });

    it('should limit active visible notifications to maximum of 3', () => {
        // Add 4 different notifications
        uiSystem.toast('Thông báo 1', 'info');
        uiSystem.toast('Thông báo 2', 'info');
        uiSystem.toast('Thông báo 3', 'info');
        
        const container = document.getElementById('notification-container');
        expect(container.children.length).toBe(3);

        // Pushing a 4th one should discard the oldest (first) one
        uiSystem.toast('Thông báo 4', 'info');
        expect(container.children.length).toBe(3);

        // The remaining three should be 2, 3, and 4
        const messages = Array.from(container.children).map(child => child.dataset.baseMessage);
        expect(messages).toContain('Thông báo 2');
        expect(messages).toContain('Thông báo 3');
        expect(messages).toContain('Thông báo 4');
        expect(messages).not.toContain('Thông báo 1');
    });

    it('should stack identical notifications and update stack count badge', () => {
        uiSystem.toast('Nhận được linh thạch', 'success');
        uiSystem.toast('Nhận được linh thạch', 'success');
        uiSystem.toast('Nhận được linh thạch', 'success');

        const container = document.getElementById('notification-container');
        // It should keep only 1 DOM element instead of creating 3
        expect(container.children.length).toBe(1);

        const toastElement = container.children[0];
        expect(toastElement.dataset.count).toBe('3');

        const messageText = toastElement.querySelector('.toast-message-text');
        expect(messageText.innerHTML).toContain('Nhận được linh thạch');
        expect(messageText.innerHTML).toContain('x3');
    });

    it('should throttle success audio SFX playbacks when stacking success toasts', () => {
        // Send multiple success toasts in immediate succession
        uiSystem.toast('Thành công 1', 'success');
        uiSystem.toast('Thành công 1', 'success');
        uiSystem.toast('Thành công 1', 'success');

        // SFX should have only been called once (the consecutive runs are throttled)
        expect(audioManager.playSfx).toHaveBeenCalledTimes(1);
    });
});
