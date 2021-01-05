/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { FocusTrapFactory } from '@angular/cdk/a11y';
import { OverlayRef } from '@angular/cdk/overlay';
import { CdkPortalOutlet } from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Optional, Output, Renderer2, ViewChild } from '@angular/core';
import { ANIMATION_MODULE_TYPE } from '@angular/platform-browser/animations';
import { NzConfigService } from 'ng-zorro-antd/core/config';
import { NzI18nService } from 'ng-zorro-antd/i18n';
import { takeUntil } from 'rxjs/operators';
import { nzModalAnimations } from './modal-animations';
import { BaseModalContainerComponent } from './modal-container';
import { ModalOptions } from './modal-types';
export class NzModalConfirmContainerComponent extends BaseModalContainerComponent {
    constructor(i18n, elementRef, focusTrapFactory, cdr, render, overlayRef, nzConfigService, config, document, animationType) {
        super(elementRef, focusTrapFactory, cdr, render, overlayRef, nzConfigService, config, document, animationType);
        this.i18n = i18n;
        this.config = config;
        this.cancelTriggered = new EventEmitter();
        this.okTriggered = new EventEmitter();
        this.i18n.localeChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.locale = this.i18n.getLocaleData('Modal');
        });
    }
    onCancel() {
        this.cancelTriggered.emit();
    }
    onOk() {
        this.okTriggered.emit();
    }
}
NzModalConfirmContainerComponent.decorators = [
    { type: Component, args: [{
                selector: 'nz-modal-confirm-container',
                exportAs: 'nzModalConfirmContainer',
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
        <div class="ant-modal-body" [ngStyle]="config.nzBodyStyle!">
          <div class="ant-modal-confirm-body-wrapper">
            <div class="ant-modal-confirm-body">
              <i nz-icon [nzType]="config.nzIconType!"></i>
              <span class="ant-modal-confirm-title">
                <ng-container *nzStringTemplateOutlet="config.nzTitle">
                  <span [innerHTML]="config.nzTitle"></span>
                </ng-container>
              </span>
              <div class="ant-modal-confirm-content">
                <ng-template cdkPortalOutlet></ng-template>
                <div *ngIf="isStringContent" [innerHTML]="config.nzContent"></div>
              </div>
            </div>
            <div class="ant-modal-confirm-btns">
              <button
                *ngIf="config.nzCancelText !== null"
                [attr.cdkFocusInitial]="config.nzAutofocus === 'cancel' || null"
                nz-button
                (click)="onCancel()"
                [nzLoading]="!!config.nzCancelLoading"
                [disabled]="config.nzCancelDisabled"
              >
                {{ config.nzCancelText || locale.cancelText }}
              </button>
              <button
                *ngIf="config.nzOkText !== null"
                [attr.cdkFocusInitial]="config.nzAutofocus === 'ok' || null"
                nz-button
                [nzType]="config.nzOkType!"
                (click)="onOk()"
                [nzLoading]="!!config.nzOkLoading"
                [disabled]="config.nzOkDisabled"
                [nzDanger]="config.nzOkDanger"
              >
                {{ config.nzOkText || locale.okText }}
              </button>
            </div>
          </div>
        </div>
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
NzModalConfirmContainerComponent.ctorParameters = () => [
    { type: NzI18nService },
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
NzModalConfirmContainerComponent.propDecorators = {
    portalOutlet: [{ type: ViewChild, args: [CdkPortalOutlet, { static: true },] }],
    modalElementRef: [{ type: ViewChild, args: ['modalElement', { static: true },] }],
    cancelTriggered: [{ type: Output }],
    okTriggered: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWwtY29uZmlybS1jb250YWluZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uL2NvbXBvbmVudHMvbW9kYWwvIiwic291cmNlcyI6WyJtb2RhbC1jb25maXJtLWNvbnRhaW5lci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHO0FBRUgsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDckQsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUN0RCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osTUFBTSxFQUNOLFFBQVEsRUFDUixNQUFNLEVBQ04sU0FBUyxFQUNULFNBQVMsRUFDVixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUM3RSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFHNUQsT0FBTyxFQUFFLGFBQWEsRUFBd0IsTUFBTSxvQkFBb0IsQ0FBQztBQUV6RSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFM0MsT0FBTyxFQUFFLGlCQUFpQixFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDdkQsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDaEUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGVBQWUsQ0FBQztBQTZFN0MsTUFBTSxPQUFPLGdDQUFpQyxTQUFRLDJCQUEyQjtJQU8vRSxZQUNVLElBQW1CLEVBQzNCLFVBQXNCLEVBQ3RCLGdCQUFrQyxFQUNsQyxHQUFzQixFQUN0QixNQUFpQixFQUNqQixVQUFzQixFQUN0QixlQUFnQyxFQUN6QixNQUFvQixFQUNHLFFBQW1CLEVBQ04sYUFBcUI7UUFFaEUsS0FBSyxDQUFDLFVBQVUsRUFBRSxnQkFBZ0IsRUFBRSxHQUFHLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxlQUFlLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxhQUFhLENBQUMsQ0FBQztRQVh2RyxTQUFJLEdBQUosSUFBSSxDQUFlO1FBT3BCLFdBQU0sR0FBTixNQUFNLENBQWM7UUFaVixvQkFBZSxHQUFHLElBQUksWUFBWSxFQUFRLENBQUM7UUFDM0MsZ0JBQVcsR0FBRyxJQUFJLFlBQVksRUFBUSxDQUFDO1FBZ0J4RCxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUU7WUFDbkUsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNqRCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxRQUFRO1FBQ04sSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUM5QixDQUFDO0lBRUQsSUFBSTtRQUNGLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDMUIsQ0FBQzs7O1lBMUdGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsNEJBQTRCO2dCQUN0QyxRQUFRLEVBQUUseUJBQXlCO2dCQUNuQyxRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXNEVDtnQkFDRCxVQUFVLEVBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxjQUFjLENBQUM7Z0JBQzlDLDBGQUEwRjtnQkFDMUYsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE9BQU87Z0JBQ2hELElBQUksRUFBRTtvQkFDSixRQUFRLEVBQUUsSUFBSTtvQkFDZCxJQUFJLEVBQUUsUUFBUTtvQkFDZCxTQUFTLEVBQUUsd0ZBQXdGO29CQUNuRyw0QkFBNEIsRUFBRSxlQUFlO29CQUM3QyxnQkFBZ0IsRUFBRSxpQkFBaUI7b0JBQ25DLGNBQWMsRUFBRSxzQkFBc0I7b0JBQ3RDLG1CQUFtQixFQUFFLE9BQU87b0JBQzVCLHlCQUF5QixFQUFFLDBCQUEwQjtvQkFDckQsd0JBQXdCLEVBQUUseUJBQXlCO29CQUNuRCxTQUFTLEVBQUUsMEJBQTBCO29CQUNyQyxXQUFXLEVBQUUsYUFBYTtpQkFDM0I7YUFDRjs7O1lBbEZRLGFBQWE7WUFacEIsVUFBVTtZQVJILGdCQUFnQjtZQU12QixpQkFBaUI7WUFPakIsU0FBUztZQVpGLFVBQVU7WUFnQlYsZUFBZTtZQVNmLFlBQVk7NENBNkZoQixRQUFRLFlBQUksTUFBTSxTQUFDLFFBQVE7eUNBQzNCLFFBQVEsWUFBSSxNQUFNLFNBQUMscUJBQXFCOzs7MkJBaEIxQyxTQUFTLFNBQUMsZUFBZSxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRTs4QkFDM0MsU0FBUyxTQUFDLGNBQWMsRUFBRSxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUU7OEJBQzFDLE1BQU07MEJBQ04sTUFBTSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9naXRodWIuY29tL05HLVpPUlJPL25nLXpvcnJvLWFudGQvYmxvYi9tYXN0ZXIvTElDRU5TRVxuICovXG5cbmltcG9ydCB7IEZvY3VzVHJhcEZhY3RvcnkgfSBmcm9tICdAYW5ndWxhci9jZGsvYTExeSc7XG5pbXBvcnQgeyBPdmVybGF5UmVmIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHsgQ2RrUG9ydGFsT3V0bGV0IH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBJbmplY3QsXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFJlbmRlcmVyMixcbiAgVmlld0NoaWxkXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgQU5JTUFUSU9OX01PRFVMRV9UWVBFIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlci9hbmltYXRpb25zJztcbmltcG9ydCB7IE56Q29uZmlnU2VydmljZSB9IGZyb20gJ25nLXpvcnJvLWFudGQvY29yZS9jb25maWcnO1xuaW1wb3J0IHsgTnpTYWZlQW55IH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL3R5cGVzJztcblxuaW1wb3J0IHsgTnpJMThuU2VydmljZSwgTnpNb2RhbEkxOG5JbnRlcmZhY2UgfSBmcm9tICduZy16b3Jyby1hbnRkL2kxOG4nO1xuXG5pbXBvcnQgeyB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IG56TW9kYWxBbmltYXRpb25zIH0gZnJvbSAnLi9tb2RhbC1hbmltYXRpb25zJztcbmltcG9ydCB7IEJhc2VNb2RhbENvbnRhaW5lckNvbXBvbmVudCB9IGZyb20gJy4vbW9kYWwtY29udGFpbmVyJztcbmltcG9ydCB7IE1vZGFsT3B0aW9ucyB9IGZyb20gJy4vbW9kYWwtdHlwZXMnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduei1tb2RhbC1jb25maXJtLWNvbnRhaW5lcicsXG4gIGV4cG9ydEFzOiAnbnpNb2RhbENvbmZpcm1Db250YWluZXInLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXZcbiAgICAgICNtb2RhbEVsZW1lbnRcbiAgICAgIHJvbGU9XCJkb2N1bWVudFwiXG4gICAgICBjbGFzcz1cImFudC1tb2RhbFwiXG4gICAgICAobW91c2Vkb3duKT1cIm9uTW91c2Vkb3duKClcIlxuICAgICAgW25nQ2xhc3NdPVwiY29uZmlnLm56Q2xhc3NOYW1lIVwiXG4gICAgICBbbmdTdHlsZV09XCJjb25maWcubnpTdHlsZSFcIlxuICAgICAgW3N0eWxlLndpZHRoXT1cImNvbmZpZz8ubnpXaWR0aCEgfCBuelRvQ3NzVW5pdFwiXG4gICAgPlxuICAgICAgPGRpdiBjbGFzcz1cImFudC1tb2RhbC1jb250ZW50XCI+XG4gICAgICAgIDxidXR0b24gKm5nSWY9XCJjb25maWcubnpDbG9zYWJsZVwiIG56LW1vZGFsLWNsb3NlIChjbGljayk9XCJvbkNsb3NlQ2xpY2soKVwiPjwvYnV0dG9uPlxuICAgICAgICA8ZGl2IGNsYXNzPVwiYW50LW1vZGFsLWJvZHlcIiBbbmdTdHlsZV09XCJjb25maWcubnpCb2R5U3R5bGUhXCI+XG4gICAgICAgICAgPGRpdiBjbGFzcz1cImFudC1tb2RhbC1jb25maXJtLWJvZHktd3JhcHBlclwiPlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImFudC1tb2RhbC1jb25maXJtLWJvZHlcIj5cbiAgICAgICAgICAgICAgPGkgbnotaWNvbiBbbnpUeXBlXT1cImNvbmZpZy5uekljb25UeXBlIVwiPjwvaT5cbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJhbnQtbW9kYWwtY29uZmlybS10aXRsZVwiPlxuICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm56U3RyaW5nVGVtcGxhdGVPdXRsZXQ9XCJjb25maWcubnpUaXRsZVwiPlxuICAgICAgICAgICAgICAgICAgPHNwYW4gW2lubmVySFRNTF09XCJjb25maWcubnpUaXRsZVwiPjwvc3Bhbj5cbiAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYW50LW1vZGFsLWNvbmZpcm0tY29udGVudFwiPlxuICAgICAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSBjZGtQb3J0YWxPdXRsZXQ+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICA8ZGl2ICpuZ0lmPVwiaXNTdHJpbmdDb250ZW50XCIgW2lubmVySFRNTF09XCJjb25maWcubnpDb250ZW50XCI+PC9kaXY+XG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYW50LW1vZGFsLWNvbmZpcm0tYnRuc1wiPlxuICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgKm5nSWY9XCJjb25maWcubnpDYW5jZWxUZXh0ICE9PSBudWxsXCJcbiAgICAgICAgICAgICAgICBbYXR0ci5jZGtGb2N1c0luaXRpYWxdPVwiY29uZmlnLm56QXV0b2ZvY3VzID09PSAnY2FuY2VsJyB8fCBudWxsXCJcbiAgICAgICAgICAgICAgICBuei1idXR0b25cbiAgICAgICAgICAgICAgICAoY2xpY2spPVwib25DYW5jZWwoKVwiXG4gICAgICAgICAgICAgICAgW256TG9hZGluZ109XCIhIWNvbmZpZy5uekNhbmNlbExvYWRpbmdcIlxuICAgICAgICAgICAgICAgIFtkaXNhYmxlZF09XCJjb25maWcubnpDYW5jZWxEaXNhYmxlZFwiXG4gICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICB7eyBjb25maWcubnpDYW5jZWxUZXh0IHx8IGxvY2FsZS5jYW5jZWxUZXh0IH19XG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgICA8YnV0dG9uXG4gICAgICAgICAgICAgICAgKm5nSWY9XCJjb25maWcubnpPa1RleHQgIT09IG51bGxcIlxuICAgICAgICAgICAgICAgIFthdHRyLmNka0ZvY3VzSW5pdGlhbF09XCJjb25maWcubnpBdXRvZm9jdXMgPT09ICdvaycgfHwgbnVsbFwiXG4gICAgICAgICAgICAgICAgbnotYnV0dG9uXG4gICAgICAgICAgICAgICAgW256VHlwZV09XCJjb25maWcubnpPa1R5cGUhXCJcbiAgICAgICAgICAgICAgICAoY2xpY2spPVwib25PaygpXCJcbiAgICAgICAgICAgICAgICBbbnpMb2FkaW5nXT1cIiEhY29uZmlnLm56T2tMb2FkaW5nXCJcbiAgICAgICAgICAgICAgICBbZGlzYWJsZWRdPVwiY29uZmlnLm56T2tEaXNhYmxlZFwiXG4gICAgICAgICAgICAgICAgW256RGFuZ2VyXT1cImNvbmZpZy5uek9rRGFuZ2VyXCJcbiAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgIHt7IGNvbmZpZy5uek9rVGV4dCB8fCBsb2NhbGUub2tUZXh0IH19XG4gICAgICAgICAgICAgIDwvYnV0dG9uPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgPC9kaXY+XG4gIGAsXG4gIGFuaW1hdGlvbnM6IFtuek1vZGFsQW5pbWF0aW9ucy5tb2RhbENvbnRhaW5lcl0sXG4gIC8vIFVzaW5nIE9uUHVzaCBmb3IgbW9kYWwgY2F1c2VkIGZvb3RlciBjYW4gbm90IHRvIGRldGVjdCBjaGFuZ2VzLiB3ZSBjYW4gZml4IGl0IHdoZW4gOC54LlxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LkRlZmF1bHQsXG4gIGhvc3Q6IHtcbiAgICB0YWJpbmRleDogJy0xJyxcbiAgICByb2xlOiAnZGlhbG9nJyxcbiAgICAnW2NsYXNzXSc6ICdjb25maWcubnpXcmFwQ2xhc3NOYW1lID8gXCJhbnQtbW9kYWwtd3JhcCBcIiArIGNvbmZpZy5ueldyYXBDbGFzc05hbWUgOiBcImFudC1tb2RhbC13cmFwXCInLFxuICAgICdbY2xhc3MuYW50LW1vZGFsLXdyYXAtcnRsXSc6IGBkaXIgPT09ICdydGwnYCxcbiAgICAnW3N0eWxlLnpJbmRleF0nOiAnY29uZmlnLm56WkluZGV4JyxcbiAgICAnW0AuZGlzYWJsZWRdJzogJ2NvbmZpZy5uek5vQW5pbWF0aW9uJyxcbiAgICAnW0Btb2RhbENvbnRhaW5lcl0nOiAnc3RhdGUnLFxuICAgICcoQG1vZGFsQ29udGFpbmVyLnN0YXJ0KSc6ICdvbkFuaW1hdGlvblN0YXJ0KCRldmVudCknLFxuICAgICcoQG1vZGFsQ29udGFpbmVyLmRvbmUpJzogJ29uQW5pbWF0aW9uRG9uZSgkZXZlbnQpJyxcbiAgICAnKGNsaWNrKSc6ICdvbkNvbnRhaW5lckNsaWNrKCRldmVudCknLFxuICAgICcobW91c2V1cCknOiAnb25Nb3VzZXVwKCknXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgTnpNb2RhbENvbmZpcm1Db250YWluZXJDb21wb25lbnQgZXh0ZW5kcyBCYXNlTW9kYWxDb250YWluZXJDb21wb25lbnQge1xuICBAVmlld0NoaWxkKENka1BvcnRhbE91dGxldCwgeyBzdGF0aWM6IHRydWUgfSkgcG9ydGFsT3V0bGV0ITogQ2RrUG9ydGFsT3V0bGV0O1xuICBAVmlld0NoaWxkKCdtb2RhbEVsZW1lbnQnLCB7IHN0YXRpYzogdHJ1ZSB9KSBtb2RhbEVsZW1lbnRSZWYhOiBFbGVtZW50UmVmPEhUTUxEaXZFbGVtZW50PjtcbiAgQE91dHB1dCgpIHJlYWRvbmx5IGNhbmNlbFRyaWdnZXJlZCA9IG5ldyBFdmVudEVtaXR0ZXI8dm9pZD4oKTtcbiAgQE91dHB1dCgpIHJlYWRvbmx5IG9rVHJpZ2dlcmVkID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuICBsb2NhbGUhOiBOek1vZGFsSTE4bkludGVyZmFjZTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwcml2YXRlIGkxOG46IE56STE4blNlcnZpY2UsXG4gICAgZWxlbWVudFJlZjogRWxlbWVudFJlZixcbiAgICBmb2N1c1RyYXBGYWN0b3J5OiBGb2N1c1RyYXBGYWN0b3J5LFxuICAgIGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcmVuZGVyOiBSZW5kZXJlcjIsXG4gICAgb3ZlcmxheVJlZjogT3ZlcmxheVJlZixcbiAgICBuekNvbmZpZ1NlcnZpY2U6IE56Q29uZmlnU2VydmljZSxcbiAgICBwdWJsaWMgY29uZmlnOiBNb2RhbE9wdGlvbnMsXG4gICAgQE9wdGlvbmFsKCkgQEluamVjdChET0NVTUVOVCkgZG9jdW1lbnQ6IE56U2FmZUFueSxcbiAgICBAT3B0aW9uYWwoKSBASW5qZWN0KEFOSU1BVElPTl9NT0RVTEVfVFlQRSkgYW5pbWF0aW9uVHlwZTogc3RyaW5nXG4gICkge1xuICAgIHN1cGVyKGVsZW1lbnRSZWYsIGZvY3VzVHJhcEZhY3RvcnksIGNkciwgcmVuZGVyLCBvdmVybGF5UmVmLCBuekNvbmZpZ1NlcnZpY2UsIGNvbmZpZywgZG9jdW1lbnQsIGFuaW1hdGlvblR5cGUpO1xuICAgIHRoaXMuaTE4bi5sb2NhbGVDaGFuZ2UucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLmxvY2FsZSA9IHRoaXMuaTE4bi5nZXRMb2NhbGVEYXRhKCdNb2RhbCcpO1xuICAgIH0pO1xuICB9XG5cbiAgb25DYW5jZWwoKTogdm9pZCB7XG4gICAgdGhpcy5jYW5jZWxUcmlnZ2VyZWQuZW1pdCgpO1xuICB9XG5cbiAgb25PaygpOiB2b2lkIHtcbiAgICB0aGlzLm9rVHJpZ2dlcmVkLmVtaXQoKTtcbiAgfVxufVxuIl19