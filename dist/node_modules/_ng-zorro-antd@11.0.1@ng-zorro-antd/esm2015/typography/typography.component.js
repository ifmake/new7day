/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { __decorate, __metadata } from "tslib";
import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Input, Optional, Output, Renderer2, TemplateRef, ViewChild, ViewContainerRef, ViewEncapsulation } from '@angular/core';
import { NzConfigService, WithConfig } from 'ng-zorro-antd/core/config';
import { cancelRequestAnimationFrame, reqAnimFrame } from 'ng-zorro-antd/core/polyfill';
import { NzResizeService } from 'ng-zorro-antd/core/services';
import { InputBoolean, InputNumber, isStyleSupport, measure } from 'ng-zorro-antd/core/util';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NzI18nService } from 'ng-zorro-antd/i18n';
import { Directionality } from '@angular/cdk/bidi';
import { NzTextCopyComponent } from './text-copy.component';
import { NzTextEditComponent } from './text-edit.component';
const NZ_CONFIG_MODULE_NAME = 'typography';
const EXPAND_ELEMENT_CLASSNAME = 'ant-typography-expand';
export class NzTypographyComponent {
    constructor(nzConfigService, host, cdr, viewContainerRef, renderer, platform, i18n, document, resizeService, directionality) {
        this.nzConfigService = nzConfigService;
        this.host = host;
        this.cdr = cdr;
        this.viewContainerRef = viewContainerRef;
        this.renderer = renderer;
        this.platform = platform;
        this.i18n = i18n;
        this.resizeService = resizeService;
        this.directionality = directionality;
        this._nzModuleName = NZ_CONFIG_MODULE_NAME;
        this.nzCopyable = false;
        this.nzEditable = false;
        this.nzDisabled = false;
        this.nzExpandable = false;
        this.nzEllipsis = false;
        this.nzCopyTooltips = undefined;
        this.nzCopyIcons = ['copy', 'check'];
        this.nzEditTooltip = undefined;
        this.nzEditIcon = 'edit';
        this.nzEllipsisRows = 1;
        this.nzContentChange = new EventEmitter();
        this.nzCopy = new EventEmitter();
        this.nzExpandChange = new EventEmitter();
        // This is not a two-way binding output with {@link nzEllipsis}
        this.nzOnEllipsis = new EventEmitter();
        this.expandableBtnElementCache = null;
        this.editing = false;
        this.cssEllipsis = false;
        this.isEllipsis = true;
        this.expanded = false;
        this.ellipsisStr = '...';
        this.dir = 'ltr';
        this.viewInit = false;
        this.rfaId = -1;
        this.destroy$ = new Subject();
        this.windowResizeSubscription = Subscription.EMPTY;
        this.document = document;
    }
    get hasEllipsisObservers() {
        return this.nzOnEllipsis.observers.length > 0;
    }
    get canCssEllipsis() {
        return this.nzEllipsis && this.cssEllipsis && !this.expanded && !this.hasEllipsisObservers;
    }
    get hasOperationsWithEllipsis() {
        return (this.nzCopyable || this.nzEditable || this.nzExpandable) && this.nzEllipsis;
    }
    get copyText() {
        return (typeof this.nzCopyText === 'string' ? this.nzCopyText : this.nzContent);
    }
    onTextCopy(text) {
        this.nzCopy.emit(text);
    }
    onStartEditing() {
        this.editing = true;
    }
    onEndEditing(text) {
        this.editing = false;
        this.nzContentChange.emit(text);
        if (this.nzContent === text) {
            this.renderOnNextFrame();
        }
    }
    onExpand() {
        this.isEllipsis = false;
        this.expanded = true;
        this.nzExpandChange.emit();
        this.nzOnEllipsis.emit(false);
    }
    canUseCSSEllipsis() {
        if (this.nzEditable || this.nzCopyable || this.nzExpandable || this.nzSuffix) {
            return false;
        }
        // make sure {@link nzOnEllipsis} works, will force use JS to calculations
        if (this.hasEllipsisObservers) {
            return false;
        }
        if (this.nzEllipsisRows === 1) {
            return isStyleSupport('textOverflow');
        }
        else {
            return isStyleSupport('webkitLineClamp');
        }
    }
    renderOnNextFrame() {
        cancelRequestAnimationFrame(this.rfaId);
        if (!this.viewInit || !this.nzEllipsis || this.nzEllipsisRows < 0 || this.expanded || !this.platform.isBrowser) {
            return;
        }
        this.rfaId = reqAnimFrame(() => {
            this.syncEllipsis();
        });
    }
    getOriginContentViewRef() {
        const viewRef = this.viewContainerRef.createEmbeddedView(this.contentTemplate, {
            content: this.nzContent
        });
        viewRef.detectChanges();
        return {
            viewRef,
            removeView: () => {
                this.viewContainerRef.remove(this.viewContainerRef.indexOf(viewRef));
            }
        };
    }
    syncEllipsis() {
        if (this.cssEllipsis) {
            return;
        }
        const { viewRef, removeView } = this.getOriginContentViewRef();
        const fixedNodes = [this.textCopyRef, this.textEditRef].filter(e => e && e.nativeElement).map(e => e.nativeElement);
        const expandableBtnElement = this.getExpandableBtnElement();
        if (expandableBtnElement) {
            fixedNodes.push(expandableBtnElement);
        }
        const { contentNodes, text, ellipsis } = measure(this.host.nativeElement, this.nzEllipsisRows, viewRef.rootNodes, fixedNodes, this.ellipsisStr, this.nzSuffix);
        removeView();
        this.ellipsisText = text;
        if (ellipsis !== this.isEllipsis) {
            this.isEllipsis = ellipsis;
            this.nzOnEllipsis.emit(ellipsis);
        }
        const ellipsisContainerNativeElement = this.ellipsisContainer.nativeElement;
        while (ellipsisContainerNativeElement.firstChild) {
            this.renderer.removeChild(ellipsisContainerNativeElement, ellipsisContainerNativeElement.firstChild);
        }
        contentNodes.forEach(n => {
            this.renderer.appendChild(ellipsisContainerNativeElement, n.cloneNode(true));
        });
        this.cdr.markForCheck();
    }
    // Need to create the element for calculation size before view init
    getExpandableBtnElement() {
        if (this.nzExpandable) {
            const expandText = this.locale ? this.locale.expand : '';
            const cache = this.expandableBtnElementCache;
            if (!cache || cache.innerText === expandText) {
                const el = this.document.createElement('a');
                el.className = EXPAND_ELEMENT_CLASSNAME;
                el.innerText = expandText;
                this.expandableBtnElementCache = el;
            }
            return this.expandableBtnElementCache;
        }
        else {
            this.expandableBtnElementCache = null;
            return null;
        }
    }
    renderAndSubscribeWindowResize() {
        if (this.platform.isBrowser) {
            this.windowResizeSubscription.unsubscribe();
            this.cssEllipsis = this.canUseCSSEllipsis();
            this.renderOnNextFrame();
            this.windowResizeSubscription = this.resizeService
                .subscribe()
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => this.renderOnNextFrame());
        }
    }
    ngOnInit() {
        var _a;
        this.i18n.localeChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.locale = this.i18n.getLocaleData('Text');
            this.cdr.markForCheck();
        });
        (_a = this.directionality.change) === null || _a === void 0 ? void 0 : _a.pipe(takeUntil(this.destroy$)).subscribe((direction) => {
            this.dir = direction;
            this.cdr.detectChanges();
        });
        this.dir = this.directionality.value;
    }
    ngAfterViewInit() {
        this.viewInit = true;
        this.renderAndSubscribeWindowResize();
    }
    ngOnChanges(changes) {
        const { nzCopyable, nzEditable, nzExpandable, nzEllipsis, nzContent, nzEllipsisRows, nzSuffix } = changes;
        if (nzCopyable || nzEditable || nzExpandable || nzEllipsis || nzContent || nzEllipsisRows || nzSuffix) {
            if (this.nzEllipsis) {
                if (this.expanded) {
                    this.windowResizeSubscription.unsubscribe();
                }
                else {
                    this.renderAndSubscribeWindowResize();
                }
            }
        }
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
        this.expandableBtnElementCache = null;
        this.windowResizeSubscription.unsubscribe();
    }
}
NzTypographyComponent.decorators = [
    { type: Component, args: [{
                selector: `
  nz-typography,
  [nz-typography],
  p[nz-paragraph],
  span[nz-text],
  h1[nz-title], h2[nz-title], h3[nz-title], h4[nz-title]
  `,
                exportAs: 'nzTypography',
                template: `
    <ng-template #contentTemplate let-content="content">
      <ng-content *ngIf="!content"></ng-content>
      {{ content }}
    </ng-template>
    <ng-container *ngIf="!editing">
      <ng-container
        *ngIf="
          expanded ||
            (!hasOperationsWithEllipsis && nzEllipsisRows === 1 && !hasEllipsisObservers) ||
            canCssEllipsis ||
            (nzSuffix && expanded);
          else jsEllipsis
        "
      >
        <ng-template [ngTemplateOutlet]="contentTemplate" [ngTemplateOutletContext]="{ content: nzContent }"></ng-template>
        <ng-container *ngIf="nzSuffix">{{ nzSuffix }}</ng-container>
      </ng-container>
      <ng-template #jsEllipsis>
        <span #ellipsisContainer></span>
        <ng-container *ngIf="isEllipsis">{{ ellipsisStr }}</ng-container>
        <ng-container *ngIf="nzSuffix">{{ nzSuffix }}</ng-container>
        <a #expandable *ngIf="nzExpandable && isEllipsis" class="ant-typography-expand" (click)="onExpand()">{{ locale?.expand }}</a>
      </ng-template>
    </ng-container>

    <nz-text-edit
      *ngIf="nzEditable"
      [text]="nzContent"
      [icon]="nzEditIcon"
      [tooltip]="nzEditTooltip"
      (endEditing)="onEndEditing($event)"
      (startEditing)="onStartEditing()"
    ></nz-text-edit>

    <nz-text-copy
      *ngIf="nzCopyable && !editing"
      [text]="copyText"
      [tooltips]="nzCopyTooltips"
      [icons]="nzCopyIcons"
      (textCopy)="onTextCopy($event)"
    ></nz-text-copy>
  `,
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                preserveWhitespaces: false,
                host: {
                    '[class.ant-typography]': '!editing',
                    '[class.ant-typography-rtl]': 'dir === "rtl"',
                    '[class.ant-typography-edit-content]': 'editing',
                    '[class.ant-typography-secondary]': 'nzType === "secondary"',
                    '[class.ant-typography-warning]': 'nzType === "warning"',
                    '[class.ant-typography-danger]': 'nzType === "danger"',
                    '[class.ant-typography-success]': 'nzType === "success"',
                    '[class.ant-typography-disabled]': 'nzDisabled',
                    '[class.ant-typography-ellipsis]': 'nzEllipsis && !expanded',
                    '[class.ant-typography-ellipsis-single-line]': 'canCssEllipsis && nzEllipsisRows === 1',
                    '[class.ant-typography-ellipsis-multiple-line]': 'canCssEllipsis && nzEllipsisRows > 1',
                    '[style.-webkit-line-clamp]': '(canCssEllipsis && nzEllipsisRows > 1) ? nzEllipsisRows : null'
                }
            },] }
];
NzTypographyComponent.ctorParameters = () => [
    { type: NzConfigService },
    { type: ElementRef },
    { type: ChangeDetectorRef },
    { type: ViewContainerRef },
    { type: Renderer2 },
    { type: Platform },
    { type: NzI18nService },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
    { type: NzResizeService },
    { type: Directionality, decorators: [{ type: Optional }] }
];
NzTypographyComponent.propDecorators = {
    nzCopyable: [{ type: Input }],
    nzEditable: [{ type: Input }],
    nzDisabled: [{ type: Input }],
    nzExpandable: [{ type: Input }],
    nzEllipsis: [{ type: Input }],
    nzCopyTooltips: [{ type: Input }],
    nzCopyIcons: [{ type: Input }],
    nzEditTooltip: [{ type: Input }],
    nzEditIcon: [{ type: Input }],
    nzContent: [{ type: Input }],
    nzEllipsisRows: [{ type: Input }],
    nzType: [{ type: Input }],
    nzCopyText: [{ type: Input }],
    nzSuffix: [{ type: Input }],
    nzContentChange: [{ type: Output }],
    nzCopy: [{ type: Output }],
    nzExpandChange: [{ type: Output }],
    nzOnEllipsis: [{ type: Output }],
    textEditRef: [{ type: ViewChild, args: [NzTextEditComponent, { static: false },] }],
    textCopyRef: [{ type: ViewChild, args: [NzTextCopyComponent, { static: false },] }],
    ellipsisContainer: [{ type: ViewChild, args: ['ellipsisContainer', { static: false },] }],
    expandableBtn: [{ type: ViewChild, args: ['expandable', { static: false },] }],
    contentTemplate: [{ type: ViewChild, args: ['contentTemplate', { static: false },] }]
};
__decorate([
    InputBoolean(),
    __metadata("design:type", Object)
], NzTypographyComponent.prototype, "nzCopyable", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Object)
], NzTypographyComponent.prototype, "nzEditable", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Object)
], NzTypographyComponent.prototype, "nzDisabled", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Object)
], NzTypographyComponent.prototype, "nzExpandable", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Object)
], NzTypographyComponent.prototype, "nzEllipsis", void 0);
__decorate([
    WithConfig(),
    __metadata("design:type", Object)
], NzTypographyComponent.prototype, "nzCopyTooltips", void 0);
__decorate([
    WithConfig(),
    __metadata("design:type", Array)
], NzTypographyComponent.prototype, "nzCopyIcons", void 0);
__decorate([
    WithConfig(),
    __metadata("design:type", Object)
], NzTypographyComponent.prototype, "nzEditTooltip", void 0);
__decorate([
    WithConfig(),
    __metadata("design:type", Object)
], NzTypographyComponent.prototype, "nzEditIcon", void 0);
__decorate([
    WithConfig(),
    InputNumber(),
    __metadata("design:type", Number)
], NzTypographyComponent.prototype, "nzEllipsisRows", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwb2dyYXBoeS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vY29tcG9uZW50cy90eXBvZ3JhcGh5LyIsInNvdXJjZXMiOlsidHlwb2dyYXBoeS5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHOztBQUVILE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSx1QkFBdUIsQ0FBQztBQUNqRCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUVMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULFVBQVUsRUFFVixZQUFZLEVBQ1osTUFBTSxFQUNOLEtBQUssRUFJTCxRQUFRLEVBQ1IsTUFBTSxFQUNOLFNBQVMsRUFFVCxXQUFXLEVBQ1gsU0FBUyxFQUNULGdCQUFnQixFQUNoQixpQkFBaUIsRUFDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFlLGVBQWUsRUFBRSxVQUFVLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNyRixPQUFPLEVBQUUsMkJBQTJCLEVBQUUsWUFBWSxFQUFFLE1BQU0sNkJBQTZCLENBQUM7QUFDeEYsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBRTlELE9BQU8sRUFBRSxZQUFZLEVBQUUsV0FBVyxFQUFFLGNBQWMsRUFBRSxPQUFPLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUU3RixPQUFPLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUM3QyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFM0MsT0FBTyxFQUFFLGFBQWEsRUFBdUIsTUFBTSxvQkFBb0IsQ0FBQztBQUV4RSxPQUFPLEVBQWEsY0FBYyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDOUQsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDNUQsT0FBTyxFQUFF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Ozs2REFBNEIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vZ2l0aHViLmNvbS9ORy1aT1JSTy9uZy16b3Jyby1hbnRkL2Jsb2IvbWFzdGVyL0xJQ0VOU0VcbiAqL1xuXG5pbXBvcnQgeyBQbGF0Zm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBBZnRlclZpZXdJbml0LFxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgRW1iZWRkZWRWaWV3UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIEluamVjdCxcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBPdXRwdXQsXG4gIFJlbmRlcmVyMixcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0NvbnRhaW5lclJlZixcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOekNvbmZpZ0tleSwgTnpDb25maWdTZXJ2aWNlLCBXaXRoQ29uZmlnIH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL2NvbmZpZyc7XG5pbXBvcnQgeyBjYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUsIHJlcUFuaW1GcmFtZSB9IGZyb20gJ25nLXpvcnJvLWFudGQvY29yZS9wb2x5ZmlsbCc7XG5pbXBvcnQgeyBOelJlc2l6ZVNlcnZpY2UgfSBmcm9tICduZy16b3Jyby1hbnRkL2NvcmUvc2VydmljZXMnO1xuaW1wb3J0IHsgQm9vbGVhbklucHV0LCBOdW1iZXJJbnB1dCwgTnpTYWZlQW55LCBOelRTVHlwZSB9IGZyb20gJ25nLXpvcnJvLWFudGQvY29yZS90eXBlcyc7XG5pbXBvcnQgeyBJbnB1dEJvb2xlYW4sIElucHV0TnVtYmVyLCBpc1N0eWxlU3VwcG9ydCwgbWVhc3VyZSB9IGZyb20gJ25nLXpvcnJvLWFudGQvY29yZS91dGlsJztcblxuaW1wb3J0IHsgU3ViamVjdCwgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7IE56STE4blNlcnZpY2UsIE56VGV4dEkxOG5JbnRlcmZhY2UgfSBmcm9tICduZy16b3Jyby1hbnRkL2kxOG4nO1xuXG5pbXBvcnQgeyBEaXJlY3Rpb24sIERpcmVjdGlvbmFsaXR5IH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2JpZGknO1xuaW1wb3J0IHsgTnpUZXh0Q29weUNvbXBvbmVudCB9IGZyb20gJy4vdGV4dC1jb3B5LmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOelRleHRFZGl0Q29tcG9uZW50IH0gZnJvbSAnLi90ZXh0LWVkaXQuY29tcG9uZW50JztcblxuY29uc3QgTlpfQ09ORklHX01PRFVMRV9OQU1FOiBOekNvbmZpZ0tleSA9ICd0eXBvZ3JhcGh5JztcbmNvbnN0IEVYUEFORF9FTEVNRU5UX0NMQVNTTkFNRSA9ICdhbnQtdHlwb2dyYXBoeS1leHBhbmQnO1xuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6IGBcbiAgbnotdHlwb2dyYXBoeSxcbiAgW256LXR5cG9ncmFwaHldLFxuICBwW256LXBhcmFncmFwaF0sXG4gIHNwYW5bbnotdGV4dF0sXG4gIGgxW256LXRpdGxlXSwgaDJbbnotdGl0bGVdLCBoM1tuei10aXRsZV0sIGg0W256LXRpdGxlXVxuICBgLFxuICBleHBvcnRBczogJ256VHlwb2dyYXBoeScsXG4gIHRlbXBsYXRlOiBgXG4gICAgPG5nLXRlbXBsYXRlICNjb250ZW50VGVtcGxhdGUgbGV0LWNvbnRlbnQ9XCJjb250ZW50XCI+XG4gICAgICA8bmctY29udGVudCAqbmdJZj1cIiFjb250ZW50XCI+PC9uZy1jb250ZW50PlxuICAgICAge3sgY29udGVudCB9fVxuICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIiFlZGl0aW5nXCI+XG4gICAgICA8bmctY29udGFpbmVyXG4gICAgICAgICpuZ0lmPVwiXG4gICAgICAgICAgZXhwYW5kZWQgfHxcbiAgICAgICAgICAgICghaGFzT3BlcmF0aW9uc1dpdGhFbGxpcHNpcyAmJiBuekVsbGlwc2lzUm93cyA9PT0gMSAmJiAhaGFzRWxsaXBzaXNPYnNlcnZlcnMpIHx8XG4gICAgICAgICAgICBjYW5Dc3NFbGxpcHNpcyB8fFxuICAgICAgICAgICAgKG56U3VmZml4ICYmIGV4cGFuZGVkKTtcbiAgICAgICAgICBlbHNlIGpzRWxsaXBzaXNcbiAgICAgICAgXCJcbiAgICAgID5cbiAgICAgICAgPG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImNvbnRlbnRUZW1wbGF0ZVwiIFtuZ1RlbXBsYXRlT3V0bGV0Q29udGV4dF09XCJ7IGNvbnRlbnQ6IG56Q29udGVudCB9XCI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgICAgPG5nLWNvbnRhaW5lciAqbmdJZj1cIm56U3VmZml4XCI+e3sgbnpTdWZmaXggfX08L25nLWNvbnRhaW5lcj5cbiAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgPG5nLXRlbXBsYXRlICNqc0VsbGlwc2lzPlxuICAgICAgICA8c3BhbiAjZWxsaXBzaXNDb250YWluZXI+PC9zcGFuPlxuICAgICAgICA8bmctY29udGFpbmVyICpuZ0lmPVwiaXNFbGxpcHNpc1wiPnt7IGVsbGlwc2lzU3RyIH19PC9uZy1jb250YWluZXI+XG4gICAgICAgIDxuZy1jb250YWluZXIgKm5nSWY9XCJuelN1ZmZpeFwiPnt7IG56U3VmZml4IH19PC9uZy1jb250YWluZXI+XG4gICAgICAgIDxhICNleHBhbmRhYmxlICpuZ0lmPVwibnpFeHBhbmRhYmxlICYmIGlzRWxsaXBzaXNcIiBjbGFzcz1cImFudC10eXBvZ3JhcGh5LWV4cGFuZFwiIChjbGljayk9XCJvbkV4cGFuZCgpXCI+e3sgbG9jYWxlPy5leHBhbmQgfX08L2E+XG4gICAgICA8L25nLXRlbXBsYXRlPlxuICAgIDwvbmctY29udGFpbmVyPlxuXG4gICAgPG56LXRleHQtZWRpdFxuICAgICAgKm5nSWY9XCJuekVkaXRhYmxlXCJcbiAgICAgIFt0ZXh0XT1cIm56Q29udGVudFwiXG4gICAgICBbaWNvbl09XCJuekVkaXRJY29uXCJcbiAgICAgIFt0b29sdGlwXT1cIm56RWRpdFRvb2x0aXBcIlxuICAgICAgKGVuZEVkaXRpbmcpPVwib25FbmRFZGl0aW5nKCRldmVudClcIlxuICAgICAgKHN0YXJ0RWRpdGluZyk9XCJvblN0YXJ0RWRpdGluZygpXCJcbiAgICA+PC9uei10ZXh0LWVkaXQ+XG5cbiAgICA8bnotdGV4dC1jb3B5XG4gICAgICAqbmdJZj1cIm56Q29weWFibGUgJiYgIWVkaXRpbmdcIlxuICAgICAgW3RleHRdPVwiY29weVRleHRcIlxuICAgICAgW3Rvb2x0aXBzXT1cIm56Q29weVRvb2x0aXBzXCJcbiAgICAgIFtpY29uc109XCJuekNvcHlJY29uc1wiXG4gICAgICAodGV4dENvcHkpPVwib25UZXh0Q29weSgkZXZlbnQpXCJcbiAgICA+PC9uei10ZXh0LWNvcHk+XG4gIGAsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbi5Ob25lLFxuICBwcmVzZXJ2ZVdoaXRlc3BhY2VzOiBmYWxzZSxcbiAgaG9zdDoge1xuICAgICdbY2xhc3MuYW50LXR5cG9ncmFwaHldJzogJyFlZGl0aW5nJyxcbiAgICAnW2NsYXNzLmFudC10eXBvZ3JhcGh5LXJ0bF0nOiAnZGlyID09PSBcInJ0bFwiJyxcbiAgICAnW2NsYXNzLmFudC10eXBvZ3JhcGh5LWVkaXQtY29udGVudF0nOiAnZWRpdGluZycsXG4gICAgJ1tjbGFzcy5hbnQtdHlwb2dyYXBoeS1zZWNvbmRhcnldJzogJ256VHlwZSA9PT0gXCJzZWNvbmRhcnlcIicsXG4gICAgJ1tjbGFzcy5hbnQtdHlwb2dyYXBoeS13YXJuaW5nXSc6ICduelR5cGUgPT09IFwid2FybmluZ1wiJyxcbiAgICAnW2NsYXNzLmFudC10eXBvZ3JhcGh5LWRhbmdlcl0nOiAnbnpUeXBlID09PSBcImRhbmdlclwiJyxcbiAgICAnW2NsYXNzLmFudC10eXBvZ3JhcGh5LXN1Y2Nlc3NdJzogJ256VHlwZSA9PT0gXCJzdWNjZXNzXCInLFxuICAgICdbY2xhc3MuYW50LXR5cG9ncmFwaHktZGlzYWJsZWRdJzogJ256RGlzYWJsZWQnLFxuICAgICdbY2xhc3MuYW50LXR5cG9ncmFwaHktZWxsaXBzaXNdJzogJ256RWxsaXBzaXMgJiYgIWV4cGFuZGVkJyxcbiAgICAnW2NsYXNzLmFudC10eXBvZ3JhcGh5LWVsbGlwc2lzLXNpbmdsZS1saW5lXSc6ICdjYW5Dc3NFbGxpcHNpcyAmJiBuekVsbGlwc2lzUm93cyA9PT0gMScsXG4gICAgJ1tjbGFzcy5hbnQtdHlwb2dyYXBoeS1lbGxpcHNpcy1tdWx0aXBsZS1saW5lXSc6ICdjYW5Dc3NFbGxpcHNpcyAmJiBuekVsbGlwc2lzUm93cyA+IDEnLFxuICAgICdbc3R5bGUuLXdlYmtpdC1saW5lLWNsYW1wXSc6ICcoY2FuQ3NzRWxsaXBzaXMgJiYgbnpFbGxpcHNpc1Jvd3MgPiAxKSA/IG56RWxsaXBzaXNSb3dzIDogbnVsbCdcbiAgfVxufSlcbmV4cG9ydCBjbGFzcyBOelR5cG9ncmFwaHlDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSwgT25DaGFuZ2VzIHtcbiAgcmVhZG9ubHkgX256TW9kdWxlTmFtZTogTnpDb25maWdLZXkgPSBOWl9DT05GSUdfTU9EVUxFX05BTUU7XG5cbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX256Q29weWFibGU6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX256RWRpdGFibGU6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX256RGlzYWJsZWQ6IEJvb2xlYW5JbnB1dDtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX256RXhwYW5kYWJsZTogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbnpFbGxpcHNpczogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbnpFbGxpcHNpc1Jvd3M6IE51bWJlcklucHV0O1xuXG4gIEBJbnB1dCgpIEBJbnB1dEJvb2xlYW4oKSBuekNvcHlhYmxlID0gZmFsc2U7XG4gIEBJbnB1dCgpIEBJbnB1dEJvb2xlYW4oKSBuekVkaXRhYmxlID0gZmFsc2U7XG4gIEBJbnB1dCgpIEBJbnB1dEJvb2xlYW4oKSBuekRpc2FibGVkID0gZmFsc2U7XG4gIEBJbnB1dCgpIEBJbnB1dEJvb2xlYW4oKSBuekV4cGFuZGFibGUgPSBmYWxzZTtcbiAgQElucHV0KCkgQElucHV0Qm9vbGVhbigpIG56RWxsaXBzaXMgPSBmYWxzZTtcbiAgQElucHV0KCkgQFdpdGhDb25maWcoKSBuekNvcHlUb29sdGlwcz86IFtOelRTVHlwZSwgTnpUU1R5cGVdIHwgbnVsbCA9IHVuZGVmaW5lZDtcbiAgQElucHV0KCkgQFdpdGhDb25maWcoKSBuekNvcHlJY29uczogW056VFNUeXBlLCBOelRTVHlwZV0gPSBbJ2NvcHknLCAnY2hlY2snXTtcbiAgQElucHV0KCkgQFdpdGhDb25maWcoKSBuekVkaXRUb29sdGlwPzogbnVsbCB8IE56VFNUeXBlID0gdW5kZWZpbmVkO1xuICBASW5wdXQoKSBAV2l0aENvbmZpZygpIG56RWRpdEljb246IE56VFNUeXBlID0gJ2VkaXQnO1xuICBASW5wdXQoKSBuekNvbnRlbnQ/OiBzdHJpbmc7XG4gIEBJbnB1dCgpIEBXaXRoQ29uZmlnKCkgQElucHV0TnVtYmVyKCkgbnpFbGxpcHNpc1Jvd3M6IG51bWJlciA9IDE7XG4gIEBJbnB1dCgpIG56VHlwZTogJ3NlY29uZGFyeScgfCAnd2FybmluZycgfCAnZGFuZ2VyJyB8ICdzdWNjZXNzJyB8IHVuZGVmaW5lZDtcbiAgQElucHV0KCkgbnpDb3B5VGV4dDogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICBASW5wdXQoKSBuelN1ZmZpeDogc3RyaW5nIHwgdW5kZWZpbmVkO1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgbnpDb250ZW50Q2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjxzdHJpbmc+KCk7XG4gIEBPdXRwdXQoKSByZWFkb25seSBuekNvcHkgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZz4oKTtcbiAgQE91dHB1dCgpIHJlYWRvbmx5IG56RXhwYW5kQ2hhbmdlID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuICAvLyBUaGlzIGlzIG5vdCBhIHR3by13YXkgYmluZGluZyBvdXRwdXQgd2l0aCB7QGxpbmsgbnpFbGxpcHNpc31cbiAgQE91dHB1dCgpIHJlYWRvbmx5IG56T25FbGxpcHNpcyA9IG5ldyBFdmVudEVtaXR0ZXI8Ym9vbGVhbj4oKTtcblxuICBAVmlld0NoaWxkKE56VGV4dEVkaXRDb21wb25lbnQsIHsgc3RhdGljOiBmYWxzZSB9KSB0ZXh0RWRpdFJlZj86IE56VGV4dEVkaXRDb21wb25lbnQ7XG4gIEBWaWV3Q2hpbGQoTnpUZXh0Q29weUNvbXBvbmVudCwgeyBzdGF0aWM6IGZhbHNlIH0pIHRleHRDb3B5UmVmPzogTnpUZXh0Q29weUNvbXBvbmVudDtcbiAgQFZpZXdDaGlsZCgnZWxsaXBzaXNDb250YWluZXInLCB7IHN0YXRpYzogZmFsc2UgfSkgZWxsaXBzaXNDb250YWluZXI/OiBFbGVtZW50UmVmPEhUTUxTcGFuRWxlbWVudD47XG4gIEBWaWV3Q2hpbGQoJ2V4cGFuZGFibGUnLCB7IHN0YXRpYzogZmFsc2UgfSkgZXhwYW5kYWJsZUJ0bj86IEVsZW1lbnRSZWY8SFRNTFNwYW5FbGVtZW50PjtcbiAgQFZpZXdDaGlsZCgnY29udGVudFRlbXBsYXRlJywgeyBzdGF0aWM6IGZhbHNlIH0pIGNvbnRlbnRUZW1wbGF0ZT86IFRlbXBsYXRlUmVmPHsgY29udGVudDogc3RyaW5nIH0+O1xuXG4gIGxvY2FsZSE6IE56VGV4dEkxOG5JbnRlcmZhY2U7XG4gIGRvY3VtZW50OiBEb2N1bWVudDtcbiAgZXhwYW5kYWJsZUJ0bkVsZW1lbnRDYWNoZTogSFRNTEVsZW1lbnQgfCBudWxsID0gbnVsbDtcbiAgZWRpdGluZyA9IGZhbHNlO1xuICBlbGxpcHNpc1RleHQ6IHN0cmluZyB8IHVuZGVmaW5lZDtcbiAgY3NzRWxsaXBzaXM6IGJvb2xlYW4gPSBmYWxzZTtcbiAgaXNFbGxpcHNpczogYm9vbGVhbiA9IHRydWU7XG4gIGV4cGFuZGVkOiBib29sZWFuID0gZmFsc2U7XG4gIGVsbGlwc2lzU3RyID0gJy4uLic7XG4gIGRpcjogRGlyZWN0aW9uID0gJ2x0cic7XG5cbiAgZ2V0IGhhc0VsbGlwc2lzT2JzZXJ2ZXJzKCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiB0aGlzLm56T25FbGxpcHNpcy5vYnNlcnZlcnMubGVuZ3RoID4gMDtcbiAgfVxuXG4gIGdldCBjYW5Dc3NFbGxpcHNpcygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gdGhpcy5uekVsbGlwc2lzICYmIHRoaXMuY3NzRWxsaXBzaXMgJiYgIXRoaXMuZXhwYW5kZWQgJiYgIXRoaXMuaGFzRWxsaXBzaXNPYnNlcnZlcnM7XG4gIH1cblxuICBnZXQgaGFzT3BlcmF0aW9uc1dpdGhFbGxpcHNpcygpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKHRoaXMubnpDb3B5YWJsZSB8fCB0aGlzLm56RWRpdGFibGUgfHwgdGhpcy5uekV4cGFuZGFibGUpICYmIHRoaXMubnpFbGxpcHNpcztcbiAgfVxuXG4gIHByaXZhdGUgdmlld0luaXQgPSBmYWxzZTtcbiAgcHJpdmF0ZSByZmFJZDogbnVtYmVyID0gLTE7XG4gIHByaXZhdGUgZGVzdHJveSQgPSBuZXcgU3ViamVjdCgpO1xuICBwcml2YXRlIHdpbmRvd1Jlc2l6ZVN1YnNjcmlwdGlvbiA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcbiAgZ2V0IGNvcHlUZXh0KCk6IHN0cmluZyB7XG4gICAgcmV0dXJuICh0eXBlb2YgdGhpcy5uekNvcHlUZXh0ID09PSAnc3RyaW5nJyA/IHRoaXMubnpDb3B5VGV4dCA6IHRoaXMubnpDb250ZW50KSE7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgbnpDb25maWdTZXJ2aWNlOiBOekNvbmZpZ1NlcnZpY2UsXG4gICAgcHJpdmF0ZSBob3N0OiBFbGVtZW50UmVmPEhUTUxFbGVtZW50PixcbiAgICBwcml2YXRlIGNkcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gICAgcHJpdmF0ZSB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIHByaXZhdGUgcmVuZGVyZXI6IFJlbmRlcmVyMixcbiAgICBwcml2YXRlIHBsYXRmb3JtOiBQbGF0Zm9ybSxcbiAgICBwcml2YXRlIGkxOG46IE56STE4blNlcnZpY2UsXG4gICAgQEluamVjdChET0NVTUVOVCkgZG9jdW1lbnQ6IE56U2FmZUFueSxcbiAgICBwcml2YXRlIHJlc2l6ZVNlcnZpY2U6IE56UmVzaXplU2VydmljZSxcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIGRpcmVjdGlvbmFsaXR5OiBEaXJlY3Rpb25hbGl0eVxuICApIHtcbiAgICB0aGlzLmRvY3VtZW50ID0gZG9jdW1lbnQ7XG4gIH1cblxuICBvblRleHRDb3B5KHRleHQ6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMubnpDb3B5LmVtaXQodGV4dCk7XG4gIH1cblxuICBvblN0YXJ0RWRpdGluZygpOiB2b2lkIHtcbiAgICB0aGlzLmVkaXRpbmcgPSB0cnVlO1xuICB9XG5cbiAgb25FbmRFZGl0aW5nKHRleHQ6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuZWRpdGluZyA9IGZhbHNlO1xuICAgIHRoaXMubnpDb250ZW50Q2hhbmdlLmVtaXQodGV4dCk7XG4gICAgaWYgKHRoaXMubnpDb250ZW50ID09PSB0ZXh0KSB7XG4gICAgICB0aGlzLnJlbmRlck9uTmV4dEZyYW1lKCk7XG4gICAgfVxuICB9XG5cbiAgb25FeHBhbmQoKTogdm9pZCB7XG4gICAgdGhpcy5pc0VsbGlwc2lzID0gZmFsc2U7XG4gICAgdGhpcy5leHBhbmRlZCA9IHRydWU7XG4gICAgdGhpcy5uekV4cGFuZENoYW5nZS5lbWl0KCk7XG4gICAgdGhpcy5uek9uRWxsaXBzaXMuZW1pdChmYWxzZSk7XG4gIH1cblxuICBjYW5Vc2VDU1NFbGxpcHNpcygpOiBib29sZWFuIHtcbiAgICBpZiAodGhpcy5uekVkaXRhYmxlIHx8IHRoaXMubnpDb3B5YWJsZSB8fCB0aGlzLm56RXhwYW5kYWJsZSB8fCB0aGlzLm56U3VmZml4KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIC8vIG1ha2Ugc3VyZSB7QGxpbmsgbnpPbkVsbGlwc2lzfSB3b3Jrcywgd2lsbCBmb3JjZSB1c2UgSlMgdG8gY2FsY3VsYXRpb25zXG4gICAgaWYgKHRoaXMuaGFzRWxsaXBzaXNPYnNlcnZlcnMpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgaWYgKHRoaXMubnpFbGxpcHNpc1Jvd3MgPT09IDEpIHtcbiAgICAgIHJldHVybiBpc1N0eWxlU3VwcG9ydCgndGV4dE92ZXJmbG93Jyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBpc1N0eWxlU3VwcG9ydCgnd2Via2l0TGluZUNsYW1wJyk7XG4gICAgfVxuICB9XG5cbiAgcmVuZGVyT25OZXh0RnJhbWUoKTogdm9pZCB7XG4gICAgY2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lKHRoaXMucmZhSWQpO1xuICAgIGlmICghdGhpcy52aWV3SW5pdCB8fCAhdGhpcy5uekVsbGlwc2lzIHx8IHRoaXMubnpFbGxpcHNpc1Jvd3MgPCAwIHx8IHRoaXMuZXhwYW5kZWQgfHwgIXRoaXMucGxhdGZvcm0uaXNCcm93c2VyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHRoaXMucmZhSWQgPSByZXFBbmltRnJhbWUoKCkgPT4ge1xuICAgICAgdGhpcy5zeW5jRWxsaXBzaXMoKTtcbiAgICB9KTtcbiAgfVxuXG4gIGdldE9yaWdpbkNvbnRlbnRWaWV3UmVmKCk6IHsgdmlld1JlZjogRW1iZWRkZWRWaWV3UmVmPHsgY29udGVudDogc3RyaW5nIH0+OyByZW1vdmVWaWV3KCk6IHZvaWQgfSB7XG4gICAgY29uc3Qgdmlld1JlZiA9IHRoaXMudmlld0NvbnRhaW5lclJlZi5jcmVhdGVFbWJlZGRlZFZpZXc8eyBjb250ZW50OiBzdHJpbmcgfT4odGhpcy5jb250ZW50VGVtcGxhdGUhLCB7XG4gICAgICBjb250ZW50OiB0aGlzLm56Q29udGVudCFcbiAgICB9KTtcbiAgICB2aWV3UmVmLmRldGVjdENoYW5nZXMoKTtcbiAgICByZXR1cm4ge1xuICAgICAgdmlld1JlZixcbiAgICAgIHJlbW92ZVZpZXc6ICgpID0+IHtcbiAgICAgICAgdGhpcy52aWV3Q29udGFpbmVyUmVmLnJlbW92ZSh0aGlzLnZpZXdDb250YWluZXJSZWYuaW5kZXhPZih2aWV3UmVmKSk7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHN5bmNFbGxpcHNpcygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5jc3NFbGxpcHNpcykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBjb25zdCB7IHZpZXdSZWYsIHJlbW92ZVZpZXcgfSA9IHRoaXMuZ2V0T3JpZ2luQ29udGVudFZpZXdSZWYoKTtcbiAgICBjb25zdCBmaXhlZE5vZGVzID0gW3RoaXMudGV4dENvcHlSZWYsIHRoaXMudGV4dEVkaXRSZWZdLmZpbHRlcihlID0+IGUgJiYgZS5uYXRpdmVFbGVtZW50KS5tYXAoZSA9PiBlIS5uYXRpdmVFbGVtZW50KTtcbiAgICBjb25zdCBleHBhbmRhYmxlQnRuRWxlbWVudCA9IHRoaXMuZ2V0RXhwYW5kYWJsZUJ0bkVsZW1lbnQoKTtcbiAgICBpZiAoZXhwYW5kYWJsZUJ0bkVsZW1lbnQpIHtcbiAgICAgIGZpeGVkTm9kZXMucHVzaChleHBhbmRhYmxlQnRuRWxlbWVudCk7XG4gICAgfVxuICAgIGNvbnN0IHsgY29udGVudE5vZGVzLCB0ZXh0LCBlbGxpcHNpcyB9ID0gbWVhc3VyZShcbiAgICAgIHRoaXMuaG9zdC5uYXRpdmVFbGVtZW50LFxuICAgICAgdGhpcy5uekVsbGlwc2lzUm93cyxcbiAgICAgIHZpZXdSZWYucm9vdE5vZGVzLFxuICAgICAgZml4ZWROb2RlcyxcbiAgICAgIHRoaXMuZWxsaXBzaXNTdHIsXG4gICAgICB0aGlzLm56U3VmZml4XG4gICAgKTtcblxuICAgIHJlbW92ZVZpZXcoKTtcblxuICAgIHRoaXMuZWxsaXBzaXNUZXh0ID0gdGV4dDtcbiAgICBpZiAoZWxsaXBzaXMgIT09IHRoaXMuaXNFbGxpcHNpcykge1xuICAgICAgdGhpcy5pc0VsbGlwc2lzID0gZWxsaXBzaXM7XG4gICAgICB0aGlzLm56T25FbGxpcHNpcy5lbWl0KGVsbGlwc2lzKTtcbiAgICB9XG4gICAgY29uc3QgZWxsaXBzaXNDb250YWluZXJOYXRpdmVFbGVtZW50ID0gdGhpcy5lbGxpcHNpc0NvbnRhaW5lciEubmF0aXZlRWxlbWVudDtcbiAgICB3aGlsZSAoZWxsaXBzaXNDb250YWluZXJOYXRpdmVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcbiAgICAgIHRoaXMucmVuZGVyZXIucmVtb3ZlQ2hpbGQoZWxsaXBzaXNDb250YWluZXJOYXRpdmVFbGVtZW50LCBlbGxpcHNpc0NvbnRhaW5lck5hdGl2ZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG4gICAgfVxuICAgIGNvbnRlbnROb2Rlcy5mb3JFYWNoKG4gPT4ge1xuICAgICAgdGhpcy5yZW5kZXJlci5hcHBlbmRDaGlsZChlbGxpcHNpc0NvbnRhaW5lck5hdGl2ZUVsZW1lbnQsIG4uY2xvbmVOb2RlKHRydWUpKTtcbiAgICB9KTtcbiAgICB0aGlzLmNkci5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIC8vIE5lZWQgdG8gY3JlYXRlIHRoZSBlbGVtZW50IGZvciBjYWxjdWxhdGlvbiBzaXplIGJlZm9yZSB2aWV3IGluaXRcbiAgcHJpdmF0ZSBnZXRFeHBhbmRhYmxlQnRuRWxlbWVudCgpOiBIVE1MRWxlbWVudCB8IG51bGwge1xuICAgIGlmICh0aGlzLm56RXhwYW5kYWJsZSkge1xuICAgICAgY29uc3QgZXhwYW5kVGV4dCA9IHRoaXMubG9jYWxlID8gdGhpcy5sb2NhbGUuZXhwYW5kIDogJyc7XG4gICAgICBjb25zdCBjYWNoZSA9IHRoaXMuZXhwYW5kYWJsZUJ0bkVsZW1lbnRDYWNoZTtcbiAgICAgIGlmICghY2FjaGUgfHwgY2FjaGUuaW5uZXJUZXh0ID09PSBleHBhbmRUZXh0KSB7XG4gICAgICAgIGNvbnN0IGVsID0gdGhpcy5kb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgIGVsLmNsYXNzTmFtZSA9IEVYUEFORF9FTEVNRU5UX0NMQVNTTkFNRTtcbiAgICAgICAgZWwuaW5uZXJUZXh0ID0gZXhwYW5kVGV4dDtcbiAgICAgICAgdGhpcy5leHBhbmRhYmxlQnRuRWxlbWVudENhY2hlID0gZWw7XG4gICAgICB9XG4gICAgICByZXR1cm4gdGhpcy5leHBhbmRhYmxlQnRuRWxlbWVudENhY2hlO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLmV4cGFuZGFibGVCdG5FbGVtZW50Q2FjaGUgPSBudWxsO1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByZW5kZXJBbmRTdWJzY3JpYmVXaW5kb3dSZXNpemUoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMucGxhdGZvcm0uaXNCcm93c2VyKSB7XG4gICAgICB0aGlzLndpbmRvd1Jlc2l6ZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgICAgdGhpcy5jc3NFbGxpcHNpcyA9IHRoaXMuY2FuVXNlQ1NTRWxsaXBzaXMoKTtcbiAgICAgIHRoaXMucmVuZGVyT25OZXh0RnJhbWUoKTtcbiAgICAgIHRoaXMud2luZG93UmVzaXplU3Vic2NyaXB0aW9uID0gdGhpcy5yZXNpemVTZXJ2aWNlXG4gICAgICAgIC5zdWJzY3JpYmUoKVxuICAgICAgICAucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpXG4gICAgICAgIC5zdWJzY3JpYmUoKCkgPT4gdGhpcy5yZW5kZXJPbk5leHRGcmFtZSgpKTtcbiAgICB9XG4gIH1cblxuICBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmkxOG4ubG9jYWxlQ2hhbmdlLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKS5zdWJzY3JpYmUoKCkgPT4ge1xuICAgICAgdGhpcy5sb2NhbGUgPSB0aGlzLmkxOG4uZ2V0TG9jYWxlRGF0YSgnVGV4dCcpO1xuICAgICAgdGhpcy5jZHIubWFya0ZvckNoZWNrKCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLmRpcmVjdGlvbmFsaXR5LmNoYW5nZT8ucGlwZSh0YWtlVW50aWwodGhpcy5kZXN0cm95JCkpLnN1YnNjcmliZSgoZGlyZWN0aW9uOiBEaXJlY3Rpb24pID0+IHtcbiAgICAgIHRoaXMuZGlyID0gZGlyZWN0aW9uO1xuICAgICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5kaXIgPSB0aGlzLmRpcmVjdGlvbmFsaXR5LnZhbHVlO1xuICB9XG5cbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xuICAgIHRoaXMudmlld0luaXQgPSB0cnVlO1xuICAgIHRoaXMucmVuZGVyQW5kU3Vic2NyaWJlV2luZG93UmVzaXplKCk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgY29uc3QgeyBuekNvcHlhYmxlLCBuekVkaXRhYmxlLCBuekV4cGFuZGFibGUsIG56RWxsaXBzaXMsIG56Q29udGVudCwgbnpFbGxpcHNpc1Jvd3MsIG56U3VmZml4IH0gPSBjaGFuZ2VzO1xuICAgIGlmIChuekNvcHlhYmxlIHx8IG56RWRpdGFibGUgfHwgbnpFeHBhbmRhYmxlIHx8IG56RWxsaXBzaXMgfHwgbnpDb250ZW50IHx8IG56RWxsaXBzaXNSb3dzIHx8IG56U3VmZml4KSB7XG4gICAgICBpZiAodGhpcy5uekVsbGlwc2lzKSB7XG4gICAgICAgIGlmICh0aGlzLmV4cGFuZGVkKSB7XG4gICAgICAgICAgdGhpcy53aW5kb3dSZXNpemVTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aGlzLnJlbmRlckFuZFN1YnNjcmliZVdpbmRvd1Jlc2l6ZSgpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5kZXN0cm95JC5uZXh0KCk7XG4gICAgdGhpcy5kZXN0cm95JC5jb21wbGV0ZSgpO1xuICAgIHRoaXMuZXhwYW5kYWJsZUJ0bkVsZW1lbnRDYWNoZSA9IG51bGw7XG4gICAgdGhpcy53aW5kb3dSZXNpemVTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgfVxufVxuIl19