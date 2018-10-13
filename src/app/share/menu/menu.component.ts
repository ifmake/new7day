import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.less']
})
export class MenuComponent implements OnInit, OnChanges {
  @Input() Islogin: boolean;
  isCollapsed = false;
  menuList = [
    {title: '资料管理', link: 'material', active: 'active', select: false, childs: [
      {title: '商品资料', link: '/material/product', active: 'active', select: false},
      {title: '仓库资料', link: '/material/store', active: 'active', select: false},
      {title: '供应商资料', link: '/material/supplier', active: 'active', select: false},
      {title: '员工资料', link: '/material/staff', active: 'active', select: false}
    ]},
    {title: '仓库管理', link: 'store', active: 'active', select: false, childs: [
      {title: '库存查询', link: '/store/search', active: 'active', select: false},
      {title: '进出货管理', link: '/store/import', active: 'active', select: false},
      // {title: '出库管理', link: '/store/export', active: 'active', select: false},
      {title: '成本核算', link: '/store/cost', active: 'active', select: false},
      {title: '报损管理', link: '/store/lose', active: 'active', select: false},
    ]},
  ];

  constructor(
    public router: Router,
  ) {
    this.router.events.subscribe(route => {
      if (route instanceof NavigationEnd) {
        // 组件限制两层
      this.unfoldActiveLink(route);
      }
    });
  }
  ngOnChanges(change) {
    // this.menuList[0].select = true;
    // this.menuList[0].childs[0].select = true;
  }

  ngOnInit() {}
  // 动态控制菜单栏伸缩
  toggleCollapsed(): void {
    this.isCollapsed = !this.isCollapsed;
  }
  // 默认展开指定菜单
  unfoldActiveLink(route) {
    for (let i = 0; i < this.menuList.length; i++) {
      if (route.url.search(this.menuList[i].link) !== -1) {
        this.menuList[i].select = true;
        for (let j = 0; j < this.menuList[i].childs.length; j++) {
          if (route.url === this.menuList[i].childs[j].link) {
            this.menuList[i].childs[j].select = true;
          }
        }
      }
    }
  }
}
