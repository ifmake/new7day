import { Component, OnInit } from '@angular/core';
import { MaterialCommon } from '../material.common';

@Component({
  selector: 'app-store',
  templateUrl: './store.component.html',
  styleUrls: ['./store.component.css']
})
export class StoreComponent extends MaterialCommon implements OnInit {
  dataList: any;
  constructor() {
    super();
    this.dataList = [
      {
        name: '总仓库',
        type: 'master',
        manager: 'master',
        volume: '30',
        descripe: 'asdfasdfasd'
      }
    ];
    this.searchArray = [
      {key: 'name', index: 0, name: '仓库名称', show: true},
      {key: 'code', index: 1, name: '仓库类型', show: true},
    ];
   }

  ngOnInit() {
  }

   // 数据查询
  searchData(serachObj) {
    console.log(serachObj);
  }
  // 新增
  add() {
    this.OpenDraw = true;
  }
  // 确认添加
  dataBack(msg) {
    this.OpenDraw = false;
  }

}
