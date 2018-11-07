import { Component, OnInit } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { StoreCommon } from '../store_common.compoennt';
import { StockListService } from '../../common/service/product-service/production-stock.service';
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
  displayData: any = [];
  searchArray: any = [];
  allChecked: boolean;
  indeterminate: boolean;
  // 进货组件
  ModelVisible: boolean;
  ModelTitle = '进货管理';
  recordArr: any;
  recordType: string;
  // 商品详情组件
   ProStockArr = [
    {name: '所属仓库', content: '总仓库'},
    {name: '操作人', content: '测试用户'},
    {name: '最近进货时间', content: '2018-10-12'},
    {name: '最近出货时间', content: '2018-10-10'},
  ];
  constructor(
    private stockList: StockListService
  ) {
    super();
    this.recordArr = [];
    this.searchStream.pipe(switchMap(() => {
      return this.stockList.getStockList(this.searchObj);
    })).subscribe(res => {
      this.listLoading = false;
      this.dataList = res;
    });

    this.searchArray = [
      {key: 'name', index: 0, name: '名称', show: true},
      // {key: 'stock', index: 3, name: '库存', show: true},
      {key: 'depot', index: 4, name: '所属仓库', show: true},
      {key: 'last_operator_name', index: 5, name: '操作人', show: true},
      {key: 'stock_status', index: 5, name: '库存状态', show: true},
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
    console.log(prod);
    this.OpenDraw = true;
    this.drawerTitle = prod.name;
    this.stockList.getDetail(prod.id).subscribe(res => {
    });
  }
  // 记录单
  lookMoreRecord(type) {
    console.log(type);
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
    this.recordArr = [];
    this.recordType = type;
    this.recordArr.push(prod);
    if (type === 'depot_in') {
      this.ModelTitle = '商品进货';
    } else {
      this.ModelTitle = '商品发货';
    }
  }
  // 进出货回调
  stocCallBack(recode) {
    console.log(recode);
    this.modelCancel();
    this.searchStream.next();
  }

}
