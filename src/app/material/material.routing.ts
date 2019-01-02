import { Routes } from '@angular/router';
import { ProductComponent } from './product/product.component';
import { StoreComponent } from './store/store.component';
import { SupplierComponent } from './supplier/supplier.component';
import { StaffComponent } from './staff/staff.component';
import { ShopfrontComponent } from './shopfront/shopfront.component';

export const materialRouter: Routes = [
    // 商品资料
    {
        path: 'product',
        data: { title: '商品资料', module: 'material/product', power: 'show' },
        component: ProductComponent
    },
    {
        path: 'store',
        data: { title: '仓库资料', module: 'material/store', power: 'show' },
        component: StoreComponent
    },
    {
        path: 'supplier',
        data: { title: '供应商资料', module: 'material/supplier', power: 'show' },
        component: SupplierComponent
    },
    {
        path: 'staff',
        data: { title: '员工资料', module: 'material/staff', power: 'show' },
        component: StaffComponent
    },
    {
        path: 'shopfront',
        data: { title: '店面资料', module: 'material/shopfront', power: 'show' },
        component: ShopfrontComponent
    },
];
