import {Routes} from '@angular/router';
import { LoginGuard } from './share/login/login.guard';

export const rootRouter: Routes = [
    // { path: '', redirectTo: 'material', pathMatch: 'full'},
    {
        path: 'material',
        data: { title: '资料管理', module: 'material', power: 'show' },
        loadChildren: './material/material.module#MaterialModule'
    },
    {
        path: 'store',
        data: { title: '库存管理', module: 'store', power: 'show' },
        loadChildren: './store/store.module#StoreModule'
    },
    // { path: 'login', loadChildren: './share/login/login.module#LoginModule'},
    // { path: 'store_manage', loadChildren: './store-manage/store-manage.module#StoreManageModule'},
];
