import { Component } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { LocalStorage } from './common/storage/local.storage';
import { SimpleReuseStrategy } from './common/storage/SimpleReuseStrategy';
import { ActiveMenus, RightsMenus} from './common/interface/menu.interface';
import { SuperMenu, MangerMenu, StockManageMenu, BossMenu} from './common/comom-constant/menu-rights';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { AccountService } from './common/service/account.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent {
  title = 'new7Day';
  Islogin: boolean;
  count = 1;
  loginer_name: string;
  MenuIndex: number;
  RightsMenus: Array<RightsMenus> = [];
  ActiveMenus: Array<ActiveMenus> = [];
  // 弹窗
  ModelTitle: string;
  ModelVisible: boolean;
  modelType: string;
  // 修改密码
  changePassForm: FormGroup;
  constructor(
    private router: Router,
    private storage: LocalStorage,
    private fb: FormBuilder,
    private message: NzMessageService,
    private accountService: AccountService,
  ) {
    this.ModelTitle = '退出登录';
    // 监听路由变化
    this.router.events.subscribe(route => {
      if (route instanceof NavigationStart) {
        const userInfo = JSON.parse(this.storage.get('loginer'));
        if (userInfo) {
          this.loginer_name = userInfo.profile.name;
          if (userInfo.token && userInfo.token !== '') {
            this.Islogin = false;
            if (userInfo.profile.role === 'super_admin') {
              this.RightsMenus = SuperMenu;
            }
            if (userInfo.profile.role === 'admin') {
              this.RightsMenus = MangerMenu;
            }
            if (userInfo.profile.role === 'warekeeper') {
              this.RightsMenus = StockManageMenu;
            }
            if (userInfo.profile.role === 'boss') {
              this.RightsMenus = BossMenu;
            }
          } else {
            this.Islogin = true;
          }
        }
      }
    });
    this.Islogin = true;
  }
  // 对比新旧密码
  confirmationValidator = (control: FormControl): { [ s: string ]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.changePassForm.controls.password.value) {
      return { confirm: true, error: true };
    }
  }
  // 更新验证
  updateConfirmValidator(): void {
    /** wait for refresh value */
    Promise.resolve().then(() => this.changePassForm.controls.confirm_password.updateValueAndValidity());
  }
  // 获取多窗口模式路由
  getMenus(menus) {
    if (menus.length > 0) {
      this.ActiveMenus = menus;
    } else {
      this.router.navigate(['']);
    }
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
    this.ActiveMenus = [];
    this.router.navigate(['welcome']);
  }
  // 弹出确认弹窗
  openModel(type) {
    this.ModelVisible = true;
    this.modelType = type;
    if (type === 'changePass') {
       this.changePassForm = this.fb.group({
        old_password: [null, [ Validators.required ]],
        password: [null, [ Validators.required ]],
        confirm_password: [null, [ Validators.required, this.confirmationValidator]],
       });
    }
  }

  // 退出登录
  confirmModel() {
    if (this.modelType !== 'changePass') {
      this.ModelVisible = false;
      this.Islogin = true;
      this.RightsMenus = [];
      this.storage.remove('loginer');
    } else {
      for (const key in this.changePassForm.controls) {
        if (key) {
          this.changePassForm.controls[ key].markAsDirty();
          this.changePassForm.controls[ key ].updateValueAndValidity();
        }
      }
      if (!this.changePassForm.value.old_password) {
        this.message.create('warning', '旧密码不能为空');
        return;
      }
      if (!this.changePassForm.value.password) {
        this.message.create('warning', '旧密码不能为空');
        return;
      }
      if (this.changePassForm.value.confirm_password) {
        if (this.changePassForm.value.confirm_password !== this.changePassForm.value.password) {
          this.message.create('warning', '确认密码不一致');
          return;
        }
      } else {
        this.message.create('warning', '请再次输入新密码');
        return;
      }
      this.accountService.changePassword(this.changePassForm.value).subscribe(res => {
        console.log(res);
        if (res.status === 'success') {
          this.message.create('success', '密码修改成功,请重新登录');
          setTimeout(() => {
            this.modelType = 'loginOut';
            this.confirmModel();
          }, 2000);
        }
      });
    }
  }

}
