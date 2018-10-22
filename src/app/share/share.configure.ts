import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { HttpClientModule } from '@angular/common/http';
import { SearchComponent } from './search/search.component';
import { DrawerComponent } from './drawer/drawer.component';
import { ImgUploadComponent } from './img-upload/img-upload.component';
import { ProductService } from '../common/service/product.service';
import { LocalStorage } from '../common/storage/local.storage';
import { StatusAlertComponent } from './dialog/status-alert/status-alert.component';
import { PaginationComponent } from './pagination/pagination.component';
import { ComfirmAlertComponent } from './dialog/comfirm-alert/comfirm-alert.component';
import { StoreService } from '../common/service/store.service';
import { ProductCardComponent } from './product-card/product-card.component';
import { HandleLayoutComponent } from './handle-layout/handle-layout.component';
import { ProductRecordComponent } from './product-record/product-record.component';
import { TextHoverDirective } from '../common/directive/text-hover/text-hover.directive';
import { RecordCardComponent } from './record-card/record-card.component';
import { ModelComponent } from './model/model.component';
import { TextGridComponent } from './grid/text-grid/text-grid.component';
import { RowGridComponent } from './grid/row-grid/row-grid.component';
import { ImgListComponent } from './img-list/img-list.component';
import { ProductTagsComponent } from './product-tags/product-tags.component';

// 布局组件
const GridCompoennt = [
    TextGridComponent,
    RowGridComponent,
];
// 弹窗组件
const alertComponent = [
    ModelComponent,
    StatusAlertComponent,
    ComfirmAlertComponent,
];
// 公用模块
export  const moduleCommon = [
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    NgZorroAntdModule,
];

// 公用组件
export const componentCommon = [
    SearchComponent,
    DrawerComponent,
    ImgUploadComponent,
    PaginationComponent,
    ProductCardComponent,
    HandleLayoutComponent,
    ProductRecordComponent,
    ProductTagsComponent,
    RecordCardComponent,
    ImgListComponent,
    ...GridCompoennt,
    ...alertComponent
];

// entry组件
export const componentEntry = [];
// 服务
export const SERVICE = [
    LocalStorage,
    ProductService,
    StoreService,
];
// 指令
export const DERECTIVE = [
    TextHoverDirective,
];
