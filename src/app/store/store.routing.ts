import { Routes } from '@angular/router';
import { SotreSearchComponent } from './sotre-search/sotre-search.component';
import { StoreImportComponent } from './store-import/store-import.component';
import { StoreLoseComponent } from './store-lose/store-lose.component';

export const storeRouter: Routes = [
    { path: '', redirectTo: 'search', pathMatch: 'full'},
    // 库存查询
    {
        path: 'search',
        data: { title: '库存查询', module: 'store/search', power: 'show' },
        component: SotreSearchComponent
    },
    // 进出货管理
    {
        path: 'import',
        data: { title: '进出货管理', module: 'store/import', power: 'show' },
        component: StoreImportComponent},
    // {path: 'export', component: StoreExportComponent},
    // 报损管理
    {
        path: 'lose',
        data: { title: '报损管理', module: 'store/lose', power: 'show' },
        component: StoreLoseComponent
    },
    // 成本核算
    {
        path: 'cost',
        data: { title: '成本核算', module: 'store/cost', power: 'show' },
        loadChildren: './store-cost/store-cost.module#StoreCostModule'
    },
];
