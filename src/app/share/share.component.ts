import { Injectable } from '@angular/core';

@Injectable()
export class ShareCommon  {
    formTitle: string;
    // 基准数据列表;
    storeList = [];
    supplierList = [];
    userList = [];
    // 表单异步多选控制
    selectLoading: boolean;
    constructor() {
        this.formTitle = '新建';
        this.selectLoading = true;
    }
}

