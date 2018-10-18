import { Component, OnInit } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { StoreCommon } from '../store_common.compoennt';

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
  constructor() {
    super();
    this.listLoading = false;
    this.dataList = [
      {
        name: '奶精',
        code: 'XS187329772',
        image: '----',
        store: '100',
        storage: '总仓库',
        maker: '张三',
        in_price: '30',
        sale_price: '50as',
        company: '新七天123',
        size: '0990',
        describe: '优势优良',
        status: '库存正常',
      }, {
        name: '杯子',
        code: 'XS18732s232',
        image: '----',
        store: '10',
        storage: '总仓库',
        maker: '张三',
        in_price: '30',
        sale_price: '50as',
        company: '新七天123',
        size: '0990',
        describe: '优势优良',
        status: '缺货',
      }
    ];
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
  }

  // 数据过滤
  searchData(term) {}
  // 查看详情
  lookDetail() {
  }
  // 数据分页
  changPageIndex(page) {
    console.log(page);
  }
  PageSizeChange(pageSize) {
    console.log(pageSize);
  }

}
