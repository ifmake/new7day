import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';

import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { LoginService } from '../../common/service/login.service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
  ],
  declarations: [LoginComponent],
  exports: [LoginComponent],
  providers: [LoginService]
})
export class LoginModule { }
