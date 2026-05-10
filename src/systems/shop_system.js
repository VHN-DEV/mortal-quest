import { getItemById } from '../configs/items.js';
import { SHOPS } from '../configs/shop.js';

export class ShopSystem {
    constructor(player) {
        this.player = player;
        this.currentShopId = 'nhan_gioi';
    }

    getShopInventory() {
        return SHOPS[this.currentShopId].inventory;
    }

    buyItem(itemId, quantity = 1) {
        const itemData = getItemById(itemId);
        if (!itemData) return { success: false, msg: 'Vật phẩm không tồn tại!' };

        const totalPrice = itemData.price * quantity;
        if (this.player.lingShi < totalPrice) {
            return { success: false, msg: 'Không đủ Linh Thạch!' };
        }

        // Check stock
        const shopItem = SHOPS[this.currentShopId].inventory.find(i => i.id === itemId);
        if (!shopItem || shopItem.stock < quantity) {
            return { success: false, msg: 'Hết hàng!' };
        }

        // Execute transaction
        this.player.lingShi -= totalPrice;
        this.player.inventory.addItem(itemId, quantity);
        shopItem.stock -= quantity;

        return { success: true, msg: `Đã mua ${quantity}x ${itemData.name}!` };
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
