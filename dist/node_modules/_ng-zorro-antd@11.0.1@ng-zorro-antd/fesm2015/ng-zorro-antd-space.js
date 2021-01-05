import { BidiModule } from '@angular/cdk/bidi';
import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, Renderer2, ElementRef, Input, ContentChildren, NgModule } from '@angular/core';
import { __decorate, __metadata } from 'tslib';
import { NzConfigService, WithConfig } from 'ng-zorro-antd/core/config';
import { Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';

/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
const spaceSize = {
    small: 8,
    middle: 16,
    large: 24
};
class NzSpaceItemComponent {
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

/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
const NZ_CONFIG_MODULE_NAME = 'space';
class NzSpaceComponent {
    constructor(nzConfigService) {
        this.nzConfigService = nzConfigService;
        this._nzModuleName = NZ_CONFIG_MODULE_NAME;
        this.nzDirection = 'horizontal';
        this.nzSize = 'small';
        this.destroy$ = new Subject();
    }
    updateSpaceItems() {
        if (this.nzSpaceItemComponents) {
            this.nzSpaceItemComponents.forEach(item => {
                item.setDirectionAndSize(this.nzDirection, this.nzSize);
            });
        }
    }
    ngOnChanges() {
        this.updateSpaceItems();
        this.mergedAlign = this.nzAlign === undefined && this.nzDirection === 'horizontal' ? 'center' : this.nzAlign;
    }
    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
    ngAfterViewInit() {
        this.nzSpaceItemComponents.changes.pipe(startWith(null), takeUntil(this.destroy$)).subscribe(() => {
            this.updateSpaceItems();
        });
    }
}
NzSpaceComponent.decorators = [
    { type: Component, args: [{
                selector: 'nz-space, [nz-space]',
                exportAs: 'NzSpace',
                changeDetection: ChangeDetectionStrategy.OnPush,
                template: `
    <ng-content></ng-content>
  `,
                host: {
                    class: 'ant-space',
                    '[class.ant-space-horizontal]': 'nzDirection === "horizontal"',
                    '[class.ant-space-vertical]': 'nzDirection === "vertical"',
                    '[class.ant-space-align-start]': 'mergedAlign === "start"',
                    '[class.ant-space-align-end]': 'mergedAlign === "end"',
                    '[class.ant-space-align-center]': 'mergedAlign === "center"',
                    '[class.ant-space-align-baseline]': 'mergedAlign === "baseline"'
                }
            },] }
];
NzSpaceComponent.ctorParameters = () => [
    { type: NzConfigService }
];
NzSpaceComponent.propDecorators = {
    nzDirection: [{ type: Input }],
    nzAlign: [{ type: Input }],
    nzSize: [{ type: Input }],
    nzSpaceItemComponents: [{ type: ContentChildren, args: [NzSpaceItemComponent,] }]
};
__decorate([
    WithConfig(),
    __metadata("design:type", Object)
], NzSpaceComponent.prototype, "nzSize", void 0);

/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
class NzSpaceModule {
}
NzSpaceModule.decorators = [
    { type: NgModule, args: [{
                declarations: [NzSpaceComponent, NzSpaceItemComponent],
                exports: [NzSpaceComponent, NzSpaceItemComponent],
                imports: [BidiModule, CommonModule]
            },] }
];

/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */

/**
 * Generated bundle index. Do not edit.
 */

export { NzSpaceComponent, NzSpaceItemComponent, NzSpaceModule };
//# sourceMappingURL=ng-zorro-antd-space.js.map
