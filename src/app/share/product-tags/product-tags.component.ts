import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-product-tags',
  templateUrl: './product-tags.component.html',
  styleUrls: ['./product-tags.component.less']
})
export class ProductTagsComponent implements OnInit {
  @Input() ProdArr: any = [];
  @Output() unSelect: EventEmitter<any>  = new EventEmitter<any>();
  private tag_config = {
    color: 'magenta',
    model: 'closeable',
  };

  constructor() { }

  ngOnInit() {
  }
  // 删除选中商品
  deleteProd(prod) {
      this.unSelect.emit(prod);
  }
}
