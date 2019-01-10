import { Component, OnInit } from '@angular/core';
import { ShareCommon } from 'src/app/share/share.component';
import { LocalStorage } from 'src/app/common/storage/local.storage';

@Component({
  selector: 'app-shop-income',
  templateUrl: './shop-income.component.html',
  styleUrls: ['./shop-income.component.less']
})
export class ShopIncomeComponent extends ShareCommon implements OnInit {
  tabs: any;
  currentIndex: number;
  constructor(
    private storage: LocalStorage,
  ) {
    super();
    const userInfo = JSON.parse(this.storage.get('loginer'));
    if (userInfo.profile.role === 'boss') {
      this.tabs = [
        {
          active: false,
          name  : '店面月季库存盘点',
        },
        {
          active: true,
          name  : '店面收入单',
        },
        {
          active: false,
          name  : '店面收入统计表',
        },
      ];
    } else if (userInfo.profile.role === 'super_admin') {
      this.tabs = [
        {
          active: false,
          name  : '店面月季库存盘点',
        },
      ];
    }
    this.currentIndex = 0;
   }

  ngOnInit() {}

  // 选中tab
  selectTab(currentab) {
    this.currentIndex = currentab.index;
  }

}
