/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { __decorate, __metadata } from "tslib";
import { Directionality } from '@angular/cdk/bidi';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Optional, Output, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { InputBoolean, toArray } from 'ng-zorro-antd/core/util';
import { NzI18nService } from 'ng-zorro-antd/i18n';
import { of, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NzTransferListComponent } from './transfer-list.component';
export class NzTransferComponent {
    // #endregion
    constructor(cdr, i18n, elementRef, directionality) {
        this.cdr = cdr;
        this.i18n = i18n;
        this.elementRef = elementRef;
        this.directionality = directionality;
        this.unsubscribe$ = new Subject();
        this.leftFilter = '';
        this.rightFilter = '';
        this.dir = 'ltr';
        // #region fields
        this.nzDisabled = false;
        this.nzDataSource = [];
        this.nzTitles = ['', ''];
        this.nzOperations = [];
        this.nzListStyle = {};
        this.nzShowSelectAll = true;
        this.nzCanMove = (arg) => of(arg.list);
        this.nzRenderList = null;
        this.nzRender = null;
        this.nzFooter = null;
        this.nzShowSearch = false;
        this.nzTargetKeys = [];
        this.nzSelectedKeys = [];
        // events
        this.nzChange = new EventEmitter();
        this.nzSearchChange = new EventEmitter();
        this.nzSelectChange = new EventEmitter();
        // #endregion
        // #region process data
        // left
        this.leftDataSource = [];
        // right
        this.rightDataSource = [];
        this.handleLeftSelectAll = (checked) => this.handleSelect('left', checked);
        this.handleRightSelectAll = (checked) => this.handleSelect('right', checked);
        this.handleLeftSelect = (item) => this.handleSelect('left', !!item.checked, item);
        this.handleRightSelect = (item) => this.handleSelect('right', !!item.checked, item);
        // #endregion
        // #region operation
        this.leftActive = false;
        this.rightActive = false;
        this.moveToLeft = () => this.moveTo('left');
        this.moveToRight = () => this.moveTo('right');
        // TODO: move to host after View Engine deprecation
        this.elementRef.nativeElement.classList.add('ant-transfer');
    }
    splitDataSource() {
        this.leftDataSource = [];
        this.rightDataSource = [];
        this.nzDataSource.forEach(record => {
            if (record.direction === 'right') {
                record.direction = 'right';
                this.rightDataSource.push(record);
            }
            else {
                record.direction = 'left';
                this.leftDataSource.push(record);
            }
        });
    }
    getCheckedData(direction) {
        return this[direction === 'left' ? 'leftDataSource' : 'rightDataSource'].filter(w => w.checked);
    }
    handleSelect(direction, checked, item) {
        const list = this.getCheckedData(direction);
        this.updateOperationStatus(direction, list.length);
        this.nzSelectChange.emit({ direction, checked, list, item });
    }
    handleFilterChange(ret) {
        this.nzSearchChange.emit(ret);
    }
    updateOperationStatus(direction, count) {
        this[direction === 'right' ? 'leftActive' : 'rightActive'] =
            (typeof count === 'undefined' ? this.getCheckedData(direction).filter(w => !w.disabled).length : count) > 0;
    }
    moveTo(direction) {
        const oppositeDirection = direction === 'left' ? 'right' : 'left';
        this.updateOperationStatus(oppositeDirection, 0);
        const datasource = direction === 'left' ? this.rightDataSource : this.leftDataSource;
        const moveList = datasource.filter(item => item.checked === true && !item.disabled);
        this.nzCanMove({ direction, list: moveList }).subscribe(newMoveList => this.truthMoveTo(direction, newMoveList.filter(i => !!i)), () => moveList.forEach(i => (i.checked = false)));
    }
    truthMoveTo(direction, list) {
        const oppositeDirection = direction === 'left' ? 'right' : 'left';
        const datasource = direction === 'left' ? this.rightDataSource : this.leftDataSource;
        const targetDatasource = direction === 'left' ? this.leftDataSource : this.rightDataSource;
        for (const item of list) {
            item.checked = false;
            item.hide = false;
            item.direction = direction;
            datasource.splice(datasource.indexOf(item), 1);
        }
        targetDatasource.splice(0, 0, ...list);
        this.updateOperationStatus(oppositeDirection);
        this.nzChange.emit({
            from: oppositeDirection,
            to: direction,
            list
        });
        this.markForCheckAllList();
    }
    markForCheckAllList() {
        if (!this.lists) {
            return;
        }
        this.lists.forEach(i => i.markForCheck());
    }
    handleNzTargetKeys() {
        const keys = toArray(this.nzTargetKeys);
        const hasOwnKey = (e) => e.hasOwnProperty('key');
        this.leftDataSource.forEach(e => {
            if (hasOwnKey(e) && keys.indexOf(e.key) !== -1 && !e.disabled) {
                e.checked = true;
            }
        });
        this.moveToRight();
    }
    handleNzSelectedKeys() {
        const keys = toArray(this.nzSelectedKeys);
        this.nzDataSource.forEach(e => {
            if (keys.indexOf(e.key) !== -1) {
                e.checked = true;
            }
        });
        const term = (ld) => ld.disabled === false && ld.checked === true;
        this.rightActive = this.leftDataSource.some(term);
        this.leftActive = this.rightDataSource.some(term);
    }
    ngOnInit() {
        var _a;
        this.i18n.localeChange.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
            this.locale = this.i18n.getLocaleData('Transfer');
            this.markForCheckAllList();
        });
        this.dir = this.directionality.value;
        (_a = this.directionality.change) === null || _a === void 0 ? void 0 : _a.pipe(takeUntil(this.unsubscribe$)).subscribe((direction) => {
            this.dir = direction;
            this.cdr.detectChanges();
        });
    }
    ngOnChanges(changes) {
        if (changes.nzDataSource) {
            this.splitDataSource();
            this.updateOperationStatus('left');
            this.updateOperationStatus('right');
            this.cdr.detectChanges();
            this.markForCheckAllList();
        }
        if (changes.nzTargetKeys) {
            this.handleNzTargetKeys();
        }
        if (changes.nzSelectedKeys) {
            this.handleNzSelectedKeys();
        }
    }
    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
NzTransferComponent.decorators = [
    { type: Component, args: [{
                selector: 'nz-transfer',
                exportAs: 'nzTransfer',
                preserveWhitespaces: false,
                template: `
    <nz-transfer-list
      class="ant-transfer-list"
      [ngStyle]="nzListStyle"
      data-direction="left"
      direction="left"
      [titleText]="nzTitles[0]"
      [showSelectAll]="nzShowSelectAll"
      [dataSource]="leftDataSource"
      [filter]="leftFilter"
      [filterOption]="nzFilterOption"
      (filterChange)="handleFilterChange($event)"
      [renderList]="nzRenderList && nzRenderList[0]"
      [render]="nzRender"
      [disabled]="nzDisabled"
      [showSearch]="nzShowSearch"
      [searchPlaceholder]="nzSearchPlaceholder || locale?.searchPlaceholder"
      [notFoundContent]="nzNotFoundContent"
      [itemUnit]="nzItemUnit || locale?.itemUnit"
      [itemsUnit]="nzItemsUnit || locale?.itemsUnit"
      [footer]="nzFooter"
      (handleSelect)="handleLeftSelect($event)"
      (handleSelectAll)="handleLeftSelectAll($event)"
    ></nz-transfer-list>
    <div *ngIf="dir !== 'rtl'" class="ant-transfer-operation">
      <button nz-button (click)="moveToLeft()" [disabled]="nzDisabled || !leftActive" [nzType]="'primary'" [nzSize]="'small'">
        <i nz-icon nzType="left"></i>
        <span *ngIf="nzOperations[1]">{{ nzOperations[1] }}</span>
      </button>
      <button nz-button (click)="moveToRight()" [disabled]="nzDisabled || !rightActive" [nzType]="'primary'" [nzSize]="'small'">
        <i nz-icon nzType="right"></i>
        <span *ngIf="nzOperations[0]">{{ nzOperations[0] }}</span>
      </button>
    </div>
    <div *ngIf="dir === 'rtl'" class="ant-transfer-operation">
      <button nz-button (click)="moveToRight()" [disabled]="nzDisabled || !rightActive" [nzType]="'primary'" [nzSize]="'small'">
        <i nz-icon nzType="left"></i>
        <span *ngIf="nzOperations[0]">{{ nzOperations[0] }}</span>
      </button>
      <button nz-button (click)="moveToLeft()" [disabled]="nzDisabled || !leftActive" [nzType]="'primary'" [nzSize]="'small'">
        <i nz-icon nzType="right"></i>
        <span *ngIf="nzOperations[1]">{{ nzOperations[1] }}</span>
      </button>
    </div>
    <nz-transfer-list
      class="ant-transfer-list"
      [ngStyle]="nzListStyle"
      data-direction="right"
      direction="right"
      [titleText]="nzTitles[1]"
      [showSelectAll]="nzShowSelectAll"
      [dataSource]="rightDataSource"
      [filter]="rightFilter"
      [filterOption]="nzFilterOption"
      (filterChange)="handleFilterChange($event)"
      [renderList]="nzRenderList && nzRenderList[1]"
      [render]="nzRender"
      [disabled]="nzDisabled"
      [showSearch]="nzShowSearch"
      [searchPlaceholder]="nzSearchPlaceholder || locale?.searchPlaceholder"
      [notFoundContent]="nzNotFoundContent"
      [itemUnit]="nzItemUnit || locale?.itemUnit"
      [itemsUnit]="nzItemsUnit || locale?.itemsUnit"
      [footer]="nzFooter"
      (handleSelect)="handleRightSelect($event)"
      (handleSelectAll)="handleRightSelectAll($event)"
    ></nz-transfer-list>
  `,
                host: {
                    '[class.ant-transfer-rtl]': `dir === 'rtl'`,
                    '[class.ant-transfer-disabled]': `nzDisabled`,
                    '[class.ant-transfer-customize-list]': `nzRenderList`
                },
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush
            },] }
];
NzTransferComponent.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: NzI18nService },
    { type: ElementRef },
    { type: Directionality, decorators: [{ type: Optional }] }
];
NzTransferComponent.propDecorators = {
    lists: [{ type: ViewChildren, args: [NzTransferListComponent,] }],
    nzDisabled: [{ type: Input }],
    nzDataSource: [{ type: Input }],
    nzTitles: [{ type: Input }],
    nzOperations: [{ type: Input }],
    nzListStyle: [{ type: Input }],
    nzShowSelectAll: [{ type: Input }],
    nzItemUnit: [{ type: Input }],
    nzItemsUnit: [{ type: Input }],
    nzCanMove: [{ type: Input }],
    nzRenderList: [{ type: Input }],
    nzRender: [{ type: Input }],
    nzFooter: [{ type: Input }],
    nzShowSearch: [{ type: Input }],
    nzFilterOption: [{ type: Input }],
    nzSearchPlaceholder: [{ type: Input }],
    nzNotFoundContent: [{ type: Input }],
    nzTargetKeys: [{ type: Input }],
    nzSelectedKeys: [{ type: Input }],
    nzChange: [{ type: Output }],
    nzSearchChange: [{ type: Output }],
    nzSelectChange: [{ type: Output }]
};
__decorate([
    InputBoolean(),
    __metadata("design:type", Object)
], NzTransferComponent.prototype, "nzDisabled", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Object)
], NzTransferComponent.prototype, "nzShowSelectAll", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Object)
], NzTransferComponent.prototype, "nzShowSearch", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJhbnNmZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uL2NvbXBvbmVudHMvdHJhbnNmZXIvIiwic291cmNlcyI6WyJ0cmFuc2Zlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHOztBQUVILE9BQU8sRUFBYSxjQUFjLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUM5RCxPQUFPLEVBQ0wsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixLQUFLLEVBSUwsUUFBUSxFQUNSLE1BQU0sRUFDTixTQUFTLEVBR1QsWUFBWSxFQUNaLGlCQUFpQixFQUNsQixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsWUFBWSxFQUFFLE9BQU8sRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ2hFLE9BQU8sRUFBRSxhQUFhLEVBQTJCLE1BQU0sb0JBQW9CLENBQUM7QUFFNUUsT0FBTyxFQUFjLEVBQUUsRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDL0MsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRzNDLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBa0ZwRSxNQUFNLE9BQU8sbUJBQW1CO0lBdUk5QixhQUFhO0lBRWIsWUFDVSxHQUFzQixFQUN0QixJQUFtQixFQUNuQixVQUFzQixFQUNWLGNBQThCO1FBSDFDLFFBQUcsR0FBSCxHQUFHLENBQW1CO1FBQ3RCLFNBQUksR0FBSixJQUFJLENBQWU7UUFDbkIsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUNWLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQXhJNUMsaUJBQVksR0FBRyxJQUFJLE9BQU8sRUFBUSxDQUFDO1FBTTNDLGVBQVUsR0FBRyxFQUFFLENBQUM7UUFDaEIsZ0JBQVcsR0FBRyxFQUFFLENBQUM7UUFDakIsUUFBRyxHQUFjLEtBQUssQ0FBQztR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QixFQUFFLEtBQUs7Z0JBQzFCLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQW1FVDtnQkFDRCxJQUFJLEVBQUU7b0JBQ0osMEJBQTBCLEVBQUUsZUFBZTtvQkFDM0MsK0JBQStCLEVBQUUsWUFBWTtvQkFDN0MscUNBQXFDLEVBQUUsY0FBYztpQkFDdEQ7Z0JBQ0QsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7Z0JBQ3JDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2FBQ2hEOzs7WUF6R0MsaUJBQWlCO1lBa0JWLGFBQWE7WUFoQnBCLFVBQVU7WUFMUSxjQUFjLHVCQTBQN0IsUUFBUTs7O29CQXRJVixZQUFZLFNBQUMsdUJBQXVCO3lCQVVwQyxLQUFLOzJCQUNMLEtBQUs7dUJBQ0wsS0FBSzsyQkFDTCxLQUFLOzBCQUNMLEtBQUs7OEJBQ0wsS0FBSzt5QkFDTCxLQUFLOzBCQUNMLEtBQUs7d0JBQ0wsS0FBSzsyQkFDTCxLQUFLO3VCQUNMLEtBQUs7dUJBQ0wsS0FBSzsyQkFDTCxLQUFLOzZCQUNMLEtBQUs7a0NBQ0wsS0FBSztnQ0FDTCxLQUFLOzJCQUNMLEtBQUs7NkJBQ0wsS0FBSzt1QkFHTCxNQUFNOzZCQUNOLE1BQU07NkJBQ04sTUFBTTs7QUF0QmtCO0lBQWYsWUFBWSxFQUFFOzt1REFBb0I7QUFLbkI7SUFBZixZQUFZLEVBQUU7OzREQUF3QjtBQU92QjtJQUFmLFlBQVksRUFBRTs7eURBQXNCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2dpdGh1Yi5jb20vTkctWk9SUk8vbmctem9ycm8tYW50ZC9ibG9iL21hc3Rlci9MSUNFTlNFXG4gKi9cblxuaW1wb3J0IHsgRGlyZWN0aW9uLCBEaXJlY3Rpb25hbGl0eSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBRdWVyeUxpc3QsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3Q2hpbGRyZW4sXG4gIFZpZXdFbmNhcHN1bGF0aW9uXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQm9vbGVhbklucHV0LCBOZ1N0eWxlSW50ZXJmYWNlLCBOelNhZmVBbnkgfSBmcm9tICduZy16b3Jyby1hbnRkL2NvcmUvdHlwZXMnO1xuaW1wb3J0IHsgSW5wdXRCb29sZWFuLCB0b0FycmF5IH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL3V0aWwnO1xuaW1wb3J0IHsgTnpJMThuU2VydmljZSwgTnpUcmFuc2ZlckkxOG5JbnRlcmZhY2UgfSBmcm9tICduZy16b3Jyby1hbnRkL2kxOG4nO1xuXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBvZiwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyBUcmFuc2ZlckNhbk1vdmUsIFRyYW5zZmVyQ2hhbmdlLCBUcmFuc2ZlckRpcmVjdGlvbiwgVHJhbnNmZXJJdGVtLCBUcmFuc2ZlclNlYXJjaENoYW5nZSwgVHJhbnNmZXJTZWxlY3RDaGFuZ2UgfSBmcm9tICcuL2ludGVyZmFjZSc7XG5pbXBvcnQgeyBOelRyYW5zZmVyTGlzdENvbXBvbmVudCB9IGZyb20gJy4vdHJhbnNmZXItbGlzdC5jb21wb25lbnQnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduei10cmFuc2ZlcicsXG4gIGV4cG9ydEFzOiAnbnpUcmFuc2ZlcicsXG4gIHByZXNlcnZlV2hpdGVzcGFjZXM6IGZhbHNlLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuei10cmFuc2Zlci1saXN0XG4gICAgICBjbGFzcz1cImFudC10cmFuc2Zlci1saXN0XCJcbiAgICAgIFtuZ1N0eWxlXT1cIm56TGlzdFN0eWxlXCJcbiAgICAgIGRhdGEtZGlyZWN0aW9uPVwibGVmdFwiXG4gICAgICBkaXJlY3Rpb249XCJsZWZ0XCJcbiAgICAgIFt0aXRsZVRleHRdPVwibnpUaXRsZXNbMF1cIlxuICAgICAgW3Nob3dTZWxlY3RBbGxdPVwibnpTaG93U2VsZWN0QWxsXCJcbiAgICAgIFtkYXRhU291cmNlXT1cImxlZnREYXRhU291cmNlXCJcbiAgICAgIFtmaWx0ZXJdPVwibGVmdEZpbHRlclwiXG4gICAgICBbZmlsdGVyT3B0aW9uXT1cIm56RmlsdGVyT3B0aW9uXCJcbiAgICAgIChmaWx0ZXJDaGFuZ2UpPVwiaGFuZGxlRmlsdGVyQ2hhbmdlKCRldmVudClcIlxuICAgICAgW3JlbmRlckxpc3RdPVwibnpSZW5kZXJMaXN0ICYmIG56UmVuZGVyTGlzdFswXVwiXG4gICAgICBbcmVuZGVyXT1cIm56UmVuZGVyXCJcbiAgICAgIFtkaXNhYmxlZF09XCJuekRpc2FibGVkXCJcbiAgICAgIFtzaG93U2VhcmNoXT1cIm56U2hvd1NlYXJjaFwiXG4gICAgICBbc2VhcmNoUGxhY2Vob2xkZXJdPVwibnpTZWFyY2hQbGFjZWhvbGRlciB8fCBsb2NhbGU/LnNlYXJjaFBsYWNlaG9sZGVyXCJcbiAgICAgIFtub3RGb3VuZENvbnRlbnRdPVwibnpOb3RGb3VuZENvbnRlbnRcIlxuICAgICAgW2l0ZW1Vbml0XT1cIm56SXRlbVVuaXQgfHwgbG9jYWxlPy5pdGVtVW5pdFwiXG4gICAgICBbaXRlbXNVbml0XT1cIm56SXRlbXNVbml0IHx8IGxvY2FsZT8uaXRlbXNVbml0XCJcbiAgICAgIFtmb290ZXJdPVwibnpGb290ZXJcIlxuICAgICAgKGhhbmRsZVNlbGVjdCk9XCJoYW5kbGVMZWZ0U2VsZWN0KCRldmVudClcIlxuICAgICAgKGhhbmRsZVNlbGVjdEFsbCk9XCJoYW5kbGVMZWZ0U2VsZWN0QWxsKCRldmVudClcIlxuICAgID48L256LXRyYW5zZmVyLWxpc3Q+XG4gICAgPGRpdiAqbmdJZj1cImRpciAhPT0gJ3J0bCdcIiBjbGFzcz1cImFudC10cmFuc2Zlci1vcGVyYXRpb25cIj5cbiAgICAgIDxidXR0b24gbnotYnV0dG9uIChjbGljayk9XCJtb3ZlVG9MZWZ0KClcIiBbZGlzYWJsZWRdPVwibnpEaXNhYmxlZCB8fCAhbGVmdEFjdGl2ZVwiIFtuelR5cGVdPVwiJ3ByaW1hcnknXCIgW256U2l6ZV09XCInc21hbGwnXCI+XG4gICAgICAgIDxpIG56LWljb24gbnpUeXBlPVwibGVmdFwiPjwvaT5cbiAgICAgICAgPHNwYW4gKm5nSWY9XCJuek9wZXJhdGlvbnNbMV1cIj57eyBuek9wZXJhdGlvbnNbMV0gfX08L3NwYW4+XG4gICAgICA8L2J1dHRvbj5cbiAgICAgIDxidXR0b24gbnotYnV0dG9uIChjbGljayk9XCJtb3ZlVG9SaWdodCgpXCIgW2Rpc2FibGVkXT1cIm56RGlzYWJsZWQgfHwgIXJpZ2h0QWN0aXZlXCIgW256VHlwZV09XCIncHJpbWFyeSdcIiBbbnpTaXplXT1cIidzbWFsbCdcIj5cbiAgICAgICAgPGkgbnotaWNvbiBuelR5cGU9XCJyaWdodFwiPjwvaT5cbiAgICAgICAgPHNwYW4gKm5nSWY9XCJuek9wZXJhdGlvbnNbMF1cIj57eyBuek9wZXJhdGlvbnNbMF0gfX08L3NwYW4+XG4gICAgICA8L2J1dHRvbj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2ICpuZ0lmPVwiZGlyID09PSAncnRsJ1wiIGNsYXNzPVwiYW50LXRyYW5zZmVyLW9wZXJhdGlvblwiPlxuICAgICAgPGJ1dHRvbiBuei1idXR0b24gKGNsaWNrKT1cIm1vdmVUb1JpZ2h0KClcIiBbZGlzYWJsZWRdPVwibnpEaXNhYmxlZCB8fCAhcmlnaHRBY3RpdmVcIiBbbnpUeXBlXT1cIidwcmltYXJ5J1wiIFtuelNpemVdPVwiJ3NtYWxsJ1wiPlxuICAgICAgICA8aSBuei1pY29uIG56VHlwZT1cImxlZnRcIj48L2k+XG4gICAgICAgIDxzcGFuICpuZ0lmPVwibnpPcGVyYXRpb25zWzBdXCI+e3sgbnpPcGVyYXRpb25zWzBdIH19PC9zcGFuPlxuICAgICAgPC9idXR0b24+XG4gICAgICA8YnV0dG9uIG56LWJ1dHRvbiAoY2xpY2spPVwibW92ZVRvTGVmdCgpXCIgW2Rpc2FibGVkXT1cIm56RGlzYWJsZWQgfHwgIWxlZnRBY3RpdmVcIiBbbnpUeXBlXT1cIidwcmltYXJ5J1wiIFtuelNpemVdPVwiJ3NtYWxsJ1wiPlxuICAgICAgICA8aSBuei1pY29uIG56VHlwZT1cInJpZ2h0XCI+PC9pPlxuICAgICAgICA8c3BhbiAqbmdJZj1cIm56T3BlcmF0aW9uc1sxXVwiPnt7IG56T3BlcmF0aW9uc1sxXSB9fTwvc3Bhbj5cbiAgICAgIDwvYnV0dG9uPlxuICAgIDwvZGl2PlxuICAgIDxuei10cmFuc2Zlci1saXN0XG4gICAgICBjbGFzcz1cImFudC10cmFuc2Zlci1saXN0XCJcbiAgICAgIFtuZ1N0eWxlXT1cIm56TGlzdFN0eWxlXCJcbiAgICAgIGRhdGEtZGlyZWN0aW9uPVwicmlnaHRcIlxuICAgICAgZGlyZWN0aW9uPVwicmlnaHRcIlxuICAgICAgW3RpdGxlVGV4dF09XCJuelRpdGxlc1sxXVwiXG4gICAgICBbc2hvd1NlbGVjdEFsbF09XCJuelNob3dTZWxlY3RBbGxcIlxuICAgICAgW2RhdGFTb3VyY2VdPVwicmlnaHREYXRhU291cmNlXCJcbiAgICAgIFtmaWx0ZXJdPVwicmlnaHRGaWx0ZXJcIlxuICAgICAgW2ZpbHRlck9wdGlvbl09XCJuekZpbHRlck9wdGlvblwiXG4gICAgICAoZmlsdGVyQ2hhbmdlKT1cImhhbmRsZUZpbHRlckNoYW5nZSgkZXZlbnQpXCJcbiAgICAgIFtyZW5kZXJMaXN0XT1cIm56UmVuZGVyTGlzdCAmJiBuelJlbmRlckxpc3RbMV1cIlxuICAgICAgW3JlbmRlcl09XCJuelJlbmRlclwiXG4gICAgICBbZGlzYWJsZWRdPVwibnpEaXNhYmxlZFwiXG4gICAgICBbc2hvd1NlYXJjaF09XCJuelNob3dTZWFyY2hcIlxuICAgICAgW3NlYXJjaFBsYWNlaG9sZGVyXT1cIm56U2VhcmNoUGxhY2Vob2xkZXIgfHwgbG9jYWxlPy5zZWFyY2hQbGFjZWhvbGRlclwiXG4gICAgICBbbm90Rm91bmRDb250ZW50XT1cIm56Tm90Rm91bmRDb250ZW50XCJcbiAgICAgIFtpdGVtVW5pdF09XCJuekl0ZW1Vbml0IHx8IGxvY2FsZT8uaXRlbVVuaXRcIlxuICAgICAgW2l0ZW1zVW5pdF09XCJuekl0ZW1zVW5pdCB8fCBsb2NhbGU/Lml0ZW1zVW5pdFwiXG4gICAgICBbZm9vdGVyXT1cIm56Rm9vdGVyXCJcbiAgICAgIChoYW5kbGVTZWxlY3QpPVwiaGFuZGxlUmlnaHRTZWxlY3QoJGV2ZW50KVwiXG4gICAgICAoaGFuZGxlU2VsZWN0QWxsKT1cImhhbmRsZVJpZ2h0U2VsZWN0QWxsKCRldmVudClcIlxuICAgID48L256LXRyYW5zZmVyLWxpc3Q+XG4gIGAsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLmFudC10cmFuc2Zlci1ydGxdJzogYGRpciA9PT0gJ3J0bCdgLFxuICAgICdbY2xhc3MuYW50LXRyYW5zZmVyLWRpc2FibGVkXSc6IGBuekRpc2FibGVkYCxcbiAgICAnW2NsYXNzLmFudC10cmFuc2Zlci1jdXN0b21pemUtbGlzdF0nOiBgbnpSZW5kZXJMaXN0YFxuICB9LFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaFxufSlcbmV4cG9ydCBjbGFzcyBOelRyYW5zZmVyQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9uekRpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9uelNob3dTZWxlY3RBbGw6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX256U2hvd1NlYXJjaDogQm9vbGVhbklucHV0O1xuXG4gIHByaXZhdGUgdW5zdWJzY3JpYmUkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICBAVmlld0NoaWxkcmVuKE56VHJhbnNmZXJMaXN0Q29tcG9uZW50KVxuICBwcml2YXRlIGxpc3RzITogUXVlcnlMaXN0PE56VHJhbnNmZXJMaXN0Q29tcG9uZW50PjtcbiAgbG9jYWxlITogTnpUcmFuc2ZlckkxOG5JbnRlcmZhY2U7XG5cbiAgbGVmdEZpbHRlciA9ICcnO1xuICByaWdodEZpbHRlciA9ICcnO1xuICBkaXI6IERpcmVjdGlvbiA9ICdsdHInO1xuXG4gIC8vICNyZWdpb24gZmllbGRzXG5cbiAgQElucHV0KCkgQElucHV0Qm9vbGVhbigpIG56RGlzYWJsZWQgPSBmYWxzZTtcbiAgQElucHV0KCkgbnpEYXRhU291cmNlOiBUcmFuc2Zlckl0ZW1bXSA9IFtdO1xuICBASW5wdXQoKSBuelRpdGxlczogc3RyaW5nW10gPSBbJycsICcnXTtcbiAgQElucHV0KCkgbnpPcGVyYXRpb25zOiBzdHJpbmdbXSA9IFtdO1xuICBASW5wdXQoKSBuekxpc3RTdHlsZTogTmdTdHlsZUludGVyZmFjZSA9IHt9O1xuICBASW5wdXQoKSBASW5wdXRCb29sZWFuKCkgbnpTaG93U2VsZWN0QWxsID0gdHJ1ZTtcbiAgQElucHV0KCkgbnpJdGVtVW5pdD86IHN0cmluZztcbiAgQElucHV0KCkgbnpJdGVtc1VuaXQ/OiBzdHJpbmc7XG4gIEBJbnB1dCgpIG56Q2FuTW92ZTogKGFyZzogVHJhbnNmZXJDYW5Nb3ZlKSA9PiBPYnNlcnZhYmxlPFRyYW5zZmVySXRlbVtdPiA9IChhcmc6IFRyYW5zZmVyQ2FuTW92ZSkgPT4gb2YoYXJnLmxpc3QpO1xuICBASW5wdXQoKSBuelJlbmRlckxpc3Q6IEFycmF5PFRlbXBsYXRlUmVmPE56U2FmZUFueT4gfCBudWxsPiB8IG51bGwgPSBudWxsO1xuICBASW5wdXQoKSBuelJlbmRlcjogVGVtcGxhdGVSZWY8TnpTYWZlQW55PiB8IG51bGwgPSBudWxsO1xuICBASW5wdXQoKSBuekZvb3RlcjogVGVtcGxhdGVSZWY8TnpTYWZlQW55PiB8IG51bGwgPSBudWxsO1xuICBASW5wdXQoKSBASW5wdXRCb29sZWFuKCkgbnpTaG93U2VhcmNoID0gZmFsc2U7XG4gIEBJbnB1dCgpIG56RmlsdGVyT3B0aW9uPzogKGlucHV0VmFsdWU6IHN0cmluZywgaXRlbTogVHJhbnNmZXJJdGVtKSA9PiBib29sZWFuO1xuICBASW5wdXQoKSBuelNlYXJjaFBsYWNlaG9sZGVyPzogc3RyaW5nO1xuICBASW5wdXQoKSBuek5vdEZvdW5kQ29udGVudD86IHN0cmluZztcbiAgQElucHV0KCkgbnpUYXJnZXRLZXlzOiBzdHJpbmdbXSA9IFtdO1xuICBASW5wdXQoKSBuelNlbGVjdGVkS2V5czogc3RyaW5nW10gPSBbXTtcblxuICAvLyBldmVudHNcbiAgQE91dHB1dCgpIHJlYWRvbmx5IG56Q2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxUcmFuc2ZlckNoYW5nZT4oKTtcbiAgQE91dHB1dCgpIHJlYWRvbmx5IG56U2VhcmNoQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxUcmFuc2ZlclNlYXJjaENoYW5nZT4oKTtcbiAgQE91dHB1dCgpIHJlYWRvbmx5IG56U2VsZWN0Q2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxUcmFuc2ZlclNlbGVjdENoYW5nZT4oKTtcblxuICAvLyAjZW5kcmVnaW9uXG5cbiAgLy8gI3JlZ2lvbiBwcm9jZXNzIGRhdGFcblxuICAvLyBsZWZ0XG4gIGxlZnREYXRhU291cmNlOiBUcmFuc2Zlckl0ZW1bXSA9IFtdO1xuXG4gIC8vIHJpZ2h0XG4gIHJpZ2h0RGF0YVNvdXJjZTogVHJhbnNmZXJJdGVtW10gPSBbXTtcblxuICBwcml2YXRlIHNwbGl0RGF0YVNvdXJjZSgpOiB2b2lkIHtcbiAgICB0aGlzLmxlZnREYXRhU291cmNlID0gW107XG4gICAgdGhpcy5yaWdodERhdGFTb3VyY2UgPSBbXTtcbiAgICB0aGlzLm56RGF0YVNvdXJjZS5mb3JFYWNoKHJlY29yZCA9PiB7XG4gICAgICBpZiAocmVjb3JkLmRpcmVjdGlvbiA9PT0gJ3JpZ2h0Jykge1xuICAgICAgICByZWNvcmQuZGlyZWN0aW9uID0gJ3JpZ2h0JztcbiAgICAgICAgdGhpcy5yaWdodERhdGFTb3VyY2UucHVzaChyZWNvcmQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVjb3JkLmRpcmVjdGlvbiA9ICdsZWZ0JztcbiAgICAgICAgdGhpcy5sZWZ0RGF0YVNvdXJjZS5wdXNoKHJlY29yZCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIGdldENoZWNrZWREYXRhKGRpcmVjdGlvbjogVHJhbnNmZXJEaXJlY3Rpb24pOiBUcmFuc2Zlckl0ZW1bXSB7XG4gICAgcmV0dXJuIHRoaXNbZGlyZWN0aW9uID09PSAnbGVmdCcgPyAnbGVmdERhdGFTb3VyY2UnIDogJ3JpZ2h0RGF0YVNvdXJjZSddLmZpbHRlcih3ID0+IHcuY2hlY2tlZCk7XG4gIH1cblxuICBoYW5kbGVMZWZ0U2VsZWN0QWxsID0gKGNoZWNrZWQ6IGJvb2xlYW4pID0+IHRoaXMuaGFuZGxlU2VsZWN0KCdsZWZ0JywgY2hlY2tlZCk7XG4gIGhhbmRsZVJpZ2h0U2VsZWN0QWxsID0gKGNoZWNrZWQ6IGJvb2xlYW4pID0+IHRoaXMuaGFuZGxlU2VsZWN0KCdyaWdodCcsIGNoZWNrZWQpO1xuXG4gIGhhbmRsZUxlZnRTZWxlY3QgPSAoaXRlbTogVHJhbnNmZXJJdGVtKSA9PiB0aGlzLmhhbmRsZVNlbGVjdCgnbGVmdCcsICEhaXRlbS5jaGVja2VkLCBpdGVtKTtcbiAgaGFuZGxlUmlnaHRTZWxlY3QgPSAoaXRlbTogVHJhbnNmZXJJdGVtKSA9PiB0aGlzLmhhbmRsZVNlbGVjdCgncmlnaHQnLCAhIWl0ZW0uY2hlY2tlZCwgaXRlbSk7XG5cbiAgaGFuZGxlU2VsZWN0KGRpcmVjdGlvbjogVHJhbnNmZXJEaXJlY3Rpb24sIGNoZWNrZWQ6IGJvb2xlYW4sIGl0ZW0/OiBUcmFuc2Zlckl0ZW0pOiB2b2lkIHtcbiAgICBjb25zdCBsaXN0ID0gdGhpcy5nZXRDaGVja2VkRGF0YShkaXJlY3Rpb24pO1xuICAgIHRoaXMudXBkYXRlT3BlcmF0aW9uU3RhdHVzKGRpcmVjdGlvbiwgbGlzdC5sZW5ndGgpO1xuICAgIHRoaXMubnpTZWxlY3RDaGFuZ2UuZW1pdCh7IGRpcmVjdGlvbiwgY2hlY2tlZCwgbGlzdCwgaXRlbSB9KTtcbiAgfVxuXG4gIGhhbmRsZUZpbHRlckNoYW5nZShyZXQ6IHsgZGlyZWN0aW9uOiBUcmFuc2ZlckRpcmVjdGlvbjsgdmFsdWU6IHN0cmluZyB9KTogdm9pZCB7XG4gICAgdGhpcy5uelNlYXJjaENoYW5nZS5lbWl0KHJldCk7XG4gIH1cblxuICAvLyAjZW5kcmVnaW9uXG5cbiAgLy8gI3JlZ2lvbiBvcGVyYXRpb25cblxuICBsZWZ0QWN0aXZlID0gZmFsc2U7XG4gIHJpZ2h0QWN0aXZlID0gZmFsc2U7XG5cbiAgcHJpdmF0ZSB1cGRhdGVPcGVyYXRpb25TdGF0dXMoZGlyZWN0aW9uOiBUcmFuc2ZlckRpcmVjdGlvbiwgY291bnQ/OiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzW2RpcmVjdGlvbiA9PT0gJ3JpZ2h0JyA/ICdsZWZ0QWN0aXZlJyA6ICdyaWdodEFjdGl2ZSddID1cbiAgICAgICh0eXBlb2YgY291bnQgPT09ICd1bmRlZmluZWQnID8gdGhpcy5nZXRDaGVja2VkRGF0YShkaXJlY3Rpb24pLmZpbHRlcih3ID0+ICF3LmRpc2FibGVkKS5sZW5ndGggOiBjb3VudCkgPiAwO1xuICB9XG5cbiAgbW92ZVRvTGVmdCA9ICgpID0+IHRoaXMubW92ZVRvKCdsZWZ0Jyk7XG4gIG1vdmVUb1JpZ2h0ID0gKCkgPT4gdGhpcy5tb3ZlVG8oJ3JpZ2h0Jyk7XG5cbiAgbW92ZVRvKGRpcmVjdGlvbjogVHJhbnNmZXJEaXJlY3Rpb24pOiB2b2lkIHtcbiAgICBjb25zdCBvcHBvc2l0ZURpcmVjdGlvbiA9IGRpcmVjdGlvbiA9PT0gJ2xlZnQnID8gJ3JpZ2h0JyA6ICdsZWZ0JztcbiAgICB0aGlzLnVwZGF0ZU9wZXJhdGlvblN0YXR1cyhvcHBvc2l0ZURpcmVjdGlvbiwgMCk7XG4gICAgY29uc3QgZGF0YXNvdXJjZSA9IGRpcmVjdGlvbiA9PT0gJ2xlZnQnID8gdGhpcy5yaWdodERhdGFTb3VyY2UgOiB0aGlzLmxlZnREYXRhU291cmNlO1xuICAgIGNvbnN0IG1vdmVMaXN0ID0gZGF0YXNvdXJjZS5maWx0ZXIoaXRlbSA9PiBpdGVtLmNoZWNrZWQgPT09IHRydWUgJiYgIWl0ZW0uZGlzYWJsZWQpO1xuICAgIHRoaXMubnpDYW5Nb3ZlKHsgZGlyZWN0aW9uLCBsaXN0OiBtb3ZlTGlzdCB9KS5zdWJzY3JpYmUoXG4gICAgICBuZXdNb3ZlTGlzdCA9PlxuICAgICAgICB0aGlzLnRydXRoTW92ZVRvKFxuICAgICAgICAgIGRpcmVjdGlvbixcbiAgICAgICAgICBuZXdNb3ZlTGlzdC5maWx0ZXIoaSA9PiAhIWkpXG4gICAgICAgICksXG4gICAgICAoKSA9PiBtb3ZlTGlzdC5mb3JFYWNoKGkgPT4gKGkuY2hlY2tlZCA9IGZhbHNlKSlcbiAgICApO1xuICB9XG5cbiAgcHJpdmF0ZSB0cnV0aE1vdmVUbyhkaXJlY3Rpb246IFRyYW5zZmVyRGlyZWN0aW9uLCBsaXN0OiBUcmFuc2Zlckl0ZW1bXSk6IHZvaWQge1xuICAgIGNvbnN0IG9wcG9zaXRlRGlyZWN0aW9uID0gZGlyZWN0aW9uID09PSAnbGVmdCcgPyAncmlnaHQnIDogJ2xlZnQnO1xuICAgIGNvbnN0IGRhdGFzb3VyY2UgPSBkaXJlY3Rpb24gPT09ICdsZWZ0JyA/IHRoaXMucmlnaHREYXRhU291cmNlIDogdGhpcy5sZWZ0RGF0YVNvdXJjZTtcbiAgICBjb25zdCB0YXJnZXREYXRhc291cmNlID0gZGlyZWN0aW9uID09PSAnbGVmdCcgPyB0aGlzLmxlZnREYXRhU291cmNlIDogdGhpcy5yaWdodERhdGFTb3VyY2U7XG4gICAgZm9yIChjb25zdCBpdGVtIG9mIGxpc3QpIHtcbiAgICAgIGl0ZW0uY2hlY2tlZCA9IGZhbHNlO1xuICAgICAgaXRlbS5oaWRlID0gZmFsc2U7XG4gICAgICBpdGVtLmRpcmVjdGlvbiA9IGRpcmVjdGlvbjtcbiAgICAgIGRhdGFzb3VyY2Uuc3BsaWNlKGRhdGFzb3VyY2UuaW5kZXhPZihpdGVtKSwgMSk7XG4gICAgfVxuICAgIHRhcmdldERhdGFzb3VyY2Uuc3BsaWNlKDAsIDAsIC4uLmxpc3QpO1xuICAgIHRoaXMudXBkYXRlT3BlcmF0aW9uU3RhdHVzKG9wcG9zaXRlRGlyZWN0aW9uKTtcbiAgICB0aGlzLm56Q2hhbmdlLmVtaXQoe1xuICAgICAgZnJvbTogb3Bwb3NpdGVEaXJlY3Rpb24sXG4gICAgICB0bzogZGlyZWN0aW9uLFxuICAgICAgbGlzdFxuICAgIH0pO1xuICAgIHRoaXMubWFya0ZvckNoZWNrQWxsTGlzdCgpO1xuICB9XG5cbiAgLy8gI2VuZHJlZ2lvblxuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgY2RyOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIGkxOG46IE56STE4blNlcnZpY2UsXG4gICAgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgZGlyZWN0aW9uYWxpdHk6IERpcmVjdGlvbmFsaXR5XG4gICkge1xuICAgIC8vIFRPRE86IG1vdmUgdG8gaG9zdCBhZnRlciBWaWV3IEVuZ2luZSBkZXByZWNhdGlvblxuICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2FudC10cmFuc2ZlcicpO1xuICB9XG5cbiAgcHJpdmF0ZSBtYXJrRm9yQ2hlY2tBbGxMaXN0KCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5saXN0cykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB0aGlzLmxpc3RzLmZvckVhY2goaSA9PiBpLm1hcmtGb3JDaGVjaygpKTtcbiAgfVxuXG4gIHByaXZhdGUgaGFuZGxlTnpUYXJnZXRLZXlzKCk6IHZvaWQge1xuICAgIGNvbnN0IGtleXMgPSB0b0FycmF5KHRoaXMubnpUYXJnZXRLZXlzKTtcbiAgICBjb25zdCBoYXNPd25LZXkgPSAoZTogVHJhbnNmZXJJdGVtKSA9PiBlLmhhc093blByb3BlcnR5KCdrZXknKTtcbiAgICB0aGlzLmxlZnREYXRhU291cmNlLmZvckVhY2goZSA9PiB7XG4gICAgICBpZiAoaGFzT3duS2V5KGUpICYmIGtleXMuaW5kZXhPZihlLmtleSkgIT09IC0xICYmICFlLmRpc2FibGVkKSB7XG4gICAgICAgIGUuY2hlY2tlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdGhpcy5tb3ZlVG9SaWdodCgpO1xuICB9XG5cbiAgcHJpdmF0ZSBoYW5kbGVOelNlbGVjdGVkS2V5cygpOiB2b2lkIHtcbiAgICBjb25zdCBrZXlzID0gdG9BcnJheSh0aGlzLm56U2VsZWN0ZWRLZXlzKTtcbiAgICB0aGlzLm56RGF0YVNvdXJjZS5mb3JFYWNoKGUgPT4ge1xuICAgICAgaWYgKGtleXMuaW5kZXhPZihlLmtleSkgIT09IC0xKSB7XG4gICAgICAgIGUuY2hlY2tlZCA9IHRydWU7XG4gICAgICB9XG4gICAgfSk7XG4gICAgY29uc3QgdGVybSA9IChsZDogVHJhbnNmZXJJdGVtKSA9PiBsZC5kaXNhYmxlZCA9PT0gZmFsc2UgJiYgbGQuY2hlY2tlZCA9PT0gdHJ1ZTtcbiAgICB0aGlzLnJpZ2h0QWN0aXZlID0gdGhpcy5sZWZ0RGF0YVNvdXJjZS5zb21lKHRlcm0pO1xuICAgIHRoaXMubGVmdEFjdGl2ZSA9IHRoaXMucmlnaHREYXRhU291cmNlLnNvbWUodGVybSk7XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmkxOG4ubG9jYWxlQ2hhbmdlLnBpcGUodGFrZVVudGlsKHRoaXMudW5zdWJzY3JpYmUkKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMubG9jYWxlID0gdGhpcy5pMThuLmdldExvY2FsZURhdGEoJ1RyYW5zZmVyJyk7XG4gICAgICB0aGlzLm1hcmtGb3JDaGVja0FsbExpc3QoKTtcbiAgICB9KTtcblxuICAgIHRoaXMuZGlyID0gdGhpcy5kaXJlY3Rpb25hbGl0eS52YWx1ZTtcbiAgICB0aGlzLmRpcmVjdGlvbmFsaXR5LmNoYW5nZT8ucGlwZSh0YWtlVW50aWwodGhpcy51bnN1YnNjcmliZSQpKS5zdWJzY3JpYmUoKGRpcmVjdGlvbjogRGlyZWN0aW9uKSA9PiB7XG4gICAgICB0aGlzLmRpciA9IGRpcmVjdGlvbjtcbiAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBpZiAoY2hhbmdlcy5uekRhdGFTb3VyY2UpIHtcbiAgICAgIHRoaXMuc3BsaXREYXRhU291cmNlKCk7XG4gICAgICB0aGlzLnVwZGF0ZU9wZXJhdGlvblN0YXR1cygnbGVmdCcpO1xuICAgICAgdGhpcy51cGRhdGVPcGVyYXRpb25TdGF0dXMoJ3JpZ2h0Jyk7XG4gICAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgICB0aGlzLm1hcmtGb3JDaGVja0FsbExpc3QoKTtcbiAgICB9XG4gICAgaWYgKGNoYW5nZXMubnpUYXJnZXRLZXlzKSB7XG4gICAgICB0aGlzLmhhbmRsZU56VGFyZ2V0S2V5cygpO1xuICAgIH1cbiAgICBpZiAoY2hhbmdlcy5uelNlbGVjdGVkS2V5cykge1xuICAgICAgdGhpcy5oYW5kbGVOelNlbGVjdGVkS2V5cygpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMudW5zdWJzY3JpYmUkLm5leHQoKTtcbiAgICB0aGlzLnVuc3Vic2NyaWJlJC5jb21wbGV0ZSgpO1xuICB9XG59XG4iXX0=