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
    // 商品进货
    stockAndSend(body: any): any {
        return this._httpService.post(api_productIX.stockAndSend(), {body: body});
    }
    // 查看单件商品记录
    getDetail(keys: any): any {
       return this._httpService.get(api_productIX.goodsrecord(), {params: keys});
    }
    // 订单列表
    getRecordList(keys: any): any {
        return this._httpService.get(api_productIX.recordsList(), {params: keys});
    }
    // 删除订单
    deleteOrder (order: number): any {
        return this._httpService.delete(api_productIX.deleteOrder(order));
    }
}
