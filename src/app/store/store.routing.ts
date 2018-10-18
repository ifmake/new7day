import { Routes } from '@angular/router';
import { SotreSearchComponent } from './sotre-search/sotre-search.component';
import { StoreImportComponent } from './store-import/store-import.component';
import { StoreLoseComponent } from './store-lose/store-lose.component';

export const storeRouter: Routes = [
    { path: '', redirectTo: 'search', pathMatch: 'full'},
    {path: 'search', component: SotreSearchComponent},
    {path: 'import', component: StoreImportComponent},
    // {path: 'export', component: StoreExportComponent},
    {path: 'lose', component: StoreLoseComponent},
    {path: 'cost', loadChildren: './store-cost/store-cost.module#StoreCostModule'},
];
