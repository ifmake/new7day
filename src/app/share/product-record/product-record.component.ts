import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-product-record',
  templateUrl: './product-record.component.html',
  styleUrls: ['./product-record.component.less']
})
export class ProductRecordComponent implements OnInit {
  @Input() recordArr: any = [];
  @Input() type: string;
  @Input() name: string;
  @Output() loadMore: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }
  // 查看更多记录
  loadmoreRecord() {
     this.loadMore.emit(this.type);
  }
}
