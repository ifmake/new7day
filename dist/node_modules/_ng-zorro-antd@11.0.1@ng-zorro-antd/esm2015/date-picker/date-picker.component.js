/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { __decorate, __metadata } from "tslib";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, Host, Input, Optional, Output, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { NzNoAnimationDirective } from 'ng-zorro-antd/core/no-animation';
import { CandyDate, cloneDate } from 'ng-zorro-antd/core/time';
import { InputBoolean, toBoolean, valueFunctionProp } from 'ng-zorro-antd/core/util';
import { DateHelperService, NzI18nService } from 'ng-zorro-antd/i18n';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DatePickerService } from './date-picker.service';
import { Directionality } from '@angular/cdk/bidi';
import { NzConfigService, WithConfig } from 'ng-zorro-antd/core/config';
import { NzPickerComponent } from './picker.component';
const POPUP_STYLE_PATCH = { position: 'relative' }; // Aim to override antd's style to support overlay's position strategy (position:absolute will cause it not working beacuse the overlay can't get the height/width of it's content)
const NZ_CONFIG_MODULE_NAME = 'datePicker';
/**
 * The base picker for all common APIs
 */
export class NzDatePickerComponent {
    constructor(nzConfigService, datePickerService, i18n, cdr, renderer, elementRef, dateHelper, directionality, noAnimation) {
        this.nzConfigService = nzConfigService;
        this.datePickerService = datePickerService;
        this.i18n = i18n;
        this.cdr = cdr;
        this.renderer = renderer;
        this.elementRef = elementRef;
        this.dateHelper = dateHelper;
        this.directionality = directionality;
        this.noAnimation = noAnimation;
        this._nzModuleName = NZ_CONFIG_MODULE_NAME;
        this.isRange = false; // Indicate whether the value is a range value
        this.focused = false;
        this.dir = 'ltr';
        this.panelMode = 'date';
        this.destroyed$ = new Subject();
        this.isCustomPlaceHolder = false;
        this.isCustomFormat = false;
        this.showTime = false;
        // --- Common API
        this.nzAllowClear = true;
        this.nzAutoFocus = false;
        this.nzDisabled = false;
        this.nzBorderless = false;
        this.nzInputReadOnly = false;
        this.nzPlaceHolder = '';
        this.nzPopupStyle = POPUP_STYLE_PATCH;
        this.nzSize = 'default';
        this.nzShowToday = true;
        this.nzMode = 'date';
        this.nzShowNow = true;
        this.nzDefaultPickerValue = null;
        this.nzSeparator = undefined;
        this.nzSuffixIcon = 'calendar';
        // TODO(@wenqi73) The PanelMode need named for each pickers and export
        this.nzOnPanelChange = new EventEmitter();
        this.nzOnCalendarChange = new EventEmitter();
        this.nzOnOk = new EventEmitter();
        this.nzOnOpenChange = new EventEmitter();
        // ------------------------------------------------------------------------
        // | Control value accessor implements
        // ------------------------------------------------------------------------
        // NOTE: onChangeFn/onTouchedFn will not be assigned if user not use as ngModel
        this.onChangeFn = () => void 0;
        this.onTouchedFn = () => void 0;
        // TODO: move to host after View Engine deprecation
        this.elementRef.nativeElement.classList.add('ant-picker');
    }
    get nzShowTime() {
        return this.showTime;
    }
    set nzShowTime(value) {
        this.showTime = typeof value === 'object' ? value : toBoolean(value);
    }
    ngOnInit() {
        var _a;
        // Subscribe the every locale change if the nzLocale is not handled by user
        if (!this.nzLocale) {
            this.i18n.localeChange.pipe(takeUntil(this.destroyed$)).subscribe(() => this.setLocale());
        }
        // Default value
        this.datePickerService.isRange = this.isRange;
        this.datePickerService.initValue();
        this.datePickerService.emitValue$.pipe(takeUntil(this.destroyed$)).subscribe(_ => {
            var _a, _b, _c, _d;
            const value = this.datePickerService.value;
            this.datePickerService.initialValue = cloneDate(value);
            if (this.isRange) {
                const vAsRange = value;
                if (vAsRange.length) {
                    this.onChangeFn([(_b = (_a = vAsRange[0]) === null || _a === void 0 ? void 0 : _a.nativeDate) !== null && _b !== void 0 ? _b : null, (_d = (_c = vAsRange[1]) === null || _c === void 0 ? void 0 : _c.nativeDate) !== null && _d !== void 0 ? _d : null]);
                }
                else {
                    this.onChangeFn([]);
                }
            }
            else {
                if (value) {
                    this.onChangeFn(value.nativeDate);
                }
                else {
                    this.onChangeFn(null);
                }
            }
            this.onTouchedFn();
            // When value emitted, overlay will be closed
            this.close();
        });
        this.setModeAndFormat();
        (_a = this.directionality.change) === null || _a === void 0 ? void 0 : _a.pipe(takeUntil(this.destroyed$)).subscribe((direction) => {
            this.dir = direction;
            this.cdr.detectChanges();
        });
        this.dir = this.directionality.value;
    }
    ngOnChanges(changes) {
        var _a, _b;
        if (changes.nzPopupStyle) {
            // Always assign the popup style patch
            this.nzPopupStyle = this.nzPopupStyle ? Object.assign(Object.assign({}, this.nzPopupStyle), POPUP_STYLE_PATCH) : POPUP_STYLE_PATCH;
        }
        // Mark as customized placeholder by user once nzPlaceHolder assigned at the first time
        if ((_a = changes.nzPlaceHolder) === null || _a === void 0 ? void 0 : _a.currentValue) {
            this.isCustomPlaceHolder = true;
        }
        if ((_b = changes.nzFormat) === null || _b === void 0 ? void 0 : _b.currentValue) {
            this.isCustomFormat = true;
        }
        if (changes.nzLocale) {
            // The nzLocale is currently handled by user
            this.setDefaultPlaceHolder();
        }
        if (changes.nzRenderExtraFooter) {
            this.extraFooter = valueFunctionProp(this.nzRenderExtraFooter);
        }
        if (changes.nzMode) {
            this.setDefaultPlaceHolder();
            this.setModeAndFormat();
        }
    }
    ngOnDestroy() {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
    setModeAndFormat() {
        const inputFormats = {
            year: 'yyyy',
            month: 'yyyy-MM',
            week: this.i18n.getDateLocale() ? 'RRRR-II' : 'yyyy-ww',
            date: this.nzShowTime ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd'
        };
        if (!this.nzMode) {
            this.nzMode = 'date';
        }
        this.panelMode = this.isRange ? [this.nzMode, this.nzMode] : this.nzMode;
        // Default format when it's empty
        if (!this.isCustomFormat) {
            this.nzFormat = inputFormats[this.nzMode];
        }
    }
    /**
     * Triggered when overlayOpen changes (different with realOpenState)
     * @param open The overlayOpen in picker component
     */
    onOpenChange(open) {
        this.nzOnOpenChange.emit(open);
    }
    open() {
        this.picker.showOverlay();
    }
    close() {
        this.picker.hideOverlay();
    }
    writeValue(value) {
        this.setValue(value);
        this.cdr.markForCheck();
    }
    registerOnChange(fn) {
        this.onChangeFn = fn;
    }
    registerOnTouched(fn) {
        this.onTouchedFn = fn;
    }
    setDisabledState(isDisabled) {
        this.nzDisabled = isDisabled;
        this.cdr.markForCheck();
    }
    // ------------------------------------------------------------------------
    // | Internal methods
    // ------------------------------------------------------------------------
    // Reload locale from i18n with side effects
    setLocale() {
        this.nzLocale = this.i18n.getLocaleData('DatePicker', {});
        this.setDefaultPlaceHolder();
        this.cdr.markForCheck();
    }
    setDefaultPlaceHolder() {
        if (!this.isCustomPlaceHolder && this.nzLocale) {
            const defaultPlaceholder = {
                year: this.getPropertyOfLocale('yearPlaceholder'),
                month: this.getPropertyOfLocale('monthPlaceholder'),
                week: this.getPropertyOfLocale('weekPlaceholder'),
                date: this.getPropertyOfLocale('placeholder')
            };
            const defaultRangePlaceholder = {
                year: this.getPropertyOfLocale('rangeYearPlaceholder'),
                month: this.getPropertyOfLocale('rangeMonthPlaceholder'),
                week: this.getPropertyOfLocale('rangeWeekPlaceholder'),
                date: this.getPropertyOfLocale('rangePlaceholder')
            };
            this.nzPlaceHolder = this.isRange
                ? defaultRangePlaceholder[this.nzMode]
                : defaultPlaceholder[this.nzMode];
        }
    }
    getPropertyOfLocale(type) {
        return this.nzLocale.lang[type] || this.i18n.getLocaleData(`DatePicker.lang.${type}`);
    }
    // Safe way of setting value with default
    setValue(value) {
        const newValue = this.datePickerService.makeValue(value);
        this.datePickerService.setValue(newValue);
        this.datePickerService.initialValue = newValue;
    }
    onFocusChange(value) {
        this.focused = value;
        // TODO: avoid autoFocus cause change after checked error
        if (this.focused) {
            this.renderer.addClass(this.elementRef.nativeElement, 'ant-picker-focused');
        }
        else {
            this.renderer.removeClass(this.elementRef.nativeElement, 'ant-picker-focused');
        }
    }
    onPanelModeChange(panelMode) {
        this.nzOnPanelChange.emit(panelMode);
    }
    // Emit nzOnCalendarChange when select date by nz-range-picker
    onCalendarChange(value) {
        if (this.isRange && Array.isArray(value)) {
            const rangeValue = value.filter(x => x instanceof CandyDate).map(x => x.nativeDate);
            this.nzOnCalendarChange.emit(rangeValue);
        }
    }
    onResultOk() {
        var _a, _b;
        if (this.isRange) {
            const value = this.datePickerService.value;
            if (value.length) {
                this.nzOnOk.emit([((_a = value[0]) === null || _a === void 0 ? void 0 : _a.nativeDate) || null, ((_b = value[1]) === null || _b === void 0 ? void 0 : _b.nativeDate) || null]);
            }
            else {
                this.nzOnOk.emit([]);
            }
        }
        else {
            if (this.datePickerService.value) {
                this.nzOnOk.emit(this.datePickerService.value.nativeDate);
            }
            else {
                this.nzOnOk.emit(null);
            }
        }
    }
}
NzDatePickerComponent.decorators = [
    { type: Component, args: [{
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                selector: 'nz-date-picker,nz-week-picker,nz-month-picker,nz-year-picker,nz-range-picker',
                exportAs: 'nzDatePicker',
                template: `
    <div
      nz-picker
      [isRange]="isRange"
      [open]="nzOpen"
      [dir]="dir"
      [separator]="nzSeparator"
      [disabled]="nzDisabled"
      [inputReadOnly]="nzInputReadOnly"
      [format]="nzFormat"
      [allowClear]="nzAllowClear"
      [autoFocus]="nzAutoFocus"
      [placeholder]="nzPlaceHolder"
      style="display: inherit; align-items: center; width: 100%;"
      [dropdownClassName]="nzDropdownClassName"
      [class.ant-picker-dropdown-rtl]="dir === 'rtl'"
      [popupStyle]="nzPopupStyle"
      [noAnimation]="!!noAnimation?.nzNoAnimation"
      [suffixIcon]="nzSuffixIcon"
      (openChange)="onOpenChange($event)"
      (focusChange)="onFocusChange($event)"
    >
      <date-range-popup
        [isRange]="isRange"
        [defaultPickerValue]="nzDefaultPickerValue"
        [showWeek]="nzMode === 'week'"
        [panelMode]="panelMode"
        (panelModeChange)="onPanelModeChange($event)"
        (calendarChange)="onCalendarChange($event)"
        [locale]="nzLocale?.lang!"
        [showToday]="nzMode === 'date' && nzShowToday && !isRange && !nzShowTime"
        [showNow]="nzMode === 'date' && nzShowNow && !isRange && !!nzShowTime"
        [showTime]="nzShowTime"
        [dateRender]="nzDateRender"
        [disabledDate]="nzDisabledDate"
        [disabledTime]="nzDisabledTime"
        [extraFooter]="extraFooter"
        [ranges]="nzRanges"
        [dir]="dir"
        (resultOk)="onResultOk()"
      ></date-range-popup>
    </div>
  `,
                host: {
                    '[class.ant-picker-range]': `isRange`,
                    '[class.ant-picker-large]': `nzSize === 'large'`,
                    '[class.ant-picker-small]': `nzSize === 'small'`,
                    '[class.ant-picker-disabled]': `nzDisabled`,
                    '[class.ant-picker-rtl]': `dir === 'rtl'`,
                    '[class.ant-picker-borderless]': `nzBorderless`,
                    '(click)': 'picker.onClickInputBox($event)'
                },
                providers: [
                    DatePickerService,
                    {
                        provide: NG_VALUE_ACCESSOR,
                        multi: true,
                        useExisting: forwardRef(() => NzDatePickerComponent)
                    }
                ]
            },] }
];
NzDatePickerComponent.ctorParameters = () => [
    { type: NzConfigService },
    { type: DatePickerService },
    { type: NzI18nService },
    { type: ChangeDetectorRef },
    { type: Renderer2 },
    { type: ElementRef },
    { type: DateHelperService },
    { type: Directionality, decorators: [{ type: Optional }] },
    { type: NzNoAnimationDirective, decorators: [{ type: Host }, { type: Optional }] }
];
NzDatePickerComponent.propDecorators = {
    nzAllowClear: [{ type: Input }],
    nzAutoFocus: [{ type: Input }],
    nzDisabled: [{ type: Input }],
    nzBorderless: [{ type: Input }],
    nzInputReadOnly: [{ type: Input }],
    nzOpen: [{ type: Input }],
    nzDisabledDate: [{ type: Input }],
    nzLocale: [{ type: Input }],
    nzPlaceHolder: [{ type: Input }],
    nzPopupStyle: [{ type: Input }],
    nzDropdownClassName: [{ type: Input }],
    nzSize: [{ type: Input }],
    nzFormat: [{ type: Input }],
    nzDateRender: [{ type: Input }],
    nzDisabledTime: [{ type: Input }],
    nzRenderExtraFooter: [{ type: Input }],
    nzShowToday: [{ type: Input }],
    nzMode: [{ type: Input }],
    nzShowNow: [{ type: Input }],
    nzRanges: [{ type: Input }],
    nzDefaultPickerValue: [{ type: Input }],
    nzSeparator: [{ type: Input }],
    nzSuffixIcon: [{ type: Input }],
    nzOnPanelChange: [{ type: Output }],
    nzOnCalendarChange: [{ type: Output }],
    nzOnOk: [{ type: Output }],
    nzOnOpenChange: [{ type: Output }],
    picker: [{ type: ViewChild, args: [NzPickerComponent, { static: true },] }],
    nzShowTime: [{ type: Input }]
};
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzDatePickerComponent.prototype, "nzAllowClear", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzDatePickerComponent.prototype, "nzAutoFocus", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzDatePickerComponent.prototype, "nzDisabled", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzDatePickerComponent.prototype, "nzBorderless", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzDatePickerComponent.prototype, "nzInputReadOnly", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzDatePickerComponent.prototype, "nzOpen", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzDatePickerComponent.prototype, "nzShowToday", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzDatePickerComponent.prototype, "nzShowNow", void 0);
__decorate([
    WithConfig(),
    __metadata("design:type", String)
], NzDatePickerComponent.prototype, "nzSeparator", void 0);
__decorate([
    WithConfig(),
    __metadata("design:type", Object)
], NzDatePickerComponent.prototype, "nzSuffixIcon", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1waWNrZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uL2NvbXBvbmVudHMvZGF0ZS1waWNrZXIvIiwic291cmNlcyI6WyJkYXRlLXBpY2tlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHOztBQUVILE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFVBQVUsRUFDVixJQUFJLEVBQ0osS0FBSyxFQUlMLFFBQVEsRUFDUixNQUFNLEVBQ04sU0FBUyxFQUdULFNBQVMsRUFDVCxpQkFBaUIsRUFDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUF3QixpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3pFLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQ3pFLE9BQU8sRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFtQixNQUFNLHlCQUF5QixDQUFDO0FBRWhGLE9BQU8sRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLGlCQUFpQixFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDckYsT0FBTyxFQUFFLGlCQUFpQixFQUE0RCxhQUFhLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUNoSSxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQy9CLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUMzQyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUUxRCxPQUFPLEVBQWEsY0FBYyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDOUQsT0FBTyxFQUFlLGVBQWUsRUFBRSxVQUFVLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNyRixPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUd2RCxNQUFNLGlCQUFpQixHQUFHLEVB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IHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vZ2l0aHViLmNvbS9ORy1aT1JSTy9uZy16b3Jyby1hbnRkL2Jsb2IvbWFzdGVyL0xJQ0VOU0VcbiAqL1xuXG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBIb3N0LFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbiAgUmVuZGVyZXIyLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvblxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IENvbnRyb2xWYWx1ZUFjY2Vzc29yLCBOR19WQUxVRV9BQ0NFU1NPUiB9IGZyb20gJ0Bhbmd1bGFyL2Zvcm1zJztcbmltcG9ydCB7IE56Tm9BbmltYXRpb25EaXJlY3RpdmUgfSBmcm9tICduZy16b3Jyby1hbnRkL2NvcmUvbm8tYW5pbWF0aW9uJztcbmltcG9ydCB7IENhbmR5RGF0ZSwgY2xvbmVEYXRlLCBDb21wYXRpYmxlVmFsdWUgfSBmcm9tICduZy16b3Jyby1hbnRkL2NvcmUvdGltZSc7XG5pbXBvcnQgeyBCb29sZWFuSW5wdXQsIEZ1bmN0aW9uUHJvcCwgTnpTYWZlQW55LCBPbkNoYW5nZVR5cGUsIE9uVG91Y2hlZFR5cGUgfSBmcm9tICduZy16b3Jyby1hbnRkL2NvcmUvdHlwZXMnO1xuaW1wb3J0IHsgSW5wdXRCb29sZWFuLCB0b0Jvb2xlYW4sIHZhbHVlRnVuY3Rpb25Qcm9wIH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL3V0aWwnO1xuaW1wb3J0IHsgRGF0ZUhlbHBlclNlcnZpY2UsIE56RGF0ZVBpY2tlckkxOG5JbnRlcmZhY2UsIE56RGF0ZVBpY2tlckxhbmdJMThuSW50ZXJmYWNlLCBOekkxOG5TZXJ2aWNlIH0gZnJvbSAnbmctem9ycm8tYW50ZC9pMThuJztcbmltcG9ydCB7IFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IHRha2VVbnRpbCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IERhdGVQaWNrZXJTZXJ2aWNlIH0gZnJvbSAnLi9kYXRlLXBpY2tlci5zZXJ2aWNlJztcblxuaW1wb3J0IHsgRGlyZWN0aW9uLCBEaXJlY3Rpb25hbGl0eSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7IE56Q29uZmlnS2V5LCBOekNvbmZpZ1NlcnZpY2UsIFdpdGhDb25maWcgfSBmcm9tICduZy16b3Jyby1hbnRkL2NvcmUvY29uZmlnJztcbmltcG9ydCB7IE56UGlja2VyQ29tcG9uZW50IH0gZnJvbSAnLi9waWNrZXIuY29tcG9uZW50JztcbmltcG9ydCB7IENvbXBhdGlibGVEYXRlLCBEaXNhYmxlZFRpbWVGbiwgTnpEYXRlTW9kZSwgUHJlc2V0UmFuZ2VzLCBTdXBwb3J0VGltZU9wdGlvbnMgfSBmcm9tICcuL3N0YW5kYXJkLXR5cGVzJztcblxuY29uc3QgUE9QVVBfU1RZTEVfUEFUQ0ggPSB7IHBvc2l0aW9uOiAncmVsYXRpdmUnIH07IC8vIEFpbSB0byBvdmVycmlkZSBhbnRkJ3Mgc3R5bGUgdG8gc3VwcG9ydCBvdmVybGF5J3MgcG9zaXRpb24gc3RyYXRlZ3kgKHBvc2l0aW9uOmFic29sdXRlIHdpbGwgY2F1c2UgaXQgbm90IHdvcmtpbmcgYmVhY3VzZSB0aGUgb3ZlcmxheSBjYW4ndCBnZXQgdGhlIGhlaWdodC93aWR0aCBvZiBpdCdzIGNvbnRlbnQpXG5jb25zdCBOWl9DT05GSUdfTU9EVUxFX05BTUU6IE56Q29uZmlnS2V5ID0gJ2RhdGVQaWNrZXInO1xuXG5leHBvcnQgdHlwZSBOekRhdGVQaWNrZXJTaXplVHlwZSA9ICdsYXJnZScgfCAnZGVmYXVsdCcgfCAnc21hbGwnO1xuXG4vKipcbiAqIFRoZSBiYXNlIHBpY2tlciBmb3IgYWxsIGNvbW1vbiBBUElzXG4gKi9cbkBDb21wb25lbnQoe1xuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgc2VsZWN0b3I6ICduei1kYXRlLXBpY2tlcixuei13ZWVrLXBpY2tlcixuei1tb250aC1waWNrZXIsbnoteWVhci1waWNrZXIsbnotcmFuZ2UtcGlja2VyJyxcbiAgZXhwb3J0QXM6ICduekRhdGVQaWNrZXInLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXZcbiAgICAgIG56LXBpY2tlclxuICAgICAgW2lzUmFuZ2VdPVwiaXNSYW5nZVwiXG4gICAgICBbb3Blbl09XCJuek9wZW5cIlxuICAgICAgW2Rpcl09XCJkaXJcIlxuICAgICAgW3NlcGFyYXRvcl09XCJuelNlcGFyYXRvclwiXG4gICAgICBbZGlzYWJsZWRdPVwibnpEaXNhYmxlZFwiXG4gICAgICBbaW5wdXRSZWFkT25seV09XCJueklucHV0UmVhZE9ubHlcIlxuICAgICAgW2Zvcm1hdF09XCJuekZvcm1hdFwiXG4gICAgICBbYWxsb3dDbGVhcl09XCJuekFsbG93Q2xlYXJcIlxuICAgICAgW2F1dG9Gb2N1c109XCJuekF1dG9Gb2N1c1wiXG4gICAgICBbcGxhY2Vob2xkZXJdPVwibnpQbGFjZUhvbGRlclwiXG4gICAgICBzdHlsZT1cImRpc3BsYXk6IGluaGVyaXQ7IGFsaWduLWl0ZW1zOiBjZW50ZXI7IHdpZHRoOiAxMDAlO1wiXG4gICAgICBbZHJvcGRvd25DbGFzc05hbWVdPVwibnpEcm9wZG93bkNsYXNzTmFtZVwiXG4gICAgICBbY2xhc3MuYW50LXBpY2tlci1kcm9wZG93bi1ydGxdPVwiZGlyID09PSAncnRsJ1wiXG4gICAgICBbcG9wdXBTdHlsZV09XCJuelBvcHVwU3R5bGVcIlxuICAgICAgW25vQW5pbWF0aW9uXT1cIiEhbm9BbmltYXRpb24/Lm56Tm9BbmltYXRpb25cIlxuICAgICAgW3N1ZmZpeEljb25dPVwibnpTdWZmaXhJY29uXCJcbiAgICAgIChvcGVuQ2hhbmdlKT1cIm9uT3BlbkNoYW5nZSgkZXZlbnQpXCJcbiAgICAgIChmb2N1c0NoYW5nZSk9XCJvbkZvY3VzQ2hhbmdlKCRldmVudClcIlxuICAgID5cbiAgICAgIDxkYXRlLXJhbmdlLXBvcHVwXG4gICAgICAgIFtpc1JhbmdlXT1cImlzUmFuZ2VcIlxuICAgICAgICBbZGVmYXVsdFBpY2tlclZhbHVlXT1cIm56RGVmYXVsdFBpY2tlclZhbHVlXCJcbiAgICAgICAgW3Nob3dXZWVrXT1cIm56TW9kZSA9PT0gJ3dlZWsnXCJcbiAgICAgICAgW3BhbmVsTW9kZV09XCJwYW5lbE1vZGVcIlxuICAgICAgICAocGFuZWxNb2RlQ2hhbmdlKT1cIm9uUGFuZWxNb2RlQ2hhbmdlKCRldmVudClcIlxuICAgICAgICAoY2FsZW5kYXJDaGFuZ2UpPVwib25DYWxlbmRhckNoYW5nZSgkZXZlbnQpXCJcbiAgICAgICAgW2xvY2FsZV09XCJuekxvY2FsZT8ubGFuZyFcIlxuICAgICAgICBbc2hvd1RvZGF5XT1cIm56TW9kZSA9PT0gJ2RhdGUnICYmIG56U2hvd1RvZGF5ICYmICFpc1JhbmdlICYmICFuelNob3dUaW1lXCJcbiAgICAgICAgW3Nob3dOb3ddPVwibnpNb2RlID09PSAnZGF0ZScgJiYgbnpTaG93Tm93ICYmICFpc1JhbmdlICYmICEhbnpTaG93VGltZVwiXG4gICAgICAgIFtzaG93VGltZV09XCJuelNob3dUaW1lXCJcbiAgICAgICAgW2RhdGVSZW5kZXJdPVwibnpEYXRlUmVuZGVyXCJcbiAgICAgICAgW2Rpc2FibGVkRGF0ZV09XCJuekRpc2FibGVkRGF0ZVwiXG4gICAgICAgIFtkaXNhYmxlZFRpbWVdPVwibnpEaXNhYmxlZFRpbWVcIlxuICAgICAgICBbZXh0cmFGb290ZXJdPVwiZXh0cmFGb290ZXJcIlxuICAgICAgICBbcmFuZ2VzXT1cIm56UmFuZ2VzXCJcbiAgICAgICAgW2Rpcl09XCJkaXJcIlxuICAgICAgICAocmVzdWx0T2spPVwib25SZXN1bHRPaygpXCJcbiAgICAgID48L2RhdGUtcmFuZ2UtcG9wdXA+XG4gICAgPC9kaXY+XG4gIGAsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLmFudC1waWNrZXItcmFuZ2VdJzogYGlzUmFuZ2VgLFxuICAgICdbY2xhc3MuYW50LXBpY2tlci1sYXJnZV0nOiBgbnpTaXplID09PSAnbGFyZ2UnYCxcbiAgICAnW2NsYXNzLmFudC1waWNrZXItc21hbGxdJzogYG56U2l6ZSA9PT0gJ3NtYWxsJ2AsXG4gICAgJ1tjbGFzcy5hbnQtcGlja2VyLWRpc2FibGVkXSc6IGBuekRpc2FibGVkYCxcbiAgICAnW2NsYXNzLmFudC1waWNrZXItcnRsXSc6IGBkaXIgPT09ICdydGwnYCxcbiAgICAnW2NsYXNzLmFudC1waWNrZXItYm9yZGVybGVzc10nOiBgbnpCb3JkZXJsZXNzYCxcbiAgICAnKGNsaWNrKSc6ICdwaWNrZXIub25DbGlja0lucHV0Qm94KCRldmVudCknXG4gIH0sXG4gIHByb3ZpZGVyczogW1xuICAgIERhdGVQaWNrZXJTZXJ2aWNlLFxuICAgIHtcbiAgICAgIHByb3ZpZGU6IE5HX1ZBTFVFX0FDQ0VTU09SLFxuICAgICAgbXVsdGk6IHRydWUsXG4gICAgICB1c2VFeGlzdGluZzogZm9yd2FyZFJlZigoKSA9PiBOekRhdGVQaWNrZXJDb21wb25lbnQpXG4gICAgfVxuICBdXG59KVxuZXhwb3J0IGNsYXNzIE56RGF0ZVBpY2tlckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIENvbnRyb2xWYWx1ZUFjY2Vzc29yIHtcbiAgcmVhZG9ubHkgX256TW9kdWxlTmFtZTogTnpDb25maWdLZXkgPSBOWl9DT05GSUdfTU9EVUxFX05BTUU7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9uekFsbG93Q2xlYXI6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX256QXV0b0ZvY3VzOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9uekRpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9uekJvcmRlcmxlc3M6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX256SW5wdXRSZWFkT25seTogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbnpPcGVuOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9uelNob3dUb2RheTogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbnpTaG93Tm93OiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9uek1vZGU6IE56RGF0ZU1vZGUgfCBOekRhdGVNb2RlW10gfCBzdHJpbmcgfCBzdHJpbmdbXSB8IG51bGwgfCB1bmRlZmluZWQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9uelNob3dUaW1lOiBCb29sZWFuSW5wdXQgfCBTdXBwb3J0VGltZU9wdGlvbnMgfCBudWxsIHwgdW5kZWZpbmVkO1xuXG4gIGlzUmFuZ2U6IGJvb2xlYW4gPSBmYWxzZTsgLy8gSW5kaWNhdGUgd2hldGhlciB0aGUgdmFsdWUgaXMgYSByYW5nZSB2YWx1ZVxuICBmb2N1c2VkOiBib29sZWFuID0gZmFsc2U7XG4gIGV4dHJhRm9vdGVyPzogVGVtcGxhdGVSZWY8TnpTYWZlQW55PiB8IHN0cmluZztcbiAgZGlyOiBEaXJlY3Rpb24gPSAnbHRyJztcblxuICBwdWJsaWMgcGFuZWxNb2RlOiBOekRhdGVNb2RlIHwgTnpEYXRlTW9kZVtdID0gJ2RhdGUnO1xuICBwcml2YXRlIGRlc3Ryb3llZCQ6IFN1YmplY3Q8dm9pZD4gPSBuZXcgU3ViamVjdCgpO1xuICBwcml2YXRlIGlzQ3VzdG9tUGxhY2VIb2xkZXI6IGJvb2xlYW4gPSBmYWxzZTtcbiAgcHJpdmF0ZSBpc0N1c3RvbUZvcm1hdDogYm9vbGVhbiA9IGZhbHNlO1xuICBwcml2YXRlIHNob3dUaW1lOiBTdXBwb3J0VGltZU9wdGlvbnMgfCBib29sZWFuID0gZmFsc2U7XG5cbiAgLy8gLS0tIENvbW1vbiBBUElcbiAgQElucHV0KCkgQElucHV0Qm9vbGVhbigpIG56QWxsb3dDbGVhcjogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dCgpIEBJbnB1dEJvb2xlYW4oKSBuekF1dG9Gb2N1czogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKSBASW5wdXRCb29sZWFuKCkgbnpEaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKSBASW5wdXRCb29sZWFuKCkgbnpCb3JkZXJsZXNzOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpIEBJbnB1dEJvb2xlYW4oKSBueklucHV0UmVhZE9ubHk6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KCkgQElucHV0Qm9vbGVhbigpIG56T3Blbj86IGJvb2xlYW47XG4gIEBJbnB1dCgpIG56RGlzYWJsZWREYXRlPzogKGQ6IERhdGUpID0+IGJvb2xlYW47XG4gIEBJbnB1dCgpIG56TG9jYWxlITogTnpEYXRlUGlja2VySTE4bkludGVyZmFjZTtcbiAgQElucHV0KCkgbnpQbGFjZUhvbGRlcjogc3RyaW5nIHwgc3RyaW5nW10gPSAnJztcbiAgQElucHV0KCkgbnpQb3B1cFN0eWxlOiBvYmplY3QgPSBQT1BVUF9TVFlMRV9QQVRDSDtcbiAgQElucHV0KCkgbnpEcm9wZG93bkNsYXNzTmFtZT86IHN0cmluZztcbiAgQElucHV0KCkgbnpTaXplOiBOekRhdGVQaWNrZXJTaXplVHlwZSA9ICdkZWZhdWx0JztcbiAgQElucHV0KCkgbnpGb3JtYXQhOiBzdHJpbmc7XG4gIEBJbnB1dCgpIG56RGF0ZVJlbmRlcj86IFRlbXBsYXRlUmVmPE56U2FmZUFueT4gfCBzdHJpbmcgfCBGdW5jdGlvblByb3A8VGVtcGxhdGVSZWY8RGF0ZT4gfCBzdHJpbmc+O1xuICBASW5wdXQoKSBuekRpc2FibGVkVGltZT86IERpc2FibGVkVGltZUZuO1xuICBASW5wdXQoKSBuelJlbmRlckV4dHJhRm9vdGVyPzogVGVtcGxhdGVSZWY8TnpTYWZlQW55PiB8IHN0cmluZyB8IEZ1bmN0aW9uUHJvcDxUZW1wbGF0ZVJlZjxOelNhZmVBbnk+IHwgc3RyaW5nPjtcbiAgQElucHV0KCkgQElucHV0Qm9vbGVhbigpIG56U2hvd1RvZGF5OiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0KCkgbnpNb2RlOiBOekRhdGVNb2RlID0gJ2RhdGUnO1xuICBASW5wdXQoKSBASW5wdXRCb29sZWFuKCkgbnpTaG93Tm93OiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0KCkgbnpSYW5nZXM/OiBQcmVzZXRSYW5nZXM7XG4gIEBJbnB1dCgpIG56RGVmYXVsdFBpY2tlclZhbHVlOiBDb21wYXRpYmxlRGF0ZSB8IG51bGwgPSBudWxsO1xuICBASW5wdXQoKSBAV2l0aENvbmZpZygpIG56U2VwYXJhdG9yPzogc3RyaW5nID0gdW5kZWZpbmVkO1xuICBASW5wdXQoKSBAV2l0aENvbmZpZygpIG56U3VmZml4SWNvbjogc3RyaW5nIHwgVGVtcGxhdGVSZWY8TnpTYWZlQW55PiA9ICdjYWxlbmRhcic7XG5cbiAgLy8gVE9ETyhAd2VucWk3MykgVGhlIFBhbmVsTW9kZSBuZWVkIG5hbWVkIGZvciBlYWNoIHBpY2tlcnMgYW5kIGV4cG9ydFxuICBAT3V0cHV0KCkgcmVhZG9ubHkgbnpPblBhbmVsQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxOekRhdGVNb2RlIHwgTnpEYXRlTW9kZVtdIHwgc3RyaW5nIHwgc3RyaW5nW10+KCk7XG4gIEBPdXRwdXQoKSByZWFkb25seSBuek9uQ2FsZW5kYXJDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPEFycmF5PERhdGUgfCBudWxsPj4oKTtcbiAgQE91dHB1dCgpIHJlYWRvbmx5IG56T25PayA9IG5ldyBFdmVudEVtaXR0ZXI8Q29tcGF0aWJsZURhdGUgfCBudWxsPigpO1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgbnpPbk9wZW5DaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XG5cbiAgQFZpZXdDaGlsZChOelBpY2tlckNvbXBvbmVudCwgeyBzdGF0aWM6IHRydWUgfSkgcGlja2VyITogTnpQaWNrZXJDb21wb25lbnQ7XG5cbiAgQElucHV0KCkgZ2V0IG56U2hvd1RpbWUoKTogU3VwcG9ydFRpbWVPcHRpb25zIHwgYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc2hvd1RpbWU7XG4gIH1cblxuICBzZXQgbnpTaG93VGltZSh2YWx1ZTogU3VwcG9ydFRpbWVPcHRpb25zIHwgYm9vbGVhbikge1xuICAgIHRoaXMuc2hvd1RpbWUgPSB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnID8gdmFsdWUgOiB0b0Jvb2xlYW4odmFsdWUpO1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIG56Q29uZmlnU2VydmljZTogTnpDb25maWdTZXJ2aWNlLFxuICAgIHB1YmxpYyBkYXRlUGlja2VyU2VydmljZTogRGF0ZVBpY2tlclNlcnZpY2UsXG4gICAgcHJvdGVjdGVkIGkxOG46IE56STE4blNlcnZpY2UsXG4gICAgcHJvdGVjdGVkIGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBwcm90ZWN0ZWQgZGF0ZUhlbHBlcjogRGF0ZUhlbHBlclNlcnZpY2UsXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBkaXJlY3Rpb25hbGl0eTogRGlyZWN0aW9uYWxpdHksXG4gICAgQEhvc3QoKSBAT3B0aW9uYWwoKSBwdWJsaWMgbm9BbmltYXRpb24/OiBOek5vQW5pbWF0aW9uRGlyZWN0aXZlXG4gICkge1xuICAgIC8vIFRPRE86IG1vdmUgdG8gaG9zdCBhZnRlciBWaWV3IEVuZ2luZSBkZXByZWNhdGlvblxuICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2FudC1waWNrZXInKTtcbiAgfVxuXG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIC8vIFN1YnNjcmliZSB0aGUgZXZlcnkgbG9jYWxlIGNoYW5nZSBpZiB0aGUgbnpMb2NhbGUgaXMgbm90IGhhbmRsZWQgYnkgdXNlclxuICAgIGlmICghdGhpcy5uekxvY2FsZSkge1xuICAgICAgdGhpcy5pMThuLmxvY2FsZUNoYW5nZS5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3llZCQpKS5zdWJzY3JpYmUoKCkgPT4gdGhpcy5zZXRMb2NhbGUoKSk7XG4gICAgfVxuXG4gICAgLy8gRGVmYXVsdCB2YWx1ZVxuICAgIHRoaXMuZGF0ZVBpY2tlclNlcnZpY2UuaXNSYW5nZSA9IHRoaXMuaXNSYW5nZTtcbiAgICB0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLmluaXRWYWx1ZSgpO1xuICAgIHRoaXMuZGF0ZVBpY2tlclNlcnZpY2UuZW1pdFZhbHVlJC5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3llZCQpKS5zdWJzY3JpYmUoXyA9PiB7XG4gICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZGF0ZVBpY2tlclNlcnZpY2UudmFsdWU7XG4gICAgICB0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLmluaXRpYWxWYWx1ZSA9IGNsb25lRGF0ZSh2YWx1ZSk7XG4gICAgICBpZiAodGhpcy5pc1JhbmdlKSB7XG4gICAgICAgIGNvbnN0IHZBc1JhbmdlID0gdmFsdWUgYXMgQ2FuZHlEYXRlW107XG4gICAgICAgIGlmICh2QXNSYW5nZS5sZW5ndGgpIHtcbiAgICAgICAgICB0aGlzLm9uQ2hhbmdlRm4oW3ZBc1JhbmdlWzBdPy5uYXRpdmVEYXRlID8/IG51bGwsIHZBc1JhbmdlWzFdPy5uYXRpdmVEYXRlID8/IG51bGxdKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLm9uQ2hhbmdlRm4oW10pO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgICB0aGlzLm9uQ2hhbmdlRm4oKHZhbHVlIGFzIENhbmR5RGF0ZSkubmF0aXZlRGF0ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5vbkNoYW5nZUZuKG51bGwpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzLm9uVG91Y2hlZEZuKCk7XG4gICAgICAvLyBXaGVuIHZhbHVlIGVtaXR0ZWQsIG92ZXJsYXkgd2lsbCBiZSBjbG9zZWRcbiAgICAgIHRoaXMuY2xvc2UoKTtcbiAgICB9KTtcblxuICAgIHRoaXMuc2V0TW9kZUFuZEZvcm1hdCgpO1xuXG4gICAgdGhpcy5kaXJlY3Rpb25hbGl0eS5jaGFuZ2U/LnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveWVkJCkpLnN1YnNjcmliZSgoZGlyZWN0aW9uOiBEaXJlY3Rpb24pID0+IHtcbiAgICAgIHRoaXMuZGlyID0gZGlyZWN0aW9uO1xuICAgICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH0pO1xuICAgIHRoaXMuZGlyID0gdGhpcy5kaXJlY3Rpb25hbGl0eS52YWx1ZTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBpZiAoY2hhbmdlcy5uelBvcHVwU3R5bGUpIHtcbiAgICAgIC8vIEFsd2F5cyBhc3NpZ24gdGhlIHBvcHVwIHN0eWxlIHBhdGNoXG4gICAgICB0aGlzLm56UG9wdXBTdHlsZSA9IHRoaXMubnpQb3B1cFN0eWxlID8geyAuLi50aGlzLm56UG9wdXBTdHlsZSwgLi4uUE9QVVBfU1RZTEVfUEFUQ0ggfSA6IFBPUFVQX1NUWUxFX1BBVENIO1xuICAgIH1cblxuICAgIC8vIE1hcmsgYXMgY3VzdG9taXplZCBwbGFjZWhvbGRlciBieSB1c2VyIG9uY2UgbnpQbGFjZUhvbGRlciBhc3NpZ25lZCBhdCB0aGUgZmlyc3QgdGltZVxuICAgIGlmIChjaGFuZ2VzLm56UGxhY2VIb2xkZXI/LmN1cnJlbnRWYWx1ZSkge1xuICAgICAgdGhpcy5pc0N1c3RvbVBsYWNlSG9sZGVyID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoY2hhbmdlcy5uekZvcm1hdD8uY3VycmVudFZhbHVlKSB7XG4gICAgICB0aGlzLmlzQ3VzdG9tRm9ybWF0ID0gdHJ1ZTtcbiAgICB9XG5cbiAgICBpZiAoY2hhbmdlcy5uekxvY2FsZSkge1xuICAgICAgLy8gVGhlIG56TG9jYWxlIGlzIGN1cnJlbnRseSBoYW5kbGVkIGJ5IHVzZXJcbiAgICAgIHRoaXMuc2V0RGVmYXVsdFBsYWNlSG9sZGVyKCk7XG4gICAgfVxuXG4gICAgaWYgKGNoYW5nZXMubnpSZW5kZXJFeHRyYUZvb3Rlcikge1xuICAgICAgdGhpcy5leHRyYUZvb3RlciA9IHZhbHVlRnVuY3Rpb25Qcm9wKHRoaXMubnpSZW5kZXJFeHRyYUZvb3RlciEpO1xuICAgIH1cblxuICAgIGlmIChjaGFuZ2VzLm56TW9kZSkge1xuICAgICAgdGhpcy5zZXREZWZhdWx0UGxhY2VIb2xkZXIoKTtcbiAgICAgIHRoaXMuc2V0TW9kZUFuZEZvcm1hdCgpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuZGVzdHJveWVkJC5uZXh0KCk7XG4gICAgdGhpcy5kZXN0cm95ZWQkLmNvbXBsZXRlKCk7XG4gIH1cblxuICBzZXRNb2RlQW5kRm9ybWF0KCk6IHZvaWQge1xuICAgIGNvbnN0IGlucHV0Rm9ybWF0czogeyBba2V5IGluIE56RGF0ZU1vZGVdPzogc3RyaW5nIH0gPSB7XG4gICAgICB5ZWFyOiAneXl5eScsXG4gICAgICBtb250aDogJ3l5eXktTU0nLFxuICAgICAgd2VlazogdGhpcy5pMThuLmdldERhdGVMb2NhbGUoKSA/ICdSUlJSLUlJJyA6ICd5eXl5LXd3JywgLy8gRm9ybWF0IGZvciB3ZWVrXG4gICAgICBkYXRlOiB0aGlzLm56U2hvd1RpbWUgPyAneXl5eS1NTS1kZCBISDptbTpzcycgOiAneXl5eS1NTS1kZCdcbiAgICB9O1xuXG4gICAgaWYgKCF0aGlzLm56TW9kZSkge1xuICAgICAgdGhpcy5uek1vZGUgPSAnZGF0ZSc7XG4gICAgfVxuXG4gICAgdGhpcy5wYW5lbE1vZGUgPSB0aGlzLmlzUmFuZ2UgPyBbdGhpcy5uek1vZGUsIHRoaXMubnpNb2RlXSA6IHRoaXMubnpNb2RlO1xuXG4gICAgLy8gRGVmYXVsdCBmb3JtYXQgd2hlbiBpdCdzIGVtcHR5XG4gICAgaWYgKCF0aGlzLmlzQ3VzdG9tRm9ybWF0KSB7XG4gICAgICB0aGlzLm56Rm9ybWF0ID0gaW5wdXRGb3JtYXRzW3RoaXMubnpNb2RlIGFzIE56RGF0ZU1vZGVdITtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVHJpZ2dlcmVkIHdoZW4gb3ZlcmxheU9wZW4gY2hhbmdlcyAoZGlmZmVyZW50IHdpdGggcmVhbE9wZW5TdGF0ZSlcbiAgICogQHBhcmFtIG9wZW4gVGhlIG92ZXJsYXlPcGVuIGluIHBpY2tlciBjb21wb25lbnRcbiAgICovXG4gIG9uT3BlbkNoYW5nZShvcGVuOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5uek9uT3BlbkNoYW5nZS5lbWl0KG9wZW4pO1xuICB9XG5cbiAgcHVibGljIG9wZW4oKTogdm9pZCB7XG4gICAgdGhpcy5waWNrZXIuc2hvd092ZXJsYXkoKTtcbiAgfVxuXG4gIHB1YmxpYyBjbG9zZSgpOiB2b2lkIHtcbiAgICB0aGlzLnBpY2tlci5oaWRlT3ZlcmxheSgpO1xuICB9XG5cbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIC8vIHwgQ29udHJvbCB2YWx1ZSBhY2Nlc3NvciBpbXBsZW1lbnRzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIE5PVEU6IG9uQ2hhbmdlRm4vb25Ub3VjaGVkRm4gd2lsbCBub3QgYmUgYXNzaWduZWQgaWYgdXNlciBub3QgdXNlIGFzIG5nTW9kZWxcbiAgb25DaGFuZ2VGbjogT25DaGFuZ2VUeXBlID0gKCkgPT4gdm9pZCAwO1xuICBvblRvdWNoZWRGbjogT25Ub3VjaGVkVHlwZSA9ICgpID0+IHZvaWQgMDtcblxuICB3cml0ZVZhbHVlKHZhbHVlOiBDb21wYXRpYmxlRGF0ZSk6IHZvaWQge1xuICAgIHRoaXMuc2V0VmFsdWUodmFsdWUpO1xuICAgIHRoaXMuY2RyLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogT25DaGFuZ2VUeXBlKTogdm9pZCB7XG4gICAgdGhpcy5vbkNoYW5nZUZuID0gZm47XG4gIH1cblxuICByZWdpc3Rlck9uVG91Y2hlZChmbjogT25Ub3VjaGVkVHlwZSk6IHZvaWQge1xuICAgIHRoaXMub25Ub3VjaGVkRm4gPSBmbjtcbiAgfVxuXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMubnpEaXNhYmxlZCA9IGlzRGlzYWJsZWQ7XG4gICAgdGhpcy5jZHIubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy8gfCBJbnRlcm5hbCBtZXRob2RzXG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuXG4gIC8vIFJlbG9hZCBsb2NhbGUgZnJvbSBpMThuIHdpdGggc2lkZSBlZmZlY3RzXG4gIHByaXZhdGUgc2V0TG9jYWxlKCk6IHZvaWQge1xuICAgIHRoaXMubnpMb2NhbGUgPSB0aGlzLmkxOG4uZ2V0TG9jYWxlRGF0YSgnRGF0ZVBpY2tlcicsIHt9KTtcbiAgICB0aGlzLnNldERlZmF1bHRQbGFjZUhvbGRlcigpO1xuICAgIHRoaXMuY2RyLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXREZWZhdWx0UGxhY2VIb2xkZXIoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmlzQ3VzdG9tUGxhY2VIb2xkZXIgJiYgdGhpcy5uekxvY2FsZSkge1xuICAgICAgY29uc3QgZGVmYXVsdFBsYWNlaG9sZGVyOiB7IFtrZXkgaW4gTnpEYXRlTW9kZV0/OiBzdHJpbmcgfSA9IHtcbiAgICAgICAgeWVhcjogdGhpcy5nZXRQcm9wZXJ0eU9mTG9jYWxlKCd5ZWFyUGxhY2Vob2xkZXInKSxcbiAgICAgICAgbW9udGg6IHRoaXMuZ2V0UHJvcGVydHlPZkxvY2FsZSgnbW9udGhQbGFjZWhvbGRlcicpLFxuICAgICAgICB3ZWVrOiB0aGlzLmdldFByb3BlcnR5T2ZMb2NhbGUoJ3dlZWtQbGFjZWhvbGRlcicpLFxuICAgICAgICBkYXRlOiB0aGlzLmdldFByb3BlcnR5T2ZMb2NhbGUoJ3BsYWNlaG9sZGVyJylcbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IGRlZmF1bHRSYW5nZVBsYWNlaG9sZGVyOiB7IFtrZXkgaW4gTnpEYXRlTW9kZV0/OiBzdHJpbmdbXSB9ID0ge1xuICAgICAgICB5ZWFyOiB0aGlzLmdldFByb3BlcnR5T2ZMb2NhbGUoJ3JhbmdlWWVhclBsYWNlaG9sZGVyJyksXG4gICAgICAgIG1vbnRoOiB0aGlzLmdldFByb3BlcnR5T2ZMb2NhbGUoJ3JhbmdlTW9udGhQbGFjZWhvbGRlcicpLFxuICAgICAgICB3ZWVrOiB0aGlzLmdldFByb3BlcnR5T2ZMb2NhbGUoJ3JhbmdlV2Vla1BsYWNlaG9sZGVyJyksXG4gICAgICAgIGRhdGU6IHRoaXMuZ2V0UHJvcGVydHlPZkxvY2FsZSgncmFuZ2VQbGFjZWhvbGRlcicpXG4gICAgICB9O1xuXG4gICAgICB0aGlzLm56UGxhY2VIb2xkZXIgPSB0aGlzLmlzUmFuZ2VcbiAgICAgICAgPyBkZWZhdWx0UmFuZ2VQbGFjZWhvbGRlclt0aGlzLm56TW9kZSBhcyBOekRhdGVNb2RlXSFcbiAgICAgICAgOiBkZWZhdWx0UGxhY2Vob2xkZXJbdGhpcy5uek1vZGUgYXMgTnpEYXRlTW9kZV0hO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZ2V0UHJvcGVydHlPZkxvY2FsZTxUIGV4dGVuZHMga2V5b2YgTnpEYXRlUGlja2VyTGFuZ0kxOG5JbnRlcmZhY2U+KHR5cGU6IFQpOiBOekRhdGVQaWNrZXJMYW5nSTE4bkludGVyZmFjZVtUXSB7XG4gICAgcmV0dXJuIHRoaXMubnpMb2NhbGUubGFuZ1t0eXBlXSB8fCB0aGlzLmkxOG4uZ2V0TG9jYWxlRGF0YShgRGF0ZVBpY2tlci5sYW5nLiR7dHlwZX1gKTtcbiAgfVxuXG4gIC8vIFNhZmUgd2F5IG9mIHNldHRpbmcgdmFsdWUgd2l0aCBkZWZhdWx0XG4gIHByaXZhdGUgc2V0VmFsdWUodmFsdWU6IENvbXBhdGlibGVEYXRlKTogdm9pZCB7XG4gICAgY29uc3QgbmV3VmFsdWU6IENvbXBhdGlibGVWYWx1ZSA9IHRoaXMuZGF0ZVBpY2tlclNlcnZpY2UubWFrZVZhbHVlKHZhbHVlKTtcbiAgICB0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLnNldFZhbHVlKG5ld1ZhbHVlKTtcbiAgICB0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLmluaXRpYWxWYWx1ZSA9IG5ld1ZhbHVlO1xuICB9XG5cbiAgb25Gb2N1c0NoYW5nZSh2YWx1ZTogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuZm9jdXNlZCA9IHZhbHVlO1xuICAgIC8vIFRPRE86IGF2b2lkIGF1dG9Gb2N1cyBjYXVzZSBjaGFuZ2UgYWZ0ZXIgY2hlY2tlZCBlcnJvclxuICAgIGlmICh0aGlzLmZvY3VzZWQpIHtcbiAgICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3ModGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICdhbnQtcGlja2VyLWZvY3VzZWQnKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ2FudC1waWNrZXItZm9jdXNlZCcpO1xuICAgIH1cbiAgfVxuXG4gIG9uUGFuZWxNb2RlQ2hhbmdlKHBhbmVsTW9kZTogTnpEYXRlTW9kZSB8IE56RGF0ZU1vZGVbXSk6IHZvaWQge1xuICAgIHRoaXMubnpPblBhbmVsQ2hhbmdlLmVtaXQocGFuZWxNb2RlKTtcbiAgfVxuXG4gIC8vIEVtaXQgbnpPbkNhbGVuZGFyQ2hhbmdlIHdoZW4gc2VsZWN0IGRhdGUgYnkgbnotcmFuZ2UtcGlja2VyXG4gIG9uQ2FsZW5kYXJDaGFuZ2UodmFsdWU6IENvbXBhdGlibGVWYWx1ZSk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlzUmFuZ2UgJiYgQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgIGNvbnN0IHJhbmdlVmFsdWUgPSB2YWx1ZS5maWx0ZXIoeCA9PiB4IGluc3RhbmNlb2YgQ2FuZHlEYXRlKS5tYXAoeCA9PiB4IS5uYXRpdmVEYXRlKTtcbiAgICAgIHRoaXMubnpPbkNhbGVuZGFyQ2hhbmdlLmVtaXQocmFuZ2VWYWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgb25SZXN1bHRPaygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pc1JhbmdlKSB7XG4gICAgICBjb25zdCB2YWx1ZSA9IHRoaXMuZGF0ZVBpY2tlclNlcnZpY2UudmFsdWUgYXMgQ2FuZHlEYXRlW107XG4gICAgICBpZiAodmFsdWUubGVuZ3RoKSB7XG4gICAgICAgIHRoaXMubnpPbk9rLmVtaXQoW3ZhbHVlWzBdPy5uYXRpdmVEYXRlIHx8IG51bGwsIHZhbHVlWzFdPy5uYXRpdmVEYXRlIHx8IG51bGxdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubnpPbk9rLmVtaXQoW10pO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodGhpcy5kYXRlUGlja2VyU2VydmljZS52YWx1ZSkge1xuICAgICAgICB0aGlzLm56T25Pay5lbWl0KCh0aGlzLmRhdGVQaWNrZXJTZXJ2aWNlLnZhbHVlIGFzIENhbmR5RGF0ZSkubmF0aXZlRGF0ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm56T25Pay5lbWl0KG51bGwpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19