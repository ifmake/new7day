import { Injectable } from '@angular/core';
import { HttpService } from '../../http_service/http.service';
import { api_lose } from '../../api_url/api_url';

@Injectable({
  providedIn: 'root'
})
export class StockLoseService {
    constructor(
        private _httpService: HttpService,
      ) { }

    // 获取报损列表
    getLoseList(keys: Object): any {
        return this._httpService.get(api_lose.list(), {params: keys});
    }
    // 新增报损
    createLose(body: any): any {
        return this._httpService.post(api_lose.list(), {body: body});
    }
    // 查询报损详情
    getLoseDetail(id: string | number): any {
        return this._httpService.get(api_lose.list(id));
    }
}
