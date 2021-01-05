/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { BACKSPACE } from '@angular/cdk/keycodes';
import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, Host, Input, Optional, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { zoomMotion } from 'ng-zorro-antd/core/animation';
import { NzNoAnimationDirective } from 'ng-zorro-antd/core/no-animation';
import { NzSelectSearchComponent } from './select-search.component';
export class NzSelectTopControlComponent {
    constructor(elementRef, noAnimation) {
        this.elementRef = elementRef;
        this.noAnimation = noAnimation;
        this.showSearch = false;
        this.placeHolder = null;
        this.open = false;
        this.maxTagCount = Infinity;
        this.autofocus = false;
        this.disabled = false;
        this.mode = 'default';
        this.customTemplate = null;
        this.maxTagPlaceholder = null;
        this.removeIcon = null;
        this.listOfTopItem = [];
        this.tokenSeparators = [];
        this.tokenize = new EventEmitter();
        this.inputValueChange = new EventEmitter();
        this.animationEnd = new EventEmitter();
        this.deleteItem = new EventEmitter();
        this.listOfSlicedItem = [];
        this.isShowPlaceholder = true;
        this.isShowSingleLabel = false;
        this.isComposing = false;
        this.inputValue = null;
        // TODO: move to host after View Engine deprecation
        this.elementRef.nativeElement.classList.add('ant-select-selector');
    }
    onHostKeydown(e) {
        const inputValue = e.target.value;
        if (e.keyCode === BACKSPACE && this.mode !== 'default' && !inputValue && this.listOfTopItem.length > 0) {
            e.preventDefault();
            this.onDeleteItem(this.listOfTopItem[this.listOfTopItem.length - 1]);
        }
    }
    updateTemplateVariable() {
        const isSelectedValueEmpty = this.listOfTopItem.length === 0;
        this.isShowPlaceholder = isSelectedValueEmpty && !this.isComposing && !this.inputValue;
        this.isShowSingleLabel = !isSelectedValueEmpty && !this.isComposing && !this.inputValue;
    }
    isComposingChange(isComposing) {
        this.isComposing = isComposing;
        this.updateTemplateVariable();
    }
    onInputValueChange(value) {
        if (value !== this.inputValue) {
            this.inputValue = value;
            this.updateTemplateVariable();
            this.inputValueChange.emit(value);
            this.tokenSeparate(value, this.tokenSeparators);
        }
    }
    tokenSeparate(inputValue, tokenSeparators) {
        const includesSeparators = (str, separators) => {
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < separators.length; ++i) {
                if (str.lastIndexOf(separators[i]) > 0) {
                    return true;
                }
            }
            return false;
        };
        const splitBySeparators = (str, separators) => {
            const reg = new RegExp(`[${separators.join()}]`);
            const array = str.split(reg).filter(token => token);
            return [...new Set(array)];
        };
        if (inputValue &&
            inputValue.length &&
            tokenSeparators.length &&
            this.mode !== 'default' &&
            includesSeparators(inputValue, tokenSeparators)) {
            const listOfLabel = splitBySeparators(inputValue, tokenSeparators);
            this.tokenize.next(listOfLabel);
        }
    }
    clearInputValue() {
        if (this.nzSelectSearchComponent) {
            this.nzSelectSearchComponent.clearInputValue();
        }
    }
    focus() {
        if (this.nzSelectSearchComponent) {
            this.nzSelectSearchComponent.focus();
        }
    }
    blur() {
        if (this.nzSelectSearchComponent) {
            this.nzSelectSearchComponent.blur();
        }
    }
    trackValue(_index, option) {
        return option.nzValue;
    }
    onDeleteItem(item) {
        if (!this.disabled && !item.nzDisabled) {
            this.deleteItem.next(item);
        }
    }
    onAnimationEnd() {
        this.animationEnd.next();
    }
    ngOnChanges(changes) {
        const { listOfTopItem, maxTagCount, customTemplate, maxTagPlaceholder } = changes;
        if (listOfTopItem) {
            this.updateTemplateVariable();
        }
        if (listOfTopItem || maxTagCount || customTemplate || maxTagPlaceholder) {
            const listOfSlicedItem = this.listOfTopItem.slice(0, this.maxTagCount).map(o => {
                return {
                    nzLabel: o.nzLabel,
                    nzValue: o.nzValue,
                    nzDisabled: o.nzDisabled,
                    contentTemplateOutlet: this.customTemplate,
                    contentTemplateOutletContext: o
                };
            });
            if (this.listOfTopItem.length > this.maxTagCount) {
                const exceededLabel = `+ ${this.listOfTopItem.length - this.maxTagCount} ...`;
                const listOfSelectedValue = this.listOfTopItem.map(item => item.nzValue);
                const exceededItem = {
                    nzLabel: exceededLabel,
                    nzValue: '$$__nz_exceeded_item',
                    nzDisabled: true,
                    contentTemplateOutlet: this.maxTagPlaceholder,
                    contentTemplateOutletContext: listOfSelectedValue.slice(this.maxTagCount)
                };
                listOfSlicedItem.push(exceededItem);
            }
            this.listOfSlicedItem = listOfSlicedItem;
        }
    }
}
NzSelectTopControlComponent.decorators = [
    { type: Component, args: [{
                selector: 'nz-select-top-control',
                exportAs: 'nzSelectTopControl',
                preserveWhitespaces: false,
                animations: [zoomMotion],
                changeDetection: ChangeDetectionStrategy.OnPush,
                encapsulation: ViewEncapsulation.None,
                template: `
    <!--single mode-->
    <ng-container [ngSwitch]="mode">
      <ng-container *ngSwitchCase="'default'">
        <nz-select-search
          [disabled]="disabled"
          [value]="inputValue!"
          [showInput]="showSearch"
          [mirrorSync]="false"
          [autofocus]="autofocus"
          [focusTrigger]="open"
          (isComposingChange)="isComposingChange($event)"
          (valueChange)="onInputValueChange($event)"
        ></nz-select-search>
        <nz-select-item
          *ngIf="isShowSingleLabel"
          [deletable]="false"
          [disabled]="false"
          [removeIcon]="removeIcon"
          [label]="listOfTopItem[0].nzLabel"
          [contentTemplateOutlet]="customTemplate"
          [contentTemplateOutletContext]="listOfTopItem[0]"
        ></nz-select-item>
      </ng-container>
      <ng-container *ngSwitchDefault>
        <!--multiple or tags mode-->
        <nz-select-item
          *ngFor="let item of listOfSlicedItem; trackBy: trackValue"
          [@zoomMotion]
          [@.disabled]="noAnimation?.nzNoAnimation"
          [nzNoAnimation]="noAnimation?.nzNoAnimation"
          [removeIcon]="removeIcon"
          [label]="item.nzLabel"
          [disabled]="item.nzDisabled || disabled"
          [contentTemplateOutlet]="item.contentTemplateOutlet"
          [deletable]="true"
          [contentTemplateOutletContext]="item.contentTemplateOutletContext"
          (@zoomMotion.done)="onAnimationEnd()"
          (delete)="onDeleteItem(item.contentTemplateOutletContext)"
        ></nz-select-item>
        <nz-select-search
          [disabled]="disabled"
          [value]="inputValue!"
          [autofocus]="autofocus"
          [showInput]="true"
          [mirrorSync]="true"
          [focusTrigger]="open"
          (isComposingChange)="isComposingChange($event)"
          (valueChange)="onInputValueChange($event)"
        ></nz-select-search>
      </ng-container>
    </ng-container>
    <nz-select-placeholder *ngIf="isShowPlaceholder" [placeholder]="placeHolder"></nz-select-placeholder>
  `,
                host: {
                    '(keydown)': 'onHostKeydown($event)'
                }
            },] }
];
NzSelectTopControlComponent.ctorParameters = () => [
    { type: ElementRef },
    { type: NzNoAnimationDirective, decorators: [{ type: Host }, { type: Optional }] }
];
NzSelectTopControlComponent.propDecorators = {
    showSearch: [{ type: Input }],
    placeHolder: [{ type: Input }],
    open: [{ type: Input }],
    maxTagCount: [{ type: Input }],
    autofocus: [{ type: Input }],
    disabled: [{ type: Input }],
    mode: [{ type: Input }],
    customTemplate: [{ type: Input }],
    maxTagPlaceholder: [{ type: Input }],
    removeIcon: [{ type: Input }],
    listOfTopItem: [{ type: Input }],
    tokenSeparators: [{ type: Input }],
    tokenize: [{ type: Output }],
    inputValueChange: [{ type: Output }],
    animationEnd: [{ type: Output }],
    deleteItem: [{ type: Output }],
    nzSelectSearchComponent: [{ type: ViewChild, args: [NzSelectSearchComponent,] }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VsZWN0LXRvcC1jb250cm9sLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9jb21wb25lbnRzL3NlbGVjdC8iLCJzb3VyY2VzIjpbInNlbGVjdC10b3AtY29udHJvbC5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHO0FBRUgsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ2xELE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBQ1osSUFBSSxFQUNKLEtBQUssRUFFTCxRQUFRLEVBQ1IsTUFBTSxFQUdOLFNBQVMsRUFDVCxpQkFBaUIsRUFDbEIsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLDhCQUE4QixDQUFDO0FBQzFELE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBRXpFLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxNQUFNLDJCQUEyQixDQUFDO0FBb0VwRSxNQUFNLE9BQU8sMkJBQTJCO0lBK0d0QyxZQUFvQixVQUFzQixFQUE2QixXQUFvQztRQUF2RixlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQTZCLGdCQUFXLEdBQVgsV0FBVyxDQUF5QjtRQTlHbEcsZUFBVSxHQUFHLEtBQUssQ0FBQztRQUNuQixnQkFBVyxHQUEyQyxJQUFJLENBQUM7UUFDM0QsU0FBSSxHQUFHLEtBQUssQ0FBQztRQUNiLGdCQUFXLEdBQVcsUUFBUSxDQUFDO1FBQy9CLGNBQVMsR0FBRyxLQUFLLENBQUM7UUFDbEIsYUFBUSxHQUFHLEtBQUssQ0FBQztRQUNqQixTQUFJLEdBQXFCLFNBQVMsQ0FBQztRQUNuQyxtQkFBYyxHQUE2RCxJQUFJLENBQUM7UUFDaEYsc0JBQWlCLEdBQW1ELElBQUksQ0FBQztRQUN6RSxlQUFVLEdBQWtDLElBQUksQ0FBQztRQUNqRCxrQkFBYSxHQUE0QixFQUFFLENBQUM7UUFDNUMsb0JBQWUsR0FBYSxFQUFFLENBQUM7UUFDckIsYUFBUSxHQUFHLElBQUksWUFBWSxFQUFZLENBQUM7UUFDeEMscUJBQWdCLEdBQUcsSUFBSSxZQUFZLEVBQVUsQ0FBQztRQUM5QyxpQkFBWSxHQUFHLElBQUksWUFBWSxFQUFRLENBQUM7UUFDeEMsZUFBVSxHQUFHLElBQUksWUFBWSxFQUF5QixDQUFDO1FBRTFFLHFCQUFnQixHQUFpQyxFQUFFLENBQUM7UUFDcEQsc0JBQWlCLEdBQUcsSUFBSSxDQUFDO1FBQ3pCLHNCQUFpQixHQUFHLEtBQUssQ0FBQztRQUMxQixnQkFBVyxHQUFHLEtBQUssQ0FBQztRQUNwQixlQUFVLEdBQWtCLElBQUksQ0FBQztRQTBGL0IsbURBQW1EO1FBQ25ELElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMscUJBQXFCLENBQUMsQ0FBQztJQUNyRSxDQUFDO0lBMUZELGFBQWEsQ0FBQyxDQUFnQjtRQUM1QixNQUFNLFVBQVUsR0FBSSxDQUFDLENBQUMsTUFBMkIsQ0FBQyxLQUFLLENBQUM7UUFDeEQsSUFBSSxDQUFDLENBQUMsT0FBTyxLQUFLLFNBQVMsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLFNBQVMsSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUU7WUFDdEcsQ0FBQyxDQUFDLGNBQWMsRUFBRSxDQUFDO1lBQ25CLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ3RFO0lBQ0gsQ0FBQztJQUVELHNCQUFzQjtRQUNwQixNQUFNLG9CQUFvQixHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxLQUFLLENBQUMsQ0FBQztRQUM3RCxJQUFJLENBQUMsaUJBQWlCLEdBQUcsb0JBQW9CLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQztRQUN2RixJQUFJLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxvQkFBb0IsSUFBSSxDQUFDLElBQUksQ0FBQyxXQUFXLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO0lBQzFGLENBQUM7SUFFRCxpQkFBaUIsQ0FBQyxXQUFvQjtRQUNwQyxJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztRQUMvQixJQUFJLENBQUMsc0JBQXNCLEVBQUUsQ0FBQztJQUNoQyxDQUFDO0lBRUQsa0JBQWtCLENBQUMsS0FBYTtRQUM5QixJQUFJLEtBQUssS0FBSyxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQzdCLElBQUksQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDO1lBQ3hCLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1lBQzlCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7WUFDbEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDLGVBQWUsQ0FBQyxDQUFDO1NBQ2pEO0lBQ0gsQ0FBQztJQUVELGFBQWEsQ0FBQyxVQUFrQixFQUFFLGVBQXlCO1FBQ3pELE1BQU0sa0JBQWtCLEdBQUcsQ0FBQyxHQUFzQixFQUFFLFVBQW9CLEVBQVcsRUFBRTtZQUNuRix5Q0FBeUM7WUFDekMsS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLFVBQVUsQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLEVBQUU7Z0JBQzFDLElBQUksR0FBRyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUU7b0JBQ3RDLE9BQU8sSUFBSSxDQUFDO2lCQUNiO2FBQ0Y7WUFDRCxPQUFPLEtBQUssQ0FBQztRQUNmLENBQUMsQ0FBQztRQUNGLE1BQU0saUJBQWlCLEdBQUcsQ0FBQyxHQUFzQixFQUFFLFVBQW9CLEVBQVksRUFBRTtZQUNuRixNQUFNLEdBQUcsR0FBRyxJQUFJLE1BQU0sQ0FBQyxJQUFJLFVBQVUsQ0FBQyxJQUFJLEVBQUUsR0FBRyxDQUFDLENBQUM7WUFDakQsTUFBTSxLQUFLLEdBQUksR0FBYyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNoRSxPQUFPLENBQUMsR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQzdCLENBQUMsQ0FBQztRQUNGLElBQ0UsVUFBVTtZQUNWLFVBQVUsQ0FBQyxNQUFNO1lBQ2pCLGVBQWUsQ0FBQyxNQUFNO1lBQ3RCLElBQUksQ0FBQyxJQUFJLEtBQUssU0FBUztZQUN2QixrQkFBa0IsQ0FBQyxVQUFVLEVBQUUsZUFBZSxDQUFDLEVBQy9DO1lBQ0EsTUFBTSxXQUFXLEdBQUcsaUJBQWlCLENBQUMsVUFBVSxFQUFFLGVBQWUsQ0FBQyxDQUFDO1lBQ25FLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQ2pDO0lBQ0gsQ0FBQztJQUVELGVBQWU7UUFDYixJQUFJLElBQUksQ0FBQyx1QkFBdUIsRUFBRTtZQUNoQyxJQUFJLENBQUMsdUJBQXVCLENBQUMsZUFBZSxFQUFFLENBQUM7U0FDaEQ7SUFDSCxDQUFDO0lBRUQsS0FBSztRQUNILElBQUksSUFBSSxDQUFDLHVCQUF1QixFQUFFO1lBQ2hDLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxLQUFLLEVBQUUsQ0FBQztTQUN0QztJQUNILENBQUM7SUFFRCxJQUFJO1FBQ0YsSUFBSSxJQUFJLENBQUMsdUJBQXVCLEVBQUU7WUFDaEMsSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksRUFBRSxDQUFDO1NBQ3JDO0lBQ0gsQ0FBQztJQUVELFVBQVUsQ0FBQyxNQUFjLEVBQUUsTUFBa0M7UUFDM0QsT0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxZQUFZLENBQUMsSUFBMkI7UUFDdEMsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLElBQUksQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFO1lBQ3RDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzVCO0lBQ0gsQ0FBQztJQUVELGNBQWM7UUFDWixJQUFJLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFPRCxXQUFXLENBQUMsT0FBc0I7UUFDaEMsTUFBTSxFQUFFLGFBQWEsRUFBRSxXQUFXLEVBQUUsY0FBYyxFQUFFLGlCQUFpQixFQUFFLEdBQUcsT0FBTyxDQUFDO1FBQ2xGLElBQUksYUFBYSxFQUFFO1lBQ2pCLElBQUksQ0FBQyxzQkFBc0IsRUFBRSxDQUFDO1NBQy9CO1FBQ0QsSUFBSSxhQUFhLElBQUksV0FBVyxJQUFJLGNBQWMsSUFBSSxpQkFBaUIsRUFBRTtZQUN2RSxNQUFNLGdCQUFnQixHQUFpQyxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRTtnQkFDM0csT0FBTztvQkFDTCxPQUFPLEVBQUUsQ0FBQyxDQUFDLE9BQU87b0JBQ2xCLE9BQU8sRUFBRSxDQUFDLENBQUMsT0FBTztvQkFDbEIsVUFBVSxFQUFFLENBQUMsQ0FBQyxVQUFVO29CQUN4QixxQkFBcUIsRUFBRSxJQUFJLENBQUMsY0FBYztvQkFDMUMsNEJBQTRCLEVBQUUsQ0FBQztpQkFDaEMsQ0FBQztZQUNKLENBQUMsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsV0FBVyxFQUFFO2dCQUNoRCxNQUFNLGFBQWEsR0FBRyxLQUFLLElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxXQUFXLE1BQU0sQ0FBQztnQkFDOUUsTUFBTSxtQkFBbUIsR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztnQkFDekUsTUFBTSxZQUFZLEdBQUc7b0JBQ25CLE9BQU8sRUFBRSxhQUFhO29CQUN0QixPQUFPLEVBQUUsc0JBQXNCO29CQUMvQixVQUFVLEVBQUUsSUFBSTtvQkFDaEIscUJBQXFCLEVBQUUsSUFBSSxDQUFDLGlCQUFpQjtvQkFDN0MsNEJBQTRCLEVBQUUsbUJBQW1CLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7aUJBQzFFLENBQUM7Z0JBQ0YsZ0JBQWdCLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO2FBQ3JDO1lBQ0QsSUFBSSxDQUFDLGdCQUFnQixHQUFHLGdCQUFnQixDQUFDO1NBQzFDO0lBQ0gsQ0FBQzs7O1lBbE5GLFNBQVMsU0FBQztnQkFDVCxRQUFRLEVBQUUsdUJBQXVCO2dCQUNqQyxRQUFRLEVBQUUsb0JBQW9CO2dCQUM5QixtQkFBbUIsRUFBRSxLQUFLO2dCQUMxQixVQUFVLEVBQUUsQ0FBQyxVQUFVLENBQUM7Z0JBQ3hCLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxhQUFhLEVBQUUsaUJBQWlCLENBQUMsSUFBSTtnQkFDckMsUUFBUSxFQUFFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXFEVDtnQkFDRCxJQUFJLEVBQUU7b0JBQ0osV0FBVyxFQUFFLHVCQUF1QjtpQkFDckM7YUFDRjs7O1lBbEZDLFVBQVU7WUFhSCxzQkFBc0IsdUJBcUxnQixJQUFJLFlBQUksUUFBUTs7O3lCQTlHNUQsS0FBSzswQkFDTCxLQUFLO21CQUNMLEtBQUs7MEJBQ0wsS0FBSzt3QkFDTCxLQUFLO3VCQUNMLEtBQUs7bUJBQ0wsS0FBSzs2QkFDTCxLQUFLO2dDQUNMLEtBQUs7eUJBQ0wsS0FBSzs0QkFDTCxLQUFLOzhCQUNMLEtBQUs7dUJBQ0wsTUFBTTsrQkFDTixNQUFNOzJCQUNOLE1BQU07eUJBQ04sTUFBTTtzQ0FDTixTQUFTLFNBQUMsdUJBQXVCIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2dpdGh1Yi5jb20vTkctWk9SUk8vbmctem9ycm8tYW50ZC9ibG9iL21hc3Rlci9MSUNFTlNFXG4gKi9cblxuaW1wb3J0IHsgQkFDS1NQQUNFIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL2tleWNvZGVzJztcbmltcG9ydCB7XG4gIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LFxuICBDb21wb25lbnQsXG4gIEVsZW1lbnRSZWYsXG4gIEV2ZW50RW1pdHRlcixcbiAgSG9zdCxcbiAgSW5wdXQsXG4gIE9uQ2hhbmdlcyxcbiAgT3B0aW9uYWwsXG4gIE91dHB1dCxcbiAgU2ltcGxlQ2hhbmdlcyxcbiAgVGVtcGxhdGVSZWYsXG4gIFZpZXdDaGlsZCxcbiAgVmlld0VuY2Fwc3VsYXRpb25cbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyB6b29tTW90aW9uIH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL2FuaW1hdGlvbic7XG5pbXBvcnQgeyBOek5vQW5pbWF0aW9uRGlyZWN0aXZlIH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL25vLWFuaW1hdGlvbic7XG5pbXBvcnQgeyBOelNhZmVBbnkgfSBmcm9tICduZy16b3Jyby1hbnRkL2NvcmUvdHlwZXMnO1xuaW1wb3J0IHsgTnpTZWxlY3RTZWFyY2hDb21wb25lbnQgfSBmcm9tICcuL3NlbGVjdC1zZWFyY2guY29tcG9uZW50JztcbmltcG9ydCB7IE56U2VsZWN0SXRlbUludGVyZmFjZSwgTnpTZWxlY3RNb2RlVHlwZSwgTnpTZWxlY3RUb3BDb250cm9sSXRlbVR5cGUgfSBmcm9tICcuL3NlbGVjdC50eXBlcyc7XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ256LXNlbGVjdC10b3AtY29udHJvbCcsXG4gIGV4cG9ydEFzOiAnbnpTZWxlY3RUb3BDb250cm9sJyxcbiAgcHJlc2VydmVXaGl0ZXNwYWNlczogZmFsc2UsXG4gIGFuaW1hdGlvbnM6IFt6b29tTW90aW9uXSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXG4gIGVuY2Fwc3VsYXRpb246IFZpZXdFbmNhcHN1bGF0aW9uLk5vbmUsXG4gIHRlbXBsYXRlOiBgXG4gICAgPCEtLXNpbmdsZSBtb2RlLS0+XG4gICAgPG5nLWNvbnRhaW5lciBbbmdTd2l0Y2hdPVwibW9kZVwiPlxuICAgICAgPG5nLWNvbnRhaW5lciAqbmdTd2l0Y2hDYXNlPVwiJ2RlZmF1bHQnXCI+XG4gICAgICAgIDxuei1zZWxlY3Qtc2VhcmNoXG4gICAgICAgICAgW2Rpc2FibGVkXT1cImRpc2FibGVkXCJcbiAgICAgICAgICBbdmFsdWVdPVwiaW5wdXRWYWx1ZSFcIlxuICAgICAgICAgIFtzaG93SW5wdXRdPVwic2hvd1NlYXJjaFwiXG4gICAgICAgICAgW21pcnJvclN5bmNdPVwiZmFsc2VcIlxuICAgICAgICAgIFthdXRvZm9jdXNdPVwiYXV0b2ZvY3VzXCJcbiAgICAgICAgICBbZm9jdXNUcmlnZ2VyXT1cIm9wZW5cIlxuICAgICAgICAgIChpc0NvbXBvc2luZ0NoYW5nZSk9XCJpc0NvbXBvc2luZ0NoYW5nZSgkZXZlbnQpXCJcbiAgICAgICAgICAodmFsdWVDaGFuZ2UpPVwib25JbnB1dFZhbHVlQ2hhbmdlKCRldmVudClcIlxuICAgICAgICA+PC9uei1zZWxlY3Qtc2VhcmNoPlxuICAgICAgICA8bnotc2VsZWN0LWl0ZW1cbiAgICAgICAgICAqbmdJZj1cImlzU2hvd1NpbmdsZUxhYmVsXCJcbiAgICAgICAgICBbZGVsZXRhYmxlXT1cImZhbHNlXCJcbiAgICAgICAgICBbZGlzYWJsZWRdPVwiZmFsc2VcIlxuICAgICAgICAgIFtyZW1vdmVJY29uXT1cInJlbW92ZUljb25cIlxuICAgICAgICAgIFtsYWJlbF09XCJsaXN0T2ZUb3BJdGVtWzBdLm56TGFiZWxcIlxuICAgICAgICAgIFtjb250ZW50VGVtcGxhdGVPdXRsZXRdPVwiY3VzdG9tVGVtcGxhdGVcIlxuICAgICAgICAgIFtjb250ZW50VGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cImxpc3RPZlRvcEl0ZW1bMF1cIlxuICAgICAgICA+PC9uei1zZWxlY3QtaXRlbT5cbiAgICAgIDwvbmctY29udGFpbmVyPlxuICAgICAgPG5nLWNvbnRhaW5lciAqbmdTd2l0Y2hEZWZhdWx0PlxuICAgICAgICA8IS0tbXVsdGlwbGUgb3IgdGFncyBtb2RlLS0+XG4gICAgICAgIDxuei1zZWxlY3QtaXRlbVxuICAgICAgICAgICpuZ0Zvcj1cImxldCBpdGVtIG9mIGxpc3RPZlNsaWNlZEl0ZW07IHRyYWNrQnk6IHRyYWNrVmFsdWVcIlxuICAgICAgICAgIFtAem9vbU1vdGlvbl1cbiAgICAgICAgICBbQC5kaXNhYmxlZF09XCJub0FuaW1hdGlvbj8ubnpOb0FuaW1hdGlvblwiXG4gICAgICAgICAgW256Tm9BbmltYXRpb25dPVwibm9BbmltYXRpb24/Lm56Tm9BbmltYXRpb25cIlxuICAgICAgICAgIFtyZW1vdmVJY29uXT1cInJlbW92ZUljb25cIlxuICAgICAgICAgIFtsYWJlbF09XCJpdGVtLm56TGFiZWxcIlxuICAgICAgICAgIFtkaXNhYmxlZF09XCJpdGVtLm56RGlzYWJsZWQgfHwgZGlzYWJsZWRcIlxuICAgICAgICAgIFtjb250ZW50VGVtcGxhdGVPdXRsZXRdPVwiaXRlbS5jb250ZW50VGVtcGxhdGVPdXRsZXRcIlxuICAgICAgICAgIFtkZWxldGFibGVdPVwidHJ1ZVwiXG4gICAgICAgICAgW2NvbnRlbnRUZW1wbGF0ZU91dGxldENvbnRleHRdPVwiaXRlbS5jb250ZW50VGVtcGxhdGVPdXRsZXRDb250ZXh0XCJcbiAgICAgICAgICAoQHpvb21Nb3Rpb24uZG9uZSk9XCJvbkFuaW1hdGlvbkVuZCgpXCJcbiAgICAgICAgICAoZGVsZXRlKT1cIm9uRGVsZXRlSXRlbShpdGVtLmNvbnRlbnRUZW1wbGF0ZU91dGxldENvbnRleHQpXCJcbiAgICAgICAgPjwvbnotc2VsZWN0LWl0ZW0+XG4gICAgICAgIDxuei1zZWxlY3Qtc2VhcmNoXG4gICAgICAgICAgW2Rpc2FibGVkXT1cImRpc2FibGVkXCJcbiAgICAgICAgICBbdmFsdWVdPVwiaW5wdXRWYWx1ZSFcIlxuICAgICAgICAgIFthdXRvZm9jdXNdPVwiYXV0b2ZvY3VzXCJcbiAgICAgICAgICBbc2hvd0lucHV0XT1cInRydWVcIlxuICAgICAgICAgIFttaXJyb3JTeW5jXT1cInRydWVcIlxuICAgICAgICAgIFtmb2N1c1RyaWdnZXJdPVwib3BlblwiXG4gICAgICAgICAgKGlzQ29tcG9zaW5nQ2hhbmdlKT1cImlzQ29tcG9zaW5nQ2hhbmdlKCRldmVudClcIlxuICAgICAgICAgICh2YWx1ZUNoYW5nZSk9XCJvbklucHV0VmFsdWVDaGFuZ2UoJGV2ZW50KVwiXG4gICAgICAgID48L256LXNlbGVjdC1zZWFyY2g+XG4gICAgICA8L25nLWNvbnRhaW5lcj5cbiAgICA8L25nLWNvbnRhaW5lcj5cbiAgICA8bnotc2VsZWN0LXBsYWNlaG9sZGVyICpuZ0lmPVwiaXNTaG93UGxhY2Vob2xkZXJcIiBbcGxhY2Vob2xkZXJdPVwicGxhY2VIb2xkZXJcIj48L256LXNlbGVjdC1wbGFjZWhvbGRlcj5cbiAgYCxcbiAgaG9zdDoge1xuICAgICcoa2V5ZG93biknOiAnb25Ib3N0S2V5ZG93bigkZXZlbnQpJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE56U2VsZWN0VG9wQ29udHJvbENvbXBvbmVudCBpbXBsZW1lbnRzIE9uQ2hhbmdlcyB7XG4gIEBJbnB1dCgpIHNob3dTZWFyY2ggPSBmYWxzZTtcbiAgQElucHV0KCkgcGxhY2VIb2xkZXI6IHN0cmluZyB8IFRlbXBsYXRlUmVmPE56U2FmZUFueT4gfCBudWxsID0gbnVsbDtcbiAgQElucHV0KCkgb3BlbiA9IGZhbHNlO1xuICBASW5wdXQoKSBtYXhUYWdDb3VudDogbnVtYmVyID0gSW5maW5pdHk7XG4gIEBJbnB1dCgpIGF1dG9mb2N1cyA9IGZhbHNlO1xuICBASW5wdXQoKSBkaXNhYmxlZCA9IGZhbHNlO1xuICBASW5wdXQoKSBtb2RlOiBOelNlbGVjdE1vZGVUeXBlID0gJ2RlZmF1bHQnO1xuICBASW5wdXQoKSBjdXN0b21UZW1wbGF0ZTogVGVtcGxhdGVSZWY8eyAkaW1wbGljaXQ6IE56U2VsZWN0SXRlbUludGVyZmFjZSB9PiB8IG51bGwgPSBudWxsO1xuICBASW5wdXQoKSBtYXhUYWdQbGFjZWhvbGRlcjogVGVtcGxhdGVSZWY8eyAkaW1wbGljaXQ6IE56U2FmZUFueVtdIH0+IHwgbnVsbCA9IG51bGw7XG4gIEBJbnB1dCgpIHJlbW92ZUljb246IFRlbXBsYXRlUmVmPE56U2FmZUFueT4gfCBudWxsID0gbnVsbDtcbiAgQElucHV0KCkgbGlzdE9mVG9wSXRlbTogTnpTZWxlY3RJdGVtSW50ZXJmYWNlW10gPSBbXTtcbiAgQElucHV0KCkgdG9rZW5TZXBhcmF0b3JzOiBzdHJpbmdbXSA9IFtdO1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgdG9rZW5pemUgPSBuZXcgRXZlbnRFbWl0dGVyPHN0cmluZ1tdPigpO1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgaW5wdXRWYWx1ZUNoYW5nZSA9IG5ldyBFdmVudEVtaXR0ZXI8c3RyaW5nPigpO1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgYW5pbWF0aW9uRW5kID0gbmV3IEV2ZW50RW1pdHRlcjx2b2lkPigpO1xuICBAT3V0cHV0KCkgcmVhZG9ubHkgZGVsZXRlSXRlbSA9IG5ldyBFdmVudEVtaXR0ZXI8TnpTZWxlY3RJdGVtSW50ZXJmYWNlPigpO1xuICBAVmlld0NoaWxkKE56U2VsZWN0U2VhcmNoQ29tcG9uZW50KSBuelNlbGVjdFNlYXJjaENvbXBvbmVudCE6IE56U2VsZWN0U2VhcmNoQ29tcG9uZW50O1xuICBsaXN0T2ZTbGljZWRJdGVtOiBOelNlbGVjdFRvcENvbnRyb2xJdGVtVHlwZVtdID0gW107XG4gIGlzU2hvd1BsYWNlaG9sZGVyID0gdHJ1ZTtcbiAgaXNTaG93U2luZ2xlTGFiZWwgPSBmYWxzZTtcbiAgaXNDb21wb3NpbmcgPSBmYWxzZTtcbiAgaW5wdXRWYWx1ZTogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG5cbiAgb25Ib3N0S2V5ZG93bihlOiBLZXlib2FyZEV2ZW50KTogdm9pZCB7XG4gICAgY29uc3QgaW5wdXRWYWx1ZSA9IChlLnRhcmdldCBhcyBIVE1MSW5wdXRFbGVtZW50KS52YWx1ZTtcbiAgICBpZiAoZS5rZXlDb2RlID09PSBCQUNLU1BBQ0UgJiYgdGhpcy5tb2RlICE9PSAnZGVmYXVsdCcgJiYgIWlucHV0VmFsdWUgJiYgdGhpcy5saXN0T2ZUb3BJdGVtLmxlbmd0aCA+IDApIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHRoaXMub25EZWxldGVJdGVtKHRoaXMubGlzdE9mVG9wSXRlbVt0aGlzLmxpc3RPZlRvcEl0ZW0ubGVuZ3RoIC0gMV0pO1xuICAgIH1cbiAgfVxuXG4gIHVwZGF0ZVRlbXBsYXRlVmFyaWFibGUoKTogdm9pZCB7XG4gICAgY29uc3QgaXNTZWxlY3RlZFZhbHVlRW1wdHkgPSB0aGlzLmxpc3RPZlRvcEl0ZW0ubGVuZ3RoID09PSAwO1xuICAgIHRoaXMuaXNTaG93UGxhY2Vob2xkZXIgPSBpc1NlbGVjdGVkVmFsdWVFbXB0eSAmJiAhdGhpcy5pc0NvbXBvc2luZyAmJiAhdGhpcy5pbnB1dFZhbHVlO1xuICAgIHRoaXMuaXNTaG93U2luZ2xlTGFiZWwgPSAhaXNTZWxlY3RlZFZhbHVlRW1wdHkgJiYgIXRoaXMuaXNDb21wb3NpbmcgJiYgIXRoaXMuaW5wdXRWYWx1ZTtcbiAgfVxuXG4gIGlzQ29tcG9zaW5nQ2hhbmdlKGlzQ29tcG9zaW5nOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5pc0NvbXBvc2luZyA9IGlzQ29tcG9zaW5nO1xuICAgIHRoaXMudXBkYXRlVGVtcGxhdGVWYXJpYWJsZSgpO1xuICB9XG5cbiAgb25JbnB1dFZhbHVlQ2hhbmdlKHZhbHVlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICBpZiAodmFsdWUgIT09IHRoaXMuaW5wdXRWYWx1ZSkge1xuICAgICAgdGhpcy5pbnB1dFZhbHVlID0gdmFsdWU7XG4gICAgICB0aGlzLnVwZGF0ZVRlbXBsYXRlVmFyaWFibGUoKTtcbiAgICAgIHRoaXMuaW5wdXRWYWx1ZUNoYW5nZS5lbWl0KHZhbHVlKTtcbiAgICAgIHRoaXMudG9rZW5TZXBhcmF0ZSh2YWx1ZSwgdGhpcy50b2tlblNlcGFyYXRvcnMpO1xuICAgIH1cbiAgfVxuXG4gIHRva2VuU2VwYXJhdGUoaW5wdXRWYWx1ZTogc3RyaW5nLCB0b2tlblNlcGFyYXRvcnM6IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgY29uc3QgaW5jbHVkZXNTZXBhcmF0b3JzID0gKHN0cjogc3RyaW5nIHwgc3RyaW5nW10sIHNlcGFyYXRvcnM6IHN0cmluZ1tdKTogYm9vbGVhbiA9PiB7XG4gICAgICAvLyB0c2xpbnQ6ZGlzYWJsZS1uZXh0LWxpbmU6cHJlZmVyLWZvci1vZlxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZXBhcmF0b3JzLmxlbmd0aDsgKytpKSB7XG4gICAgICAgIGlmIChzdHIubGFzdEluZGV4T2Yoc2VwYXJhdG9yc1tpXSkgPiAwKSB7XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuICAgIGNvbnN0IHNwbGl0QnlTZXBhcmF0b3JzID0gKHN0cjogc3RyaW5nIHwgc3RyaW5nW10sIHNlcGFyYXRvcnM6IHN0cmluZ1tdKTogc3RyaW5nW10gPT4ge1xuICAgICAgY29uc3QgcmVnID0gbmV3IFJlZ0V4cChgWyR7c2VwYXJhdG9ycy5qb2luKCl9XWApO1xuICAgICAgY29uc3QgYXJyYXkgPSAoc3RyIGFzIHN0cmluZykuc3BsaXQocmVnKS5maWx0ZXIodG9rZW4gPT4gdG9rZW4pO1xuICAgICAgcmV0dXJuIFsuLi5uZXcgU2V0KGFycmF5KV07XG4gICAgfTtcbiAgICBpZiAoXG4gICAgICBpbnB1dFZhbHVlICYmXG4gICAgICBpbnB1dFZhbHVlLmxlbmd0aCAmJlxuICAgICAgdG9rZW5TZXBhcmF0b3JzLmxlbmd0aCAmJlxuICAgICAgdGhpcy5tb2RlICE9PSAnZGVmYXVsdCcgJiZcbiAgICAgIGluY2x1ZGVzU2VwYXJhdG9ycyhpbnB1dFZhbHVlLCB0b2tlblNlcGFyYXRvcnMpXG4gICAgKSB7XG4gICAgICBjb25zdCBsaXN0T2ZMYWJlbCA9IHNwbGl0QnlTZXBhcmF0b3JzKGlucHV0VmFsdWUsIHRva2VuU2VwYXJhdG9ycyk7XG4gICAgICB0aGlzLnRva2VuaXplLm5leHQobGlzdE9mTGFiZWwpO1xuICAgIH1cbiAgfVxuXG4gIGNsZWFySW5wdXRWYWx1ZSgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5uelNlbGVjdFNlYXJjaENvbXBvbmVudCkge1xuICAgICAgdGhpcy5uelNlbGVjdFNlYXJjaENvbXBvbmVudC5jbGVhcklucHV0VmFsdWUoKTtcbiAgICB9XG4gIH1cblxuICBmb2N1cygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5uelNlbGVjdFNlYXJjaENvbXBvbmVudCkge1xuICAgICAgdGhpcy5uelNlbGVjdFNlYXJjaENvbXBvbmVudC5mb2N1cygpO1xuICAgIH1cbiAgfVxuXG4gIGJsdXIoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMubnpTZWxlY3RTZWFyY2hDb21wb25lbnQpIHtcbiAgICAgIHRoaXMubnpTZWxlY3RTZWFyY2hDb21wb25lbnQuYmx1cigpO1xuICAgIH1cbiAgfVxuXG4gIHRyYWNrVmFsdWUoX2luZGV4OiBudW1iZXIsIG9wdGlvbjogTnpTZWxlY3RUb3BDb250cm9sSXRlbVR5cGUpOiBOelNhZmVBbnkge1xuICAgIHJldHVybiBvcHRpb24ubnpWYWx1ZTtcbiAgfVxuXG4gIG9uRGVsZXRlSXRlbShpdGVtOiBOelNlbGVjdEl0ZW1JbnRlcmZhY2UpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuZGlzYWJsZWQgJiYgIWl0ZW0ubnpEaXNhYmxlZCkge1xuICAgICAgdGhpcy5kZWxldGVJdGVtLm5leHQoaXRlbSk7XG4gICAgfVxuICB9XG5cbiAgb25BbmltYXRpb25FbmQoKTogdm9pZCB7XG4gICAgdGhpcy5hbmltYXRpb25FbmQubmV4dCgpO1xuICB9XG5cbiAgY29uc3RydWN0b3IocHJpdmF0ZSBlbGVtZW50UmVmOiBFbGVtZW50UmVmLCBASG9zdCgpIEBPcHRpb25hbCgpIHB1YmxpYyBub0FuaW1hdGlvbj86IE56Tm9BbmltYXRpb25EaXJlY3RpdmUpIHtcbiAgICAvLyBUT0RPOiBtb3ZlIHRvIGhvc3QgYWZ0ZXIgVmlldyBFbmdpbmUgZGVwcmVjYXRpb25cbiAgICB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudC5jbGFzc0xpc3QuYWRkKCdhbnQtc2VsZWN0LXNlbGVjdG9yJyk7XG4gIH1cblxuICBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgY29uc3QgeyBsaXN0T2ZUb3BJdGVtLCBtYXhUYWdDb3VudCwgY3VzdG9tVGVtcGxhdGUsIG1heFRhZ1BsYWNlaG9sZGVyIH0gPSBjaGFuZ2VzO1xuICAgIGlmIChsaXN0T2ZUb3BJdGVtKSB7XG4gICAgICB0aGlzLnVwZGF0ZVRlbXBsYXRlVmFyaWFibGUoKTtcbiAgICB9XG4gICAgaWYgKGxpc3RPZlRvcEl0ZW0gfHwgbWF4VGFnQ291bnQgfHwgY3VzdG9tVGVtcGxhdGUgfHwgbWF4VGFnUGxhY2Vob2xkZXIpIHtcbiAgICAgIGNvbnN0IGxpc3RPZlNsaWNlZEl0ZW06IE56U2VsZWN0VG9wQ29udHJvbEl0ZW1UeXBlW10gPSB0aGlzLmxpc3RPZlRvcEl0ZW0uc2xpY2UoMCwgdGhpcy5tYXhUYWdDb3VudCkubWFwKG8gPT4ge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIG56TGFiZWw6IG8ubnpMYWJlbCxcbiAgICAgICAgICBuelZhbHVlOiBvLm56VmFsdWUsXG4gICAgICAgICAgbnpEaXNhYmxlZDogby5uekRpc2FibGVkLFxuICAgICAgICAgIGNvbnRlbnRUZW1wbGF0ZU91dGxldDogdGhpcy5jdXN0b21UZW1wbGF0ZSxcbiAgICAgICAgICBjb250ZW50VGVtcGxhdGVPdXRsZXRDb250ZXh0OiBvXG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgICAgIGlmICh0aGlzLmxpc3RPZlRvcEl0ZW0ubGVuZ3RoID4gdGhpcy5tYXhUYWdDb3VudCkge1xuICAgICAgICBjb25zdCBleGNlZWRlZExhYmVsID0gYCsgJHt0aGlzLmxpc3RPZlRvcEl0ZW0ubGVuZ3RoIC0gdGhpcy5tYXhUYWdDb3VudH0gLi4uYDtcbiAgICAgICAgY29uc3QgbGlzdE9mU2VsZWN0ZWRWYWx1ZSA9IHRoaXMubGlzdE9mVG9wSXRlbS5tYXAoaXRlbSA9PiBpdGVtLm56VmFsdWUpO1xuICAgICAgICBjb25zdCBleGNlZWRlZEl0ZW0gPSB7XG4gICAgICAgICAgbnpMYWJlbDogZXhjZWVkZWRMYWJlbCxcbiAgICAgICAgICBuelZhbHVlOiAnJCRfX256X2V4Y2VlZGVkX2l0ZW0nLFxuICAgICAgICAgIG56RGlzYWJsZWQ6IHRydWUsXG4gICAgICAgICAgY29udGVudFRlbXBsYXRlT3V0bGV0OiB0aGlzLm1heFRhZ1BsYWNlaG9sZGVyLFxuICAgICAgICAgIGNvbnRlbnRUZW1wbGF0ZU91dGxldENvbnRleHQ6IGxpc3RPZlNlbGVjdGVkVmFsdWUuc2xpY2UodGhpcy5tYXhUYWdDb3VudClcbiAgICAgICAgfTtcbiAgICAgICAgbGlzdE9mU2xpY2VkSXRlbS5wdXNoKGV4Y2VlZGVkSXRlbSk7XG4gICAgICB9XG4gICAgICB0aGlzLmxpc3RPZlNsaWNlZEl0ZW0gPSBsaXN0T2ZTbGljZWRJdGVtO1xuICAgIH1cbiAgfVxufVxuIl19