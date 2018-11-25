import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialComponent } from './material.component';
import { RouterModule } from '@angular/router';
import { materialRouter } from './material.routing';
import { ProductComponent } from './product/product.component';
import { ShareModule } from '../share/share.module';
import { StoreComponent } from './store/store.component';
import { SupplierComponent } from './supplier/supplier.component';
import { StaffComponent } from './staff/staff.component';
import { ShopfrontComponent } from './shopfront/shopfront.component';

@NgModule({
  imports: [
    CommonModule,
    ShareModule,
    RouterModule.forChild(materialRouter)
  ],
  declarations: [MaterialComponent, ProductComponent, StoreComponent, SupplierComponent, StaffComponent, ShopfrontComponent]
})
export class MaterialModule { }
