/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { TemplateRef } from '@angular/core';
import { NzSafeAny } from 'ng-zorro-antd/core/types';
import { ReplaySubject } from 'rxjs';
import { NzThMeasureDirective } from './cell/th-measure.directive';
export declare class NzTableStyleService {
    theadTemplate$: ReplaySubject<TemplateRef<any>>;
    hasFixLeft$: ReplaySubject<boolean>;
    hasFixRight$: ReplaySubject<boolean>;
    hostWidth$: ReplaySubject<number>;
    columnCount$: ReplaySubject<number>;
    showEmpty$: ReplaySubject<boolean>;
    noResult$: ReplaySubject<string | TemplateRef<any> | undefined>;
    private listOfThWidthConfigPx$;
    private tableWidthConfigPx$;
    manualWidthConfigPx$: import("rxjs").Observable<import("./table.types").NzTableSortOrder[]>;
    private listOfAutoWidthPx$;
    listOfListOfThWidthPx$: import("rxjs").Observable<import("./table.types").NzTableSortOrder[]>;
    listOfMeasureColumn$: ReplaySubject<string[]>;
    listOfListOfThWidth$: import("rxjs").Observable<number[]>;
    enableAutoMeasure$: ReplaySubject<boolean>;
    setTheadTemplate(template: TemplateRef<NzSafeAny>): void;
    setHasFixLeft(hasFixLeft: boolean): void;
    setHasFixRight(hasFixRight: boolean): void;
    setTableWidthConfig(widthConfig: Array<string | null>): void;
    setListOfTh(listOfTh: NzThMeasureDirective[]): void;
    setListOfMeasureColumn(listOfTh: NzThMeasureDirective[]): void;
    setListOfAutoWidth(listOfAutoWidth: number[]): void;
    setShowEmpty(showEmpty: boolean): void;
    setNoResult(noResult: string | TemplateRef<NzSafeAny> | undefined): void;
    setScroll(scrollX: string | null, scrollY: string | null): void;
    constructor();
}
