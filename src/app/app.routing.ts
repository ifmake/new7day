import {Routes} from '@angular/router';
import { LoginGuard } from './share/login/login.guard';
import { WelcomeComponent } from './welcome/welcome.component';

export const rootRouter: Routes = [
    { path: '', redirectTo: 'welcome', pathMatch: 'full'},
    {path: 'welcome', component: WelcomeComponent },
    {
        path: 'material',
        data: { title: '资料管理', module: 'material', power: 'show' },
        loadChildren: './material/material.module#MaterialModule',
        canActivate: [LoginGuard],
    },
    {
        path: 'store',
        data: { title: '库存管理', module: 'store', power: 'show' },
        loadChildren: './store/store.module#StoreModule',
        canActivate: [LoginGuard],
    },
    {
        path: 'income',
        data: { title: '收支管理', module: 'store', power: 'show' },
        loadChildren: './income/income.module#IncomeModule',
        canActivate: [LoginGuard],
    },
    // { path: 'login', loadChildren: './share/login/login.module#LoginModule'},
    // { path: 'store_manage', loadChildren: './store-manage/store-manage.module#StoreManageModule'},
];
