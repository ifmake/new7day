import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { LoginService } from '../../common/service/login.service';
import { Router } from '@angular/router';
import { LocalStorage } from '../../common/storage/local.storage';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  @Input() Islogin: boolean;
  @Output() login: EventEmitter<any> = new EventEmitter<any>();

  validateForm: FormGroup;
  // 图片路径
  title: string;
  kiwifruit: string;
  lemon: string;
  logo: string;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    public message: NzMessageService,
    private storage: LocalStorage,
    private router: Router
  ) {
    this.title = '../../assets/img/title.png';
    this.kiwifruit = '../../assets/img/kiwifruit.png';
    this.lemon = '../../assets/img/lemon.png';
    this.logo = '../../assets/img/logo.png';
  }

  ngOnInit(): void {
    console.log(window.location.href);
    this.validateForm = this.fb.group({
      username: [ null, [ Validators.required ] ],
      password: [ null, [ Validators.required ] ],
      remember: [ true ]
    });
  }
  /**
   * 用户登录
   */
  submitForm(): void {
    for (const i in this.validateForm.controls) {
      if (i) {
        this.validateForm.controls[i].markAsDirty();
        this.validateForm.controls[i].updateValueAndValidity();
      }
    }
    const loginObj = {
      username: this.validateForm.value.username,
      password: this.validateForm.value.password,
    };
    if (!loginObj.username || !loginObj.password) {
      this.message.create('warning', '请填写用户名或密码');
      return;
    }
    this.loginService.loginUser(loginObj).subscribe((res) => {
      if  (res.token && res.token !== '') {
        // 数据存储
        this.storage.set('loginer', JSON.stringify(res));
        this.router.navigate(['material/product']);
        this.login.emit();
      } else {
        for (const err of res.error.non_field_errors) {
          if (err) {
            this.message.create('error', err);
          }
        }
      }
    });
  }
}
