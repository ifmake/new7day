/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { FocusTrapFactory } from '@angular/cdk/a11y';
import { OverlayRef } from '@angular/cdk/overlay';
import { CdkPortalOutlet } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, Optional, Renderer2, ViewChild } from '@angular/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { NzConfigService } from 'ng-zorro-antd/core/config';
import { nzModalAnimations } from './modal-animations';
import { BaseModalContainerComponent } from './modal-container';
import { ModalOptions } from './modal-types';
export class NzModalContainerComponent extends BaseModalContainerComponent {
    constructor(elementRef, focusTrapFactory, cdr, render, overlayRef, nzConfigService, config, document, animationType) {
        super(elementRef, focusTrapFactory, cdr, render, overlayRef, nzConfigService, config, document, animationType);
        this.config = config;
    }
}
NzModalContainerComponent.decorators = [
    { type: Component, args: [{
                selector: 'nz-modal-container',
                exportAs: 'nzModalContainer',
                template: `
    <div
      #modalElement
      role="document"
      class="ant-modal"
      (mousedown)="onMousedown()"
      [ngClass]="config.nzClassName!"
      [ngStyle]="config.nzStyle!"
      [style.width]="config?.nzWidth! | nzToCssUnit"
    >
      <div class="ant-modal-content">
        <button *ngIf="config.nzClosable" nz-modal-close (click)="onCloseClick()"></button>
        <div *ngIf="config.nzTitle" nz-modal-title></div>
        <div class="ant-modal-body" [ngStyle]="config.nzBodyStyle!">
          <ng-template cdkPortalOutlet></ng-template>
          <div *ngIf="isStringContent" [innerHTML]="config.nzContent"></div>
        </div>
        <div
          *ngIf="config.nzFooter !== null"
          nz-modal-footer
          [modalRef]="modalRef"
          (cancelTriggered)="onCloseClick()"
          (okTriggered)="onOkClick()"
        ></div>
      </div>
    </div>
  `,
                animations: [nzModalAnimations.modalContainer],
                // Using OnPush for modal caused footer can not to detect changes. we can fix it when 8.x.
                changeDetection: ChangeDetectionStrategy.Default,
                host: {
                    tabindex: '-1',
                    role: 'dialog',
                    '[class]': 'config.nzWrapClassName ? "ant-modal-wrap " + config.nzWrapClassName : "ant-modal-wrap"',
                    '[class.ant-modal-wrap-rtl]': `dir === 'rtl'`,
                    '[style.zIndex]': 'config.nzZIndex',
                    '[@.disabled]': 'config.nzNoAnimation',
                    '[@modalContainer]': 'state',
                    '(@modalContainer.start)': 'onAnimationStart($event)',
                    '(@modalContainer.done)': 'onAnimationDone($event)',
                    '(click)': 'onContainerClick($event)',
                    '(mouseup)': 'onMouseup()'
                }
            },] }
];
NzModalContainerComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: FocusTrapFactory },
    { type: ChangeDetectorRef },
    { type: Renderer2 },
    { type: OverlayRef },
    { type: NzConfigService },
    { type: ModalOptions },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [DOCUMENT,] }] },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [ANIMATION_MODULE_TYPE,] }] }
];
NzModalContainerComponent.propDecorators = {
    portalOutlet: [{ type: ViewChild, args: [CdkPortalOutlet, { static: true },] }],
    modalElementRef: [{ type: ViewChild, args: ['modalElement', { static: true },] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWwtY29udGFpbmVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9jb21wb25lbnRzL21vZGFsLyIsInNvdXJjZXMiOlsibW9kYWwtY29udGFpbmVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFDSCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNyRCxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDbEQsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHFCQUFxQixDQUFDO0FBQ3RELE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMzQyxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsaUJBQWlCLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLEVBQUUsUUFBUSxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDMUksT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sc0NBQXNDLENBQUM7QUFDN0UsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBRzVELE9BQU8sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ3ZELE9BQU8sRUFBRSwyQkFBMkIsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQ2hFLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFpRDdDLE1BQU0sT0FBTyx5QkFBMEIsU0FBUSwyQkFBMkI7SUFHeEUsWUFDRSxVQUFzQixFQUN0QixnQkFBa0MsRUFDbEMsR0FBc0IsRUFDdEIsTUFBaUIsRUFDakIsVUFBc0IsRUFDdEIsZUFBZ0MsRUFDekIsTUFBb0IsRUFDRyxRQUFtQixFQUNOLGFBQXFCO1FBRWhFLEtBQUssQ0FBQyxVQUFVLEVBQUUsZ0JBQWdCLEVBQUUsR0FBRyxFQUFFLE1BQU0sRUFBRSxVQUFVLEVBQUUsZUFBZSxFQUFFLE1BQU0sRUFBRSxRQUFRLEVBQUUsYUFBYSxDQUFDLENBQUM7UUFKeEcsV0FBTSxHQUFOLE1BQU0sQ0FBYztJQUs3QixDQUFDOzs7WUE5REYsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxvQkFBb0I7Z0JBQzlCLFFBQVEsRUFBRSxrQkFBa0I7Z0JBQzVCLFFBQVEsRUFBRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0EwQlQ7Z0JBQ0QsVUFBVSxFQUFFLENBQUMsaUJBQWlCLENBQUMsY0FBYyxDQUFDO2dCQUM5QywwRkFBMEY7Z0JBQzFGLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxPQUFPO2dCQUNoRCxJQUFJLEVBQUU7b0JBQ0osUUFBUSxFQUFFLElBQUk7b0JBQ2QsSUFBSSxFQUFFLFFBQVE7b0JBQ2QsU0FBUyxFQUFFLHdGQUF3RjtvQkFDbkcsNEJBQTRCLEVBQUUsZUFBZTtvQkFDN0MsZ0JBQWdCLEVBQUUsaUJBQWlCO29CQUNuQyxjQUFjLEVBQUUsc0JBQXNCO29CQUN0QyxtQkFBbUIsRUFBRSxPQUFPO29CQUM1Qix5QkFBeUIsRUFBRSwwQkFBMEI7b0JBQ3JELHdCQUF3QixFQUFFLHlCQUF5QjtvQkFDbkQsU0FBUyxFQUFFLDBCQUEwQjtvQkFDckMsV0FBVyxFQUFFLGFBQWE7aUJBQzNCO2FBQ0Y7OztZQXZEK0QsVUFBVTtZQUpqRSxnQkFBZ0I7WUFJUyxpQkFBaUI7WUFBMkMsU0FBUztZQUg5RixVQUFVO1lBS1YsZUFBZTtZQUtmLFlBQVk7NENBNERoQixRQUFRLFlBQUksTUFBTSxTQUFDLFFBQVE7eUNBQzNCLFFBQVEsWUFBSSxNQUFNLFNBQUMscUJBQXFCOzs7MkJBWDFDLFNBQVMsU0FBQyxlQUFlLEVBQUUsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFOzhCQUMzQyxTQUFTLFNBQUMsY0FBYyxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9naXRodWIuY29tL05HLVpPUlJPL25nLXpvcnJvLWFudGQvYmxvYi9tYXN0ZXIvTElDRU5TRVxuICovXG5pbXBvcnQgeyBGb2N1c1RyYXBGYWN0b3J5IH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHsgT3ZlcmxheVJlZiB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7IENka1BvcnRhbE91dGxldCB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wb3J0YWwnO1xuaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENoYW5nZURldGVjdG9yUmVmLCBDb21wb25lbnQsIEVsZW1lbnRSZWYsIEluamVjdCwgT3B0aW9uYWwsIFJlbmRlcmVyMiwgVmlld0NoaWxkIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBBTklNQVRJT05fTU9EVUxFX1RZUEUgfSBmcm9tICdAYW5ndWxhci9wbGF0Zm9ybS1icm93c2VyL2FuaW1hdGlvbnMnO1xuaW1wb3J0IHsgTnpDb25maWdTZXJ2aWNlIH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL2NvbmZpZyc7XG5pbXBvcnQgeyBOelNhZmVBbnkgfSBmcm9tICduZy16b3Jyby1hbnRkL2NvcmUvdHlwZXMnO1xuXG5pbXBvcnQgeyBuek1vZGFsQW5pbWF0aW9ucyB9IGZyb20gJy4vbW9kYWwtYW5pbWF0aW9ucyc7XG5pbXBvcnQgeyBCYXNlTW9kYWxDb250YWluZXJDb21wb25lbnQgfSBmcm9tICcuL21vZGFsLWNvbnRhaW5lcic7XG5pbXBvcnQgeyBNb2RhbE9wdGlvbnMgfSBmcm9tICcuL21vZGFsLXR5cGVzJztcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbnotbW9kYWwtY29udGFpbmVyJyxcbiAgZXhwb3J0QXM6ICduek1vZGFsQ29udGFpbmVyJyxcbiAgdGVtcGxhdGU6IGBcbiAgICA8ZGl2XG4gICAgICAjbW9kYWxFbGVtZW50XG4gICAgICByb2xlPVwiZG9jdW1lbnRcIlxuICAgICAgY2xhc3M9XCJhbnQtbW9kYWxcIlxuICAgICAgKG1vdXNlZG93bik9XCJvbk1vdXNlZG93bigpXCJcbiAgICAgIFtuZ0NsYXNzXT1cImNvbmZpZy5uekNsYXNzTmFtZSFcIlxuICAgICAgW25nU3R5bGVdPVwiY29uZmlnLm56U3R5bGUhXCJcbiAgICAgIFtzdHlsZS53aWR0aF09XCJjb25maWc/Lm56V2lkdGghIHwgbnpUb0Nzc1VuaXRcIlxuICAgID5cbiAgICAgIDxkaXYgY2xhc3M9XCJhbnQtbW9kYWwtY29udGVudFwiPlxuICAgICAgICA8YnV0dG9uICpuZ0lmPVwiY29uZmlnLm56Q2xvc2FibGVcIiBuei1tb2RhbC1jbG9zZSAoY2xpY2spPVwib25DbG9zZUNsaWNrKClcIj48L2J1dHRvbj5cbiAgICAgICAgPGRpdiAqbmdJZj1cImNvbmZpZy5uelRpdGxlXCIgbnotbW9kYWwtdGl0bGU+PC9kaXY+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJhbnQtbW9kYWwtYm9keVwiIFtuZ1N0eWxlXT1cImNvbmZpZy5uekJvZHlTdHlsZSFcIj5cbiAgICAgICAgICA8bmctdGVtcGxhdGUgY2RrUG9ydGFsT3V0bGV0PjwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgPGRpdiAqbmdJZj1cImlzU3RyaW5nQ29udGVudFwiIFtpbm5lckhUTUxdPVwiY29uZmlnLm56Q29udGVudFwiPjwvZGl2PlxuICAgICAgICA8L2Rpdj5cbiAgICAgICAgPGRpdlxuICAgICAgICAgICpuZ0lmPVwiY29uZmlnLm56Rm9vdGVyICE9PSBudWxsXCJcbiAgICAgICAgICBuei1tb2RhbC1mb290ZXJcbiAgICAgICAgICBbbW9kYWxSZWZdPVwibW9kYWxSZWZcIlxuICAgICAgICAgIChjYW5jZWxUcmlnZ2VyZWQpPVwib25DbG9zZUNsaWNrKClcIlxuICAgICAgICAgIChva1RyaWdnZXJlZCk9XCJvbk9rQ2xpY2soKVwiXG4gICAgICAgID48L2Rpdj5cbiAgICAgIDwvZGl2PlxuICAgIDwvZGl2PlxuICBgLFxuICBhbmltYXRpb25zOiBbbnpNb2RhbEFuaW1hdGlvbnMubW9kYWxDb250YWluZXJdLFxuICAvLyBVc2luZyBPblB1c2ggZm9yIG1vZGFsIGNhdXNlZCBmb290ZXIgY2FuIG5vdCB0byBkZXRlY3QgY2hhbmdlcy4gd2UgY2FuIGZpeCBpdCB3aGVuIDgueC5cbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5EZWZhdWx0LFxuICBob3N0OiB7XG4gICAgdGFiaW5kZXg6ICctMScsXG4gICAgcm9sZTogJ2RpYWxvZycsXG4gICAgJ1tjbGFzc10nOiAnY29uZmlnLm56V3JhcENsYXNzTmFtZSA/IFwiYW50LW1vZGFsLXdyYXAgXCIgKyBjb25maWcubnpXcmFwQ2xhc3NOYW1lIDogXCJhbnQtbW9kYWwtd3JhcFwiJyxcbiAgICAnW2NsYXNzLmFudC1tb2RhbC13cmFwLXJ0bF0nOiBgZGlyID09PSAncnRsJ2AsXG4gICAgJ1tzdHlsZS56SW5kZXhdJzogJ2NvbmZpZy5uelpJbmRleCcsXG4gICAgJ1tALmRpc2FibGVkXSc6ICdjb25maWcubnpOb0FuaW1hdGlvbicsXG4gICAgJ1tAbW9kYWxDb250YWluZXJdJzogJ3N0YXRlJyxcbiAgICAnKEBtb2RhbENvbnRhaW5lci5zdGFydCknOiAnb25BbmltYXRpb25TdGFydCgkZXZlbnQpJyxcbiAgICAnKEBtb2RhbENvbnRhaW5lci5kb25lKSc6ICdvbkFuaW1hdGlvbkRvbmUoJGV2ZW50KScsXG4gICAgJyhjbGljayknOiAnb25Db250YWluZXJDbGljaygkZXZlbnQpJyxcbiAgICAnKG1vdXNldXApJzogJ29uTW91c2V1cCgpJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE56TW9kYWxDb250YWluZXJDb21wb25lbnQgZXh0ZW5kcyBCYXNlTW9kYWxDb250YWluZXJDb21wb25lbnQge1xuICBAVmlld0NoaWxkKENka1BvcnRhbE91dGxldCwgeyBzdGF0aWM6IHRydWUgfSkgcG9ydGFsT3V0bGV0ITogQ2RrUG9ydGFsT3V0bGV0O1xuICBAVmlld0NoaWxkKCdtb2RhbEVsZW1lbnQnLCB7IHN0YXRpYzogdHJ1ZSB9KSBtb2RhbEVsZW1lbnRSZWYhOiBFbGVtZW50UmVmPEhUTUxEaXZFbGVtZW50PjtcbiAgY29uc3RydWN0b3IoXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBmb2N1c1RyYXBGYWN0b3J5OiBGb2N1c1RyYXBGYWN0b3J5LFxuICAgIGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcmVuZGVyOiBSZW5kZXJlcjIsXG4gICAgb3ZlcmxheVJlZjogT3ZlcmxheVJlZixcbiAgICBuekNvbmZpZ1NlcnZpY2U6IE56Q29uZmlnU2VydmljZSxcbiAgICBwdWJsaWMgY29uZmlnOiBNb2RhbE9wdGlvbnMsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChET0NVTUVOVCkgZG9jdW1lbnQ6IE56U2FmZUFueSxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgYW5pbWF0aW9uVHlwZTogc3RyaW5nXG4gICkge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYsIGZvY3VzVHJhcEZhY3RvcnksIGNkciwgcmVuZGVyLCBvdmVybGF5UmVmLCBuekNvbmZpZ1NlcnZpY2UsIGNvbmZpZywgZG9jdW1lbnQsIGFuaW1hdGlvblR5cGUpO1xuICB9XG59XG4iXX0=