import { getItemById } from '../configs/item-data.js';
import { SHOPS } from '../configs/shop-data.js';

export class ShopSystem {
    constructor(player) {
        this.player = player;
        this.currentShopId = 'van_bao_cac';
        this.currentSection = 'dan_duoc';
    }

    getShopInventory() {
        const shop = SHOPS[this.currentShopId];
        if (!shop || !shop.sections) return [];
        
        let items = [];
        const seen = new Set();

        Object.keys(shop.sections).forEach(sec => {
            if (shop.sections[sec]) {
                shop.sections[sec].forEach(item => {
                    if (!seen.has(item.id)) {
                        seen.add(item.id);
                        items.push(item);
                    }
                });
            }
        });
        return items;
    }

    buyItem(itemId, quantity = 1) {
        const itemData = getItemById(itemId);
        if (!itemData) return { success: false, msg: 'Bảo vật không tồn tại!' };

        // Check VIP requirement
        const shopData = SHOPS[this.currentShopId];
        const inv = this.getShopInventory();
        const shopItem = inv.find(i => i.id === itemId);

        if (!shopItem) return { success: false, msg: 'Bảo vật không có sẵn trong nơi này!' };
        
        const playerVip = this.player.vipLevel || 0;
        if (shopItem.minVip && playerVip < shopItem.minVip) {
            return { success: false, msg: `Cần cấp độ khách quý VIP ${shopItem.minVip} để trao đổi bảo vật này!` };
        }

        // Calculate price with VIP discount (5% per level, max 25%)
        const discount = Math.min(0.25, this.player.vipLevel * 0.05);
        const unitPrice = Math.floor(itemData.price * (1 - discount));
        const totalPrice = unitPrice * quantity;

        if (this.player.lingShi < totalPrice) {
            return { success: false, msg: 'Không đủ Linh Thạch!' };
        }

        // Check stock
        if (shopItem.stock < quantity) {
            return { success: false, msg: 'Nguồn hàng đã cạn kiệt!' };
        }

        // Check if we can add item
        const existing = this.player.inventory.allItems.find(i => i.id === itemId);
        if (!existing && this.player.inventory.isFull) {
            return { success: false, msg: 'Túi đồ đã đầy, không thể chứa thêm bảo vật!' };
        }

        // Execute transaction using the new player method
        if (this.player.spendLingShi(totalPrice)) {
            this.player.inventory.addItem(itemId, quantity);
            shopItem.stock -= quantity;
            return { success: true, msg: `Đã trao đổi ${quantity}x ${itemData.name} với giá ưu đãi VIP!` };
        }

        return { success: false, msg: 'Giao dịch thất bại!' };
    }


    sellItem(itemId, quantity = 1) {
        const itemData = getItemById(itemId);
        if (!itemData) return { success: false, msg: 'Bảo vật không tồn tại!' };

        // Check if player has the item
        const playerItem = this.player.inventory.allItems.find(i => i.id === itemId);
        if (!playerItem || playerItem.quantity < quantity) {
            return { success: false, msg: 'Không đủ bảo vật để giao dịch!' };
        }

        // Prevent selling Spirit Stones (currency)
        if (itemData.type === 'spirit_stone') {
            return { success: false, msg: 'Linh Thạch là vật phẩm trao đổi, không thể bán ngược lại cho tiệm!' };
        }

        // Sell price: 30% for materials, 50% for others
        let multiplier = 0.5;
        if (['material', 'herb', 'ore', 'wood'].includes(itemData.type)) multiplier = 0.3;
        
        const sellPrice = Math.floor(itemData.price * multiplier) * quantity;
        
        // Execute transaction
        this.player.inventory.removeItem(itemId, quantity);
        this.player.addLingShi(sellPrice);

        return { success: true, msg: `Đã giao dịch ${quantity}x ${itemData.name}, nhận được ${sellPrice} Linh Thạch!` };
    }
}
