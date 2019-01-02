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
  searchArray = [
    {key: 'search', index: 0, name: '商品名称', show: true},
    {key: 'start_time', index: 0, name: '核算时间起', show: true, isTime: true, },
    {key: 'end_time', index: 0, name: '核算时间止', show: true, isTime: true, value: new Date()},
  ];
  dataList: any;
  constructor(
    private costService: StockCostService,
  ) {
    super();
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
