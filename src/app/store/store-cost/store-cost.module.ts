import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ShareModule } from 'src/app/share/share.module';
import { StoreCostComponent } from './store-cost.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { DepotFinalComponent } from './depot-final/depot-final.component';
import { ShopFinalComponent } from './shop-final/shop-final.component';
import { ProductFinalComponent } from './product-final/product-final.component';

@NgModule({
  imports: [
    CommonModule,
    ShareModule,
    NgxEchartsModule,
    RouterModule.forChild([
        {path: '', component: StoreCostComponent, children: [
          {
            path: 'depot_final',
            component: DepotFinalComponent,
            data: { title: '仓库成本', module: 'store/cost', power: 'hide' }
          },
          {
            path: 'product_final',
            component: ProductFinalComponent,
            data: { title: '商品成本', module: 'store/cost', power: 'hide' }
          },
          {
            path: 'shop_final',
            component: ShopFinalComponent,
            data: { title: '店面成本', module: 'store/cost', power: 'hide' }
          },
        ]},
    ])
  ],
  declarations: [
    StoreCostComponent,
    DepotFinalComponent,
    ShopFinalComponent,
    ProductFinalComponent
  ]
})
export class StoreCostModule { }
