/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { AfterViewInit, OnChanges, OnDestroy, QueryList } from '@angular/core';
import { NzConfigKey, NzConfigService } from 'ng-zorro-antd/core/config';
import { NzSpaceItemComponent } from './space-item.component';
import { NzSpaceAlign, NzSpaceDirection, NzSpaceSize } from './types';
export declare class NzSpaceComponent implements OnChanges, OnDestroy, AfterViewInit {
    nzConfigService: NzConfigService;
    readonly _nzModuleName: NzConfigKey;
    nzDirection: NzSpaceDirection;
    nzAlign?: NzSpaceAlign;
    nzSize: number | NzSpaceSize;
    nzSpaceItemComponents: QueryList<NzSpaceItemComponent>;
    mergedAlign?: NzSpaceAlign;
    private destroy$;
    constructor(nzConfigService: NzConfigService);
    private updateSpaceItems;
    ngOnChanges(): void;
    ngOnDestroy(): void;
    ngAfterViewInit(): void;
}
