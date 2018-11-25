import { Injectable } from '@angular/core';
import { HttpService } from '../http_service/http.service';
import { api_account } from '../api_url/api_url';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(
    private _httpService: HttpService,
  ) { }
  // 获取商品列表
  getAccountList(keys: any): any {
    return this._httpService.get(api_account.list(), {params: keys});
  }
  // 查询商品详情
  getAccountDetail(id: string | number): any {
    return this._httpService.get(api_account.detail(id));
  }
  // 新增商品
  createAccount(body: any): any {
    return this._httpService.post(api_account.create(), {body: body});
  }
  // 删除商品
  deleteAccount(id: string | number) {
    return this._httpService.delete(api_account.detail(id));
  }
  // 修改商品
  reviseAccount(id: string | number, body: any): any {
    return this._httpService.patch(api_account.detail(id), {body: body});
  }
  // 修改密码
 changePassword(body: any): any {
    return this._httpService.post(api_account.changePass(), {body: body});
 }
}
