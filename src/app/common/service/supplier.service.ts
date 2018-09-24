import { Injectable } from '@angular/core';
import { HttpService } from '../http_service/http.service';
import { api_supplier } from '../api_url/api_url';

@Injectable({
  providedIn: 'root'
})
export class SupplierService {

  constructor(
    private _httpService: HttpService,
  ) { }
  // 获取商品列表
  getSupplierList(keys: any): any {
    return this._httpService.get(api_supplier.list(), {params: keys});
  }
  // 查询商品详情
  getSupplierDetail(id: string | number): any {
    return this._httpService.get(api_supplier.detail(id));
  }
  // 新增商品
  createSupplier(body: any): any {
    return this._httpService.post(api_supplier.create(), {body: body});
  }
  // 删除商品
  deleteSupplier(id: string | number) {
    return this._httpService.delete(api_supplier.detail(id));
  }
  // 修改商品
  reviseSupplier(id: string | number, body: any): any {
    return this._httpService.patch(api_supplier.detail(id), {body: body});
  }
}
