import { Component, OnInit } from '@angular/core';
import { MaterialCommon } from '../material.common';

@Component({
  selector: 'app-staff',
  templateUrl: './staff.component.html',
  styleUrls: ['./staff.component.css']
})
export class StaffComponent extends MaterialCommon implements OnInit {
  dataList: any;
  constructor() {
    super();
    this.dataList = [
      {
        name: '张三',
        code: '1',
        age: '26',
        sex: '男',
        address: '重庆江津',
        money: '3000元/月',
      }
    ];
    this.searchArray = [
      {key: 'name', index: 0, name: '姓名', show: true},
      {key: 'code', index: 1, name: '员工编号', show: true},

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
