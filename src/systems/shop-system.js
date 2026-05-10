import { getItemById } from '../configs/item-data.js';
import { SHOPS } from '../configs/shop-data.js';

export class ShopSystem {
    constructor(player) {
        this.player = player;
        this.currentShopId = 'nhan_gioi';
        this.currentSection = 'dan_duoc';
    }

    getShopInventory() {
        const shop = SHOPS[this.currentShopId];
        return shop.sections[this.currentSection] || [];
    }

    buyItem(itemId, quantity = 1) {
        const itemData = getItemById(itemId);
        if (!itemData) return { success: false, msg: 'Vật phẩm không tồn tại!' };

        // Check VIP requirement
        const section = SHOPS[this.currentShopId].sections[this.currentSection];
        const shopItem = section.find(i => i.id === itemId);
        
        if (shopItem.minVip && this.player.vipLevel < shopItem.minVip) {
            return { success: false, msg: `Cần cấp độ khách quý VIP ${shopItem.minVip} để mua vật phẩm này!` };
        }

        // Calculate price with VIP discount (5% per level, max 25%)
        const discount = Math.min(0.25, this.player.vipLevel * 0.05);
        const unitPrice = Math.floor(itemData.price * (1 - discount));
        const totalPrice = unitPrice * quantity;

        if (this.player.lingShi < totalPrice) {
            return { success: false, msg: 'Không đủ Linh Thạch!' };
        }

        // Check stock
        if (!shopItem || shopItem.stock < quantity) {
            return { success: false, msg: 'Hết hàng!' };
        }

        // Execute transaction using the new player method
        if (this.player.spendLingShi(totalPrice)) {
            this.player.inventory.addItem(itemId, quantity);
            shopItem.stock -= quantity;
            return { success: true, msg: `Đã mua ${quantity}x ${itemData.name} với giá ưu đãi VIP!` };
        }

        return { success: false, msg: 'Giao dịch thất bại!' };
    }

    sellItem(itemId, quantity = 1) {
        const itemData = getItemById(itemId);
        if (!itemData) return { success: false, msg: 'Vật phẩm không tồn tại!' };

        // Check if player has the item
        const playerItem = this.player.inventory.items.find(i => i.id === itemId);
        if (!playerItem || playerItem.quantity < quantity) {
            return { success: false, msg: 'Không đủ vật phẩm để bán!' };
        }

        // Sell price is usually 50% of buy price
        const sellPrice = Math.floor(itemData.price * 0.5) * quantity;
        
        // Execute transaction
        this.player.inventory.removeItem(itemId, quantity);
        this.player.lingShi += sellPrice;

        return { success: true, msg: `Đã bán ${quantity}x ${itemData.name}, nhận được ${sellPrice} Linh Thạch!` };
    }
}
