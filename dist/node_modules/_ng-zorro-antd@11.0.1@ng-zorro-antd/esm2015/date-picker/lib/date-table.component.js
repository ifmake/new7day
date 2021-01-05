/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';
import { CandyDate } from 'ng-zorro-antd/core/time';
import { valueFunctionProp } from 'ng-zorro-antd/core/util';
import { DateHelperService, NzI18nService } from 'ng-zorro-antd/i18n';
import { AbstractTable } from './abstract-table';
import { transCompatFormat } from './util';
export class DateTableComponent extends AbstractTable {
    constructor(i18n, dateHelper) {
        super();
        this.i18n = i18n;
        this.dateHelper = dateHelper;
    }
    changeValueFromInside(value) {
        // Only change date not change time
        this.activeDate = this.activeDate.setYear(value.getYear()).setMonth(value.getMonth()).setDate(value.getDate());
        this.valueChange.emit(this.activeDate);
        if (!this.activeDate.isSameMonth(this.value)) {
            this.render();
        }
    }
    makeHeadRow() {
        const weekDays = [];
        const start = this.activeDate.calendarStart({ weekStartsOn: this.dateHelper.getFirstDayOfWeek() });
        for (let colIndex = 0; colIndex < this.MAX_COL; colIndex++) {
            const day = start.addDays(colIndex);
            weekDays.push({
                trackByIndex: null,
                value: day.nativeDate,
                title: this.dateHelper.format(day.nativeDate, 'E'),
                content: this.dateHelper.format(day.nativeDate, this.getVeryShortWeekFormat()),
                isSelected: false,
                isDisabled: false,
                onClick() { },
                onMouseEnter() { }
            });
        }
        return weekDays;
    }
    getVeryShortWeekFormat() {
        return this.i18n.getLocaleId().toLowerCase().indexOf('zh') === 0 ? 'EEEEE' : 'EEEEEE'; // Use extreme short for chinese
    }
    makeBodyRows() {
        const weekRows = [];
        const firstDayOfMonth = this.activeDate.calendarStart({ weekStartsOn: this.dateHelper.getFirstDayOfWeek() });
        for (let week = 0; week < this.MAX_ROW; week++) {
            const weekStart = firstDayOfMonth.addDays(week * 7);
            const row = {
                isActive: false,
                dateCells: [],
                trackByIndex: `${weekStart.getYear()}`
            };
            for (let day = 0; day < 7; day++) {
                const date = weekStart.addDays(day);
                const dateFormat = transCompatFormat(this.i18n.getLocaleData('DatePicker.lang.dateFormat', 'YYYY-MM-DD'));
                const title = this.dateHelper.format(date.nativeDate, dateFormat);
                const label = this.dateHelper.format(date.nativeDate, 'dd');
                const cell = {
                    trackByIndex: title,
                    value: date.nativeDate,
                    label: label,
                    isSelected: false,
                    isDisabled: false,
                    isToday: false,
                    title: title,
                    cellRender: valueFunctionProp(this.cellRender, date),
                    fullCellRender: valueFunctionProp(this.fullCellRender, date),
                    content: `${date.getDate()}`,
                    onClick: () => this.changeValueFromInside(date),
                    onMouseEnter: () => this.cellHover.emit(date)
                };
                this.addCellProperty(cell, date);
                if (this.showWeek && !row.weekNum) {
                    row.weekNum = this.dateHelper.getISOWeek(date.nativeDate);
                }
                if (date.isSameDay(this.value)) {
                    row.isActive = date.isSameDay(this.value);
                }
                row.dateCells.push(cell);
            }
            row.classMap = {
                [`ant-picker-week-panel-row`]: this.showWeek,
                [`ant-picker-week-panel-row-selected`]: this.showWeek && row.isActive
            };
            weekRows.push(row);
        }
        return weekRows;
    }
    addCellProperty(cell, date) {
        var _a;
        if (this.hasRangeValue() && !this.showWeek) {
            const [startHover, endHover] = this.hoverValue;
            const [startSelected, endSelected] = this.selectedValue;
            // Selected
            if (startSelected === null || startSelected === void 0 ? void 0 : startSelected.isSameDay(date)) {
                cell.isSelectedStart = true;
                cell.isSelected = true;
            }
            if (endSelected === null || endSelected === void 0 ? void 0 : endSelected.isSameDay(date)) {
                cell.isSelectedEnd = true;
                cell.isSelected = true;
            }
            if (startHover && endHover) {
                cell.isHoverStart = startHover.isSameDay(date);
                cell.isHoverEnd = endHover.isSameDay(date);
                cell.isLastCellInPanel = date.isLastDayOfMonth();
                cell.isFirstCellInPanel = date.isFirstDayOfMonth();
                cell.isInHoverRange = startHover.isBeforeDay(date) && date.isBeforeDay(endHover);
            }
            cell.isStartSingle = startSelected && !endSelected;
            cell.isEndSingle = !startSelected && endSelected;
            cell.isInSelectedRange = (startSelected === null || startSelected === void 0 ? void 0 : startSelected.isBeforeDay(date)) && date.isBeforeDay(endSelected);
            cell.isRangeStartNearHover = startSelected && cell.isInHoverRange;
            cell.isRangeEndNearHover = endSelected && cell.isInHoverRange;
        }
        cell.isToday = date.isToday();
        cell.isSelected = date.isSameDay(this.value);
        cell.isDisabled = !!((_a = this.disabledDate) === null || _a === void 0 ? void 0 : _a.call(this, date.nativeDate));
        cell.classMap = this.getClassMap(cell);
    }
    getClassMap(cell) {
        const date = new CandyDate(cell.value);
        return Object.assign(Object.assign({}, super.getClassMap(cell)), { [`ant-picker-cell-today`]: !!cell.isToday, [`ant-picker-cell-in-view`]: date.isSameMonth(this.activeDate) });
    }
}
DateTableComponent.decorators = [
    { type: Component, args: [{
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                // tslint:disable-next-line:component-selector
                selector: 'date-table',
                exportAs: 'dateTable',
                template: "<table class=\"ant-picker-content\" cellspacing=\"0\" role=\"grid\">\n  <thead *ngIf=\"headRow && headRow.length > 0\">\n    <tr role=\"row\">\n      <th *ngIf=\"showWeek\" role=\"columnheader\"></th>\n      <th *ngFor=\"let cell of headRow\" role=\"columnheader\" title=\"{{ cell.title }}\">\n        {{ cell.content }}\n      </th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr *ngFor=\"let row of bodyRows; trackBy: trackByBodyRow\" [ngClass]=\"row.classMap!\" role=\"row\">\n      <td *ngIf=\"row.weekNum\" role=\"gridcell\" class=\"{{ prefixCls }}-cell-week\">\n        {{ row.weekNum }}\n      </td>\n      <td\n        *ngFor=\"let cell of row.dateCells; trackBy: trackByBodyColumn\"\n        title=\"{{ cell.title }}\"\n        role=\"gridcell\"\n        [ngClass]=\"cell.classMap!\"\n        (click)=\"cell.isDisabled ? null : cell.onClick()\"\n        (mouseenter)=\"cell.onMouseEnter()\"\n      >\n        <ng-container [ngSwitch]=\"prefixCls\">\n          <ng-container *ngSwitchCase=\"'ant-picker'\">\n            <ng-container [ngSwitch]=\"true\">\n              <ng-container *ngSwitchCase=\"isTemplateRef(cell.cellRender)\">\n                <!--           *ngSwitchCase not has type assertion support, the cellRender type here is TemplateRef -->\n                <ng-container\n                  *ngTemplateOutlet=\"$any(cell.cellRender); context: { $implicit: cell.value }\"\n                ></ng-container>\n              </ng-container>\n              <ng-container *ngSwitchCase=\"isNonEmptyString(cell.cellRender)\">\n                <span [innerHTML]=\"cell.cellRender\"></span>\n              </ng-container>\n              <ng-container *ngSwitchDefault>\n                <div\n                  class=\"{{ prefixCls }}-cell-inner\"\n                  [attr.aria-selected]=\"cell.isSelected\"\n                  [attr.aria-disabled]=\"cell.isDisabled\"\n                >\n                  {{ cell.content }}\n                </div>\n              </ng-container>\n            </ng-container>\n          </ng-container>\n          <ng-container *ngSwitchCase=\"'ant-picker-calendar'\">\n            <div\n              class=\"{{ prefixCls }}-date ant-picker-cell-inner\"\n              [class.ant-picker-calendar-date-today]=\"cell.isToday\"\n            >\n              <ng-container *ngIf=\"cell.fullCellRender; else defaultCell\">\n                <ng-container\n                  *ngTemplateOutlet=\"$any(cell.fullCellRender); context: { $implicit: cell.value }\"\n                >\n                </ng-container>\n              </ng-container>\n              <ng-template #defaultCell>\n                <div class=\"{{ prefixCls }}-date-value\">{{ cell.content }}</div>\n                <div class=\"{{ prefixCls }}-date-content\">\n                  <ng-container\n                    *ngTemplateOutlet=\"$any(cell.cellRender); context: { $implicit: cell.value }\"\n                  >\n                  </ng-container>\n                </div>\n              </ng-template>\n            </div>\n          </ng-container>\n        </ng-container>\n      </td>\n    </tr>\n  </tbody>\n</table>\n"
            },] }
];
DateTableComponent.ctorParameters = () => [
    { type: NzI18nService },
    { type: DateHelperService }
];
DateTableComponent.propDecorators = {
    locale: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS10YWJsZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vY29tcG9uZW50cy9kYXRlLXBpY2tlci8iLCJzb3VyY2VzIjpbImxpYi9kYXRlLXRhYmxlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBcUIsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDaEgsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBQ3BELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBRTVELE9BQU8sRUFBRSxpQkFBaUIsRUFBMkIsYUFBYSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDL0YsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGtCQUFrQixDQUFDO0FBRWpELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLFFBQVEsQ0FBQztBQVUzQyxNQUFNLE9BQU8sa0JBQW1CLFNBQVEsYUFBYTtJQUduRCxZQUFvQixJQUFtQixFQUFVLFVBQTZCO1FBQzVFLEtBQUssRUFBRSxDQUFDO1FBRFUsU0FBSSxHQUFKLElBQUksQ0FBZTtRQUFVLGVBQVUsR0FBVixVQUFVLENBQW1CO0lBRTlFLENBQUM7SUFFTyxxQkFBcUIsQ0FBQyxLQUFnQjtRQUM1QyxtQ0FBbUM7UUFDbkMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsQ0FBQyxDQUFDO1FBQy9HLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUV2QyxJQUFJLENBQUMs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Q0FBQyxLQUMxQixDQUFDLHVCQUF1QixDQUFDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQ3pDLENBQUMseUJBQXlCLENBQUMsRUFBRSxJQUFJLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFDOUQ7SUFDSixDQUFDOzs7WUE3SUYsU0FBUyxTQUFDO2dCQUNULGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2dCQUNyQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtnQkFDL0MsOENBQThDO2dCQUM5QyxRQUFRLEVBQUUsWUFBWTtnQkFDdEIsUUFBUSxFQUFFLFdBQVc7Z0JBQ3JCLG9rR0FBb0M7YUFDckM7OztZQVpvRCxhQUFhO1lBQXpELGlCQUFpQjs7O3FCQWN2QixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2dpdGh1Yi5jb20vTkctWk9SUk8vbmctem9ycm8tYW50ZC9ibG9iL21hc3Rlci9MSUNFTlNFXG4gKi9cblxuaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgSW5wdXQsIE9uQ2hhbmdlcywgT25Jbml0LCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQ2FuZHlEYXRlIH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL3RpbWUnO1xuaW1wb3J0IHsgdmFsdWVGdW5jdGlvblByb3AgfSBmcm9tICduZy16b3Jyby1hbnRkL2NvcmUvdXRpbCc7XG5cbmltcG9ydCB7IERhdGVIZWxwZXJTZXJ2aWNlLCBOekNhbGVuZGFySTE4bkludGVyZmFjZSwgTnpJMThuU2VydmljZSB9IGZyb20gJ25nLXpvcnJvLWFudGQvaTE4bic7XG5pbXBvcnQgeyBBYnN0cmFjdFRhYmxlIH0gZnJvbSAnLi9hYnN0cmFjdC10YWJsZSc7XG5pbXBvcnQgeyBEYXRlQm9keVJvdywgRGF0ZUNlbGwgfSBmcm9tICcuL2ludGVyZmFjZSc7XG5pbXBvcnQgeyB0cmFuc0NvbXBhdEZvcm1hdCB9IGZyb20gJy4vdXRpbCc7XG5cbkBDb21wb25lbnQoe1xuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmNvbXBvbmVudC1zZWxlY3RvclxuICBzZWxlY3RvcjogJ2RhdGUtdGFibGUnLFxuICBleHBvcnRBczogJ2RhdGVUYWJsZScsXG4gIHRlbXBsYXRlVXJsOiAnLi9hYnN0cmFjdC10YWJsZS5odG1sJ1xufSlcbmV4cG9ydCBjbGFzcyBEYXRlVGFibGVDb21wb25lbnQgZXh0ZW5kcyBBYnN0cmFjdFRhYmxlIGltcGxlbWVudHMgT25DaGFuZ2VzLCBPbkluaXQge1xuICBASW5wdXQoKSBsb2NhbGUhOiBOekNhbGVuZGFySTE4bkludGVyZmFjZTtcblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGkxOG46IE56STE4blNlcnZpY2UsIHByaXZhdGUgZGF0ZUhlbHBlcjogRGF0ZUhlbHBlclNlcnZpY2UpIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgcHJpdmF0ZSBjaGFuZ2VWYWx1ZUZyb21JbnNpZGUodmFsdWU6IENhbmR5RGF0ZSk6IHZvaWQge1xuICAgIC8vIE9ubHkgY2hhbmdlIGRhdGUgbm90IGNoYW5nZSB0aW1lXG4gICAgdGhpcy5hY3RpdmVEYXRlID0gdGhpcy5hY3RpdmVEYXRlLnNldFllYXIodmFsdWUuZ2V0WWVhcigpKS5zZXRNb250aCh2YWx1ZS5nZXRNb250aCgpKS5zZXREYXRlKHZhbHVlLmdldERhdGUoKSk7XG4gICAgdGhpcy52YWx1ZUNoYW5nZS5lbWl0KHRoaXMuYWN0aXZlRGF0ZSk7XG5cbiAgICBpZiAoIXRoaXMuYWN0aXZlRGF0ZS5pc1NhbWVNb250aCh0aGlzLnZhbHVlKSkge1xuICAgICAgdGhpcy5yZW5kZXIoKTtcbiAgICB9XG4gIH1cblxuICBtYWtlSGVhZFJvdygpOiBEYXRlQ2VsbFtdIHtcbiAgICBjb25zdCB3ZWVrRGF5czogRGF0ZUNlbGxbXSA9IFtdO1xuICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5hY3RpdmVEYXRlLmNhbGVuZGFyU3RhcnQoeyB3ZWVrU3RhcnRzT246IHRoaXMuZGF0ZUhlbHBlci5nZXRGaXJzdERheU9mV2VlaygpIH0pO1xuICAgIGZvciAobGV0IGNvbEluZGV4ID0gMDsgY29sSW5kZXggPCB0aGlzLk1BWF9DT0w7IGNvbEluZGV4KyspIHtcbiAgICAgIGNvbnN0IGRheSA9IHN0YXJ0LmFkZERheXMoY29sSW5kZXgpO1xuICAgICAgd2Vla0RheXMucHVzaCh7XG4gICAgICAgIHRyYWNrQnlJbmRleDogbnVsbCxcbiAgICAgICAgdmFsdWU6IGRheS5uYXRpdmVEYXRlLFxuICAgICAgICB0aXRsZTogdGhpcy5kYXRlSGVscGVyLmZvcm1hdChkYXkubmF0aXZlRGF0ZSwgJ0UnKSwgLy8gZWcuIFR1ZVxuICAgICAgICBjb250ZW50OiB0aGlzLmRhdGVIZWxwZXIuZm9ybWF0KGRheS5uYXRpdmVEYXRlLCB0aGlzLmdldFZlcnlTaG9ydFdlZWtGb3JtYXQoKSksIC8vIGVnLiBUdSxcbiAgICAgICAgaXNTZWxlY3RlZDogZmFsc2UsXG4gICAgICAgIGlzRGlzYWJsZWQ6IGZhbHNlLFxuICAgICAgICBvbkNsaWNrKCk6IHZvaWQge30sXG4gICAgICAgIG9uTW91c2VFbnRlcigpOiB2b2lkIHt9XG4gICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIHdlZWtEYXlzO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRWZXJ5U2hvcnRXZWVrRm9ybWF0KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuaTE4bi5nZXRMb2NhbGVJZCgpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZignemgnKSA9PT0gMCA/ICdFRUVFRScgOiAnRUVFRUVFJzsgLy8gVXNlIGV4dHJlbWUgc2hvcnQgZm9yIGNoaW5lc2VcbiAgfVxuXG4gIG1ha2VCb2R5Um93cygpOiBEYXRlQm9keVJvd1tdIHtcbiAgICBjb25zdCB3ZWVrUm93czogRGF0ZUJvZHlSb3dbXSA9IFtdO1xuICAgIGNvbnN0IGZpcnN0RGF5T2ZNb250aCA9IHRoaXMuYWN0aXZlRGF0ZS5jYWxlbmRhclN0YXJ0KHsgd2Vla1N0YXJ0c09uOiB0aGlzLmRhdGVIZWxwZXIuZ2V0Rmlyc3REYXlPZldlZWsoKSB9KTtcblxuICAgIGZvciAobGV0IHdlZWsgPSAwOyB3ZWVrIDwgdGhpcy5NQVhfUk9XOyB3ZWVrKyspIHtcbiAgICAgIGNvbnN0IHdlZWtTdGFydCA9IGZpcnN0RGF5T2ZNb250aC5hZGREYXlzKHdlZWsgKiA3KTtcbiAgICAgIGNvbnN0IHJvdzogRGF0ZUJvZHlSb3cgPSB7XG4gICAgICAgIGlzQWN0aXZlOiBmYWxzZSxcbiAgICAgICAgZGF0ZUNlbGxzOiBbXSxcbiAgICAgICAgdHJhY2tCeUluZGV4OiBgJHt3ZWVrU3RhcnQuZ2V0WWVhcigpfWBcbiAgICAgIH07XG5cbiAgICAgIGZvciAobGV0IGRheSA9IDA7IGRheSA8IDc7IGRheSsrKSB7XG4gICAgICAgIGNvbnN0IGRhdGUgPSB3ZWVrU3RhcnQuYWRkRGF5cyhkYXkpO1xuICAgICAgICBjb25zdCBkYXRlRm9ybWF0ID0gdHJhbnNDb21wYXRGb3JtYXQodGhpcy5pMThuLmdldExvY2FsZURhdGEoJ0RhdGVQaWNrZXIubGFuZy5kYXRlRm9ybWF0JywgJ1lZWVktTU0tREQnKSk7XG4gICAgICAgIGNvbnN0IHRpdGxlID0gdGhpcy5kYXRlSGVscGVyLmZvcm1hdChkYXRlLm5hdGl2ZURhdGUsIGRhdGVGb3JtYXQpO1xuICAgICAgICBjb25zdCBsYWJlbCA9IHRoaXMuZGF0ZUhlbHBlci5mb3JtYXQoZGF0ZS5uYXRpdmVEYXRlLCAnZGQnKTtcbiAgICAgICAgY29uc3QgY2VsbDogRGF0ZUNlbGwgPSB7XG4gICAgICAgICAgdHJhY2tCeUluZGV4OiB0aXRsZSxcbiAgICAgICAgICB2YWx1ZTogZGF0ZS5uYXRpdmVEYXRlLFxuICAgICAgICAgIGxhYmVsOiBsYWJlbCxcbiAgICAgICAgICBpc1NlbGVjdGVkOiBmYWxzZSxcbiAgICAgICAgICBpc0Rpc2FibGVkOiBmYWxzZSxcbiAgICAgICAgICBpc1RvZGF5OiBmYWxzZSxcbiAgICAgICAgICB0aXRsZTogdGl0bGUsXG4gICAgICAgICAgY2VsbFJlbmRlcjogdmFsdWVGdW5jdGlvblByb3AodGhpcy5jZWxsUmVuZGVyISwgZGF0ZSksIC8vIEN1c3RvbWl6ZWQgY29udGVudFxuICAgICAgICAgIGZ1bGxDZWxsUmVuZGVyOiB2YWx1ZUZ1bmN0aW9uUHJvcCh0aGlzLmZ1bGxDZWxsUmVuZGVyISwgZGF0ZSksXG4gICAgICAgICAgY29udGVudDogYCR7ZGF0ZS5nZXREYXRlKCl9YCxcbiAgICAgICAgICBvbkNsaWNrOiAoKSA9PiB0aGlzLmNoYW5nZVZhbHVlRnJvbUluc2lkZShkYXRlKSxcbiAgICAgICAgICBvbk1vdXNlRW50ZXI6ICgpID0+IHRoaXMuY2VsbEhvdmVyLmVtaXQoZGF0ZSlcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmFkZENlbGxQcm9wZXJ0eShjZWxsLCBkYXRlKTtcblxuICAgICAgICBpZiAodGhpcy5zaG93V2VlayAmJiAhcm93LndlZWtOdW0pIHtcbiAgICAgICAgICByb3cud2Vla051bSA9IHRoaXMuZGF0ZUhlbHBlci5nZXRJU09XZWVrKGRhdGUubmF0aXZlRGF0ZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGRhdGUuaXNTYW1lRGF5KHRoaXMudmFsdWUpKSB7XG4gICAgICAgICAgcm93LmlzQWN0aXZlID0gZGF0ZS5pc1NhbWVEYXkodGhpcy52YWx1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcm93LmRhdGVDZWxscy5wdXNoKGNlbGwpO1xuICAgICAgfVxuICAgICAgcm93LmNsYXNzTWFwID0ge1xuICAgICAgICBbYGFudC1waWNrZXItd2Vlay1wYW5lbC1yb3dgXTogdGhpcy5zaG93V2VlayxcbiAgICAgICAgW2BhbnQtcGlja2VyLXdlZWstcGFuZWwtcm93LXNlbGVjdGVkYF06IHRoaXMuc2hvd1dlZWsgJiYgcm93LmlzQWN0aXZlXG4gICAgICB9O1xuICAgICAgd2Vla1Jvd3MucHVzaChyb3cpO1xuICAgIH1cbiAgICByZXR1cm4gd2Vla1Jvd3M7XG4gIH1cblxuICBhZGRDZWxsUHJvcGVydHkoY2VsbDogRGF0ZUNlbGwsIGRhdGU6IENhbmR5RGF0ZSk6IHZvaWQge1xuICAgIGlmICh0aGlzLmhhc1JhbmdlVmFsdWUoKSAmJiAhdGhpcy5zaG93V2Vlaykge1xuICAgICAgY29uc3QgW3N0YXJ0SG92ZXIsIGVuZEhvdmVyXSA9IHRoaXMuaG92ZXJWYWx1ZTtcbiAgICAgIGNvbnN0IFtzdGFydFNlbGVjdGVkLCBlbmRTZWxlY3RlZF0gPSB0aGlzLnNlbGVjdGVkVmFsdWU7XG4gICAgICAvLyBTZWxlY3RlZFxuICAgICAgaWYgKHN0YXJ0U2VsZWN0ZWQ/LmlzU2FtZURheShkYXRlKSkge1xuICAgICAgICBjZWxsLmlzU2VsZWN0ZWRTdGFydCA9IHRydWU7XG4gICAgICAgIGNlbGwuaXNTZWxlY3RlZCA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChlbmRTZWxlY3RlZD8uaXNTYW1lRGF5KGRhdGUpKSB7XG4gICAgICAgIGNlbGwuaXNTZWxlY3RlZEVuZCA9IHRydWU7XG4gICAgICAgIGNlbGwuaXNTZWxlY3RlZCA9IHRydWU7XG4gICAgICB9XG5cbiAgICAgIGlmIChzdGFydEhvdmVyICYmIGVuZEhvdmVyKSB7XG4gICAgICAgIGNlbGwuaXNIb3ZlclN0YXJ0ID0gc3RhcnRIb3Zlci5pc1NhbWVEYXkoZGF0ZSk7XG4gICAgICAgIGNlbGwuaXNIb3ZlckVuZCA9IGVuZEhvdmVyLmlzU2FtZURheShkYXRlKTtcbiAgICAgICAgY2VsbC5pc0xhc3RDZWxsSW5QYW5lbCA9IGRhdGUuaXNMYXN0RGF5T2ZNb250aCgpO1xuICAgICAgICBjZWxsLmlzRmlyc3RDZWxsSW5QYW5lbCA9IGRhdGUuaXNGaXJzdERheU9mTW9udGgoKTtcbiAgICAgICAgY2VsbC5pc0luSG92ZXJSYW5nZSA9IHN0YXJ0SG92ZXIuaXNCZWZvcmVEYXkoZGF0ZSkgJiYgZGF0ZS5pc0JlZm9yZURheShlbmRIb3Zlcik7XG4gICAgICB9XG4gICAgICBjZWxsLmlzU3RhcnRTaW5nbGUgPSBzdGFydFNlbGVjdGVkICYmICFlbmRTZWxlY3RlZDtcbiAgICAgIGNlbGwuaXNFbmRTaW5nbGUgPSAhc3RhcnRTZWxlY3RlZCAmJiBlbmRTZWxlY3RlZDtcbiAgICAgIGNlbGwuaXNJblNlbGVjdGVkUmFuZ2UgPSBzdGFydFNlbGVjdGVkPy5pc0JlZm9yZURheShkYXRlKSAmJiBkYXRlLmlzQmVmb3JlRGF5KGVuZFNlbGVjdGVkKTtcbiAgICAgIGNlbGwuaXNSYW5nZVN0YXJ0TmVhckhvdmVyID0gc3RhcnRTZWxlY3RlZCAmJiBjZWxsLmlzSW5Ib3ZlclJhbmdlO1xuICAgICAgY2VsbC5pc1JhbmdlRW5kTmVhckhvdmVyID0gZW5kU2VsZWN0ZWQgJiYgY2VsbC5pc0luSG92ZXJSYW5nZTtcbiAgICB9XG5cbiAgICBjZWxsLmlzVG9kYXkgPSBkYXRlLmlzVG9kYXkoKTtcbiAgICBjZWxsLmlzU2VsZWN0ZWQgPSBkYXRlLmlzU2FtZURheSh0aGlzLnZhbHVlKTtcbiAgICBjZWxsLmlzRGlzYWJsZWQgPSAhIXRoaXMuZGlzYWJsZWREYXRlPy4oZGF0ZS5uYXRpdmVEYXRlKTtcbiAgICBjZWxsLmNsYXNzTWFwID0gdGhpcy5nZXRDbGFzc01hcChjZWxsKTtcbiAgfVxuXG4gIGdldENsYXNzTWFwKGNlbGw6IERhdGVDZWxsKTogeyBba2V5OiBzdHJpbmddOiBib29sZWFuIH0ge1xuICAgIGNvbnN0IGRhdGUgPSBuZXcgQ2FuZHlEYXRlKGNlbGwudmFsdWUpO1xuICAgIHJldHVybiB7XG4gICAgICAuLi5zdXBlci5nZXRDbGFzc01hcChjZWxsKSxcbiAgICAgIFtgYW50LXBpY2tlci1jZWxsLXRvZGF5YF06ICEhY2VsbC5pc1RvZGF5LFxuICAgICAgW2BhbnQtcGlja2VyLWNlbGwtaW4tdmlld2BdOiBkYXRlLmlzU2FtZU1vbnRoKHRoaXMuYWN0aXZlRGF0ZSlcbiAgICB9O1xuICB9XG59XG4iXX0=