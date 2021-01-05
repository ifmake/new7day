/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { NzI18nService } from 'ng-zorro-antd/i18n';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
export class NzTableFilterComponent {
    constructor(cdr, i18n, elementRef) {
        this.cdr = cdr;
        this.i18n = i18n;
        this.elementRef = elementRef;
        this.contentTemplate = null;
        this.customFilter = false;
        this.extraTemplate = null;
        this.filterMultiple = true;
        this.listOfFilter = [];
        this.filterChange = new EventEmitter();
        this.destroy$ = new Subject();
        this.isChanged = false;
        this.isChecked = false;
        this.isVisible = false;
        this.listOfParsedFilter = [];
        // TODO: move to host after View Engine deprecation
        this.elementRef.nativeElement.classList.add('ant-table-filter-column');
    }
    trackByValue(_, item) {
        return item.value;
    }
    check(filter) {
        this.isChanged = true;
        if (this.filterMultiple) {
            this.listOfParsedFilter = this.listOfParsedFilter.map(item => {
                if (item === filter) {
                    return Object.assign(Object.assign({}, item), { checked: !filter.checked });
                }
                else {
                    return item;
                }
            });
            filter.checked = !filter.checked;
        }
        else {
            this.listOfParsedFilter = this.listOfParsedFilter.map(item => {
                return Object.assign(Object.assign({}, item), { checked: item === filter });
            });
        }
        this.isChecked = this.getCheckedStatus(this.listOfParsedFilter);
    }
    confirm() {
        this.isVisible = false;
        this.emitFilterData();
    }
    reset() {
        this.isChanged = true;
        this.isVisible = false;
        this.listOfParsedFilter = this.parseListOfFilter(this.listOfFilter, true);
        this.isChecked = this.getCheckedStatus(this.listOfParsedFilter);
        this.emitFilterData();
    }
    onVisibleChange(value) {
        this.isVisible = value;
        if (!value) {
            this.emitFilterData();
        }
    }
    emitFilterData() {
        if (this.isChanged) {
            const listOfChecked = this.listOfParsedFilter.filter(item => item.checked).map(item => item.value);
            if (this.filterMultiple) {
                this.filterChange.emit(listOfChecked);
            }
            else {
                this.filterChange.emit(listOfChecked.length > 0 ? listOfChecked[0] : null);
            }
            this.isChanged = false;
        }
    }
    parseListOfFilter(listOfFilter, reset) {
        return listOfFilter.map(item => {
            const checked = reset ? false : !!item.byDefault;
            return { text: item.text, value: item.value, checked };
        });
    }
    getCheckedStatus(listOfParsedFilter) {
        return listOfParsedFilter.some(item => item.checked);
    }
    ngOnInit() {
        this.i18n.localeChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.locale = this.i18n.getLocaleData('Table');
            this.cdr.markForCheck();
        });
    }
    ngOnChanges(changes) {
        const { listOfFilter } = changes;
        if (listOfFilter && this.listOfFilter && this.listOfFilter.length) {
            this.listOfParsedFilter = this.parseListOfFilter(this.listOfFilter);
            this.isChecked = this.getCheckedStatus(this.listOfParsedFilter);
        }
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
NzTableFilterComponent.decorators = [
    { type: Component, args: [{
                selector: 'nz-table-filter',
                preserveWhitespaces: false,
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                template: `
    <span class="ant-table-filter-column-title">
      <ng-template [ngTemplateOutlet]="contentTemplate"></ng-template>
    </span>
    <ng-container *ngIf="!customFilter; else extraTemplate">
      <nz-filter-trigger
        [nzVisible]="isVisible"
        [nzActive]="isChecked"
        [nzDropdownMenu]="filterMenu"
        (nzVisibleChange)="onVisibleChange($event)"
      >
        <i nz-icon nzType="filter" nzTheme="fill"></i>
      </nz-filter-trigger>
      <nz-dropdown-menu #filterMenu="nzDropdownMenu">
        <div class="ant-table-filter-dropdown">
          <ul nz-menu>
            <li nz-menu-item [nzSelected]="f.checked" *ngFor="let f of listOfParsedFilter; trackBy: trackByValue" (click)="check(f)">
              <label nz-radio *ngIf="!filterMultiple" [ngModel]="f.checked" (ngModelChange)="check(f)"></label>
              <label nz-checkbox *ngIf="filterMultiple" [ngModel]="f.checked" (ngModelChange)="check(f)"></label>
              <span>{{ f.text }}</span>
            </li>
          </ul>
          <div class="ant-table-filter-dropdown-btns">
            <button nz-button nzType="link" nzSize="small" (click)="reset()" [disabled]="!isChecked">{{ locale.filterReset }}</button>
            <button nz-button nzType="primary" nzSize="small" (click)="confirm()">{{ locale.filterConfirm }}</button>
          </div>
        </div>
      </nz-dropdown-menu>
    </ng-container>
  `
            },] }
];
NzTableFilterComponent.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: NzI18nService },
    { type: ElementRef }
];
NzTableFilterComponent.propDecorators = {
    contentTemplate: [{ type: Input }],
    customFilter: [{ type: Input }],
    extraTemplate: [{ type: Input }],
    filterMultiple: [{ type: Input }],
    listOfFilter: [{ type: Input }],
    filterChange: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmlsdGVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9jb21wb25lbnRzL3RhYmxlLyIsInNvdXJjZXMiOlsic3JjL2FkZG9uL2ZpbHRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHO0FBRUgsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osS0FBSyxFQUlMLE1BQU0sRUFHTixpQkFBaUIsRUFDbEIsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLGFBQWEsRUFBd0IsTUFBTSxvQkFBb0IsQ0FBQztBQUN6RSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQy9CLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQTZDM0MsTUFBTSxPQUFPLHNCQUFzQjtJQWdGakMsWUFBb0IsR0FBc0IsRUFBVSxJQUFtQixFQUFVLFVBQXNCO1FBQW5GLFFBQUcsR0FBSCxHQUFHLENBQW1CO1FBQVUsU0FBSSxHQUFKLElBQUksQ0FBZTtRQUFVLGVBQVUsR0FBVixVQUFVLENBQVk7UUEvRTlGLG9CQUFlLEdBQWtDLElBQUksQ0FBQztRQUN0RCxpQkFBWSxHQUFHLEtBQUssQ0FBQztRQUNyQixrQkFBYSxHQUFrQyxJQUFJLENBQUM7UUFDcEQsbUJBQWMsR0FBRyxJQUFJLENBQUM7UUFDdEIsaUJBQVksR0FBc0IsRUFBRSxDQUFDO1FBQzNCLGlCQUFZLEdBQUcsSUFBSSxZQUFZLEVBQTJCLENBQUM7UUFDdEUsYUFBUSxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7UUFFakMsY0FBUyxHQUFHLEtBQUssQ0FBQztRQUNsQixjQUFTLEdBQUcsS0FBSyxDQUFDO1FBQ2xCLGNBQVMsR0FBRyxLQUFLLENBQUM7UUFDbEIsdUJBQWtCLEdBQXdCLEVBQUUsQ0FBQztRQXFFM0MsbURBQW1EO1FBQ25ELElBQUksQ0FB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VCxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDM0IsQ0FBQzs7O1lBMUlGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsaUJBQWlCO2dCQUMzQixtQkFBbUIsRUFBRSxLQUFLO2dCQUMxQixlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtnQkFDL0MsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7Z0JBQ3JDLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0E2QlQ7YUFDRjs7O1lBNURDLGlCQUFpQjtZQWNWLGFBQWE7WUFacEIsVUFBVTs7OzhCQTREVCxLQUFLOzJCQUNMLEtBQUs7NEJBQ0wsS0FBSzs2QkFDTCxLQUFLOzJCQUNMLEtBQUs7MkJBQ0wsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9naXRodWIuY29tL05HLVpPUlJPL25nLXpvcnJvLWFudGQvYmxvYi9tYXN0ZXIvTElDRU5TRVxuICovXG5cbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3RW5jYXBzdWxhdGlvblxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE56U2FmZUFueSB9IGZyb20gJ25nLXpvcnJvLWFudGQvY29yZS90eXBlcyc7XG5pbXBvcnQgeyBOekkxOG5TZXJ2aWNlLCBOelRhYmxlSTE4bkludGVyZmFjZSB9IGZyb20gJ25nLXpvcnJvLWFudGQvaTE4bic7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBOelRhYmxlRmlsdGVyTGlzdCB9IGZyb20gJy4uL3RhYmxlLnR5cGVzJztcblxuaW50ZXJmYWNlIE56VGhJdGVtSW50ZXJmYWNlIHtcbiAgdGV4dDogc3RyaW5nO1xuICB2YWx1ZTogTnpTYWZlQW55O1xuICBjaGVja2VkOiBib29sZWFuO1xufVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduei10YWJsZS1maWx0ZXInLFxuICBwcmVzZXJ2ZVdoaXRlc3BhY2VzOiBmYWxzZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIHRlbXBsYXRlOiBgXG4gICAgPHNwYW4gY2xhc3M9XCJhbnQtdGFibGUtZmlsdGVyLWNvbHVtbi10aXRsZVwiPlxuICAgICAgPG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImNvbnRlbnRUZW1wbGF0ZVwiPjwvbmctdGVtcGxhdGU+XG4gICAgPC9zcGFuPlxuICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCIhY3VzdG9tRmlsdGVyOyBlbHNlIGV4dHJhVGVtcGxhdGVcIj5cbiAgICAgIDxuei1maWx0ZXItdHJpZ2dlclxuICAgICAgICBbbnpWaXNpYmxlXT1cImlzVmlzaWJsZVwiXG4gICAgICAgIFtuekFjdGl2ZV09XCJpc0NoZWNrZWRcIlxuICAgICAgICBbbnpEcm9wZG93bk1lbnVdPVwiZmlsdGVyTWVudVwiXG4gICAgICAgIChuelZpc2libGVDaGFuZ2UpPVwib25WaXNpYmxlQ2hhbmdlKCRldmVudClcIlxuICAgICAgPlxuICAgICAgICA8aSBuei1pY29uIG56VHlwZT1cImZpbHRlclwiIG56VGhlbWU9XCJmaWxsXCI+PC9pPlxuICAgICAgPC9uei1maWx0ZXItdHJpZ2dlcj5cbiAgICAgIDxuei1kcm9wZG93bi1tZW51ICNmaWx0ZXJNZW51PVwibnpEcm9wZG93bk1lbnVcIj5cbiAgICAgICAgPGRpdiBjbGFzcz1cImFudC10YWJsZS1maWx0ZXItZHJvcGRvd25cIj5cbiAgICAgICAgICA8dWwgbnotbWVudT5cbiAgICAgICAgICAgIDxsaSBuei1tZW51LWl0ZW0gW256U2VsZWN0ZWRdPVwiZi5jaGVja2VkXCIgKm5nRm9yPVwibGV0IGYgb2YgbGlzdE9mUGFyc2VkRmlsdGVyOyB0cmFja0J5OiB0cmFja0J5VmFsdWVcIiAoY2xpY2spPVwiY2hlY2soZilcIj5cbiAgICAgICAgICAgICAgPGxhYmVsIG56LXJhZGlvICpuZ0lmPVwiIWZpbHRlck11bHRpcGxlXCIgW25nTW9kZWxdPVwiZi5jaGVja2VkXCIgKG5nTW9kZWxDaGFuZ2UpPVwiY2hlY2soZilcIj48L2xhYmVsPlxuICAgICAgICAgICAgICA8bGFiZWwgbnotY2hlY2tib3ggKm5nSWY9XCJmaWx0ZXJNdWx0aXBsZVwiIFtuZ01vZGVsXT1cImYuY2hlY2tlZFwiIChuZ01vZGVsQ2hhbmdlKT1cImNoZWNrKGYpXCI+PC9sYWJlbD5cbiAgICAgICAgICAgICAgPHNwYW4+e3sgZi50ZXh0IH19PC9zcGFuPlxuICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICA8L3VsPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJhbnQtdGFibGUtZmlsdGVyLWRyb3Bkb3duLWJ0bnNcIj5cbiAgICAgICAgICAgIDxidXR0b24gbnotYnV0dG9uIG56VHlwZT1cImxpbmtcIiBuelNpemU9XCJzbWFsbFwiIChjbGljayk9XCJyZXNldCgpXCIgW2Rpc2FibGVkXT1cIiFpc0NoZWNrZWRcIj57eyBsb2NhbGUuZmlsdGVyUmVzZXQgfX08L2J1dHRvbj5cbiAgICAgICAgICAgIDxidXR0b24gbnotYnV0dG9uIG56VHlwZT1cInByaW1hcnlcIiBuelNpemU9XCJzbWFsbFwiIChjbGljayk9XCJjb25maXJtKClcIj57eyBsb2NhbGUuZmlsdGVyQ29uZmlybSB9fTwvYnV0dG9uPlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvbnotZHJvcGRvd24tbWVudT5cbiAgICA8L25nLWNvbnRhaW5lcj5cbiAgYFxufSlcbmV4cG9ydCBjbGFzcyBOelRhYmxlRmlsdGVyQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIE9uSW5pdCB7XG4gIEBJbnB1dCgpIGNvbnRlbnRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8TnpTYWZlQW55PiB8IG51bGwgPSBudWxsO1xuICBASW5wdXQoKSBjdXN0b21GaWx0ZXIgPSBmYWxzZTtcbiAgQElucHV0KCkgZXh0cmFUZW1wbGF0ZTogVGVtcGxhdGVSZWY8TnpTYWZlQW55PiB8IG51bGwgPSBudWxsO1xuICBASW5wdXQoKSBmaWx0ZXJNdWx0aXBsZSA9IHRydWU7XG4gIEBJbnB1dCgpIGxpc3RPZkZpbHRlcjogTnpUYWJsZUZpbHRlckxpc3QgPSBbXTtcbiAgQE91dHB1dCgpIHJlYWRvbmx5IGZpbHRlckNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8TnpTYWZlQW55W10gfCBOelNhZmVBbnk+KCk7XG4gIHByaXZhdGUgZGVzdHJveSQgPSBuZXcgU3ViamVjdCgpO1xuICBsb2NhbGUhOiBOelRhYmxlSTE4bkludGVyZmFjZTtcbiAgaXNDaGFuZ2VkID0gZmFsc2U7XG4gIGlzQ2hlY2tlZCA9IGZhbHNlO1xuICBpc1Zpc2libGUgPSBmYWxzZTtcbiAgbGlzdE9mUGFyc2VkRmlsdGVyOiBOelRoSXRlbUludGVyZmFjZVtdID0gW107XG5cbiAgdHJhY2tCeVZhbHVlKF86IG51bWJlciwgaXRlbTogTnpUaEl0ZW1JbnRlcmZhY2UpOiBOelNhZmVBbnkge1xuICAgIHJldHVybiBpdGVtLnZhbHVlO1xuICB9XG5cbiAgY2hlY2soZmlsdGVyOiBOelRoSXRlbUludGVyZmFjZSk6IHZvaWQge1xuICAgIHRoaXMuaXNDaGFuZ2VkID0gdHJ1ZTtcbiAgICBpZiAodGhpcy5maWx0ZXJNdWx0aXBsZSkge1xuICAgICAgdGhpcy5saXN0T2ZQYXJzZWRGaWx0ZXIgPSB0aGlzLmxpc3RPZlBhcnNlZEZpbHRlci5tYXAoaXRlbSA9PiB7XG4gICAgICAgIGlmIChpdGVtID09PSBmaWx0ZXIpIHtcbiAgICAgICAgICByZXR1cm4geyAuLi5pdGVtLCBjaGVja2VkOiAhZmlsdGVyLmNoZWNrZWQgfTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gaXRlbTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBmaWx0ZXIuY2hlY2tlZCA9ICFmaWx0ZXIuY2hlY2tlZDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5saXN0T2ZQYXJzZWRGaWx0ZXIgPSB0aGlzLmxpc3RPZlBhcnNlZEZpbHRlci5tYXAoaXRlbSA9PiB7XG4gICAgICAgIHJldHVybiB7IC4uLml0ZW0sIGNoZWNrZWQ6IGl0ZW0gPT09IGZpbHRlciB9O1xuICAgICAgfSk7XG4gICAgfVxuICAgIHRoaXMuaXNDaGVja2VkID0gdGhpcy5nZXRDaGVja2VkU3RhdHVzKHRoaXMubGlzdE9mUGFyc2VkRmlsdGVyKTtcbiAgfVxuXG4gIGNvbmZpcm0oKTogdm9pZCB7XG4gICAgdGhpcy5pc1Zpc2libGUgPSBmYWxzZTtcbiAgICB0aGlzLmVtaXRGaWx0ZXJEYXRhKCk7XG4gIH1cblxuICByZXNldCgpOiB2b2lkIHtcbiAgICB0aGlzLmlzQ2hhbmdlZCA9IHRydWU7XG4gICAgdGhpcy5pc1Zpc2libGUgPSBmYWxzZTtcbiAgICB0aGlzLmxpc3RPZlBhcnNlZEZpbHRlciA9IHRoaXMucGFyc2VMaXN0T2ZGaWx0ZXIodGhpcy5saXN0T2ZGaWx0ZXIsIHRydWUpO1xuICAgIHRoaXMuaXNDaGVja2VkID0gdGhpcy5nZXRDaGVja2VkU3RhdHVzKHRoaXMubGlzdE9mUGFyc2VkRmlsdGVyKTtcbiAgICB0aGlzLmVtaXRGaWx0ZXJEYXRhKCk7XG4gIH1cblxuICBvblZpc2libGVDaGFuZ2UodmFsdWU6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLmlzVmlzaWJsZSA9IHZhbHVlO1xuICAgIGlmICghdmFsdWUpIHtcbiAgICAgIHRoaXMuZW1pdEZpbHRlckRhdGEoKTtcbiAgICB9XG4gIH1cblxuICBlbWl0RmlsdGVyRGF0YSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pc0NoYW5nZWQpIHtcbiAgICAgIGNvbnN0IGxpc3RPZkNoZWNrZWQgPSB0aGlzLmxpc3RPZlBhcnNlZEZpbHRlci5maWx0ZXIoaXRlbSA9PiBpdGVtLmNoZWNrZWQpLm1hcChpdGVtID0+IGl0ZW0udmFsdWUpO1xuICAgICAgaWYgKHRoaXMuZmlsdGVyTXVsdGlwbGUpIHtcbiAgICAgICAgdGhpcy5maWx0ZXJDaGFuZ2UuZW1pdChsaXN0T2ZDaGVja2VkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZmlsdGVyQ2hhbmdlLmVtaXQobGlzdE9mQ2hlY2tlZC5sZW5ndGggPiAwID8gbGlzdE9mQ2hlY2tlZFswXSA6IG51bGwpO1xuICAgICAgfVxuICAgICAgdGhpcy5pc0NoYW5nZWQgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBwYXJzZUxpc3RPZkZpbHRlcihsaXN0T2ZGaWx0ZXI6IE56VGFibGVGaWx0ZXJMaXN0LCByZXNldD86IGJvb2xlYW4pOiBOelRoSXRlbUludGVyZmFjZVtdIHtcbiAgICByZXR1cm4gbGlzdE9mRmlsdGVyLm1hcChpdGVtID0+IHtcbiAgICAgIGNvbnN0IGNoZWNrZWQgPSByZXNldCA/IGZhbHNlIDogISFpdGVtLmJ5RGVmYXVsdDtcbiAgICAgIHJldHVybiB7IHRleHQ6IGl0ZW0udGV4dCwgdmFsdWU6IGl0ZW0udmFsdWUsIGNoZWNrZWQgfTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldENoZWNrZWRTdGF0dXMobGlzdE9mUGFyc2VkRmlsdGVyOiBOelRoSXRlbUludGVyZmFjZVtdKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIGxpc3RPZlBhcnNlZEZpbHRlci5zb21lKGl0ZW0gPT4gaXRlbS5jaGVja2VkKTtcbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY2RyOiBDaGFuZ2VEZXRlY3RvclJlZiwgcHJpdmF0ZSBpMThuOiBOekkxOG5TZXJ2aWNlLCBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHtcbiAgICAvLyBUT0RPOiBtb3ZlIHRvIGhvc3QgYWZ0ZXIgVmlldyBFbmdpbmUgZGVwcmVjYXRpb25cbiAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdhbnQtdGFibGUtZmlsdGVyLWNvbHVtbicpO1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5pMThuLmxvY2FsZUNoYW5nZS5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMubG9jYWxlID0gdGhpcy5pMThuLmdldExvY2FsZURhdGEoJ1RhYmxlJyk7XG4gICAgICB0aGlzLmNkci5tYXJrRm9yQ2hlY2soKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBjb25zdCB7IGxpc3RPZkZpbHRlciB9ID0gY2hhbmdlcztcbiAgICBpZiAobGlzdE9mRmlsdGVyICYmIHRoaXMubGlzdE9mRmlsdGVyICYmIHRoaXMubGlzdE9mRmlsdGVyLmxlbmd0aCkge1xuICAgICAgdGhpcy5saXN0T2ZQYXJzZWRGaWx0ZXIgPSB0aGlzLnBhcnNlTGlzdE9mRmlsdGVyKHRoaXMubGlzdE9mRmlsdGVyKTtcbiAgICAgIHRoaXMuaXNDaGVja2VkID0gdGhpcy5nZXRDaGVja2VkU3RhdHVzKHRoaXMubGlzdE9mUGFyc2VkRmlsdGVyKTtcbiAgICB9XG4gIH1cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5kZXN0cm95JC5uZXh0KCk7XG4gICAgdGhpcy5kZXN0cm95JC5jb21wbGV0ZSgpO1xuICB9XG59XG4iXX0=