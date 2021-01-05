/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { __decorate, __metadata } from "tslib";
import { Directionality } from '@angular/cdk/bidi';
import { LEFT_ARROW, RIGHT_ARROW } from '@angular/cdk/keycodes';
import { Platform } from '@angular/cdk/platform';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, ElementRef, EventEmitter, Inject, Input, Optional, Output, QueryList, Renderer2, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { NzConfigService, WithConfig } from 'ng-zorro-antd/core/config';
import { NzDragService, NzResizeService } from 'ng-zorro-antd/core/services';
import { InputBoolean, InputNumber } from 'ng-zorro-antd/core/util';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NzCarouselContentDirective } from './carousel-content.directive';
import { NzCarouselOpacityStrategy } from './strategies/opacity-strategy';
import { NzCarouselTransformStrategy } from './strategies/transform-strategy';
import { NZ_CAROUSEL_CUSTOM_STRATEGIES } from './typings';
const NZ_CONFIG_MODULE_NAME = 'carousel';
export class NzCarouselComponent {
    constructor(elementRef, nzConfigService, renderer, cdr, platform, resizeService, nzDragService, directionality, customStrategies) {
        this.nzConfigService = nzConfigService;
        this.renderer = renderer;
        this.cdr = cdr;
        this.platform = platform;
        this.resizeService = resizeService;
        this.nzDragService = nzDragService;
        this.directionality = directionality;
        this.customStrategies = customStrategies;
        this._nzModuleName = NZ_CONFIG_MODULE_NAME;
        this.nzEffect = 'scrollx';
        this.nzEnableSwipe = true;
        this.nzDots = true;
        this.nzAutoPlay = false;
        this.nzAutoPlaySpeed = 3000;
        this.nzTransitionSpeed = 500;
        this._dotPosition = 'bottom';
        this.nzBeforeChange = new EventEmitter();
        this.nzAfterChange = new EventEmitter();
        this.activeIndex = 0;
        this.vertical = false;
        this.transitionInProgress = null;
        this.dir = 'ltr';
        this.destroy$ = new Subject();
        this.gestureRect = null;
        this.pointerDelta = null;
        this.isTransiting = false;
        this.isDragging = false;
        /**
         * Drag carousel.
         */
        this.pointerDown = (event) => {
            if (!this.isDragging && !this.isTransiting && this.nzEnableSwipe) {
                this.clearScheduledTransition();
                this.gestureRect = this.slickListEl.getBoundingClientRect();
                this.nzDragService.requestDraggingSequence(event).subscribe(delta => {
                    var _a;
                    this.pointerDelta = delta;
                    this.isDragging = true;
                    (_a = this.strategy) === null || _a === void 0 ? void 0 : _a.dragging(this.pointerDelta);
                }, () => { }, () => {
                    if (this.nzEnableSwipe && this.isDragging) {
                        const xDelta = this.pointerDelta ? this.pointerDelta.x : 0;
                        // Switch to another slide if delta is bigger than third of the width.
                        if (Math.abs(xDelta) > this.gestureRect.width / 3) {
                            this.goTo(xDelta > 0 ? this.activeIndex - 1 : this.activeIndex + 1);
                        }
                        else {
                            this.goTo(this.activeIndex);
                        }
                        this.gestureRect = null;
                        this.pointerDelta = null;
                    }
                    this.isDragging = false;
                });
            }
        };
        this.nzDotPosition = 'bottom';
        this.renderer.addClass(elementRef.nativeElement, 'ant-carousel');
        this.el = elementRef.nativeElement;
    }
    set nzDotPosition(value) {
        this._dotPosition = value;
        if (value === 'left' || value === 'right') {
            this.vertical = true;
        }
        else {
            this.vertical = false;
        }
    }
    get nzDotPosition() {
        return this._dotPosition;
    }
    ngOnInit() {
        var _a;
        this.dir = this.directionality.value;
        (_a = this.directionality.change) === null || _a === void 0 ? void 0 : _a.pipe(takeUntil(this.destroy$)).subscribe((direction) => {
            this.dir = direction;
            this.switchStrategy();
        });
    }
    ngAfterContentInit() {
        this.markContentActive(0);
    }
    ngAfterViewInit() {
        this.slickListEl = this.slickList.nativeElement;
        this.slickTrackEl = this.slickTrack.nativeElement;
        this.carouselContents.changes.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.markContentActive(0);
            this.layout();
        });
        this.resizeService
            .subscribe()
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
            this.layout();
        });
        this.switchStrategy();
        this.markContentActive(0);
        this.layout();
        // If embedded in an entry component, it may do initial render at an inappropriate time.
        // ngZone.onStable won't do this trick
        // TODO: need to change this.
        Promise.resolve().then(() => {
            this.layout();
        });
    }
    ngOnChanges(changes) {
        const { nzEffect, nzDotPosition } = changes;
        if (nzEffect && !nzEffect.isFirstChange()) {
            this.switchStrategy();
            this.markContentActive(0);
            this.layout();
        }
        if (nzDotPosition && !nzDotPosition.isFirstChange()) {
            this.switchStrategy();
            this.markContentActive(0);
            this.layout();
        }
        if (!this.nzAutoPlay || !this.nzAutoPlaySpeed) {
            this.clearScheduledTransition();
        }
        else {
            this.scheduleNextTransition();
        }
    }
    ngOnDestroy() {
        this.clearScheduledTransition();
        if (this.strategy) {
            this.strategy.dispose();
        }
        this.destroy$.next();
        this.destroy$.complete();
    }
    onKeyDown(e) {
        if (e.keyCode === LEFT_ARROW) {
            e.preventDefault();
            this.pre();
        }
        else if (e.keyCode === RIGHT_ARROW) {
            this.next();
            e.preventDefault();
        }
    }
    next() {
        this.goTo(this.activeIndex + 1);
    }
    pre() {
        this.goTo(this.activeIndex - 1);
    }
    goTo(index) {
        if (this.carouselContents && this.carouselContents.length && !this.isTransiting) {
            const length = this.carouselContents.length;
            const from = this.activeIndex;
            const to = (index + length) % length;
            this.isTransiting = true;
            this.nzBeforeChange.emit({ from, to });
            this.strategy.switch(this.activeIndex, index).subscribe(() => {
                this.scheduleNextTransition();
                this.nzAfterChange.emit(index);
                this.isTransiting = false;
            });
            this.markContentActive(to);
            this.cdr.markForCheck();
        }
    }
    switchStrategy() {
        if (this.strategy) {
            this.strategy.dispose();
        }
        // Load custom strategies first.
        const customStrategy = this.customStrategies ? this.customStrategies.find(s => s.name === this.nzEffect) : null;
        if (customStrategy) {
            this.strategy = new customStrategy.strategy(this, this.cdr, this.renderer, this.platform);
            return;
        }
        this.strategy =
            this.nzEffect === 'scrollx'
                ? new NzCarouselTransformStrategy(this, this.cdr, this.renderer, this.platform)
                : new NzCarouselOpacityStrategy(this, this.cdr, this.renderer, this.platform);
    }
    scheduleNextTransition() {
        this.clearScheduledTransition();
        if (this.nzAutoPlay && this.nzAutoPlaySpeed > 0 && this.platform.isBrowser) {
            this.transitionInProgress = setTimeout(() => {
                this.goTo(this.activeIndex + 1);
            }, this.nzAutoPlaySpeed);
        }
    }
    clearScheduledTransition() {
        if (this.transitionInProgress) {
            clearTimeout(this.transitionInProgress);
            this.transitionInProgress = null;
        }
    }
    markContentActive(index) {
        this.activeIndex = index;
        if (this.carouselContents) {
            this.carouselContents.forEach((slide, i) => {
                slide.isActive = index === i;
            });
        }
        this.cdr.markForCheck();
    }
    layout() {
        if (this.strategy) {
            this.strategy.withCarouselContents(this.carouselContents);
        }
    }
}
NzCarouselComponent.decorators = [
    { type: Component, args: [{
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                selector: 'nz-carousel',
                exportAs: 'nzCarousel',
                preserveWhitespaces: false,
                template: `
    <div class="slick-initialized slick-slider" [class.slick-vertical]="nzDotPosition === 'left' || nzDotPosition === 'right'">
      <div
        #slickList
        class="slick-list"
        tabindex="-1"
        (keydown)="onKeyDown($event)"
        (mousedown)="pointerDown($event)"
        (touchstart)="pointerDown($event)"
      >
        <!-- Render carousel items. -->
        <div class="slick-track" #slickTrack>
          <ng-content></ng-content>
        </div>
      </div>
      <!-- Render dots. -->
      <ul
        class="slick-dots"
        *ngIf="nzDots"
        [class.slick-dots-top]="nzDotPosition === 'top'"
        [class.slick-dots-bottom]="nzDotPosition === 'bottom'"
        [class.slick-dots-left]="nzDotPosition === 'left'"
        [class.slick-dots-right]="nzDotPosition === 'right'"
      >
        <li *ngFor="let content of carouselContents; let i = index" [class.slick-active]="content.isActive" (click)="goTo(i)">
          <ng-template [ngTemplateOutlet]="nzDotRender || renderDotTemplate" [ngTemplateOutletContext]="{ $implicit: i }"></ng-template>
        </li>
      </ul>
    </div>

    <ng-template #renderDotTemplate let-index>
      <button>{{ index + 1 }}</button>
    </ng-template>
  `,
                host: {
                    '[class.ant-carousel-vertical]': 'vertical',
                    '[class.ant-carousel-rtl]': `dir ==='rtl'`
                }
            },] }
];
NzCarouselComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: NzConfigService },
    { type: Renderer2 },
    { type: ChangeDetectorRef },
    { type: Platform },
    { type: NzResizeService },
    { type: NzDragService },
    { type: Directionality, decorators: [{ type: Optional }] },
    { type: Array, decorators: [{ type: Optional }, { type: Inject, args: [NZ_CAROUSEL_CUSTOM_STRATEGIES,] }] }
];
NzCarouselComponent.propDecorators = {
    carouselContents: [{ type: ContentChildren, args: [NzCarouselContentDirective,] }],
    slickList: [{ type: ViewChild, args: ['slickList', { static: false },] }],
    slickTrack: [{ type: ViewChild, args: ['slickTrack', { static: false },] }],
    nzDotRender: [{ type: Input }],
    nzEffect: [{ type: Input }],
    nzEnableSwipe: [{ type: Input }],
    nzDots: [{ type: Input }],
    nzAutoPlay: [{ type: Input }],
    nzAutoPlaySpeed: [{ type: Input }],
    nzTransitionSpeed: [{ type: Input }],
    nzDotPosition: [{ type: Input }],
    nzBeforeChange: [{ type: Output }],
    nzAfterChange: [{ type: Output }]
};
__decorate([
    WithConfig(),
    __metadata("design:type", String)
], NzCarouselComponent.prototype, "nzEffect", void 0);
__decorate([
    WithConfig(),
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzCarouselComponent.prototype, "nzEnableSwipe", void 0);
__decorate([
    WithConfig(),
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzCarouselComponent.prototype, "nzDots", void 0);
__decorate([
    WithConfig(),
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzCarouselComponent.prototype, "nzAutoPlay", void 0);
__decorate([
    WithConfig(),
    InputNumber(),
    __metadata("design:type", Number)
], NzCarouselComponent.prototype, "nzAutoPlaySpeed", void 0);
__decorate([
    InputNumber(),
    __metadata("design:type", Object)
], NzCarouselComponent.prototype, "nzTransitionSpeed", void 0);
__decorate([
    WithConfig(),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [String])
], NzCarouselComponent.prototype, "nzDotPosition", null);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2Fyb3VzZWwuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uL2NvbXBvbmVudHMvY2Fyb3VzZWwvIiwic291cmNlcyI6WyJjYXJvdXNlbC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHOztBQUVILE9BQU8sRUFBYSxjQUFjLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUM5RCxPQUFPLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ2hFLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUNqRCxPQUFPLEVBR0wsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsZUFBZSxFQUNmLFVBQVUsRUFDVixZQUFZLEVBQ1osTUFBTSxFQUNOLEtBQUssRUFJTCxRQUFRLEVBQ1IsTUFBTSxFQUNOLFNBQVMsRUFDVCxTQUFTLEVBRVQsV0FBVyxFQUNYLFNBQVMsRUFDVCxpQkFBaUIsRUFDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFlLGVBQWUsRUFBRSxVQUFVLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNyRixPQUFPLEVBQUUsYUFBYSxFQUFFLGVBQWUsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBRTdFLE9BQU8sRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDcEUsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMvQixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFM0MsT0FBTyxFQUFFLDBCQUEwQixFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFFMUUsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sK0JBQStCLENBQUM7QUFDMUUsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0saUNBQWlDLENBQUM7QUFDOUUsT0FBTyxFQUtMLDZCQUE2QixFQUU5QixNQUFN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Ozs7Ozs7Ozs7Ozs7R0FpQ1Q7Z0JBQ0QsSUFBSSxFQUFFO29CQUNKLCtCQUErQixFQUFFLFVBQVU7b0JBQzNDLDBCQUEwQixFQUFFLGNBQWM7aUJBQzNDO2FBQ0Y7OztZQWxGQyxVQUFVO1lBZ0JVLGVBQWU7WUFObkMsU0FBUztZQWJULGlCQUFpQjtZQUxWLFFBQVE7WUF5Qk8sZUFBZTtZQUE5QixhQUFhO1lBM0JGLGNBQWMsdUJBOEo3QixRQUFRO3dDQUNSLFFBQVEsWUFBSSxNQUFNLFNBQUMsNkJBQTZCOzs7K0JBMURsRCxlQUFlLFNBQUMsMEJBQTBCO3dCQUUxQyxTQUFTLFNBQUMsV0FBVyxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTt5QkFDeEMsU0FBUyxTQUFDLFlBQVksRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7MEJBRXpDLEtBQUs7dUJBQ0wsS0FBSzs0QkFDTCxLQUFLO3FCQUNMLEtBQUs7eUJBQ0wsS0FBSzs4QkFDTCxLQUFLO2dDQUNMLEtBQUs7NEJBRUwsS0FBSzs2QkFrQkwsTUFBTTs0QkFDTixNQUFNOztBQTFCZ0I7SUFBYixVQUFVLEVBQUU7O3FEQUF5QztBQUN4QjtJQUE3QixVQUFVLEVBQUU7SUFBRSxZQUFZLEVBQUU7OzBEQUErQjtBQUM5QjtJQUE3QixVQUFVLEVBQUU7SUFBRSxZQUFZLEVBQUU7O21EQUF3QjtBQUN2QjtJQUE3QixVQUFVLEVBQUU7SUFBRSxZQUFZLEVBQUU7O3VEQUE2QjtBQUM3QjtJQUE1QixVQUFVLEVBQUU7SUFBRSxXQUFXLEVBQUU7OzREQUFnQztBQUM3QztJQUFkLFdBQVcsRUFBRTs7OERBQXlCO0FBS2hEO0lBREMsVUFBVSxFQUFFOzs7d0RBUVoiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vZ2l0aHViLmNvbS9ORy1aT1JSTy9uZy16b3Jyby1hbnRkL2Jsb2IvbWFzdGVyL0xJQ0VOU0VcbiAqL1xuXG5pbXBvcnQgeyBEaXJlY3Rpb24sIERpcmVjdGlvbmFsaXR5IH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHsgTEVGVF9BUlJPVywgUklHSFRfQVJST1cgfSBmcm9tICdAYW5ndWxhci9jZGsva2V5Y29kZXMnO1xuaW1wb3J0IHsgUGxhdGZvcm0gfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3QsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgT3V0cHV0LFxuICBRdWVyeUxpc3QsXG4gIFJlbmRlcmVyMixcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOekNvbmZpZ0tleSwgTnpDb25maWdTZXJ2aWNlLCBXaXRoQ29uZmlnIH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL2NvbmZpZyc7XG5pbXBvcnQgeyBOekRyYWdTZXJ2aWNlLCBOelJlc2l6ZVNlcnZpY2UgfSBmcm9tICduZy16b3Jyby1hbnRkL2NvcmUvc2VydmljZXMnO1xuaW1wb3J0IHsgQm9vbGVhbklucHV0LCBOdW1iZXJJbnB1dCwgTnpTYWZlQW55IH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL3R5cGVzJztcbmltcG9ydCB7IElucHV0Qm9vbGVhbiwgSW5wdXROdW1iZXIgfSBmcm9tICduZy16b3Jyby1hbnRkL2NvcmUvdXRpbCc7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IE56Q2Fyb3VzZWxDb250ZW50RGlyZWN0aXZlIH0gZnJvbSAnLi9jYXJvdXNlbC1jb250ZW50LmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBOekNhcm91c2VsQmFzZVN0cmF0ZWd5IH0gZnJvbSAnLi9zdHJhdGVnaWVzL2Jhc2Utc3RyYXRlZ3knO1xuaW1wb3J0IHsgTnpDYXJvdXNlbE9wYWNpdHlTdHJhdGVneSB9IGZyb20gJy4vc3RyYXRlZ2llcy9vcGFjaXR5LXN0cmF0ZWd5JztcbmltcG9ydCB7IE56Q2Fyb3VzZWxUcmFuc2Zvcm1TdHJhdGVneSB9IGZyb20gJy4vc3RyYXRlZ2llcy90cmFuc2Zvcm0tc3RyYXRlZ3knO1xuaW1wb3J0IHtcbiAgRnJvbVRvSW50ZXJmYWNlLFxuICBOekNhcm91c2VsRG90UG9zaXRpb24sXG4gIE56Q2Fyb3VzZWxFZmZlY3RzLFxuICBOekNhcm91c2VsU3RyYXRlZ3lSZWdpc3RyeUl0ZW0sXG4gIE5aX0NBUk9VU0VMX0NVU1RPTV9TVFJBVEVHSUVTLFxuICBQb2ludGVyVmVjdG9yXG59IGZyb20gJy4vdHlwaW5ncyc7XG5cbmNvbnN0IE5aX0NPTkZJR19NT0RVTEVfTkFNRTogTnpDb25maWdLZXkgPSAnY2Fyb3VzZWwnO1xuXG5AQ29tcG9uZW50KHtcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIHNlbGVjdG9yOiAnbnotY2Fyb3VzZWwnLFxuICBleHBvcnRBczogJ256Q2Fyb3VzZWwnLFxuICBwcmVzZXJ2ZVdoaXRlc3BhY2VzOiBmYWxzZSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IGNsYXNzPVwic2xpY2staW5pdGlhbGl6ZWQgc2xpY2stc2xpZGVyXCIgW2NsYXNzLnNsaWNrLXZlcnRpY2FsXT1cIm56RG90UG9zaXRpb24gPT09ICdsZWZ0JyB8fCBuekRvdFBvc2l0aW9uID09PSAncmlnaHQnXCI+XG4gICAgICA8ZGl2XG4gICAgICAgICNzbGlja0xpc3RcbiAgICAgICAgY2xhc3M9XCJzbGljay1saXN0XCJcbiAgICAgICAgdGFiaW5kZXg9XCItMVwiXG4gICAgICAgIChrZXlkb3duKT1cIm9uS2V5RG93bigkZXZlbnQpXCJcbiAgICAgICAgKG1vdXNlZG93bik9XCJwb2ludGVyRG93bigkZXZlbnQpXCJcbiAgICAgICAgKHRvdWNoc3RhcnQpPVwicG9pbnRlckRvd24oJGV2ZW50KVwiXG4gICAgICA+XG4gICAgICAgIDwhLS0gUmVuZGVyIGNhcm91c2VsIGl0ZW1zLiAtLT5cbiAgICAgICAgPGRpdiBjbGFzcz1cInNsaWNrLXRyYWNrXCIgI3NsaWNrVHJhY2s+XG4gICAgICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgICAgPCEtLSBSZW5kZXIgZG90cy4gLS0+XG4gICAgICA8dWxcbiAgICAgICAgY2xhc3M9XCJzbGljay1kb3RzXCJcbiAgICAgICAgKm5nSWY9XCJuekRvdHNcIlxuICAgICAgICBbY2xhc3Muc2xpY2stZG90cy10b3BdPVwibnpEb3RQb3NpdGlvbiA9PT0gJ3RvcCdcIlxuICAgICAgICBbY2xhc3Muc2xpY2stZG90cy1ib3R0b21dPVwibnpEb3RQb3NpdGlvbiA9PT0gJ2JvdHRvbSdcIlxuICAgICAgICBbY2xhc3Muc2xpY2stZG90cy1sZWZ0XT1cIm56RG90UG9zaXRpb24gPT09ICdsZWZ0J1wiXG4gICAgICAgIFtjbGFzcy5zbGljay1kb3RzLXJpZ2h0XT1cIm56RG90UG9zaXRpb24gPT09ICdyaWdodCdcIlxuICAgICAgPlxuICAgICAgICA8bGkgKm5nRm9yPVwibGV0IGNvbnRlbnQgb2YgY2Fyb3VzZWxDb250ZW50czsgbGV0IGkgPSBpbmRleFwiIFtjbGFzcy5zbGljay1hY3RpdmVdPVwiY29udGVudC5pc0FjdGl2ZVwiIChjbGljayk9XCJnb1RvKGkpXCI+XG4gICAgICAgICAgPG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cIm56RG90UmVuZGVyIHx8IHJlbmRlckRvdFRlbXBsYXRlXCIgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInsgJGltcGxpY2l0OiBpIH1cIj48L25nLXRlbXBsYXRlPlxuICAgICAgICA8L2xpPlxuICAgICAgPC91bD5cbiAgICA8L2Rpdj5cblxuICAgIDxuZy10ZW1wbGF0ZSAjcmVuZGVyRG90VGVtcGxhdGUgbGV0LWluZGV4PlxuICAgICAgPGJ1dHRvbj57eyBpbmRleCArIDEgfX08L2J1dHRvbj5cbiAgICA8L25nLXRlbXBsYXRlPlxuICBgLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5hbnQtY2Fyb3VzZWwtdmVydGljYWxdJzogJ3ZlcnRpY2FsJyxcbiAgICAnW2NsYXNzLmFudC1jYXJvdXNlbC1ydGxdJzogYGRpciA9PT0ncnRsJ2BcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBOekNhcm91c2VsQ29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCwgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95LCBPbkNoYW5nZXMsIE9uSW5pdCB7XG4gIHJlYWRvbmx5IF9uek1vZHVsZU5hbWU6IE56Q29uZmlnS2V5ID0gTlpfQ09ORklHX01PRFVMRV9OQU1FO1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbnpFbmFibGVTd2lwZTogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbnpEb3RzOiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9uekF1dG9QbGF5OiBCb29sZWFuSW5wdXQ7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9uekF1dG9QbGF5U3BlZWQ6IE51bWJlcklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbnpUcmFuc2l0aW9uU3BlZWQ6IE51bWJlcklucHV0O1xuXG4gIEBDb250ZW50Q2hpbGRyZW4oTnpDYXJvdXNlbENvbnRlbnREaXJlY3RpdmUpIGNhcm91c2VsQ29udGVudHMhOiBRdWVyeUxpc3Q8TnpDYXJvdXNlbENvbnRlbnREaXJlY3RpdmU+O1xuXG4gIEBWaWV3Q2hpbGQoJ3NsaWNrTGlzdCcsIHsgc3RhdGljOiBmYWxzZSB9KSBzbGlja0xpc3Q/OiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKCdzbGlja1RyYWNrJywgeyBzdGF0aWM6IGZhbHNlIH0pIHNsaWNrVHJhY2s/OiBFbGVtZW50UmVmO1xuXG4gIEBJbnB1dCgpIG56RG90UmVuZGVyPzogVGVtcGxhdGVSZWY8eyAkaW1wbGljaXQ6IG51bWJlciB9PjtcbiAgQElucHV0KCkgQFdpdGhDb25maWcoKSBuekVmZmVjdDogTnpDYXJvdXNlbEVmZmVjdHMgPSAnc2Nyb2xseCc7XG4gIEBJbnB1dCgpIEBXaXRoQ29uZmlnKCkgQElucHV0Qm9vbGVhbigpIG56RW5hYmxlU3dpcGU6IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXQoKSBAV2l0aENvbmZpZygpIEBJbnB1dEJvb2xlYW4oKSBuekRvdHM6IGJvb2xlYW4gPSB0cnVlO1xuICBASW5wdXQoKSBAV2l0aENvbmZpZygpIEBJbnB1dEJvb2xlYW4oKSBuekF1dG9QbGF5OiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpIEBXaXRoQ29uZmlnKCkgQElucHV0TnVtYmVyKCkgbnpBdXRvUGxheVNwZWVkOiBudW1iZXIgPSAzMDAwO1xuICBASW5wdXQoKSBASW5wdXROdW1iZXIoKSBuelRyYW5zaXRpb25TcGVlZCA9IDUwMDtcblxuICBASW5wdXQoKVxuICAvLyBAdHMtaWdub3JlXG4gIEBXaXRoQ29uZmlnKClcbiAgc2V0IG56RG90UG9zaXRpb24odmFsdWU6IE56Q2Fyb3VzZWxEb3RQb3NpdGlvbikge1xuICAgIHRoaXMuX2RvdFBvc2l0aW9uID0gdmFsdWU7XG4gICAgaWYgKHZhbHVlID09PSAnbGVmdCcgfHwgdmFsdWUgPT09ICdyaWdodCcpIHtcbiAgICAgIHRoaXMudmVydGljYWwgPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLnZlcnRpY2FsID0gZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgZ2V0IG56RG90UG9zaXRpb24oKTogTnpDYXJvdXNlbERvdFBvc2l0aW9uIHtcbiAgICByZXR1cm4gdGhpcy5fZG90UG9zaXRpb247XG4gIH1cblxuICBwcml2YXRlIF9kb3RQb3NpdGlvbjogTnpDYXJvdXNlbERvdFBvc2l0aW9uID0gJ2JvdHRvbSc7XG5cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG56QmVmb3JlQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxGcm9tVG9JbnRlcmZhY2U+KCk7XG4gIEBPdXRwdXQoKSByZWFkb25seSBuekFmdGVyQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxudW1iZXI+KCk7XG5cbiAgYWN0aXZlSW5kZXggPSAwO1xuICBlbDogSFRNTEVsZW1lbnQ7XG4gIHNsaWNrTGlzdEVsITogSFRNTEVsZW1lbnQ7XG4gIHNsaWNrVHJhY2tFbCE6IEhUTUxFbGVtZW50O1xuICBzdHJhdGVneT86IE56Q2Fyb3VzZWxCYXNlU3RyYXRlZ3k7XG4gIHZlcnRpY2FsID0gZmFsc2U7XG4gIHRyYW5zaXRpb25JblByb2dyZXNzOiBudW1iZXIgfCBudWxsID0gbnVsbDtcbiAgZGlyOiBEaXJlY3Rpb24gPSAnbHRyJztcblxuICBwcml2YXRlIGRlc3Ryb3kkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgcHJpdmF0ZSBnZXN0dXJlUmVjdDogQ2xpZW50UmVjdCB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIHBvaW50ZXJEZWx0YTogUG9pbnRlclZlY3RvciB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIGlzVHJhbnNpdGluZyA9IGZhbHNlO1xuICBwcml2YXRlIGlzRHJhZ2dpbmcgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgIHB1YmxpYyByZWFkb25seSBuekNvbmZpZ1NlcnZpY2U6IE56Q29uZmlnU2VydmljZSxcbiAgICBwcml2YXRlIHJlYWRvbmx5IHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHJpdmF0ZSByZWFkb25seSBjZHI6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgcGxhdGZvcm06IFBsYXRmb3JtLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgcmVzaXplU2VydmljZTogTnpSZXNpemVTZXJ2aWNlLFxuICAgIHByaXZhdGUgcmVhZG9ubHkgbnpEcmFnU2VydmljZTogTnpEcmFnU2VydmljZSxcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIGRpcmVjdGlvbmFsaXR5OiBEaXJlY3Rpb25hbGl0eSxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KE5aX0NBUk9VU0VMX0NVU1RPTV9TVFJBVEVHSUVTKSBwcml2YXRlIGN1c3RvbVN0cmF0ZWdpZXM6IE56Q2Fyb3VzZWxTdHJhdGVneVJlZ2lzdHJ5SXRlbVtdXG4gICkge1xuICAgIHRoaXMubnpEb3RQb3NpdGlvbiA9ICdib3R0b20nO1xuXG4gICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyhlbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsICdhbnQtY2Fyb3VzZWwnKTtcbiAgICB0aGlzLmVsID0gZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50O1xuICB9XG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuZGlyID0gdGhpcy5kaXJlY3Rpb25hbGl0eS52YWx1ZTtcbiAgICB0aGlzLmRpcmVjdGlvbmFsaXR5LmNoYW5nZT8ucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpLnN1YnNjcmliZSgoZGlyZWN0aW9uOiBEaXJlY3Rpb24pID0+IHtcbiAgICAgIHRoaXMuZGlyID0gZGlyZWN0aW9uO1xuICAgICAgdGhpcy5zd2l0Y2hTdHJhdGVneSgpO1xuICAgIH0pO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCk6IHZvaWQge1xuICAgIHRoaXMubWFya0NvbnRlbnRBY3RpdmUoMCk7XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgdGhpcy5zbGlja0xpc3RFbCA9IHRoaXMuc2xpY2tMaXN0IS5uYXRpdmVFbGVtZW50O1xuICAgIHRoaXMuc2xpY2tUcmFja0VsID0gdGhpcy5zbGlja1RyYWNrIS5uYXRpdmVFbGVtZW50O1xuXG4gICAgdGhpcy5jYXJvdXNlbENvbnRlbnRzLmNoYW5nZXMucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLm1hcmtDb250ZW50QWN0aXZlKDApO1xuICAgICAgdGhpcy5sYXlvdXQoKTtcbiAgICB9KTtcblxuICAgIHRoaXMucmVzaXplU2VydmljZVxuICAgICAgLnN1YnNjcmliZSgpXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy5sYXlvdXQoKTtcbiAgICAgIH0pO1xuXG4gICAgdGhpcy5zd2l0Y2hTdHJhdGVneSgpO1xuICAgIHRoaXMubWFya0NvbnRlbnRBY3RpdmUoMCk7XG4gICAgdGhpcy5sYXlvdXQoKTtcblxuICAgIC8vIElmIGVtYmVkZGVkIGluIGFuIGVudHJ5IGNvbXBvbmVudCwgaXQgbWF5IGRvIGluaXRpYWwgcmVuZGVyIGF0IGFuIGluYXBwcm9wcmlhdGUgdGltZS5cbiAgICAvLyBuZ1pvbmUub25TdGFibGUgd29uJ3QgZG8gdGhpcyB0cmlja1xuICAgIC8vIFRPRE86IG5lZWQgdG8gY2hhbmdlIHRoaXMuXG4gICAgUHJvbWlzZS5yZXNvbHZlKCkudGhlbigoKSA9PiB7XG4gICAgICB0aGlzLmxheW91dCgpO1xuICAgIH0pO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGNvbnN0IHsgbnpFZmZlY3QsIG56RG90UG9zaXRpb24gfSA9IGNoYW5nZXM7XG5cbiAgICBpZiAobnpFZmZlY3QgJiYgIW56RWZmZWN0LmlzRmlyc3RDaGFuZ2UoKSkge1xuICAgICAgdGhpcy5zd2l0Y2hTdHJhdGVneSgpO1xuICAgICAgdGhpcy5tYXJrQ29udGVudEFjdGl2ZSgwKTtcbiAgICAgIHRoaXMubGF5b3V0KCk7XG4gICAgfVxuXG4gICAgaWYgKG56RG90UG9zaXRpb24gJiYgIW56RG90UG9zaXRpb24uaXNGaXJzdENoYW5nZSgpKSB7XG4gICAgICB0aGlzLnN3aXRjaFN0cmF0ZWd5KCk7XG4gICAgICB0aGlzLm1hcmtDb250ZW50QWN0aXZlKDApO1xuICAgICAgdGhpcy5sYXlvdXQoKTtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMubnpBdXRvUGxheSB8fCAhdGhpcy5uekF1dG9QbGF5U3BlZWQpIHtcbiAgICAgIHRoaXMuY2xlYXJTY2hlZHVsZWRUcmFuc2l0aW9uKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuc2NoZWR1bGVOZXh0VHJhbnNpdGlvbigpO1xuICAgIH1cbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuY2xlYXJTY2hlZHVsZWRUcmFuc2l0aW9uKCk7XG4gICAgaWYgKHRoaXMuc3RyYXRlZ3kpIHtcbiAgICAgIHRoaXMuc3RyYXRlZ3kuZGlzcG9zZSgpO1xuICAgIH1cblxuICAgIHRoaXMuZGVzdHJveSQubmV4dCgpO1xuICAgIHRoaXMuZGVzdHJveSQuY29tcGxldGUoKTtcbiAgfVxuXG4gIG9uS2V5RG93bihlOiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgaWYgKGUua2V5Q29kZSA9PT0gTEVGVF9BUlJPVykge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgdGhpcy5wcmUoKTtcbiAgICB9IGVsc2UgaWYgKGUua2V5Q29kZSA9PT0gUklHSFRfQVJST1cpIHtcbiAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIH1cbiAgfVxuXG4gIG5leHQoKTogdm9pZCB7XG4gICAgdGhpcy5nb1RvKHRoaXMuYWN0aXZlSW5kZXggKyAxKTtcbiAgfVxuXG4gIHByZSgpOiB2b2lkIHtcbiAgICB0aGlzLmdvVG8odGhpcy5hY3RpdmVJbmRleCAtIDEpO1xuICB9XG5cbiAgZ29UbyhpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuY2Fyb3VzZWxDb250ZW50cyAmJiB0aGlzLmNhcm91c2VsQ29udGVudHMubGVuZ3RoICYmICF0aGlzLmlzVHJhbnNpdGluZykge1xuICAgICAgY29uc3QgbGVuZ3RoID0gdGhpcy5jYXJvdXNlbENvbnRlbnRzLmxlbmd0aDtcbiAgICAgIGNvbnN0IGZyb20gPSB0aGlzLmFjdGl2ZUluZGV4O1xuICAgICAgY29uc3QgdG8gPSAoaW5kZXggKyBsZW5ndGgpICUgbGVuZ3RoO1xuICAgICAgdGhpcy5pc1RyYW5zaXRpbmcgPSB0cnVlO1xuICAgICAgdGhpcy5uekJlZm9yZUNoYW5nZS5lbWl0KHsgZnJvbSwgdG8gfSk7XG4gICAgICB0aGlzLnN0cmF0ZWd5IS5zd2l0Y2godGhpcy5hY3RpdmVJbmRleCwgaW5kZXgpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgIHRoaXMuc2NoZWR1bGVOZXh0VHJhbnNpdGlvbigpO1xuICAgICAgICB0aGlzLm56QWZ0ZXJDaGFuZ2UuZW1pdChpbmRleCk7XG4gICAgICAgIHRoaXMuaXNUcmFuc2l0aW5nID0gZmFsc2U7XG4gICAgICB9KTtcbiAgICAgIHRoaXMubWFya0NvbnRlbnRBY3RpdmUodG8pO1xuICAgICAgdGhpcy5jZHIubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBzd2l0Y2hTdHJhdGVneSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zdHJhdGVneSkge1xuICAgICAgdGhpcy5zdHJhdGVneS5kaXNwb3NlKCk7XG4gICAgfVxuXG4gICAgLy8gTG9hZCBjdXN0b20gc3RyYXRlZ2llcyBmaXJzdC5cbiAgICBjb25zdCBjdXN0b21TdHJhdGVneSA9IHRoaXMuY3VzdG9tU3RyYXRlZ2llcyA/IHRoaXMuY3VzdG9tU3RyYXRlZ2llcy5maW5kKHMgPT4gcy5uYW1lID09PSB0aGlzLm56RWZmZWN0KSA6IG51bGw7XG4gICAgaWYgKGN1c3RvbVN0cmF0ZWd5KSB7XG4gICAgICB0aGlzLnN0cmF0ZWd5ID0gbmV3IChjdXN0b21TdHJhdGVneS5zdHJhdGVneSBhcyBOelNhZmVBbnkpKHRoaXMsIHRoaXMuY2RyLCB0aGlzLnJlbmRlcmVyLCB0aGlzLnBsYXRmb3JtKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICB0aGlzLnN0cmF0ZWd5ID1cbiAgICAgIHRoaXMubnpFZmZlY3QgPT09ICdzY3JvbGx4J1xuICAgICAgICA/IG5ldyBOekNhcm91c2VsVHJhbnNmb3JtU3RyYXRlZ3kodGhpcywgdGhpcy5jZHIsIHRoaXMucmVuZGVyZXIsIHRoaXMucGxhdGZvcm0pXG4gICAgICAgIDogbmV3IE56Q2Fyb3VzZWxPcGFjaXR5U3RyYXRlZ3kodGhpcywgdGhpcy5jZHIsIHRoaXMucmVuZGVyZXIsIHRoaXMucGxhdGZvcm0pO1xuICB9XG5cbiAgcHJpdmF0ZSBzY2hlZHVsZU5leHRUcmFuc2l0aW9uKCk6IHZvaWQge1xuICAgIHRoaXMuY2xlYXJTY2hlZHVsZWRUcmFuc2l0aW9uKCk7XG4gICAgaWYgKHRoaXMubnpBdXRvUGxheSAmJiB0aGlzLm56QXV0b1BsYXlTcGVlZCA+IDAgJiYgdGhpcy5wbGF0Zm9ybS5pc0Jyb3dzZXIpIHtcbiAgICAgIHRoaXMudHJhbnNpdGlvbkluUHJvZ3Jlc3MgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5nb1RvKHRoaXMuYWN0aXZlSW5kZXggKyAxKTtcbiAgICAgIH0sIHRoaXMubnpBdXRvUGxheVNwZWVkKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIGNsZWFyU2NoZWR1bGVkVHJhbnNpdGlvbigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy50cmFuc2l0aW9uSW5Qcm9ncmVzcykge1xuICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudHJhbnNpdGlvbkluUHJvZ3Jlc3MpO1xuICAgICAgdGhpcy50cmFuc2l0aW9uSW5Qcm9ncmVzcyA9IG51bGw7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSBtYXJrQ29udGVudEFjdGl2ZShpbmRleDogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy5hY3RpdmVJbmRleCA9IGluZGV4O1xuXG4gICAgaWYgKHRoaXMuY2Fyb3VzZWxDb250ZW50cykge1xuICAgICAgdGhpcy5jYXJvdXNlbENvbnRlbnRzLmZvckVhY2goKHNsaWRlLCBpKSA9PiB7XG4gICAgICAgIHNsaWRlLmlzQWN0aXZlID0gaW5kZXggPT09IGk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB0aGlzLmNkci5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEcmFnIGNhcm91c2VsLlxuICAgKi9cbiAgcG9pbnRlckRvd24gPSAoZXZlbnQ6IFRvdWNoRXZlbnQgfCBNb3VzZUV2ZW50KSA9PiB7XG4gICAgaWYgKCF0aGlzLmlzRHJhZ2dpbmcgJiYgIXRoaXMuaXNUcmFuc2l0aW5nICYmIHRoaXMubnpFbmFibGVTd2lwZSkge1xuICAgICAgdGhpcy5jbGVhclNjaGVkdWxlZFRyYW5zaXRpb24oKTtcbiAgICAgIHRoaXMuZ2VzdHVyZVJlY3QgPSB0aGlzLnNsaWNrTGlzdEVsLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuXG4gICAgICB0aGlzLm56RHJhZ1NlcnZpY2UucmVxdWVzdERyYWdnaW5nU2VxdWVuY2UoZXZlbnQpLnN1YnNjcmliZShcbiAgICAgICAgZGVsdGEgPT4ge1xuICAgICAgICAgIHRoaXMucG9pbnRlckRlbHRhID0gZGVsdGE7XG4gICAgICAgICAgdGhpcy5pc0RyYWdnaW5nID0gdHJ1ZTtcbiAgICAgICAgICB0aGlzLnN0cmF0ZWd5Py5kcmFnZ2luZyh0aGlzLnBvaW50ZXJEZWx0YSk7XG4gICAgICAgIH0sXG4gICAgICAgICgpID0+IHt9LFxuICAgICAgICAoKSA9PiB7XG4gICAgICAgICAgaWYgKHRoaXMubnpFbmFibGVTd2lwZSAmJiB0aGlzLmlzRHJhZ2dpbmcpIHtcbiAgICAgICAgICAgIGNvbnN0IHhEZWx0YSA9IHRoaXMucG9pbnRlckRlbHRhID8gdGhpcy5wb2ludGVyRGVsdGEueCA6IDA7XG5cbiAgICAgICAgICAgIC8vIFN3aXRjaCB0byBhbm90aGVyIHNsaWRlIGlmIGRlbHRhIGlzIGJpZ2dlciB0aGFuIHRoaXJkIG9mIHRoZSB3aWR0aC5cbiAgICAgICAgICAgIGlmIChNYXRoLmFicyh4RGVsdGEpID4gdGhpcy5nZXN0dXJlUmVjdCEud2lkdGggLyAzKSB7XG4gICAgICAgICAgICAgIHRoaXMuZ29Ubyh4RGVsdGEgPiAwID8gdGhpcy5hY3RpdmVJbmRleCAtIDEgOiB0aGlzLmFjdGl2ZUluZGV4ICsgMSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aGlzLmdvVG8odGhpcy5hY3RpdmVJbmRleCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuZ2VzdHVyZVJlY3QgPSBudWxsO1xuICAgICAgICAgICAgdGhpcy5wb2ludGVyRGVsdGEgPSBudWxsO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHRoaXMuaXNEcmFnZ2luZyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICApO1xuICAgIH1cbiAgfTtcblxuICBsYXlvdXQoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuc3RyYXRlZ3kpIHtcbiAgICAgIHRoaXMuc3RyYXRlZ3kud2l0aENhcm91c2VsQ29udGVudHModGhpcy5jYXJvdXNlbENvbnRlbnRzKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==