import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts';
import { graphic } from 'echarts';
import { reduce, switchMap } from 'rxjs/operators';
import { ShareCommon } from 'src/app/share/share.component';
import { StockCostService } from 'src/app/common/service/product-service/product-cost.service';

@Component({
  selector: 'app-store-cost',
  templateUrl: './store-cost.component.html',
  styleUrls: ['./store-cost.component.less']
})
export class StoreCostComponent extends ShareCommon implements OnInit {
  costTypes = [
    {name: '商品成本', type: 'product_cost', index: 0},
    {name: '成本走势', type: 'all_cost', index: 1},
  ];
  isSplin = false;
  selectedIndex = 0;

  // 商品成本
  searchArray = [
    {key: 'name', index: 0, name: '商品名称', show: true},
  ];
  dataList: any;
  // 整体成本走势
  options: any;
  autoResize: any;
  detectEventChanges = true;
  date: string;
  searchTypeList = [
    {name: '数量', checked: true},
    {name: '成本', checked: true},
  ];

  constructor(
    private costService: StockCostService
  ) {
    super();
    // 商品成本
    this.searchStream.pipe(switchMap(() => {
      return this.costService.getCostList(this.searchObj);
    })).subscribe(res => {
      console.log(res);
      this.listLoading = false;
      this.dataList = res;
    });
    // 成本走势
    this.storeList = [
      {name: '总仓库', checked: true},
      {name: '仓库1', checked: false}
    ];
   // 总成本走势
  this.autoResize = true;
  this.options = {
    title: {
      text: '库房每月总成本走势'
    },
    xAxis: {
      type: 'category',
      data: ['一月', '二月', '三月', '四月', '五月', '六月', '7月', '8月', '9月', '10月']
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        animation: false
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [{
      data: [820, 932, 901, 934, 1290, 1330, 1320, 1500, 1630, 1750, 1840 ],
      type: 'line'
    }]
  };
  }


  ngOnInit() {
    this.searchStream.next();
  }
  // 切换类型
  changeStore(store) {
    console.log(store);
    this.selectedIndex = store.index;
  }
  /**
   * 商品成本
   */
    // 数据查询
    searchData(keys) {
      Object.assign(this.searchObj, keys);
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

  /**
   * 成本走势
   */
  // 图标事件
  onChartEvent(chart, type) {
    // console.log(type);
  }
  // 检测时间变化
  checkChange(change, index) {
    this.storeList.map((store, index1) => {
      if (index1 === index) {
        this.storeList[index1].checked = true;
      } else {
        this.storeList[index1].checked = false;
      }
    });
  }
}
