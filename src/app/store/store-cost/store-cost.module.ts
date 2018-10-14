import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/share/share.module';
import { StoreCostComponent } from './store-cost.component';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
  imports: [
    CommonModule,
    ShareModule,
    NgxEchartsModule,
    RouterModule.forChild([
        {path: '', component: StoreCostComponent},
    ])
  ],
  declarations: [
    StoreCostComponent
  ]
})
export class StoreCostModule { }
