import { Injectable } from '@angular/core';
import { ShareCommon } from '../share/share.component';

@Injectable()
export class MaterialCommon extends ShareCommon {
  // 列表数据加载
    listLoading: boolean;
    searchArray = [];
    searchObj: any;
    OpenDraw: boolean;
  constructor() {
    super();
    this.listLoading = true;
    this.searchObj = {
      page: 1,
      page_size: 10,
    };
  }

}
