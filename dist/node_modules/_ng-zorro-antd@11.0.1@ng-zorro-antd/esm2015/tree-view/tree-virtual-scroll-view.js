/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { CdkTree, CdkTreeNodeOutletContext } from '@angular/cdk/tree';
import { ChangeDetectionStrategy, Component, Input, ViewChild, ViewEncapsulation } from '@angular/core';
import { NzTreeNodeOutletDirective } from './outlet';
import { NzTreeView } from './tree';
export class NzTreeVirtualScrollViewComponent extends NzTreeView {
    constructor() {
        super(...arguments);
        this.nzNodeWidth = 28;
        this.nzMinBufferPx = 28 * 5;
        this.nzMaxBufferPx = 28 * 10;
        this.nodes = [];
    }
    renderNodeChanges(data) {
        this.nodes = new Array(...data).map((n, i) => this.createNode(n, i));
    }
    createNode(nodeData, index) {
        const node = this._getNodeDef(nodeData, index);
        const context = new CdkTreeNodeOutletContext(nodeData);
        if (this.treeControl.getLevel) {
            context.level = this.treeControl.getLevel(nodeData);
        }
        else {
            context.level = 0;
        }
        return {
            data: nodeData,
            context,
            nodeDef: node
        };
    }
}
NzTreeVirtualScrollViewComponent.decorators = [
    { type: Component, args: [{
                selector: 'nz-tree-virtual-scroll-view',
                exportAs: 'nzTreeVirtualScrollView',
                template: `
    <div class="ant-tree-list">
      <cdk-virtual-scroll-viewport
        class="ant-tree-list-holder"
        [itemSize]="nzNodeWidth"
        [minBufferPx]="nzMinBufferPx"
        [maxBufferPx]="nzMaxBufferPx"
      >
        <ng-container *cdkVirtualFor="let item of nodes; let i = index">
          <ng-template nzTreeVirtualScrollNodeOutlet [data]="item"></ng-template>
        </ng-container>
      </cdk-virtual-scroll-viewport>
    </div>
    <ng-container nzTreeNodeOutlet></ng-container>
  `,
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                providers: [
                    { provide: NzTreeView, useExisting: NzTreeVirtualScrollViewComponent },
                    { provide: CdkTree, useExisting: NzTreeVirtualScrollViewComponent }
                ],
                host: {
                    class: 'ant-tree',
                    '[class.ant-tree-block-node]': 'nzDirectoryTree || nzBlockNode',
                    '[class.ant-tree-directory]': 'nzDirectoryTree',
                    '[class.ant-tree-rtl]': `dir === 'rtl'`
                }
            },] }
];
NzTreeVirtualScrollViewComponent.propDecorators = {
    nodeOutlet: [{ type: ViewChild, args: [NzTreeNodeOutletDirective, { static: true },] }],
    virtualScrollViewport: [{ type: ViewChild, args: [CdkVirtualScrollViewport, { static: true },] }],
    nzNodeWidth: [{ type: Input }],
    nzMinBufferPx: [{ type: Input }],
    nzMaxBufferPx: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHJlZS12aXJ0dWFsLXNjcm9sbC12aWV3LmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uL2NvbXBvbmVudHMvdHJlZS12aWV3LyIsInNvdXJjZXMiOlsidHJlZS12aXJ0dWFsLXNjcm9sbC12aWV3LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7R0FHRztBQUVILE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLHdCQUF3QixDQUFDO0FBQ2xFLE9BQU8sRUFBRSxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUN0RSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFHeEcsT0FBTyxFQUFFLHlCQUF5QixFQUFFLE1BQU0sVUFBVSxDQUFDO0FBRXJELE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxRQUFRLENBQUM7QUFpQ3BDLE1BQU0sT0FBTyxnQ0FBb0MsU0FBUSxVQUFhO0lBL0J0RTs7UUFtQ1csZ0JBQVcsR0FBRyxFQUFFLENBQUM7UUFDakIsa0JBQWEsR0FBRyxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZCLGtCQUFhLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQztRQUVqQyxVQUFLLEdBQW9DLEVBQUUsQ0FBQztJQW9COUMsQ0FBQztJQWxCQyxpQkFBaUIsQ0FBQyxJQUE0QjtRQUM1QyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksS0FBSyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQztJQUN2RSxDQUFDO0lBRU8sVUFBVSxDQUFDLFFBQVcsRUFBRSxLQUFhO1FBQzNDLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxFQUFFLEtBQUssQ0FBQyxDQUFDO1FBQy9DLE1BQU0sT0FBTyxHQUFHLElBQUksd0JBQXdCLENBQUksUUFBUSxDQUFDLENBQUM7UUFDMUQsSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLFFBQVEsRUFBRTtZQUM3QixPQUFPLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1NBQ3JEO2FBQU07WUFDTCxPQUFPLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztTQUNuQjtRQUNELE9BQU87WUFDTCxJQUFJLEVBQUUsUUFBUTtZQUNkLE9BQU87WUFDUCxPQUFPLEVBQUUsSUFBSTtTQUNkLENBQUM7SUFDSixDQUFDOzs7WUExREYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSw2QkFBNkI7Z0JBQ3ZDLFFBQVEsRUFBRSx5QkFBeUI7Z0JBQ25DLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7R0FjVDtnQkFDRCxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtnQkFDckMsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLFNBQVMsRUFBRTtvQkFDVCxFQUFFLE9BQU8sRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFFLGdDQUFnQyxFQUFFO29CQUN0RSxFQUFFLE9BQU8sRUFBRSxPQUFPLEVBQUUsV0FBVyxFQUFFLGdDQUFnQyxFQUFFO2lCQUNwRTtnQkFDRCxJQUFJLEVBQUU7b0JBQ0osS0FBSyxFQUFFLFVBQVU7b0JBQ2pCLDZCQUE2QixFQUFFLGdDQUFnQztvQkFDL0QsNEJBQTRCLEVBQUUsaUJBQWlCO29CQUMvQyxzQkFBc0IsRUFBRSxlQUFlO2lCQUN4QzthQUNGOzs7eUJBRUUsU0FBUyxTQUFDLHlCQUF5QixFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTtvQ0FDckQsU0FBUyxTQUFDLHdCQUF3QixFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTswQkFFcEQsS0FBSzs0QkFDTCxLQUFLOzRCQUNMLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vZ2l0aHViLmNvbS9ORy1aT1JSTy9uZy16b3Jyby1hbnRkL2Jsb2IvbWFzdGVyL0xJQ0VOU0VcbiAqL1xuXG5pbXBvcnQgeyBDZGtWaXJ0dWFsU2Nyb2xsVmlld3BvcnQgfSBmcm9tICdAYW5ndWxhci9jZGsvc2Nyb2xsaW5nJztcbmltcG9ydCB7IENka1RyZWUsIENka1RyZWVOb2RlT3V0bGV0Q29udGV4dCB9IGZyb20gJ0Bhbmd1bGFyL2Nkay90cmVlJztcbmltcG9ydCB7IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIElucHV0LCBWaWV3Q2hpbGQsIFZpZXdFbmNhcHN1bGF0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7IE56VHJlZVZpcnR1YWxOb2RlRGF0YSB9IGZyb20gJy4vbm9kZSc7XG5pbXBvcnQgeyBOelRyZWVOb2RlT3V0bGV0RGlyZWN0aXZlIH0gZnJvbSAnLi9vdXRsZXQnO1xuXG5pbXBvcnQgeyBOelRyZWVWaWV3IH0gZnJvbSAnLi90cmVlJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbnotdHJlZS12aXJ0dWFsLXNjcm9sbC12aWV3JyxcbiAgZXhwb3J0QXM6ICduelRyZWVWaXJ0dWFsU2Nyb2xsVmlldycsXG4gIHRlbXBsYXRlOiBgXG4gICAgPGRpdiBjbGFzcz1cImFudC10cmVlLWxpc3RcIj5cbiAgICAgIDxjZGstdmlydHVhbC1zY3JvbGwtdmlld3BvcnRcbiAgICAgICAgY2xhc3M9XCJhbnQtdHJlZS1saXN0LWhvbGRlclwiXG4gICAgICAgIFtpdGVtU2l6ZV09XCJuek5vZGVXaWR0aFwiXG4gICAgICAgIFttaW5CdWZmZXJQeF09XCJuek1pbkJ1ZmZlclB4XCJcbiAgICAgICAgW21heEJ1ZmZlclB4XT1cIm56TWF4QnVmZmVyUHhcIlxuICAgICAgPlxuICAgICAgICA8bmctY29udGFpbmVyICpjZGtWaXJ0dWFsRm9yPVwibGV0IGl0ZW0gb2Ygbm9kZXM7IGxldCBpID0gaW5kZXhcIj5cbiAgICAgICAgICA8bmctdGVtcGxhdGUgbnpUcmVlVmlydHVhbFNjcm9sbE5vZGVPdXRsZXQgW2RhdGFdPVwiaXRlbVwiPjwvbmctdGVtcGxhdGU+XG4gICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgPC9jZGstdmlydHVhbC1zY3JvbGwtdmlld3BvcnQ+XG4gICAgPC9kaXY+XG4gICAgPG5nLWNvbnRhaW5lciBuelRyZWVOb2RlT3V0bGV0PjwvbmctY29udGFpbmVyPlxuICBgLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgcHJvdmlkZXJzOiBbXG4gICAgeyBwcm92aWRlOiBOelRyZWVWaWV3LCB1c2VFeGlzdGluZzogTnpUcmVlVmlydHVhbFNjcm9sbFZpZXdDb21wb25lbnQgfSxcbiAgICB7IHByb3ZpZGU6IENka1RyZWUsIHVzZUV4aXN0aW5nOiBOelRyZWVWaXJ0dWFsU2Nyb2xsVmlld0NvbXBvbmVudCB9XG4gIF0sXG4gIGhvc3Q6IHtcbiAgICBjbGFzczogJ2FudC10cmVlJyxcbiAgICAnW2NsYXNzLmFudC10cmVlLWJsb2NrLW5vZGVdJzogJ256RGlyZWN0b3J5VHJlZSB8fCBuekJsb2NrTm9kZScsXG4gICAgJ1tjbGFzcy5hbnQtdHJlZS1kaXJlY3RvcnldJzogJ256RGlyZWN0b3J5VHJlZScsXG4gICAgJ1tjbGFzcy5hbnQtdHJlZS1ydGxdJzogYGRpciA9PT0gJ3J0bCdgXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgTnpUcmVlVmlydHVhbFNjcm9sbFZpZXdDb21wb25lbnQ8VD4gZXh0ZW5kcyBOelRyZWVWaWV3PFQ+IHtcbiAgQFZpZXdDaGlsZChOelRyZWVOb2RlT3V0bGV0RGlyZWN0aXZlLCB7IHN0YXRpYzogdHJ1ZSB9KSByZWFkb25seSBub2RlT3V0bGV0ITogTnpUcmVlTm9kZU91dGxldERpcmVjdGl2ZTtcbiAgQFZpZXdDaGlsZChDZGtWaXJ0dWFsU2Nyb2xsVmlld3BvcnQsIHsgc3RhdGljOiB0cnVlIH0pIHJlYWRvbmx5IHZpcnR1YWxTY3JvbGxWaWV3cG9ydCE6IENka1ZpcnR1YWxTY3JvbGxWaWV3cG9ydDtcblxuICBASW5wdXQoKSBuek5vZGVXaWR0aCA9IDI4O1xuICBASW5wdXQoKSBuek1pbkJ1ZmZlclB4ID0gMjggKiA1O1xuICBASW5wdXQoKSBuek1heEJ1ZmZlclB4ID0gMjggKiAxMDtcblxuICBub2RlczogQXJyYXk8TnpUcmVlVmlydHVhbE5vZGVEYXRhPFQ+PiA9IFtdO1xuXG4gIHJlbmRlck5vZGVDaGFuZ2VzKGRhdGE6IFRbXSB8IFJlYWRvbmx5QXJyYXk8VD4pOiB2b2lkIHtcbiAgICB0aGlzLm5vZGVzID0gbmV3IEFycmF5KC4uLmRhdGEpLm1hcCgobiwgaSkgPT4gdGhpcy5jcmVhdGVOb2RlKG4sIGkpKTtcbiAgfVxuXG4gIHByaXZhdGUgY3JlYXRlTm9kZShub2RlRGF0YTogVCwgaW5kZXg6IG51bWJlcik6IE56VHJlZVZpcnR1YWxOb2RlRGF0YTxUPiB7XG4gICAgY29uc3Qgbm9kZSA9IHRoaXMuX2dldE5vZGVEZWYobm9kZURhdGEsIGluZGV4KTtcbiAgICBjb25zdCBjb250ZXh0ID0gbmV3IENka1RyZWVOb2RlT3V0bGV0Q29udGV4dDxUPihub2RlRGF0YSk7XG4gICAgaWYgKHRoaXMudHJlZUNvbnRyb2wuZ2V0TGV2ZWwpIHtcbiAgICAgIGNvbnRleHQubGV2ZWwgPSB0aGlzLnRyZWVDb250cm9sLmdldExldmVsKG5vZGVEYXRhKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29udGV4dC5sZXZlbCA9IDA7XG4gICAgfVxuICAgIHJldHVybiB7XG4gICAgICBkYXRhOiBub2RlRGF0YSxcbiAgICAgIGNvbnRleHQsXG4gICAgICBub2RlRGVmOiBub2RlXG4gICAgfTtcbiAgfVxufVxuIl19