import { Component, OnInit } from '@angular/core';
import { ShareCommon } from 'src/app/share/share.component';
import { switchMap } from 'rxjs/operators';
import { StockCostService } from 'src/app/common/service/product-service/product-cost.service';

@Component({
  selector: 'app-product-final',
  templateUrl: './product-final.component.html',
  styleUrls: ['./product-final.component.less']
})
export class ProductFinalComponent extends ShareCommon implements OnInit {
  // 商品成本
  currentMonth: string;
  searchArray: any;
  dataList: any;
  constructor(
    private costService: StockCostService,
  ) {
    super();
    this.currentMonth = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-01';
    this.searchArray  = [
      {key: 'search', index: 0, name: '商品名称', show: true},
      {key: 'shop', index: 1, name: '出货店面', show: true, isSelect: true, selectArr: [
        {value: 3, label: '迷你店'},
        {value: 5, label: '重百店'},
        {value: 6, label: '奎星店'},
        {value: 7, label: '白沙店'},
        {value: 8, label: '德感店'},
      ]},
      {key: 'start_time', value: this.currentMonth, index: 0, name: '核算时间起', show: true, isTime: true, },
      {key: 'end_time', index: 0, name: '核算时间止', show: true, isTime: true, value: new Date()},
    ];
    this.searchObj.start_time = this.currentMonth;
     // 商品成本
     this.searchStream.pipe(switchMap(() => {
      return this.costService.getCostList(this.searchObj);
    })).subscribe(res => {
      this.listLoading = false;
      this.dataList = res;
    });
  }

  ngOnInit() {
    this.searchStream.next();
  }

  /**
   * 商品成本
   */
    // 数据查询
    searchData(keys) {
      console.log(new Date(keys.start_time).getFullYear());
      for (const key in keys) {
        if (key) {
          if (key.indexOf('time') !== -1) {
            if (keys[key]) {
            this.searchObj[key] =
            new Date(keys[key]).getFullYear() + '-' + (new Date(keys[key]).getMonth() + 1) + '-' + new Date(keys[key]).getDate();
            } else {
              this.searchObj[key] = '';
            }
          } else {
            this.searchObj[key] = keys[key];
          }
        }
      }
      this.searchStream.next();
    }
    // 分页查询
    changPageIndex(page) {
      this.searchObj.page = page;
      this.searchStream.next();
    }
    PageSizeChange(size) {
      this.searchObj.page_size = size;
      this.searchStream.next();
    }

}
