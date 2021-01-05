/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { ElementRef, OnInit, Renderer2 } from '@angular/core';
import { NzSpaceDirection, NzSpaceSize } from './types';
export declare class NzSpaceItemComponent implements OnInit {
    private renderer;
    private elementRef;
    constructor(renderer: Renderer2, elementRef: ElementRef);
    setDirectionAndSize(direction: NzSpaceDirection, size: number | NzSpaceSize): void;
    ngOnInit(): void;
}
