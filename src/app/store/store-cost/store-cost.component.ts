import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts';
import { graphic } from 'echarts';
import { reduce } from 'rxjs/operators';
import { ShareCommon } from 'src/app/share/share.component';

@Component({
  selector: 'app-store-cost',
  templateUrl: './store-cost.component.html',
  styleUrls: ['./store-cost.component.less']
})
export class StoreCostComponent extends ShareCommon implements OnInit {
  options: any;
  initOpts: any;
  detectEventChanges = true;
  date: string;
  searchTypeList = [
    {name: '数量', checked: true},
    {name: '成本', checked: true},
  ];

  constructor() {
    super();
    this.storeList = [
      {name: '总仓库', checked: true},
      {name: '仓库1', checked: false}
    ];
    const dataAxis = ['奶茶', '杯子', '大碗', '凉面碗', '奶精', '珍珠', '苹果', '西瓜', '柠檬', '奶茶杯'];
    const data = [220, 182, 191, 234, 290, 330, 310, 123, 442, 321];
    const dataShadow = [];

    for (let i = 0; i < data.length; i++) {
      dataShadow.push(data[i]);
    }
    this.initOpts = {
      renderer: 'svg',
      height: 400
    };
    this.options = {
      title: {
        text: '新七天总仓库每件商品出货量',
      },
      xAxis: {
        data: dataAxis,
        axisLabel: {
          inside: true,
          textStyle: {
            color: '#fff',
          },
          // position: 'top'
        },
        axisTick: {
          show: true
        },
        axisLine: {
          show: true
        },
        z: 10
      },
      yAxis: {
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          textStyle: {
            color: '#666'
          }
        }
      },
      dataZoom: [
        {
          type: 'inside'
        }
      ],
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
      },
      series: [
        { // For shadow
          name: '商品信息',
          type: 'bar',
          itemStyle: {
            normal: { color: 'rgba(0,0,0,0.05)' }
          },
          barGap: '-100%',
          barCategoryGap: '40%',
          data: dataShadow,
          animation: false
        },
        {
          type: 'bar',
          itemStyle: {
            normal: {
              color: new graphic['LinearGradient'](
                0, 0, 0, 1,
                [
                  { offset: 0, color: '#83bff6' },
                  { offset: 0.5, color: '#188df0' },
                  { offset: 1, color: '#188df0' }
                ]
              )
            },
            emphasis: {
              color: new graphic['LinearGradient'](
                0, 0, 0, 1,
                [
                  { offset: 0, color: '#2378f7' },
                  { offset: 0.7, color: '#2378f7' },
                  { offset: 1, color: '#83bff6' }
                ]
              )
            }
          },
          data: data
        }
      ]
    };
  }
  ngOnInit() {
  }

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
