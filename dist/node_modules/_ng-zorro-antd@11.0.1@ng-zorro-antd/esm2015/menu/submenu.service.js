/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { Inject, Injectable, Optional, SkipSelf } from '@angular/core';
import { BehaviorSubject, combineLatest, merge, Subject } from 'rxjs';
import { auditTime, distinctUntilChanged, filter, map, mapTo, mergeMap } from 'rxjs/operators';
import { MenuService } from './menu.service';
import { NzIsMenuInsideDropDownToken } from './menu.token';
export class NzSubmenuService {
    constructor(nzHostSubmenuService, nzMenuService, isMenuInsideDropDown) {
        this.nzHostSubmenuService = nzHostSubmenuService;
        this.nzMenuService = nzMenuService;
        this.isMenuInsideDropDown = isMenuInsideDropDown;
        this.mode$ = this.nzMenuService.mode$.pipe(map(mode => {
            if (mode === 'inline') {
                return 'inline';
                /** if inside another submenu, set the mode to vertical **/
            }
            else if (mode === 'vertical' || this.nzHostSubmenuService) {
                return 'vertical';
            }
            else {
                return 'horizontal';
            }
        }));
        this.level = 1;
        this.isCurrentSubMenuOpen$ = new BehaviorSubject(false);
        this.isChildSubMenuOpen$ = new BehaviorSubject(false);
        /** submenu title & overlay mouse enter status **/
        this.isMouseEnterTitleOrOverlay$ = new Subject();
        this.childMenuItemClick$ = new Subject();
        if (this.nzHostSubmenuService) {
            this.level = this.nzHostSubmenuService.level + 1;
        }
        /** close if menu item clicked **/
        const isClosedByMenuItemClick = this.childMenuItemClick$.pipe(mergeMap(() => this.mode$), filter(mode => mode !== 'inline' || this.isMenuInsideDropDown), mapTo(false));
        const isCurrentSubmenuOpen$ = merge(this.isMouseEnterTitleOrOverlay$, isClosedByMenuItemClick);
        /** combine the child submenu status with current submenu status to calculate host submenu open **/
        const isSubMenuOpenWithDebounce$ = combineLatest([this.isChildSubMenuOpen$, isCurrentSubmenuOpen$]).pipe(map(([isChildSubMenuOpen, isCurrentSubmenuOpen]) => isChildSubMenuOpen || isCurrentSubmenuOpen), auditTime(150), distinctUntilChanged());
        isSubMenuOpenWithDebounce$.pipe(distinctUntilChanged()).subscribe(data => {
            this.setOpenStateWithoutDebounce(data);
            if (this.nzHostSubmenuService) {
                /** set parent submenu's child submenu open status **/
                this.nzHostSubmenuService.isChildSubMenuOpen$.next(data);
            }
            else {
                this.nzMenuService.isChildSubMenuOpen$.next(data);
            }
        });
    }
    /**
     * menu item inside submenu clicked
     * @param menu
     */
    onChildMenuItemClick(menu) {
        this.childMenuItemClick$.next(menu);
    }
    setOpenStateWithoutDebounce(value) {
        this.isCurrentSubMenuOpen$.next(value);
    }
    setMouseEnterTitleOrOverlayState(value) {
        this.isMouseEnterTitleOrOverlay$.next(value);
    }
}
NzSubmenuService.decorators = [
    { type: Injectable }
];
NzSubmenuService.ctorParameters = () => [
    { type: NzSubmenuService, decorators: [{ type: SkipSelf }, { type: Optional }] },
    { type: MenuService },
    { type: Boolean, decorators: [{ type: Inject, args: [NzIsMenuInsideDropDownToken,] }] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3VibWVudS5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uL2NvbXBvbmVudHMvbWVudS8iLCJzb3VyY2VzIjpbInN1Ym1lbnUuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFFSCxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXZFLE9BQU8sRUFBRSxlQUFlLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBYyxPQUFPLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFDbEYsT0FBTyxFQUFFLFNBQVMsRUFBRSxvQkFBb0IsRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsTUFBTSxnQkFBZ0IsQ0FBQztBQUMvRixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDN0MsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sY0FBYyxDQUFDO0FBSTNELE1BQU0sT0FBTyxnQkFBZ0I7SUFpQzNCLFlBQ2tDLG9CQUFzQyxFQUMvRCxhQUEwQixFQUNXLG9CQUE2QjtRQUZ6Qyx5QkFBb0IsR0FBcEIsb0JBQW9CLENBQWtCO1FBQy9ELGtCQUFhLEdBQWIsYUFBYSxDQUFhO1FBQ1cseUJBQW9CLEdBQXBCLG9CQUFvQixDQUFTO1FBbkMzRSxVQUFLLEdBQStCLElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLElBQUksQ0FDL0QsR0FBRyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ1QsSUFBSSxJQUFJLEtBQUssUUFBUSxFQUFFO2dCQUNyQixPQUFPLFFBQVEsQ0FBQztnQkFDaEIsMkRBQTJEO2FBQzVEO2lCQUFNLElBQUksSUFBSSxLQUFLLFVBQVUsSUFBSSxJQUFJLENBQUMsb0JBQW9CLEVBQUU7Z0JBQzNELE9BQU8sVUFBVSxDQUFDO2FBQ25CO2lCQUFNO2dCQUNMLE9BQU8sWUFBWSxDQUFDO2FBQ3JCO1FBQ0gsQ0FBQyxDQUFDLENBQ0gsQ0FBQztRQUNGLFVBQUssR0FBRyxDQUFDLENBQUM7UUFDViwwQkFBcUIsR0FBRyxJQUFJLGVBQWUsQ0FBVSxLQUFLLENBQUMsQ0FBQztRQUNwRCx3QkFBbUIsR0FBRyxJQUFJLGVBQWUsQ0FBVSxLQUFLLENBQUMsQ0FBQztRQUNsRSxrREFBa0Q7UUFDMUMsZ0NBQTJCLEdBQUcsSUFBSSxPQUFPLEVBQVcsQ0FBQztRQUNyRCx3QkFBbUIsR0FBRyxJQUFJLE9BQU8sRUFBYSxDQUFDO1FBb0JyRCxJQUFJLElBQUksQ0FBQyxvQkFBb0IsRUFBRTtZQUM3QixJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxLQUFLLEdBQUcsQ0FBQyxDQUFDO1NBQ2xEO1FBQ0Qsa0NBQWtDO1FBQ2xDLE1BQU0sdUJBQXVCLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FDM0QsUUFBUSxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsRUFDMUIsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsSUFBSSxLQUFLLFFBQVEsSUFBSSxJQUFJLENBQUMsb0JBQW9CLENBQUMsRUFDOUQsS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUNiLENBQUM7UUFDRixNQUFNLHFCQUFxQixHQUFHLEtBQUssQ0FBQyxJQUFJLENBQUMsMkJBQTJCLEVBQUUsdUJBQXVCLENBQUMsQ0FBQztRQUMvRixtR0FBbUc7UUFDbkcsTUFBTSwwQkFBMEIsR0FBRyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLEVBQUUscUJBQXFCLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FDdEcsR0FBRyxDQUFDLENBQUMsQ0FBQyxrQkFBa0IsRUFBRSxvQkFBb0IsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxrQkFBa0IsSUFBSSxvQkFBb0IsQ0FBQyxFQUMvRixTQUFTLENBQUMsR0FBRyxDQUFDLEVBQ2Qsb0JBQW9CLEVBQUUsQ0FDdkIsQ0FBQztRQUNGLDBCQUEwQixDQUFDLElBQUksQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3ZFLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUN2QyxJQUFJLElBQUksQ0FBQyxvQkFBb0IsRUFBRTtnQkFDN0Isc0RBQXNEO2dCQUN0RCxJQUFJLENBQUMsb0JBQW9CLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQzFEO2lCQUFNO2dCQUNMLElBQUksQ0FBQyxhQUFhLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO2FBQ25EO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBNUNEOzs7T0FHRztJQUNILG9CQUFvQixDQUFDLElBQWU7UUFDbEMsSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBQ0QsMkJBQTJCLENBQUMsS0FBYztRQUN4QyxJQUFJLENBQUMscUJBQXFCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFDRCxnQ0FBZ0MsQ0FBQyxLQUFjO1FBQzdDLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDL0MsQ0FBQzs7O1lBaENGLFVBQVU7OztZQW1DK0MsZ0JBQWdCLHVCQUFyRSxRQUFRLFlBQUksUUFBUTtZQXZDaEIsV0FBVzswQ0F5Q2YsTUFBTSxTQUFDLDJCQUEyQiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9naXRodWIuY29tL05HLVpPUlJPL25nLXpvcnJvLWFudGQvYmxvYi9tYXN0ZXIvTElDRU5TRVxuICovXG5cbmltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSwgT3B0aW9uYWwsIFNraXBTZWxmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgeyBOelNhZmVBbnkgfSBmcm9tICduZy16b3Jyby1hbnRkL2NvcmUvdHlwZXMnO1xuaW1wb3J0IHsgQmVoYXZpb3JTdWJqZWN0LCBjb21iaW5lTGF0ZXN0LCBtZXJnZSwgT2JzZXJ2YWJsZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHsgYXVkaXRUaW1lLCBkaXN0aW5jdFVudGlsQ2hhbmdlZCwgZmlsdGVyLCBtYXAsIG1hcFRvLCBtZXJnZU1hcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbmltcG9ydCB7IE1lbnVTZXJ2aWNlIH0gZnJvbSAnLi9tZW51LnNlcnZpY2UnO1xuaW1wb3J0IHsgTnpJc01lbnVJbnNpZGVEcm9wRG93blRva2VuIH0gZnJvbSAnLi9tZW51LnRva2VuJztcbmltcG9ydCB7IE56TWVudU1vZGVUeXBlIH0gZnJvbSAnLi9tZW51LnR5cGVzJztcblxuQEluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE56U3VibWVudVNlcnZpY2Uge1xuICBtb2RlJDogT2JzZXJ2YWJsZTxOek1lbnVNb2RlVHlwZT4gPSB0aGlzLm56TWVudVNlcnZpY2UubW9kZSQucGlwZShcbiAgICBtYXAobW9kZSA9PiB7XG4gICAgICBpZiAobW9kZSA9PT0gJ2lubGluZScpIHtcbiAgICAgICAgcmV0dXJuICdpbmxpbmUnO1xuICAgICAgICAvKiogaWYgaW5zaWRlIGFub3RoZXIgc3VibWVudSwgc2V0IHRoZSBtb2RlIHRvIHZlcnRpY2FsICoqL1xuICAgICAgfSBlbHNlIGlmIChtb2RlID09PSAndmVydGljYWwnIHx8IHRoaXMubnpIb3N0U3VibWVudVNlcnZpY2UpIHtcbiAgICAgICAgcmV0dXJuICd2ZXJ0aWNhbCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gJ2hvcml6b250YWwnO1xuICAgICAgfVxuICAgIH0pXG4gICk7XG4gIGxldmVsID0gMTtcbiAgaXNDdXJyZW50U3ViTWVudU9wZW4kID0gbmV3IEJlaGF2aW9yU3ViamVjdDxib29sZWFuPihmYWxzZSk7XG4gIHByaXZhdGUgaXNDaGlsZFN1Yk1lbnVPcGVuJCA9IG5ldyBCZWhhdmlvclN1YmplY3Q8Ym9vbGVhbj4oZmFsc2UpO1xuICAvKiogc3VibWVudSB0aXRsZSAmIG92ZXJsYXkgbW91c2UgZW50ZXIgc3RhdHVzICoqL1xuICBwcml2YXRlIGlzTW91c2VFbnRlclRpdGxlT3JPdmVybGF5JCA9IG5ldyBTdWJqZWN0PGJvb2xlYW4+KCk7XG4gIHByaXZhdGUgY2hpbGRNZW51SXRlbUNsaWNrJCA9IG5ldyBTdWJqZWN0PE56U2FmZUFueT4oKTtcbiAgLyoqXG4gICAqIG1lbnUgaXRlbSBpbnNpZGUgc3VibWVudSBjbGlja2VkXG4gICAqIEBwYXJhbSBtZW51XG4gICAqL1xuICBvbkNoaWxkTWVudUl0ZW1DbGljayhtZW51OiBOelNhZmVBbnkpOiB2b2lkIHtcbiAgICB0aGlzLmNoaWxkTWVudUl0ZW1DbGljayQubmV4dChtZW51KTtcbiAgfVxuICBzZXRPcGVuU3RhdGVXaXRob3V0RGVib3VuY2UodmFsdWU6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLmlzQ3VycmVudFN1Yk1lbnVPcGVuJC5uZXh0KHZhbHVlKTtcbiAgfVxuICBzZXRNb3VzZUVudGVyVGl0bGVPck92ZXJsYXlTdGF0ZSh2YWx1ZTogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuaXNNb3VzZUVudGVyVGl0bGVPck92ZXJsYXkkLm5leHQodmFsdWUpO1xuICB9XG5cbiAgY29uc3RydWN0b3IoXG4gICAgQFNraXBTZWxmKCkgQE9wdGlvbmFsKCkgcHJpdmF0ZSBuekhvc3RTdWJtZW51U2VydmljZTogTnpTdWJtZW51U2VydmljZSxcbiAgICBwdWJsaWMgbnpNZW51U2VydmljZTogTWVudVNlcnZpY2UsXG4gICAgQEluamVjdChOeklzTWVudUluc2lkZURyb3BEb3duVG9rZW4pIHB1YmxpYyBpc01lbnVJbnNpZGVEcm9wRG93bjogYm9vbGVhblxuICApIHtcbiAgICBpZiAodGhpcy5uekhvc3RTdWJtZW51U2VydmljZSkge1xuICAgICAgdGhpcy5sZXZlbCA9IHRoaXMubnpIb3N0U3VibWVudVNlcnZpY2UubGV2ZWwgKyAxO1xuICAgIH1cbiAgICAvKiogY2xvc2UgaWYgbWVudSBpdGVtIGNsaWNrZWQgKiovXG4gICAgY29uc3QgaXNDbG9zZWRCeU1lbnVJdGVtQ2xpY2sgPSB0aGlzLmNoaWxkTWVudUl0ZW1DbGljayQucGlwZShcbiAgICAgIG1lcmdlTWFwKCgpID0+IHRoaXMubW9kZSQpLFxuICAgICAgZmlsdGVyKG1vZGUgPT4gbW9kZSAhPT0gJ2lubGluZScgfHwgdGhpcy5pc01lbnVJbnNpZGVEcm9wRG93biksXG4gICAgICBtYXBUbyhmYWxzZSlcbiAgICApO1xuICAgIGNvbnN0IGlzQ3VycmVudFN1Ym1lbnVPcGVuJCA9IG1lcmdlKHRoaXMuaXNNb3VzZUVudGVyVGl0bGVPck92ZXJsYXkkLCBpc0Nsb3NlZEJ5TWVudUl0ZW1DbGljayk7XG4gICAgLyoqIGNvbWJpbmUgdGhlIGNoaWxkIHN1Ym1lbnUgc3RhdHVzIHdpdGggY3VycmVudCBzdWJtZW51IHN0YXR1cyB0byBjYWxjdWxhdGUgaG9zdCBzdWJtZW51IG9wZW4gKiovXG4gICAgY29uc3QgaXNTdWJNZW51T3BlbldpdGhEZWJvdW5jZSQgPSBjb21iaW5lTGF0ZXN0KFt0aGlzLmlzQ2hpbGRTdWJNZW51T3BlbiQsIGlzQ3VycmVudFN1Ym1lbnVPcGVuJF0pLnBpcGUoXG4gICAgICBtYXAoKFtpc0NoaWxkU3ViTWVudU9wZW4sIGlzQ3VycmVudFN1Ym1lbnVPcGVuXSkgPT4gaXNDaGlsZFN1Yk1lbnVPcGVuIHx8IGlzQ3VycmVudFN1Ym1lbnVPcGVuKSxcbiAgICAgIGF1ZGl0VGltZSgxNTApLFxuICAgICAgZGlzdGluY3RVbnRpbENoYW5nZWQoKVxuICAgICk7XG4gICAgaXNTdWJNZW51T3BlbldpdGhEZWJvdW5jZSQucGlwZShkaXN0aW5jdFVudGlsQ2hhbmdlZCgpKS5zdWJzY3JpYmUoZGF0YSA9PiB7XG4gICAgICB0aGlzLnNldE9wZW5TdGF0ZVdpdGhvdXREZWJvdW5jZShkYXRhKTtcbiAgICAgIGlmICh0aGlzLm56SG9zdFN1Ym1lbnVTZXJ2aWNlKSB7XG4gICAgICAgIC8qKiBzZXQgcGFyZW50IHN1Ym1lbnUncyBjaGlsZCBzdWJtZW51IG9wZW4gc3RhdHVzICoqL1xuICAgICAgICB0aGlzLm56SG9zdFN1Ym1lbnVTZXJ2aWNlLmlzQ2hpbGRTdWJNZW51T3BlbiQubmV4dChkYXRhKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMubnpNZW51U2VydmljZS5pc0NoaWxkU3ViTWVudU9wZW4kLm5leHQoZGF0YSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cbiJdfQ==