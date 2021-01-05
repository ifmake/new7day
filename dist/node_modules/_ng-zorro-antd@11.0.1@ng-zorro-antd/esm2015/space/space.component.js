/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { __decorate, __metadata } from "tslib";
import { ChangeDetectionStrategy, Component, ContentChildren, Input, QueryList } from '@angular/core';
import { NzConfigService, WithConfig } from 'ng-zorro-antd/core/config';
import { Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';
import { NzSpaceItemComponent } from './space-item.component';
const NZ_CONFIG_MODULE_NAME = 'space';
export class NzSpaceComponent {
    constructor(nzConfigService) {
        this.nzConfigService = nzConfigService;
        this._nzModuleName = NZ_CONFIG_MODULE_NAME;
        this.nzDirection = 'horizontal';
        this.nzSize = 'small';
        this.destroy$ = new Subject();
    }
    updateSpaceItems() {
        if (this.nzSpaceItemComponents) {
            this.nzSpaceItemComponents.forEach(item => {
                item.setDirectionAndSize(this.nzDirection, this.nzSize);
            });
        }
    }
    ngOnChanges() {
        this.updateSpaceItems();
        this.mergedAlign = this.nzAlign === undefined && this.nzDirection === 'horizontal' ? 'center' : this.nzAlign;
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
    ngAfterViewInit() {
        this.nzSpaceItemComponents.changes.pipe(startWith(null), takeUntil(this.destroy$)).subscribe(() => {
            this.updateSpaceItems();
        });
    }
}
NzSpaceComponent.decorators = [
    { type: Component, args: [{
                selector: 'nz-space, [nz-space]',
                exportAs: 'NzSpace',
                changeDetection: ChangeDetectionStrategy.OnPush,
                template: `
    <ng-content></ng-content>
  `,
                host: {
                    class: 'ant-space',
                    '[class.ant-space-horizontal]': 'nzDirection === "horizontal"',
                    '[class.ant-space-vertical]': 'nzDirection === "vertical"',
                    '[class.ant-space-align-start]': 'mergedAlign === "start"',
                    '[class.ant-space-align-end]': 'mergedAlign === "end"',
                    '[class.ant-space-align-center]': 'mergedAlign === "center"',
                    '[class.ant-space-align-baseline]': 'mergedAlign === "baseline"'
                }
            },] }
];
NzSpaceComponent.ctorParameters = () => [
    { type: NzConfigService }
];
NzSpaceComponent.propDecorators = {
    nzDirection: [{ type: Input }],
    nzAlign: [{ type: Input }],
    nzSize: [{ type: Input }],
    nzSpaceItemComponents: [{ type: ContentChildren, args: [NzSpaceItemComponent,] }]
};
__decorate([
    WithConfig(),
    __metadata("design:type", Object)
], NzSpaceComponent.prototype, "nzSize", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BhY2UuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uL2NvbXBvbmVudHMvc3BhY2UvIiwic291cmNlcyI6WyJzcGFjZS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHOztBQUVILE9BQU8sRUFBaUIsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLGVBQWUsRUFBRSxLQUFLLEVBQXdCLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzSSxPQUFPLEVBQWUsZUFBZSxFQUFFLFVBQVUsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBRXJGLE9BQU8sRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDL0IsT0FBTyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUV0RCxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUc5RCxNQUFNLHFCQUFxQixHQUFnQixPQUFPLENBQUM7QUFtQm5ELE1BQU0sT0FBTyxnQkFBZ0I7SUFZM0IsWUFBbUIsZUFBZ0M7UUFBaEMsb0JBQWUsR0FBZixlQUFlLENBQWlCO1FBWDFDLGtCQUFhLEdBQWdCLHFCQUFxQixDQUFDO1FBRW5ELGdCQUFXLEdBQXFCLFlBQVksQ0FBQztRQUUvQixXQUFNLEdBQXlCLE9BQU8sQ0FBQztRQUt0RCxhQUFRLEdBQUcsSUFBSSxPQUFPLEVBQUUsQ0FBQztJQUVxQixDQUFDO0lBRS9DLGdCQUFnQjtRQUN0QixJQUFJLElBQUksQ0FBQyxxQkFBcUIsRUFBRTtZQUM5QixJQUFJLENBQUMscUJBQXFCLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUN4QyxJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLENBQUM7WUFDMUQsQ0FBQyxDQUFDLENBQUM7U0FDSjtJQUNILENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7UUFDeEIsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMsV0FBVyxLQUFLLFlBQVksQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDO0lBQy9HLENBQUM7SUFFRCxXQUFXO1FBQ1QsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNyQixJQUFJLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFFRCxlQUFlO1FBQ2IsSUFBSSxDQUFDLHFCQUFxQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFLFNBQVMsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsR0FBRyxFQUFFO1lBQ2hHLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO1FBQzFCLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7O1lBckRGLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsc0JBQXNCO2dCQUNoQyxRQUFRLEVBQUUsU0FBUztnQkFDbkIsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07Z0JBQy9DLFFBQVEsRUFBRTs7R0FFVDtnQkFDRCxJQUFJLEVBQUU7b0JBQ0osS0FBSyxFQUFFLFdBQVc7b0JBQ2xCLDhCQUE4QixFQUFFLDhCQUE4QjtvQkFDOUQsNEJBQTRCLEVBQUUsNEJBQTRCO29CQUMxRCwrQkFBK0IsRUFBRSx5QkFBeUI7b0JBQzFELDZCQUE2QixFQUFFLHVCQUF1QjtvQkFDdEQsZ0NBQWdDLEVBQUUsMEJBQTBCO29CQUM1RCxrQ0FBa0MsRUFBRSw0QkFBNEI7aUJBQ2pFO2FBQ0Y7OztZQTFCcUIsZUFBZTs7OzBCQThCbEMsS0FBSztzQkFDTCxLQUFLO3FCQUNMLEtBQUs7b0NBRUwsZUFBZSxTQUFDLG9CQUFvQjs7QUFGZDtJQUFiLFVBQVUsRUFBRTs7Z0RBQXdDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2dpdGh1Yi5jb20vTkctWk9SUk8vbmctem9ycm8tYW50ZC9ibG9iL21hc3Rlci9MSUNFTlNFXG4gKi9cblxuaW1wb3J0IHsgQWZ0ZXJWaWV3SW5pdCwgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgQ29udGVudENoaWxkcmVuLCBJbnB1dCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIFF1ZXJ5TGlzdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTnpDb25maWdLZXksIE56Q29uZmlnU2VydmljZSwgV2l0aENvbmZpZyB9IGZyb20gJ25nLXpvcnJvLWFudGQvY29yZS9jb25maWcnO1xuXG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBzdGFydFdpdGgsIHRha2VVbnRpbCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgTnpTcGFjZUl0ZW1Db21wb25lbnQgfSBmcm9tICcuL3NwYWNlLWl0ZW0uY29tcG9uZW50JztcbmltcG9ydCB7IE56U3BhY2VBbGlnbiwgTnpTcGFjZURpcmVjdGlvbiwgTnpTcGFjZVNpemUgfSBmcm9tICcuL3R5cGVzJztcblxuY29uc3QgTlpfQ09ORklHX01PRFVMRV9OQU1FOiBOekNvbmZpZ0tleSA9ICdzcGFjZSc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ256LXNwYWNlLCBbbnotc3BhY2VdJyxcbiAgZXhwb3J0QXM6ICdOelNwYWNlJyxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIHRlbXBsYXRlOiBgXG4gICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICBgLFxuICBob3N0OiB7XG4gICAgY2xhc3M6ICdhbnQtc3BhY2UnLFxuICAgICdbY2xhc3MuYW50LXNwYWNlLWhvcml6b250YWxdJzogJ256RGlyZWN0aW9uID09PSBcImhvcml6b250YWxcIicsXG4gICAgJ1tjbGFzcy5hbnQtc3BhY2UtdmVydGljYWxdJzogJ256RGlyZWN0aW9uID09PSBcInZlcnRpY2FsXCInLFxuICAgICdbY2xhc3MuYW50LXNwYWNlLWFsaWduLXN0YXJ0XSc6ICdtZXJnZWRBbGlnbiA9PT0gXCJzdGFydFwiJyxcbiAgICAnW2NsYXNzLmFudC1zcGFjZS1hbGlnbi1lbmRdJzogJ21lcmdlZEFsaWduID09PSBcImVuZFwiJyxcbiAgICAnW2NsYXNzLmFudC1zcGFjZS1hbGlnbi1jZW50ZXJdJzogJ21lcmdlZEFsaWduID09PSBcImNlbnRlclwiJyxcbiAgICAnW2NsYXNzLmFudC1zcGFjZS1hbGlnbi1iYXNlbGluZV0nOiAnbWVyZ2VkQWxpZ24gPT09IFwiYmFzZWxpbmVcIidcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBOelNwYWNlQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzLCBPbkRlc3Ryb3ksIEFmdGVyVmlld0luaXQge1xuICByZWFkb25seSBfbnpNb2R1bGVOYW1lOiBOekNvbmZpZ0tleSA9IE5aX0NPTkZJR19NT0RVTEVfTkFNRTtcblxuICBASW5wdXQoKSBuekRpcmVjdGlvbjogTnpTcGFjZURpcmVjdGlvbiA9ICdob3Jpem9udGFsJztcbiAgQElucHV0KCkgbnpBbGlnbj86IE56U3BhY2VBbGlnbjtcbiAgQElucHV0KCkgQFdpdGhDb25maWcoKSBuelNpemU6IG51bWJlciB8IE56U3BhY2VTaXplID0gJ3NtYWxsJztcblxuICBAQ29udGVudENoaWxkcmVuKE56U3BhY2VJdGVtQ29tcG9uZW50KSBuelNwYWNlSXRlbUNvbXBvbmVudHMhOiBRdWVyeUxpc3Q8TnpTcGFjZUl0ZW1Db21wb25lbnQ+O1xuXG4gIG1lcmdlZEFsaWduPzogTnpTcGFjZUFsaWduO1xuICBwcml2YXRlIGRlc3Ryb3kkID0gbmV3IFN1YmplY3QoKTtcblxuICBjb25zdHJ1Y3RvcihwdWJsaWMgbnpDb25maWdTZXJ2aWNlOiBOekNvbmZpZ1NlcnZpY2UpIHt9XG5cbiAgcHJpdmF0ZSB1cGRhdGVTcGFjZUl0ZW1zKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLm56U3BhY2VJdGVtQ29tcG9uZW50cykge1xuICAgICAgdGhpcy5uelNwYWNlSXRlbUNvbXBvbmVudHMuZm9yRWFjaChpdGVtID0+IHtcbiAgICAgICAgaXRlbS5zZXREaXJlY3Rpb25BbmRTaXplKHRoaXMubnpEaXJlY3Rpb24sIHRoaXMubnpTaXplKTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIG5nT25DaGFuZ2VzKCk6IHZvaWQge1xuICAgIHRoaXMudXBkYXRlU3BhY2VJdGVtcygpO1xuICAgIHRoaXMubWVyZ2VkQWxpZ24gPSB0aGlzLm56QWxpZ24gPT09IHVuZGVmaW5lZCAmJiB0aGlzLm56RGlyZWN0aW9uID09PSAnaG9yaXpvbnRhbCcgPyAnY2VudGVyJyA6IHRoaXMubnpBbGlnbjtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuZGVzdHJveSQubmV4dCgpO1xuICAgIHRoaXMuZGVzdHJveSQuY29tcGxldGUoKTtcbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLm56U3BhY2VJdGVtQ29tcG9uZW50cy5jaGFuZ2VzLnBpcGUoc3RhcnRXaXRoKG51bGwpLCB0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpLnN1YnNjcmliZSgoKSA9PiB7XG4gICAgICB0aGlzLnVwZGF0ZVNwYWNlSXRlbXMoKTtcbiAgICB9KTtcbiAgfVxufVxuIl19