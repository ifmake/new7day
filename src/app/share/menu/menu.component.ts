import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.less']
})
export class MenuComponent implements OnInit {

  isCollapsed = false;
  menuList = [
    {title: '资料管理', link: '', active: 'active', childs: [
      {title: '商品资料', link: 'material/product', active: 'active'},
      {title: '仓库资料', link: 'material/store', active: 'active'},
      {title: '供应商资料', link: 'material/supplier', active: 'active'},
      {title: '员工资料', link: 'material/staff', active: 'active'}
    ]},
    {title: '仓库管理', link: '', active: 'active', childs: [
      {title: '库存查询', link: '', active: 'active'}
    ]},

  ];

  constructor() { }

  ngOnInit() {
  }
  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}
