import { Injectable } from '@angular/core';
import { HttpService } from '../http_service/http.service';
import { login_api } from '../api_url/api_url';


@Injectable()
export class LoginService {
  constructor(
    private _httpService: HttpService
  ) {}
  /**
   * 登录用户
   * @param body 登录用户账号密码
   */
  loginUser(body: any): any {
      return this._httpService.post(login_api.login(), {body: body});
  }
}
