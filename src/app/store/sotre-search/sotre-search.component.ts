import { Component, OnInit } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { StoreCommon } from '../store_common.compoennt';
import { StockListService } from '../../common/service/product-service/production-stock.service';
import { switchMap } from 'rxjs/operators';
import { NzMessageService } from 'ng-zorro-antd';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-sotre-search',
  templateUrl: './sotre-search.component.html',
  styleUrls: ['./sotre-search.component.css']
})
export class SotreSearchComponent extends StoreCommon implements OnInit {
  searchStream = new Subject<any>();
  ObserverList: Observable<any>;
  dataList: any;
  displayData: any = [];
  searchArray: any = [];
  allChecked: boolean;
  indeterminate: boolean;
  // 进货组件
  ModelVisible: boolean;
  ModelTitle = '进货管理';
  recordType: string;
  recordArr = [];
  // 商品详情组件
  ProStockArr: any;
  getGoodsRecord: any;
  importOrderArr = [];
  exportOrderArr = [];
  currentObj: any;
  constructor(
    private stockList: StockListService,
    public message: NzMessageService,
    private router: Router,
  ) {
    super();
    this.ProStockArr = [
      {name: '操作人', content: '', type: 'string'},
      {name: '最近进货时间', content: '', type: 'time'},
      {name: '最近出货时间', content: '', type: 'time'},
    ];
    this.currentObj = {
      id: '',
    };
    this.searchObj.depot = 1;
    this.searchStream.pipe(switchMap(() => {
      return this.stockList.getStockList(this.searchObj);
    })).subscribe(res => {
      this.listLoading = false;
      this.dataList = res;
    });

    this.searchArray = [
      {key: 'search', index: 0, name: '名称', show: true},
      {key: 'last_operator_name', index: 5, name: '操作人', show: true},
      {key: 'stock_status', index: 5, name: '库存状态', show: true},
      // {key: 'effect_datfrom', index: 3, name: '进货时间起', show: false, isTime: true},
      // {key: 'effect_dateto', index: 4, name: '进货时间止', show: false, isTime: true}
    ];
  }

  ngOnInit() {
    this.searchStream.next();
    this.router.events.subscribe(res => {
      if (res instanceof NavigationStart) {
        this.searchStream.next();
      }
    });
  }

  // 数据过滤
  searchData(serachObj) {
    Object.assign(this.searchObj, serachObj);
    this.searchStream.next();
  }
  // 选中商品
  // 刷新状态
  refreshStatus(): void {
    const allChecked = this.displayData.every(value => value.is_book === true);
    const allUnChecked = this.displayData.every(value => !value.is_book);
    this.allChecked = allChecked;
    this.indeterminate = (!allChecked) && (!allUnChecked);
  }
  // 选中所有
  checkAll(prods) {
    this.displayData.forEach(data => data.is_book = prods);
    this.refreshStatus();
  }
  currentPageDataChange(datas) {
    this.displayData = datas;
  }
  // 查看详情
  lookDetail(prod) {
    this.OpenDraw = true;
    this.drawerTitle = prod.name;
    this.exportOrderArr = [];
    this.importOrderArr = [];
    this.getGoodsRecord = {
      goods_id: prod.id,
      page: 1,
      page_size: 10,
    };
    this.currentObj.id = prod.id;
    this.stockList.getDetail(this.getGoodsRecord).subscribe(res => {
      if (!res.error) {
        if (res['results'].length > 0 ) {
        this.ProStockArr[0].content = res['results'][0].operator_account || '';
        this.ProStockArr[1].content = res['results'][0].record_time;
        this.ProStockArr[2].content = res['results'][0].record_time;
        if (res['results'].length > 0) {
          for (let i = 0; i < res['results'].length; i++) {
            if (res['results'][i].record_type === 'depot_out') {
              this.exportOrderArr.push(res['results'][i]);
            } else {
              this.importOrderArr.push(res['results'][i]);
            }
          }
          if (this.exportOrderArr.length > 4) {
            this.exportOrderArr = this.exportOrderArr.splice(0, 4);
          }
          if (this.importOrderArr.length > 4) {
            this.importOrderArr = this.importOrderArr.splice(0, 4);
          }
        }
      }
      }
    });
  }
  // 记录单
  lookMoreRecord(type) {
    this.OpenDrawList = true;
    this.recordType = type;
    if (type === 'import') {
      this.drawerListTitle = '进货历史记录';
    } else {
      this.drawerListTitle = '发货历史记录';
    }
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
  /**
   * 进出货流程
   */
  modelCancel() {
    this.ModelVisible = false;
  }
  // 进出货
  cancelProduct(prod, type) {
    this.ModelVisible = true;
    this.recordType = type;
    this.recordArr = [];
    this.recordArr.push(prod);
    if (type === 'depot_in') {
      this.ModelTitle = '商品进货';
    } else {
      this.ModelTitle = '商品发货';
    }
  }
  // 进出货回调
  stocCallBack(recode) {
    if (recode) {
      this.message.create('success', '操作成功');
      this.modelCancel();
      setTimeout(() => {
        this.searchStream.next();
      }, 500);
    }
  }

}
