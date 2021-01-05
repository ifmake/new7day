/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { CandyDate, cloneDate, wrongSortOrder } from 'ng-zorro-antd/core/time';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DatePickerService } from './date-picker.service';
import { getTimeConfig, isAllowedDate, PREFIX_CLASS } from './util';
export class DateRangePopupComponent {
    constructor(datePickerService, cdr) {
        this.datePickerService = datePickerService;
        this.cdr = cdr;
        this.panelModeChange = new EventEmitter();
        this.calendarChange = new EventEmitter();
        this.resultOk = new EventEmitter(); // Emitted when done with date selecting
        this.dir = 'ltr';
        this.prefixCls = PREFIX_CLASS;
        this.endPanelMode = 'date';
        this.timeOptions = null;
        this.hoverValue = []; // Range ONLY
        this.checkedPartArr = [false, false];
        this.destroy$ = new Subject();
        this.disabledStartTime = (value) => {
            return this.disabledTime && this.disabledTime(value, 'start');
        };
        this.disabledEndTime = (value) => {
            return this.disabledTime && this.disabledTime(value, 'end');
        };
    }
    get hasTimePicker() {
        return !!this.showTime;
    }
    get hasFooter() {
        return this.showToday || this.hasTimePicker || !!this.extraFooter || !!this.ranges;
    }
    ngOnInit() {
        this.datePickerService.valueChange$.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.updateActiveDate();
            this.cdr.markForCheck();
        });
    }
    ngOnChanges(changes) {
        // Parse showTime options
        if (changes.showTime || changes.disabledTime) {
            if (this.showTime) {
                this.buildTimeOptions();
            }
        }
        if (changes.panelMode) {
            this.endPanelMode = this.panelMode;
        }
        if (changes.defaultPickerValue) {
            this.updateActiveDate();
        }
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
    updateActiveDate() {
        const activeDate = this.datePickerService.hasValue()
            ? this.datePickerService.value
            : this.datePickerService.makeValue(this.defaultPickerValue);
        this.datePickerService.setActiveDate(activeDate, this.hasTimePicker, this.getPanelMode(this.endPanelMode));
    }
    init() {
        this.checkedPartArr = [false, false];
        this.updateActiveDate();
    }
    /**
     * Prevent input losing focus when click panel
     * @param event
     */
    onMousedown(event) {
        event.preventDefault();
    }
    onClickOk() {
        const inputIndex = { left: 0, right: 1 }[this.datePickerService.activeInput];
        const value = this.isRange
            ? this.datePickerService.value[inputIndex]
            : this.datePickerService.value;
        this.changeValueFromSelect(value);
        this.resultOk.emit();
    }
    onClickToday(value) {
        this.changeValueFromSelect(value, !this.showTime);
    }
    onCellHover(value) {
        if (!this.isRange) {
            return;
        }
        const otherInputIndex = { left: 1, right: 0 }[this.datePickerService.activeInput];
        const base = this.datePickerService.value[otherInputIndex];
        if (base) {
            if (base.isBeforeDay(value)) {
                this.hoverValue = [base, value];
            }
            else {
                this.hoverValue = [value, base];
            }
        }
    }
    onPanelModeChange(mode, partType) {
        if (this.isRange) {
            const index = this.datePickerService.getActiveIndex(partType);
            if (index === 0) {
                this.panelMode = [mode, this.panelMode[1]];
            }
            else {
                this.panelMode = [this.panelMode[0], mode];
            }
        }
        else {
            this.panelMode = mode;
        }
        this.panelModeChange.emit(this.panelMode);
    }
    onActiveDateChange(value, partType) {
        if (this.isRange) {
            const activeDate = [];
            activeDate[this.datePickerService.getActiveIndex(partType)] = value;
            this.datePickerService.setActiveDate(activeDate, this.hasTimePicker, this.getPanelMode(this.endPanelMode, partType));
        }
        else {
            this.datePickerService.setActiveDate(value);
        }
    }
    onSelectTime(value, partType) {
        if (this.isRange) {
            const newValue = cloneDate(this.datePickerService.value);
            const index = this.datePickerService.getActiveIndex(partType);
            newValue[index] = this.overrideHms(value, newValue[index]);
            this.datePickerService.setValue(newValue);
        }
        else {
            const newValue = this.overrideHms(value, this.datePickerService.value);
            this.datePickerService.setValue(newValue); // If not select a date currently, use today
        }
        this.datePickerService.inputPartChange$.next();
        this.buildTimeOptions();
    }
    changeValueFromSelect(value, emitValue = true) {
        if (this.isRange) {
            const selectedValue = cloneDate(this.datePickerService.value);
            const checkedPart = this.datePickerService.activeInput;
            let nextPart = checkedPart;
            selectedValue[this.datePickerService.getActiveIndex(checkedPart)] = value;
            this.checkedPartArr[this.datePickerService.getActiveIndex(checkedPart)] = true;
            this.hoverValue = selectedValue;
            if (emitValue) {
                /**
                 * if sort order is wrong, clear the other part's value
                 */
                if (wrongSortOrder(selectedValue)) {
                    nextPart = this.reversedPart(checkedPart);
                    selectedValue[this.datePickerService.getActiveIndex(nextPart)] = null;
                    this.checkedPartArr[this.datePickerService.getActiveIndex(nextPart)] = false;
                }
                this.datePickerService.setValue(selectedValue);
                /**
                 * range date usually selected paired,
                 * so we emit the date value only both date is allowed and both part are checked
                 */
                if (this.isBothAllowed(selectedValue) && this.checkedPartArr[0] && this.checkedPartArr[1]) {
                    this.calendarChange.emit(selectedValue);
                    this.clearHoverValue();
                    this.datePickerService.emitValue$.next();
                }
                else if (this.isAllowed(selectedValue)) {
                    nextPart = this.reversedPart(checkedPart);
                    this.calendarChange.emit([value.clone()]);
                }
            }
            else {
                this.datePickerService.setValue(selectedValue);
            }
            this.datePickerService.inputPartChange$.next(nextPart);
        }
        else {
            this.datePickerService.setValue(value);
            this.datePickerService.inputPartChange$.next();
            if (emitValue && this.isAllowed(value)) {
                this.datePickerService.emitValue$.next();
            }
        }
    }
    reversedPart(part) {
        return part === 'left' ? 'right' : 'left';
    }
    getPanelMode(panelMode, partType) {
        if (this.isRange) {
            return panelMode[this.datePickerService.getActiveIndex(partType)];
        }
        else {
            return panelMode;
        }
    }
    // Get single value or part value of a range
    getValue(partType) {
        if (this.isRange) {
            return (this.datePickerService.value || [])[this.datePickerService.getActiveIndex(partType)];
        }
        else {
            return this.datePickerService.value;
        }
    }
    getActiveDate(partType) {
        if (this.isRange) {
            return this.datePickerService.activeDate[this.datePickerService.getActiveIndex(partType)];
        }
        else {
            return this.datePickerService.activeDate;
        }
    }
    isOneAllowed(selectedValue) {
        const index = this.datePickerService.getActiveIndex();
        const disabledTimeArr = [this.disabledStartTime, this.disabledEndTime];
        return isAllowedDate(selectedValue[index], this.disabledDate, disabledTimeArr[index]);
    }
    isBothAllowed(selectedValue) {
        return (isAllowedDate(selectedValue[0], this.disabledDate, this.disabledStartTime) &&
            isAllowedDate(selectedValue[1], this.disabledDate, this.disabledEndTime));
    }
    isAllowed(value, isBoth = false) {
        if (this.isRange) {
            return isBoth ? this.isBothAllowed(value) : this.isOneAllowed(value);
        }
        else {
            return isAllowedDate(value, this.disabledDate, this.disabledTime);
        }
    }
    getTimeOptions(partType) {
        if (this.showTime && this.timeOptions) {
            return this.timeOptions instanceof Array ? this.timeOptions[this.datePickerService.getActiveIndex(partType)] : this.timeOptions;
        }
        return null;
    }
    onClickPresetRange(val) {
        const value = typeof val === 'function' ? val() : val;
        if (value) {
            this.datePickerService.setValue([new CandyDate(value[0]), new CandyDate(value[1])]);
            this.datePickerService.emitValue$.next();
        }
    }
    onPresetRangeMouseLeave() {
        this.clearHoverValue();
    }
    onHoverPresetRange(val) {
        if (typeof val !== 'function') {
            this.hoverValue = [new CandyDate(val[0]), new CandyDate(val[1])];
        }
    }
    getObjectKeys(obj) {
        return obj ? Object.keys(obj) : [];
    }
    show(partType) {
        const hide = this.showTime && this.isRange && this.datePickerService.activeInput !== partType;
        return !hide;
    }
    clearHoverValue() {
        this.hoverValue = [];
    }
    buildTimeOptions() {
        if (this.showTime) {
            const showTime = typeof this.showTime === 'object' ? this.showTime : {};
            if (this.isRange) {
                const value = this.datePickerService.value;
                this.timeOptions = [this.overrideTimeOptions(showTime, value[0], 'start'), this.overrideTimeOptions(showTime, value[1], 'end')];
            }
            else {
                this.timeOptions = this.overrideTimeOptions(showTime, this.datePickerService.value);
            }
        }
        else {
            this.timeOptions = null;
        }
    }
    overrideTimeOptions(origin, value, partial) {
        let disabledTimeFn;
        if (partial) {
            disabledTimeFn = partial === 'start' ? this.disabledStartTime : this.disabledEndTime;
        }
        else {
            disabledTimeFn = this.disabledTime;
        }
        return Object.assign(Object.assign({}, origin), getTimeConfig(value, disabledTimeFn));
    }
    overrideHms(newValue, oldValue) {
        // tslint:disable-next-line:no-parameter-reassignment
        newValue = newValue || new CandyDate();
        // tslint:disable-next-line:no-parameter-reassignment
        oldValue = oldValue || new CandyDate();
        return oldValue.setHms(newValue.getHours(), newValue.getMinutes(), newValue.getSeconds());
    }
}
DateRangePopupComponent.decorators = [
    { type: Component, args: [{
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                // tslint:disable-next-line:component-selector
                selector: 'date-range-popup',
                exportAs: 'dateRangePopup',
                template: `
    <ng-container *ngIf="isRange; else singlePanel">
      <div class="{{ prefixCls }}-range-wrapper {{ prefixCls }}-date-range-wrapper">
        <div class="{{ prefixCls }}-range-arrow" [style.left.px]="datePickerService?.arrowLeft"></div>
        <div class="{{ prefixCls }}-panel-container">
          <div class="{{ prefixCls }}-panels">
            <ng-container *ngTemplateOutlet="tplRangePart; context: { partType: 'left' }"></ng-container>
            <ng-container *ngTemplateOutlet="tplRangePart; context: { partType: 'right' }"></ng-container>
          </div>
          <ng-container *ngTemplateOutlet="tplFooter"></ng-container>
        </div>
      </div>
    </ng-container>
    <ng-template #singlePanel>
      <div
        class="{{ prefixCls }}-panel-container {{ showWeek ? prefixCls + '-week-number' : '' }} {{
          hasTimePicker ? prefixCls + '-time' : ''
        }} {{ isRange ? prefixCls + '-range' : '' }}"
      >
        <div class="{{ prefixCls }}-panel" [class.ant-picker-panel-rtl]="dir === 'rtl'" tabindex="-1">
          <!-- Single ONLY -->
          <ng-container *ngTemplateOutlet="tplInnerPopup"></ng-container>
          <ng-container *ngTemplateOutlet="tplFooter"></ng-container>
        </div>
      </div>
    </ng-template>

    <ng-template #tplInnerPopup let-partType="partType">
      <!-- TODO(@wenqi73) [selectedValue] [hoverValue] types-->
      <inner-popup
        *ngIf="show(partType)"
        [showWeek]="showWeek"
        [endPanelMode]="getPanelMode(endPanelMode, partType)"
        [partType]="partType"
        [locale]="locale!"
        [showTimePicker]="hasTimePicker"
        [timeOptions]="getTimeOptions(partType)"
        [panelMode]="getPanelMode(panelMode, partType)"
        (panelModeChange)="onPanelModeChange($event, partType)"
        [activeDate]="getActiveDate(partType)"
        [value]="getValue(partType)"
        [disabledDate]="disabledDate"
        [dateRender]="dateRender"
        [selectedValue]="$any(datePickerService?.value)"
        [hoverValue]="$any(hoverValue)"
        (cellHover)="onCellHover($event)"
        (selectDate)="changeValueFromSelect($event, !showTime)"
        (selectTime)="onSelectTime($event, partType)"
        (headerChange)="onActiveDateChange($event, partType)"
      ></inner-popup>
    </ng-template>

    <ng-template #tplFooter>
      <calendar-footer
        *ngIf="hasFooter"
        [locale]="locale!"
        [isRange]="isRange"
        [showToday]="showToday"
        [showNow]="showNow"
        [hasTimePicker]="hasTimePicker"
        [okDisabled]="!isAllowed($any(datePickerService?.value))"
        [extraFooter]="extraFooter"
        [rangeQuickSelector]="ranges ? tplRangeQuickSelector : null"
        (clickOk)="onClickOk()"
        (clickToday)="onClickToday($event)"
      ></calendar-footer>
    </ng-template>

    <ng-template #tplRangePart let-partType="partType">
      <div class="{{ prefixCls }}-panel" [class.ant-picker-panel-rtl]="dir === 'rtl'">
        <ng-container *ngTemplateOutlet="tplInnerPopup; context: { partType: partType }"></ng-container>
      </div>
    </ng-template>

    <!-- Range ONLY: Range Quick Selector -->
    <ng-template #tplRangeQuickSelector>
      <li
        *ngFor="let name of getObjectKeys(ranges)"
        class="{{ prefixCls }}-preset"
        (click)="onClickPresetRange(ranges![name])"
        (mouseenter)="onHoverPresetRange(ranges![name])"
        (mouseleave)="onPresetRangeMouseLeave()"
      >
        <span class="ant-tag ant-tag-blue">{{ name }}</span>
      </li>
    </ng-template>
  `,
                host: {
                    '(mousedown)': 'onMousedown($event)'
                }
            },] }
];
DateRangePopupComponent.ctorParameters = () => [
    { type: DatePickerService },
    { type: ChangeDetectorRef }
];
DateRangePopupComponent.propDecorators = {
    isRange: [{ type: Input }],
    showWeek: [{ type: Input }],
    locale: [{ type: Input }],
    disabledDate: [{ type: Input }],
    disabledTime: [{ type: Input }],
    showToday: [{ type: Input }],
    showNow: [{ type: Input }],
    showTime: [{ type: Input }],
    extraFooter: [{ type: Input }],
    ranges: [{ type: Input }],
    dateRender: [{ type: Input }],
    panelMode: [{ type: Input }],
    defaultPickerValue: [{ type: Input }],
    panelModeChange: [{ type: Output }],
    calendarChange: [{ type: Output }],
    resultOk: [{ type: Output }],
    dir: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1yYW5nZS1wb3B1cC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vY29tcG9uZW50cy9kYXRlLXBpY2tlci8iLCJzb3VyY2VzIjpbImRhdGUtcmFuZ2UtcG9wdXAuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7R0FHRztBQUVILE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxZQUFZLEVBQ1osS0FBSyxFQUlMLE1BQU0sRUFHTixpQkFBaUIsRUFDbEIsTUFBTSxlQUFlLENBQUM7QUFHdkIsT0FBTyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQWdELGNBQWMsRUFBRSxNQUFNLHlCQUF5QixDQUFDO0FBRzdILE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDL0IsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQzNDLE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBVzFELE9BQU8sRUFBRSxhQUFhLEVBQUUsYUFBYSxFQUFFLFlBQVksRUFBRSxNQUFNLFFBQVEsQ0FBQztBQW1HcEUsTUFBTSxPQUFPLHVCQUF1QjtJQWtDbEMsWUFBbUIsaUJBQW9DLEVBQVMsR0FBc0I7UUFBbkUsc0JBQWlCLEdBQWpCLGlCQUFpQixDQUFtQjtRQUFTLFFBQUcsR0FBSCxHQUFHLENBQW1CO1FBcEJuRSxvQkFBZSxHQUFHLElBQUksWUFBWSxFQUE2QixDQUFDO1FBQ2hFLG1CQUFjLEdBQUcsSUFBSSxZQUFZLEVBQW1CLENBQUM7UUFDckQsYUFBUSxHQUFHLElBQUksWUFBWSxFQUFRLENBQUMsQ0FBQyx3Q0FBd0M7UUFDdkYsUUFBRyxHQUFjLEtBQUssQ0FBQztRQUVoQyxjQUFTLEdBQVcsWUFBWSxDQUFDO1FBQ2pDLGlCQUFZLEdBQThCLE1BQU0sQ0FBQztRQUNqRCxnQkFBVyxHQUFxRCxJQUFJLENBQUM7UUFDckUsZUFBVSxH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cUI7aUJBQ3JDO2FBQ0Y7OztZQTdHUSxpQkFBaUI7WUFuQnhCLGlCQUFpQjs7O3NCQWtJaEIsS0FBSzt1QkFDTCxLQUFLO3FCQUNMLEtBQUs7MkJBQ0wsS0FBSzsyQkFDTCxLQUFLO3dCQUNMLEtBQUs7c0JBQ0wsS0FBSzt1QkFDTCxLQUFLOzBCQUNMLEtBQUs7cUJBQ0wsS0FBSzt5QkFDTCxLQUFLO3dCQUNMLEtBQUs7aUNBQ0wsS0FBSzs4QkFDTCxNQUFNOzZCQUNOLE1BQU07dUJBQ04sTUFBTTtrQkFDTixLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2dpdGh1Yi5jb20vTkctWk9SUk8vbmctem9ycm8tYW50ZC9ibG9iL21hc3Rlci9MSUNFTlNFXG4gKi9cblxuaW1wb3J0IHtcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdFbmNhcHN1bGF0aW9uXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBEaXJlY3Rpb24gfSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQgeyBDYW5keURhdGUsIGNsb25lRGF0ZSwgQ29tcGF0aWJsZVZhbHVlLCBOb3JtYWxpemVkTW9kZSwgU2luZ2xlVmFsdWUsIHdyb25nU29ydE9yZGVyIH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL3RpbWUnO1xuaW1wb3J0IHsgRnVuY3Rpb25Qcm9wIH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL3R5cGVzJztcbmltcG9ydCB7IE56Q2FsZW5kYXJJMThuSW50ZXJmYWNlIH0gZnJvbSAnbmctem9ycm8tYW50ZC9pMThuJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHRha2VVbnRpbCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IERhdGVQaWNrZXJTZXJ2aWNlIH0gZnJvbSAnLi9kYXRlLXBpY2tlci5zZXJ2aWNlJztcbmltcG9ydCB7XG4gIENvbXBhdGlibGVEYXRlLFxuICBEaXNhYmxlZERhdGVGbixcbiAgRGlzYWJsZWRUaW1lRm4sXG4gIERpc2FibGVkVGltZVBhcnRpYWwsXG4gIE56RGF0ZU1vZGUsXG4gIFByZXNldFJhbmdlcyxcbiAgUmFuZ2VQYXJ0VHlwZSxcbiAgU3VwcG9ydFRpbWVPcHRpb25zXG59IGZyb20gJy4vc3RhbmRhcmQtdHlwZXMnO1xuaW1wb3J0IHsgZ2V0VGltZUNvbmZpZywgaXNBbGxvd2VkRGF0ZSwgUFJFRklYX0NMQVNTIH0gZnJvbSAnLi91dGlsJztcblxuQENvbXBvbmVudCh7XG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6Y29tcG9uZW50LXNlbGVjdG9yXG4gIHNlbGVjdG9yOiAnZGF0ZS1yYW5nZS1wb3B1cCcsXG4gIGV4cG9ydEFzOiAnZGF0ZVJhbmdlUG9wdXAnLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJpc1JhbmdlOyBlbHNlIHNpbmdsZVBhbmVsXCI+XG4gICAgICA8ZGl2IGNsYXNzPVwie3sgcHJlZml4Q2xzIH19LXJhbmdlLXdyYXBwZXIge3sgcHJlZml4Q2xzIH19LWRhdGUtcmFuZ2Utd3JhcHBlclwiPlxuICAgICAgICA8ZGl2IGNsYXNzPVwie3sgcHJlZml4Q2xzIH19LXJhbmdlLWFycm93XCIgW3N0eWxlLmxlZnQucHhdPVwiZGF0ZVBpY2tlclNlcnZpY2U/LmFycm93TGVmdFwiPjwvZGl2PlxuICAgICAgICA8ZGl2IGNsYXNzPVwie3sgcHJlZml4Q2xzIH19LXBhbmVsLWNvbnRhaW5lclwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJ7eyBwcmVmaXhDbHMgfX0tcGFuZWxzXCI+XG4gICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwidHBsUmFuZ2VQYXJ0OyBjb250ZXh0OiB7IHBhcnRUeXBlOiAnbGVmdCcgfVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cInRwbFJhbmdlUGFydDsgY29udGV4dDogeyBwYXJ0VHlwZTogJ3JpZ2h0JyB9XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cInRwbEZvb3RlclwiPjwvbmctY29udGFpbmVyPlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvbmctY29udGFpbmVyPlxuICAgIDxuZy10ZW1wbGF0ZSAjc2luZ2xlUGFuZWw+XG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzPVwie3sgcHJlZml4Q2xzIH19LXBhbmVsLWNvbnRhaW5lciB7eyBzaG93V2VlayA/IHByZWZpeENscyArICctd2Vlay1udW1iZXInIDogJycgfX0ge3tcbiAgICAgICAgICBoYXNUaW1lUGlja2VyID8gcHJlZml4Q2xzICsgJy10aW1lJyA6ICcnXG4gICAgICAgIH19IHt7IGlzUmFuZ2UgPyBwcmVmaXhDbHMgKyAnLXJhbmdlJyA6ICcnIH19XCJcbiAgICAgID5cbiAgICAgICAgPGRpdiBjbGFzcz1cInt7IHByZWZpeENscyB9fS1wYW5lbFwiIFtjbGFzcy5hbnQtcGlja2VyLXBhbmVsLXJ0bF09XCJkaXIgPT09ICdydGwnXCIgdGFiaW5kZXg9XCItMVwiPlxuICAgICAgICAgIDwhLS0gU2luZ2xlIE9OTFkgLS0+XG4gICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cInRwbElubmVyUG9wdXBcIj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwidHBsRm9vdGVyXCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9uZy10ZW1wbGF0ZT5cblxuICAgIDxuZy10ZW1wbGF0ZSAjdHBsSW5uZXJQb3B1cCBsZXQtcGFydFR5cGU9XCJwYXJ0VHlwZVwiPlxuICAgICAgPCEtLSBUT0RPKEB3ZW5xaTczKSBbc2VsZWN0ZWRWYWx1ZV0gW2hvdmVyVmFsdWVdIHR5cGVzLS0+XG4gICAgICA8aW5uZXItcG9wdXBcbiAgICAgICAgKm5nSWY9XCJzaG93KHBhcnRUeXBlKVwiXG4gICAgICAgIFtzaG93V2Vla109XCJzaG93V2Vla1wiXG4gICAgICAgIFtlbmRQYW5lbE1vZGVdPVwiZ2V0UGFuZWxNb2RlKGVuZFBhbmVsTW9kZSwgcGFydFR5cGUpXCJcbiAgICAgICAgW3BhcnRUeXBlXT1cInBhcnRUeXBlXCJcbiAgICAgICAgW2xvY2FsZV09XCJsb2NhbGUhXCJcbiAgICAgICAgW3Nob3dUaW1lUGlja2VyXT1cImhhc1RpbWVQaWNrZXJcIlxuICAgICAgICBbdGltZU9wdGlvbnNdPVwiZ2V0VGltZU9wdGlvbnMocGFydFR5cGUpXCJcbiAgICAgICAgW3BhbmVsTW9kZV09XCJnZXRQYW5lbE1vZGUocGFuZWxNb2RlLCBwYXJ0VHlwZSlcIlxuICAgICAgICAocGFuZWxNb2RlQ2hhbmdlKT1cIm9uUGFuZWxNb2RlQ2hhbmdlKCRldmVudCwgcGFydFR5cGUpXCJcbiAgICAgICAgW2FjdGl2ZURhdGVdPVwiZ2V0QWN0aXZlRGF0ZShwYXJ0VHlwZSlcIlxuICAgICAgICBbdmFsdWVdPVwiZ2V0VmFsdWUocGFydFR5cGUpXCJcbiAgICAgICAgW2Rpc2FibGVkRGF0ZV09XCJkaXNhYmxlZERhdGVcIlxuICAgICAgICBbZGF0ZVJlbmRlcl09XCJkYXRlUmVuZGVyXCJcbiAgICAgICAgW3NlbGVjdGVkVmFsdWVdPVwiJGFueShkYXRlUGlja2VyU2VydmljZT8udmFsdWUpXCJcbiAgICAgICAgW2hvdmVyVmFsdWVdPVwiJGFueShob3ZlclZhbHVlKVwiXG4gICAgICAgIChjZWxsSG92ZXIpPVwib25DZWxsSG92ZXIoJGV2ZW50KVwiXG4gICAgICAgIChzZWxlY3REYXRlKT1cImNoYW5nZVZhbHVlRnJvbVNlbGVjdCgkZXZlbnQsICFzaG93VGltZSlcIlxuICAgICAgICAoc2VsZWN0VGltZSk9XCJvblNlbGVjdFRpbWUoJGV2ZW50LCBwYXJ0VHlwZSlcIlxuICAgICAgICAoaGVhZGVyQ2hhbmdlKT1cIm9uQWN0aXZlRGF0ZUNoYW5nZSgkZXZlbnQsIHBhcnRUeXBlKVwiXG4gICAgICA+PC9pbm5lci1wb3B1cD5cbiAgICA8L25nLXRlbXBsYXRlPlxuXG4gICAgPG5nLXRlbXBsYXRlICN0cGxGb290ZXI+XG4gICAgICA8Y2FsZW5kYXItZm9vdGVyXG4gICAgICAgICpuZ0lmPVwiaGFzRm9vdGVyXCJcbiAgICAgICAgW2xvY2FsZV09XCJsb2NhbGUhXCJcbiAgICAgICAgW2lzUmFuZ2VdPVwiaXNSYW5nZVwiXG4gICAgICAgIFtzaG93VG9kYXldPVwic2hvd1RvZGF5XCJcbiAgICAgICAgW3Nob3dOb3ddPVwic2hvd05vd1wiXG4gICAgICAgIFtoYXNUaW1lUGlja2VyXT1cImhhc1RpbWVQaWNrZXJcIlxuICAgICAgICBbb2tEaXNhYmxlZF09XCIhaXNBbGxvd2VkKCRhbnkoZGF0ZVBpY2tlclNlcnZpY2U/LnZhbHVlKSlcIlxuICAgICAgICBbZXh0cmFGb290ZXJdPVwiZXh0cmFGb290ZXJcIlxuICAgICAgICBbcmFuZ2VRdWlja1NlbGVjdG9yXT1cInJhbmdlcyA/IHRwbFJhbmdlUXVpY2tTZWxlY3RvciA6IG51bGxcIlxuICAgICAgICAoY2xpY2tPayk9XCJvbkNsaWNrT2soKVwiXG4gICAgICAgIChjbGlja1RvZGF5KT1cIm9uQ2xpY2tUb2RheSgkZXZlbnQpXCJcbiAgICAgID48L2NhbGVuZGFyLWZvb3Rlcj5cbiAgICA8L25nLXRlbXBsYXRlPlxuXG4gICAgPG5nLXRlbXBsYXRlICN0cGxSYW5nZVBhcnQgbGV0LXBhcnRUeXBlPVwicGFydFR5cGVcIj5cbiAgICAgIDxkaXYgY2xhc3M9XCJ7eyBwcmVmaXhDbHMgfX0tcGFuZWxcIiBbY2xhc3MuYW50LXBpY2tlci1wYW5lbC1ydGxdPVwiZGlyID09PSAncnRsJ1wiPlxuICAgICAgICA8bmctY29udGFpbmVyICpuZ1RlbXBsYXRlT3V0bGV0PVwidHBsSW5uZXJQb3B1cDsgY29udGV4dDogeyBwYXJ0VHlwZTogcGFydFR5cGUgfVwiPjwvbmctY29udGFpbmVyPlxuICAgICAgPC9kaXY+XG4gICAgPC9uZy10ZW1wbGF0ZT5cblxuICAgIDwhLS0gUmFuZ2UgT05MWTogUmFuZ2UgUXVpY2sgU2VsZWN0b3IgLS0+XG4gICAgPG5nLXRlbXBsYXRlICN0cGxSYW5nZVF1aWNrU2VsZWN0b3I+XG4gICAgICA8bGlcbiAgICAgICAgKm5nRm9yPVwibGV0IG5hbWUgb2YgZ2V0T2JqZWN0S2V5cyhyYW5nZXMpXCJcbiAgICAgICAgY2xhc3M9XCJ7eyBwcmVmaXhDbHMgfX0tcHJlc2V0XCJcbiAgICAgICAgKGNsaWNrKT1cIm9uQ2xpY2tQcmVzZXRSYW5nZShyYW5nZXMhW25hbWVdKVwiXG4gICAgICAgIChtb3VzZWVudGVyKT1cIm9uSG92ZXJQcmVzZXRSYW5nZShyYW5nZXMhW25hbWVdKVwiXG4gICAgICAgIChtb3VzZWxlYXZlKT1cIm9uUHJlc2V0UmFuZ2VNb3VzZUxlYXZlKClcIlxuICAgICAgPlxuICAgICAgICA8c3BhbiBjbGFzcz1cImFudC10YWcgYW50LXRhZy1ibHVlXCI+e3sgbmFtZSB9fTwvc3Bhbj5cbiAgICAgIDwvbGk+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgYCxcbiAgaG9zdDoge1xuICAgICcobW91c2Vkb3duKSc6ICdvbk1vdXNlZG93bigkZXZlbnQpJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIERhdGVSYW5nZVBvcHVwQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XG4gIEBJbnB1dCgpIGlzUmFuZ2UhOiBib29sZWFuO1xuICBASW5wdXQoKSBzaG93V2VlayE6IGJvb2xlYW47XG4gIEBJbnB1dCgpIGxvY2FsZSE6IE56Q2FsZW5kYXJJMThuSW50ZXJmYWNlIHwgdW5kZWZpbmVkO1xuICBASW5wdXQoKSBkaXNhYmxlZERhdGU/OiBEaXNhYmxlZERhdGVGbjtcbiAgQElucHV0KCkgZGlzYWJsZWRUaW1lPzogRGlzYWJsZWRUaW1lRm47IC8vIFRoaXMgd2lsbCBsZWFkIHRvIHJlYnVpbGQgdGltZSBvcHRpb25zXG4gIEBJbnB1dCgpIHNob3dUb2RheSE6IGJvb2xlYW47XG4gIEBJbnB1dCgpIHNob3dOb3chOiBib29sZWFuO1xuICBASW5wdXQoKSBzaG93VGltZSE6IFN1cHBvcnRUaW1lT3B0aW9ucyB8IGJvb2xlYW47XG4gIEBJbnB1dCgpIGV4dHJhRm9vdGVyPzogVGVtcGxhdGVSZWY8dm9pZD4gfCBzdHJpbmc7XG4gIEBJbnB1dCgpIHJhbmdlcz86IFByZXNldFJhbmdlcztcbiAgQElucHV0KCkgZGF0ZVJlbmRlcj86IHN0cmluZyB8IFRlbXBsYXRlUmVmPERhdGU+IHwgRnVuY3Rpb25Qcm9wPFRlbXBsYXRlUmVmPERhdGU+IHwgc3RyaW5nPjtcbiAgQElucHV0KCkgcGFuZWxNb2RlITogTnpEYXRlTW9kZSB8IE56RGF0ZU1vZGVbXTtcbiAgQElucHV0KCkgZGVmYXVsdFBpY2tlclZhbHVlITogQ29tcGF0aWJsZURhdGUgfCB1bmRlZmluZWQgfCBudWxsO1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgcGFuZWxNb2RlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxOekRhdGVNb2RlIHwgTnpEYXRlTW9kZVtdPigpO1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgY2FsZW5kYXJDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPENvbXBhdGlibGVWYWx1ZT4oKTtcbiAgQE91dHB1dCgpIHJlYWRvbmx5IHJlc3VsdE9rID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpOyAvLyBFbWl0dGVkIHdoZW4gZG9uZSB3aXRoIGRhdGUgc2VsZWN0aW5nXG4gIEBJbnB1dCgpIGRpcjogRGlyZWN0aW9uID0gJ2x0cic7XG5cbiAgcHJlZml4Q2xzOiBzdHJpbmcgPSBQUkVGSVhfQ0xBU1M7XG4gIGVuZFBhbmVsTW9kZTogTnpEYXRlTW9kZSB8IE56RGF0ZU1vZGVbXSA9ICdkYXRlJztcbiAgdGltZU9wdGlvbnM6IFN1cHBvcnRUaW1lT3B0aW9ucyB8IFN1cHBvcnRUaW1lT3B0aW9uc1tdIHwgbnVsbCA9IG51bGw7XG4gIGhvdmVyVmFsdWU6IFNpbmdsZVZhbHVlW10gPSBbXTsgLy8gUmFuZ2UgT05MWVxuICBjaGVja2VkUGFydEFycjogYm9vbGVhbltdID0gW2ZhbHNlLCBmYWxzZV07XG4gIGRlc3Ryb3kkID0gbmV3IFN1YmplY3QoKTtcblxuICBnZXQgaGFzVGltZVBpY2tlcigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISF0aGlzLnNob3dUaW1lO1xuICB9XG5cbiAgZ2V0IGhhc0Zvb3RlcigpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5zaG93VG9kYXkgfHwgdGhpcy5oYXNUaW1lUGlja2VyIHx8ICEhdGhpcy5leHRyYUZvb3RlciB8fCAhIXRoaXMucmFuZ2VzO1xuICB9XG5cbiAgY29uc3RydWN0b3IocHVibGljIGRhdGVQaWNrZXJTZXJ2aWNlOiBEYXRlUGlja2VyU2VydmljZSwgcHVibGljIGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWYpIHt9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5kYXRlUGlja2VyU2VydmljZS52YWx1ZUNoYW5nZSQucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZUFjdGl2ZURhdGUoKTtcbiAgICAgIHRoaXMuY2RyLm1hcmtGb3JDaGVjaygpO1xuICAgIH0pO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIC8vIFBhcnNlIHNob3dUaW1lIG9wdGlvbnNcbiAgICBpZiAoY2hhbmdlcy5zaG93VGltZSB8fCBjaGFuZ2VzLmRpc2FibGVkVGltZSkge1xuICAgICAgaWYgKHRoaXMuc2hvd1RpbWUpIHtcbiAgICAgICAgdGhpcy5idWlsZFRpbWVPcHRpb25zKCk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChjaGFuZ2VzLnBhbmVsTW9kZSkge1xuICAgICAgdGhpcy5lbmRQYW5lbE1vZGUgPSB0aGlzLnBhbmVsTW9kZTtcbiAgICB9XG4gICAgaWYgKGNoYW5nZXMuZGVmYXVsdFBpY2tlclZhbHVlKSB7XG4gICAgICB0aGlzLnVwZGF0ZUFjdGl2ZURhdGUoKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLmRlc3Ryb3kkLm5leHQoKTtcbiAgICB0aGlzLmRlc3Ryb3kkLmNvbXBsZXRlKCk7XG4gIH1cblxuICB1cGRhdGVBY3RpdmVEYXRlKCk6IHZvaWQge1xuICAgIGNvbnN0IGFjdGl2ZURhdGUgPSB0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLmhhc1ZhbHVlKClcbiAgICAgID8gdGhpcy5kYXRlUGlja2VyU2VydmljZS52YWx1ZVxuICAgICAgOiB0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLm1ha2VWYWx1ZSh0aGlzLmRlZmF1bHRQaWNrZXJWYWx1ZSEpO1xuICAgIHRoaXMuZGF0ZVBpY2tlclNlcnZpY2Uuc2V0QWN0aXZlRGF0ZShhY3RpdmVEYXRlLCB0aGlzLmhhc1RpbWVQaWNrZXIsIHRoaXMuZ2V0UGFuZWxNb2RlKHRoaXMuZW5kUGFuZWxNb2RlKSBhcyBOb3JtYWxpemVkTW9kZSk7XG4gIH1cblxuICBpbml0KCk6IHZvaWQge1xuICAgIHRoaXMuY2hlY2tlZFBhcnRBcnIgPSBbZmFsc2UsIGZhbHNlXTtcbiAgICB0aGlzLnVwZGF0ZUFjdGl2ZURhdGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcmV2ZW50IGlucHV0IGxvc2luZyBmb2N1cyB3aGVuIGNsaWNrIHBhbmVsXG4gICAqIEBwYXJhbSBldmVudFxuICAgKi9cbiAgb25Nb3VzZWRvd24oZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG5cbiAgb25DbGlja09rKCk6IHZvaWQge1xuICAgIGNvbnN0IGlucHV0SW5kZXggPSB7IGxlZnQ6IDAsIHJpZ2h0OiAxIH1bdGhpcy5kYXRlUGlja2VyU2VydmljZS5hY3RpdmVJbnB1dF07XG4gICAgY29uc3QgdmFsdWU6IENhbmR5RGF0ZSA9IHRoaXMuaXNSYW5nZVxuICAgICAgPyAodGhpcy5kYXRlUGlja2VyU2VydmljZS52YWx1ZSBhcyBDYW5keURhdGVbXSlbaW5wdXRJbmRleF1cbiAgICAgIDogKHRoaXMuZGF0ZVBpY2tlclNlcnZpY2UudmFsdWUgYXMgQ2FuZHlEYXRlKTtcbiAgICB0aGlzLmNoYW5nZVZhbHVlRnJvbVNlbGVjdCh2YWx1ZSk7XG4gICAgdGhpcy5yZXN1bHRPay5lbWl0KCk7XG4gIH1cblxuICBvbkNsaWNrVG9kYXkodmFsdWU6IENhbmR5RGF0ZSk6IHZvaWQge1xuICAgIHRoaXMuY2hhbmdlVmFsdWVGcm9tU2VsZWN0KHZhbHVlLCAhdGhpcy5zaG93VGltZSk7XG4gIH1cblxuICBvbkNlbGxIb3Zlcih2YWx1ZTogQ2FuZHlEYXRlKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmlzUmFuZ2UpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3Qgb3RoZXJJbnB1dEluZGV4ID0geyBsZWZ0OiAxLCByaWdodDogMCB9W3RoaXMuZGF0ZVBpY2tlclNlcnZpY2UuYWN0aXZlSW5wdXRdO1xuICAgIGNvbnN0IGJhc2UgPSAodGhpcy5kYXRlUGlja2VyU2VydmljZS52YWx1ZSBhcyBDYW5keURhdGVbXSlbb3RoZXJJbnB1dEluZGV4XSE7XG4gICAgaWYgKGJhc2UpIHtcbiAgICAgIGlmIChiYXNlLmlzQmVmb3JlRGF5KHZhbHVlKSkge1xuICAgICAgICB0aGlzLmhvdmVyVmFsdWUgPSBbYmFzZSwgdmFsdWVdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5ob3ZlclZhbHVlID0gW3ZhbHVlLCBiYXNlXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBvblBhbmVsTW9kZUNoYW5nZShtb2RlOiBOekRhdGVNb2RlLCBwYXJ0VHlwZT86IFJhbmdlUGFydFR5cGUpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pc1JhbmdlKSB7XG4gICAgICBjb25zdCBpbmRleCA9IHRoaXMuZGF0ZVBpY2tlclNlcnZpY2UuZ2V0QWN0aXZlSW5kZXgocGFydFR5cGUpO1xuICAgICAgaWYgKGluZGV4ID09PSAwKSB7XG4gICAgICAgIHRoaXMucGFuZWxNb2RlID0gW21vZGUsIHRoaXMucGFuZWxNb2RlWzFdXSBhcyBOekRhdGVNb2RlW107XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnBhbmVsTW9kZSA9IFt0aGlzLnBhbmVsTW9kZVswXSwgbW9kZV0gYXMgTnpEYXRlTW9kZVtdO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnBhbmVsTW9kZSA9IG1vZGU7XG4gICAgfVxuICAgIHRoaXMucGFuZWxNb2RlQ2hhbmdlLmVtaXQodGhpcy5wYW5lbE1vZGUpO1xuICB9XG5cbiAgb25BY3RpdmVEYXRlQ2hhbmdlKHZhbHVlOiBDYW5keURhdGUsIHBhcnRUeXBlOiBSYW5nZVBhcnRUeXBlKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaXNSYW5nZSkge1xuICAgICAgY29uc3QgYWN0aXZlRGF0ZTogU2luZ2xlVmFsdWVbXSA9IFtdO1xuICAgICAgYWN0aXZlRGF0ZVt0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLmdldEFjdGl2ZUluZGV4KHBhcnRUeXBlKV0gPSB2YWx1ZTtcbiAgICAgIHRoaXMuZGF0ZVBpY2tlclNlcnZpY2Uuc2V0QWN0aXZlRGF0ZShcbiAgICAgICAgYWN0aXZlRGF0ZSxcbiAgICAgICAgdGhpcy5oYXNUaW1lUGlja2VyLFxuICAgICAgICB0aGlzLmdldFBhbmVsTW9kZSh0aGlzLmVuZFBhbmVsTW9kZSwgcGFydFR5cGUpIGFzIE5vcm1hbGl6ZWRNb2RlXG4gICAgICApO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLnNldEFjdGl2ZURhdGUodmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIG9uU2VsZWN0VGltZSh2YWx1ZTogQ2FuZHlEYXRlLCBwYXJ0VHlwZT86IFJhbmdlUGFydFR5cGUpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pc1JhbmdlKSB7XG4gICAgICBjb25zdCBuZXdWYWx1ZSA9IGNsb25lRGF0ZSh0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLnZhbHVlKSBhcyBTaW5nbGVWYWx1ZVtdO1xuICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLmdldEFjdGl2ZUluZGV4KHBhcnRUeXBlKTtcbiAgICAgIG5ld1ZhbHVlW2luZGV4XSA9IHRoaXMub3ZlcnJpZGVIbXModmFsdWUsIG5ld1ZhbHVlW2luZGV4XSk7XG4gICAgICB0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLnNldFZhbHVlKG5ld1ZhbHVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgbmV3VmFsdWUgPSB0aGlzLm92ZXJyaWRlSG1zKHZhbHVlLCB0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLnZhbHVlIGFzIENhbmR5RGF0ZSk7XG4gICAgICB0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLnNldFZhbHVlKG5ld1ZhbHVlKTsgLy8gSWYgbm90IHNlbGVjdCBhIGRhdGUgY3VycmVudGx5LCB1c2UgdG9kYXlcbiAgICB9XG4gICAgdGhpcy5kYXRlUGlja2VyU2VydmljZS5pbnB1dFBhcnRDaGFuZ2UkLm5leHQoKTtcbiAgICB0aGlzLmJ1aWxkVGltZU9wdGlvbnMoKTtcbiAgfVxuXG4gIGNoYW5nZVZhbHVlRnJvbVNlbGVjdCh2YWx1ZTogQ2FuZHlEYXRlLCBlbWl0VmFsdWU6IGJvb2xlYW4gPSB0cnVlKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaXNSYW5nZSkge1xuICAgICAgY29uc3Qgc2VsZWN0ZWRWYWx1ZTogU2luZ2xlVmFsdWVbXSA9IGNsb25lRGF0ZSh0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLnZhbHVlKSBhcyBDYW5keURhdGVbXTtcbiAgICAgIGNvbnN0IGNoZWNrZWRQYXJ0OiBSYW5nZVBhcnRUeXBlID0gdGhpcy5kYXRlUGlja2VyU2VydmljZS5hY3RpdmVJbnB1dDtcbiAgICAgIGxldCBuZXh0UGFydDogUmFuZ2VQYXJ0VHlwZSA9IGNoZWNrZWRQYXJ0O1xuXG4gICAgICBzZWxlY3RlZFZhbHVlW3RoaXMuZGF0ZVBpY2tlclNlcnZpY2UuZ2V0QWN0aXZlSW5kZXgoY2hlY2tlZFBhcnQpXSA9IHZhbHVlO1xuICAgICAgdGhpcy5jaGVja2VkUGFydEFyclt0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLmdldEFjdGl2ZUluZGV4KGNoZWNrZWRQYXJ0KV0gPSB0cnVlO1xuICAgICAgdGhpcy5ob3ZlclZhbHVlID0gc2VsZWN0ZWRWYWx1ZTtcblxuICAgICAgaWYgKGVtaXRWYWx1ZSkge1xuICAgICAgICAvKipcbiAgICAgICAgICogaWYgc29ydCBvcmRlciBpcyB3cm9uZywgY2xlYXIgdGhlIG90aGVyIHBhcnQncyB2YWx1ZVxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKHdyb25nU29ydE9yZGVyKHNlbGVjdGVkVmFsdWUpKSB7XG4gICAgICAgICAgbmV4dFBhcnQgPSB0aGlzLnJldmVyc2VkUGFydChjaGVja2VkUGFydCk7XG4gICAgICAgICAgc2VsZWN0ZWRWYWx1ZVt0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLmdldEFjdGl2ZUluZGV4KG5leHRQYXJ0KV0gPSBudWxsO1xuICAgICAgICAgIHRoaXMuY2hlY2tlZFBhcnRBcnJbdGhpcy5kYXRlUGlja2VyU2VydmljZS5nZXRBY3RpdmVJbmRleChuZXh0UGFydCldID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLnNldFZhbHVlKHNlbGVjdGVkVmFsdWUpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiByYW5nZSBkYXRlIHVzdWFsbHkgc2VsZWN0ZWQgcGFpcmVkLFxuICAgICAgICAgKiBzbyB3ZSBlbWl0IHRoZSBkYXRlIHZhbHVlIG9ubHkgYm90aCBkYXRlIGlzIGFsbG93ZWQgYW5kIGJvdGggcGFydCBhcmUgY2hlY2tlZFxuICAgICAgICAgKi9cbiAgICAgICAgaWYgKHRoaXMuaXNCb3RoQWxsb3dlZChzZWxlY3RlZFZhbHVlKSAmJiB0aGlzLmNoZWNrZWRQYXJ0QXJyWzBdICYmIHRoaXMuY2hlY2tlZFBhcnRBcnJbMV0pIHtcbiAgICAgICAgICB0aGlzLmNhbGVuZGFyQ2hhbmdlLmVtaXQoc2VsZWN0ZWRWYWx1ZSk7XG4gICAgICAgICAgdGhpcy5jbGVhckhvdmVyVmFsdWUoKTtcbiAgICAgICAgICB0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLmVtaXRWYWx1ZSQubmV4dCgpO1xuICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNBbGxvd2VkKHNlbGVjdGVkVmFsdWUpKSB7XG4gICAgICAgICAgbmV4dFBhcnQgPSB0aGlzLnJldmVyc2VkUGFydChjaGVja2VkUGFydCk7XG4gICAgICAgICAgdGhpcy5jYWxlbmRhckNoYW5nZS5lbWl0KFt2YWx1ZS5jbG9uZSgpXSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZGF0ZVBpY2tlclNlcnZpY2Uuc2V0VmFsdWUoc2VsZWN0ZWRWYWx1ZSk7XG4gICAgICB9XG4gICAgICB0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLmlucHV0UGFydENoYW5nZSQubmV4dChuZXh0UGFydCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuZGF0ZVBpY2tlclNlcnZpY2Uuc2V0VmFsdWUodmFsdWUpO1xuICAgICAgdGhpcy5kYXRlUGlja2VyU2VydmljZS5pbnB1dFBhcnRDaGFuZ2UkLm5leHQoKTtcblxuICAgICAgaWYgKGVtaXRWYWx1ZSAmJiB0aGlzLmlzQWxsb3dlZCh2YWx1ZSkpIHtcbiAgICAgICAgdGhpcy5kYXRlUGlja2VyU2VydmljZS5lbWl0VmFsdWUkLm5leHQoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXZlcnNlZFBhcnQocGFydDogUmFuZ2VQYXJ0VHlwZSk6IFJhbmdlUGFydFR5cGUge1xuICAgIHJldHVybiBwYXJ0ID09PSAnbGVmdCcgPyAncmlnaHQnIDogJ2xlZnQnO1xuICB9XG5cbiAgZ2V0UGFuZWxNb2RlKHBhbmVsTW9kZTogTnpEYXRlTW9kZSB8IE56RGF0ZU1vZGVbXSwgcGFydFR5cGU/OiBSYW5nZVBhcnRUeXBlKTogTnpEYXRlTW9kZSB7XG4gICAgaWYgKHRoaXMuaXNSYW5nZSkge1xuICAgICAgcmV0dXJuIHBhbmVsTW9kZVt0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLmdldEFjdGl2ZUluZGV4KHBhcnRUeXBlKV0gYXMgTnpEYXRlTW9kZTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHBhbmVsTW9kZSBhcyBOekRhdGVNb2RlO1xuICAgIH1cbiAgfVxuXG4gIC8vIEdldCBzaW5nbGUgdmFsdWUgb3IgcGFydCB2YWx1ZSBvZiBhIHJhbmdlXG4gIGdldFZhbHVlKHBhcnRUeXBlPzogUmFuZ2VQYXJ0VHlwZSk6IENhbmR5RGF0ZSB7XG4gICAgaWYgKHRoaXMuaXNSYW5nZSkge1xuICAgICAgcmV0dXJuICgodGhpcy5kYXRlUGlja2VyU2VydmljZS52YWx1ZSBhcyBDYW5keURhdGVbXSkgfHwgW10pW3RoaXMuZGF0ZVBpY2tlclNlcnZpY2UuZ2V0QWN0aXZlSW5kZXgocGFydFR5cGUpXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuZGF0ZVBpY2tlclNlcnZpY2UudmFsdWUgYXMgQ2FuZHlEYXRlO1xuICAgIH1cbiAgfVxuXG4gIGdldEFjdGl2ZURhdGUocGFydFR5cGU/OiBSYW5nZVBhcnRUeXBlKTogQ2FuZHlEYXRlIHtcbiAgICBpZiAodGhpcy5pc1JhbmdlKSB7XG4gICAgICByZXR1cm4gKHRoaXMuZGF0ZVBpY2tlclNlcnZpY2UuYWN0aXZlRGF0ZSBhcyBDYW5keURhdGVbXSlbdGhpcy5kYXRlUGlja2VyU2VydmljZS5nZXRBY3RpdmVJbmRleChwYXJ0VHlwZSldO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5kYXRlUGlja2VyU2VydmljZS5hY3RpdmVEYXRlIGFzIENhbmR5RGF0ZTtcbiAgICB9XG4gIH1cblxuICBkaXNhYmxlZFN0YXJ0VGltZTogRGlzYWJsZWRUaW1lRm4gPSAodmFsdWU6IERhdGUgfCBEYXRlW10pID0+IHtcbiAgICByZXR1cm4gdGhpcy5kaXNhYmxlZFRpbWUgJiYgdGhpcy5kaXNhYmxlZFRpbWUodmFsdWUsICdzdGFydCcpO1xuICB9O1xuXG4gIGRpc2FibGVkRW5kVGltZTogRGlzYWJsZWRUaW1lRm4gPSAodmFsdWU6IERhdGUgfCBEYXRlW10pID0+IHtcbiAgICByZXR1cm4gdGhpcy5kaXNhYmxlZFRpbWUgJiYgdGhpcy5kaXNhYmxlZFRpbWUodmFsdWUsICdlbmQnKTtcbiAgfTtcblxuICBpc09uZUFsbG93ZWQoc2VsZWN0ZWRWYWx1ZTogU2luZ2xlVmFsdWVbXSk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5kYXRlUGlja2VyU2VydmljZS5nZXRBY3RpdmVJbmRleCgpO1xuICAgIGNvbnN0IGRpc2FibGVkVGltZUFyciA9IFt0aGlzLmRpc2FibGVkU3RhcnRUaW1lLCB0aGlzLmRpc2FibGVkRW5kVGltZV07XG4gICAgcmV0dXJuIGlzQWxsb3dlZERhdGUoc2VsZWN0ZWRWYWx1ZVtpbmRleF0hLCB0aGlzLmRpc2FibGVkRGF0ZSwgZGlzYWJsZWRUaW1lQXJyW2luZGV4XSk7XG4gIH1cblxuICBpc0JvdGhBbGxvd2VkKHNlbGVjdGVkVmFsdWU6IFNpbmdsZVZhbHVlW10pOiBib29sZWFuIHtcbiAgICByZXR1cm4gKFxuICAgICAgaXNBbGxvd2VkRGF0ZShzZWxlY3RlZFZhbHVlWzBdISwgdGhpcy5kaXNhYmxlZERhdGUsIHRoaXMuZGlzYWJsZWRTdGFydFRpbWUpICYmXG4gICAgICBpc0FsbG93ZWREYXRlKHNlbGVjdGVkVmFsdWVbMV0hLCB0aGlzLmRpc2FibGVkRGF0ZSwgdGhpcy5kaXNhYmxlZEVuZFRpbWUpXG4gICAgKTtcbiAgfVxuXG4gIGlzQWxsb3dlZCh2YWx1ZTogQ29tcGF0aWJsZVZhbHVlLCBpc0JvdGg6IGJvb2xlYW4gPSBmYWxzZSk6IGJvb2xlYW4ge1xuICAgIGlmICh0aGlzLmlzUmFuZ2UpIHtcbiAgICAgIHJldHVybiBpc0JvdGggPyB0aGlzLmlzQm90aEFsbG93ZWQodmFsdWUgYXMgQ2FuZHlEYXRlW10pIDogdGhpcy5pc09uZUFsbG93ZWQodmFsdWUgYXMgQ2FuZHlEYXRlW10pO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gaXNBbGxvd2VkRGF0ZSh2YWx1ZSBhcyBDYW5keURhdGUsIHRoaXMuZGlzYWJsZWREYXRlLCB0aGlzLmRpc2FibGVkVGltZSk7XG4gICAgfVxuICB9XG5cbiAgZ2V0VGltZU9wdGlvbnMocGFydFR5cGU/OiBSYW5nZVBhcnRUeXBlKTogU3VwcG9ydFRpbWVPcHRpb25zIHwgbnVsbCB7XG4gICAgaWYgKHRoaXMuc2hvd1RpbWUgJiYgdGhpcy50aW1lT3B0aW9ucykge1xuICAgICAgcmV0dXJuIHRoaXMudGltZU9wdGlvbnMgaW5zdGFuY2VvZiBBcnJheSA/IHRoaXMudGltZU9wdGlvbnNbdGhpcy5kYXRlUGlja2VyU2VydmljZS5nZXRBY3RpdmVJbmRleChwYXJ0VHlwZSldIDogdGhpcy50aW1lT3B0aW9ucztcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBvbkNsaWNrUHJlc2V0UmFuZ2UodmFsOiBQcmVzZXRSYW5nZXNba2V5b2YgUHJlc2V0UmFuZ2VzXSk6IHZvaWQge1xuICAgIGNvbnN0IHZhbHVlID0gdHlwZW9mIHZhbCA9PT0gJ2Z1bmN0aW9uJyA/IHZhbCgpIDogdmFsO1xuICAgIGlmICh2YWx1ZSkge1xuICAgICAgdGhpcy5kYXRlUGlja2VyU2VydmljZS5zZXRWYWx1ZShbbmV3IENhbmR5RGF0ZSh2YWx1ZVswXSksIG5ldyBDYW5keURhdGUodmFsdWVbMV0pXSk7XG4gICAgICB0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLmVtaXRWYWx1ZSQubmV4dCgpO1xuICAgIH1cbiAgfVxuXG4gIG9uUHJlc2V0UmFuZ2VNb3VzZUxlYXZlKCk6IHZvaWQge1xuICAgIHRoaXMuY2xlYXJIb3ZlclZhbHVlKCk7XG4gIH1cblxuICBvbkhvdmVyUHJlc2V0UmFuZ2UodmFsOiBQcmVzZXRSYW5nZXNba2V5b2YgUHJlc2V0UmFuZ2VzXSk6IHZvaWQge1xuICAgIGlmICh0eXBlb2YgdmFsICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLmhvdmVyVmFsdWUgPSBbbmV3IENhbmR5RGF0ZSh2YWxbMF0pLCBuZXcgQ2FuZHlEYXRlKHZhbFsxXSldO1xuICAgIH1cbiAgfVxuXG4gIGdldE9iamVjdEtleXMob2JqPzogUHJlc2V0UmFuZ2VzKTogc3RyaW5nW10ge1xuICAgIHJldHVybiBvYmogPyBPYmplY3Qua2V5cyhvYmopIDogW107XG4gIH1cblxuICBzaG93KHBhcnRUeXBlOiBSYW5nZVBhcnRUeXBlKTogYm9vbGVhbiB7XG4gICAgY29uc3QgaGlkZSA9IHRoaXMuc2hvd1RpbWUgJiYgdGhpcy5pc1JhbmdlICYmIHRoaXMuZGF0ZVBpY2tlclNlcnZpY2UuYWN0aXZlSW5wdXQgIT09IHBhcnRUeXBlO1xuICAgIHJldHVybiAhaGlkZTtcbiAgfVxuXG4gIHByaXZhdGUgY2xlYXJIb3ZlclZhbHVlKCk6IHZvaWQge1xuICAgIHRoaXMuaG92ZXJWYWx1ZSA9IFtdO1xuICB9XG5cbiAgcHJpdmF0ZSBidWlsZFRpbWVPcHRpb25zKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnNob3dUaW1lKSB7XG4gICAgICBjb25zdCBzaG93VGltZSA9IHR5cGVvZiB0aGlzLnNob3dUaW1lID09PSAnb2JqZWN0JyA/IHRoaXMuc2hvd1RpbWUgOiB7fTtcbiAgICAgIGlmICh0aGlzLmlzUmFuZ2UpIHtcbiAgICAgICAgY29uc3QgdmFsdWUgPSB0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLnZhbHVlIGFzIENhbmR5RGF0ZVtdO1xuICAgICAgICB0aGlzLnRpbWVPcHRpb25zID0gW3RoaXMub3ZlcnJpZGVUaW1lT3B0aW9ucyhzaG93VGltZSwgdmFsdWVbMF0sICdzdGFydCcpLCB0aGlzLm92ZXJyaWRlVGltZU9wdGlvbnMoc2hvd1RpbWUsIHZhbHVlWzFdLCAnZW5kJyldO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy50aW1lT3B0aW9ucyA9IHRoaXMub3ZlcnJpZGVUaW1lT3B0aW9ucyhzaG93VGltZSwgdGhpcy5kYXRlUGlja2VyU2VydmljZS52YWx1ZSBhcyBDYW5keURhdGUpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnRpbWVPcHRpb25zID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIG92ZXJyaWRlVGltZU9wdGlvbnMob3JpZ2luOiBTdXBwb3J0VGltZU9wdGlvbnMsIHZhbHVlOiBDYW5keURhdGUsIHBhcnRpYWw/OiBEaXNhYmxlZFRpbWVQYXJ0aWFsKTogU3VwcG9ydFRpbWVPcHRpb25zIHtcbiAgICBsZXQgZGlzYWJsZWRUaW1lRm47XG4gICAgaWYgKHBhcnRpYWwpIHtcbiAgICAgIGRpc2FibGVkVGltZUZuID0gcGFydGlhbCA9PT0gJ3N0YXJ0JyA/IHRoaXMuZGlzYWJsZWRTdGFydFRpbWUgOiB0aGlzLmRpc2FibGVkRW5kVGltZTtcbiAgICB9IGVsc2Uge1xuICAgICAgZGlzYWJsZWRUaW1lRm4gPSB0aGlzLmRpc2FibGVkVGltZTtcbiAgICB9XG4gICAgcmV0dXJuIHsgLi4ub3JpZ2luLCAuLi5nZXRUaW1lQ29uZmlnKHZhbHVlLCBkaXNhYmxlZFRpbWVGbikgfTtcbiAgfVxuXG4gIHByaXZhdGUgb3ZlcnJpZGVIbXMobmV3VmFsdWU6IENhbmR5RGF0ZSB8IG51bGwsIG9sZFZhbHVlOiBDYW5keURhdGUgfCBudWxsKTogQ2FuZHlEYXRlIHtcbiAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tcGFyYW1ldGVyLXJlYXNzaWdubWVudFxuICAgIG5ld1ZhbHVlID0gbmV3VmFsdWUgfHwgbmV3IENhbmR5RGF0ZSgpO1xuICAgIC8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpuby1wYXJhbWV0ZXItcmVhc3NpZ25tZW50XG4gICAgb2xkVmFsdWUgPSBvbGRWYWx1ZSB8fCBuZXcgQ2FuZHlEYXRlKCk7XG4gICAgcmV0dXJuIG9sZFZhbHVlLnNldEhtcyhuZXdWYWx1ZS5nZXRIb3VycygpLCBuZXdWYWx1ZS5nZXRNaW51dGVzKCksIG5ld1ZhbHVlLmdldFNlY29uZHMoKSk7XG4gIH1cbn1cbiJdfQ==