import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../share/share.module';
import { ShopIncomeComponent } from './shop-income/shop-income.component';
import { RouterModule } from '@angular/router';
import { incomeRouter } from './income.routing';
import { IncomeComponent } from './income.component';
import { IncomeBillComponent } from './shop-income/income-bill/income-bill.component';

@NgModule({
  imports: [
    CommonModule,
    ShareModule,
    RouterModule.forChild(incomeRouter)
  ],
  declarations: [ShopIncomeComponent, IncomeComponent, IncomeBillComponent]
})
export class IncomeModule { }
