import { Injectable } from '@angular/core';
import { HttpService } from '../http_service/http.service';
import { api_product } from '../api_url/api_url';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private _httpService: HttpService,
  ) { }
  // 获取商品列表
  getProductList(keys: any) {
    return this._httpService.get(api_product.list(), {params: keys});
  }
  // 查询商品详情
  getProductDetail(id: string | number): any {
    return this._httpService.get(api_product.detail(id));
  }
  // 新增商品
  createProduct(body: any): any {
    return this._httpService.post(api_product.create(), {body: body});
  }
  // 删除商品
  deleteProduct(id: string | number) {
    return this._httpService.delete(api_product.detail(id));
  }
  // 修改商品
  reviseProduct(id: string | number, body: any): any {
    return this._httpService.patch(api_product.detail(id), {body: body});
  }
}
