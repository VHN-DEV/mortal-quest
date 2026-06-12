import { state } from '../../state.js';
import { getClanById, CLAN_RANKS, CLANS } from '../../configs/clan-data.js';
import { ITEMS } from '../../configs/item-data.js';
import { EnemyGenerator } from '../../core/enemy.js';
import { ASSETS } from '../../configs/asset-data.js';

export class ClanController {
    constructor(parentScreen) {
        this.parentScreen = parentScreen;
        this.activeClanZone = null;
    }

    renderClans() {
        const elClans = document.getElementById('clans-view');
        if (!elClans) return;
        elClans.innerHTML = '';
        elClans.scrollTop = 0;

        if (state.player.clanId) {
            const clan = getClanById(state.player.clanId);
            if (!clan) return;

            // Check if player is viewing a detailed zone
            if (this.activeClanZone) {
                this.renderClanZoneDetail(clan, this.activeClanZone);
                return;
            }

            // Render main Clan dashboard
            const defaultZones = [
                { id: 'to_duong', name: 'Tổ Đường Gia Tộc', icon: '⛩️', desc: 'Bái tế liệt tổ liệt tông gia tộc, cầu nguyện nhận phúc lộc đạo gia.', badge: 'Tổ Đường', badgeColor: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
                { id: 'nghi_su_duong', name: 'Nghị Sự Đường', icon: '🏛️', desc: 'Nơi xử lý tộc vụ, thăng tiến chức vụ tộc nhân và đóng góp tài nguyên.', badge: 'Nghị Sự', badgeColor: 'bg-qi-blue/20 text-qi-blue border-qi-blue/30' },
                { id: 'linh_dien', name: 'Gia Tộc Linh Điền', icon: '🌿', desc: 'Chăm sóc, tưới tiêu linh điền gia tộc. Giúp gieo trồng thu hoạch linh thảo.', badge: 'Sản Nghiệp', badgeColor: 'bg-green-500/20 text-green-400 border-green-500/30' },
                { id: 'mo_linh_thach', name: 'Mỏ Linh Thạch Gia Tộc', icon: '⛏️', desc: 'Khai thác linh khoáng gia tộc hoặc tuần tra đề phòng trộm cướp.', badge: 'Khai Thác', badgeColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
                { id: 'tang_thu_cac', name: 'Gia Tộc Tàng Thư Các', icon: '📚', desc: 'Sử dụng cống hiến để đổi lấy các công pháp bẩm sinh và bí pháp gia truyền.', badge: 'Truyền Thừa', badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
                { id: 'luyen_dan_that', name: 'Luyện Đan Thất', icon: '🔥', desc: 'Mượn lò đan gia tộc để luyện chế đan dược, gia tăng tỷ lệ thành công.', badge: 'Bách Nghệ', badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30' },
                { id: 'tieu_linh_xa', name: 'Tộc Nhân Linh Xá', icon: '🏡', desc: 'Nhà nghỉ ngơi dành cho tộc nhân, tĩnh tọa chu thiên phục hồi thể trạng nhanh chóng.', badge: 'Bế Quan', badgeColor: 'bg-teal-500/20 text-teal-400 border-teal-500/30' }
            ];

            const zonesHTML = defaultZones.map(z => {
                let actualZone = { ...z };
                if (clan.zoneOverrides && clan.zoneOverrides[z.id]) {
                    actualZone = { ...z, ...clan.zoneOverrides[z.id] };
                }

                const badgeStyle = actualZone.badgeColor || 'bg-qi-blue/10 text-qi-blue border-qi-blue/20';

                return `
                    <div class="p-3.5 bg-white/5 rounded-2xl border border-white/5 hover:border-cultivation-gold/30 hover:bg-white/[0.08] transition-all flex justify-between items-center cursor-pointer active:scale-[0.99]"
                         onclick="window.game.screens.systems.clanController.activeClanZone = '${z.id}'; window.game.screens.systems.clanController.renderClans();">
                        <div class="flex items-center space-x-3.5 min-w-0 flex-1">
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
                            <i class="ph ph-caret-right text-gray-500 text-xs"></i>
                        </div>
                    </div>
                `;
            }).join('');

            const rank = CLAN_RANKS[state.player.clanRank || 'ngoai_chi'];
            const contrib = state.player.clanContribution || 0;

            elClans.innerHTML = `
                <div class="bg-white/5 rounded-2xl border border-cultivation-gold/30 overflow-hidden mb-4 relative">
                    <div class="h-28 relative">
                        <img src="${clan.portrait || ASSETS.backgrounds.sect}" class="w-full h-full object-cover opacity-35">
                        <div class="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                        <div class="absolute bottom-3 left-4">
                            <h3 class="text-lg font-ancient text-white">${clan.name}</h3>
                            <p class="text-[9px] text-cultivation-gold uppercase tracking-widest mt-0.5">🧬 Tu Tiên Thế Gia · Truyền Thừa Đời Đời</p>
                        </div>
                    </div>
                    
                    <div class="p-3 bg-black/40 border-t border-white/5 flex justify-between items-center text-[10px]">
                        <div class="flex items-center space-x-4">
                            <div>Thân phận: <span class="font-bold text-white" style="color: ${rank?.color || '#fff'}">${rank?.name || 'Tộc Nhân'}</span></div>
                            <div class="w-px h-3 bg-white/10"></div>
                            <div>Cống hiến tộc: <span class="font-bold text-cultivation-gold">${contrib} CH</span></div>
                        </div>
                        <button class="px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-[8px] font-bold rounded-lg border border-red-500/20 transition-all uppercase tracking-wider" 
                                onclick="if(confirm('Rời khỏi gia tộc? Ngươi sẽ mất toàn bộ cống hiến gia tộc và trở thành tán tu!')) { window.game.screens.systems.clanController.leaveClan(); }">
                            Rời Gia Tộc
                        </button>
                    </div>
                </div>

                <div class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 border-l-2 border-cultivation-gold pl-2">Địa Phận Gia Tộc</div>
                
                <div class="grid grid-cols-1 gap-2.5 pb-12">
                    ${zonesHTML}
                </div>
            `;
            return;
        }

        // --- CLAN RECRUITMENT (JOIN AS GUEST ELDER / KHÁCH KHANH) ---
        // Render Clan list if player is not in any clan
        const clansListHTML = Object.values(CLANS).map(clan => {
            let canJoin = state.player.realmId >= 14; // Requires Truc Co to join as Guest Elder
            
            return `
                <div class="p-4 bg-black/40 rounded-2xl border border-white/5 space-y-3">
                    <div class="flex items-center space-x-3">
                        <div class="w-10 h-10 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center text-xl">
                            🧬
                        </div>
                        <div>
                            <h4 class="text-xs font-ancient font-bold text-white">${clan.name}</h4>
                            <p class="text-[8px] text-gray-500 uppercase tracking-widest mt-0.5">Việt Quốc Thế Gia</p>
                        </div>
                    </div>
                    <p class="text-[9px] text-gray-400 leading-relaxed">${clan.description}</p>
                    <div class="text-[8px] text-gray-500 bg-white/[0.02] p-2 rounded-lg border border-white/5">Yêu cầu bái nhập làm Khách Khanh: <span class="${state.player.realmId >= 14 ? 'text-green-400' : 'text-red-500'}">Cảnh giới Trúc Cơ tầng 1 trở lên</span></div>
                    <button class="w-full py-2 ${canJoin ? 'btn-gold' : 'bg-gray-800 text-gray-600 border border-gray-700/50 cursor-not-allowed'} text-[10px] font-bold rounded-xl transition-all"
                            ${canJoin ? `onclick="window.game.screens.systems.clanController.joinClanAsGuest('${clan.id}');"` : 'disabled'}>
                        GIA NHẬP LÀM KHÁCH KHANH GIA TỘC
                    </button>
                </div>
            `;
        }).join('');

        elClans.innerHTML = `
            <div class="p-5 text-center bg-white/5 rounded-3xl border border-white/10 space-y-4 mb-4">
                <span class="text-4xl">🧬</span>
                <div>
                    <h3 class="text-base font-ancient text-white font-bold">Gia Tộc Tu Tiên</h3>
                    <p class="text-[10px] text-gray-500 uppercase tracking-widest mt-1">Trần Thế Tán Tu · Bái Nhập Khách Khanh</p>
                </div>
                <p class="text-[10px] text-gray-400 max-w-md mx-auto leading-relaxed">
                    Ngươi là một tán tu bên ngoài, không mang huyết mạch gia tộc. Khi cảnh giới đạt tới Trúc Cơ Kỳ, ngươi có thể gia nhập các gia tộc lớn dưới tư cách <strong>Khách Khanh Trưởng Lão</strong> để cùng hưởng thụ linh mạch, làm tộc vụ đổi lấy công pháp truyền thế.
                </p>
            </div>

            <div class="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 border-l-2 border-cultivation-gold pl-2">Gia Tộc Đang Chiêu Mộ Khách Khanh</div>
            
            <div class="space-y-3 pb-12">
                ${clansListHTML || '<div class="text-[10px] text-center text-gray-600 py-6 italic">Hiện tại không có gia tộc nào mở cửa sơn trang...</div>'}
            </div>
        `;
    }

    renderClanZoneDetail(clan, zoneId) {
        const elClans = document.getElementById('clans-view');
        if (!elClans) return;
        elClans.scrollTop = 0;

        const getZoneName = (id, fallback) => {
            if (clan.zoneOverrides && clan.zoneOverrides[id] && clan.zoneOverrides[id].name) {
                return clan.zoneOverrides[id].name;
            }
            return fallback;
        };

        const currentRank = CLAN_RANKS[state.player.clanRank || 'ngoai_chi'];
        let contentHTML = '';

        // Header for details page
        const detailHeaderHTML = `
            <div class="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                <div class="flex items-center space-x-2">
                    <button class="text-qi-blue" onclick="window.game.screens.systems.clanController.activeClanZone = null; window.game.screens.systems.clanController.renderClans();">
                        <i class="ph ph-arrow-left text-lg"></i>
                    </button>
                    <span class="text-sm font-ancient text-white font-bold">${getZoneName(zoneId, zoneId)}</span>
                </div>
                <span class="text-[9px] text-gray-400 uppercase bg-white/5 px-2 py-0.5 rounded border border-white/5">${clan.name}</span>
            </div>
        `;

        switch (zoneId) {
            case 'to_duong':
                contentHTML = `
                    <div class="space-y-4">
                        <div class="p-4 bg-black/40 rounded-xl border border-white/5 text-center space-y-3">
                            <div class="text-3xl">🕯️</div>
                            <div class="text-xs font-bold text-white">Bái Tế Liệt Tổ Liệt Tông</div>
                            <p class="text-[9px] text-gray-400">Thắp nén hương thơm cầu mong tổ tiên gia trì vận khí tu đạo. Mỗi ngày chỉ được vái lạy một lần.</p>
                            <button class="w-full py-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 border border-yellow-500/20 text-xs font-bold rounded-lg transition-all"
                                    onclick="window.game.screens.systems.clanController.worshipAncestors()">
                                <i class="ph ph-sparkles mr-1"></i> Dâng Hương Tế Bái (-10 Linh Lực)
                            </button>
                        </div>

                        <!-- Tộc Vụ Hàng Ngày (Missions) -->
                        <div class="p-4 bg-black/40 rounded-xl border border-white/5 space-y-3">
                            <div class="text-xs font-bold text-white border-b border-white/5 pb-2">📋 Nhiệm Vụ Tộc Vụ Hàng Ngày</div>
                            <p class="text-[9px] text-gray-500">Giúp đỡ gia tộc hoàn thành các tộc vụ để tích lũy tài nguyên và cống hiến tộc nhân.</p>
                            
                            <div class="space-y-2">
                                ${clan.missions.map(m => `
                                    <div class="p-2.5 bg-black/20 rounded-lg border border-white/5 flex justify-between items-center">
                                        <div class="flex-grow min-w-0 pr-3">
                                            <div class="text-[10px] font-bold text-white">${m.name}</div>
                                            <p class="text-[9px] text-gray-500 mt-0.5">${m.desc}</p>
                                            <div class="text-[8px] text-cultivation-gold mt-1">Cống hiến: +${m.reward.contribution || 0} · ${m.reward.lingShi ? `Linh Thạch: +${m.reward.lingShi}` : `Tu Vi: +${m.reward.tuVi}`}</div>
                                        </div>
                                        <button class="px-3 py-1 bg-qi-blue/10 hover:bg-qi-blue/20 text-qi-blue border border-qi-blue/20 text-[9px] font-bold rounded-lg transition-all flex-shrink-0"
                                                onclick="window.game.screens.systems.clanController.doClanMission('${m.id}')">
                                            LÀM (-${m.stamina} Thể Lực)
                                        </button>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `;
                break;

            case 'nghi_su_duong':
                {
                    // Find next rank details
                    const rankKeys = Object.keys(CLAN_RANKS);
                    const currentIdx = rankKeys.indexOf(state.player.clanRank || 'ngoai_chi');
                    const nextRankKey = currentIdx !== -1 && currentIdx < rankKeys.length - 1 ? rankKeys[currentIdx + 1] : null;
                    const nextRank = nextRankKey ? CLAN_RANKS[nextRankKey] : null;

                    let promoteHTML = '';
                    if (nextRank) {
                        const hasRealm = state.player.realmId >= nextRank.minRealm;
                        const hasContrib = (state.player.clanContribution || 0) >= nextRank.minContribution;
                        const canPromote = hasRealm && hasContrib;

                        promoteHTML = `
                            <div class="p-4 bg-black/40 rounded-xl border border-cultivation-gold/20 space-y-3">
                                <div class="text-xs font-bold text-cultivation-gold">🚀 Thăng Tiến Chức Vị Gia Tộc</div>
                                <p class="text-[9px] text-gray-400">Thăng chức vị lên <span class="font-bold text-white" style="color: ${nextRank.color}">${nextRank.name}</span> để nhận bổng lộc hàng tháng cao hơn.</p>
                                
                                <div class="text-[9px] space-y-1.5 bg-black/30 p-2.5 rounded-lg border border-white/5">
                                    <div class="flex justify-between">
                                        <span>Yêu cầu cảnh giới:</span>
                                        <span class="${hasRealm ? 'text-green-400' : 'text-red-500'} font-bold">${state.player.getRealmName ? state.player.getRealmName(nextRank.minRealm) : `Realm ${nextRank.minRealm}`}</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span>Cống hiến cần có:</span>
                                        <span class="${hasContrib ? 'text-green-400' : 'text-red-500'} font-bold">${state.player.clanContribution || 0}/${nextRank.minContribution} CH</span>
                                    </div>
                                </div>

                                <button class="w-full py-2 ${canPromote ? 'btn-gold' : 'bg-gray-800 text-gray-600 border border-gray-700/50 cursor-not-allowed'} text-xs font-bold rounded-lg transition-all"
                                        ${canPromote ? `onclick="window.game.screens.systems.clanController.promoteClanRank('${nextRankKey}')"` : 'disabled'}>
                                    XIN THĂNG CHỨC VỊ
                                </button>
                            </div>
                        `;
                    } else {
                        promoteHTML = `
                            <div class="p-4 bg-black/40 rounded-xl border border-white/5 text-center text-xs text-gray-500">
                                👑 Ngươi đã đạt tới chức vị Thái Thượng Tộc Lão tối cao của gia tộc!
                            </div>
                        `;
                    }

                    contentHTML = `
                        <div class="space-y-4">
                            <div class="p-4 bg-black/40 rounded-xl border border-white/5 space-y-3">
                                <div class="text-xs font-bold text-white border-b border-white/5 pb-2">💰 Quyên Góp Cho Gia Tộc</div>
                                <p class="text-[9px] text-gray-400">Quyên góp Linh Thạch để tích lũy thêm điểm cống hiến xây dựng sản nghiệp dòng họ.</p>
                                
                                <div class="grid grid-cols-3 gap-2">
                                    <button class="py-2.5 bg-white/5 hover:bg-white/10 text-[10px] font-bold rounded-lg border border-white/10 flex flex-col items-center justify-center"
                                            onclick="window.game.screens.systems.clanController.donateLingShi(100, 50)">
                                        <span class="text-white">100 LT</span>
                                        <span class="text-[8px] text-cultivation-gold mt-1">+50 CH</span>
                                    </button>
                                    <button class="py-2.5 bg-white/5 hover:bg-white/10 text-[10px] font-bold rounded-lg border border-white/10 flex flex-col items-center justify-center"
                                            onclick="window.game.screens.systems.clanController.donateLingShi(500, 260)">
                                        <span class="text-white">500 LT</span>
                                        <span class="text-[8px] text-cultivation-gold mt-1">+260 CH</span>
                                    </button>
                                    <button class="py-2.5 bg-white/5 hover:bg-white/10 text-[10px] font-bold rounded-lg border border-white/10 flex flex-col items-center justify-center"
                                            onclick="window.game.screens.systems.clanController.donateLingShi(1000, 550)">
                                        <span class="text-white">1000 LT</span>
                                        <span class="text-[8px] text-cultivation-gold mt-1">+550 CH</span>
                                    </button>
                                </div>
                            </div>

                            ${promoteHTML}
                        </div>
                    `;
                }
                break;

            case 'linh_dien':
                contentHTML = `
                    <div class="p-4 bg-black/40 rounded-xl border border-white/5 text-center space-y-4">
                        <div class="text-3xl">🌿</div>
                        <div>
                            <div class="text-xs font-bold text-white">Chăm Sóc Linh Điền</div>
                            <p class="text-[9px] text-gray-400 mt-1">Chăm nom linh thảo, tưới tiêu và diệt trùng cho vườn linh dược của gia tộc. Nhận tu vi, cống hiến tộc và có cơ hội nhổ được linh thảo quý.</p>
                        </div>
                        <button class="w-full py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 text-xs font-bold rounded-lg transition-all"
                                onclick="window.game.screens.systems.clanController.workInGarden()">
                            <i class="ph ph-plant mr-1"></i> Làm Vườn Tạp Vụ (-15 Thể Lực)
                        </button>
                    </div>
                `;
                break;

            case 'mo_linh_thach':
                contentHTML = `
                    <div class="p-4 bg-black/40 rounded-xl border border-white/5 text-center space-y-4">
                        <div class="text-3xl">⛏️</div>
                        <div>
                            <div class="text-xs font-bold text-white">Khai Thác Linh Khoáng Mạch</div>
                            <p class="text-[9px] text-gray-400 mt-1">Vác cuốc khai khoáng linh thạch trong mỏ gia tộc. Có cơ hội khai thác được nhiều linh thạch, tuy nhiên cẩn thận tán tu đột kích mỏ quặng cướp bóc.</p>
                        </div>
                        <button class="w-full py-2 bg-orange-500/10 hover:bg-orange-500/20 text-orange-400 border border-orange-500/20 text-xs font-bold rounded-lg transition-all"
                                onclick="window.game.screens.systems.clanController.mineSpiritStones()">
                            <i class="ph ph-shovel mr-1"></i> Bắt Đầu Khai Thác (-20 Thể Lực)
                        </button>
                    </div>
                `;
                break;

            case 'tang_thu_cac':
                {
                    const currentRankScore = currentRank?.rankScore || 0;
                    const itemsHTML = (clan.libraryItems || []).map(item => {
                        const actualItem = ITEMS[item.id] || item;
                        const hasRank = currentRankScore >= (item.minRankScore || 0);
                        const isTech = item.isTech;
                        const userHasTech = isTech && state.player.techniques?.some(t => t.id === item.id);
                        
                        return `
                            <div class="p-3 bg-black/30 rounded-xl border border-white/5 flex justify-between items-center">
                                <div class="min-w-0 pr-3">
                                    <div class="text-[10px] font-bold text-white flex items-center space-x-1">
                                        <span>${actualItem.name}</span>
                                        ${isTech ? '<span class="text-[7px] bg-purple-500/20 text-purple-400 px-1 rounded uppercase border border-purple-500/30 font-ancient">Công Pháp</span>' : ''}
                                    </div>
                                    <p class="text-[8px] text-gray-500 mt-0.5">Giá đổi: <span class="text-cultivation-gold font-bold">${item.price} cống hiến</span></p>
                                    <p class="text-[8px] text-gray-400 mt-1 italic">${actualItem.desc || 'Công pháp/Vật phẩm đặc hữu gia truyền.'}</p>
                                </div>
                                <button class="px-2.5 py-1 ${hasRank && !userHasTech ? 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 border border-purple-500/20' : 'bg-gray-800 text-gray-600 border border-gray-700/50 cursor-not-allowed'} text-[9px] font-bold rounded-lg transition-all flex-shrink-0"
                                        ${hasRank && !userHasTech ? `onclick="window.game.screens.systems.clanController.buyLibraryItem('${item.id}', ${item.price}, ${isTech ? 'true' : 'false'})"` : 'disabled'}>
                                    ${userHasTech ? 'ĐÃ HỌC' : !hasRank ? 'CHỨC VỊ THẤP' : 'MUA'}
                                </button>
                            </div>
                        `;
                    }).join('');

                    contentHTML = `
                        <div class="space-y-3">
                            <p class="text-[9px] text-gray-400">Dùng điểm cống hiến tích lũy được khi hoàn thành tộc vụ để mua linh đan đột phá, hoặc học những công pháp gia truyền tinh diệu.</p>
                            <div class="space-y-2 pb-12">
                                ${itemsHTML || '<div class="text-[9px] text-gray-500 py-4 italic text-center">Tàng thư các trống rỗng...</div>'}
                            </div>
                        </div>
                    `;
                }
                break;

            case 'luyen_dan_that':
                contentHTML = `
                    <div class="p-4 bg-black/40 rounded-xl border border-white/5 text-center space-y-4">
                        <div class="text-3xl">🔥</div>
                        <div>
                            <div class="text-xs font-bold text-white">Mượn Lò Đan Gia Tộc</div>
                            <p class="text-[9px] text-gray-400 mt-1">Lò luyện đan địa mạch của gia tộc cung cấp hỏa hầu ổn định. Khi sử dụng đan lô gia tộc, tỷ lệ luyện thành đan của ngươi được cộng thêm 5%.</p>
                        </div>
                        <button class="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-bold rounded-lg transition-all"
                                onclick="window.game.screens.systems.clanController.useAlchemyRoom()">
                            <i class="ph ph-fire mr-1"></i> Tiến Vào Luyện Đan Phòng
                        </button>
                    </div>
                `;
                break;

            case 'tieu_linh_xa':
                contentHTML = `
                    <div class="p-4 bg-black/40 rounded-xl border border-white/5 text-center space-y-4">
                        <div class="text-3xl">🏡</div>
                        <div>
                            <div class="text-xs font-bold text-white">Bế Quan Tĩnh Tọa</div>
                            <p class="text-[9px] text-gray-400 mt-1">Tộc nhân được cấp phát linh xá yên tĩnh để bế quan vận khí. Tiêu hao thể lực để thúc đẩy 1.5 lần tốc độ tích lũy tu vi trong vòng 24 giờ.</p>
                        </div>
                        <button class="w-full py-2 bg-teal-500/10 hover:bg-teal-500/20 text-teal-400 border border-teal-500/20 text-xs font-bold rounded-lg transition-all"
                                onclick="window.game.screens.systems.clanController.startSeclusion()">
                            <i class="ph ph-hourglass mr-1"></i> Bắt Đầu Bế Quan (-20 Thể Lực)
                        </button>
                    </div>
                `;
                break;
        }

        elClans.innerHTML = `
            ${detailHeaderHTML}
            ${contentHTML}
        `;
    }

    // --- INTERACTION LOGIC FUNCTIONS ---

    worshipAncestors() {
        if (state.player.stamina < 5) {
            state.ui.toast("Không đủ thể lực dâng hương!", "warning");
            return;
        }

        const currentDay = state.systems?.time?.totalDays || 0;
        if (state.player.lastClanWorshipDay && state.player.lastClanWorshipDay === currentDay) {
            state.ui.toast("Hôm nay ngươi đã dâng hương tế bái rồi, không nên tham cầu vô độ!", "warning");
            return;
        }

        // Deduct spirit/mp
        if (state.player.mp < 10) {
            state.ui.toast("Linh Lực không đủ để thắp hương hành lễ!", "warning");
            return;
        }
        state.player.mp -= 10;
        state.player.stamina -= 5;
        state.player.lastClanWorshipDay = currentDay;

        // Roll reward
        const roll = Math.random();
        if (roll < 0.50) {
            // Ancestor blessing: +500 tu vi
            const amt = 500 + (state.player.realmId * 100);
            state.player.tuVi += amt;
            state.ui.toast(`🕯️ Tổ tiên hiển linh phù hộ! Nhận được chỉ điểm võ học: +${amt} Tu Vi!`, "success");
        } else if (roll < 0.80) {
            // Insight: +2 comprehension for 1 month
            state.player.comprehension = (state.player.comprehension || 10) + 2;
            state.ui.toast("🕯️ Tổ tiên ban chiếu thần quang! Đầu óc thanh tỉnh lạ thường: +2 Ngộ Tính!", "success");
        } else {
            // Divine sense: +10 divine sense
            state.player.divineSense = (state.player.divineSense || 5) + 5;
            state.ui.toast("🕯️ Tổ tiên gia trì hồn niệm! Cảm giác thần thức linh mẫn vô ngần: +5 Thần Thức!", "success");
        }

        state.ui.screenShake();
        this.renderClans();
    }

    doClanMission(missionId) {
        const clan = getClanById(state.player.clanId);
        if (!clan) return;

        const m = clan.missions.find(x => x.id === missionId);
        if (!m) return;

        if (state.player.stamina < m.stamina) {
            state.ui.toast(`Không đủ thể lực thực hiện tộc vụ này (Cần ${m.stamina} Thể Lực)!`, "warning");
            return;
        }

        state.player.stamina -= m.stamina;
        
        // Add rewards
        const contribReward = m.reward.contribution || 0;
        state.player.clanContribution = (state.player.clanContribution || 0) + contribReward;
        
        let rewardText = `+${contribReward} Cống Hiến Gia Tộc`;

        if (m.reward.lingShi) {
            state.player.addLingShi(m.reward.lingShi);
            rewardText += `, +${m.reward.lingShi} Linh Thạch`;
        }
        if (m.reward.tuVi) {
            state.player.tuVi += m.reward.tuVi;
            rewardText += `, +${m.reward.tuVi} Tu Vi`;
        }

        state.ui.toast(`✅ Hoàn thành tộc vụ: ${m.name}! Nhận thưởng: ${rewardText}`, "success");
        this.renderClans();
    }

    donateLingShi(amount, contribution) {
        if (state.player.lingShi < amount) {
            state.ui.toast("Ngươi không đủ Linh Thạch quyên góp!", "warning");
            return;
        }

        state.player.lingShi -= amount;
        state.player.clanContribution = (state.player.clanContribution || 0) + contribution;

        state.ui.toast(`💰 Quyên góp thành công ${amount} Linh Thạch! Nhận +${contribution} Điểm Cống Hiến Gia Tộc.`, "success");
        this.renderClans();
    }

    promoteClanRank(nextRankKey) {
        const nextRank = CLAN_RANKS[nextRankKey];
        if (!nextRank) return;

        const hasRealm = state.player.realmId >= nextRank.minRealm;
        const hasContrib = (state.player.clanContribution || 0) >= nextRank.minContribution;

        if (!hasRealm || !hasContrib) {
            state.ui.toast("Không đáp ứng đầy đủ điều kiện để xin thăng chức vụ!", "warning");
            return;
        }

        state.player.clanRank = nextRankKey;
        state.ui.toast(`🎉 Chúc mừng! Ngươi đã thăng chức thành công lên: ${nextRank.name}!`, "success");
        state.ui.screenShake();
        this.renderClans();
    }

    workInGarden() {
        if (state.player.stamina < 15) {
            state.ui.toast("Không đủ thể lực làm vườn!", "warning");
            return;
        }

        state.player.stamina -= 15;
        state.player.tuVi += 300;
        state.player.clanContribution = (state.player.clanContribution || 0) + 5;

        let rewardMsg = "Nhận +300 Tu Vi, +5 Cống Hiến Gia Tộc";

        // 40% chance to find a random herb
        if (Math.random() < 0.40) {
            const herbs = ['linh_chi', 'nhan_sam', 'hoang_tinh', 'bach_thao_dich'];
            const herbId = herbs[Math.floor(Math.random() * herbs.length)];
            state.player.inventory.addItem(herbId, 1);
            
            const herbName = ITEMS[herbId]?.name || herbId;
            rewardMsg += `, và nhổ được một gốc ${herbName}!`;
            state.ui.toast(`🌱 ${rewardMsg}`, "success");
        } else {
            state.ui.toast(`🌿 ${rewardMsg}`, "info");
        }

        this.renderClans();
    }

    mineSpiritStones() {
        if (state.player.stamina < 20) {
            state.ui.toast("Không đủ thể lực khai thác quặng!", "warning");
            return;
        }

        state.player.stamina -= 20;

        // 20% chance of robber ambush
        if (Math.random() < 0.20) {
            state.ui.toast("⚠️ Nguy hiểm! Một tên Tán Tu lén lút đột kích mỏ quặng hòng cướp linh thạch của ngươi!", "warning");
            
            // Trigger combat with low level rogue cultivator
            const playerRealm = state.player.realmId || 1;
            const enemyRealm = Math.max(1, playerRealm - 2);
            const enemy = EnemyGenerator.generate(enemyRealm, state.currentWorldId);
            enemy.name = `Tán Tu Cướp Quặng (${enemy.realmName})`;
            
            state.ui.toggleOverlay(document.getElementById('clans-overlay'), false);
            window.game.startBattle(enemy, null, (win) => {
                if (win) {
                    const extraLingShi = 50 + Math.floor(Math.random() * 50);
                    state.player.addLingShi(extraLingShi);
                    state.player.clanContribution = (state.player.clanContribution || 0) + 12;
                    state.ui.toast(`⚔️ Chiến thắng! Ngươi đánh đuổi tên cướp và thu giữ tài sản của hắn: +${extraLingShi} Linh Thạch, +12 Cống Hiến Gia Tộc!`, "success");
                } else {
                    const lost = Math.min(state.player.lingShi, 80);
                    state.player.lingShi -= lost;
                    state.ui.toast(`⚔️ Bị đánh bại! Ngươi bị cướp mất ${lost} Linh Thạch trong mỏ!`, "error");
                }
                setTimeout(() => {
                    state.ui.toggleOverlay(document.getElementById('clans-overlay'), true);
                    this.renderClans();
                }, 1000);
            });
        } else {
            const mined = 10 + Math.floor(Math.random() * 20);
            state.player.addLingShi(mined);
            state.player.clanContribution = (state.player.clanContribution || 0) + 5;
            
            state.ui.toast(`⛏️ Khai khoáng thành công! Đào được +${mined} Linh Thạch, nhận +5 Cống Hiến Gia Tộc!`, "success");
            this.renderClans();
        }
    }

    buyLibraryItem(itemId, price, isTech) {
        if ((state.player.clanContribution || 0) < price) {
            state.ui.toast("Không đủ điểm Cống Hiến Gia Tộc để trao đổi phẩm vật này!", "warning");
            return;
        }

        // Deduct contribution
        state.player.clanContribution -= price;

        if (isTech) {
            // Learn technique
            state.player.learnTechnique(itemId);
            state.ui.toast(`📚 Trao đổi thành công! Đã lĩnh hội công pháp gia truyền: ${ITEMS[itemId]?.name || itemId}!`, "success");
        } else {
            // Add item
            state.player.inventory.addItem(itemId, 1);
            state.ui.toast(`🎁 Trao đổi thành công! Nhận được: 1x ${ITEMS[itemId]?.name || itemId}!`, "success");
        }

        this.renderClans();
    }

    useAlchemyRoom() {
        // Boost alchemy success rate by 5% temporarily (via player properties or status effect)
        state.player.addBuff({
            id: 'clan_alchemy_boost',
            stat: 'alchemySuccessChance',
            value: 0.05,
            duration: 3600000 // 1 hour duration
        });

        state.ui.toast("🔥 Lò đan địa hỏa gia trì! Cơ hội luyện đan của ngươi được cộng thêm 5% trong 1 giờ. Đang di chuyển...", "success");
        
        // Redirect to Alchemy Screen
        window.game.screens.toggleTab(5); // Switch to Tab 5 (Alchemy)
        window.game.closeClan(); // Close clans overlay
    }

    startSeclusion() {
        if (state.player.stamina < 20) {
            state.ui.toast("Không đủ thể lực bế quan!", "warning");
            return;
        }

        state.player.stamina -= 20;
        
        // Add seclusion buff: tuViSpeed x1.5 for 24h
        state.player.addBuff({
            id: 'clan_seclusion',
            stat: 'tuViSpeed',
            value: 1.5,
            duration: 86400000 // 24 hours in milliseconds
        });

        state.ui.toast("🧘 Bế quan tĩnh tọa! Tốc độ tích lũy linh khí tăng 1.5 lần trong 24 giờ tới.", "success");
        state.ui.screenShake();
        this.renderClans();
    }

    joinClanAsGuest(clanId) {
        const clan = getClanById(clanId);
        if (!clan) return;

        if (state.player.realmId < 14) {
            state.ui.toast("Cảnh giới chưa đủ để gia nhập làm Khách Khanh Trưởng Lão!", "warning");
            return;
        }

        state.player.clanId = clanId;
        state.player.clanRank = 'ngoai_chi'; // Start as Guest Elder (mapped to ngoai_chi initially)
        state.player.clanContribution = 0;

        state.ui.toast(`🎉 Chúc mừng! Ngươi đã bái nhập làm Khách Khanh Trưởng Lão của ${clan.name}!`, "success");
        state.ui.screenShake();
        this.renderClans();
    }

    leaveClan() {
        state.player.clanId = null;
        state.player.clanRank = null;
        state.player.clanContribution = 0;

        state.ui.toast("🚪 Ngươi đã rời khỏi gia tộc, mất đi mọi đãi ngộ và trở lại kiếp tán tu tự do.", "info");
        this.activeClanZone = null;
        this.renderClans();
    }
}
