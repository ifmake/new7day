/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { __decorate, __metadata } from "tslib";
import { FocusTrapFactory } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { ESCAPE } from '@angular/cdk/keycodes';
import { Overlay, OverlayConfig, OverlayKeyboardDispatcher } from '@angular/cdk/overlay';
import { CdkPortalOutlet, ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, EventEmitter, Inject, Injector, Input, Optional, Output, Renderer2, TemplateRef, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NzConfigService, WithConfig } from 'ng-zorro-antd/core/config';
import { warnDeprecation } from 'ng-zorro-antd/core/logger';
import { InputBoolean, toCssPixel } from 'ng-zorro-antd/core/util';
import { NzDrawerContentDirective } from './drawer-content.directive';
import { NzDrawerRef } from './drawer-ref';
export const DRAWER_ANIMATE_DURATION = 300;
const NZ_CONFIG_MODULE_NAME = 'drawer';
export class NzDrawerComponent extends NzDrawerRef {
    constructor(cdr, 
    // tslint:disable-next-line:no-any
    document, nzConfigService, renderer, overlay, injector, changeDetectorRef, focusTrapFactory, viewContainerRef, overlayKeyboardDispatcher, directionality) {
        super();
        this.cdr = cdr;
        this.document = document;
        this.nzConfigService = nzConfigService;
        this.renderer = renderer;
        this.overlay = overlay;
        this.injector = injector;
        this.changeDetectorRef = changeDetectorRef;
        this.focusTrapFactory = focusTrapFactory;
        this.viewContainerRef = viewContainerRef;
        this.overlayKeyboardDispatcher = overlayKeyboardDispatcher;
        this.directionality = directionality;
        this._nzModuleName = NZ_CONFIG_MODULE_NAME;
        this.nzCloseIcon = 'close';
        this.nzClosable = true;
        this.nzMaskClosable = true;
        this.nzMask = true;
        this.nzCloseOnNavigation = true;
        this.nzNoAnimation = false;
        this.nzKeyboard = true;
        this.nzPlacement = 'right';
        this.nzMaskStyle = {};
        this.nzBodyStyle = {};
        this.nzWidth = 256;
        this.nzHeight = 256;
        this.nzZIndex = 1000;
        this.nzOffsetX = 0;
        this.nzOffsetY = 0;
        this.componentInstance = null;
        this.nzOnViewInit = new EventEmitter();
        this.nzOnClose = new EventEmitter();
        this.nzVisibleChange = new EventEmitter();
        this.destroy$ = new Subject();
        this.placementChanging = false;
        this.placementChangeTimeoutId = -1;
        this.isOpen = false;
        this.templateContext = {
            $implicit: undefined,
            drawerRef: this
        };
        this.nzAfterOpen = new Subject();
        this.nzAfterClose = new Subject();
        // from service config
        this.nzDirection = undefined;
        this.dir = 'ltr';
    }
    set nzVisible(value) {
        this.isOpen = value;
    }
    get nzVisible() {
        return this.isOpen;
    }
    get offsetTransform() {
        if (!this.isOpen || this.nzOffsetX + this.nzOffsetY === 0) {
            return null;
        }
        switch (this.nzPlacement) {
            case 'left':
                return `translateX(${this.nzOffsetX}px)`;
            case 'right':
                return `translateX(-${this.nzOffsetX}px)`;
            case 'top':
                return `translateY(${this.nzOffsetY}px)`;
            case 'bottom':
                return `translateY(-${this.nzOffsetY}px)`;
        }
    }
    get transform() {
        if (this.isOpen) {
            return null;
        }
        switch (this.nzPlacement) {
            case 'left':
                return `translateX(-100%)`;
            case 'right':
                return `translateX(100%)`;
            case 'top':
                return `translateY(-100%)`;
            case 'bottom':
                return `translateY(100%)`;
        }
    }
    get width() {
        return this.isLeftOrRight ? toCssPixel(this.nzWidth) : null;
    }
    get height() {
        return !this.isLeftOrRight ? toCssPixel(this.nzHeight) : null;
    }
    get isLeftOrRight() {
        return this.nzPlacement === 'left' || this.nzPlacement === 'right';
    }
    get afterOpen() {
        return this.nzAfterOpen.asObservable();
    }
    get afterClose() {
        return this.nzAfterClose.asObservable();
    }
    isTemplateRef(value) {
        return value instanceof TemplateRef;
    }
    ngOnInit() {
        var _a;
        (_a = this.directionality.change) === null || _a === void 0 ? void 0 : _a.pipe(takeUntil(this.destroy$)).subscribe((direction) => {
            this.dir = direction;
            this.cdr.detectChanges();
        });
        this.dir = this.nzDirection || this.directionality.value;
        this.attachOverlay();
        this.updateOverlayStyle();
        this.updateBodyOverflow();
        this.templateContext = { $implicit: this.nzContentParams, drawerRef: this };
        this.changeDetectorRef.detectChanges();
    }
    ngAfterViewInit() {
        this.attachBodyContent();
        setTimeout(() => {
            this.nzOnViewInit.emit();
        });
    }
    ngAfterContentInit() {
        if (!(this.contentFromContentChild || this.nzContent)) {
            warnDeprecation('Usage `<ng-content></ng-content>` is deprecated, which will be removed in 12.0.0. Please instead use `<ng-template nzDrawerContent></ng-template>` to declare the content of the drawer.');
        }
    }
    ngOnChanges(changes) {
        const { nzPlacement, nzVisible } = changes;
        if (nzVisible) {
            const value = changes.nzVisible.currentValue;
            if (value) {
                this.open();
            }
            else {
                this.close();
            }
        }
        if (nzPlacement && !nzPlacement.isFirstChange()) {
            this.triggerPlacementChangeCycleOnce();
        }
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
        clearTimeout(this.placementChangeTimeoutId);
        this.disposeOverlay();
    }
    getAnimationDuration() {
        return this.nzNoAnimation ? 0 : DRAWER_ANIMATE_DURATION;
    }
    // Disable the transition animation temporarily when the placement changing
    triggerPlacementChangeCycleOnce() {
        if (!this.nzNoAnimation) {
            this.placementChanging = true;
            this.changeDetectorRef.markForCheck();
            clearTimeout(this.placementChangeTimeoutId);
            this.placementChangeTimeoutId = setTimeout(() => {
                this.placementChanging = false;
                this.changeDetectorRef.markForCheck();
            }, this.getAnimationDuration());
        }
    }
    close(result) {
        this.isOpen = false;
        this.nzVisibleChange.emit(false);
        this.updateOverlayStyle();
        this.overlayKeyboardDispatcher.remove(this.overlayRef);
        this.changeDetectorRef.detectChanges();
        setTimeout(() => {
            this.updateBodyOverflow();
            this.restoreFocus();
            this.nzAfterClose.next(result);
            this.nzAfterClose.complete();
            this.componentInstance = null;
        }, this.getAnimationDuration());
    }
    open() {
        this.attachOverlay();
        this.isOpen = true;
        this.nzVisibleChange.emit(true);
        this.overlayKeyboardDispatcher.add(this.overlayRef);
        this.updateOverlayStyle();
        this.updateBodyOverflow();
        this.savePreviouslyFocusedElement();
        this.trapFocus();
        this.changeDetectorRef.detectChanges();
        setTimeout(() => {
            this.nzAfterOpen.next();
        }, this.getAnimationDuration());
    }
    getContentComponent() {
        return this.componentInstance;
    }
    closeClick() {
        this.nzOnClose.emit();
    }
    maskClick() {
        if (this.nzMaskClosable && this.nzMask) {
            this.nzOnClose.emit();
        }
    }
    attachBodyContent() {
        this.bodyPortalOutlet.dispose();
        if (this.nzContent instanceof Type) {
            const childInjector = Injector.create({
                parent: this.injector,
                providers: [{ provide: NzDrawerRef, useValue: this }]
            });
            const componentPortal = new ComponentPortal(this.nzContent, null, childInjector);
            const componentRef = this.bodyPortalOutlet.attachComponentPortal(componentPortal);
            this.componentInstance = componentRef.instance;
            Object.assign(componentRef.instance, this.nzContentParams);
            componentRef.changeDetectorRef.detectChanges();
        }
    }
    attachOverlay() {
        if (!this.overlayRef) {
            this.portal = new TemplatePortal(this.drawerTemplate, this.viewContainerRef);
            this.overlayRef = this.overlay.create(this.getOverlayConfig());
        }
        if (this.overlayRef && !this.overlayRef.hasAttached()) {
            this.overlayRef.attach(this.portal);
            this.overlayRef.keydownEvents()
                .pipe(takeUntil(this.destroy$))
                .subscribe((event) => {
                if (event.keyCode === ESCAPE && this.isOpen && this.nzKeyboard) {
                    this.nzOnClose.emit();
                }
            });
            this.overlayRef
                .detachments()
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => {
                this.disposeOverlay();
            });
        }
    }
    disposeOverlay() {
        var _a;
        (_a = this.overlayRef) === null || _a === void 0 ? void 0 : _a.dispose();
        this.overlayRef = null;
    }
    getOverlayConfig() {
        return new OverlayConfig({
            disposeOnNavigation: this.nzCloseOnNavigation,
            positionStrategy: this.overlay.position().global(),
            scrollStrategy: this.overlay.scrollStrategies.block()
        });
    }
    updateOverlayStyle() {
        if (this.overlayRef && this.overlayRef.overlayElement) {
            this.renderer.setStyle(this.overlayRef.overlayElement, 'pointer-events', this.isOpen ? 'auto' : 'none');
        }
    }
    updateBodyOverflow() {
        if (this.overlayRef) {
            if (this.isOpen) {
                this.overlayRef.getConfig().scrollStrategy.enable();
            }
            else {
                this.overlayRef.getConfig().scrollStrategy.disable();
            }
        }
    }
    savePreviouslyFocusedElement() {
        if (this.document && !this.previouslyFocusedElement) {
            this.previouslyFocusedElement = this.document.activeElement;
            // We need the extra check, because IE's svg element has no blur method.
            if (this.previouslyFocusedElement && typeof this.previouslyFocusedElement.blur === 'function') {
                this.previouslyFocusedElement.blur();
            }
        }
    }
    trapFocus() {
        if (!this.focusTrap && this.overlayRef && this.overlayRef.overlayElement) {
            this.focusTrap = this.focusTrapFactory.create(this.overlayRef.overlayElement);
            this.focusTrap.focusInitialElement();
        }
    }
    restoreFocus() {
        // We need the extra check, because IE can set the `activeElement` to null in some cases.
        if (this.previouslyFocusedElement && typeof this.previouslyFocusedElement.focus === 'function') {
            this.previouslyFocusedElement.focus();
        }
        if (this.focusTrap) {
            this.focusTrap.destroy();
        }
    }
}
NzDrawerComponent.decorators = [
    { type: Component, args: [{
                selector: 'nz-drawer',
                exportAs: 'nzDrawer',
                template: `
    <ng-template #drawerTemplate>
      <div
        class="ant-drawer"
        [nzNoAnimation]="nzNoAnimation"
        [class.ant-drawer-rtl]="dir === 'rtl'"
        [class.ant-drawer-open]="isOpen"
        [class.no-mask]="!nzMask"
        [class.ant-drawer-top]="nzPlacement === 'top'"
        [class.ant-drawer-bottom]="nzPlacement === 'bottom'"
        [class.ant-drawer-right]="nzPlacement === 'right'"
        [class.ant-drawer-left]="nzPlacement === 'left'"
        [style.transform]="offsetTransform"
        [style.transition]="placementChanging ? 'none' : null"
        [style.zIndex]="nzZIndex"
      >
        <div class="ant-drawer-mask" (click)="maskClick()" *ngIf="nzMask" [ngStyle]="nzMaskStyle"></div>
        <div
          class="ant-drawer-content-wrapper {{ nzWrapClassName }}"
          [style.width]="width"
          [style.height]="height"
          [style.transform]="transform"
          [style.transition]="placementChanging ? 'none' : null"
        >
          <div class="ant-drawer-content">
            <div class="ant-drawer-wrapper-body" [style.height]="isLeftOrRight ? '100%' : null">
              <div *ngIf="nzTitle || nzClosable" [class.ant-drawer-header]="!!nzTitle" [class.ant-drawer-header-no-title]="!nzTitle">
                <div *ngIf="nzTitle" class="ant-drawer-title">
                  <ng-container *nzStringTemplateOutlet="nzTitle"><div [innerHTML]="nzTitle"></div></ng-container>
                </div>
                <button *ngIf="nzClosable" (click)="closeClick()" aria-label="Close" class="ant-drawer-close" style="--scroll-bar: 0px;">
                  <ng-container *nzStringTemplateOutlet="nzCloseIcon; let closeIcon">
                    <i nz-icon [nzType]="closeIcon"></i>
                  </ng-container>
                </button>
              </div>
              <div class="ant-drawer-body" [ngStyle]="nzBodyStyle">
                <ng-template cdkPortalOutlet></ng-template>
                <ng-container *ngIf="nzContent; else contentElseTemp">
                  <ng-container *ngIf="isTemplateRef(nzContent)">
                    <ng-container *ngTemplateOutlet="$any(nzContent); context: templateContext"></ng-container>
                  </ng-container>
                </ng-container>
                <ng-template #contentElseTemp>
                  <ng-container *ngIf="contentFromContentChild">
                    <ng-template [ngTemplateOutlet]="contentFromContentChild"></ng-template>
                  </ng-container>
                </ng-template>
                <ng-content *ngIf="!(nzContent || contentFromContentChild)"></ng-content>
              </div>
              <div *ngIf="nzFooter" class="ant-drawer-footer">
                <ng-container *nzStringTemplateOutlet="nzFooter"><div [innerHTML]="nzFooter"></div></ng-container>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ng-template>
  `,
                preserveWhitespaces: false,
                changeDetection: ChangeDetectionStrategy.OnPush
            },] }
];
NzDrawerComponent.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [DOCUMENT,] }] },
    { type: NzConfigService },
    { type: Renderer2 },
    { type: Overlay },
    { type: Injector },
    { type: ChangeDetectorRef },
    { type: FocusTrapFactory },
    { type: ViewContainerRef },
    { type: OverlayKeyboardDispatcher },
    { type: Directionality, decorators: [{ type: Optional }] }
];
NzDrawerComponent.propDecorators = {
    nzContent: [{ type: Input }],
    nzCloseIcon: [{ type: Input }],
    nzClosable: [{ type: Input }],
    nzMaskClosable: [{ type: Input }],
    nzMask: [{ type: Input }],
    nzCloseOnNavigation: [{ type: Input }],
    nzNoAnimation: [{ type: Input }],
    nzKeyboard: [{ type: Input }],
    nzTitle: [{ type: Input }],
    nzFooter: [{ type: Input }],
    nzPlacement: [{ type: Input }],
    nzMaskStyle: [{ type: Input }],
    nzBodyStyle: [{ type: Input }],
    nzWrapClassName: [{ type: Input }],
    nzWidth: [{ type: Input }],
    nzHeight: [{ type: Input }],
    nzZIndex: [{ type: Input }],
    nzOffsetX: [{ type: Input }],
    nzOffsetY: [{ type: Input }],
    nzVisible: [{ type: Input }],
    nzOnViewInit: [{ type: Output }],
    nzOnClose: [{ type: Output }],
    nzVisibleChange: [{ type: Output }],
    drawerTemplate: [{ type: ViewChild, args: ['drawerTemplate', { static: true },] }],
    bodyPortalOutlet: [{ type: ViewChild, args: [CdkPortalOutlet, { static: false },] }],
    contentFromContentChild: [{ type: ContentChild, args: [NzDrawerContentDirective, { static: true, read: TemplateRef },] }]
};
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzDrawerComponent.prototype, "nzClosable", void 0);
__decorate([
    WithConfig(),
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzDrawerComponent.prototype, "nzMaskClosable", void 0);
__decorate([
    WithConfig(),
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzDrawerComponent.prototype, "nzMask", void 0);
__decorate([
    WithConfig(),
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzDrawerComponent.prototype, "nzCloseOnNavigation", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Object)
], NzDrawerComponent.prototype, "nzNoAnimation", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzDrawerComponent.prototype, "nzKeyboard", void 0);
__decorate([
    WithConfig(),
    __metadata("design:type", String)
], NzDrawerComponent.prototype, "nzDirection", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHJhd2VyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9jb21wb25lbnRzL2RyYXdlci8iLCJzb3VyY2VzIjpbImRyYXdlci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHOztBQUVILE9BQU8sRUFBYSxnQkFBZ0IsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ2hFLE9BQU8sRUFBYSxjQUFjLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUM5RCxPQUFPLEVBQUUsTUFBTSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDL0MsT0FBTyxFQUFFLE9BQU8sRUFBRSxhQUFhLEVBQUUseUJBQXlCLEVBQWMsTUFBTSxzQkFBc0IsQ0FBQztBQUNyRyxPQUFPLEVBQUUsZUFBZSxFQUFFLGVBQWUsRUFBRSxjQUFjLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUN2RixPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUdMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFlBQVksRUFDWixZQUFZLEVBQ1osTUFBTSxFQUNOLFFBQVEsRUFDUixLQUFLLEVBSUwsUUFBUSxFQUNSLE1BQU0sRUFDTixTQUFTLEVBRVQsV0FBVyxFQUNYLElBQUksRUFDSixTQUFTLEVBQ1QsZ0JBQWdCLEVBQ2pCLE1BQU0sZUFBZSxDQUFDO0FBRXZCLE9BQU8sRUFBYyxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDM0MsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRTNDLE9BQU8sRUFBZSxlQUFlLEVBQUUsVUFBVSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDckYsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBRTVELE9BQU8sRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFFbkUsT0FBTyxFQUFFLHdCQUF3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RTs7OERBQXFDO0FBQ2xEO0lBQWYsWUFBWSxFQUFFOzt3REFBdUI7QUFDdEI7SUFBZixZQUFZLEVBQUU7O3FEQUE0QjtBQTBHdEM7SUFBYixVQUFVLEVBQUU7O3NEQUFxQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9naXRodWIuY29tL05HLVpPUlJPL25nLXpvcnJvLWFudGQvYmxvYi9tYXN0ZXIvTElDRU5TRVxuICovXG5cbmltcG9ydCB7IEZvY3VzVHJhcCwgRm9jdXNUcmFwRmFjdG9yeSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9hMTF5JztcbmltcG9ydCB7IERpcmVjdGlvbiwgRGlyZWN0aW9uYWxpdHkgfSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQgeyBFU0NBUEUgfSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHsgT3ZlcmxheSwgT3ZlcmxheUNvbmZpZywgT3ZlcmxheUtleWJvYXJkRGlzcGF0Y2hlciwgT3ZlcmxheVJlZiB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7IENka1BvcnRhbE91dGxldCwgQ29tcG9uZW50UG9ydGFsLCBUZW1wbGF0ZVBvcnRhbCB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZCxcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3QsXG4gIEluamVjdG9yLFxuICBJbnB1dCxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbiAgUmVuZGVyZXIyLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBUZW1wbGF0ZVJlZixcbiAgVHlwZSxcbiAgVmlld0NoaWxkLFxuICBWaWV3Q29udGFpbmVyUmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBPYnNlcnZhYmxlLCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IE56Q29uZmlnS2V5LCBOekNvbmZpZ1NlcnZpY2UsIFdpdGhDb25maWcgfSBmcm9tICduZy16b3Jyby1hbnRkL2NvcmUvY29uZmlnJztcbmltcG9ydCB7IHdhcm5EZXByZWNhdGlvbiB9IGZyb20gJ25nLXpvcnJvLWFudGQvY29yZS9sb2dnZXInO1xuaW1wb3J0IHsgQm9vbGVhbklucHV0LCBOZ1N0eWxlSW50ZXJmYWNlLCBOelNhZmVBbnkgfSBmcm9tICduZy16b3Jyby1hbnRkL2NvcmUvdHlwZXMnO1xuaW1wb3J0IHsgSW5wdXRCb29sZWFuLCB0b0Nzc1BpeGVsIH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL3V0aWwnO1xuXG5pbXBvcnQgeyBOekRyYXdlckNvbnRlbnREaXJlY3RpdmUgfSBmcm9tICcuL2RyYXdlci1jb250ZW50LmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBOekRyYXdlck9wdGlvbnNPZkNvbXBvbmVudCwgTnpEcmF3ZXJQbGFjZW1lbnQgfSBmcm9tICcuL2RyYXdlci1vcHRpb25zJztcbmltcG9ydCB7IE56RHJhd2VyUmVmIH0gZnJvbSAnLi9kcmF3ZXItcmVmJztcblxuZXhwb3J0IGNvbnN0IERSQVdFUl9BTklNQVRFX0RVUkFUSU9OID0gMzAwO1xuXG5jb25zdCBOWl9DT05GSUdfTU9EVUxFX05BTUU6IE56Q29uZmlnS2V5ID0gJ2RyYXdlcic7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ256LWRyYXdlcicsXG4gIGV4cG9ydEFzOiAnbnpEcmF3ZXInLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxuZy10ZW1wbGF0ZSAjZHJhd2VyVGVtcGxhdGU+XG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzPVwiYW50LWRyYXdlclwiXG4gICAgICAgIFtuek5vQW5pbWF0aW9uXT1cIm56Tm9BbmltYXRpb25cIlxuICAgICAgICBbY2xhc3MuYW50LWRyYXdlci1ydGxdPVwiZGlyID09PSAncnRsJ1wiXG4gICAgICAgIFtjbGFzcy5hbnQtZHJhd2VyLW9wZW5dPVwiaXNPcGVuXCJcbiAgICAgICAgW2NsYXNzLm5vLW1hc2tdPVwiIW56TWFza1wiXG4gICAgICAgIFtjbGFzcy5hbnQtZHJhd2VyLXRvcF09XCJuelBsYWNlbWVudCA9PT0gJ3RvcCdcIlxuICAgICAgICBbY2xhc3MuYW50LWRyYXdlci1ib3R0b21dPVwibnpQbGFjZW1lbnQgPT09ICdib3R0b20nXCJcbiAgICAgICAgW2NsYXNzLmFudC1kcmF3ZXItcmlnaHRdPVwibnpQbGFjZW1lbnQgPT09ICdyaWdodCdcIlxuICAgICAgICBbY2xhc3MuYW50LWRyYXdlci1sZWZ0XT1cIm56UGxhY2VtZW50ID09PSAnbGVmdCdcIlxuICAgICAgICBbc3R5bGUudHJhbnNmb3JtXT1cIm9mZnNldFRyYW5zZm9ybVwiXG4gICAgICAgIFtzdHlsZS50cmFuc2l0aW9uXT1cInBsYWNlbWVudENoYW5naW5nID8gJ25vbmUnIDogbnVsbFwiXG4gICAgICAgIFtzdHlsZS56SW5kZXhdPVwibnpaSW5kZXhcIlxuICAgICAgPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiYW50LWRyYXdlci1tYXNrXCIgKGNsaWNrKT1cIm1hc2tDbGljaygpXCIgKm5nSWY9XCJuek1hc2tcIiBbbmdTdHlsZV09XCJuek1hc2tTdHlsZVwiPjwvZGl2PlxuICAgICAgICA8ZGl2XG4gICAgICAgICAgY2xhc3M9XCJhbnQtZHJhd2VyLWNvbnRlbnQtd3JhcHBlciB7eyBueldyYXBDbGFzc05hbWUgfX1cIlxuICAgICAgICAgIFtzdHlsZS53aWR0aF09XCJ3aWR0aFwiXG4gICAgICAgICAgW3N0eWxlLmhlaWdodF09XCJoZWlnaHRcIlxuICAgICAgICAgIFtzdHlsZS50cmFuc2Zvcm1dPVwidHJhbnNmb3JtXCJcbiAgICAgICAgICBbc3R5bGUudHJhbnNpdGlvbl09XCJwbGFjZW1lbnRDaGFuZ2luZyA/ICdub25lJyA6IG51bGxcIlxuICAgICAgICA+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImFudC1kcmF3ZXItY29udGVudFwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImFudC1kcmF3ZXItd3JhcHBlci1ib2R5XCIgW3N0eWxlLmhlaWdodF09XCJpc0xlZnRPclJpZ2h0ID8gJzEwMCUnIDogbnVsbFwiPlxuICAgICAgICAgICAgICA8ZGl2ICpuZ0lmPVwibnpUaXRsZSB8fCBuekNsb3NhYmxlXCIgW2NsYXNzLmFudC1kcmF3ZXItaGVhZGVyXT1cIiEhbnpUaXRsZVwiIFtjbGFzcy5hbnQtZHJhd2VyLWhlYWRlci1uby10aXRsZV09XCIhbnpUaXRsZVwiPlxuICAgICAgICAgICAgICAgIDxkaXYgKm5nSWY9XCJuelRpdGxlXCIgY2xhc3M9XCJhbnQtZHJhd2VyLXRpdGxlXCI+XG4gICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuelN0cmluZ1RlbXBsYXRlT3V0bGV0PVwibnpUaXRsZVwiPjxkaXYgW2lubmVySFRNTF09XCJuelRpdGxlXCI+PC9kaXY+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiAqbmdJZj1cIm56Q2xvc2FibGVcIiAoY2xpY2spPVwiY2xvc2VDbGljaygpXCIgYXJpYS1sYWJlbD1cIkNsb3NlXCIgY2xhc3M9XCJhbnQtZHJhd2VyLWNsb3NlXCIgc3R5bGU9XCItLXNjcm9sbC1iYXI6IDBweDtcIj5cbiAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm56U3RyaW5nVGVtcGxhdGVPdXRsZXQ9XCJuekNsb3NlSWNvbjsgbGV0IGNsb3NlSWNvblwiPlxuICAgICAgICAgICAgICAgICAgICA8aSBuei1pY29uIFtuelR5cGVdPVwiY2xvc2VJY29uXCI+PC9pPlxuICAgICAgICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgPC9idXR0b24+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYW50LWRyYXdlci1ib2R5XCIgW25nU3R5bGVdPVwibnpCb2R5U3R5bGVcIj5cbiAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgY2RrUG9ydGFsT3V0bGV0PjwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIm56Q29udGVudDsgZWxzZSBjb250ZW50RWxzZVRlbXBcIj5cbiAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJpc1RlbXBsYXRlUmVmKG56Q29udGVudClcIj5cbiAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdUZW1wbGF0ZU91dGxldD1cIiRhbnkobnpDb250ZW50KTsgY29udGV4dDogdGVtcGxhdGVDb250ZXh0XCI+PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgI2NvbnRlbnRFbHNlVGVtcD5cbiAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJjb250ZW50RnJvbUNvbnRlbnRDaGlsZFwiPlxuICAgICAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwiY29udGVudEZyb21Db250ZW50Q2hpbGRcIj48L25nLXRlbXBsYXRlPlxuICAgICAgICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICA8bmctY29udGVudCAqbmdJZj1cIiEobnpDb250ZW50IHx8IGNvbnRlbnRGcm9tQ29udGVudENoaWxkKVwiPjwvbmctY29udGVudD5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgKm5nSWY9XCJuekZvb3RlclwiIGNsYXNzPVwiYW50LWRyYXdlci1mb290ZXJcIj5cbiAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuelN0cmluZ1RlbXBsYXRlT3V0bGV0PVwibnpGb290ZXJcIj48ZGl2IFtpbm5lckhUTUxdPVwibnpGb290ZXJcIj48L2Rpdj48L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L25nLXRlbXBsYXRlPlxuICBgLFxuICBwcmVzZXJ2ZVdoaXRlc3BhY2VzOiBmYWxzZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgTnpEcmF3ZXJDb21wb25lbnQ8VCA9IE56U2FmZUFueSwgUiA9IE56U2FmZUFueSwgRCA9IE56U2FmZUFueT5cbiAgZXh0ZW5kcyBOekRyYXdlclJlZjxULCBSPlxuICBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95LCBBZnRlclZpZXdJbml0LCBPbkNoYW5nZXMsIEFmdGVyQ29udGVudEluaXQsIE56RHJhd2VyT3B0aW9uc09mQ29tcG9uZW50IHtcbiAgcmVhZG9ubHkgX256TW9kdWxlTmFtZTogTnpDb25maWdLZXkgPSBOWl9DT05GSUdfTU9EVUxFX05BTUU7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9uekNsb3NhYmxlOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9uek1hc2tDbG9zYWJsZTogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbnpNYXNrOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9uek5vQW5pbWF0aW9uOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9uektleWJvYXJkOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9uekNsb3NlT25OYXZpZ2F0aW9uOiBCb29sZWFuSW5wdXQ7XG5cbiAgQElucHV0KCkgbnpDb250ZW50ITogVGVtcGxhdGVSZWY8eyAkaW1wbGljaXQ6IEQ7IGRyYXdlclJlZjogTnpEcmF3ZXJSZWY8Uj4gfT4gfCBUeXBlPFQ+O1xuICBASW5wdXQoKSBuekNsb3NlSWNvbjogc3RyaW5nIHwgVGVtcGxhdGVSZWY8dm9pZD4gPSAnY2xvc2UnO1xuICBASW5wdXQoKSBASW5wdXRCb29sZWFuKCkgbnpDbG9zYWJsZTogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dCgpIEBXaXRoQ29uZmlnKCkgQElucHV0Qm9vbGVhbigpIG56TWFza0Nsb3NhYmxlOiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0KCkgQFdpdGhDb25maWcoKSBASW5wdXRCb29sZWFuKCkgbnpNYXNrOiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0KCkgQFdpdGhDb25maWcoKSBASW5wdXRCb29sZWFuKCkgbnpDbG9zZU9uTmF2aWdhdGlvbjogYm9vbGVhbiA9IHRydWU7XG4gIEBJbnB1dCgpIEBJbnB1dEJvb2xlYW4oKSBuek5vQW5pbWF0aW9uID0gZmFsc2U7XG4gIEBJbnB1dCgpIEBJbnB1dEJvb2xlYW4oKSBuektleWJvYXJkOiBib29sZWFuID0gdHJ1ZTtcbiAgQElucHV0KCkgbnpUaXRsZT86IHN0cmluZyB8IFRlbXBsYXRlUmVmPHt9PjtcbiAgQElucHV0KCkgbnpGb290ZXI/OiBzdHJpbmcgfCBUZW1wbGF0ZVJlZjx7fT47XG4gIEBJbnB1dCgpIG56UGxhY2VtZW50OiBOekRyYXdlclBsYWNlbWVudCA9ICdyaWdodCc7XG4gIEBJbnB1dCgpIG56TWFza1N0eWxlOiBOZ1N0eWxlSW50ZXJmYWNlID0ge307XG4gIEBJbnB1dCgpIG56Qm9keVN0eWxlOiBOZ1N0eWxlSW50ZXJmYWNlID0ge307XG4gIEBJbnB1dCgpIG56V3JhcENsYXNzTmFtZT86IHN0cmluZztcbiAgQElucHV0KCkgbnpXaWR0aDogbnVtYmVyIHwgc3RyaW5nID0gMjU2O1xuICBASW5wdXQoKSBuekhlaWdodDogbnVtYmVyIHwgc3RyaW5nID0gMjU2O1xuICBASW5wdXQoKSBuelpJbmRleCA9IDEwMDA7XG4gIEBJbnB1dCgpIG56T2Zmc2V0WCA9IDA7XG4gIEBJbnB1dCgpIG56T2Zmc2V0WSA9IDA7XG4gIHByaXZhdGUgY29tcG9uZW50SW5zdGFuY2U6IFQgfCBudWxsID0gbnVsbDtcblxuICBASW5wdXQoKVxuICBzZXQgbnpWaXNpYmxlKHZhbHVlOiBib29sZWFuKSB7XG4gICAgdGhpcy5pc09wZW4gPSB2YWx1ZTtcbiAgfVxuXG4gIGdldCBuelZpc2libGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuaXNPcGVuO1xuICB9XG5cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG56T25WaWV3SW5pdCA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcbiAgQE91dHB1dCgpIHJlYWRvbmx5IG56T25DbG9zZSA9IG5ldyBFdmVudEVtaXR0ZXI8TW91c2VFdmVudD4oKTtcbiAgQE91dHB1dCgpIHJlYWRvbmx5IG56VmlzaWJsZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcblxuICBAVmlld0NoaWxkKCdkcmF3ZXJUZW1wbGF0ZScsIHsgc3RhdGljOiB0cnVlIH0pIGRyYXdlclRlbXBsYXRlITogVGVtcGxhdGVSZWY8dm9pZD47XG4gIEBWaWV3Q2hpbGQoQ2RrUG9ydGFsT3V0bGV0LCB7IHN0YXRpYzogZmFsc2UgfSkgYm9keVBvcnRhbE91dGxldD86IENka1BvcnRhbE91dGxldDtcbiAgQENvbnRlbnRDaGlsZChOekRyYXdlckNvbnRlbnREaXJlY3RpdmUsIHsgc3RhdGljOiB0cnVlLCByZWFkOiBUZW1wbGF0ZVJlZiB9KSBjb250ZW50RnJvbUNvbnRlbnRDaGlsZD86IFRlbXBsYXRlUmVmPE56U2FmZUFueT47XG5cbiAgcHJpdmF0ZSBkZXN0cm95JCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG4gIHByZXZpb3VzbHlGb2N1c2VkRWxlbWVudD86IEhUTUxFbGVtZW50O1xuICBwbGFjZW1lbnRDaGFuZ2luZyA9IGZhbHNlO1xuICBwbGFjZW1lbnRDaGFuZ2VUaW1lb3V0SWQgPSAtMTtcbiAgbnpDb250ZW50UGFyYW1zPzogRDsgLy8gb25seSBzZXJ2aWNlXG4gIG92ZXJsYXlSZWY/OiBPdmVybGF5UmVmIHwgbnVsbDtcbiAgcG9ydGFsPzogVGVtcGxhdGVQb3J0YWw7XG4gIGZvY3VzVHJhcD86IEZvY3VzVHJhcDtcbiAgaXNPcGVuID0gZmFsc2U7XG4gIHRlbXBsYXRlQ29udGV4dDogeyAkaW1wbGljaXQ6IEQgfCB1bmRlZmluZWQ7IGRyYXdlclJlZjogTnpEcmF3ZXJSZWY8Uj4gfSA9IHtcbiAgICAkaW1wbGljaXQ6IHVuZGVmaW5lZCxcbiAgICBkcmF3ZXJSZWY6IHRoaXMgYXMgTnpEcmF3ZXJSZWY8Uj5cbiAgfTtcblxuICBnZXQgb2Zmc2V0VHJhbnNmb3JtKCk6IHN0cmluZyB8IG51bGwge1xuICAgIGlmICghdGhpcy5pc09wZW4gfHwgdGhpcy5uek9mZnNldFggKyB0aGlzLm56T2Zmc2V0WSA9PT0gMCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHN3aXRjaCAodGhpcy5uelBsYWNlbWVudCkge1xuICAgICAgY2FzZSAnbGVmdCc6XG4gICAgICAgIHJldHVybiBgdHJhbnNsYXRlWCgke3RoaXMubnpPZmZzZXRYfXB4KWA7XG4gICAgICBjYXNlICdyaWdodCc6XG4gICAgICAgIHJldHVybiBgdHJhbnNsYXRlWCgtJHt0aGlzLm56T2Zmc2V0WH1weClgO1xuICAgICAgY2FzZSAndG9wJzpcbiAgICAgICAgcmV0dXJuIGB0cmFuc2xhdGVZKCR7dGhpcy5uek9mZnNldFl9cHgpYDtcbiAgICAgIGNhc2UgJ2JvdHRvbSc6XG4gICAgICAgIHJldHVybiBgdHJhbnNsYXRlWSgtJHt0aGlzLm56T2Zmc2V0WX1weClgO1xuICAgIH1cbiAgfVxuXG4gIGdldCB0cmFuc2Zvcm0oKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgaWYgKHRoaXMuaXNPcGVuKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICBzd2l0Y2ggKHRoaXMubnpQbGFjZW1lbnQpIHtcbiAgICAgIGNhc2UgJ2xlZnQnOlxuICAgICAgICByZXR1cm4gYHRyYW5zbGF0ZVgoLTEwMCUpYDtcbiAgICAgIGNhc2UgJ3JpZ2h0JzpcbiAgICAgICAgcmV0dXJuIGB0cmFuc2xhdGVYKDEwMCUpYDtcbiAgICAgIGNhc2UgJ3RvcCc6XG4gICAgICAgIHJldHVybiBgdHJhbnNsYXRlWSgtMTAwJSlgO1xuICAgICAgY2FzZSAnYm90dG9tJzpcbiAgICAgICAgcmV0dXJuIGB0cmFuc2xhdGVZKDEwMCUpYDtcbiAgICB9XG4gIH1cblxuICBnZXQgd2lkdGgoKTogc3RyaW5nIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuaXNMZWZ0T3JSaWdodCA/IHRvQ3NzUGl4ZWwodGhpcy5ueldpZHRoKSA6IG51bGw7XG4gIH1cblxuICBnZXQgaGVpZ2h0KCk6IHN0cmluZyB8IG51bGwge1xuICAgIHJldHVybiAhdGhpcy5pc0xlZnRPclJpZ2h0ID8gdG9Dc3NQaXhlbCh0aGlzLm56SGVpZ2h0KSA6IG51bGw7XG4gIH1cblxuICBnZXQgaXNMZWZ0T3JSaWdodCgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5uelBsYWNlbWVudCA9PT0gJ2xlZnQnIHx8IHRoaXMubnpQbGFjZW1lbnQgPT09ICdyaWdodCc7XG4gIH1cblxuICBuekFmdGVyT3BlbiA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG4gIG56QWZ0ZXJDbG9zZSA9IG5ldyBTdWJqZWN0PFI+KCk7XG5cbiAgZ2V0IGFmdGVyT3BlbigpOiBPYnNlcnZhYmxlPHZvaWQ+IHtcbiAgICByZXR1cm4gdGhpcy5uekFmdGVyT3Blbi5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIGdldCBhZnRlckNsb3NlKCk6IE9ic2VydmFibGU8Uj4ge1xuICAgIHJldHVybiB0aGlzLm56QWZ0ZXJDbG9zZS5hc09ic2VydmFibGUoKTtcbiAgfVxuXG4gIGlzVGVtcGxhdGVSZWYodmFsdWU6IHt9KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHZhbHVlIGluc3RhbmNlb2YgVGVtcGxhdGVSZWY7XG4gIH1cblxuICAvLyBmcm9tIHNlcnZpY2UgY29uZmlnXG4gIEBXaXRoQ29uZmlnKCkgbnpEaXJlY3Rpb24/OiBEaXJlY3Rpb24gPSB1bmRlZmluZWQ7XG5cbiAgZGlyOiBEaXJlY3Rpb24gPSAnbHRyJztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLWFueVxuICAgIEBPcHRpb25hbCgpIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jdW1lbnQ6IE56U2FmZUFueSxcbiAgICBwdWJsaWMgbnpDb25maWdTZXJ2aWNlOiBOekNvbmZpZ1NlcnZpY2UsXG4gICAgcHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHByaXZhdGUgb3ZlcmxheTogT3ZlcmxheSxcbiAgICBwcml2YXRlIGluamVjdG9yOiBJbmplY3RvcixcbiAgICBwcml2YXRlIGNoYW5nZURldGVjdG9yUmVmOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBwcml2YXRlIGZvY3VzVHJhcEZhY3Rvcnk6IEZvY3VzVHJhcEZhY3RvcnksXG4gICAgcHJpdmF0ZSB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIHByaXZhdGUgb3ZlcmxheUtleWJvYXJkRGlzcGF0Y2hlcjogT3ZlcmxheUtleWJvYXJkRGlzcGF0Y2hlcixcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIGRpcmVjdGlvbmFsaXR5OiBEaXJlY3Rpb25hbGl0eVxuICApIHtcbiAgICBzdXBlcigpO1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5kaXJlY3Rpb25hbGl0eS5jaGFuZ2U/LnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKS5zdWJzY3JpYmUoKGRpcmVjdGlvbjogRGlyZWN0aW9uKSA9PiB7XG4gICAgICB0aGlzLmRpciA9IGRpcmVjdGlvbjtcbiAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICB9KTtcbiAgICB0aGlzLmRpciA9IHRoaXMubnpEaXJlY3Rpb24gfHwgdGhpcy5kaXJlY3Rpb25hbGl0eS52YWx1ZTtcblxuICAgIHRoaXMuYXR0YWNoT3ZlcmxheSgpO1xuICAgIHRoaXMudXBkYXRlT3ZlcmxheVN0eWxlKCk7XG4gICAgdGhpcy51cGRhdGVCb2R5T3ZlcmZsb3coKTtcbiAgICB0aGlzLnRlbXBsYXRlQ29udGV4dCA9IHsgJGltcGxpY2l0OiB0aGlzLm56Q29udGVudFBhcmFtcywgZHJhd2VyUmVmOiB0aGlzIGFzIE56RHJhd2VyUmVmPFI+IH07XG4gICAgdGhpcy5jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgdGhpcy5hdHRhY2hCb2R5Q29udGVudCgpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5uek9uVmlld0luaXQuZW1pdCgpO1xuICAgIH0pO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCk6IHZvaWQge1xuICAgIGlmICghKHRoaXMuY29udGVudEZyb21Db250ZW50Q2hpbGQgfHwgdGhpcy5uekNvbnRlbnQpKSB7XG4gICAgICB3YXJuRGVwcmVjYXRpb24oXG4gICAgICAgICdVc2FnZSBgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PmAgaXMgZGVwcmVjYXRlZCwgd2hpY2ggd2lsbCBiZSByZW1vdmVkIGluIDEyLjAuMC4gUGxlYXNlIGluc3RlYWQgdXNlIGA8bmctdGVtcGxhdGUgbnpEcmF3ZXJDb250ZW50PjwvbmctdGVtcGxhdGU+YCB0byBkZWNsYXJlIHRoZSBjb250ZW50IG9mIHRoZSBkcmF3ZXIuJ1xuICAgICAgKTtcbiAgICB9XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgY29uc3QgeyBuelBsYWNlbWVudCwgbnpWaXNpYmxlIH0gPSBjaGFuZ2VzO1xuICAgIGlmIChuelZpc2libGUpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gY2hhbmdlcy5uelZpc2libGUuY3VycmVudFZhbHVlO1xuICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgIHRoaXMub3BlbigpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5jbG9zZSgpO1xuICAgICAgfVxuICAgIH1cbiAgICBpZiAobnpQbGFjZW1lbnQgJiYgIW56UGxhY2VtZW50LmlzRmlyc3RDaGFuZ2UoKSkge1xuICAgICAgdGhpcy50cmlnZ2VyUGxhY2VtZW50Q2hhbmdlQ3ljbGVPbmNlKCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5kZXN0cm95JC5uZXh0KCk7XG4gICAgdGhpcy5kZXN0cm95JC5jb21wbGV0ZSgpO1xuICAgIGNsZWFyVGltZW91dCh0aGlzLnBsYWNlbWVudENoYW5nZVRpbWVvdXRJZCk7XG4gICAgdGhpcy5kaXNwb3NlT3ZlcmxheSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBnZXRBbmltYXRpb25EdXJhdGlvbigpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLm56Tm9BbmltYXRpb24gPyAwIDogRFJBV0VSX0FOSU1BVEVfRFVSQVRJT047XG4gIH1cblxuICAvLyBEaXNhYmxlIHRoZSB0cmFuc2l0aW9uIGFuaW1hdGlvbiB0ZW1wb3JhcmlseSB3aGVuIHRoZSBwbGFjZW1lbnQgY2hhbmdpbmdcbiAgcHJpdmF0ZSB0cmlnZ2VyUGxhY2VtZW50Q2hhbmdlQ3ljbGVPbmNlKCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5uek5vQW5pbWF0aW9uKSB7XG4gICAgICB0aGlzLnBsYWNlbWVudENoYW5naW5nID0gdHJ1ZTtcbiAgICAgIHRoaXMuY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgICBjbGVhclRpbWVvdXQodGhpcy5wbGFjZW1lbnRDaGFuZ2VUaW1lb3V0SWQpO1xuICAgICAgdGhpcy5wbGFjZW1lbnRDaGFuZ2VUaW1lb3V0SWQgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5wbGFjZW1lbnRDaGFuZ2luZyA9IGZhbHNlO1xuICAgICAgICB0aGlzLmNoYW5nZURldGVjdG9yUmVmLm1hcmtGb3JDaGVjaygpO1xuICAgICAgfSwgdGhpcy5nZXRBbmltYXRpb25EdXJhdGlvbigpKTtcbiAgICB9XG4gIH1cblxuICBjbG9zZShyZXN1bHQ/OiBSKTogdm9pZCB7XG4gICAgdGhpcy5pc09wZW4gPSBmYWxzZTtcbiAgICB0aGlzLm56VmlzaWJsZUNoYW5nZS5lbWl0KGZhbHNlKTtcbiAgICB0aGlzLnVwZGF0ZU92ZXJsYXlTdHlsZSgpO1xuICAgIHRoaXMub3ZlcmxheUtleWJvYXJkRGlzcGF0Y2hlci5yZW1vdmUodGhpcy5vdmVybGF5UmVmISk7XG4gICAgdGhpcy5jaGFuZ2VEZXRlY3RvclJlZi5kZXRlY3RDaGFuZ2VzKCk7XG4gICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZUJvZHlPdmVyZmxvdygpO1xuICAgICAgdGhpcy5yZXN0b3JlRm9jdXMoKTtcbiAgICAgIHRoaXMubnpBZnRlckNsb3NlLm5leHQocmVzdWx0KTtcbiAgICAgIHRoaXMubnpBZnRlckNsb3NlLmNvbXBsZXRlKCk7XG4gICAgICB0aGlzLmNvbXBvbmVudEluc3RhbmNlID0gbnVsbDtcbiAgICB9LCB0aGlzLmdldEFuaW1hdGlvbkR1cmF0aW9uKCkpO1xuICB9XG5cbiAgb3BlbigpOiB2b2lkIHtcbiAgICB0aGlzLmF0dGFjaE92ZXJsYXkoKTtcbiAgICB0aGlzLmlzT3BlbiA9IHRydWU7XG4gICAgdGhpcy5uelZpc2libGVDaGFuZ2UuZW1pdCh0cnVlKTtcbiAgICB0aGlzLm92ZXJsYXlLZXlib2FyZERpc3BhdGNoZXIuYWRkKHRoaXMub3ZlcmxheVJlZiEpO1xuICAgIHRoaXMudXBkYXRlT3ZlcmxheVN0eWxlKCk7XG4gICAgdGhpcy51cGRhdGVCb2R5T3ZlcmZsb3coKTtcbiAgICB0aGlzLnNhdmVQcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQoKTtcbiAgICB0aGlzLnRyYXBGb2N1cygpO1xuICAgIHRoaXMuY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIHNldFRpbWVvdXQoKCkgPT4ge1xuICAgICAgdGhpcy5uekFmdGVyT3Blbi5uZXh0KCk7XG4gICAgfSwgdGhpcy5nZXRBbmltYXRpb25EdXJhdGlvbigpKTtcbiAgfVxuXG4gIGdldENvbnRlbnRDb21wb25lbnQoKTogVCB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLmNvbXBvbmVudEluc3RhbmNlO1xuICB9XG5cbiAgY2xvc2VDbGljaygpOiB2b2lkIHtcbiAgICB0aGlzLm56T25DbG9zZS5lbWl0KCk7XG4gIH1cblxuICBtYXNrQ2xpY2soKTogdm9pZCB7XG4gICAgaWYgKHRoaXMubnpNYXNrQ2xvc2FibGUgJiYgdGhpcy5uek1hc2spIHtcbiAgICAgIHRoaXMubnpPbkNsb3NlLmVtaXQoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGF0dGFjaEJvZHlDb250ZW50KCk6IHZvaWQge1xuICAgIHRoaXMuYm9keVBvcnRhbE91dGxldCEuZGlzcG9zZSgpO1xuXG4gICAgaWYgKHRoaXMubnpDb250ZW50IGluc3RhbmNlb2YgVHlwZSkge1xuICAgICAgY29uc3QgY2hpbGRJbmplY3RvciA9IEluamVjdG9yLmNyZWF0ZSh7XG4gICAgICAgIHBhcmVudDogdGhpcy5pbmplY3RvcixcbiAgICAgICAgcHJvdmlkZXJzOiBbeyBwcm92aWRlOiBOekRyYXdlclJlZiwgdXNlVmFsdWU6IHRoaXMgfV1cbiAgICAgIH0pO1xuICAgICAgY29uc3QgY29tcG9uZW50UG9ydGFsID0gbmV3IENvbXBvbmVudFBvcnRhbDxUPih0aGlzLm56Q29udGVudCwgbnVsbCwgY2hpbGRJbmplY3Rvcik7XG4gICAgICBjb25zdCBjb21wb25lbnRSZWYgPSB0aGlzLmJvZHlQb3J0YWxPdXRsZXQhLmF0dGFjaENvbXBvbmVudFBvcnRhbChjb21wb25lbnRQb3J0YWwpO1xuICAgICAgdGhpcy5jb21wb25lbnRJbnN0YW5jZSA9IGNvbXBvbmVudFJlZi5pbnN0YW5jZTtcbiAgICAgIE9iamVjdC5hc3NpZ24oY29tcG9uZW50UmVmLmluc3RhbmNlLCB0aGlzLm56Q29udGVudFBhcmFtcyk7XG4gICAgICBjb21wb25lbnRSZWYuY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgYXR0YWNoT3ZlcmxheSgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMub3ZlcmxheVJlZikge1xuICAgICAgdGhpcy5wb3J0YWwgPSBuZXcgVGVtcGxhdGVQb3J0YWwodGhpcy5kcmF3ZXJUZW1wbGF0ZSwgdGhpcy52aWV3Q29udGFpbmVyUmVmKTtcbiAgICAgIHRoaXMub3ZlcmxheVJlZiA9IHRoaXMub3ZlcmxheS5jcmVhdGUodGhpcy5nZXRPdmVybGF5Q29uZmlnKCkpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLm92ZXJsYXlSZWYgJiYgIXRoaXMub3ZlcmxheVJlZi5oYXNBdHRhY2hlZCgpKSB7XG4gICAgICB0aGlzLm92ZXJsYXlSZWYuYXR0YWNoKHRoaXMucG9ydGFsKTtcbiAgICAgIHRoaXMub3ZlcmxheVJlZiEua2V5ZG93bkV2ZW50cygpXG4gICAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSlcbiAgICAgICAgLnN1YnNjcmliZSgoZXZlbnQ6IEtleWJvYXJkRXZlbnQpID0+IHtcbiAgICAgICAgICBpZiAoZXZlbnQua2V5Q29kZSA9PT0gRVNDQVBFICYmIHRoaXMuaXNPcGVuICYmIHRoaXMubnpLZXlib2FyZCkge1xuICAgICAgICAgICAgdGhpcy5uek9uQ2xvc2UuZW1pdCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB0aGlzLm92ZXJsYXlSZWZcbiAgICAgICAgLmRldGFjaG1lbnRzKClcbiAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKVxuICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgICB0aGlzLmRpc3Bvc2VPdmVybGF5KCk7XG4gICAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZGlzcG9zZU92ZXJsYXkoKTogdm9pZCB7XG4gICAgdGhpcy5vdmVybGF5UmVmPy5kaXNwb3NlKCk7XG4gICAgdGhpcy5vdmVybGF5UmVmID0gbnVsbDtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0T3ZlcmxheUNvbmZpZygpOiBPdmVybGF5Q29uZmlnIHtcbiAgICByZXR1cm4gbmV3IE92ZXJsYXlDb25maWcoe1xuICAgICAgZGlzcG9zZU9uTmF2aWdhdGlvbjogdGhpcy5uekNsb3NlT25OYXZpZ2F0aW9uLFxuICAgICAgcG9zaXRpb25TdHJhdGVneTogdGhpcy5vdmVybGF5LnBvc2l0aW9uKCkuZ2xvYmFsKCksXG4gICAgICBzY3JvbGxTdHJhdGVneTogdGhpcy5vdmVybGF5LnNjcm9sbFN0cmF0ZWdpZXMuYmxvY2soKVxuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVPdmVybGF5U3R5bGUoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMub3ZlcmxheVJlZiAmJiB0aGlzLm92ZXJsYXlSZWYub3ZlcmxheUVsZW1lbnQpIHtcbiAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUodGhpcy5vdmVybGF5UmVmLm92ZXJsYXlFbGVtZW50LCAncG9pbnRlci1ldmVudHMnLCB0aGlzLmlzT3BlbiA/ICdhdXRvJyA6ICdub25lJyk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB1cGRhdGVCb2R5T3ZlcmZsb3coKTogdm9pZCB7XG4gICAgaWYgKHRoaXMub3ZlcmxheVJlZikge1xuICAgICAgaWYgKHRoaXMuaXNPcGVuKSB7XG4gICAgICAgIHRoaXMub3ZlcmxheVJlZi5nZXRDb25maWcoKS5zY3JvbGxTdHJhdGVneSEuZW5hYmxlKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLm92ZXJsYXlSZWYuZ2V0Q29uZmlnKCkuc2Nyb2xsU3RyYXRlZ3khLmRpc2FibGUoKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBzYXZlUHJldmlvdXNseUZvY3VzZWRFbGVtZW50KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmRvY3VtZW50ICYmICF0aGlzLnByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCkge1xuICAgICAgdGhpcy5wcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQgPSB0aGlzLmRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgYXMgSFRNTEVsZW1lbnQ7XG4gICAgICAvLyBXZSBuZWVkIHRoZSBleHRyYSBjaGVjaywgYmVjYXVzZSBJRSdzIHN2ZyBlbGVtZW50IGhhcyBubyBibHVyIG1ldGhvZC5cbiAgICAgIGlmICh0aGlzLnByZXZpb3VzbHlGb2N1c2VkRWxlbWVudCAmJiB0eXBlb2YgdGhpcy5wcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQuYmx1ciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aGlzLnByZXZpb3VzbHlGb2N1c2VkRWxlbWVudC5ibHVyKCk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSB0cmFwRm9jdXMoKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLmZvY3VzVHJhcCAmJiB0aGlzLm92ZXJsYXlSZWYgJiYgdGhpcy5vdmVybGF5UmVmLm92ZXJsYXlFbGVtZW50KSB7XG4gICAgICB0aGlzLmZvY3VzVHJhcCA9IHRoaXMuZm9jdXNUcmFwRmFjdG9yeS5jcmVhdGUodGhpcy5vdmVybGF5UmVmIS5vdmVybGF5RWxlbWVudCk7XG4gICAgICB0aGlzLmZvY3VzVHJhcC5mb2N1c0luaXRpYWxFbGVtZW50KCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByZXN0b3JlRm9jdXMoKTogdm9pZCB7XG4gICAgLy8gV2UgbmVlZCB0aGUgZXh0cmEgY2hlY2ssIGJlY2F1c2UgSUUgY2FuIHNldCB0aGUgYGFjdGl2ZUVsZW1lbnRgIHRvIG51bGwgaW4gc29tZSBjYXNlcy5cbiAgICBpZiAodGhpcy5wcmV2aW91c2x5Rm9jdXNlZEVsZW1lbnQgJiYgdHlwZW9mIHRoaXMucHJldmlvdXNseUZvY3VzZWRFbGVtZW50LmZvY3VzID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICB0aGlzLnByZXZpb3VzbHlGb2N1c2VkRWxlbWVudC5mb2N1cygpO1xuICAgIH1cbiAgICBpZiAodGhpcy5mb2N1c1RyYXApIHtcbiAgICAgIHRoaXMuZm9jdXNUcmFwLmRlc3Ryb3koKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==