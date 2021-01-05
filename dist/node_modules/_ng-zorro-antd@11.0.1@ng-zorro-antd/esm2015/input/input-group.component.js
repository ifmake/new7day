import { __decorate, __metadata } from "tslib";
/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { FocusMonitor } from '@angular/cdk/a11y';
import { Directionality } from '@angular/cdk/bidi';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, Directive, ElementRef, Input, Optional, QueryList, ViewEncapsulation } from '@angular/core';
import { InputBoolean } from 'ng-zorro-antd/core/util';
import { merge, Subject } from 'rxjs';
import { flatMap, map, startWith, switchMap, takeUntil } from 'rxjs/operators';
import { NzInputDirective } from './input.directive';
export class NzInputGroupWhitSuffixOrPrefixDirective {
    constructor(elementRef) {
        this.elementRef = elementRef;
    }
}
NzInputGroupWhitSuffixOrPrefixDirective.decorators = [
    { type: Directive, args: [{
                selector: `nz-input-group[nzSuffix], nz-input-group[nzPrefix]`
            },] }
];
NzInputGroupWhitSuffixOrPrefixDirective.ctorParameters = () => [
    { type: ElementRef }
];
export class NzInputGroupComponent {
    constructor(focusMonitor, elementRef, cdr, directionality) {
        this.focusMonitor = focusMonitor;
        this.elementRef = elementRef;
        this.cdr = cdr;
        this.directionality = directionality;
        this.nzAddOnBeforeIcon = null;
        this.nzAddOnAfterIcon = null;
        this.nzPrefixIcon = null;
        this.nzSuffixIcon = null;
        this.nzSize = 'default';
        this.nzSearch = false;
        this.nzCompact = false;
        this.isLarge = false;
        this.isSmall = false;
        this.isAffix = false;
        this.isAddOn = false;
        this.focused = false;
        this.disabled = false;
        this.dir = 'ltr';
        this.destroy$ = new Subject();
    }
    updateChildrenInputSize() {
        if (this.listOfNzInputDirective) {
            this.listOfNzInputDirective.forEach(item => (item.nzSize = this.nzSize));
        }
    }
    ngOnInit() {
        var _a;
        this.focusMonitor
            .monitor(this.elementRef, true)
            .pipe(takeUntil(this.destroy$))
            .subscribe(focusOrigin => {
            this.focused = !!focusOrigin;
            this.cdr.markForCheck();
        });
        this.dir = this.directionality.value;
        (_a = this.directionality.change) === null || _a === void 0 ? void 0 : _a.pipe(takeUntil(this.destroy$)).subscribe((direction) => {
            this.dir = direction;
        });
    }
    ngAfterContentInit() {
        this.updateChildrenInputSize();
        const listOfInputChange$ = this.listOfNzInputDirective.changes.pipe(startWith(this.listOfNzInputDirective));
        listOfInputChange$
            .pipe(switchMap(list => {
            return merge(...[listOfInputChange$, ...list.map((input) => input.disabled$)]);
        }), flatMap(() => listOfInputChange$), map(list => list.some((input) => input.disabled)), takeUntil(this.destroy$))
            .subscribe(disabled => {
            this.disabled = disabled;
            this.cdr.markForCheck();
        });
    }
    ngOnChanges(changes) {
        const { nzSize, nzSuffix, nzPrefix, nzPrefixIcon, nzSuffixIcon, nzAddOnAfter, nzAddOnBefore, nzAddOnAfterIcon, nzAddOnBeforeIcon } = changes;
        if (nzSize) {
            this.updateChildrenInputSize();
            this.isLarge = this.nzSize === 'large';
            this.isSmall = this.nzSize === 'small';
        }
        if (nzSuffix || nzPrefix || nzPrefixIcon || nzSuffixIcon) {
            this.isAffix = !!(this.nzSuffix || this.nzPrefix || this.nzPrefixIcon || this.nzSuffixIcon);
        }
        if (nzAddOnAfter || nzAddOnBefore || nzAddOnAfterIcon || nzAddOnBeforeIcon) {
            this.isAddOn = !!(this.nzAddOnAfter || this.nzAddOnBefore || this.nzAddOnAfterIcon || this.nzAddOnBeforeIcon);
        }
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
NzInputGroupComponent.decorators = [
    { type: Component, args: [{
                selector: 'nz-input-group',
                exportAs: 'nzInputGroup',
                preserveWhitespaces: false,
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush,
                template: `
    <span class="ant-input-wrapper ant-input-group" *ngIf="isAddOn; else noAddOnTemplate">
      <span
        *ngIf="nzAddOnBefore || nzAddOnBeforeIcon"
        nz-input-group-slot
        type="addon"
        [icon]="nzAddOnBeforeIcon"
        [template]="nzAddOnBefore"
      ></span>
      <span
        *ngIf="isAffix; else contentTemplate"
        class="ant-input-affix-wrapper"
        [class.ant-input-affix-wrapper-sm]="isSmall"
        [class.ant-input-affix-wrapper-lg]="isLarge"
      >
        <ng-template [ngTemplateOutlet]="affixTemplate"></ng-template>
      </span>
      <span
        *ngIf="nzAddOnAfter || nzAddOnAfterIcon"
        nz-input-group-slot
        type="addon"
        [icon]="nzAddOnAfterIcon"
        [template]="nzAddOnAfter"
      ></span>
    </span>
    <ng-template #noAddOnTemplate>
      <ng-template [ngIf]="isAffix" [ngIfElse]="contentTemplate">
        <ng-template [ngTemplateOutlet]="affixTemplate"></ng-template>
      </ng-template>
    </ng-template>
    <ng-template #affixTemplate>
      <span *ngIf="nzPrefix || nzPrefixIcon" nz-input-group-slot type="prefix" [icon]="nzPrefixIcon" [template]="nzPrefix"></span>
      <ng-template [ngTemplateOutlet]="contentTemplate"></ng-template>
      <span *ngIf="nzSuffix || nzSuffixIcon" nz-input-group-slot type="suffix" [icon]="nzSuffixIcon" [template]="nzSuffix"></span>
    </ng-template>
    <ng-template #contentTemplate>
      <ng-content></ng-content>
    </ng-template>
  `,
                host: {
                    '[class.ant-input-group-compact]': `nzCompact`,
                    '[class.ant-input-search-enter-button]': `nzSearch`,
                    '[class.ant-input-search]': `nzSearch`,
                    '[class.ant-input-search-rtl]': `dir === 'rtl'`,
                    '[class.ant-input-search-sm]': `nzSearch && isSmall`,
                    '[class.ant-input-search-large]': `nzSearch && isLarge`,
                    '[class.ant-input-group-wrapper]': `isAddOn`,
                    '[class.ant-input-group-wrapper-rtl]': `dir === 'rtl'`,
                    '[class.ant-input-group-wrapper-lg]': `isAddOn && isLarge`,
                    '[class.ant-input-group-wrapper-sm]': `isAddOn && isSmall`,
                    '[class.ant-input-affix-wrapper]': `isAffix && !isAddOn`,
                    '[class.ant-input-affix-wrapper-rtl]': `dir === 'rtl'`,
                    '[class.ant-input-affix-wrapper-focused]': `isAffix && focused`,
                    '[class.ant-input-affix-wrapper-disabled]': `isAffix && disabled`,
                    '[class.ant-input-affix-wrapper-lg]': `isAffix && !isAddOn && isLarge`,
                    '[class.ant-input-affix-wrapper-sm]': `isAffix && !isAddOn && isSmall`,
                    '[class.ant-input-group]': `!isAffix && !isAddOn`,
                    '[class.ant-input-group-rtl]': `dir === 'rtl'`,
                    '[class.ant-input-group-lg]': `!isAffix && !isAddOn && isLarge`,
                    '[class.ant-input-group-sm]': `!isAffix && !isAddOn && isSmall`
                }
            },] }
];
NzInputGroupComponent.ctorParameters = () => [
    { type: FocusMonitor },
    { type: ElementRef },
    { type: ChangeDetectorRef },
    { type: Directionality, decorators: [{ type: Optional }] }
];
NzInputGroupComponent.propDecorators = {
    listOfNzInputDirective: [{ type: ContentChildren, args: [NzInputDirective,] }],
    nzAddOnBeforeIcon: [{ type: Input }],
    nzAddOnAfterIcon: [{ type: Input }],
    nzPrefixIcon: [{ type: Input }],
    nzSuffixIcon: [{ type: Input }],
    nzAddOnBefore: [{ type: Input }],
    nzAddOnAfter: [{ type: Input }],
    nzPrefix: [{ type: Input }],
    nzSuffix: [{ type: Input }],
    nzSize: [{ type: Input }],
    nzSearch: [{ type: Input }],
    nzCompact: [{ type: Input }]
};
__decorate([
    InputBoolean(),
    __metadata("design:type", Object)
], NzInputGroupComponent.prototype, "nzSearch", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Object)
], NzInputGroupComponent.prototype, "nzCompact", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5wdXQtZ3JvdXAuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uL2NvbXBvbmVudHMvaW5wdXQvIiwic291cmNlcyI6WyJpbnB1dC1ncm91cC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBOzs7R0FHRztBQUNILE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNqRCxPQUFPLEVBQWEsY0FBYyxFQUFFLE1BQU0sbUJBQW1CLENBQUM7QUFDOUQsT0FBTyxFQUVMLHVCQUF1QixFQUN2QixpQkFBaUIsRUFDakIsU0FBUyxFQUNULGVBQWUsRUFDZixTQUFTLEVBQ1QsVUFBVSxFQUNWLEtBQUssRUFJTCxRQUFRLEVBQ1IsU0FBUyxFQUdULGlCQUFpQixFQUNsQixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDdkQsT0FBTyxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDdEMsT0FBTyxFQUFFLE9BQU8sRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUMvRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUtyRCxNQUFNLE9BQU8sdUNBQXVDO0lBQ2xELFlBQW1CLFVBQXNCO1FBQXRCLGVBQVUsR0FBVixVQUFVLENBQVk7SUFBRyxDQUFDOzs7WUFKOUMsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxvREFBb0Q7YUFDL0Q7OztZQW5CQyxVQUFVOztBQTRGWixNQUFNLE9BQU8scUJBQXFCO0lBeUJoQyxZQUNVLFlBQTBCLEVBQzFCLFVBQXNCLEVBQ3RCLEdBQXNCLEVBQ1YsY0FBOEI7UUFIMUMsaUJBQVksR0FBWixZQUFZLENBQWM7UUFDMUIsZUFBVSxHQUFWLFVBQVUsQ0FBWTtRQUN0QixRQUFHLEdBQUgsR0FBRyxD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QWYsWUFBWSxFQUFFOzt3REFBbUIiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vZ2l0aHViLmNvbS9ORy1aT1JSTy9uZy16b3Jyby1hbnRkL2Jsb2IvbWFzdGVyL0xJQ0VOU0VcbiAqL1xuaW1wb3J0IHsgRm9jdXNNb25pdG9yIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2ExMXknO1xuaW1wb3J0IHsgRGlyZWN0aW9uLCBEaXJlY3Rpb25hbGl0eSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7XG4gIEFmdGVyQ29udGVudEluaXQsXG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDaGFuZ2VEZXRlY3RvclJlZixcbiAgQ29tcG9uZW50LFxuICBDb250ZW50Q2hpbGRyZW4sXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT25EZXN0cm95LFxuICBPbkluaXQsXG4gIE9wdGlvbmFsLFxuICBRdWVyeUxpc3QsXG4gIFNpbXBsZUNoYW5nZXMsXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3RW5jYXBzdWxhdGlvblxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IEJvb2xlYW5JbnB1dCwgTnpTaXplTERTVHlwZSB9IGZyb20gJ25nLXpvcnJvLWFudGQvY29yZS90eXBlcyc7XG5pbXBvcnQgeyBJbnB1dEJvb2xlYW4gfSBmcm9tICduZy16b3Jyby1hbnRkL2NvcmUvdXRpbCc7XG5pbXBvcnQgeyBtZXJnZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZmxhdE1hcCwgbWFwLCBzdGFydFdpdGgsIHN3aXRjaE1hcCwgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuaW1wb3J0IHsgTnpJbnB1dERpcmVjdGl2ZSB9IGZyb20gJy4vaW5wdXQuZGlyZWN0aXZlJztcblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiBgbnotaW5wdXQtZ3JvdXBbbnpTdWZmaXhdLCBuei1pbnB1dC1ncm91cFtuelByZWZpeF1gXG59KVxuZXhwb3J0IGNsYXNzIE56SW5wdXRHcm91cFdoaXRTdWZmaXhPclByZWZpeERpcmVjdGl2ZSB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBlbGVtZW50UmVmOiBFbGVtZW50UmVmKSB7fVxufVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduei1pbnB1dC1ncm91cCcsXG4gIGV4cG9ydEFzOiAnbnpJbnB1dEdyb3VwJyxcbiAgcHJlc2VydmVXaGl0ZXNwYWNlczogZmFsc2UsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICB0ZW1wbGF0ZTogYFxuICAgIDxzcGFuIGNsYXNzPVwiYW50LWlucHV0LXdyYXBwZXIgYW50LWlucHV0LWdyb3VwXCIgKm5nSWY9XCJpc0FkZE9uOyBlbHNlIG5vQWRkT25UZW1wbGF0ZVwiPlxuICAgICAgPHNwYW5cbiAgICAgICAgKm5nSWY9XCJuekFkZE9uQmVmb3JlIHx8IG56QWRkT25CZWZvcmVJY29uXCJcbiAgICAgICAgbnotaW5wdXQtZ3JvdXAtc2xvdFxuICAgICAgICB0eXBlPVwiYWRkb25cIlxuICAgICAgICBbaWNvbl09XCJuekFkZE9uQmVmb3JlSWNvblwiXG4gICAgICAgIFt0ZW1wbGF0ZV09XCJuekFkZE9uQmVmb3JlXCJcbiAgICAgID48L3NwYW4+XG4gICAgICA8c3BhblxuICAgICAgICAqbmdJZj1cImlzQWZmaXg7IGVsc2UgY29udGVudFRlbXBsYXRlXCJcbiAgICAgICAgY2xhc3M9XCJhbnQtaW5wdXQtYWZmaXgtd3JhcHBlclwiXG4gICAgICAgIFtjbGFzcy5hbnQtaW5wdXQtYWZmaXgtd3JhcHBlci1zbV09XCJpc1NtYWxsXCJcbiAgICAgICAgW2NsYXNzLmFudC1pbnB1dC1hZmZpeC13cmFwcGVyLWxnXT1cImlzTGFyZ2VcIlxuICAgICAgPlxuICAgICAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwiYWZmaXhUZW1wbGF0ZVwiPjwvbmctdGVtcGxhdGU+XG4gICAgICA8L3NwYW4+XG4gICAgICA8c3BhblxuICAgICAgICAqbmdJZj1cIm56QWRkT25BZnRlciB8fCBuekFkZE9uQWZ0ZXJJY29uXCJcbiAgICAgICAgbnotaW5wdXQtZ3JvdXAtc2xvdFxuICAgICAgICB0eXBlPVwiYWRkb25cIlxuICAgICAgICBbaWNvbl09XCJuekFkZE9uQWZ0ZXJJY29uXCJcbiAgICAgICAgW3RlbXBsYXRlXT1cIm56QWRkT25BZnRlclwiXG4gICAgICA+PC9zcGFuPlxuICAgIDwvc3Bhbj5cbiAgICA8bmctdGVtcGxhdGUgI25vQWRkT25UZW1wbGF0ZT5cbiAgICAgIDxuZy10ZW1wbGF0ZSBbbmdJZl09XCJpc0FmZml4XCIgW25nSWZFbHNlXT1cImNvbnRlbnRUZW1wbGF0ZVwiPlxuICAgICAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwiYWZmaXhUZW1wbGF0ZVwiPjwvbmctdGVtcGxhdGU+XG4gICAgICA8L25nLXRlbXBsYXRlPlxuICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPG5nLXRlbXBsYXRlICNhZmZpeFRlbXBsYXRlPlxuICAgICAgPHNwYW4gKm5nSWY9XCJuelByZWZpeCB8fCBuelByZWZpeEljb25cIiBuei1pbnB1dC1ncm91cC1zbG90IHR5cGU9XCJwcmVmaXhcIiBbaWNvbl09XCJuelByZWZpeEljb25cIiBbdGVtcGxhdGVdPVwibnpQcmVmaXhcIj48L3NwYW4+XG4gICAgICA8bmctdGVtcGxhdGUgW25nVGVtcGxhdGVPdXRsZXRdPVwiY29udGVudFRlbXBsYXRlXCI+PC9uZy10ZW1wbGF0ZT5cbiAgICAgIDxzcGFuICpuZ0lmPVwibnpTdWZmaXggfHwgbnpTdWZmaXhJY29uXCIgbnotaW5wdXQtZ3JvdXAtc2xvdCB0eXBlPVwic3VmZml4XCIgW2ljb25dPVwibnpTdWZmaXhJY29uXCIgW3RlbXBsYXRlXT1cIm56U3VmZml4XCI+PC9zcGFuPlxuICAgIDwvbmctdGVtcGxhdGU+XG4gICAgPG5nLXRlbXBsYXRlICNjb250ZW50VGVtcGxhdGU+XG4gICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XG4gICAgPC9uZy10ZW1wbGF0ZT5cbiAgYCxcbiAgaG9zdDoge1xuICAgICdbY2xhc3MuYW50LWlucHV0LWdyb3VwLWNvbXBhY3RdJzogYG56Q29tcGFjdGAsXG4gICAgJ1tjbGFzcy5hbnQtaW5wdXQtc2VhcmNoLWVudGVyLWJ1dHRvbl0nOiBgbnpTZWFyY2hgLFxuICAgICdbY2xhc3MuYW50LWlucHV0LXNlYXJjaF0nOiBgbnpTZWFyY2hgLFxuICAgICdbY2xhc3MuYW50LWlucHV0LXNlYXJjaC1ydGxdJzogYGRpciA9PT0gJ3J0bCdgLFxuICAgICdbY2xhc3MuYW50LWlucHV0LXNlYXJjaC1zbV0nOiBgbnpTZWFyY2ggJiYgaXNTbWFsbGAsXG4gICAgJ1tjbGFzcy5hbnQtaW5wdXQtc2VhcmNoLWxhcmdlXSc6IGBuelNlYXJjaCAmJiBpc0xhcmdlYCxcbiAgICAnW2NsYXNzLmFudC1pbnB1dC1ncm91cC13cmFwcGVyXSc6IGBpc0FkZE9uYCxcbiAgICAnW2NsYXNzLmFudC1pbnB1dC1ncm91cC13cmFwcGVyLXJ0bF0nOiBgZGlyID09PSAncnRsJ2AsXG4gICAgJ1tjbGFzcy5hbnQtaW5wdXQtZ3JvdXAtd3JhcHBlci1sZ10nOiBgaXNBZGRPbiAmJiBpc0xhcmdlYCxcbiAgICAnW2NsYXNzLmFudC1pbnB1dC1ncm91cC13cmFwcGVyLXNtXSc6IGBpc0FkZE9uICYmIGlzU21hbGxgLFxuICAgICdbY2xhc3MuYW50LWlucHV0LWFmZml4LXdyYXBwZXJdJzogYGlzQWZmaXggJiYgIWlzQWRkT25gLFxuICAgICdbY2xhc3MuYW50LWlucHV0LWFmZml4LXdyYXBwZXItcnRsXSc6IGBkaXIgPT09ICdydGwnYCxcbiAgICAnW2NsYXNzLmFudC1pbnB1dC1hZmZpeC13cmFwcGVyLWZvY3VzZWRdJzogYGlzQWZmaXggJiYgZm9jdXNlZGAsXG4gICAgJ1tjbGFzcy5hbnQtaW5wdXQtYWZmaXgtd3JhcHBlci1kaXNhYmxlZF0nOiBgaXNBZmZpeCAmJiBkaXNhYmxlZGAsXG4gICAgJ1tjbGFzcy5hbnQtaW5wdXQtYWZmaXgtd3JhcHBlci1sZ10nOiBgaXNBZmZpeCAmJiAhaXNBZGRPbiAmJiBpc0xhcmdlYCxcbiAgICAnW2NsYXNzLmFudC1pbnB1dC1hZmZpeC13cmFwcGVyLXNtXSc6IGBpc0FmZml4ICYmICFpc0FkZE9uICYmIGlzU21hbGxgLFxuICAgICdbY2xhc3MuYW50LWlucHV0LWdyb3VwXSc6IGAhaXNBZmZpeCAmJiAhaXNBZGRPbmAsXG4gICAgJ1tjbGFzcy5hbnQtaW5wdXQtZ3JvdXAtcnRsXSc6IGBkaXIgPT09ICdydGwnYCxcbiAgICAnW2NsYXNzLmFudC1pbnB1dC1ncm91cC1sZ10nOiBgIWlzQWZmaXggJiYgIWlzQWRkT24gJiYgaXNMYXJnZWAsXG4gICAgJ1tjbGFzcy5hbnQtaW5wdXQtZ3JvdXAtc21dJzogYCFpc0FmZml4ICYmICFpc0FkZE9uICYmIGlzU21hbGxgXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgTnpJbnB1dEdyb3VwQ29tcG9uZW50IGltcGxlbWVudHMgQWZ0ZXJDb250ZW50SW5pdCwgT25DaGFuZ2VzLCBPbkluaXQsIE9uRGVzdHJveSB7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9uelNlYXJjaDogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbnpDb21wYWN0OiBCb29sZWFuSW5wdXQ7XG5cbiAgQENvbnRlbnRDaGlsZHJlbihOeklucHV0RGlyZWN0aXZlKSBsaXN0T2ZOeklucHV0RGlyZWN0aXZlITogUXVlcnlMaXN0PE56SW5wdXREaXJlY3RpdmU+O1xuICBASW5wdXQoKSBuekFkZE9uQmVmb3JlSWNvbj86IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBASW5wdXQoKSBuekFkZE9uQWZ0ZXJJY29uPzogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG4gIEBJbnB1dCgpIG56UHJlZml4SWNvbj86IHN0cmluZyB8IG51bGwgPSBudWxsO1xuICBASW5wdXQoKSBuelN1ZmZpeEljb24/OiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgQElucHV0KCkgbnpBZGRPbkJlZm9yZT86IHN0cmluZyB8IFRlbXBsYXRlUmVmPHZvaWQ+O1xuICBASW5wdXQoKSBuekFkZE9uQWZ0ZXI/OiBzdHJpbmcgfCBUZW1wbGF0ZVJlZjx2b2lkPjtcbiAgQElucHV0KCkgbnpQcmVmaXg/OiBzdHJpbmcgfCBUZW1wbGF0ZVJlZjx2b2lkPjtcbiAgQElucHV0KCkgbnpTdWZmaXg/OiBzdHJpbmcgfCBUZW1wbGF0ZVJlZjx2b2lkPjtcbiAgQElucHV0KCkgbnpTaXplOiBOelNpemVMRFNUeXBlID0gJ2RlZmF1bHQnO1xuICBASW5wdXQoKSBASW5wdXRCb29sZWFuKCkgbnpTZWFyY2ggPSBmYWxzZTtcbiAgQElucHV0KCkgQElucHV0Qm9vbGVhbigpIG56Q29tcGFjdCA9IGZhbHNlO1xuICBpc0xhcmdlID0gZmFsc2U7XG4gIGlzU21hbGwgPSBmYWxzZTtcbiAgaXNBZmZpeCA9IGZhbHNlO1xuICBpc0FkZE9uID0gZmFsc2U7XG4gIGZvY3VzZWQgPSBmYWxzZTtcbiAgZGlzYWJsZWQgPSBmYWxzZTtcbiAgZGlyOiBEaXJlY3Rpb24gPSAnbHRyJztcbiAgcHJpdmF0ZSBkZXN0cm95JCA9IG5ldyBTdWJqZWN0PHZvaWQ+KCk7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBmb2N1c01vbml0b3I6IEZvY3VzTW9uaXRvcixcbiAgICBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHJpdmF0ZSBjZHI6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIEBPcHRpb25hbCgpIHByaXZhdGUgZGlyZWN0aW9uYWxpdHk6IERpcmVjdGlvbmFsaXR5XG4gICkge31cblxuICB1cGRhdGVDaGlsZHJlbklucHV0U2l6ZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5saXN0T2ZOeklucHV0RGlyZWN0aXZlKSB7XG4gICAgICB0aGlzLmxpc3RPZk56SW5wdXREaXJlY3RpdmUuZm9yRWFjaChpdGVtID0+IChpdGVtLm56U2l6ZSA9IHRoaXMubnpTaXplKSk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5mb2N1c01vbml0b3JcbiAgICAgIC5tb25pdG9yKHRoaXMuZWxlbWVudFJlZiwgdHJ1ZSlcbiAgICAgIC5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSlcbiAgICAgIC5zdWJzY3JpYmUoZm9jdXNPcmlnaW4gPT4ge1xuICAgICAgICB0aGlzLmZvY3VzZWQgPSAhIWZvY3VzT3JpZ2luO1xuICAgICAgICB0aGlzLmNkci5tYXJrRm9yQ2hlY2soKTtcbiAgICAgIH0pO1xuXG4gICAgdGhpcy5kaXIgPSB0aGlzLmRpcmVjdGlvbmFsaXR5LnZhbHVlO1xuICAgIHRoaXMuZGlyZWN0aW9uYWxpdHkuY2hhbmdlPy5waXBlKHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSkuc3Vic2NyaWJlKChkaXJlY3Rpb246IERpcmVjdGlvbikgPT4ge1xuICAgICAgdGhpcy5kaXIgPSBkaXJlY3Rpb247XG4gICAgfSk7XG4gIH1cblxuICBuZ0FmdGVyQ29udGVudEluaXQoKTogdm9pZCB7XG4gICAgdGhpcy51cGRhdGVDaGlsZHJlbklucHV0U2l6ZSgpO1xuICAgIGNvbnN0IGxpc3RPZklucHV0Q2hhbmdlJCA9IHRoaXMubGlzdE9mTnpJbnB1dERpcmVjdGl2ZS5jaGFuZ2VzLnBpcGUoc3RhcnRXaXRoKHRoaXMubGlzdE9mTnpJbnB1dERpcmVjdGl2ZSkpO1xuICAgIGxpc3RPZklucHV0Q2hhbmdlJFxuICAgICAgLnBpcGUoXG4gICAgICAgIHN3aXRjaE1hcChsaXN0ID0+IHtcbiAgICAgICAgICByZXR1cm4gbWVyZ2UoLi4uW2xpc3RPZklucHV0Q2hhbmdlJCwgLi4ubGlzdC5tYXAoKGlucHV0OiBOeklucHV0RGlyZWN0aXZlKSA9PiBpbnB1dC5kaXNhYmxlZCQpXSk7XG4gICAgICAgIH0pLFxuICAgICAgICBmbGF0TWFwKCgpID0+IGxpc3RPZklucHV0Q2hhbmdlJCksXG4gICAgICAgIG1hcChsaXN0ID0+IGxpc3Quc29tZSgoaW5wdXQ6IE56SW5wdXREaXJlY3RpdmUpID0+IGlucHV0LmRpc2FibGVkKSksXG4gICAgICAgIHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKVxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZShkaXNhYmxlZCA9PiB7XG4gICAgICAgIHRoaXMuZGlzYWJsZWQgPSBkaXNhYmxlZDtcbiAgICAgICAgdGhpcy5jZHIubWFya0ZvckNoZWNrKCk7XG4gICAgICB9KTtcbiAgfVxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgY29uc3Qge1xuICAgICAgbnpTaXplLFxuICAgICAgbnpTdWZmaXgsXG4gICAgICBuelByZWZpeCxcbiAgICAgIG56UHJlZml4SWNvbixcbiAgICAgIG56U3VmZml4SWNvbixcbiAgICAgIG56QWRkT25BZnRlcixcbiAgICAgIG56QWRkT25CZWZvcmUsXG4gICAgICBuekFkZE9uQWZ0ZXJJY29uLFxuICAgICAgbnpBZGRPbkJlZm9yZUljb25cbiAgICB9ID0gY2hhbmdlcztcbiAgICBpZiAobnpTaXplKSB7XG4gICAgICB0aGlzLnVwZGF0ZUNoaWxkcmVuSW5wdXRTaXplKCk7XG4gICAgICB0aGlzLmlzTGFyZ2UgPSB0aGlzLm56U2l6ZSA9PT0gJ2xhcmdlJztcbiAgICAgIHRoaXMuaXNTbWFsbCA9IHRoaXMubnpTaXplID09PSAnc21hbGwnO1xuICAgIH1cbiAgICBpZiAobnpTdWZmaXggfHwgbnpQcmVmaXggfHwgbnpQcmVmaXhJY29uIHx8IG56U3VmZml4SWNvbikge1xuICAgICAgdGhpcy5pc0FmZml4ID0gISEodGhpcy5uelN1ZmZpeCB8fCB0aGlzLm56UHJlZml4IHx8IHRoaXMubnpQcmVmaXhJY29uIHx8IHRoaXMubnpTdWZmaXhJY29uKTtcbiAgICB9XG4gICAgaWYgKG56QWRkT25BZnRlciB8fCBuekFkZE9uQmVmb3JlIHx8IG56QWRkT25BZnRlckljb24gfHwgbnpBZGRPbkJlZm9yZUljb24pIHtcbiAgICAgIHRoaXMuaXNBZGRPbiA9ICEhKHRoaXMubnpBZGRPbkFmdGVyIHx8IHRoaXMubnpBZGRPbkJlZm9yZSB8fCB0aGlzLm56QWRkT25BZnRlckljb24gfHwgdGhpcy5uekFkZE9uQmVmb3JlSWNvbik7XG4gICAgfVxuICB9XG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuZGVzdHJveSQubmV4dCgpO1xuICAgIHRoaXMuZGVzdHJveSQuY29tcGxldGUoKTtcbiAgfVxufVxuIl19