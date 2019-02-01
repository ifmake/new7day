import { Injectable } from '@angular/core';
import { HttpService } from '../../http_service/http.service';
import { api_shop_income } from '../../api_url/api_url';

@Injectable({
  providedIn: 'root'
})
export class ShopIncomeService {
    constructor(
        private _httpService: HttpService,
      ) { }

    // 获取店面列表
    getShopIncomeList(keys: Object): any {
        return this._httpService.get(api_shop_income.list(), {params: keys});
    }
    // 新增店面
    createShopIncome(body: any): any {
        return this._httpService.post(api_shop_income.list(), {body: body});
    }
    // 修改店面
    reviseShopIncome(id: string|number, body: any): any {
        return this._httpService.patch(api_shop_income.list(id), {body: body});
    }
    // 查询店面资料
    getShopIncome(id: string | number): any {
        return this._httpService.get(api_shop_income.list(id));
    }
    // 删除店面收入
    deleteShop(id: string | number): any {
        return this._httpService.delete(api_shop_income.list(id));
    }
    // 导出店面上月统计数据
    shopMonthExport(keys: Object): any {
        return this._httpService.get(api_shop_income.download(), {params: keys, responseType: 'blob' });
    }
}
