import { Injectable } from '@angular/core';
import { HttpService } from '../../http_service/http.service';
import { api_shop } from '../../api_url/api_url';

@Injectable({
  providedIn: 'root'
})
export class ShopMaterialService {
    constructor(
        private _httpService: HttpService,
      ) { }

    // 获取店面列表
    getShopMaterialList(keys: Object): any {
        return this._httpService.get(api_shop.list(), {params: keys});
    }
    // 新增店面
    createShopMaterial(body: any): any {
        return this._httpService.post(api_shop.list(), {body: body});
    }
    // 修改店面
    reviseShopMaterial(id: string|number, body: any): any {
        return this._httpService.patch(api_shop.list(id), {body: body});
    }
    // 查询店面资料
    getShopMaterial(id: string | number): any {
        return this._httpService.get(api_shop.list(id));
    }
    // 删除店面
    deleteShop(id: string | number): any {
        return this._httpService.delete(api_shop.list(id));
    }
}
