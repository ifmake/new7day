/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { __decorate, __metadata } from "tslib";
import { Directionality } from '@angular/cdk/bidi';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, Directive, ElementRef, EventEmitter, Host, Input, Optional, Output, Renderer2, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { zoomBigMotion } from 'ng-zorro-antd/core/animation';
import { NzNoAnimationDirective } from 'ng-zorro-antd/core/no-animation';
import { InputBoolean } from 'ng-zorro-antd/core/util';
import { NzTooltipBaseDirective, NzToolTipComponent } from 'ng-zorro-antd/tooltip';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
export class NzPopconfirmDirective extends NzTooltipBaseDirective {
    constructor(elementRef, hostView, resolver, renderer, noAnimation) {
        super(elementRef, hostView, resolver, renderer, noAnimation);
        this.trigger = 'click';
        this.placement = 'top';
        this.nzCondition = false;
        this.nzPopconfirmShowArrow = true;
        // tslint:disable-next-line:no-output-rename
        this.visibleChange = new EventEmitter();
        this.nzOnCancel = new EventEmitter();
        this.nzOnConfirm = new EventEmitter();
        this.componentFactory = this.resolver.resolveComponentFactory(NzPopconfirmComponent);
    }
    getProxyPropertyMap() {
        return Object.assign({ nzOkText: ['nzOkText', () => this.nzOkText], nzOkType: ['nzOkType', () => this.nzOkType], nzCancelText: ['nzCancelText', () => this.nzCancelText], nzCondition: ['nzCondition', () => this.nzCondition], nzIcon: ['nzIcon', () => this.nzIcon], nzPopconfirmShowArrow: ['nzPopconfirmShowArrow', () => this.nzPopconfirmShowArrow] }, super.getProxyPropertyMap());
    }
    /**
     * @override
     */
    createComponent() {
        super.createComponent();
        this.component.nzOnCancel.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.nzOnCancel.emit();
        });
        this.component.nzOnConfirm.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.nzOnConfirm.emit();
        });
    }
}
NzPopconfirmDirective.decorators = [
    { type: Directive, args: [{
                selector: '[nz-popconfirm]',
                exportAs: 'nzPopconfirm',
                host: {
                    '[class.ant-popover-open]': 'visible'
                }
            },] }
];
NzPopconfirmDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: ViewContainerRef },
    { type: ComponentFactoryResolver },
    { type: Renderer2 },
    { type: NzNoAnimationDirective, decorators: [{ type: Host }, { type: Optional }] }
];
NzPopconfirmDirective.propDecorators = {
    title: [{ type: Input, args: ['nzPopconfirmTitle',] }],
    directiveTitle: [{ type: Input, args: ['nz-popconfirm',] }],
    trigger: [{ type: Input, args: ['nzPopconfirmTrigger',] }],
    placement: [{ type: Input, args: ['nzPopconfirmPlacement',] }],
    origin: [{ type: Input, args: ['nzPopconfirmOrigin',] }],
    mouseEnterDelay: [{ type: Input, args: ['nzPopconfirmMouseEnterDelay',] }],
    mouseLeaveDelay: [{ type: Input, args: ['nzPopconfirmMouseLeaveDelay',] }],
    overlayClassName: [{ type: Input, args: ['nzPopconfirmOverlayClassName',] }],
    overlayStyle: [{ type: Input, args: ['nzPopconfirmOverlayStyle',] }],
    visible: [{ type: Input, args: ['nzPopconfirmVisible',] }],
    nzOkText: [{ type: Input }],
    nzOkType: [{ type: Input }],
    nzCancelText: [{ type: Input }],
    nzIcon: [{ type: Input }],
    nzCondition: [{ type: Input }],
    nzPopconfirmShowArrow: [{ type: Input }],
    visibleChange: [{ type: Output, args: ['nzPopconfirmVisibleChange',] }],
    nzOnCancel: [{ type: Output }],
    nzOnConfirm: [{ type: Output }]
};
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzPopconfirmDirective.prototype, "nzCondition", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzPopconfirmDirective.prototype, "nzPopconfirmShowArrow", void 0);
export class NzPopconfirmComponent extends NzToolTipComponent {
    constructor(cdr, directionality, noAnimation) {
        super(cdr, directionality, noAnimation);
        this.noAnimation = noAnimation;
        this.nzCondition = false;
        this.nzPopconfirmShowArrow = true;
        this.nzOkType = 'primary';
        this.nzOnCancel = new Subject();
        this.nzOnConfirm = new Subject();
        this._trigger = 'click';
        this._prefix = 'ant-popover';
    }
    ngOnDestroy() {
        super.ngOnDestroy();
        this.nzOnCancel.complete();
        this.nzOnConfirm.complete();
    }
    /**
     * @override
     */
    show() {
        if (!this.nzCondition) {
            super.show();
        }
        else {
            this.onConfirm();
        }
    }
    onCancel() {
        this.nzOnCancel.next();
        super.hide();
    }
    onConfirm() {
        this.nzOnConfirm.next();
        super.hide();
    }
}
NzPopconfirmComponent.decorators = [
    { type: Component, args: [{
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                selector: 'nz-popconfirm',
                exportAs: 'nzPopconfirmComponent',
                preserveWhitespaces: false,
                animations: [zoomBigMotion],
                template: `
    <ng-template
      #overlay="cdkConnectedOverlay"
      cdkConnectedOverlay
      nzConnectedOverlay
      [cdkConnectedOverlayOrigin]="origin"
      (overlayOutsideClick)="onClickOutside($event)"
      (detach)="hide()"
      (positionChange)="onPositionChange($event)"
      [cdkConnectedOverlayPositions]="_positions"
      [cdkConnectedOverlayOpen]="_visible"
      [cdkConnectedOverlayPush]="true"
    >
      <div
        class="ant-popover"
        [ngClass]="_classMap"
        [class.ant-popover-rtl]="dir === 'rtl'"
        [ngStyle]="nzOverlayStyle"
        [@.disabled]="noAnimation?.nzNoAnimation"
        [nzNoAnimation]="noAnimation?.nzNoAnimation"
        [@zoomBigMotion]="'active'"
      >
        <div class="ant-popover-content">
          <div class="ant-popover-arrow" *ngIf="nzPopconfirmShowArrow"></div>
          <div class="ant-popover-inner">
            <div>
              <div class="ant-popover-inner-content">
                <div class="ant-popover-message">
                  <ng-container *nzStringTemplateOutlet="nzTitle">
                    <ng-container *nzStringTemplateOutlet="nzIcon; let icon">
                      <i nz-icon [nzType]="icon || 'exclamation-circle'" nzTheme="fill"></i>
                    </ng-container>
                    <div class="ant-popover-message-title">{{ nzTitle }}</div>
                  </ng-container>
                </div>
                <div class="ant-popover-buttons">
                  <button nz-button [nzSize]="'small'" (click)="onCancel()">
                    <ng-container *ngIf="nzCancelText">{{ nzCancelText }}</ng-container>
                    <ng-container *ngIf="!nzCancelText">{{ 'Modal.cancelText' | nzI18n }}</ng-container>
                  </button>
                  <button nz-button [nzSize]="'small'" [nzType]="nzOkType" (click)="onConfirm()">
                    <ng-container *ngIf="nzOkText">{{ nzOkText }}</ng-container>
                    <ng-container *ngIf="!nzOkText">{{ 'Modal.okText' | nzI18n }}</ng-container>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ng-template>
  `
            },] }
];
NzPopconfirmComponent.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: Directionality, decorators: [{ type: Optional }] },
    { type: NzNoAnimationDirective, decorators: [{ type: Host }, { type: Optional }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wY29uZmlybS5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9jb21wb25lbnRzL3BvcGNvbmZpcm0vIiwic291cmNlcyI6WyJwb3Bjb25maXJtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7R0FHRzs7QUFFSCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDbkQsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUVULHdCQUF3QixFQUN4QixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixJQUFJLEVBQ0osS0FBSyxFQUVMLFFBQVEsRUFDUixNQUFNLEVBQ04sU0FBUyxFQUVULGdCQUFnQixFQUNoQixpQkFBaUIsRUFDbEIsTUFBTSxlQUFlLENBQUM7QUFFdkIsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQzdELE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBR3pFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUN2RCxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsa0JBQWtCLEVBQXFDLE1BQU0sdUJBQXVCLENBQUM7QUFDdEgsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMvQixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFTM0MsTUFBTSxPQUFPLHFCQUFzQixTQUFRLHNCQUFzQjtJQTBDL0QsWUFDRSxVQUFzQixFQUN0QixRQUEwQixFQUMxQixRQUFrQyxFQUNsQyxRQUFtQixFQUNDLFdBQW9DO1FBRXhELEtBQUssQ0FBQyxVQUFVLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxRQUFRLEVBQUUsV0FBVyxDQUFDLENBQUM7UUEzQ2pDLFlBQU8sR0FBc0IsT0FBTyxDQUFDO1FBQ25DLGNBQVMsR0FBdUIsS0FBSyxDQUFDO1FBVzdDLGdCQUFXLEdBQVksS0FBSyxDQUFD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LFVBQVUsRUFBRSxDQUFDLGFBQWEsQ0FBQztnQkFDM0IsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FtRFQ7YUFDRjs7O1lBaEtDLGlCQUFpQjtZQUhWLGNBQWMsdUJBcUxsQixRQUFRO1lBL0pKLHNCQUFzQix1QkFnSzFCLElBQUksWUFBSSxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2dpdGh1Yi5jb20vTkctWk9SUk8vbmctem9ycm8tYW50ZC9ibG9iL21hc3Rlci9MSUNFTlNFXG4gKi9cblxuaW1wb3J0IHsgRGlyZWN0aW9uYWxpdHkgfSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29tcG9uZW50RmFjdG9yeSxcbiAgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSG9zdCxcbiAgSW5wdXQsXG4gIE9uRGVzdHJveSxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbiAgUmVuZGVyZXIyLFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0NvbnRhaW5lclJlZixcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOekJ1dHRvblR5cGUgfSBmcm9tICduZy16b3Jyby1hbnRkL2J1dHRvbic7XG5pbXBvcnQgeyB6b29tQmlnTW90aW9uIH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL2FuaW1hdGlvbic7XG5pbXBvcnQgeyBOek5vQW5pbWF0aW9uRGlyZWN0aXZlIH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL25vLWFuaW1hdGlvbic7XG5pbXBvcnQgeyBCb29sZWFuSW5wdXQsIE5nU3R5bGVJbnRlcmZhY2UsIE56VFNUeXBlIH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL3R5cGVzJztcblxuaW1wb3J0IHsgSW5wdXRCb29sZWFuIH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL3V0aWwnO1xuaW1wb3J0IHsgTnpUb29sdGlwQmFzZURpcmVjdGl2ZSwgTnpUb29sVGlwQ29tcG9uZW50LCBOelRvb2x0aXBUcmlnZ2VyLCBQcm9wZXJ0eU1hcHBpbmcgfSBmcm9tICduZy16b3Jyby1hbnRkL3Rvb2x0aXAnO1xuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5ARGlyZWN0aXZlKHtcbiAgc2VsZWN0b3I6ICdbbnotcG9wY29uZmlybV0nLFxuICBleHBvcnRBczogJ256UG9wY29uZmlybScsXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLmFudC1wb3BvdmVyLW9wZW5dJzogJ3Zpc2libGUnXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgTnpQb3Bjb25maXJtRGlyZWN0aXZlIGV4dGVuZHMgTnpUb29sdGlwQmFzZURpcmVjdGl2ZSB7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9uekNvbmRpdGlvbjogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbnpQb3Bjb25maXJtU2hvd0Fycm93OiBCb29sZWFuSW5wdXQ7XG5cbiAgQElucHV0KCduelBvcGNvbmZpcm1UaXRsZScpIHRpdGxlPzogTnpUU1R5cGU7XG4gIEBJbnB1dCgnbnotcG9wY29uZmlybScpIGRpcmVjdGl2ZVRpdGxlPzogTnpUU1R5cGUgfCBudWxsO1xuICBASW5wdXQoJ256UG9wY29uZmlybVRyaWdnZXInKSB0cmlnZ2VyPzogTnpUb29sdGlwVHJpZ2dlciA9ICdjbGljayc7XG4gIEBJbnB1dCgnbnpQb3Bjb25maXJtUGxhY2VtZW50JykgcGxhY2VtZW50Pzogc3RyaW5nIHwgc3RyaW5nW10gPSAndG9wJztcbiAgQElucHV0KCduelBvcGNvbmZpcm1PcmlnaW4nKSBvcmlnaW4/OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PjtcbiAgQElucHV0KCduelBvcGNvbmZpcm1Nb3VzZUVudGVyRGVsYXknKSBtb3VzZUVudGVyRGVsYXk/OiBudW1iZXI7XG4gIEBJbnB1dCgnbnpQb3Bjb25maXJtTW91c2VMZWF2ZURlbGF5JykgbW91c2VMZWF2ZURlbGF5PzogbnVtYmVyO1xuICBASW5wdXQoJ256UG9wY29uZmlybU92ZXJsYXlDbGFzc05hbWUnKSBvdmVybGF5Q2xhc3NOYW1lPzogc3RyaW5nO1xuICBASW5wdXQoJ256UG9wY29uZmlybU92ZXJsYXlTdHlsZScpIG92ZXJsYXlTdHlsZT86IE5nU3R5bGVJbnRlcmZhY2U7XG4gIEBJbnB1dCgnbnpQb3Bjb25maXJtVmlzaWJsZScpIHZpc2libGU/OiBib29sZWFuO1xuICBASW5wdXQoKSBuek9rVGV4dD86IHN0cmluZztcbiAgQElucHV0KCkgbnpPa1R5cGU/OiBzdHJpbmc7XG4gIEBJbnB1dCgpIG56Q2FuY2VsVGV4dD86IHN0cmluZztcbiAgQElucHV0KCkgbnpJY29uPzogc3RyaW5nIHwgVGVtcGxhdGVSZWY8dm9pZD47XG4gIEBJbnB1dCgpIEBJbnB1dEJvb2xlYW4oKSBuekNvbmRpdGlvbjogYm9vbGVhbiA9IGZhbHNlO1xuICBASW5wdXQoKSBASW5wdXRCb29sZWFuKCkgbnpQb3Bjb25maXJtU2hvd0Fycm93OiBib29sZWFuID0gdHJ1ZTtcblxuICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6bm8tb3V0cHV0LXJlbmFtZVxuICBAT3V0cHV0KCduelBvcGNvbmZpcm1WaXNpYmxlQ2hhbmdlJykgcmVhZG9ubHkgdmlzaWJsZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcbiAgQE91dHB1dCgpIHJlYWRvbmx5IG56T25DYW5jZWwgPSBuZXcgRXZlbnRFbWl0dGVyPHZvaWQ+KCk7XG4gIEBPdXRwdXQoKSByZWFkb25seSBuek9uQ29uZmlybSA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcblxuICBwcm90ZWN0ZWQgcmVhZG9ubHkgY29tcG9uZW50RmFjdG9yeTogQ29tcG9uZW50RmFjdG9yeTxOelBvcGNvbmZpcm1Db21wb25lbnQ+ID0gdGhpcy5yZXNvbHZlci5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeShcbiAgICBOelBvcGNvbmZpcm1Db21wb25lbnRcbiAgKTtcblxuICBwcm90ZWN0ZWQgZ2V0UHJveHlQcm9wZXJ0eU1hcCgpOiBQcm9wZXJ0eU1hcHBpbmcge1xuICAgIHJldHVybiB7XG4gICAgICBuek9rVGV4dDogWyduek9rVGV4dCcsICgpID0+IHRoaXMubnpPa1RleHRdLFxuICAgICAgbnpPa1R5cGU6IFsnbnpPa1R5cGUnLCAoKSA9PiB0aGlzLm56T2tUeXBlXSxcbiAgICAgIG56Q2FuY2VsVGV4dDogWyduekNhbmNlbFRleHQnLCAoKSA9PiB0aGlzLm56Q2FuY2VsVGV4dF0sXG4gICAgICBuekNvbmRpdGlvbjogWyduekNvbmRpdGlvbicsICgpID0+IHRoaXMubnpDb25kaXRpb25dLFxuICAgICAgbnpJY29uOiBbJ256SWNvbicsICgpID0+IHRoaXMubnpJY29uXSxcbiAgICAgIG56UG9wY29uZmlybVNob3dBcnJvdzogWyduelBvcGNvbmZpcm1TaG93QXJyb3cnLCAoKSA9PiB0aGlzLm56UG9wY29uZmlybVNob3dBcnJvd10sXG4gICAgICAuLi5zdXBlci5nZXRQcm94eVByb3BlcnR5TWFwKClcbiAgICB9O1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBob3N0VmlldzogVmlld0NvbnRhaW5lclJlZixcbiAgICByZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICAgIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgQEhvc3QoKSBAT3B0aW9uYWwoKSBub0FuaW1hdGlvbj86IE56Tm9BbmltYXRpb25EaXJlY3RpdmVcbiAgKSB7XG4gICAgc3VwZXIoZWxlbWVudFJlZiwgaG9zdFZpZXcsIHJlc29sdmVyLCByZW5kZXJlciwgbm9BbmltYXRpb24pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBvdmVycmlkZVxuICAgKi9cbiAgcHJvdGVjdGVkIGNyZWF0ZUNvbXBvbmVudCgpOiB2b2lkIHtcbiAgICBzdXBlci5jcmVhdGVDb21wb25lbnQoKTtcblxuICAgICh0aGlzLmNvbXBvbmVudCBhcyBOelBvcGNvbmZpcm1Db21wb25lbnQpLm56T25DYW5jZWwucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLm56T25DYW5jZWwuZW1pdCgpO1xuICAgIH0pO1xuICAgICh0aGlzLmNvbXBvbmVudCBhcyBOelBvcGNvbmZpcm1Db21wb25lbnQpLm56T25Db25maXJtLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5uek9uQ29uZmlybS5lbWl0KCk7XG4gICAgfSk7XG4gIH1cbn1cblxuQENvbXBvbmVudCh7XG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBzZWxlY3RvcjogJ256LXBvcGNvbmZpcm0nLFxuICBleHBvcnRBczogJ256UG9wY29uZmlybUNvbXBvbmVudCcsXG4gIHByZXNlcnZlV2hpdGVzcGFjZXM6IGZhbHNlLFxuICBhbmltYXRpb25zOiBbem9vbUJpZ01vdGlvbl0sXG4gIHRlbXBsYXRlOiBgXG4gICAgPG5nLXRlbXBsYXRlXG4gICAgICAjb3ZlcmxheT1cImNka0Nvbm5lY3RlZE92ZXJsYXlcIlxuICAgICAgY2RrQ29ubmVjdGVkT3ZlcmxheVxuICAgICAgbnpDb25uZWN0ZWRPdmVybGF5XG4gICAgICBbY2RrQ29ubmVjdGVkT3ZlcmxheU9yaWdpbl09XCJvcmlnaW5cIlxuICAgICAgKG92ZXJsYXlPdXRzaWRlQ2xpY2spPVwib25DbGlja091dHNpZGUoJGV2ZW50KVwiXG4gICAgICAoZGV0YWNoKT1cImhpZGUoKVwiXG4gICAgICAocG9zaXRpb25DaGFuZ2UpPVwib25Qb3NpdGlvbkNoYW5nZSgkZXZlbnQpXCJcbiAgICAgIFtjZGtDb25uZWN0ZWRPdmVybGF5UG9zaXRpb25zXT1cIl9wb3NpdGlvbnNcIlxuICAgICAgW2Nka0Nvbm5lY3RlZE92ZXJsYXlPcGVuXT1cIl92aXNpYmxlXCJcbiAgICAgIFtjZGtDb25uZWN0ZWRPdmVybGF5UHVzaF09XCJ0cnVlXCJcbiAgICA+XG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzPVwiYW50LXBvcG92ZXJcIlxuICAgICAgICBbbmdDbGFzc109XCJfY2xhc3NNYXBcIlxuICAgICAgICBbY2xhc3MuYW50LXBvcG92ZXItcnRsXT1cImRpciA9PT0gJ3J0bCdcIlxuICAgICAgICBbbmdTdHlsZV09XCJuek92ZXJsYXlTdHlsZVwiXG4gICAgICAgIFtALmRpc2FibGVkXT1cIm5vQW5pbWF0aW9uPy5uek5vQW5pbWF0aW9uXCJcbiAgICAgICAgW256Tm9BbmltYXRpb25dPVwibm9BbmltYXRpb24/Lm56Tm9BbmltYXRpb25cIlxuICAgICAgICBbQHpvb21CaWdNb3Rpb25dPVwiJ2FjdGl2ZSdcIlxuICAgICAgPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiYW50LXBvcG92ZXItY29udGVudFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJhbnQtcG9wb3Zlci1hcnJvd1wiICpuZ0lmPVwibnpQb3Bjb25maXJtU2hvd0Fycm93XCI+PC9kaXY+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImFudC1wb3BvdmVyLWlubmVyXCI+XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYW50LXBvcG92ZXItaW5uZXItY29udGVudFwiPlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhbnQtcG9wb3Zlci1tZXNzYWdlXCI+XG4gICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuelN0cmluZ1RlbXBsYXRlT3V0bGV0PVwibnpUaXRsZVwiPlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuelN0cmluZ1RlbXBsYXRlT3V0bGV0PVwibnpJY29uOyBsZXQgaWNvblwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxpIG56LWljb24gW256VHlwZV09XCJpY29uIHx8ICdleGNsYW1hdGlvbi1jaXJjbGUnXCIgbnpUaGVtZT1cImZpbGxcIj48L2k+XG4gICAgICAgICAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYW50LXBvcG92ZXItbWVzc2FnZS10aXRsZVwiPnt7IG56VGl0bGUgfX08L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhbnQtcG9wb3Zlci1idXR0b25zXCI+XG4gICAgICAgICAgICAgICAgICA8YnV0dG9uIG56LWJ1dHRvbiBbbnpTaXplXT1cIidzbWFsbCdcIiAoY2xpY2spPVwib25DYW5jZWwoKVwiPlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwibnpDYW5jZWxUZXh0XCI+e3sgbnpDYW5jZWxUZXh0IH19PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCIhbnpDYW5jZWxUZXh0XCI+e3sgJ01vZGFsLmNhbmNlbFRleHQnIHwgbnpJMThuIH19PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICAgIDxidXR0b24gbnotYnV0dG9uIFtuelNpemVdPVwiJ3NtYWxsJ1wiIFtuelR5cGVdPVwibnpPa1R5cGVcIiAoY2xpY2spPVwib25Db25maXJtKClcIj5cbiAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIm56T2tUZXh0XCI+e3sgbnpPa1RleHQgfX08L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIiFuek9rVGV4dFwiPnt7ICdNb2RhbC5va1RleHQnIHwgbnpJMThuIH19PC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICA8L2J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L25nLXRlbXBsYXRlPlxuICBgXG59KVxuZXhwb3J0IGNsYXNzIE56UG9wY29uZmlybUNvbXBvbmVudCBleHRlbmRzIE56VG9vbFRpcENvbXBvbmVudCBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIG56Q2FuY2VsVGV4dD86IHN0cmluZztcbiAgbnpDb25kaXRpb24gPSBmYWxzZTtcbiAgbnpQb3Bjb25maXJtU2hvd0Fycm93ID0gdHJ1ZTtcbiAgbnpJY29uPzogc3RyaW5nIHwgVGVtcGxhdGVSZWY8dm9pZD47XG4gIG56T2tUZXh0Pzogc3RyaW5nO1xuICBuek9rVHlwZTogTnpCdXR0b25UeXBlID0gJ3ByaW1hcnknO1xuXG4gIHJlYWRvbmx5IG56T25DYW5jZWwgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuICByZWFkb25seSBuek9uQ29uZmlybSA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgcHJvdGVjdGVkIF90cmlnZ2VyOiBOelRvb2x0aXBUcmlnZ2VyID0gJ2NsaWNrJztcblxuICBfcHJlZml4ID0gJ2FudC1wb3BvdmVyJztcblxuICBjb25zdHJ1Y3RvcihcbiAgICBjZHI6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIEBPcHRpb25hbCgpIGRpcmVjdGlvbmFsaXR5OiBEaXJlY3Rpb25hbGl0eSxcbiAgICBASG9zdCgpIEBPcHRpb25hbCgpIHB1YmxpYyBub0FuaW1hdGlvbj86IE56Tm9BbmltYXRpb25EaXJlY3RpdmVcbiAgKSB7XG4gICAgc3VwZXIoY2RyLCBkaXJlY3Rpb25hbGl0eSwgbm9BbmltYXRpb24pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgc3VwZXIubmdPbkRlc3Ryb3koKTtcblxuICAgIHRoaXMubnpPbkNhbmNlbC5jb21wbGV0ZSgpO1xuICAgIHRoaXMubnpPbkNvbmZpcm0uY29tcGxldGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAb3ZlcnJpZGVcbiAgICovXG4gIHNob3coKTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLm56Q29uZGl0aW9uKSB7XG4gICAgICBzdXBlci5zaG93KCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMub25Db25maXJtKCk7XG4gICAgfVxuICB9XG5cbiAgb25DYW5jZWwoKTogdm9pZCB7XG4gICAgdGhpcy5uek9uQ2FuY2VsLm5leHQoKTtcbiAgICBzdXBlci5oaWRlKCk7XG4gIH1cblxuICBvbkNvbmZpcm0oKTogdm9pZCB7XG4gICAgdGhpcy5uek9uQ29uZmlybS5uZXh0KCk7XG4gICAgc3VwZXIuaGlkZSgpO1xuICB9XG59XG4iXX0=