import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts';
import { graphic } from 'echarts';

@Component({
  selector: 'app-store-cost',
  templateUrl: './store-cost.component.html',
  styleUrls: ['./store-cost.component.less']
})
export class StoreCostComponent implements OnInit {
  options: any;
  detectEventChanges = true;
  date: string;

  constructor() {
    const dataAxis = ['奶茶', '杯子', '大碗', '凉面碗', '奶精', '珍珠', '苹果', '西瓜', '柠檬', '奶茶杯', ];
    const data = [220, 182, 191, 234, 290, 330, 310, 123, 442, 321];
    const yMax = 500;
    const dataShadow = [];

    for (let i = 0; i < data.length; i++) {
      dataShadow.push(yMax);
    }
    this.options = {
      title: {
        text: '新七天总仓库每件商品出货量'
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
            color: '#999'
          }
        }
      },
      dataZoom: [
        {
          type: 'inside'
        }
      ],
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
    // console.log(chart);
    // console.log(type);
  }
  // 检测时间变化
  checkChange(change) {
    console.log(change);
  }
}
