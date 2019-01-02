import { Component, OnInit, Input, Output, EventEmitter, DoCheck } from '@angular/core';

@Component({
  selector: 'app-product-record',
  templateUrl: './product-record.component.html',
  styleUrls: ['./product-record.component.less']
})
export class ProductRecordComponent implements OnInit, DoCheck {
  @Input() recordArr: any;
  @Input() type: string;
  @Input() name: string;
  @Output() loadMore: EventEmitter<any> = new EventEmitter<any>();
  ViewListArr: any;
  constructor() { }

  ngOnInit() {
    this.recordArr = [];
  }
  ngDoCheck() {
    if (this.recordArr.length > 0) {
      this.ViewListArr = this.recordArr;
    } else {
      this.ViewListArr = [];
    }
  }
  // 查看更多记录
  loadmoreRecord() {
     this.loadMore.emit(this.type);
  }
}
