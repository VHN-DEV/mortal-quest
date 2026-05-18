// import './styles/main.css'; // Removed for static server compatibility
import { state } from './state.js';
import { Game } from './game.js';
import { gsap } from 'gsap';

// Legacy / Specialized Logic Imports (Will be modularized later)
import { EnemyGenerator, Enemy } from './core/enemy.js';
import { CombatEngine } from './core/combat-engine.js';
import { getItemById } from './configs/item-data.js';
import { getWorlds, getLocationById, findLocationName, DANGER_LEVELS } from './configs/map-data.js';
import { ASSETS, preloadAssets } from './configs/asset-data.js';
import { getRealmById, HUMAN_REALMS } from './configs/realm-data.js';
import { ALCHEMY_RECIPES } from './configs/alchemy-data.js';
import { SEEDS } from './configs/garden-data.js';
import { SECTS, getSectById } from './configs/sect-data.js';
import { CREATION_CONFIG, CREATION_RACES, CREATION_ROOTS, ROOT_RARITY, SECONDARY_TALENTS, CREATION_PHYSIQUES, CREATION_ORIGINS, CREATION_TRAITS, CREATION_SCENARIOS, ROOT_ELEMENTS, SPECIAL_ELEMENTS, CREATION_ARTIFACTS, CREATION_SYSTEMS } from './configs/creation-data.js';
import { PHYSIQUES } from './configs/physique-data.js';
import { TITLES } from './configs/fate-data.js';
import { NPCScreen } from './ui/controllers/NPCScreen.js';

window.npcScreen = new NPCScreen();

/**
 * Entry point của ứng dụng.
 * Khởi tạo Game engine và quản lý các logic chuyển tiếp.
 */

// Khởi tạo Game
const game = new Game();
window.game = game; // Global access cho onclick trong HTML
window.state = state;

// Khi DOM sẵn sàng, bắt đầu game
document.addEventListener('DOMContentLoaded', async () => {
    const elLoading = document.getElementById('loading-screen');
    const elBar = document.getElementById('loading-bar');
    const elPercent = document.getElementById('loading-percent');
    const elText = document.getElementById('loading-text');

    try {
        // Bắt đầu preload tài nguyên
        await preloadAssets((percent, text) => {
            // Sử dụng GSAP để làm mượt chuyển động của thanh progress
            if (elBar) {
                gsap.to(elBar, {
                    width: `${percent}%`,
                    duration: 0.5,
                    ease: "power1.out"
                });
            }
            if (elPercent) elPercent.textContent = `${percent}%`;
            if (elText) elText.textContent = text;
        });

        // Khởi tạo game engine
        await game.init();

        // Bind Location Detail Popup click trigger
        const btnLocationDetail = document.getElementById('btn-show-location-detail');
        if (btnLocationDetail) {
            btnLocationDetail.onclick = () => {
                if (state.currentWorldId && state.currentLocId) {
                    showLocationDetailPopup(state.currentWorldId, state.currentLocId);
                }
            };
        }

        // Close Location Detail Overlay events
        const overlayLocationDetail = document.getElementById('location-detail-overlay');
        const btnCloseLocDetail = document.getElementById('close-location-detail-btn');
        const btnConfirmLocDetail = document.getElementById('loc-detail-confirm-btn');

        if (btnCloseLocDetail) {
            btnCloseLocDetail.onclick = () => {
                state.ui.toggleOverlay('location-detail-overlay', false);
            };
        }

        if (btnConfirmLocDetail) {
            btnConfirmLocDetail.onclick = () => {
                state.ui.toggleOverlay('location-detail-overlay', false);
            };
        }

        if (overlayLocationDetail) {
            overlayLocationDetail.onclick = (e) => {
                if (e.target === overlayLocationDetail) {
                    state.ui.toggleOverlay('location-detail-overlay', false);
                }
            };
        }

        // Ẩn màn hình loading với hiệu ứng GSAP premium
        if (elLoading) {
            const tl = gsap.timeline({
                onComplete: () => {
                    elLoading.remove();
                    // Auto-start game logic if needed
                }
            });

            tl.to(elLoading, {
                opacity: 0,
                scale: 1.05,
                duration: 1,
                ease: "power2.inOut",
                pointerEvents: "none"
            });

            // Subtle entrance animation for the main app
            gsap.from("#app", {
                opacity: 0,
                y: 10,
                duration: 1,
                delay: 0.5,
                ease: "power2.out"
            });
        }
    } catch (err) {
        console.error('Lỗi khởi động game:', err);
        if (elText) elText.textContent = 'Lỗi nạp linh khí. Vui lòng làm mới trang.';
    }
});

// --- COMPATIBILITY LAYER ---
// Các hàm này được gọi từ HTML hoặc các file JS cũ. 
// Chúng ta mapping chúng vào game instance.

window.refreshUI = () => game.refreshUI();
window.switchScreen = (screenId, btn) => state.ui.switchScreen(screenId, btn);

const showLocationDetailPopup = (worldId, locId) => {
    const loc = getLocationById(worldId, locId);
    if (!loc) return;

    // Set Name & Description
    const elName = document.getElementById('loc-detail-name');
    const elDesc = document.getElementById('loc-detail-description');
    if (elName) elName.textContent = loc.name;
    if (elDesc) elDesc.textContent = loc.description || 'Vùng đất thần bí ẩn chứa linh khí thiên địa.';

    // Set Image
    const elImg = document.getElementById('loc-detail-image');
    if (elImg) {
        const defaultBg = ASSETS.backgrounds?.cultivation || '';
        elImg.src = loc.image || defaultBg;
    }

    // Set Region & Sub-Region
    const elRegion = document.getElementById('loc-detail-region');
    const elSubRegion = document.getElementById('loc-detail-subregion');
    if (elRegion) elRegion.textContent = loc.regionName || 'Thiên Địa';
    if (elSubRegion) {
        if (loc.subRegionName) {
            elSubRegion.textContent = loc.subRegionName;
            elSubRegion.classList.remove('hidden');
        } else {
            elSubRegion.classList.add('hidden');
        }
    }

    // Set Min Realm Yêu Cầu
    const elMinRealm = document.getElementById('loc-detail-min-realm');
    if (elMinRealm) {
        const realmName = getRealmById(loc.minRealm).name;
        elMinRealm.textContent = realmName;
        
        // Color depending on if the player satisfies the realm
        const satisfies = state.player.realmId >= loc.minRealm;
        elMinRealm.className = `text-[10px] font-ancient uppercase tracking-wider block ${satisfies ? 'text-cultivation-gold' : 'text-red-500'}`;
    }

    // Set Danger Level
    const elDanger = document.getElementById('loc-detail-danger');
    if (elDanger) {
        const dangerConfig = DANGER_LEVELS[loc.danger] || DANGER_LEVELS.an_toan;
        elDanger.textContent = dangerConfig.name;
        elDanger.style.color = dangerConfig.color;
    }

    // Set Resources Section
    const elResourcesSection = document.getElementById('loc-detail-resources-section');
    const elResources = document.getElementById('loc-detail-resources');
    if (elResourcesSection && elResources) {
        if (loc.resources && loc.resources.length > 0) {
            elResourcesSection.classList.remove('hidden');
            elResources.innerHTML = loc.resources.map(res => `
                <span class="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 text-[9px] font-ancient text-gray-300 flex items-center gap-1 select-none">
                    🌿 ${res}
                </span>
            `).join('');
        } else {
            elResourcesSection.classList.add('hidden');
        }
    }

    // Set Energies Section
    const elEnergiesSection = document.getElementById('loc-detail-energies-section');
    const elEnergies = document.getElementById('loc-detail-energies');
    if (elEnergiesSection && elEnergies) {
        if (loc.energies && loc.energies.length > 0) {
            elEnergiesSection.classList.remove('hidden');
            const typeMap = {
                'linh_khi': 'Linh Khí',
                'ma_khi': 'Ma Khí',
                'yeu_khi': 'Yêu Khí',
                'kiem_khi': 'Kiếm Khí',
                'tu_khi': 'Tử Khí',
                'hon_khi': 'Hồn Khí',
                'hao_nhien_chinh_khi': 'Hạo Nhiên Chính Khí',
                'sinh_khi': 'Sinh Khí'
            };
            const purityMap = {
                'TINH_THUAN': 'Tinh Thuần',
                'CUC_PHAM': 'Cực Phẩm',
                'TAP': 'Tạp Chất',
                'DAO': 'Đạo Vận'
            };
            const purityColors = {
                'TINH_THUAN': '#3b82f6',
                'CUC_PHAM': '#ef4444',
                'TAP': '#94a3b8',
                'DAO': '#d4af37'
            };

            elEnergies.innerHTML = loc.energies.map(eng => {
                const typeName = typeMap[eng.type] || eng.type.replace(/_/g, ' ').toUpperCase();
                const purityName = purityMap[eng.purity] || 'Thường';
                const purityColor = purityColors[eng.purity] || '#a855f7';
                
                let detailStr = `${typeName} (Nồng độ: ${eng.concentration}%)`;
                if (eng.element) {
                    detailStr = `${eng.element}-Thuộc Tính ${typeName} (Nồng độ: ${eng.concentration}%)`;
                }

                return `
                    <div class="flex items-center justify-between p-2 rounded-xl bg-black/20 border border-white/5 text-[9px] select-none">
                        <span class="text-white font-medium">${detailStr}</span>
                        <span class="px-2 py-0.5 rounded text-[8px] font-ancient font-semibold tracking-wider" style="background-color: ${purityColor}15; border: 1px solid ${purityColor}30; color: ${purityColor}">
                            ${purityName}
                        </span>
                    </div>
                `;
            }).join('');
        } else {
            elEnergiesSection.classList.add('hidden');
        }
    }

    // Set Elemental Qi (Ngũ Hành) Grid
    const elElementQiSection = document.getElementById('loc-detail-element-qi-section');
    const elElementQi = document.getElementById('loc-detail-element-qi');
    if (elElementQiSection && elElementQi) {
        const defaultQi = {
            'Kim': 15, 'Mộc': 15, 'Thủy': 15, 'Hỏa': 15, 'Thổ': 15,
            'Phong': 5, 'Lôi': 5, 'Băng': 5, 'Quang': 5, 'Ám': 5
        };
        const elementQi = loc.elementQi || defaultQi;
        
        const ELEMENT_COLORS = {
            'Kim': '#fcd34d', 'Mộc': '#4ade80', 'Thủy': '#3b82f6', 'Hỏa': '#ef4444', 'Thổ': '#d97706',
            'Phong': '#94a3b8', 'Lôi': '#fbbf24', 'Băng': '#60a5fa', 'Quang': '#fffbeb', 'Ám': '#a855f7'
        };
        const ELEMENT_ICONS = {
            'Kim': '⚔️', 'Mộc': '🌿', 'Thủy': '💧', 'Hỏa': '🔥', 'Thổ': '⛰️',
            'Phong': '🌪️', 'Lôi': '⚡', 'Băng': '❄️', 'Quang': '☀️', 'Ám': '🌙'
        };
        
        const elements = ['Kim', 'Mộc', 'Thủy', 'Hỏa', 'Thổ', 'Phong', 'Lôi', 'Băng', 'Quang', 'Ám'];
        elElementQi.innerHTML = elements.map(el => {
            const pct = elementQi[el] || 0;
            const color = ELEMENT_COLORS[el];
            const icon = ELEMENT_ICONS[el];
            const active = pct > 0;

            return `
                <div class="flex items-center justify-between p-1.5 rounded-lg border bg-black/10 transition-all select-none"
                    style="border-color: ${active ? color + '20' : 'rgba(255,255,255,0.02)'}; opacity: ${active ? '1' : '0.25'}">
                    <span class="flex items-center space-x-1">
                        <span class="text-xs" style="color: ${color}">${icon}</span>
                        <span class="text-[8px] font-ancient font-semibold text-gray-400">${el}</span>
                    </span>
                    <span class="text-[9px] font-mono font-bold" style="color: ${active ? color : '#6b7280'}">${pct}%</span>
                </div>
            `;
        }).join('');
    }

    // Toggle Overlay using state.ui
    state.ui.toggleOverlay('location-detail-overlay', true);
};
window.showLocationDetailPopup = showLocationDetailPopup;

// --- RE-IMPLEMENTING MISSING LOGIC (TEMPORARY) ---
// Một số logic phức tạp chưa được tách sang Screen sẽ nằm ở đây hoặc SystemsScreen.

let lastRenderedLocId = null;

window.renderMainStats = () => {
    const player = state.player;
    if (!player) return;

    // 1. Render global stats (Header & Time HUD) - always update!
    const realm = player.getCurrentRealm();
    const elRealm = document.getElementById('current-realm');
    if (elRealm) elRealm.textContent = realm.name;

    const elLingShiText = document.getElementById('ling-shi-text');
    if (elLingShiText) elLingShiText.innerHTML = player.getFormattedLingShi();

    renderTimeHUD();

    // 2. Skip the rest of cultivation screen rendering if it is not currently visible!
    if (state.ui && state.ui.currentScreenId !== 'screen-main') return;

    // Render current location name and background dynamically
    const elLocName = document.getElementById('main-current-location');
    const elMainScreen = document.getElementById('screen-main');

    if (elLocName || elMainScreen) {
        const locName = findLocationName(state.currentLocId);
        if (elLocName && elLocName.textContent !== locName) {
            elLocName.textContent = locName;
        }

        if (elMainScreen && lastRenderedLocId !== state.currentLocId) {
            lastRenderedLocId = state.currentLocId;
            const loc = getLocationById(state.currentWorldId, state.currentLocId);
            const defaultBg = ASSETS.backgrounds.cultivation;
            const bgUrl = loc?.image || defaultBg;

            // Set linear-gradient overlay for excellent readability and atmosphere
            elMainScreen.style.backgroundImage = `linear-gradient(to bottom, rgba(10, 10, 12, 0.85), rgba(10, 10, 12, 0.95)), url('${bgUrl}')`;
            elMainScreen.style.backgroundSize = 'cover';
            elMainScreen.style.backgroundPosition = 'center';
            elMainScreen.style.transition = 'background-image 1.5s ease-in-out';

            // Render 10-element local Qi distribution grid on the main cultivation screen
            const elMainQiGrid = document.getElementById('main-element-qi-grid');
            const elMainPurityTag = document.getElementById('main-purity-tag');
            if (elMainQiGrid && loc) {
                const ELEMENT_COLORS = {
                    'Kim': '#fcd34d', 'Mộc': '#4ade80', 'Thủy': '#3b82f6', 'Hỏa': '#ef4444', 'Thổ': '#d97706',
                    'Phong': '#94a3b8', 'Lôi': '#fbbf24', 'Băng': '#60a5fa', 'Quang': '#fffbeb', 'Ám': '#a855f7'
                };
                const ELEMENT_ICONS = {
                    'Kim': '⚔️', 'Mộc': '🌿', 'Thủy': '💧', 'Hỏa': '🔥', 'Thổ': '⛰️',
                    'Phong': '🌪️', 'Lôi': '⚡', 'Băng': '❄️', 'Quang': '☀️', 'Ám': '🌙'
                };

                // Get location specific elementQi or default balanced
                const defaultQi = {
                    'Kim': 15, 'Mộc': 15, 'Thủy': 15, 'Hỏa': 15, 'Thổ': 15,
                    'Phong': 5, 'Lôi': 5, 'Băng': 5, 'Quang': 5, 'Ám': 5
                };
                const elementQi = loc.elementQi || defaultQi;

                if (elMainPurityTag && loc.energies && loc.energies.length > 0) {
                    const mainEnergy = loc.energies[0];
                    const purityMap = {
                        'TINH_THUAN': 'Tinh Thuần',
                        'CUC_PHAM': 'Cực Phẩm',
                        'TAP': 'Tạp Chất',
                        'DAO': 'Đạo Vận'
                    };
                    elMainPurityTag.textContent = `${mainEnergy.type.replace(/_/g, ' ').toUpperCase()} - ${purityMap[mainEnergy.purity] || 'Thường'}`;
                }

                const elements = ['Kim', 'Mộc', 'Thủy', 'Hỏa', 'Thổ', 'Phong', 'Lôi', 'Băng', 'Quang', 'Ám'];
                elMainQiGrid.innerHTML = elements.map(el => {
                    const pct = elementQi[el] || 0;
                    const color = ELEMENT_COLORS[el];
                    const icon = ELEMENT_ICONS[el];
                    const active = pct > 0;

                    return `
                        <div class="flex flex-col items-center justify-center p-1.5 rounded-lg border transition-all select-none
                            ${active ? 'bg-white/[0.02] border-white/10' : 'bg-black/10 border-white/[0.02] opacity-30'}"
                            style="${active ? `border-color: ${color}20 !important; box-shadow: inset 0 0 4px ${color}10 !important;` : ''}">
                            <span class="text-xs filter drop-shadow-[0_0_2px_${color}]" style="color: ${color}">${icon}</span>
                            <span class="text-[7px] font-ancient font-semibold text-gray-400 mt-0.5">${el}</span>
                            <span class="text-[8px] font-mono font-bold mt-0.5" style="color: ${active ? color : '#6b7280'}">${pct}%</span>
                        </div>
                    `;
                }).join('');
            }
        }
    }

    const progress = (player.tuVi / realm.expRequired) * 100;

    const elProgress = document.getElementById('tu-vi-progress');
    const elTuViText = document.getElementById('tu-vi-text');
    const elPerSec = document.getElementById('tu-vi-per-sec');
    const elBodyProgress = document.getElementById('body-progress');
    const elBodyText = document.getElementById('body-text');
    const elSoulProgress = document.getElementById('soul-progress');
    const elSoulText = document.getElementById('soul-text');
    const elBtnBreakthrough = document.getElementById('breakthrough-btn');
    const elBtnCultivateText = document.getElementById('cultivate-btn-text');

    if (elProgress) {
        // Sử dụng style.width trực tiếp thay vì GSAP trong vòng lặp render mỗi khung hình
        // để tránh xung đột hoạt ảnh và đảm bảo khớp 100% với con số hiển thị.
        elProgress.style.width = `${Math.min(100, progress)}%`;
    }
    if (elTuViText) elTuViText.textContent = `${Math.floor(player.tuVi).toLocaleString()} / ${realm.expRequired.toLocaleString()}`;

    let tvps = player.tuViPerSecond;
    if (state.systems.time) {
        const season = state.systems.time.getSeason();
        if (season.bonus && season.bonus.tvps) tvps *= season.bonus.tvps;
    }

    if (elPerSec) elPerSec.textContent = `+${tvps.toFixed(1)}/s`;

    const bodyRealm = player.getCurrentRealm('body');
    const soulRealm = player.getCurrentRealm('soul');
    const bodyPercent = Math.min(100, (player.bodyExp / bodyRealm.expRequired) * 100);
    const soulPercent = Math.min(100, (player.soulExp / soulRealm.expRequired) * 100);

    if (elBodyProgress) elBodyProgress.style.width = `${bodyPercent}%`;
    if (elSoulProgress) elSoulProgress.style.width = `${soulPercent}%`;

    if (elBodyText) elBodyText.textContent = `${Math.floor(bodyPercent)}%`;
    if (elSoulText) elSoulText.textContent = `${Math.floor(soulPercent)}%`;

    // Circular Progress Update
    const circleTuVi = document.getElementById('circle-tu-vi');
    const circleBody = document.getElementById('circle-body');
    const circleSoul = document.getElementById('circle-soul');

    if (circleTuVi) {
        const circumference = 301.6;
        const offset = circumference - (Math.min(100, progress) / 100) * circumference;
        circleTuVi.style.strokeDashoffset = offset;
    }
    if (circleBody) {
        const circumference = 276.5;
        const offset = circumference - (bodyPercent / 100) * circumference;
        circleBody.style.strokeDashoffset = offset;
    }
    if (circleSoul) {
        const circumference = 251.3;
        const offset = circumference - (soulPercent / 100) * circumference;
        circleSoul.style.strokeDashoffset = offset;
    }

    const focus = player.cultivationFocus || 'tuvi';
    const focusMap = {
        tuvi: { id: 'focus-tuvi', label: 'THU NẠP LINH KHÍ', icon: 'ph-sparkle' },
        body: { id: 'focus-body', label: 'RÈN LUYỆN NHỤC THÂN', icon: 'ph-fire' },
        soul: { id: 'focus-soul', label: 'TÔI LUYỆN THẦN THỨC', icon: 'ph-brain' }
    };
    Object.entries(focusMap).forEach(([key, data]) => {
        const btn = document.getElementById(data.id);
        if (!btn) return;
        const active = key === focus;
        const activeClass = key === 'tuvi'
            ? 'bg-qi-blue/20 text-qi-blue border border-qi-blue/30 focus-tuvi'
            : key === 'body'
                ? 'bg-red-500/20 text-red-400 border border-red-500/30 focus-body'
                : 'bg-qi-purple/20 text-qi-purple border border-qi-purple/30 focus-soul';
        btn.className = `flex-grow py-2 rounded-lg text-[8px] font-ancient uppercase tracking-widest transition-all ${active ? activeClass : 'text-gray-500 border border-transparent hover:text-white'}`;
    });
    if (elBtnCultivateText) {
        const cfg = focusMap[focus];
        elBtnCultivateText.innerHTML = `<i class="ph ${cfg.icon} mr-2"></i>${cfg.label}`;
    }
    if (elBtnBreakthrough) {
        const check = player.canBreakthrough(focus);
        elBtnBreakthrough.disabled = !check.can;
        elBtnBreakthrough.title = check.can ? '' : (check.reason || 'Chưa đủ điều kiện');
    }
};

window.renderTimeHUD = () => {
    if (!state.systems.time) return;

    const t = state.systems.time.getFormattedTime();
    if (state.ui && state.ui.updateTimeUI) {
        state.ui.updateTimeUI(t);
    }
};

const CREATION_BONUS_LABELS = {
    atk: 'Công',
    def: 'Thủ',
    maxHp: 'Sinh lực',
    spd: 'Tốc',
    mana: 'Mana',
    luck: 'Khí vận',
    karma: 'Nghiệp',
    tvps: 'Tu vi/s',
    alchemySuccess: 'Tỉ lệ luyện đan',
    bodyExpSpeed: 'Tốc độ nhục thân',
    soulExpSpeed: 'Tốc độ thần thức',
    qiAbsorb: 'Hấp thu linh khí',
    critRate: 'Bạo kích',
    critDmg: 'ST Bạo kích',
    lifeSteal: 'Hút máu',
    pierce: 'Xuyên thấu',
    soulPierce: 'Xuyên hồn',
    daoVun: 'Đạo vận',
    murderQi: 'Sát khí',
    fireDmg: 'ST Hỏa',
    waterDmg: 'ST Thủy',
    thunderDmg: 'ST Lôi',
    maxAge: 'Thọ nguyên',
    spdPercent: 'Tốc độ (%)',
    avoidRate: 'Né tránh',
    maxMana: 'Mana tối đa',
    techniqueMastery: 'Lĩnh ngộ công pháp',
    breakthroughChance: 'Tỉ lệ đột phá',
    comprehension: 'Ngộ tính',
    daoTam: 'Đạo tâm',
    divineSense: 'Thần thức',
    physique: 'Căn cốt',
    allRes: 'Kháng Tất Cả'
};

const formatCreationBonus = (bonus = {}) => {
    const normalized = { ...bonus, ...(bonus.stats || {}) };
    delete normalized.stats;

    const multiplierStats = [
        'tvps', 'alchemySuccess', 'bodyExpSpeed', 'soulExpSpeed',
        'qiAbsorb', 'critRate', 'critDmg', 'lifeSteal',
        'pierce', 'soulPierce', 'fireDmg', 'waterDmg', 'thunderDmg', 'allRes'
    ];

    return Object.entries(normalized)
        .map(([key, value]) => {
            if (typeof value !== 'number') return null;
            const label = CREATION_BONUS_LABELS[key] || key;

            if (multiplierStats.includes(key) || key === 'techniqueMastery' || key === 'breakthroughChance') {
                let percent;
                if (['critRate', 'critDmg', 'lifeSteal', 'pierce', 'soulPierce', 'fireDmg', 'waterDmg', 'thunderDmg', 'breakthroughChance', 'allRes'].includes(key)) {
                    percent = Math.round(value * 100);
                } else {
                    // For tvps, 1.2 means +20%, 4.0 means +300%
                    percent = Math.round((value - 1) * 100);
                }

                if (percent === 0) return null;
                return `${label} ${percent > 0 ? '+' : ''}${percent}%`;
            }

            if (value === 0) return null;
            return `${label} ${value > 0 ? '+' : ''}${value}`;
        })
        .filter(Boolean)
        .join(' · ');
};

const formatOriginResources = (origin) => {
    const lingShi = origin?.resources?.lingShi || 0;
    const monthly = origin?.monthlyResources?.lingShi || 0;
    const items = origin?.resources?.items || [];
    const karma = origin?.resources?.karma || 0;

    const lines = [];
    if (lingShi !== 0) lines.push(`Linh thạch ${lingShi > 0 ? '+' : ''}${lingShi}`);
    if (monthly !== 0) lines.push(`Bổng lộc/tháng ${monthly > 0 ? '+' : ''}${monthly}`);
    if (karma !== 0) lines.push(`Nghiệp lực ${karma > 0 ? '+' : ''}${karma}`);

    if (items.length > 0) {
        const itemNames = items.map(id => {
            const item = getItemById(id);
            return item ? item.name : id;
        });
        lines.push(`Vật phẩm: ${itemNames.join(', ')}`);
    }

    if (origin?.startingTitle) {
        const title = TITLES.find(t => t.id === origin.startingTitle);
        if (title) lines.push(`Danh hiệu: [${title.name}]`);
    }

    return lines.join(' · ');
};

const PORTRAIT_REGISTRY = [
    // Males
    { id: 'player_male', name: 'Nam Tiên Sĩ', gender: 'Nam', race: 'HUMAN' },
    { id: 'han_lap', name: 'Hàn Lập', gender: 'Nam', race: 'HUMAN' },
    { id: 'han_phi_vu', name: 'Hàn Phi Vũ', gender: 'Nam', race: 'HUMAN' },
    { id: 'bach_tu_linh', name: 'Bạch Tử Linh', gender: 'Nam', race: 'HUMAN' },
    { id: 'han_vien', name: 'Hàn Viên', gender: 'Nam', race: 'HUMAN' },
    { id: 'kiem_vo_tam', name: 'Kiếm Vô Tâm', gender: 'Nam', race: 'HUMAN' },
    { id: 'vo_danh', name: 'Vô Danh Tiên Khách', gender: 'Nam', race: 'HUMAN' },
    { id: 'bang_nguyet', name: 'Băng Nguyệt', gender: 'Nam', race: 'HUMAN' },
    { id: 'player_legacy', name: 'Cổ Đạo Hữu', gender: 'Nam', race: 'HUMAN' },
    { id: 'sect_elder', name: 'Tông Môn Trưởng Lão', gender: 'Nam', race: 'HUMAN' },
    { id: 'merchant', name: 'Vạn Bảo Thương Nhân', gender: 'Nam', race: 'HUMAN' },
    { id: 'demon', name: 'Ma Tộc Chân Ma', gender: 'Nam', race: 'DEMON' },

    // Females
    { id: 'player_female', name: 'Nữ Tiên Sĩ', gender: 'Nữ', race: 'HUMAN' },
    { id: 'du_nhuoc_nhan', name: 'Dư Nhược Nhan', gender: 'Nữ', race: 'HUMAN' },
    { id: 'phuong_ca', name: 'Phương Ca', gender: 'Nữ', race: 'HUMAN' },
    { id: 'phuong_vu', name: 'Phương Vũ', gender: 'Nữ', race: 'HUMAN' },
    { id: 'tran_tu_huyen', name: 'Trần Tử Huyền', gender: 'Nữ', race: 'HUMAN' },
    { id: 'xich_nguyet', name: 'Xích Nguyệt', gender: 'Nữ', race: 'HUMAN' },
    { id: 'tu_linh', name: 'Tử Linh Tiên Tử', gender: 'Nữ', race: 'HUMAN' },
    { id: 'thanh_lien', name: 'Thanh Liên Nữ Đế', gender: 'Nữ', race: 'HUMAN' },
    { id: 'thanh_nhi', name: 'Thanh Nhi', gender: 'Nữ', race: 'HUMAN' },
    { id: 'bach_minh_anh', name: 'Bạch Minh Anh', gender: 'Nữ', race: 'HUMAN' },
    { id: 'lan_anh', name: 'Lan Anh', gender: 'Nữ', race: 'HUMAN' },
    { id: 'minh_nguyet', name: 'Minh Nguyệt', gender: 'Nữ', race: 'HUMAN' }
];

window.renderCreationScreen = () => {
    const sys = state.systems.creation;
    if (!sys) return;

    const elRoots = document.getElementById('creation-roots-grid');
    const elPhysiques = document.getElementById('creation-physiques-list');
    const elOrigins = document.getElementById('creation-origins-list');
    const elTraits = document.getElementById('creation-traits-grid');
    const elPoints = document.getElementById('creation-points-value');
    const elPointsContainer = document.getElementById('creation-points-container');
    const elPointsLabel = document.getElementById('creation-points-label');
    const elPointsNote = document.getElementById('creation-points-note');
    const elModeDescription = document.getElementById('creation-mode-description');
    const elStatsPreview = document.getElementById('creation-stats-preview');

    // Mode Buttons
    const btnCustom = document.getElementById('creation-mode-custom');
    if (btnCustom) {
        btnCustom.onclick = () => window.game.selectCreationMode('custom');
        btnCustom.className = `flex-grow py-3 text-[9px] md:text-[10px] font-ancient uppercase rounded-xl transition-all ${sys.mode === 'custom' ? 'bg-qi-blue/20 text-qi-blue border border-qi-blue/30' : 'text-gray-500'}`;
    }

    if (elPointsContainer) elPointsContainer.classList.remove('hidden');


    const modeDescriptions = {
        custom: 'Tùy Chỉnh: bạn có thể tự build hoặc bấm "Gợi ý ngẫu nhiên" để hệ thống xáo trộn nhanh rồi tinh chỉnh tiếp.'
    };

    if (elModeDescription) elModeDescription.textContent = modeDescriptions[sys.mode] || '';

    if (elPointsLabel && elPointsNote) {
        elPointsLabel.textContent = 'Điểm Tiên Duyên:';
        elPointsNote.textContent = 'Điểm dùng để tùy chỉnh. Điểm thừa sẽ chuyển hóa thành May mắn và Ngộ tính.';
    }

    if (elStatsPreview) {
        // Base stats for a new player (starting realm)
        const root = CREATION_ROOTS[sys.selectedRoot] || {};
        const phys = PHYSIQUES[sys.selectedPhysique] || {};
        const origin = CREATION_ORIGINS[sys.selectedOrigin] || {};
        const race = CREATION_RACES[sys.selectedRace] || {};

        const classInfo = sys.getRootClassification();
        const rootElementsStr = sys.selectedRootElements.map(e => {
            const pct = sys.selectedRootElementProportions[e] || 0;
            const el = ROOT_ELEMENTS[e] || SPECIAL_ELEMENTS[e] || { icon: '✨' };
            return `${el.icon} ${e} (${pct}%)`;
        }).join(', ');

        elStatsPreview.innerHTML = `
            <div class="space-y-2">
                <div class="flex justify-between items-center border-b border-white/5 pb-1">
                    <span class="opacity-60">Chủng tộc</span>
                    <span class="font-medium">${race.name}</span>
                </div>
                <div class="flex justify-between items-start border-b border-white/5 pb-1">
                    <span class="opacity-60">Linh căn</span>
                    <div class="text-right">
                        <div class="font-medium" style="color: ${ROOT_RARITY[sys.rootRarity].color}">
                            ${ROOT_RARITY[sys.rootRarity].name} ${classInfo.name}
                        </div>
                        <div class="text-[8px] text-qi-blue opacity-80">
                            Tinh khiết: ${sys.rootPurity}% · ${rootElementsStr}
                        </div>
                    </div>
                </div>
                <div class="flex justify-between items-center border-b border-white/5 pb-1">
                    <span class="opacity-60">Thể chất</span>
                    <span class="font-medium">${phys.name || 'Phàm Thể'}</span>
                </div>
                <div class="flex justify-between items-center border-b border-white/5 pb-1">
                    <span class="opacity-60">Xuất thân</span>
                    <span class="font-medium">${origin.name}</span>
                </div>
            </div>
        `;

        const realmLevel = sys.startingRealmId ?? 0;
        const realmMult = realmLevel > 0 ? Math.pow(1.8, realmLevel - 1) : 1.0;

        const base = {
            atk: (10 + (realmLevel * 5)) * realmMult,
            def: (5 + (realmLevel * 2)) * realmMult,
            maxHp: (100 + (realmLevel * 20)) * realmMult,
            mana: (50 + (realmLevel * 50)) * realmMult,
            spd: (15 + (realmLevel * 5)) * realmMult,
            luck: 50,
            karma: 0,
            maxAge: 100 + (realmLevel * 50),
            critRate: 0.05,
            alchemySuccess: 0,
            qiAbsorb: 1.0
        };

        const raceBonus = CREATION_RACES[sys.selectedRace]?.bonus || {};
        const rootBonus = CREATION_ROOTS[sys.selectedRoot]?.bonus || {};
        const physBonus = PHYSIQUES[sys.selectedPhysique]?.bonus || {};
        const traitBonus = sys.selectedTraits.reduce((acc, traitId) => {
            const bonus = CREATION_TRAITS[traitId]?.bonus || {};
            Object.entries(bonus).forEach(([k, v]) => {
                if (k === 'stats') {
                    Object.entries(v).forEach(([sk, sv]) => acc[sk] = (acc[sk] || 0) + sv);
                } else {
                    acc[k] = (acc[k] || 0) + v;
                }
            });
            return acc;
        }, {});

        // Elemental bonuses
        const elementBonus = sys.selectedRootElements.reduce((acc, elName) => {
            const el = ROOT_ELEMENTS[elName] || SPECIAL_ELEMENTS[elName];
            if (el && el.bonus) {
                Object.entries(el.bonus).forEach(([k, v]) => {
                    if (['fireDmg', 'waterDmg', 'thunderDmg', 'poisonDmg', 'skillDmg', 'dotDmg', 'qiAbsorb'].includes(k)) {
                        acc[k] = (acc[k] || 1) * v;
                    } else {
                        acc[k] = (acc[k] || 0) + v;
                    }
                });
            }
            return acc;
        }, {});

        const sumFlat = (key) => (raceBonus[key] || 0) + (rootBonus[key] || 0) + (physBonus[key] || 0) + (traitBonus[key] || 0) + (elementBonus[key] || 0);

        // Multiplier logic for TVPS & Qi Absorb (dynamic based on element proportions balance)
        const rootMult = (root.bonus?.qiAbsorb || 1.0) * ROOT_RARITY[sys.rootRarity].multiplier * (sys.rootPurity / 100) * classInfo.multiplierScale;
        const tvpsBonus = (raceBonus.tvps || 1) * rootMult * (physBonus.tvps || 1) * (traitBonus.tvps || 1) * (elementBonus.tvps || 1);
        const qiBonus = (raceBonus.qiAbsorb || 1) * (root.bonus?.qiAbsorb || 1.0) * (physBonus.qiAbsorb || 1) * (traitBonus.qiAbsorb || 1) * (elementBonus.qiAbsorb || 1);

        const previewStats = [
            { label: 'Công', value: Math.floor(base.atk + sumFlat('atk')), color: 'text-red-400' },
            { label: 'Thủ', value: Math.floor(base.def + sumFlat('def')), color: 'text-blue-400' },
            { label: 'Sinh lực', value: Math.floor(base.maxHp + sumFlat('maxHp')), color: 'text-emerald-400' },
            { label: 'Mana', value: Math.floor(base.mana + sumFlat('mana') + sumFlat('maxMana')), color: 'text-purple-400' },
            { label: 'Tốc', value: Math.floor(base.spd + sumFlat('spd')), color: 'text-yellow-400' },
            { label: 'Thọ nguyên', value: Math.floor(base.maxAge + sumFlat('maxAge')), color: 'text-orange-400' },
            { label: 'May mắn', value: Math.floor(base.luck + sumFlat('luck')), color: 'text-cyan-400' },
            { label: 'Nghiệp lực', value: Math.floor(base.karma + sumFlat('karma')), color: 'text-rose-500' },
            { label: 'Bạo kích', value: `${Math.round((base.critRate + sumFlat('critRate')) * 100)}%`, color: 'text-red-500' },
            { label: 'Hấp thu', value: `x${qiBonus.toFixed(1)}`, color: 'text-qi-jade' },
            { label: 'Luyện đan', value: `+${Math.round(sumFlat('alchemySuccess') * 100)}%`, color: 'text-emerald-500' },
            { label: 'Tu vi/s', value: `+${Math.round((tvpsBonus - 1) * 100)}%`, color: 'text-cultivation-gold' }
        ];

        elStatsPreview.innerHTML = previewStats.map(stat => {
            const numVal = typeof stat.value === 'number' ? stat.value : null;
            const text = numVal !== null ? `${numVal}` : stat.value;
            // Highlight if stat is boosted above base
            let isBoosted = false;
            const key = Object.keys(base).find(k => CREATION_BONUS_LABELS[k] === stat.label);
            if (key) {
                if (numVal !== null) isBoosted = numVal > base[key];
                else if (stat.label === 'Tu vi/s') isBoosted = stat.value !== '+0%';
                else if (stat.label === 'Hấp thu') isBoosted = qiBonus > 1.0;
                else if (stat.label === 'Luyện đan') isBoosted = sumFlat('alchemySuccess') > 0;
                else if (stat.label === 'Bạo kích') isBoosted = (base.critRate + sumFlat('critRate')) > base.critRate;
            }

            return `
                <div class="rounded-xl border border-white/10 bg-black/35 px-2 py-2 text-center transition-all hover:border-white/20">
                    <div class="text-[7px] text-gray-500 uppercase tracking-tighter mb-0.5">${stat.label}</div>
                    <div class="text-[10px] md:text-xs font-bold ${isBoosted ? stat.color : 'text-gray-400'}">${text}</div>
                </div>
            `;
        }).join('');

        // --- Bonus from leftover points preview ---
        if (sys.points > 0) {
            const luckBonus = Math.floor(sys.points * 0.5);
            const compBonus = (sys.points * 0.1).toFixed(1);
            const tuviBonus = sys.points * 100;
            const rating = sys.getDestinyRating(sys.points);

            const bonusEl = document.createElement('div');
            bonusEl.className = 'col-span-full mt-2 p-2 bg-qi-blue/10 border border-qi-blue/20 rounded-xl text-[8px] text-qi-blue italic text-center animate-pulse';
            bonusEl.innerHTML = `
                <i class="ph ph-sparkle mr-1"></i> Nghịch Thiên Cải Mệnh: ${rating} 
                (May mắn +${luckBonus}, Ngộ tính +${compBonus}, Tu vi +${tuviBonus})
            `;
            elStatsPreview.appendChild(bonusEl);
        }
    }
    // Starting Resources Panel (Custom only)
    const elResourcesPanel = document.getElementById('creation-resources-panel');
    if (elResourcesPanel) elResourcesPanel.classList.toggle('hidden', sys.mode !== 'custom');

    const elLingShiInput = document.getElementById('creation-lingshi-input');
    if (elLingShiInput) {
        elLingShiInput.value = sys.startingLingShi;
        elLingShiInput.onchange = (e) => {
            const val = parseInt(e.target.value) || 0;
            sys.startingLingShi = val;
            sys.calculatePoints();
            window.renderCreationScreen();
        };
    }

    if (elPoints) {
        elPoints.textContent = sys.points;
        elPoints.className = `text-xl md:text-2xl font-bold font-mono ${sys.points < 0 ? 'text-red-500' : 'text-qi-blue'}`;
    }

    const elStartingRealmSelect = document.getElementById('creation-starting-realm-select');
    if (elStartingRealmSelect) {
        const availableRealms = HUMAN_REALMS.filter(realm => realm.id <= 64);
        elStartingRealmSelect.innerHTML = availableRealms.map(realm => `
            <option value="${realm.id}">${realm.name}</option>
        `).join('');
        elStartingRealmSelect.value = String(sys.startingRealmId ?? 0);
        elStartingRealmSelect.onchange = (e) => {
            sys.startingRealmId = parseInt(e.target.value, 10);
            if (isNaN(sys.startingRealmId)) sys.startingRealmId = 0;
        };
    }

    const elRerollContainer = document.getElementById('creation-reroll-container');
    if (elRerollContainer) elRerollContainer.classList.toggle('hidden', sys.mode !== 'custom');

    const btnReroll = document.getElementById('creation-reroll-btn');
    if (btnReroll) {
        btnReroll.onclick = () => {
            if (state.systems.creation) {
                state.systems.creation.rollRandom();
                window.renderCreationScreen();
            }
        };
    }

    // Name Input
    const elNameInput = document.getElementById('creation-name-input');
    if (elNameInput) {
        elNameInput.value = sys.playerName;
        elNameInput.oninput = (e) => sys.playerName = e.target.value;
    }

    // Gender Buttons
    const btnMale = document.getElementById('creation-gender-male');
    const btnFemale = document.getElementById('creation-gender-female');
    if (btnMale && btnFemale) {
        btnMale.className = `flex-grow py-2 text-[10px] font-ancient uppercase rounded-lg transition-all ${sys.playerGender === 'Nam' ? 'bg-qi-blue/20 text-qi-blue border border-qi-blue/30' : 'text-gray-500 hover:text-white'}`;
        btnFemale.className = `flex-grow py-2 text-[10px] font-ancient uppercase rounded-lg transition-all ${sys.playerGender === 'Nữ' ? 'bg-qi-blue/20 text-qi-blue border border-qi-blue/30' : 'text-gray-500 hover:text-white'}`;
    }

    // Age Input
    const elAgeInput = document.getElementById('creation-age-input');
    if (elAgeInput) {
        elAgeInput.value = sys.playerAge;
        elAgeInput.onchange = (e) => {
            sys.playerAge = parseInt(e.target.value) || 18;
            window.renderCreationScreen();
        };
    }

    // 1. Render main screen preview avatar card
    const elAvatarPreview = document.getElementById('creation-avatar-preview');
    const elAvatarName = document.getElementById('creation-avatar-name');
    if (elAvatarPreview) {
        elAvatarPreview.src = ASSETS.portraits[sys.playerAvatar] || '';
    }
    if (elAvatarName) {
        const found = PORTRAIT_REGISTRY.find(p => p.id === sys.playerAvatar);
        elAvatarName.textContent = found ? found.name : 'Vô Danh';
    }

    // 2. Filter buttons visual updates inside modal
    const genderFilters = {
        all: document.getElementById('avatar-filter-gender-all'),
        Nam: document.getElementById('avatar-filter-gender-nam'),
        Nữ: document.getElementById('avatar-filter-gender-nu')
    };
    Object.entries(genderFilters).forEach(([g, btn]) => {
        if (!btn) return;
        const active = sys.avatarFilterGender === g;
        btn.className = `avatar-filter-btn flex-grow py-1.5 text-[8.5px] font-ancient uppercase rounded-lg transition-all text-center ${active ? 'bg-qi-blue/20 text-white border border-qi-blue/30 shadow-lg' : 'text-gray-500 hover:text-white'}`;
    });

    const raceFilters = {
        all: document.getElementById('avatar-filter-race-all'),
        HUMAN: document.getElementById('avatar-filter-race-human'),
        YAO: document.getElementById('avatar-filter-race-yao'),
        DEMON: document.getElementById('avatar-filter-race-demon')
    };
    Object.entries(raceFilters).forEach(([r, btn]) => {
        if (!btn) return;
        const active = sys.avatarFilterRace === r;
        btn.className = `avatar-filter-btn flex-grow py-1.5 text-[8.5px] font-ancient uppercase rounded-lg transition-all text-center ${active ? 'bg-qi-purple/20 text-white border border-qi-purple/30 shadow-lg' : 'text-gray-500 hover:text-white'}`;
    });

    // 3. Render popup modal grid
    const elAvatarPopupGrid = document.getElementById('creation-avatar-popup-grid');
    if (elAvatarPopupGrid) {
        const filteredAvatars = PORTRAIT_REGISTRY.filter(p => {
            const matchGender = sys.avatarFilterGender === 'all' || p.gender === sys.avatarFilterGender;
            let matchRace = true;
            if (sys.avatarFilterRace !== 'all') {
                if (sys.avatarFilterRace === 'YAO') {
                    const yaoFriendly = ['kiem_vo_tam', 'bach_tu_linh', 'xich_nguyet', 'tu_linh', 'bang_nguyet', 'thanh_lien', 'player_legacy'];
                    matchRace = yaoFriendly.includes(p.id);
                } else {
                    matchRace = p.race === sys.avatarFilterRace;
                }
            }
            return matchGender && matchRace;
        });

        if (filteredAvatars.length === 0) {
            elAvatarPopupGrid.innerHTML = `
                <div class="col-span-full py-8 text-center text-[10px] text-gray-500 font-ancient uppercase tracking-wider">
                    Không tìm thấy diện mạo phù hợp
                </div>
            `;
        } else {
            elAvatarPopupGrid.innerHTML = filteredAvatars.map(p => {
                const active = sys.playerAvatar === p.id;
                const url = ASSETS.portraits[p.id] || '';
                return `
                    <div onclick="window.game.selectCreationAvatar('${p.id}')" 
                        class="relative group rounded-2xl border-2 ${active ? 'border-cultivation-gold shadow-[0_0_12px_rgba(212,175,55,0.4)]' : 'border-white/5'} overflow-hidden cursor-pointer bg-black/40 hover:border-qi-blue/50 transition-all duration-300 flex flex-col items-center p-1.5 shrink-0">
                        <div class="w-full aspect-square rounded-xl overflow-hidden relative mb-1.5 shrink-0">
                            <img src="${url}" class="w-full h-full object-cover group-hover:scale-110 transition-all duration-500">
                            ${active ? `
                                <div class="absolute top-1 right-1 w-4 h-4 bg-cultivation-gold rounded-full flex items-center justify-center shadow-lg">
                                    <i class="ph ph-check text-[10px] text-qi-ink font-bold"></i>
                                </div>
                            ` : ''}
                        </div>
                        <span class="text-[7.5px] text-gray-400 group-hover:text-white font-ancient font-semibold uppercase tracking-wider truncate w-full text-center transition-colors">
                            ${p.name}
                        </span>
                    </div>
                `;
            }).join('');
        }
    }

    // Race List
    const elRaces = document.getElementById('creation-races-list');
    if (elRaces) {
        elRaces.innerHTML = Object.values(CREATION_RACES).map(r => {
            const active = sys.selectedRace === r.id;
            const bonuses = (formatCreationBonus(r.bonus) || 'Chỉ số cơ bản').split(' · ');
            return `
                <button onclick="window.game.selectCreationRace('${r.id}')" 
                    class="q-card min-w-[140px] ${active ? 'active text-red-400 border-red-400' : 'text-gray-400 border-white/10'}">
                    <div class="flex justify-between items-start gap-2">
                        <div class="q-title ${active ? 'text-red-400' : ''}">${r.name}</div>
                        <div class="q-cost">
                            <i class="ph ph-users"></i>
                            ${r.cost}
                        </div>
                    </div>
                    <div class="q-desc">${r.desc}</div>
                    <div class="q-bonus-list">
                        ${bonuses.map(b => `<span class="q-bonus-tag" style="color: #f87171; background: rgba(248, 113, 113, 0.1); border-color: rgba(248, 113, 113, 0.2)">${b}</span>`).join('')}
                    </div>
                </button>
            `;
        }).join('');
    }

    if (elRoots) {
        const ELEMENT_COLORS = {
            'Kim': '#fcd34d', 'Mộc': '#4ade80', 'Thủy': '#3b82f6', 'Hỏa': '#ef4444', 'Thổ': '#d97706',
            'Lôi': '#fbbf24', 'Băng': '#60a5fa', 'Phong': '#94a3b8', 'Độc': '#c084fc', 'Quang': '#fffbeb', 'Ám': '#a855f7'
        };
        const classInfo = sys.getRootClassification();
        const rootData = CREATION_ROOTS[sys.selectedRoot];
        const bonuses = (formatCreationBonus(rootData.bonus) || 'Chỉ số cơ bản').split(' · ');

        const normalActive = sys.rootTab === 'normal';
        const mutatedActive = sys.rootTab === 'mutated';

        if (normalActive) {
            ['Kim', 'Mộc', 'Thủy', 'Hỏa', 'Thổ'].forEach(elName => {
                const pct = sys.selectedRootElementProportions[elName] || 0;
                if (pct > 0) {
                    const icon = ROOT_ELEMENTS[elName]?.icon || '✨';
                    bonuses.push(`${icon} Hấp thu hệ ${elName} +${pct}%`);
                }
            });
        } else {
            sys.selectedRootElements.forEach(elName => {
                const icon = SPECIAL_ELEMENTS[elName]?.icon || '✨';
                bonuses.push(`${icon} Hấp thu hệ ${elName} +100%`);
            });
        }

        let tabContentHtml = '';
        if (normalActive) {
            tabContentHtml = `
                <div class="mt-4 p-4 rounded-xl border border-white/5 bg-black/20 space-y-3">
                    <div class="flex justify-between items-center text-[8px] uppercase tracking-wider font-bold mb-1">
                        <span class="text-qi-blue">Tỷ Lệ Thuộc Tính (Tổng: 100%)</span>
                        <span style="color: ${ROOT_RARITY[sys.rootRarity].color}">${classInfo.name}</span>
                    </div>
                    <div class="space-y-3">
                        ${['Kim', 'Mộc', 'Thủy', 'Hỏa', 'Thổ'].map(elName => {
                const pct = sys.selectedRootElementProportions[elName] || 0;
                const el = ROOT_ELEMENTS[elName];
                const color = ELEMENT_COLORS[elName];
                return `
                                <div class="flex items-center justify-between gap-3 py-1 border-b border-white/[0.02]">
                                    <div class="flex items-center gap-1.5 w-20 shrink-0 text-[9px] font-medium" style="color: ${color}">
                                        <span class="text-xs">${el.icon}</span>
                                        <span class="font-ancient font-semibold">${elName}</span>
                                        <span class="font-mono font-bold ml-auto">${pct}%</span>
                                    </div>
                                    <div class="flex items-center gap-2 flex-grow">
                                        <button onclick="window.game.adjustCreationRootProportion('${elName}', ${pct - 1})" 
                                            style="width: 18px !important; height: 18px !important; min-width: 18px !important; min-height: 18px !important; padding: 0 !important; margin: 0 !important; display: inline-flex !important; align-items: center !important; justify-content: center !important; font-size: 10px !important; line-height: 1 !important; border-radius: 4px !important; background: rgba(255, 255, 255, 0.05) !important; border: 1px solid rgba(255, 255, 255, 0.1) !important; color: #9ca3af !important; cursor: pointer !important; transition: all 0.2s !important;"
                                            onmouseenter="this.style.setProperty('background', 'rgba(255,255,255,0.15)', 'important'); this.style.setProperty('color', '#fff', 'important');" 
                                            onmouseleave="this.style.setProperty('background', 'rgba(255,255,255,0.05)', 'important'); this.style.setProperty('color', '#9ca3af', 'important');"
                                            class="select-none">
                                            -
                                        </button>
                                        <input type="range" min="0" max="100" value="${pct}" 
                                            class="flex-grow h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-white transition-all hover:bg-white/10"
                                            style="background: linear-gradient(to right, ${color} 0%, ${color} ${pct}%, rgba(255,255,255,0.05) ${pct}%, rgba(255,255,255,0.05) 100%) !important"
                                            oninput="window.game.adjustCreationRootProportion('${elName}', this.value)"
                                        >
                                        <button onclick="window.game.adjustCreationRootProportion('${elName}', ${pct + 1})" 
                                            style="width: 18px !important; height: 18px !important; min-width: 18px !important; min-height: 18px !important; padding: 0 !important; margin: 0 !important; display: inline-flex !important; align-items: center !important; justify-content: center !important; font-size: 10px !important; line-height: 1 !important; border-radius: 4px !important; background: rgba(255, 255, 255, 0.05) !important; border: 1px solid rgba(255, 255, 255, 0.1) !important; color: #9ca3af !important; cursor: pointer !important; transition: all 0.2s !important;"
                                            onmouseenter="this.style.setProperty('background', 'rgba(255,255,255,0.15)', 'important'); this.style.setProperty('color', '#fff', 'important');" 
                                            onmouseleave="this.style.setProperty('background', 'rgba(255,255,255,0.05)', 'important'); this.style.setProperty('color', '#9ca3af', 'important');"
                                            class="select-none">
                                            +
                                        </button>
                                    </div>
                                </div>
                            `;
            }).join('')}
                    </div>
                    
                    ${!classInfo.isBalanced ? `
                        <div class="text-[7.5px] text-red-400 bg-red-500/5 border border-red-500/10 px-2.5 py-2 rounded-lg leading-relaxed flex items-start gap-1.5 mt-2">
                            <i class="ph ph-warning-circle text-[10px] mt-0.5 shrink-0"></i>
                            <span>Linh Căn bị lệch hoặc pha tạp nhiều tạp chất: Tốc độ hấp thu linh khí giảm ${Math.round((1 - classInfo.multiplierScale) * 100)}%. Kéo các thanh thuộc tính về trạng thái cân bằng để tăng tối đa tốc độ tu luyện!</span>
                        </div>
                    ` : `
                        <div class="text-[7.5px] text-green-400 bg-green-500/5 border border-green-500/10 px-2.5 py-2 rounded-lg leading-relaxed flex items-start gap-1.5 mt-2">
                            <i class="ph ph-sparkle text-[10px] mt-0.5 shrink-0"></i>
                            <span>Linh Căn đạt trạng thái hòa hợp hoàn mỹ! Tốc độ hấp thu linh lực gia tăng thêm +${Math.round((classInfo.multiplierScale - 1) * 100)}% tốc độ tu luyện.</span>
                        </div>
                    `}
                </div>
            `;
        } else {
            tabContentHtml = `
                <div class="mt-4 p-4 rounded-xl border border-white/5 bg-black/20 space-y-3">
                    <div class="text-[8px] uppercase tracking-wider font-bold text-qi-purple mb-1">
                        Chọn Thuộc Tính Dị Linh Căn (Duy nhất 1)
                    </div>
                    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2 mt-2">
                        ${['Phong', 'Lôi', 'Băng', 'Quang', 'Ám'].map(elName => {
                const el = SPECIAL_ELEMENTS[elName];
                const elActive = sys.selectedRootElements.includes(elName);
                const color = ELEMENT_COLORS[elName];
                return `
                                <button onclick="window.game.selectCreationMutatedElement('${elName}')" 
                                    class="p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all text-center cursor-pointer select-none
                                    ${elActive ? 'bg-qi-purple/10 border-qi-purple text-white shadow-lg' : 'bg-black/30 border-white/5 text-gray-400 hover:border-white/10 hover:text-white'}"
                                    style="${elActive ? `border-color: ${color} !important; box-shadow: 0 0 8px ${color}40 !important;` : ''}">
                                    <span class="text-xl filter drop-shadow" style="${elActive ? `text-shadow: 0 0 10px ${color}` : ''}">${el.icon}</span>
                                    <span class="text-[9px] font-ancient font-bold" style="color: ${elActive ? color : ''}">${elName}</span>
                                    <span class="text-[7px] text-gray-500 leading-none">${el.orientation}</span>
                                </button>
                            `;
            }).join('')}
                    </div>
                    
                    <div class="text-[7.5px] text-purple-400 bg-purple-500/5 border border-purple-500/10 px-2.5 py-2 rounded-lg leading-relaxed flex items-start gap-1.5 mt-2">
                        <i class="ph ph-sparkle text-[10px] mt-0.5 shrink-0"></i>
                        <span>Dị Linh Căn đột biến sở hữu các thuộc tính vô cùng hiếm gặp trong tự nhiên. +15% tốc độ tu luyện và mang lại các hiệu ứng đặc thù bá đạo khi chiến đấu!</span>
                    </div>
                </div>
            `;
        }

        elRoots.innerHTML = `
            <div class="flex gap-2 p-1 bg-black/40 rounded-xl border border-white/5 mb-4">
                <button onclick="window.game.selectCreationRootTab('normal')" 
                    class="flex-1 py-2 px-3 rounded-lg text-[9px] uppercase tracking-wider font-bold transition-all text-center cursor-pointer
                    ${normalActive ? 'bg-qi-blue/20 text-white border border-qi-blue/30 shadow-lg shadow-qi-blue/5' : 'text-gray-400 border border-transparent hover:text-white'}">
                    Linh Căn Thường
                </button>
                <button onclick="window.game.selectCreationRootTab('mutated')" 
                    class="flex-1 py-2 px-3 rounded-lg text-[9px] uppercase tracking-wider font-bold transition-all text-center cursor-pointer
                    ${mutatedActive ? 'bg-qi-purple/20 text-white border border-qi-purple/30 shadow-lg shadow-qi-purple/5' : 'text-gray-400 border border-transparent hover:text-white'}">
                    Dị Linh Căn
                </button>
            </div>
            
            <div class="q-card active border-qi-blue/30 p-4 rounded-xl bg-gradient-to-br from-black/40 to-white/[0.02] border border-white/5 flex flex-col gap-2.5">
                <div class="flex justify-between items-center">
                    <div class="flex flex-col">
                        <span class="text-[8px] text-gray-500 uppercase tracking-widest leading-none mb-1">Cấp bậc Linh Căn</span>
                        <span class="text-xs font-ancient font-bold text-qi-blue">${classInfo.name}</span>
                    </div>
                    <div class="flex items-center gap-1 px-2.5 py-1 bg-qi-blue/10 border border-qi-blue/20 text-qi-blue rounded-lg text-[9px] font-bold">
                        <i class="ph ph-lightning text-[10px]"></i>
                        <span>Tốn: ${rootData.cost} Điểm</span>
                    </div>
                </div>
                
                <div class="text-[8.5px] text-gray-400 leading-relaxed font-light">
                    ${rootData.desc}
                </div>
                
                <div class="flex flex-wrap gap-1.5 mt-1">
                    ${bonuses.map(b => `
                        <span class="px-2 py-0.5 rounded text-[8px] font-bold border" style="color: #60a5fa; background: rgba(96, 165, 250, 0.05); border-color: rgba(96, 165, 250, 0.15)">
                            ${b}
                        </span>
                    `).join('')}
                </div>
            </div>
            
            ${tabContentHtml}
        `;
    }

    // Secondary Talents List
    const elTalentsList = document.getElementById('creation-talents-list');
    const elTalentsHeader = document.querySelector('#creation-talents-container span');

    if (elTalentsHeader && !document.getElementById('reroll-talents-btn')) {
        const btn = document.createElement('button');
        btn.id = 'reroll-talents-btn';
        btn.className = 'p-1.5 rounded-lg bg-qi-blue/10 border border-qi-blue/20 text-qi-blue hover:bg-qi-blue/20 transition-all flex items-center space-x-1';
        btn.onclick = () => window.game.rerollCreationTalents();
        btn.innerHTML = `<i class="ph ph-arrows-clockwise text-[10px]"></i> <span class="text-[8px] font-bold">Xí Ngầu</span>`;

        const wrapper = elTalentsHeader.parentElement;
        if (wrapper) {
            const controls = wrapper.querySelector('.flex.items-center.space-x-2');
            if (controls) controls.prepend(btn);
        }
    }

    if (elTalentsList) {
        elTalentsList.innerHTML = Object.values(SECONDARY_TALENTS).map(t => {
            const baseVal = sys.talents[t.id];
            const totalVal = sys.getTalentValue(t.id);
            const bonus = totalVal - baseVal;

            let color = 'text-gray-400';
            if (totalVal > 80) color = 'text-cultivation-gold';
            else if (totalVal > 60) color = 'text-qi-blue';

            return `
                <div class="flex flex-col space-y-1.5 p-2 rounded-xl bg-black/40 border border-white/5">
                    <div class="flex justify-between items-center">
                        <span class="text-[9px] font-ancient text-white/80 uppercase tracking-widest">${t.name}</span>
                        <div class="flex items-center space-x-1.5">
                            ${bonus !== 0 ? `<span class="text-[8px] ${bonus > 0 ? 'text-green-400' : 'text-red-400'}">${bonus > 0 ? '+' : ''}${bonus}</span>` : ''}
                            <span class="text-xs font-mono font-bold ${color}">${totalVal}</span>
                        </div>
                    </div>
                    <div class="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                        <div class="h-full bg-qi-blue shadow-[0_0_8px_rgba(79,209,197,0.3)]" style="width: ${Math.min(100, totalVal)}%"></div>
                    </div>
                    <div class="text-[7px] text-gray-600 italic leading-tight">${t.desc}</div>
                </div>
            `;
        }).join('');
    }

    if (elPhysiques) {
        elPhysiques.innerHTML = Object.values(CREATION_PHYSIQUES).map(p => {
            const active = sys.selectedPhysique === p.id;
            const physData = PHYSIQUES[p.id] || p; // Fallback to p if not in PHYSIQUES
            const bonuses = (formatCreationBonus(physData.bonus) || 'Chỉ số cơ bản').split(' · ');
            return `
                <button onclick="window.game.selectCreationPhysique('${p.id}')" 
                    class="q-card ${active ? 'active text-qi-purple border-qi-purple' : 'text-gray-400 border-white/10'} w-full">
                    <div class="flex justify-between items-start gap-2">
                        <div class="q-title ${active ? 'text-qi-purple' : ''}">${p.name}</div>
                        <div class="q-cost">
                            <i class="ph ph-sparkle"></i>
                            ${p.cost}
                        </div>
                    </div>
                    <div class="q-desc">${p.desc}</div>
                    <div class="q-bonus-list">
                        ${bonuses.map(b => `<span class="q-bonus-tag" style="color: #a855f7; background: rgba(168, 85, 247, 0.1); border-color: rgba(168, 85, 247, 0.2)">${b}</span>`).join('')}
                    </div>
                </button>
            `;
        }).join('');
    }

    if (elOrigins) {
        elOrigins.innerHTML = Object.values(CREATION_ORIGINS).map(o => {
            const active = sys.selectedOrigin === o.id;
            const resources = (formatOriginResources(o) || '').split(' · ');
            return `
                <button onclick="window.game.selectCreationOrigin('${o.id}')" 
                    class="q-card ${active ? 'active text-qi-blue border-qi-blue' : 'text-gray-400 border-white/10'} w-full">
                    <div class="flex justify-between items-start gap-2">
                        <div class="q-title ${active ? 'text-qi-blue' : ''}">${o.name}</div>
                        <div class="q-cost">
                            <i class="ph ph-scroll"></i>
                            ${o.cost}
                        </div>
                    </div>
                    <div class="q-desc">${o.desc}</div>
                    <div class="q-bonus-list">
                        ${resources.map(r => `<span class="q-bonus-tag" style="color: #60a5fa; background: rgba(96, 165, 250, 0.1); border-color: rgba(96, 165, 250, 0.2)">${r}</span>`).join('')}
                    </div>
                </button>
            `;
        }).join('');
    }

    // Cheat Systems List
    const elSystems = document.getElementById('creation-systems-list');
    if (elSystems) {
        elSystems.innerHTML = CREATION_SYSTEMS.map(s => {
            const active = sys.selectedCheatSystem === s.id;
            return `
                <button onclick="window.game.selectCreationCheatSystem('${s.id}')" 
                    class="q-card text-left ${active ? 'active border-amber-500/80 shadow-[0_0_15px_rgba(245,158,11,0.15)]' : 'text-gray-400 border-white/10'} w-full transition-all duration-300">
                    <div class="flex justify-between items-start gap-2">
                        <div class="flex items-center space-x-2">
                            <span class="text-base text-amber-400"><i class="${s.icon}"></i></span>
                            <div class="q-title font-ancient ${active ? 'text-cultivation-gold' : 'text-white/80'}">${s.name}</div>
                        </div>
                        <div class="text-[8px] px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-cultivation-gold uppercase font-bold tracking-wider">
                            ${s.difficulty}
                        </div>
                    </div>
                    <div class="q-desc mt-1.5 text-left">${s.desc}</div>
                    <div class="q-bonus-list mt-2 flex flex-wrap gap-1">
                        <span class="q-bonus-tag text-[8px] font-ancient" style="color: #fbbf24; background: rgba(251, 191, 36, 0.1); border-color: rgba(251, 191, 36, 0.2)">
                            Kiểu nhận: ${s.claimStyle === 'direct' ? 'Nhận Trực Tiếp' : s.claimStyle === 'chest' ? 'Rương Ngẫu Nhiên' : 'Chọn 1 Trong 3'}
                        </span>
                    </div>
                </button>
            `;
        }).join('');
    }


    // --- Artifacts List ---
    const elArtifacts = document.getElementById('creation-artifacts-list');
    if (elArtifacts) {
        const RARITY_COLOR = {
            'Danh Khí': { text: 'text-red-400', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)' },
            'Tiên Khí': { text: 'text-cyan-400', bg: 'rgba(34,211,238,0.1)', border: 'rgba(34,211,238,0.3)' },
            'Thông Thiên Linh Bảo': { text: 'text-amber-400', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.3)' },
        };

        elArtifacts.innerHTML = Object.values(CREATION_ARTIFACTS)
            .filter(a => a.rarity === 'Danh Khí')
            .map(a => {
                const active = sys.selectedArtifact === a.id;
                const col = RARITY_COLOR[a.rarity] || { text: 'text-gray-400', bg: 'rgba(255,255,255,0.05)', border: 'rgba(255,255,255,0.1)' };

                // Get item icon from database or default based on id
                const itemData = getItemById(a.id);
                const icon = itemData?.icon || (
                    a.id.includes('binh') ? '🍶' :
                        a.id.includes('dinh') ? '🏺' :
                            a.id.includes('cam') ? '🎻' :
                                a.id.includes('quan') ? '🎓' : '🔮'
                );

                return `
                    <button onclick="window.game.selectCreationArtifact('${a.id}')"
                        class="q-card text-left w-full ${active ? 'active border-red-500/80 shadow-[0_0_15px_rgba(239,68,68,0.15)]' : 'text-gray-400 border-white/10'} transition-all duration-300"
                    >
                        <div class="flex justify-between items-start gap-2">
                            <div class="flex items-center space-x-2">
                                <span class="text-base text-red-400">${icon}</span>
                                <div class="q-title font-ancient ${active ? 'text-red-400 font-bold' : 'text-white/80'}">${a.name}</div>
                            </div>
                            <div class="text-[8px] px-2 py-0.5 rounded bg-red-500/10 border border-red-500/20 text-red-400 font-bold uppercase tracking-wider flex items-center gap-0.5">
                                <i class="ph ph-star"></i>
                                -${a.cost}
                            </div>
                        </div>
                        <div class="q-desc mt-1.5 text-left">${a.desc}</div>
                        <div class="q-bonus-list mt-2 flex flex-wrap gap-1">
                            <span class="q-bonus-tag text-[8px] font-ancient" style="color: ${col.text.replace('text-', '')}; background: ${col.bg}; border-color: ${col.border}">
                                Phẩm giai: ${a.rarity}
                            </span>
                        </div>
                    </button>
                `;
            }).join('');
    }

    if (elTraits) {
        elTraits.innerHTML = Object.values(CREATION_TRAITS).map(t => {
            const active = sys.selectedTraits.includes(t.id);
            const bonuses = (formatCreationBonus(t.bonus) || 'Duyên phận').split(' · ');
            return `
                <button onclick="window.game.toggleCreationTrait('${t.id}')" 
                    class="q-card ${active ? 'active text-qi-jade border-qi-jade' : 'text-gray-400 border-white/10'}">
                    <div class="flex justify-between items-start gap-2">
                        <div class="q-title ${active ? 'text-qi-jade' : ''}">${t.name}</div>
                        <div class="q-cost">
                            <i class="ph ph-star"></i>
                            ${t.cost}
                        </div>
                    </div>
                    <div class="q-desc">${t.desc}</div>
                    <div class="q-bonus-list">
                        ${bonuses.map(b => `<span class="q-bonus-tag" style="color: #22c55e; background: rgba(34, 197, 94, 0.1); border-color: rgba(34, 197, 94, 0.2)">${b}</span>`).join('')}
                    </div>
                </button>
            `;
        }).join('');
    }

    // Binds for fixed buttons
    const btnStart = document.getElementById('creation-start-btn');
    if (btnStart) {
        btnStart.onclick = () => window.game.startCreationGame();
        btnStart.disabled = sys.points < 0;
        btnStart.style.opacity = sys.points < 0 ? '0.5' : '1';
    }

    const btnCreationBack = document.getElementById('btn-creation-back');
    if (btnCreationBack) {
        btnCreationBack.onclick = () => {
            window.game.showStartScreen();
        };
    }

};

// Global error handler
window.onerror = function (msg, url, lineNo, columnNo, error) {
    console.error('Thiên Cơ Hỗn Loạn:', msg, '\nTại:', url, ':', lineNo, ':', columnNo, '\nChi tiết:', error);
    return false;
};
