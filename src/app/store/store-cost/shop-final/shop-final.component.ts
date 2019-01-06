import { Component, OnInit } from '@angular/core';
import { Subject, Observable, forkJoin } from 'rxjs';
import { StockCostService } from 'src/app/common/service/product-service/product-cost.service';
import { ShareCommon } from 'src/app/share/share.component';
import { switchMap } from 'rxjs/operators';
import { ShopMaterialService } from 'src/app/common/service/shop-service/shop-material.service';

@Component({
  selector: 'app-shop-final',
  templateUrl: './shop-final.component.html',
  styleUrls: ['./shop-final.component.less']
})
export class ShopFinalComponent extends ShareCommon implements OnInit {
  // 整体成本走势
  yearDate: any;
  // 月度成本统计
  LineOptions: any;
  PieOption: any;
  updateOption: any;
  autoResize: any;
  IsPieChart: boolean;
  detectEventChanges = true;
  monthCostStream = new Subject<any>();
  monthSearch: any;
  MonthArr = [];
  costArr = [];
  countArr = [];
  useCostArr = [];
  useCountArr = [];
  damagedCostArr = [];
  damagedCountArr = [];
  lineChart: any;
  // 当前店面
  currentShop: string;
  shopLinesPromise: any;
  shopLines = [];
  nameArr = ['总成本', '总数量', '损耗成本', '使用成本', '使用数量'];
  // 值为空推0
  getZero(value) {
    if (value === null || value === '') {
      return 0;
    } else {
      return value;
    }
  }

  constructor(
    private costService: StockCostService,
    private shopService: ShopMaterialService,
  ) {
    super();
    // 月度成本统计
    this.monthSearch = {
      page: 1,
      page_size: 10,
    };
    this.yearDate = new Date().getFullYear().toString();
    // 成本走势
    this.storeList = [
      { name: '货物成本', checked: true },
    ];
    // 总成本走势
    this.autoResize = true;
  }

  ngOnInit() {
    this.searchData();
  }
  // 数据刷新
  searchData() {
    // 获取店面列表
    this.shopService.getShopMaterialList({ page: 1, page_size: 10 }).subscribe(res => {
      this.shopLinesPromise = [];
      this.shopList = res.results;
      for (let i = 0; i < this.shopList.length; i++) {
        const shoplineOBj = {
          name: this.shopList[i].name,
          data: [],
          type: 'line',
        };
        const shopLineSearch = {
          page: 1,
          page_size: 10,
          shop: this.shopList[i].id,
        };
        this.shopLines.push(shoplineOBj);
        this.shopLinesPromise.push(this.costService.getMonthAdjust(shopLineSearch));
      }
      forkJoin(this.shopLinesPromise).subscribe(result => {
        for (let i = 0; i < result.length; i++) {
          const Data: any = result[i];
          this.MonthArr = [];
          this.costArr = [];
          Data.map(data => {
            this.MonthArr.push(`${data.month}月份`);
            this.costArr.push(this.getZero(data.used_cost));
          });
          this.shopLines[i].data = [...this.costArr];
        }
        console.log(this.shopLines);
        this.LineOptions = {
          title: {
            text: '仓库成本（点击当月查看占比图）'
          },
          xAxis: {
            type: 'category',
            text: '元',
            data: this.MonthArr
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              animation: false
            }
          },
          legend: {
            data: ['奎星店', '迷你店', '重百店']
          },
          yAxis: {
            type: 'value'
          },
          series: [...this.shopLines]
        };
      });
    });
  }

  /**
  * 成本走势
  */
  // 图片初始化
  onChartOninit(chart) {
    this.lineChart = chart;
    console.log(this.lineChart);
  }
  onChartEvent(chart) {
    console.log(chart);
    this.IsPieChart = true;
    const index = chart.dataIndex + 1;
    const costTypeArr = ['每月货物成本', '人工成本', '损耗成本', '杂费支出'];
    const DataArr = [];
    costTypeArr.map(name => {
      const DataObj = {
        value: null,
        name: name,
      };
      if (name === '每月货物成本') {
        DataObj.value = chart.value;
      }
      if (name === '人工成本') {
        DataObj.value = 10;
      }
      if (name === '损耗成本') {
        DataObj.value = 0;
      }
      if (name === '杂费支出') {
        DataObj.value = 10;
      }
      DataArr.push(DataObj);
    });

    this.PieOption = {
      title: {
        text: `${index}月份成本占比`,
        x: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        x: 'center',
        y: 'bottom',
        data: costTypeArr
      },
      calculable: true,
      series: [
        {
          name: 'area',
          type: 'pie',
          radius: [30, 110],
          roseType: 'area',
          data: DataArr
        }
      ]
    };
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
    if (change.name === '数量') {
      this.updateOption = {
        series: [
          {
            name: '总数量',
            data: this.countArr,
            type: 'line'
          },
          {
            name: '使用数量',
            data: this.useCountArr,
            type: 'line'
          },
        ]
      };
    } else {
      this.updateOption = {
        series: [
          {
            name: '总成本',
            data: this.costArr,
            type: 'line'
          },
          {
            name: '使用成本',
            data: this.useCostArr,
            type: 'line',
          },
          {
            name: '损耗成本',
            data: this.damagedCostArr,
            type: 'line',
          },
        ]
      };
    }
  }


}
