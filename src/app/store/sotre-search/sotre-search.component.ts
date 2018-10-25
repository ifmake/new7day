import { Component, OnInit } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { StoreCommon } from '../store_common.compoennt';
import { StockListService } from '../../common/service/product-service/production-service.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-sotre-search',
  templateUrl: './sotre-search.component.html',
  styleUrls: ['./sotre-search.component.css']
})
export class SotreSearchComponent extends StoreCommon implements OnInit {
  searchStream = new Subject<any>();
  ObserverList: Observable<any>;
  dataList: any;
  searchArray: any = [];
  constructor(
    private stockList: StockListService
  ) {
    super();
    this.searchStream.pipe(switchMap(() => {
      return this.stockList.getStockList(this.searchObj);
    })).subscribe(res => {
      this.listLoading = false;
      this.dataList = res;
    });

    this.searchArray = [
      {key: 'name', index: 0, name: '名称', show: true},
      {key: 'stock', index: 3, name: '库存', show: true},
      {key: 'store', index: 4, name: '所属仓库', show: true},
      {key: 'maker', index: 5, name: '操作人', show: true},
      {key: 'status', index: 5, name: '库存状态', show: true},
      // {key: 'effect_datfrom', index: 3, name: '进货时间起', show: false, isTime: true},
      // {key: 'effect_dateto', index: 4, name: '进货时间止', show: false, isTime: true}
    ];
  }

  ngOnInit() {
    this.searchStream.next();
  }

  // 数据过滤
  searchData(serachObj) {
    Object.assign(this.searchObj, serachObj);
    this.searchStream.next();
  }
  // 查看详情
  lookDetail() {
  }
  // 数据分页
  changPageIndex(page) {
    this.searchObj.page = page;
    this.searchStream.next();
  }
  PageSizeChange(pageSize) {
    this.searchObj.page_size = pageSize;
    this.searchStream.next();
  }

}
