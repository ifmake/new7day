import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { LoginService } from '../../common/service/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less']
})
export class LoginComponent implements OnInit {
  validateForm: FormGroup;
  // 图片路径
  title: string;
  kiwifruit: string;
  lemon: string;
  logo: string;

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
  ) {
    this.title = '../../assets/img/title.png';
    this.kiwifruit = '../../assets/img/kiwifruit.png';
    this.lemon = '../../assets/img/lemon.png';
    this.logo = '../../assets/img/logo.png';
  }

  ngOnInit(): void {
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
    if (this.validateForm.value.remember) {
        // 用户登录记忆
    }
    const loginObj = {
      username: this.validateForm.value.username,
      password: this.validateForm.value.password,
    };
    this.loginService.loginUser(loginObj).subscribe((res) => {
      console.log(res);
      if  (res) {
          this.router.navigate(['material/product']);
      }
    });
  }
}
