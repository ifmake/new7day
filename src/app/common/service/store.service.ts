import { Injectable } from '@angular/core';
import { HttpService } from '../http_service/http.service';
import { api_store } from '../api_url/api_url';

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(
    private _httpService: HttpService,
  ) { }
  // 获取商品列表
  getStoreList(keys: any): any {
    return this._httpService.get(api_store.list(), {params: keys});
  }
  // 查询商品详情
  getStoreDetail(id: string | number): any {
    return this._httpService.get(api_store.detail(id));
  }
  // 新增商品
  createStore(body: any): any {
    return this._httpService.post(api_store.create(), {body: body});
  }
  // 删除商品
  deleteStore(id: string | number) {
    return this._httpService.delete(api_store.detail(id));
  }
  // 修改商品
  reviseStore(id: string | number, body: any): any {
    return this._httpService.patch(api_store.detail(id), {body: body});
  }
}
