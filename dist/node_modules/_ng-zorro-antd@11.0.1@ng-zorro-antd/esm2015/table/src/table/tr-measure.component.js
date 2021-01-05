/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
/* tslint:disable:component-selector */
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Input, NgZone, Output, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { NzResizeObserver } from 'ng-zorro-antd/core/resize-observers';
import { combineLatest, Subject } from 'rxjs';
import { debounceTime, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
export class NzTrMeasureComponent {
    constructor(nzResizeObserver, ngZone, elementRef) {
        this.nzResizeObserver = nzResizeObserver;
        this.ngZone = ngZone;
        this.elementRef = elementRef;
        this.listOfMeasureColumn = [];
        this.listOfAutoWidth = new EventEmitter();
        this.destroy$ = new Subject();
        // TODO: move to host after View Engine deprecation
        this.elementRef.nativeElement.classList.add('ant-table-measure-now');
    }
    trackByFunc(_, key) {
        return key;
    }
    ngAfterViewInit() {
        this.listOfTdElement.changes
            .pipe(startWith(this.listOfTdElement))
            .pipe(switchMap(list => {
            return combineLatest(list.toArray().map((item) => {
                return this.nzResizeObserver.observe(item).pipe(map(([entry]) => {
                    const { width } = entry.target.getBoundingClientRect();
                    return Math.floor(width);
                }));
            }));
        }), debounceTime(16), takeUntil(this.destroy$))
            .subscribe(data => {
            this.ngZone.run(() => {
                this.listOfAutoWidth.next(data);
            });
        });
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
NzTrMeasureComponent.decorators = [
    { type: Component, args: [{
                selector: 'tr[nz-table-measure-row]',
                preserveWhitespaces: false,
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                template: `
    <td
      #tdElement
      class="nz-disable-td"
      style="padding: 0px; border: 0px; height: 0px;"
      *ngFor="let th of listOfMeasureColumn; trackBy: trackByFunc"
    ></td>
  `
            },] }
];
NzTrMeasureComponent.ctorParameters = () => [
    { type: NzResizeObserver },
    { type: NgZone },
    { type: ElementRef }
];
NzTrMeasureComponent.propDecorators = {
    listOfMeasureColumn: [{ type: Input }],
    listOfAutoWidth: [{ type: Output }],
    listOfTdElement: [{ type: ViewChildren, args: ['tdElement',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHItbWVhc3VyZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vY29tcG9uZW50cy90YWJsZS8iLCJzb3VyY2VzIjpbInNyYy90YWJsZS90ci1tZWFzdXJlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFDSCx1Q0FBdUM7QUFFdkMsT0FBTyxFQUVMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsVUFBVSxFQUNWLFlBQVksRUFDWixLQUFLLEVBQ0wsTUFBTSxFQUVOLE1BQU0sRUFDTixTQUFTLEVBQ1QsWUFBWSxFQUNaLGlCQUFpQixFQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUN2RSxPQUFPLEVBQUUsYUFBYSxFQUFjLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUMxRCxPQUFPLEVBQUUsWUFBWSxFQUFFLEdBQUcsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBZ0JwRixNQUFNLE9BQU8sb0JBQW9CO0lBSy9CLFlBQW9CLGdCQUFrQyxFQUFVLE1BQWMsRUFBVSxVQUFzQjtRQUExRixxQkFBZ0IsR0FBaEIsZ0JBQWdCLENBQWtCO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUFVLGVBQVUsR0FBVixVQUFVLENBQVk7UUFKckcsd0JBQW1CLEdBQWEsRUFBRSxDQUFDO1FBQ3pCLG9CQUFlLEdBQUcsSUFBSSxZQUFZLEVBQVksQ0FBQztRQUUxRCxhQUFRLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztRQUUvQixtREFBbUQ7UUFDbkQsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0lBQ3ZFLENBQUM7SUFDRCxXQUFXLENBQUMsQ0FBUyxFQUFFLEdBQVc7UUFDaEMsT0FBTyxHQUFHLENBQUM7SUFDYixDQUFDO0lBQ0QsZUFBZTtRQUNiLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTzthQUN6QixJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxlQUFlLENBQUMsQ0FBQzthQUNyQyxJQUFJLENBQ0gsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ2YsT0FBTyxhQUFhLENBQ2xCLElBQUksQ0FBQyxPQUFPLEVBQUUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFnQixFQUFFLEVBQUU7Z0JBQ3RDLE9BQU8sSUFBSSxDQUFDLGdCQUFnQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQzdDLEdBQUcsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEVBQUUsRUFBRTtvQkFDZCxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO29CQUN2RCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzNCLENBQUMsQ0FBQyxDQUNILENBQUM7WUFDSixDQUFDLENBQUMsQ0FDcUIsQ0FBQztRQUM1QixDQUFDLENBQUMsRUFDRixZQUFZLENBQUMsRUFBRSxDQUFDLEVBQ2hCLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQ3pCO2FBQ0EsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ2hCLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEdBQUcsRUFBRTtnQkFDbkIsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDbEMsQ0FBQyxDQUFDLENBQUM7UUFDTCxDQUFDLENBQUMsQ0FBQztJQUNQLENBQUM7SUFDRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNyQixJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQzNCLENBQUM7OztZQXRERixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLDBCQUEwQjtnQkFDcEMsbUJBQW1CLEVBQUUsS0FBSztnQkFDMUIsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLGFBQWEsRUFBRSxpQkFBaUIsQ0FBQyxJQUFJO2dCQUNyQyxRQUFRLEVBQUU7Ozs7Ozs7R0FPVDthQUNGOzs7WUFqQlEsZ0JBQWdCO1lBUHZCLE1BQU07WUFITixVQUFVOzs7a0NBNkJULEtBQUs7OEJBQ0wsTUFBTTs4QkFDTixZQUFZLFNBQUMsV0FBVyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9naXRodWIuY29tL05HLVpPUlJPL25nLXpvcnJvLWFudGQvYmxvYi9tYXN0ZXIvTElDRU5TRVxuICovXG4vKiB0c2xpbnQ6ZGlzYWJsZTpjb21wb25lbnQtc2VsZWN0b3IgKi9cblxuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIE91dHB1dCxcbiAgUXVlcnlMaXN0LFxuICBWaWV3Q2hpbGRyZW4sXG4gIFZpZXdFbmNhcHN1bGF0aW9uXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTnpSZXNpemVPYnNlcnZlciB9IGZyb20gJ25nLXpvcnJvLWFudGQvY29yZS9yZXNpemUtb2JzZXJ2ZXJzJztcbmltcG9ydCB7IGNvbWJpbmVMYXRlc3QsIE9ic2VydmFibGUsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGRlYm91bmNlVGltZSwgbWFwLCBzdGFydFdpdGgsIHN3aXRjaE1hcCwgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICd0cltuei10YWJsZS1tZWFzdXJlLXJvd10nLFxuICBwcmVzZXJ2ZVdoaXRlc3BhY2VzOiBmYWxzZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIHRlbXBsYXRlOiBgXG4gICAgPHRkXG4gICAgICAjdGRFbGVtZW50XG4gICAgICBjbGFzcz1cIm56LWRpc2FibGUtdGRcIlxuICAgICAgc3R5bGU9XCJwYWRkaW5nOiAwcHg7IGJvcmRlcjogMHB4OyBoZWlnaHQ6IDBweDtcIlxuICAgICAgKm5nRm9yPVwibGV0IHRoIG9mIGxpc3RPZk1lYXN1cmVDb2x1bW47IHRyYWNrQnk6IHRyYWNrQnlGdW5jXCJcbiAgICA+PC90ZD5cbiAgYFxufSlcbmV4cG9ydCBjbGFzcyBOelRyTWVhc3VyZUNvbXBvbmVudCBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSB7XG4gIEBJbnB1dCgpIGxpc3RPZk1lYXN1cmVDb2x1bW46IHN0cmluZ1tdID0gW107XG4gIEBPdXRwdXQoKSByZWFkb25seSBsaXN0T2ZBdXRvV2lkdGggPSBuZXcgRXZlbnRFbWl0dGVyPG51bWJlcltdPigpO1xuICBAVmlld0NoaWxkcmVuKCd0ZEVsZW1lbnQnKSBsaXN0T2ZUZEVsZW1lbnQhOiBRdWVyeUxpc3Q8RWxlbWVudFJlZj47XG4gIHByaXZhdGUgZGVzdHJveSQgPSBuZXcgU3ViamVjdCgpO1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIG56UmVzaXplT2JzZXJ2ZXI6IE56UmVzaXplT2JzZXJ2ZXIsIHByaXZhdGUgbmdab25lOiBOZ1pvbmUsIHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZikge1xuICAgIC8vIFRPRE86IG1vdmUgdG8gaG9zdCBhZnRlciBWaWV3IEVuZ2luZSBkZXByZWNhdGlvblxuICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2FudC10YWJsZS1tZWFzdXJlLW5vdycpO1xuICB9XG4gIHRyYWNrQnlGdW5jKF86IG51bWJlciwga2V5OiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBrZXk7XG4gIH1cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIHRoaXMubGlzdE9mVGRFbGVtZW50LmNoYW5nZXNcbiAgICAgIC5waXBlKHN0YXJ0V2l0aCh0aGlzLmxpc3RPZlRkRWxlbWVudCkpXG4gICAgICAucGlwZShcbiAgICAgICAgc3dpdGNoTWFwKGxpc3QgPT4ge1xuICAgICAgICAgIHJldHVybiBjb21iaW5lTGF0ZXN0KFxuICAgICAgICAgICAgbGlzdC50b0FycmF5KCkubWFwKChpdGVtOiBFbGVtZW50UmVmKSA9PiB7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLm56UmVzaXplT2JzZXJ2ZXIub2JzZXJ2ZShpdGVtKS5waXBlKFxuICAgICAgICAgICAgICAgIG1hcCgoW2VudHJ5XSkgPT4ge1xuICAgICAgICAgICAgICAgICAgY29uc3QgeyB3aWR0aCB9ID0gZW50cnkudGFyZ2V0LmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIE1hdGguZmxvb3Iod2lkdGgpO1xuICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9KVxuICAgICAgICAgICkgYXMgT2JzZXJ2YWJsZTxudW1iZXJbXT47XG4gICAgICAgIH0pLFxuICAgICAgICBkZWJvdW5jZVRpbWUoMTYpLFxuICAgICAgICB0YWtlVW50aWwodGhpcy5kZXN0cm95JClcbiAgICAgIClcbiAgICAgIC5zdWJzY3JpYmUoZGF0YSA9PiB7XG4gICAgICAgIHRoaXMubmdab25lLnJ1bigoKSA9PiB7XG4gICAgICAgICAgdGhpcy5saXN0T2ZBdXRvV2lkdGgubmV4dChkYXRhKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgfVxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLmRlc3Ryb3kkLm5leHQoKTtcbiAgICB0aGlzLmRlc3Ryb3kkLmNvbXBsZXRlKCk7XG4gIH1cbn1cbiJdfQ==