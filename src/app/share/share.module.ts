import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { moduleCommon, componentEntry, componentCommon, SERVICE, DERECTIVE } from './share.configure';
import {NZ_I18N, en_US } from 'ng-zorro-antd';


@NgModule({
  declarations: [
    ...componentCommon,
    ...componentEntry,
    ...DERECTIVE,


  ],
  imports: [
    CommonModule,
    ...moduleCommon,
  ],
  exports: [
    ...componentCommon,
    ...moduleCommon,
  ],
  entryComponents: [
    ...componentEntry
  ],

  providers: [
    { provide: NZ_I18N, useValue: en_US },
    ...SERVICE
  ]
})
export class ShareModule { }
