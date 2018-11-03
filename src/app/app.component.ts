import { Component } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { LocalStorage } from './common/storage/local.storage';
import { SimpleReuseStrategy } from './common/storage/SimpleReuseStrategy';
import { ActiveMenus } from './common/interface/menu.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'new7Day';
  Islogin: boolean;
  count = 5;
  MenuIndex: number;
  ActiveMenus: Array<ActiveMenus> = [];
  constructor(
    private router: Router,
    private storage: LocalStorage,
  ) {
    // 监听路由变化
    this.router.events.subscribe(route => {
      if (route instanceof NavigationStart) {
        const userInfo = JSON.parse(this.storage.get('loginer'));
        if (userInfo.token && userInfo.token !== '') {
          this.Islogin = false;
          // this.router.navigate(['material/product']);
        } else {
          this.Islogin = true;
        }
      }
    });
    this.Islogin = true;
  }
  // 获取多窗口模式路由
  getMenus(menus) {
      this.ActiveMenus = menus;
  }
  // 获取选中的index
  removeMenu(menu) {
    // 当前关闭的是第几个路由
    const index = this.ActiveMenus.findIndex(p => p.module === menu.module);
    if (this.ActiveMenus.length === 1) { return; }
    this.ActiveMenus = this.ActiveMenus.filter(p => p.module !== menu.module);
    // 删除复用
    delete SimpleReuseStrategy.handlers[menu.module];
    if (!menu.select) { return; }
    // 显示上一个选中
    let premenu = this.ActiveMenus[index - 1];
    if (!premenu) {
      premenu = this.ActiveMenus[index + 1];
    }
    this.ActiveMenus.forEach(p => p.select = p.module === premenu.module);
    // 显示当前路由信息
    this.router.navigate(['/' + premenu.module]);
  }
  // 登录系统
  login() {
    this.Islogin = false;
  }

  // 退出登录
  loginOut() {
    this.Islogin = true;
    this.storage.remove('loginer');
    this.router.navigate(['']);
  }

}
