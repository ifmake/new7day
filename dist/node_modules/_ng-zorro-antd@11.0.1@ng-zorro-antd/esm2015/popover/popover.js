/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ComponentFactoryResolver, Directive, ElementRef, EventEmitter, Host, Input, Optional, Output, Renderer2, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { zoomBigMotion } from 'ng-zorro-antd/core/animation';
import { NzNoAnimationDirective } from 'ng-zorro-antd/core/no-animation';
import { Directionality } from '@angular/cdk/bidi';
import { isTooltipEmpty, NzTooltipBaseDirective, NzToolTipComponent } from 'ng-zorro-antd/tooltip';
export class NzPopoverDirective extends NzTooltipBaseDirective {
    constructor(elementRef, hostView, resolver, renderer, noAnimation) {
        super(elementRef, hostView, resolver, renderer, noAnimation);
        this.noAnimation = noAnimation;
        this.trigger = 'hover';
        this.placement = 'top';
        // tslint:disable-next-line:no-output-rename
        this.visibleChange = new EventEmitter();
        this.componentFactory = this.resolver.resolveComponentFactory(NzPopoverComponent);
    }
}
NzPopoverDirective.decorators = [
    { type: Directive, args: [{
                selector: '[nz-popover]',
                exportAs: 'nzPopover',
                host: {
                    '[class.ant-popover-open]': 'visible'
                }
            },] }
];
NzPopoverDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: ViewContainerRef },
    { type: ComponentFactoryResolver },
    { type: Renderer2 },
    { type: NzNoAnimationDirective, decorators: [{ type: Host }, { type: Optional }] }
];
NzPopoverDirective.propDecorators = {
    title: [{ type: Input, args: ['nzPopoverTitle',] }],
    content: [{ type: Input, args: ['nzPopoverContent',] }],
    directiveTitle: [{ type: Input, args: ['nz-popover',] }],
    trigger: [{ type: Input, args: ['nzPopoverTrigger',] }],
    placement: [{ type: Input, args: ['nzPopoverPlacement',] }],
    origin: [{ type: Input, args: ['nzPopoverOrigin',] }],
    visible: [{ type: Input, args: ['nzPopoverVisible',] }],
    mouseEnterDelay: [{ type: Input, args: ['nzPopoverMouseEnterDelay',] }],
    mouseLeaveDelay: [{ type: Input, args: ['nzPopoverMouseLeaveDelay',] }],
    overlayClassName: [{ type: Input, args: ['nzPopoverOverlayClassName',] }],
    overlayStyle: [{ type: Input, args: ['nzPopoverOverlayStyle',] }],
    visibleChange: [{ type: Output, args: ['nzPopoverVisibleChange',] }]
};
export class NzPopoverComponent extends NzToolTipComponent {
    constructor(cdr, directionality, noAnimation) {
        super(cdr, directionality, noAnimation);
        this.noAnimation = noAnimation;
        this._prefix = 'ant-popover';
    }
    isEmpty() {
        return isTooltipEmpty(this.nzTitle) && isTooltipEmpty(this.nzContent);
    }
}
NzPopoverComponent.decorators = [
    { type: Component, args: [{
                selector: 'nz-popover',
                exportAs: 'nzPopoverComponent',
                animations: [zoomBigMotion],
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                preserveWhitespaces: false,
                template: `
    <ng-template
      #overlay="cdkConnectedOverlay"
      cdkConnectedOverlay
      nzConnectedOverlay
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayPositions]="_positions"
      [cdkConnectedOverlayOpen]="_visible"
      [cdkConnectedOverlayPush]="true"
      (overlayOutsideClick)="onClickOutside($event)"
      (detach)="hide()"
      (positionChange)="onPositionChange($event)"
    >
      <div
        class="ant-popover"
        [class.ant-popover-rtl]="dir === 'rtl'"
        [ngClass]="_classMap"
        [ngStyle]="nzOverlayStyle"
        [@.disabled]="noAnimation?.nzNoAnimation"
        [nzNoAnimation]="noAnimation?.nzNoAnimation"
        [@zoomBigMotion]="'active'"
      >
        <div class="ant-popover-content">
          <div class="ant-popover-arrow"></div>
          <div class="ant-popover-inner" role="tooltip">
            <div>
              <div class="ant-popover-title" *ngIf="nzTitle">
                <ng-container *nzStringTemplateOutlet="nzTitle">{{ nzTitle }}</ng-container>
              </div>
              <div class="ant-popover-inner-content">
                <ng-container *nzStringTemplateOutlet="nzContent">{{ nzContent }}</ng-container>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ng-template>
  `
            },] }
];
NzPopoverComponent.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: Directionality, decorators: [{ type: Optional }] },
    { type: NzNoAnimationDirective, decorators: [{ type: Host }, { type: Optional }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9wb3Zlci5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9jb21wb25lbnRzL3BvcG92ZXIvIiwic291cmNlcyI6WyJwb3BvdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7R0FHRztBQUVILE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFFVCx3QkFBd0IsRUFDeEIsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osSUFBSSxFQUNKLEtBQUssRUFDTCxRQUFRLEVBQ1IsTUFBTSxFQUNOLFNBQVMsRUFDVCxnQkFBZ0IsRUFDaEIsaUJBQWlCLEVBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUM3RCxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUd6RSxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDbkQsT0FBTyxFQUFFLGNBQWMsRUFBRSxzQkFBc0IsRUFBRSxrQkFBa0IsRUFBb0IsTUFBTSx1QkFBdUIsQ0FBQztBQVNySCxNQUFNLE9BQU8sa0JBQW1CLFNBQVEsc0JBQXNCO0lBa0I1RCxZQUNFLFVBQXNCLEVBQ3RCLFFBQTBCLEVBQzFCLFFBQWtDLEVBQ2xDLFFBQW1CLEVBQ1EsV0FBb0M7UUFFL0QsS0FBSyxDQUFDLFVBQVUsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLFFBQVEsRUFBRSxXQUFXLENBQUMsQ0FBQztRQUZsQyxnQkFBVyxHQUFYLFdBQVcsQ0FBeUI7UUFuQnRDLFlBQU8sR0FBc0IsT0FBTyxDQUFDO1FBQ25DLGNBQVMsR0FBdUIsS0FBSyxDQUFDO1FBUW5FLDRDQUE0QztRQUNELGtCQUFhLEdBQUcsSUFBSSxZQUFZLEVBQVcsQ0FBQztRQUV2RixxQkFBZ0IsR0FBeUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyx1QkFBdUIsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO0lBVW5ILENBQUM7OztZQWpDRixTQUFTLFNBQUM7Z0JBQ1QsUUFBUSxFQUFFLGNBQWM7Z0JBQ3hCLFFBQVEsRUFBRSxXQUFXO2dCQUNyQixJQUFJLEVBQUU7b0JBQ0osMEJBQTBCLEVBQUUsU0FBUztpQkFDdEM7YUFDRjs7O1lBdkJDLFVBQVU7WUFPVixnQkFBZ0I7WUFUaEIsd0JBQXdCO1lBUXhCLFNBQVM7WUFLRixzQkFBc0IsdUJBb0MxQixJQUFJLFlBQUksUUFBUTs7O29CQXRCbEIsS0FBSyxTQUFDLGdCQUFnQjtzQkFDdEIsS0FBSyxTQUFDLGtCQUFrQjs2QkFDeEIsS0FBSyxTQUFDLFlBQVk7c0JBQ2xCLEtBQUssU0FBQyxrQkFBa0I7d0JBQ3hCLEtBQUssU0FBQyxvQkFBb0I7cUJBQzFCLEtBQUssU0FBQyxpQkFBaUI7c0JBQ3ZCLEtBQUssU0FBQyxrQkFBa0I7OEJBQ3hCLEtBQUssU0FBQywwQkFBMEI7OEJBQ2hDLEtBQUssU0FBQywwQkFBMEI7K0JBQ2hDLEtBQUssU0FBQywyQkFBMkI7MkJBQ2pDLEtBQUssU0FBQyx1QkFBdUI7NEJBRzdCLE1BQU0sU0FBQyx3QkFBd0I7O0FBNkRsQyxNQUFNLE9BQU8sa0JBQW1CLFNBQVEsa0JBQWtCO0lBR3hELFlBQ0UsR0FBc0IsRUFDVixjQUE4QixFQUNmLFdBQW9DO1FBRS9ELEtBQUssQ0FBQyxHQUFHLEVBQUUsY0FBYyxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBRmIsZ0JBQVcsR0FBWCxXQUFXLENBQXlCO1FBTGpFLFlBQU8sR0FBRyxhQUFhLENBQUM7SUFReEIsQ0FBQztJQUNTLE9BQU87UUFDZixPQUFPLGNBQWMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksY0FBYyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztJQUN4RSxDQUFDOzs7WUExREYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxZQUFZO2dCQUN0QixRQUFRLEVBQUUsb0JBQW9CO2dCQUM5QixVQUFVLEVBQUUsQ0FBQyxhQUFhLENBQUM7Z0JBQzNCLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtnQkFDckMsbUJBQW1CLEVBQUUsS0FBSztnQkFDMUIsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBcUNUO2FBQ0Y7OztZQXZHQyxpQkFBaUI7WUFtQlYsY0FBYyx1QkEwRmxCLFFBQVE7WUE3Rkosc0JBQXNCLHVCQThGMUIsSUFBSSxZQUFJLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vZ2l0aHViLmNvbS9ORy1aT1JSTy9uZy16b3Jyby1hbnRkL2Jsb2IvbWFzdGVyL0xJQ0VOU0VcbiAqL1xuXG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgQ29tcG9uZW50RmFjdG9yeSxcbiAgQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICBEaXJlY3RpdmUsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSG9zdCxcbiAgSW5wdXQsXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFJlbmRlcmVyMixcbiAgVmlld0NvbnRhaW5lclJlZixcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyB6b29tQmlnTW90aW9uIH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL2FuaW1hdGlvbic7XG5pbXBvcnQgeyBOek5vQW5pbWF0aW9uRGlyZWN0aXZlIH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL25vLWFuaW1hdGlvbic7XG5pbXBvcnQgeyBOZ1N0eWxlSW50ZXJmYWNlLCBOelRTVHlwZSB9IGZyb20gJ25nLXpvcnJvLWFudGQvY29yZS90eXBlcyc7XG5cbmltcG9ydCB7IERpcmVjdGlvbmFsaXR5IH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHsgaXNUb29sdGlwRW1wdHksIE56VG9vbHRpcEJhc2VEaXJlY3RpdmUsIE56VG9vbFRpcENvbXBvbmVudCwgTnpUb29sdGlwVHJpZ2dlciB9IGZyb20gJ25nLXpvcnJvLWFudGQvdG9vbHRpcCc7XG5cbkBEaXJlY3RpdmUoe1xuICBzZWxlY3RvcjogJ1tuei1wb3BvdmVyXScsXG4gIGV4cG9ydEFzOiAnbnpQb3BvdmVyJyxcbiAgaG9zdDoge1xuICAgICdbY2xhc3MuYW50LXBvcG92ZXItb3Blbl0nOiAndmlzaWJsZSdcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBOelBvcG92ZXJEaXJlY3RpdmUgZXh0ZW5kcyBOelRvb2x0aXBCYXNlRGlyZWN0aXZlIHtcbiAgQElucHV0KCduelBvcG92ZXJUaXRsZScpIHRpdGxlPzogTnpUU1R5cGU7XG4gIEBJbnB1dCgnbnpQb3BvdmVyQ29udGVudCcpIGNvbnRlbnQ/OiBOelRTVHlwZTtcbiAgQElucHV0KCduei1wb3BvdmVyJykgZGlyZWN0aXZlVGl0bGU/OiBOelRTVHlwZSB8IG51bGw7XG4gIEBJbnB1dCgnbnpQb3BvdmVyVHJpZ2dlcicpIHRyaWdnZXI/OiBOelRvb2x0aXBUcmlnZ2VyID0gJ2hvdmVyJztcbiAgQElucHV0KCduelBvcG92ZXJQbGFjZW1lbnQnKSBwbGFjZW1lbnQ/OiBzdHJpbmcgfCBzdHJpbmdbXSA9ICd0b3AnO1xuICBASW5wdXQoJ256UG9wb3Zlck9yaWdpbicpIG9yaWdpbj86IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuICBASW5wdXQoJ256UG9wb3ZlclZpc2libGUnKSB2aXNpYmxlPzogYm9vbGVhbjtcbiAgQElucHV0KCduelBvcG92ZXJNb3VzZUVudGVyRGVsYXknKSBtb3VzZUVudGVyRGVsYXk/OiBudW1iZXI7XG4gIEBJbnB1dCgnbnpQb3BvdmVyTW91c2VMZWF2ZURlbGF5JykgbW91c2VMZWF2ZURlbGF5PzogbnVtYmVyO1xuICBASW5wdXQoJ256UG9wb3Zlck92ZXJsYXlDbGFzc05hbWUnKSBvdmVybGF5Q2xhc3NOYW1lPzogc3RyaW5nO1xuICBASW5wdXQoJ256UG9wb3Zlck92ZXJsYXlTdHlsZScpIG92ZXJsYXlTdHlsZT86IE5nU3R5bGVJbnRlcmZhY2U7XG5cbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOm5vLW91dHB1dC1yZW5hbWVcbiAgQE91dHB1dCgnbnpQb3BvdmVyVmlzaWJsZUNoYW5nZScpIHJlYWRvbmx5IHZpc2libGVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XG5cbiAgY29tcG9uZW50RmFjdG9yeTogQ29tcG9uZW50RmFjdG9yeTxOelBvcG92ZXJDb21wb25lbnQ+ID0gdGhpcy5yZXNvbHZlci5yZXNvbHZlQ29tcG9uZW50RmFjdG9yeShOelBvcG92ZXJDb21wb25lbnQpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgaG9zdFZpZXc6IFZpZXdDb250YWluZXJSZWYsXG4gICAgcmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcbiAgICByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIEBIb3N0KCkgQE9wdGlvbmFsKCkgcHVibGljIG5vQW5pbWF0aW9uPzogTnpOb0FuaW1hdGlvbkRpcmVjdGl2ZVxuICApIHtcbiAgICBzdXBlcihlbGVtZW50UmVmLCBob3N0VmlldywgcmVzb2x2ZXIsIHJlbmRlcmVyLCBub0FuaW1hdGlvbik7XG4gIH1cbn1cblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbnotcG9wb3ZlcicsXG4gIGV4cG9ydEFzOiAnbnpQb3BvdmVyQ29tcG9uZW50JyxcbiAgYW5pbWF0aW9uczogW3pvb21CaWdNb3Rpb25dLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgcHJlc2VydmVXaGl0ZXNwYWNlczogZmFsc2UsXG4gIHRlbXBsYXRlOiBgXG4gICAgPG5nLXRlbXBsYXRlXG4gICAgICAjb3ZlcmxheT1cImNka0Nvbm5lY3RlZE92ZXJsYXlcIlxuICAgICAgY2RrQ29ubmVjdGVkT3ZlcmxheVxuICAgICAgbnpDb25uZWN0ZWRPdmVybGF5XG4gICAgICBbY2RrQ29ubmVjdGVkT3ZlcmxheU9yaWdpbl09XCJvcmlnaW5cIlxuICAgICAgW2Nka0Nvbm5lY3RlZE92ZXJsYXlQb3NpdGlvbnNdPVwiX3Bvc2l0aW9uc1wiXG4gICAgICBbY2RrQ29ubmVjdGVkT3ZlcmxheU9wZW5dPVwiX3Zpc2libGVcIlxuICAgICAgW2Nka0Nvbm5lY3RlZE92ZXJsYXlQdXNoXT1cInRydWVcIlxuICAgICAgKG92ZXJsYXlPdXRzaWRlQ2xpY2spPVwib25DbGlja091dHNpZGUoJGV2ZW50KVwiXG4gICAgICAoZGV0YWNoKT1cImhpZGUoKVwiXG4gICAgICAocG9zaXRpb25DaGFuZ2UpPVwib25Qb3NpdGlvbkNoYW5nZSgkZXZlbnQpXCJcbiAgICA+XG4gICAgICA8ZGl2XG4gICAgICAgIGNsYXNzPVwiYW50LXBvcG92ZXJcIlxuICAgICAgICBbY2xhc3MuYW50LXBvcG92ZXItcnRsXT1cImRpciA9PT0gJ3J0bCdcIlxuICAgICAgICBbbmdDbGFzc109XCJfY2xhc3NNYXBcIlxuICAgICAgICBbbmdTdHlsZV09XCJuek92ZXJsYXlTdHlsZVwiXG4gICAgICAgIFtALmRpc2FibGVkXT1cIm5vQW5pbWF0aW9uPy5uek5vQW5pbWF0aW9uXCJcbiAgICAgICAgW256Tm9BbmltYXRpb25dPVwibm9BbmltYXRpb24/Lm56Tm9BbmltYXRpb25cIlxuICAgICAgICBbQHpvb21CaWdNb3Rpb25dPVwiJ2FjdGl2ZSdcIlxuICAgICAgPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiYW50LXBvcG92ZXItY29udGVudFwiPlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJhbnQtcG9wb3Zlci1hcnJvd1wiPjwvZGl2PlxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJhbnQtcG9wb3Zlci1pbm5lclwiIHJvbGU9XCJ0b29sdGlwXCI+XG4gICAgICAgICAgICA8ZGl2PlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYW50LXBvcG92ZXItdGl0bGVcIiAqbmdJZj1cIm56VGl0bGVcIj5cbiAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuelN0cmluZ1RlbXBsYXRlT3V0bGV0PVwibnpUaXRsZVwiPnt7IG56VGl0bGUgfX08L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhbnQtcG9wb3Zlci1pbm5lci1jb250ZW50XCI+XG4gICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbnpTdHJpbmdUZW1wbGF0ZU91dGxldD1cIm56Q29udGVudFwiPnt7IG56Q29udGVudCB9fTwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgIDwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvbmctdGVtcGxhdGU+XG4gIGBcbn0pXG5leHBvcnQgY2xhc3MgTnpQb3BvdmVyQ29tcG9uZW50IGV4dGVuZHMgTnpUb29sVGlwQ29tcG9uZW50IHtcbiAgX3ByZWZpeCA9ICdhbnQtcG9wb3Zlcic7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgY2RyOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBAT3B0aW9uYWwoKSBkaXJlY3Rpb25hbGl0eTogRGlyZWN0aW9uYWxpdHksXG4gICAgQEhvc3QoKSBAT3B0aW9uYWwoKSBwdWJsaWMgbm9BbmltYXRpb24/OiBOek5vQW5pbWF0aW9uRGlyZWN0aXZlXG4gICkge1xuICAgIHN1cGVyKGNkciwgZGlyZWN0aW9uYWxpdHksIG5vQW5pbWF0aW9uKTtcbiAgfVxuICBwcm90ZWN0ZWQgaXNFbXB0eSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gaXNUb29sdGlwRW1wdHkodGhpcy5uelRpdGxlKSAmJiBpc1Rvb2x0aXBFbXB0eSh0aGlzLm56Q29udGVudCk7XG4gIH1cbn1cbiJdfQ==