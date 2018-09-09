import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MaterialCommon } from '../material.common';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent extends MaterialCommon implements OnInit {
  dataList: any;
  dateFormat = 'yyyy/MM/dd';
  constructor() {
    super();
    this.dataList = [
      {
        name: '奶精',
        code: '3212asudhflkasdjfjl.ka',
        image: '----',
        in_price: '30',
        sale_price: '50asjdflk阿斯顿发送到发；爱丽丝的看法；拉屎开的发票发的按时发生的法律思考对方',
        store: '100',
        company: '新七天123',
        size: '0990',
        describe: '优势优良',
        active: '有效'
      }
    ];
    this.searchArray = [
      {key: 'name', index: 0, name: '名称', show: true},
      {key: 'code', index: 1, name: '编码', show: true},
      {key: 'size', index: 2, name: '规格', show: true},
      {key: 'effect_datfrom', index: 3, name: '进货时间起', show: false, isTime: true},
      {key: 'effect_dateto', index: 4, name: '进货时间止', show: false, isTime: true}
    ];
  }

  ngOnInit() {}
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

