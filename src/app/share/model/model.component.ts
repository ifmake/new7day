import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.less']
})
export class ModelComponent implements OnInit {
  @Input() OpenModel: boolean;
  @Input() title: string;
  @Input() type: string;
  @Input() width: number | string;
  @Output()close: EventEmitter<any> = new EventEmitter<any>();
  @Output()callBack: EventEmitter<any> = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }
  // 关闭弹窗
  closeModel() {
    this.close.emit('close');
  }
  // 确认关闭弹窗
  sure() {
    this.callBack.emit();
  }

}
