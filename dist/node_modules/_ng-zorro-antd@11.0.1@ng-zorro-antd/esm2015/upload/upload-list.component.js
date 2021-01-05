/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { animate, style, transition, trigger } from '@angular/animations';
import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, Inject, Input, NgZone, ViewEncapsulation } from '@angular/core';
const isImageFileType = (type) => !!type && type.indexOf('image/') === 0;
const ɵ0 = isImageFileType;
const MEASURE_SIZE = 200;
export class NzUploadListComponent {
    // #endregion
    constructor(cdr, doc, ngZone, platform, elementRef) {
        this.cdr = cdr;
        this.doc = doc;
        this.ngZone = ngZone;
        this.platform = platform;
        this.elementRef = elementRef;
        this.list = [];
        this.locale = {};
        this.iconRender = null;
        this.dir = 'ltr';
        // TODO: move to host after View Engine deprecation
        this.elementRef.nativeElement.classList.add('ant-upload-list');
    }
    get showPic() {
        return this.listType === 'picture' || this.listType === 'picture-card';
    }
    set items(list) {
        this.list = list;
    }
    genErr(file) {
        if (file.response && typeof file.response === 'string') {
            return file.response;
        }
        return (file.error && file.error.statusText) || this.locale.uploadError;
    }
    extname(url) {
        const temp = url.split('/');
        const filename = temp[temp.length - 1];
        const filenameWithoutSuffix = filename.split(/#|\?/)[0];
        return (/\.[^./\\]*$/.exec(filenameWithoutSuffix) || [''])[0];
    }
    isImageUrl(file) {
        if (isImageFileType(file.type)) {
            return true;
        }
        const url = (file.thumbUrl || file.url || '');
        if (!url) {
            return false;
        }
        const extension = this.extname(url);
        if (/^data:image\//.test(url) || /(webp|svg|png|gif|jpg|jpeg|jfif|bmp|dpg)$/i.test(extension)) {
            return true;
        }
        else if (/^data:/.test(url)) {
            // other file types of base64
            return false;
        }
        else if (extension) {
            // other file types which have extension
            return false;
        }
        return true;
    }
    getIconType(file) {
        if (!this.showPic) {
            return '';
        }
        if (file.isUploading || (!file.thumbUrl && !file.url)) {
            return 'uploading';
        }
        else {
            return 'thumbnail';
        }
    }
    previewImage(file) {
        return new Promise(resolve => {
            if (!isImageFileType(file.type)) {
                resolve('');
                return;
            }
            this.ngZone.runOutsideAngular(() => {
                const canvas = this.doc.createElement('canvas');
                canvas.width = MEASURE_SIZE;
                canvas.height = MEASURE_SIZE;
                canvas.style.cssText = `position: fixed; left: 0; top: 0; width: ${MEASURE_SIZE}px; height: ${MEASURE_SIZE}px; z-index: 9999; display: none;`;
                this.doc.body.appendChild(canvas);
                const ctx = canvas.getContext('2d');
                const img = new Image();
                img.onload = () => {
                    const { width, height } = img;
                    let drawWidth = MEASURE_SIZE;
                    let drawHeight = MEASURE_SIZE;
                    let offsetX = 0;
                    let offsetY = 0;
                    if (width < height) {
                        drawHeight = height * (MEASURE_SIZE / width);
                        offsetY = -(drawHeight - drawWidth) / 2;
                    }
                    else {
                        drawWidth = width * (MEASURE_SIZE / height);
                        offsetX = -(drawWidth - drawHeight) / 2;
                    }
                    try {
                        ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
                    }
                    catch (_a) { }
                    const dataURL = canvas.toDataURL();
                    this.doc.body.removeChild(canvas);
                    resolve(dataURL);
                };
                img.src = window.URL.createObjectURL(file);
            });
        });
    }
    genThumb() {
        if (!this.platform.isBrowser) {
            return;
        }
        const win = window;
        if (!this.showPic || typeof document === 'undefined' || typeof win === 'undefined' || !win.FileReader || !win.File) {
            return;
        }
        this.list
            .filter(file => file.originFileObj instanceof File && file.thumbUrl === undefined)
            .forEach(file => {
            file.thumbUrl = '';
            (this.previewFile ? this.previewFile(file).toPromise() : this.previewImage(file.originFileObj)).then(dataUrl => {
                file.thumbUrl = dataUrl;
                this.detectChanges();
            });
        });
    }
    showDownload(file) {
        return !!(this.icons.showDownloadIcon && file.status === 'done');
    }
    fixData() {
        this.list.forEach(file => {
            file.isUploading = file.status === 'uploading';
            file.message = this.genErr(file);
            file.linkProps = typeof file.linkProps === 'string' ? JSON.parse(file.linkProps) : file.linkProps;
            file.isImageUrl = this.previewIsImage ? this.previewIsImage(file) : this.isImageUrl(file);
            file.iconType = this.getIconType(file);
            file.showDownload = this.showDownload(file);
        });
    }
    handlePreview(file, e) {
        if (!this.onPreview) {
            return;
        }
        e.preventDefault();
        return this.onPreview(file);
    }
    handleRemove(file, e) {
        e.preventDefault();
        if (this.onRemove) {
            this.onRemove(file);
        }
        return;
    }
    handleDownload(file) {
        if (typeof this.onDownload === 'function') {
            this.onDownload(file);
        }
        else if (file.url) {
            window.open(file.url);
        }
    }
    detectChanges() {
        this.fixData();
        this.cdr.detectChanges();
    }
    ngOnChanges() {
        this.fixData();
        this.genThumb();
    }
}
NzUploadListComponent.decorators = [
    { type: Component, args: [{
                selector: 'nz-upload-list',
                exportAs: 'nzUploadList',
                template: "<div *ngFor=\"let file of list\" class=\"ant-upload-list-{{ listType }}-container\">\n  <div\n    class=\"ant-upload-list-item ant-upload-list-item-{{\n      file.status\n    }} ant-upload-list-item-list-type-{{ listType }}\"\n    [attr.data-key]=\"file.key\"\n    @itemState\n    nz-tooltip\n    [nzTooltipTitle]=\"file.status === 'error' ? file.message : null\"\n  >\n    <ng-template #icon>\n      <ng-container [ngSwitch]=\"file.iconType\">\n        <div\n          *ngSwitchCase=\"'uploading'\"\n          class=\"ant-upload-list-item-thumbnail\"\n          [class.ant-upload-list-item-file]=\"!file.isUploading\"\n        >\n          <ng-template\n            [ngTemplateOutlet]=\"iconNode\"\n            [ngTemplateOutletContext]=\"{ $implicit: file }\"\n          ></ng-template>\n        </div>\n        <a\n          *ngSwitchCase=\"'thumbnail'\"\n          class=\"ant-upload-list-item-thumbnail\"\n          [class.ant-upload-list-item-file]=\"!file.isImageUrl\"\n          target=\"_blank\"\n          rel=\"noopener noreferrer\"\n          [href]=\"file.url || file.thumbUrl\"\n          (click)=\"handlePreview(file, $event)\"\n        >\n          <img\n            *ngIf=\"file.isImageUrl; else noImageThumbTpl\"\n            class=\"ant-upload-list-item-image\"\n            [src]=\"file.thumbUrl || file.url\"\n            [attr.alt]=\"file.name\"\n          />\n        </a>\n        <div *ngSwitchDefault class=\"ant-upload-text-icon\">\n          <ng-template\n            [ngTemplateOutlet]=\"iconNode\"\n            [ngTemplateOutletContext]=\"{ $implicit: file }\"\n          ></ng-template>\n        </div>\n      </ng-container>\n      <ng-template #noImageThumbTpl>\n        <ng-template\n          [ngTemplateOutlet]=\"iconNode\"\n          [ngTemplateOutletContext]=\"{ $implicit: file }\"\n        ></ng-template>\n      </ng-template>\n    </ng-template>\n    <ng-template #iconNode let-file>\n      <ng-container *ngIf=\"!iconRender; else iconRender\">\n        <ng-container [ngSwitch]=\"listType\">\n          <ng-container *ngSwitchCase=\"'picture'\">\n            <ng-container *ngIf=\"file.isUploading; else iconNodeFileIcon\">\n              <i nz-icon nzType=\"loading\"></i>\n            </ng-container>\n          </ng-container>\n          <ng-container *ngSwitchCase=\"'picture-card'\">\n            <ng-container *ngIf=\"file.isUploading; else iconNodeFileIcon\">\n              {{ locale.uploading }}\n            </ng-container>\n          </ng-container>\n          <i *ngSwitchDefault nz-icon [nzType]=\"file.isUploading ? 'loading' : 'paper-clip'\"></i>\n        </ng-container>\n      </ng-container>\n      <ng-template #iconNodeFileIcon>\n        <i nz-icon [nzType]=\"file.isImageUrl ? 'picture' : 'file'\" nzTheme=\"twotone\"></i>\n      </ng-template>\n    </ng-template>\n    <ng-template #removeIcon>\n      <button\n        *ngIf=\"icons.showRemoveIcon\"\n        type=\"button\"\n        nz-button\n        nzType=\"text\"\n        nzSize=\"small\"\n        (click)=\"handleRemove(file, $event)\"\n        [attr.title]=\"locale.removeFile\"\n        class=\"ant-upload-list-item-card-actions-btn\"\n      >\n        <i nz-icon nzType=\"delete\"></i>\n      </button>\n    </ng-template>\n    <ng-template #downloadIcon>\n      <button\n        *ngIf=\"file.showDownload\"\n        type=\"button\"\n        nz-button\n        nzType=\"text\"\n        nzSize=\"small\"\n        (click)=\"handleDownload(file)\"\n        [attr.title]=\"locale.downloadFile\"\n        class=\"ant-upload-list-item-card-actions-btn\"\n      >\n        <i nz-icon nzType=\"download\"></i>\n      </button>\n    </ng-template>\n    <ng-template #downloadOrDelete>\n      <span\n        *ngIf=\"listType !== 'picture-card'\"\n        class=\"ant-upload-list-item-card-actions {{ listType === 'picture' ? 'picture' : '' }}\"\n      >\n        <ng-template [ngTemplateOutlet]=\"downloadIcon\"></ng-template>\n        <ng-template [ngTemplateOutlet]=\"removeIcon\"></ng-template>\n      </span>\n    </ng-template>\n    <ng-template #preview>\n      <a\n        *ngIf=\"file.url\"\n        target=\"_blank\"\n        rel=\"noopener noreferrer\"\n        class=\"ant-upload-list-item-name\"\n        [attr.title]=\"file.name\"\n        [href]=\"file.url\"\n        [attr.download]=\"file.linkProps && file.linkProps.download\"\n        (click)=\"handlePreview(file, $event)\"\n      >\n        {{ file.name }}\n      </a>\n      <span\n        *ngIf=\"!file.url\"\n        class=\"ant-upload-list-item-name\"\n        [attr.title]=\"file.name\"\n        (click)=\"handlePreview(file, $event)\"\n      >\n        {{ file.name }}\n      </span>\n      <ng-template [ngTemplateOutlet]=\"downloadOrDelete\"></ng-template>\n    </ng-template>\n    <div class=\"ant-upload-list-item-info\">\n      <span class=\"ant-upload-span\">\n        <ng-template [ngTemplateOutlet]=\"icon\"></ng-template>\n        <ng-template [ngTemplateOutlet]=\"preview\"></ng-template>\n      </span>\n    </div>\n    <span\n      *ngIf=\"listType === 'picture-card' && !file.isUploading\"\n      class=\"ant-upload-list-item-actions\"\n    >\n      <a\n        *ngIf=\"icons.showPreviewIcon\"\n        [href]=\"file.url || file.thumbUrl\"\n        target=\"_blank\"\n        rel=\"noopener noreferrer\"\n        [attr.title]=\"locale.previewFile\"\n        [ngStyle]=\"!(file.url || file.thumbUrl) ? { opacity: 0.5, 'pointer-events': 'none' } : null\"\n        (click)=\"handlePreview(file, $event)\"\n      >\n        <i nz-icon nzType=\"eye\"></i>\n      </a>\n      <ng-container *ngIf=\"file.status === 'done'\">\n        <ng-template [ngTemplateOutlet]=\"downloadIcon\"></ng-template>\n      </ng-container>\n      <ng-template [ngTemplateOutlet]=\"removeIcon\"></ng-template>\n    </span>\n    <div *ngIf=\"file.isUploading\" class=\"ant-upload-list-item-progress\">\n      <nz-progress\n        [nzPercent]=\"file.percent!\"\n        nzType=\"line\"\n        [nzShowInfo]=\"false\"\n        [nzStrokeWidth]=\"2\"\n      ></nz-progress>\n    </div>\n  </div>\n</div>\n",
                animations: [
                    trigger('itemState', [
                        transition(':enter', [style({ height: '0', width: '0', opacity: 0 }), animate(150, style({ height: '*', width: '*', opacity: 1 }))]),
                        transition(':leave', [animate(150, style({ height: '0', width: '0', opacity: 0 }))])
                    ])
                ],
                host: {
                    '[class.ant-upload-list-rtl]': `dir === 'rtl'`,
                    '[class.ant-upload-list-text]': `listType === 'text'`,
                    '[class.ant-upload-list-picture]': `listType === 'picture'`,
                    '[class.ant-upload-list-picture-card]': `listType === 'picture-card'`
                },
                preserveWhitespaces: false,
                encapsulation: ViewEncapsulation.None,
                changeDetection: ChangeDetectionStrategy.OnPush
            },] }
];
NzUploadListComponent.ctorParameters = () => [
    { type: ChangeDetectorRef },
    { type: undefined, decorators: [{ type: Inject, args: [DOCUMENT,] }] },
    { type: NgZone },
    { type: Platform },
    { type: ElementRef }
];
NzUploadListComponent.propDecorators = {
    locale: [{ type: Input }],
    listType: [{ type: Input }],
    items: [{ type: Input }],
    icons: [{ type: Input }],
    onPreview: [{ type: Input }],
    onRemove: [{ type: Input }],
    onDownload: [{ type: Input }],
    previewFile: [{ type: Input }],
    previewIsImage: [{ type: Input }],
    iconRender: [{ type: Input }],
    dir: [{ type: Input }]
};
export { ɵ0 };
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXBsb2FkLWxpc3QuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6Ii4uLy4uLy4uL2NvbXBvbmVudHMvdXBsb2FkLyIsInNvdXJjZXMiOlsidXBsb2FkLWxpc3QuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7R0FHRztBQUVILE9BQU8sRUFBRSxPQUFPLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxPQUFPLEVBQUUsTUFBTSxxQkFBcUIsQ0FBQztBQUUxRSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0sdUJBQXVCLENBQUM7QUFDakQsT0FBTyxFQUFFLFFBQVEsRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQzNDLE9BQU8sRUFDTCx1QkFBdUIsRUFDdkIsaUJBQWlCLEVBQ2pCLFNBQVMsRUFDVCxVQUFVLEVBQ1YsTUFBTSxFQUNOLEtBQUssRUFDTCxNQUFNLEVBR04saUJBQWlCLEVBQ2xCLE1BQU0sZUFBZSxDQUFDO0FBTXZCLE1BQU0sZUFBZSxHQUFHLENBQUMsSUFBWSxFQUFXLEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUUxRixNQUFNLFlBQVksR0FBRyxHQUFHLENBQUM7QUErQnpCLE1BQU0sT0FBTyxxQkFBcUI7SUEyS2hDLGFBQWE7SUFFYixZQUNVLEdBQXNCLEVBQ0osR0FBYyxFQUNoQyxNQUFjLEVBQ2QsUUFBa0IsRUFDbEIsVUFBc0I7UUFKdEIsUUFBRyxHQUFILEdBQUcsQ0FBbUI7UUFDSixRQUFHLEdBQUgsR0FBRyxDQUFXO1FBQ2hDLFdBQU0sR0FBTixNQUFNLENBQVE7UUFDZCxhQUFRLEdBQVIsUUFBUSxDQUFVO1FBQ2xCLGVBQVUsR0FBVixVQUFVLENBQVk7UUFqTGhDLFNBQUksR0FBcUIsRUFBRSxDQUFDO1FBTW5CLFdBQU0sR0FBYyxFQUFFLENBQUM7UUFZdkIsZUFBVSxHQUFrQyxJQUFJLENBQUM7UUFDakQsUUFB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YnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9naXRodWIuY29tL05HLVpPUlJPL25nLXpvcnJvLWFudGQvYmxvYi9tYXN0ZXIvTElDRU5TRVxuICovXG5cbmltcG9ydCB7IGFuaW1hdGUsIHN0eWxlLCB0cmFuc2l0aW9uLCB0cmlnZ2VyIH0gZnJvbSAnQGFuZ3VsYXIvYW5pbWF0aW9ucyc7XG5pbXBvcnQgeyBEaXJlY3Rpb24gfSBmcm9tICdAYW5ndWxhci9jZGsvYmlkaSc7XG5pbXBvcnQgeyBQbGF0Zm9ybSB9IGZyb20gJ0Bhbmd1bGFyL2Nkay9wbGF0Zm9ybSc7XG5pbXBvcnQgeyBET0NVTUVOVCB9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5pbXBvcnQge1xuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXG4gIENvbXBvbmVudCxcbiAgRWxlbWVudFJlZixcbiAgSW5qZWN0LFxuICBJbnB1dCxcbiAgTmdab25lLFxuICBPbkNoYW5nZXMsXG4gIFRlbXBsYXRlUmVmLFxuICBWaWV3RW5jYXBzdWxhdGlvblxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IE56U2FmZUFueSB9IGZyb20gJ25nLXpvcnJvLWFudGQvY29yZS90eXBlcyc7XG5pbXBvcnQgeyBPYnNlcnZhYmxlIH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7IE56U2hvd1VwbG9hZExpc3QsIE56VXBsb2FkRmlsZSwgTnpVcGxvYWRMaXN0VHlwZSB9IGZyb20gJy4vaW50ZXJmYWNlJztcblxuY29uc3QgaXNJbWFnZUZpbGVUeXBlID0gKHR5cGU6IHN0cmluZyk6IGJvb2xlYW4gPT4gISF0eXBlICYmIHR5cGUuaW5kZXhPZignaW1hZ2UvJykgPT09IDA7XG5cbmNvbnN0IE1FQVNVUkVfU0laRSA9IDIwMDtcblxudHlwZSBVcGxvYWRMaXN0SWNvblR5cGUgPSAnJyB8ICd1cGxvYWRpbmcnIHwgJ3RodW1ibmFpbCc7XG5cbmludGVyZmFjZSBVcGxvYWRMaXN0RmlsZSBleHRlbmRzIE56VXBsb2FkRmlsZSB7XG4gIGlzSW1hZ2VVcmw/OiBib29sZWFuO1xuICBpc1VwbG9hZGluZz86IGJvb2xlYW47XG4gIGljb25UeXBlPzogVXBsb2FkTGlzdEljb25UeXBlO1xuICBzaG93RG93bmxvYWQ/OiBib29sZWFuO1xufVxuXG5AQ29tcG9uZW50KHtcbiAgc2VsZWN0b3I6ICduei11cGxvYWQtbGlzdCcsXG4gIGV4cG9ydEFzOiAnbnpVcGxvYWRMaXN0JyxcbiAgdGVtcGxhdGVVcmw6ICcuL3VwbG9hZC1saXN0LmNvbXBvbmVudC5odG1sJyxcbiAgYW5pbWF0aW9uczogW1xuICAgIHRyaWdnZXIoJ2l0ZW1TdGF0ZScsIFtcbiAgICAgIHRyYW5zaXRpb24oJzplbnRlcicsIFtzdHlsZSh7IGhlaWdodDogJzAnLCB3aWR0aDogJzAnLCBvcGFjaXR5OiAwIH0pLCBhbmltYXRlKDE1MCwgc3R5bGUoeyBoZWlnaHQ6ICcqJywgd2lkdGg6ICcqJywgb3BhY2l0eTogMSB9KSldKSxcbiAgICAgIHRyYW5zaXRpb24oJzpsZWF2ZScsIFthbmltYXRlKDE1MCwgc3R5bGUoeyBoZWlnaHQ6ICcwJywgd2lkdGg6ICcwJywgb3BhY2l0eTogMCB9KSldKVxuICAgIF0pXG4gIF0sXG4gIGhvc3Q6IHtcbiAgICAnW2NsYXNzLmFudC11cGxvYWQtbGlzdC1ydGxdJzogYGRpciA9PT0gJ3J0bCdgLFxuICAgICdbY2xhc3MuYW50LXVwbG9hZC1saXN0LXRleHRdJzogYGxpc3RUeXBlID09PSAndGV4dCdgLFxuICAgICdbY2xhc3MuYW50LXVwbG9hZC1saXN0LXBpY3R1cmVdJzogYGxpc3RUeXBlID09PSAncGljdHVyZSdgLFxuICAgICdbY2xhc3MuYW50LXVwbG9hZC1saXN0LXBpY3R1cmUtY2FyZF0nOiBgbGlzdFR5cGUgPT09ICdwaWN0dXJlLWNhcmQnYFxuICB9LFxuICBwcmVzZXJ2ZVdoaXRlc3BhY2VzOiBmYWxzZSxcbiAgZW5jYXBzdWxhdGlvbjogVmlld0VuY2Fwc3VsYXRpb24uTm9uZSxcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2hcbn0pXG5leHBvcnQgY2xhc3MgTnpVcGxvYWRMaXN0Q29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzIHtcbiAgbGlzdDogVXBsb2FkTGlzdEZpbGVbXSA9IFtdO1xuXG4gIHByaXZhdGUgZ2V0IHNob3dQaWMoKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMubGlzdFR5cGUgPT09ICdwaWN0dXJlJyB8fCB0aGlzLmxpc3RUeXBlID09PSAncGljdHVyZS1jYXJkJztcbiAgfVxuXG4gIEBJbnB1dCgpIGxvY2FsZTogTnpTYWZlQW55ID0ge307XG4gIEBJbnB1dCgpIGxpc3RUeXBlITogTnpVcGxvYWRMaXN0VHlwZTtcbiAgQElucHV0KClcbiAgc2V0IGl0ZW1zKGxpc3Q6IE56VXBsb2FkRmlsZVtdKSB7XG4gICAgdGhpcy5saXN0ID0gbGlzdDtcbiAgfVxuICBASW5wdXQoKSBpY29ucyE6IE56U2hvd1VwbG9hZExpc3Q7XG4gIEBJbnB1dCgpIG9uUHJldmlldz86IChmaWxlOiBOelVwbG9hZEZpbGUpID0+IHZvaWQ7XG4gIEBJbnB1dCgpIG9uUmVtb3ZlITogKGZpbGU6IE56VXBsb2FkRmlsZSkgPT4gdm9pZDtcbiAgQElucHV0KCkgb25Eb3dubG9hZD86IChmaWxlOiBOelVwbG9hZEZpbGUpID0+IHZvaWQ7XG4gIEBJbnB1dCgpIHByZXZpZXdGaWxlPzogKGZpbGU6IE56VXBsb2FkRmlsZSkgPT4gT2JzZXJ2YWJsZTxzdHJpbmc+O1xuICBASW5wdXQoKSBwcmV2aWV3SXNJbWFnZT86IChmaWxlOiBOelVwbG9hZEZpbGUpID0+IGJvb2xlYW47XG4gIEBJbnB1dCgpIGljb25SZW5kZXI6IFRlbXBsYXRlUmVmPE56U2FmZUFueT4gfCBudWxsID0gbnVsbDtcbiAgQElucHV0KCkgZGlyOiBEaXJlY3Rpb24gPSAnbHRyJztcblxuICBwcml2YXRlIGdlbkVycihmaWxlOiBOelVwbG9hZEZpbGUpOiBzdHJpbmcge1xuICAgIGlmIChmaWxlLnJlc3BvbnNlICYmIHR5cGVvZiBmaWxlLnJlc3BvbnNlID09PSAnc3RyaW5nJykge1xuICAgICAgcmV0dXJuIGZpbGUucmVzcG9uc2U7XG4gICAgfVxuICAgIHJldHVybiAoZmlsZS5lcnJvciAmJiBmaWxlLmVycm9yLnN0YXR1c1RleHQpIHx8IHRoaXMubG9jYWxlLnVwbG9hZEVycm9yO1xuICB9XG5cbiAgcHJpdmF0ZSBleHRuYW1lKHVybDogc3RyaW5nKTogc3RyaW5nIHtcbiAgICBjb25zdCB0ZW1wID0gdXJsLnNwbGl0KCcvJyk7XG4gICAgY29uc3QgZmlsZW5hbWUgPSB0ZW1wW3RlbXAubGVuZ3RoIC0gMV07XG4gICAgY29uc3QgZmlsZW5hbWVXaXRob3V0U3VmZml4ID0gZmlsZW5hbWUuc3BsaXQoLyN8XFw/LylbMF07XG4gICAgcmV0dXJuICgvXFwuW14uL1xcXFxdKiQvLmV4ZWMoZmlsZW5hbWVXaXRob3V0U3VmZml4KSB8fCBbJyddKVswXTtcbiAgfVxuXG4gIGlzSW1hZ2VVcmwoZmlsZTogTnpVcGxvYWRGaWxlKTogYm9vbGVhbiB7XG4gICAgaWYgKGlzSW1hZ2VGaWxlVHlwZShmaWxlLnR5cGUhKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGNvbnN0IHVybDogc3RyaW5nID0gKGZpbGUudGh1bWJVcmwgfHwgZmlsZS51cmwgfHwgJycpIGFzIHN0cmluZztcbiAgICBpZiAoIXVybCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBjb25zdCBleHRlbnNpb24gPSB0aGlzLmV4dG5hbWUodXJsKTtcbiAgICBpZiAoL15kYXRhOmltYWdlXFwvLy50ZXN0KHVybCkgfHwgLyh3ZWJwfHN2Z3xwbmd8Z2lmfGpwZ3xqcGVnfGpmaWZ8Ym1wfGRwZykkL2kudGVzdChleHRlbnNpb24pKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9IGVsc2UgaWYgKC9eZGF0YTovLnRlc3QodXJsKSkge1xuICAgICAgLy8gb3RoZXIgZmlsZSB0eXBlcyBvZiBiYXNlNjRcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2UgaWYgKGV4dGVuc2lvbikge1xuICAgICAgLy8gb3RoZXIgZmlsZSB0eXBlcyB3aGljaCBoYXZlIGV4dGVuc2lvblxuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuXG4gIHByaXZhdGUgZ2V0SWNvblR5cGUoZmlsZTogVXBsb2FkTGlzdEZpbGUpOiBVcGxvYWRMaXN0SWNvblR5cGUge1xuICAgIGlmICghdGhpcy5zaG93UGljKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfVxuICAgIGlmIChmaWxlLmlzVXBsb2FkaW5nIHx8ICghZmlsZS50aHVtYlVybCAmJiAhZmlsZS51cmwpKSB7XG4gICAgICByZXR1cm4gJ3VwbG9hZGluZyc7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiAndGh1bWJuYWlsJztcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHByZXZpZXdJbWFnZShmaWxlOiBGaWxlIHwgQmxvYik6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgaWYgKCFpc0ltYWdlRmlsZVR5cGUoZmlsZS50eXBlKSkge1xuICAgICAgICByZXNvbHZlKCcnKTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgdGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xuICAgICAgICBjb25zdCBjYW52YXMgPSB0aGlzLmRvYy5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICAgICAgY2FudmFzLndpZHRoID0gTUVBU1VSRV9TSVpFO1xuICAgICAgICBjYW52YXMuaGVpZ2h0ID0gTUVBU1VSRV9TSVpFO1xuICAgICAgICBjYW52YXMuc3R5bGUuY3NzVGV4dCA9IGBwb3NpdGlvbjogZml4ZWQ7IGxlZnQ6IDA7IHRvcDogMDsgd2lkdGg6ICR7TUVBU1VSRV9TSVpFfXB4OyBoZWlnaHQ6ICR7TUVBU1VSRV9TSVpFfXB4OyB6LWluZGV4OiA5OTk5OyBkaXNwbGF5OiBub25lO2A7XG4gICAgICAgIHRoaXMuZG9jLmJvZHkuYXBwZW5kQ2hpbGQoY2FudmFzKTtcbiAgICAgICAgY29uc3QgY3R4ID0gY2FudmFzLmdldENvbnRleHQoJzJkJyk7XG4gICAgICAgIGNvbnN0IGltZyA9IG5ldyBJbWFnZSgpO1xuICAgICAgICBpbWcub25sb2FkID0gKCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHsgd2lkdGgsIGhlaWdodCB9ID0gaW1nO1xuXG4gICAgICAgICAgbGV0IGRyYXdXaWR0aCA9IE1FQVNVUkVfU0laRTtcbiAgICAgICAgICBsZXQgZHJhd0hlaWdodCA9IE1FQVNVUkVfU0laRTtcbiAgICAgICAgICBsZXQgb2Zmc2V0WCA9IDA7XG4gICAgICAgICAgbGV0IG9mZnNldFkgPSAwO1xuXG4gICAgICAgICAgaWYgKHdpZHRoIDwgaGVpZ2h0KSB7XG4gICAgICAgICAgICBkcmF3SGVpZ2h0ID0gaGVpZ2h0ICogKE1FQVNVUkVfU0laRSAvIHdpZHRoKTtcbiAgICAgICAgICAgIG9mZnNldFkgPSAtKGRyYXdIZWlnaHQgLSBkcmF3V2lkdGgpIC8gMjtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZHJhd1dpZHRoID0gd2lkdGggKiAoTUVBU1VSRV9TSVpFIC8gaGVpZ2h0KTtcbiAgICAgICAgICAgIG9mZnNldFggPSAtKGRyYXdXaWR0aCAtIGRyYXdIZWlnaHQpIC8gMjtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgY3R4IS5kcmF3SW1hZ2UoaW1nLCBvZmZzZXRYLCBvZmZzZXRZLCBkcmF3V2lkdGgsIGRyYXdIZWlnaHQpO1xuICAgICAgICAgIH0gY2F0Y2gge31cbiAgICAgICAgICBjb25zdCBkYXRhVVJMID0gY2FudmFzLnRvRGF0YVVSTCgpO1xuICAgICAgICAgIHRoaXMuZG9jLmJvZHkucmVtb3ZlQ2hpbGQoY2FudmFzKTtcblxuICAgICAgICAgIHJlc29sdmUoZGF0YVVSTCk7XG4gICAgICAgIH07XG4gICAgICAgIGltZy5zcmMgPSB3aW5kb3cuVVJMLmNyZWF0ZU9iamVjdFVSTChmaWxlKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHJpdmF0ZSBnZW5UaHVtYigpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMucGxhdGZvcm0uaXNCcm93c2VyKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3Qgd2luID0gd2luZG93IGFzIE56U2FmZUFueTtcbiAgICBpZiAoIXRoaXMuc2hvd1BpYyB8fCB0eXBlb2YgZG9jdW1lbnQgPT09ICd1bmRlZmluZWQnIHx8IHR5cGVvZiB3aW4gPT09ICd1bmRlZmluZWQnIHx8ICF3aW4uRmlsZVJlYWRlciB8fCAhd2luLkZpbGUpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgdGhpcy5saXN0XG4gICAgICAuZmlsdGVyKGZpbGUgPT4gZmlsZS5vcmlnaW5GaWxlT2JqIGluc3RhbmNlb2YgRmlsZSAmJiBmaWxlLnRodW1iVXJsID09PSB1bmRlZmluZWQpXG4gICAgICAuZm9yRWFjaChmaWxlID0+IHtcbiAgICAgICAgZmlsZS50aHVtYlVybCA9ICcnO1xuICAgICAgICAodGhpcy5wcmV2aWV3RmlsZSA/IHRoaXMucHJldmlld0ZpbGUoZmlsZSkudG9Qcm9taXNlKCkgOiB0aGlzLnByZXZpZXdJbWFnZShmaWxlLm9yaWdpbkZpbGVPYmohKSkudGhlbihkYXRhVXJsID0+IHtcbiAgICAgICAgICBmaWxlLnRodW1iVXJsID0gZGF0YVVybDtcbiAgICAgICAgICB0aGlzLmRldGVjdENoYW5nZXMoKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgc2hvd0Rvd25sb2FkKGZpbGU6IE56VXBsb2FkRmlsZSk6IGJvb2xlYW4ge1xuICAgIHJldHVybiAhISh0aGlzLmljb25zLnNob3dEb3dubG9hZEljb24gJiYgZmlsZS5zdGF0dXMgPT09ICdkb25lJyk7XG4gIH1cblxuICBwcml2YXRlIGZpeERhdGEoKTogdm9pZCB7XG4gICAgdGhpcy5saXN0LmZvckVhY2goZmlsZSA9PiB7XG4gICAgICBmaWxlLmlzVXBsb2FkaW5nID0gZmlsZS5zdGF0dXMgPT09ICd1cGxvYWRpbmcnO1xuICAgICAgZmlsZS5tZXNzYWdlID0gdGhpcy5nZW5FcnIoZmlsZSk7XG4gICAgICBmaWxlLmxpbmtQcm9wcyA9IHR5cGVvZiBmaWxlLmxpbmtQcm9wcyA9PT0gJ3N0cmluZycgPyBKU09OLnBhcnNlKGZpbGUubGlua1Byb3BzKSA6IGZpbGUubGlua1Byb3BzO1xuICAgICAgZmlsZS5pc0ltYWdlVXJsID0gdGhpcy5wcmV2aWV3SXNJbWFnZSA/IHRoaXMucHJldmlld0lzSW1hZ2UoZmlsZSkgOiB0aGlzLmlzSW1hZ2VVcmwoZmlsZSk7XG4gICAgICBmaWxlLmljb25UeXBlID0gdGhpcy5nZXRJY29uVHlwZShmaWxlKTtcbiAgICAgIGZpbGUuc2hvd0Rvd25sb2FkID0gdGhpcy5zaG93RG93bmxvYWQoZmlsZSk7XG4gICAgfSk7XG4gIH1cblxuICBoYW5kbGVQcmV2aWV3KGZpbGU6IE56VXBsb2FkRmlsZSwgZTogRXZlbnQpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMub25QcmV2aWV3KSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIHJldHVybiB0aGlzLm9uUHJldmlldyhmaWxlKTtcbiAgfVxuXG4gIGhhbmRsZVJlbW92ZShmaWxlOiBOelVwbG9hZEZpbGUsIGU6IEV2ZW50KTogdm9pZCB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGlmICh0aGlzLm9uUmVtb3ZlKSB7XG4gICAgICB0aGlzLm9uUmVtb3ZlKGZpbGUpO1xuICAgIH1cbiAgICByZXR1cm47XG4gIH1cblxuICBoYW5kbGVEb3dubG9hZChmaWxlOiBOelVwbG9hZEZpbGUpOiB2b2lkIHtcbiAgICBpZiAodHlwZW9mIHRoaXMub25Eb3dubG9hZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgdGhpcy5vbkRvd25sb2FkKGZpbGUpO1xuICAgIH0gZWxzZSBpZiAoZmlsZS51cmwpIHtcbiAgICAgIHdpbmRvdy5vcGVuKGZpbGUudXJsKTtcbiAgICB9XG4gIH1cblxuICAvLyAjZW5kcmVnaW9uXG5cbiAgY29uc3RydWN0b3IoXG4gICAgcHJpdmF0ZSBjZHI6IENoYW5nZURldGVjdG9yUmVmLFxuICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jOiBOelNhZmVBbnksXG4gICAgcHJpdmF0ZSBuZ1pvbmU6IE5nWm9uZSxcbiAgICBwcml2YXRlIHBsYXRmb3JtOiBQbGF0Zm9ybSxcbiAgICBwcml2YXRlIGVsZW1lbnRSZWY6IEVsZW1lbnRSZWZcbiAgKSB7XG4gICAgLy8gVE9ETzogbW92ZSB0byBob3N0IGFmdGVyIFZpZXcgRW5naW5lIGRlcHJlY2F0aW9uXG4gICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQuY2xhc3NMaXN0LmFkZCgnYW50LXVwbG9hZC1saXN0Jyk7XG4gIH1cblxuICBkZXRlY3RDaGFuZ2VzKCk6IHZvaWQge1xuICAgIHRoaXMuZml4RGF0YSgpO1xuICAgIHRoaXMuY2RyLmRldGVjdENoYW5nZXMoKTtcbiAgfVxuXG4gIG5nT25DaGFuZ2VzKCk6IHZvaWQge1xuICAgIHRoaXMuZml4RGF0YSgpO1xuICAgIHRoaXMuZ2VuVGh1bWIoKTtcbiAgfVxufVxuIl19