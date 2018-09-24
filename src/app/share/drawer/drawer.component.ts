import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
@Component({
  selector: 'app-drawer',
  templateUrl: './drawer.component.html',
  styleUrls: ['./drawer.component.css']
})
export class DrawerComponent implements OnInit {
  @Input()title = '新建';
  @Output() callBack: EventEmitter<any> = new EventEmitter<any>();
  @Input() visible: boolean;
  data: any;
  constructor() {
    this.data = {
      status: false,
    };
  }

  ngOnInit() {
  }

  close(): void {
    this.data.status = false;
    this.callBack.emit(this.data);
  }
  submit() {
    this.data.status = true;
    this.callBack.emit(this.data);
  }

}
