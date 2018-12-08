import { Component, OnInit, ViewChild } from '@angular/core';
import * as echarts from 'echarts';
import { graphic } from 'echarts';
import { reduce, switchMap } from 'rxjs/operators';
import { ShareCommon } from 'src/app/share/share.component';
import { StockCostService } from 'src/app/common/service/product-service/product-cost.service';
import { Subject } from 'rxjs';
import { LocalStorage } from 'src/app/common/storage/local.storage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-store-cost',
  templateUrl: './store-cost.component.html',
  styleUrls: ['./store-cost.component.less']
})
export class StoreCostComponent extends ShareCommon implements OnInit {
  costTypes: any;
  isSplin = false;
  selectedIndex = 0;

  constructor(

    private storage: LocalStorage,
    private router: Router,
  ) {
    super();
  }
  ngOnInit() {
    const userInfo = JSON.parse(this.storage.get('loginer'));
    if (userInfo.profile.role === 'boss') {
      this.costTypes = [
        {name: '仓库成本走势', type: 'all_cost', index: 0, link: '/store/cost/depot_final'},
        {name: '商品成本', type: 'product_cost', index: 1, link: '/store/cost/product_final'},
        {name: '店面成本', type: 'product_cost', index: 2, link: '/store/cost/shop_final'},
      ];
    } else {
      this.selectedIndex = 1;
      this.searchStream.next();
      this.costTypes = [
        {name: '商品成本', type: 'product_cost', index: 1},
      ];
    }
    this.router.navigate([this.costTypes[0].link]);
  }
  // 切换类型
  changeStore(store) {
    this.router.navigate([this.costTypes[store.index].link]);
    this.selectedIndex = store.index;
  }
}
