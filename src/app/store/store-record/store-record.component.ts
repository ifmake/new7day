import { Component, OnInit} from '@angular/core';
import { StockListService } from 'src/app/common/service/product-service/production-stock.service';
import { StoreCommon } from '../store_common.compoennt';
import { Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-store-record',
  templateUrl: './store-record.component.html',
  styleUrls: ['./store-record.component.less'],
  providers: [DatePipe]
})
export class StoreRecordComponent extends StoreCommon implements OnInit {
  searchStream = new Subject<any>();
  dataList: any;
  constructor(
    public message: NzMessageService,
    private stockListService: StockListService,
    private router: Router,
    private datePipe: DatePipe,
  ) {
    super();
    this.searchArray = [
      {key: 'search', index: 0, name: '商品名称', show: true},
      {key: 'shop', index: 5, name: '出货店面', show: true, isSelect: true, selectArr: [
        {value: 3, label: '迷你店'},
        {value: 5, label: '重百店'},
        {value: 6, label: '奎星店'},
        {value: 7, label: '白沙店'},
        {value: 8, label: '德感店'},
      ]},
      {key: 'start_time', index: 3, name: '操作日期起', show: false, isTime: true},
      {key: 'end_time', index: 3, name: '操作日期止', show: false, isTime: true},
      {key: 'operator_account', index: 5, name: '操作人', show: true},
      {key: 'expiration_date', index: 3, name: '商品过期日', show: false, isTime: true},
    ];
    // 列表查询
    this.searchStream.pipe(switchMap(() => {
      return this.stockListService.getRecordList(this.searchObj);
    })).subscribe(res => {
      if (!res['error']) {
        this.listLoading = false;
        this.dataList = res;
      } else {
        this.message.create('error', '查询出错');
        this.listLoading = false;
      }
      console.log(res);
    });
  }

  ngOnInit() {
    this.searchStream.next();
  }
  // 数据查询
  searchData(serachObj) {
    this.listLoading = false;
    if (serachObj.expiration_date) {
      serachObj.expiration_date = this.datePipe.transform(serachObj.expiration_date, 'yyyy-MM-dd');
    }
    if (serachObj.start_time) {
      serachObj.start_time = this.datePipe.transform(serachObj.start_time, 'yyyy-MM-dd');
    }
    if (serachObj.end_time) {
      serachObj.end_time = this.datePipe.transform(serachObj.end_time, 'yyyy-MM-dd');
    }
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
      if (!res.error) {
        this.message.create('success', '删除成功');
      } else {
        this.message.create('error', res.error.error + '查询是否为第一条数据');
      }
      this.searchStream.next();
    });
  }
  // 生成订单状态
  orderStatus(time, count) {
    const nowTime = new Date().getTime();
    const expirationDate = new Date(time).getTime();
    if (time) {
      if (nowTime > expirationDate) {
        return '货物已过期';
      } else if (expirationDate < nowTime + 10 * 24 * 60 * 60 * 1000) {
        return '即将过期';
      } else {
        return '正常';
      }
    } else {
      return '----';
    }
  }
}
