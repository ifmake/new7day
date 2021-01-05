/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { ChangeDetectionStrategy, Component, ElementRef, Renderer2, ViewChild, ViewEncapsulation } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NzTableStyleService } from '../table-style.service';
export class NzTableFixedRowComponent {
    constructor(nzTableStyleService, renderer) {
        this.nzTableStyleService = nzTableStyleService;
        this.renderer = renderer;
        this.hostWidth$ = new BehaviorSubject(null);
        this.enableAutoMeasure$ = new BehaviorSubject(false);
        this.destroy$ = new Subject();
    }
    ngOnInit() {
        if (this.nzTableStyleService) {
            const { enableAutoMeasure$, hostWidth$ } = this.nzTableStyleService;
            enableAutoMeasure$.subscribe(this.enableAutoMeasure$);
            hostWidth$.subscribe(this.hostWidth$);
        }
    }
    ngAfterViewInit() {
        this.nzTableStyleService.columnCount$.pipe(takeUntil(this.destroy$)).subscribe(count => {
            this.renderer.setAttribute(this.tdElement.nativeElement, 'colspan', `${count}`);
        });
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
NzTableFixedRowComponent.decorators = [
    { type: Component, args: [{
                selector: 'tr[nz-table-fixed-row], tr[nzExpand]',
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                template: `
    <td class="nz-disable-td ant-table-cell" #tdElement>
      <div
        class="ant-table-expanded-row-fixed"
        *ngIf="enableAutoMeasure$ | async; else contentTemplate"
        style="position: sticky; left: 0px; overflow: hidden;"
        [style.width.px]="hostWidth$ | async"
      >
        <ng-template [ngTemplateOutlet]="contentTemplate"></ng-template>
      </div>
    </td>
    <ng-template #contentTemplate><ng-content></ng-content></ng-template>
  `
            },] }
];
NzTableFixedRowComponent.ctorParameters = () => [
    { type: NzTableStyleService },
    { type: Renderer2 }
];
NzTableFixedRowComponent.propDecorators = {
    tdElement: [{ type: ViewChild, args: ['tdElement',] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtZml4ZWQtcm93LmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9jb21wb25lbnRzL3RhYmxlLyIsInNvdXJjZXMiOlsic3JjL3RhYmxlL3RhYmxlLWZpeGVkLXJvdy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHO0FBRUgsT0FBTyxFQUVMLHVCQUF1QixFQUN2QixTQUFTLEVBQ1QsVUFBVSxFQUdWLFNBQVMsRUFDVCxTQUFTLEVBQ1QsaUJBQWlCLEVBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxlQUFlLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQ2hELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUMzQyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQW9CN0QsTUFBTSxPQUFPLHdCQUF3QjtJQUtuQyxZQUFvQixtQkFBd0MsRUFBVSxRQUFtQjtRQUFyRSx3QkFBbUIsR0FBbkIsbUJBQW1CLENBQXFCO1FBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBVztRQUh6RixlQUFVLEdBQUcsSUFBSSxlQUFlLENBQWdCLElBQUksQ0FBQyxDQUFDO1FBQ3RELHVCQUFrQixHQUFHLElBQUksZUFBZSxDQUFVLEtBQUssQ0FBQyxDQUFDO1FBQ2pELGFBQVEsR0FBRyxJQUFJLE9BQU8sRUFBRSxDQUFDO0lBQzJELENBQUM7SUFDN0YsUUFBUTtRQUNOLElBQUksSUFBSSxDQUFDLG1CQUFtQixFQUFFO1lBQzVCLE1BQU0sRUFBRSxrQkFBa0IsRUFBRSxVQUFVLEVBQUUsR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUM7WUFDcEUsa0JBQWtCLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1lBQ3RELFVBQVUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1NBQ3ZDO0lBQ0gsQ0FBQztJQUNELGVBQWU7UUFDYixJQUFJLENBQUMsbUJBQW1CLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ3JGLElBQUksQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsYUFBYSxFQUFFLFNBQVMsRUFBRSxHQUFHLEtBQUssRUFBRSxDQUFDLENBQUM7UUFDbEYsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBQ0QsV0FBVztRQUNULElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDckIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUMzQixDQUFDOzs7WUF2Q0YsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxzQ0FBc0M7Z0JBQ2hELGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtnQkFDckMsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7R0FZVDthQUNGOzs7WUFuQlEsbUJBQW1CO1lBTjFCLFNBQVM7Ozt3QkEyQlIsU0FBUyxTQUFDLFdBQVciLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vZ2l0aHViLmNvbS9ORy1aT1JSTy9uZy16b3Jyby1hbnRkL2Jsb2IvbWFzdGVyL0xJQ0VOU0VcbiAqL1xuXG5pbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ29tcG9uZW50LFxuICBFbGVtZW50UmVmLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgUmVuZGVyZXIyLFxuICBWaWV3Q2hpbGQsXG4gIFZpZXdFbmNhcHN1bGF0aW9uXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBOelRhYmxlU3R5bGVTZXJ2aWNlIH0gZnJvbSAnLi4vdGFibGUtc3R5bGUuc2VydmljZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ3RyW256LXRhYmxlLWZpeGVkLXJvd10sIHRyW256RXhwYW5kXScsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICB0ZW1wbGF0ZTogYFxuICAgIDx0ZCBjbGFzcz1cIm56LWRpc2FibGUtdGQgYW50LXRhYmxlLWNlbGxcIiAjdGRFbGVtZW50PlxuICAgICAgPGRpdlxuICAgICAgICBjbGFzcz1cImFudC10YWJsZS1leHBhbmRlZC1yb3ctZml4ZWRcIlxuICAgICAgICAqbmdJZj1cImVuYWJsZUF1dG9NZWFzdXJlJCB8IGFzeW5jOyBlbHNlIGNvbnRlbnRUZW1wbGF0ZVwiXG4gICAgICAgIHN0eWxlPVwicG9zaXRpb246IHN0aWNreTsgbGVmdDogMHB4OyBvdmVyZmxvdzogaGlkZGVuO1wiXG4gICAgICAgIFtzdHlsZS53aWR0aC5weF09XCJob3N0V2lkdGgkIHwgYXN5bmNcIlxuICAgICAgPlxuICAgICAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwiY29udGVudFRlbXBsYXRlXCI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgIDwvZGl2PlxuICAgIDwvdGQ+XG4gICAgPG5nLXRlbXBsYXRlICNjb250ZW50VGVtcGxhdGU+PG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PjwvbmctdGVtcGxhdGU+XG4gIGBcbn0pXG5leHBvcnQgY2xhc3MgTnpUYWJsZUZpeGVkUm93Q29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3ksIEFmdGVyVmlld0luaXQge1xuICBAVmlld0NoaWxkKCd0ZEVsZW1lbnQnKSB0ZEVsZW1lbnQhOiBFbGVtZW50UmVmO1xuICBob3N0V2lkdGgkID0gbmV3IEJlaGF2aW9yU3ViamVjdDxudW1iZXIgfCBudWxsPihudWxsKTtcbiAgZW5hYmxlQXV0b01lYXN1cmUkID0gbmV3IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPihmYWxzZSk7XG4gIHByaXZhdGUgZGVzdHJveSQgPSBuZXcgU3ViamVjdCgpO1xuICBjb25zdHJ1Y3Rvcihwcml2YXRlIG56VGFibGVTdHlsZVNlcnZpY2U6IE56VGFibGVTdHlsZVNlcnZpY2UsIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMikge31cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMubnpUYWJsZVN0eWxlU2VydmljZSkge1xuICAgICAgY29uc3QgeyBlbmFibGVBdXRvTWVhc3VyZSQsIGhvc3RXaWR0aCQgfSA9IHRoaXMubnpUYWJsZVN0eWxlU2VydmljZTtcbiAgICAgIGVuYWJsZUF1dG9NZWFzdXJlJC5zdWJzY3JpYmUodGhpcy5lbmFibGVBdXRvTWVhc3VyZSQpO1xuICAgICAgaG9zdFdpZHRoJC5zdWJzY3JpYmUodGhpcy5ob3N0V2lkdGgkKTtcbiAgICB9XG4gIH1cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIHRoaXMubnpUYWJsZVN0eWxlU2VydmljZS5jb2x1bW5Db3VudCQucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpLnN1YnNjcmliZShjb3VudCA9PiB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnNldEF0dHJpYnV0ZSh0aGlzLnRkRWxlbWVudC5uYXRpdmVFbGVtZW50LCAnY29sc3BhbicsIGAke2NvdW50fWApO1xuICAgIH0pO1xuICB9XG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuZGVzdHJveSQubmV4dCgpO1xuICAgIHRoaXMuZGVzdHJveSQuY29tcGxldGUoKTtcbiAgfVxufVxuIl19