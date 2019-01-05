import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreComponent } from './store.component';
import { RouterModule } from '@angular/router';
import { storeRouter } from './store.routing';
import { SotreSearchComponent } from './sotre-search/sotre-search.component';
import { StoreImportComponent } from './store-import/store-import.component';
import { StoreLoseComponent } from './store-lose/store-lose.component';
import { ShareModule } from '../share/share.module';
import { StoreExportComponent } from './store-export/store-export.component';
import { StoreRecordComponent } from './store-record/store-record.component';
import { StoreNextSearchComponent } from './store-next-search/store-next-search.component';

@NgModule({
  imports: [
    CommonModule,
    ShareModule,
    RouterModule.forChild(storeRouter)
  ],
  declarations: [
    StoreComponent,
    SotreSearchComponent,
    StoreImportComponent,
    StoreExportComponent,
    StoreLoseComponent,
    StoreRecordComponent,
    StoreNextSearchComponent]
})
export class StoreModule { }
