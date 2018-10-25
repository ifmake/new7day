import { Injectable } from '@angular/core';
import { HttpService } from '../../http_service/http.service';
import { api_productIX } from '../../api_url/api_url';

@Injectable({
  providedIn: 'root'
})
export class StockListService {
    constructor(
        private _httpService: HttpService,
      ) { }
    // 获取库存列表
    getStockList(keys: any): any {
        return this._httpService.get(api_productIX.list(), {params: keys});
    }
}
