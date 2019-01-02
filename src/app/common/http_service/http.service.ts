import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, } from '@angular/common/http';
import { Observable, throwError} from 'rxjs';
import { catchError,  tap, delay, debounceTime, retry} from 'rxjs/operators';
import { LocalStorage } from '../storage/local.storage';
import { NzMessageService } from 'ng-zorro-antd';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  headerChnage: any;
  constructor(
    public _http: HttpClient,
    public message: NzMessageService,
    private storage: LocalStorage,
  ) {}
  /**
   * 公用请求
   * @param way 请求方式
   * @param url 请求路径
   * @param option 请求配置
   */
  request(way: string, url: string, option: Object): any {
    return new Observable((Observer) => {
      this.headerChnage = 'JWT ' + JSON.parse(this.storage.get('loginer')).token;
      const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8', 'Authorization': this.headerChnage });
      const options = Object.assign({}, {headers: headers}, option);
      this._http.request(way, url, options).pipe(
        tap(
          event => {console.log(event); },
        ),
        retry(2),
        catchError(this.handleError)
      ).subscribe(
        (data: any) => {
          if (data !== null) {
            Observer.next(data.data || data);
          } else {
            Observer.next('无内容');
            this.message.create('warning', '无返回内容');
          }
          Observer.complete();
        },
        error => {
          if (error) {
            console.log(error);
            // Object.assign(error, {error: true});
            Observer.next(error);
            Observer.complete();
          }
        },
      );
    });
  }
  /**
   * get 请求
   * @param url 请求地址
   * @param options 请求配置（可选）
   */
  get(url: string, options?: Object): any {
    return this.request('get', url, Object.assign({
      method: 'get'
    }, options));
  }
  /**
   * post 请求
   * @param url 请求地址
   * @param options 请求参数
   */
  post(url: string, options: Object = {}): any {
    return this.request('post', url, {
      body: JSON.stringify(typeof options['body'] === 'object' ? options['body'] : {})
    });
  }
  /**
   * put 请求
   * @param url 请求地址
   * @param opts 请求参数
   */
  patch(url: string, opts?: Object): any {
    return this.request('patch', url, Object.assign({}, opts, {
      body: JSON.stringify(typeof opts['body'] === 'object' ? opts['body'] : {})
    }));
  }
    /**
   * put 请求
   * @param url 请求地址
   * @param opts 请求参数
   */
  put(url: string, opts: Object = {}): any {
    return this.request('put', url, Object.assign({}, opts, {
      body: JSON.stringify(typeof opts['body'] === 'object' ? opts['body'] : {})
    }));
  }
  /**
   * delete 请求
   * @param url 请求地址
   * @param opts 请求参数（可选）
   */
  delete(url: string, opts?: Object): any {
    return this.request('delete', url, Object.assign({
      method: 'delete'
    }, opts));
  }

  /**
   * 错误处理
   */
  private handleError(error: HttpErrorResponse) {
    console.log(error);
    if (error.status === 401) {
      alert('用户登录过期，请重新登录');
    }
    if (error.error instanceof ErrorEvent) {
      return throwError(error.error);
    } else {
      return throwError(error);
    }
  }
}
