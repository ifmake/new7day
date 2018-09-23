import {Routes} from '@angular/router';
import { LoginGuard } from './share/login/login.guard';

export const rootRouter: Routes = [
    // { path: '', redirectTo: 'material', pathMatch: 'full'},
    { path: 'material', loadChildren: './material/material.module#MaterialModule'},
    { path: 'store', loadChildren: './store/store.module#StoreModule'},
    // { path: 'login', loadChildren: './share/login/login.module#LoginModule'},
    // { path: 'store_manage', loadChildren: './store-manage/store-manage.module#StoreManageModule'},
];
