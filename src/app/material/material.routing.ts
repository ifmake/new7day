import { Routes } from '@angular/router';
import { ProductComponent } from './product/product.component';
import { StoreComponent } from './store/store.component';
import { SupplierComponent } from './supplier/supplier.component';
import { StaffComponent } from './staff/staff.component';

export const materialRouter: Routes = [
    { path: '', redirectTo: 'product', pathMatch: 'full'},
    {path: 'product', component: ProductComponent},
    {path: 'store', component: StoreComponent},
    {path: 'supplier', component: SupplierComponent},
    {path: 'staff', component: StaffComponent},
];
