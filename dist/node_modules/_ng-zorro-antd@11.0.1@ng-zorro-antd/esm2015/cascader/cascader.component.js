/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { __decorate, __metadata } from "tslib";
import { Directionality } from '@angular/cdk/bidi';
import { BACKSPACE, DOWN_ARROW, ENTER, ESCAPE, LEFT_ARROW, RIGHT_ARROW, UP_ARROW } from '@angular/cdk/keycodes';
import { CdkConnectedOverlay } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, Host, HostListener, Input, Optional, Output, QueryList, Renderer2, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { slideMotion } from 'ng-zorro-antd/core/animation';
import { NzConfigService, WithConfig } from 'ng-zorro-antd/core/config';
import { NzNoAnimationDirective } from 'ng-zorro-antd/core/no-animation';
import { DEFAULT_CASCADER_POSITIONS } from 'ng-zorro-antd/core/overlay';
import { InputBoolean, toArray } from 'ng-zorro-antd/core/util';
import { NzI18nService } from 'ng-zorro-antd/i18n';
import { Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';
import { NzCascaderOptionComponent } from './cascader-li.component';
import { NzCascaderService } from './cascader.service';
const NZ_CONFIG_MODULE_NAME = 'cascader';
const defaultDisplayRender = (labels) => labels.join(' / ');
const ɵ0 = defaultDisplayRender;
export class NzCascaderComponent {
    constructor(cascaderService, nzConfigService, cdr, i18nService, elementRef, renderer, directionality, noAnimation) {
        this.cascaderService = cascaderService;
        this.nzConfigService = nzConfigService;
        this.cdr = cdr;
        this.i18nService = i18nService;
        this.directionality = directionality;
        this.noAnimation = noAnimation;
        this._nzModuleName = NZ_CONFIG_MODULE_NAME;
        this.nzOptionRender = null;
        this.nzShowInput = true;
        this.nzShowArrow = true;
        this.nzAllowClear = true;
        this.nzAutoFocus = false;
        this.nzChangeOnSelect = false;
        this.nzDisabled = false;
        this.nzExpandTrigger = 'click';
        this.nzValueProperty = 'value';
        this.nzLabelRender = null;
        this.nzLabelProperty = 'label';
        this.nzSize = 'default';
        this.nzShowSearch = false;
        this.nzPlaceHolder = '';
        this.nzMenuStyle = null;
        this.nzMouseEnterDelay = 150; // ms
        this.nzMouseLeaveDelay = 150; // ms
        this.nzTriggerAction = ['click'];
        // TODO: RTL
        this.nzSuffixIcon = 'down';
        this.nzExpandIcon = '';
        this.nzVisibleChange = new EventEmitter();
        this.nzSelectionChange = new EventEmitter();
        this.nzSelect = new EventEmitter();
        this.nzClear = new EventEmitter();
        /**
         * If the dropdown should show the empty content.
         * `true` if there's no options.
         */
        this.shouldShowEmpty = false;
        this.menuVisible = false;
        this.isLoading = false;
        this.labelRenderContext = {};
        this.onChange = Function.prototype;
        this.onTouched = Function.prototype;
        this.positions = [...DEFAULT_CASCADER_POSITIONS];
        this.dropdownHeightStyle = '';
        this.isFocused = false;
        this.dir = 'ltr';
        this.destroy$ = new Subject();
        this.inputString = '';
        this.isOpening = false;
        this.delayMenuTimer = null;
        this.delaySelectTimer = null;
        this.el = elementRef.nativeElement;
        this.cascaderService.withComponent(this);
        renderer.addClass(elementRef.nativeElement, 'ant-cascader');
        renderer.addClass(elementRef.nativeElement, 'ant-cascader-picker');
    }
    get nzOptions() {
        return this.cascaderService.nzOptions;
    }
    set nzOptions(options) {
        this.cascaderService.withOptions(options);
    }
    get inSearchingMode() {
        return this.cascaderService.inSearchingMode;
    }
    set inputValue(inputValue) {
        this.inputString = inputValue;
        this.toggleSearchingMode(!!inputValue);
    }
    get inputValue() {
        return this.inputString;
    }
    get menuCls() {
        return { [`${this.nzMenuClassName}`]: !!this.nzMenuClassName };
    }
    get menuColumnCls() {
        return { [`${this.nzColumnClassName}`]: !!this.nzColumnClassName };
    }
    get hasInput() {
        return !!this.inputValue;
    }
    get hasValue() {
        return this.cascaderService.values && this.cascaderService.values.length > 0;
    }
    get showPlaceholder() {
        return !(this.hasInput || this.hasValue);
    }
    get clearIconVisible() {
        return this.nzAllowClear && !this.nzDisabled && (this.hasValue || this.hasInput);
    }
    get isLabelRenderTemplate() {
        return !!this.nzLabelRender;
    }
    ngOnInit() {
        var _a;
        const srv = this.cascaderService;
        srv.$redraw.pipe(takeUntil(this.destroy$)).subscribe(() => {
            // These operations would not mutate data.
            this.checkChildren();
            this.setDisplayLabel();
            this.reposition();
            this.setDropdownStyles();
            this.cdr.markForCheck();
        });
        srv.$loading.pipe(takeUntil(this.destroy$)).subscribe(loading => {
            this.isLoading = loading;
        });
        srv.$optionSelected.pipe(takeUntil(this.destroy$)).subscribe(data => {
            if (!data) {
                this.onChange([]);
                this.nzSelect.emit(null);
                this.nzSelectionChange.emit([]);
            }
            else {
                const { option, index } = data;
                const shouldClose = option.isLeaf || (this.nzChangeOnSelect && this.nzExpandTrigger === 'hover');
                if (shouldClose) {
                    this.delaySetMenuVisible(false);
                }
                this.onChange(this.cascaderService.values);
                this.nzSelectionChange.emit(this.cascaderService.selectedOptions);
                this.nzSelect.emit({ option, index });
                this.cdr.markForCheck();
            }
        });
        srv.$quitSearching.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.inputString = '';
            this.dropdownWidthStyle = '';
        });
        this.i18nService.localeChange.pipe(startWith(), takeUntil(this.destroy$)).subscribe(() => {
            this.setLocale();
        });
        this.nzConfigService
            .getConfigChangeEventForComponent(NZ_CONFIG_MODULE_NAME)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
            this.cdr.markForCheck();
        });
        this.dir = this.directionality.value;
        (_a = this.directionality.change) === null || _a === void 0 ? void 0 : _a.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.dir = this.directionality.value;
            srv.$redraw.next();
        });
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
        this.clearDelayMenuTimer();
        this.clearDelaySelectTimer();
    }
    registerOnChange(fn) {
        this.onChange = fn;
    }
    registerOnTouched(fn) {
        this.onTouched = fn;
    }
    writeValue(value) {
        this.cascaderService.values = toArray(value);
        this.cascaderService.syncOptions(true);
    }
    delaySetMenuVisible(visible, delay = 100, setOpening = false) {
        this.clearDelayMenuTimer();
        if (delay) {
            if (visible && setOpening) {
                this.isOpening = true;
            }
            this.delayMenuTimer = setTimeout(() => {
                this.setMenuVisible(visible);
                this.cdr.detectChanges();
                this.clearDelayMenuTimer();
                if (visible) {
                    setTimeout(() => {
                        this.isOpening = false;
                    }, 100);
                }
            }, delay);
        }
        else {
            this.setMenuVisible(visible);
        }
    }
    setMenuVisible(visible) {
        if (this.nzDisabled || this.menuVisible === visible) {
            return;
        }
        if (visible) {
            this.cascaderService.syncOptions();
            this.scrollToActivatedOptions();
        }
        if (!visible) {
            this.inputValue = '';
        }
        this.menuVisible = visible;
        this.nzVisibleChange.emit(visible);
        this.cdr.detectChanges();
    }
    clearDelayMenuTimer() {
        if (this.delayMenuTimer) {
            clearTimeout(this.delayMenuTimer);
            this.delayMenuTimer = null;
        }
    }
    clearSelection(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        this.labelRenderText = '';
        this.labelRenderContext = {};
        this.inputValue = '';
        this.setMenuVisible(false);
        this.cascaderService.clear();
    }
    getSubmitValue() {
        return this.cascaderService.selectedOptions.map(o => this.cascaderService.getOptionValue(o));
    }
    focus() {
        if (!this.isFocused) {
            (this.input ? this.input.nativeElement : this.el).focus();
            this.isFocused = true;
        }
    }
    blur() {
        if (this.isFocused) {
            (this.input ? this.input.nativeElement : this.el).blur();
            this.isFocused = false;
        }
    }
    handleInputBlur() {
        this.menuVisible ? this.focus() : this.blur();
    }
    handleInputFocus() {
        this.focus();
    }
    onKeyDown(event) {
        const keyCode = event.keyCode;
        if (keyCode !== DOWN_ARROW &&
            keyCode !== UP_ARROW &&
            keyCode !== LEFT_ARROW &&
            keyCode !== RIGHT_ARROW &&
            keyCode !== ENTER &&
            keyCode !== BACKSPACE &&
            keyCode !== ESCAPE) {
            return;
        }
        // Press any keys above to reopen menu.
        if (!this.menuVisible && keyCode !== BACKSPACE && keyCode !== ESCAPE) {
            return this.setMenuVisible(true);
        }
        // Make these keys work as default in searching mode.
        if (this.inSearchingMode && (keyCode === BACKSPACE || keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW)) {
            return;
        }
        // Interact with the component.
        if (this.menuVisible) {
            event.preventDefault();
            if (keyCode === DOWN_ARROW) {
                this.moveUpOrDown(false);
            }
            else if (keyCode === UP_ARROW) {
                this.moveUpOrDown(true);
            }
            else if (keyCode === LEFT_ARROW) {
                this.moveLeft();
            }
            else if (keyCode === RIGHT_ARROW) {
                this.moveRight();
            }
            else if (keyCode === ENTER) {
                this.onEnter();
            }
        }
    }
    onTriggerClick() {
        if (this.nzDisabled) {
            return;
        }
        if (this.nzShowSearch) {
            this.focus();
        }
        if (this.isActionTrigger('click')) {
            this.delaySetMenuVisible(!this.menuVisible, 100);
        }
        this.onTouched();
    }
    onTriggerMouseEnter() {
        if (this.nzDisabled || !this.isActionTrigger('hover')) {
            return;
        }
        this.delaySetMenuVisible(true, this.nzMouseEnterDelay, true);
    }
    onTriggerMouseLeave(event) {
        if (this.nzDisabled || !this.menuVisible || this.isOpening || !this.isActionTrigger('hover')) {
            event.preventDefault();
            return;
        }
        const mouseTarget = event.relatedTarget;
        const hostEl = this.el;
        const menuEl = this.menu && this.menu.nativeElement;
        if (hostEl.contains(mouseTarget) || (menuEl && menuEl.contains(mouseTarget))) {
            return;
        }
        this.delaySetMenuVisible(false, this.nzMouseLeaveDelay);
    }
    onOptionMouseEnter(option, columnIndex, event) {
        event.preventDefault();
        if (this.nzExpandTrigger === 'hover') {
            if (!option.isLeaf) {
                this.delaySetOptionActivated(option, columnIndex, false);
            }
            else {
                this.cascaderService.setOptionDeactivatedSinceColumn(columnIndex);
            }
        }
    }
    onOptionMouseLeave(option, _columnIndex, event) {
        event.preventDefault();
        if (this.nzExpandTrigger === 'hover' && !option.isLeaf) {
            this.clearDelaySelectTimer();
        }
    }
    onOptionClick(option, columnIndex, event) {
        if (event) {
            event.preventDefault();
        }
        if (option && option.disabled) {
            return;
        }
        this.el.focus();
        this.inSearchingMode
            ? this.cascaderService.setSearchOptionSelected(option)
            : this.cascaderService.setOptionActivated(option, columnIndex, true);
    }
    onClickOutside(event) {
        if (!this.el.contains(event.target)) {
            this.closeMenu();
        }
    }
    isActionTrigger(action) {
        return typeof this.nzTriggerAction === 'string' ? this.nzTriggerAction === action : this.nzTriggerAction.indexOf(action) !== -1;
    }
    onEnter() {
        const columnIndex = Math.max(this.cascaderService.activatedOptions.length - 1, 0);
        const option = this.cascaderService.activatedOptions[columnIndex];
        if (option && !option.disabled) {
            this.inSearchingMode
                ? this.cascaderService.setSearchOptionSelected(option)
                : this.cascaderService.setOptionActivated(option, columnIndex, true);
        }
    }
    moveUpOrDown(isUp) {
        const columnIndex = Math.max(this.cascaderService.activatedOptions.length - 1, 0);
        const activeOption = this.cascaderService.activatedOptions[columnIndex];
        const options = this.cascaderService.columns[columnIndex] || [];
        const length = options.length;
        let nextIndex = -1;
        if (!activeOption) {
            // Not selected options in this column
            nextIndex = isUp ? length : -1;
        }
        else {
            nextIndex = options.indexOf(activeOption);
        }
        while (true) {
            nextIndex = isUp ? nextIndex - 1 : nextIndex + 1;
            if (nextIndex < 0 || nextIndex >= length) {
                break;
            }
            const nextOption = options[nextIndex];
            if (!nextOption || nextOption.disabled) {
                continue;
            }
            this.cascaderService.setOptionActivated(nextOption, columnIndex);
            break;
        }
    }
    moveLeft() {
        const options = this.cascaderService.activatedOptions;
        if (options.length) {
            options.pop(); // Remove the last one
        }
    }
    moveRight() {
        const length = this.cascaderService.activatedOptions.length;
        const options = this.cascaderService.columns[length];
        if (options && options.length) {
            const nextOpt = options.find(o => !o.disabled);
            if (nextOpt) {
                this.cascaderService.setOptionActivated(nextOpt, length);
            }
        }
    }
    clearDelaySelectTimer() {
        if (this.delaySelectTimer) {
            clearTimeout(this.delaySelectTimer);
            this.delaySelectTimer = null;
        }
    }
    delaySetOptionActivated(option, columnIndex, performSelect) {
        this.clearDelaySelectTimer();
        this.delaySelectTimer = setTimeout(() => {
            this.cascaderService.setOptionActivated(option, columnIndex, performSelect);
            this.delaySelectTimer = null;
        }, 150);
    }
    toggleSearchingMode(toSearching) {
        if (this.inSearchingMode !== toSearching) {
            this.cascaderService.toggleSearchingMode(toSearching);
        }
        if (this.inSearchingMode) {
            this.cascaderService.prepareSearchOptions(this.inputValue);
        }
    }
    isOptionActivated(option, index) {
        const activeOpt = this.cascaderService.activatedOptions[index];
        return activeOpt === option;
    }
    setDisabledState(isDisabled) {
        if (isDisabled) {
            this.closeMenu();
        }
        this.nzDisabled = isDisabled;
    }
    closeMenu() {
        this.blur();
        this.clearDelayMenuTimer();
        this.setMenuVisible(false);
    }
    /**
     * Reposition the cascader panel. When a menu opens, the cascader expands
     * and may exceed the boundary of browser's window.
     */
    reposition() {
        if (this.overlay && this.overlay.overlayRef && this.menuVisible) {
            Promise.resolve().then(() => {
                this.overlay.overlayRef.updatePosition();
            });
        }
    }
    /**
     * When a cascader options is changed, a child needs to know that it should re-render.
     */
    checkChildren() {
        if (this.cascaderItems) {
            this.cascaderItems.forEach(item => item.markForCheck());
        }
    }
    setDisplayLabel() {
        const selectedOptions = this.cascaderService.selectedOptions;
        const labels = selectedOptions.map(o => this.cascaderService.getOptionLabel(o));
        if (this.isLabelRenderTemplate) {
            this.labelRenderContext = { labels, selectedOptions };
        }
        else {
            this.labelRenderText = defaultDisplayRender.call(this, labels);
        }
    }
    setDropdownStyles() {
        const firstColumn = this.cascaderService.columns[0];
        this.shouldShowEmpty =
            (this.inSearchingMode && (!firstColumn || !firstColumn.length)) || // Should show empty when there's no searching result
                (!(this.nzOptions && this.nzOptions.length) && !this.nzLoadData); // Should show when there's no options and developer does not use nzLoadData
        this.dropdownHeightStyle = this.shouldShowEmpty ? 'auto' : '';
        if (this.input) {
            this.dropdownWidthStyle = this.inSearchingMode || this.shouldShowEmpty ? `${this.input.nativeElement.offsetWidth}px` : '';
        }
    }
    setLocale() {
        this.locale = this.i18nService.getLocaleData('global');
        this.cdr.markForCheck();
    }
    scrollToActivatedOptions() {
        // scroll only until option menu view is ready
        Promise.resolve().then(() => {
            this.cascaderItems
                .toArray()
                .filter(e => e.activated)
                .forEach(e => {
                var _a;
                (_a = e.nativeElement) === null || _a === void 0 ? void 0 : _a.scrollIntoView({ block: 'start', inline: 'nearest' });
            });
        });
    }
}
NzCascaderComponent.decorators = [
    { type: Component, args: [{
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                selector: 'nz-cascader, [nz-cascader]',
                exportAs: 'nzCascader',
                preserveWhitespaces: false,
                template: `
    <div cdkOverlayOrigin #origin="cdkOverlayOrigin" #trigger>
      <div *ngIf="nzShowInput">
        <input
          #input
          nz-input
          class="ant-cascader-input"
          [class.ant-cascader-input-disabled]="nzDisabled"
          [class.ant-cascader-input-lg]="nzSize === 'large'"
          [class.ant-cascader-input-sm]="nzSize === 'small'"
          [attr.autoComplete]="'off'"
          [attr.placeholder]="showPlaceholder ? nzPlaceHolder || locale?.placeholder : null"
          [attr.autofocus]="nzAutoFocus ? 'autofocus' : null"
          [readonly]="!nzShowSearch"
          [disabled]="nzDisabled"
          [nzSize]="nzSize"
          [(ngModel)]="inputValue"
          (blur)="handleInputBlur()"
          (focus)="handleInputFocus()"
          (change)="$event.stopPropagation()"
        />
        <i
          *ngIf="clearIconVisible"
          nz-icon
          nzType="close-circle"
          nzTheme="fill"
          class="ant-cascader-picker-clear"
          (click)="clearSelection($event)"
        ></i>
        <ng-container *nzStringTemplateOutlet="nzSuffixIcon">
          <i
            *ngIf="nzShowArrow && !isLoading"
            nz-icon
            [nzType]="$any(nzSuffixIcon)"
            class="ant-cascader-picker-arrow"
            [class.ant-cascader-picker-arrow-expand]="menuVisible"
          ></i>
        </ng-container>
        <i *ngIf="isLoading" nz-icon nzType="loading" class="ant-cascader-picker-arrow"></i>
        <span
          class="ant-cascader-picker-label"
          [class.ant-cascader-picker-show-search]="!!nzShowSearch"
          [class.ant-cascader-picker-focused]="!!nzShowSearch && isFocused && !inputValue"
        >
          <ng-container *ngIf="!isLabelRenderTemplate; else labelTemplate">{{ labelRenderText }}</ng-container>
          <ng-template #labelTemplate>
            <ng-template [ngTemplateOutlet]="nzLabelRender" [ngTemplateOutletContext]="labelRenderContext"></ng-template>
          </ng-template>
        </span>
      </div>
      <ng-content></ng-content>
    </div>
    <ng-template
      cdkConnectedOverlay
      nzConnectedOverlay
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayPositions]="positions"
      [cdkConnectedOverlayTransformOriginOn]="'.ant-cascader-menus'"
      [cdkConnectedOverlayOpen]="menuVisible"
      (overlayOutsideClick)="onClickOutside($event)"
      (detach)="closeMenu()"
    >
      <div
        #menu
        class="ant-cascader-menus"
        [class.ant-cascader-menu-rtl]="dir === 'rtl'"
        [class.ant-cascader-menus-hidden]="!menuVisible"
        [ngClass]="menuCls"
        [ngStyle]="nzMenuStyle"
        [@.disabled]="noAnimation?.nzNoAnimation"
        [nzNoAnimation]="noAnimation?.nzNoAnimation"
        [@slideMotion]="'enter'"
        (mouseleave)="onTriggerMouseLeave($event)"
      >
        <ul
          *ngIf="shouldShowEmpty; else hasOptionsTemplate"
          class="ant-cascader-menu"
          [style.width]="dropdownWidthStyle"
          [style.height]="dropdownHeightStyle"
        >
          <li class="ant-cascader-menu-item ant-cascader-menu-item-expanded ant-cascader-menu-item-disabled">
            <nz-embed-empty [nzComponentName]="'cascader'" [specificContent]="nzNotFoundContent"></nz-embed-empty>
          </li>
        </ul>
        <ng-template #hasOptionsTemplate>
          <ul
            *ngFor="let options of cascaderService.columns; let i = index"
            class="ant-cascader-menu"
            [ngClass]="menuColumnCls"
            [style.height]="dropdownHeightStyle"
            [style.width]="dropdownWidthStyle"
          >
            <li
              nz-cascader-option
              *ngFor="let option of options"
              [expandIcon]="nzExpandIcon"
              [columnIndex]="i"
              [nzLabelProperty]="nzLabelProperty"
              [optionTemplate]="nzOptionRender"
              [activated]="isOptionActivated(option, i)"
              [highlightText]="inSearchingMode ? inputValue : ''"
              [option]="option"
              [dir]="dir"
              (mouseenter)="onOptionMouseEnter(option, i, $event)"
              (mouseleave)="onOptionMouseLeave(option, i, $event)"
              (click)="onOptionClick(option, i, $event)"
            ></li>
          </ul>
        </ng-template>
      </div>
    </ng-template>
  `,
                animations: [slideMotion],
                providers: [
                    {
                        provide: NG_VALUE_ACCESSOR,
                        useExisting: forwardRef(() => NzCascaderComponent),
                        multi: true
                    },
                    NzCascaderService
                ],
                host: {
                    '[attr.tabIndex]': '"0"',
                    '[class.ant-cascader-lg]': 'nzSize === "large"',
                    '[class.ant-cascader-sm]': 'nzSize === "small"',
                    '[class.ant-cascader-picker-disabled]': 'nzDisabled',
                    '[class.ant-cascader-picker-open]': 'menuVisible',
                    '[class.ant-cascader-picker-with-value]': '!!inputValue',
                    '[class.ant-cascader-focused]': 'isFocused',
                    '[class.ant-cascader-picker-rtl]': `dir ==='rtl'`
                }
            },] }
];
NzCascaderComponent.ctorParameters = () => [
    { type: NzCascaderService },
    { type: NzConfigService },
    { type: ChangeDetectorRef },
    { type: NzI18nService },
    { type: ElementRef },
    { type: Renderer2 },
    { type: Directionality, decorators: [{ type: Optional }] },
    { type: NzNoAnimationDirective, decorators: [{ type: Host }, { type: Optional }] }
];
NzCascaderComponent.propDecorators = {
    input: [{ type: ViewChild, args: ['input', { static: false },] }],
    menu: [{ type: ViewChild, args: ['menu', { static: false },] }],
    overlay: [{ type: ViewChild, args: [CdkConnectedOverlay, { static: false },] }],
    cascaderItems: [{ type: ViewChildren, args: [NzCascaderOptionComponent,] }],
    nzOptionRender: [{ type: Input }],
    nzShowInput: [{ type: Input }],
    nzShowArrow: [{ type: Input }],
    nzAllowClear: [{ type: Input }],
    nzAutoFocus: [{ type: Input }],
    nzChangeOnSelect: [{ type: Input }],
    nzDisabled: [{ type: Input }],
    nzColumnClassName: [{ type: Input }],
    nzExpandTrigger: [{ type: Input }],
    nzValueProperty: [{ type: Input }],
    nzLabelRender: [{ type: Input }],
    nzLabelProperty: [{ type: Input }],
    nzNotFoundContent: [{ type: Input }],
    nzSize: [{ type: Input }],
    nzShowSearch: [{ type: Input }],
    nzPlaceHolder: [{ type: Input }],
    nzMenuClassName: [{ type: Input }],
    nzMenuStyle: [{ type: Input }],
    nzMouseEnterDelay: [{ type: Input }],
    nzMouseLeaveDelay: [{ type: Input }],
    nzTriggerAction: [{ type: Input }],
    nzChangeOn: [{ type: Input }],
    nzLoadData: [{ type: Input }],
    nzSuffixIcon: [{ type: Input }],
    nzExpandIcon: [{ type: Input }],
    nzOptions: [{ type: Input }],
    nzVisibleChange: [{ type: Output }],
    nzSelectionChange: [{ type: Output }],
    nzSelect: [{ type: Output }],
    nzClear: [{ type: Output }],
    onKeyDown: [{ type: HostListener, args: ['keydown', ['$event'],] }],
    onTriggerClick: [{ type: HostListener, args: ['click',] }],
    onTriggerMouseEnter: [{ type: HostListener, args: ['mouseenter',] }],
    onTriggerMouseLeave: [{ type: HostListener, args: ['mouseleave', ['$event'],] }]
};
__decorate([
    InputBoolean(),
    __metadata("design:type", Object)
], NzCascaderComponent.prototype, "nzShowInput", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Object)
], NzCascaderComponent.prototype, "nzShowArrow", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Object)
], NzCascaderComponent.prototype, "nzAllowClear", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Object)
], NzCascaderComponent.prototype, "nzAutoFocus", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Object)
], NzCascaderComponent.prototype, "nzChangeOnSelect", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Object)
], NzCascaderComponent.prototype, "nzDisabled", void 0);
__decorate([
    WithConfig(),
    __metadata("design:type", String)
], NzCascaderComponent.prototype, "nzSize", void 0);
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FzY2FkZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uL2NvbXBvbmVudHMvY2FzY2FkZXIvIiwic291cmNlcyI6WyJjYXNjYWRlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHOztBQUVILE9BQU8sRUFBYSxjQUFjLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUM5RCxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxXQUFXLEVBQUUsUUFBUSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDaEgsT0FBTyxFQUFFLG1CQUFtQixFQUEwQixNQUFNLHNCQUFzQixDQUFDO0FBQ25GLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsWUFBWSxFQUNaLFVBQVUsRUFDVixJQUFJLEVBQ0osWUFBWSxFQUNaLEtBQUssRUFHTCxRQUFRLEVBQ1IsTUFBTSxFQUNOLFNBQVMsRUFDVCxTQUFTLEVBRVQsU0FBUyxFQUNULFlBQVksRUFDWixpQkFBaUIsRUFDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUF3QixpQkFBaUIsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ3pFLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUMzRCxPQUFPLEVBQWUsZUFBZSxFQUFFLFVBQVUsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3JGLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQ3pFLE9BQU8sRUFBRSwwQkFBMEIsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBRXhFLE9BQU8sRUFBRSxZQUFZLEVBQUUsT0FBTyxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFFaEUsT0FBTyxFQUEyQixhQUFhLEVBQUUsTUFBTSxvQkFBb0IsQ0FBQztBQUM1RSxPQUFPLEVBQUUsT0FB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QUFFLENBQUMsUUFBUSxDQUFDOzZCQTJDbEMsWUFBWSxTQUFDLE9BQU87a0NBY3BCLFlBQVksU0FBQyxZQUFZO2tDQVN6QixZQUFZLFNBQUMsWUFBWSxFQUFFLENBQUMsUUFBUSxDQUFDOztBQXJXYjtJQUFmLFlBQVksRUFBRTs7d0RBQW9CO0FBQ25CO0lBQWYsWUFBWSxFQUFFOzt3REFBb0I7QUFDbkI7SUFBZixZQUFZLEVBQUU7O3lEQUFxQjtBQUNwQjtJQUFmLFlBQVksRUFBRTs7d0RBQXFCO0FBQ3BCO0lBQWYsWUFBWSxFQUFFOzs2REFBMEI7QUFDekI7SUFBZixZQUFZLEVBQUU7O3VEQUFvQjtBQU9yQjtJQUFiLFVBQVUsRUFBRTs7bURBQW9DIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2dpdGh1Yi5jb20vTkctWk9SUk8vbmctem9ycm8tYW50ZC9ibG9iL21hc3Rlci9MSUNFTlNFXG4gKi9cblxuaW1wb3J0IHsgRGlyZWN0aW9uLCBEaXJlY3Rpb25hbGl0eSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7IEJBQ0tTUEFDRSwgRE9XTl9BUlJPVywgRU5URVIsIEVTQ0FQRSwgTEVGVF9BUlJPVywgUklHSFRfQVJST1csIFVQX0FSUk9XIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7IENka0Nvbm5lY3RlZE92ZXJsYXksIENvbm5lY3Rpb25Qb3NpdGlvblBhaXIgfSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBmb3J3YXJkUmVmLFxuICBIb3N0LFxuICBIb3N0TGlzdGVuZXIsXG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbiAgUXVlcnlMaXN0LFxuICBSZW5kZXJlcjIsXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdDaGlsZHJlbixcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBDb250cm9sVmFsdWVBY2Nlc3NvciwgTkdfVkFMVUVfQUNDRVNTT1IgfSBmcm9tICdAYW5ndWxhci9mb3Jtcyc7XG5pbXBvcnQgeyBzbGlkZU1vdGlvbiB9IGZyb20gJ25nLXpvcnJvLWFudGQvY29yZS9hbmltYXRpb24nO1xuaW1wb3J0IHsgTnpDb25maWdLZXksIE56Q29uZmlnU2VydmljZSwgV2l0aENvbmZpZyB9IGZyb20gJ25nLXpvcnJvLWFudGQvY29yZS9jb25maWcnO1xuaW1wb3J0IHsgTnpOb0FuaW1hdGlvbkRpcmVjdGl2ZSB9IGZyb20gJ25nLXpvcnJvLWFudGQvY29yZS9uby1hbmltYXRpb24nO1xuaW1wb3J0IHsgREVGQVVMVF9DQVNDQURFUl9QT1NJVElPTlMgfSBmcm9tICduZy16b3Jyby1hbnRkL2NvcmUvb3ZlcmxheSc7XG5pbXBvcnQgeyBCb29sZWFuSW5wdXQsIE5nQ2xhc3NUeXBlLCBOZ1N0eWxlSW50ZXJmYWNlLCBOelNhZmVBbnkgfSBmcm9tICduZy16b3Jyby1hbnRkL2NvcmUvdHlwZXMnO1xuaW1wb3J0IHsgSW5wdXRCb29sZWFuLCB0b0FycmF5IH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL3V0aWwnO1xuXG5pbXBvcnQgeyBOekNhc2NhZGVySTE4bkludGVyZmFjZSwgTnpJMThuU2VydmljZSB9IGZyb20gJ25nLXpvcnJvLWFudGQvaTE4bic7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBzdGFydFdpdGgsIHRha2VVbnRpbCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IE56Q2FzY2FkZXJPcHRpb25Db21wb25lbnQgfSBmcm9tICcuL2Nhc2NhZGVyLWxpLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOekNhc2NhZGVyU2VydmljZSB9IGZyb20gJy4vY2FzY2FkZXIuc2VydmljZSc7XG5pbXBvcnQge1xuICBOekNhc2NhZGVyQ29tcG9uZW50QXNTb3VyY2UsXG4gIE56Q2FzY2FkZXJFeHBhbmRUcmlnZ2VyLFxuICBOekNhc2NhZGVyT3B0aW9uLFxuICBOekNhc2NhZGVyU2VhcmNoT3B0aW9uLFxuICBOekNhc2NhZGVyU2l6ZSxcbiAgTnpDYXNjYWRlclRyaWdnZXJUeXBlLFxuICBOelNob3dTZWFyY2hPcHRpb25zXG59IGZyb20gJy4vdHlwaW5ncyc7XG5cbmNvbnN0IE5aX0NPTkZJR19NT0RVTEVfTkFNRTogTnpDb25maWdLZXkgPSAnY2FzY2FkZXInO1xuY29uc3QgZGVmYXVsdERpc3BsYXlSZW5kZXIgPSAobGFiZWxzOiBzdHJpbmdbXSkgPT4gbGFiZWxzLmpvaW4oJyAvICcpO1xuXG5AQ29tcG9uZW50KHtcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIHNlbGVjdG9yOiAnbnotY2FzY2FkZXIsIFtuei1jYXNjYWRlcl0nLFxuICBleHBvcnRBczogJ256Q2FzY2FkZXInLFxuICBwcmVzZXJ2ZVdoaXRlc3BhY2VzOiBmYWxzZSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IGNka092ZXJsYXlPcmlnaW4gI29yaWdpbj1cImNka092ZXJsYXlPcmlnaW5cIiAjdHJpZ2dlcj5cbiAgICAgIDxkaXYgKm5nSWY9XCJuelNob3dJbnB1dFwiPlxuICAgICAgICA8aW5wdXRcbiAgICAgICAgICAjaW5wdXRcbiAgICAgICAgICBuei1pbnB1dFxuICAgICAgICAgIGNsYXNzPVwiYW50LWNhc2NhZGVyLWlucHV0XCJcbiAgICAgICAgICBbY2xhc3MuYW50LWNhc2NhZGVyLWlucHV0LWRpc2FibGVkXT1cIm56RGlzYWJsZWRcIlxuICAgICAgICAgIFtjbGFzcy5hbnQtY2FzY2FkZXItaW5wdXQtbGddPVwibnpTaXplID09PSAnbGFyZ2UnXCJcbiAgICAgICAgICBbY2xhc3MuYW50LWNhc2NhZGVyLWlucHV0LXNtXT1cIm56U2l6ZSA9PT0gJ3NtYWxsJ1wiXG4gICAgICAgICAgW2F0dHIuYXV0b0NvbXBsZXRlXT1cIidvZmYnXCJcbiAgICAgICAgICBbYXR0ci5wbGFjZWhvbGRlcl09XCJzaG93UGxhY2Vob2xkZXIgPyBuelBsYWNlSG9sZGVyIHx8IGxvY2FsZT8ucGxhY2Vob2xkZXIgOiBudWxsXCJcbiAgICAgICAgICBbYXR0ci5hdXRvZm9jdXNdPVwibnpBdXRvRm9jdXMgPyAnYXV0b2ZvY3VzJyA6IG51bGxcIlxuICAgICAgICAgIFtyZWFkb25seV09XCIhbnpTaG93U2VhcmNoXCJcbiAgICAgICAgICBbZGlzYWJsZWRdPVwibnpEaXNhYmxlZFwiXG4gICAgICAgICAgW256U2l6ZV09XCJuelNpemVcIlxuICAgICAgICAgIFsobmdNb2RlbCldPVwiaW5wdXRWYWx1ZVwiXG4gICAgICAgICAgKGJsdXIpPVwiaGFuZGxlSW5wdXRCbHVyKClcIlxuICAgICAgICAgIChmb2N1cyk9XCJoYW5kbGVJbnB1dEZvY3VzKClcIlxuICAgICAgICAgIChjaGFuZ2UpPVwiJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpXCJcbiAgICAgICAgLz5cbiAgICAgICAgPGlcbiAgICAgICAgICAqbmdJZj1cImNsZWFySWNvblZpc2libGVcIlxuICAgICAgICAgIG56LWljb25cbiAgICAgICAgICBuelR5cGU9XCJjbG9zZS1jaXJjbGVcIlxuICAgICAgICAgIG56VGhlbWU9XCJmaWxsXCJcbiAgICAgICAgICBjbGFzcz1cImFudC1jYXNjYWRlci1waWNrZXItY2xlYXJcIlxuICAgICAgICAgIChjbGljayk9XCJjbGVhclNlbGVjdGlvbigkZXZlbnQpXCJcbiAgICAgICAgPjwvaT5cbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbnpTdHJpbmdUZW1wbGF0ZU91dGxldD1cIm56U3VmZml4SWNvblwiPlxuICAgICAgICAgIDxpXG4gICAgICAgICAgICAqbmdJZj1cIm56U2hvd0Fycm93ICYmICFpc0xvYWRpbmdcIlxuICAgICAgICAgICAgbnotaWNvblxuICAgICAgICAgICAgW256VHlwZV09XCIkYW55KG56U3VmZml4SWNvbilcIlxuICAgICAgICAgICAgY2xhc3M9XCJhbnQtY2FzY2FkZXItcGlja2VyLWFycm93XCJcbiAgICAgICAgICAgIFtjbGFzcy5hbnQtY2FzY2FkZXItcGlja2VyLWFycm93LWV4cGFuZF09XCJtZW51VmlzaWJsZVwiXG4gICAgICAgICAgPjwvaT5cbiAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgIDxpICpuZ0lmPVwiaXNMb2FkaW5nXCIgbnotaWNvbiBuelR5cGU9XCJsb2FkaW5nXCIgY2xhc3M9XCJhbnQtY2FzY2FkZXItcGlja2VyLWFycm93XCI+PC9pPlxuICAgICAgICA8c3BhblxuICAgICAgICAgIGNsYXNzPVwiYW50LWNhc2NhZGVyLXBpY2tlci1sYWJlbFwiXG4gICAgICAgICAgW2NsYXNzLmFudC1jYXNjYWRlci1waWNrZXItc2hvdy1zZWFyY2hdPVwiISFuelNob3dTZWFyY2hcIlxuICAgICAgICAgIFtjbGFzcy5hbnQtY2FzY2FkZXItcGlja2VyLWZvY3VzZWRdPVwiISFuelNob3dTZWFyY2ggJiYgaXNGb2N1c2VkICYmICFpbnB1dFZhbHVlXCJcbiAgICAgICAgPlxuICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCIhaXNMYWJlbFJlbmRlclRlbXBsYXRlOyBlbHNlIGxhYmVsVGVtcGxhdGVcIj57eyBsYWJlbFJlbmRlclRleHQgfX08L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICA8bmctdGVtcGxhdGUgI2xhYmVsVGVtcGxhdGU+XG4gICAgICAgICAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwibnpMYWJlbFJlbmRlclwiIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJsYWJlbFJlbmRlckNvbnRleHRcIj48L25nLXRlbXBsYXRlPlxuICAgICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvZGl2PlxuICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgIDwvZGl2PlxuICAgIDxuZy10ZW1wbGF0ZVxuICAgICAgY2RrQ29ubmVjdGVkT3ZlcmxheVxuICAgICAgbnpDb25uZWN0ZWRPdmVybGF5XG4gICAgICBbY2RrQ29ubmVjdGVkT3ZlcmxheU9yaWdpbl09XCJvcmlnaW5cIlxuICAgICAgW2Nka0Nvbm5lY3RlZE92ZXJsYXlQb3NpdGlvbnNdPVwicG9zaXRpb25zXCJcbiAgICAgIFtjZGtDb25uZWN0ZWRPdmVybGF5VHJhbnNmb3JtT3JpZ2luT25dPVwiJy5hbnQtY2FzY2FkZXItbWVudXMnXCJcbiAgICAgIFtjZGtDb25uZWN0ZWRPdmVybGF5T3Blbl09XCJtZW51VmlzaWJsZVwiXG4gICAgICAob3ZlcmxheU91dHNpZGVDbGljayk9XCJvbkNsaWNrT3V0c2lkZSgkZXZlbnQpXCJcbiAgICAgIChkZXRhY2gpPVwiY2xvc2VNZW51KClcIlxuICAgID5cbiAgICAgIDxkaXZcbiAgICAgICAgI21lbnVcbiAgICAgICAgY2xhc3M9XCJhbnQtY2FzY2FkZXItbWVudXNcIlxuICAgICAgICBbY2xhc3MuYW50LWNhc2NhZGVyLW1lbnUtcnRsXT1cImRpciA9PT0gJ3J0bCdcIlxuICAgICAgICBbY2xhc3MuYW50LWNhc2NhZGVyLW1lbnVzLWhpZGRlbl09XCIhbWVudVZpc2libGVcIlxuICAgICAgICBbbmdDbGFzc109XCJtZW51Q2xzXCJcbiAgICAgICAgW25nU3R5bGVdPVwibnpNZW51U3R5bGVcIlxuICAgICAgICBbQC5kaXNhYmxlZF09XCJub0FuaW1hdGlvbj8ubnpOb0FuaW1hdGlvblwiXG4gICAgICAgIFtuek5vQW5pbWF0aW9uXT1cIm5vQW5pbWF0aW9uPy5uek5vQW5pbWF0aW9uXCJcbiAgICAgICAgW0BzbGlkZU1vdGlvbl09XCInZW50ZXInXCJcbiAgICAgICAgKG1vdXNlbGVhdmUpPVwib25UcmlnZ2VyTW91c2VMZWF2ZSgkZXZlbnQpXCJcbiAgICAgID5cbiAgICAgICAgPHVsXG4gICAgICAgICAgKm5nSWY9XCJzaG91bGRTaG93RW1wdHk7IGVsc2UgaGFzT3B0aW9uc1RlbXBsYXRlXCJcbiAgICAgICAgICBjbGFzcz1cImFudC1jYXNjYWRlci1tZW51XCJcbiAgICAgICAgICBbc3R5bGUud2lkdGhdPVwiZHJvcGRvd25XaWR0aFN0eWxlXCJcbiAgICAgICAgICBbc3R5bGUuaGVpZ2h0XT1cImRyb3Bkb3duSGVpZ2h0U3R5bGVcIlxuICAgICAgICA+XG4gICAgICAgICAgPGxpIGNsYXNzPVwiYW50LWNhc2NhZGVyLW1lbnUtaXRlbSBhbnQtY2FzY2FkZXItbWVudS1pdGVtLWV4cGFuZGVkIGFudC1jYXNjYWRlci1tZW51LWl0ZW0tZGlzYWJsZWRcIj5cbiAgICAgICAgICAgIDxuei1lbWJlZC1lbXB0eSBbbnpDb21wb25lbnROYW1lXT1cIidjYXNjYWRlcidcIiBbc3BlY2lmaWNDb250ZW50XT1cIm56Tm90Rm91bmRDb250ZW50XCI+PC9uei1lbWJlZC1lbXB0eT5cbiAgICAgICAgICA8L2xpPlxuICAgICAgICA8L3VsPlxuICAgICAgICA8bmctdGVtcGxhdGUgI2hhc09wdGlvbnNUZW1wbGF0ZT5cbiAgICAgICAgICA8dWxcbiAgICAgICAgICAgICpuZ0Zvcj1cImxldCBvcHRpb25zIG9mIGNhc2NhZGVyU2VydmljZS5jb2x1bW5zOyBsZXQgaSA9IGluZGV4XCJcbiAgICAgICAgICAgIGNsYXNzPVwiYW50LWNhc2NhZGVyLW1lbnVcIlxuICAgICAgICAgICAgW25nQ2xhc3NdPVwibWVudUNvbHVtbkNsc1wiXG4gICAgICAgICAgICBbc3R5bGUuaGVpZ2h0XT1cImRyb3Bkb3duSGVpZ2h0U3R5bGVcIlxuICAgICAgICAgICAgW3N0eWxlLndpZHRoXT1cImRyb3Bkb3duV2lkdGhTdHlsZVwiXG4gICAgICAgICAgPlxuICAgICAgICAgICAgPGxpXG4gICAgICAgICAgICAgIG56LWNhc2NhZGVyLW9wdGlvblxuICAgICAgICAgICAgICAqbmdGb3I9XCJsZXQgb3B0aW9uIG9mIG9wdGlvbnNcIlxuICAgICAgICAgICAgICBbZXhwYW5kSWNvbl09XCJuekV4cGFuZEljb25cIlxuICAgICAgICAgICAgICBbY29sdW1uSW5kZXhdPVwiaVwiXG4gICAgICAgICAgICAgIFtuekxhYmVsUHJvcGVydHldPVwibnpMYWJlbFByb3BlcnR5XCJcbiAgICAgICAgICAgICAgW29wdGlvblRlbXBsYXRlXT1cIm56T3B0aW9uUmVuZGVyXCJcbiAgICAgICAgICAgICAgW2FjdGl2YXRlZF09XCJpc09wdGlvbkFjdGl2YXRlZChvcHRpb24sIGkpXCJcbiAgICAgICAgICAgICAgW2hpZ2hsaWdodFRleHRdPVwiaW5TZWFyY2hpbmdNb2RlID8gaW5wdXRWYWx1ZSA6ICcnXCJcbiAgICAgICAgICAgICAgW29wdGlvbl09XCJvcHRpb25cIlxuICAgICAgICAgICAgICBbZGlyXT1cImRpclwiXG4gICAgICAgICAgICAgIChtb3VzZWVudGVyKT1cIm9uT3B0aW9uTW91c2VFbnRlcihvcHRpb24sIGksICRldmVudClcIlxuICAgICAgICAgICAgICAobW91c2VsZWF2ZSk9XCJvbk9wdGlvbk1vdXNlTGVhdmUob3B0aW9uLCBpLCAkZXZlbnQpXCJcbiAgICAgICAgICAgICAgKGNsaWNrKT1cIm9uT3B0aW9uQ2xpY2sob3B0aW9uLCBpLCAkZXZlbnQpXCJcbiAgICAgICAgICAgID48L2xpPlxuICAgICAgICAgIDwvdWw+XG4gICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICA8L2Rpdj5cbiAgICA8L25nLXRlbXBsYXRlPlxuICBgLFxuICBhbmltYXRpb25zOiBbc2xpZGVNb3Rpb25dLFxuICBwcm92aWRlcnM6IFtcbiAgICB7XG4gICAgICBwcm92aWRlOiBOR19WQUxVRV9BQ0NFU1NPUixcbiAgICAgIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IE56Q2FzY2FkZXJDb21wb25lbnQpLFxuICAgICAgbXVsdGk6IHRydWVcbiAgICB9LFxuICAgIE56Q2FzY2FkZXJTZXJ2aWNlXG4gIF0sXG4gIGhvc3Q6IHtcbiAgICAnW2F0dHIudGFiSW5kZXhdJzogJ1wiMFwiJyxcbiAgICAnW2NsYXNzLmFudC1jYXNjYWRlci1sZ10nOiAnbnpTaXplID09PSBcImxhcmdlXCInLFxuICAgICdbY2xhc3MuYW50LWNhc2NhZGVyLXNtXSc6ICduelNpemUgPT09IFwic21hbGxcIicsXG4gICAgJ1tjbGFzcy5hbnQtY2FzY2FkZXItcGlja2VyLWRpc2FibGVkXSc6ICduekRpc2FibGVkJyxcbiAgICAnW2NsYXNzLmFudC1jYXNjYWRlci1waWNrZXItb3Blbl0nOiAnbWVudVZpc2libGUnLFxuICAgICdbY2xhc3MuYW50LWNhc2NhZGVyLXBpY2tlci13aXRoLXZhbHVlXSc6ICchIWlucHV0VmFsdWUnLFxuICAgICdbY2xhc3MuYW50LWNhc2NhZGVyLWZvY3VzZWRdJzogJ2lzRm9jdXNlZCcsXG4gICAgJ1tjbGFzcy5hbnQtY2FzY2FkZXItcGlja2VyLXJ0bF0nOiBgZGlyID09PSdydGwnYFxuICB9XG59KVxuZXhwb3J0IGNsYXNzIE56Q2FzY2FkZXJDb21wb25lbnQgaW1wbGVtZW50cyBOekNhc2NhZGVyQ29tcG9uZW50QXNTb3VyY2UsIE9uSW5pdCwgT25EZXN0cm95LCBDb250cm9sVmFsdWVBY2Nlc3NvciB7XG4gIHJlYWRvbmx5IF9uek1vZHVsZU5hbWU6IE56Q29uZmlnS2V5ID0gTlpfQ09ORklHX01PRFVMRV9OQU1FO1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbnpTaG93SW5wdXQ6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX256U2hvd0Fycm93OiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9uekFsbG93Q2xlYXI6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX256QXV0b0ZvY3VzOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9uekNoYW5nZU9uU2VsZWN0OiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9uekRpc2FibGVkOiBCb29sZWFuSW5wdXQ7XG5cbiAgQFZpZXdDaGlsZCgnaW5wdXQnLCB7IHN0YXRpYzogZmFsc2UgfSkgaW5wdXQhOiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKCdtZW51JywgeyBzdGF0aWM6IGZhbHNlIH0pIG1lbnUhOiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKENka0Nvbm5lY3RlZE92ZXJsYXksIHsgc3RhdGljOiBmYWxzZSB9KSBvdmVybGF5ITogQ2RrQ29ubmVjdGVkT3ZlcmxheTtcbiAgQFZpZXdDaGlsZHJlbihOekNhc2NhZGVyT3B0aW9uQ29tcG9uZW50KSBjYXNjYWRlckl0ZW1zITogUXVlcnlMaXN0PE56Q2FzY2FkZXJPcHRpb25Db21wb25lbnQ+O1xuXG4gIEBJbnB1dCgpIG56T3B0aW9uUmVuZGVyOiBUZW1wbGF0ZVJlZjx7ICRpbXBsaWNpdDogTnpDYXNjYWRlck9wdGlvbjsgaW5kZXg6IG51bWJlciB9PiB8IG51bGwgPSBudWxsO1xuICBASW5wdXQoKSBASW5wdXRCb29sZWFuKCkgbnpTaG93SW5wdXQgPSB0cnVlO1xuICBASW5wdXQoKSBASW5wdXRCb29sZWFuKCkgbnpTaG93QXJyb3cgPSB0cnVlO1xuICBASW5wdXQoKSBASW5wdXRCb29sZWFuKCkgbnpBbGxvd0NsZWFyID0gdHJ1ZTtcbiAgQElucHV0KCkgQElucHV0Qm9vbGVhbigpIG56QXV0b0ZvY3VzID0gZmFsc2U7XG4gIEBJbnB1dCgpIEBJbnB1dEJvb2xlYW4oKSBuekNoYW5nZU9uU2VsZWN0ID0gZmFsc2U7XG4gIEBJbnB1dCgpIEBJbnB1dEJvb2xlYW4oKSBuekRpc2FibGVkID0gZmFsc2U7XG4gIEBJbnB1dCgpIG56Q29sdW1uQ2xhc3NOYW1lPzogc3RyaW5nO1xuICBASW5wdXQoKSBuekV4cGFuZFRyaWdnZXI6IE56Q2FzY2FkZXJFeHBhbmRUcmlnZ2VyID0gJ2NsaWNrJztcbiAgQElucHV0KCkgbnpWYWx1ZVByb3BlcnR5ID0gJ3ZhbHVlJztcbiAgQElucHV0KCkgbnpMYWJlbFJlbmRlcjogVGVtcGxhdGVSZWY8dm9pZD4gfCBudWxsID0gbnVsbDtcbiAgQElucHV0KCkgbnpMYWJlbFByb3BlcnR5ID0gJ2xhYmVsJztcbiAgQElucHV0KCkgbnpOb3RGb3VuZENvbnRlbnQ/OiBzdHJpbmcgfCBUZW1wbGF0ZVJlZjx2b2lkPjtcbiAgQElucHV0KCkgQFdpdGhDb25maWcoKSBuelNpemU6IE56Q2FzY2FkZXJTaXplID0gJ2RlZmF1bHQnO1xuICBASW5wdXQoKSBuelNob3dTZWFyY2g6IGJvb2xlYW4gfCBOelNob3dTZWFyY2hPcHRpb25zID0gZmFsc2U7XG4gIEBJbnB1dCgpIG56UGxhY2VIb2xkZXI6IHN0cmluZyA9ICcnO1xuICBASW5wdXQoKSBuek1lbnVDbGFzc05hbWU/OiBzdHJpbmc7XG4gIEBJbnB1dCgpIG56TWVudVN0eWxlOiBOZ1N0eWxlSW50ZXJmYWNlIHwgbnVsbCA9IG51bGw7XG4gIEBJbnB1dCgpIG56TW91c2VFbnRlckRlbGF5OiBudW1iZXIgPSAxNTA7IC8vIG1zXG4gIEBJbnB1dCgpIG56TW91c2VMZWF2ZURlbGF5OiBudW1iZXIgPSAxNTA7IC8vIG1zXG4gIEBJbnB1dCgpIG56VHJpZ2dlckFjdGlvbjogTnpDYXNjYWRlclRyaWdnZXJUeXBlIHwgTnpDYXNjYWRlclRyaWdnZXJUeXBlW10gPSBbJ2NsaWNrJ10gYXMgTnpDYXNjYWRlclRyaWdnZXJUeXBlW107XG4gIEBJbnB1dCgpIG56Q2hhbmdlT24/OiAob3B0aW9uOiBOekNhc2NhZGVyT3B0aW9uLCBsZXZlbDogbnVtYmVyKSA9PiBib29sZWFuO1xuICBASW5wdXQoKSBuekxvYWREYXRhPzogKG5vZGU6IE56Q2FzY2FkZXJPcHRpb24sIGluZGV4OiBudW1iZXIpID0+IFByb21pc2VMaWtlPE56U2FmZUFueT47XG4gIC8vIFRPRE86IFJUTFxuICBASW5wdXQoKSBuelN1ZmZpeEljb246IHN0cmluZyB8IFRlbXBsYXRlUmVmPHZvaWQ+ID0gJ2Rvd24nO1xuICBASW5wdXQoKSBuekV4cGFuZEljb246IHN0cmluZyB8IFRlbXBsYXRlUmVmPHZvaWQ+ID0gJyc7XG5cbiAgQElucHV0KClcbiAgZ2V0IG56T3B0aW9ucygpOiBOekNhc2NhZGVyT3B0aW9uW10gfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5jYXNjYWRlclNlcnZpY2UubnpPcHRpb25zO1xuICB9XG5cbiAgc2V0IG56T3B0aW9ucyhvcHRpb25zOiBOekNhc2NhZGVyT3B0aW9uW10gfCBudWxsKSB7XG4gICAgdGhpcy5jYXNjYWRlclNlcnZpY2Uud2l0aE9wdGlvbnMob3B0aW9ucyk7XG4gIH1cblxuICBAT3V0cHV0KCkgcmVhZG9ubHkgbnpWaXNpYmxlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxib29sZWFuPigpO1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgbnpTZWxlY3Rpb25DaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPE56Q2FzY2FkZXJPcHRpb25bXT4oKTtcbiAgQE91dHB1dCgpIHJlYWRvbmx5IG56U2VsZWN0ID0gbmV3IEV2ZW50RW1pdHRlcjx7IG9wdGlvbjogTnpDYXNjYWRlck9wdGlvbjsgaW5kZXg6IG51bWJlciB9IHwgbnVsbD4oKTtcbiAgQE91dHB1dCgpIHJlYWRvbmx5IG56Q2xlYXIgPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG5cbiAgLyoqXG4gICAqIElmIHRoZSBkcm9wZG93biBzaG91bGQgc2hvdyB0aGUgZW1wdHkgY29udGVudC5cbiAgICogYHRydWVgIGlmIHRoZXJlJ3Mgbm8gb3B0aW9ucy5cbiAgICovXG4gIHNob3VsZFNob3dFbXB0eTogYm9vbGVhbiA9IGZhbHNlO1xuXG4gIGVsOiBIVE1MRWxlbWVudDtcbiAgbWVudVZpc2libGUgPSBmYWxzZTtcbiAgaXNMb2FkaW5nID0gZmFsc2U7XG4gIGxhYmVsUmVuZGVyVGV4dD86IHN0cmluZztcbiAgbGFiZWxSZW5kZXJDb250ZXh0ID0ge307XG4gIG9uQ2hhbmdlID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuICBvblRvdWNoZWQgPSBGdW5jdGlvbi5wcm90b3R5cGU7XG4gIHBvc2l0aW9uczogQ29ubmVjdGlvblBvc2l0aW9uUGFpcltdID0gWy4uLkRFRkFVTFRfQ0FTQ0FERVJfUE9TSVRJT05TXTtcblxuICAvKipcbiAgICogRHJvcGRvd24ncyB3aXRoIGluIHBpeGVsLlxuICAgKi9cbiAgZHJvcGRvd25XaWR0aFN0eWxlPzogc3RyaW5nO1xuICBkcm9wZG93bkhlaWdodFN0eWxlOiAnYXV0bycgfCAnJyA9ICcnO1xuICBpc0ZvY3VzZWQgPSBmYWxzZTtcblxuICBsb2NhbGUhOiBOekNhc2NhZGVySTE4bkludGVyZmFjZTtcbiAgZGlyOiBEaXJlY3Rpb24gPSAnbHRyJztcblxuICBwcml2YXRlIGRlc3Ryb3kkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgcHJpdmF0ZSBpbnB1dFN0cmluZyA9ICcnO1xuICBwcml2YXRlIGlzT3BlbmluZyA9IGZhbHNlO1xuICBwcml2YXRlIGRlbGF5TWVudVRpbWVyOiBudW1iZXIgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSBkZWxheVNlbGVjdFRpbWVyOiBudW1iZXIgfCBudWxsID0gbnVsbDtcblxuICBnZXQgaW5TZWFyY2hpbmdNb2RlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmNhc2NhZGVyU2VydmljZS5pblNlYXJjaGluZ01vZGU7XG4gIH1cblxuICBzZXQgaW5wdXRWYWx1ZShpbnB1dFZhbHVlOiBzdHJpbmcpIHtcbiAgICB0aGlzLmlucHV0U3RyaW5nID0gaW5wdXRWYWx1ZTtcbiAgICB0aGlzLnRvZ2dsZVNlYXJjaGluZ01vZGUoISFpbnB1dFZhbHVlKTtcbiAgfVxuXG4gIGdldCBpbnB1dFZhbHVlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuaW5wdXRTdHJpbmc7XG4gIH1cblxuICBnZXQgbWVudUNscygpOiBOZ0NsYXNzVHlwZSB7XG4gICAgcmV0dXJuIHsgW2Ake3RoaXMubnpNZW51Q2xhc3NOYW1lfWBdOiAhIXRoaXMubnpNZW51Q2xhc3NOYW1lIH07XG4gIH1cblxuICBnZXQgbWVudUNvbHVtbkNscygpOiBOZ0NsYXNzVHlwZSB7XG4gICAgcmV0dXJuIHsgW2Ake3RoaXMubnpDb2x1bW5DbGFzc05hbWV9YF06ICEhdGhpcy5uekNvbHVtbkNsYXNzTmFtZSB9O1xuICB9XG5cbiAgcHJpdmF0ZSBnZXQgaGFzSW5wdXQoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEhdGhpcy5pbnB1dFZhbHVlO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXQgaGFzVmFsdWUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY2FzY2FkZXJTZXJ2aWNlLnZhbHVlcyAmJiB0aGlzLmNhc2NhZGVyU2VydmljZS52YWx1ZXMubGVuZ3RoID4gMDtcbiAgfVxuXG4gIGdldCBzaG93UGxhY2Vob2xkZXIoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuICEodGhpcy5oYXNJbnB1dCB8fCB0aGlzLmhhc1ZhbHVlKTtcbiAgfVxuXG4gIGdldCBjbGVhckljb25WaXNpYmxlKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLm56QWxsb3dDbGVhciAmJiAhdGhpcy5uekRpc2FibGVkICYmICh0aGlzLmhhc1ZhbHVlIHx8IHRoaXMuaGFzSW5wdXQpO1xuICB9XG5cbiAgZ2V0IGlzTGFiZWxSZW5kZXJUZW1wbGF0ZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gISF0aGlzLm56TGFiZWxSZW5kZXI7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgY2FzY2FkZXJTZXJ2aWNlOiBOekNhc2NhZGVyU2VydmljZSxcbiAgICBwdWJsaWMgbnpDb25maWdTZXJ2aWNlOiBOekNvbmZpZ1NlcnZpY2UsXG4gICAgcHJpdmF0ZSBjZHI6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByaXZhdGUgaTE4blNlcnZpY2U6IE56STE4blNlcnZpY2UsXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgZGlyZWN0aW9uYWxpdHk6IERpcmVjdGlvbmFsaXR5LFxuICAgIEBIb3N0KCkgQE9wdGlvbmFsKCkgcHVibGljIG5vQW5pbWF0aW9uPzogTnpOb0FuaW1hdGlvbkRpcmVjdGl2ZVxuICApIHtcbiAgICB0aGlzLmVsID0gZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICAgIHRoaXMuY2FzY2FkZXJTZXJ2aWNlLndpdGhDb21wb25lbnQodGhpcyk7XG4gICAgcmVuZGVyZXIuYWRkQ2xhc3MoZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnYW50LWNhc2NhZGVyJyk7XG4gICAgcmVuZGVyZXIuYWRkQ2xhc3MoZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnYW50LWNhc2NhZGVyLXBpY2tlcicpO1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgY29uc3Qgc3J2ID0gdGhpcy5jYXNjYWRlclNlcnZpY2U7XG5cbiAgICBzcnYuJHJlZHJhdy5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIC8vIFRoZXNlIG9wZXJhdGlvbnMgd291bGQgbm90IG11dGF0ZSBkYXRhLlxuICAgICAgdGhpcy5jaGVja0NoaWxkcmVuKCk7XG4gICAgICB0aGlzLnNldERpc3BsYXlMYWJlbCgpO1xuICAgICAgdGhpcy5yZXBvc2l0aW9uKCk7XG4gICAgICB0aGlzLnNldERyb3Bkb3duU3R5bGVzKCk7XG5cbiAgICAgIHRoaXMuY2RyLm1hcmtGb3JDaGVjaygpO1xuICAgIH0pO1xuXG4gICAgc3J2LiRsb2FkaW5nLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKS5zdWJzY3JpYmUobG9hZGluZyA9PiB7XG4gICAgICB0aGlzLmlzTG9hZGluZyA9IGxvYWRpbmc7XG4gICAgfSk7XG5cbiAgICBzcnYuJG9wdGlvblNlbGVjdGVkLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKS5zdWJzY3JpYmUoZGF0YSA9PiB7XG4gICAgICBpZiAoIWRhdGEpIHtcbiAgICAgICAgdGhpcy5vbkNoYW5nZShbXSk7XG4gICAgICAgIHRoaXMubnpTZWxlY3QuZW1pdChudWxsKTtcbiAgICAgICAgdGhpcy5uelNlbGVjdGlvbkNoYW5nZS5lbWl0KFtdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHsgb3B0aW9uLCBpbmRleCB9ID0gZGF0YTtcbiAgICAgICAgY29uc3Qgc2hvdWxkQ2xvc2UgPSBvcHRpb24uaXNMZWFmIHx8ICh0aGlzLm56Q2hhbmdlT25TZWxlY3QgJiYgdGhpcy5uekV4cGFuZFRyaWdnZXIgPT09ICdob3ZlcicpO1xuICAgICAgICBpZiAoc2hvdWxkQ2xvc2UpIHtcbiAgICAgICAgICB0aGlzLmRlbGF5U2V0TWVudVZpc2libGUoZmFsc2UpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMub25DaGFuZ2UodGhpcy5jYXNjYWRlclNlcnZpY2UudmFsdWVzKTtcbiAgICAgICAgdGhpcy5uelNlbGVjdGlvbkNoYW5nZS5lbWl0KHRoaXMuY2FzY2FkZXJTZXJ2aWNlLnNlbGVjdGVkT3B0aW9ucyk7XG4gICAgICAgIHRoaXMubnpTZWxlY3QuZW1pdCh7IG9wdGlvbiwgaW5kZXggfSk7XG4gICAgICAgIHRoaXMuY2RyLm1hcmtGb3JDaGVjaygpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgc3J2LiRxdWl0U2VhcmNoaW5nLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5pbnB1dFN0cmluZyA9ICcnO1xuICAgICAgdGhpcy5kcm9wZG93bldpZHRoU3R5bGUgPSAnJztcbiAgICB9KTtcblxuICAgIHRoaXMuaTE4blNlcnZpY2UubG9jYWxlQ2hhbmdlLnBpcGUoc3RhcnRXaXRoKCksIHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuc2V0TG9jYWxlKCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLm56Q29uZmlnU2VydmljZVxuICAgICAgLmdldENvbmZpZ0NoYW5nZUV2ZW50Rm9yQ29tcG9uZW50KE5aX0NPTkZJR19NT0RVTEVfTkFNRSlcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSlcbiAgICAgIC5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgICB0aGlzLmNkci5tYXJrRm9yQ2hlY2soKTtcbiAgICAgIH0pO1xuXG4gICAgdGhpcy5kaXIgPSB0aGlzLmRpcmVjdGlvbmFsaXR5LnZhbHVlO1xuICAgIHRoaXMuZGlyZWN0aW9uYWxpdHkuY2hhbmdlPy5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSkuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgIHRoaXMuZGlyID0gdGhpcy5kaXJlY3Rpb25hbGl0eS52YWx1ZTtcbiAgICAgIHNydi4kcmVkcmF3Lm5leHQoKTtcbiAgICB9KTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuZGVzdHJveSQubmV4dCgpO1xuICAgIHRoaXMuZGVzdHJveSQuY29tcGxldGUoKTtcbiAgICB0aGlzLmNsZWFyRGVsYXlNZW51VGltZXIoKTtcbiAgICB0aGlzLmNsZWFyRGVsYXlTZWxlY3RUaW1lcigpO1xuICB9XG5cbiAgcmVnaXN0ZXJPbkNoYW5nZShmbjogKCkgPT4ge30pOiB2b2lkIHtcbiAgICB0aGlzLm9uQ2hhbmdlID0gZm47XG4gIH1cblxuICByZWdpc3Rlck9uVG91Y2hlZChmbjogKCkgPT4ge30pOiB2b2lkIHtcbiAgICB0aGlzLm9uVG91Y2hlZCA9IGZuO1xuICB9XG5cbiAgd3JpdGVWYWx1ZSh2YWx1ZTogTnpTYWZlQW55KTogdm9pZCB7XG4gICAgdGhpcy5jYXNjYWRlclNlcnZpY2UudmFsdWVzID0gdG9BcnJheSh2YWx1ZSk7XG4gICAgdGhpcy5jYXNjYWRlclNlcnZpY2Uuc3luY09wdGlvbnModHJ1ZSk7XG4gIH1cblxuICBkZWxheVNldE1lbnVWaXNpYmxlKHZpc2libGU6IGJvb2xlYW4sIGRlbGF5OiBudW1iZXIgPSAxMDAsIHNldE9wZW5pbmc6IGJvb2xlYW4gPSBmYWxzZSk6IHZvaWQge1xuICAgIHRoaXMuY2xlYXJEZWxheU1lbnVUaW1lcigpO1xuICAgIGlmIChkZWxheSkge1xuICAgICAgaWYgKHZpc2libGUgJiYgc2V0T3BlbmluZykge1xuICAgICAgICB0aGlzLmlzT3BlbmluZyA9IHRydWU7XG4gICAgICB9XG4gICAgICB0aGlzLmRlbGF5TWVudVRpbWVyID0gc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIHRoaXMuc2V0TWVudVZpc2libGUodmlzaWJsZSk7XG4gICAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgdGhpcy5jbGVhckRlbGF5TWVudVRpbWVyKCk7XG4gICAgICAgIGlmICh2aXNpYmxlKSB7XG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aGlzLmlzT3BlbmluZyA9IGZhbHNlO1xuICAgICAgICAgIH0sIDEwMCk7XG4gICAgICAgIH1cbiAgICAgIH0sIGRlbGF5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5zZXRNZW51VmlzaWJsZSh2aXNpYmxlKTtcbiAgICB9XG4gIH1cblxuICBzZXRNZW51VmlzaWJsZSh2aXNpYmxlOiBib29sZWFuKTogdm9pZCB7XG4gICAgaWYgKHRoaXMubnpEaXNhYmxlZCB8fCB0aGlzLm1lbnVWaXNpYmxlID09PSB2aXNpYmxlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmICh2aXNpYmxlKSB7XG4gICAgICB0aGlzLmNhc2NhZGVyU2VydmljZS5zeW5jT3B0aW9ucygpO1xuICAgICAgdGhpcy5zY3JvbGxUb0FjdGl2YXRlZE9wdGlvbnMoKTtcbiAgICB9XG5cbiAgICBpZiAoIXZpc2libGUpIHtcbiAgICAgIHRoaXMuaW5wdXRWYWx1ZSA9ICcnO1xuICAgIH1cblxuICAgIHRoaXMubWVudVZpc2libGUgPSB2aXNpYmxlO1xuICAgIHRoaXMubnpWaXNpYmxlQ2hhbmdlLmVtaXQodmlzaWJsZSk7XG4gICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICB9XG5cbiAgcHJpdmF0ZSBjbGVhckRlbGF5TWVudVRpbWVyKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmRlbGF5TWVudVRpbWVyKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5kZWxheU1lbnVUaW1lcik7XG4gICAgICB0aGlzLmRlbGF5TWVudVRpbWVyID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICBjbGVhclNlbGVjdGlvbihldmVudD86IEV2ZW50KTogdm9pZCB7XG4gICAgaWYgKGV2ZW50KSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfVxuXG4gICAgdGhpcy5sYWJlbFJlbmRlclRleHQgPSAnJztcbiAgICB0aGlzLmxhYmVsUmVuZGVyQ29udGV4dCA9IHt9O1xuICAgIHRoaXMuaW5wdXRWYWx1ZSA9ICcnO1xuICAgIHRoaXMuc2V0TWVudVZpc2libGUoZmFsc2UpO1xuICAgIHRoaXMuY2FzY2FkZXJTZXJ2aWNlLmNsZWFyKCk7XG4gIH1cblxuICBnZXRTdWJtaXRWYWx1ZSgpOiBOelNhZmVBbnlbXSB7XG4gICAgcmV0dXJuIHRoaXMuY2FzY2FkZXJTZXJ2aWNlLnNlbGVjdGVkT3B0aW9ucy5tYXAobyA9PiB0aGlzLmNhc2NhZGVyU2VydmljZS5nZXRPcHRpb25WYWx1ZShvKSk7XG4gIH1cblxuICBmb2N1cygpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuaXNGb2N1c2VkKSB7XG4gICAgICAodGhpcy5pbnB1dCA/IHRoaXMuaW5wdXQubmF0aXZlRWxlbWVudCA6IHRoaXMuZWwpLmZvY3VzKCk7XG4gICAgICB0aGlzLmlzRm9jdXNlZCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgYmx1cigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5pc0ZvY3VzZWQpIHtcbiAgICAgICh0aGlzLmlucHV0ID8gdGhpcy5pbnB1dC5uYXRpdmVFbGVtZW50IDogdGhpcy5lbCkuYmx1cigpO1xuICAgICAgdGhpcy5pc0ZvY3VzZWQgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICBoYW5kbGVJbnB1dEJsdXIoKTogdm9pZCB7XG4gICAgdGhpcy5tZW51VmlzaWJsZSA/IHRoaXMuZm9jdXMoKSA6IHRoaXMuYmx1cigpO1xuICB9XG5cbiAgaGFuZGxlSW5wdXRGb2N1cygpOiB2b2lkIHtcbiAgICB0aGlzLmZvY3VzKCk7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdrZXlkb3duJywgWyckZXZlbnQnXSlcbiAgb25LZXlEb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgY29uc3Qga2V5Q29kZSA9IGV2ZW50LmtleUNvZGU7XG5cbiAgICBpZiAoXG4gICAgICBrZXlDb2RlICE9PSBET1dOX0FSUk9XICYmXG4gICAgICBrZXlDb2RlICE9PSBVUF9BUlJPVyAmJlxuICAgICAga2V5Q29kZSAhPT0gTEVGVF9BUlJPVyAmJlxuICAgICAga2V5Q29kZSAhPT0gUklHSFRfQVJST1cgJiZcbiAgICAgIGtleUNvZGUgIT09IEVOVEVSICYmXG4gICAgICBrZXlDb2RlICE9PSBCQUNLU1BBQ0UgJiZcbiAgICAgIGtleUNvZGUgIT09IEVTQ0FQRVxuICAgICkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIFByZXNzIGFueSBrZXlzIGFib3ZlIHRvIHJlb3BlbiBtZW51LlxuICAgIGlmICghdGhpcy5tZW51VmlzaWJsZSAmJiBrZXlDb2RlICE9PSBCQUNLU1BBQ0UgJiYga2V5Q29kZSAhPT0gRVNDQVBFKSB7XG4gICAgICByZXR1cm4gdGhpcy5zZXRNZW51VmlzaWJsZSh0cnVlKTtcbiAgICB9XG5cbiAgICAvLyBNYWtlIHRoZXNlIGtleXMgd29yayBhcyBkZWZhdWx0IGluIHNlYXJjaGluZyBtb2RlLlxuICAgIGlmICh0aGlzLmluU2VhcmNoaW5nTW9kZSAmJiAoa2V5Q29kZSA9PT0gQkFDS1NQQUNFIHx8IGtleUNvZGUgPT09IExFRlRfQVJST1cgfHwga2V5Q29kZSA9PT0gUklHSFRfQVJST1cpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gSW50ZXJhY3Qgd2l0aCB0aGUgY29tcG9uZW50LlxuICAgIGlmICh0aGlzLm1lbnVWaXNpYmxlKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgaWYgKGtleUNvZGUgPT09IERPV05fQVJST1cpIHtcbiAgICAgICAgdGhpcy5tb3ZlVXBPckRvd24oZmFsc2UpO1xuICAgICAgfSBlbHNlIGlmIChrZXlDb2RlID09PSBVUF9BUlJPVykge1xuICAgICAgICB0aGlzLm1vdmVVcE9yRG93bih0cnVlKTtcbiAgICAgIH0gZWxzZSBpZiAoa2V5Q29kZSA9PT0gTEVGVF9BUlJPVykge1xuICAgICAgICB0aGlzLm1vdmVMZWZ0KCk7XG4gICAgICB9IGVsc2UgaWYgKGtleUNvZGUgPT09IFJJR0hUX0FSUk9XKSB7XG4gICAgICAgIHRoaXMubW92ZVJpZ2h0KCk7XG4gICAgICB9IGVsc2UgaWYgKGtleUNvZGUgPT09IEVOVEVSKSB7XG4gICAgICAgIHRoaXMub25FbnRlcigpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ2NsaWNrJylcbiAgb25UcmlnZ2VyQ2xpY2soKTogdm9pZCB7XG4gICAgaWYgKHRoaXMubnpEaXNhYmxlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpZiAodGhpcy5uelNob3dTZWFyY2gpIHtcbiAgICAgIHRoaXMuZm9jdXMoKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuaXNBY3Rpb25UcmlnZ2VyKCdjbGljaycpKSB7XG4gICAgICB0aGlzLmRlbGF5U2V0TWVudVZpc2libGUoIXRoaXMubWVudVZpc2libGUsIDEwMCk7XG4gICAgfVxuICAgIHRoaXMub25Ub3VjaGVkKCk7XG4gIH1cblxuICBASG9zdExpc3RlbmVyKCdtb3VzZWVudGVyJylcbiAgb25UcmlnZ2VyTW91c2VFbnRlcigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5uekRpc2FibGVkIHx8ICF0aGlzLmlzQWN0aW9uVHJpZ2dlcignaG92ZXInKSkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMuZGVsYXlTZXRNZW51VmlzaWJsZSh0cnVlLCB0aGlzLm56TW91c2VFbnRlckRlbGF5LCB0cnVlKTtcbiAgfVxuXG4gIEBIb3N0TGlzdGVuZXIoJ21vdXNlbGVhdmUnLCBbJyRldmVudCddKVxuICBvblRyaWdnZXJNb3VzZUxlYXZlKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgaWYgKHRoaXMubnpEaXNhYmxlZCB8fCAhdGhpcy5tZW51VmlzaWJsZSB8fCB0aGlzLmlzT3BlbmluZyB8fCAhdGhpcy5pc0FjdGlvblRyaWdnZXIoJ2hvdmVyJykpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IG1vdXNlVGFyZ2V0ID0gZXZlbnQucmVsYXRlZFRhcmdldCBhcyBIVE1MRWxlbWVudDtcbiAgICBjb25zdCBob3N0RWwgPSB0aGlzLmVsO1xuICAgIGNvbnN0IG1lbnVFbCA9IHRoaXMubWVudSAmJiAodGhpcy5tZW51Lm5hdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQpO1xuICAgIGlmIChob3N0RWwuY29udGFpbnMobW91c2VUYXJnZXQpIHx8IChtZW51RWwgJiYgbWVudUVsLmNvbnRhaW5zKG1vdXNlVGFyZ2V0KSkpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5kZWxheVNldE1lbnVWaXNpYmxlKGZhbHNlLCB0aGlzLm56TW91c2VMZWF2ZURlbGF5KTtcbiAgfVxuXG4gIG9uT3B0aW9uTW91c2VFbnRlcihvcHRpb246IE56Q2FzY2FkZXJPcHRpb24sIGNvbHVtbkluZGV4OiBudW1iZXIsIGV2ZW50OiBFdmVudCk6IHZvaWQge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgaWYgKHRoaXMubnpFeHBhbmRUcmlnZ2VyID09PSAnaG92ZXInKSB7XG4gICAgICBpZiAoIW9wdGlvbi5pc0xlYWYpIHtcbiAgICAgICAgdGhpcy5kZWxheVNldE9wdGlvbkFjdGl2YXRlZChvcHRpb24sIGNvbHVtbkluZGV4LCBmYWxzZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLmNhc2NhZGVyU2VydmljZS5zZXRPcHRpb25EZWFjdGl2YXRlZFNpbmNlQ29sdW1uKGNvbHVtbkluZGV4KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBvbk9wdGlvbk1vdXNlTGVhdmUob3B0aW9uOiBOekNhc2NhZGVyT3B0aW9uLCBfY29sdW1uSW5kZXg6IG51bWJlciwgZXZlbnQ6IEV2ZW50KTogdm9pZCB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICBpZiAodGhpcy5uekV4cGFuZFRyaWdnZXIgPT09ICdob3ZlcicgJiYgIW9wdGlvbi5pc0xlYWYpIHtcbiAgICAgIHRoaXMuY2xlYXJEZWxheVNlbGVjdFRpbWVyKCk7XG4gICAgfVxuICB9XG5cbiAgb25PcHRpb25DbGljayhvcHRpb246IE56Q2FzY2FkZXJPcHRpb24sIGNvbHVtbkluZGV4OiBudW1iZXIsIGV2ZW50OiBFdmVudCk6IHZvaWQge1xuICAgIGlmIChldmVudCkge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICB9XG4gICAgaWYgKG9wdGlvbiAmJiBvcHRpb24uZGlzYWJsZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5lbC5mb2N1cygpO1xuICAgIHRoaXMuaW5TZWFyY2hpbmdNb2RlXG4gICAgICA/IHRoaXMuY2FzY2FkZXJTZXJ2aWNlLnNldFNlYXJjaE9wdGlvblNlbGVjdGVkKG9wdGlvbiBhcyBOekNhc2NhZGVyU2VhcmNoT3B0aW9uKVxuICAgICAgOiB0aGlzLmNhc2NhZGVyU2VydmljZS5zZXRPcHRpb25BY3RpdmF0ZWQob3B0aW9uLCBjb2x1bW5JbmRleCwgdHJ1ZSk7XG4gIH1cblxuICBvbkNsaWNrT3V0c2lkZShldmVudDogTW91c2VFdmVudCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5lbC5jb250YWlucyhldmVudC50YXJnZXQgYXMgTm9kZSkpIHtcbiAgICAgIHRoaXMuY2xvc2VNZW51KCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBpc0FjdGlvblRyaWdnZXIoYWN0aW9uOiAnY2xpY2snIHwgJ2hvdmVyJyk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0eXBlb2YgdGhpcy5uelRyaWdnZXJBY3Rpb24gPT09ICdzdHJpbmcnID8gdGhpcy5uelRyaWdnZXJBY3Rpb24gPT09IGFjdGlvbiA6IHRoaXMubnpUcmlnZ2VyQWN0aW9uLmluZGV4T2YoYWN0aW9uKSAhPT0gLTE7XG4gIH1cblxuICBwcml2YXRlIG9uRW50ZXIoKTogdm9pZCB7XG4gICAgY29uc3QgY29sdW1uSW5kZXggPSBNYXRoLm1heCh0aGlzLmNhc2NhZGVyU2VydmljZS5hY3RpdmF0ZWRPcHRpb25zLmxlbmd0aCAtIDEsIDApO1xuICAgIGNvbnN0IG9wdGlvbiA9IHRoaXMuY2FzY2FkZXJTZXJ2aWNlLmFjdGl2YXRlZE9wdGlvbnNbY29sdW1uSW5kZXhdO1xuICAgIGlmIChvcHRpb24gJiYgIW9wdGlvbi5kaXNhYmxlZCkge1xuICAgICAgdGhpcy5pblNlYXJjaGluZ01vZGVcbiAgICAgICAgPyB0aGlzLmNhc2NhZGVyU2VydmljZS5zZXRTZWFyY2hPcHRpb25TZWxlY3RlZChvcHRpb24gYXMgTnpDYXNjYWRlclNlYXJjaE9wdGlvbilcbiAgICAgICAgOiB0aGlzLmNhc2NhZGVyU2VydmljZS5zZXRPcHRpb25BY3RpdmF0ZWQob3B0aW9uLCBjb2x1bW5JbmRleCwgdHJ1ZSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBtb3ZlVXBPckRvd24oaXNVcDogYm9vbGVhbik6IHZvaWQge1xuICAgIGNvbnN0IGNvbHVtbkluZGV4ID0gTWF0aC5tYXgodGhpcy5jYXNjYWRlclNlcnZpY2UuYWN0aXZhdGVkT3B0aW9ucy5sZW5ndGggLSAxLCAwKTtcbiAgICBjb25zdCBhY3RpdmVPcHRpb24gPSB0aGlzLmNhc2NhZGVyU2VydmljZS5hY3RpdmF0ZWRPcHRpb25zW2NvbHVtbkluZGV4XTtcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5jYXNjYWRlclNlcnZpY2UuY29sdW1uc1tjb2x1bW5JbmRleF0gfHwgW107XG4gICAgY29uc3QgbGVuZ3RoID0gb3B0aW9ucy5sZW5ndGg7XG4gICAgbGV0IG5leHRJbmRleCA9IC0xO1xuICAgIGlmICghYWN0aXZlT3B0aW9uKSB7XG4gICAgICAvLyBOb3Qgc2VsZWN0ZWQgb3B0aW9ucyBpbiB0aGlzIGNvbHVtblxuICAgICAgbmV4dEluZGV4ID0gaXNVcCA/IGxlbmd0aCA6IC0xO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXh0SW5kZXggPSBvcHRpb25zLmluZGV4T2YoYWN0aXZlT3B0aW9uKTtcbiAgICB9XG5cbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgbmV4dEluZGV4ID0gaXNVcCA/IG5leHRJbmRleCAtIDEgOiBuZXh0SW5kZXggKyAxO1xuICAgICAgaWYgKG5leHRJbmRleCA8IDAgfHwgbmV4dEluZGV4ID49IGxlbmd0aCkge1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIGNvbnN0IG5leHRPcHRpb24gPSBvcHRpb25zW25leHRJbmRleF07XG4gICAgICBpZiAoIW5leHRPcHRpb24gfHwgbmV4dE9wdGlvbi5kaXNhYmxlZCkge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHRoaXMuY2FzY2FkZXJTZXJ2aWNlLnNldE9wdGlvbkFjdGl2YXRlZChuZXh0T3B0aW9uLCBjb2x1bW5JbmRleCk7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIG1vdmVMZWZ0KCk6IHZvaWQge1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLmNhc2NhZGVyU2VydmljZS5hY3RpdmF0ZWRPcHRpb25zO1xuICAgIGlmIChvcHRpb25zLmxlbmd0aCkge1xuICAgICAgb3B0aW9ucy5wb3AoKTsgLy8gUmVtb3ZlIHRoZSBsYXN0IG9uZVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgbW92ZVJpZ2h0KCk6IHZvaWQge1xuICAgIGNvbnN0IGxlbmd0aCA9IHRoaXMuY2FzY2FkZXJTZXJ2aWNlLmFjdGl2YXRlZE9wdGlvbnMubGVuZ3RoO1xuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLmNhc2NhZGVyU2VydmljZS5jb2x1bW5zW2xlbmd0aF07XG4gICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5sZW5ndGgpIHtcbiAgICAgIGNvbnN0IG5leHRPcHQgPSBvcHRpb25zLmZpbmQobyA9PiAhby5kaXNhYmxlZCk7XG4gICAgICBpZiAobmV4dE9wdCkge1xuICAgICAgICB0aGlzLmNhc2NhZGVyU2VydmljZS5zZXRPcHRpb25BY3RpdmF0ZWQobmV4dE9wdCwgbGVuZ3RoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNsZWFyRGVsYXlTZWxlY3RUaW1lcigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5kZWxheVNlbGVjdFRpbWVyKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5kZWxheVNlbGVjdFRpbWVyKTtcbiAgICAgIHRoaXMuZGVsYXlTZWxlY3RUaW1lciA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBkZWxheVNldE9wdGlvbkFjdGl2YXRlZChvcHRpb246IE56Q2FzY2FkZXJPcHRpb24sIGNvbHVtbkluZGV4OiBudW1iZXIsIHBlcmZvcm1TZWxlY3Q6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLmNsZWFyRGVsYXlTZWxlY3RUaW1lcigpO1xuICAgIHRoaXMuZGVsYXlTZWxlY3RUaW1lciA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5jYXNjYWRlclNlcnZpY2Uuc2V0T3B0aW9uQWN0aXZhdGVkKG9wdGlvbiwgY29sdW1uSW5kZXgsIHBlcmZvcm1TZWxlY3QpO1xuICAgICAgdGhpcy5kZWxheVNlbGVjdFRpbWVyID0gbnVsbDtcbiAgICB9LCAxNTApO1xuICB9XG5cbiAgcHJpdmF0ZSB0b2dnbGVTZWFyY2hpbmdNb2RlKHRvU2VhcmNoaW5nOiBib29sZWFuKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaW5TZWFyY2hpbmdNb2RlICE9PSB0b1NlYXJjaGluZykge1xuICAgICAgdGhpcy5jYXNjYWRlclNlcnZpY2UudG9nZ2xlU2VhcmNoaW5nTW9kZSh0b1NlYXJjaGluZyk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuaW5TZWFyY2hpbmdNb2RlKSB7XG4gICAgICB0aGlzLmNhc2NhZGVyU2VydmljZS5wcmVwYXJlU2VhcmNoT3B0aW9ucyh0aGlzLmlucHV0VmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIGlzT3B0aW9uQWN0aXZhdGVkKG9wdGlvbjogTnpDYXNjYWRlck9wdGlvbiwgaW5kZXg6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgIGNvbnN0IGFjdGl2ZU9wdCA9IHRoaXMuY2FzY2FkZXJTZXJ2aWNlLmFjdGl2YXRlZE9wdGlvbnNbaW5kZXhdO1xuICAgIHJldHVybiBhY3RpdmVPcHQgPT09IG9wdGlvbjtcbiAgfVxuXG4gIHNldERpc2FibGVkU3RhdGUoaXNEaXNhYmxlZDogYm9vbGVhbik6IHZvaWQge1xuICAgIGlmIChpc0Rpc2FibGVkKSB7XG4gICAgICB0aGlzLmNsb3NlTWVudSgpO1xuICAgIH1cbiAgICB0aGlzLm56RGlzYWJsZWQgPSBpc0Rpc2FibGVkO1xuICB9XG5cbiAgY2xvc2VNZW51KCk6IHZvaWQge1xuICAgIHRoaXMuYmx1cigpO1xuICAgIHRoaXMuY2xlYXJEZWxheU1lbnVUaW1lcigpO1xuICAgIHRoaXMuc2V0TWVudVZpc2libGUoZmFsc2UpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcG9zaXRpb24gdGhlIGNhc2NhZGVyIHBhbmVsLiBXaGVuIGEgbWVudSBvcGVucywgdGhlIGNhc2NhZGVyIGV4cGFuZHNcbiAgICogYW5kIG1heSBleGNlZWQgdGhlIGJvdW5kYXJ5IG9mIGJyb3dzZXIncyB3aW5kb3cuXG4gICAqL1xuICBwcml2YXRlIHJlcG9zaXRpb24oKTogdm9pZCB7XG4gICAgaWYgKHRoaXMub3ZlcmxheSAmJiB0aGlzLm92ZXJsYXkub3ZlcmxheVJlZiAmJiB0aGlzLm1lbnVWaXNpYmxlKSB7XG4gICAgICBQcm9taXNlLnJlc29sdmUoKS50aGVuKCgpID0+IHtcbiAgICAgICAgdGhpcy5vdmVybGF5Lm92ZXJsYXlSZWYudXBkYXRlUG9zaXRpb24oKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBXaGVuIGEgY2FzY2FkZXIgb3B0aW9ucyBpcyBjaGFuZ2VkLCBhIGNoaWxkIG5lZWRzIHRvIGtub3cgdGhhdCBpdCBzaG91bGQgcmUtcmVuZGVyLlxuICAgKi9cbiAgcHJpdmF0ZSBjaGVja0NoaWxkcmVuKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmNhc2NhZGVySXRlbXMpIHtcbiAgICAgIHRoaXMuY2FzY2FkZXJJdGVtcy5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5tYXJrRm9yQ2hlY2soKSk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzZXREaXNwbGF5TGFiZWwoKTogdm9pZCB7XG4gICAgY29uc3Qgc2VsZWN0ZWRPcHRpb25zID0gdGhpcy5jYXNjYWRlclNlcnZpY2Uuc2VsZWN0ZWRPcHRpb25zO1xuICAgIGNvbnN0IGxhYmVsczogc3RyaW5nW10gPSBzZWxlY3RlZE9wdGlvbnMubWFwKG8gPT4gdGhpcy5jYXNjYWRlclNlcnZpY2UuZ2V0T3B0aW9uTGFiZWwobykpO1xuXG4gICAgaWYgKHRoaXMuaXNMYWJlbFJlbmRlclRlbXBsYXRlKSB7XG4gICAgICB0aGlzLmxhYmVsUmVuZGVyQ29udGV4dCA9IHsgbGFiZWxzLCBzZWxlY3RlZE9wdGlvbnMgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5sYWJlbFJlbmRlclRleHQgPSBkZWZhdWx0RGlzcGxheVJlbmRlci5jYWxsKHRoaXMsIGxhYmVscyk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzZXREcm9wZG93blN0eWxlcygpOiB2b2lkIHtcbiAgICBjb25zdCBmaXJzdENvbHVtbiA9IHRoaXMuY2FzY2FkZXJTZXJ2aWNlLmNvbHVtbnNbMF07XG5cbiAgICB0aGlzLnNob3VsZFNob3dFbXB0eSA9XG4gICAgICAodGhpcy5pblNlYXJjaGluZ01vZGUgJiYgKCFmaXJzdENvbHVtbiB8fCAhZmlyc3RDb2x1bW4ubGVuZ3RoKSkgfHwgLy8gU2hvdWxkIHNob3cgZW1wdHkgd2hlbiB0aGVyZSdzIG5vIHNlYXJjaGluZyByZXN1bHRcbiAgICAgICghKHRoaXMubnpPcHRpb25zICYmIHRoaXMubnpPcHRpb25zLmxlbmd0aCkgJiYgIXRoaXMubnpMb2FkRGF0YSk7IC8vIFNob3VsZCBzaG93IHdoZW4gdGhlcmUncyBubyBvcHRpb25zIGFuZCBkZXZlbG9wZXIgZG9lcyBub3QgdXNlIG56TG9hZERhdGFcbiAgICB0aGlzLmRyb3Bkb3duSGVpZ2h0U3R5bGUgPSB0aGlzLnNob3VsZFNob3dFbXB0eSA/ICdhdXRvJyA6ICcnO1xuXG4gICAgaWYgKHRoaXMuaW5wdXQpIHtcbiAgICAgIHRoaXMuZHJvcGRvd25XaWR0aFN0eWxlID0gdGhpcy5pblNlYXJjaGluZ01vZGUgfHwgdGhpcy5zaG91bGRTaG93RW1wdHkgPyBgJHt0aGlzLmlucHV0Lm5hdGl2ZUVsZW1lbnQub2Zmc2V0V2lkdGh9cHhgIDogJyc7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzZXRMb2NhbGUoKTogdm9pZCB7XG4gICAgdGhpcy5sb2NhbGUgPSB0aGlzLmkxOG5TZXJ2aWNlLmdldExvY2FsZURhdGEoJ2dsb2JhbCcpO1xuICAgIHRoaXMuY2RyLm1hcmtGb3JDaGVjaygpO1xuICB9XG5cbiAgcHJpdmF0ZSBzY3JvbGxUb0FjdGl2YXRlZE9wdGlvbnMoKTogdm9pZCB7XG4gICAgLy8gc2Nyb2xsIG9ubHkgdW50aWwgb3B0aW9uIG1lbnUgdmlldyBpcyByZWFkeVxuICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgdGhpcy5jYXNjYWRlckl0ZW1zXG4gICAgICAgIC50b0FycmF5KClcbiAgICAgICAgLmZpbHRlcihlID0+IGUuYWN0aXZhdGVkKVxuICAgICAgICAuZm9yRWFjaChlID0+IHtcbiAgICAgICAgICBlLm5hdGl2ZUVsZW1lbnQ/LnNjcm9sbEludG9WaWV3KHsgYmxvY2s6ICdzdGFydCcsIGlubGluZTogJ25lYXJlc3QnIH0pO1xuICAgICAgICB9KTtcbiAgICB9KTtcbiAgfVxufVxuIl19