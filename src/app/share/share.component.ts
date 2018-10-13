import { Injectable } from '@angular/core';

@Injectable()
export class ShareCommon  {
    formTitle: string;
    // 基准数据列表;
    storeList = [];
    supplierList = [];
    userList = [];
    listLoading: boolean;
    // 查询参数
    searchObj: any;
    // 表单异步多选控制
    selectLoading: boolean;
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

