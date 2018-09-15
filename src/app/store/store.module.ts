import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreComponent } from './store.component';
import { RouterModule } from '@angular/router';
import { storeRouter } from './store.routing';
import { SotreSearchComponent } from './sotre-search/sotre-search.component';
import { StoreImportComponent } from './store-import/store-import.component';
import { StoreExportComponent } from './store-export/store-export.component';
import { StoreCostComponent } from './store-cost/store-cost.component';
import { StoreLoseComponent } from './store-lose/store-lose.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(storeRouter)
  ],
  declarations: [StoreComponent, SotreSearchComponent, StoreImportComponent, StoreExportComponent, StoreCostComponent, StoreLoseComponent]
})
export class StoreModule { }
