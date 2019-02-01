import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class ShareCommon  {
    searchStream = new Subject<any>();
    formTitle: string;
    // 基准数据列表;
    storeList = [];
    supplierList = [];
    productList = [];
    userList = [];
    shopList = [];
    listLoading: boolean;
    // 查询参数
    searchObj: any;
    // 表单异步多选控制
    selectLoading: boolean;
    // 日期配置
    yearDate: 'yyyy-MM-dd';
    searchArray = [];
    constructor() {
        this.formTitle = '新建';
        this.selectLoading = true;
        this.listLoading = true;
        this.searchObj = {
            page: 1,
            page_size: 10,
          };
    }
}

