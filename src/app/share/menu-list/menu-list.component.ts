import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.less']
})
export class MenuListComponent {
  @Input() MenuList: Array<any>;
  @Output() remove: EventEmitter<any> = new EventEmitter<any>();
  callData: any;

  constructor() {
    this.callData = {
      module: '',
      select: '',
    };
  }
  // 移除菜单
  removeMenu(moduled, select) {
    this.callData.module = moduled;
    this.callData.select = select;
    this.remove.emit(this.callData);
  }

}
