import { Injectable } from '@angular/core';
import { HttpService } from '../../http_service/http.service';
import { api_cost } from '../../api_url/api_url';

@Injectable({
  providedIn: 'root'
})
export class StockCostService {
    constructor(
        private _httpService: HttpService,
      ) { }
    // 获取库存列表
    getCostList(keys: any): any {
        return this._httpService.get(api_cost.list(), {params: keys});
    }
    // 成本月度核算
    getMonthAdjust(keys: any): any {
        return this._httpService.get(api_cost.monthAdjust(), {params: keys});
    }
}
