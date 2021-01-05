/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
export class NzCarouselBaseStrategy {
    constructor(carouselComponent, cdr, renderer, platform) {
        this.cdr = cdr;
        this.renderer = renderer;
        this.platform = platform;
        this.carouselComponent = carouselComponent;
    }
    get maxIndex() {
        return this.length - 1;
    }
    get firstEl() {
        return this.contents[0].el;
    }
    get lastEl() {
        return this.contents[this.maxIndex].el;
    }
    /**
     * Initialize dragging sequences.
     * @param contents
     */
    withCarouselContents(contents) {
        const carousel = this.carouselComponent;
        this.slickListEl = carousel.slickListEl;
        this.slickTrackEl = carousel.slickTrackEl;
        this.contents = (contents === null || contents === void 0 ? void 0 : contents.toArray()) || [];
        this.length = this.contents.length;
        if (this.platform.isBrowser) {
            const rect = carousel.el.getBoundingClientRect();
            this.unitWidth = rect.width;
            this.unitHeight = rect.height;
        }
        else {
            // Since we cannot call getBoundingClientRect in server, we just hide all items except for the first one.
            contents === null || contents === void 0 ? void 0 : contents.forEach((content, index) => {
                if (index === 0) {
                    this.renderer.setStyle(content.el, 'width', '100%');
                }
                else {
                    this.renderer.setStyle(content.el, 'display', 'none');
                }
            });
        }
    }
    /**
     * When user drag the carousel component.
     * @optional
     */
    dragging(_vector) { }
    /**
     * Destroy a scroll strategy.
     */
    dispose() { }
    getFromToInBoundary(f, t) {
        const length = this.maxIndex + 1;
        return { from: (f + length) % length, to: (t + length) % length };
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1zdHJhdGVneS5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9jb21wb25lbnRzL2Nhcm91c2VsLyIsInNvdXJjZXMiOlsic3RyYXRlZ2llcy9iYXNlLXN0cmF0ZWd5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7R0FHRztBQVNILE1BQU0sT0FBZ0Isc0JBQXNCO0lBc0IxQyxZQUNFLGlCQUE4QyxFQUNwQyxHQUFzQixFQUN0QixRQUFtQixFQUNuQixRQUFrQjtRQUZsQixRQUFHLEdBQUgsR0FBRyxDQUFtQjtRQUN0QixhQUFRLEdBQVIsUUFBUSxDQUFXO1FBQ25CLGFBQVEsR0FBUixRQUFRLENBQVU7UUFFNUIsSUFBSSxDQUFDLGlCQUFpQixHQUFHLGlCQUFpQixDQUFDO0lBQzdDLENBQUM7SUFuQkQsSUFBYyxRQUFRO1FBQ3BCLE9BQU8sSUFBSSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDekIsQ0FBQztJQUVELElBQWMsT0FBTztRQUNuQixPQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDO0lBQzdCLENBQUM7SUFFRCxJQUFjLE1BQU07UUFDbEIsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUM7SUFDekMsQ0FBQztJQVdEOzs7T0FHRztJQUNILG9CQUFvQixDQUFDLFFBQXNEO1FBQ3pFLE1BQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxpQkFBa0IsQ0FBQztRQUN6QyxJQUFJLENBQUMsV0FBVyxHQUFHLFFBQVEsQ0FBQyxXQUFXLENBQUM7UUFDeEMsSUFBSSxDQUFDLFlBQVksR0FBRyxRQUFRLENBQUMsWUFBWSxDQUFDO1FBQzFDLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQSxRQUFRLGFBQVIsUUFBUSx1QkFBUixRQUFRLENBQUUsT0FBTyxPQUFNLEVBQUUsQ0FBQztRQUMxQyxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDO1FBRW5DLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLEVBQUU7WUFDM0IsTUFBTSxJQUFJLEdBQUcsUUFBUSxDQUFDLEVBQUUsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1lBQ2pELElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQztZQUM1QixJQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7U0FDL0I7YUFBTTtZQUNMLHlHQUF5RztZQUN6RyxRQUFRLGFBQVIsUUFBUSx1QkFBUixRQUFRLENBQUUsT0FBTyxDQUFDLENBQUMsT0FBTyxFQUFFLEtBQUssRUFBRSxFQUFFO2dCQUNuQyxJQUFJLEtBQUssS0FBSyxDQUFDLEVBQUU7b0JBQ2YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUUsRUFBRSxPQUFPLEVBQUUsTUFBTSxDQUFDLENBQUM7aUJBQ3JEO3FCQUFNO29CQUNMLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLEVBQUUsU0FBUyxFQUFFLE1BQU0sQ0FBQyxDQUFDO2lCQUN2RDtZQUNILENBQUMsRUFBRTtTQUNKO0lBQ0gsQ0FBQztJQU9EOzs7T0FHRztJQUNILFFBQVEsQ0FBQyxPQUFzQixJQUFTLENBQUM7SUFFekM7O09BRUc7SUFDSCxPQUFPLEtBQVUsQ0FBQztJQUVSLG1CQUFtQixDQUFDLENBQVMsRUFBRSxDQUFTO1FBQ2hELE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDO1FBQ2pDLE9BQU8sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLEdBQUcsTUFBTSxFQUFFLEVBQUUsRUFBRSxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsR0FBRyxNQUFNLEVBQUUsQ0FBQztJQUNwRSxDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vZ2l0aHViLmNvbS9ORy1aT1JSTy9uZy16b3Jyby1hbnRkL2Jsb2IvbWFzdGVyL0xJQ0VOU0VcbiAqL1xuXG5pbXBvcnQgeyBQbGF0Zm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQgeyBDaGFuZ2VEZXRlY3RvclJlZiwgUXVlcnlMaXN0LCBSZW5kZXJlcjIgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE9ic2VydmFibGUgfSBmcm9tICdyeGpzJztcblxuaW1wb3J0IHsgTnpDYXJvdXNlbENvbnRlbnREaXJlY3RpdmUgfSBmcm9tICcuLi9jYXJvdXNlbC1jb250ZW50LmRpcmVjdGl2ZSc7XG5pbXBvcnQgeyBGcm9tVG9JbnRlcmZhY2UsIE56Q2Fyb3VzZWxDb21wb25lbnRBc1NvdXJjZSwgUG9pbnRlclZlY3RvciB9IGZyb20gJy4uL3R5cGluZ3MnO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTnpDYXJvdXNlbEJhc2VTdHJhdGVneSB7XG4gIC8vIFByb3BlcnRpZXMgdGhhdCBzdHJhdGVnaWVzIG1heSB3YW50IHRvIHVzZS5cbiAgcHJvdGVjdGVkIGNhcm91c2VsQ29tcG9uZW50OiBOekNhcm91c2VsQ29tcG9uZW50QXNTb3VyY2UgfCBudWxsO1xuICBwcm90ZWN0ZWQgY29udGVudHMhOiBOekNhcm91c2VsQ29udGVudERpcmVjdGl2ZVtdO1xuICBwcm90ZWN0ZWQgc2xpY2tMaXN0RWwhOiBIVE1MRWxlbWVudDtcbiAgcHJvdGVjdGVkIHNsaWNrVHJhY2tFbCE6IEhUTUxFbGVtZW50O1xuICBwcm90ZWN0ZWQgbGVuZ3RoITogbnVtYmVyO1xuICBwcm90ZWN0ZWQgdW5pdFdpZHRoITogbnVtYmVyO1xuICBwcm90ZWN0ZWQgdW5pdEhlaWdodCE6IG51bWJlcjtcblxuICBwcm90ZWN0ZWQgZ2V0IG1heEluZGV4KCk6IG51bWJlciB7XG4gICAgcmV0dXJuIHRoaXMubGVuZ3RoIC0gMTtcbiAgfVxuXG4gIHByb3RlY3RlZCBnZXQgZmlyc3RFbCgpOiBIVE1MRWxlbWVudCB7XG4gICAgcmV0dXJuIHRoaXMuY29udGVudHNbMF0uZWw7XG4gIH1cblxuICBwcm90ZWN0ZWQgZ2V0IGxhc3RFbCgpOiBIVE1MRWxlbWVudCB7XG4gICAgcmV0dXJuIHRoaXMuY29udGVudHNbdGhpcy5tYXhJbmRleF0uZWw7XG4gIH1cblxuICBjb25zdHJ1Y3RvcihcbiAgICBjYXJvdXNlbENvbXBvbmVudDogTnpDYXJvdXNlbENvbXBvbmVudEFzU291cmNlLFxuICAgIHByb3RlY3RlZCBjZHI6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIHByb3RlY3RlZCByZW5kZXJlcjogUmVuZGVyZXIyLFxuICAgIHByb3RlY3RlZCBwbGF0Zm9ybTogUGxhdGZvcm1cbiAgKSB7XG4gICAgdGhpcy5jYXJvdXNlbENvbXBvbmVudCA9IGNhcm91c2VsQ29tcG9uZW50O1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgZHJhZ2dpbmcgc2VxdWVuY2VzLlxuICAgKiBAcGFyYW0gY29udGVudHNcbiAgICovXG4gIHdpdGhDYXJvdXNlbENvbnRlbnRzKGNvbnRlbnRzOiBRdWVyeUxpc3Q8TnpDYXJvdXNlbENvbnRlbnREaXJlY3RpdmU+IHwgbnVsbCk6IHZvaWQge1xuICAgIGNvbnN0IGNhcm91c2VsID0gdGhpcy5jYXJvdXNlbENvbXBvbmVudCE7XG4gICAgdGhpcy5zbGlja0xpc3RFbCA9IGNhcm91c2VsLnNsaWNrTGlzdEVsO1xuICAgIHRoaXMuc2xpY2tUcmFja0VsID0gY2Fyb3VzZWwuc2xpY2tUcmFja0VsO1xuICAgIHRoaXMuY29udGVudHMgPSBjb250ZW50cz8udG9BcnJheSgpIHx8IFtdO1xuICAgIHRoaXMubGVuZ3RoID0gdGhpcy5jb250ZW50cy5sZW5ndGg7XG5cbiAgICBpZiAodGhpcy5wbGF0Zm9ybS5pc0Jyb3dzZXIpIHtcbiAgICAgIGNvbnN0IHJlY3QgPSBjYXJvdXNlbC5lbC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIHRoaXMudW5pdFdpZHRoID0gcmVjdC53aWR0aDtcbiAgICAgIHRoaXMudW5pdEhlaWdodCA9IHJlY3QuaGVpZ2h0O1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBTaW5jZSB3ZSBjYW5ub3QgY2FsbCBnZXRCb3VuZGluZ0NsaWVudFJlY3QgaW4gc2VydmVyLCB3ZSBqdXN0IGhpZGUgYWxsIGl0ZW1zIGV4Y2VwdCBmb3IgdGhlIGZpcnN0IG9uZS5cbiAgICAgIGNvbnRlbnRzPy5mb3JFYWNoKChjb250ZW50LCBpbmRleCkgPT4ge1xuICAgICAgICBpZiAoaW5kZXggPT09IDApIHtcbiAgICAgICAgICB0aGlzLnJlbmRlcmVyLnNldFN0eWxlKGNvbnRlbnQuZWwsICd3aWR0aCcsICcxMDAlJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5yZW5kZXJlci5zZXRTdHlsZShjb250ZW50LmVsLCAnZGlzcGxheScsICdub25lJyk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBUcmlnZ2VyIHRyYW5zaXRpb24uXG4gICAqL1xuICBhYnN0cmFjdCBzd2l0Y2goX2Y6IG51bWJlciwgX3Q6IG51bWJlcik6IE9ic2VydmFibGU8dm9pZD47XG5cbiAgLyoqXG4gICAqIFdoZW4gdXNlciBkcmFnIHRoZSBjYXJvdXNlbCBjb21wb25lbnQuXG4gICAqIEBvcHRpb25hbFxuICAgKi9cbiAgZHJhZ2dpbmcoX3ZlY3RvcjogUG9pbnRlclZlY3Rvcik6IHZvaWQge31cblxuICAvKipcbiAgICogRGVzdHJveSBhIHNjcm9sbCBzdHJhdGVneS5cbiAgICovXG4gIGRpc3Bvc2UoKTogdm9pZCB7fVxuXG4gIHByb3RlY3RlZCBnZXRGcm9tVG9JbkJvdW5kYXJ5KGY6IG51bWJlciwgdDogbnVtYmVyKTogRnJvbVRvSW50ZXJmYWNlIHtcbiAgICBjb25zdCBsZW5ndGggPSB0aGlzLm1heEluZGV4ICsgMTtcbiAgICByZXR1cm4geyBmcm9tOiAoZiArIGxlbmd0aCkgJSBsZW5ndGgsIHRvOiAodCArIGxlbmd0aCkgJSBsZW5ndGggfTtcbiAgfVxufVxuIl19