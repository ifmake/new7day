/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { __decorate, __metadata } from "tslib";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DebugElement, ElementRef, EventEmitter, Input, Output, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { reqAnimFrame } from 'ng-zorro-antd/core/polyfill';
import { InputBoolean, isNotNil } from 'ng-zorro-antd/core/util';
import { DateHelperService } from 'ng-zorro-antd/i18n';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TimeHolder } from './time-holder';
function makeRange(length, step = 1, start = 0) {
    return new Array(Math.ceil(length / step)).fill(0).map((_, i) => (i + start) * step);
}
export class NzTimePickerPanelComponent {
    constructor(cdr, dateHelper, elementRef) {
        this.cdr = cdr;
        this.dateHelper = dateHelper;
        this.elementRef = elementRef;
        this._nzHourStep = 1;
        this._nzMinuteStep = 1;
        this._nzSecondStep = 1;
        this.unsubscribe$ = new Subject();
        this._format = 'HH:mm:ss';
        this._disabledHours = () => [];
        this._disabledMinutes = () => [];
        this._disabledSeconds = () => [];
        this._allowEmpty = true;
        this.time = new TimeHolder();
        this.hourEnabled = true;
        this.minuteEnabled = true;
        this.secondEnabled = true;
        this.firstScrolled = false;
        this.enabledColumns = 3;
        this.nzInDatePicker = false; // If inside a date-picker, more diff works need to be done
        this.nzHideDisabledOptions = false;
        this.nzUse12Hours = false;
        this.closePanel = new EventEmitter();
        // TODO: move to host after View Engine deprecation
        this.elementRef.nativeElement.classList.add('ant-picker-time-panel');
    }
    set nzAllowEmpty(value) {
        if (isNotNil(value)) {
            this._allowEmpty = value;
        }
    }
    get nzAllowEmpty() {
        return this._allowEmpty;
    }
    set nzDisabledHours(value) {
        this._disabledHours = value;
        if (!!this._disabledHours) {
            this.buildHours();
        }
    }
    get nzDisabledHours() {
        return this._disabledHours;
    }
    set nzDisabledMinutes(value) {
        if (isNotNil(value)) {
            this._disabledMinutes = value;
            this.buildMinutes();
        }
    }
    get nzDisabledMinutes() {
        return this._disabledMinutes;
    }
    set nzDisabledSeconds(value) {
        if (isNotNil(value)) {
            this._disabledSeconds = value;
            this.buildSeconds();
        }
    }
    get nzDisabledSeconds() {
        return this._disabledSeconds;
    }
    set format(value) {
        if (isNotNil(value)) {
            this._format = value;
            this.enabledColumns = 0;
            const charSet = new Set(value);
            this.hourEnabled = charSet.has('H') || charSet.has('h');
            this.minuteEnabled = charSet.has('m');
            this.secondEnabled = charSet.has('s');
            if (this.hourEnabled) {
                this.enabledColumns++;
            }
            if (this.minuteEnabled) {
                this.enabledColumns++;
            }
            if (this.secondEnabled) {
                this.enabledColumns++;
            }
            if (this.nzUse12Hours) {
                this.build12Hours();
            }
        }
    }
    get format() {
        return this._format;
    }
    set nzHourStep(value) {
        if (isNotNil(value)) {
            this._nzHourStep = value;
            this.buildHours();
        }
    }
    get nzHourStep() {
        return this._nzHourStep;
    }
    set nzMinuteStep(value) {
        if (isNotNil(value)) {
            this._nzMinuteStep = value;
            this.buildMinutes();
        }
    }
    get nzMinuteStep() {
        return this._nzMinuteStep;
    }
    set nzSecondStep(value) {
        if (isNotNil(value)) {
            this._nzSecondStep = value;
            this.buildSeconds();
        }
    }
    get nzSecondStep() {
        return this._nzSecondStep;
    }
    buildHours() {
        var _a;
        let hourRanges = 24;
        let disabledHours = (_a = this.nzDisabledHours) === null || _a === void 0 ? void 0 : _a.call(this);
        let startIndex = 0;
        if (this.nzUse12Hours) {
            hourRanges = 12;
            if (disabledHours) {
                if (this.time.selected12Hours === 'PM') {
                    /**
                     * Filter and transform hours which greater or equal to 12
                     * [0, 1, 2, ..., 12, 13, 14, 15, ..., 23] => [12, 1, 2, 3, ..., 11]
                     */
                    disabledHours = disabledHours.filter(i => i >= 12).map(i => (i > 12 ? i - 12 : i));
                }
                else {
                    /**
                     * Filter and transform hours which less than 12
                     * [0, 1, 2,..., 12, 13, 14, 15, ...23] => [12, 1, 2, 3, ..., 11]
                     */
                    disabledHours = disabledHours.filter(i => i < 12 || i === 24).map(i => (i === 24 || i === 0 ? 12 : i));
                }
            }
            startIndex = 1;
        }
        this.hourRange = makeRange(hourRanges, this.nzHourStep, startIndex).map(r => {
            return {
                index: r,
                disabled: !!disabledHours && disabledHours.indexOf(r) !== -1
            };
        });
        if (this.nzUse12Hours && this.hourRange[this.hourRange.length - 1].index === 12) {
            const temp = [...this.hourRange];
            temp.unshift(temp[temp.length - 1]);
            temp.splice(temp.length - 1, 1);
            this.hourRange = temp;
        }
    }
    buildMinutes() {
        this.minuteRange = makeRange(60, this.nzMinuteStep).map(r => {
            return {
                index: r,
                disabled: !!this.nzDisabledMinutes && this.nzDisabledMinutes(this.time.hours).indexOf(r) !== -1
            };
        });
    }
    buildSeconds() {
        this.secondRange = makeRange(60, this.nzSecondStep).map(r => {
            return {
                index: r,
                disabled: !!this.nzDisabledSeconds && this.nzDisabledSeconds(this.time.hours, this.time.minutes).indexOf(r) !== -1
            };
        });
    }
    build12Hours() {
        const isUpperFormat = this._format.includes('A');
        this.use12HoursRange = [
            {
                index: 0,
                value: isUpperFormat ? 'AM' : 'am'
            },
            {
                index: 1,
                value: isUpperFormat ? 'PM' : 'pm'
            }
        ];
    }
    buildTimes() {
        this.buildHours();
        this.buildMinutes();
        this.buildSeconds();
        this.build12Hours();
    }
    scrollToTime(delay = 0) {
        if (this.hourEnabled && this.hourListElement) {
            this.scrollToSelected(this.hourListElement.nativeElement, this.time.viewHours, delay, 'hour');
        }
        if (this.minuteEnabled && this.minuteListElement) {
            this.scrollToSelected(this.minuteListElement.nativeElement, this.time.minutes, delay, 'minute');
        }
        if (this.secondEnabled && this.secondListElement) {
            this.scrollToSelected(this.secondListElement.nativeElement, this.time.seconds, delay, 'second');
        }
        if (this.nzUse12Hours && this.use12HoursListElement) {
            const selectedHours = this.time.selected12Hours;
            const index = selectedHours === 'AM' ? 0 : 1;
            this.scrollToSelected(this.use12HoursListElement.nativeElement, index, delay, '12-hour');
        }
    }
    selectHour(hour) {
        this.time.setHours(hour.index, hour.disabled);
        if (!!this._disabledMinutes) {
            this.buildMinutes();
        }
        if (this._disabledSeconds || this._disabledMinutes) {
            this.buildSeconds();
        }
    }
    selectMinute(minute) {
        this.time.setMinutes(minute.index, minute.disabled);
        if (!!this._disabledSeconds) {
            this.buildSeconds();
        }
    }
    selectSecond(second) {
        this.time.setSeconds(second.index, second.disabled);
    }
    select12Hours(value) {
        this.time.setSelected12Hours(value.value);
        if (!!this._disabledHours) {
            this.buildHours();
        }
        if (!!this._disabledMinutes) {
            this.buildMinutes();
        }
        if (!!this._disabledSeconds) {
            this.buildSeconds();
        }
    }
    scrollToSelected(instance, index, duration = 0, unit) {
        if (!instance) {
            return;
        }
        const transIndex = this.translateIndex(index, unit);
        const currentOption = (instance.children[transIndex] || instance.children[0]);
        this.scrollTo(instance, currentOption.offsetTop, duration);
    }
    translateIndex(index, unit) {
        var _a, _b, _c;
        if (unit === 'hour') {
            return this.calcIndex((_a = this.nzDisabledHours) === null || _a === void 0 ? void 0 : _a.call(this), this.hourRange.map(item => item.index).indexOf(index));
        }
        else if (unit === 'minute') {
            return this.calcIndex((_b = this.nzDisabledMinutes) === null || _b === void 0 ? void 0 : _b.call(this, this.time.hours), this.minuteRange.map(item => item.index).indexOf(index));
        }
        else if (unit === 'second') {
            // second
            return this.calcIndex((_c = this.nzDisabledSeconds) === null || _c === void 0 ? void 0 : _c.call(this, this.time.hours, this.time.minutes), this.secondRange.map(item => item.index).indexOf(index));
        }
        else {
            // 12-hour
            return this.calcIndex([], this.use12HoursRange.map(item => item.index).indexOf(index));
        }
    }
    scrollTo(element, to, duration) {
        if (duration <= 0) {
            element.scrollTop = to;
            return;
        }
        const difference = to - element.scrollTop;
        const perTick = (difference / duration) * 10;
        reqAnimFrame(() => {
            element.scrollTop = element.scrollTop + perTick;
            if (element.scrollTop === to) {
                return;
            }
            this.scrollTo(element, to, duration - 10);
        });
    }
    calcIndex(array, index) {
        if ((array === null || array === void 0 ? void 0 : array.length) && this.nzHideDisabledOptions) {
            return (index -
                array.reduce((pre, value) => {
                    return pre + (value < index ? 1 : 0);
                }, 0));
        }
        else {
            return index;
        }
    }
    changed() {
        if (this.onChange) {
            this.onChange(this.time.value);
        }
    }
    touched() {
        if (this.onTouch) {
            this.onTouch();
        }
    }
    timeDisabled(value) {
        var _a, _b, _c, _d, _e, _f;
        const hour = value.getHours();
        const minute = value.getMinutes();
        const second = value.getSeconds();
        return (((_b = (_a = this.nzDisabledHours) === null || _a === void 0 ? void 0 : _a.call(this).indexOf(hour)) !== null && _b !== void 0 ? _b : -1) > -1 ||
            ((_d = (_c = this.nzDisabledMinutes) === null || _c === void 0 ? void 0 : _c.call(this, hour).indexOf(minute)) !== null && _d !== void 0 ? _d : -1) > -1 ||
            ((_f = (_e = this.nzDisabledSeconds) === null || _e === void 0 ? void 0 : _e.call(this, hour, minute).indexOf(second)) !== null && _f !== void 0 ? _f : -1) > -1);
    }
    onClickNow() {
        const now = new Date();
        if (this.timeDisabled(now)) {
            return;
        }
        this.time.setValue(now);
        this.changed();
        this.closePanel.emit();
    }
    onClickOk() {
        this.closePanel.emit();
    }
    isSelectedHour(hour) {
        return hour.index === this.time.viewHours;
    }
    isSelectedMinute(minute) {
        return minute.index === this.time.minutes;
    }
    isSelectedSecond(second) {
        return second.index === this.time.seconds;
    }
    isSelected12Hours(value) {
        return value.value.toUpperCase() === this.time.selected12Hours;
    }
    ngOnInit() {
        this.time.changes.pipe(takeUntil(this.unsubscribe$)).subscribe(() => {
            this.changed();
            this.touched();
            this.scrollToTime(120);
        });
        this.buildTimes();
        setTimeout(() => {
            this.scrollToTime();
            this.firstScrolled = true;
        });
    }
    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
    ngOnChanges(changes) {
        const { nzUse12Hours, nzDefaultOpenValue } = changes;
        if (!(nzUse12Hours === null || nzUse12Hours === void 0 ? void 0 : nzUse12Hours.previousValue) && (nzUse12Hours === null || nzUse12Hours === void 0 ? void 0 : nzUse12Hours.currentValue)) {
            this.build12Hours();
            this.enabledColumns++;
        }
        if (nzDefaultOpenValue === null || nzDefaultOpenValue === void 0 ? void 0 : nzDefaultOpenValue.currentValue) {
            this.time.setDefaultOpenValue(this.nzDefaultOpenValue || new Date());
        }
    }
    writeValue(value) {
        this.time.setValue(value, this.nzUse12Hours);
        this.buildTimes();
        if (value && this.firstScrolled) {
            this.scrollToTime(120);
        }
        // Mark this component to be checked manually with internal properties changing (see: https://github.com/angular/angular/issues/10816)
        this.cdr.markForCheck();
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouch = fn;
    }
    /**
     * Prevent input losing focus when click panel
     * @param event
     */
    onMousedown(event) {
        event.preventDefault();
    }
}
NzTimePickerPanelComponent.decorators = [
    { type: Component, args: [{
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                selector: 'nz-time-picker-panel',
                exportAs: 'nzTimePickerPanel',
                template: `
    <div *ngIf="nzInDatePicker" class="ant-picker-header">
      <div class="ant-picker-header-view">{{ dateHelper.format($any(time?.value), format) || '&nbsp;' }}</div>
    </div>
    <div class="ant-picker-content">
      <ul *ngIf="hourEnabled" #hourListElement class="ant-picker-time-panel-column" style="position: relative;">
        <ng-container *ngFor="let hour of hourRange">
          <li
            *ngIf="!(nzHideDisabledOptions && hour.disabled)"
            class="ant-picker-time-panel-cell"
            (click)="selectHour(hour)"
            [class.ant-picker-time-panel-cell-selected]="isSelectedHour(hour)"
            [class.ant-picker-time-panel-cell-disabled]="hour.disabled"
          >
            <div class="ant-picker-time-panel-cell-inner">{{ hour.index | number: '2.0-0' }}</div>
          </li>
        </ng-container>
      </ul>
      <ul *ngIf="minuteEnabled" #minuteListElement class="ant-picker-time-panel-column" style="position: relative;">
        <ng-container *ngFor="let minute of minuteRange">
          <li
            *ngIf="!(nzHideDisabledOptions && minute.disabled)"
            class="ant-picker-time-panel-cell"
            (click)="selectMinute(minute)"
            [class.ant-picker-time-panel-cell-selected]="isSelectedMinute(minute)"
            [class.ant-picker-time-panel-cell-disabled]="minute.disabled"
          >
            <div class="ant-picker-time-panel-cell-inner">{{ minute.index | number: '2.0-0' }}</div>
          </li>
        </ng-container>
      </ul>
      <ul *ngIf="secondEnabled" #secondListElement class="ant-picker-time-panel-column" style="position: relative;">
        <ng-container *ngFor="let second of secondRange">
          <li
            *ngIf="!(nzHideDisabledOptions && second.disabled)"
            class="ant-picker-time-panel-cell"
            (click)="selectSecond(second)"
            [class.ant-picker-time-panel-cell-selected]="isSelectedSecond(second)"
            [class.ant-picker-time-panel-cell-disabled]="second.disabled"
          >
            <div class="ant-picker-time-panel-cell-inner">{{ second.index | number: '2.0-0' }}</div>
          </li>
        </ng-container>
      </ul>
      <ul *ngIf="nzUse12Hours" #use12HoursListElement class="ant-picker-time-panel-column" style="position: relative;">
        <ng-container *ngFor="let range of use12HoursRange">
          <li
            *ngIf="!nzHideDisabledOptions"
            (click)="select12Hours(range)"
            class="ant-picker-time-panel-cell"
            [class.ant-picker-time-panel-cell-selected]="isSelected12Hours(range)"
          >
            <div class="ant-picker-time-panel-cell-inner">{{ range.value }}</div>
          </li>
        </ng-container>
      </ul>
    </div>
    <div *ngIf="!nzInDatePicker" class="ant-picker-footer">
      <div *ngIf="nzAddOn" class="ant-picker-footer-extra">
        <ng-template [ngTemplateOutlet]="nzAddOn"></ng-template>
      </div>
      <ul class="ant-picker-ranges">
        <li class="ant-picker-now">
          <a (click)="onClickNow()">
            {{ 'Calendar.lang.now' | nzI18n }}
          </a>
        </li>
        <li class="ant-picker-ok">
          <button nz-button type="button" nzSize="small" nzType="primary" (click)="onClickOk()">
            {{ 'Calendar.lang.ok' | nzI18n }}
          </button>
        </li>
      </ul>
    </div>
  `,
                host: {
                    '[class.ant-picker-time-panel-column-0]': `enabledColumns === 0 && !nzInDatePicker`,
                    '[class.ant-picker-time-panel-column-1]': `enabledColumns === 1 && !nzInDatePicker`,
                    '[class.ant-picker-time-panel-column-2]': `enabledColumns === 2 && !nzInDatePicker`,
                    '[class.ant-picker-time-panel-column-3]': `enabledColumns === 3 && !nzInDatePicker`,
                    '[class.ant-picker-time-panel-narrow]': `enabledColumns < 3`,
                    '[class.ant-picker-time-panel-placement-bottomLeft]': `!nzInDatePicker`,
                    '(mousedown)': 'onMousedown($event)'
                },
                providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: NzTimePickerPanelComponent, multi: true }]
            },] }
];
NzTimePickerPanelComponent.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: DateHelperService },
    { type: ElementRef }
];
NzTimePickerPanelComponent.propDecorators = {
    hourListElement: [{ type: ViewChild, args: ['hourListElement', { static: false },] }],
    minuteListElement: [{ type: ViewChild, args: ['minuteListElement', { static: false },] }],
    secondListElement: [{ type: ViewChild, args: ['secondListElement', { static: false },] }],
    use12HoursListElement: [{ type: ViewChild, args: ['use12HoursListElement', { static: false },] }],
    nzInDatePicker: [{ type: Input }],
    nzAddOn: [{ type: Input }],
    nzHideDisabledOptions: [{ type: Input }],
    nzClearText: [{ type: Input }],
    nzPlaceHolder: [{ type: Input }],
    nzUse12Hours: [{ type: Input }],
    nzDefaultOpenValue: [{ type: Input }],
    closePanel: [{ type: Output }],
    nzAllowEmpty: [{ type: Input }],
    nzDisabledHours: [{ type: Input }],
    nzDisabledMinutes: [{ type: Input }],
    nzDisabledSeconds: [{ type: Input }],
    format: [{ type: Input }],
    nzHourStep: [{ type: Input }],
    nzMinuteStep: [{ type: Input }],
    nzSecondStep: [{ type: Input }]
};
__decorate([
    InputBoolean(),
    __metadata("design:type", Object)
], NzTimePickerPanelComponent.prototype, "nzUse12Hours", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGltZS1waWNrZXItcGFuZWwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uL2NvbXBvbmVudHMvdGltZS1waWNrZXIvIiwic291cmNlcyI6WyJ0aW1lLXBpY2tlci1wYW5lbC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHOztBQUVILE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxZQUFZLEVBQ1osVUFBVSxFQUNWLFlBQVksRUFDWixLQUFLLEVBSUwsTUFBTSxFQUVOLFdBQVcsRUFDWCxTQUFTLEVBQ1QsaUJBQWlCLEVBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBd0IsaUJBQWlCLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUN6RSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFHM0QsT0FBTyxFQUFFLFlBQVksRUFBRSxRQUFRLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUNqRSxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUN2RCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQy9CLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUMzQyxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLFNBQVMsU0FBUyxDQUFDLE1BQWMsRUFBRSxPQUFlLENBQUMsRUFBRSxRQUFnQixDQUFDO0lBQ3BFLE9BQU8sSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7QUFDdkYsQ0FB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QUNELFNBQVMsRUFBRSxDQUFDLEVBQUUsT0FBTyxFQUFFLGlCQUFpQixFQUFFLFdBQVcsRUFBRSwwQkFBMEIsRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLENBQUM7YUFDbEc7OztZQXpIQyxpQkFBaUI7WUFvQlYsaUJBQWlCO1lBakJ4QixVQUFVOzs7OEJBZ0pULFNBQVMsU0FBQyxpQkFBaUIsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7Z0NBRTlDLFNBQVMsU0FBQyxtQkFBbUIsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7Z0NBQ2hELFNBQVMsU0FBQyxtQkFBbUIsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7b0NBQ2hELFNBQVMsU0FBQyx1QkFBdUIsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7NkJBRXBELEtBQUs7c0JBQ0wsS0FBSztvQ0FDTCxLQUFLOzBCQUNMLEtBQUs7NEJBQ0wsS0FBSzsyQkFDTCxLQUFLO2lDQUNMLEtBQUs7eUJBRUwsTUFBTTsyQkFFTixLQUFLOzhCQVdMLEtBQUs7Z0NBWUwsS0FBSztnQ0FZTCxLQUFLO3FCQVlMLEtBQUs7eUJBNEJMLEtBQUs7MkJBWUwsS0FBSzsyQkFZTCxLQUFLOztBQXhHbUI7SUFBZixZQUFZLEVBQUU7O2dFQUFzQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9naXRodWIuY29tL05HLVpPUlJPL25nLXpvcnJvLWFudGQvYmxvYi9tYXN0ZXIvTElDRU5TRVxuICovXG5cbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBEZWJ1Z0VsZW1lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE91dHB1dCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyByZXFBbmltRnJhbWUgfSBmcm9tICduZy16b3Jyby1hbnRkL2NvcmUvcG9seWZpbGwnO1xuaW1wb3J0IHsgQm9vbGVhbklucHV0IH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL3R5cGVzJztcblxuaW1wb3J0IHsgSW5wdXRCb29sZWFuLCBpc05vdE5pbCB9IGZyb20gJ25nLXpvcnJvLWFudGQvY29yZS91dGlsJztcbmltcG9ydCB7IERhdGVIZWxwZXJTZXJ2aWNlIH0gZnJvbSAnbmctem9ycm8tYW50ZC9pMThuJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHRha2VVbnRpbCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IFRpbWVIb2xkZXIgfSBmcm9tICcuL3RpbWUtaG9sZGVyJztcblxuZnVuY3Rpb24gbWFrZVJhbmdlKGxlbmd0aDogbnVtYmVyLCBzdGVwOiBudW1iZXIgPSAxLCBzdGFydDogbnVtYmVyID0gMCk6IG51bWJlcltdIHtcbiAgcmV0dXJuIG5ldyBBcnJheShNYXRoLmNlaWwobGVuZ3RoIC8gc3RlcCkpLmZpbGwoMCkubWFwKChfLCBpKSA9PiAoaSArIHN0YXJ0KSAqIHN0ZXApO1xufVxuXG5leHBvcnQgdHlwZSBOelRpbWVQaWNrZXJVbml0ID0gJ2hvdXInIHwgJ21pbnV0ZScgfCAnc2Vjb25kJyB8ICcxMi1ob3VyJztcblxuQENvbXBvbmVudCh7XG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBzZWxlY3RvcjogJ256LXRpbWUtcGlja2VyLXBhbmVsJyxcbiAgZXhwb3J0QXM6ICduelRpbWVQaWNrZXJQYW5lbCcsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdiAqbmdJZj1cIm56SW5EYXRlUGlja2VyXCIgY2xhc3M9XCJhbnQtcGlja2VyLWhlYWRlclwiPlxuICAgICAgPGRpdiBjbGFzcz1cImFudC1waWNrZXItaGVhZGVyLXZpZXdcIj57eyBkYXRlSGVscGVyLmZvcm1hdCgkYW55KHRpbWU/LnZhbHVlKSwgZm9ybWF0KSB8fCAnJm5ic3A7JyB9fTwvZGl2PlxuICAgIDwvZGl2PlxuICAgIDxkaXYgY2xhc3M9XCJhbnQtcGlja2VyLWNvbnRlbnRcIj5cbiAgICAgIDx1bCAqbmdJZj1cImhvdXJFbmFibGVkXCIgI2hvdXJMaXN0RWxlbWVudCBjbGFzcz1cImFudC1waWNrZXItdGltZS1wYW5lbC1jb2x1bW5cIiBzdHlsZT1cInBvc2l0aW9uOiByZWxhdGl2ZTtcIj5cbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdGb3I9XCJsZXQgaG91ciBvZiBob3VyUmFuZ2VcIj5cbiAgICAgICAgICA8bGlcbiAgICAgICAgICAgICpuZ0lmPVwiIShuekhpZGVEaXNhYmxlZE9wdGlvbnMgJiYgaG91ci5kaXNhYmxlZClcIlxuICAgICAgICAgICAgY2xhc3M9XCJhbnQtcGlja2VyLXRpbWUtcGFuZWwtY2VsbFwiXG4gICAgICAgICAgICAoY2xpY2spPVwic2VsZWN0SG91cihob3VyKVwiXG4gICAgICAgICAgICBbY2xhc3MuYW50LXBpY2tlci10aW1lLXBhbmVsLWNlbGwtc2VsZWN0ZWRdPVwiaXNTZWxlY3RlZEhvdXIoaG91cilcIlxuICAgICAgICAgICAgW2NsYXNzLmFudC1waWNrZXItdGltZS1wYW5lbC1jZWxsLWRpc2FibGVkXT1cImhvdXIuZGlzYWJsZWRcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhbnQtcGlja2VyLXRpbWUtcGFuZWwtY2VsbC1pbm5lclwiPnt7IGhvdXIuaW5kZXggfCBudW1iZXI6ICcyLjAtMCcgfX08L2Rpdj5cbiAgICAgICAgICA8L2xpPlxuICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgIDwvdWw+XG4gICAgICA8dWwgKm5nSWY9XCJtaW51dGVFbmFibGVkXCIgI21pbnV0ZUxpc3RFbGVtZW50IGNsYXNzPVwiYW50LXBpY2tlci10aW1lLXBhbmVsLWNvbHVtblwiIHN0eWxlPVwicG9zaXRpb246IHJlbGF0aXZlO1wiPlxuICAgICAgICA8bmctY29udGFpbmVyICpuZ0Zvcj1cImxldCBtaW51dGUgb2YgbWludXRlUmFuZ2VcIj5cbiAgICAgICAgICA8bGlcbiAgICAgICAgICAgICpuZ0lmPVwiIShuekhpZGVEaXNhYmxlZE9wdGlvbnMgJiYgbWludXRlLmRpc2FibGVkKVwiXG4gICAgICAgICAgICBjbGFzcz1cImFudC1waWNrZXItdGltZS1wYW5lbC1jZWxsXCJcbiAgICAgICAgICAgIChjbGljayk9XCJzZWxlY3RNaW51dGUobWludXRlKVwiXG4gICAgICAgICAgICBbY2xhc3MuYW50LXBpY2tlci10aW1lLXBhbmVsLWNlbGwtc2VsZWN0ZWRdPVwiaXNTZWxlY3RlZE1pbnV0ZShtaW51dGUpXCJcbiAgICAgICAgICAgIFtjbGFzcy5hbnQtcGlja2VyLXRpbWUtcGFuZWwtY2VsbC1kaXNhYmxlZF09XCJtaW51dGUuZGlzYWJsZWRcIlxuICAgICAgICAgID5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhbnQtcGlja2VyLXRpbWUtcGFuZWwtY2VsbC1pbm5lclwiPnt7IG1pbnV0ZS5pbmRleCB8IG51bWJlcjogJzIuMC0wJyB9fTwvZGl2PlxuICAgICAgICAgIDwvbGk+XG4gICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgPC91bD5cbiAgICAgIDx1bCAqbmdJZj1cInNlY29uZEVuYWJsZWRcIiAjc2Vjb25kTGlzdEVsZW1lbnQgY2xhc3M9XCJhbnQtcGlja2VyLXRpbWUtcGFuZWwtY29sdW1uXCIgc3R5bGU9XCJwb3NpdGlvbjogcmVsYXRpdmU7XCI+XG4gICAgICAgIDxuZy1jb250YWluZXIgKm5nRm9yPVwibGV0IHNlY29uZCBvZiBzZWNvbmRSYW5nZVwiPlxuICAgICAgICAgIDxsaVxuICAgICAgICAgICAgKm5nSWY9XCIhKG56SGlkZURpc2FibGVkT3B0aW9ucyAmJiBzZWNvbmQuZGlzYWJsZWQpXCJcbiAgICAgICAgICAgIGNsYXNzPVwiYW50LXBpY2tlci10aW1lLXBhbmVsLWNlbGxcIlxuICAgICAgICAgICAgKGNsaWNrKT1cInNlbGVjdFNlY29uZChzZWNvbmQpXCJcbiAgICAgICAgICAgIFtjbGFzcy5hbnQtcGlja2VyLXRpbWUtcGFuZWwtY2VsbC1zZWxlY3RlZF09XCJpc1NlbGVjdGVkU2Vjb25kKHNlY29uZClcIlxuICAgICAgICAgICAgW2NsYXNzLmFudC1waWNrZXItdGltZS1wYW5lbC1jZWxsLWRpc2FibGVkXT1cInNlY29uZC5kaXNhYmxlZFwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImFudC1waWNrZXItdGltZS1wYW5lbC1jZWxsLWlubmVyXCI+e3sgc2Vjb25kLmluZGV4IHwgbnVtYmVyOiAnMi4wLTAnIH19PC9kaXY+XG4gICAgICAgICAgPC9saT5cbiAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICA8L3VsPlxuICAgICAgPHVsICpuZ0lmPVwibnpVc2UxMkhvdXJzXCIgI3VzZTEySG91cnNMaXN0RWxlbWVudCBjbGFzcz1cImFudC1waWNrZXItdGltZS1wYW5lbC1jb2x1bW5cIiBzdHlsZT1cInBvc2l0aW9uOiByZWxhdGl2ZTtcIj5cbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdGb3I9XCJsZXQgcmFuZ2Ugb2YgdXNlMTJIb3Vyc1JhbmdlXCI+XG4gICAgICAgICAgPGxpXG4gICAgICAgICAgICAqbmdJZj1cIiFuekhpZGVEaXNhYmxlZE9wdGlvbnNcIlxuICAgICAgICAgICAgKGNsaWNrKT1cInNlbGVjdDEySG91cnMocmFuZ2UpXCJcbiAgICAgICAgICAgIGNsYXNzPVwiYW50LXBpY2tlci10aW1lLXBhbmVsLWNlbGxcIlxuICAgICAgICAgICAgW2NsYXNzLmFudC1waWNrZXItdGltZS1wYW5lbC1jZWxsLXNlbGVjdGVkXT1cImlzU2VsZWN0ZWQxMkhvdXJzKHJhbmdlKVwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImFudC1waWNrZXItdGltZS1wYW5lbC1jZWxsLWlubmVyXCI+e3sgcmFuZ2UudmFsdWUgfX08L2Rpdj5cbiAgICAgICAgICA8L2xpPlxuICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgIDwvdWw+XG4gICAgPC9kaXY+XG4gICAgPGRpdiAqbmdJZj1cIiFuekluRGF0ZVBpY2tlclwiIGNsYXNzPVwiYW50LXBpY2tlci1mb290ZXJcIj5cbiAgICAgIDxkaXYgKm5nSWY9XCJuekFkZE9uXCIgY2xhc3M9XCJhbnQtcGlja2VyLWZvb3Rlci1leHRyYVwiPlxuICAgICAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwibnpBZGRPblwiPjwvbmctdGVtcGxhdGU+XG4gICAgICA8L2Rpdj5cbiAgICAgIDx1bCBjbGFzcz1cImFudC1waWNrZXItcmFuZ2VzXCI+XG4gICAgICAgIDxsaSBjbGFzcz1cImFudC1waWNrZXItbm93XCI+XG4gICAgICAgICAgPGEgKGNsaWNrKT1cIm9uQ2xpY2tOb3coKVwiPlxuICAgICAgICAgICAge3sgJ0NhbGVuZGFyLmxhbmcubm93JyB8IG56STE4biB9fVxuICAgICAgICAgIDwvYT5cbiAgICAgICAgPC9saT5cbiAgICAgICAgPGxpIGNsYXNzPVwiYW50LXBpY2tlci1va1wiPlxuICAgICAgICAgIDxidXR0b24gbnotYnV0dG9uIHR5cGU9XCJidXR0b25cIiBuelNpemU9XCJzbWFsbFwiIG56VHlwZT1cInByaW1hcnlcIiAoY2xpY2spPVwib25DbGlja09rKClcIj5cbiAgICAgICAgICAgIHt7ICdDYWxlbmRhci5sYW5nLm9rJyB8IG56STE4biB9fVxuICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICA8L2xpPlxuICAgICAgPC91bD5cbiAgICA8L2Rpdj5cbiAgYCxcbiAgaG9zdDoge1xuICAgICdbY2xhc3MuYW50LXBpY2tlci10aW1lLXBhbmVsLWNvbHVtbi0wXSc6IGBlbmFibGVkQ29sdW1ucyA9PT0gMCAmJiAhbnpJbkRhdGVQaWNrZXJgLFxuICAgICdbY2xhc3MuYW50LXBpY2tlci10aW1lLXBhbmVsLWNvbHVtbi0xXSc6IGBlbmFibGVkQ29sdW1ucyA9PT0gMSAmJiAhbnpJbkRhdGVQaWNrZXJgLFxuICAgICdbY2xhc3MuYW50LXBpY2tlci10aW1lLXBhbmVsLWNvbHVtbi0yXSc6IGBlbmFibGVkQ29sdW1ucyA9PT0gMiAmJiAhbnpJbkRhdGVQaWNrZXJgLFxuICAgICdbY2xhc3MuYW50LXBpY2tlci10aW1lLXBhbmVsLWNvbHVtbi0zXSc6IGBlbmFibGVkQ29sdW1ucyA9PT0gMyAmJiAhbnpJbkRhdGVQaWNrZXJgLFxuICAgICdbY2xhc3MuYW50LXBpY2tlci10aW1lLXBhbmVsLW5hcnJvd10nOiBgZW5hYmxlZENvbHVtbnMgPCAzYCxcbiAgICAnW2NsYXNzLmFudC1waWNrZXItdGltZS1wYW5lbC1wbGFjZW1lbnQtYm90dG9tTGVmdF0nOiBgIW56SW5EYXRlUGlja2VyYCxcbiAgICAnKG1vdXNlZG93biknOiAnb25Nb3VzZWRvd24oJGV2ZW50KSdcbiAgfSxcbiAgcHJvdmlkZXJzOiBbeyBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUiwgdXNlRXhpc3Rpbmc6IE56VGltZVBpY2tlclBhbmVsQ29tcG9uZW50LCBtdWx0aTogdHJ1ZSB9XVxufSlcbmV4cG9ydCBjbGFzcyBOelRpbWVQaWNrZXJQYW5lbENvbXBvbmVudCBpbXBsZW1lbnRzIENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBPbkluaXQsIE9uRGVzdHJveSwgT25DaGFuZ2VzIHtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX256VXNlMTJIb3VyczogQm9vbGVhbklucHV0O1xuXG4gIHByaXZhdGUgX256SG91clN0ZXAgPSAxO1xuICBwcml2YXRlIF9uek1pbnV0ZVN0ZXAgPSAxO1xuICBwcml2YXRlIF9uelNlY29uZFN0ZXAgPSAxO1xuICBwcml2YXRlIHVuc3Vic2NyaWJlJCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG4gIHByaXZhdGUgb25DaGFuZ2U/OiAodmFsdWU6IERhdGUpID0+IHZvaWQ7XG4gIHByaXZhdGUgb25Ub3VjaD86ICgpID0+IHZvaWQ7XG4gIHByaXZhdGUgX2Zvcm1hdCA9ICdISDptbTpzcyc7XG4gIHByaXZhdGUgX2Rpc2FibGVkSG91cnM/OiAoKSA9PiBudW1iZXJbXSA9ICgpID0+IFtdO1xuICBwcml2YXRlIF9kaXNhYmxlZE1pbnV0ZXM/OiAoaG91cjogbnVtYmVyKSA9PiBudW1iZXJbXSA9ICgpID0+IFtdO1xuICBwcml2YXRlIF9kaXNhYmxlZFNlY29uZHM/OiAoaG91cjogbnVtYmVyLCBtaW51dGU6IG51bWJlcikgPT4gbnVtYmVyW10gPSAoKSA9PiBbXTtcbiAgcHJpdmF0ZSBfYWxsb3dFbXB0eSA9IHRydWU7XG4gIHRpbWUgPSBuZXcgVGltZUhvbGRlcigpO1xuICBob3VyRW5hYmxlZCA9IHRydWU7XG4gIG1pbnV0ZUVuYWJsZWQgPSB0cnVlO1xuICBzZWNvbmRFbmFibGVkID0gdHJ1ZTtcbiAgZmlyc3RTY3JvbGxlZCA9IGZhbHNlO1xuICBlbmFibGVkQ29sdW1ucyA9IDM7XG4gIGhvdXJSYW5nZSE6IFJlYWRvbmx5QXJyYXk8eyBpbmRleDogbnVtYmVyOyBkaXNhYmxlZDogYm9vbGVhbiB9PjtcbiAgbWludXRlUmFuZ2UhOiBSZWFkb25seUFycmF5PHsgaW5kZXg6IG51bWJlcjsgZGlzYWJsZWQ6IGJvb2xlYW4gfT47XG4gIHNlY29uZFJhbmdlITogUmVhZG9ubHlBcnJheTx7IGluZGV4OiBudW1iZXI7IGRpc2FibGVkOiBib29sZWFuIH0+O1xuICB1c2UxMkhvdXJzUmFuZ2UhOiBSZWFkb25seUFycmF5PHsgaW5kZXg6IG51bWJlcjsgdmFsdWU6IHN0cmluZyB9PjtcblxuICBAVmlld0NoaWxkKCdob3VyTGlzdEVsZW1lbnQnLCB7IHN0YXRpYzogZmFsc2UgfSlcbiAgaG91ckxpc3RFbGVtZW50PzogRGVidWdFbGVtZW50O1xuICBAVmlld0NoaWxkKCdtaW51dGVMaXN0RWxlbWVudCcsIHsgc3RhdGljOiBmYWxzZSB9KSBtaW51dGVMaXN0RWxlbWVudD86IERlYnVnRWxlbWVudDtcbiAgQFZpZXdDaGlsZCgnc2Vjb25kTGlzdEVsZW1lbnQnLCB7IHN0YXRpYzogZmFsc2UgfSkgc2Vjb25kTGlzdEVsZW1lbnQ/OiBEZWJ1Z0VsZW1lbnQ7XG4gIEBWaWV3Q2hpbGQoJ3VzZTEySG91cnNMaXN0RWxlbWVudCcsIHsgc3RhdGljOiBmYWxzZSB9KSB1c2UxMkhvdXJzTGlzdEVsZW1lbnQ/OiBEZWJ1Z0VsZW1lbnQ7XG5cbiAgQElucHV0KCkgbnpJbkRhdGVQaWNrZXI6IGJvb2xlYW4gPSBmYWxzZTsgLy8gSWYgaW5zaWRlIGEgZGF0ZS1waWNrZXIsIG1vcmUgZGlmZiB3b3JrcyBuZWVkIHRvIGJlIGRvbmVcbiAgQElucHV0KCkgbnpBZGRPbj86IFRlbXBsYXRlUmVmPHZvaWQ+O1xuICBASW5wdXQoKSBuekhpZGVEaXNhYmxlZE9wdGlvbnMgPSBmYWxzZTtcbiAgQElucHV0KCkgbnpDbGVhclRleHQ/OiBzdHJpbmc7XG4gIEBJbnB1dCgpIG56UGxhY2VIb2xkZXI/OiBzdHJpbmcgfCBudWxsO1xuICBASW5wdXQoKSBASW5wdXRCb29sZWFuKCkgbnpVc2UxMkhvdXJzID0gZmFsc2U7XG4gIEBJbnB1dCgpIG56RGVmYXVsdE9wZW5WYWx1ZT86IERhdGU7XG5cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGNsb3NlUGFuZWwgPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgQElucHV0KClcbiAgc2V0IG56QWxsb3dFbXB0eSh2YWx1ZTogYm9vbGVhbikge1xuICAgIGlmIChpc05vdE5pbCh2YWx1ZSkpIHtcbiAgICAgIHRoaXMuX2FsbG93RW1wdHkgPSB2YWx1ZTtcbiAgICB9XG4gIH1cblxuICBnZXQgbnpBbGxvd0VtcHR5KCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLl9hbGxvd0VtcHR5O1xuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IG56RGlzYWJsZWRIb3Vycyh2YWx1ZTogdW5kZWZpbmVkIHwgKCgpID0+IG51bWJlcltdKSkge1xuICAgIHRoaXMuX2Rpc2FibGVkSG91cnMgPSB2YWx1ZTtcbiAgICBpZiAoISF0aGlzLl9kaXNhYmxlZEhvdXJzKSB7XG4gICAgICB0aGlzLmJ1aWxkSG91cnMoKTtcbiAgICB9XG4gIH1cblxuICBnZXQgbnpEaXNhYmxlZEhvdXJzKCk6IHVuZGVmaW5lZCB8ICgoKSA9PiBudW1iZXJbXSkge1xuICAgIHJldHVybiB0aGlzLl9kaXNhYmxlZEhvdXJzO1xuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IG56RGlzYWJsZWRNaW51dGVzKHZhbHVlOiB1bmRlZmluZWQgfCAoKGhvdXI6IG51bWJlcikgPT4gbnVtYmVyW10pKSB7XG4gICAgaWYgKGlzTm90TmlsKHZhbHVlKSkge1xuICAgICAgdGhpcy5fZGlzYWJsZWRNaW51dGVzID0gdmFsdWU7XG4gICAgICB0aGlzLmJ1aWxkTWludXRlcygpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBuekRpc2FibGVkTWludXRlcygpOiB1bmRlZmluZWQgfCAoKGhvdXI6IG51bWJlcikgPT4gbnVtYmVyW10pIHtcbiAgICByZXR1cm4gdGhpcy5fZGlzYWJsZWRNaW51dGVzO1xuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IG56RGlzYWJsZWRTZWNvbmRzKHZhbHVlOiB1bmRlZmluZWQgfCAoKGhvdXI6IG51bWJlciwgbWludXRlOiBudW1iZXIpID0+IG51bWJlcltdKSkge1xuICAgIGlmIChpc05vdE5pbCh2YWx1ZSkpIHtcbiAgICAgIHRoaXMuX2Rpc2FibGVkU2Vjb25kcyA9IHZhbHVlO1xuICAgICAgdGhpcy5idWlsZFNlY29uZHMoKTtcbiAgICB9XG4gIH1cblxuICBnZXQgbnpEaXNhYmxlZFNlY29uZHMoKTogdW5kZWZpbmVkIHwgKChob3VyOiBudW1iZXIsIG1pbnV0ZTogbnVtYmVyKSA9PiBudW1iZXJbXSkge1xuICAgIHJldHVybiB0aGlzLl9kaXNhYmxlZFNlY29uZHM7XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgZm9ybWF0KHZhbHVlOiBzdHJpbmcpIHtcbiAgICBpZiAoaXNOb3ROaWwodmFsdWUpKSB7XG4gICAgICB0aGlzLl9mb3JtYXQgPSB2YWx1ZTtcbiAgICAgIHRoaXMuZW5hYmxlZENvbHVtbnMgPSAwO1xuICAgICAgY29uc3QgY2hhclNldCA9IG5ldyBTZXQodmFsdWUpO1xuICAgICAgdGhpcy5ob3VyRW5hYmxlZCA9IGNoYXJTZXQuaGFzKCdIJykgfHwgY2hhclNldC5oYXMoJ2gnKTtcbiAgICAgIHRoaXMubWludXRlRW5hYmxlZCA9IGNoYXJTZXQuaGFzKCdtJyk7XG4gICAgICB0aGlzLnNlY29uZEVuYWJsZWQgPSBjaGFyU2V0LmhhcygncycpO1xuICAgICAgaWYgKHRoaXMuaG91ckVuYWJsZWQpIHtcbiAgICAgICAgdGhpcy5lbmFibGVkQ29sdW1ucysrO1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMubWludXRlRW5hYmxlZCkge1xuICAgICAgICB0aGlzLmVuYWJsZWRDb2x1bW5zKys7XG4gICAgICB9XG4gICAgICBpZiAodGhpcy5zZWNvbmRFbmFibGVkKSB7XG4gICAgICAgIHRoaXMuZW5hYmxlZENvbHVtbnMrKztcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLm56VXNlMTJIb3Vycykge1xuICAgICAgICB0aGlzLmJ1aWxkMTJIb3VycygpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGdldCBmb3JtYXQoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5fZm9ybWF0O1xuICB9XG5cbiAgQElucHV0KClcbiAgc2V0IG56SG91clN0ZXAodmFsdWU6IG51bWJlcikge1xuICAgIGlmIChpc05vdE5pbCh2YWx1ZSkpIHtcbiAgICAgIHRoaXMuX256SG91clN0ZXAgPSB2YWx1ZTtcbiAgICAgIHRoaXMuYnVpbGRIb3VycygpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBuekhvdXJTdGVwKCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMuX256SG91clN0ZXA7XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgbnpNaW51dGVTdGVwKHZhbHVlOiBudW1iZXIpIHtcbiAgICBpZiAoaXNOb3ROaWwodmFsdWUpKSB7XG4gICAgICB0aGlzLl9uek1pbnV0ZVN0ZXAgPSB2YWx1ZTtcbiAgICAgIHRoaXMuYnVpbGRNaW51dGVzKCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IG56TWludXRlU3RlcCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9uek1pbnV0ZVN0ZXA7XG4gIH1cblxuICBASW5wdXQoKVxuICBzZXQgbnpTZWNvbmRTdGVwKHZhbHVlOiBudW1iZXIpIHtcbiAgICBpZiAoaXNOb3ROaWwodmFsdWUpKSB7XG4gICAgICB0aGlzLl9uelNlY29uZFN0ZXAgPSB2YWx1ZTtcbiAgICAgIHRoaXMuYnVpbGRTZWNvbmRzKCk7XG4gICAgfVxuICB9XG5cbiAgZ2V0IG56U2Vjb25kU3RlcCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLl9uelNlY29uZFN0ZXA7XG4gIH1cblxuICBidWlsZEhvdXJzKCk6IHZvaWQge1xuICAgIGxldCBob3VyUmFuZ2VzID0gMjQ7XG4gICAgbGV0IGRpc2FibGVkSG91cnMgPSB0aGlzLm56RGlzYWJsZWRIb3Vycz8uKCk7XG4gICAgbGV0IHN0YXJ0SW5kZXggPSAwO1xuICAgIGlmICh0aGlzLm56VXNlMTJIb3Vycykge1xuICAgICAgaG91clJhbmdlcyA9IDEyO1xuICAgICAgaWYgKGRpc2FibGVkSG91cnMpIHtcbiAgICAgICAgaWYgKHRoaXMudGltZS5zZWxlY3RlZDEySG91cnMgPT09ICdQTScpIHtcbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBGaWx0ZXIgYW5kIHRyYW5zZm9ybSBob3VycyB3aGljaCBncmVhdGVyIG9yIGVxdWFsIHRvIDEyXG4gICAgICAgICAgICogWzAsIDEsIDIsIC4uLiwgMTIsIDEzLCAxNCwgMTUsIC4uLiwgMjNdID0+IFsxMiwgMSwgMiwgMywgLi4uLCAxMV1cbiAgICAgICAgICAgKi9cbiAgICAgICAgICBkaXNhYmxlZEhvdXJzID0gZGlzYWJsZWRIb3Vycy5maWx0ZXIoaSA9PiBpID49IDEyKS5tYXAoaSA9PiAoaSA+IDEyID8gaSAtIDEyIDogaSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIEZpbHRlciBhbmQgdHJhbnNmb3JtIGhvdXJzIHdoaWNoIGxlc3MgdGhhbiAxMlxuICAgICAgICAgICAqIFswLCAxLCAyLC4uLiwgMTIsIDEzLCAxNCwgMTUsIC4uLjIzXSA9PiBbMTIsIDEsIDIsIDMsIC4uLiwgMTFdXG4gICAgICAgICAgICovXG4gICAgICAgICAgZGlzYWJsZWRIb3VycyA9IGRpc2FibGVkSG91cnMuZmlsdGVyKGkgPT4gaSA8IDEyIHx8IGkgPT09IDI0KS5tYXAoaSA9PiAoaSA9PT0gMjQgfHwgaSA9PT0gMCA/IDEyIDogaSkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBzdGFydEluZGV4ID0gMTtcbiAgICB9XG4gICAgdGhpcy5ob3VyUmFuZ2UgPSBtYWtlUmFuZ2UoaG91clJhbmdlcywgdGhpcy5uekhvdXJTdGVwLCBzdGFydEluZGV4KS5tYXAociA9PiB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBpbmRleDogcixcbiAgICAgICAgZGlzYWJsZWQ6ICEhZGlzYWJsZWRIb3VycyAmJiBkaXNhYmxlZEhvdXJzLmluZGV4T2YocikgIT09IC0xXG4gICAgICB9O1xuICAgIH0pO1xuICAgIGlmICh0aGlzLm56VXNlMTJIb3VycyAmJiB0aGlzLmhvdXJSYW5nZVt0aGlzLmhvdXJSYW5nZS5sZW5ndGggLSAxXS5pbmRleCA9PT0gMTIpIHtcbiAgICAgIGNvbnN0IHRlbXAgPSBbLi4udGhpcy5ob3VyUmFuZ2VdO1xuICAgICAgdGVtcC51bnNoaWZ0KHRlbXBbdGVtcC5sZW5ndGggLSAxXSk7XG4gICAgICB0ZW1wLnNwbGljZSh0ZW1wLmxlbmd0aCAtIDEsIDEpO1xuICAgICAgdGhpcy5ob3VyUmFuZ2UgPSB0ZW1wO1xuICAgIH1cbiAgfVxuXG4gIGJ1aWxkTWludXRlcygpOiB2b2lkIHtcbiAgICB0aGlzLm1pbnV0ZVJhbmdlID0gbWFrZVJhbmdlKDYwLCB0aGlzLm56TWludXRlU3RlcCkubWFwKHIgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaW5kZXg6IHIsXG4gICAgICAgIGRpc2FibGVkOiAhIXRoaXMubnpEaXNhYmxlZE1pbnV0ZXMgJiYgdGhpcy5uekRpc2FibGVkTWludXRlcyh0aGlzLnRpbWUuaG91cnMhKS5pbmRleE9mKHIpICE9PSAtMVxuICAgICAgfTtcbiAgICB9KTtcbiAgfVxuXG4gIGJ1aWxkU2Vjb25kcygpOiB2b2lkIHtcbiAgICB0aGlzLnNlY29uZFJhbmdlID0gbWFrZVJhbmdlKDYwLCB0aGlzLm56U2Vjb25kU3RlcCkubWFwKHIgPT4ge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaW5kZXg6IHIsXG4gICAgICAgIGRpc2FibGVkOiAhIXRoaXMubnpEaXNhYmxlZFNlY29uZHMgJiYgdGhpcy5uekRpc2FibGVkU2Vjb25kcyh0aGlzLnRpbWUuaG91cnMhLCB0aGlzLnRpbWUubWludXRlcyEpLmluZGV4T2YocikgIT09IC0xXG4gICAgICB9O1xuICAgIH0pO1xuICB9XG5cbiAgYnVpbGQxMkhvdXJzKCk6IHZvaWQge1xuICAgIGNvbnN0IGlzVXBwZXJGb3JtYXQgPSB0aGlzLl9mb3JtYXQuaW5jbHVkZXMoJ0EnKTtcbiAgICB0aGlzLnVzZTEySG91cnNSYW5nZSA9IFtcbiAgICAgIHtcbiAgICAgICAgaW5kZXg6IDAsXG4gICAgICAgIHZhbHVlOiBpc1VwcGVyRm9ybWF0ID8gJ0FNJyA6ICdhbSdcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIGluZGV4OiAxLFxuICAgICAgICB2YWx1ZTogaXNVcHBlckZvcm1hdCA/ICdQTScgOiAncG0nXG4gICAgICB9XG4gICAgXTtcbiAgfVxuXG4gIGJ1aWxkVGltZXMoKTogdm9pZCB7XG4gICAgdGhpcy5idWlsZEhvdXJzKCk7XG4gICAgdGhpcy5idWlsZE1pbnV0ZXMoKTtcbiAgICB0aGlzLmJ1aWxkU2Vjb25kcygpO1xuICAgIHRoaXMuYnVpbGQxMkhvdXJzKCk7XG4gIH1cblxuICBzY3JvbGxUb1RpbWUoZGVsYXk6IG51bWJlciA9IDApOiB2b2lkIHtcbiAgICBpZiAodGhpcy5ob3VyRW5hYmxlZCAmJiB0aGlzLmhvdXJMaXN0RWxlbWVudCkge1xuICAgICAgdGhpcy5zY3JvbGxUb1NlbGVjdGVkKHRoaXMuaG91ckxpc3RFbGVtZW50Lm5hdGl2ZUVsZW1lbnQsIHRoaXMudGltZS52aWV3SG91cnMhLCBkZWxheSwgJ2hvdXInKTtcbiAgICB9XG4gICAgaWYgKHRoaXMubWludXRlRW5hYmxlZCAmJiB0aGlzLm1pbnV0ZUxpc3RFbGVtZW50KSB7XG4gICAgICB0aGlzLnNjcm9sbFRvU2VsZWN0ZWQodGhpcy5taW51dGVMaXN0RWxlbWVudC5uYXRpdmVFbGVtZW50LCB0aGlzLnRpbWUubWludXRlcyEsIGRlbGF5LCAnbWludXRlJyk7XG4gICAgfVxuICAgIGlmICh0aGlzLnNlY29uZEVuYWJsZWQgJiYgdGhpcy5zZWNvbmRMaXN0RWxlbWVudCkge1xuICAgICAgdGhpcy5zY3JvbGxUb1NlbGVjdGVkKHRoaXMuc2Vjb25kTGlzdEVsZW1lbnQubmF0aXZlRWxlbWVudCwgdGhpcy50aW1lLnNlY29uZHMhLCBkZWxheSwgJ3NlY29uZCcpO1xuICAgIH1cbiAgICBpZiAodGhpcy5uelVzZTEySG91cnMgJiYgdGhpcy51c2UxMkhvdXJzTGlzdEVsZW1lbnQpIHtcbiAgICAgIGNvbnN0IHNlbGVjdGVkSG91cnMgPSB0aGlzLnRpbWUuc2VsZWN0ZWQxMkhvdXJzO1xuICAgICAgY29uc3QgaW5kZXggPSBzZWxlY3RlZEhvdXJzID09PSAnQU0nID8gMCA6IDE7XG4gICAgICB0aGlzLnNjcm9sbFRvU2VsZWN0ZWQodGhpcy51c2UxMkhvdXJzTGlzdEVsZW1lbnQubmF0aXZlRWxlbWVudCwgaW5kZXgsIGRlbGF5LCAnMTItaG91cicpO1xuICAgIH1cbiAgfVxuXG4gIHNlbGVjdEhvdXIoaG91cjogeyBpbmRleDogbnVtYmVyOyBkaXNhYmxlZDogYm9vbGVhbiB9KTogdm9pZCB7XG4gICAgdGhpcy50aW1lLnNldEhvdXJzKGhvdXIuaW5kZXgsIGhvdXIuZGlzYWJsZWQpO1xuICAgIGlmICghIXRoaXMuX2Rpc2FibGVkTWludXRlcykge1xuICAgICAgdGhpcy5idWlsZE1pbnV0ZXMoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuX2Rpc2FibGVkU2Vjb25kcyB8fCB0aGlzLl9kaXNhYmxlZE1pbnV0ZXMpIHtcbiAgICAgIHRoaXMuYnVpbGRTZWNvbmRzKCk7XG4gICAgfVxuICB9XG5cbiAgc2VsZWN0TWludXRlKG1pbnV0ZTogeyBpbmRleDogbnVtYmVyOyBkaXNhYmxlZDogYm9vbGVhbiB9KTogdm9pZCB7XG4gICAgdGhpcy50aW1lLnNldE1pbnV0ZXMobWludXRlLmluZGV4LCBtaW51dGUuZGlzYWJsZWQpO1xuICAgIGlmICghIXRoaXMuX2Rpc2FibGVkU2Vjb25kcykge1xuICAgICAgdGhpcy5idWlsZFNlY29uZHMoKTtcbiAgICB9XG4gIH1cblxuICBzZWxlY3RTZWNvbmQoc2Vjb25kOiB7IGluZGV4OiBudW1iZXI7IGRpc2FibGVkOiBib29sZWFuIH0pOiB2b2lkIHtcbiAgICB0aGlzLnRpbWUuc2V0U2Vjb25kcyhzZWNvbmQuaW5kZXgsIHNlY29uZC5kaXNhYmxlZCk7XG4gIH1cblxuICBzZWxlY3QxMkhvdXJzKHZhbHVlOiB7IGluZGV4OiBudW1iZXI7IHZhbHVlOiBzdHJpbmcgfSk6IHZvaWQge1xuICAgIHRoaXMudGltZS5zZXRTZWxlY3RlZDEySG91cnModmFsdWUudmFsdWUpO1xuICAgIGlmICghIXRoaXMuX2Rpc2FibGVkSG91cnMpIHtcbiAgICAgIHRoaXMuYnVpbGRIb3VycygpO1xuICAgIH1cbiAgICBpZiAoISF0aGlzLl9kaXNhYmxlZE1pbnV0ZXMpIHtcbiAgICAgIHRoaXMuYnVpbGRNaW51dGVzKCk7XG4gICAgfVxuICAgIGlmICghIXRoaXMuX2Rpc2FibGVkU2Vjb25kcykge1xuICAgICAgdGhpcy5idWlsZFNlY29uZHMoKTtcbiAgICB9XG4gIH1cblxuICBzY3JvbGxUb1NlbGVjdGVkKGluc3RhbmNlOiBIVE1MRWxlbWVudCwgaW5kZXg6IG51bWJlciwgZHVyYXRpb246IG51bWJlciA9IDAsIHVuaXQ6IE56VGltZVBpY2tlclVuaXQpOiB2b2lkIHtcbiAgICBpZiAoIWluc3RhbmNlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHRyYW5zSW5kZXggPSB0aGlzLnRyYW5zbGF0ZUluZGV4KGluZGV4LCB1bml0KTtcbiAgICBjb25zdCBjdXJyZW50T3B0aW9uID0gKGluc3RhbmNlLmNoaWxkcmVuW3RyYW5zSW5kZXhdIHx8IGluc3RhbmNlLmNoaWxkcmVuWzBdKSBhcyBIVE1MRWxlbWVudDtcbiAgICB0aGlzLnNjcm9sbFRvKGluc3RhbmNlLCBjdXJyZW50T3B0aW9uLm9mZnNldFRvcCwgZHVyYXRpb24pO1xuICB9XG5cbiAgdHJhbnNsYXRlSW5kZXgoaW5kZXg6IG51bWJlciwgdW5pdDogTnpUaW1lUGlja2VyVW5pdCk6IG51bWJlciB7XG4gICAgaWYgKHVuaXQgPT09ICdob3VyJykge1xuICAgICAgcmV0dXJuIHRoaXMuY2FsY0luZGV4KHRoaXMubnpEaXNhYmxlZEhvdXJzPy4oKSwgdGhpcy5ob3VyUmFuZ2UubWFwKGl0ZW0gPT4gaXRlbS5pbmRleCkuaW5kZXhPZihpbmRleCkpO1xuICAgIH0gZWxzZSBpZiAodW5pdCA9PT0gJ21pbnV0ZScpIHtcbiAgICAgIHJldHVybiB0aGlzLmNhbGNJbmRleCh0aGlzLm56RGlzYWJsZWRNaW51dGVzPy4odGhpcy50aW1lLmhvdXJzISksIHRoaXMubWludXRlUmFuZ2UubWFwKGl0ZW0gPT4gaXRlbS5pbmRleCkuaW5kZXhPZihpbmRleCkpO1xuICAgIH0gZWxzZSBpZiAodW5pdCA9PT0gJ3NlY29uZCcpIHtcbiAgICAgIC8vIHNlY29uZFxuICAgICAgcmV0dXJuIHRoaXMuY2FsY0luZGV4KFxuICAgICAgICB0aGlzLm56RGlzYWJsZWRTZWNvbmRzPy4odGhpcy50aW1lLmhvdXJzISwgdGhpcy50aW1lLm1pbnV0ZXMhKSxcbiAgICAgICAgdGhpcy5zZWNvbmRSYW5nZS5tYXAoaXRlbSA9PiBpdGVtLmluZGV4KS5pbmRleE9mKGluZGV4KVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gMTItaG91clxuICAgICAgcmV0dXJuIHRoaXMuY2FsY0luZGV4KFtdLCB0aGlzLnVzZTEySG91cnNSYW5nZS5tYXAoaXRlbSA9PiBpdGVtLmluZGV4KS5pbmRleE9mKGluZGV4KSk7XG4gICAgfVxuICB9XG5cbiAgc2Nyb2xsVG8oZWxlbWVudDogSFRNTEVsZW1lbnQsIHRvOiBudW1iZXIsIGR1cmF0aW9uOiBudW1iZXIpOiB2b2lkIHtcbiAgICBpZiAoZHVyYXRpb24gPD0gMCkge1xuICAgICAgZWxlbWVudC5zY3JvbGxUb3AgPSB0bztcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgZGlmZmVyZW5jZSA9IHRvIC0gZWxlbWVudC5zY3JvbGxUb3A7XG4gICAgY29uc3QgcGVyVGljayA9IChkaWZmZXJlbmNlIC8gZHVyYXRpb24pICogMTA7XG5cbiAgICByZXFBbmltRnJhbWUoKCkgPT4ge1xuICAgICAgZWxlbWVudC5zY3JvbGxUb3AgPSBlbGVtZW50LnNjcm9sbFRvcCArIHBlclRpY2s7XG4gICAgICBpZiAoZWxlbWVudC5zY3JvbGxUb3AgPT09IHRvKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHRoaXMuc2Nyb2xsVG8oZWxlbWVudCwgdG8sIGR1cmF0aW9uIC0gMTApO1xuICAgIH0pO1xuICB9XG5cbiAgY2FsY0luZGV4KGFycmF5OiBudW1iZXJbXSB8IHVuZGVmaW5lZCwgaW5kZXg6IG51bWJlcik6IG51bWJlciB7XG4gICAgaWYgKGFycmF5Py5sZW5ndGggJiYgdGhpcy5uekhpZGVEaXNhYmxlZE9wdGlvbnMpIHtcbiAgICAgIHJldHVybiAoXG4gICAgICAgIGluZGV4IC1cbiAgICAgICAgYXJyYXkucmVkdWNlKChwcmUsIHZhbHVlKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHByZSArICh2YWx1ZSA8IGluZGV4ID8gMSA6IDApO1xuICAgICAgICB9LCAwKVxuICAgICAgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGluZGV4O1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCBjaGFuZ2VkKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLm9uQ2hhbmdlKSB7XG4gICAgICB0aGlzLm9uQ2hhbmdlKHRoaXMudGltZS52YWx1ZSEpO1xuICAgIH1cbiAgfVxuXG4gIHByb3RlY3RlZCB0b3VjaGVkKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLm9uVG91Y2gpIHtcbiAgICAgIHRoaXMub25Ub3VjaCgpO1xuICAgIH1cbiAgfVxuXG4gIHRpbWVEaXNhYmxlZCh2YWx1ZTogRGF0ZSk6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGhvdXIgPSB2YWx1ZS5nZXRIb3VycygpO1xuICAgIGNvbnN0IG1pbnV0ZSA9IHZhbHVlLmdldE1pbnV0ZXMoKTtcbiAgICBjb25zdCBzZWNvbmQgPSB2YWx1ZS5nZXRTZWNvbmRzKCk7XG4gICAgcmV0dXJuIChcbiAgICAgICh0aGlzLm56RGlzYWJsZWRIb3Vycz8uKCkuaW5kZXhPZihob3VyKSA/PyAtMSkgPiAtMSB8fFxuICAgICAgKHRoaXMubnpEaXNhYmxlZE1pbnV0ZXM/Lihob3VyKS5pbmRleE9mKG1pbnV0ZSkgPz8gLTEpID4gLTEgfHxcbiAgICAgICh0aGlzLm56RGlzYWJsZWRTZWNvbmRzPy4oaG91ciwgbWludXRlKS5pbmRleE9mKHNlY29uZCkgPz8gLTEpID4gLTFcbiAgICApO1xuICB9XG5cbiAgb25DbGlja05vdygpOiB2b2lkIHtcbiAgICBjb25zdCBub3cgPSBuZXcgRGF0ZSgpO1xuICAgIGlmICh0aGlzLnRpbWVEaXNhYmxlZChub3cpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMudGltZS5zZXRWYWx1ZShub3cpO1xuICAgIHRoaXMuY2hhbmdlZCgpO1xuICAgIHRoaXMuY2xvc2VQYW5lbC5lbWl0KCk7XG4gIH1cblxuICBvbkNsaWNrT2soKTogdm9pZCB7XG4gICAgdGhpcy5jbG9zZVBhbmVsLmVtaXQoKTtcbiAgfVxuXG4gIGlzU2VsZWN0ZWRIb3VyKGhvdXI6IHsgaW5kZXg6IG51bWJlcjsgZGlzYWJsZWQ6IGJvb2xlYW4gfSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBob3VyLmluZGV4ID09PSB0aGlzLnRpbWUudmlld0hvdXJzO1xuICB9XG5cbiAgaXNTZWxlY3RlZE1pbnV0ZShtaW51dGU6IHsgaW5kZXg6IG51bWJlcjsgZGlzYWJsZWQ6IGJvb2xlYW4gfSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBtaW51dGUuaW5kZXggPT09IHRoaXMudGltZS5taW51dGVzO1xuICB9XG5cbiAgaXNTZWxlY3RlZFNlY29uZChzZWNvbmQ6IHsgaW5kZXg6IG51bWJlcjsgZGlzYWJsZWQ6IGJvb2xlYW4gfSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBzZWNvbmQuaW5kZXggPT09IHRoaXMudGltZS5zZWNvbmRzO1xuICB9XG5cbiAgaXNTZWxlY3RlZDEySG91cnModmFsdWU6IHsgaW5kZXg6IG51bWJlcjsgdmFsdWU6IHN0cmluZyB9KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHZhbHVlLnZhbHVlLnRvVXBwZXJDYXNlKCkgPT09IHRoaXMudGltZS5zZWxlY3RlZDEySG91cnM7XG4gIH1cblxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWYsIHB1YmxpYyBkYXRlSGVscGVyOiBEYXRlSGVscGVyU2VydmljZSwgcHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmKSB7XG4gICAgLy8gVE9ETzogbW92ZSB0byBob3N0IGFmdGVyIFZpZXcgRW5naW5lIGRlcHJlY2F0aW9uXG4gICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYW50LXBpY2tlci10aW1lLXBhbmVsJyk7XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLnRpbWUuY2hhbmdlcy5waXBlKHRha2VVbnRpbCh0aGlzLnVuc3Vic2NyaWJlJCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLmNoYW5nZWQoKTtcbiAgICAgIHRoaXMudG91Y2hlZCgpO1xuICAgICAgdGhpcy5zY3JvbGxUb1RpbWUoMTIwKTtcbiAgICB9KTtcbiAgICB0aGlzLmJ1aWxkVGltZXMoKTtcbiAgICBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgIHRoaXMuc2Nyb2xsVG9UaW1lKCk7XG4gICAgICB0aGlzLmZpcnN0U2Nyb2xsZWQgPSB0cnVlO1xuICAgIH0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy51bnN1YnNjcmliZSQubmV4dCgpO1xuICAgIHRoaXMudW5zdWJzY3JpYmUkLmNvbXBsZXRlKCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgY29uc3QgeyBuelVzZTEySG91cnMsIG56RGVmYXVsdE9wZW5WYWx1ZSB9ID0gY2hhbmdlcztcbiAgICBpZiAoIW56VXNlMTJIb3Vycz8ucHJldmlvdXNWYWx1ZSAmJiBuelVzZTEySG91cnM/LmN1cnJlbnRWYWx1ZSkge1xuICAgICAgdGhpcy5idWlsZDEySG91cnMoKTtcbiAgICAgIHRoaXMuZW5hYmxlZENvbHVtbnMrKztcbiAgICB9XG4gICAgaWYgKG56RGVmYXVsdE9wZW5WYWx1ZT8uY3VycmVudFZhbHVlKSB7XG4gICAgICB0aGlzLnRpbWUuc2V0RGVmYXVsdE9wZW5WYWx1ZSh0aGlzLm56RGVmYXVsdE9wZW5WYWx1ZSB8fCBuZXcgRGF0ZSgpKTtcbiAgICB9XG4gIH1cblxuICB3cml0ZVZhbHVlKHZhbHVlOiBEYXRlKTogdm9pZCB7XG4gICAgdGhpcy50aW1lLnNldFZhbHVlKHZhbHVlLCB0aGlzLm56VXNlMTJIb3Vycyk7XG4gICAgdGhpcy5idWlsZFRpbWVzKCk7XG5cbiAgICBpZiAodmFsdWUgJiYgdGhpcy5maXJzdFNjcm9sbGVkKSB7XG4gICAgICB0aGlzLnNjcm9sbFRvVGltZSgxMjApO1xuICAgIH1cbiAgICAvLyBNYXJrIHRoaXMgY29tcG9uZW50IHRvIGJlIGNoZWNrZWQgbWFudWFsbHkgd2l0aCBpbnRlcm5hbCBwcm9wZXJ0aWVzIGNoYW5naW5nIChzZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9hbmd1bGFyL2FuZ3VsYXIvaXNzdWVzLzEwODE2KVxuICAgIHRoaXMuY2RyLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKHZhbHVlOiBEYXRlKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5vbkNoYW5nZSA9IGZuO1xuICB9XG5cbiAgcmVnaXN0ZXJPblRvdWNoZWQoZm46ICgpID0+IHZvaWQpOiB2b2lkIHtcbiAgICB0aGlzLm9uVG91Y2ggPSBmbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcmV2ZW50IGlucHV0IGxvc2luZyBmb2N1cyB3aGVuIGNsaWNrIHBhbmVsXG4gICAqIEBwYXJhbSBldmVudFxuICAgKi9cbiAgb25Nb3VzZWRvd24oZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICB9XG59XG4iXX0=