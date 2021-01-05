/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewEncapsulation } from '@angular/core';
export class NzTableInnerDefaultComponent {
    constructor(elementRef) {
        this.elementRef = elementRef;
        this.tableLayout = 'auto';
        this.listOfColWidth = [];
        this.theadTemplate = null;
        this.contentTemplate = null;
        // TODO: move to host after View Engine deprecation
        this.elementRef.nativeElement.classList.add('ant-table-container');
    }
}
NzTableInnerDefaultComponent.decorators = [
    { type: Component, args: [{
                selector: 'nz-table-inner-default',
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                template: `
    <div class="ant-table-content">
      <table
        nz-table-content
        [contentTemplate]="contentTemplate"
        [tableLayout]="tableLayout"
        [listOfColWidth]="listOfColWidth"
        [theadTemplate]="theadTemplate"
      ></table>
    </div>
  `
            },] }
];
NzTableInnerDefaultComponent.ctorParameters = () => [
    { type: ElementRef }
];
NzTableInnerDefaultComponent.propDecorators = {
    tableLayout: [{ type: Input }],
    listOfColWidth: [{ type: Input }],
    theadTemplate: [{ type: Input }],
    contentTemplate: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidGFibGUtaW5uZXItZGVmYXVsdC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vY29tcG9uZW50cy90YWJsZS8iLCJzb3VyY2VzIjpbInNyYy90YWJsZS90YWJsZS1pbm5lci1kZWZhdWx0LmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxLQUFLLEVBQWUsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFvQnRILE1BQU0sT0FBTyw0QkFBNEI7SUFNdkMsWUFBb0IsVUFBc0I7UUFBdEIsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUxqQyxnQkFBVyxHQUFrQixNQUFNLENBQUM7UUFDcEMsbUJBQWMsR0FBeUIsRUFBRSxDQUFDO1FBQzFDLGtCQUFhLEdBQWtDLElBQUksQ0FBQztRQUNwRCxvQkFBZSxHQUFrQyxJQUFJLENBQUM7UUFHN0QsbURBQW1EO1FBQ25ELElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQztJQUNyRSxDQUFDOzs7WUF6QkYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSx3QkFBd0I7Z0JBQ2xDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtnQkFDckMsUUFBUSxFQUFFOzs7Ozs7Ozs7O0dBVVQ7YUFDRjs7O1lBbkI0QyxVQUFVOzs7MEJBcUJwRCxLQUFLOzZCQUNMLEtBQUs7NEJBQ0wsS0FBSzs4QkFDTCxLQUFLIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2dpdGh1Yi5jb20vTkctWk9SUk8vbmctem9ycm8tYW50ZC9ibG9iL21hc3Rlci9MSUNFTlNFXG4gKi9cblxuaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgRWxlbWVudFJlZiwgSW5wdXQsIFRlbXBsYXRlUmVmLCBWaWV3RW5jYXBzdWxhdGlvbiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTnpTYWZlQW55IH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL3R5cGVzJztcbmltcG9ydCB7IE56VGFibGVMYXlvdXQgfSBmcm9tICcuLi90YWJsZS50eXBlcyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ256LXRhYmxlLWlubmVyLWRlZmF1bHQnLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2IGNsYXNzPVwiYW50LXRhYmxlLWNvbnRlbnRcIj5cbiAgICAgIDx0YWJsZVxuICAgICAgICBuei10YWJsZS1jb250ZW50XG4gICAgICAgIFtjb250ZW50VGVtcGxhdGVdPVwiY29udGVudFRlbXBsYXRlXCJcbiAgICAgICAgW3RhYmxlTGF5b3V0XT1cInRhYmxlTGF5b3V0XCJcbiAgICAgICAgW2xpc3RPZkNvbFdpZHRoXT1cImxpc3RPZkNvbFdpZHRoXCJcbiAgICAgICAgW3RoZWFkVGVtcGxhdGVdPVwidGhlYWRUZW1wbGF0ZVwiXG4gICAgICA+PC90YWJsZT5cbiAgICA8L2Rpdj5cbiAgYFxufSlcbmV4cG9ydCBjbGFzcyBOelRhYmxlSW5uZXJEZWZhdWx0Q29tcG9uZW50IHtcbiAgQElucHV0KCkgdGFibGVMYXlvdXQ6IE56VGFibGVMYXlvdXQgPSAnYXV0byc7XG4gIEBJbnB1dCgpIGxpc3RPZkNvbFdpZHRoOiBBcnJheTxzdHJpbmcgfCBudWxsPiA9IFtdO1xuICBASW5wdXQoKSB0aGVhZFRlbXBsYXRlOiBUZW1wbGF0ZVJlZjxOelNhZmVBbnk+IHwgbnVsbCA9IG51bGw7XG4gIEBJbnB1dCgpIGNvbnRlbnRUZW1wbGF0ZTogVGVtcGxhdGVSZWY8TnpTYWZlQW55PiB8IG51bGwgPSBudWxsO1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZikge1xuICAgIC8vIFRPRE86IG1vdmUgdG8gaG9zdCBhZnRlciBWaWV3IEVuZ2luZSBkZXByZWNhdGlvblxuICAgIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LmNsYXNzTGlzdC5hZGQoJ2FudC10YWJsZS1jb250YWluZXInKTtcbiAgfVxufVxuIl19