import { Component, OnInit } from '@angular/core';
import { StockListService } from 'src/app/common/service/product-service/production-stock.service';
import { StoreCommon } from '../store_common.compoennt';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-store-record',
  templateUrl: './store-record.component.html',
  styleUrls: ['./store-record.component.less']
})
export class StoreRecordComponent extends StoreCommon implements OnInit {
  searchStream = new Subject<any>();
  dataList: any;
  constructor(
    public message: NzMessageService,
    private stockListService: StockListService,
    private router: Router,
  ) {
    super();
    this.searchArray = [
      {key: 'search', index: 0, name: '商品名称', show: true},
      {key: 'operator_account', index: 5, name: '操作人', show: true},
      {key: 'expiration_date', index: 3, name: '过期日期', show: false, isTime: true},
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
     this.listLoading = false;
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
  // 删除订单
  deleteOrder(data) {
    console.log(data);
    this.listLoading = true;
    this.stockListService.deleteOrder(data.order).subscribe(res => {
      console.log(res);
      if (res) {
        this.message.create('success', '删除成功');
        this.searchStream.next();
      } else {
        this.message.create('error', '删除失败');
      }
    });
  }
}
