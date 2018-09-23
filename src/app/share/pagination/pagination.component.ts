import { Component, OnInit, Input, Output, EventEmitter, AfterViewInit, OnChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit, OnChanges {

  @Input() nzPageIndex: number; // 当前页数
  @Input() nzTotal: number; // 总条数
  @Input() nzPageSize: number; // 每页条数
  @Output() nzPageIndexChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() nzPageSizeChange: EventEmitter<any> = new EventEmitter<any>();
  // 可选每页条数
  nzPageSizeOptions: any;
  constructor() {}

  ngOnInit() {
    if (!this.nzPageIndex || this.nzPageIndex === null) {
      this.nzPageIndex = 1;
    }
  }
  ngOnChanges(change) {
    if (change.nzTotal) {
      if (this.nzTotal <= 10) {
        this.nzPageSizeOptions = [10];
      } else if (this.nzTotal > 10 && this.nzTotal <= 50) {
        this.nzPageSizeOptions = [10, this.nzTotal];
      } else {
        this.nzPageSizeOptions = [10, 20, 50];
      }
    }
  }
  // 当前页数
  PageIndexChange (page) {
    this.nzPageIndexChange.emit(page);
  }
  // 当前页条数
  PageSizeChange(size) {
    // this.page_size = size;
    this.nzPageSizeChange.emit(size);
  }

}
