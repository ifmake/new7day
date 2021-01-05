/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { Directionality } from '@angular/cdk/bidi';
import { MediaMatcher } from '@angular/cdk/layout';
import { Platform } from '@angular/cdk/platform';
import { Directive, ElementRef, Input, NgZone, Optional, Renderer2 } from '@angular/core';
import { gridResponsiveMap, NzBreakpointService } from 'ng-zorro-antd/core/services';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
export class NzRowDirective {
    constructor(elementRef, renderer, mediaMatcher, ngZone, platform, breakpointService, directionality) {
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.mediaMatcher = mediaMatcher;
        this.ngZone = ngZone;
        this.platform = platform;
        this.breakpointService = breakpointService;
        this.directionality = directionality;
        this.nzAlign = null;
        this.nzJustify = null;
        this.nzGutter = null;
        this.actualGutter$ = new ReplaySubject(1);
        this.dir = 'ltr';
        this.destroy$ = new Subject();
        // TODO: move to host after View Engine deprecation
        this.elementRef.nativeElement.classList.add('ant-row');
    }
    getGutter() {
        const results = [null, null];
        const gutter = this.nzGutter || 0;
        const normalizedGutter = Array.isArray(gutter) ? gutter : [gutter, null];
        normalizedGutter.forEach((g, index) => {
            if (typeof g === 'object' && g !== null) {
                results[index] = null;
                Object.keys(gridResponsiveMap).map((screen) => {
                    const bp = screen;
                    if (this.mediaMatcher.matchMedia(gridResponsiveMap[bp]).matches && g[bp]) {
                        results[index] = g[bp];
                    }
                });
            }
            else {
                results[index] = g || null;
            }
        });
        return results;
    }
    setGutterStyle() {
        const [horizontalGutter, verticalGutter] = this.getGutter();
        this.actualGutter$.next([horizontalGutter, verticalGutter]);
        const renderGutter = (name, gutter) => {
            const nativeElement = this.elementRef.nativeElement;
            if (gutter !== null) {
                this.renderer.setStyle(nativeElement, name, `-${gutter / 2}px`);
            }
        };
        renderGutter('margin-left', horizontalGutter);
        renderGutter('margin-right', horizontalGutter);
        renderGutter('margin-top', verticalGutter);
        renderGutter('margin-bottom', verticalGutter);
    }
    ngOnInit() {
        var _a;
        this.dir = this.directionality.value;
        (_a = this.directionality.change) === null || _a === void 0 ? void 0 : _a.pipe(takeUntil(this.destroy$)).subscribe((direction) => {
            this.dir = direction;
        });
        this.setGutterStyle();
    }
    ngOnChanges(changes) {
        if (changes.nzGutter) {
            this.setGutterStyle();
        }
    }
    ngAfterViewInit() {
        if (this.platform.isBrowser) {
            this.breakpointService
                .subscribe(gridResponsiveMap)
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => {
                this.setGutterStyle();
            });
        }
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
NzRowDirective.decorators = [
    { type: Directive, args: [{
                selector: '[nz-row],nz-row,nz-form-item',
                exportAs: 'nzRow',
                host: {
                    '[class.ant-row-top]': `nzAlign === 'top'`,
                    '[class.ant-row-middle]': `nzAlign === 'middle'`,
                    '[class.ant-row-bottom]': `nzAlign === 'bottom'`,
                    '[class.ant-row-start]': `nzJustify === 'start'`,
                    '[class.ant-row-end]': `nzJustify === 'end'`,
                    '[class.ant-row-center]': `nzJustify === 'center'`,
                    '[class.ant-row-space-around]': `nzJustify === 'space-around'`,
                    '[class.ant-row-space-between]': `nzJustify === 'space-between'`,
                    '[class.ant-row-rtl]': `dir === "rtl"`
                }
            },] }
];
NzRowDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: Renderer2 },
    { type: MediaMatcher },
    { type: NgZone },
    { type: Platform },
    { type: NzBreakpointService },
    { type: Directionality, decorators: [{ type: Optional }] }
];
NzRowDirective.propDecorators = {
    nzAlign: [{ type: Input }],
    nzJustify: [{ type: Input }],
    nzGutter: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm93LmRpcmVjdGl2ZS5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9jb21wb25lbnRzL2dyaWQvIiwic291cmNlcyI6WyJyb3cuZGlyZWN0aXZlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7R0FHRztBQUVILE9BQU8sRUFBYSxjQUFjLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUM5RCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDbkQsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ2pELE9BQU8sRUFFTCxTQUFTLEVBQ1QsVUFBVSxFQUNWLEtBQUssRUFDTCxNQUFNLEVBSU4sUUFBUSxFQUNSLFNBQVMsRUFFVixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsaUJBQWlCLEVBQW1CLG1CQUFtQixFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFFdEcsT0FBTyxFQUFFLGFBQWEsRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDOUMsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBb0IzQyxNQUFNLE9BQU8sY0FBYztJQTRDekIsWUFDUyxVQUFzQixFQUN0QixRQUFtQixFQUNuQixZQUEwQixFQUMxQixNQUFjLEVBQ2QsUUFBa0IsRUFDakIsaUJBQXNDLEVBQzFCLGNBQThCO1FBTjNDLGVBQVUsR0FBVixVQUFVLENBQVk7UUFDdEIsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUNuQixpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUMxQixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUNqQixzQkFBaUIsR0FBakIsaUJBQWlCLENBQXFCO1FBQzFCLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQWxEM0MsWUFBTyxHQUFtQixJQUFJLENBQUM7UUFDL0IsY0FBUyxHQUFxQixJQUFJLENBQUM7UUFDbkMsYUFBUSxHQUE0RixJQUFJLENBQUM7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bUI7WUFoQjVDLGNBQWMsdUJBMEY3QixRQUFROzs7c0JBbERWLEtBQUs7d0JBQ0wsS0FBSzt1QkFDTCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2dpdGh1Yi5jb20vTkctWk9SUk8vbmctem9ycm8tYW50ZC9ibG9iL21hc3Rlci9MSUNFTlNFXG4gKi9cblxuaW1wb3J0IHsgRGlyZWN0aW9uLCBEaXJlY3Rpb25hbGl0eSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7IE1lZGlhTWF0Y2hlciB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9sYXlvdXQnO1xuaW1wb3J0IHsgUGxhdGZvcm0gfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgRGlyZWN0aXZlLFxuICBFbGVtZW50UmVmLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgUmVuZGVyZXIyLFxuICBTaW1wbGVDaGFuZ2VzXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgZ3JpZFJlc3BvbnNpdmVNYXAsIE56QnJlYWtwb2ludEtleSwgTnpCcmVha3BvaW50U2VydmljZSB9IGZyb20gJ25nLXpvcnJvLWFudGQvY29yZS9zZXJ2aWNlcyc7XG5pbXBvcnQgeyBJbmRleGFibGVPYmplY3QgfSBmcm9tICduZy16b3Jyby1hbnRkL2NvcmUvdHlwZXMnO1xuaW1wb3J0IHsgUmVwbGF5U3ViamVjdCwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5leHBvcnQgdHlwZSBOekp1c3RpZnkgPSAnc3RhcnQnIHwgJ2VuZCcgfCAnY2VudGVyJyB8ICdzcGFjZS1hcm91bmQnIHwgJ3NwYWNlLWJldHdlZW4nO1xuZXhwb3J0IHR5cGUgTnpBbGlnbiA9ICd0b3AnIHwgJ21pZGRsZScgfCAnYm90dG9tJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAnW256LXJvd10sbnotcm93LG56LWZvcm0taXRlbScsXG4gIGV4cG9ydEFzOiAnbnpSb3cnLFxuICBob3N0OiB7XG4gICAgJ1tjbGFzcy5hbnQtcm93LXRvcF0nOiBgbnpBbGlnbiA9PT0gJ3RvcCdgLFxuICAgICdbY2xhc3MuYW50LXJvdy1taWRkbGVdJzogYG56QWxpZ24gPT09ICdtaWRkbGUnYCxcbiAgICAnW2NsYXNzLmFudC1yb3ctYm90dG9tXSc6IGBuekFsaWduID09PSAnYm90dG9tJ2AsXG4gICAgJ1tjbGFzcy5hbnQtcm93LXN0YXJ0XSc6IGBuekp1c3RpZnkgPT09ICdzdGFydCdgLFxuICAgICdbY2xhc3MuYW50LXJvdy1lbmRdJzogYG56SnVzdGlmeSA9PT0gJ2VuZCdgLFxuICAgICdbY2xhc3MuYW50LXJvdy1jZW50ZXJdJzogYG56SnVzdGlmeSA9PT0gJ2NlbnRlcidgLFxuICAgICdbY2xhc3MuYW50LXJvdy1zcGFjZS1hcm91bmRdJzogYG56SnVzdGlmeSA9PT0gJ3NwYWNlLWFyb3VuZCdgLFxuICAgICdbY2xhc3MuYW50LXJvdy1zcGFjZS1iZXR3ZWVuXSc6IGBuekp1c3RpZnkgPT09ICdzcGFjZS1iZXR3ZWVuJ2AsXG4gICAgJ1tjbGFzcy5hbnQtcm93LXJ0bF0nOiBgZGlyID09PSBcInJ0bFwiYFxuICB9XG59KVxuZXhwb3J0IGNsYXNzIE56Um93RGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gIEBJbnB1dCgpIG56QWxpZ246IE56QWxpZ24gfCBudWxsID0gbnVsbDtcbiAgQElucHV0KCkgbnpKdXN0aWZ5OiBOekp1c3RpZnkgfCBudWxsID0gbnVsbDtcbiAgQElucHV0KCkgbnpHdXR0ZXI6IG51bWJlciB8IEluZGV4YWJsZU9iamVjdCB8IFtudW1iZXIsIG51bWJlcl0gfCBbSW5kZXhhYmxlT2JqZWN0LCBJbmRleGFibGVPYmplY3RdIHwgbnVsbCA9IG51bGw7XG5cbiAgcmVhZG9ubHkgYWN0dWFsR3V0dGVyJCA9IG5ldyBSZXBsYXlTdWJqZWN0PFtudW1iZXIgfCBudWxsLCBudW1iZXIgfCBudWxsXT4oMSk7XG5cbiAgZGlyOiBEaXJlY3Rpb24gPSAnbHRyJztcbiAgcHJpdmF0ZSByZWFkb25seSBkZXN0cm95JCA9IG5ldyBTdWJqZWN0KCk7XG5cbiAgZ2V0R3V0dGVyKCk6IFtudW1iZXIgfCBudWxsLCBudW1iZXIgfCBudWxsXSB7XG4gICAgY29uc3QgcmVzdWx0czogW251bWJlciB8IG51bGwsIG51bWJlciB8IG51bGxdID0gW251bGwsIG51bGxdO1xuICAgIGNvbnN0IGd1dHRlciA9IHRoaXMubnpHdXR0ZXIgfHwgMDtcbiAgICBjb25zdCBub3JtYWxpemVkR3V0dGVyID0gQXJyYXkuaXNBcnJheShndXR0ZXIpID8gZ3V0dGVyIDogW2d1dHRlciwgbnVsbF07XG4gICAgbm9ybWFsaXplZEd1dHRlci5mb3JFYWNoKChnLCBpbmRleCkgPT4ge1xuICAgICAgaWYgKHR5cGVvZiBnID09PSAnb2JqZWN0JyAmJiBnICE9PSBudWxsKSB7XG4gICAgICAgIHJlc3VsdHNbaW5kZXhdID0gbnVsbDtcbiAgICAgICAgT2JqZWN0LmtleXMoZ3JpZFJlc3BvbnNpdmVNYXApLm1hcCgoc2NyZWVuOiBzdHJpbmcpID0+IHtcbiAgICAgICAgICBjb25zdCBicCA9IHNjcmVlbiBhcyBOekJyZWFrcG9pbnRLZXk7XG4gICAgICAgICAgaWYgKHRoaXMubWVkaWFNYXRjaGVyLm1hdGNoTWVkaWEoZ3JpZFJlc3BvbnNpdmVNYXBbYnBdKS5tYXRjaGVzICYmIGdbYnBdKSB7XG4gICAgICAgICAgICByZXN1bHRzW2luZGV4XSA9IGchW2JwXSBhcyBudW1iZXI7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdHNbaW5kZXhdID0gZyB8fCBudWxsO1xuICAgICAgfVxuICAgIH0pO1xuICAgIHJldHVybiByZXN1bHRzO1xuICB9XG5cbiAgc2V0R3V0dGVyU3R5bGUoKTogdm9pZCB7XG4gICAgY29uc3QgW2hvcml6b250YWxHdXR0ZXIsIHZlcnRpY2FsR3V0dGVyXSA9IHRoaXMuZ2V0R3V0dGVyKCk7XG4gICAgdGhpcy5hY3R1YWxHdXR0ZXIkLm5leHQoW2hvcml6b250YWxHdXR0ZXIsIHZlcnRpY2FsR3V0dGVyXSk7XG4gICAgY29uc3QgcmVuZGVyR3V0dGVyID0gKG5hbWU6IHN0cmluZywgZ3V0dGVyOiBudW1iZXIgfCBudWxsKSA9PiB7XG4gICAgICBjb25zdCBuYXRpdmVFbGVtZW50ID0gdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQ7XG4gICAgICBpZiAoZ3V0dGVyICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMucmVuZGVyZXIuc2V0U3R5bGUobmF0aXZlRWxlbWVudCwgbmFtZSwgYC0ke2d1dHRlciAvIDJ9cHhgKTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHJlbmRlckd1dHRlcignbWFyZ2luLWxlZnQnLCBob3Jpem9udGFsR3V0dGVyKTtcbiAgICByZW5kZXJHdXR0ZXIoJ21hcmdpbi1yaWdodCcsIGhvcml6b250YWxHdXR0ZXIpO1xuICAgIHJlbmRlckd1dHRlcignbWFyZ2luLXRvcCcsIHZlcnRpY2FsR3V0dGVyKTtcbiAgICByZW5kZXJHdXR0ZXIoJ21hcmdpbi1ib3R0b20nLCB2ZXJ0aWNhbEd1dHRlcik7XG4gIH1cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHVibGljIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHVibGljIG1lZGlhTWF0Y2hlcjogTWVkaWFNYXRjaGVyLFxuICAgIHB1YmxpYyBuZ1pvbmU6IE5nWm9uZSxcbiAgICBwdWJsaWMgcGxhdGZvcm06IFBsYXRmb3JtLFxuICAgIHByaXZhdGUgYnJlYWtwb2ludFNlcnZpY2U6IE56QnJlYWtwb2ludFNlcnZpY2UsXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBkaXJlY3Rpb25hbGl0eTogRGlyZWN0aW9uYWxpdHlcbiAgKSB7XG4gICAgLy8gVE9ETzogbW92ZSB0byBob3N0IGFmdGVyIFZpZXcgRW5naW5lIGRlcHJlY2F0aW9uXG4gICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYW50LXJvdycpO1xuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5kaXIgPSB0aGlzLmRpcmVjdGlvbmFsaXR5LnZhbHVlO1xuICAgIHRoaXMuZGlyZWN0aW9uYWxpdHkuY2hhbmdlPy5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSkuc3Vic2NyaWJlKChkaXJlY3Rpb246IERpcmVjdGlvbikgPT4ge1xuICAgICAgdGhpcy5kaXIgPSBkaXJlY3Rpb247XG4gICAgfSk7XG5cbiAgICB0aGlzLnNldEd1dHRlclN0eWxlKCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgaWYgKGNoYW5nZXMubnpHdXR0ZXIpIHtcbiAgICAgIHRoaXMuc2V0R3V0dGVyU3R5bGUoKTtcbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMucGxhdGZvcm0uaXNCcm93c2VyKSB7XG4gICAgICB0aGlzLmJyZWFrcG9pbnRTZXJ2aWNlXG4gICAgICAgIC5zdWJzY3JpYmUoZ3JpZFJlc3BvbnNpdmVNYXApXG4gICAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSlcbiAgICAgICAgLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICAgICAgdGhpcy5zZXRHdXR0ZXJTdHlsZSgpO1xuICAgICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLmRlc3Ryb3kkLm5leHQoKTtcbiAgICB0aGlzLmRlc3Ryb3kkLmNvbXBsZXRlKCk7XG4gIH1cbn1cbiJdfQ==