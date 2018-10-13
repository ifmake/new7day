import { Injectable } from '@angular/core';
import { ShareCommon } from '../share/share.component';

@Injectable()
export class StoreCommon extends ShareCommon {
  // 列表数据加载
    searchArray = [];
      // 操作类型
   operate_type: any;
  // 侧屏弹窗组件控制
    OpenDraw: boolean;
    OpenDrawList: boolean;
    drawerTitle = '商品库存信息';
    drawerListTitle: string;
    drawerMaskClose: boolean;
  // model 弹窗
  ModelVisible: boolean;
  ModelTitle: string;
  constructor() {
    super();
    this.drawerMaskClose = true;
    this.operate_type = {
      import: 'import',
      export: 'export'
     };
  }
  // 关闭弹窗
  closeDraw(data) {
    this.OpenDraw = false;
  }
  closeChildDraw(data) {
    this.OpenDrawList = false;
  }
  modelCancel() {
    this.ModelVisible = false;
  }

}
