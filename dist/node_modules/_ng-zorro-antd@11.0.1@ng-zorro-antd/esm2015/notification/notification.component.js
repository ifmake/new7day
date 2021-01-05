/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { notificationMotion } from 'ng-zorro-antd/core/animation';
import { NzMNComponent } from 'ng-zorro-antd/message';
export class NzNotificationComponent extends NzMNComponent {
    constructor(cdr) {
        super(cdr);
        this.destroyed = new EventEmitter();
    }
    ngOnDestroy() {
        super.ngOnDestroy();
        this.instance.onClick.complete();
    }
    onClick(event) {
        this.instance.onClick.next(event);
    }
    close() {
        this.destroy(true);
    }
    get state() {
        if (this.instance.state === 'enter') {
            if (this.placement === 'topLeft' || this.placement === 'bottomLeft') {
                return 'enterLeft';
            }
            else {
                return 'enterRight';
            }
        }
        else {
            return this.instance.state;
        }
    }
}
NzNotificationComponent.decorators = [
    { type: Component, args: [{
                encapsulation: ViewEncapsulation.None,
                selector: 'nz-notification',
                exportAs: 'nzNotification',
                preserveWhitespaces: false,
                animations: [notificationMotion],
                template: `
    <div
      class="ant-notification-notice ant-notification-notice-closable"
      [ngStyle]="instance.options?.nzStyle || null"
      [ngClass]="instance.options?.nzClass || ''"
      [@notificationMotion]="state"
      (click)="onClick($event)"
      (mouseenter)="onEnter()"
      (mouseleave)="onLeave()"
    >
      <div *ngIf="!instance.template" class="ant-notification-notice-content">
        <div class="ant-notification-notice-content" [ngClass]="{ 'ant-notification-notice-with-icon': instance.type !== 'blank' }">
          <div [class.ant-notification-notice-with-icon]="instance.type !== 'blank'">
            <ng-container [ngSwitch]="instance.type">
              <i
                *ngSwitchCase="'success'"
                nz-icon
                nzType="check-circle"
                class="ant-notification-notice-icon ant-notification-notice-icon-success"
              ></i>
              <i
                *ngSwitchCase="'info'"
                nz-icon
                nzType="info-circle"
                class="ant-notification-notice-icon ant-notification-notice-icon-info"
              ></i>
              <i
                *ngSwitchCase="'warning'"
                nz-icon
                nzType="exclamation-circle"
                class="ant-notification-notice-icon ant-notification-notice-icon-warning"
              ></i>
              <i
                *ngSwitchCase="'error'"
                nz-icon
                nzType="close-circle"
                class="ant-notification-notice-icon ant-notification-notice-icon-error"
              ></i>
            </ng-container>
            <div class="ant-notification-notice-message" [innerHTML]="instance.title"></div>
            <div class="ant-notification-notice-description" [innerHTML]="instance.content"></div>
          </div>
        </div>
      </div>
      <ng-template
        [ngIf]="instance.template"
        [ngTemplateOutlet]="instance.template!"
        [ngTemplateOutletContext]="{ $implicit: this, data: instance.options?.nzData }"
      >
      </ng-template>
      <a tabindex="0" class="ant-notification-notice-close" (click)="close()">
        <span class="ant-notification-notice-close-x">
          <ng-container *ngIf="instance.options?.nzCloseIcon; else iconTpl">
            <ng-container *nzStringTemplateOutlet="instance.options?.nzCloseIcon; let closeIcon">
              <i nz-icon [nzType]="closeIcon"></i>
            </ng-container>
          </ng-container>
          <ng-template #iconTpl>
            <i nz-icon nzType="close" class="ant-notification-close-icon"></i>
          </ng-template>
        </span>
      </a>
    </div>
  `
            },] }
];
NzNotificationComponent.ctorParameters = () => [
    { type: ChangeDetectorRef }
];
NzNotificationComponent.propDecorators = {
    instance: [{ type: Input }],
    placement: [{ type: Input }],
    index: [{ type: Input }],
    destroyed: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibm90aWZpY2F0aW9uLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9jb21wb25lbnRzL25vdGlmaWNhdGlvbi8iLCJzb3VyY2VzIjpbIm5vdGlmaWNhdGlvbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHO0FBRUgsT0FBTyxFQUFFLGlCQUFpQixFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFhLE1BQU0sRUFBRSxpQkFBaUIsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN4SCxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUNsRSxPQUFPLEVBQUUsYUFBYSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUEyRXRELE1BQU0sT0FBTyx1QkFBd0IsU0FBUSxhQUFhO0lBTXhELFlBQVksR0FBc0I7UUFDaEMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBSE0sY0FBUyxHQUFHLElBQUksWUFBWSxFQUF1QyxDQUFDO0lBSXZGLENBQUM7SUFFRCxXQUFXO1FBQ1QsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3BCLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQ25DLENBQUM7SUFFRCxPQUFPLENBQUMsS0FBaUI7UUFDdkIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFRCxLQUFLO1FBQ0gsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNyQixDQUFDO0lBRUQsSUFBSSxLQUFLO1FBQ1AsSUFBSSxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssS0FBSyxPQUFPLEVBQUU7WUFDbkMsSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMsU0FBUyxLQUFLLFlBQVksRUFBRTtnQkFDbkUsT0FBTyxXQUFXLENBQUM7YUFDcEI7aUJBQU07Z0JBQ0wsT0FBTyxZQUFZLENBQUM7YUFDckI7U0FDRjthQUFNO1lBQ0wsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQztTQUM1QjtJQUNILENBQUM7OztZQXhHRixTQUFTLFNBQUM7Z0JBQ1QsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7Z0JBQ3JDLFFBQVEsRUFBRSxpQkFBaUI7Z0JBQzNCLFFBQVEsRUFBRSxnQkFBZ0I7Z0JBQzFCLG1CQUFtQixFQUFFLEtBQUs7Z0JBQzFCLFVBQVUsRUFBRSxDQUFDLGtCQUFrQixDQUFDO2dCQUNoQyxRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQStEVDthQUNGOzs7WUE1RVEsaUJBQWlCOzs7dUJBOEV2QixLQUFLO3dCQUNMLEtBQUs7b0JBQ0wsS0FBSzt3QkFDTCxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2dpdGh1Yi5jb20vTkctWk9SUk8vbmctem9ycm8tYW50ZC9ibG9iL21hc3Rlci9MSUNFTlNFXG4gKi9cblxuaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0b3JSZWYsIENvbXBvbmVudCwgRXZlbnRFbWl0dGVyLCBJbnB1dCwgT25EZXN0cm95LCBPdXRwdXQsIFZpZXdFbmNhcHN1bGF0aW9uIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBub3RpZmljYXRpb25Nb3Rpb24gfSBmcm9tICduZy16b3Jyby1hbnRkL2NvcmUvYW5pbWF0aW9uJztcbmltcG9ydCB7IE56TU5Db21wb25lbnQgfSBmcm9tICduZy16b3Jyby1hbnRkL21lc3NhZ2UnO1xuXG5pbXBvcnQgeyBOek5vdGlmaWNhdGlvbkRhdGEgfSBmcm9tICcuL3R5cGluZ3MnO1xuXG5AQ29tcG9uZW50KHtcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgc2VsZWN0b3I6ICduei1ub3RpZmljYXRpb24nLFxuICBleHBvcnRBczogJ256Tm90aWZpY2F0aW9uJyxcbiAgcHJlc2VydmVXaGl0ZXNwYWNlczogZmFsc2UsXG4gIGFuaW1hdGlvbnM6IFtub3RpZmljYXRpb25Nb3Rpb25dLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXZcbiAgICAgIGNsYXNzPVwiYW50LW5vdGlmaWNhdGlvbi1ub3RpY2UgYW50LW5vdGlmaWNhdGlvbi1ub3RpY2UtY2xvc2FibGVcIlxuICAgICAgW25nU3R5bGVdPVwiaW5zdGFuY2Uub3B0aW9ucz8ubnpTdHlsZSB8fCBudWxsXCJcbiAgICAgIFtuZ0NsYXNzXT1cImluc3RhbmNlLm9wdGlvbnM/Lm56Q2xhc3MgfHwgJydcIlxuICAgICAgW0Bub3RpZmljYXRpb25Nb3Rpb25dPVwic3RhdGVcIlxuICAgICAgKGNsaWNrKT1cIm9uQ2xpY2soJGV2ZW50KVwiXG4gICAgICAobW91c2VlbnRlcik9XCJvbkVudGVyKClcIlxuICAgICAgKG1vdXNlbGVhdmUpPVwib25MZWF2ZSgpXCJcbiAgICA+XG4gICAgICA8ZGl2ICpuZ0lmPVwiIWluc3RhbmNlLnRlbXBsYXRlXCIgY2xhc3M9XCJhbnQtbm90aWZpY2F0aW9uLW5vdGljZS1jb250ZW50XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJhbnQtbm90aWZpY2F0aW9uLW5vdGljZS1jb250ZW50XCIgW25nQ2xhc3NdPVwieyAnYW50LW5vdGlmaWNhdGlvbi1ub3RpY2Utd2l0aC1pY29uJzogaW5zdGFuY2UudHlwZSAhPT0gJ2JsYW5rJyB9XCI+XG4gICAgICAgICAgPGRpdiBbY2xhc3MuYW50LW5vdGlmaWNhdGlvbi1ub3RpY2Utd2l0aC1pY29uXT1cImluc3RhbmNlLnR5cGUgIT09ICdibGFuaydcIj5cbiAgICAgICAgICAgIDxuZy1jb250YWluZXIgW25nU3dpdGNoXT1cImluc3RhbmNlLnR5cGVcIj5cbiAgICAgICAgICAgICAgPGlcbiAgICAgICAgICAgICAgICAqbmdTd2l0Y2hDYXNlPVwiJ3N1Y2Nlc3MnXCJcbiAgICAgICAgICAgICAgICBuei1pY29uXG4gICAgICAgICAgICAgICAgbnpUeXBlPVwiY2hlY2stY2lyY2xlXCJcbiAgICAgICAgICAgICAgICBjbGFzcz1cImFudC1ub3RpZmljYXRpb24tbm90aWNlLWljb24gYW50LW5vdGlmaWNhdGlvbi1ub3RpY2UtaWNvbi1zdWNjZXNzXCJcbiAgICAgICAgICAgICAgPjwvaT5cbiAgICAgICAgICAgICAgPGlcbiAgICAgICAgICAgICAgICAqbmdTd2l0Y2hDYXNlPVwiJ2luZm8nXCJcbiAgICAgICAgICAgICAgICBuei1pY29uXG4gICAgICAgICAgICAgICAgbnpUeXBlPVwiaW5mby1jaXJjbGVcIlxuICAgICAgICAgICAgICAgIGNsYXNzPVwiYW50LW5vdGlmaWNhdGlvbi1ub3RpY2UtaWNvbiBhbnQtbm90aWZpY2F0aW9uLW5vdGljZS1pY29uLWluZm9cIlxuICAgICAgICAgICAgICA+PC9pPlxuICAgICAgICAgICAgICA8aVxuICAgICAgICAgICAgICAgICpuZ1N3aXRjaENhc2U9XCInd2FybmluZydcIlxuICAgICAgICAgICAgICAgIG56LWljb25cbiAgICAgICAgICAgICAgICBuelR5cGU9XCJleGNsYW1hdGlvbi1jaXJjbGVcIlxuICAgICAgICAgICAgICAgIGNsYXNzPVwiYW50LW5vdGlmaWNhdGlvbi1ub3RpY2UtaWNvbiBhbnQtbm90aWZpY2F0aW9uLW5vdGljZS1pY29uLXdhcm5pbmdcIlxuICAgICAgICAgICAgICA+PC9pPlxuICAgICAgICAgICAgICA8aVxuICAgICAgICAgICAgICAgICpuZ1N3aXRjaENhc2U9XCInZXJyb3InXCJcbiAgICAgICAgICAgICAgICBuei1pY29uXG4gICAgICAgICAgICAgICAgbnpUeXBlPVwiY2xvc2UtY2lyY2xlXCJcbiAgICAgICAgICAgICAgICBjbGFzcz1cImFudC1ub3RpZmljYXRpb24tbm90aWNlLWljb24gYW50LW5vdGlmaWNhdGlvbi1ub3RpY2UtaWNvbi1lcnJvclwiXG4gICAgICAgICAgICAgID48L2k+XG4gICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhbnQtbm90aWZpY2F0aW9uLW5vdGljZS1tZXNzYWdlXCIgW2lubmVySFRNTF09XCJpbnN0YW5jZS50aXRsZVwiPjwvZGl2PlxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cImFudC1ub3RpZmljYXRpb24tbm90aWNlLWRlc2NyaXB0aW9uXCIgW2lubmVySFRNTF09XCJpbnN0YW5jZS5jb250ZW50XCI+PC9kaXY+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICA8bmctdGVtcGxhdGVcbiAgICAgICAgW25nSWZdPVwiaW5zdGFuY2UudGVtcGxhdGVcIlxuICAgICAgICBbbmdUZW1wbGF0ZU91dGxldF09XCJpbnN0YW5jZS50ZW1wbGF0ZSFcIlxuICAgICAgICBbbmdUZW1wbGF0ZU91dGxldENvbnRleHRdPVwieyAkaW1wbGljaXQ6IHRoaXMsIGRhdGE6IGluc3RhbmNlLm9wdGlvbnM/Lm56RGF0YSB9XCJcbiAgICAgID5cbiAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICA8YSB0YWJpbmRleD1cIjBcIiBjbGFzcz1cImFudC1ub3RpZmljYXRpb24tbm90aWNlLWNsb3NlXCIgKGNsaWNrKT1cImNsb3NlKClcIj5cbiAgICAgICAgPHNwYW4gY2xhc3M9XCJhbnQtbm90aWZpY2F0aW9uLW5vdGljZS1jbG9zZS14XCI+XG4gICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cImluc3RhbmNlLm9wdGlvbnM/Lm56Q2xvc2VJY29uOyBlbHNlIGljb25UcGxcIj5cbiAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm56U3RyaW5nVGVtcGxhdGVPdXRsZXQ9XCJpbnN0YW5jZS5vcHRpb25zPy5uekNsb3NlSWNvbjsgbGV0IGNsb3NlSWNvblwiPlxuICAgICAgICAgICAgICA8aSBuei1pY29uIFtuelR5cGVdPVwiY2xvc2VJY29uXCI+PC9pPlxuICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgPG5nLXRlbXBsYXRlICNpY29uVHBsPlxuICAgICAgICAgICAgPGkgbnotaWNvbiBuelR5cGU9XCJjbG9zZVwiIGNsYXNzPVwiYW50LW5vdGlmaWNhdGlvbi1jbG9zZS1pY29uXCI+PC9pPlxuICAgICAgICAgIDwvbmctdGVtcGxhdGU+XG4gICAgICAgIDwvc3Bhbj5cbiAgICAgIDwvYT5cbiAgICA8L2Rpdj5cbiAgYFxufSlcbmV4cG9ydCBjbGFzcyBOek5vdGlmaWNhdGlvbkNvbXBvbmVudCBleHRlbmRzIE56TU5Db21wb25lbnQgaW1wbGVtZW50cyBPbkRlc3Ryb3kge1xuICBASW5wdXQoKSBpbnN0YW5jZSE6IFJlcXVpcmVkPE56Tm90aWZpY2F0aW9uRGF0YT47XG4gIEBJbnB1dCgpIHBsYWNlbWVudD86IHN0cmluZztcbiAgQElucHV0KCkgaW5kZXghOiBudW1iZXI7XG4gIEBPdXRwdXQoKSByZWFkb25seSBkZXN0cm95ZWQgPSBuZXcgRXZlbnRFbWl0dGVyPHsgaWQ6IHN0cmluZzsgdXNlckFjdGlvbjogYm9vbGVhbiB9PigpO1xuXG4gIGNvbnN0cnVjdG9yKGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWYpIHtcbiAgICBzdXBlcihjZHIpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgc3VwZXIubmdPbkRlc3Ryb3koKTtcbiAgICB0aGlzLmluc3RhbmNlLm9uQ2xpY2suY29tcGxldGUoKTtcbiAgfVxuXG4gIG9uQ2xpY2soZXZlbnQ6IE1vdXNlRXZlbnQpOiB2b2lkIHtcbiAgICB0aGlzLmluc3RhbmNlLm9uQ2xpY2submV4dChldmVudCk7XG4gIH1cblxuICBjbG9zZSgpOiB2b2lkIHtcbiAgICB0aGlzLmRlc3Ryb3kodHJ1ZSk7XG4gIH1cblxuICBnZXQgc3RhdGUoKTogc3RyaW5nIHwgdW5kZWZpbmVkIHtcbiAgICBpZiAodGhpcy5pbnN0YW5jZS5zdGF0ZSA9PT0gJ2VudGVyJykge1xuICAgICAgaWYgKHRoaXMucGxhY2VtZW50ID09PSAndG9wTGVmdCcgfHwgdGhpcy5wbGFjZW1lbnQgPT09ICdib3R0b21MZWZ0Jykge1xuICAgICAgICByZXR1cm4gJ2VudGVyTGVmdCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gJ2VudGVyUmlnaHQnO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdGhpcy5pbnN0YW5jZS5zdGF0ZTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==