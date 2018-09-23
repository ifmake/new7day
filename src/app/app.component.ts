import { Component } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { LocalStorage } from './common/storage/local.storage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'new7Day';
  Islogin: boolean;
  constructor(
    private router: Router,
    private storage: LocalStorage,
  ) {
    const userInfo = JSON.parse(this.storage.get('loginer'));
    // 监听路由变化
    this.router.events.subscribe(route => {
      if (route instanceof NavigationStart) {
        if (userInfo.token && userInfo.token !== '') {
          this.Islogin = false;
        } else {
          this.Islogin = true;
        }
      }
    });
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
