import { Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[appTextHover]'
})
export class TextHoverDirective {

  @Input() hover_color: string;
  constructor(private el: ElementRef) { }
  @HostListener('mouseenter') onMouseEnter() {
    this.addColor(this.hover_color || '#1890ff');
  }
  @HostListener('mouseleave') onMouseLeave() {
    this.addColor(null);
  }
  // 上色
  private addColor(color: string) {
     this.el.nativeElement.style.color = color;
  }
}
