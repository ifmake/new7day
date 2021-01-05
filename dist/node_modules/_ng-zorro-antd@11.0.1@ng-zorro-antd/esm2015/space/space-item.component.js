/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { ChangeDetectionStrategy, Component, ElementRef, Renderer2 } from '@angular/core';
const spaceSize = {
    small: 8,
    middle: 16,
    large: 24
};
export class NzSpaceItemComponent {
    constructor(renderer, elementRef) {
        this.renderer = renderer;
        this.elementRef = elementRef;
    }
    setDirectionAndSize(direction, size) {
        const marginSize = typeof size === 'string' ? spaceSize[size] : size;
        if (direction === 'horizontal') {
            this.renderer.removeStyle(this.elementRef.nativeElement, 'margin-bottom');
            this.renderer.setStyle(this.elementRef.nativeElement, 'margin-right', `${marginSize}px`);
        }
        else {
            this.renderer.removeStyle(this.elementRef.nativeElement, 'margin-right');
            this.renderer.setStyle(this.elementRef.nativeElement, 'margin-bottom', `${marginSize}px`);
        }
    }
    ngOnInit() { }
}
NzSpaceItemComponent.decorators = [
    { type: Component, args: [{
                selector: 'nz-space-item, [nz-space-item]',
                changeDetection: ChangeDetectionStrategy.OnPush,
                template: ` <ng-content></ng-content> `,
                host: {
                    class: 'ant-space-item'
                }
            },] }
];
NzSpaceItemComponent.ctorParameters = () => [
    { type: Renderer2 },
    { type: ElementRef }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3BhY2UtaXRlbS5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiLi4vLi4vLi4vY29tcG9uZW50cy9zcGFjZS8iLCJzb3VyY2VzIjpbInNwYWNlLWl0ZW0uY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7R0FHRztBQUVILE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxTQUFTLEVBQUUsVUFBVSxFQUFVLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUlsRyxNQUFNLFNBQVMsR0FBRztJQUNoQixLQUFLLEVBQUUsQ0FBQztJQUNSLE1BQU0sRUFBRSxFQUFFO0lBQ1YsS0FBSyxFQUFFLEVBQUU7Q0FDVixDQUFDO0FBVUYsTUFBTSxPQUFPLG9CQUFvQjtJQUMvQixZQUFvQixRQUFtQixFQUFVLFVBQXNCO1FBQW5ELGFBQVEsR0FBUixRQUFRLENBQVc7UUFBVSxlQUFVLEdBQVYsVUFBVSxDQUFZO0lBQUcsQ0FBQztJQUUzRSxtQkFBbUIsQ0FBQyxTQUEyQixFQUFFLElBQTBCO1FBQ3pFLE1BQU0sVUFBVSxHQUFHLE9BQU8sSUFBSSxLQUFLLFFBQVEsQ0FBQyxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7UUFDckUsSUFBSSxTQUFTLEtBQUssWUFBWSxFQUFFO1lBQzlCLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFLGVBQWUsQ0FBQyxDQUFDO1lBQzFFLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFLGNBQWMsRUFBRSxHQUFHLFVBQVUsSUFBSSxDQUFDLENBQUM7U0FDMUY7YUFBTTtZQUNMLElBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1lBQ3pFLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsYUFBYSxFQUFFLGVBQWUsRUFBRSxHQUFHLFVBQVUsSUFBSSxDQUFDLENBQUM7U0FDM0Y7SUFDSCxDQUFDO0lBRUQsUUFBUSxLQUFVLENBQUM7OztZQXRCcEIsU0FBUyxTQUFDO2dCQUNULFFBQVEsRUFBRSxnQ0FBZ0M7Z0JBQzFDLGVBQWUsRUFBRSx1QkFBdUIsQ0FBQyxNQUFNO2dCQUMvQyxRQUFRLEVBQUUsNkJBQTZCO2dCQUN2QyxJQUFJLEVBQUU7b0JBQ0osS0FBSyxFQUFFLGdCQUFnQjtpQkFDeEI7YUFDRjs7O1lBakJnRSxTQUFTO1lBQTdCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vZ2l0aHViLmNvbS9ORy1aT1JSTy9uZy16b3Jyby1hbnRkL2Jsb2IvbWFzdGVyL0xJQ0VOU0VcbiAqL1xuXG5pbXBvcnQgeyBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBPbkluaXQsIFJlbmRlcmVyMiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuXG5pbXBvcnQgeyBOelNwYWNlRGlyZWN0aW9uLCBOelNwYWNlU2l6ZSB9IGZyb20gJy4vdHlwZXMnO1xuXG5jb25zdCBzcGFjZVNpemUgPSB7XG4gIHNtYWxsOiA4LFxuICBtaWRkbGU6IDE2LFxuICBsYXJnZTogMjRcbn07XG5cbkBDb21wb25lbnQoe1xuICBzZWxlY3RvcjogJ256LXNwYWNlLWl0ZW0sIFtuei1zcGFjZS1pdGVtXScsXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxuICB0ZW1wbGF0ZTogYCA8bmctY29udGVudD48L25nLWNvbnRlbnQ+IGAsXG4gIGhvc3Q6IHtcbiAgICBjbGFzczogJ2FudC1zcGFjZS1pdGVtJ1xuICB9XG59KVxuZXhwb3J0IGNsYXNzIE56U3BhY2VJdGVtQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0IHtcbiAgY29uc3RydWN0b3IocHJpdmF0ZSByZW5kZXJlcjogUmVuZGVyZXIyLCBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYpIHt9XG5cbiAgc2V0RGlyZWN0aW9uQW5kU2l6ZShkaXJlY3Rpb246IE56U3BhY2VEaXJlY3Rpb24sIHNpemU6IG51bWJlciB8IE56U3BhY2VTaXplKTogdm9pZCB7XG4gICAgY29uc3QgbWFyZ2luU2l6ZSA9IHR5cGVvZiBzaXplID09PSAnc3RyaW5nJyA/IHNwYWNlU2l6ZVtzaXplXSA6IHNpemU7XG4gICAgaWYgKGRpcmVjdGlvbiA9PT0gJ2hvcml6b250YWwnKSB7XG4gICAgICB0aGlzLnJlbmRlcmVyLnJlbW92ZVN0eWxlKHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LCAnbWFyZ2luLWJvdHRvbScpO1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ21hcmdpbi1yaWdodCcsIGAke21hcmdpblNpemV9cHhgKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5yZW5kZXJlci5yZW1vdmVTdHlsZSh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ21hcmdpbi1yaWdodCcpO1xuICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZSh0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudCwgJ21hcmdpbi1ib3R0b20nLCBgJHttYXJnaW5TaXplfXB4YCk7XG4gICAgfVxuICB9XG5cbiAgbmdPbkluaXQoKTogdm9pZCB7fVxufVxuIl19