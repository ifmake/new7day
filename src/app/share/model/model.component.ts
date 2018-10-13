import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.less']
})
export class ModelComponent implements OnInit {
  @Input() OpenModel: boolean;
  @Input() title: string;
  @Output()close: EventEmitter<any> = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }
  // 关闭弹窗
  closeModel() {
    this.close.emit();
  }

}
