import { state } from '../../state.js';
import { getSectById, getSectRules } from '../../configs/sect-data.js';
import { getItemById } from '../../configs/item-data.js';
import { EnemyGenerator } from '../../core/enemy.js';
import { ASSETS } from '../../configs/asset-data.js';

export class SectController {
    constructor(parentScreen) {
        this.parentScreen = parentScreen;
    }

    get activeSectZone() {
        return this.parentScreen.activeSectZone;
    }

    set activeSectZone(val) {
        this.parentScreen.activeSectZone = val;
    }

    renderSects() {
        const elSects = document.getElementById('sects-view');
        if (!elSects) return;
        elSects.innerHTML = '';
        elSects.scrollTop = 0;

        if (state.player.sectId) {
            const sect = getSectById(state.player.sectId);
            
            // Check if player is viewing a detailed zone
            if (this.activeSectZone) {
                this.renderSectZoneDetail(sect, this.activeSectZone);
                return;
            }

            // Otherwise, render the main beautiful Sect dashboard and its Zones!
            const defaultZones = [
                { id: 'son_mon', name: 'Sơn Môn (Hộ Sơn Trận)', icon: '⛩️', desc: 'Canh gác sơn môn, duy trì Hộ Sơn Đại Trận phòng thủ.', badge: 'Hộ Sơn' },
                { id: 'chap_su_duong', name: 'Chấp Sự Đường', icon: '📜', desc: 'Nơi nhận ủy thác nhiệm vụ và xử lý công việc hành chính tông môn.', badge: 'Hành Chính', badgeColor: 'bg-qi-blue/20 text-qi-blue border-qi-blue/30' },
                { id: 'ngoai_mon_vien', name: 'Ngoại Môn Viện', icon: '🏡', desc: 'Nơi cư ngụ của đệ tử ngoại môn, làm tạp vụ và tu luyện cơ bản.', badge: 'Ngoại Môn', badgeColor: 'bg-green-500/20 text-green-400 border-green-500/30' },
                { id: 'noi_mon_vien', name: 'Nội Môn Viện', icon: '🏰', desc: 'Điện xá đệ tử nội môn, luận võ đài kiếm chiêu.', badge: 'Nội Môn', badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30', minRank: 1, minRankName: 'Nội Môn' },
                { id: 'chan_truyen_phong', name: 'Chân Truyền Phong', icon: '🏔️', desc: 'Sơn phong độc lập của thiên kiêu chân truyền, linh khí cực hạn.', badge: 'Chân Truyền', badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30', minRank: 2, minRankName: 'Chân Truyền' },
                { id: 'dai_dien', name: 'Nghị Sự Chủ Điện', icon: '🏛️', desc: 'Bái kiến Tông Chủ thỉnh an, thỉnh giáo nghe giảng đạo pháp bậc cao.', badge: 'Chủ Điện', badgeColor: 'bg-green-500/20 text-green-400 border-green-500/30' },
                { id: 'tang_kinh_cac', name: 'Tàng Kinh Các', icon: '📚', desc: 'Nơi truyền công pháp & tàng thư võ học tông môn.', badge: 'Công Pháp', badgeColor: 'bg-qi-blue/20 text-qi-blue border-qi-blue/30' },
                { id: 'tang_bao_cac', name: 'Tàng Bảo Các', icon: '💎', desc: 'Bảo khố tích trữ thần đan, dị bảo, linh thạch và trứng thú.', badge: 'Tàng Bảo', badgeColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
                { id: 'luyen_dan', name: 'Luyện Đan Điện', icon: '🧪', desc: 'Sử dụng địa hỏa tông môn tăng tốc độ và cơ hội thành công luyện đan.', badge: 'Luyện Đan', badgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
                { id: 'luyen_khi', name: 'Luyện Khí Các (Thiên Công)', icon: '⚒️', desc: 'Thiết kế, chế tạo pháp bảo khôi lỗi bằng lò rèn hỏa mạch.', badge: 'Chế Khí', badgeColor: 'bg-qi-blue/20 text-qi-blue border-qi-blue/30' },
                { id: 'linh_thu', name: 'Linh Thú Viên', icon: '🦁', desc: 'Nuôi dưỡng, thuần phục linh thú và linh trùng ngự thú.', badge: 'Ngự Thú', badgeColor: 'bg-green-500/20 text-green-400 border-green-500/30' },
                { id: 'duoc_vien', name: 'Linh Dược Dược Sơn', icon: '🌿', desc: 'Linh điền bồi dưỡng thảo dược thô sơ của môn phái.', badge: 'Dược Điền', badgeColor: 'bg-green-500/20 text-green-400 border-green-500/30' },
                { id: 'dong_phu', name: 'Động Phủ Đệ Tử (Bế Quan)', icon: '🛕', desc: 'Bế quan hấp thụ linh mạch vận công chu thiên đột phá cảnh giới.', badge: 'Động Phủ', badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
                { id: 'bi_canh', name: 'Thí Luyện Bí Cảnh', icon: '🗼', desc: 'Vào cấm địa thí luyện ảo cảnh tông môn thi đấu PvP đại tỷ năm.', badge: 'Bí Cảnh', badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30' },
                { id: 'thai_thuong_dien', name: 'Thái Thượng Điện / Cấm Địa', icon: '☯️', desc: 'Yết kiến Thái Thượng Trưởng Lão thỉnh bảo đạo mạch cấm kỵ.', badge: 'Tối Cao', badgeColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30', minRank: 3, minRankName: 'Trưởng Lão' }
            ];

            const currentRankScore = window.game?.systems?.sect?.getRank()?.rankScore || 0;

            const zonesHTML = defaultZones.map(z => {
                let actualZone = { ...z };
                if (sect.zoneOverrides && sect.zoneOverrides[z.id]) {
                    actualZone = { ...z, ...sect.zoneOverrides[z.id] };
                }

                const badgeStyle = actualZone.badgeColor || 'bg-qi-blue/10 text-qi-blue border-qi-blue/20';
                const isLocked = actualZone.minRank !== undefined && currentRankScore < actualZone.minRank;

                return `
                    <div class="p-3 bg-white/5 rounded-2xl border border-white/5 hover:border-qi-blue/30 transition-all flex justify-between items-center ${isLocked ? 'opacity-50' : 'cursor-pointer'}"
                         onclick="${isLocked ? `state.ui.toast('Cần chức vị từ ${actualZone.minRankName} trở lên để bước vào!', 'warning')` : `window.game.screens.systems.activeSectZone = '${z.id}'; window.game.screens.systems.renderSects();`}">
                        <div class="flex items-center space-x-3 min-w-0 flex-1">
                            <span class="text-2xl flex-shrink-0">${actualZone.icon}</span>
                            <div class="min-w-0 flex-1 pr-2">
                                <div class="flex items-center space-x-2">
                                    <h4 class="text-xs font-ancient text-white truncate font-bold">${actualZone.name}</h4>
                                    <span class="text-[8px] px-1.5 py-0.5 rounded-md border ${badgeStyle} font-bold font-ancient uppercase flex-shrink-0">${actualZone.badge}</span>
                                </div>
                                <p class="text-[9px] text-gray-500 mt-1 break-words line-clamp-2 leading-relaxed">${actualZone.desc}</p>
                            </div>
                        </div>
                        <div class="flex-shrink-0 ml-2">
                            ${isLocked ? '<i class="ph ph-lock text-red-500/80 text-xs"></i>' : '<i class="ph ph-caret-right text-gray-500 text-xs"></i>'}
                        </div>
                    </div>
                `;
            }).join('');

            const rank = window.game?.systems?.sect?.getRank();
            const contrib = state.player.sectContribution || 0;

            elSects.innerHTML = `
                <div class="bg-white/5 rounded-2xl border border-qi-blue/30 overflow-hidden mb-4">
                    <div class="h-28 relative">
                        <img src="${sect.portrait || ASSETS.backgrounds.sect}" class="w-full h-full object-cover opacity-40">
                        <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                        <div class="absolute bottom-3 left-4">
                            <h3 class="text-lg font-ancient text-white">${sect.name}</h3>
                            <p class="text-[9px] text-qi-blue uppercase tracking-widest mt-0.5">${sect.type === 'chinh' ? '✨ Danh Môn Chính Phái' : '😈 Ma Môn Tà Phái'}</p>
                        </div>
                    </div>
                    
                    <div class="p-3 bg-black/40 border-t border-white/5 flex justify-between items-center text-[10px]">
                        <div class="flex items-center space-x-4">
                            <div>Chức vị: <span class="font-bold text-white">${rank?.name || 'Ngoại Môn'}</span></div>
                            <div class="w-px h-3 bg-white/10"></div>
                            <div>Cống hiến: <span class="font-bold text-cultivation-gold">${contrib} CH</span></div>
                        </div>
                        <button class="px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[8px] font-bold rounded-lg border border-red-500/20 transition-all uppercase tracking-wider" 
                                onclick="if(confirm('Ngươi chắc chắn muốn từ chức? Hủy quan sẽ mất toàn bộ cống hiến!')) { window.game.systems.sect.resignRank(); window.game.screens.systems.renderSects(); }">
                            Từ Chức
                        </button>
                    </div>
                </div>

                <div class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 border-l-2 border-qi-blue pl-2">Địa Phận Tông Môn</div>
                
                <div class="grid grid-cols-1 gap-2.5 pb-12">
                    ${zonesHTML}
                </div>
            `;
            return;
        }

        // --- SECT RECRUITMENT HALL ---
        // Render Sect list if player is a rogue cultivator (Tán Tu)
        const sectsListHTML = Object.values(window.SECTS || {}).map(sect => {
            let requirementsHTML = '';
            let canJoin = true;

            if (sect.requirements) {
                const reqs = [];
                if (sect.requirements.minRealm) {
                    const realmName = state.player.getRealmName ? state.player.getRealmName(sect.requirements.minRealm) : `Realm ${sect.requirements.minRealm}`;
                    const hasRealm = state.player.realmId >= sect.requirements.minRealm;
                    reqs.push(`<span class="${hasRealm ? 'text-green-400' : 'text-red-500'}">Realm: ${realmName}</span>`);
                    if (!hasRealm) canJoin = false;
                }
                if (sect.requirements.minAttribute) {
                    Object.entries(sect.requirements.minAttribute).forEach(([attr, val]) => {
                        const playerVal = state.player.attributes[attr] || 0;
                        const hasAttr = playerVal >= val;
                        const attrName = attr === 'str' ? 'Sức Mạnh' : attr === 'agi' ? 'Thân Pháp' : attr === 'int' ? 'Trí Tuệ' : attr === 'vit' ? 'Thể Lực' : attr;
                        reqs.push(`<span class="${hasAttr ? 'text-green-400' : 'text-red-500'}">${attrName}: ${playerVal}/${val}</span>`);
                        if (!hasAttr) canJoin = false;
                    });
                }
                requirementsHTML = reqs.join(' · ');
            }

            const isWanted = state.player.sectWantedDays && state.player.sectWantedDays > 0;
            if (isWanted) canJoin = false;

            return `
                <div class="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-3">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-xl">
                            ${sect.type === 'chinh' ? '⚔️' : '😈'}
                        </div>
                        <div>
                            <h4 class="text-xs font-ancient font-bold text-white">${sect.name}</h4>
                            <p class="text-[8px] text-gray-500 uppercase tracking-widest mt-0.5">${sect.type === 'chinh' ? 'Chính Đạo' : 'Ma Đạo'} · ${sect.style || 'Linh Sơn'}</p>
                        </div>
                    </div>
                    <p class="text-[9px] text-gray-400 leading-relaxed">${sect.description}</p>
                    ${requirementsHTML ? `<div class="text-[8px] text-gray-500 bg-white/[0.02] p-2 rounded-lg border border-white/5">Yêu cầu: ${requirementsHTML}</div>` : ''}
                    <button class="w-full py-2 ${canJoin ? 'btn-gold' : 'bg-gray-800 text-gray-600 border border-gray-700/50 cursor-not-allowed'} text-[10px] font-bold rounded-xl transition-all"
                            ${canJoin ? `onclick="window.game.systems.sect.joinSect('${sect.id}'); window.game.screens.systems.renderSects();"` : 'disabled'}>
                        ${isWanted ? 'ĐANG BỊ TRUY SÁT (KHÔNG THỂ GIA NHẬP)' : 'XIN GIA NHẬP TÔNG MÔN'}
                    </button>
                </div>
            `;
        }).join('');

        elSects.innerHTML = `
            <div class="p-5 text-center bg-white/5 rounded-3xl border border-white/10 space-y-4 mb-4">
                <span class="text-4xl">⛩️</span>
                <div>
                    <h3 class="text-base font-ancient text-white font-bold">Môn Phái & Tông Môn</h3>
                    <p class="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Trần Thế Tán Tu · Tìm Kiếm Đạo Quả</p>
                </div>
                <p class="text-[10px] text-gray-400 max-w-md mx-auto leading-relaxed">
                    Ngươi hiện tại là một vị Tán Tu cô độc. Hãy tuyển lựa một phái tông môn có linh căn phù hợp để gia nhập, bái sư cầu học đan dược võ pháp cường đại, hoàn thành khảo hạch để nhận bổng lộc hàng ngày.
                </p>
            </div>

            <div class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 border-l-2 border-qi-blue pl-2">Tông Môn Đang Tuyển Đệ Tử</div>
            
            <div class="space-y-3 pb-12">
                ${sectsListHTML || '<div class="text-[10px] text-center text-gray-600 py-6 italic">Hiện tại không có tông môn nào mở rộng cửa sơn môn...</div>'}
            </div>
        `;
    }

    renderSectZoneDetail(sect, zoneId) {
        const elSects = document.getElementById('sects-view');
        if (!elSects) return;
        elSects.scrollTop = 0;
        const currentDay = state.systems?.time?.totalDays || 0;

        const getZoneName = (id, fallback) => {
            if (sect.zoneOverrides && sect.zoneOverrides[id] && sect.zoneOverrides[id].name) {
                return sect.zoneOverrides[id].name;
            }
            return fallback;
        };

        let contentHTML = '';
        
        switch (zoneId) {
            case 'son_mon':
                {
                    const rules = getSectRules() || [];
                    const rulesHTML = rules.map(r => `
                        <div class="p-3 bg-black/30 rounded-xl border border-white/5 flex items-start space-x-3">
                            <span class="text-xl flex-shrink-0 mt-0.5">${r.icon}</span>
                            <div class="flex-1">
                                <div class="text-[10px] font-bold text-white">${r.title}</div>
                                <div class="text-[9px] text-gray-400 mt-0.5">${r.desc}</div>
                            </div>
                        </div>
                    `).join('');

                    contentHTML = `
                        <div class="space-y-4">
                            <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                                <div class="text-sm font-bold text-white mb-2">🛡️ Hộ Sơn Đại Trận</div>
                                <p class="text-[10px] text-gray-400 mb-3">Trận pháp bảo vệ cổng sơn môn hùng vĩ. Khi linh khí đầy đủ, đệ tử ngoại môn cùng ngự quân bất khả xâm phạm.</p>
                                <button class="w-full py-2 bg-qi-blue/10 hover:bg-qi-blue/20 text-qi-blue border border-qi-blue/20 text-xs font-bold rounded-lg transition-all"
                                        onclick="window.game.screens.systems.handleSectZoneAction('son_mon', 'reinforce_array')">
                                    <i class="ph ph-lightning mr-1"></i> Truyền Linh Khí Gia Cố (-50 Linh Lực)
                                </button>
                            </div>

                            <div class="p-4 bg-black/40 rounded-xl border border-cultivation-gold/20">
                                <div class="text-sm font-bold text-cultivation-gold mb-3">📜 Bia Đá Tông Quy — 6 Điều Luật Sắt</div>
                                <div class="space-y-2">
                                    ${rulesHTML || '<div class="text-[9px] text-gray-500">Không có dữ liệu tông quy.</div>'}
                                </div>
                                <button class="w-full mt-3 py-2 bg-cultivation-gold/10 hover:bg-cultivation-gold/20 text-cultivation-gold border border-cultivation-gold/20 text-xs font-bold rounded-lg transition-all"
                                        onclick="window.game.screens.systems.handleSectZoneAction('son_mon', 'vow_rules')">
                                    <i class="ph ph-scroll mr-1"></i> Tuyên Thệ Tuân Thủ Tông Quy (Hàng Ngày +15 Tu Vi)
                                </button>
                            </div>

                            <div class="p-4 bg-black/40 rounded-xl border border-red-500/10">
                                <div class="text-sm font-bold text-red-400 mb-2">🚪 Xuất Môn</div>
                                <p class="text-[10px] text-gray-400 mb-3">Tự rời bỏ tông môn. Cảnh báo: Sẽ bị ghi vào sổ Phản Đồ và nhận Lệnh Truy Sát 30 ngày!</p>
                                <button class="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold rounded-lg transition-all"
                                        onclick="if(confirm('Rời bỏ Tông Môn? Ngươi sẽ bị truy sát 30 ngày!')) { window.game.systems.sect.leaveSect(); window.game.screens.systems.renderSects(); }">
                                    <i class="ph ph-sign-out mr-1"></i> Phản Tông Xuất Môn
                                </button>
                            </div>
                        </div>
                    `;
                }
                break;

            case 'chap_su_duong':
                {
                    const inWar = state.player.sectWarStatus && (state.player.sectWarExpiresDay || 0) > currentDay;
                    const rank = window.game?.systems?.sect?.getRank();
                    const currentSectMissions = state.player.activeSectMissions || [];
                    const availableMissions = window.game?.systems?.sect?.generateMissions() || [];

                    contentHTML = `
                        <div class="space-y-4">
                            <!-- Bảng Ủy Thác Nhiệm Vụ -->
                            <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                                <div class="text-sm font-bold text-white mb-2">📋 Bảng Ủy Thác Nhiệm Vụ</div>
                                <p class="text-[10px] text-gray-400 mb-3">Nhận nhiệm vụ hàng ngày để tích lũy điểm Cống Hiến, Linh Thạch, Tu Vi, đan dược và công pháp. ${inWar ? '<span class="text-red-400 font-bold">(Thời Chiến: Kill x2 thưởng)</span>' : ''}</p>
                                
                                <!-- Nhiệm Vụ Đang Thực Hiện -->
                                <div class="text-[10px] font-bold text-qi-blue mb-2 uppercase tracking-wider">Đang Thực Hiện (${currentSectMissions.length}/3)</div>
                                ${currentSectMissions.length > 0 ? `
                                    <div class="space-y-2 mb-4">
                                        ${currentSectMissions.map(m => {
                                            const isAtLocation = !m.locationId || m.locationId === state.currentLocId;
                                            const showActionBtn = m.type === 'kill' || m.type === 'boss';
                                            let btnLabel = m.type === 'boss' ? 'TRUY SÁT' : 'SĂN BẮN';
                                            let btnColor = m.type === 'boss' ? 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30' : 'bg-qi-purple/20 text-qi-purple border-qi-purple/30 hover:bg-qi-purple/30';
                                            let btnAction = m.type === 'boss' ? `window.game.systems.sect.challengeMissionBoss('${m.id}'); window.game.screens.systems.renderSects();` : `window.game.systems.sect.huntMissionTarget('${m.id}'); window.game.screens.systems.renderSects();`;

                                            return `
                                                <div class="p-2.5 bg-black/40 rounded-lg border border-qi-blue/30 space-y-2">
                                                    <div class="flex justify-between items-start">
                                                        <div class="flex-1 min-w-0 pr-2">
                                                            <div class="text-[10px] font-bold text-white leading-normal break-words">${m.desc}</div>
                                                            <div class="text-[8px] ${m.current >= m.required ? 'text-green-400 font-bold' : 'text-gray-500'} mt-1">
                                                                Tiến độ: ${m.type === 'collect' ? state.player.inventory.getItemQuantity(m.target) : m.current}/${m.required}
                                                            </div>
                                                            ${m.locationName ? `
                                                                <div class="text-[8px] text-qi-blue mt-0.5">
                                                                    📍 Vị trí: ${m.locationName} ${isAtLocation ? '<span class="text-green-400 font-bold">(Đang ở đây)</span>' : '<span class="text-red-400 font-bold">(Cần tới đây)</span>'}
                                                                </div>
                                                            ` : ''}
                                                        </div>
                                                        <div class="flex flex-col space-y-1 flex-shrink-0">
                                                            <button class="px-2 py-0.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 text-[8px] font-bold rounded border border-green-500/20" onclick="window.game.systems.sect.completeMission('${m.id}'); window.game.screens.systems.renderSects();">TRẢ</button>
                                                            <button class="px-2 py-0.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[8px] font-bold rounded border border-red-500/20" onclick="window.game.systems.sect.abandonMission('${m.id}'); window.game.screens.systems.renderSects();">HỦY</button>
                                                        </div>
                                                    </div>
                                                    ${showActionBtn && isAtLocation && m.current < m.required ? `
                                                        <button class="w-full py-1 ${btnColor} border text-[8px] font-bold rounded transition-all" onclick="${btnAction}">
                                                            <i class="ph ph-sword mr-1"></i> ${btnLabel} NGAY
                                                        </button>
                                                    ` : ''}
                                                    ${showActionBtn && !isAtLocation && m.current < m.required ? `
                                                        <div class="text-center py-1 bg-gray-500/5 text-gray-500 border border-gray-500/10 text-[8px] rounded">
                                                            Cần di chuyển tới ${m.locationName || 'địa điểm chỉ định'} để thực hiện
                                                        </div>
                                                    ` : ''}
                                                </div>
                                            `;
                                        }).join('')}
                                    </div>
                                ` : `
                                    <div class="text-[9px] text-gray-500 mb-4 bg-black/20 p-2 rounded border border-white/5 text-center">Không có nhiệm vụ nào đang thực hiện.</div>
                                `}

                                <!-- Nhiệm Vụ Có Sẵn -->
                                <div class="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider">Nhiệm Vụ Có Sẵn</div>
                                <div class="space-y-2">
                                    ${availableMissions.map(m => {
                                        const isAccepted = currentSectMissions.some(active => active.id === m.id);
                                        let rewardText = `Cống hiến: +${m.reward.contribution || 0}`;
                                        if (m.reward.lingShi) rewardText += ` · Linh Thạch: +${m.reward.lingShi}`;
                                        if (m.reward.tuVi) rewardText += ` · Tu Vi: +${m.reward.tuVi}`;
                                        if (m.reward.items && m.reward.items.length > 0) rewardText += ` · Đan dược: Có`;
                                        if (m.reward.techniques && m.reward.techniques.length > 0) rewardText += ` · Công pháp: Có`;
                                        
                                        return `
                                            <div class="p-2 bg-black/40 rounded-lg border border-white/5 flex justify-between items-center ${isAccepted ? 'opacity-50' : ''}">
                                                <div class="flex-1 min-w-0 pr-2">
                                                    <div class="text-[10px] font-bold text-white leading-normal break-words">${m.desc}</div>
                                                    <div class="text-[8px] text-cultivation-gold mt-1">${rewardText}</div>
                                                </div>
                                                <button class="px-2 py-1 bg-qi-purple/10 text-qi-purple text-[8px] font-bold rounded border border-qi-purple/20 hover:bg-qi-purple/20 flex-shrink-0 ${isAccepted ? 'hidden' : ''}" 
                                                        onclick="window.game.systems.sect.acceptMission(${JSON.stringify(m).replace(/"/g, '&quot;')}); window.game.screens.systems.renderSects();">
                                                    NHẬN
                                                </button>
                                            </div>
                                        `;
                                    }).join('') || '<div class="text-[9px] text-gray-500">Không có nhiệm vụ nào.</div>'}
                                </div>
                            </div>

                            <!-- Hành Chính Tông Môn -->
                            <div class="p-4 bg-black/40 rounded-xl border border-white/5 space-y-4">
                                <div class="text-xs font-bold text-white border-b border-white/5 pb-2">📁 Hành Chính Tông Môn</div>
                                
                                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <!-- Bổng Lộc -->
                                    <div class="p-3 bg-black/20 rounded-lg border border-white/5 flex flex-col justify-between">
                                        <div>
                                            <div class="text-[10px] font-bold text-white">💰 Bổng Lộc Hàng Ngày</div>
                                            <p class="text-[9px] text-gray-400 mt-1">Lãnh linh thạch định kỳ từ tông môn dựa theo chức vị hiện tại.</p>
                                            <p class="text-[9px] text-cultivation-gold mt-1.5 font-bold">Mức bổng lộc (${rank?.name}): ${rank?.salary || 0} Linh Thạch ${inWar ? ' (+50% Chiến sự)' : ''}</p>
                                        </div>
                                        <button class="w-full mt-3 py-1.5 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 text-[10px] font-bold rounded transition-all"
                                                onclick="window.game.systems.sect.claimSalary(); window.game.screens.systems.renderSects();">
                                            <i class="ph ph-coins mr-1"></i> Nhận Bổng Lộc
                                        </button>
                                    </div>

                                    <!-- Khảo Hạch Thăng Cấp -->
                                    <div class="p-3 bg-black/20 rounded-lg border border-white/5 flex flex-col justify-between">
                                        <div>
                                            <div class="text-[10px] font-bold text-white">🏅 Khảo Hạch Thăng Cấp</div>
                                            <p class="text-[9px] text-gray-400 mt-1">Xin chấp sự tiến hành thẩm định Cảnh giới và Cống hiến để nâng chức vị.</p>
                                        </div>
                                        <button class="w-full mt-3 py-1.5 bg-qi-blue/10 hover:bg-qi-blue/20 text-qi-blue border border-qi-blue/20 text-[10px] font-bold rounded transition-all"
                                                onclick="window.game.systems.sect.checkPromotion(); window.game.screens.systems.renderSects();">
                                            <i class="ph ph-medal mr-1"></i> Đệ Trình Khảo Hạch
                                        </button>
                                    </div>

                                    <!-- Tông Môn Chiến -->
                                    <div class="p-3 bg-black/20 rounded-lg border border-white/5 flex flex-col justify-between ${inWar ? 'border-red-500/30 bg-red-950/5' : ''}">
                                        <div>
                                            <div class="text-[10px] font-bold ${inWar ? 'text-red-400' : 'text-white'}">⚔️ Tông Môn Chiến</div>
                                            <p class="text-[9px] text-gray-400 mt-1">Gia nhập cuộc viễn chinh bảo vệ hoặc công kích các môn phái đối địch.</p>
                                            ${inWar ? `
                                                <div class="p-1 bg-red-900/30 rounded border border-red-500/20 mt-1.5">
                                                    <div class="text-[8px] text-red-400 font-bold">ĐANG TRONG CHIẾN SỰ</div>
                                                </div>
                                            ` : ''}
                                        </div>
                                        <button class="w-full mt-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-[10px] font-bold rounded transition-all"
                                                onclick="window.game.systems.sect.joinSectWar(); window.game.screens.systems.renderSects();">
                                            <i class="ph ph-sword mr-1"></i> Xuất Chinh Chiến Sự
                                        </button>
                                    </div>

                                    <!-- Luận Đạo -->
                                    <div class="p-3 bg-black/20 rounded-lg border border-white/5 flex flex-col justify-between">
                                        <div>
                                            <div class="text-[10px] font-bold text-white">💬 Luận Đạo Điện</div>
                                            <p class="text-[9px] text-gray-400 mt-1">Đàm đạo luận giải đạo tâm để tăng ngộ tính. Tốn 20 Linh Lực.</p>
                                        </div>
                                        <button class="w-full mt-3 py-1.5 bg-qi-blue/10 hover:bg-qi-blue/20 text-qi-blue border border-qi-blue/20 text-[10px] font-bold rounded transition-all"
                                                onclick="window.game.screens.systems.handleSectZoneAction('chap_su_duong', 'debate_dao'); window.game.screens.systems.renderSects();">
                                            <i class="ph ph-brain mr-1"></i> Bắt Đầu Luận Đạo (-20 LL)
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    `;
                }
                break;

            case 'dai_dien':
                {
                    contentHTML = `
                        <div class="space-y-4">
                            <!-- Bái Kiến Tông Chủ -->
                            <div class="p-4 bg-black/40 rounded-xl border border-cultivation-gold/20">
                                <div class="text-sm font-bold text-cultivation-gold mb-2">🙇 Bái Kiến Tông Chủ</div>
                                <p class="text-[10px] text-gray-400 mb-3">Diện kiến và cung kính thỉnh an Tông Chủ tối cao của môn phái để gia tăng đạo tâm và điểm cống hiến.</p>
                                <button class="w-full py-2 bg-cultivation-gold/10 hover:bg-cultivation-gold/20 text-cultivation-gold border border-cultivation-gold/20 text-xs font-bold rounded-lg transition-all"
                                        onclick="window.game.screens.systems.handleSectZoneAction('dai_dien', 'bow_master'); window.game.screens.systems.renderSects();">
                                    <i class="ph ph-hands-praying mr-1"></i> Thỉnh An Tông Chủ (Hàng Ngày +15 Cống hiến)
                                </button>
                            </div>

                            <!-- Giảng Kinh Phục Pháp -->
                            <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                                <div class="text-sm font-bold text-white mb-2">🧘 Giảng Kinh Phục Pháp</div>
                                <p class="text-[10px] text-gray-400 mb-3">Bái nghe thuyết pháp truyền đạo từ các bậc tiền bối trưởng lão đại thừa. Trà kính lễ: 100 Linh Thạch.</p>
                                <button class="w-full py-2 bg-qi-purple/10 hover:bg-qi-purple/20 text-qi-purple border border-qi-purple/20 text-xs font-bold rounded-lg transition-all"
                                        onclick="window.game.screens.systems.handleSectZoneAction('dai_dien', 'listen_lecture'); window.game.screens.systems.renderSects();">
                                    <i class="ph ph-student mr-1"></i> Bái Nghe Giảng Đạo (-100 Linh Thạch, +150 Tu Vi)
                                </button>
                            </div>
                        </div>
                    `;
                }
                break;

            case 'ngoai_mon_vien':
                {
                    contentHTML = `
                        <div class="space-y-4">
                            <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                                <div class="text-sm font-bold text-white mb-2">🧹 Tạp Vụ Ngoại Môn (Quét Dọn Linh Điền)</div>
                                <p class="text-[10px] text-gray-400 mb-3">Đóng góp sức lao động gánh nước bửa củi quét dọn các vườn thuốc. Có ích cho việc rèn luyện thân thể và tích cống hiến.</p>
                                <button class="w-full py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 text-xs font-bold rounded-lg transition-all"
                                        onclick="window.game.screens.systems.handleSectZoneAction('ngoai_mon_vien', 'chore_sweep')">
                                    <i class="ph ph-broom mr-1"></i> Quét Dọn Tạp Vụ (-20 Thể Lực, -10 Linh Lực)
                                </button>
                            </div>

                            <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                                <div class="text-sm font-bold text-white mb-2">📝 Nộp Bản Chép Phạt Môn Quy</div>
                                <p class="text-[10px] text-gray-400 mb-3">Tự giác chép phạt Môn Quy 100 lần dâng lên Chấp Pháp Điện để gột rửa tâm tính đạo tâm.</p>
                                <button class="w-full py-2 bg-qi-blue/10 hover:bg-qi-blue/20 text-qi-blue border border-qi-blue/20 text-xs font-bold rounded-lg transition-all"
                                        onclick="window.game.screens.systems.handleSectZoneAction('ngoai_mon_vien', 'submit_copied_rules')">
                                    <i class="ph ph-scroll mr-1"></i> Thành Tâm Nộp Chép Phạt (-30 Điểm Cống Hiến)
                                </button>
                            </div>
                        </div>
                    `;
                }
                break;

            case 'noi_mon_vien':
                {
                    contentHTML = `
                        <div class="space-y-4">
                            <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                                <div class="text-sm font-bold text-white mb-2">⚔️ Tỷ Thí Đồng Môn (Võ Đài Kiếm Chiêu)</div>
                                <p class="text-[10px] text-gray-400 mb-3">So tài linh chiêu kiếm pháp cùng đệ tử nội môn để nâng cao kinh nghiệm chiến đấu thực tế.</p>
                                <button class="w-full py-2 bg-qi-blue/10 hover:bg-qi-blue/20 text-qi-blue border border-qi-blue/20 text-xs font-bold rounded-lg transition-all"
                                        onclick="window.game.screens.systems.handleSectZoneAction('noi_mon_vien', 'spar_disciples')">
                                    <i class="ph ph-sword mr-1"></i> So Kiếm So Tài (-30 Linh Lực)
                                </button>
                            </div>

                            <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                                <div class="text-sm font-bold text-white mb-2">💬 Thỉnh Giáo Nội Môn Sư Huynh</div>
                                <p class="text-[10px] text-gray-400 mb-3">Lắng nghe chia sẻ về những chuyến đi săn lùng tà đạo, đột phá kết giới của sư huynh đi trước.</p>
                                <button class="w-full py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 text-xs font-bold rounded-lg transition-all"
                                        onclick="window.game.screens.systems.handleSectZoneAction('noi_mon_vien', 'listen_brother')">
                                    <i class="ph ph-chats-teardrop mr-1"></i> Đàm Đạo Giang Hồ (-20 Thể Lực)
                                </button>
                            </div>
                        </div>
                    `;
                }
                break;

            case 'chan_truyen_phong':
                {
                    contentHTML = `
                        <div class="space-y-4">
                            <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                                <div class="text-sm font-bold text-white mb-2">🌀 Hấp Thụ Linh Mạch Chân Truyền Đỉnh</div>
                                <p class="text-[10px] text-gray-400 mb-3">Vùng tiên thổ biệt lập tại Chân Truyền Phong sở hữu nồng độ linh khí tinh thuần nhất phái. Tu luyện tại đây mang lại tu vi cực cao.</p>
                                <button class="w-full py-2 bg-qi-purple/10 hover:bg-qi-purple/20 text-qi-purple border border-qi-purple/20 text-xs font-bold rounded-lg transition-all"
                                        onclick="window.game.screens.systems.handleSectZoneAction('chan_truyen_phong', 'circulate_qi_peak')">
                                    <i class="ph ph-sparkles mr-1"></i> Tu Luyện Linh Mạch Chân Truyền (-100 Linh Lực)
                                </button>
                            </div>

                            <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                                <div class="text-sm font-bold text-white mb-2">🛡️ Nuôi Dưỡng Mạch Trận Linh Phù</div>
                                <p class="text-[10px] text-gray-400 mb-3">Hiến tặng 200 Linh Thạch bồi đắp linh thạch nhãn pháp trận của Chân Truyền Linh Đỉnh để duy trì linh căn bảo hộ.</p>
                                <button class="w-full py-2 bg-cultivation-gold/10 hover:bg-cultivation-gold/20 text-cultivation-gold border border-cultivation-gold/20 text-xs font-bold rounded-lg transition-all"
                                        onclick="window.game.screens.systems.handleSectZoneAction('chan_truyen_phong', 'plant_spiritual_talisman')">
                                    <i class="ph ph-shield-check mr-1"></i> Cường Hóa Trận Nhãn (-200 Linh Thạch, -20 Linh Lực)
                                </button>
                            </div>
                        </div>
                    `;
                }
                break;

            case 'tang_kinh_cac':
                {
                    const items = window.game?.systems?.sect?.getLibraryItems() || [];
                    const currentRankScore = window.game?.systems?.sect?.getRank()?.rankScore || 0;
                    const rankNames = ['Ngoại Môn', 'Nội Môn', 'Chân Truyền', 'Trưởng Lão', 'Đại Trưởng Lão', 'Tông Chủ'];
                    
                    let scripturesHTML = '';
                    items.filter(item => item.isTech).forEach(item => {
                        const isTech = item.isTech;
                        const hasLearned = isTech && (state.player.learnedTechniques.some(t => t.id === item.id) || state.player.learnedSecretTechniques.some(t => t.id === item.id));
                        const isLocked = currentRankScore < item.minRankScore;
                        const reqName = rankNames[item.minRankScore] || 'Cấp Cao';
                        
                        let btnHTML = '';
                        if (hasLearned) {
                            btnHTML = `<span class="text-[8px] text-green-400 font-bold bg-green-500/10 px-2 py-0.5 rounded border border-green-500/20">ĐÃ HỌC</span>`;
                        } else if (isLocked) {
                            btnHTML = `<span class="text-[8px] text-red-500 font-bold bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 flex flex-col items-center"><span>KHÓA</span><span class="text-[7px]">(${reqName})</span></span>`;
                        } else {
                            btnHTML = `<button class="px-2 py-1 bg-cultivation-gold/10 hover:bg-cultivation-gold/20 text-cultivation-gold text-[9px] font-bold rounded border border-cultivation-gold/30 flex items-center transition-all" onclick="window.game.systems.sect.buyLibraryItem('${item.id}', ${item.price}, ${isTech}, '${item.name || ''}'); window.game.screens.systems.renderSects();">
                                <i class="ph ph-shopping-cart-simple mr-0.5"></i>${item.price} CH
                               </button>`;
                        }
                        
                        const actualItem = isTech ? null : getItemById(item.id);
                        const itemName = item.name || actualItem?.name || item.id;
                        const itemDesc = isTech ? 'Bí kíp/Công pháp Tông Môn truyền thừa' : actualItem?.description || '';
                        const itemIcon = isTech ? '📖' : actualItem?.icon || '📦';
                        
                        scripturesHTML += `
                            <div class="p-3 bg-black/30 rounded-xl border border-white/5 flex justify-between items-center space-x-2 ${isLocked ? 'opacity-50 grayscale' : ''}">
                                <div class="flex-1">
                                    <div class="text-[11px] font-bold text-white flex items-center"><span class="text-sm mr-1">${itemIcon}</span>${itemName}</div>
                                    <div class="text-[9px] text-gray-400 mt-0.5">${itemDesc}</div>
                                </div>
                                <div class="flex-shrink-0 text-right">
                                    ${btnHTML}
                                </div>
                            </div>
                        `;
                    });

                    contentHTML = `
                        <div class="space-y-4">
                            <p class="text-[10px] text-gray-400">Các công pháp và bí thuật thượng thừa của tông môn phân chia theo cấp bậc. Đệ tử tích lũy Cống Hiến để học võ học.</p>
                            <div class="grid grid-cols-1 gap-3">
                                ${scripturesHTML || `<div class="text-xs text-center text-gray-500 py-4">${getZoneName('tang_kinh_cac', 'Tàng Kinh Các')} tạm thời chưa có bí kíp.</div>`}
                            </div>
                        </div>
                    `;
                }
                break;

            case 'tang_bao_cac':
                {
                    const items = window.game?.systems?.sect?.getLibraryItems() || [];
                    const currentRankScore = window.game?.systems?.sect?.getRank()?.rankScore || 0;
                    const rankNames = ['Ngoại Môn', 'Nội Môn', 'Chân Truyền', 'Trưởng Lão', 'Đại Trưởng Lão', 'Tông Chủ'];
                    
                    let treasuresHTML = '';
                    items.filter(item => !item.isTech).forEach(item => {
                        const isTech = item.isTech;
                        const isLocked = currentRankScore < item.minRankScore;
                        const reqName = rankNames[item.minRankScore] || 'Cấp Cao';
                        
                        let btnHTML = '';
                        if (isLocked) {
                            btnHTML = `<span class="text-[8px] text-red-500 font-bold bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20 flex flex-col items-center"><span>KHÓA</span><span class="text-[7px]">(${reqName})</span></span>`;
                        } else {
                            btnHTML = `<button class="px-2 py-1 bg-cultivation-gold/10 hover:bg-cultivation-gold/20 text-cultivation-gold text-[9px] font-bold rounded border border-cultivation-gold/30 flex items-center transition-all" onclick="window.game.systems.sect.buyLibraryItem('${item.id}', ${item.price}, ${isTech}, '${item.name || ''}'); window.game.screens.systems.renderSects();">
                                <i class="ph ph-shopping-cart-simple mr-0.5"></i>${item.price} CH
                               </button>`;
                        }
                        
                        const actualItem = getItemById(item.id);
                        const itemName = item.name || actualItem?.name || item.id;
                        const itemDesc = actualItem?.description || 'Dị bảo tông môn quý giá';
                        const itemIcon = actualItem?.icon || '💎';
                        
                        treasuresHTML += `
                            <div class="p-3 bg-black/30 rounded-xl border border-white/5 flex justify-between items-center space-x-2 ${isLocked ? 'opacity-50 grayscale' : ''}">
                                <div class="flex-1">
                                    <div class="text-[11px] font-bold text-white flex items-center"><span class="text-sm mr-1">${itemIcon}</span>${itemName}</div>
                                    <div class="text-[9px] text-gray-400 mt-0.5">${itemDesc}</div>
                                </div>
                                <div class="flex-shrink-0 text-right">
                                    ${btnHTML}
                                </div>
                            </div>
                        `;
                    });

                    contentHTML = `
                        <div class="space-y-4">
                            <p class="text-[10px] text-gray-400">Các đan dược quý, trứng linh thú, nguyên liệu phụ trợ rèn đúc giáp kiếm trong ${getZoneName('tang_bao_cac', 'Tàng Bảo Các')}.</p>
                            <div class="grid grid-cols-1 gap-3">
                                ${treasuresHTML || `<div class="text-xs text-center text-gray-500 py-4">${getZoneName('tang_bao_cac', 'Tàng Bảo Các')} tạm thời chưa mở khóa kỳ trân.</div>`}
                            </div>
                        </div>
                    `;
                }
                break;

            case 'thai_thuong_dien':
                {
                    const gm = state.player.grandmasterSeclusion || { isSecluded: true, releaseDay: 30 };
                    const curDay = state.systems?.time?.totalDays || 0;
                    const gmOut = curDay >= gm.releaseDay;
                    const gmLeft = Math.max(0, gm.releaseDay - curDay);

                    contentHTML = `
                        <div class="space-y-4">
                            <div class="p-4 bg-black/40 rounded-xl border ${gmOut ? 'border-yellow-500/40' : 'border-gray-700/40'} relative overflow-hidden">
                                <div class="flex items-center justify-between mb-3">
                                    <div class="text-sm font-bold ${gmOut ? 'text-yellow-400' : 'text-gray-400'}">👑 Thái Thượng Trưởng Lão</div>
                                    <span class="text-[8px] px-2 py-0.5 rounded-full border font-bold ${gmOut ? 'text-yellow-400 border-yellow-500/40 bg-yellow-900/20' : 'text-gray-500 border-gray-600/30 bg-gray-900/20'} uppercase">${gmOut ? '🔓 Đang Ra Quan' : '🔒 Bế Quan'}</span>
                                </div>
                                <p class="text-[10px] text-gray-400 mb-3">${gmOut ? 'Thái Thượng ra quan dưỡng pháp — đây là thời cơ hiếm hoi để yết kiến miễn phí!' : `Thái Thượng đang bế quan tu luyện. Ra quan sau <strong class="text-white">${gmLeft} ngày</strong>. Tốn 500 Cống Hiến để quấy nhiễu yết kiến.`}</p>
                                <button class="w-full py-2 ${gmOut ? 'bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border-yellow-500/20' : 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 border-gray-600/20'} border text-xs font-bold rounded-lg transition-all"
                                        onclick="window.game.systems.sect.audienceGrandmaster(); window.game.screens.systems.renderSects();">
                                    <i class="ph ph-crown mr-1"></i> ${gmOut ? 'Yết Kiến Thái Thượng (Miễn Phí)' : 'Yết Kiến Thái Thượng (500 Cống Hiến)'}
                                </button>
                            </div>

                            <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                                <div class="text-sm font-bold text-white mb-2">☯️ Tham Ngộ Cấm Địa Viễn Cổ Môn Bia</div>
                                <p class="text-[10px] text-gray-400 mb-3">Dâng cúng linh hương lễ vật, dung hòa thần thức tham ngộ bia khắc do các bậc Tiền bối phi thăng để lại để tăng cường tu vi hoặc có cơ may nhặt được dị bảo hiếm.</p>
                                <button class="w-full py-2 bg-qi-purple/10 hover:bg-qi-purple/20 text-qi-purple border border-qi-purple/20 text-xs font-bold rounded-lg transition-all"
                                        onclick="window.game.screens.systems.handleSectZoneAction('thai_thuong_dien', 'vow_forbidden_tablet')">
                                    <i class="ph ph-scroll mr-1"></i> Tham Ngộ Bia Cấm Địa (-100 Linh Thạch, -50 Linh Lực)
                                </button>
                            </div>
                        </div>
                    `;
                }
                break;

            case 'luyen_dan':
                contentHTML = `
                    <div class="space-y-4">
                        <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                            <div class="text-sm font-bold text-white mb-2">🔥 Địa Hỏa Thất (Đan Điện)</div>
                            <p class="text-[10px] text-gray-400 mb-3">Mượn đan lò hỏa mạch cực thịnh của tông môn, nâng cao tỷ lệ thành công chế luyện dược phẩm lên +10%!</p>
                            <button class="w-full py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 text-xs font-bold rounded-lg transition-all"
                                    onclick="state.ui.toggleOverlay(document.getElementById('sects-overlay'), false); window.game.screens.systems.openCrafting('alchemy');">
                                <i class="ph ph-flame mr-1"></i> Vào Lò Luyện Đan (+10% Thành Công)
                            </button>
                        </div>

                        <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                            <div class="text-sm font-bold text-white mb-2">🌿 Hiến Tặng Linh Thảo Dược</div>
                            <p class="text-[10px] text-gray-400 mb-3">Quyên góp 5 cọng Linh Thảo cấp thấp của bản thân đóng góp làm dược thô cho đan điện.</p>
                            <div class="flex justify-between text-[10px] text-gray-500 mb-2">
                                <span>Linh Thảo hiện có:</span>
                                <span class="font-bold text-white">${state.player.inventory.getItemQuantity('item_linh_thao')} / 5</span>
                            </div>
                            <button class="w-full py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 text-xs font-bold rounded-lg transition-all"
                                    onclick="window.game.screens.systems.handleSectZoneAction('luyen_dan', 'donate_herbs')">
                                <i class="ph ph-hand-heart mr-1"></i> Quyên Hiến 5 Linh Thảo
                            </button>
                        </div>
                    </div>
                `;
                break;

            case 'luyen_khi':
                contentHTML = `
                    <div class="space-y-4">
                        <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                            <div class="text-sm font-bold text-white mb-2">⚒️ Thiết Khí Các</div>
                            <p class="text-[10px] text-gray-400 mb-3">Nơi luyện pháp bảo khôi lỗi, cường hóa trang bị thần binh.</p>
                            <button class="w-full py-2 bg-qi-blue/10 hover:bg-qi-blue/20 text-qi-blue border border-qi-blue/20 text-xs font-bold rounded-lg transition-all"
                                    onclick="state.ui.toggleOverlay(document.getElementById('sects-overlay'), false); window.game.screens.systems.openCrafting('smithing');">
                                <i class="ph ph-hammer mr-1"></i> Bắt Đầu Chế Tạo Pháp Bảo
                            </button>
                        </div>

                        <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                            <div class="text-sm font-bold text-white mb-2">💎 Đóng Góp Linh Quặng</div>
                            <p class="text-[10px] text-gray-400 mb-3">Hiến hiếu linh thạch vụn nâng trợ kinh phí luyện đúc cơ khí cho các đệ tử rèn kiếm.</p>
                            <button class="w-full py-2 bg-cultivation-gold/10 hover:bg-cultivation-gold/20 text-cultivation-gold border border-cultivation-gold/20 text-xs font-bold rounded-lg transition-all"
                                    onclick="window.game.screens.systems.handleSectZoneAction('luyen_khi', 'donate_scrap')">
                                <i class="ph ph-coins mr-1"></i> Quyên Góp 200 Linh Thạch
                            </button>
                        </div>
                    </div>
                `;
                break;

            case 'linh_thu':
                contentHTML = `
                    <div class="space-y-4">
                        <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                            <div class="text-sm font-bold text-white mb-2">🦁 Vui Đùa Linh Thú</div>
                            <p class="text-[10px] text-gray-400 mb-3">Thân cận vui vẻ chải lông chăm nuôi cùng linh thú ngự thú vườn.</p>
                            <button class="w-full py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 text-xs font-bold rounded-lg transition-all"
                                    onclick="window.game.screens.systems.handleSectZoneAction('linh_thu', 'play_beasts')">
                                <i class="ph ph-paw-print mr-1"></i> Tương Tác Linh Thú (-20 Linh Lực)
                            </button>
                        </div>

                        <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                            <div class="text-sm font-bold text-white mb-2">🕸️ Bẫy Linh Trùng Hoang Dã</div>
                            <p class="text-[10px] text-gray-400 mb-3">Sử dụng thần thức sương bẫy săn tìm linh trùng hoang dã nấp ở linh viên. Có cơ hội bắt được Phệ Kim Trùng quý hiếm!</p>
                            <button class="w-full py-2 bg-qi-blue/10 hover:bg-qi-blue/20 text-qi-blue border border-qi-blue/20 text-xs font-bold rounded-lg transition-all"
                                    onclick="window.game.screens.systems.handleSectZoneAction('linh_thu', 'catch_insect')">
                                <i class="ph ph-bug mr-1"></i> Bẫy Kỳ Trùng (-30 Linh Lực)
                            </button>
                        </div>
                    </div>
                `;
                break;

            case 'duoc_vien':
                contentHTML = `
                    <div class="space-y-4">
                        <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                            <div class="text-sm font-bold text-white mb-2">🌿 Linh Điền Tông Môn</div>
                            <p class="text-[10px] text-gray-400 mb-3">Vào linh điền của tông môn phì nhiêu tụ tinh khí trồng trọt linh thảo tiên dược.</p>
                            <button class="w-full py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 text-xs font-bold rounded-lg transition-all"
                                    onclick="state.ui.toggleOverlay(document.getElementById('sects-overlay'), false); window.game.screens.systems.openCrafting('alchemy');">
                                <i class="ph ph-plant mr-1"></i> Mở Linh Thảo Viên Trồng Trọt
                            </button>
                        </div>

                        <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                            <div class="text-sm font-bold text-white mb-2">💧 Chăm Sóc Tưới Linh Thảo</div>
                            <p class="text-[10px] text-gray-400 mb-3">Được phó thác tưới nước sương bổ linh căn cho các tiên mầm, thưởng hạt giống linh chi.</p>
                            <button class="w-full py-2 bg-qi-blue/10 hover:bg-qi-blue/20 text-qi-blue border border-qi-blue/20 text-xs font-bold rounded-lg transition-all"
                                    onclick="window.game.screens.systems.handleSectZoneAction('duoc_vien', 'water_garden')">
                                <i class="ph ph-drop mr-1"></i> Tưới Tắm Linh Thảo (-30 Linh Lực)
                            </button>
                        </div>
                    </div>
                `;
                break;

            case 'dong_phu':
                contentHTML = `
                    <div class="space-y-4">
                        <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                            <div class="text-sm font-bold text-white mb-2">🌀 Vận Công Đại Chu Thiên</div>
                            <p class="text-[10px] text-gray-400 mb-3">Động phủ tu luyện cá nhân linh khí dồi dào, xếp bằng chu thiên điều hòa chân khí chuyển hóa thọ tinh thành tu vi.</p>
                            <button class="w-full py-2 bg-qi-purple/10 hover:bg-qi-purple/20 text-qi-purple border border-qi-purple/20 text-xs font-bold rounded-lg transition-all"
                                    onclick="window.game.screens.systems.handleSectZoneAction('dong_phu', 'circulate_qi')">
                                <i class="ph ph-infinity mr-1"></i> Vận Công Khai Huyệt (-100 Linh Lực)
                            </button>
                        </div>

                        <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                            <div class="text-sm font-bold text-white mb-2">💎 Thiết Lập Tụ Linh Trận</div>
                            <p class="text-[10px] text-gray-400 mb-3">Đầu tư linh thạch gia cố cường hóa pháp trận tụ nồng độ linh khí, mở mang ngộ đạo căn bản.</p>
                            <button class="w-full py-2 bg-cultivation-gold/10 hover:bg-cultivation-gold/20 text-cultivation-gold border border-cultivation-gold/20 text-xs font-bold rounded-lg transition-all"
                                    onclick="window.game.screens.systems.handleSectZoneAction('dong_phu', 'upgrade_array')">
                                <i class="ph ph-diamonds mr-1"></i> Gia Cố Pháp Trận (-500 Linh Thạch)
                            </button>
                        </div>
                    </div>
                `;
                break;

            case 'bi_canh':
                contentHTML = `
                    <div class="space-y-4">
                        <div class="p-4 bg-black/40 rounded-xl border border-white/5 relative overflow-hidden group">
                            <div class="absolute inset-0 bg-gradient-to-br from-red-900/20 to-transparent"></div>
                            <div class="relative z-10">
                                <div class="text-sm font-bold text-white mb-2 flex items-center">
                                    <span>⚔️ Đại Tỷ Tông Môn</span>
                                    <span class="ml-2 px-1.5 py-0.5 bg-red-500/20 text-red-400 text-[8px] rounded border border-red-500/30">Mỗi Năm 1 Lần</span>
                                </div>
                                <p class="text-[10px] text-gray-400 mb-3">Sự kiện thi đấu võ đài PvP quan trọng nhất trong Tông Môn. Vượt qua 3 trận chiến để thăng tiến cấp bậc và nhận thưởng.</p>
                                <button class="w-full py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold rounded-xl transition-all"
                                        onclick="window.game.systems.sect.startTournament()">
                                    <i class="ph ph-sword mr-1"></i> Đăng Ký Đại Tỷ
                                </button>
                            </div>
                        </div>

                        <div class="p-4 bg-black/40 rounded-xl border border-white/5">
                            <div class="text-sm font-bold text-white mb-2">🗼 Thí Luyện Ảo Ảnh</div>
                            <p class="text-[10px] text-gray-400 mb-3">Ảo ảnh ma đạo pháp trận do tổ sư thiết lập để mài giũa bản lĩnh chiến đấu cho đệ tử.</p>
                            <button class="w-full py-2 bg-gray-500/10 hover:bg-gray-500/20 text-gray-400 border border-gray-500/20 text-xs font-bold rounded-xl transition-all"
                                    onclick="window.game.screens.systems.handleSectZoneAction('bi_canh', 'trial_fight')">
                                <i class="ph ph-ghost mr-1"></i> Luyện Tập Ảo Ảnh
                            </button>
                        </div>
                    </div>
                `;
                break;
        }

        let zone = [
            { id: 'son_mon', name: 'Sơn Môn (Hộ Sơn Trận)', icon: '⛩️' },
            { id: 'ngoai_mon_vien', name: 'Ngoại Môn Viện', icon: '🏡' },
            { id: 'noi_mon_vien', name: 'Nội Môn Viện', icon: '🏰' },
            { id: 'chan_truyen_phong', name: 'Chân Truyền Phong', icon: '🏔️' },
            { id: 'dai_dien', name: 'Nghị Sự Chủ Điện', icon: '🏛️' },
            { id: 'chap_su_duong', name: 'Chấp Sự Đường', icon: '📜' },
            { id: 'tang_kinh_cac', name: 'Tàng Kinh Các', icon: '📚' },
            { id: 'tang_bao_cac', name: 'Tàng Bảo Các', icon: '💎' },
            { id: 'luyen_dan', name: 'Luyện Đan Điện', icon: '🧪' },
            { id: 'luyen_khi', name: 'Luyện Khí Các (Thiên Công)', icon: '⚒️' },
            { id: 'linh_thu', name: 'Linh Thú Viên', icon: '🦁' },
            { id: 'duoc_vien', name: 'Linh Dược Dược Sơn', icon: '🌿' },
            { id: 'dong_phu', name: 'Động Phủ Đệ Tử (Bế Quan)', icon: '🛕' },
            { id: 'bi_canh', name: 'Thí Luyện Bí Cảnh', icon: '🗼' },
            { id: 'thai_thuong_dien', name: 'Thái Thượng Điện / Cấm Địa', icon: '☯️' }
        ].find(z => z.id === zoneId);

        if (zone && sect.zoneOverrides && sect.zoneOverrides[zone.id]) {
            zone = { ...zone, ...sect.zoneOverrides[zone.id] };
        }

        elSects.innerHTML = `
            <button class="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg flex items-center text-xs font-bold transition-all mb-4" 
                    onclick="window.game.screens.systems.activeSectZone = null; window.game.screens.systems.renderSects();">
                <i class="ph ph-arrow-left mr-1"></i> Quay Lại Tông Môn
            </button>

            <div class="bg-white/5 rounded-2xl border border-qi-blue/30 overflow-hidden mb-4 animate-fade-in">
                <div class="h-24 relative">
                    <img src="${sect.portrait || ASSETS.backgrounds.sect}" class="w-full h-full object-cover opacity-30">
                    <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                    <div class="absolute bottom-3 left-4 flex items-center space-x-2">
                        <span class="text-3xl">${zone.icon}</span>
                        <div>
                            <h3 class="text-lg font-ancient text-white">${zone.name}</h3>
                            <p class="text-[8px] text-qi-blue uppercase tracking-widest">${sect.name}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="pb-12 animate-fade-in">
                ${contentHTML}
            </div>
        `;
    }

    handleSectZoneAction(zoneId, actionId) {
        const currentDay = state.systems.time ? state.systems.time.totalDays : 0;
        
        switch (actionId) {
            case 'vow_rules':
                if (state.player.lastSectVowDay === currentDay) {
                    state.ui.toast("Hôm nay ngươi đã tuyên thệ rồi, không nên quá thường xuyên bái bản tông!", "warning");
                    return;
                }
                state.player.lastSectVowDay = currentDay;
                state.player.tuVi = (state.player.tuVi || 0) + 15;
                state.ui.toast("Ngươi chắp tay tuyên thệ tuân thủ Tông quy nghiêm nghị. Đạo tâm tu sĩ chấn chỉnh vững chắc! (+15 Tu vi)", "success");
                break;
                
            case 'reinforce_array':
                if (state.player.mana < 50) {
                    state.ui.toast("Linh lực bất túc, không đủ 50 Linh Lực truyền pháp gia cố trận pháp!", "error");
                    return;
                }
                state.player.mana -= 50;
                state.player.sectContribution = (state.player.sectContribution || 0) + 5;
                state.ui.toast("Ngươi dẫn tinh linh khí gia cố kết giới mạch trận thành công! Tông môn thưởng +5 Cống hiến!", "success");
                break;

            case 'talk_guard':
                {
                    const msgs = [
                        "Thủ môn đệ tử: Tu luyện không thèm chểnh mảng, kiên trì nhất định thành tựu thiên kiếp sơ kỳ!",
                        "Thủ môn đệ tử: Ngoại sơn môn phong quang vô cùng, có yêu điểu rình rập, đi đứng xin nhớ mang theo phi kiếm.",
                        "Thủ môn đệ tử: Cổ truyền tông đại trận vô cùng chắc chắn, tà ma ngoại đạo bất khả xâm phạm!"
                    ];
                    state.ui.toast(msgs[Math.floor(Math.random() * msgs.length)], "info");
                }
                break;

            case 'debate_dao':
                if (state.player.mana < 20) {
                    state.ui.toast("Linh lực cạn kiệt, tinh thần mệt mỏi!", "error");
                    return;
                }
                state.player.mana -= 20;
                {
                    const comp = state.player.advancedStats?.comprehension || 10;
                    const roll = Math.random() * 40;
                    if (comp >= roll) {
                        state.player.tuVi = (state.player.tuVi || 0) + 30;
                        state.player.sectContribution = (state.player.sectContribution || 0) + 8;
                        state.ui.toast("Biện luận xuất chúng! Lời nói chứa linh cơ đốn ngộ! Nhận +30 Tu vi, +8 Cống hiến!", "success");
                    } else {
                        state.player.tuVi = (state.player.tuVi || 0) + 10;
                        state.ui.toast("Tranh luận đạo tâm rơi vào thế bí, tuy nhiên vẫn thu hoạch được chút ngộ đạo. Nhận +10 Tu vi!", "info");
                    }
                }
                break;

            case 'bow_master':
                if (state.player.lastSectBowDay === currentDay) {
                    state.ui.toast("Hôm nay sư phụ bế quan bận rộn hội họp, ngày mai hãy tới thỉnh an!", "warning");
                    return;
                }
                state.player.lastSectBowDay = currentDay;
                state.player.sectContribution = (state.player.sectContribution || 0) + 15;
                state.ui.toast("Ngươi khấu đầu cung kính thỉnh an Tông Chủ tối cao. Nhận thưởng +15 Điểm Cống hiến!", "success");
                break;

            case 'listen_lecture':
                if (state.player.lastSectLectureDay === currentDay) {
                    state.ui.toast("Trưởng lão hôm nay đã truyền pháp xong rồi, hãy quay lại vào ngày mai!", "warning");
                    return;
                }
                if (state.player.gold < 100) {
                    state.ui.toast("Ngươi không đủ 100 Linh Thạch dâng kính trà lễ!", "error");
                    return;
                }
                state.player.gold -= 100;
                state.player.lastSectLectureDay = currentDay;
                state.player.tuVi = (state.player.tuVi || 0) + 150;
                state.ui.toast("Bái nghe Trưởng lão giảng giải đạo lý ngưng cốt. Thần khí sảng khoái đốn ngộ vô cùng! Nhận +150 Tu vi!", "success");
                break;

            case 'donate_herbs':
                {
                    const count = state.player.inventory.getItemQuantity('item_linh_thao');
                    if (count < 5) {
                        state.ui.toast("Ngươi bất túc 5 cọng Linh Thảo để đóng góp!", "error");
                        return;
                    }
                    state.player.inventory.removeItem('item_linh_thao', 5);
                    state.player.sectContribution = (state.player.sectContribution || 0) + 20;
                    state.ui.toast("Hiến quyên thành công 5 Linh Thảo cấp thấp làm linh dược thô. Nhận +20 Cống hiến!", "success");
                }
                break;

            case 'donate_scrap':
                if (state.player.gold < 200) {
                    state.ui.toast("Không đủ 200 Linh Thạch đóng góp khoáng vật chế khí!", "error");
                    return;
                }
                state.player.gold -= 200;
                state.player.sectContribution = (state.player.sectContribution || 0) + 10;
                state.ui.toast("Đóng góp 200 Linh Thạch chế tạo linh tài. Thủ Các Trưởng lão ghi nhận: +10 Cống hiến!", "success");
                break;

            case 'play_beasts':
                if (state.player.mana < 20) {
                    state.ui.toast("Linh lực mệt mỏi bất khả!", "error");
                    return;
                }
                state.player.mana -= 20;
                state.ui.toast("Ngươi ân cần tiếp xúc cho linh thú ăn linh thảo trong vườn. Linh thú tâm tình vui vẻ vô cùng!", "success");
                break;

            case 'catch_insect':
                if (state.player.lastSectCatchDay === currentDay) {
                    state.ui.toast("Hôm nay ngươi đã bắt sâu ở ngự thú viên rồi, hãy đợi ngày mai linh trùng bò ra!", "warning");
                    return;
                }
                if (state.player.mana < 30) {
                    state.ui.toast("Linh lực cạn kiệt không đủ ngự khí giăng lưới!", "error");
                    return;
                }
                state.player.mana -= 30;
                state.player.lastSectCatchDay = currentDay;
                if (Math.random() < 0.25) {
                    state.player.inventory.addItem('item_phe_kim_trung', 1);
                    state.ui.toast("💥 Thành công bắt được 1 con Phệ Kim Trùng hoang dã bò trên linh thạch!", "success");
                } else {
                    state.ui.toast("Hụt mất! Linh trùng bò rất nhanh đã lẩn trốn vào kẽ đá cấm địa.", "info");
                }
                break;

            case 'water_garden':
                if (state.player.lastSectWaterDay === currentDay) {
                    state.ui.toast("Linh điền đã nhận đủ linh lộ tưới tiêu hôm nay rồi!", "warning");
                    return;
                }
                if (state.player.mana < 30) {
                    state.ui.toast("Linh lực cạn kiệt bất khả xách sương dẫn thủy!", "error");
                    return;
                }
                state.player.mana -= 30;
                state.player.lastSectWaterDay = currentDay;
                {
                    const seeds = ['linh_chi_seed', 'nhan_sam_seed', 'tuyet_lien_seed'];
                    const chosen = seeds[Math.floor(Math.random() * seeds.length)];
                    state.player.inventory.addItem(chosen, 1);
                    state.player.sectContribution = (state.player.sectContribution || 0) + 15;
                    state.ui.toast("Tưới sương bắt sâu thảo điền chu đáo! Nhận +15 Cống hiến và 1 Hạt giống linh thảo ngẫu nhiên!", "success");
                }
                break;

            case 'circulate_qi':
                if (state.player.lastSectQiDay === currentDay) {
                    state.ui.toast("Kinh mạch chấn động bão hòa linh lực, bế quan tu luyện thêm sẽ đứt vỡ!", "warning");
                    return;
                }
                if (state.player.mana < 100) {
                    state.ui.toast("Linh khí bất túc đại chu thiên tuần hoàn (Cần 100 Linh Lực)!", "error");
                    return;
                }
                state.player.mana -= 100;
                state.player.lastSectQiDay = currentDay;
                {
                    const gain = Math.floor(state.player.atk * 15 + state.player.level * 50);
                    state.player.tuVi = (state.player.tuVi || 0) + gain;
                    state.ui.toast(`Xếp bằng đại chu thiên vận chuyển đạo pháp ngưng khí 36 vòng! Hấp thu vô vàn linh cơ: +${gain} Tu vi!`, "success");
                }
                break;

            case 'upgrade_array':
                if (state.player.gold < 500) {
                    state.ui.toast("Ngươi thiếu hụt 500 Linh Thạch cải tiến pháp trận động phủ!", "error");
                    return;
                }
                state.player.gold -= 500;
                state.player.tuVi = (state.player.tuVi || 0) + 300;
                state.ui.toast("Nâng cấp pháp trận tụ linh động phủ thành công! Nâng cao căn cơ tĩnh tâm hành thiền. Nhận +300 Tu vi!", "success");
                break;

            case 'trial_fight':
                if (state.player.hp < state.player.maxHp * 0.2) {
                    state.ui.toast("Trạng thái suy nhược cực độ khí huyết quá thấp bất khả thí luyện!", "error");
                    return;
                }
                {
                    const enemy = EnemyGenerator.generate(state.player.realmId);
                    enemy.name = `Ảo Ảnh Thí Luyện (${enemy.realmName})`;
                    enemy.inventory = [];
                    
                    state.ui.toast("Kích hoạt Ảo Ảnh Pháp Trận, trận chiến mở màn!", "info");
                    
                    setTimeout(() => {
                        state.ui.toggleOverlay(document.getElementById('sects-overlay'), false);
                        
                        window.game.startBattle(enemy, null, (isWin) => {
                            if (isWin) {
                                state.player.sectContribution = (state.player.sectContribution || 0) + 50;
                                state.ui.toast("🏆 Thách đấu thành công ảo cảnh! Tông môn thưởng +50 Điểm Cống hiến!", "success");
                            } else {
                                state.ui.toast("Khiêu chiến thất bại! Cố gắng ngộ đạo thêm hãy quay lại.", "error");
                            }
                            
                            setTimeout(() => {
                                state.ui.toggleOverlay(document.getElementById('sects-overlay'), true);
                                window.game.screens.systems.renderSects();
                            }, 1200);
                        });
                    }, 800);
                }
                break;

            case 'vow_forbidden_tablet':
                if (state.player.gold < 100) {
                    state.ui.toast("Không đủ 100 Linh Thạch dâng cúng nhang khói cấm địa!", "error");
                    return;
                }
                if (state.player.mana < 50) {
                    state.ui.toast("Linh lực bất túc để tham ngộ cấm chế!", "error");
                    return;
                }
                state.player.gold -= 100;
                state.player.mana -= 50;
                {
                    const isLucky = Math.random() < 0.15;
                    state.player.tuVi = (state.player.tuVi || 0) + 200;
                    if (isLucky) {
                        const rewardItems = ['item_huyen_thiet', 'item_tinh_kim', 'item_ma_thach', 'item_linh_chi_seed'];
                        const chosen = rewardItems[Math.floor(Math.random() * rewardItems.length)];
                        state.player.inventory.addItem(chosen, 1);
                        state.ui.toast("💥 Đại cát! Tham ngộ bia đá viễn cổ đốn ngộ +200 Tu vi và vô tình lượm được 1x " + (getItemById(chosen)?.name || chosen) + " rơi dưới chân bia!", "success");
                    } else {
                        state.ui.toast("Tham ngộ tấm bia viễn cổ linh sương, đạo tâm thông thái! Nhận +200 Tu vi!", "success");
                    }
                }
                break;

            case 'chore_sweep':
                if (state.player.stamina < 20) {
                    state.ui.toast("Thể lực cạn kiệt, không đủ sức quét dọn!", "error");
                    return;
                }
                if (state.player.mana < 10) {
                    state.ui.toast("Linh lực quá thấp để thanh tẩy rác bụi linh khí!", "error");
                    return;
                }
                state.player.stamina -= 20;
                state.player.mana -= 10;
                state.player.gold = (state.player.gold || 0) + 15;
                state.player.sectContribution = (state.player.sectContribution || 0) + 3;
                state.player.tuVi = (state.player.tuVi || 0) + 10;
                state.ui.toast("Hoàn thành dọn dẹp cống quét Ngoại Môn linh điền! Nhận +15 Linh Thạch, +3 Cống hiến, +10 Tu vi!", "success");
                break;

            case 'submit_copied_rules':
                if ((state.player.sectContribution || 0) < 30) {
                    state.ui.toast("Không đủ 30 Cống Hiến đóng quỹ tông môn chép phạt!", "error");
                    return;
                }
                state.player.sectContribution -= 30;
                state.player.tuVi = (state.player.tuVi || 0) + 200;
                state.ui.toast("Ngươi thành tâm nộp bản chép môn quy tạ lỗi. Trưởng lão chấp pháp rất hài lòng: đạo tâm kiên cường! Nhận +200 Tu vi!", "success");
                break;

            case 'spar_disciples':
                if (state.player.mana < 30) {
                    state.ui.toast("Linh lực không đủ để so tài kiếm pháp!", "error");
                    return;
                }
                state.player.mana -= 30;
                {
                    const success = Math.random() < 0.6;
                    if (success) {
                        state.player.tuVi = (state.player.tuVi || 0) + 80;
                        state.player.sectContribution = (state.player.sectContribution || 0) + 10;
                        state.ui.toast("🏆 Chiến thắng! Ngươi áp đảo đồng môn bằng kiếm chiêu tinh xảo! Nhận +80 Tu vi, +10 Cống hiến!", "success");
                    } else {
                        state.player.tuVi = (state.player.tuVi || 0) + 40;
                        state.ui.toast("Bại trận! Kiếm chiêu đối phương quá bá đạo, tuy nhiên ngươi rút ra nhiều kinh nghiệm. Nhận +40 Tu vi!", "info");
                    }
                }
                break;

            case 'listen_brother':
                if (state.player.stamina < 20) {
                    state.ui.toast("Thể lực mệt mỏi, bất khả nghe đàm luận!", "error");
                    return;
                }
                state.player.stamina -= 20;
                state.player.tuVi = (state.player.tuVi || 0) + 40;
                state.player.sectContribution = (state.player.sectContribution || 0) + 5;
                state.ui.toast("Đàm đạo cùng Nội môn Sư huynh về kinh nghiệm đối kháng yêu nhân. Mở rộng hiểu biết: +40 Tu vi, +5 Cống hiến!", "success");
                break;

            case 'circulate_qi_peak':
                if (state.player.lastSectQiPeakDay === currentDay) {
                    state.ui.toast("Kinh mạch bão hòa linh khí Chân Truyền, hôm nay không thể tiếp tục vận công ở đây!", "warning");
                    return;
                }
                if (state.player.mana < 100) {
                    state.ui.toast("Linh khí bất túc để vận chuyển linh mạch tại Chân Truyền linh đỉnh!", "error");
                    return;
                }
                state.player.mana -= 100;
                state.player.lastSectQiPeakDay = currentDay;
                {
                    const gain = Math.floor(state.player.atk * 20 + state.player.level * 80);
                    state.player.tuVi = (state.player.tuVi || 0) + gain;
                    state.ui.toast(`🌀 Ngồi trên đỉnh Chân Truyền linh khí đậm đặc như hóa sương! Tu vi đại trướng: +${gain} Tu vi!`, "success");
                }
                break;

            case 'plant_spiritual_talisman':
                if (state.player.gold < 200) {
                    state.ui.toast("Không đủ 200 Linh Thạch mua sắm pháp trận linh phù!", "error");
                    return;
                }
                if (state.player.mana < 20) {
                    state.ui.toast("Linh lực bất túc!", "error");
                    return;
                }
                state.player.gold -= 200;
                state.player.mana -= 20;
                state.player.sectContribution = (state.player.sectContribution || 0) + 25;
                state.ui.toast("Bồi dưỡng Linh đỉnh pháp trận hộ đạo bằng Linh Thạch gia cố! Tông môn ban thưởng: +25 Cống hiến!", "success");
                break;
        }

        if (window.game && window.game.saveGame) window.game.saveGame();
        window.game.refreshUI();
        this.renderSects();
    }
}
