/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { Platform } from '@angular/cdk/platform';
import { Directive, ElementRef, Input, NgZone } from '@angular/core';
import { NzResizeService } from 'ng-zorro-antd/core/services';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
export class NzAutosizeDirective {
    constructor(elementRef, ngZone, platform, resizeService) {
        this.elementRef = elementRef;
        this.ngZone = ngZone;
        this.platform = platform;
        this.resizeService = resizeService;
        this.autosize = false;
        this.el = this.elementRef.nativeElement;
        this.maxHeight = null;
        this.minHeight = null;
        this.destroy$ = new Subject();
        this.inputGap = 10;
    }
    set nzAutosize(value) {
        const isAutoSizeType = (data) => {
            return typeof data !== 'string' && typeof data !== 'boolean' && (!!data.maxRows || !!data.minRows);
        };
        if (typeof value === 'string') {
            this.autosize = true;
        }
        else if (isAutoSizeType(value)) {
            this.autosize = value;
            this.minRows = value.minRows;
            this.maxRows = value.maxRows;
            this.maxHeight = this.setMaxHeight();
            this.minHeight = this.setMinHeight();
        }
    }
    resizeToFitContent(force = false) {
        this.cacheTextareaLineHeight();
        // If we haven't determined the line-height yet, we know we're still hidden and there's no point
        // in checking the height of the textarea.
        if (!this.cachedLineHeight) {
            return;
        }
        const textarea = this.el;
        const value = textarea.value;
        // Only resize if the value or minRows have changed since these calculations can be expensive.
        if (!force && this.minRows === this.previousMinRows && value === this.previousValue) {
            return;
        }
        const placeholderText = textarea.placeholder;
        // Reset the textarea height to auto in order to shrink back to its default size.
        // Also temporarily force overflow:hidden, so scroll bars do not interfere with calculations.
        // Long placeholders that are wider than the textarea width may lead to a bigger scrollHeight
        // value. To ensure that the scrollHeight is not bigger than the content, the placeholders
        // need to be removed temporarily.
        textarea.classList.add('nz-textarea-autosize-measuring');
        textarea.placeholder = '';
        let height = Math.round((textarea.scrollHeight - this.inputGap) / this.cachedLineHeight) * this.cachedLineHeight + this.inputGap;
        if (this.maxHeight !== null && height > this.maxHeight) {
            height = this.maxHeight;
        }
        if (this.minHeight !== null && height < this.minHeight) {
            height = this.minHeight;
        }
        // Use the scrollHeight to know how large the textarea *would* be if fit its entire value.
        textarea.style.height = `${height}px`;
        textarea.classList.remove('nz-textarea-autosize-measuring');
        textarea.placeholder = placeholderText;
        // On Firefox resizing the textarea will prevent it from scrolling to the caret position.
        // We need to re-set the selection in order for it to scroll to the proper position.
        if (typeof requestAnimationFrame !== 'undefined') {
            this.ngZone.runOutsideAngular(() => requestAnimationFrame(() => {
                const { selectionStart, selectionEnd } = textarea;
                // IE will throw an "Unspecified error" if we try to set the selection range after the
                // element has been removed from the DOM. Assert that the directive hasn't been destroyed
                // between the time we requested the animation frame and when it was executed.
                // Also note that we have to assert that the textarea is focused before we set the
                // selection range. Setting the selection range on a non-focused textarea will cause
                // it to receive focus on IE and Edge.
                if (!this.destroy$.isStopped && document.activeElement === textarea) {
                    textarea.setSelectionRange(selectionStart, selectionEnd);
                }
            }));
        }
        this.previousValue = value;
        this.previousMinRows = this.minRows;
    }
    cacheTextareaLineHeight() {
        if (this.cachedLineHeight >= 0 || !this.el.parentNode) {
            return;
        }
        // Use a clone element because we have to override some styles.
        const textareaClone = this.el.cloneNode(false);
        textareaClone.rows = 1;
        // Use `position: absolute` so that this doesn't cause a browser layout and use
        // `visibility: hidden` so that nothing is rendered. Clear any other styles that
        // would affect the height.
        textareaClone.style.position = 'absolute';
        textareaClone.style.visibility = 'hidden';
        textareaClone.style.border = 'none';
        textareaClone.style.padding = '0';
        textareaClone.style.height = '';
        textareaClone.style.minHeight = '';
        textareaClone.style.maxHeight = '';
        // In Firefox it happens that textarea elements are always bigger than the specified amount
        // of rows. This is because Firefox tries to add extra space for the horizontal scrollbar.
        // As a workaround that removes the extra space for the scrollbar, we can just set overflow
        // to hidden. This ensures that there is no invalid calculation of the line height.
        // See Firefox bug report: https://bugzilla.mozilla.org/show_bug.cgi?id=33654
        textareaClone.style.overflow = 'hidden';
        this.el.parentNode.appendChild(textareaClone);
        this.cachedLineHeight = textareaClone.clientHeight - this.inputGap;
        this.el.parentNode.removeChild(textareaClone);
        // Min and max heights have to be re-calculated if the cached line height changes
        this.maxHeight = this.setMaxHeight();
        this.minHeight = this.setMinHeight();
    }
    setMinHeight() {
        const minHeight = this.minRows && this.cachedLineHeight ? this.minRows * this.cachedLineHeight + this.inputGap : null;
        if (minHeight !== null) {
            this.el.style.minHeight = `${minHeight}px`;
        }
        return minHeight;
    }
    setMaxHeight() {
        const maxHeight = this.maxRows && this.cachedLineHeight ? this.maxRows * this.cachedLineHeight + this.inputGap : null;
        if (maxHeight !== null) {
            this.el.style.maxHeight = `${maxHeight}px`;
        }
        return maxHeight;
    }
    noopInputHandler() {
        // no-op handler that ensures we're running change detection on input events.
    }
    ngAfterViewInit() {
        if (this.autosize && this.platform.isBrowser) {
            this.resizeToFitContent();
            this.resizeService
                .subscribe()
                .pipe(takeUntil(this.destroy$))
                .subscribe(() => this.resizeToFitContent(true));
        }
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
    ngDoCheck() {
        if (this.autosize && this.platform.isBrowser) {
            this.resizeToFitContent();
        }
    }
}
NzAutosizeDirective.decorators = [
    { type: Directive, args: [{
                selector: 'textarea[nzAutosize]',
                exportAs: 'nzAutosize',
                host: {
                    // Textarea elements that have the directive applied should have a single row by default.
                    // Browsers normally show two rows by default and therefore this limits the minRows binding.
                    rows: '1',
                    '(input)': 'noopInputHandler()'
                }
            },] }
];
NzAutosizeDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: NgZone },
    { type: Platform },
    { type: NzResizeService }
];
NzAutosizeDirective.propDecorators = {
    nzAutosize: [{ type: Input }]
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0b3NpemUuZGlyZWN0aXZlLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uL2NvbXBvbmVudHMvaW5wdXQvIiwic291cmNlcyI6WyJhdXRvc2l6ZS5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHO0FBRUgsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLHVCQUF1QixDQUFDO0FBQ2pELE9BQU8sRUFBaUIsU0FBUyxFQUFXLFVBQVUsRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFhLE1BQU0sZUFBZSxDQUFDO0FBQ3hHLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUM5RCxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBQy9CLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQWlCM0MsTUFBTSxPQUFPLG1CQUFtQjtJQW1KOUIsWUFBb0IsVUFBc0IsRUFBVSxNQUFjLEVBQVUsUUFBa0IsRUFBVSxhQUE4QjtRQUFsSCxlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUFVLGFBQVEsR0FBUixRQUFRLENBQVU7UUFBVSxrQkFBYSxHQUFiLGFBQWEsQ0FBaUI7UUFsSjlILGFBQVEsR0FBMkIsS0FBSyxDQUFDO1FBQ3pDLE9BQUUsR0FBMkMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUM7UUFNM0UsY0FBUyxHQUFrQixJQUFJLENBQUM7UUFDaEMsY0FBUyxHQUFrQixJQUFJLENBQUM7UUFDaEMsYUFBUSxHQUFHLElBQUksT0FBTyxFQUFFLENBQUM7UUFDekIsYUFBUSxHQUFHLEVBQUUsQ0FBQztJQXdJbUgsQ0FBQztJQXRJMUksSUFDSSxVQUFVLENBQUMsS0FBc0M7UUFDbkQsTUFBTSxjQUFjLEdBQUcsQ0FBQyxJQUFxQyxFQUF3QixFQUFFO1lBQ3JGLE9BQU8sT0FBTyxJQUFJLEtBQUssUUFBUSxJQUFJLE9BQU8sSUFBSSxLQUFL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cm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2dpdGh1Yi5jb20vTkctWk9SUk8vbmctem9ycm8tYW50ZC9ibG9iL21hc3Rlci9MSUNFTlNFXG4gKi9cblxuaW1wb3J0IHsgUGxhdGZvcm0gfSBmcm9tICdAYW5ndWxhci9jZGsvcGxhdGZvcm0nO1xuaW1wb3J0IHsgQWZ0ZXJWaWV3SW5pdCwgRGlyZWN0aXZlLCBEb0NoZWNrLCBFbGVtZW50UmVmLCBJbnB1dCwgTmdab25lLCBPbkRlc3Ryb3kgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE56UmVzaXplU2VydmljZSB9IGZyb20gJ25nLXpvcnJvLWFudGQvY29yZS9zZXJ2aWNlcyc7XG5pbXBvcnQgeyBTdWJqZWN0IH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyB0YWtlVW50aWwgfSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQXV0b1NpemVUeXBlIHtcbiAgbWluUm93cz86IG51bWJlcjtcbiAgbWF4Um93cz86IG51bWJlcjtcbn1cblxuQERpcmVjdGl2ZSh7XG4gIHNlbGVjdG9yOiAndGV4dGFyZWFbbnpBdXRvc2l6ZV0nLFxuICBleHBvcnRBczogJ256QXV0b3NpemUnLFxuICBob3N0OiB7XG4gICAgLy8gVGV4dGFyZWEgZWxlbWVudHMgdGhhdCBoYXZlIHRoZSBkaXJlY3RpdmUgYXBwbGllZCBzaG91bGQgaGF2ZSBhIHNpbmdsZSByb3cgYnkgZGVmYXVsdC5cbiAgICAvLyBCcm93c2VycyBub3JtYWxseSBzaG93IHR3byByb3dzIGJ5IGRlZmF1bHQgYW5kIHRoZXJlZm9yZSB0aGlzIGxpbWl0cyB0aGUgbWluUm93cyBiaW5kaW5nLlxuICAgIHJvd3M6ICcxJyxcbiAgICAnKGlucHV0KSc6ICdub29wSW5wdXRIYW5kbGVyKCknXG4gIH1cbn0pXG5leHBvcnQgY2xhc3MgTnpBdXRvc2l6ZURpcmVjdGl2ZSBpbXBsZW1lbnRzIEFmdGVyVmlld0luaXQsIE9uRGVzdHJveSwgRG9DaGVjayB7XG4gIHByaXZhdGUgYXV0b3NpemU6IGJvb2xlYW4gfCBBdXRvU2l6ZVR5cGUgPSBmYWxzZTtcbiAgcHJpdmF0ZSBlbDogSFRNTFRleHRBcmVhRWxlbWVudCB8IEhUTUxJbnB1dEVsZW1lbnQgPSB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgcHJpdmF0ZSBjYWNoZWRMaW5lSGVpZ2h0ITogbnVtYmVyO1xuICBwcml2YXRlIHByZXZpb3VzVmFsdWUhOiBzdHJpbmc7XG4gIHByaXZhdGUgcHJldmlvdXNNaW5Sb3dzOiBudW1iZXIgfCB1bmRlZmluZWQ7XG4gIHByaXZhdGUgbWluUm93czogbnVtYmVyIHwgdW5kZWZpbmVkO1xuICBwcml2YXRlIG1heFJvd3M6IG51bWJlciB8IHVuZGVmaW5lZDtcbiAgcHJpdmF0ZSBtYXhIZWlnaHQ6IG51bWJlciB8IG51bGwgPSBudWxsO1xuICBwcml2YXRlIG1pbkhlaWdodDogbnVtYmVyIHwgbnVsbCA9IG51bGw7XG4gIHByaXZhdGUgZGVzdHJveSQgPSBuZXcgU3ViamVjdCgpO1xuICBwcml2YXRlIGlucHV0R2FwID0gMTA7XG5cbiAgQElucHV0KClcbiAgc2V0IG56QXV0b3NpemUodmFsdWU6IHN0cmluZyB8IGJvb2xlYW4gfCBBdXRvU2l6ZVR5cGUpIHtcbiAgICBjb25zdCBpc0F1dG9TaXplVHlwZSA9IChkYXRhOiBzdHJpbmcgfCBib29sZWFuIHwgQXV0b1NpemVUeXBlKTogZGF0YSBpcyBBdXRvU2l6ZVR5cGUgPT4ge1xuICAgICAgcmV0dXJuIHR5cGVvZiBkYXRhICE9PSAnc3RyaW5nJyAmJiB0eXBlb2YgZGF0YSAhPT0gJ2Jvb2xlYW4nICYmICghIWRhdGEubWF4Um93cyB8fCAhIWRhdGEubWluUm93cyk7XG4gICAgfTtcbiAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgICAgdGhpcy5hdXRvc2l6ZSA9IHRydWU7XG4gICAgfSBlbHNlIGlmIChpc0F1dG9TaXplVHlwZSh2YWx1ZSkpIHtcbiAgICAgIHRoaXMuYXV0b3NpemUgPSB2YWx1ZTtcbiAgICAgIHRoaXMubWluUm93cyA9IHZhbHVlLm1pblJvd3M7XG4gICAgICB0aGlzLm1heFJvd3MgPSB2YWx1ZS5tYXhSb3dzO1xuICAgICAgdGhpcy5tYXhIZWlnaHQgPSB0aGlzLnNldE1heEhlaWdodCgpO1xuICAgICAgdGhpcy5taW5IZWlnaHQgPSB0aGlzLnNldE1pbkhlaWdodCgpO1xuICAgIH1cbiAgfVxuXG4gIHJlc2l6ZVRvRml0Q29udGVudChmb3JjZTogYm9vbGVhbiA9IGZhbHNlKTogdm9pZCB7XG4gICAgdGhpcy5jYWNoZVRleHRhcmVhTGluZUhlaWdodCgpO1xuXG4gICAgLy8gSWYgd2UgaGF2ZW4ndCBkZXRlcm1pbmVkIHRoZSBsaW5lLWhlaWdodCB5ZXQsIHdlIGtub3cgd2UncmUgc3RpbGwgaGlkZGVuIGFuZCB0aGVyZSdzIG5vIHBvaW50XG4gICAgLy8gaW4gY2hlY2tpbmcgdGhlIGhlaWdodCBvZiB0aGUgdGV4dGFyZWEuXG4gICAgaWYgKCF0aGlzLmNhY2hlZExpbmVIZWlnaHQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCB0ZXh0YXJlYSA9IHRoaXMuZWwgYXMgSFRNTFRleHRBcmVhRWxlbWVudDtcbiAgICBjb25zdCB2YWx1ZSA9IHRleHRhcmVhLnZhbHVlO1xuXG4gICAgLy8gT25seSByZXNpemUgaWYgdGhlIHZhbHVlIG9yIG1pblJvd3MgaGF2ZSBjaGFuZ2VkIHNpbmNlIHRoZXNlIGNhbGN1bGF0aW9ucyBjYW4gYmUgZXhwZW5zaXZlLlxuICAgIGlmICghZm9yY2UgJiYgdGhpcy5taW5Sb3dzID09PSB0aGlzLnByZXZpb3VzTWluUm93cyAmJiB2YWx1ZSA9PT0gdGhpcy5wcmV2aW91c1ZhbHVlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHBsYWNlaG9sZGVyVGV4dCA9IHRleHRhcmVhLnBsYWNlaG9sZGVyO1xuXG4gICAgLy8gUmVzZXQgdGhlIHRleHRhcmVhIGhlaWdodCB0byBhdXRvIGluIG9yZGVyIHRvIHNocmluayBiYWNrIHRvIGl0cyBkZWZhdWx0IHNpemUuXG4gICAgLy8gQWxzbyB0ZW1wb3JhcmlseSBmb3JjZSBvdmVyZmxvdzpoaWRkZW4sIHNvIHNjcm9sbCBiYXJzIGRvIG5vdCBpbnRlcmZlcmUgd2l0aCBjYWxjdWxhdGlvbnMuXG4gICAgLy8gTG9uZyBwbGFjZWhvbGRlcnMgdGhhdCBhcmUgd2lkZXIgdGhhbiB0aGUgdGV4dGFyZWEgd2lkdGggbWF5IGxlYWQgdG8gYSBiaWdnZXIgc2Nyb2xsSGVpZ2h0XG4gICAgLy8gdmFsdWUuIFRvIGVuc3VyZSB0aGF0IHRoZSBzY3JvbGxIZWlnaHQgaXMgbm90IGJpZ2dlciB0aGFuIHRoZSBjb250ZW50LCB0aGUgcGxhY2Vob2xkZXJzXG4gICAgLy8gbmVlZCB0byBiZSByZW1vdmVkIHRlbXBvcmFyaWx5LlxuICAgIHRleHRhcmVhLmNsYXNzTGlzdC5hZGQoJ256LXRleHRhcmVhLWF1dG9zaXplLW1lYXN1cmluZycpO1xuICAgIHRleHRhcmVhLnBsYWNlaG9sZGVyID0gJyc7XG4gICAgbGV0IGhlaWdodCA9IE1hdGgucm91bmQoKHRleHRhcmVhLnNjcm9sbEhlaWdodCAtIHRoaXMuaW5wdXRHYXApIC8gdGhpcy5jYWNoZWRMaW5lSGVpZ2h0KSAqIHRoaXMuY2FjaGVkTGluZUhlaWdodCArIHRoaXMuaW5wdXRHYXA7XG4gICAgaWYgKHRoaXMubWF4SGVpZ2h0ICE9PSBudWxsICYmIGhlaWdodCA+IHRoaXMubWF4SGVpZ2h0KSB7XG4gICAgICBoZWlnaHQgPSB0aGlzLm1heEhlaWdodCE7XG4gICAgfVxuICAgIGlmICh0aGlzLm1pbkhlaWdodCAhPT0gbnVsbCAmJiBoZWlnaHQgPCB0aGlzLm1pbkhlaWdodCkge1xuICAgICAgaGVpZ2h0ID0gdGhpcy5taW5IZWlnaHQhO1xuICAgIH1cbiAgICAvLyBVc2UgdGhlIHNjcm9sbEhlaWdodCB0byBrbm93IGhvdyBsYXJnZSB0aGUgdGV4dGFyZWEgKndvdWxkKiBiZSBpZiBmaXQgaXRzIGVudGlyZSB2YWx1ZS5cbiAgICB0ZXh0YXJlYS5zdHlsZS5oZWlnaHQgPSBgJHtoZWlnaHR9cHhgO1xuICAgIHRleHRhcmVhLmNsYXNzTGlzdC5yZW1vdmUoJ256LXRleHRhcmVhLWF1dG9zaXplLW1lYXN1cmluZycpO1xuICAgIHRleHRhcmVhLnBsYWNlaG9sZGVyID0gcGxhY2Vob2xkZXJUZXh0O1xuXG4gICAgLy8gT24gRmlyZWZveCByZXNpemluZyB0aGUgdGV4dGFyZWEgd2lsbCBwcmV2ZW50IGl0IGZyb20gc2Nyb2xsaW5nIHRvIHRoZSBjYXJldCBwb3NpdGlvbi5cbiAgICAvLyBXZSBuZWVkIHRvIHJlLXNldCB0aGUgc2VsZWN0aW9uIGluIG9yZGVyIGZvciBpdCB0byBzY3JvbGwgdG8gdGhlIHByb3BlciBwb3NpdGlvbi5cbiAgICBpZiAodHlwZW9mIHJlcXVlc3RBbmltYXRpb25GcmFtZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgIHRoaXMubmdab25lLnJ1bk91dHNpZGVBbmd1bGFyKCgpID0+XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSgoKSA9PiB7XG4gICAgICAgICAgY29uc3QgeyBzZWxlY3Rpb25TdGFydCwgc2VsZWN0aW9uRW5kIH0gPSB0ZXh0YXJlYTtcblxuICAgICAgICAgIC8vIElFIHdpbGwgdGhyb3cgYW4gXCJVbnNwZWNpZmllZCBlcnJvclwiIGlmIHdlIHRyeSB0byBzZXQgdGhlIHNlbGVjdGlvbiByYW5nZSBhZnRlciB0aGVcbiAgICAgICAgICAvLyBlbGVtZW50IGhhcyBiZWVuIHJlbW92ZWQgZnJvbSB0aGUgRE9NLiBBc3NlcnQgdGhhdCB0aGUgZGlyZWN0aXZlIGhhc24ndCBiZWVuIGRlc3Ryb3llZFxuICAgICAgICAgIC8vIGJldHdlZW4gdGhlIHRpbWUgd2UgcmVxdWVzdGVkIHRoZSBhbmltYXRpb24gZnJhbWUgYW5kIHdoZW4gaXQgd2FzIGV4ZWN1dGVkLlxuICAgICAgICAgIC8vIEFsc28gbm90ZSB0aGF0IHdlIGhhdmUgdG8gYXNzZXJ0IHRoYXQgdGhlIHRleHRhcmVhIGlzIGZvY3VzZWQgYmVmb3JlIHdlIHNldCB0aGVcbiAgICAgICAgICAvLyBzZWxlY3Rpb24gcmFuZ2UuIFNldHRpbmcgdGhlIHNlbGVjdGlvbiByYW5nZSBvbiBhIG5vbi1mb2N1c2VkIHRleHRhcmVhIHdpbGwgY2F1c2VcbiAgICAgICAgICAvLyBpdCB0byByZWNlaXZlIGZvY3VzIG9uIElFIGFuZCBFZGdlLlxuICAgICAgICAgIGlmICghdGhpcy5kZXN0cm95JC5pc1N0b3BwZWQgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCA9PT0gdGV4dGFyZWEpIHtcbiAgICAgICAgICAgIHRleHRhcmVhLnNldFNlbGVjdGlvblJhbmdlKHNlbGVjdGlvblN0YXJ0LCBzZWxlY3Rpb25FbmQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgICk7XG4gICAgfVxuXG4gICAgdGhpcy5wcmV2aW91c1ZhbHVlID0gdmFsdWU7XG4gICAgdGhpcy5wcmV2aW91c01pblJvd3MgPSB0aGlzLm1pblJvd3M7XG4gIH1cblxuICBwcml2YXRlIGNhY2hlVGV4dGFyZWFMaW5lSGVpZ2h0KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmNhY2hlZExpbmVIZWlnaHQgPj0gMCB8fCAhdGhpcy5lbC5wYXJlbnROb2RlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gVXNlIGEgY2xvbmUgZWxlbWVudCBiZWNhdXNlIHdlIGhhdmUgdG8gb3ZlcnJpZGUgc29tZSBzdHlsZXMuXG4gICAgY29uc3QgdGV4dGFyZWFDbG9uZSA9IHRoaXMuZWwuY2xvbmVOb2RlKGZhbHNlKSBhcyBIVE1MVGV4dEFyZWFFbGVtZW50O1xuICAgIHRleHRhcmVhQ2xvbmUucm93cyA9IDE7XG5cbiAgICAvLyBVc2UgYHBvc2l0aW9uOiBhYnNvbHV0ZWAgc28gdGhhdCB0aGlzIGRvZXNuJ3QgY2F1c2UgYSBicm93c2VyIGxheW91dCBhbmQgdXNlXG4gICAgLy8gYHZpc2liaWxpdHk6IGhpZGRlbmAgc28gdGhhdCBub3RoaW5nIGlzIHJlbmRlcmVkLiBDbGVhciBhbnkgb3RoZXIgc3R5bGVzIHRoYXRcbiAgICAvLyB3b3VsZCBhZmZlY3QgdGhlIGhlaWdodC5cbiAgICB0ZXh0YXJlYUNsb25lLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICB0ZXh0YXJlYUNsb25lLnN0eWxlLnZpc2liaWxpdHkgPSAnaGlkZGVuJztcbiAgICB0ZXh0YXJlYUNsb25lLnN0eWxlLmJvcmRlciA9ICdub25lJztcbiAgICB0ZXh0YXJlYUNsb25lLnN0eWxlLnBhZGRpbmcgPSAnMCc7XG4gICAgdGV4dGFyZWFDbG9uZS5zdHlsZS5oZWlnaHQgPSAnJztcbiAgICB0ZXh0YXJlYUNsb25lLnN0eWxlLm1pbkhlaWdodCA9ICcnO1xuICAgIHRleHRhcmVhQ2xvbmUuc3R5bGUubWF4SGVpZ2h0ID0gJyc7XG5cbiAgICAvLyBJbiBGaXJlZm94IGl0IGhhcHBlbnMgdGhhdCB0ZXh0YXJlYSBlbGVtZW50cyBhcmUgYWx3YXlzIGJpZ2dlciB0aGFuIHRoZSBzcGVjaWZpZWQgYW1vdW50XG4gICAgLy8gb2Ygcm93cy4gVGhpcyBpcyBiZWNhdXNlIEZpcmVmb3ggdHJpZXMgdG8gYWRkIGV4dHJhIHNwYWNlIGZvciB0aGUgaG9yaXpvbnRhbCBzY3JvbGxiYXIuXG4gICAgLy8gQXMgYSB3b3JrYXJvdW5kIHRoYXQgcmVtb3ZlcyB0aGUgZXh0cmEgc3BhY2UgZm9yIHRoZSBzY3JvbGxiYXIsIHdlIGNhbiBqdXN0IHNldCBvdmVyZmxvd1xuICAgIC8vIHRvIGhpZGRlbi4gVGhpcyBlbnN1cmVzIHRoYXQgdGhlcmUgaXMgbm8gaW52YWxpZCBjYWxjdWxhdGlvbiBvZiB0aGUgbGluZSBoZWlnaHQuXG4gICAgLy8gU2VlIEZpcmVmb3ggYnVnIHJlcG9ydDogaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9MzM2NTRcbiAgICB0ZXh0YXJlYUNsb25lLnN0eWxlLm92ZXJmbG93ID0gJ2hpZGRlbic7XG5cbiAgICB0aGlzLmVsLnBhcmVudE5vZGUhLmFwcGVuZENoaWxkKHRleHRhcmVhQ2xvbmUpO1xuICAgIHRoaXMuY2FjaGVkTGluZUhlaWdodCA9IHRleHRhcmVhQ2xvbmUuY2xpZW50SGVpZ2h0IC0gdGhpcy5pbnB1dEdhcDtcbiAgICB0aGlzLmVsLnBhcmVudE5vZGUhLnJlbW92ZUNoaWxkKHRleHRhcmVhQ2xvbmUpO1xuXG4gICAgLy8gTWluIGFuZCBtYXggaGVpZ2h0cyBoYXZlIHRvIGJlIHJlLWNhbGN1bGF0ZWQgaWYgdGhlIGNhY2hlZCBsaW5lIGhlaWdodCBjaGFuZ2VzXG4gICAgdGhpcy5tYXhIZWlnaHQgPSB0aGlzLnNldE1heEhlaWdodCgpO1xuICAgIHRoaXMubWluSGVpZ2h0ID0gdGhpcy5zZXRNaW5IZWlnaHQoKTtcbiAgfVxuXG4gIHNldE1pbkhlaWdodCgpOiBudW1iZXIgfCBudWxsIHtcbiAgICBjb25zdCBtaW5IZWlnaHQgPSB0aGlzLm1pblJvd3MgJiYgdGhpcy5jYWNoZWRMaW5lSGVpZ2h0ID8gdGhpcy5taW5Sb3dzICogdGhpcy5jYWNoZWRMaW5lSGVpZ2h0ICsgdGhpcy5pbnB1dEdhcCA6IG51bGw7XG5cbiAgICBpZiAobWluSGVpZ2h0ICE9PSBudWxsKSB7XG4gICAgICB0aGlzLmVsLnN0eWxlLm1pbkhlaWdodCA9IGAke21pbkhlaWdodH1weGA7XG4gICAgfVxuICAgIHJldHVybiBtaW5IZWlnaHQ7XG4gIH1cblxuICBzZXRNYXhIZWlnaHQoKTogbnVtYmVyIHwgbnVsbCB7XG4gICAgY29uc3QgbWF4SGVpZ2h0ID0gdGhpcy5tYXhSb3dzICYmIHRoaXMuY2FjaGVkTGluZUhlaWdodCA/IHRoaXMubWF4Um93cyAqIHRoaXMuY2FjaGVkTGluZUhlaWdodCArIHRoaXMuaW5wdXRHYXAgOiBudWxsO1xuICAgIGlmIChtYXhIZWlnaHQgIT09IG51bGwpIHtcbiAgICAgIHRoaXMuZWwuc3R5bGUubWF4SGVpZ2h0ID0gYCR7bWF4SGVpZ2h0fXB4YDtcbiAgICB9XG4gICAgcmV0dXJuIG1heEhlaWdodDtcbiAgfVxuXG4gIG5vb3BJbnB1dEhhbmRsZXIoKTogdm9pZCB7XG4gICAgLy8gbm8tb3AgaGFuZGxlciB0aGF0IGVuc3VyZXMgd2UncmUgcnVubmluZyBjaGFuZ2UgZGV0ZWN0aW9uIG9uIGlucHV0IGV2ZW50cy5cbiAgfVxuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZWxlbWVudFJlZjogRWxlbWVudFJlZiwgcHJpdmF0ZSBuZ1pvbmU6IE5nWm9uZSwgcHJpdmF0ZSBwbGF0Zm9ybTogUGxhdGZvcm0sIHByaXZhdGUgcmVzaXplU2VydmljZTogTnpSZXNpemVTZXJ2aWNlKSB7fVxuXG4gIG5nQWZ0ZXJWaWV3SW5pdCgpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5hdXRvc2l6ZSAmJiB0aGlzLnBsYXRmb3JtLmlzQnJvd3Nlcikge1xuICAgICAgdGhpcy5yZXNpemVUb0ZpdENvbnRlbnQoKTtcbiAgICAgIHRoaXMucmVzaXplU2VydmljZVxuICAgICAgICAuc3Vic2NyaWJlKClcbiAgICAgICAgLnBpcGUodGFrZVVudGlsKHRoaXMuZGVzdHJveSQpKVxuICAgICAgICAuc3Vic2NyaWJlKCgpID0+IHRoaXMucmVzaXplVG9GaXRDb250ZW50KHRydWUpKTtcbiAgICB9XG4gIH1cblxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLmRlc3Ryb3kkLm5leHQoKTtcbiAgICB0aGlzLmRlc3Ryb3kkLmNvbXBsZXRlKCk7XG4gIH1cblxuICBuZ0RvQ2hlY2soKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuYXV0b3NpemUgJiYgdGhpcy5wbGF0Zm9ybS5pc0Jyb3dzZXIpIHtcbiAgICAgIHRoaXMucmVzaXplVG9GaXRDb250ZW50KCk7XG4gICAgfVxuICB9XG59XG4iXX0=