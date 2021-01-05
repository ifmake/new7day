/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { FocusKeyManager } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { coerceNumberProperty } from '@angular/cdk/coercion';
import { DOWN_ARROW, ENTER, hasModifierKey, LEFT_ARROW, RIGHT_ARROW, SPACE, UP_ARROW } from '@angular/cdk/keycodes';
import { ViewportRuler } from '@angular/cdk/overlay';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, ElementRef, EventEmitter, Input, NgZone, Optional, Output, QueryList, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { animationFrameScheduler, asapScheduler, merge, of, Subject } from 'rxjs';
import { auditTime, takeUntil } from 'rxjs/operators';
import { reqAnimFrame } from 'ng-zorro-antd/core/polyfill';
import { NzResizeObserver } from 'ng-zorro-antd/core/resize-observers';
import { NzTabAddButtonComponent } from './tab-add-button.component';
import { NzTabNavItemDirective } from './tab-nav-item.directive';
import { NzTabNavOperationComponent } from './tab-nav-operation.component';
import { NzTabsInkBarDirective } from './tabs-ink-bar.directive';
const RESIZE_SCHEDULER = typeof requestAnimationFrame !== 'undefined' ? animationFrameScheduler : asapScheduler;
const CSS_TRANSFORM_TIME = 150;
export class NzTabNavBarComponent {
    constructor(cdr, ngZone, viewportRuler, nzResizeObserver, dir) {
        this.cdr = cdr;
        this.ngZone = ngZone;
        this.viewportRuler = viewportRuler;
        this.nzResizeObserver = nzResizeObserver;
        this.dir = dir;
        this.indexFocused = new EventEmitter();
        this.selectFocusedIndex = new EventEmitter();
        this.addClicked = new EventEmitter();
        this.tabScroll = new EventEmitter();
        this.position = 'horizontal';
        this.addable = false;
        this.hideBar = false;
        this.addIcon = 'plus';
        this.inkBarAnimated = true;
        this.translate = null;
        this.transformX = 0;
        this.transformY = 0;
        this.pingLeft = false;
        this.pingRight = false;
        this.pingTop = false;
        this.pingBottom = false;
        this.hiddenItems = [];
        this.destroy$ = new Subject();
        this._selectedIndex = 0;
        this.wrapperWidth = 0;
        this.wrapperHeight = 0;
        this.scrollListWidth = 0;
        this.scrollListHeight = 0;
        this.operationWidth = 0;
        this.operationHeight = 0;
        this.addButtonWidth = 0;
        this.addButtonHeight = 0;
        this.selectedIndexChanged = false;
        this.lockAnimationTimeoutId = -1;
        this.cssTransformTimeWaitingId = -1;
    }
    get selectedIndex() {
        return this._selectedIndex;
    }
    set selectedIndex(value) {
        const newValue = coerceNumberProperty(value);
        if (this._selectedIndex !== newValue) {
            this._selectedIndex = value;
            this.selectedIndexChanged = true;
            if (this.keyManager) {
                this.keyManager.updateActiveItem(value);
            }
        }
    }
    /** Tracks which element has focus; used for keyboard navigation */
    get focusIndex() {
        return this.keyManager ? this.keyManager.activeItemIndex : 0;
    }
    /** When the focus index is set, we must manually send focus to the correct label */
    set focusIndex(value) {
        if (!this.isValidIndex(value) || this.focusIndex === value || !this.keyManager) {
            return;
        }
        this.keyManager.setActiveItem(value);
    }
    get showAddButton() {
        return this.hiddenItems.length === 0 && this.addable;
    }
    ngOnInit() { }
    ngAfterViewInit() {
        const dirChange = this.dir ? this.dir.change : of(null);
        const resize = this.viewportRuler.change(150);
        const realign = () => {
            this.updateScrollListPosition();
            this.alignInkBarToSelectedTab();
        };
        this.keyManager = new FocusKeyManager(this.items)
            .withHorizontalOrientation(this.getLayoutDirection())
            .withWrap();
        this.keyManager.updateActiveItem(0);
        reqAnimFrame(realign);
        merge(this.nzResizeObserver.observe(this.navWarpRef), this.nzResizeObserver.observe(this.navListRef))
            .pipe(takeUntil(this.destroy$), auditTime(16, RESIZE_SCHEDULER))
            .subscribe(() => {
            realign();
        });
        merge(dirChange, resize, this.items.changes)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
            Promise.resolve().then(realign);
            this.keyManager.withHorizontalOrientation(this.getLayoutDirection());
        });
        this.keyManager.change.pipe(takeUntil(this.destroy$)).subscribe(newFocusIndex => {
            this.indexFocused.emit(newFocusIndex);
            this.setTabFocus(newFocusIndex);
            this.scrollToTab(this.keyManager.activeItem);
        });
    }
    ngAfterContentChecked() {
        if (this.selectedIndexChanged) {
            this.updateScrollListPosition();
            this.alignInkBarToSelectedTab();
            this.selectedIndexChanged = false;
            this.cdr.markForCheck();
        }
    }
    ngOnDestroy() {
        clearTimeout(this.lockAnimationTimeoutId);
        clearTimeout(this.cssTransformTimeWaitingId);
        this.destroy$.next();
        this.destroy$.complete();
    }
    onSelectedFromMenu(tab) {
        const tabIndex = this.items.toArray().findIndex(e => e === tab);
        if (tabIndex !== -1) {
            this.keyManager.updateActiveItem(tabIndex);
            if (this.focusIndex !== this.selectedIndex) {
                this.selectFocusedIndex.emit(this.focusIndex);
                this.scrollToTab(tab);
            }
        }
    }
    onOffsetChange(e) {
        if (this.position === 'horizontal') {
            if (this.lockAnimationTimeoutId === -1) {
                if (this.transformX >= 0 && e.x > 0) {
                    return;
                }
                if (this.transformX <= this.wrapperWidth - this.scrollListWidth && e.x < 0) {
                    return;
                }
            }
            e.event.preventDefault();
            this.transformX = this.clampTransformX(this.transformX + e.x);
            this.setTransform(this.transformX, 0);
        }
        else {
            if (this.lockAnimationTimeoutId === -1) {
                if (this.transformY >= 0 && e.y > 0) {
                    return;
                }
                if (this.transformY <= this.wrapperHeight - this.scrollListHeight && e.y < 0) {
                    return;
                }
            }
            e.event.preventDefault();
            this.transformY = this.clampTransformY(this.transformY + e.y);
            this.setTransform(0, this.transformY);
        }
        this.lockAnimation();
        this.setVisibleRange();
        this.setPingStatus();
    }
    handleKeydown(event) {
        const inNavigationList = this.navWarpRef.nativeElement.contains(event.target);
        if (hasModifierKey(event) || !inNavigationList) {
            return;
        }
        switch (event.keyCode) {
            case LEFT_ARROW:
            case UP_ARROW:
            case RIGHT_ARROW:
            case DOWN_ARROW:
                this.lockAnimation();
                this.keyManager.onKeydown(event);
                break;
            case ENTER:
            case SPACE:
                if (this.focusIndex !== this.selectedIndex) {
                    this.selectFocusedIndex.emit(this.focusIndex);
                }
                break;
            default:
                this.keyManager.onKeydown(event);
        }
    }
    isValidIndex(index) {
        if (!this.items) {
            return true;
        }
        const tab = this.items ? this.items.toArray()[index] : null;
        return !!tab && !tab.disabled;
    }
    scrollToTab(tab) {
        if (!this.items.find(e => e === tab)) {
            return;
        }
        const tabs = this.items.toArray();
        if (this.position === 'horizontal') {
            let newTransform = this.transformX;
            if (this.getLayoutDirection() === 'rtl') {
                const right = tabs[0].left + tabs[0].width - tab.left - tab.width;
                if (right < this.transformX) {
                    newTransform = right;
                }
                else if (right + tab.width > this.transformX + this.wrapperWidth) {
                    newTransform = right + tab.width - this.wrapperWidth;
                }
            }
            else if (tab.left < -this.transformX) {
                newTransform = -tab.left;
            }
            else if (tab.left + tab.width > -this.transformX + this.wrapperWidth) {
                newTransform = -(tab.left + tab.width - this.wrapperWidth);
            }
            this.transformX = newTransform;
            this.transformY = 0;
            this.setTransform(newTransform, 0);
        }
        else {
            let newTransform = this.transformY;
            if (tab.top < -this.transformY) {
                newTransform = -tab.top;
            }
            else if (tab.top + tab.height > -this.transformY + this.wrapperHeight) {
                newTransform = -(tab.top + tab.height - this.wrapperHeight);
            }
            this.transformY = newTransform;
            this.transformX = 0;
            this.setTransform(0, newTransform);
        }
        clearTimeout(this.cssTransformTimeWaitingId);
        this.cssTransformTimeWaitingId = setTimeout(() => {
            this.setVisibleRange();
        }, CSS_TRANSFORM_TIME);
    }
    lockAnimation() {
        if (this.lockAnimationTimeoutId === -1) {
            this.ngZone.runOutsideAngular(() => {
                this.navListRef.nativeElement.style.transition = 'none';
                this.lockAnimationTimeoutId = setTimeout(() => {
                    this.navListRef.nativeElement.style.transition = '';
                    this.lockAnimationTimeoutId = -1;
                }, CSS_TRANSFORM_TIME);
            });
        }
    }
    setTransform(x, y) {
        this.navListRef.nativeElement.style.transform = `translate(${x}px, ${y}px)`;
    }
    clampTransformX(transform) {
        const scrollWidth = this.wrapperWidth - this.scrollListWidth;
        if (this.getLayoutDirection() === 'rtl') {
            return Math.max(Math.min(scrollWidth, transform), 0);
        }
        else {
            return Math.min(Math.max(scrollWidth, transform), 0);
        }
    }
    clampTransformY(transform) {
        return Math.min(Math.max(this.wrapperHeight - this.scrollListHeight, transform), 0);
    }
    updateScrollListPosition() {
        this.resetSizes();
        this.transformX = this.clampTransformX(this.transformX);
        this.transformY = this.clampTransformY(this.transformY);
        this.setVisibleRange();
        this.setPingStatus();
        if (this.keyManager) {
            this.keyManager.updateActiveItem(this.keyManager.activeItemIndex);
            if (this.keyManager.activeItem) {
                this.scrollToTab(this.keyManager.activeItem);
            }
        }
    }
    resetSizes() {
        this.addButtonWidth = this.addBtnRef ? this.addBtnRef.getElementWidth() : 0;
        this.addButtonHeight = this.addBtnRef ? this.addBtnRef.getElementHeight() : 0;
        this.operationWidth = this.operationRef.getElementWidth();
        this.operationHeight = this.operationRef.getElementHeight();
        this.wrapperWidth = this.navWarpRef.nativeElement.offsetWidth || 0;
        this.wrapperHeight = this.navWarpRef.nativeElement.offsetHeight || 0;
        this.scrollListHeight = this.navListRef.nativeElement.offsetHeight || 0;
        this.scrollListWidth = this.navListRef.nativeElement.offsetWidth || 0;
    }
    alignInkBarToSelectedTab() {
        const selectedItem = this.items && this.items.length ? this.items.toArray()[this.selectedIndex] : null;
        const selectedItemElement = selectedItem ? selectedItem.elementRef.nativeElement : null;
        if (selectedItemElement) {
            /**
             * .ant-tabs-nav-list - Target offset parent element
             *   └──.ant-tabs-tab
             *        └──.ant-tabs-tab-btn - Currently focused element
             */
            this.inkBar.alignToElement(selectedItemElement.parentElement);
        }
    }
    setPingStatus() {
        const ping = {
            top: false,
            right: false,
            bottom: false,
            left: false
        };
        const navWarp = this.navWarpRef.nativeElement;
        if (this.position === 'horizontal') {
            if (this.getLayoutDirection() === 'rtl') {
                ping.right = this.transformX > 0;
                ping.left = this.transformX + this.wrapperWidth < this.scrollListWidth;
            }
            else {
                ping.left = this.transformX < 0;
                ping.right = -this.transformX + this.wrapperWidth < this.scrollListWidth;
            }
        }
        else {
            ping.top = this.transformY < 0;
            ping.bottom = -this.transformY + this.wrapperHeight < this.scrollListHeight;
        }
        Object.keys(ping).forEach(pos => {
            const className = `ant-tabs-nav-wrap-ping-${pos}`;
            if (ping[pos]) {
                navWarp.classList.add(className);
            }
            else {
                navWarp.classList.remove(className);
            }
        });
    }
    setVisibleRange() {
        let unit;
        let position;
        let transformSize;
        let basicSize;
        let tabContentSize;
        let addSize;
        const tabs = this.items.toArray();
        const DEFAULT_SIZE = { width: 0, height: 0, left: 0, top: 0, right: 0 };
        const getOffset = (index) => {
            let offset;
            const size = tabs[index] || DEFAULT_SIZE;
            if (position === 'right') {
                offset = tabs[0].left + tabs[0].width - tabs[index].left - tabs[index].width;
            }
            else {
                offset = size[position];
            }
            return offset;
        };
        if (this.position === 'horizontal') {
            unit = 'width';
            basicSize = this.wrapperWidth;
            tabContentSize = this.scrollListWidth - (this.hiddenItems.length ? this.operationWidth : 0);
            addSize = this.addButtonWidth;
            transformSize = Math.abs(this.transformX);
            if (this.getLayoutDirection() === 'rtl') {
                position = 'right';
                this.pingRight = this.transformX > 0;
                this.pingLeft = this.transformX + this.wrapperWidth < this.scrollListWidth;
            }
            else {
                this.pingLeft = this.transformX < 0;
                this.pingRight = -this.transformX + this.wrapperWidth < this.scrollListWidth;
                position = 'left';
            }
        }
        else {
            unit = 'height';
            basicSize = this.wrapperHeight;
            tabContentSize = this.scrollListHeight - (this.hiddenItems.length ? this.operationHeight : 0);
            addSize = this.addButtonHeight;
            position = 'top';
            transformSize = -this.transformY;
            this.pingTop = this.transformY < 0;
            this.pingBottom = -this.transformY + this.wrapperHeight < this.scrollListHeight;
        }
        let mergedBasicSize = basicSize;
        if (tabContentSize + addSize > basicSize) {
            mergedBasicSize = basicSize - addSize;
        }
        if (!tabs.length) {
            this.hiddenItems = [];
            this.cdr.markForCheck();
            return;
        }
        const len = tabs.length;
        let endIndex = len;
        for (let i = 0; i < len; i += 1) {
            const offset = getOffset(i);
            const size = tabs[i] || DEFAULT_SIZE;
            if (offset + size[unit] > transformSize + mergedBasicSize) {
                endIndex = i - 1;
                break;
            }
        }
        let startIndex = 0;
        for (let i = len - 1; i >= 0; i -= 1) {
            const offset = getOffset(i);
            if (offset < transformSize) {
                startIndex = i + 1;
                break;
            }
        }
        const startHiddenTabs = tabs.slice(0, startIndex);
        const endHiddenTabs = tabs.slice(endIndex + 1);
        this.hiddenItems = [...startHiddenTabs, ...endHiddenTabs];
        this.cdr.markForCheck();
    }
    getLayoutDirection() {
        return this.dir && this.dir.value === 'rtl' ? 'rtl' : 'ltr';
    }
    setTabFocus(_tabIndex) { }
    ngOnChanges(changes) {
        const { position } = changes;
        // The first will be aligning in ngAfterViewInit
        if (position && !position.isFirstChange()) {
            this.alignInkBarToSelectedTab();
            this.lockAnimation();
            this.updateScrollListPosition();
        }
    }
}
NzTabNavBarComponent.decorators = [
    { type: Component, args: [{
                selector: 'nz-tabs-nav',
                exportAs: 'nzTabsNav',
                preserveWhitespaces: false,
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                template: `
    <div
      class="ant-tabs-nav-wrap"
      [class.ant-tabs-nav-wrap-ping-left]="pingLeft"
      [class.ant-tabs-nav-wrap-ping-right]="pingRight"
      [class.ant-tabs-nav-wrap-ping-top]="pingTop"
      [class.ant-tabs-nav-wrap-ping-bottom]="pingBottom"
      #navWarp
    >
      <div class="ant-tabs-nav-list" #navList nzTabScrollList (offsetChange)="onOffsetChange($event)" (tabScroll)="tabScroll.emit($event)">
        <ng-content></ng-content>
        <button *ngIf="showAddButton" nz-tab-add-button [addIcon]="addIcon" (click)="addClicked.emit()"></button>
        <div nz-tabs-ink-bar [hidden]="hideBar" [position]="position" [animated]="inkBarAnimated"></div>
      </div>
    </div>
    <nz-tab-nav-operation
      (addClicked)="addClicked.emit()"
      (selected)="onSelectedFromMenu($event)"
      [addIcon]="addIcon"
      [addable]="addable"
      [items]="hiddenItems"
    ></nz-tab-nav-operation>
    <div class="ant-tabs-extra-content" *ngIf="extraTemplate">
      <ng-template [ngTemplateOutlet]="extraTemplate"></ng-template>
    </div>
  `,
                host: {
                    role: 'tablist',
                    class: 'ant-tabs-nav',
                    '(keydown)': 'handleKeydown($event)'
                }
            },] }
];
NzTabNavBarComponent.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: NgZone },
    { type: ViewportRuler },
    { type: NzResizeObserver },
    { type: Directionality, decorators: [{ type: Optional }] }
];
NzTabNavBarComponent.propDecorators = {
    indexFocused: [{ type: Output }],
    selectFocusedIndex: [{ type: Output }],
    addClicked: [{ type: Output }],
    tabScroll: [{ type: Output }],
    position: [{ type: Input }],
    addable: [{ type: Input }],
    hideBar: [{ type: Input }],
    addIcon: [{ type: Input }],
    inkBarAnimated: [{ type: Input }],
    extraTemplate: [{ type: Input }],
    selectedIndex: [{ type: Input }],
    navWarpRef: [{ type: ViewChild, args: ['navWarp', { static: true },] }],
    navListRef: [{ type: ViewChild, args: ['navList', { static: true },] }],
    operationRef: [{ type: ViewChild, args: [NzTabNavOperationComponent, { static: true },] }],
    addBtnRef: [{ type: ViewChild, args: [NzTabAddButtonComponent, { static: false },] }],
    inkBar: [{ type: ViewChild, args: [NzTabsInkBarDirective, { static: true },] }],
    items: [{ type: ContentChildren, args: [NzTabNavItemDirective, { descendants: true },] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFiLW5hdi1iYXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uL2NvbXBvbmVudHMvdGFicy8iLCJzb3VyY2VzIjpbInRhYi1uYXYtYmFyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDcEQsT0FBTyxFQUFhLGNBQWMsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQzlELE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQzdELE9BQU8sRUFBRSxVQUFVLEVBQUUsS0FBSyxFQUFFLGNBQWMsRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUNwSCxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDckQsT0FBTyxFQUdMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULGVBQWUsRUFDZixVQUFVLEVBQ1YsWUFBWSxFQUNaLEtBQUssRUFDTCxNQUFNLEVBSU4sUUFBUSxFQUNSLE1BQU0sRUFDTixTQUFTLEVBRVQsV0FBVyxFQUNYLFNBQVMsRUFDVCxpQkFBaUIsRUFDbEIsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLHVCQUF1QixFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsRUFBRSxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUNsRixPQUFPLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRXRELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUMzRCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUl2RSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSw0QkFBNEIsQ0FBQztBQUNyRSxPQUFPLEVB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QkFDRCxJQUFJLEVBQUU7b0JBQ0osSUFBSSxFQUFFLFNBQVM7b0JBQ2YsS0FBSyxFQUFFLGNBQWM7b0JBQ3JCLFdBQVcsRUFBRSx1QkFBdUI7aUJBQ3JDO2FBQ0Y7OztZQXhFQyxpQkFBaUI7WUFNakIsTUFBTTtZQVhDLGFBQWE7WUE0QmIsZ0JBQWdCO1lBL0JMLGNBQWMsdUJBcUs3QixRQUFROzs7MkJBakZWLE1BQU07aUNBQ04sTUFBTTt5QkFDTixNQUFNO3dCQUNOLE1BQU07dUJBRU4sS0FBSztzQkFDTCxLQUFLO3NCQUNMLEtBQUs7c0JBQ0wsS0FBSzs2QkFDTCxLQUFLOzRCQUNMLEtBQUs7NEJBRUwsS0FBSzt5QkFlTCxTQUFTLFNBQUMsU0FBUyxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTt5QkFDckMsU0FBUyxTQUFDLFNBQVMsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7MkJBQ3JDLFNBQVMsU0FBQywwQkFBMEIsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7d0JBQ3RELFNBQVMsU0FBQyx1QkFBdUIsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7cUJBQ3BELFNBQVMsU0FBQyxxQkFBcUIsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7b0JBQ2pELGVBQWUsU0FBQyxxQkFBcUIsRUFBRSxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vZ2l0aHViLmNvbS9ORy1aT1JSTy9uZy16b3Jyby1hbnRkL2Jsb2IvbWFzdGVyL0xJQ0VOU0VcbiAqL1xuXG5pbXBvcnQgeyBGb2N1c0tleU1hbmFnZXIgfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQgeyBEaXJlY3Rpb24sIERpcmVjdGlvbmFsaXR5IH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHsgY29lcmNlTnVtYmVyUHJvcGVydHkgfSBmcm9tICdAYW5ndWxhci9jZGsvY29lcmNpb24nO1xuaW1wb3J0IHsgRE9XTl9BUlJPVywgRU5URVIsIGhhc01vZGlmaWVyS2V5LCBMRUZUX0FSUk9XLCBSSUdIVF9BUlJPVywgU1BBQ0UsIFVQX0FSUk9XIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7IFZpZXdwb3J0UnVsZXIgfSBmcm9tICdAYW5ndWxhci9jZGsvb3ZlcmxheSc7XG5pbXBvcnQge1xuICBBZnRlckNvbnRlbnRDaGVja2VkLFxuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29udGVudENoaWxkcmVuLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBOZ1pvbmUsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFF1ZXJ5TGlzdCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IGFuaW1hdGlvbkZyYW1lU2NoZWR1bGVyLCBhc2FwU2NoZWR1bGVyLCBtZXJnZSwgb2YsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGF1ZGl0VGltZSwgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5pbXBvcnQgeyByZXFBbmltRnJhbWUgfSBmcm9tICduZy16b3Jyby1hbnRkL2NvcmUvcG9seWZpbGwnO1xuaW1wb3J0IHsgTnpSZXNpemVPYnNlcnZlciB9IGZyb20gJ25nLXpvcnJvLWFudGQvY29yZS9yZXNpemUtb2JzZXJ2ZXJzJztcbmltcG9ydCB7IE51bWJlcklucHV0LCBOelNhZmVBbnkgfSBmcm9tICduZy16b3Jyby1hbnRkL2NvcmUvdHlwZXMnO1xuXG5pbXBvcnQgeyBOelRhYlBvc2l0aW9uTW9kZSwgTnpUYWJTY3JvbGxFdmVudCwgTnpUYWJTY3JvbGxMaXN0T2Zmc2V0RXZlbnQgfSBmcm9tICcuL2ludGVyZmFjZXMnO1xuaW1wb3J0IHsgTnpUYWJBZGRCdXR0b25Db21wb25lbnQgfSBmcm9tICcuL3RhYi1hZGQtYnV0dG9uLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOelRhYk5hdkl0ZW1EaXJlY3RpdmUgfSBmcm9tICcuL3RhYi1uYXYtaXRlbS5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgTnpUYWJOYXZPcGVyYXRpb25Db21wb25lbnQgfSBmcm9tICcuL3RhYi1uYXYtb3BlcmF0aW9uLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOelRhYnNJbmtCYXJEaXJlY3RpdmUgfSBmcm9tICcuL3RhYnMtaW5rLWJhci5kaXJlY3RpdmUnO1xuXG5jb25zdCBSRVNJWkVfU0NIRURVTEVSID0gdHlwZW9mIHJlcXVlc3RBbmltYXRpb25GcmFtZSAhPT0gJ3VuZGVmaW5lZCcgPyBhbmltYXRpb25GcmFtZVNjaGVkdWxlciA6IGFzYXBTY2hlZHVsZXI7XG5jb25zdCBDU1NfVFJBTlNGT1JNX1RJTUUgPSAxNTA7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ256LXRhYnMtbmF2JyxcbiAgZXhwb3J0QXM6ICduelRhYnNOYXYnLFxuICBwcmVzZXJ2ZVdoaXRlc3BhY2VzOiBmYWxzZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdlxuICAgICAgY2xhc3M9XCJhbnQtdGFicy1uYXYtd3JhcFwiXG4gICAgICBbY2xhc3MuYW50LXRhYnMtbmF2LXdyYXAtcGluZy1sZWZ0XT1cInBpbmdMZWZ0XCJcbiAgICAgIFtjbGFzcy5hbnQtdGFicy1uYXYtd3JhcC1waW5nLXJpZ2h0XT1cInBpbmdSaWdodFwiXG4gICAgICBbY2xhc3MuYW50LXRhYnMtbmF2LXdyYXAtcGluZy10b3BdPVwicGluZ1RvcFwiXG4gICAgICBbY2xhc3MuYW50LXRhYnMtbmF2LXdyYXAtcGluZy1ib3R0b21dPVwicGluZ0JvdHRvbVwiXG4gICAgICAjbmF2V2FycFxuICAgID5cbiAgICAgIDxkaXYgY2xhc3M9XCJhbnQtdGFicy1uYXYtbGlzdFwiICNuYXZMaXN0IG56VGFiU2Nyb2xsTGlzdCAob2Zmc2V0Q2hhbmdlKT1cIm9uT2Zmc2V0Q2hhbmdlKCRldmVudClcIiAodGFiU2Nyb2xsKT1cInRhYlNjcm9sbC5lbWl0KCRldmVudClcIj5cbiAgICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgICAgICA8YnV0dG9uICpuZ0lmPVwic2hvd0FkZEJ1dHRvblwiIG56LXRhYi1hZGQtYnV0dG9uIFthZGRJY29uXT1cImFkZEljb25cIiAoY2xpY2spPVwiYWRkQ2xpY2tlZC5lbWl0KClcIj48L2J1dHRvbj5cbiAgICAgICAgPGRpdiBuei10YWJzLWluay1iYXIgW2hpZGRlbl09XCJoaWRlQmFyXCIgW3Bvc2l0aW9uXT1cInBvc2l0aW9uXCIgW2FuaW1hdGVkXT1cImlua0JhckFuaW1hdGVkXCI+PC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8bnotdGFiLW5hdi1vcGVyYXRpb25cbiAgICAgIChhZGRDbGlja2VkKT1cImFkZENsaWNrZWQuZW1pdCgpXCJcbiAgICAgIChzZWxlY3RlZCk9XCJvblNlbGVjdGVkRnJvbU1lbnUoJGV2ZW50KVwiXG4gICAgICBbYWRkSWNvbl09XCJhZGRJY29uXCJcbiAgICAgIFthZGRhYmxlXT1cImFkZGFibGVcIlxuICAgICAgW2l0ZW1zXT1cImhpZGRlbkl0ZW1zXCJcbiAgICA+PC9uei10YWItbmF2LW9wZXJhdGlvbj5cbiAgICA8ZGl2IGNsYXNzPVwiYW50LXRhYnMtZXh0cmEtY29udGVudFwiICpuZ0lmPVwiZXh0cmFUZW1wbGF0ZVwiPlxuICAgICAgPG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImV4dHJhVGVtcGxhdGVcIj48L25nLXRlbXBsYXRlPlxuICAgIDwvZGl2PlxuICBgLFxuICBob3N0OiB7XG4gICAgcm9sZTogJ3RhYmxpc3QnLFxuICAgIGNsYXNzOiAnYW50LXRhYnMtbmF2JyxcbiAgICAnKGtleWRvd24pJzogJ2hhbmRsZUtleWRvd24oJGV2ZW50KSdcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBOelRhYk5hdkJhckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCwgQWZ0ZXJDb250ZW50Q2hlY2tlZCwgT25EZXN0cm95LCBPbkNoYW5nZXMge1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfc2VsZWN0ZWRJbmRleDogTnVtYmVySW5wdXQ7XG5cbiAgQE91dHB1dCgpIHJlYWRvbmx5IGluZGV4Rm9jdXNlZDogRXZlbnRFbWl0dGVyPG51bWJlcj4gPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlcj4oKTtcbiAgQE91dHB1dCgpIHJlYWRvbmx5IHNlbGVjdEZvY3VzZWRJbmRleDogRXZlbnRFbWl0dGVyPG51bWJlcj4gPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlcj4oKTtcbiAgQE91dHB1dCgpIHJlYWRvbmx5IGFkZENsaWNrZWQgPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG4gIEBPdXRwdXQoKSByZWFkb25seSB0YWJTY3JvbGwgPSBuZXcgRXZlbnRFbWl0dGVyPE56VGFiU2Nyb2xsRXZlbnQ+KCk7XG5cbiAgQElucHV0KCkgcG9zaXRpb246IE56VGFiUG9zaXRpb25Nb2RlID0gJ2hvcml6b250YWwnO1xuICBASW5wdXQoKSBhZGRhYmxlOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpIGhpZGVCYXI6IGJvb2xlYW4gPSBmYWxzZTtcbiAgQElucHV0KCkgYWRkSWNvbjogc3RyaW5nIHwgVGVtcGxhdGVSZWY8TnpTYWZlQW55PiA9ICdwbHVzJztcbiAgQElucHV0KCkgaW5rQmFyQW5pbWF0ZWQgPSB0cnVlO1xuICBASW5wdXQoKSBleHRyYVRlbXBsYXRlPzogVGVtcGxhdGVSZWY8dm9pZD47XG5cbiAgQElucHV0KClcbiAgZ2V0IHNlbGVjdGVkSW5kZXgoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0ZWRJbmRleDtcbiAgfVxuICBzZXQgc2VsZWN0ZWRJbmRleCh2YWx1ZTogbnVtYmVyKSB7XG4gICAgY29uc3QgbmV3VmFsdWUgPSBjb2VyY2VOdW1iZXJQcm9wZXJ0eSh2YWx1ZSk7XG4gICAgaWYgKHRoaXMuX3NlbGVjdGVkSW5kZXggIT09IG5ld1ZhbHVlKSB7XG4gICAgICB0aGlzLl9zZWxlY3RlZEluZGV4ID0gdmFsdWU7XG4gICAgICB0aGlzLnNlbGVjdGVkSW5kZXhDaGFuZ2VkID0gdHJ1ZTtcbiAgICAgIGlmICh0aGlzLmtleU1hbmFnZXIpIHtcbiAgICAgICAgdGhpcy5rZXlNYW5hZ2VyLnVwZGF0ZUFjdGl2ZUl0ZW0odmFsdWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIEBWaWV3Q2hpbGQoJ25hdldhcnAnLCB7IHN0YXRpYzogdHJ1ZSB9KSBuYXZXYXJwUmVmITogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG4gIEBWaWV3Q2hpbGQoJ25hdkxpc3QnLCB7IHN0YXRpYzogdHJ1ZSB9KSBuYXZMaXN0UmVmITogRWxlbWVudFJlZjxIVE1MRWxlbWVudD47XG4gIEBWaWV3Q2hpbGQoTnpUYWJOYXZPcGVyYXRpb25Db21wb25lbnQsIHsgc3RhdGljOiB0cnVlIH0pIG9wZXJhdGlvblJlZiE6IE56VGFiTmF2T3BlcmF0aW9uQ29tcG9uZW50O1xuICBAVmlld0NoaWxkKE56VGFiQWRkQnV0dG9uQ29tcG9uZW50LCB7IHN0YXRpYzogZmFsc2UgfSkgYWRkQnRuUmVmITogTnpUYWJBZGRCdXR0b25Db21wb25lbnQ7XG4gIEBWaWV3Q2hpbGQoTnpUYWJzSW5rQmFyRGlyZWN0aXZlLCB7IHN0YXRpYzogdHJ1ZSB9KSBpbmtCYXIhOiBOelRhYnNJbmtCYXJEaXJlY3RpdmU7XG4gIEBDb250ZW50Q2hpbGRyZW4oTnpUYWJOYXZJdGVtRGlyZWN0aXZlLCB7IGRlc2NlbmRhbnRzOiB0cnVlIH0pIGl0ZW1zITogUXVlcnlMaXN0PE56VGFiTmF2SXRlbURpcmVjdGl2ZT47XG5cbiAgLyoqIFRyYWNrcyB3aGljaCBlbGVtZW50IGhhcyBmb2N1czsgdXNlZCBmb3Iga2V5Ym9hcmQgbmF2aWdhdGlvbiAqL1xuICBnZXQgZm9jdXNJbmRleCgpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLmtleU1hbmFnZXIgPyB0aGlzLmtleU1hbmFnZXIuYWN0aXZlSXRlbUluZGV4ISA6IDA7XG4gIH1cblxuICAvKiogV2hlbiB0aGUgZm9jdXMgaW5kZXggaXMgc2V0LCB3ZSBtdXN0IG1hbnVhbGx5IHNlbmQgZm9jdXMgdG8gdGhlIGNvcnJlY3QgbGFiZWwgKi9cbiAgc2V0IGZvY3VzSW5kZXgodmFsdWU6IG51bWJlcikge1xuICAgIGlmICghdGhpcy5pc1ZhbGlkSW5kZXgodmFsdWUpIHx8IHRoaXMuZm9jdXNJbmRleCA9PT0gdmFsdWUgfHwgIXRoaXMua2V5TWFuYWdlcikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHRoaXMua2V5TWFuYWdlci5zZXRBY3RpdmVJdGVtKHZhbHVlKTtcbiAgfVxuXG4gIGdldCBzaG93QWRkQnV0dG9uKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLmhpZGRlbkl0ZW1zLmxlbmd0aCA9PT0gMCAmJiB0aGlzLmFkZGFibGU7XG4gIH1cblxuICB0cmFuc2xhdGU6IG51bGwgfCBzdHJpbmcgPSBudWxsO1xuICB0cmFuc2Zvcm1YID0gMDtcbiAgdHJhbnNmb3JtWSA9IDA7XG4gIHBpbmdMZWZ0ID0gZmFsc2U7XG4gIHBpbmdSaWdodCA9IGZhbHNlO1xuICBwaW5nVG9wID0gZmFsc2U7XG4gIHBpbmdCb3R0b20gPSBmYWxzZTtcbiAgaGlkZGVuSXRlbXM6IE56VGFiTmF2SXRlbURpcmVjdGl2ZVtdID0gW107XG5cbiAgcHJpdmF0ZSBrZXlNYW5hZ2VyITogRm9jdXNLZXlNYW5hZ2VyPE56VGFiTmF2SXRlbURpcmVjdGl2ZT47XG4gIHByaXZhdGUgZGVzdHJveSQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICBwcml2YXRlIF9zZWxlY3RlZEluZGV4ID0gMDtcbiAgcHJpdmF0ZSB3cmFwcGVyV2lkdGggPSAwO1xuICBwcml2YXRlIHdyYXBwZXJIZWlnaHQgPSAwO1xuICBwcml2YXRlIHNjcm9sbExpc3RXaWR0aCA9IDA7XG4gIHByaXZhdGUgc2Nyb2xsTGlzdEhlaWdodCA9IDA7XG4gIHByaXZhdGUgb3BlcmF0aW9uV2lkdGggPSAwO1xuICBwcml2YXRlIG9wZXJhdGlvbkhlaWdodCA9IDA7XG4gIHByaXZhdGUgYWRkQnV0dG9uV2lkdGggPSAwO1xuICBwcml2YXRlIGFkZEJ1dHRvbkhlaWdodCA9IDA7XG4gIHByaXZhdGUgc2VsZWN0ZWRJbmRleENoYW5nZWQgPSBmYWxzZTtcbiAgcHJpdmF0ZSBsb2NrQW5pbWF0aW9uVGltZW91dElkID0gLTE7XG4gIHByaXZhdGUgY3NzVHJhbnNmb3JtVGltZVdhaXRpbmdJZCA9IC0xO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgY2RyOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIG5nWm9uZTogTmdab25lLFxuICAgIHByaXZhdGUgdmlld3BvcnRSdWxlcjogVmlld3BvcnRSdWxlcixcbiAgICBwcml2YXRlIG56UmVzaXplT2JzZXJ2ZXI6IE56UmVzaXplT2JzZXJ2ZXIsXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBkaXI6IERpcmVjdGlvbmFsaXR5XG4gICkge31cblxuICBuZ09uSW5pdCgpOiB2b2lkIHt9XG5cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIGNvbnN0IGRpckNoYW5nZSA9IHRoaXMuZGlyID8gdGhpcy5kaXIuY2hhbmdlIDogb2YobnVsbCk7XG4gICAgY29uc3QgcmVzaXplID0gdGhpcy52aWV3cG9ydFJ1bGVyLmNoYW5nZSgxNTApO1xuXG4gICAgY29uc3QgcmVhbGlnbiA9ICgpID0+IHtcbiAgICAgIHRoaXMudXBkYXRlU2Nyb2xsTGlzdFBvc2l0aW9uKCk7XG4gICAgICB0aGlzLmFsaWduSW5rQmFyVG9TZWxlY3RlZFRhYigpO1xuICAgIH07XG4gICAgdGhpcy5rZXlNYW5hZ2VyID0gbmV3IEZvY3VzS2V5TWFuYWdlcjxOelRhYk5hdkl0ZW1EaXJlY3RpdmU+KHRoaXMuaXRlbXMpXG4gICAgICAud2l0aEhvcml6b250YWxPcmllbnRhdGlvbih0aGlzLmdldExheW91dERpcmVjdGlvbigpKVxuICAgICAgLndpdGhXcmFwKCk7XG4gICAgdGhpcy5rZXlNYW5hZ2VyLnVwZGF0ZUFjdGl2ZUl0ZW0oMCk7XG5cbiAgICByZXFBbmltRnJhbWUocmVhbGlnbik7XG5cbiAgICBtZXJnZSh0aGlzLm56UmVzaXplT2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLm5hdldhcnBSZWYpLCB0aGlzLm56UmVzaXplT2JzZXJ2ZXIub2JzZXJ2ZSh0aGlzLm5hdkxpc3RSZWYpKVxuICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpLCBhdWRpdFRpbWUoMTYsIFJFU0laRV9TQ0hFRFVMRVIpKVxuICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHJlYWxpZ24oKTtcbiAgICAgIH0pO1xuICAgIG1lcmdlKGRpckNoYW5nZSwgcmVzaXplLCB0aGlzLml0ZW1zLmNoYW5nZXMpXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbihyZWFsaWduKTtcbiAgICAgICAgdGhpcy5rZXlNYW5hZ2VyLndpdGhIb3Jpem9udGFsT3JpZW50YXRpb24odGhpcy5nZXRMYXlvdXREaXJlY3Rpb24oKSk7XG4gICAgICB9KTtcblxuICAgIHRoaXMua2V5TWFuYWdlci5jaGFuZ2UucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpLnN1YnNjcmliZShuZXdGb2N1c0luZGV4ID0+IHtcbiAgICAgIHRoaXMuaW5kZXhGb2N1c2VkLmVtaXQobmV3Rm9jdXNJbmRleCk7XG4gICAgICB0aGlzLnNldFRhYkZvY3VzKG5ld0ZvY3VzSW5kZXgpO1xuICAgICAgdGhpcy5zY3JvbGxUb1RhYih0aGlzLmtleU1hbmFnZXIuYWN0aXZlSXRlbSEpO1xuICAgIH0pO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRDaGVja2VkKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLnNlbGVjdGVkSW5kZXhDaGFuZ2VkKSB7XG4gICAgICB0aGlzLnVwZGF0ZVNjcm9sbExpc3RQb3NpdGlvbigpO1xuICAgICAgdGhpcy5hbGlnbklua0JhclRvU2VsZWN0ZWRUYWIoKTtcbiAgICAgIHRoaXMuc2VsZWN0ZWRJbmRleENoYW5nZWQgPSBmYWxzZTtcbiAgICAgIHRoaXMuY2RyLm1hcmtGb3JDaGVjaygpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIGNsZWFyVGltZW91dCh0aGlzLmxvY2tBbmltYXRpb25UaW1lb3V0SWQpO1xuICAgIGNsZWFyVGltZW91dCh0aGlzLmNzc1RyYW5zZm9ybVRpbWVXYWl0aW5nSWQpO1xuICAgIHRoaXMuZGVzdHJveSQubmV4dCgpO1xuICAgIHRoaXMuZGVzdHJveSQuY29tcGxldGUoKTtcbiAgfVxuXG4gIG9uU2VsZWN0ZWRGcm9tTWVudSh0YWI6IE56VGFiTmF2SXRlbURpcmVjdGl2ZSk6IHZvaWQge1xuICAgIGNvbnN0IHRhYkluZGV4ID0gdGhpcy5pdGVtcy50b0FycmF5KCkuZmluZEluZGV4KGUgPT4gZSA9PT0gdGFiKTtcbiAgICBpZiAodGFiSW5kZXggIT09IC0xKSB7XG4gICAgICB0aGlzLmtleU1hbmFnZXIudXBkYXRlQWN0aXZlSXRlbSh0YWJJbmRleCk7XG4gICAgICBpZiAodGhpcy5mb2N1c0luZGV4ICE9PSB0aGlzLnNlbGVjdGVkSW5kZXgpIHtcbiAgICAgICAgdGhpcy5zZWxlY3RGb2N1c2VkSW5kZXguZW1pdCh0aGlzLmZvY3VzSW5kZXgpO1xuICAgICAgICB0aGlzLnNjcm9sbFRvVGFiKHRhYik7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgb25PZmZzZXRDaGFuZ2UoZTogTnpUYWJTY3JvbGxMaXN0T2Zmc2V0RXZlbnQpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5wb3NpdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICBpZiAodGhpcy5sb2NrQW5pbWF0aW9uVGltZW91dElkID09PSAtMSkge1xuICAgICAgICBpZiAodGhpcy50cmFuc2Zvcm1YID49IDAgJiYgZS54ID4gMCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy50cmFuc2Zvcm1YIDw9IHRoaXMud3JhcHBlcldpZHRoIC0gdGhpcy5zY3JvbGxMaXN0V2lkdGggJiYgZS54IDwgMCkge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZS5ldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdGhpcy50cmFuc2Zvcm1YID0gdGhpcy5jbGFtcFRyYW5zZm9ybVgodGhpcy50cmFuc2Zvcm1YICsgZS54KTtcbiAgICAgIHRoaXMuc2V0VHJhbnNmb3JtKHRoaXMudHJhbnNmb3JtWCwgMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmICh0aGlzLmxvY2tBbmltYXRpb25UaW1lb3V0SWQgPT09IC0xKSB7XG4gICAgICAgIGlmICh0aGlzLnRyYW5zZm9ybVkgPj0gMCAmJiBlLnkgPiAwKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLnRyYW5zZm9ybVkgPD0gdGhpcy53cmFwcGVySGVpZ2h0IC0gdGhpcy5zY3JvbGxMaXN0SGVpZ2h0ICYmIGUueSA8IDApIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGUuZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHRoaXMudHJhbnNmb3JtWSA9IHRoaXMuY2xhbXBUcmFuc2Zvcm1ZKHRoaXMudHJhbnNmb3JtWSArIGUueSk7XG4gICAgICB0aGlzLnNldFRyYW5zZm9ybSgwLCB0aGlzLnRyYW5zZm9ybVkpO1xuICAgIH1cblxuICAgIHRoaXMubG9ja0FuaW1hdGlvbigpO1xuICAgIHRoaXMuc2V0VmlzaWJsZVJhbmdlKCk7XG4gICAgdGhpcy5zZXRQaW5nU3RhdHVzKCk7XG4gIH1cblxuICBoYW5kbGVLZXlkb3duKGV2ZW50OiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgY29uc3QgaW5OYXZpZ2F0aW9uTGlzdCA9IHRoaXMubmF2V2FycFJlZi5uYXRpdmVFbGVtZW50LmNvbnRhaW5zKGV2ZW50LnRhcmdldCBhcyBIVE1MRWxlbWVudCk7XG4gICAgaWYgKGhhc01vZGlmaWVyS2V5KGV2ZW50KSB8fCAhaW5OYXZpZ2F0aW9uTGlzdCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIHN3aXRjaCAoZXZlbnQua2V5Q29kZSkge1xuICAgICAgY2FzZSBMRUZUX0FSUk9XOlxuICAgICAgY2FzZSBVUF9BUlJPVzpcbiAgICAgIGNhc2UgUklHSFRfQVJST1c6XG4gICAgICBjYXNlIERPV05fQVJST1c6XG4gICAgICAgIHRoaXMubG9ja0FuaW1hdGlvbigpO1xuICAgICAgICB0aGlzLmtleU1hbmFnZXIub25LZXlkb3duKGV2ZW50KTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEVOVEVSOlxuICAgICAgY2FzZSBTUEFDRTpcbiAgICAgICAgaWYgKHRoaXMuZm9jdXNJbmRleCAhPT0gdGhpcy5zZWxlY3RlZEluZGV4KSB7XG4gICAgICAgICAgdGhpcy5zZWxlY3RGb2N1c2VkSW5kZXguZW1pdCh0aGlzLmZvY3VzSW5kZXgpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgdGhpcy5rZXlNYW5hZ2VyLm9uS2V5ZG93bihldmVudCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBpc1ZhbGlkSW5kZXgoaW5kZXg6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgIGlmICghdGhpcy5pdGVtcykge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgY29uc3QgdGFiID0gdGhpcy5pdGVtcyA/IHRoaXMuaXRlbXMudG9BcnJheSgpW2luZGV4XSA6IG51bGw7XG4gICAgcmV0dXJuICEhdGFiICYmICF0YWIuZGlzYWJsZWQ7XG4gIH1cblxuICBwcml2YXRlIHNjcm9sbFRvVGFiKHRhYjogTnpUYWJOYXZJdGVtRGlyZWN0aXZlKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLml0ZW1zLmZpbmQoZSA9PiBlID09PSB0YWIpKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHRhYnMgPSB0aGlzLml0ZW1zLnRvQXJyYXkoKTtcblxuICAgIGlmICh0aGlzLnBvc2l0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgIGxldCBuZXdUcmFuc2Zvcm0gPSB0aGlzLnRyYW5zZm9ybVg7XG4gICAgICBpZiAodGhpcy5nZXRMYXlvdXREaXJlY3Rpb24oKSA9PT0gJ3J0bCcpIHtcbiAgICAgICAgY29uc3QgcmlnaHQgPSB0YWJzWzBdLmxlZnQgKyB0YWJzWzBdLndpZHRoIC0gdGFiLmxlZnQgLSB0YWIud2lkdGg7XG5cbiAgICAgICAgaWYgKHJpZ2h0IDwgdGhpcy50cmFuc2Zvcm1YKSB7XG4gICAgICAgICAgbmV3VHJhbnNmb3JtID0gcmlnaHQ7XG4gICAgICAgIH0gZWxzZSBpZiAocmlnaHQgKyB0YWIud2lkdGggPiB0aGlzLnRyYW5zZm9ybVggKyB0aGlzLndyYXBwZXJXaWR0aCkge1xuICAgICAgICAgIG5ld1RyYW5zZm9ybSA9IHJpZ2h0ICsgdGFiLndpZHRoIC0gdGhpcy53cmFwcGVyV2lkdGg7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodGFiLmxlZnQgPCAtdGhpcy50cmFuc2Zvcm1YKSB7XG4gICAgICAgIG5ld1RyYW5zZm9ybSA9IC10YWIubGVmdDtcbiAgICAgIH0gZWxzZSBpZiAodGFiLmxlZnQgKyB0YWIud2lkdGggPiAtdGhpcy50cmFuc2Zvcm1YICsgdGhpcy53cmFwcGVyV2lkdGgpIHtcbiAgICAgICAgbmV3VHJhbnNmb3JtID0gLSh0YWIubGVmdCArIHRhYi53aWR0aCAtIHRoaXMud3JhcHBlcldpZHRoKTtcbiAgICAgIH1cbiAgICAgIHRoaXMudHJhbnNmb3JtWCA9IG5ld1RyYW5zZm9ybTtcbiAgICAgIHRoaXMudHJhbnNmb3JtWSA9IDA7XG4gICAgICB0aGlzLnNldFRyYW5zZm9ybShuZXdUcmFuc2Zvcm0sIDApO1xuICAgIH0gZWxzZSB7XG4gICAgICBsZXQgbmV3VHJhbnNmb3JtID0gdGhpcy50cmFuc2Zvcm1ZO1xuXG4gICAgICBpZiAodGFiLnRvcCA8IC10aGlzLnRyYW5zZm9ybVkpIHtcbiAgICAgICAgbmV3VHJhbnNmb3JtID0gLXRhYi50b3A7XG4gICAgICB9IGVsc2UgaWYgKHRhYi50b3AgKyB0YWIuaGVpZ2h0ID4gLXRoaXMudHJhbnNmb3JtWSArIHRoaXMud3JhcHBlckhlaWdodCkge1xuICAgICAgICBuZXdUcmFuc2Zvcm0gPSAtKHRhYi50b3AgKyB0YWIuaGVpZ2h0IC0gdGhpcy53cmFwcGVySGVpZ2h0KTtcbiAgICAgIH1cbiAgICAgIHRoaXMudHJhbnNmb3JtWSA9IG5ld1RyYW5zZm9ybTtcbiAgICAgIHRoaXMudHJhbnNmb3JtWCA9IDA7XG4gICAgICB0aGlzLnNldFRyYW5zZm9ybSgwLCBuZXdUcmFuc2Zvcm0pO1xuICAgIH1cblxuICAgIGNsZWFyVGltZW91dCh0aGlzLmNzc1RyYW5zZm9ybVRpbWVXYWl0aW5nSWQpO1xuICAgIHRoaXMuY3NzVHJhbnNmb3JtVGltZVdhaXRpbmdJZCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5zZXRWaXNpYmxlUmFuZ2UoKTtcbiAgICB9LCBDU1NfVFJBTlNGT1JNX1RJTUUpO1xuICB9XG5cbiAgcHJpdmF0ZSBsb2NrQW5pbWF0aW9uKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmxvY2tBbmltYXRpb25UaW1lb3V0SWQgPT09IC0xKSB7XG4gICAgICB0aGlzLm5nWm9uZS5ydW5PdXRzaWRlQW5ndWxhcigoKSA9PiB7XG4gICAgICAgIHRoaXMubmF2TGlzdFJlZi5uYXRpdmVFbGVtZW50LnN0eWxlLnRyYW5zaXRpb24gPSAnbm9uZSc7XG4gICAgICAgIHRoaXMubG9ja0FuaW1hdGlvblRpbWVvdXRJZCA9IHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgICAgIHRoaXMubmF2TGlzdFJlZi5uYXRpdmVFbGVtZW50LnN0eWxlLnRyYW5zaXRpb24gPSAnJztcbiAgICAgICAgICB0aGlzLmxvY2tBbmltYXRpb25UaW1lb3V0SWQgPSAtMTtcbiAgICAgICAgfSwgQ1NTX1RSQU5TRk9STV9USU1FKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc2V0VHJhbnNmb3JtKHg6IG51bWJlciwgeTogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy5uYXZMaXN0UmVmLm5hdGl2ZUVsZW1lbnQuc3R5bGUudHJhbnNmb3JtID0gYHRyYW5zbGF0ZSgke3h9cHgsICR7eX1weClgO1xuICB9XG5cbiAgcHJpdmF0ZSBjbGFtcFRyYW5zZm9ybVgodHJhbnNmb3JtOiBudW1iZXIpOiBudW1iZXIge1xuICAgIGNvbnN0IHNjcm9sbFdpZHRoID0gdGhpcy53cmFwcGVyV2lkdGggLSB0aGlzLnNjcm9sbExpc3RXaWR0aDtcbiAgICBpZiAodGhpcy5nZXRMYXlvdXREaXJlY3Rpb24oKSA9PT0gJ3J0bCcpIHtcbiAgICAgIHJldHVybiBNYXRoLm1heChNYXRoLm1pbihzY3JvbGxXaWR0aCwgdHJhbnNmb3JtKSwgMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBNYXRoLm1pbihNYXRoLm1heChzY3JvbGxXaWR0aCwgdHJhbnNmb3JtKSwgMCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBjbGFtcFRyYW5zZm9ybVkodHJhbnNmb3JtOiBudW1iZXIpOiBudW1iZXIge1xuICAgIHJldHVybiBNYXRoLm1pbihNYXRoLm1heCh0aGlzLndyYXBwZXJIZWlnaHQgLSB0aGlzLnNjcm9sbExpc3RIZWlnaHQsIHRyYW5zZm9ybSksIDApO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVTY3JvbGxMaXN0UG9zaXRpb24oKTogdm9pZCB7XG4gICAgdGhpcy5yZXNldFNpemVzKCk7XG4gICAgdGhpcy50cmFuc2Zvcm1YID0gdGhpcy5jbGFtcFRyYW5zZm9ybVgodGhpcy50cmFuc2Zvcm1YKTtcbiAgICB0aGlzLnRyYW5zZm9ybVkgPSB0aGlzLmNsYW1wVHJhbnNmb3JtWSh0aGlzLnRyYW5zZm9ybVkpO1xuICAgIHRoaXMuc2V0VmlzaWJsZVJhbmdlKCk7XG4gICAgdGhpcy5zZXRQaW5nU3RhdHVzKCk7XG4gICAgaWYgKHRoaXMua2V5TWFuYWdlcikge1xuICAgICAgdGhpcy5rZXlNYW5hZ2VyLnVwZGF0ZUFjdGl2ZUl0ZW0odGhpcy5rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW1JbmRleCEpO1xuICAgICAgaWYgKHRoaXMua2V5TWFuYWdlci5hY3RpdmVJdGVtKSB7XG4gICAgICAgIHRoaXMuc2Nyb2xsVG9UYWIodGhpcy5rZXlNYW5hZ2VyLmFjdGl2ZUl0ZW0pO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgcmVzZXRTaXplcygpOiB2b2lkIHtcbiAgICB0aGlzLmFkZEJ1dHRvbldpZHRoID0gdGhpcy5hZGRCdG5SZWYgPyB0aGlzLmFkZEJ0blJlZi5nZXRFbGVtZW50V2lkdGgoKSA6IDA7XG4gICAgdGhpcy5hZGRCdXR0b25IZWlnaHQgPSB0aGlzLmFkZEJ0blJlZiA/IHRoaXMuYWRkQnRuUmVmLmdldEVsZW1lbnRIZWlnaHQoKSA6IDA7XG4gICAgdGhpcy5vcGVyYXRpb25XaWR0aCA9IHRoaXMub3BlcmF0aW9uUmVmLmdldEVsZW1lbnRXaWR0aCgpO1xuICAgIHRoaXMub3BlcmF0aW9uSGVpZ2h0ID0gdGhpcy5vcGVyYXRpb25SZWYuZ2V0RWxlbWVudEhlaWdodCgpO1xuICAgIHRoaXMud3JhcHBlcldpZHRoID0gdGhpcy5uYXZXYXJwUmVmLm5hdGl2ZUVsZW1lbnQub2Zmc2V0V2lkdGggfHwgMDtcbiAgICB0aGlzLndyYXBwZXJIZWlnaHQgPSB0aGlzLm5hdldhcnBSZWYubmF0aXZlRWxlbWVudC5vZmZzZXRIZWlnaHQgfHwgMDtcbiAgICB0aGlzLnNjcm9sbExpc3RIZWlnaHQgPSB0aGlzLm5hdkxpc3RSZWYubmF0aXZlRWxlbWVudC5vZmZzZXRIZWlnaHQgfHwgMDtcbiAgICB0aGlzLnNjcm9sbExpc3RXaWR0aCA9IHRoaXMubmF2TGlzdFJlZi5uYXRpdmVFbGVtZW50Lm9mZnNldFdpZHRoIHx8IDA7XG4gIH1cblxuICBwcml2YXRlIGFsaWduSW5rQmFyVG9TZWxlY3RlZFRhYigpOiB2b2lkIHtcbiAgICBjb25zdCBzZWxlY3RlZEl0ZW0gPSB0aGlzLml0ZW1zICYmIHRoaXMuaXRlbXMubGVuZ3RoID8gdGhpcy5pdGVtcy50b0FycmF5KClbdGhpcy5zZWxlY3RlZEluZGV4XSA6IG51bGw7XG4gICAgY29uc3Qgc2VsZWN0ZWRJdGVtRWxlbWVudCA9IHNlbGVjdGVkSXRlbSA/IHNlbGVjdGVkSXRlbS5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQgOiBudWxsO1xuXG4gICAgaWYgKHNlbGVjdGVkSXRlbUVsZW1lbnQpIHtcbiAgICAgIC8qKlxuICAgICAgICogLmFudC10YWJzLW5hdi1saXN0IC0gVGFyZ2V0IG9mZnNldCBwYXJlbnQgZWxlbWVudFxuICAgICAgICogICDilJTilIDilIAuYW50LXRhYnMtdGFiXG4gICAgICAgKiAgICAgICAg4pSU4pSA4pSALmFudC10YWJzLXRhYi1idG4gLSBDdXJyZW50bHkgZm9jdXNlZCBlbGVtZW50XG4gICAgICAgKi9cbiAgICAgIHRoaXMuaW5rQmFyLmFsaWduVG9FbGVtZW50KHNlbGVjdGVkSXRlbUVsZW1lbnQucGFyZW50RWxlbWVudCEpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc2V0UGluZ1N0YXR1cygpOiB2b2lkIHtcbiAgICBjb25zdCBwaW5nID0ge1xuICAgICAgdG9wOiBmYWxzZSxcbiAgICAgIHJpZ2h0OiBmYWxzZSxcbiAgICAgIGJvdHRvbTogZmFsc2UsXG4gICAgICBsZWZ0OiBmYWxzZVxuICAgIH07XG4gICAgY29uc3QgbmF2V2FycCA9IHRoaXMubmF2V2FycFJlZi5uYXRpdmVFbGVtZW50O1xuICAgIGlmICh0aGlzLnBvc2l0aW9uID09PSAnaG9yaXpvbnRhbCcpIHtcbiAgICAgIGlmICh0aGlzLmdldExheW91dERpcmVjdGlvbigpID09PSAncnRsJykge1xuICAgICAgICBwaW5nLnJpZ2h0ID0gdGhpcy50cmFuc2Zvcm1YID4gMDtcbiAgICAgICAgcGluZy5sZWZ0ID0gdGhpcy50cmFuc2Zvcm1YICsgdGhpcy53cmFwcGVyV2lkdGggPCB0aGlzLnNjcm9sbExpc3RXaWR0aDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHBpbmcubGVmdCA9IHRoaXMudHJhbnNmb3JtWCA8IDA7XG4gICAgICAgIHBpbmcucmlnaHQgPSAtdGhpcy50cmFuc2Zvcm1YICsgdGhpcy53cmFwcGVyV2lkdGggPCB0aGlzLnNjcm9sbExpc3RXaWR0aDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcGluZy50b3AgPSB0aGlzLnRyYW5zZm9ybVkgPCAwO1xuICAgICAgcGluZy5ib3R0b20gPSAtdGhpcy50cmFuc2Zvcm1ZICsgdGhpcy53cmFwcGVySGVpZ2h0IDwgdGhpcy5zY3JvbGxMaXN0SGVpZ2h0O1xuICAgIH1cblxuICAgIChPYmplY3Qua2V5cyhwaW5nKSBhcyBBcnJheTwndG9wJyB8ICdyaWdodCcgfCAnYm90dG9tJyB8ICdsZWZ0Jz4pLmZvckVhY2gocG9zID0+IHtcbiAgICAgIGNvbnN0IGNsYXNzTmFtZSA9IGBhbnQtdGFicy1uYXYtd3JhcC1waW5nLSR7cG9zfWA7XG4gICAgICBpZiAocGluZ1twb3NdKSB7XG4gICAgICAgIG5hdldhcnAuY2xhc3NMaXN0LmFkZChjbGFzc05hbWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbmF2V2FycC5jbGFzc0xpc3QucmVtb3ZlKGNsYXNzTmFtZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHNldFZpc2libGVSYW5nZSgpOiB2b2lkIHtcbiAgICBsZXQgdW5pdDogJ3dpZHRoJyB8ICdoZWlnaHQnO1xuICAgIGxldCBwb3NpdGlvbjogJ2xlZnQnIHwgJ3RvcCcgfCAncmlnaHQnO1xuICAgIGxldCB0cmFuc2Zvcm1TaXplOiBudW1iZXI7XG4gICAgbGV0IGJhc2ljU2l6ZTogbnVtYmVyO1xuICAgIGxldCB0YWJDb250ZW50U2l6ZTogbnVtYmVyO1xuICAgIGxldCBhZGRTaXplOiBudW1iZXI7XG4gICAgY29uc3QgdGFicyA9IHRoaXMuaXRlbXMudG9BcnJheSgpO1xuICAgIGNvbnN0IERFRkFVTFRfU0laRSA9IHsgd2lkdGg6IDAsIGhlaWdodDogMCwgbGVmdDogMCwgdG9wOiAwLCByaWdodDogMCB9O1xuXG4gICAgY29uc3QgZ2V0T2Zmc2V0ID0gKGluZGV4OiBudW1iZXIpOiBudW1iZXIgPT4ge1xuICAgICAgbGV0IG9mZnNldDogbnVtYmVyO1xuICAgICAgY29uc3Qgc2l6ZSA9IHRhYnNbaW5kZXhdIHx8IERFRkFVTFRfU0laRTtcbiAgICAgIGlmIChwb3NpdGlvbiA9PT0gJ3JpZ2h0Jykge1xuICAgICAgICBvZmZzZXQgPSB0YWJzWzBdLmxlZnQgKyB0YWJzWzBdLndpZHRoIC0gdGFic1tpbmRleF0ubGVmdCAtIHRhYnNbaW5kZXhdLndpZHRoO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb2Zmc2V0ID0gc2l6ZVtwb3NpdGlvbl07XG4gICAgICB9XG4gICAgICByZXR1cm4gb2Zmc2V0O1xuICAgIH07XG5cbiAgICBpZiAodGhpcy5wb3NpdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICB1bml0ID0gJ3dpZHRoJztcbiAgICAgIGJhc2ljU2l6ZSA9IHRoaXMud3JhcHBlcldpZHRoO1xuICAgICAgdGFiQ29udGVudFNpemUgPSB0aGlzLnNjcm9sbExpc3RXaWR0aCAtICh0aGlzLmhpZGRlbkl0ZW1zLmxlbmd0aCA/IHRoaXMub3BlcmF0aW9uV2lkdGggOiAwKTtcbiAgICAgIGFkZFNpemUgPSB0aGlzLmFkZEJ1dHRvbldpZHRoO1xuICAgICAgdHJhbnNmb3JtU2l6ZSA9IE1hdGguYWJzKHRoaXMudHJhbnNmb3JtWCk7XG4gICAgICBpZiAodGhpcy5nZXRMYXlvdXREaXJlY3Rpb24oKSA9PT0gJ3J0bCcpIHtcbiAgICAgICAgcG9zaXRpb24gPSAncmlnaHQnO1xuICAgICAgICB0aGlzLnBpbmdSaWdodCA9IHRoaXMudHJhbnNmb3JtWCA+IDA7XG4gICAgICAgIHRoaXMucGluZ0xlZnQgPSB0aGlzLnRyYW5zZm9ybVggKyB0aGlzLndyYXBwZXJXaWR0aCA8IHRoaXMuc2Nyb2xsTGlzdFdpZHRoO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5waW5nTGVmdCA9IHRoaXMudHJhbnNmb3JtWCA8IDA7XG4gICAgICAgIHRoaXMucGluZ1JpZ2h0ID0gLXRoaXMudHJhbnNmb3JtWCArIHRoaXMud3JhcHBlcldpZHRoIDwgdGhpcy5zY3JvbGxMaXN0V2lkdGg7XG4gICAgICAgIHBvc2l0aW9uID0gJ2xlZnQnO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICB1bml0ID0gJ2hlaWdodCc7XG4gICAgICBiYXNpY1NpemUgPSB0aGlzLndyYXBwZXJIZWlnaHQ7XG4gICAgICB0YWJDb250ZW50U2l6ZSA9IHRoaXMuc2Nyb2xsTGlzdEhlaWdodCAtICh0aGlzLmhpZGRlbkl0ZW1zLmxlbmd0aCA/IHRoaXMub3BlcmF0aW9uSGVpZ2h0IDogMCk7XG4gICAgICBhZGRTaXplID0gdGhpcy5hZGRCdXR0b25IZWlnaHQ7XG4gICAgICBwb3NpdGlvbiA9ICd0b3AnO1xuICAgICAgdHJhbnNmb3JtU2l6ZSA9IC10aGlzLnRyYW5zZm9ybVk7XG4gICAgICB0aGlzLnBpbmdUb3AgPSB0aGlzLnRyYW5zZm9ybVkgPCAwO1xuICAgICAgdGhpcy5waW5nQm90dG9tID0gLXRoaXMudHJhbnNmb3JtWSArIHRoaXMud3JhcHBlckhlaWdodCA8IHRoaXMuc2Nyb2xsTGlzdEhlaWdodDtcbiAgICB9XG5cbiAgICBsZXQgbWVyZ2VkQmFzaWNTaXplID0gYmFzaWNTaXplO1xuICAgIGlmICh0YWJDb250ZW50U2l6ZSArIGFkZFNpemUgPiBiYXNpY1NpemUpIHtcbiAgICAgIG1lcmdlZEJhc2ljU2l6ZSA9IGJhc2ljU2l6ZSAtIGFkZFNpemU7XG4gICAgfVxuXG4gICAgaWYgKCF0YWJzLmxlbmd0aCkge1xuICAgICAgdGhpcy5oaWRkZW5JdGVtcyA9IFtdO1xuICAgICAgdGhpcy5jZHIubWFya0ZvckNoZWNrKCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgbGVuID0gdGFicy5sZW5ndGg7XG4gICAgbGV0IGVuZEluZGV4ID0gbGVuO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuOyBpICs9IDEpIHtcbiAgICAgIGNvbnN0IG9mZnNldCA9IGdldE9mZnNldChpKTtcbiAgICAgIGNvbnN0IHNpemUgPSB0YWJzW2ldIHx8IERFRkFVTFRfU0laRTtcbiAgICAgIGlmIChvZmZzZXQgKyBzaXplW3VuaXRdID4gdHJhbnNmb3JtU2l6ZSArIG1lcmdlZEJhc2ljU2l6ZSkge1xuICAgICAgICBlbmRJbmRleCA9IGkgLSAxO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBsZXQgc3RhcnRJbmRleCA9IDA7XG4gICAgZm9yIChsZXQgaSA9IGxlbiAtIDE7IGkgPj0gMDsgaSAtPSAxKSB7XG4gICAgICBjb25zdCBvZmZzZXQgPSBnZXRPZmZzZXQoaSk7XG4gICAgICBpZiAob2Zmc2V0IDwgdHJhbnNmb3JtU2l6ZSkge1xuICAgICAgICBzdGFydEluZGV4ID0gaSArIDE7XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IHN0YXJ0SGlkZGVuVGFicyA9IHRhYnMuc2xpY2UoMCwgc3RhcnRJbmRleCk7XG4gICAgY29uc3QgZW5kSGlkZGVuVGFicyA9IHRhYnMuc2xpY2UoZW5kSW5kZXggKyAxKTtcbiAgICB0aGlzLmhpZGRlbkl0ZW1zID0gWy4uLnN0YXJ0SGlkZGVuVGFicywgLi4uZW5kSGlkZGVuVGFic107XG4gICAgdGhpcy5jZHIubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBwcml2YXRlIGdldExheW91dERpcmVjdGlvbigpOiBEaXJlY3Rpb24ge1xuICAgIHJldHVybiB0aGlzLmRpciAmJiB0aGlzLmRpci52YWx1ZSA9PT0gJ3J0bCcgPyAncnRsJyA6ICdsdHInO1xuICB9XG5cbiAgcHJpdmF0ZSBzZXRUYWJGb2N1cyhfdGFiSW5kZXg6IG51bWJlcik6IHZvaWQge31cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgY29uc3QgeyBwb3NpdGlvbiB9ID0gY2hhbmdlcztcbiAgICAvLyBUaGUgZmlyc3Qgd2lsbCBiZSBhbGlnbmluZyBpbiBuZ0FmdGVyVmlld0luaXRcbiAgICBpZiAocG9zaXRpb24gJiYgIXBvc2l0aW9uLmlzRmlyc3RDaGFuZ2UoKSkge1xuICAgICAgdGhpcy5hbGlnbklua0JhclRvU2VsZWN0ZWRUYWIoKTtcbiAgICAgIHRoaXMubG9ja0FuaW1hdGlvbigpO1xuICAgICAgdGhpcy51cGRhdGVTY3JvbGxMaXN0UG9zaXRpb24oKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==