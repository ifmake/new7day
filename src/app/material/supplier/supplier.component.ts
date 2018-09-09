import { Component, OnInit } from '@angular/core';
import { MaterialCommon } from '../material.common';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html',
  styleUrls: ['./supplier.component.css']
})
export class SupplierComponent extends MaterialCommon implements OnInit {
  dataList: any;
  constructor() {
    super();
    this.dataList = [
      {
        name: '蒙牛牛奶有限公司',
        type: '正规合作',
        address: '重庆江津重百',
        code: 'XSL123132312',
        boss: '刘强东',
        b_phone: '13996161484',
        staff: '张辉',
        s_phone: '139978882772',
        describe: '优势优良',
      }
    ];
    this.searchArray = [
      {key: 'name', index: 0, name: '名称', show: true},
      {key: 'code', index: 1, name: '编码', show: true},
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
