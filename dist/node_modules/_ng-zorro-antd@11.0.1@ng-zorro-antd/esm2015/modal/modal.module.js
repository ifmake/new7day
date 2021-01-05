/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { BidiModule } from '@angular/cdk/bidi';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzNoAnimationModule } from 'ng-zorro-antd/core/no-animation';
import { NzOutletModule } from 'ng-zorro-antd/core/outlet';
import { NzI18nModule } from 'ng-zorro-antd/i18n';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPipesModule } from 'ng-zorro-antd/pipes';
import { NzModalCloseComponent } from './modal-close.component';
import { NzModalConfirmContainerComponent } from './modal-confirm-container.component';
import { NzModalContainerComponent } from './modal-container.component';
import { NzModalContentDirective } from './modal-content.directive';
import { NzModalFooterComponent } from './modal-footer.component';
import { NzModalFooterDirective } from './modal-footer.directive';
import { NzModalTitleComponent } from './modal-title.component';
import { NzModalComponent } from './modal.component';
import { NzModalService } from './modal.service';
export class NzModalModule {
}
NzModalModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule,
                    BidiModule,
                    OverlayModule,
                    NzOutletModule,
                    PortalModule,
                    NzI18nModule,
                    NzButtonModule,
                    NzIconModule,
                    NzPipesModule,
                    NzNoAnimationModule,
                    NzPipesModule
                ],
                exports: [NzModalComponent, NzModalFooterDirective, NzModalContentDirective],
                providers: [NzModalService],
                entryComponents: [NzModalContainerComponent, NzModalConfirmContainerComponent],
                declarations: [
                    NzModalComponent,
                    NzModalFooterDirective,
                    NzModalContentDirective,
                    NzModalCloseComponent,
                    NzModalFooterComponent,
                    NzModalTitleComponent,
                    NzModalContainerComponent,
                    NzModalConfirmContainerComponent,
                    NzModalComponent
                ]
            },] }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9kYWwubW9kdWxlLmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uL2NvbXBvbmVudHMvbW9kYWwvIiwic291cmNlcyI6WyJtb2RhbC5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztHQUdHO0FBRUgsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLG1CQUFtQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxzQkFBc0IsQ0FBQztBQUNyRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0scUJBQXFCLENBQUM7QUFDbkQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFekMsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLHNCQUFzQixDQUFDO0FBQ3RELE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLGlDQUFpQyxDQUFDO0FBQ3RFLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUMzRCxPQUFPLEVBQUUsWUFBWSxFQUFFLE1BQU0sb0JBQW9CLENBQUM7QUFDbEQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLG9CQUFvQixDQUFDO0FBQ2xELE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUVwRCxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUNoRSxPQUFPLEVBQUUsZ0NBQWdDLEVBQUUsTUFBTSxxQ0FBcUMsQ0FBQztBQUN2RixPQUFPLEVBQUUseUJBQXlCLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUN4RSxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUNwRSxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUNsRSxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUNsRSxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSx5QkFBeUIsQ0FBQztBQUNoRSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQztBQUNyRCxPQUFPLEVBQUUsY0FBYyxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUErQmpELE1BQU0sT0FBTyxhQUFhOzs7WUE3QnpCLFFBQVEsU0FBQztnQkFDUixPQUFPLEVBQUU7b0JBQ1AsWUFBWTtvQkFDWixVQUFVO29CQUNWLGFBQWE7b0JBQ2IsY0FBYztvQkFDZCxZQUFZO29CQUNaLFlBQVk7b0JBQ1osY0FBYztvQkFDZCxZQUFZO29CQUNaLGFBQWE7b0JBQ2IsbUJBQW1CO29CQUNuQixhQUFhO2lCQUNkO2dCQUNELE9BQU8sRUFBRSxDQUFDLGdCQUFnQixFQUFFLHNCQUFzQixFQUFFLHVCQUF1QixDQUFDO2dCQUM1RSxTQUFTLEVBQUUsQ0FBQyxjQUFjLENBQUM7Z0JBQzNCLGVBQWUsRUFBRSxDQUFDLHlCQUF5QixFQUFFLGdDQUFnQyxDQUFDO2dCQUM5RSxZQUFZLEVBQUU7b0JBQ1osZ0JBQWdCO29CQUNoQixzQkFBc0I7b0JBQ3RCLHVCQUF1QjtvQkFDdkIscUJBQXFCO29CQUNyQixzQkFBc0I7b0JBQ3RCLHFCQUFxQjtvQkFDckIseUJBQXlCO29CQUN6QixnQ0FBZ0M7b0JBQ2hDLGdCQUFnQjtpQkFDakI7YUFDRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9naXRodWIuY29tL05HLVpPUlJPL25nLXpvcnJvLWFudGQvYmxvYi9tYXN0ZXIvTElDRU5TRVxuICovXG5cbmltcG9ydCB7IEJpZGlNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQgeyBPdmVybGF5TW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL292ZXJsYXknO1xuaW1wb3J0IHsgUG9ydGFsTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY2RrL3BvcnRhbCc7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcblxuaW1wb3J0IHsgTnpCdXR0b25Nb2R1bGUgfSBmcm9tICduZy16b3Jyby1hbnRkL2J1dHRvbic7XG5pbXBvcnQgeyBOek5vQW5pbWF0aW9uTW9kdWxlIH0gZnJvbSAnbmctem9ycm8tYW50ZC9jb3JlL25vLWFuaW1hdGlvbic7XG5pbXBvcnQgeyBOek91dGxldE1vZHVsZSB9IGZyb20gJ25nLXpvcnJvLWFudGQvY29yZS9vdXRsZXQnO1xuaW1wb3J0IHsgTnpJMThuTW9kdWxlIH0gZnJvbSAnbmctem9ycm8tYW50ZC9pMThuJztcbmltcG9ydCB7IE56SWNvbk1vZHVsZSB9IGZyb20gJ25nLXpvcnJvLWFudGQvaWNvbic7XG5pbXBvcnQgeyBOelBpcGVzTW9kdWxlIH0gZnJvbSAnbmctem9ycm8tYW50ZC9waXBlcyc7XG5cbmltcG9ydCB7IE56TW9kYWxDbG9zZUNvbXBvbmVudCB9IGZyb20gJy4vbW9kYWwtY2xvc2UuY29tcG9uZW50JztcbmltcG9ydCB7IE56TW9kYWxDb25maXJtQ29udGFpbmVyQ29tcG9uZW50IH0gZnJvbSAnLi9tb2RhbC1jb25maXJtLWNvbnRhaW5lci5jb21wb25lbnQnO1xuaW1wb3J0IHsgTnpNb2RhbENvbnRhaW5lckNvbXBvbmVudCB9IGZyb20gJy4vbW9kYWwtY29udGFpbmVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOek1vZGFsQ29udGVudERpcmVjdGl2ZSB9IGZyb20gJy4vbW9kYWwtY29udGVudC5kaXJlY3RpdmUnO1xuaW1wb3J0IHsgTnpNb2RhbEZvb3RlckNvbXBvbmVudCB9IGZyb20gJy4vbW9kYWwtZm9vdGVyLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOek1vZGFsRm9vdGVyRGlyZWN0aXZlIH0gZnJvbSAnLi9tb2RhbC1mb290ZXIuZGlyZWN0aXZlJztcbmltcG9ydCB7IE56TW9kYWxUaXRsZUNvbXBvbmVudCB9IGZyb20gJy4vbW9kYWwtdGl0bGUuY29tcG9uZW50JztcbmltcG9ydCB7IE56TW9kYWxDb21wb25lbnQgfSBmcm9tICcuL21vZGFsLmNvbXBvbmVudCc7XG5pbXBvcnQgeyBOek1vZGFsU2VydmljZSB9IGZyb20gJy4vbW9kYWwuc2VydmljZSc7XG5cbkBOZ01vZHVsZSh7XG4gIGltcG9ydHM6IFtcbiAgICBDb21tb25Nb2R1bGUsXG4gICAgQmlkaU1vZHVsZSxcbiAgICBPdmVybGF5TW9kdWxlLFxuICAgIE56T3V0bGV0TW9kdWxlLFxuICAgIFBvcnRhbE1vZHVsZSxcbiAgICBOekkxOG5Nb2R1bGUsXG4gICAgTnpCdXR0b25Nb2R1bGUsXG4gICAgTnpJY29uTW9kdWxlLFxuICAgIE56UGlwZXNNb2R1bGUsXG4gICAgTnpOb0FuaW1hdGlvbk1vZHVsZSxcbiAgICBOelBpcGVzTW9kdWxlXG4gIF0sXG4gIGV4cG9ydHM6IFtOek1vZGFsQ29tcG9uZW50LCBOek1vZGFsRm9vdGVyRGlyZWN0aXZlLCBOek1vZGFsQ29udGVudERpcmVjdGl2ZV0sXG4gIHByb3ZpZGVyczogW056TW9kYWxTZXJ2aWNlXSxcbiAgZW50cnlDb21wb25lbnRzOiBbTnpNb2RhbENvbnRhaW5lckNvbXBvbmVudCwgTnpNb2RhbENvbmZpcm1Db250YWluZXJDb21wb25lbnRdLFxuICBkZWNsYXJhdGlvbnM6IFtcbiAgICBOek1vZGFsQ29tcG9uZW50LFxuICAgIE56TW9kYWxGb290ZXJEaXJlY3RpdmUsXG4gICAgTnpNb2RhbENvbnRlbnREaXJlY3RpdmUsXG4gICAgTnpNb2RhbENsb3NlQ29tcG9uZW50LFxuICAgIE56TW9kYWxGb290ZXJDb21wb25lbnQsXG4gICAgTnpNb2RhbFRpdGxlQ29tcG9uZW50LFxuICAgIE56TW9kYWxDb250YWluZXJDb21wb25lbnQsXG4gICAgTnpNb2RhbENvbmZpcm1Db250YWluZXJDb21wb25lbnQsXG4gICAgTnpNb2RhbENvbXBvbmVudFxuICBdXG59KVxuZXhwb3J0IGNsYXNzIE56TW9kYWxNb2R1bGUge31cbiJdfQ==