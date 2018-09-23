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
    StatusAlertComponent,
    DrawerComponent,
    ImgUploadComponent,
    PaginationComponent,
];
// entry组件
export const componentEntry = [];
// 服务
export const SERVICE = [
    LocalStorage,
    ProductService,
];
