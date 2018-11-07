import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts';
import { graphic } from 'echarts';
import { reduce, switchMap } from 'rxjs/operators';
import { ShareCommon } from 'src/app/share/share.component';
import { StockCostService } from 'src/app/common/service/product-service/product-cost.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-store-cost',
  templateUrl: './store-cost.component.html',
  styleUrls: ['./store-cost.component.less']
})
export class StoreCostComponent extends ShareCommon implements OnInit {
  costTypes = [
    {name: '商品成本', type: 'product_cost', index: 0},
    {name: '仓库成本走势', type: 'all_cost', index: 1},
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
  // 月度成本统计
  monthCostStream = new Subject<any>();
  monthSearch: any;
  MonthArr = [];
  costArr = [];
  countArr = [];
  useCostArr = [];
  useCountArr = [];
   // 值为空推0
   getZero(value) {
      if (value === null || value === '') {
        return 0;
      } else {
        return value;
      }
  }
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
    // 月度成本统计
    this.monthSearch = {
      page: 1,
      page_size: 10,
    };
    this.monthCostStream.pipe(switchMap(() => {
      return this.costService.getMonthAdjust(this.searchObj);
    })).subscribe(res => {
      if (res && res['length'] > 0) {
        const Data: any = res;
        Data.map(data => {
          this.MonthArr.push(`${data.month}月份`);
          this.costArr.push(this.getZero(data.cost));
          this.countArr.push(this.getZero(data.count));
          this.useCostArr.push(this.getZero(data.used_cost));
          this.useCountArr.push(this.getZero(data.used_count));
          this.options = {
            title: {
              text: '仓库成本'
            },
            xAxis: {
              type: 'category',
              data: this.MonthArr
            },
            tooltip: {
              trigger: 'axis',
              axisPointer: {
                animation: false
              }
            },
            legend: {
              data: ['总成本', '总数量', '使用成本', '使用数量' ]
            },
            yAxis: {
              type: 'value'
            },
            series: [
              {
                name: '总成本',
                data: this.costArr,
                type: 'line'
              },
              {
                name: '总数量',
                data: this.countArr,
                type: 'line'
              },
              {
                name: '使用成本',
                data: this.useCostArr,
                type: 'line'
              },
              {
                name: '使用数量',
                data: this.useCountArr,
                type: 'line'
              },
              // {
              //   name: '损耗',
              //   data: [20, 142, 31, 34, 290, 30, 20, 110, 30, 50, 40],
              //   type: 'line'
              // },
            ]
          };
        });
      }
    });

    // 成本走势
    this.storeList = [
      {name: '成本', checked: true},
      {name: '数量', checked: false}
    ];
   // 总成本走势
  this.autoResize = true;

  }


  ngOnInit() {
    this.searchStream.next();
  }
  // 切换类型
  changeStore(store) {
    console.log(store);
    if (store.index === 1) {
      this.monthCostStream.next();
    }
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
    console.log(chart);
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
