/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { __decorate, __metadata } from "tslib";
import { Directionality } from '@angular/cdk/bidi';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, Input, Optional, QueryList, ViewEncapsulation } from '@angular/core';
import { NzConfigService, WithConfig } from 'ng-zorro-antd/core/config';
import { warn } from 'ng-zorro-antd/core/logger';
import { gridResponsiveMap, NzBreakpointEnum, NzBreakpointService } from 'ng-zorro-antd/core/services';
import { InputBoolean } from 'ng-zorro-antd/core/util';
import { merge, Subject } from 'rxjs';
import { auditTime, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { NzDescriptionsItemComponent } from './descriptions-item.component';
const NZ_CONFIG_MODULE_NAME = 'descriptions';
const defaultColumnMap = {
    xxl: 3,
    xl: 3,
    lg: 3,
    md: 3,
    sm: 2,
    xs: 1
};
export class NzDescriptionsComponent {
    constructor(nzConfigService, cdr, breakpointService, directionality) {
        this.nzConfigService = nzConfigService;
        this.cdr = cdr;
        this.breakpointService = breakpointService;
        this.directionality = directionality;
        this._nzModuleName = NZ_CONFIG_MODULE_NAME;
        this.nzBordered = false;
        this.nzLayout = 'horizontal';
        this.nzColumn = defaultColumnMap;
        this.nzSize = 'default';
        this.nzTitle = '';
        this.nzColon = true;
        this.itemMatrix = [];
        this.realColumn = 3;
        this.dir = 'ltr';
        this.breakpoint = NzBreakpointEnum.md;
        this.destroy$ = new Subject();
    }
    ngOnInit() {
        var _a;
        this.dir = this.directionality.value;
        (_a = this.directionality.change) === null || _a === void 0 ? void 0 : _a.pipe(takeUntil(this.destroy$)).subscribe((direction) => {
            this.dir = direction;
        });
    }
    ngOnChanges(changes) {
        if (changes.nzColumn) {
            this.prepareMatrix();
        }
    }
    ngAfterContentInit() {
        const contentChange$ = this.items.changes.pipe(startWith(this.items), takeUntil(this.destroy$));
        merge(contentChange$, contentChange$.pipe(switchMap(() => merge(...this.items.map(i => i.inputChange$)).pipe(auditTime(16)))), this.breakpointService.subscribe(gridResponsiveMap).pipe(tap(bp => (this.breakpoint = bp))))
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
            this.prepareMatrix();
            this.cdr.markForCheck();
        });
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
    /**
     * Prepare the render matrix according to description items' spans.
     */
    prepareMatrix() {
        if (!this.items) {
            return;
        }
        let currentRow = [];
        let width = 0;
        const column = (this.realColumn = this.getColumn());
        const items = this.items.toArray();
        const length = items.length;
        const matrix = [];
        const flushRow = () => {
            matrix.push(currentRow);
            currentRow = [];
            width = 0;
        };
        for (let i = 0; i < length; i++) {
            const item = items[i];
            const { nzTitle: title, content, nzSpan: span } = item;
            width += span;
            // If the last item make the row's length exceeds `nzColumn`, the last
            // item should take all the space left. This logic is implemented in the template.
            // Warn user about that.
            if (width >= column) {
                if (width > column) {
                    warn(`"nzColumn" is ${column} but we have row length ${width}`);
                }
                currentRow.push({ title, content, span: column - (width - span) });
                flushRow();
            }
            else if (i === length - 1) {
                currentRow.push({ title, content, span: column - (width - span) });
                flushRow();
            }
            else {
                currentRow.push({ title, content, span });
            }
        }
        this.itemMatrix = matrix;
    }
    getColumn() {
        if (typeof this.nzColumn !== 'number') {
            return this.nzColumn[this.breakpoint];
        }
        return this.nzColumn;
    }
}
NzDescriptionsComponent.decorators = [
    { type: Component, args: [{
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                selector: 'nz-descriptions',
                exportAs: 'nzDescriptions',
                preserveWhitespaces: false,
                template: `
    <div *ngIf="nzTitle || nzExtra" class="ant-descriptions-header">
      <div *ngIf="nzTitle" class="ant-descriptions-title">
        <ng-container *nzStringTemplateOutlet="nzTitle">{{ nzTitle }}</ng-container>
      </div>
      <div *ngIf="nzExtra" class="ant-descriptions-extra">
        <ng-container *nzStringTemplateOutlet="nzExtra">{{ nzExtra }}</ng-container>
      </div>
    </div>
    <div class="ant-descriptions-view">
      <table>
        <tbody>
          <ng-container *ngIf="nzLayout === 'horizontal'">
            <tr class="ant-descriptions-row" *ngFor="let row of itemMatrix; let i = index">
              <ng-container *ngFor="let item of row; let isLast = last">
                <!-- Horizontal & NOT Bordered -->
                <ng-container *ngIf="!nzBordered">
                  <td class="ant-descriptions-item" [colSpan]="item.span">
                    <div class="ant-descriptions-item-container">
                      <span class="ant-descriptions-item-label" [class.ant-descriptions-item-no-colon]="!nzColon">
                        <ng-container *nzStringTemplateOutlet="item.title">
                          {{ item.title }}
                        </ng-container>
                      </span>
                      <span class="ant-descriptions-item-content">
                        <ng-template [ngTemplateOutlet]="item.content"></ng-template>
                      </span>
                    </div>
                  </td>
                </ng-container>
                <!-- Horizontal & Bordered -->
                <ng-container *ngIf="nzBordered">
                  <td class="ant-descriptions-item-label" *nzStringTemplateOutlet="item.title">
                    <ng-container *nzStringTemplateOutlet="item.title">
                      {{ item.title }}
                    </ng-container>
                  </td>
                  <td class="ant-descriptions-item-content" [colSpan]="item.span * 2 - 1">
                    <ng-template [ngTemplateOutlet]="item.content"></ng-template>
                  </td>
                </ng-container>
              </ng-container>
            </tr>
          </ng-container>

          <ng-container *ngIf="nzLayout === 'vertical'">
            <!-- Vertical & NOT Bordered -->
            <ng-container *ngIf="!nzBordered">
              <ng-container *ngFor="let row of itemMatrix; let i = index">
                <tr class="ant-descriptions-row">
                  <ng-container *ngFor="let item of row; let isLast = last">
                    <td class="ant-descriptions-item" [colSpan]="item.span">
                      <span class="ant-descriptions-item-label" [class.ant-descriptions-item-no-colon]="!nzColon">
                        <ng-container *nzStringTemplateOutlet="item.title">
                          {{ item.title }}
                        </ng-container>
                      </span>
                    </td>
                  </ng-container>
                </tr>
                <tr class="ant-descriptions-row">
                  <ng-container *ngFor="let item of row; let isLast = last">
                    <td class="ant-descriptions-item" [colSpan]="item.span">
                      <span class="ant-descriptions-item-content">
                        <ng-template [ngTemplateOutlet]="item.content"></ng-template>
                      </span>
                    </td>
                  </ng-container>
                </tr>
              </ng-container>
            </ng-container>
            <!-- Vertical & Bordered -->
            <ng-container *ngIf="nzBordered">
              <ng-container *ngFor="let row of itemMatrix; let i = index">
                <tr class="ant-descriptions-row">
                  <ng-container *ngFor="let item of row; let isLast = last">
                    <td class="ant-descriptions-item-label" [colSpan]="item.span">
                      <ng-container *nzStringTemplateOutlet="item.title">
                        {{ item.title }}
                      </ng-container>
                    </td>
                  </ng-container>
                </tr>
                <tr class="ant-descriptions-row">
                  <ng-container *ngFor="let item of row; let isLast = last">
                    <td class="ant-descriptions-item-content" [colSpan]="item.span">
                      <ng-template [ngTemplateOutlet]="item.content"></ng-template>
                    </td>
                  </ng-container>
                </tr>
              </ng-container>
            </ng-container>
          </ng-container>
        </tbody>
      </table>
    </div>
  `,
                host: {
                    class: 'ant-descriptions',
                    '[class.ant-descriptions-bordered]': 'nzBordered',
                    '[class.ant-descriptions-middle]': 'nzSize === "middle"',
                    '[class.ant-descriptions-small]': 'nzSize === "small"',
                    '[class.ant-descriptions-rtl]': 'dir === "rtl"'
                }
            },] }
];
NzDescriptionsComponent.ctorParameters = () => [
    { type: NzConfigService },
    { type: ChangeDetectorRef },
    { type: NzBreakpointService },
    { type: Directionality, decorators: [{ type: Optional }] }
];
NzDescriptionsComponent.propDecorators = {
    items: [{ type: ContentChildren, args: [NzDescriptionsItemComponent,] }],
    nzBordered: [{ type: Input }],
    nzLayout: [{ type: Input }],
    nzColumn: [{ type: Input }],
    nzSize: [{ type: Input }],
    nzTitle: [{ type: Input }],
    nzExtra: [{ type: Input }],
    nzColon: [{ type: Input }]
};
__decorate([
    InputBoolean(),
    WithConfig(),
    __metadata("design:type", Boolean)
], NzDescriptionsComponent.prototype, "nzBordered", void 0);
__decorate([
    WithConfig(),
    __metadata("design:type", Object)
], NzDescriptionsComponent.prototype, "nzColumn", void 0);
__decorate([
    WithConfig(),
    __metadata("design:type", String)
], NzDescriptionsComponent.prototype, "nzSize", void 0);
__decorate([
    WithConfig(),
    InputBoolean(),
    __metadata("design:type", Boolean)
], NzDescriptionsComponent.prototype, "nzColon", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGVzY3JpcHRpb25zLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9jb21wb25lbnRzL2Rlc2NyaXB0aW9ucy8iLCJzb3VyY2VzIjpbImRlc2NyaXB0aW9ucy5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHOztBQUVILE9BQU8sRUFBYSxjQUFjLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUM5RCxPQUFPLEVBRUwsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsZUFBZSxFQUNmLEtBQUssRUFJTCxRQUFRLEVBQ1IsU0FBUyxFQUdULGlCQUFpQixFQUNsQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQWUsZUFBZSxFQUFFLFVBQVUsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBQ3JGLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNqRCxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsZ0JBQWdCLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUV2RyxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFFdkQsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDdEMsT0FBTyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxHQUFHLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUNqRixPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUc1RSxNQUFNLHFCQUFxQixHQUFnQixjQUFjLENBQUM7QUFDMUQsTUFBTSxnQkFBZ0IsR0FBMEM7SUFDOUQsR0FBRyxFQUFFLENBQUM7SUFDTixFQUFFLEVBQUUsQ0FBQztJQUNMLEVBQUUsRUFBRSxDQUFDO0lBQ0wsRUFBRSxFQUFFLENBQUM7SUFDTCxFQUFFLEVBQUUsQ0FBQztJQUNMLEVBQUUsRUFBRSxDQUFD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QWU7WUFibkMsaUJBQWlCO1lBZTJCLG1CQUFtQjtZQW5CN0MsY0FBYyx1QkErSzdCLFFBQVE7OztvQkFyQlYsZUFBZSxTQUFDLDJCQUEyQjt5QkFFM0MsS0FBSzt1QkFDTCxLQUFLO3VCQUNMLEtBQUs7cUJBQ0wsS0FBSztzQkFDTCxLQUFLO3NCQUNMLEtBQUs7c0JBQ0wsS0FBSzs7QUFOaUM7SUFBN0IsWUFBWSxFQUFFO0lBQUUsVUFBVSxFQUFFOzsyREFBNkI7QUFFNUM7SUFBYixVQUFVLEVBQUU7O3lEQUE2RTtBQUM1RTtJQUFiLFVBQVUsRUFBRTs7dURBQXdDO0FBR3ZCO0lBQTdCLFVBQVUsRUFBRTtJQUFFLFlBQVksRUFBRTs7d0RBQXlCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2dpdGh1Yi5jb20vTkctWk9SUk8vbmctem9ycm8tYW50ZC9ibG9iL21hc3Rlci9MSUNFTlNFXG4gKi9cblxuaW1wb3J0IHsgRGlyZWN0aW9uLCBEaXJlY3Rpb25hbGl0eSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgUXVlcnlMaXN0LFxuICBTaW1wbGVDaGFuZ2VzLFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOekNvbmZpZ0tleSwgTnpDb25maWdTZXJ2aWNlLCBXaXRoQ29uZmlnIH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL2NvbmZpZyc7XG5pbXBvcnQgeyB3YXJuIH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL2xvZ2dlcic7XG5pbXBvcnQgeyBncmlkUmVzcG9uc2l2ZU1hcCwgTnpCcmVha3BvaW50RW51bSwgTnpCcmVha3BvaW50U2VydmljZSB9IGZyb20gJ25nLXpvcnJvLWFudGQvY29yZS9zZXJ2aWNlcyc7XG5pbXBvcnQgeyBCb29sZWFuSW5wdXQgfSBmcm9tICduZy16b3Jyby1hbnRkL2NvcmUvdHlwZXMnO1xuaW1wb3J0IHsgSW5wdXRCb29sZWFuIH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL3V0aWwnO1xuXG5pbXBvcnQgeyBtZXJnZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgYXVkaXRUaW1lLCBzdGFydFdpdGgsIHN3aXRjaE1hcCwgdGFrZVVudGlsLCB0YXAgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5pbXBvcnQgeyBOekRlc2NyaXB0aW9uc0l0ZW1Db21wb25lbnQgfSBmcm9tICcuL2Rlc2NyaXB0aW9ucy1pdGVtLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOekRlc2NyaXB0aW9uc0l0ZW1SZW5kZXJQcm9wcywgTnpEZXNjcmlwdGlvbnNMYXlvdXQsIE56RGVzY3JpcHRpb25zU2l6ZSB9IGZyb20gJy4vdHlwaW5ncyc7XG5cbmNvbnN0IE5aX0NPTkZJR19NT0RVTEVfTkFNRTogTnpDb25maWdLZXkgPSAnZGVzY3JpcHRpb25zJztcbmNvbnN0IGRlZmF1bHRDb2x1bW5NYXA6IHsgW2tleSBpbiBOekJyZWFrcG9pbnRFbnVtXTogbnVtYmVyIH0gPSB7XG4gIHh4bDogMyxcbiAgeGw6IDMsXG4gIGxnOiAzLFxuICBtZDogMyxcbiAgc206IDIsXG4gIHhzOiAxXG59O1xuXG5AQ29tcG9uZW50KHtcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIHNlbGVjdG9yOiAnbnotZGVzY3JpcHRpb25zJyxcbiAgZXhwb3J0QXM6ICduekRlc2NyaXB0aW9ucycsXG4gIHByZXNlcnZlV2hpdGVzcGFjZXM6IGZhbHNlLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxkaXYgKm5nSWY9XCJuelRpdGxlIHx8IG56RXh0cmFcIiBjbGFzcz1cImFudC1kZXNjcmlwdGlvbnMtaGVhZGVyXCI+XG4gICAgICA8ZGl2ICpuZ0lmPVwibnpUaXRsZVwiIGNsYXNzPVwiYW50LWRlc2NyaXB0aW9ucy10aXRsZVwiPlxuICAgICAgICA8bmctY29udGFpbmVyICpuelN0cmluZ1RlbXBsYXRlT3V0bGV0PVwibnpUaXRsZVwiPnt7IG56VGl0bGUgfX08L25nLWNvbnRhaW5lcj5cbiAgICAgIDwvZGl2PlxuICAgICAgPGRpdiAqbmdJZj1cIm56RXh0cmFcIiBjbGFzcz1cImFudC1kZXNjcmlwdGlvbnMtZXh0cmFcIj5cbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbnpTdHJpbmdUZW1wbGF0ZU91dGxldD1cIm56RXh0cmFcIj57eyBuekV4dHJhIH19PC9uZy1jb250YWluZXI+XG4gICAgICA8L2Rpdj5cbiAgICA8L2Rpdj5cbiAgICA8ZGl2IGNsYXNzPVwiYW50LWRlc2NyaXB0aW9ucy12aWV3XCI+XG4gICAgICA8dGFibGU+XG4gICAgICAgIDx0Ym9keT5cbiAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwibnpMYXlvdXQgPT09ICdob3Jpem9udGFsJ1wiPlxuICAgICAgICAgICAgPHRyIGNsYXNzPVwiYW50LWRlc2NyaXB0aW9ucy1yb3dcIiAqbmdGb3I9XCJsZXQgcm93IG9mIGl0ZW1NYXRyaXg7IGxldCBpID0gaW5kZXhcIj5cbiAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdGb3I9XCJsZXQgaXRlbSBvZiByb3c7IGxldCBpc0xhc3QgPSBsYXN0XCI+XG4gICAgICAgICAgICAgICAgPCEtLSBIb3Jpem9udGFsICYgTk9UIEJvcmRlcmVkIC0tPlxuICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCIhbnpCb3JkZXJlZFwiPlxuICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwiYW50LWRlc2NyaXB0aW9ucy1pdGVtXCIgW2NvbFNwYW5dPVwiaXRlbS5zcGFuXCI+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhbnQtZGVzY3JpcHRpb25zLWl0ZW0tY29udGFpbmVyXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJhbnQtZGVzY3JpcHRpb25zLWl0ZW0tbGFiZWxcIiBbY2xhc3MuYW50LWRlc2NyaXB0aW9ucy1pdGVtLW5vLWNvbG9uXT1cIiFuekNvbG9uXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuelN0cmluZ1RlbXBsYXRlT3V0bGV0PVwiaXRlbS50aXRsZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICB7eyBpdGVtLnRpdGxlIH19XG4gICAgICAgICAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJhbnQtZGVzY3JpcHRpb25zLWl0ZW0tY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cIml0ZW0uY29udGVudFwiPjwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgPCEtLSBIb3Jpem9udGFsICYgQm9yZGVyZWQgLS0+XG4gICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIm56Qm9yZGVyZWRcIj5cbiAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cImFudC1kZXNjcmlwdGlvbnMtaXRlbS1sYWJlbFwiICpuelN0cmluZ1RlbXBsYXRlT3V0bGV0PVwiaXRlbS50aXRsZVwiPlxuICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuelN0cmluZ1RlbXBsYXRlT3V0bGV0PVwiaXRlbS50aXRsZVwiPlxuICAgICAgICAgICAgICAgICAgICAgIHt7IGl0ZW0udGl0bGUgfX1cbiAgICAgICAgICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwiYW50LWRlc2NyaXB0aW9ucy1pdGVtLWNvbnRlbnRcIiBbY29sU3Bhbl09XCJpdGVtLnNwYW4gKiAyIC0gMVwiPlxuICAgICAgICAgICAgICAgICAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwiaXRlbS5jb250ZW50XCI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cblxuICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJuekxheW91dCA9PT0gJ3ZlcnRpY2FsJ1wiPlxuICAgICAgICAgICAgPCEtLSBWZXJ0aWNhbCAmIE5PVCBCb3JkZXJlZCAtLT5cbiAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCIhbnpCb3JkZXJlZFwiPlxuICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0Zvcj1cImxldCByb3cgb2YgaXRlbU1hdHJpeDsgbGV0IGkgPSBpbmRleFwiPlxuICAgICAgICAgICAgICAgIDx0ciBjbGFzcz1cImFudC1kZXNjcmlwdGlvbnMtcm93XCI+XG4gICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0Zvcj1cImxldCBpdGVtIG9mIHJvdzsgbGV0IGlzTGFzdCA9IGxhc3RcIj5cbiAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwiYW50LWRlc2NyaXB0aW9ucy1pdGVtXCIgW2NvbFNwYW5dPVwiaXRlbS5zcGFuXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJhbnQtZGVzY3JpcHRpb25zLWl0ZW0tbGFiZWxcIiBbY2xhc3MuYW50LWRlc2NyaXB0aW9ucy1pdGVtLW5vLWNvbG9uXT1cIiFuekNvbG9uXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuelN0cmluZ1RlbXBsYXRlT3V0bGV0PVwiaXRlbS50aXRsZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgICB7eyBpdGVtLnRpdGxlIH19XG4gICAgICAgICAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+XG4gICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICAgIDx0ciBjbGFzcz1cImFudC1kZXNjcmlwdGlvbnMtcm93XCI+XG4gICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuZ0Zvcj1cImxldCBpdGVtIG9mIHJvdzsgbGV0IGlzTGFzdCA9IGxhc3RcIj5cbiAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzPVwiYW50LWRlc2NyaXB0aW9ucy1pdGVtXCIgW2NvbFNwYW5dPVwiaXRlbS5zcGFuXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJhbnQtZGVzY3JpcHRpb25zLWl0ZW0tY29udGVudFwiPlxuICAgICAgICAgICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cIml0ZW0uY29udGVudFwiPjwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgIDwhLS0gVmVydGljYWwgJiBCb3JkZXJlZCAtLT5cbiAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJuekJvcmRlcmVkXCI+XG4gICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nRm9yPVwibGV0IHJvdyBvZiBpdGVtTWF0cml4OyBsZXQgaSA9IGluZGV4XCI+XG4gICAgICAgICAgICAgICAgPHRyIGNsYXNzPVwiYW50LWRlc2NyaXB0aW9ucy1yb3dcIj5cbiAgICAgICAgICAgICAgICAgIDxuZy1jb250YWluZXIgKm5nRm9yPVwibGV0IGl0ZW0gb2Ygcm93OyBsZXQgaXNMYXN0ID0gbGFzdFwiPlxuICAgICAgICAgICAgICAgICAgICA8dGQgY2xhc3M9XCJhbnQtZGVzY3JpcHRpb25zLWl0ZW0tbGFiZWxcIiBbY29sU3Bhbl09XCJpdGVtLnNwYW5cIj5cbiAgICAgICAgICAgICAgICAgICAgICA8bmctY29udGFpbmVyICpuelN0cmluZ1RlbXBsYXRlT3V0bGV0PVwiaXRlbS50aXRsZVwiPlxuICAgICAgICAgICAgICAgICAgICAgICAge3sgaXRlbS50aXRsZSB9fVxuICAgICAgICAgICAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgPC9uZy1jb250YWluZXI+XG4gICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICA8dHIgY2xhc3M9XCJhbnQtZGVzY3JpcHRpb25zLXJvd1wiPlxuICAgICAgICAgICAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdGb3I9XCJsZXQgaXRlbSBvZiByb3c7IGxldCBpc0xhc3QgPSBsYXN0XCI+XG4gICAgICAgICAgICAgICAgICAgIDx0ZCBjbGFzcz1cImFudC1kZXNjcmlwdGlvbnMtaXRlbS1jb250ZW50XCIgW2NvbFNwYW5dPVwiaXRlbS5zcGFuXCI+XG4gICAgICAgICAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cIml0ZW0uY29udGVudFwiPjwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgICAgICA8L3RyPlxuICAgICAgICAgICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgICA8L3Rib2R5PlxuICAgICAgPC90YWJsZT5cbiAgICA8L2Rpdj5cbiAgYCxcbiAgaG9zdDoge1xuICAgIGNsYXNzOiAnYW50LWRlc2NyaXB0aW9ucycsXG4gICAgJ1tjbGFzcy5hbnQtZGVzY3JpcHRpb25zLWJvcmRlcmVkXSc6ICduekJvcmRlcmVkJyxcbiAgICAnW2NsYXNzLmFudC1kZXNjcmlwdGlvbnMtbWlkZGxlXSc6ICduelNpemUgPT09IFwibWlkZGxlXCInLFxuICAgICdbY2xhc3MuYW50LWRlc2NyaXB0aW9ucy1zbWFsbF0nOiAnbnpTaXplID09PSBcInNtYWxsXCInLFxuICAgICdbY2xhc3MuYW50LWRlc2NyaXB0aW9ucy1ydGxdJzogJ2RpciA9PT0gXCJydGxcIidcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBOekRlc2NyaXB0aW9uc0NvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgT25EZXN0cm95LCBBZnRlckNvbnRlbnRJbml0LCBPbkluaXQge1xuICByZWFkb25seSBfbnpNb2R1bGVOYW1lOiBOekNvbmZpZ0tleSA9IE5aX0NPTkZJR19NT0RVTEVfTkFNRTtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX256Qm9yZGVyZWQ6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX256Q29sb246IEJvb2xlYW5JbnB1dDtcblxuICBAQ29udGVudENoaWxkcmVuKE56RGVzY3JpcHRpb25zSXRlbUNvbXBvbmVudCkgaXRlbXMhOiBRdWVyeUxpc3Q8TnpEZXNjcmlwdGlvbnNJdGVtQ29tcG9uZW50PjtcblxuICBASW5wdXQoKSBASW5wdXRCb29sZWFuKCkgQFdpdGhDb25maWcoKSBuekJvcmRlcmVkOiBib29sZWFuID0gZmFsc2U7XG4gIEBJbnB1dCgpIG56TGF5b3V0OiBOekRlc2NyaXB0aW9uc0xheW91dCA9ICdob3Jpem9udGFsJztcbiAgQElucHV0KCkgQFdpdGhDb25maWcoKSBuekNvbHVtbjogbnVtYmVyIHwgeyBba2V5IGluIE56QnJlYWtwb2ludEVudW1dOiBudW1iZXIgfSA9IGRlZmF1bHRDb2x1bW5NYXA7XG4gIEBJbnB1dCgpIEBXaXRoQ29uZmlnKCkgbnpTaXplOiBOekRlc2NyaXB0aW9uc1NpemUgPSAnZGVmYXVsdCc7XG4gIEBJbnB1dCgpIG56VGl0bGU6IHN0cmluZyB8IFRlbXBsYXRlUmVmPHZvaWQ+ID0gJyc7XG4gIEBJbnB1dCgpIG56RXh0cmE/OiBzdHJpbmcgfCBUZW1wbGF0ZVJlZjx2b2lkPjtcbiAgQElucHV0KCkgQFdpdGhDb25maWcoKSBASW5wdXRCb29sZWFuKCkgbnpDb2xvbjogYm9vbGVhbiA9IHRydWU7XG5cbiAgaXRlbU1hdHJpeDogTnpEZXNjcmlwdGlvbnNJdGVtUmVuZGVyUHJvcHNbXVtdID0gW107XG4gIHJlYWxDb2x1bW4gPSAzO1xuICBkaXI6IERpcmVjdGlvbiA9ICdsdHInO1xuXG4gIHByaXZhdGUgYnJlYWtwb2ludDogTnpCcmVha3BvaW50RW51bSA9IE56QnJlYWtwb2ludEVudW0ubWQ7XG4gIHByaXZhdGUgZGVzdHJveSQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHB1YmxpYyBuekNvbmZpZ1NlcnZpY2U6IE56Q29uZmlnU2VydmljZSxcbiAgICBwcml2YXRlIGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJpdmF0ZSBicmVha3BvaW50U2VydmljZTogTnpCcmVha3BvaW50U2VydmljZSxcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIGRpcmVjdGlvbmFsaXR5OiBEaXJlY3Rpb25hbGl0eVxuICApIHt9XG4gIG5nT25Jbml0KCk6IHZvaWQge1xuICAgIHRoaXMuZGlyID0gdGhpcy5kaXJlY3Rpb25hbGl0eS52YWx1ZTtcbiAgICB0aGlzLmRpcmVjdGlvbmFsaXR5LmNoYW5nZT8ucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpLnN1YnNjcmliZSgoZGlyZWN0aW9uOiBEaXJlY3Rpb24pID0+IHtcbiAgICAgIHRoaXMuZGlyID0gZGlyZWN0aW9uO1xuICAgIH0pO1xuICB9XG5cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIGlmIChjaGFuZ2VzLm56Q29sdW1uKSB7XG4gICAgICB0aGlzLnByZXBhcmVNYXRyaXgoKTtcbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKTogdm9pZCB7XG4gICAgY29uc3QgY29udGVudENoYW5nZSQgPSB0aGlzLml0ZW1zLmNoYW5nZXMucGlwZShzdGFydFdpdGgodGhpcy5pdGVtcyksIHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSk7XG5cbiAgICBtZXJnZShcbiAgICAgIGNvbnRlbnRDaGFuZ2UkLFxuICAgICAgY29udGVudENoYW5nZSQucGlwZShzd2l0Y2hNYXAoKCkgPT4gbWVyZ2UoLi4udGhpcy5pdGVtcy5tYXAoaSA9PiBpLmlucHV0Q2hhbmdlJCkpLnBpcGUoYXVkaXRUaW1lKDE2KSkpKSxcbiAgICAgIHRoaXMuYnJlYWtwb2ludFNlcnZpY2Uuc3Vic2NyaWJlKGdyaWRSZXNwb25zaXZlTWFwKS5waXBlKHRhcChicCA9PiAodGhpcy5icmVha3BvaW50ID0gYnApKSlcbiAgICApXG4gICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpXG4gICAgICAuc3Vic2NyaWJlKCgpID0+IHtcbiAgICAgICAgdGhpcy5wcmVwYXJlTWF0cml4KCk7XG4gICAgICAgIHRoaXMuY2RyLm1hcmtGb3JDaGVjaygpO1xuICAgICAgfSk7XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLmRlc3Ryb3kkLm5leHQoKTtcbiAgICB0aGlzLmRlc3Ryb3kkLmNvbXBsZXRlKCk7XG4gIH1cblxuICAvKipcbiAgICogUHJlcGFyZSB0aGUgcmVuZGVyIG1hdHJpeCBhY2NvcmRpbmcgdG8gZGVzY3JpcHRpb24gaXRlbXMnIHNwYW5zLlxuICAgKi9cbiAgcHJpdmF0ZSBwcmVwYXJlTWF0cml4KCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5pdGVtcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGxldCBjdXJyZW50Um93OiBOekRlc2NyaXB0aW9uc0l0ZW1SZW5kZXJQcm9wc1tdID0gW107XG4gICAgbGV0IHdpZHRoID0gMDtcblxuICAgIGNvbnN0IGNvbHVtbiA9ICh0aGlzLnJlYWxDb2x1bW4gPSB0aGlzLmdldENvbHVtbigpKTtcbiAgICBjb25zdCBpdGVtcyA9IHRoaXMuaXRlbXMudG9BcnJheSgpO1xuICAgIGNvbnN0IGxlbmd0aCA9IGl0ZW1zLmxlbmd0aDtcbiAgICBjb25zdCBtYXRyaXg6IE56RGVzY3JpcHRpb25zSXRlbVJlbmRlclByb3BzW11bXSA9IFtdO1xuICAgIGNvbnN0IGZsdXNoUm93ID0gKCkgPT4ge1xuICAgICAgbWF0cml4LnB1c2goY3VycmVudFJvdyk7XG4gICAgICBjdXJyZW50Um93ID0gW107XG4gICAgICB3aWR0aCA9IDA7XG4gICAgfTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGNvbnN0IGl0ZW0gPSBpdGVtc1tpXTtcbiAgICAgIGNvbnN0IHsgbnpUaXRsZTogdGl0bGUsIGNvbnRlbnQsIG56U3Bhbjogc3BhbiB9ID0gaXRlbTtcblxuICAgICAgd2lkdGggKz0gc3BhbjtcblxuICAgICAgLy8gSWYgdGhlIGxhc3QgaXRlbSBtYWtlIHRoZSByb3cncyBsZW5ndGggZXhjZWVkcyBgbnpDb2x1bW5gLCB0aGUgbGFzdFxuICAgICAgLy8gaXRlbSBzaG91bGQgdGFrZSBhbGwgdGhlIHNwYWNlIGxlZnQuIFRoaXMgbG9naWMgaXMgaW1wbGVtZW50ZWQgaW4gdGhlIHRlbXBsYXRlLlxuICAgICAgLy8gV2FybiB1c2VyIGFib3V0IHRoYXQuXG4gICAgICBpZiAod2lkdGggPj0gY29sdW1uKSB7XG4gICAgICAgIGlmICh3aWR0aCA+IGNvbHVtbikge1xuICAgICAgICAgIHdhcm4oYFwibnpDb2x1bW5cIiBpcyAke2NvbHVtbn0gYnV0IHdlIGhhdmUgcm93IGxlbmd0aCAke3dpZHRofWApO1xuICAgICAgICB9XG4gICAgICAgIGN1cnJlbnRSb3cucHVzaCh7IHRpdGxlLCBjb250ZW50LCBzcGFuOiBjb2x1bW4gLSAod2lkdGggLSBzcGFuKSB9KTtcbiAgICAgICAgZmx1c2hSb3coKTtcbiAgICAgIH0gZWxzZSBpZiAoaSA9PT0gbGVuZ3RoIC0gMSkge1xuICAgICAgICBjdXJyZW50Um93LnB1c2goeyB0aXRsZSwgY29udGVudCwgc3BhbjogY29sdW1uIC0gKHdpZHRoIC0gc3BhbikgfSk7XG4gICAgICAgIGZsdXNoUm93KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjdXJyZW50Um93LnB1c2goeyB0aXRsZSwgY29udGVudCwgc3BhbiB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLml0ZW1NYXRyaXggPSBtYXRyaXg7XG4gIH1cblxuICBwcml2YXRlIGdldENvbHVtbigpOiBudW1iZXIge1xuICAgIGlmICh0eXBlb2YgdGhpcy5uekNvbHVtbiAhPT0gJ251bWJlcicpIHtcbiAgICAgIHJldHVybiB0aGlzLm56Q29sdW1uW3RoaXMuYnJlYWtwb2ludF07XG4gICAgfVxuXG4gICAgcmV0dXJuIHRoaXMubnpDb2x1bW47XG4gIH1cbn1cbiJdfQ==