/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { __decorate, __metadata } from "tslib";
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChildren, ElementRef, EventEmitter, Host, Input, NgZone, Optional, Output, QueryList, TemplateRef, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { slideMotion } from 'ng-zorro-antd/core/animation';
import { NzNoAnimationDirective } from 'ng-zorro-antd/core/no-animation';
import { InputBoolean } from 'ng-zorro-antd/core/util';
import { defer, merge, Subject, Subscription } from 'rxjs';
import { filter, switchMap, take, takeUntil } from 'rxjs/operators';
import { Directionality } from '@angular/cdk/bidi';
import { NzAutocompleteOptionComponent } from './autocomplete-option.component';
export class NzAutocompleteComponent {
    constructor(changeDetectorRef, ngZone, directionality, noAnimation) {
        this.changeDetectorRef = changeDetectorRef;
        this.ngZone = ngZone;
        this.directionality = directionality;
        this.noAnimation = noAnimation;
        this.nzOverlayClassName = '';
        this.nzOverlayStyle = {};
        this.nzDefaultActiveFirstOption = true;
        this.nzBackfill = false;
        this.compareWith = (o1, o2) => o1 === o2;
        this.selectionChange = new EventEmitter();
        this.showPanel = true;
        this.isOpen = false;
        this.dir = 'ltr';
        this.destroy$ = new Subject();
        this.activeItemIndex = -1;
        this.selectionChangeSubscription = Subscription.EMPTY;
        this.optionMouseEnterSubscription = Subscription.EMPTY;
        this.dataSourceChangeSubscription = Subscription.EMPTY;
        /** Options changes listener */
        this.optionSelectionChanges = defer(() => {
            if (this.options) {
                return merge(...this.options.map(option => option.selectionChange));
            }
            return this.ngZone.onStable.asObservable().pipe(take(1), switchMap(() => this.optionSelectionChanges));
        });
        this.optionMouseEnter = defer(() => {
            if (this.options) {
                return merge(...this.options.map(option => option.mouseEntered));
            }
            return this.ngZone.onStable.asObservable().pipe(take(1), switchMap(() => this.optionMouseEnter));
        });
    }
    /**
     * Options accessor, its source may be content or dataSource
     */
    get options() {
        // first dataSource
        if (this.nzDataSource) {
            return this.fromDataSourceOptions;
        }
        else {
            return this.fromContentOptions;
        }
    }
    ngOnInit() {
        var _a;
        (_a = this.directionality.change) === null || _a === void 0 ? void 0 : _a.pipe(takeUntil(this.destroy$)).subscribe((direction) => {
            this.dir = direction;
            this.changeDetectorRef.detectChanges();
        });
        this.dir = this.directionality.value;
    }
    ngAfterContentInit() {
        if (!this.nzDataSource) {
            this.optionsInit();
        }
    }
    ngAfterViewInit() {
        if (this.nzDataSource) {
            this.optionsInit();
        }
    }
    ngOnDestroy() {
        this.dataSourceChangeSubscription.unsubscribe();
        this.selectionChangeSubscription.unsubscribe();
        this.optionMouseEnterSubscription.unsubscribe();
        this.destroy$.next();
        this.destroy$.complete();
    }
    setVisibility() {
        this.showPanel = !!this.options.length;
        this.changeDetectorRef.markForCheck();
    }
    setActiveItem(index) {
        const activeItem = this.options.toArray()[index];
        if (activeItem && !activeItem.active) {
            this.activeItem = activeItem;
            this.activeItemIndex = index;
            this.clearSelectedOptions(this.activeItem);
            this.activeItem.setActiveStyles();
            this.changeDetectorRef.markForCheck();
        }
    }
    setNextItemActive() {
        const nextIndex = this.activeItemIndex + 1 <= this.options.length - 1 ? this.activeItemIndex + 1 : 0;
        this.setActiveItem(nextIndex);
    }
    setPreviousItemActive() {
        const previousIndex = this.activeItemIndex - 1 < 0 ? this.options.length - 1 : this.activeItemIndex - 1;
        this.setActiveItem(previousIndex);
    }
    getOptionIndex(value) {
        return this.options.reduce((result, current, index) => {
            return result === -1 ? (this.compareWith(value, current.nzValue) ? index : -1) : result;
        }, -1);
    }
    getOption(value) {
        return this.options.find(item => this.compareWith(value, item.nzValue)) || null;
    }
    optionsInit() {
        this.setVisibility();
        this.subscribeOptionChanges();
        const changes = this.nzDataSource ? this.fromDataSourceOptions.changes : this.fromContentOptions.changes;
        // async
        this.dataSourceChangeSubscription = changes.subscribe(e => {
            if (!e.dirty && this.isOpen) {
                setTimeout(() => this.setVisibility());
            }
            this.subscribeOptionChanges();
        });
    }
    /**
     * Clear the status of options
     */
    clearSelectedOptions(skip, deselect = false) {
        this.options.forEach(option => {
            if (option !== skip) {
                if (deselect) {
                    option.deselect();
                }
                option.setInactiveStyles();
            }
        });
    }
    subscribeOptionChanges() {
        this.selectionChangeSubscription.unsubscribe();
        this.selectionChangeSubscription = this.optionSelectionChanges
            .pipe(filter((event) => event.isUserInput))
            .subscribe((event) => {
            event.source.select();
            event.source.setActiveStyles();
            this.activeItem = event.source;
            this.activeItemIndex = this.getOptionIndex(this.activeItem.nzValue);
            this.clearSelectedOptions(event.source, true);
            this.selectionChange.emit(event.source);
        });
        this.optionMouseEnterSubscription.unsubscribe();
        this.optionMouseEnterSubscription = this.optionMouseEnter.subscribe((event) => {
            event.setActiveStyles();
            this.activeItem = event;
            this.activeItemIndex = this.getOptionIndex(this.activeItem.nzValue);
            this.clearSelectedOptions(event);
        });
    }
}
NzAutocompleteComponent.decorators = [
    { type: Component, args: [{
                selector: 'nz-autocomplete',
                exportAs: 'nzAutocomplete',
                preserveWhitespaces: false,
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                template: `
    <ng-template>
      <div
        #panel
        class="ant-select-dropdown ant-select-dropdown-placement-bottomLeft"
        [class.ant-select-dropdown-hidden]="!showPanel"
        [class.ant-select-dropdown-rtl]="dir === 'rtl'"
        [ngClass]="nzOverlayClassName"
        [ngStyle]="nzOverlayStyle"
        [nzNoAnimation]="noAnimation?.nzNoAnimation"
        [@slideMotion]="'enter'"
        [@.disabled]="noAnimation?.nzNoAnimation"
      >
        <div style="max-height: 256px; overflow-y: auto; overflow-anchor: none;">
          <div style="display: flex; flex-direction: column;">
            <ng-template *ngTemplateOutlet="nzDataSource ? optionsTemplate : contentTemplate"></ng-template>
          </div>
        </div>
      </div>
      <ng-template #contentTemplate>
        <ng-content></ng-content>
      </ng-template>
      <ng-template #optionsTemplate>
        <nz-auto-option
          *ngFor="let option of nzDataSource!"
          [nzValue]="option"
          [nzLabel]="option && $any(option).label ? $any(option).label : $any(option)"
        >
          {{ option && $any(option).label ? $any(option).label : $any(option) }}
        </nz-auto-option>
      </ng-template>
    </ng-template>
  `,
                animations: [slideMotion]
            },] }
];
NzAutocompleteComponent.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: NgZone },
    { type: Directionality, decorators: [{ type: Optional }] },
    { type: NzNoAnimationDirective, decorators: [{ type: Host }, { type: Optional }] }
];
NzAutocompleteComponent.propDecorators = {
    nzWidth: [{ type: Input }],
    nzOverlayClassName: [{ type: Input }],
    nzOverlayStyle: [{ type: Input }],
    nzDefaultActiveFirstOption: [{ type: Input }],
    nzBackfill: [{ type: Input }],
    compareWith: [{ type: Input }],
    nzDataSource: [{ type: Input }],
    selectionChange: [{ type: Output }],
    fromContentOptions: [{ type: ContentChildren, args: [NzAutocompleteOptionComponent, { descendants: true },] }],
    fromDataSourceOptions: [{ type: ViewChildren, args: [NzAutocompleteOptionComponent,] }],
    template: [{ type: ViewChild, args: [TemplateRef, { static: false },] }],
    panel: [{ type: ViewChild, args: ['panel', { static: false },] }],
    content: [{ type: ViewChild, args: ['content', { static: false },] }]
};
__decorate([
    InputBoolean(),
    __metadata("design:type", Object)
], NzAutocompleteComponent.prototype, "nzDefaultActiveFirstOption", void 0);
__decorate([
    InputBoolean(),
    __metadata("design:type", Object)
], NzAutocompleteComponent.prototype, "nzBackfill", void 0);
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b2NvbXBsZXRlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9jb21wb25lbnRzL2F1dG8tY29tcGxldGUvIiwic291cmNlcyI6WyJhdXRvY29tcGxldGUuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7R0FHRzs7QUFFSCxPQUFPLEVBR0wsdUJBQXVCLEVBQ3ZCLGlCQUFpQixFQUNqQixTQUFTLEVBQ1QsZUFBZSxFQUNmLFVBQVUsRUFDVixZQUFZLEVBQ1osSUFBSSxFQUNKLEtBQUssRUFDTCxNQUFNLEVBR04sUUFBUSxFQUNSLE1BQU0sRUFDTixTQUFTLEVBQ1QsV0FBVyxFQUNYLFNBQVMsRUFDVCxZQUFZLEVBQ1osaUJBQWlCLEVBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBQ3ZCLE9BQU8sRUFBRSxXQUFXLEVBQUUsTUFBTSw4QkFBOEIsQ0FBQztBQUMzRCxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUV6RSxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDdkQsT0FBTyxFQUFFLEtBQUssRUFBRSxLQUFLLEVBQWMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUN2RSxPQUFPLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFFcEUsT0FBTyxFQUFhLGNBQWMsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQzlELE9BQU8sRUFBRSw2QkFBNkIsRUFBMkIsTUFBTSxpQ0FBaUMsQ0FBQztBQWtEekcsTUFBTSxPQUFPLHVCQUF1QjtJQW1FbEMsWUFDVSxpQkFBb0MsRUFDcEMsTUFBYyxFQUNGLGNBQThCLEVBQ3ZCLFdBQW9DO1FBSHZELHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBbUI7UUFDcEMsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUNGLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtR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aUJBQWlCO1lBT2pCLE1BQU07WUFrQlksY0FBYyx1QkF5SDdCLFFBQVE7WUEvSEosc0JBQXNCLHVCQWdJMUIsSUFBSSxZQUFJLFFBQVE7OztzQkFuRWxCLEtBQUs7aUNBQ0wsS0FBSzs2QkFDTCxLQUFLO3lDQUNMLEtBQUs7eUJBQ0wsS0FBSzswQkFDTCxLQUFLOzJCQUNMLEtBQUs7OEJBQ0wsTUFBTTtpQ0FzQk4sZUFBZSxTQUFDLDZCQUE2QixFQUFFLEVBQUUsV0FBVyxFQUFFLElBQUksRUFBRTtvQ0FHcEUsWUFBWSxTQUFDLDZCQUE2Qjt1QkFHMUMsU0FBUyxTQUFDLFdBQVcsRUFBRSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUU7b0JBQ3hDLFNBQVMsU0FBQyxPQUFPLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFO3NCQUNwQyxTQUFTLFNBQUMsU0FBUyxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssRUFBRTs7QUFsQ2Q7SUFBZixZQUFZLEVBQUU7OzJFQUFtQztBQUNsQztJQUFmLFlBQVksRUFBRTs7MkRBQW9CIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2dpdGh1Yi5jb20vTkctWk9SUk8vbmctem9ycm8tYW50ZC9ibG9iL21hc3Rlci9MSUNFTlNFXG4gKi9cblxuaW1wb3J0IHtcbiAgQWZ0ZXJDb250ZW50SW5pdCxcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnQsXG4gIENvbnRlbnRDaGlsZHJlbixcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBIb3N0LFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkRlc3Ryb3ksXG4gIE9uSW5pdCxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbiAgUXVlcnlMaXN0LFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0NoaWxkLFxuICBWaWV3Q2hpbGRyZW4sXG4gIFZpZXdFbmNhcHN1bGF0aW9uXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgc2xpZGVNb3Rpb24gfSBmcm9tICduZy16b3Jyby1hbnRkL2NvcmUvYW5pbWF0aW9uJztcbmltcG9ydCB7IE56Tm9BbmltYXRpb25EaXJlY3RpdmUgfSBmcm9tICduZy16b3Jyby1hbnRkL2NvcmUvbm8tYW5pbWF0aW9uJztcbmltcG9ydCB7IEJvb2xlYW5JbnB1dCwgQ29tcGFyZVdpdGgsIE56U2FmZUFueSB9IGZyb20gJ25nLXpvcnJvLWFudGQvY29yZS90eXBlcyc7XG5pbXBvcnQgeyBJbnB1dEJvb2xlYW4gfSBmcm9tICduZy16b3Jyby1hbnRkL2NvcmUvdXRpbCc7XG5pbXBvcnQgeyBkZWZlciwgbWVyZ2UsIE9ic2VydmFibGUsIFN1YmplY3QsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgZmlsdGVyLCBzd2l0Y2hNYXAsIHRha2UsIHRha2VVbnRpbCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHsgRGlyZWN0aW9uLCBEaXJlY3Rpb25hbGl0eSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7IE56QXV0b2NvbXBsZXRlT3B0aW9uQ29tcG9uZW50LCBOek9wdGlvblNlbGVjdGlvbkNoYW5nZSB9IGZyb20gJy4vYXV0b2NvbXBsZXRlLW9wdGlvbi5jb21wb25lbnQnO1xuXG5leHBvcnQgaW50ZXJmYWNlIEF1dG9jb21wbGV0ZURhdGFTb3VyY2VJdGVtIHtcbiAgdmFsdWU6IHN0cmluZztcbiAgbGFiZWw6IHN0cmluZztcbn1cblxuZXhwb3J0IHR5cGUgQXV0b2NvbXBsZXRlRGF0YVNvdXJjZSA9IEFycmF5PEF1dG9jb21wbGV0ZURhdGFTb3VyY2VJdGVtIHwgc3RyaW5nIHwgbnVtYmVyPjtcblxuQENvbXBvbmVudCh7XG4gIHNlbGVjdG9yOiAnbnotYXV0b2NvbXBsZXRlJyxcbiAgZXhwb3J0QXM6ICduekF1dG9jb21wbGV0ZScsXG4gIHByZXNlcnZlV2hpdGVzcGFjZXM6IGZhbHNlLFxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgdGVtcGxhdGU6IGBcbiAgICA8bmctdGVtcGxhdGU+XG4gICAgICA8ZGl2XG4gICAgICAgICNwYW5lbFxuICAgICAgICBjbGFzcz1cImFudC1zZWxlY3QtZHJvcGRvd24gYW50LXNlbGVjdC1kcm9wZG93bi1wbGFjZW1lbnQtYm90dG9tTGVmdFwiXG4gICAgICAgIFtjbGFzcy5hbnQtc2VsZWN0LWRyb3Bkb3duLWhpZGRlbl09XCIhc2hvd1BhbmVsXCJcbiAgICAgICAgW2NsYXNzLmFudC1zZWxlY3QtZHJvcGRvd24tcnRsXT1cImRpciA9PT0gJ3J0bCdcIlxuICAgICAgICBbbmdDbGFzc109XCJuek92ZXJsYXlDbGFzc05hbWVcIlxuICAgICAgICBbbmdTdHlsZV09XCJuek92ZXJsYXlTdHlsZVwiXG4gICAgICAgIFtuek5vQW5pbWF0aW9uXT1cIm5vQW5pbWF0aW9uPy5uek5vQW5pbWF0aW9uXCJcbiAgICAgICAgW0BzbGlkZU1vdGlvbl09XCInZW50ZXInXCJcbiAgICAgICAgW0AuZGlzYWJsZWRdPVwibm9BbmltYXRpb24/Lm56Tm9BbmltYXRpb25cIlxuICAgICAgPlxuICAgICAgICA8ZGl2IHN0eWxlPVwibWF4LWhlaWdodDogMjU2cHg7IG92ZXJmbG93LXk6IGF1dG87IG92ZXJmbG93LWFuY2hvcjogbm9uZTtcIj5cbiAgICAgICAgICA8ZGl2IHN0eWxlPVwiZGlzcGxheTogZmxleDsgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcIj5cbiAgICAgICAgICAgIDxuZy10ZW1wbGF0ZSAqbmdUZW1wbGF0ZU91dGxldD1cIm56RGF0YVNvdXJjZSA/IG9wdGlvbnNUZW1wbGF0ZSA6IGNvbnRlbnRUZW1wbGF0ZVwiPjwvbmctdGVtcGxhdGU+XG4gICAgICAgICAgPC9kaXY+XG4gICAgICAgIDwvZGl2PlxuICAgICAgPC9kaXY+XG4gICAgICA8bmctdGVtcGxhdGUgI2NvbnRlbnRUZW1wbGF0ZT5cbiAgICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxuICAgICAgPC9uZy10ZW1wbGF0ZT5cbiAgICAgIDxuZy10ZW1wbGF0ZSAjb3B0aW9uc1RlbXBsYXRlPlxuICAgICAgICA8bnotYXV0by1vcHRpb25cbiAgICAgICAgICAqbmdGb3I9XCJsZXQgb3B0aW9uIG9mIG56RGF0YVNvdXJjZSFcIlxuICAgICAgICAgIFtuelZhbHVlXT1cIm9wdGlvblwiXG4gICAgICAgICAgW256TGFiZWxdPVwib3B0aW9uICYmICRhbnkob3B0aW9uKS5sYWJlbCA/ICRhbnkob3B0aW9uKS5sYWJlbCA6ICRhbnkob3B0aW9uKVwiXG4gICAgICAgID5cbiAgICAgICAgICB7eyBvcHRpb24gJiYgJGFueShvcHRpb24pLmxhYmVsID8gJGFueShvcHRpb24pLmxhYmVsIDogJGFueShvcHRpb24pIH19XG4gICAgICAgIDwvbnotYXV0by1vcHRpb24+XG4gICAgICA8L25nLXRlbXBsYXRlPlxuICAgIDwvbmctdGVtcGxhdGU+XG4gIGAsXG4gIGFuaW1hdGlvbnM6IFtzbGlkZU1vdGlvbl1cbn0pXG5leHBvcnQgY2xhc3MgTnpBdXRvY29tcGxldGVDb21wb25lbnQgaW1wbGVtZW50cyBBZnRlckNvbnRlbnRJbml0LCBBZnRlclZpZXdJbml0LCBPbkRlc3Ryb3ksIE9uSW5pdCB7XG4gIHN0YXRpYyBuZ0FjY2VwdElucHV0VHlwZV9uekRlZmF1bHRBY3RpdmVGaXJzdE9wdGlvbjogQm9vbGVhbklucHV0O1xuICBzdGF0aWMgbmdBY2NlcHRJbnB1dFR5cGVfbnpCYWNrZmlsbDogQm9vbGVhbklucHV0O1xuXG4gIEBJbnB1dCgpIG56V2lkdGg/OiBudW1iZXI7XG4gIEBJbnB1dCgpIG56T3ZlcmxheUNsYXNzTmFtZSA9ICcnO1xuICBASW5wdXQoKSBuek92ZXJsYXlTdHlsZTogeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSA9IHt9O1xuICBASW5wdXQoKSBASW5wdXRCb29sZWFuKCkgbnpEZWZhdWx0QWN0aXZlRmlyc3RPcHRpb24gPSB0cnVlO1xuICBASW5wdXQoKSBASW5wdXRCb29sZWFuKCkgbnpCYWNrZmlsbCA9IGZhbHNlO1xuICBASW5wdXQoKSBjb21wYXJlV2l0aDogQ29tcGFyZVdpdGggPSAobzEsIG8yKSA9PiBvMSA9PT0gbzI7XG4gIEBJbnB1dCgpIG56RGF0YVNvdXJjZT86IEF1dG9jb21wbGV0ZURhdGFTb3VyY2U7XG4gIEBPdXRwdXQoKVxuICByZWFkb25seSBzZWxlY3Rpb25DaGFuZ2U6IEV2ZW50RW1pdHRlcjxOekF1dG9jb21wbGV0ZU9wdGlvbkNvbXBvbmVudD4gPSBuZXcgRXZlbnRFbWl0dGVyPE56QXV0b2NvbXBsZXRlT3B0aW9uQ29tcG9uZW50PigpO1xuXG4gIHNob3dQYW5lbDogYm9vbGVhbiA9IHRydWU7XG4gIGlzT3BlbjogYm9vbGVhbiA9IGZhbHNlO1xuICBhY3RpdmVJdGVtITogTnpBdXRvY29tcGxldGVPcHRpb25Db21wb25lbnQ7XG4gIGRpcjogRGlyZWN0aW9uID0gJ2x0cic7XG4gIHByaXZhdGUgZGVzdHJveSQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xuXG4gIC8qKlxuICAgKiBPcHRpb25zIGFjY2Vzc29yLCBpdHMgc291cmNlIG1heSBiZSBjb250ZW50IG9yIGRhdGFTb3VyY2VcbiAgICovXG4gIGdldCBvcHRpb25zKCk6IFF1ZXJ5TGlzdDxOekF1dG9jb21wbGV0ZU9wdGlvbkNvbXBvbmVudD4ge1xuICAgIC8vIGZpcnN0IGRhdGFTb3VyY2VcbiAgICBpZiAodGhpcy5uekRhdGFTb3VyY2UpIHtcbiAgICAgIHJldHVybiB0aGlzLmZyb21EYXRhU291cmNlT3B0aW9ucztcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHRoaXMuZnJvbUNvbnRlbnRPcHRpb25zO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBQcm92aWRlZCBieSBjb250ZW50ICovXG4gIEBDb250ZW50Q2hpbGRyZW4oTnpBdXRvY29tcGxldGVPcHRpb25Db21wb25lbnQsIHsgZGVzY2VuZGFudHM6IHRydWUgfSlcbiAgZnJvbUNvbnRlbnRPcHRpb25zITogUXVlcnlMaXN0PE56QXV0b2NvbXBsZXRlT3B0aW9uQ29tcG9uZW50PjtcbiAgLyoqIFByb3ZpZGVkIGJ5IGRhdGFTb3VyY2UgKi9cbiAgQFZpZXdDaGlsZHJlbihOekF1dG9jb21wbGV0ZU9wdGlvbkNvbXBvbmVudCkgZnJvbURhdGFTb3VyY2VPcHRpb25zITogUXVlcnlMaXN0PE56QXV0b2NvbXBsZXRlT3B0aW9uQ29tcG9uZW50PjtcblxuICAvKiogY2RrLW92ZXJsYXkgKi9cbiAgQFZpZXdDaGlsZChUZW1wbGF0ZVJlZiwgeyBzdGF0aWM6IGZhbHNlIH0pIHRlbXBsYXRlPzogVGVtcGxhdGVSZWY8e30+O1xuICBAVmlld0NoaWxkKCdwYW5lbCcsIHsgc3RhdGljOiBmYWxzZSB9KSBwYW5lbD86IEVsZW1lbnRSZWY7XG4gIEBWaWV3Q2hpbGQoJ2NvbnRlbnQnLCB7IHN0YXRpYzogZmFsc2UgfSkgY29udGVudD86IEVsZW1lbnRSZWY7XG5cbiAgcHJpdmF0ZSBhY3RpdmVJdGVtSW5kZXg6IG51bWJlciA9IC0xO1xuICBwcml2YXRlIHNlbGVjdGlvbkNoYW5nZVN1YnNjcmlwdGlvbiA9IFN1YnNjcmlwdGlvbi5FTVBUWTtcbiAgcHJpdmF0ZSBvcHRpb25Nb3VzZUVudGVyU3Vic2NyaXB0aW9uID0gU3Vic2NyaXB0aW9uLkVNUFRZO1xuICBwcml2YXRlIGRhdGFTb3VyY2VDaGFuZ2VTdWJzY3JpcHRpb24gPSBTdWJzY3JpcHRpb24uRU1QVFk7XG4gIC8qKiBPcHRpb25zIGNoYW5nZXMgbGlzdGVuZXIgKi9cbiAgcmVhZG9ubHkgb3B0aW9uU2VsZWN0aW9uQ2hhbmdlczogT2JzZXJ2YWJsZTxOek9wdGlvblNlbGVjdGlvbkNoYW5nZT4gPSBkZWZlcigoKSA9PiB7XG4gICAgaWYgKHRoaXMub3B0aW9ucykge1xuICAgICAgcmV0dXJuIG1lcmdlPE56T3B0aW9uU2VsZWN0aW9uQ2hhbmdlPiguLi50aGlzLm9wdGlvbnMubWFwKG9wdGlvbiA9PiBvcHRpb24uc2VsZWN0aW9uQ2hhbmdlKSk7XG4gICAgfVxuICAgIHJldHVybiB0aGlzLm5nWm9uZS5vblN0YWJsZS5hc09ic2VydmFibGUoKS5waXBlKFxuICAgICAgdGFrZSgxKSxcbiAgICAgIHN3aXRjaE1hcCgoKSA9PiB0aGlzLm9wdGlvblNlbGVjdGlvbkNoYW5nZXMpXG4gICAgKTtcbiAgfSk7XG4gIHJlYWRvbmx5IG9wdGlvbk1vdXNlRW50ZXI6IE9ic2VydmFibGU8TnpBdXRvY29tcGxldGVPcHRpb25Db21wb25lbnQ+ID0gZGVmZXIoKCkgPT4ge1xuICAgIGlmICh0aGlzLm9wdGlvbnMpIHtcbiAgICAgIHJldHVybiBtZXJnZTxOekF1dG9jb21wbGV0ZU9wdGlvbkNvbXBvbmVudD4oLi4udGhpcy5vcHRpb25zLm1hcChvcHRpb24gPT4gb3B0aW9uLm1vdXNlRW50ZXJlZCkpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5uZ1pvbmUub25TdGFibGUuYXNPYnNlcnZhYmxlKCkucGlwZShcbiAgICAgIHRha2UoMSksXG4gICAgICBzd2l0Y2hNYXAoKCkgPT4gdGhpcy5vcHRpb25Nb3VzZUVudGVyKVxuICAgICk7XG4gIH0pO1xuXG4gIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgY2hhbmdlRGV0ZWN0b3JSZWY6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByaXZhdGUgbmdab25lOiBOZ1pvbmUsXG4gICAgQE9wdGlvbmFsKCkgcHJpdmF0ZSBkaXJlY3Rpb25hbGl0eTogRGlyZWN0aW9uYWxpdHksXG4gICAgQEhvc3QoKSBAT3B0aW9uYWwoKSBwdWJsaWMgbm9BbmltYXRpb24/OiBOek5vQW5pbWF0aW9uRGlyZWN0aXZlXG4gICkge31cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5kaXJlY3Rpb25hbGl0eS5jaGFuZ2U/LnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKS5zdWJzY3JpYmUoKGRpcmVjdGlvbjogRGlyZWN0aW9uKSA9PiB7XG4gICAgICB0aGlzLmRpciA9IGRpcmVjdGlvbjtcbiAgICAgIHRoaXMuY2hhbmdlRGV0ZWN0b3JSZWYuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH0pO1xuXG4gICAgdGhpcy5kaXIgPSB0aGlzLmRpcmVjdGlvbmFsaXR5LnZhbHVlO1xuICB9XG5cbiAgbmdBZnRlckNvbnRlbnRJbml0KCk6IHZvaWQge1xuICAgIGlmICghdGhpcy5uekRhdGFTb3VyY2UpIHtcbiAgICAgIHRoaXMub3B0aW9uc0luaXQoKTtcbiAgICB9XG4gIH1cblxuICBuZ0FmdGVyVmlld0luaXQoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMubnpEYXRhU291cmNlKSB7XG4gICAgICB0aGlzLm9wdGlvbnNJbml0KCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5kYXRhU291cmNlQ2hhbmdlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgdGhpcy5zZWxlY3Rpb25DaGFuZ2VTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLm9wdGlvbk1vdXNlRW50ZXJTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLmRlc3Ryb3kkLm5leHQoKTtcbiAgICB0aGlzLmRlc3Ryb3kkLmNvbXBsZXRlKCk7XG4gIH1cblxuICBzZXRWaXNpYmlsaXR5KCk6IHZvaWQge1xuICAgIHRoaXMuc2hvd1BhbmVsID0gISF0aGlzLm9wdGlvbnMubGVuZ3RoO1xuICAgIHRoaXMuY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gIH1cblxuICBzZXRBY3RpdmVJdGVtKGluZGV4OiBudW1iZXIpOiB2b2lkIHtcbiAgICBjb25zdCBhY3RpdmVJdGVtID0gdGhpcy5vcHRpb25zLnRvQXJyYXkoKVtpbmRleF07XG4gICAgaWYgKGFjdGl2ZUl0ZW0gJiYgIWFjdGl2ZUl0ZW0uYWN0aXZlKSB7XG4gICAgICB0aGlzLmFjdGl2ZUl0ZW0gPSBhY3RpdmVJdGVtO1xuICAgICAgdGhpcy5hY3RpdmVJdGVtSW5kZXggPSBpbmRleDtcbiAgICAgIHRoaXMuY2xlYXJTZWxlY3RlZE9wdGlvbnModGhpcy5hY3RpdmVJdGVtKTtcbiAgICAgIHRoaXMuYWN0aXZlSXRlbS5zZXRBY3RpdmVTdHlsZXMoKTtcbiAgICAgIHRoaXMuY2hhbmdlRGV0ZWN0b3JSZWYubWFya0ZvckNoZWNrKCk7XG4gICAgfVxuICB9XG5cbiAgc2V0TmV4dEl0ZW1BY3RpdmUoKTogdm9pZCB7XG4gICAgY29uc3QgbmV4dEluZGV4ID0gdGhpcy5hY3RpdmVJdGVtSW5kZXggKyAxIDw9IHRoaXMub3B0aW9ucy5sZW5ndGggLSAxID8gdGhpcy5hY3RpdmVJdGVtSW5kZXggKyAxIDogMDtcbiAgICB0aGlzLnNldEFjdGl2ZUl0ZW0obmV4dEluZGV4KTtcbiAgfVxuXG4gIHNldFByZXZpb3VzSXRlbUFjdGl2ZSgpOiB2b2lkIHtcbiAgICBjb25zdCBwcmV2aW91c0luZGV4ID0gdGhpcy5hY3RpdmVJdGVtSW5kZXggLSAxIDwgMCA/IHRoaXMub3B0aW9ucy5sZW5ndGggLSAxIDogdGhpcy5hY3RpdmVJdGVtSW5kZXggLSAxO1xuICAgIHRoaXMuc2V0QWN0aXZlSXRlbShwcmV2aW91c0luZGV4KTtcbiAgfVxuXG4gIGdldE9wdGlvbkluZGV4KHZhbHVlOiBOelNhZmVBbnkpOiBudW1iZXIge1xuICAgIHJldHVybiB0aGlzLm9wdGlvbnMucmVkdWNlKChyZXN1bHQ6IG51bWJlciwgY3VycmVudDogTnpBdXRvY29tcGxldGVPcHRpb25Db21wb25lbnQsIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICAgIHJldHVybiByZXN1bHQgPT09IC0xID8gKHRoaXMuY29tcGFyZVdpdGgodmFsdWUsIGN1cnJlbnQubnpWYWx1ZSkgPyBpbmRleCA6IC0xKSA6IHJlc3VsdDtcbiAgICB9LCAtMSkhO1xuICB9XG5cbiAgZ2V0T3B0aW9uKHZhbHVlOiBOelNhZmVBbnkpOiBOekF1dG9jb21wbGV0ZU9wdGlvbkNvbXBvbmVudCB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLm9wdGlvbnMuZmluZChpdGVtID0+IHRoaXMuY29tcGFyZVdpdGgodmFsdWUsIGl0ZW0ubnpWYWx1ZSkpIHx8IG51bGw7XG4gIH1cblxuICBwcml2YXRlIG9wdGlvbnNJbml0KCk6IHZvaWQge1xuICAgIHRoaXMuc2V0VmlzaWJpbGl0eSgpO1xuICAgIHRoaXMuc3Vic2NyaWJlT3B0aW9uQ2hhbmdlcygpO1xuICAgIGNvbnN0IGNoYW5nZXMgPSB0aGlzLm56RGF0YVNvdXJjZSA/IHRoaXMuZnJvbURhdGFTb3VyY2VPcHRpb25zLmNoYW5nZXMgOiB0aGlzLmZyb21Db250ZW50T3B0aW9ucy5jaGFuZ2VzO1xuICAgIC8vIGFzeW5jXG4gICAgdGhpcy5kYXRhU291cmNlQ2hhbmdlU3Vic2NyaXB0aW9uID0gY2hhbmdlcy5zdWJzY3JpYmUoZSA9PiB7XG4gICAgICBpZiAoIWUuZGlydHkgJiYgdGhpcy5pc09wZW4pIHtcbiAgICAgICAgc2V0VGltZW91dCgoKSA9PiB0aGlzLnNldFZpc2liaWxpdHkoKSk7XG4gICAgICB9XG4gICAgICB0aGlzLnN1YnNjcmliZU9wdGlvbkNoYW5nZXMoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDbGVhciB0aGUgc3RhdHVzIG9mIG9wdGlvbnNcbiAgICovXG4gIGNsZWFyU2VsZWN0ZWRPcHRpb25zKHNraXA/OiBOekF1dG9jb21wbGV0ZU9wdGlvbkNvbXBvbmVudCB8IG51bGwsIGRlc2VsZWN0OiBib29sZWFuID0gZmFsc2UpOiB2b2lkIHtcbiAgICB0aGlzLm9wdGlvbnMuZm9yRWFjaChvcHRpb24gPT4ge1xuICAgICAgaWYgKG9wdGlvbiAhPT0gc2tpcCkge1xuICAgICAgICBpZiAoZGVzZWxlY3QpIHtcbiAgICAgICAgICBvcHRpb24uZGVzZWxlY3QoKTtcbiAgICAgICAgfVxuICAgICAgICBvcHRpb24uc2V0SW5hY3RpdmVTdHlsZXMoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgc3Vic2NyaWJlT3B0aW9uQ2hhbmdlcygpOiB2b2lkIHtcbiAgICB0aGlzLnNlbGVjdGlvbkNoYW5nZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xuICAgIHRoaXMuc2VsZWN0aW9uQ2hhbmdlU3Vic2NyaXB0aW9uID0gdGhpcy5vcHRpb25TZWxlY3Rpb25DaGFuZ2VzXG4gICAgICAucGlwZShmaWx0ZXIoKGV2ZW50OiBOek9wdGlvblNlbGVjdGlvbkNoYW5nZSkgPT4gZXZlbnQuaXNVc2VySW5wdXQpKVxuICAgICAgLnN1YnNjcmliZSgoZXZlbnQ6IE56T3B0aW9uU2VsZWN0aW9uQ2hhbmdlKSA9PiB7XG4gICAgICAgIGV2ZW50LnNvdXJjZS5zZWxlY3QoKTtcbiAgICAgICAgZXZlbnQuc291cmNlLnNldEFjdGl2ZVN0eWxlcygpO1xuICAgICAgICB0aGlzLmFjdGl2ZUl0ZW0gPSBldmVudC5zb3VyY2U7XG4gICAgICAgIHRoaXMuYWN0aXZlSXRlbUluZGV4ID0gdGhpcy5nZXRPcHRpb25JbmRleCh0aGlzLmFjdGl2ZUl0ZW0ubnpWYWx1ZSk7XG4gICAgICAgIHRoaXMuY2xlYXJTZWxlY3RlZE9wdGlvbnMoZXZlbnQuc291cmNlLCB0cnVlKTtcbiAgICAgICAgdGhpcy5zZWxlY3Rpb25DaGFuZ2UuZW1pdChldmVudC5zb3VyY2UpO1xuICAgICAgfSk7XG5cbiAgICB0aGlzLm9wdGlvbk1vdXNlRW50ZXJTdWJzY3JpcHRpb24udW5zdWJzY3JpYmUoKTtcbiAgICB0aGlzLm9wdGlvbk1vdXNlRW50ZXJTdWJzY3JpcHRpb24gPSB0aGlzLm9wdGlvbk1vdXNlRW50ZXIuc3Vic2NyaWJlKChldmVudDogTnpBdXRvY29tcGxldGVPcHRpb25Db21wb25lbnQpID0+IHtcbiAgICAgIGV2ZW50LnNldEFjdGl2ZVN0eWxlcygpO1xuICAgICAgdGhpcy5hY3RpdmVJdGVtID0gZXZlbnQ7XG4gICAgICB0aGlzLmFjdGl2ZUl0ZW1JbmRleCA9IHRoaXMuZ2V0T3B0aW9uSW5kZXgodGhpcy5hY3RpdmVJdGVtLm56VmFsdWUpO1xuICAgICAgdGhpcy5jbGVhclNlbGVjdGVkT3B0aW9ucyhldmVudCk7XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==