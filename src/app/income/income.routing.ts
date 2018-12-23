import { Routes } from '@angular/router';
import { ShopIncomeComponent } from './shop-income/shop-income.component';

export const incomeRouter: Routes = [
    {
        path: 'shop',
        data: { title: '店面收支', module: 'store', power: 'show' },
        component: ShopIncomeComponent,
    },
];
