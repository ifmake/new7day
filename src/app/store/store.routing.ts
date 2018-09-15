import { Routes } from '@angular/router';
import { SotreSearchComponent } from './sotre-search/sotre-search.component';
import { StoreImportComponent } from './store-import/store-import.component';
import { StoreExportComponent } from './store-export/store-export.component';
import { StoreCostComponent } from './store-cost/store-cost.component';
import { StoreLoseComponent } from './store-lose/store-lose.component';

export const storeRouter: Routes = [
    { path: '', redirectTo: 'search', pathMatch: 'full'},
    {path: 'search', component: SotreSearchComponent},
    {path: 'import', component: StoreImportComponent},
    {path: 'export', component: StoreExportComponent},
    {path: 'cost', component: StoreCostComponent},
    {path: 'lose', component: StoreLoseComponent},
];
