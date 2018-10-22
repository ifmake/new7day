import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.less']
})
export class ProductCardComponent implements OnInit {
  @Input() stockArr: any = [];
  @Output() callBack: EventEmitter<any> = new EventEmitter<any>();
  @Output() selectProds: EventEmitter<any> = new EventEmitter<any>();
  cardLoading: boolean;
  constructor() {
    this.cardLoading = false;
   }
  ngOnInit() {
  }
  // 商品操作
  operatePro(prod, type) {
    const metaData = prod;
    Object.assign(metaData, {operate_type: type});
    this.callBack.emit(metaData);
  }
  // 选中商品
  selectPro(check, prod) {
    if (check) {
        Object.assign(prod, {operate_type: 'select'});
      } else {
        Object.assign(prod, {operate_type: 'unselect'});
    }
    this.selectProds.emit(prod);
  }
}
