import { Injectable } from '@angular/core';
import { HttpService } from '../../http_service/http.service';
import { api_shop_inventory } from '../../api_url/api_url';

@Injectable({
  providedIn: 'root'
})
export class ShopInventoryService {
    constructor(
        private _httpService: HttpService,
      ) { }

    // 获取店面列表
    getShopInventoryList(keys: Object): any {
        return this._httpService.get(api_shop_inventory.list(), {params: keys});
    }
    // 新增店面
    createShopInventory(body: any): any {
        return this._httpService.post(api_shop_inventory.list(), {body: body});
    }
    // 修改店面
    reviseShopInventory(id: string|number, body: any): any {
        return this._httpService.patch(api_shop_inventory.list(id), {body: body});
    }
    // 查询店面资料
    getShopInventory(id: string | number): any {
        return this._httpService.get(api_shop_inventory.list(id));
    }
    // 删除店面收入
    deleteShopInventory(id: string | number): any {
        return this._httpService.delete(api_shop_inventory.list(id));
    }
}
