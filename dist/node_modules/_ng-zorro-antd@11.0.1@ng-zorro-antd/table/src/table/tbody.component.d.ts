/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { TemplateRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { NzTableStyleService } from '../table-style.service';
export declare class NzTbodyComponent {
    private nzTableStyleService;
    isInsideTable: boolean;
    showEmpty$: BehaviorSubject<boolean>;
    noResult$: BehaviorSubject<string | TemplateRef<any> | undefined>;
    listOfMeasureColumn$: BehaviorSubject<string[]>;
    constructor(nzTableStyleService: NzTableStyleService);
    onListOfAutoWidthChange(listOfAutoWidth: number[]): void;
}
