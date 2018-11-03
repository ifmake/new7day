import { Component, OnInit } from '@angular/core';
import { StockListService } from 'src/app/common/service/product-service/production-stock.service';
import { StoreCommon } from '../store_common.compoennt';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'app-store-record',
  templateUrl: './store-record.component.html',
  styleUrls: ['./store-record.component.less']
})
export class StoreRecordComponent extends StoreCommon implements OnInit {
  searchStream = new Subject<any>();
  dataList: any;
  constructor(
    private stockListService: StockListService,
    private router: Router,
  ) {
    super();
    this.searchArray = [
      {key: 'goods_name', index: 0, name: '商品名称', show: true},
      // {key: 'store', index: 4, name: '所属仓库', show: true},
      // {key: 'type', index: 4, name: '类型', show: true},
      {key: 'data.operator_account', index: 5, name: '操作人', show: true},
      {key: 'effect_datfrom', index: 3, name: '进货时间起', show: false, isTime: true},
      {key: 'effect_dateto', index: 4, name: '进货时间止', show: false, isTime: true}
    ];
    // 列表查询
    this.searchStream.pipe(switchMap(() => {
      return this.stockListService.getRecordList(this.searchObj);
    })).subscribe(res => {
      this.listLoading = false;
      this.dataList = res;
      console.log(res);
    });
  }

  ngOnInit() {
    this.searchStream.next();
  }
  // 数据查询
  searchData(serachObj) {
    Object.assign(this.searchObj, serachObj);
    this.searchStream.next();
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
  // 库存查询
  searchStock() {
    // this.router.navigate(['/store/search']);
  }
}
