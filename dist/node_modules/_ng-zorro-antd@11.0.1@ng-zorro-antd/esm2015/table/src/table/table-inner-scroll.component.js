/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { Platform } from '@angular/cdk/platform';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, Component, ElementRef, Input, NgZone, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { NzResizeService } from 'ng-zorro-antd/core/services';
import { fromEvent, merge, Subject } from 'rxjs';
import { delay, filter, startWith, switchMap, takeUntil } from 'rxjs/operators';
export class NzTableInnerScrollComponent {
    constructor(renderer, ngZone, platform, resizeService, elementRef) {
        this.renderer = renderer;
        this.ngZone = ngZone;
        this.platform = platform;
        this.resizeService = resizeService;
        this.elementRef = elementRef;
        this.data = [];
        this.scrollX = null;
        this.scrollY = null;
        this.contentTemplate = null;
        this.widthConfig = [];
        this.listOfColWidth = [];
        this.theadTemplate = null;
        this.virtualTemplate = null;
        this.virtualItemSize = 0;
        this.virtualMaxBufferPx = 200;
        this.virtualMinBufferPx = 100;
        this.virtualForTrackBy = index => index;
        this.headerStyleMap = {};
        this.bodyStyleMap = {};
        this.verticalScrollBarWidth = 0;
        this.noDateVirtualHeight = '182px';
        this.data$ = new Subject();
        this.scroll$ = new Subject();
        this.destroy$ = new Subject();
        // TODO: move to host after View Engine deprecation
        this.elementRef.nativeElement.classList.add('ant-table-container');
    }
    setScrollPositionClassName(clear = false) {
        const { scrollWidth, scrollLeft, clientWidth } = this.tableBodyElement.nativeElement;
        const leftClassName = 'ant-table-ping-left';
        const rightClassName = 'ant-table-ping-right';
        if ((scrollWidth === clientWidth && scrollWidth !== 0) || clear) {
            this.renderer.removeClass(this.tableMainElement, leftClassName);
            this.renderer.removeClass(this.tableMainElement, rightClassName);
        }
        else if (scrollLeft === 0) {
            this.renderer.removeClass(this.tableMainElement, leftClassName);
            this.renderer.addClass(this.tableMainElement, rightClassName);
        }
        else if (scrollWidth === scrollLeft + clientWidth) {
            this.renderer.removeClass(this.tableMainElement, rightClassName);
            this.renderer.addClass(this.tableMainElement, leftClassName);
        }
        else {
            this.renderer.addClass(this.tableMainElement, leftClassName);
            this.renderer.addClass(this.tableMainElement, rightClassName);
        }
    }
    ngOnChanges(changes) {
        const { scrollX, scrollY, data } = changes;
        if (scrollX || scrollY) {
            const hasVerticalScrollBar = this.verticalScrollBarWidth !== 0;
            this.headerStyleMap = {
                overflowX: 'hidden',
                overflowY: this.scrollY && hasVerticalScrollBar ? 'scroll' : 'hidden'
            };
            this.bodyStyleMap = {
                overflowY: this.scrollY ? 'scroll' : 'hidden',
                overflowX: this.scrollX ? 'auto' : null,
                maxHeight: this.scrollY
            };
            this.scroll$.next();
        }
        if (data) {
            this.data$.next();
        }
    }
    ngAfterViewInit() {
        if (this.platform.isBrowser) {
            this.ngZone.runOutsideAngular(() => {
                const scrollEvent$ = this.scroll$.pipe(startWith(null), delay(0), switchMap(() => fromEvent(this.tableBodyElement.nativeElement, 'scroll').pipe(startWith(true))), takeUntil(this.destroy$));
                const resize$ = this.resizeService.subscribe().pipe(takeUntil(this.destroy$));
                const data$ = this.data$.pipe(takeUntil(this.destroy$));
                const setClassName$ = merge(scrollEvent$, resize$, data$, this.scroll$).pipe(startWith(true), delay(0), takeUntil(this.destroy$));
                setClassName$.subscribe(() => this.setScrollPositionClassName());
                scrollEvent$
                    .pipe(filter(() => !!this.scrollY))
                    .subscribe(() => (this.tableHeaderElement.nativeElement.scrollLeft = this.tableBodyElement.nativeElement.scrollLeft));
            });
        }
    }
    ngOnDestroy() {
        this.setScrollPositionClassName(true);
        this.destroy$.next();
        this.destroy$.complete();
    }
}
NzTableInnerScrollComponent.decorators = [
    { type: Component, args: [{
                selector: 'nz-table-inner-scroll',
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                template: `
    <ng-container *ngIf="scrollY">
      <div #tableHeaderElement [ngStyle]="headerStyleMap" class="ant-table-header nz-table-hide-scrollbar">
        <table
          nz-table-content
          tableLayout="fixed"
          [scrollX]="scrollX"
          [listOfColWidth]="listOfColWidth"
          [theadTemplate]="theadTemplate"
        ></table>
      </div>
      <div #tableBodyElement *ngIf="!virtualTemplate" class="ant-table-body" [ngStyle]="bodyStyleMap">
        <table
          nz-table-content
          tableLayout="fixed"
          [scrollX]="scrollX"
          [listOfColWidth]="listOfColWidth"
          [contentTemplate]="contentTemplate"
        ></table>
      </div>
      <cdk-virtual-scroll-viewport
        #tableBodyElement
        *ngIf="virtualTemplate"
        [itemSize]="virtualItemSize"
        [maxBufferPx]="virtualMaxBufferPx"
        [minBufferPx]="virtualMinBufferPx"
        [style.height]="data.length ? scrollY : noDateVirtualHeight"
      >
        <table nz-table-content tableLayout="fixed" [scrollX]="scrollX" [listOfColWidth]="listOfColWidth">
          <tbody>
            <ng-container *cdkVirtualFor="let item of data; let i = index; trackBy: virtualForTrackBy">
              <ng-template [ngTemplateOutlet]="virtualTemplate" [ngTemplateOutletContext]="{ $implicit: item, index: i }"></ng-template>
            </ng-container>
          </tbody>
        </table>
      </cdk-virtual-scroll-viewport>
    </ng-container>
    <div class="ant-table-content" *ngIf="!scrollY">
      <div #tableBodyElement class="ant-table-body" [ngStyle]="bodyStyleMap">
        <table
          nz-table-content
          tableLayout="fixed"
          [scrollX]="scrollX"
          [listOfColWidth]="listOfColWidth"
          [theadTemplate]="theadTemplate"
          [contentTemplate]="contentTemplate"
        ></table>
      </div>
    </div>
  `
            },] }
];
NzTableInnerScrollComponent.ctorParameters = () => [
    { type: Renderer2 },
    { type: NgZone },
    { type: Platform },
    { type: NzResizeService },
    { type: ElementRef }
];
NzTableInnerScrollComponent.propDecorators = {
    data: [{ type: Input }],
    scrollX: [{ type: Input }],
    scrollY: [{ type: Input }],
    contentTemplate: [{ type: Input }],
    widthConfig: [{ type: Input }],
    listOfColWidth: [{ type: Input }],
    theadTemplate: [{ type: Input }],
    virtualTemplate: [{ type: Input }],
    virtualItemSize: [{ type: Input }],
    virtualMaxBufferPx: [{ type: Input }],
    virtualMinBufferPx: [{ type: Input }],
    tableMainElement: [{ type: Input }],
    virtualForTrackBy: [{ type: Input }],
    tableHeaderElement: [{ type: ViewChild, args: ['tableHeaderElement', { read: ElementRef },] }],
    tableBodyElement: [{ type: ViewChild, args: ['tableBodyElement', { read: ElementRef },] }],
    cdkVirtualScrollViewport: [{ type: ViewChild, args: [CdkVirtualScrollViewport, { read: CdkVirtualScrollViewport },] }],
    verticalScrollBarWidth: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtaW5uZXItc2Nyb2xsLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9jb21wb25lbnRzL3RhYmxlLyIsInNvdXJjZXMiOlsic3JjL3RhYmxlL3RhYmxlLWlubmVyLXNjcm9sbC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHO0FBRUgsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ2pELE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ2xFLE9BQU8sRUFFTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFVBQVUsRUFDVixLQUFLLEVBQ0wsTUFBTSxFQUdOLFNBQVMsRUFJVCxTQUFTLEVBQ1QsaUJBQWlCLEVBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUU5RCxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDakQsT0FBTyxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQTBEaEYsTUFBTSxPQUFPLDJCQUEyQjtJQTZDdEMsWUFDVSxRQUFtQixFQUNuQixNQUFjLEVBQ2QsUUFBa0IsRUFDbEIsYUFBOEIsRUFDOUIsVUFBc0I7UUFKdEIsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUNuQixXQUFNLEdBQU4sTUFBTSxDQUFRO1FBQ2QsYUFBUSxHQUFSLFFBQVEsQ0FBVTtRQUNsQixrQkFBYSxHQUFiLGFBQWEsQ0FBaUI7UUFDOUIsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQWpEdkIsU0FBSSxHQUFrQixFQUFFLENBQUM7UUFDekIsWUFBTyxHQUFrQixJQUFJLENBQUM7UUFDOUIsWUFBTyxHQUFrQixJQUFJLENBQUM7UUFDOUIsb0JBQWUsR0FBa0MsSUFBSSxDQUFDO1FBQ3RELGdCQUFXLEdBQWEsRUFBRSxDQUFDO1FBQzNCLG1CQUFjLEdBQXlCLEVBQUUsQ0FBQztRQUMxQyxrQkFBYSxHQUFrQyxJQUFJLENBQUM7UUFDcEQsb0JBQWUsR0FBa0MsSUFBSSxDQUFDO1FBQ3RELG9CQUFlLEdBQUcsQ0FBQyxDQUFDO1FBQ3BCLHVCQUFrQixHQUFHLEdBQUcsQ0FBQztRQUN6Qix1QkFBa0IsR0FBRyxHQUFHLENBQUM7UUFFekIsc0JBQWlCLEdBQWlDLEtBQUssQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDO1FBSzFFLG1CQUFjLEdBQUcsRUFBRSxDQUFDO1FBQ3BCLGlCQUFZLEdBQUcsRUFBRSxDQUFDO1FBQ1QsMkJBQXNCLEdBQUcsQ0FBQyxDQUFDO1FBQ3BDLHdCQUFtQixHQUFHLE9BQU8sQ0FBQztRQUN0QixVQUFLLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztRQUM1QixZQUFPLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztRQUM5QixhQUFRLEdBQUcsSUFBSSxPQUFPLEVBQVEsQ0FBQztRQTRCckMsbURBQW1EO1FBQ25ELElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQztJQUNyRSxDQUFDO0lBNUJELDBCQUEwQixDQUFDLFFBQWlCLEtBQUs7UUFDL0MsTUFBTSxFQUFFLFdBQVcsRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQztRQUNyRixNQUFNLGFBQWEsR0FBRyxxQkFBcUIsQ0FBQztRQUM1QyxNQUFNLGNBQWMsR0FBRyxzQkFBc0IsQ0FBQztRQUM5QyxJQUFJLENBQUMsV0FBVyxLQUFLLFdBQVcsSUFBSSxXQUFXLEtBQUssQ0FBQyxDQUFDLElBQUksS0FBSyxFQUFFO1lBQy9ELElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxhQUFhLENBQUMsQ0FBQztZQUNoRSxJQUFJLENBQUMsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsY0FBYyxDQUFDLENBQUM7U0FDbEU7YUFBTSxJQUFJLFVBQVUsS0FBSyxDQUFDLEVBQUU7WUFDM0IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBQ2hFLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxjQUFjLENBQUMsQ0FBQztTQUMvRDthQUFNLElBQUksV0FBVyxLQUFLLFVBQVUsR0FBRyxXQUFXLEVBQUU7WUFDbkQsSUFBSSxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLGNBQWMsQ0FBQyxDQUFDO1lBQ2pFLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxhQUFhLENBQUMsQ0FBQztTQUM5RDthQUFNO1lBQ0wsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFLGFBQWEsQ0FBQyxDQUFDO1lBQzdELElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxjQUFjLENBQUMsQ0FBQztTQUMvRDtJQUNILENBQUM7SUFhRCxXQUFXLENBQUMsT0FBc0I7UUFDaEMsTUFBTSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsSUFBSSxFQUFFLEdBQUcsT0FBTyxDQUFDO1FBQzNDLElBQUksT0FBTyxJQUFJLE9BQU8sRUFBRTtZQUN0QixNQUFNLG9CQUFvQixHQUFHLElBQUksQ0FBQyxzQkFBc0IsS0FBSyxDQUFDLENBQUM7WUFDL0QsSUFBSSxDQUFDLGNBQWMsR0FBRztnQkFDcEIsU0FBUyxFQUFFLFFBQVE7Z0JBQ25CLFNBQVMsRUFBRSxJQUFJLENBQUMsT0FBTyxJQUFJLG9CQUFvQixDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVE7YUFDdEUsQ0FBQztZQUNGLElBQUksQ0FBQyxZQUFZLEdBQUc7Z0JBQ2xCLFNBQVMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFFBQVE7Z0JBQzdDLFNBQVMsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLElBQUk7Z0JBQ3ZDLFNBQVMsRUFBRSxJQUFJLENBQUMsT0FBTzthQUN4QixDQUFDO1lBQ0YsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUNyQjtRQUNELElBQUksSUFBSSxFQUFFO1lBQ1IsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUNuQjtJQUNILENBQUM7SUFDRCxlQUFlO1FBQ2IsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLFNBQVMsRUFBRTtZQUMzQixJQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRTtnQkFDakMsTUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQ3BDLFNBQVMsQ0FBQyxJQUFJLENBQUMsRUFDZixLQUFLLENBQUMsQ0FBQyxDQUFDLEVBQ1IsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLFNBQVMsQ0FBYSxJQUFJLENBQUMsZ0JBQWdCLENBQUMsYUFBYSxFQUFFLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxFQUMzRyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUN6QixDQUFDO2dCQUNGLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDOUUsTUFBTSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUN4RCxNQUFNLGFBQWEsR0FBRyxLQUFLLENBQUMsWUFBWSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLEVBQUUsS0FBSyxDQUFDLENBQUMsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztnQkFDbEksYUFBYSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsMEJBQTBCLEVBQUUsQ0FBQyxDQUFDO2dCQUNqRSxZQUFZO3FCQUNULElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztxQkFDbEMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLGFBQWEsQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDO1lBQzFILENBQUMsQ0FBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDO0lBQ0QsV0FBVztRQUNULElBQUksQ0FBQywwQkFBMEIsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUN0QyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxFQUFFLENBQUM7SUFDM0IsQ0FBQzs7O1lBekpGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsdUJBQXVCO2dCQUNqQyxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtnQkFDL0MsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7Z0JBQ3JDLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQWlEVDthQUNGOzs7WUFuRUMsU0FBUztZQUhULE1BQU07WUFSQyxRQUFRO1lBa0JSLGVBQWU7WUFadEIsVUFBVTs7O21CQTBFVCxLQUFLO3NCQUNMLEtBQUs7c0JBQ0wsS0FBSzs4QkFDTCxLQUFLOzBCQUNMLEtBQUs7NkJBQ0wsS0FBSzs0QkFDTCxLQUFLOzhCQUNMLEtBQUs7OEJBQ0wsS0FBSztpQ0FDTCxLQUFLO2lDQUNMLEtBQUs7K0JBQ0wsS0FBSztnQ0FDTCxLQUFLO2lDQUNMLFNBQVMsU0FBQyxvQkFBb0IsRUFBRSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUU7K0JBQ3BELFNBQVMsU0FBQyxrQkFBa0IsRUFBRSxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUU7dUNBQ2xELFNBQVMsU0FBQyx3QkFBd0IsRUFBRSxFQUFFLElBQUksRUFBRSx3QkFBd0IsRUFBRTtxQ0FJdEUsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9naXRodWIuY29tL05HLVpPUlJPL25nLXpvcnJvLWFudGQvYmxvYi9tYXN0ZXIvTElDRU5TRVxuICovXG5cbmltcG9ydCB7IFBsYXRmb3JtIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BsYXRmb3JtJztcbmltcG9ydCB7IENka1ZpcnR1YWxTY3JvbGxWaWV3cG9ydCB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9zY3JvbGxpbmcnO1xuaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgSW5wdXQsXG4gIE5nWm9uZSxcbiAgT25DaGFuZ2VzLFxuICBPbkRlc3Ryb3ksXG4gIFJlbmRlcmVyMixcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVGVtcGxhdGVSZWYsXG4gIFRyYWNrQnlGdW5jdGlvbixcbiAgVmlld0NoaWxkLFxuICBWaWV3RW5jYXBzdWxhdGlvblxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE56UmVzaXplU2VydmljZSB9IGZyb20gJ25nLXpvcnJvLWFudGQvY29yZS9zZXJ2aWNlcyc7XG5pbXBvcnQgeyBOelNhZmVBbnkgfSBmcm9tICduZy16b3Jyby1hbnRkL2NvcmUvdHlwZXMnO1xuaW1wb3J0IHsgZnJvbUV2ZW50LCBtZXJnZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZGVsYXksIGZpbHRlciwgc3RhcnRXaXRoLCBzd2l0Y2hNYXAsIHRha2VVbnRpbCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IE56VGFibGVEYXRhIH0gZnJvbSAnLi4vdGFibGUudHlwZXMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduei10YWJsZS1pbm5lci1zY3JvbGwnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bmctY29udGFpbmVyICpuZ0lmPVwic2Nyb2xsWVwiPlxuICAgICAgPGRpdiAjdGFibGVIZWFkZXJFbGVtZW50IFtuZ1N0eWxlXT1cImhlYWRlclN0eWxlTWFwXCIgY2xhc3M9XCJhbnQtdGFibGUtaGVhZGVyIG56LXRhYmxlLWhpZGUtc2Nyb2xsYmFyXCI+XG4gICAgICAgIDx0YWJsZVxuICAgICAgICAgIG56LXRhYmxlLWNvbnRlbnRcbiAgICAgICAgICB0YWJsZUxheW91dD1cImZpeGVkXCJcbiAgICAgICAgICBbc2Nyb2xsWF09XCJzY3JvbGxYXCJcbiAgICAgICAgICBbbGlzdE9mQ29sV2lkdGhdPVwibGlzdE9mQ29sV2lkdGhcIlxuICAgICAgICAgIFt0aGVhZFRlbXBsYXRlXT1cInRoZWFkVGVtcGxhdGVcIlxuICAgICAgICA+PC90YWJsZT5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiAjdGFibGVCb2R5RWxlbWVudCAqbmdJZj1cIiF2aXJ0dWFsVGVtcGxhdGVcIiBjbGFzcz1cImFudC10YWJsZS1ib2R5XCIgW25nU3R5bGVdPVwiYm9keVN0eWxlTWFwXCI+XG4gICAgICAgIDx0YWJsZVxuICAgICAgICAgIG56LXRhYmxlLWNvbnRlbnRcbiAgICAgICAgICB0YWJsZUxheW91dD1cImZpeGVkXCJcbiAgICAgICAgICBbc2Nyb2xsWF09XCJzY3JvbGxYXCJcbiAgICAgICAgICBbbGlzdE9mQ29sV2lkdGhdPVwibGlzdE9mQ29sV2lkdGhcIlxuICAgICAgICAgIFtjb250ZW50VGVtcGxhdGVdPVwiY29udGVudFRlbXBsYXRlXCJcbiAgICAgICAgPjwvdGFibGU+XG4gICAgICA8L2Rpdj5cbiAgICAgIDxjZGstdmlydHVhbC1zY3JvbGwtdmlld3BvcnRcbiAgICAgICAgI3RhYmxlQm9keUVsZW1lbnRcbiAgICAgICAgKm5nSWY9XCJ2aXJ0dWFsVGVtcGxhdGVcIlxuICAgICAgICBbaXRlbVNpemVdPVwidmlydHVhbEl0ZW1TaXplXCJcbiAgICAgICAgW21heEJ1ZmZlclB4XT1cInZpcnR1YWxNYXhCdWZmZXJQeFwiXG4gICAgICAgIFttaW5CdWZmZXJQeF09XCJ2aXJ0dWFsTWluQnVmZmVyUHhcIlxuICAgICAgICBbc3R5bGUuaGVpZ2h0XT1cImRhdGEubGVuZ3RoID8gc2Nyb2xsWSA6IG5vRGF0ZVZpcnR1YWxIZWlnaHRcIlxuICAgICAgPlxuICAgICAgICA8dGFibGUgbnotdGFibGUtY29udGVudCB0YWJsZUxheW91dD1cImZpeGVkXCIgW3Njcm9sbFhdPVwic2Nyb2xsWFwiIFtsaXN0T2ZDb2xXaWR0aF09XCJsaXN0T2ZDb2xXaWR0aFwiPlxuICAgICAgICAgIDx0Ym9keT5cbiAgICAgICAgICAgIDxuZy1jb250YWluZXIgKmNka1ZpcnR1YWxGb3I9XCJsZXQgaXRlbSBvZiBkYXRhOyBsZXQgaSA9IGluZGV4OyB0cmFja0J5OiB2aXJ0dWFsRm9yVHJhY2tCeVwiPlxuICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwidmlydHVhbFRlbXBsYXRlXCIgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cInsgJGltcGxpY2l0OiBpdGVtLCBpbmRleDogaSB9XCI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICAgIDwvdGJvZHk+XG4gICAgICAgIDwvdGFibGU+XG4gICAgICA8L2Nkay12aXJ0dWFsLXNjcm9sbC12aWV3cG9ydD5cbiAgICA8L25nLWNvbnRhaW5lcj5cbiAgICA8ZGl2IGNsYXNzPVwiYW50LXRhYmxlLWNvbnRlbnRcIiAqbmdJZj1cIiFzY3JvbGxZXCI+XG4gICAgICA8ZGl2ICN0YWJsZUJvZHlFbGVtZW50IGNsYXNzPVwiYW50LXRhYmxlLWJvZHlcIiBbbmdTdHlsZV09XCJib2R5U3R5bGVNYXBcIj5cbiAgICAgICAgPHRhYmxlXG4gICAgICAgICAgbnotdGFibGUtY29udGVudFxuICAgICAgICAgIHRhYmxlTGF5b3V0PVwiZml4ZWRcIlxuICAgICAgICAgIFtzY3JvbGxYXT1cInNjcm9sbFhcIlxuICAgICAgICAgIFtsaXN0T2ZDb2xXaWR0aF09XCJsaXN0T2ZDb2xXaWR0aFwiXG4gICAgICAgICAgW3RoZWFkVGVtcGxhdGVdPVwidGhlYWRUZW1wbGF0ZVwiXG4gICAgICAgICAgW2NvbnRlbnRUZW1wbGF0ZV09XCJjb250ZW50VGVtcGxhdGVcIlxuICAgICAgICA+PC90YWJsZT5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICBgXG59KVxuZXhwb3J0IGNsYXNzIE56VGFibGVJbm5lclNjcm9sbENvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcbiAgQElucHV0KCkgZGF0YTogTnpUYWJsZURhdGFbXSA9IFtdO1xuICBASW5wdXQoKSBzY3JvbGxYOiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgQElucHV0KCkgc2Nyb2xsWTogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIEBJbnB1dCgpIGNvbnRlbnRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8TnpTYWZlQW55PiB8IG51bGwgPSBudWxsO1xuICBASW5wdXQoKSB3aWR0aENvbmZpZzogc3RyaW5nW10gPSBbXTtcbiAgQElucHV0KCkgbGlzdE9mQ29sV2lkdGg6IEFycmF5PHN0cmluZyB8IG51bGw+ID0gW107XG4gIEBJbnB1dCgpIHRoZWFkVGVtcGxhdGU6IFRlbXBsYXRlUmVmPE56U2FmZUFueT4gfCBudWxsID0gbnVsbDtcbiAgQElucHV0KCkgdmlydHVhbFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxOelNhZmVBbnk+IHwgbnVsbCA9IG51bGw7XG4gIEBJbnB1dCgpIHZpcnR1YWxJdGVtU2l6ZSA9IDA7XG4gIEBJbnB1dCgpIHZpcnR1YWxNYXhCdWZmZXJQeCA9IDIwMDtcbiAgQElucHV0KCkgdmlydHVhbE1pbkJ1ZmZlclB4ID0gMTAwO1xuICBASW5wdXQoKSB0YWJsZU1haW5FbGVtZW50PzogSFRNTERpdkVsZW1lbnQ7XG4gIEBJbnB1dCgpIHZpcnR1YWxGb3JUcmFja0J5OiBUcmFja0J5RnVuY3Rpb248TnpUYWJsZURhdGE+ID0gaW5kZXggPT4gaW5kZXg7XG4gIEBWaWV3Q2hpbGQoJ3RhYmxlSGVhZGVyRWxlbWVudCcsIHsgcmVhZDogRWxlbWVudFJlZiB9KSB0YWJsZUhlYWRlckVsZW1lbnQhOiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKCd0YWJsZUJvZHlFbGVtZW50JywgeyByZWFkOiBFbGVtZW50UmVmIH0pIHRhYmxlQm9keUVsZW1lbnQhOiBFbGVtZW50UmVmO1xuICBAVmlld0NoaWxkKENka1ZpcnR1YWxTY3JvbGxWaWV3cG9ydCwgeyByZWFkOiBDZGtWaXJ0dWFsU2Nyb2xsVmlld3BvcnQgfSlcbiAgY2RrVmlydHVhbFNjcm9sbFZpZXdwb3J0PzogQ2RrVmlydHVhbFNjcm9sbFZpZXdwb3J0O1xuICBoZWFkZXJTdHlsZU1hcCA9IHt9O1xuICBib2R5U3R5bGVNYXAgPSB7fTtcbiAgQElucHV0KCkgdmVydGljYWxTY3JvbGxCYXJXaWR0aCA9IDA7XG4gIG5vRGF0ZVZpcnR1YWxIZWlnaHQgPSAnMTgycHgnO1xuICBwcml2YXRlIGRhdGEkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgcHJpdmF0ZSBzY3JvbGwkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgcHJpdmF0ZSBkZXN0cm95JCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgc2V0U2Nyb2xsUG9zaXRpb25DbGFzc05hbWUoY2xlYXI6IGJvb2xlYW4gPSBmYWxzZSk6IHZvaWQge1xuICAgIGNvbnN0IHsgc2Nyb2xsV2lkdGgsIHNjcm9sbExlZnQsIGNsaWVudFdpZHRoIH0gPSB0aGlzLnRhYmxlQm9keUVsZW1lbnQubmF0aXZlRWxlbWVudDtcbiAgICBjb25zdCBsZWZ0Q2xhc3NOYW1lID0gJ2FudC10YWJsZS1waW5nLWxlZnQnO1xuICAgIGNvbnN0IHJpZ2h0Q2xhc3NOYW1lID0gJ2FudC10YWJsZS1waW5nLXJpZ2h0JztcbiAgICBpZiAoKHNjcm9sbFdpZHRoID09PSBjbGllbnRXaWR0aCAmJiBzY3JvbGxXaWR0aCAhPT0gMCkgfHwgY2xlYXIpIHtcbiAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy50YWJsZU1haW5FbGVtZW50LCBsZWZ0Q2xhc3NOYW1lKTtcbiAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2xhc3ModGhpcy50YWJsZU1haW5FbGVtZW50LCByaWdodENsYXNzTmFtZSk7XG4gICAgfSBlbHNlIGlmIChzY3JvbGxMZWZ0ID09PSAwKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZUNsYXNzKHRoaXMudGFibGVNYWluRWxlbWVudCwgbGVmdENsYXNzTmFtZSk7XG4gICAgICB0aGlzLnJlbmRlcmVyLmFkZENsYXNzKHRoaXMudGFibGVNYWluRWxlbWVudCwgcmlnaHRDbGFzc05hbWUpO1xuICAgIH0gZWxzZSBpZiAoc2Nyb2xsV2lkdGggPT09IHNjcm9sbExlZnQgKyBjbGllbnRXaWR0aCkge1xuICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDbGFzcyh0aGlzLnRhYmxlTWFpbkVsZW1lbnQsIHJpZ2h0Q2xhc3NOYW1lKTtcbiAgICAgIHRoaXMucmVuZGVyZXIuYWRkQ2xhc3ModGhpcy50YWJsZU1haW5FbGVtZW50LCBsZWZ0Q2xhc3NOYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLnRhYmxlTWFpbkVsZW1lbnQsIGxlZnRDbGFzc05hbWUpO1xuICAgICAgdGhpcy5yZW5kZXJlci5hZGRDbGFzcyh0aGlzLnRhYmxlTWFpbkVsZW1lbnQsIHJpZ2h0Q2xhc3NOYW1lKTtcbiAgICB9XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIHJlbmRlcmVyOiBSZW5kZXJlcjIsXG4gICAgcHJpdmF0ZSBuZ1pvbmU6IE5nWm9uZSxcbiAgICBwcml2YXRlIHBsYXRmb3JtOiBQbGF0Zm9ybSxcbiAgICBwcml2YXRlIHJlc2l6ZVNlcnZpY2U6IE56UmVzaXplU2VydmljZSxcbiAgICBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWZcbiAgKSB7XG4gICAgLy8gVE9ETzogbW92ZSB0byBob3N0IGFmdGVyIFZpZXcgRW5naW5lIGRlcHJlY2F0aW9uXG4gICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYW50LXRhYmxlLWNvbnRhaW5lcicpO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGNvbnN0IHsgc2Nyb2xsWCwgc2Nyb2xsWSwgZGF0YSB9ID0gY2hhbmdlcztcbiAgICBpZiAoc2Nyb2xsWCB8fCBzY3JvbGxZKSB7XG4gICAgICBjb25zdCBoYXNWZXJ0aWNhbFNjcm9sbEJhciA9IHRoaXMudmVydGljYWxTY3JvbGxCYXJXaWR0aCAhPT0gMDtcbiAgICAgIHRoaXMuaGVhZGVyU3R5bGVNYXAgPSB7XG4gICAgICAgIG92ZXJmbG93WDogJ2hpZGRlbicsXG4gICAgICAgIG92ZXJmbG93WTogdGhpcy5zY3JvbGxZICYmIGhhc1ZlcnRpY2FsU2Nyb2xsQmFyID8gJ3Njcm9sbCcgOiAnaGlkZGVuJ1xuICAgICAgfTtcbiAgICAgIHRoaXMuYm9keVN0eWxlTWFwID0ge1xuICAgICAgICBvdmVyZmxvd1k6IHRoaXMuc2Nyb2xsWSA/ICdzY3JvbGwnIDogJ2hpZGRlbicsXG4gICAgICAgIG92ZXJmbG93WDogdGhpcy5zY3JvbGxYID8gJ2F1dG8nIDogbnVsbCxcbiAgICAgICAgbWF4SGVpZ2h0OiB0aGlzLnNjcm9sbFlcbiAgICAgIH07XG4gICAgICB0aGlzLnNjcm9sbCQubmV4dCgpO1xuICAgIH1cbiAgICBpZiAoZGF0YSkge1xuICAgICAgdGhpcy5kYXRhJC5uZXh0KCk7XG4gICAgfVxuICB9XG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5wbGF0Zm9ybS5pc0Jyb3dzZXIpIHtcbiAgICAgIHRoaXMubmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+IHtcbiAgICAgICAgY29uc3Qgc2Nyb2xsRXZlbnQkID0gdGhpcy5zY3JvbGwkLnBpcGUoXG4gICAgICAgICAgc3RhcnRXaXRoKG51bGwpLFxuICAgICAgICAgIGRlbGF5KDApLFxuICAgICAgICAgIHN3aXRjaE1hcCgoKSA9PiBmcm9tRXZlbnQ8TW91c2VFdmVudD4odGhpcy50YWJsZUJvZHlFbGVtZW50Lm5hdGl2ZUVsZW1lbnQsICdzY3JvbGwnKS5waXBlKHN0YXJ0V2l0aCh0cnVlKSkpLFxuICAgICAgICAgIHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKVxuICAgICAgICApO1xuICAgICAgICBjb25zdCByZXNpemUkID0gdGhpcy5yZXNpemVTZXJ2aWNlLnN1YnNjcmliZSgpLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKTtcbiAgICAgICAgY29uc3QgZGF0YSQgPSB0aGlzLmRhdGEkLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKTtcbiAgICAgICAgY29uc3Qgc2V0Q2xhc3NOYW1lJCA9IG1lcmdlKHNjcm9sbEV2ZW50JCwgcmVzaXplJCwgZGF0YSQsIHRoaXMuc2Nyb2xsJCkucGlwZShzdGFydFdpdGgodHJ1ZSksIGRlbGF5KDApLCB0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpO1xuICAgICAgICBzZXRDbGFzc05hbWUkLnN1YnNjcmliZSgoKSA9PiB0aGlzLnNldFNjcm9sbFBvc2l0aW9uQ2xhc3NOYW1lKCkpO1xuICAgICAgICBzY3JvbGxFdmVudCRcbiAgICAgICAgICAucGlwZShmaWx0ZXIoKCkgPT4gISF0aGlzLnNjcm9sbFkpKVxuICAgICAgICAgIC5zdWJzY3JpYmUoKCkgPT4gKHRoaXMudGFibGVIZWFkZXJFbGVtZW50Lm5hdGl2ZUVsZW1lbnQuc2Nyb2xsTGVmdCA9IHRoaXMudGFibGVCb2R5RWxlbWVudC5uYXRpdmVFbGVtZW50LnNjcm9sbExlZnQpKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLnNldFNjcm9sbFBvc2l0aW9uQ2xhc3NOYW1lKHRydWUpO1xuICAgIHRoaXMuZGVzdHJveSQubmV4dCgpO1xuICAgIHRoaXMuZGVzdHJveSQuY29tcGxldGUoKTtcbiAgfVxufVxuIl19