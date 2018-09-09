import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    public _http: HttpClient,
  ) { }


  /**
   * 公用请求
   * @param way 请求方式
   * @param url 请求路径
   * @param option 请求配置
   */
  request(way: string, url: string, option: Object) {
    return new Observable((Observer) => {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json; charset=utf-8'});
      const options = Object.assign({}, {headers: headers}, option);
      this._http.request(way, url, options).pipe(
        tap(
          event => {console.log(event); },
        ),
        retry(1),
        catchError(this.handleError)
      ).subscribe(
        (data: any) => {
          console.log(data);
        },
        error => {
          console.log(error);
        },
      );
    });
  }
  /**
   * get 请求
   * @param url 请求地址
   * @param options 请求配置（可选）
   */
  get(url: string, options?: Object) {
    return this.request('get', url, Object.assign({
      method: 'get'
    }, options));
  }
  /**
   * post 请求
   * @param url 请求地址
   * @param options 请求参数
   */
  post(url: string, options: Object = {}) {
    return this.request('post', url, {
      body: JSON.stringify(typeof options['body'] === 'object' ? options['body'] : {})
    });
  }
  /**
   * put 请求
   * @param url 请求地址
   * @param opts 请求参数
   */
  put(url: string, opts: Object = {}) {
    return this.request('put', url, Object.assign({}, opts, {
      body: JSON.stringify(typeof opts['body'] === 'object' ? opts['body'] : {})
    }));
  }
  /**
   * delete 请求
   * @param url 请求地址
   * @param opts 请求参数（可选）
   */
  delete(url: string, opts?: Object) {
    return this.request('delete', url, Object.assign({
      method: 'delete'
    }, opts));
  }


  /**
   * 错误处理
   */
  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('错误产生于', error.error.message);
    } else {
      console.error(`请求状态 ${error.status}, 请求体报错: ${error.error}`);
    }
    return throwError('重新请求');
  }
}
