/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { Directionality } from '@angular/cdk/bidi';
import { CdkConnectedOverlay } from '@angular/cdk/overlay';
import { ChangeDetectorRef, ComponentFactoryResolver, Directive, ElementRef, EventEmitter, Optional, Renderer2, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { NzNoAnimationDirective } from 'ng-zorro-antd/core/no-animation';
import { DEFAULT_TOOLTIP_POSITIONS, getPlacementName, POSITION_MAP } from 'ng-zorro-antd/core/overlay';
import { isNotNil, toBoolean } from 'ng-zorro-antd/core/util';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil } from 'rxjs/operators';
export class NzTooltipBaseDirective {
    constructor(elementRef, hostView, resolver, renderer, noAnimation) {
        this.elementRef = elementRef;
        this.hostView = hostView;
        this.resolver = resolver;
        this.renderer = renderer;
        this.noAnimation = noAnimation;
        this.visibleChange = new EventEmitter();
        this.internalVisible = false;
        this.destroy$ = new Subject();
        this.triggerDisposables = [];
    }
    /**
     * This true title that would be used in other parts on this component.
     */
    get _title() {
        return this.title || this.directiveTitle || null;
    }
    get _content() {
        return this.content || this.directiveContent || null;
    }
    get _trigger() {
        return typeof this.trigger !== 'undefined' ? this.trigger : 'hover';
    }
    get _placement() {
        const p = this.placement;
        return Array.isArray(p) && p.length > 0 ? p : typeof p === 'string' && p ? [p] : ['top'];
    }
    get _visible() {
        return (typeof this.visible !== 'undefined' ? this.visible : this.internalVisible) || false;
    }
    get _mouseEnterDelay() {
        return this.mouseEnterDelay || 0.15;
    }
    get _mouseLeaveDelay() {
        return this.mouseLeaveDelay || 0.1;
    }
    get _overlayClassName() {
        return this.overlayClassName || null;
    }
    get _overlayStyle() {
        return this.overlayStyle || null;
    }
    getProxyPropertyMap() {
        return {
            noAnimation: ['noAnimation', () => this.noAnimation]
        };
    }
    ngOnChanges(changes) {
        const { specificTrigger } = changes;
        if (specificTrigger && !specificTrigger.isFirstChange()) {
            this.registerTriggers();
        }
        if (this.component) {
            this.updatePropertiesByChanges(changes);
        }
    }
    ngAfterViewInit() {
        this.createComponent();
        this.registerTriggers();
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
        // Clear toggling timer. Issue #3875 #4317 #4386
        this.clearTogglingTimer();
        this.removeTriggerListeners();
    }
    show() {
        var _a;
        (_a = this.component) === null || _a === void 0 ? void 0 : _a.show();
    }
    hide() {
        var _a;
        (_a = this.component) === null || _a === void 0 ? void 0 : _a.hide();
    }
    /**
     * Force the component to update its position.
     */
    updatePosition() {
        if (this.component) {
            this.component.updatePosition();
        }
    }
    /**
     * Create a dynamic tooltip component. This method can be override.
     */
    createComponent() {
        const componentRef = this.hostView.createComponent(this.componentFactory);
        this.component = componentRef.instance;
        // Remove the component's DOM because it should be in the overlay container.
        this.renderer.removeChild(this.renderer.parentNode(this.elementRef.nativeElement), componentRef.location.nativeElement);
        this.component.setOverlayOrigin({ elementRef: this.origin || this.elementRef });
        this.initProperties();
        this.component.nzVisibleChange.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe((visible) => {
            this.internalVisible = visible;
            this.visibleChange.emit(visible);
        });
    }
    registerTriggers() {
        // When the method gets invoked, all properties has been synced to the dynamic component.
        // After removing the old API, we can just check the directive's own `nzTrigger`.
        const el = this.elementRef.nativeElement;
        const trigger = this.trigger;
        this.removeTriggerListeners();
        if (trigger === 'hover') {
            let overlayElement;
            this.triggerDisposables.push(this.renderer.listen(el, 'mouseenter', () => {
                this.delayEnterLeave(true, true, this._mouseEnterDelay);
            }));
            this.triggerDisposables.push(this.renderer.listen(el, 'mouseleave', () => {
                var _a;
                this.delayEnterLeave(true, false, this._mouseLeaveDelay);
                if (((_a = this.component) === null || _a === void 0 ? void 0 : _a.overlay.overlayRef) && !overlayElement) {
                    overlayElement = this.component.overlay.overlayRef.overlayElement;
                    this.triggerDisposables.push(this.renderer.listen(overlayElement, 'mouseenter', () => {
                        this.delayEnterLeave(false, true, this._mouseEnterDelay);
                    }));
                    this.triggerDisposables.push(this.renderer.listen(overlayElement, 'mouseleave', () => {
                        this.delayEnterLeave(false, false, this._mouseLeaveDelay);
                    }));
                }
            }));
        }
        else if (trigger === 'focus') {
            this.triggerDisposables.push(this.renderer.listen(el, 'focus', () => this.show()));
            this.triggerDisposables.push(this.renderer.listen(el, 'blur', () => this.hide()));
        }
        else if (trigger === 'click') {
            this.triggerDisposables.push(this.renderer.listen(el, 'click', (e) => {
                e.preventDefault();
                this.show();
            }));
        }
        // Else do nothing because user wants to control the visibility programmatically.
    }
    updatePropertiesByChanges(changes) {
        this.updatePropertiesByKeys(Object.keys(changes));
    }
    updatePropertiesByKeys(keys) {
        var _a;
        const mappingProperties = Object.assign({ 
            // common mappings
            title: ['nzTitle', () => this._title], directiveTitle: ['nzTitle', () => this._title], content: ['nzContent', () => this._content], directiveContent: ['nzContent', () => this._content], trigger: ['nzTrigger', () => this._trigger], placement: ['nzPlacement', () => this._placement], visible: ['nzVisible', () => this._visible], mouseEnterDelay: ['nzMouseEnterDelay', () => this._mouseEnterDelay], mouseLeaveDelay: ['nzMouseLeaveDelay', () => this._mouseLeaveDelay], overlayClassName: ['nzOverlayClassName', () => this._overlayClassName], overlayStyle: ['nzOverlayStyle', () => this._overlayStyle] }, this.getProxyPropertyMap());
        (keys || Object.keys(mappingProperties).filter(key => !key.startsWith('directive'))).forEach((property) => {
            if (mappingProperties[property]) {
                const [name, valueFn] = mappingProperties[property];
                this.updateComponentValue(name, valueFn());
            }
        });
        (_a = this.component) === null || _a === void 0 ? void 0 : _a.updateByDirective();
    }
    initProperties() {
        this.updatePropertiesByKeys();
    }
    updateComponentValue(key, value) {
        if (typeof value !== 'undefined') {
            // @ts-ignore
            this.component[key] = value;
        }
    }
    delayEnterLeave(isOrigin, isEnter, delay = -1) {
        if (this.delayTimer) {
            this.clearTogglingTimer();
        }
        else if (delay > 0) {
            this.delayTimer = setTimeout(() => {
                this.delayTimer = undefined;
                isEnter ? this.show() : this.hide();
            }, delay * 1000);
        }
        else {
            // `isOrigin` is used due to the tooltip will not hide immediately
            // (may caused by the fade-out animation).
            isEnter && isOrigin ? this.show() : this.hide();
        }
    }
    removeTriggerListeners() {
        this.triggerDisposables.forEach(dispose => dispose());
        this.triggerDisposables.length = 0;
    }
    clearTogglingTimer() {
        if (this.delayTimer) {
            clearTimeout(this.delayTimer);
            this.delayTimer = undefined;
        }
    }
}
NzTooltipBaseDirective.decorators = [
    { type: Directive }
];
NzTooltipBaseDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: ViewContainerRef },
    { type: ComponentFactoryResolver },
    { type: Renderer2 },
    { type: NzNoAnimationDirective }
];
// tslint:disable-next-line:directive-class-suffix
export class NzTooltipBaseComponent {
    constructor(cdr, directionality, noAnimation) {
        this.cdr = cdr;
        this.directionality = directionality;
        this.noAnimation = noAnimation;
        this.nzTitle = null;
        this.nzContent = null;
        this.nzOverlayStyle = {};
        this.nzVisibleChange = new Subject();
        this._visible = false;
        this._trigger = 'hover';
        this.preferredPlacement = 'top';
        this.dir = 'ltr';
        this._classMap = {};
        this._hasBackdrop = false;
        this._prefix = 'ant-tooltip';
        this._positions = [...DEFAULT_TOOLTIP_POSITIONS];
        this.destroy$ = new Subject();
    }
    set nzVisible(value) {
        const visible = toBoolean(value);
        if (this._visible !== visible) {
            this._visible = visible;
            this.nzVisibleChange.next(visible);
        }
    }
    get nzVisible() {
        return this._visible;
    }
    set nzTrigger(value) {
        this._trigger = value;
    }
    get nzTrigger() {
        return this._trigger;
    }
    set nzPlacement(value) {
        const preferredPosition = value.map(placement => POSITION_MAP[placement]);
        this._positions = [...preferredPosition, ...DEFAULT_TOOLTIP_POSITIONS];
    }
    ngOnInit() {
        var _a;
        (_a = this.directionality.change) === null || _a === void 0 ? void 0 : _a.pipe(takeUntil(this.destroy$)).subscribe((direction) => {
            this.dir = direction;
            this.cdr.detectChanges();
        });
        this.dir = this.directionality.value;
    }
    ngOnDestroy() {
        this.nzVisibleChange.complete();
        this.destroy$.next();
        this.destroy$.complete();
    }
    show() {
        if (this.nzVisible) {
            return;
        }
        if (!this.isEmpty()) {
            this.nzVisible = true;
            this.nzVisibleChange.next(true);
            this.cdr.detectChanges();
        }
        // for ltr for overlay to display tooltip in correct placement in rtl direction.
        if (this.origin && this.overlay && this.overlay.overlayRef && this.overlay.overlayRef.getDirection() === 'rtl') {
            this.overlay.overlayRef.setDirection('ltr');
        }
    }
    hide() {
        if (!this.nzVisible) {
            return;
        }
        this.nzVisible = false;
        this.nzVisibleChange.next(false);
        this.cdr.detectChanges();
    }
    updateByDirective() {
        this.updateStyles();
        this.cdr.detectChanges();
        Promise.resolve().then(() => {
            this.updatePosition();
            this.updateVisibilityByTitle();
        });
    }
    /**
     * Force the component to update its position.
     */
    updatePosition() {
        if (this.origin && this.overlay && this.overlay.overlayRef) {
            this.overlay.overlayRef.updatePosition();
        }
    }
    onPositionChange(position) {
        this.preferredPlacement = getPlacementName(position);
        this.updateStyles();
        // We have to trigger immediate change detection or the element would blink.
        this.cdr.detectChanges();
    }
    updateStyles() {
        this._classMap = {
            [this.nzOverlayClassName]: true,
            [`${this._prefix}-placement-${this.preferredPlacement}`]: true
        };
    }
    setOverlayOrigin(origin) {
        this.origin = origin;
        this.cdr.markForCheck();
    }
    onClickOutside(event) {
        if (!this.origin.elementRef.nativeElement.contains(event.target)) {
            this.hide();
        }
    }
    /**
     * Hide the component while the content is empty.
     */
    updateVisibilityByTitle() {
        if (this.isEmpty()) {
            this.hide();
        }
    }
}
NzTooltipBaseComponent.decorators = [
    { type: Directive }
];
NzTooltipBaseComponent.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: Directionality, decorators: [{ type: Optional }] },
    { type: NzNoAnimationDirective }
];
NzTooltipBaseComponent.propDecorators = {
    overlay: [{ type: ViewChild, args: ['overlay', { static: false },] }]
};
export function isTooltipEmpty(value) {
    return value instanceof TemplateRef ? false : value === '' || !isNotNil(value);
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9jb21wb25lbnRzL3Rvb2x0aXAvIiwic291cmNlcyI6WyJiYXNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7R0FHRztBQUVILE9BQU8sRUFBYSxjQUFjLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUM5RCxPQUFPLEVBQUUsbUJBQW1CLEVBQTRFLE1BQU0sc0JBQXNCLENBQUM7QUFDckksT0FBTyxFQUVMLGlCQUFpQixFQUVqQix3QkFBd0IsRUFDeEIsU0FBUyxFQUNULFVBQVUsRUFDVixZQUFZLEVBSVosUUFBUSxFQUNSLFNBQVMsRUFFVCxXQUFXLEVBQ1gsU0FBUyxFQUNULGdCQUFnQixFQUNqQixNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxpQ0FBaUMsQ0FBQztBQUN6RSxPQUFPLEVBQUUseUJBQXlCLEVBQUUsZ0JBQWdCLEVBQUUsWUFBWSxFQUFFLE1BQU0sNEJBQTRCLENBQUM7QUFFdkcsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUM5RCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQy9CLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQVNqRSxNQUFNLE9BQWdCLHNCQUFzQjtJQTJFMUMsWUFDUyxVQUFzQixFQUNuQixRQUEwQixFQUMxQixRQUFrQyxFQUNsQyxRQUFtQixFQUNuQixXQUFvQztRQUp2QyxlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQ25CLGFBQVEsR0FBUixRQUFRLENBQWtCO1FBQzFCLGFBQVEsR0FBUixRQUFRLENBQTBCO1FBQ2xDLGFBQVEsR0FBUixRQUFRLENBQVc7UUFDbkIsZ0JBQVcsR0FBWCxXQUFXLENBQXlCO1FBbkVoRCxrQkFBYSxHQUFHLElBQUksWUFBWSxFQUFXLENBQUM7UUErQ3BDLG9CQUFlLEdBQUcs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OUIsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFO1lBQ2hFLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUNiO0lBQ0gsQ0FBQztJQUVEOztPQUVHO0lBQ0ssdUJBQXVCO1FBQzdCLElBQUksSUFBSSxDQUFDLE9BQU8sRUFBRSxFQUFFO1lBQ2xCLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztTQUNiO0lBQ0gsQ0FBQzs7O1lBaEtGLFNBQVM7OztZQXJTUixpQkFBaUI7WUFKQyxjQUFjLHVCQXdXN0IsUUFBUTtZQXBWSixzQkFBc0I7OztzQkEwUjVCLFNBQVMsU0FBQyxTQUFTLEVBQUUsRUFBRSxNQUFNLEVBQUUsS0FBSyxFQUFFOztBQW1LekMsTUFBTSxVQUFVLGNBQWMsQ0FBQyxLQUF3QztJQUNyRSxPQUFPLEtBQUssWUFBWSxXQUFXLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLEVBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNqRixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2dpdGh1Yi5jb20vTkctWk9SUk8vbmctem9ycm8tYW50ZC9ibG9iL21hc3Rlci9MSUNFTlNFXG4gKi9cblxuaW1wb3J0IHsgRGlyZWN0aW9uLCBEaXJlY3Rpb25hbGl0eSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9iaWRpJztcbmltcG9ydCB7IENka0Nvbm5lY3RlZE92ZXJsYXksIENka092ZXJsYXlPcmlnaW4sIENvbm5lY3RlZE92ZXJsYXlQb3NpdGlvbkNoYW5nZSwgQ29ubmVjdGlvblBvc2l0aW9uUGFpciB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9vdmVybGF5JztcbmltcG9ydCB7XG4gIEFmdGVyVmlld0luaXQsXG4gIENoYW5nZURldGVjdG9yUmVmLFxuICBDb21wb25lbnRGYWN0b3J5LFxuICBDb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIsXG4gIERpcmVjdGl2ZSxcbiAgRWxlbWVudFJlZixcbiAgRXZlbnRFbWl0dGVyLFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPcHRpb25hbCxcbiAgUmVuZGVyZXIyLFxuICBTaW1wbGVDaGFuZ2VzLFxuICBUZW1wbGF0ZVJlZixcbiAgVmlld0NoaWxkLFxuICBWaWV3Q29udGFpbmVyUmVmXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgTnpOb0FuaW1hdGlvbkRpcmVjdGl2ZSB9IGZyb20gJ25nLXpvcnJvLWFudGQvY29yZS9uby1hbmltYXRpb24nO1xuaW1wb3J0IHsgREVGQVVMVF9UT09MVElQX1BPU0lUSU9OUywgZ2V0UGxhY2VtZW50TmFtZSwgUE9TSVRJT05fTUFQIH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL292ZXJsYXknO1xuaW1wb3J0IHsgQm9vbGVhbklucHV0LCBOZ0NsYXNzSW50ZXJmYWNlLCBOZ1N0eWxlSW50ZXJmYWNlLCBOelNhZmVBbnksIE56VFNUeXBlIH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL3R5cGVzJztcbmltcG9ydCB7IGlzTm90TmlsLCB0b0Jvb2xlYW4gfSBmcm9tICduZy16b3Jyby1hbnRkL2NvcmUvdXRpbCc7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBkaXN0aW5jdFVudGlsQ2hhbmdlZCwgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xuXG5leHBvcnQgaW50ZXJmYWNlIFByb3BlcnR5TWFwcGluZyB7XG4gIFtrZXk6IHN0cmluZ106IFtzdHJpbmcsICgpID0+IHVua25vd25dO1xufVxuXG5leHBvcnQgdHlwZSBOelRvb2x0aXBUcmlnZ2VyID0gJ2NsaWNrJyB8ICdmb2N1cycgfCAnaG92ZXInIHwgbnVsbDtcblxuQERpcmVjdGl2ZSgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTnpUb29sdGlwQmFzZURpcmVjdGl2ZSBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgT25EZXN0cm95LCBBZnRlclZpZXdJbml0IHtcbiAgZGlyZWN0aXZlVGl0bGU/OiBOelRTVHlwZSB8IG51bGw7XG4gIGRpcmVjdGl2ZUNvbnRlbnQ/OiBOelRTVHlwZSB8IG51bGw7XG4gIHRpdGxlPzogTnpUU1R5cGUgfCBudWxsO1xuICBjb250ZW50PzogTnpUU1R5cGUgfCBudWxsO1xuICB0cmlnZ2VyPzogTnpUb29sdGlwVHJpZ2dlcjtcbiAgcGxhY2VtZW50Pzogc3RyaW5nIHwgc3RyaW5nW107XG4gIG9yaWdpbj86IEVsZW1lbnRSZWY8SFRNTEVsZW1lbnQ+O1xuICB2aXNpYmxlPzogYm9vbGVhbjtcbiAgbW91c2VFbnRlckRlbGF5PzogbnVtYmVyO1xuICBtb3VzZUxlYXZlRGVsYXk/OiBudW1iZXI7XG4gIG92ZXJsYXlDbGFzc05hbWU/OiBzdHJpbmc7XG4gIG92ZXJsYXlTdHlsZT86IE5nU3R5bGVJbnRlcmZhY2U7XG4gIHZpc2libGVDaGFuZ2UgPSBuZXcgRXZlbnRFbWl0dGVyPGJvb2xlYW4+KCk7XG5cbiAgLyoqXG4gICAqIEZvciBjcmVhdGUgdG9vbHRpcCBkeW5hbWljYWxseS4gVGhpcyBzaG91bGQgYmUgb3ZlcnJpZGUgZm9yIGVhY2ggZGlmZmVyZW50IGNvbXBvbmVudC5cbiAgICovXG4gIHByb3RlY3RlZCBjb21wb25lbnRGYWN0b3J5ITogQ29tcG9uZW50RmFjdG9yeTxOelRvb2x0aXBCYXNlQ29tcG9uZW50PjtcblxuICAvKipcbiAgICogVGhpcyB0cnVlIHRpdGxlIHRoYXQgd291bGQgYmUgdXNlZCBpbiBvdGhlciBwYXJ0cyBvbiB0aGlzIGNvbXBvbmVudC5cbiAgICovXG4gIHByb3RlY3RlZCBnZXQgX3RpdGxlKCk6IE56VFNUeXBlIHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMudGl0bGUgfHwgdGhpcy5kaXJlY3RpdmVUaXRsZSB8fCBudWxsO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldCBfY29udGVudCgpOiBOelRTVHlwZSB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLmNvbnRlbnQgfHwgdGhpcy5kaXJlY3RpdmVDb250ZW50IHx8IG51bGw7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0IF90cmlnZ2VyKCk6IE56VG9vbHRpcFRyaWdnZXIge1xuICAgIHJldHVybiB0eXBlb2YgdGhpcy50cmlnZ2VyICE9PSAndW5kZWZpbmVkJyA/IHRoaXMudHJpZ2dlciA6ICdob3Zlcic7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0IF9wbGFjZW1lbnQoKTogc3RyaW5nW10ge1xuICAgIGNvbnN0IHAgPSB0aGlzLnBsYWNlbWVudDtcbiAgICByZXR1cm4gQXJyYXkuaXNBcnJheShwKSAmJiBwLmxlbmd0aCA+IDAgPyBwIDogdHlwZW9mIHAgPT09ICdzdHJpbmcnICYmIHAgPyBbcF0gOiBbJ3RvcCddO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldCBfdmlzaWJsZSgpOiBib29sZWFuIHtcbiAgICByZXR1cm4gKHR5cGVvZiB0aGlzLnZpc2libGUgIT09ICd1bmRlZmluZWQnID8gdGhpcy52aXNpYmxlIDogdGhpcy5pbnRlcm5hbFZpc2libGUpIHx8IGZhbHNlO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldCBfbW91c2VFbnRlckRlbGF5KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMubW91c2VFbnRlckRlbGF5IHx8IDAuMTU7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0IF9tb3VzZUxlYXZlRGVsYXkoKTogbnVtYmVyIHtcbiAgICByZXR1cm4gdGhpcy5tb3VzZUxlYXZlRGVsYXkgfHwgMC4xO1xuICB9XG5cbiAgcHJvdGVjdGVkIGdldCBfb3ZlcmxheUNsYXNzTmFtZSgpOiBzdHJpbmcgfCBudWxsIHtcbiAgICByZXR1cm4gdGhpcy5vdmVybGF5Q2xhc3NOYW1lIHx8IG51bGw7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0IF9vdmVybGF5U3R5bGUoKTogTmdTdHlsZUludGVyZmFjZSB8IG51bGwge1xuICAgIHJldHVybiB0aGlzLm92ZXJsYXlTdHlsZSB8fCBudWxsO1xuICB9XG5cbiAgcHJpdmF0ZSBpbnRlcm5hbFZpc2libGUgPSBmYWxzZTtcblxuICBwcm90ZWN0ZWQgZ2V0UHJveHlQcm9wZXJ0eU1hcCgpOiBQcm9wZXJ0eU1hcHBpbmcge1xuICAgIHJldHVybiB7XG4gICAgICBub0FuaW1hdGlvbjogWydub0FuaW1hdGlvbicsICgpID0+IHRoaXMubm9BbmltYXRpb25dXG4gICAgfTtcbiAgfVxuXG4gIGNvbXBvbmVudD86IE56VG9vbHRpcEJhc2VDb21wb25lbnQ7XG5cbiAgcHJvdGVjdGVkIHJlYWRvbmx5IGRlc3Ryb3kkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcbiAgcHJvdGVjdGVkIHJlYWRvbmx5IHRyaWdnZXJEaXNwb3NhYmxlczogQXJyYXk8KCkgPT4gdm9pZD4gPSBbXTtcblxuICBwcml2YXRlIGRlbGF5VGltZXI/OiBudW1iZXI7XG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHVibGljIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWYsXG4gICAgcHJvdGVjdGVkIGhvc3RWaWV3OiBWaWV3Q29udGFpbmVyUmVmLFxuICAgIHByb3RlY3RlZCByZXNvbHZlcjogQ29tcG9uZW50RmFjdG9yeVJlc29sdmVyLFxuICAgIHByb3RlY3RlZCByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHByb3RlY3RlZCBub0FuaW1hdGlvbj86IE56Tm9BbmltYXRpb25EaXJlY3RpdmVcbiAgKSB7fVxuXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcbiAgICBjb25zdCB7IHNwZWNpZmljVHJpZ2dlciB9ID0gY2hhbmdlcztcblxuICAgIGlmIChzcGVjaWZpY1RyaWdnZXIgJiYgIXNwZWNpZmljVHJpZ2dlci5pc0ZpcnN0Q2hhbmdlKCkpIHtcbiAgICAgIHRoaXMucmVnaXN0ZXJUcmlnZ2VycygpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmNvbXBvbmVudCkge1xuICAgICAgdGhpcy51cGRhdGVQcm9wZXJ0aWVzQnlDaGFuZ2VzKGNoYW5nZXMpO1xuICAgIH1cbiAgfVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmNyZWF0ZUNvbXBvbmVudCgpO1xuICAgIHRoaXMucmVnaXN0ZXJUcmlnZ2VycygpO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5kZXN0cm95JC5uZXh0KCk7XG4gICAgdGhpcy5kZXN0cm95JC5jb21wbGV0ZSgpO1xuXG4gICAgLy8gQ2xlYXIgdG9nZ2xpbmcgdGltZXIuIElzc3VlICMzODc1ICM0MzE3ICM0Mzg2XG4gICAgdGhpcy5jbGVhclRvZ2dsaW5nVGltZXIoKTtcbiAgICB0aGlzLnJlbW92ZVRyaWdnZXJMaXN0ZW5lcnMoKTtcbiAgfVxuXG4gIHNob3coKTogdm9pZCB7XG4gICAgdGhpcy5jb21wb25lbnQ/LnNob3coKTtcbiAgfVxuXG4gIGhpZGUoKTogdm9pZCB7XG4gICAgdGhpcy5jb21wb25lbnQ/LmhpZGUoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGb3JjZSB0aGUgY29tcG9uZW50IHRvIHVwZGF0ZSBpdHMgcG9zaXRpb24uXG4gICAqL1xuICB1cGRhdGVQb3NpdGlvbigpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5jb21wb25lbnQpIHtcbiAgICAgIHRoaXMuY29tcG9uZW50LnVwZGF0ZVBvc2l0aW9uKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSBhIGR5bmFtaWMgdG9vbHRpcCBjb21wb25lbnQuIFRoaXMgbWV0aG9kIGNhbiBiZSBvdmVycmlkZS5cbiAgICovXG4gIHByb3RlY3RlZCBjcmVhdGVDb21wb25lbnQoKTogdm9pZCB7XG4gICAgY29uc3QgY29tcG9uZW50UmVmID0gdGhpcy5ob3N0Vmlldy5jcmVhdGVDb21wb25lbnQodGhpcy5jb21wb25lbnRGYWN0b3J5KTtcblxuICAgIHRoaXMuY29tcG9uZW50ID0gY29tcG9uZW50UmVmLmluc3RhbmNlIGFzIE56VG9vbHRpcEJhc2VDb21wb25lbnQ7XG5cbiAgICAvLyBSZW1vdmUgdGhlIGNvbXBvbmVudCdzIERPTSBiZWNhdXNlIGl0IHNob3VsZCBiZSBpbiB0aGUgb3ZlcmxheSBjb250YWluZXIuXG4gICAgdGhpcy5yZW5kZXJlci5yZW1vdmVDaGlsZCh0aGlzLnJlbmRlcmVyLnBhcmVudE5vZGUodGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQpLCBjb21wb25lbnRSZWYubG9jYXRpb24ubmF0aXZlRWxlbWVudCk7XG4gICAgdGhpcy5jb21wb25lbnQuc2V0T3ZlcmxheU9yaWdpbih7IGVsZW1lbnRSZWY6IHRoaXMub3JpZ2luIHx8IHRoaXMuZWxlbWVudFJlZiB9KTtcblxuICAgIHRoaXMuaW5pdFByb3BlcnRpZXMoKTtcblxuICAgIHRoaXMuY29tcG9uZW50Lm56VmlzaWJsZUNoYW5nZS5waXBlKGRpc3RpbmN0VW50aWxDaGFuZ2VkKCksIHRha2VVbnRpbCh0aGlzLmRlc3Ryb3kkKSkuc3Vic2NyaWJlKCh2aXNpYmxlOiBib29sZWFuKSA9PiB7XG4gICAgICB0aGlzLmludGVybmFsVmlzaWJsZSA9IHZpc2libGU7XG4gICAgICB0aGlzLnZpc2libGVDaGFuZ2UuZW1pdCh2aXNpYmxlKTtcbiAgICB9KTtcbiAgfVxuXG4gIHByb3RlY3RlZCByZWdpc3RlclRyaWdnZXJzKCk6IHZvaWQge1xuICAgIC8vIFdoZW4gdGhlIG1ldGhvZCBnZXRzIGludm9rZWQsIGFsbCBwcm9wZXJ0aWVzIGhhcyBiZWVuIHN5bmNlZCB0byB0aGUgZHluYW1pYyBjb21wb25lbnQuXG4gICAgLy8gQWZ0ZXIgcmVtb3ZpbmcgdGhlIG9sZCBBUEksIHdlIGNhbiBqdXN0IGNoZWNrIHRoZSBkaXJlY3RpdmUncyBvd24gYG56VHJpZ2dlcmAuXG4gICAgY29uc3QgZWwgPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgICBjb25zdCB0cmlnZ2VyID0gdGhpcy50cmlnZ2VyO1xuXG4gICAgdGhpcy5yZW1vdmVUcmlnZ2VyTGlzdGVuZXJzKCk7XG5cbiAgICBpZiAodHJpZ2dlciA9PT0gJ2hvdmVyJykge1xuICAgICAgbGV0IG92ZXJsYXlFbGVtZW50OiBIVE1MRWxlbWVudDtcbiAgICAgIHRoaXMudHJpZ2dlckRpc3Bvc2FibGVzLnB1c2goXG4gICAgICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKGVsLCAnbW91c2VlbnRlcicsICgpID0+IHtcbiAgICAgICAgICB0aGlzLmRlbGF5RW50ZXJMZWF2ZSh0cnVlLCB0cnVlLCB0aGlzLl9tb3VzZUVudGVyRGVsYXkpO1xuICAgICAgICB9KVxuICAgICAgKTtcbiAgICAgIHRoaXMudHJpZ2dlckRpc3Bvc2FibGVzLnB1c2goXG4gICAgICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKGVsLCAnbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICAgICAgICB0aGlzLmRlbGF5RW50ZXJMZWF2ZSh0cnVlLCBmYWxzZSwgdGhpcy5fbW91c2VMZWF2ZURlbGF5KTtcbiAgICAgICAgICBpZiAodGhpcy5jb21wb25lbnQ/Lm92ZXJsYXkub3ZlcmxheVJlZiAmJiAhb3ZlcmxheUVsZW1lbnQpIHtcbiAgICAgICAgICAgIG92ZXJsYXlFbGVtZW50ID0gdGhpcy5jb21wb25lbnQub3ZlcmxheS5vdmVybGF5UmVmLm92ZXJsYXlFbGVtZW50O1xuICAgICAgICAgICAgdGhpcy50cmlnZ2VyRGlzcG9zYWJsZXMucHVzaChcbiAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlci5saXN0ZW4ob3ZlcmxheUVsZW1lbnQsICdtb3VzZWVudGVyJywgKCkgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuZGVsYXlFbnRlckxlYXZlKGZhbHNlLCB0cnVlLCB0aGlzLl9tb3VzZUVudGVyRGVsYXkpO1xuICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlckRpc3Bvc2FibGVzLnB1c2goXG4gICAgICAgICAgICAgIHRoaXMucmVuZGVyZXIubGlzdGVuKG92ZXJsYXlFbGVtZW50LCAnbW91c2VsZWF2ZScsICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmRlbGF5RW50ZXJMZWF2ZShmYWxzZSwgZmFsc2UsIHRoaXMuX21vdXNlTGVhdmVEZWxheSk7XG4gICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICApO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfSBlbHNlIGlmICh0cmlnZ2VyID09PSAnZm9jdXMnKSB7XG4gICAgICB0aGlzLnRyaWdnZXJEaXNwb3NhYmxlcy5wdXNoKHRoaXMucmVuZGVyZXIubGlzdGVuKGVsLCAnZm9jdXMnLCAoKSA9PiB0aGlzLnNob3coKSkpO1xuICAgICAgdGhpcy50cmlnZ2VyRGlzcG9zYWJsZXMucHVzaCh0aGlzLnJlbmRlcmVyLmxpc3RlbihlbCwgJ2JsdXInLCAoKSA9PiB0aGlzLmhpZGUoKSkpO1xuICAgIH0gZWxzZSBpZiAodHJpZ2dlciA9PT0gJ2NsaWNrJykge1xuICAgICAgdGhpcy50cmlnZ2VyRGlzcG9zYWJsZXMucHVzaChcbiAgICAgICAgdGhpcy5yZW5kZXJlci5saXN0ZW4oZWwsICdjbGljaycsIChlOiBNb3VzZUV2ZW50KSA9PiB7XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgIHRoaXMuc2hvdygpO1xuICAgICAgICB9KVxuICAgICAgKTtcbiAgICB9XG4gICAgLy8gRWxzZSBkbyBub3RoaW5nIGJlY2F1c2UgdXNlciB3YW50cyB0byBjb250cm9sIHRoZSB2aXNpYmlsaXR5IHByb2dyYW1tYXRpY2FsbHkuXG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZVByb3BlcnRpZXNCeUNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xuICAgIHRoaXMudXBkYXRlUHJvcGVydGllc0J5S2V5cyhPYmplY3Qua2V5cyhjaGFuZ2VzKSk7XG4gIH1cblxuICBwcml2YXRlIHVwZGF0ZVByb3BlcnRpZXNCeUtleXMoa2V5cz86IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgY29uc3QgbWFwcGluZ1Byb3BlcnRpZXM6IFByb3BlcnR5TWFwcGluZyA9IHtcbiAgICAgIC8vIGNvbW1vbiBtYXBwaW5nc1xuICAgICAgdGl0bGU6IFsnbnpUaXRsZScsICgpID0+IHRoaXMuX3RpdGxlXSxcbiAgICAgIGRpcmVjdGl2ZVRpdGxlOiBbJ256VGl0bGUnLCAoKSA9PiB0aGlzLl90aXRsZV0sXG4gICAgICBjb250ZW50OiBbJ256Q29udGVudCcsICgpID0+IHRoaXMuX2NvbnRlbnRdLFxuICAgICAgZGlyZWN0aXZlQ29udGVudDogWyduekNvbnRlbnQnLCAoKSA9PiB0aGlzLl9jb250ZW50XSxcbiAgICAgIHRyaWdnZXI6IFsnbnpUcmlnZ2VyJywgKCkgPT4gdGhpcy5fdHJpZ2dlcl0sXG4gICAgICBwbGFjZW1lbnQ6IFsnbnpQbGFjZW1lbnQnLCAoKSA9PiB0aGlzLl9wbGFjZW1lbnRdLFxuICAgICAgdmlzaWJsZTogWyduelZpc2libGUnLCAoKSA9PiB0aGlzLl92aXNpYmxlXSxcbiAgICAgIG1vdXNlRW50ZXJEZWxheTogWyduek1vdXNlRW50ZXJEZWxheScsICgpID0+IHRoaXMuX21vdXNlRW50ZXJEZWxheV0sXG4gICAgICBtb3VzZUxlYXZlRGVsYXk6IFsnbnpNb3VzZUxlYXZlRGVsYXknLCAoKSA9PiB0aGlzLl9tb3VzZUxlYXZlRGVsYXldLFxuICAgICAgb3ZlcmxheUNsYXNzTmFtZTogWyduek92ZXJsYXlDbGFzc05hbWUnLCAoKSA9PiB0aGlzLl9vdmVybGF5Q2xhc3NOYW1lXSxcbiAgICAgIG92ZXJsYXlTdHlsZTogWyduek92ZXJsYXlTdHlsZScsICgpID0+IHRoaXMuX292ZXJsYXlTdHlsZV0sXG4gICAgICAuLi50aGlzLmdldFByb3h5UHJvcGVydHlNYXAoKVxuICAgIH07XG5cbiAgICAoa2V5cyB8fCBPYmplY3Qua2V5cyhtYXBwaW5nUHJvcGVydGllcykuZmlsdGVyKGtleSA9PiAha2V5LnN0YXJ0c1dpdGgoJ2RpcmVjdGl2ZScpKSkuZm9yRWFjaCgocHJvcGVydHk6IE56U2FmZUFueSkgPT4ge1xuICAgICAgaWYgKG1hcHBpbmdQcm9wZXJ0aWVzW3Byb3BlcnR5XSkge1xuICAgICAgICBjb25zdCBbbmFtZSwgdmFsdWVGbl0gPSBtYXBwaW5nUHJvcGVydGllc1twcm9wZXJ0eV07XG4gICAgICAgIHRoaXMudXBkYXRlQ29tcG9uZW50VmFsdWUobmFtZSwgdmFsdWVGbigpKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIHRoaXMuY29tcG9uZW50Py51cGRhdGVCeURpcmVjdGl2ZSgpO1xuICB9XG5cbiAgcHJpdmF0ZSBpbml0UHJvcGVydGllcygpOiB2b2lkIHtcbiAgICB0aGlzLnVwZGF0ZVByb3BlcnRpZXNCeUtleXMoKTtcbiAgfVxuXG4gIHByaXZhdGUgdXBkYXRlQ29tcG9uZW50VmFsdWUoa2V5OiBzdHJpbmcsIHZhbHVlOiBOelNhZmVBbnkpOiB2b2lkIHtcbiAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgLy8gQHRzLWlnbm9yZVxuICAgICAgdGhpcy5jb21wb25lbnRba2V5XSA9IHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgZGVsYXlFbnRlckxlYXZlKGlzT3JpZ2luOiBib29sZWFuLCBpc0VudGVyOiBib29sZWFuLCBkZWxheTogbnVtYmVyID0gLTEpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5kZWxheVRpbWVyKSB7XG4gICAgICB0aGlzLmNsZWFyVG9nZ2xpbmdUaW1lcigpO1xuICAgIH0gZWxzZSBpZiAoZGVsYXkgPiAwKSB7XG4gICAgICB0aGlzLmRlbGF5VGltZXIgPSBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgdGhpcy5kZWxheVRpbWVyID0gdW5kZWZpbmVkO1xuICAgICAgICBpc0VudGVyID8gdGhpcy5zaG93KCkgOiB0aGlzLmhpZGUoKTtcbiAgICAgIH0sIGRlbGF5ICogMTAwMCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGBpc09yaWdpbmAgaXMgdXNlZCBkdWUgdG8gdGhlIHRvb2x0aXAgd2lsbCBub3QgaGlkZSBpbW1lZGlhdGVseVxuICAgICAgLy8gKG1heSBjYXVzZWQgYnkgdGhlIGZhZGUtb3V0IGFuaW1hdGlvbikuXG4gICAgICBpc0VudGVyICYmIGlzT3JpZ2luID8gdGhpcy5zaG93KCkgOiB0aGlzLmhpZGUoKTtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHJlbW92ZVRyaWdnZXJMaXN0ZW5lcnMoKTogdm9pZCB7XG4gICAgdGhpcy50cmlnZ2VyRGlzcG9zYWJsZXMuZm9yRWFjaChkaXNwb3NlID0+IGRpc3Bvc2UoKSk7XG4gICAgdGhpcy50cmlnZ2VyRGlzcG9zYWJsZXMubGVuZ3RoID0gMDtcbiAgfVxuXG4gIHByaXZhdGUgY2xlYXJUb2dnbGluZ1RpbWVyKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmRlbGF5VGltZXIpIHtcbiAgICAgIGNsZWFyVGltZW91dCh0aGlzLmRlbGF5VGltZXIpO1xuICAgICAgdGhpcy5kZWxheVRpbWVyID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxufVxuXG5ARGlyZWN0aXZlKClcbi8vIHRzbGludDpkaXNhYmxlLW5leHQtbGluZTpkaXJlY3RpdmUtY2xhc3Mtc3VmZml4XG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTnpUb29sdGlwQmFzZUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uRGVzdHJveSwgT25Jbml0IHtcbiAgc3RhdGljIG5nQWNjZXB0SW5wdXRUeXBlX256VmlzaWJsZTogQm9vbGVhbklucHV0O1xuXG4gIEBWaWV3Q2hpbGQoJ292ZXJsYXknLCB7IHN0YXRpYzogZmFsc2UgfSkgb3ZlcmxheSE6IENka0Nvbm5lY3RlZE92ZXJsYXk7XG5cbiAgbnpUaXRsZTogTnpUU1R5cGUgfCBudWxsID0gbnVsbDtcbiAgbnpDb250ZW50OiBOelRTVHlwZSB8IG51bGwgPSBudWxsO1xuICBuek92ZXJsYXlDbGFzc05hbWUhOiBzdHJpbmc7XG4gIG56T3ZlcmxheVN0eWxlOiBOZ1N0eWxlSW50ZXJmYWNlID0ge307XG4gIG56TW91c2VFbnRlckRlbGF5PzogbnVtYmVyO1xuICBuek1vdXNlTGVhdmVEZWxheT86IG51bWJlcjtcblxuICBuelZpc2libGVDaGFuZ2UgPSBuZXcgU3ViamVjdDxib29sZWFuPigpO1xuXG4gIHNldCBuelZpc2libGUodmFsdWU6IGJvb2xlYW4pIHtcbiAgICBjb25zdCB2aXNpYmxlID0gdG9Cb29sZWFuKHZhbHVlKTtcbiAgICBpZiAodGhpcy5fdmlzaWJsZSAhPT0gdmlzaWJsZSkge1xuICAgICAgdGhpcy5fdmlzaWJsZSA9IHZpc2libGU7XG4gICAgICB0aGlzLm56VmlzaWJsZUNoYW5nZS5uZXh0KHZpc2libGUpO1xuICAgIH1cbiAgfVxuXG4gIGdldCBuelZpc2libGUoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuX3Zpc2libGU7XG4gIH1cblxuICBfdmlzaWJsZSA9IGZhbHNlO1xuXG4gIHNldCBuelRyaWdnZXIodmFsdWU6IE56VG9vbHRpcFRyaWdnZXIpIHtcbiAgICB0aGlzLl90cmlnZ2VyID0gdmFsdWU7XG4gIH1cblxuICBnZXQgbnpUcmlnZ2VyKCk6IE56VG9vbHRpcFRyaWdnZXIge1xuICAgIHJldHVybiB0aGlzLl90cmlnZ2VyO1xuICB9XG5cbiAgcHJvdGVjdGVkIF90cmlnZ2VyOiBOelRvb2x0aXBUcmlnZ2VyID0gJ2hvdmVyJztcblxuICBzZXQgbnpQbGFjZW1lbnQodmFsdWU6IHN0cmluZ1tdKSB7XG4gICAgY29uc3QgcHJlZmVycmVkUG9zaXRpb24gPSB2YWx1ZS5tYXAocGxhY2VtZW50ID0+IFBPU0lUSU9OX01BUFtwbGFjZW1lbnRdKTtcbiAgICB0aGlzLl9wb3NpdGlvbnMgPSBbLi4ucHJlZmVycmVkUG9zaXRpb24sIC4uLkRFRkFVTFRfVE9PTFRJUF9QT1NJVElPTlNdO1xuICB9XG5cbiAgcHJlZmVycmVkUGxhY2VtZW50OiBzdHJpbmcgPSAndG9wJztcblxuICBvcmlnaW4hOiBDZGtPdmVybGF5T3JpZ2luO1xuXG4gIHB1YmxpYyBkaXI6IERpcmVjdGlvbiA9ICdsdHInO1xuXG4gIF9jbGFzc01hcDogTmdDbGFzc0ludGVyZmFjZSA9IHt9O1xuXG4gIF9oYXNCYWNrZHJvcCA9IGZhbHNlO1xuXG4gIF9wcmVmaXggPSAnYW50LXRvb2x0aXAnO1xuXG4gIF9wb3NpdGlvbnM6IENvbm5lY3Rpb25Qb3NpdGlvblBhaXJbXSA9IFsuLi5ERUZBVUxUX1RPT0xUSVBfUE9TSVRJT05TXTtcblxuICBwcml2YXRlIGRlc3Ryb3kkID0gbmV3IFN1YmplY3Q8dm9pZD4oKTtcblxuICBjb25zdHJ1Y3RvcihcbiAgICBwdWJsaWMgY2RyOiBDaGFuZ2VEZXRlY3RvclJlZixcbiAgICBAT3B0aW9uYWwoKSBwcml2YXRlIGRpcmVjdGlvbmFsaXR5OiBEaXJlY3Rpb25hbGl0eSxcbiAgICBwdWJsaWMgbm9BbmltYXRpb24/OiBOek5vQW5pbWF0aW9uRGlyZWN0aXZlXG4gICkge31cbiAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgdGhpcy5kaXJlY3Rpb25hbGl0eS5jaGFuZ2U/LnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKS5zdWJzY3JpYmUoKGRpcmVjdGlvbjogRGlyZWN0aW9uKSA9PiB7XG4gICAgICB0aGlzLmRpciA9IGRpcmVjdGlvbjtcbiAgICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgICB9KTtcblxuICAgIHRoaXMuZGlyID0gdGhpcy5kaXJlY3Rpb25hbGl0eS52YWx1ZTtcbiAgfVxuXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMubnpWaXNpYmxlQ2hhbmdlLmNvbXBsZXRlKCk7XG4gICAgdGhpcy5kZXN0cm95JC5uZXh0KCk7XG4gICAgdGhpcy5kZXN0cm95JC5jb21wbGV0ZSgpO1xuICB9XG5cbiAgc2hvdygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5uelZpc2libGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBpZiAoIXRoaXMuaXNFbXB0eSgpKSB7XG4gICAgICB0aGlzLm56VmlzaWJsZSA9IHRydWU7XG4gICAgICB0aGlzLm56VmlzaWJsZUNoYW5nZS5uZXh0KHRydWUpO1xuICAgICAgdGhpcy5jZHIuZGV0ZWN0Q2hhbmdlcygpO1xuICAgIH1cblxuICAgIC8vIGZvciBsdHIgZm9yIG92ZXJsYXkgdG8gZGlzcGxheSB0b29sdGlwIGluIGNvcnJlY3QgcGxhY2VtZW50IGluIHJ0bCBkaXJlY3Rpb24uXG4gICAgaWYgKHRoaXMub3JpZ2luICYmIHRoaXMub3ZlcmxheSAmJiB0aGlzLm92ZXJsYXkub3ZlcmxheVJlZiAmJiB0aGlzLm92ZXJsYXkub3ZlcmxheVJlZi5nZXREaXJlY3Rpb24oKSA9PT0gJ3J0bCcpIHtcbiAgICAgIHRoaXMub3ZlcmxheS5vdmVybGF5UmVmLnNldERpcmVjdGlvbignbHRyJyk7XG4gICAgfVxuICB9XG5cbiAgaGlkZSgpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMubnpWaXNpYmxlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgdGhpcy5uelZpc2libGUgPSBmYWxzZTtcbiAgICB0aGlzLm56VmlzaWJsZUNoYW5nZS5uZXh0KGZhbHNlKTtcbiAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gIH1cblxuICB1cGRhdGVCeURpcmVjdGl2ZSgpOiB2b2lkIHtcbiAgICB0aGlzLnVwZGF0ZVN0eWxlcygpO1xuICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcblxuICAgIFByb21pc2UucmVzb2x2ZSgpLnRoZW4oKCkgPT4ge1xuICAgICAgdGhpcy51cGRhdGVQb3NpdGlvbigpO1xuICAgICAgdGhpcy51cGRhdGVWaXNpYmlsaXR5QnlUaXRsZSgpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEZvcmNlIHRoZSBjb21wb25lbnQgdG8gdXBkYXRlIGl0cyBwb3NpdGlvbi5cbiAgICovXG4gIHVwZGF0ZVBvc2l0aW9uKCk6IHZvaWQge1xuICAgIGlmICh0aGlzLm9yaWdpbiAmJiB0aGlzLm92ZXJsYXkgJiYgdGhpcy5vdmVybGF5Lm92ZXJsYXlSZWYpIHtcbiAgICAgIHRoaXMub3ZlcmxheS5vdmVybGF5UmVmLnVwZGF0ZVBvc2l0aW9uKCk7XG4gICAgfVxuICB9XG5cbiAgb25Qb3NpdGlvbkNoYW5nZShwb3NpdGlvbjogQ29ubmVjdGVkT3ZlcmxheVBvc2l0aW9uQ2hhbmdlKTogdm9pZCB7XG4gICAgdGhpcy5wcmVmZXJyZWRQbGFjZW1lbnQgPSBnZXRQbGFjZW1lbnROYW1lKHBvc2l0aW9uKSE7XG4gICAgdGhpcy51cGRhdGVTdHlsZXMoKTtcblxuICAgIC8vIFdlIGhhdmUgdG8gdHJpZ2dlciBpbW1lZGlhdGUgY2hhbmdlIGRldGVjdGlvbiBvciB0aGUgZWxlbWVudCB3b3VsZCBibGluay5cbiAgICB0aGlzLmNkci5kZXRlY3RDaGFuZ2VzKCk7XG4gIH1cblxuICB1cGRhdGVTdHlsZXMoKTogdm9pZCB7XG4gICAgdGhpcy5fY2xhc3NNYXAgPSB7XG4gICAgICBbdGhpcy5uek92ZXJsYXlDbGFzc05hbWVdOiB0cnVlLFxuICAgICAgW2Ake3RoaXMuX3ByZWZpeH0tcGxhY2VtZW50LSR7dGhpcy5wcmVmZXJyZWRQbGFjZW1lbnR9YF06IHRydWVcbiAgICB9O1xuICB9XG5cbiAgc2V0T3ZlcmxheU9yaWdpbihvcmlnaW46IENka092ZXJsYXlPcmlnaW4pOiB2b2lkIHtcbiAgICB0aGlzLm9yaWdpbiA9IG9yaWdpbjtcbiAgICB0aGlzLmNkci5tYXJrRm9yQ2hlY2soKTtcbiAgfVxuXG4gIG9uQ2xpY2tPdXRzaWRlKGV2ZW50OiBNb3VzZUV2ZW50KTogdm9pZCB7XG4gICAgaWYgKCF0aGlzLm9yaWdpbi5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY29udGFpbnMoZXZlbnQudGFyZ2V0KSkge1xuICAgICAgdGhpcy5oaWRlKCk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEhpZGUgdGhlIGNvbXBvbmVudCB3aGlsZSB0aGUgY29udGVudCBpcyBlbXB0eS5cbiAgICovXG4gIHByaXZhdGUgdXBkYXRlVmlzaWJpbGl0eUJ5VGl0bGUoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuaXNFbXB0eSgpKSB7XG4gICAgICB0aGlzLmhpZGUoKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRW1wdHkgY29tcG9uZW50IGNhbm5vdCBiZSBvcGVuZWQuXG4gICAqL1xuICBwcm90ZWN0ZWQgYWJzdHJhY3QgaXNFbXB0eSgpOiBib29sZWFuO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNUb29sdGlwRW1wdHkodmFsdWU6IHN0cmluZyB8IFRlbXBsYXRlUmVmPHZvaWQ+IHwgbnVsbCk6IGJvb2xlYW4ge1xuICByZXR1cm4gdmFsdWUgaW5zdGFuY2VvZiBUZW1wbGF0ZVJlZiA/IGZhbHNlIDogdmFsdWUgPT09ICcnIHx8ICFpc05vdE5pbCh2YWx1ZSk7XG59XG4iXX0=