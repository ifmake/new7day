import { Component, OnInit } from '@angular/core';
import { StoreCommon } from '../store_common.compoennt';
import { StockListService } from '../../common/service/product-service/production-service.service';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-store-import',
  templateUrl: './store-import.component.html',
  styleUrls: ['./store-import.component.css']
})
export class StoreImportComponent extends StoreCommon implements OnInit {
  stores: any = [];
  selectedIndex = 0;
  stockArr: any = [];
  isSplin = false;
  recordType = 'import';
  // 批量选择商品
  importProdArr = [];

  // 商品库存查看
  ProStockArr = [
    {name: '仓库', content: '总仓库'},
    {name: '供应商', content: '测试公司'},
    {name: '操作人', content: '测试用户'},
    {name: '最近进货时间', content: '2018-10-12'},
    {name: '最近出货时间', content: '2018-10-10'},
    {name: '进货源', content: '供应商'},
    {name: '出货源', content: '仓库1,店面'},
  ];
  // 商品进货记录
  recordArr = [
    {name: '芒果', import_price: '1233', sum: 1000, unit: '元/斤', time: '10/10 15:30', maker: 'admin1'},
    {name: '芒果', import_price: '123', sum: 10, unit: '元/斤', time: '10/10 15:30', maker: 'admin1'},
  ];
  constructor(
    public message: NzMessageService,
    public stockList: StockListService,
  ) {
    super();
    this.stores = [
      {name: '总仓库', index: 0, path: '', content: 'sdfsd'},
      {name: '仓库1', index: 1, path: '', content: '暗杀计划的分类进卡士大夫是否'}
    ];
    this.searchArray = [
      {key: 'name', index: 0, name: '商品名称', show: true},
      {key: 'code', index: 1, name: '商品类型', show: true},
      {key: 'spec', index: 2, name: '库存余量', show: true},
      {key: 'import_date', index: 3, name: '进货日期', show: true, isTime: true},
    ];
    this.stockArr = [
      {name: '芒果', stock: 300, desc: '库存300', select: false, imgUrl: 'assets/img/lemon.png'},
      {name: '句子', stock: 300, desc: '库存300', select: false, imgUrl: 'assets/img/lemon.png'},
      {name: '苹果', stock: 300, desc: '库存300', select: false, imgUrl: 'assets/img/title.png'},
      {name: '西瓜', stock: 300, desc: '库存300', select: false, imgUrl: 'assets/img/lemon.png'},
      {name: '奶茶', stock: 300, desc: '库存300', select: false, imgUrl: 'assets/img/lemon.png'},
      {name: '舒服', stock: 300, desc: '库存300', select: false, imgUrl: 'assets/img/lemon.png'},
      {name: '芒撒是的', stock: 300, desc: '库存300', select: false, imgUrl: 'assets/img/lemon.png'},
      {name: '杯子', stock: 300, desc: '库存300', select: false, imgUrl: 'assets/img/lemon.png'},
    ];
   }

  ngOnInit() {
  }
  /**
   * 批量选择商品
   */
  selectProds(prod) {
    console.log(prod);
    if (prod.operate_type === 'select') {
      this.importProdArr.push(prod);
    } else {
      this.unSelectProd(prod);
    }
  }
  // 取消选中商品
  unSelectProd(prod) {
      this.importProdArr.splice(0, 1);
      console.log(this.importProdArr);
  }
  // 批量进货
  batchImport(type) {
    if (this.importProdArr.length  < 1) {
      this.message.create('warning', '请选择进货商品');
      return false;
    }
    this.ModelVisible = true;
    this.recordArr = this.importProdArr;
  }
  /**
   * 仓库切换
  */
  changeStore(store) {
    console.log(store);
  }
  // 商品库存详情
  openDraw() {
  }
  refresh(searchData) {
    console.log(searchData);
  }
  // 商品操作
  productOperate(prod) {
    if (prod.operate_type === 'look')  {
      this.lookProduct(prod);
    } else if (prod.operate_type === 'import') {
       this.importProduct(prod);
    } else {
      this.exportProduct(prod);
    }
  }
  // 查看商品详情
  lookProduct(prod): void {
    this.OpenDraw = true;
    this.drawerTitle = '芒果详细信息';
    console.log(prod);
  }
  // 商品进货
  importProduct(prod) {
    this.ModelVisible = true;
    this.ModelTitle = prod.name;
    console.log(prod);
  }
  // 商品发货
  exportProduct(prod) {
    this.ModelVisible = true;
    this.ModelTitle = prod.name;
    console.log(prod);
  }
  // 查看更多进货出货记录
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
  // 记录弹出弹窗
  OpenModel(type) {
    this.ModelVisible = true;
    if (type === 'import') {

    } else {

    }
  }
}
