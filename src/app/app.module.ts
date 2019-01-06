import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {  NZ_I18N, zh_CN } from 'ng-zorro-antd';
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
import { ShareModule } from './share/share.module';
import { LoginModule } from './share/login/login.module';
import { MenuComponent } from './share/menu/menu.component';
import { RouterModule, RouteReuseStrategy } from '@angular/router';
import { rootRouter } from './app.routing';
import { SimpleReuseStrategy } from './common/storage/SimpleReuseStrategy';
import { MenuListComponent } from './share/menu-list/menu-list.component';
import { WelcomeComponent } from './welcome/welcome.component';

registerLocaleData(zh);

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    MenuListComponent,
    WelcomeComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule.forRoot(rootRouter),
    ShareModule,
    LoginModule,
  ],
  providers: [
    { provide: NZ_I18N, useValue: zh_CN },
    { provide: RouteReuseStrategy, useClass: SimpleReuseStrategy },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
