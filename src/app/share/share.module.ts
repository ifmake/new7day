import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { moduleCommon, componentEntry, componentCommon, SERVICE } from './share.configure';
import {NZ_I18N, en_US } from 'ng-zorro-antd';


@NgModule({
  imports: [
    CommonModule,
    ...moduleCommon,
  ],
  exports: [
    ...componentCommon,
    ...moduleCommon
  ],
  entryComponents: [
    ...componentEntry
  ],
  declarations: [
    ...componentCommon,
    ...componentEntry,
  ],
  providers: [
    { provide: NZ_I18N, useValue: en_US },
    ...SERVICE
  ]
})
export class ShareModule { }
