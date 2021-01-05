/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { moveUpMotion } from 'ng-zorro-antd/core/animation';
import { NzMNComponent } from './base';
export class NzMessageComponent extends NzMNComponent {
    constructor(cdr) {
        super(cdr);
        this.destroyed = new EventEmitter();
    }
}
NzMessageComponent.decorators = [
    { type: Component, args: [{
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                selector: 'nz-message',
                exportAs: 'nzMessage',
                preserveWhitespaces: false,
                animations: [moveUpMotion],
                template: `
    <div class="ant-message-notice" [@moveUpMotion]="instance.state" (mouseenter)="onEnter()" (mouseleave)="onLeave()">
      <div class="ant-message-notice-content">
        <div class="ant-message-custom-content" [ngClass]="'ant-message-' + instance.type">
          <ng-container [ngSwitch]="instance.type">
            <i *ngSwitchCase="'success'" nz-icon nzType="check-circle"></i>
            <i *ngSwitchCase="'info'" nz-icon nzType="info-circle"></i>
            <i *ngSwitchCase="'warning'" nz-icon nzType="exclamation-circle"></i>
            <i *ngSwitchCase="'error'" nz-icon nzType="close-circle"></i>
            <i *ngSwitchCase="'loading'" nz-icon nzType="loading"></i>
          </ng-container>
          <ng-container *nzStringTemplateOutlet="instance.content">
            <span [innerHTML]="instance.content"></span>
          </ng-container>
        </div>
      </div>
    </div>
  `
            },] }
];
NzMessageComponent.ctorParameters = () => [
    { type: ChangeDetectorRef }
];
NzMessageComponent.propDecorators = {
    instance: [{ type: Input }],
    destroyed: [{ type: Output }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVzc2FnZS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vY29tcG9uZW50cy9tZXNzYWdlLyIsInNvdXJjZXMiOlsibWVzc2FnZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHO0FBRUgsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFlBQVksRUFDWixLQUFLLEVBR0wsTUFBTSxFQUNOLGlCQUFpQixFQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sOEJBQThCLENBQUM7QUFFNUQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLFFBQVEsQ0FBQztBQTZCdkMsTUFBTSxPQUFPLGtCQUFtQixTQUFRLGFBQWE7SUFJbkQsWUFBWSxHQUFzQjtRQUNoQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFITSxjQUFTLEdBQUcsSUFBSSxZQUFZLEVBQXVDLENBQUM7SUFJdkYsQ0FBQzs7O1lBaENGLFNBQVMsU0FBQztnQkFDVCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtnQkFDL0MsYUFBYSxFQUFFLGlCQUFpQixDQUFDLElBQUk7Z0JBQ3JDLFFBQVEsRUFBRSxZQUFZO2dCQUN0QixRQUFRLEVBQUUsV0FBVztnQkFDckIsbUJBQW1CLEVBQUUsS0FBSztnQkFDMUIsVUFBVSxFQUFFLENBQUMsWUFBWSxDQUFDO2dCQUMxQixRQUFRLEVBQUU7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBaUJUO2FBQ0Y7OztZQXZDQyxpQkFBaUI7Ozt1QkF5Q2hCLEtBQUs7d0JBQ0wsTUFBTSIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9naXRodWIuY29tL05HLVpPUlJPL25nLXpvcnJvLWFudGQvYmxvYi9tYXN0ZXIvTElDRU5TRVxuICovXG5cbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3V0cHV0LFxuICBWaWV3RW5jYXBzdWxhdGlvblxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IG1vdmVVcE1vdGlvbiB9IGZyb20gJ25nLXpvcnJvLWFudGQvY29yZS9hbmltYXRpb24nO1xuXG5pbXBvcnQgeyBOek1OQ29tcG9uZW50IH0gZnJvbSAnLi9iYXNlJztcbmltcG9ydCB7IE56TWVzc2FnZURhdGEgfSBmcm9tICcuL3R5cGluZ3MnO1xuXG5AQ29tcG9uZW50KHtcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIHNlbGVjdG9yOiAnbnotbWVzc2FnZScsXG4gIGV4cG9ydEFzOiAnbnpNZXNzYWdlJyxcbiAgcHJlc2VydmVXaGl0ZXNwYWNlczogZmFsc2UsXG4gIGFuaW1hdGlvbnM6IFttb3ZlVXBNb3Rpb25dLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgY2xhc3M9XCJhbnQtbWVzc2FnZS1ub3RpY2VcIiBbQG1vdmVVcE1vdGlvbl09XCJpbnN0YW5jZS5zdGF0ZVwiIChtb3VzZWVudGVyKT1cIm9uRW50ZXIoKVwiIChtb3VzZWxlYXZlKT1cIm9uTGVhdmUoKVwiPlxuICAgICAgPGRpdiBjbGFzcz1cImFudC1tZXNzYWdlLW5vdGljZS1jb250ZW50XCI+XG4gICAgICAgIDxkaXYgY2xhc3M9XCJhbnQtbWVzc2FnZS1jdXN0b20tY29udGVudFwiIFtuZ0NsYXNzXT1cIidhbnQtbWVzc2FnZS0nICsgaW5zdGFuY2UudHlwZVwiPlxuICAgICAgICAgIDxuZy1jb250YWluZXIgW25nU3dpdGNoXT1cImluc3RhbmNlLnR5cGVcIj5cbiAgICAgICAgICAgIDxpICpuZ1N3aXRjaENhc2U9XCInc3VjY2VzcydcIiBuei1pY29uIG56VHlwZT1cImNoZWNrLWNpcmNsZVwiPjwvaT5cbiAgICAgICAgICAgIDxpICpuZ1N3aXRjaENhc2U9XCInaW5mbydcIiBuei1pY29uIG56VHlwZT1cImluZm8tY2lyY2xlXCI+PC9pPlxuICAgICAgICAgICAgPGkgKm5nU3dpdGNoQ2FzZT1cIid3YXJuaW5nJ1wiIG56LWljb24gbnpUeXBlPVwiZXhjbGFtYXRpb24tY2lyY2xlXCI+PC9pPlxuICAgICAgICAgICAgPGkgKm5nU3dpdGNoQ2FzZT1cIidlcnJvcidcIiBuei1pY29uIG56VHlwZT1cImNsb3NlLWNpcmNsZVwiPjwvaT5cbiAgICAgICAgICAgIDxpICpuZ1N3aXRjaENhc2U9XCInbG9hZGluZydcIiBuei1pY29uIG56VHlwZT1cImxvYWRpbmdcIj48L2k+XG4gICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgPG5nLWNvbnRhaW5lciAqbnpTdHJpbmdUZW1wbGF0ZU91dGxldD1cImluc3RhbmNlLmNvbnRlbnRcIj5cbiAgICAgICAgICAgIDxzcGFuIFtpbm5lckhUTUxdPVwiaW5zdGFuY2UuY29udGVudFwiPjwvc3Bhbj5cbiAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgPC9kaXY+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgYFxufSlcbmV4cG9ydCBjbGFzcyBOek1lc3NhZ2VDb21wb25lbnQgZXh0ZW5kcyBOek1OQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkRlc3Ryb3kge1xuICBASW5wdXQoKSBpbnN0YW5jZSE6IFJlcXVpcmVkPE56TWVzc2FnZURhdGE+O1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgZGVzdHJveWVkID0gbmV3IEV2ZW50RW1pdHRlcjx7IGlkOiBzdHJpbmc7IHVzZXJBY3Rpb246IGJvb2xlYW4gfT4oKTtcblxuICBjb25zdHJ1Y3RvcihjZHI6IENoYW5nZURldGVjdG9yUmVmKSB7XG4gICAgc3VwZXIoY2RyKTtcbiAgfVxufVxuIl19