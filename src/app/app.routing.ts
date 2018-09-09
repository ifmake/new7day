import {Routes} from '@angular/router';

export const rootRouter: Routes = [
    { path: '', redirectTo: 'material', pathMatch: 'full'},
    { path: 'material', loadChildren: './material/material.module#MaterialModule'},
    // { path: 'login', loadChildren: './share/login/login.module#LoginModule'},
    // { path: 'store_manage', loadChildren: './store-manage/store-manage.module#StoreManageModule'},
];
