import { Component, OnInit } from '@angular/core';
import { ShareCommon } from 'src/app/share/share.component';

@Component({
  selector: 'app-shop-income',
  templateUrl: './shop-income.component.html',
  styleUrls: ['./shop-income.component.less']
})
export class ShopIncomeComponent extends ShareCommon implements OnInit {
  tabs: any;
  currentIndex: number;
  constructor() {
    super();
    this.tabs = [
      {
        active: true,
        name  : '店面收入单',
      },
      {
        active: false,
        name  : '店面月季库存盘点',
      },
      {
        active: false,
        name  : '店面收入统计表',
      },
    ];
    this.currentIndex = 0;
   }

  ngOnInit() {}

  // 选中tab
  selectTab(currentab) {
    this.currentIndex = currentab.index;
  }

}
