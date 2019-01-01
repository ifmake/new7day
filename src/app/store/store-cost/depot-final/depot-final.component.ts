import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ShareCommon } from 'src/app/share/share.component';
import { switchMap } from 'rxjs/operators';
import { StockCostService } from 'src/app/common/service/product-service/product-cost.service';

@Component({
  selector: 'app-depot-final',
  templateUrl: './depot-final.component.html',
  styleUrls: ['./depot-final.component.less']
})
export class DepotFinalComponent extends ShareCommon implements OnInit {
   // 整体成本走势
   yearDate: any;
   searchTypeList = [
     {name: '数量', checked: true},
     {name: '成本', checked: true},
   ];
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
  ) {
    super();
    // 月度成本统计
    this.monthSearch = {
      page: 1,
      page_size: 10,
    };
    this.yearDate = new Date().getFullYear().toString();
    this.monthCostStream.pipe(switchMap(() => {
      return this.costService.getMonthAdjust(this.searchObj);
    })).subscribe(res => {
      if (res && res['length'] > 0) {
        const Data: any = res;
        this.MonthArr = [];
        this.costArr = [];
        this.countArr = [];
        this.useCostArr = [];
        this.useCountArr = [];
        this.damagedCostArr = [];
        this.damagedCountArr = [];
        Data.map(data => {
          this.MonthArr.push(`${data.month}月份`);
          this.costArr.push(this.getZero(data.cost));
          this.countArr.push(this.getZero(data.count));
          this.useCostArr.push(this.getZero(data.used_cost));
          this.useCountArr.push(this.getZero(data.used_count));
          this.damagedCostArr.push(this.getZero(data.damaged_cost));
          this.damagedCountArr.push(this.getZero(data.damaged_count));
        });
      }
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
          data: ['总成本', '总数量', '损耗成本', '使用成本', '使用数量' ]
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
    this.searchData();
  }
  // 数据刷新
  searchData() {
    this.monthCostStream.next();
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
    this.IsPieChart = true;
    const index = chart.dataIndex + 1;
    const costTypeArr = ['出货成本', '库存', '损耗' ];
    const DataArr = [];
    costTypeArr.map(name => {
      const DataObj = {
        value: null,
        name: name,
      };
      if (name === '出货成本') {
        DataObj.value = this.useCostArr[chart.dataIndex];
      }
      if (name === '库存') {
        DataObj.value = this.costArr[chart.dataIndex] - this.useCostArr[chart.dataIndex];
      }
      if (name === '损耗') {
        DataObj.value = this.damagedCostArr[chart.dataIndex];
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
