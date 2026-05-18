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
    },
    {
        id: 'elder_guidance',
        name: 'Tiền bối chỉ điểm',
        type: 'buff',
        description: 'Ngươi gặp một vị cao nhân đang tọa hóa, người đã truyền cho ngươi một ít tâm đắc tu hành.',
        result: (player) => {
            const reward = Math.floor(player.tuViPerSecond * 1000);
            player.tuVi += reward;
            return `Ngươi cảm thấy đầu óc minh mẫn, nhận được ${reward} tu vi!`;
        }
    },
    {
        id: 'sect_conflict',
        name: 'Chứng kiến tranh đấu',
        type: 'combat',
        description: 'Phía trước có hai nhóm tu sĩ đang tranh đoạt một gốc linh thảo. Thấy ngươi tiến tới, cả hai đều nhìn ngươi với ánh mắt cảnh giác.'
    },
    {
        id: 'ma_toc_encounter',
        name: 'Ma tộc xuất hiện',
        type: 'combat',
        description: 'Một luồng ma khí nồng nặc bốc lên, một tên Ma tu với gương mặt hung tợn chặn đường ngươi.'
    },
    {
        id: 'rare_herb_interactive',
        name: 'Phát hiện linh dược quý',
        type: 'interactive',
        description: 'Một gốc Thất Thải Linh Chi đang tỏa ra linh quang lấp lánh giữa khe đá. Nhưng dường như có một luồng khí tức cường đại đang ẩn nấp gần đó.',
        options: [
            { label: 'Hái linh dược', value: 'pick', icon: 'ph-leaf' },
            { label: 'Cẩn thận rời đi', value: 'leave', icon: 'ph-walking' }
        ],
        resolve: async (choice, player, game) => {
            if (choice === 'pick') {
                const dangerChance = player.realmId < 14 ? 0.8 : 0.4; // Easier for Bamboo Building (Trúc Cơ) and above
                if (Math.random() < dangerChance) {
                    game.ui.toast("Yêu thú bảo hộ xuất hiện! Ngươi phải chiến đấu để giành lấy linh dược.", "warning");
                    return { type: 'combat_then_loot', loot: 'linh_thao_cao' };
                } else {
                    player.inventory.addItem('linh_thao_cao', 1);
                    return { msg: 'May mắn thay! Nhờ cảnh giới thâm hậu (hoặc may mắn), ngươi đã hái được linh dược mà không kinh động đến yêu thú.' };
                }
            }
            return { msg: 'Ngươi quyết định không mạo hiểm, lẳng lặng rời đi.' };
        }
    },
    {
        id: 'sealed_cave',
        name: 'Hang động có cấm chế',
        type: 'interactive',
        description: 'Phía sau thác nước là một hang động bị bao phủ bởi một tầng màn sáng huyền ảo. Đây là một loại cấm chế cổ đại.',
        options: [
            { label: 'Cường hành phá giải', value: 'break', icon: 'ph-lightning' },
            { label: 'Tìm sơ hở (Yêu cầu Thần Niệm)', value: 'study', icon: 'ph-eye' },
            { label: 'Bỏ qua', value: 'leave', icon: 'ph-x' }
        ],
        resolve: async (choice, player, game) => {
            if (choice === 'break') {
                const threshold = 5000 + (player.realmId * 100);
                const success = player.stats.atk > threshold;
                if (success) {
                    const gain = 5000 + (player.realmId * 500);
                    player.addLingShi(gain);
                    return { msg: `Ngươi dùng sức mạnh tuyệt đối phá tan màn sáng! Bên trong có một ít Linh Thạch cổ (Nhận được ${gain} Linh Thạch).` };
                } else {
                    player.hp -= (500 + player.realmId * 10);
                    return { msg: 'Cấm chế phản chấn! Ngươi bị thương nặng và không thể phá giải.' };
                }
            } else if (choice === 'study') {
                const soulReq = 3000 + (player.realmId * 50);
                const hasFormationManual = player.inventory.hasItem('bp_tran_phap', 1);
                if (player.stats.soul > (hasFormationManual ? soulReq * 0.7 : soulReq)) {
                    player.inventory.addItem('bp_tran_phap', 1);
                    return { msg: 'Thần niệm nhạy bén (và kiến thức trận pháp) giúp ngươi tìm ra điểm yếu. Ngươi thu hoạch được một cuốn Trận Pháp Cơ Bản.' };
                } else {
                    return { msg: 'Thần niệm của ngươi chưa đủ mạnh để nhìn thấu quy luật phức tạp của cấm chế này.' };
                }
            }
            return { msg: 'Ngươi cảm thấy cấm chế này quá nguy hiểm, quyết định rời đi.' };
        }
    },
    {
        id: 'immortal_dwelling',
        name: 'Động phủ tiên nhân',
        type: 'interactive',
        description: 'Một tòa lầu các nguy nga hiện ra giữa mây mù. Áp lực linh khí khiến ngươi cảm thấy khó thở.',
        options: [
            { label: 'Vào khám phá', value: 'enter', icon: 'ph-door' },
            { label: 'Bái lạy rồi rời đi', value: 'pray', icon: 'ph-hands-praying' }
        ],
        resolve: async (choice, player, game) => {
            if (choice === 'enter') {
                const baseLuck = 60;
                const luckBonus = player.realmId >= 22 ? 20 : 0; // Yuan Ying (Nguyên Anh) recognized by dwelling
                if (player.luck + luckBonus > baseLuck) {
                    player.inventory.addItem('tien_tinh', 1);
                    return { msg: 'Khí tức của ngươi phù hợp với chủ nhân động phủ, ngươi vượt qua khảo nghiệm và nhận được một viên Tiên Tinh!' };
                } else {
                    game.ui.toast("Bẫy rập kích hoạt! Ngươi bị dịch chuyển ra ngoài.", "error");
                    return { msg: 'Động phủ tràn đầy cạm bẫy, ngươi may mắn thoát ra được nhưng không thu hoạch gì.' };
                }
            } else if (choice === 'pray') {
                const karmaGain = player.realmId < 14 ? 10 : 20;
                player.karma += karmaGain;
                return { msg: `Sự thành tâm của một ${player.realmId >= 14 ? 'tu sĩ' : 'phàm nhân'} như ngươi nhận được một tia phúc trạch, công đức tăng ${karmaGain}.` };
            }
            return null;
        }
    },
    {
        id: 'guarding_formation',
        name: 'Trận pháp bảo vệ',
        type: 'interactive',
        description: 'Giữa đống đổ nát, một vầng sáng hình bát quái đang xoay tròn, che giấu thứ gì đó bên dưới. Đây là một phòng ngự trận pháp.',
        options: [
            { label: 'Dùng lực phá trận', value: 'force', icon: 'ph-hammer' },
            { label: 'Nghiên cứu trận nhãn', value: 'study', icon: 'ph-compass' },
            { label: 'Rời đi', value: 'leave', icon: 'ph-arrow-u-up-left' }
        ],
        resolve: async (choice, player, game) => {
            if (choice === 'force') {
                if (player.stats.atk > 8000) {
                    player.inventory.addItem('linh_thach_trung', 5);
                    return { msg: 'Ngươi dùng đại lực phá tan trận pháp! Thu được 5 viên Linh Thạch Trung Phẩm.' };
                } else {
                    player.hp -= 1000;
                    return { msg: 'Trận pháp phản chấn cực mạnh! Ngươi bị hất văng ra xa.' };
                }
            } else if (choice === 'study') {
                if (player.stats.soul > 5000) {
                    player.inventory.addItem('bp_tran_phap', 1);
                    return { msg: 'Ngươi nhìn thấu trận nhãn và hóa giải nó một cách nhẹ nhàng. Tìm thấy một cuốn Trận Pháp Tàn Quyển.' };
                } else {
                    return { msg: 'Trận pháp quá phức tạp, ngươi không thể tìm ra kẽ hở.' };
                }
            }
            return null;
        }
    },
    {
        id: 'merchant_distress',
        name: 'Thương nhân gặp nạn',
        type: 'interactive',
        description: (player) => {
            if (player.realmId >= 22) return 'Một xe ngựa của thương hội bị lật, bọn cướp đang bao vây vị thương nhân. Khi thấy ngươi lướt tới với uy áp Nguyên Anh, cả bọn cướp lẫn thương nhân đều run rẩy.';
            if (player.realmId >= 14) return 'Một xe ngựa bị lật, bọn cướp đang bao vây vị thương nhân. Sự xuất hiện của một vị tu sĩ như ngươi khiến bọn cướp có chút e dè.';
            return 'Một xe ngựa của thương hội bị lật bên đường, một nhóm cướp đang bao vây vị thương nhân béo tốt. Chúng nhìn ngươi với ánh mắt hung quang lộ rõ.';
        },
        options: (player) => {
            const opts = [
                { label: 'Ra tay cứu giúp', value: 'help', icon: 'ph-shield-plus' },
                { label: 'Thờ ơ đi qua', value: 'ignore', icon: 'ph-eye-slash' }
            ];
            if (player.karma < 0 || player.realmId < 14) {
                opts.splice(1, 0, { label: 'Cùng bọn cướp hôi của', value: 'rob', icon: 'ph-hand-grabbing' });
            }
            if (player.realmId >= 22) {
                opts.push({ label: 'Dùng uy áp đuổi khéo', value: 'intimidate', icon: 'ph-detective' });
            }
            return opts;
        },
        resolve: async (choice, player, game) => {
            const hasMerchantToken = player.inventory.hasItem('token_merchant', 1);
            if (choice === 'help') {
                game.ui.toast("Ngươi ra tay đánh đuổi bọn cướp!", "success");
                player.karma += 20;
                const baseReward = 2000 + (player.realmId * 200);
                const finalReward = hasMerchantToken ? baseReward * 2 : baseReward;
                player.addLingShi(finalReward);
                return { msg: `Vị thương nhân cảm kích khôn cùng${hasMerchantToken ? ' khi thấy lệnh bài của bằng hữu' : ''}, tặng ngươi ${finalReward} Linh Thạch và một ít đan dược.` };
            } else if (choice === 'rob') {
                player.karma -= 50;
                const robReward = 5000 + (player.realmId * 500);
                player.addLingShi(robReward);
                return { msg: `Ngươi cùng bọn cướp chia chác tài sản. Nhận được ${robReward} Linh Thạch nhưng danh tiếng sụt giảm nghiêm trọng.` };
            } else if (choice === 'intimidate') {
                player.karma += 10;
                player.addLingShi(3000);
                return { msg: 'Chỉ một cái liếc mắt, lũ cướp đã hồn bay phách lạc bỏ chạy. Thương nhân tôn kính dâng lên 3000 Linh Thạch phí bảo hộ.' };
            }
            return null;
        }
    },
    {
        id: 'mysterious_tablet',
        name: 'Bia đá thần bí',
        type: 'interactive',
        description: 'Một tấm bia đá loang lổ vết thời gian dựng đứng giữa rừng, bên trên khắc những văn tự cổ quái mang theo ý chí bất khuất.',
        options: [
            { label: 'Cảm ngộ bia văn', value: 'meditate', icon: 'ph-brain' },
            { label: 'Lấy bia đá đi', value: 'take', icon: 'ph-package' },
            { label: 'Bỏ qua', value: 'leave', icon: 'ph-x' }
        ],
        resolve: async (choice, player, game) => {
            if (choice === 'meditate') {
                if (player.stats.soul > 4000) {
                    const tuviGain = player.realmId * 1000;
                    player.addTuVi(tuviGain);
                    return { msg: `Ngươi chìm vào ảo cảnh chiến đấu cổ đại, lĩnh hội được ý chí chiến đấu. Nhận được ${tuviGain} Tu Vi!` };
                } else {
                    return { msg: 'Văn tự quá cao thâm, ngươi nhìn một lúc cảm thấy đầu óc choáng váng.' };
                }
            } else if (choice === 'take') {
                player.inventory.addItem('thien_dao_than_thach', 1);
                return { msg: 'Ngươi dùng sức mạnh nhổ tận gốc bia đá mang đi. Đây quả là một loại vật liệu rèn đúc quý giá!' };
            }
            return null;
        }
    },
    {
        id: 'beast_hunt_join',
        name: 'Gia nhập đoàn săn bắt',
        type: 'interactive',
        description: (player) => {
            if (player.realmId >= 22) return 'Một nhóm tán tu đang vất vả bao vây một con Thiết Giáp Tê Ngưu. Thấy ngươi lướt ngang, họ vội vàng cung kính mời đại năng ra tay trợ giúp.';
            if (player.realmId >= 14) return 'Nhóm tán tu đang vây săn yêu thú, họ nhận ra tu vi của ngươi và ngỏ ý mời cùng gia nhập.';
            return 'Một nhóm tán tu đang bao vây một con Thiết Giáp Tê Ngưu. Thấy ngươi, họ nhìn qua tu vi rồi hất hàm hỏi có muốn làm mồi nhử không.';
        },
        options: (player) => {
            const opts = [
                { label: 'Đồng ý gia nhập', value: 'join', icon: 'ph-users-three' },
                { label: 'Từ chối', value: 'leave', icon: 'ph-prohibit' }
            ];
            if (player.realmId < 14) opts.push({ label: 'Tọa sơn quan hổ đấu', value: 'wait', icon: 'ph-binoculars' });
            if (player.realmId >= 22) opts.push({ label: 'Cướp lấy con mồi', value: 'rob', icon: 'ph-hand-grabbing' });
            return opts;
        },
        resolve: async (choice, player, game) => {
            if (choice === 'join') {
                const success = player.stats.atk > 3000 || player.realmId >= 14;
                if (success) {
                    player.addLingShi(3000);
                    player.inventory.addItem('yeu_dan_trung', 1);
                    return { msg: 'Sự giúp sức của ngươi giúp đoàn săn nhanh chóng hạ gục yêu thú. Họ cung kính dâng lên phần chia lớn nhất.' };
                } else {
                    player.hp -= 300;
                    return { msg: 'Ngươi quá yếu, suýt chút nữa đã mất mạng. Nhóm tán tu cười nhạo và đuổi ngươi đi như một kẻ vướng chân.' };
                }
            } else if (choice === 'wait') {
                if (Math.random() < 0.4) {
                    player.addLingShi(5000);
                    player.karma -= 20;
                    return { msg: 'Nhóm tán tu và yêu thú lưỡng bại câu thương. Ngươi ra tay hốt gọn chiến lợi phẩm!' };
                } else {
                    return { msg: 'Bọn họ đã hạ gục yêu thú và cảnh giác nhìn về phía ngươi. Ngươi không có cơ hội ra tay.' };
                }
            } else if (choice === 'rob') {
                player.karma -= 40;
                player.inventory.addItem('yeu_dan_trung', 2);
                player.addLingShi(5000);
                return { msg: 'Ngươi ra tay bá đạo, một chiêu kết liễu yêu thú và lấy đi toàn bộ. Nhóm tán tu tức giận nhưng không dám ho một tiếng.' };
            }
            return null;
        }
    },
    {
        id: 'herb_dispute',
        name: 'Tranh chấp linh thảo',
        type: 'interactive',
        description: 'Ngươi và một vị tu sĩ khác cùng lúc phát hiện một gốc Huyết Tinh Thảo quý hiếm. Đối phương đang trừng mắt nhìn ngươi.',
        options: [
            { label: 'Ra tay tranh đoạt', value: 'fight', icon: 'ph-sword' },
            { label: 'Thương lượng chia đôi', value: 'trade', icon: 'ph-handshake' },
            { label: 'Nhường cho đối phương', value: 'give', icon: 'ph-arrow-fat-right' }
        ],
        resolve: async (choice, player, game) => {
            if (choice === 'fight') {
                return { type: 'combat_then_loot', loot: 'linh_thao_cao', msg: 'Không nói nhiều, thực lực là trên hết!' };
            } else if (choice === 'trade') {
                if (player.stats.soul > 2000) {
                    player.inventory.addItem('linh_thao_trung', 1);
                    return { msg: 'Ngươi dùng miệng lưỡi (và thần niệm áp chế) khiến đối phương chấp nhận chia cho ngươi một nửa.' };
                } else {
                    return { msg: 'Đối phương không thèm thương lượng, đuổi ngươi đi.' };
                }
            } else if (choice === 'give') {
                player.karma += 5;
                return { msg: 'Ngươi quyết định nhường lại, coi như kết một thiện duyên.' };
            }
            return null;
        }
    },
    {
        id: 'discuss_dao',
        name: 'Luận đạo đàm tâm',
        type: 'interactive',
        description: 'Một vị lão đạo sĩ đang ngồi dưới gốc tùng, mời ngươi ngồi xuống cùng đàm luận về thiên đạo.',
        options: [
            { label: 'Tọa đàm luận đạo', value: 'talk', icon: 'ph-book-open-text' },
            { label: 'Thỉnh giáo tu hành', value: 'ask', icon: 'ph-graduation-cap' },
            { label: 'Bận việc xin cáo từ', value: 'leave', icon: 'ph-sign-out' }
        ],
        resolve: async (choice, player, game) => {
            if (choice === 'talk') {
                if (player.realmId >= 26) { // Hóa Thần (Hwa Shin)
                    player.karma += 20;
                    player.fate.reputation += 10;
                    return { msg: 'Ngươi chỉ điểm cho lão đạo sĩ về thiên đạo. Lão nhân đại ngộ, dập đầu cảm tạ, ngươi nhận được công đức và danh vọng!' };
                }
                const gain = Math.floor(player.tuViPerSecond * 1000);
                player.addTuVi(gain);
                return { msg: `Sau một hồi đàm luận, ngươi cảm thấy tâm cảnh thông suốt. Nhận được ${gain} Tu Vi!` };
            } else if (choice === 'ask') {
                const cost = 1000 + (player.realmId * 100);
                if (player.lingShi >= cost) {
                    player.spendLingShi(cost);
                    player.stats.soul += 50;
                    return { msg: `Ngươi thành tâm thỉnh giáo, lão đạo sĩ chỉ điểm bí thuật. Thần Niệm tăng 50! (Tốn ${cost} Linh Thạch)` };
                } else {
                    return { msg: 'Lão đạo sĩ cười mà không nói, có vẻ lễ nghi của ngươi chưa đủ.' };
                }
            }
            return null;
        }
    },
    {
        id: 'legacy_ghost',
        name: 'Truyền thừa tàn hồn',
        type: 'interactive',
        description: 'Một luồng hắc khí bốc lên, hiện ra tàn hồn của một vị ma đạo đại năng. Hắn muốn truyền lại công pháp cho ngươi với một điều kiện...',
        options: [
            { label: 'Chấp nhận truyền thừa', value: 'accept', icon: 'ph-check-circle' },
            { label: 'Ra tay tịnh hóa', value: 'purify', icon: 'ph-sun' },
            { label: 'Bỏ qua', value: 'leave', icon: 'ph-x' }
        ],
        resolve: async (choice, player, game) => {
            if (choice === 'accept') {
                player.karma -= 100;
                const atkGain = 200 + (player.realmId * 10);
                player.stats.atk += atkGain;
                player.inventory.addItem('ma_thach', 10);
                return { msg: `Ngươi nhận lấy ma công, thực lực tăng mạnh (Công kích +${atkGain}) nhưng ma tính cũng theo đó mà tăng lên!` };
            } else if (choice === 'purify') {
                const soulReq = 5000 + (player.realmId * 100);
                if (player.stats.soul > soulReq) {
                    player.karma += 50;
                    player.inventory.addItem('linh_thach_thuong', 1);
                    return { msg: 'Ngươi dùng thần niệm thâm hậu tịnh hóa tàn hồn, nhận được công đức và một viên Linh Thạch Thượng Phẩm.' };
                } else {
                    player.hp -= (500 + player.realmId * 20);
                    return { msg: 'Tàn hồn quá mạnh, ngươi bị ma khí phản phệ dữ dội!' };
                }
            }
            return null;
        }
    },
    {
        id: 'mysterious_ring',
        name: 'Nhẫn cũ thần bí',
        type: 'interactive',
        description: 'Dưới gốc cây mục, ngươi nhặt được một chiếc nhẫn đồng rỉ sét. Cảm giác có một luồng linh lực yếu ớt phát ra từ bên trong.',
        options: [
            { label: 'Nhỏ máu nhận chủ', value: 'blood', icon: 'ph-drop' },
            { label: 'Đem đi bán', value: 'sell', icon: 'ph-currency-dollar' },
            { label: 'Vứt đi', value: 'trash', icon: 'ph-trash' }
        ],
        resolve: async (choice, player, game) => {
            if (choice === 'blood') {
                if (player.luck > 70) {
                    player.inventory.addItem('tien_khi', 1);
                    return { msg: 'Hào quang rực rỡ! Đây quả nhiên là một chiếc nhẫn chứa đựng không gian và truyền thừa của một vị tiên nhân!' };
                } else {
                    return { msg: 'Nhẫn không có phản ứng gì, có lẽ chỉ là một món đồ chơi cũ.' };
                }
            } else if (choice === 'sell') {
                player.addLingShi(500);
                return { msg: 'Ngươi bán nó cho tiệm đồ cũ được 500 Linh Thạch.' };
            }
            return null;
        }
    },
    {
        id: 'spirit_pool',
        name: 'Tẩy Tủy Trì',
        type: 'interactive',
        description: 'Một hồ nước tự nhiên tỏa ra linh khí đậm đặc. Đây là Tẩy Tủy Trì hiếm gặp, có thể giúp tu sĩ thoát thai hoán cốt.',
        options: [
            { label: 'Nhảy xuống tẩy tủy', value: 'bath', icon: 'ph-waves' },
            { label: 'Lấy nước mang đi', value: 'take', icon: 'ph-bottle' },
            { label: 'Rời đi', value: 'leave', icon: 'ph-arrow-left' }
        ],
        resolve: async (choice, player, game) => {
            if (choice === 'bath') {
                if (Math.random() < 0.7) {
                    player.stats.def += 100;
                    player.stats.atk += 50;
                    return { msg: 'Ngươi cảm thấy kinh mạch được mở rộng, cơ thể tràn đầy sức mạnh. Các chỉ số đều tăng!' };
                } else {
                    player.hp -= 1000;
                    return { msg: 'Linh khí quá bạo liệt, kinh mạch của ngươi không chịu nổi áp lực, bị thương nặng!' };
                }
            } else if (choice === 'take') {
                player.inventory.addItem('linh_dich', 5);
                return { msg: 'Ngươi lấy được 5 lọ Linh Dịch tinh khiết.' };
            }
            return null;
        }
    },
    {
        id: 'sword_intent_cliff',
        name: 'Kiếm Ý Vách Đá',
        type: 'interactive',
        description: 'Vách đá bị một đạo kiếm khí khổng lồ chém đứt, để lại một vết sẹo sâu hoắm vẫn còn tỏa ra kiếm ý bén nhọn.',
        options: [
            { label: 'Cảm ngộ kiếm ý', value: 'meditate', icon: 'ph-sword' },
            { label: 'Dùng tay sờ vào', value: 'touch', icon: 'ph-hand-pointing' }
        ],
        resolve: async (choice, player, game) => {
            if (choice === 'meditate') {
                if (player.stats.soul > 3000) {
                    player.stats.atk += 150;
                    return { msg: 'Ngươi chìm đắm trong kiếm ý, lĩnh hội được một phần tinh túy. Công kích tăng 150!' };
                } else {
                    return { msg: 'Kiếm ý quá mạnh, ngươi không thể tập trung cảm ngộ.' };
                }
            } else if (choice === 'touch') {
                player.hp -= 2000;
                return { msg: 'Ngu ngốc! Kiếm ý bộc phát chém đứt một phần kinh mạch của ngươi!' };
            }
            return null;
        }
    },
    {
        id: 'abandoned_garden',
        name: 'Dược viên bỏ hoang',
        type: 'interactive',
        description: 'Một khu vườn cũ nát với hàng rào đổ nát, bên trong có vẻ còn sót lại vài gốc linh thảo lâu năm.',
        options: [
            { label: 'Vào hái linh thảo', value: 'harvest', icon: 'ph-leaf' },
            { label: 'Tìm kiếm bí mật', value: 'search', icon: 'ph-magnifying-glass' }
        ],
        resolve: async (choice, player, game) => {
            if (choice === 'harvest') {
                player.inventory.addItem('linh_thao_trung', 3);
                return { msg: 'Ngươi hái được một ít linh thảo trung phẩm còn sót lại.' };
            } else if (choice === 'search') {
                if (player.luck > 80) {
                    player.inventory.addItem('dan_phuong_hiem', 1);
                    return { msg: 'Dưới một tảng đá, ngươi tìm thấy một cuốn Đan Phương Hiếm bị thất lạc!' };
                } else {
                    return { msg: 'Ngươi tìm kiếm một hồi nhưng không thấy gì thêm.' };
                }
            }
            return null;
        }
    },
    {
        id: 'beast_tide',
        name: 'Yêu Thú Triều Tịch',
        type: 'interactive',
        description: 'Tiếng gầm rú vang trời, hàng ngàn yêu thú đang tràn xuống từ đỉnh núi. Một thảm họa Beast Tide đang diễn ra!',
        options: [
            { label: 'Ở lại chiến đấu', value: 'fight', icon: 'ph-sword' },
            { label: 'Trốn vào hang động', value: 'hide', icon: 'ph-house' },
            { label: 'Bỏ chạy thật nhanh', value: 'run', icon: 'ph-run' }
        ],
        resolve: async (choice, player, game) => {
            if (choice === 'fight') {
                const gain = player.realmId * 5000;
                player.addTuVi(gain);
                const moneyGain = 5000 + (player.realmId * 500);
                player.addLingShi(moneyGain);
                return { msg: `Ngươi dũng mãnh sát địch, thu được vô số yêu đan và tu vi chiến đấu. Nhận được ${gain} Tu Vi và ${moneyGain} Linh Thạch!` };
            } else if (choice === 'hide') {
                const hideLuck = 40 + (player.realmId);
                if (player.luck > hideLuck) {
                    return { msg: 'Ngươi trốn kỹ trong hang, chờ triều tịch đi qua. May mắn không bị phát hiện.' };
                } else {
                    player.hp -= (500 + player.realmId * 50);
                    return { msg: 'Yêu thú phát hiện ra nơi ẩn nấp! Ngươi phải chật vật lắm mới thoát ra được.' };
                }
            } else if (choice === 'run') {
                player.hp -= 200;
                return { msg: 'Ngươi chạy thục mạng, tuy thoát nạn nhưng cũng bị vài con yêu thú quẹt trúng.' };
            }
            return null;
        }
    },
    {
        id: 'ancient_formation_puzzle',
        name: 'Trận pháp câu đố',
        type: 'interactive',
        description: 'Một trận pháp bát quái đang chặn đường, các quân cờ linh khí đang di chuyển theo một quy luật nhất định.',
        options: [
            { label: 'Giải mã quy luật', value: 'solve', icon: 'ph-puzzle-piece' },
            { label: 'Dùng lực phá trận', value: 'break', icon: 'ph-hammer' }
        ],
        resolve: async (choice, player, game) => {
            if (choice === 'solve') {
                if (player.stats.soul > 4500) {
                    player.inventory.addItem('bp_tran_phap', 2);
                    return { msg: 'Trí tuệ của ngươi đã chinh phục trận pháp! Thu được 2 cuốn bí kíp Trận Pháp.' };
                } else {
                    return { msg: 'Quy luật quá phức tạp, ngươi càng nhìn càng thấy chóng mặt.' };
                }
            } else if (choice === 'break') {
                if (player.stats.atk > 15000) {
                    return { msg: 'Ngươi dùng đại lực phá tan hư ảo, trực tiếp đi qua.' };
                } else {
                    player.hp -= 1500;
                    return { msg: 'Trận pháp phản phệ, linh khí nổ tung ngay trước mặt ngươi!' };
                }
            }
            return null;
        }
    },
    {
        id: 'npc_duel_bet',
        name: 'Tán tu khiêu chiến',
        type: 'interactive',
        description: (player) => {
            if (player.realmId >= 22) return 'Một vị tán tu vốn định chặn đường, nhưng khi nhìn rõ tu vi của ngươi, hắn lập tức quỳ sụp xuống xin tha mạng.';
            return 'Một vị tán tu ngang ngược chặn đường, muốn tỷ thí với ngươi một trận với mức cược là 5000 Linh Thạch.';
        },
        options: (player) => {
            if (player.realmId >= 22) {
                return [
                    { label: 'Tha cho hắn', value: 'forgive', icon: 'ph-hand-palm' },
                    { label: 'Lấy đi túi trữ vật', value: 'rob_weak', icon: 'ph-hand-grabbing' }
                ];
            }
            return [
                { label: 'Chấp nhận tỷ thí', value: 'accept', icon: 'ph-sword' },
                { label: 'Từ chối (Bị khinh bỉ)', value: 'refuse', icon: 'ph-hand-grabbing' }
            ];
        },
        resolve: async (choice, player, game) => {
            if (choice === 'accept') {
                if (player.lingShi < 5000) return { msg: 'Ngươi không đủ linh thạch để đặt cược!' };
                return { type: 'combat_then_loot', loot: 'ling_thach_thuong', msg: 'Hảo! Hãy xem thực lực của ngươi đến đâu!' };
            } else if (choice === 'refuse') {
                player.karma -= 2;
                return { msg: 'Ngươi lẳng lặng đi qua, mặc cho hắn cười nhạo sau lưng.' };
            } else if (choice === 'forgive') {
                player.karma += 5;
                return { msg: 'Ngươi phất tay cho hắn đi. Hắn dập đầu cảm tạ rồi chạy biến.' };
            } else if (choice === 'rob_weak') {
                player.karma -= 10;
                player.addLingShi(2000);
                return { msg: 'Hắn run rẩy dâng lên túi trữ vật. Ngươi thu được 2000 Linh Thạch.' };
            }
            return null;
        }
    },
    {
        id: 'beauty_distress',
        name: 'Giai nhân gặp nạn',
        type: 'interactive',
        description: 'Một nữ tu xinh đẹp đang bị một nhóm hắc y nhân bao vây. Nàng nhìn ngươi với ánh mắt cầu cứu.',
        options: [
            { label: 'Anh hùng cứu mỹ nhân', value: 'help', icon: 'ph-heart' },
            { label: 'Ngồi xem kịch hay', value: 'watch', icon: 'ph-television' },
            { label: 'Rời đi', value: 'leave', icon: 'ph-x' }
        ],
        resolve: async (choice, player, game) => {
            if (choice === 'help') {
                player.karma += 50;
                player.inventory.addItem('linh_thao_cao', 1);
                return { msg: 'Ngươi ra tay đánh đuổi hắc y nhân. Nàng tặng ngươi một gốc linh thảo và hứa sẽ báo đáp sau.' };
            } else if (choice === 'watch') {
                player.karma -= 20;
                return { msg: 'Ngươi đứng xem cho đến khi nàng bị bắt đi. Một cảm giác tội lỗi thoáng qua.' };
            }
            return null;
        }
    },
    {
        id: 'dying_elder',
        name: 'Lão giả tọa hóa',
        type: 'interactive',
        description: 'Trong một hang động hẻo lánh, ngươi gặp một vị lão giả hơi thở yếu ớt. Ông ta sắp tọa hóa và muốn tìm người truyền thừa.',
        options: [
            { label: 'Nghe lời trăn trối', value: 'listen', icon: 'ph-ear' },
            { label: 'Tranh thủ lúc yếu ra tay', value: 'kill', icon: 'ph-knife' }
        ],
        resolve: async (choice, player, game) => {
            if (choice === 'listen') {
                player.karma += 30;
                player.inventory.addItem('bp_luyen_dan', 1);
                return { msg: `Ông ta mỉm cười${player.realmId >= 22 ? ', nhận ra ngươi là một mầm non đầy hứa hẹn' : ''}, truyền lại cho ngươi tâm đắc cả đời về Luyện Đan rồi thanh thản ra đi.` };
            } else if (choice === 'kill') {
                player.karma -= 200;
                const lootMoney = 20000 + (player.realmId * 2000);
                player.addLingShi(lootMoney);
                return { msg: `Ngươi giết người đoạt bảo! Thu được túi trữ vật chứa ${lootMoney} Linh Thạch nhưng tâm ma đã nảy mầm.` };
            }
            return null;
        }
    },
    {
        id: 'auction_drama',
        name: 'Đấu giá lưu động',
        type: 'interactive',
        description: 'Một nhóm tu sĩ đang đấu giá một mảnh tàn đồ bí cảnh. Giá hiện tại là 8000 Linh Thạch.',
        options: [
            { label: 'Trả giá 10,000', value: 'bid', icon: 'ph-money' },
            { label: 'Đợi kết thúc rồi cướp', value: 'rob', icon: 'ph-hand-grabbing' },
            { label: 'Không quan tâm', value: 'leave', icon: 'ph-x' }
        ],
        resolve: async (choice, player, game) => {
            const auctionPrice = 8000 + (player.realmId * 500);
            if (choice === 'bid') {
                if (player.lingShi >= auctionPrice) {
                    player.spendLingShi(auctionPrice);
                    player.inventory.addItem('map_fragment', 1);
                    return { msg: `Ngươi đấu giá thành công với mức giá ${auctionPrice} Linh Thạch! Có được mảnh tàn đồ bí cảnh.` };
                } else {
                    return { msg: 'Ngươi không đủ linh thạch để tham gia cuộc đấu giá này.' };
                }
            } else if (choice === 'rob') {
                player.karma -= 80;
                return { type: 'combat_then_loot', loot: 'map_fragment', msg: 'Ngươi chờ sẵn bên ngoài, ra tay ngay khi người mua vừa bước ra! Kẻ mạnh mới có quyền sở hữu tàn đồ.' };
            }
            return null;
        }
    },
    {
        id: 'natural_phenomenon',
        name: 'Thiên địa dị tượng',
        type: 'interactive',
        description: 'Bầu trời bất ngờ xuất hiện ngũ sắc tường vân, linh khí hóa mưa rơi xuống. Đây là thiên địa ban ân!',
        options: [
            { label: 'Tọa hạ hấp thu', value: 'absorb', icon: 'ph-lightning' },
            { label: 'Dùng bình thu thập', value: 'collect', icon: 'ph-bottle' }
        ],
        resolve: async (choice, player, game) => {
            if (choice === 'absorb') {
                const baseGain = player.tuViPerSecond * 2000;
                const bonus = player.advancedStats.qiAbsorb || 1.0;
                const gain = Math.floor(baseGain * bonus);
                player.addTuVi(gain);
                return { msg: `Ngươi hấp thu linh vũ, cảm thấy tu vi tăng tiến vùn vụt (Nhận được ${gain} Tu Vi, x${bonus.toFixed(1)} từ tốc độ hấp thu).` };
            } else if (choice === 'collect') {
                const amount = player.realmId >= 22 ? 4 : 2; // More for Yuan Ying+
                player.inventory.addItem('linh_dich_ngu_sac', amount);
                return { msg: `Ngươi thu thập được ${amount} bình Ngũ Sắc Linh Dịch cực phẩm.` };
            }
            return null;
        }
    },
    {
        id: 'poison_cloud',
        name: 'Chướng khí độc cốc',
        type: 'interactive',
        description: 'Một đám mây tím ngắt đang từ từ bao phủ con đường phía trước. Mùi hôi thối nồng nặc khiến ngươi buồn nôn.',
        options: [
            { label: 'Nín thở vượt qua', value: 'cross', icon: 'ph-mask-happy' },
            { label: 'Dùng đan dược giải độc', value: 'medicine', icon: 'ph-pill' },
            { label: 'Quay lại', value: 'back', icon: 'ph-arrow-u-up-left' }
        ],
        resolve: async (choice, player, game) => {
            if (choice === 'cross') {
                const defReq = 3000 + (player.realmId * 100);
                if (player.stats.def > defReq) {
                    return { msg: 'Ngươi dùng linh lực hộ thể thâm hậu, thành công vượt qua chướng khí mà không tốn một sợi lông.' };
                } else {
                    const dmg = 2000 + (player.realmId * 50);
                    player.hp -= dmg;
                    return { msg: `Độc khí xâm nhập kinh mạch! Ngươi bị thương nặng (Mất ${dmg} HP).` };
                }
            } else if (choice === 'medicine') {
                const hasDetox = player.inventory.hasItem('dan_giai_doc', 1);
                if (hasDetox) {
                    player.inventory.removeItem('dan_giai_doc', 1);
                    return { msg: 'Ngươi uống đan dược và bình thản đi qua chướng khí.' };
                } else {
                    player.hp -= 200;
                    return { msg: 'Ngươi không có đan dược, chỉ có thể nín thở vượt qua nhưng vẫn bị nhiễm độc nhẹ.' };
                }
            }
            return null;
        }
    },
    {
        id: 'spirit_beast_summon',
        name: 'Linh Thú Nhận Chủ',
        type: 'interactive',
        image: 'events/rare_herb',
        description: 'Một con Tiểu Hỏa Hồ đang bị mắc kẹt trong bẫy rập linh lực. Nó nhìn ngươi với đôi mắt to tròn đầy vẻ van nài.',
        options: [
            { label: 'Giải cứu và nhận nuôi', value: 'adopt', icon: 'ph-dog' },
            { label: 'Giải cứu rồi thả đi', value: 'free', icon: 'ph-hands-clapping' },
            { label: 'Giết lấy yêu đan', value: 'kill', icon: 'ph-knife' }
        ],
        resolve: async (choice, player, game) => {
            if (choice === 'adopt') {
                if (player.stats.soul > 2000) {
                    player.inventory.addItem('linh_thu_trung', 1);
                    return { msg: 'Linh thú cảm nhận được thiện chí của ngươi, quyết định đi theo phò tá.' };
                } else {
                    return { msg: 'Linh thú cảm thấy thần niệm của ngươi quá yếu, không đủ tư cách làm chủ nhân của nó.' };
                }
            } else if (choice === 'free') {
                player.karma += 20;
                return { msg: 'Ngươi giải cứu nó. Linh thú cúi đầu cảm ơn rồi biến mất vào rừng sâu.' };
            } else if (choice === 'kill') {
                player.karma -= 50;
                player.inventory.addItem('yeu_dan_so', 1);
                return { msg: 'Ngươi lạnh lùng ra tay. Nhận được một viên Yêu Đan Sơ Cấp.' };
            }
            return null;
        }
    },
    {
        id: 'old_friend_meet',
        name: 'Cố Nhân Tương Phùng',
        type: 'interactive',
        image: 'events/old_friend',
        description: 'Ngươi tình cờ gặp lại một vị tu sĩ từng cùng ngươi tu luyện lúc khởi đầu. Hắn bây giờ có vẻ đã khá giả hơn nhiều.',
        options: [
            { label: 'Hàn huyên tâm sự', value: 'talk', icon: 'ph-chat-circle-dots' },
            { label: 'Mượn linh thạch', value: 'borrow', icon: 'ph-coins' }
        ],
        resolve: async (choice, player, game) => {
            if (choice === 'talk') {
                const gain = 1000 + (player.realmId * 100);
                player.addTuVi(gain);
                return { msg: `Những kỷ niệm cũ giúp tâm cảnh ngươi bình hòa. Nhận được ${gain} Tu Vi.` };
            } else if (choice === 'borrow') {
                if (player.karma > 50) { // Good karma required
                    const amount = 2000 + (player.realmId * 200);
                    player.addLingShi(amount);
                    return { msg: `Hắn hào phóng cho ngươi mượn ${amount} Linh Thạch mà không cần hoàn trả vì nể tình xưa.` };
                } else {
                    return { msg: 'Hắn nhìn thấy hắc khí (Karma thấp) trên người ngươi, lạnh lùng từ chối rồi rời đi.' };
                }
            }
            return null;
        }
    },
    {
        id: 'demon_ritual',
        name: 'Ma Đạo Tế Lễ',
        type: 'interactive',
        image: 'events/demon_ritual',
        description: 'Một đám ma tu đang tiến hành nghi lễ hiến tế linh hồn để triệu hoán Ma Thần. Không khí nồng nặc mùi máu.',
        options: [
            { label: 'Ngăn chặn nghi lễ', value: 'stop', icon: 'ph-shield-check' },
            { label: 'Gia nhập hiến tế', value: 'join', icon: 'ph-skull' },
            { label: 'Lẳng lặng rời đi', value: 'leave', icon: 'ph-ghost' }
        ],
        resolve: async (choice, player, game) => {
            if (choice === 'stop') {
                player.karma += 100;
                return { type: 'combat_then_loot', loot: 'linh_thach_thuong', msg: 'Ngươi chính nghĩa lẫm liệt, phá tan ma trận!' };
            } else if (choice === 'join') {
                player.karma -= 300;
                player.stats.atk += 300;
                return { msg: 'Ngươi sa đọa vào ma đạo, hiến tế linh hồn để đổi lấy sức mạnh tà ác.' };
            }
            return null;
        }
    },
    {
        id: 'heavenly_tribulation',
        name: 'Thiên Kiếp Bất Ngờ',
        type: 'interactive',
        image: 'events/heavenly_tribulation',
        description: 'Bầu trời sụp đổ, lôi điện cuồng bạo giáng xuống. Một vị đại năng gần đó đang đột phá, lôi kiếp lan rộng đến tận chỗ ngươi!',
        options: [
            { label: 'Dùng thân kháng lôi', value: 'resist', icon: 'ph-lightning' },
            { label: 'Dùng pháp bảo che chắn', value: 'shield', icon: 'ph-shield' }
        ],
        resolve: async (choice, player, game) => {
            if (choice === 'resist') {
                if (player.stats.def > 5000) {
                    player.stats.def += 200;
                    return { msg: 'Lôi điện rèn luyện nhục thân! Phòng ngự của ngươi tăng mạnh.' };
                } else {
                    player.hp -= 5000;
                    return { msg: 'Ngươi quá tự tin! Thiên lôi suýt chút nữa đánh tan hồn phách của ngươi.' };
                }
            } else if (choice === 'shield') {
                return { msg: 'Ngươi an toàn vượt qua dư ba của lôi kiếp.' };
            }
            return null;
        }
    },
    {
        id: 'med_king_valley',
        name: 'Dược Vương Cốc',
        type: 'interactive',
        image: 'events/med_king_valley',
        description: 'Ngươi lạc bước vào một thung lũng đầy thảo dược. Một lão dược sư đang cần thu thập Linh Thảo để luyện đan.',
        options: [
            { label: 'Đổi Linh Thảo lấy Đan Dược', value: 'trade', icon: 'ph-arrows-left-right' },
            { label: 'Thỉnh giáo y thuật', value: 'learn', icon: 'ph-student' }
        ],
        resolve: async (choice, player, game) => {
            if (choice === 'trade') {
                player.inventory.addItem('dan_duoc_cao', 2);
                return { msg: 'Ngươi trao đổi một số thảo dược và nhận được 2 viên Đan Dược Cao Cấp.' };
            } else if (choice === 'learn') {
                player.stats.soul += 30;
                return { msg: 'Lão dược sư chỉ dạy cho ngươi cách phân biệt các loại linh dược độc hại.' };
            }
            return null;
        }
    },
    {
        id: 'hidden_library',
        name: 'Tàng Kinh Các Phế Tích',
        type: 'interactive',
        image: 'events/hidden_library',
        description: 'Giữa đống đổ nát của một tông môn cổ đại, một tòa tháp vẫn đứng vững. Đây chính là Tàng Kinh Các!',
        options: [
            { label: 'Tìm kiếm công pháp', value: 'search', icon: 'ph-scroll' },
            { label: 'Khôi phục tàn thư', value: 'repair', icon: 'ph-wrench' }
        ],
        resolve: async (choice, player, game) => {
            if (choice === 'search') {
                if (player.luck > 85) {
                    player.inventory.addItem('cong_phap_thien', 1);
                    return { msg: 'Thiên đại kỳ ngộ! Ngươi tìm thấy một bộ Công Pháp Thiên Cấp!' };
                } else {
                    player.inventory.addItem('cong_phap_dia', 1);
                    return { msg: 'Ngươi tìm thấy một bộ Công Pháp Địa Cấp.' };
                }
            }
            return null;
        }
    },
    {
        id: 'death_match_arena',
        name: 'Lôi Đài Sinh Tử',
        type: 'interactive',
        image: 'events/death_match_arena',
        description: 'Tại một hắc điếm, một trận đấu lôi đài đang diễn ra. Kẻ thắng lấy tất cả, kẻ thua mất mạng.',
        options: [
            { label: 'Lên đài khiêu chiến', value: 'fight', icon: 'ph-sword' },
            { label: 'Đặt cược linh thạch', value: 'bet', icon: 'ph-money' }
        ],
        resolve: async (choice, player, game) => {
            if (choice === 'fight') {
                return { type: 'combat_then_loot', loot: 'tien_ngoc', msg: 'Sát khí đằng đằng! Ngươi bước lên lôi đài!' };
            } else if (choice === 'bet') {
                if (Math.random() < 0.5) {
                    player.addLingShi(10000);
                    return { msg: 'Ngươi đặt cược chính xác! Thắng được 10,000 Linh Thạch.' };
                } else {
                    player.lingShi -= 5000;
                    return { msg: 'Ngươi thua sạch tiền cược.' };
                }
            }
            return null;
        }
    },
    {
        id: 'chaos_rift',
        name: 'Hỗn Độn Liệt Ph縫',
        type: 'interactive',
        description: 'Một vết nứt không gian đen ngòm hiện ra, tỏa ra khí tức hỗn độn từ thời sơ khai. Rất nguy hiểm nhưng cũng đầy cám dỗ.',
        options: [
            { label: 'Bước vào vết nứt', value: 'enter', icon: 'ph-portal' },
            { label: 'Quan sát từ xa', value: 'watch', icon: 'ph-eye' }
        ],
        resolve: async (choice, player, game) => {
            if (choice === 'enter') {
                const reqAtk = 50000 + (player.realmId * 1000);
                if (player.stats.atk > reqAtk) {
                    player.inventory.addItem('hon_don_khi', 1);
                    return { msg: 'Thực lực khủng khiếp giúp ngươi áp chế hỗn độn, thu hoạch được một luồng Hỗn Độn Chi Khí!' };
                } else {
                    const dmg = 9999 + (player.realmId * 100);
                    player.hp -= dmg;
                    return { msg: `Không gian loạn lưu xé nát cơ thể ngươi! Ngươi suýt chết bên trong (Mất ${dmg.toLocaleString()} HP).` };
                }
            }
            return null;
        }
    }
];

/**
 * Lấy sự kiện ngẫu nhiên dựa trên xác suất của địa điểm
 * @param {Object} probs { combat, loot, npc, empty }
 */
export const getRandomEvent = (probs) => {
    const total = (probs.combat || 0) + (probs.loot || 0) + (probs.npc || 0) + (probs.empty || 0);
    let rand = Math.random() * total;

    if (rand < probs.combat) {
        const combatEvents = EVENTS.filter(e => e.type === 'combat');
        return combatEvents[Math.floor(Math.random() * combatEvents.length)];
    }
    rand -= probs.combat;

    if (rand < probs.loot) {
        const lootEvents = EVENTS.filter(e => e.type === 'loot' || e.type === 'buff' || e.type === 'interactive');
        return lootEvents[Math.floor(Math.random() * lootEvents.length)];
    }
    rand -= probs.loot;

    if (rand < probs.npc) {
        const npcEvents = EVENTS.filter(e => e.type === 'npc');
        return npcEvents[Math.floor(Math.random() * npcEvents.length)];
    }
    
    // Nếu rơi vào khoảng empty hoặc không có sự kiện nào hợp lệ
    return null;
};
