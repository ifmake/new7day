import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-comfirm-alert',
  templateUrl: './comfirm-alert.component.html',
  styleUrls: ['./comfirm-alert.component.css']
})
export class ComfirmAlertComponent implements OnInit {
  @Input() title: string;
  @Input() info: string;
  @Output() callBack: EventEmitter<any> = new EventEmitter<any>();
  data: any;
  constructor() {
    this.data = {
      type: false
    };
   }
  ngOnInit() {}
  // 确认
  confirm() {
    this.data.type = true;
    this.callBack.emit(this.data);
  }

  // 取消
  cancel() {
    this.data.type = false;
    this.callBack.emit(this.data);
  }
}
