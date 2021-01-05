/**
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://github.com/NG-ZORRO/ng-zorro-antd/blob/master/LICENSE
 */
import { formatDate } from '@angular/common';
import { Inject, Injectable, Injector, Optional } from '@angular/core';
import fnsFormat from 'date-fns/format';
import fnsGetISOWeek from 'date-fns/getISOWeek';
import fnsParse from 'date-fns/parse';
import { ɵNgTimeParser } from 'ng-zorro-antd/core/time';
import { mergeDateConfig, NZ_DATE_CONFIG } from './date-config';
import { NzI18nService } from './nz-i18n.service';
import * as i0 from "@angular/core";
import * as i1 from "./date-config";
export function DATE_HELPER_SERVICE_FACTORY(injector, config) {
    const i18n = injector.get(NzI18nService);
    return i18n.getDateLocale() ? new DateHelperByDateFns(i18n, config) : new DateHelperByDatePipe(i18n, config);
}
/**
 * Abstract DateHelperService(Token via Class)
 * Compatibility: compact for original usage by default which using DatePipe
 */
export class DateHelperService {
    constructor(i18n, config) {
        this.i18n = i18n;
        this.config = config;
        this.config = mergeDateConfig(this.config);
    }
}
DateHelperService.ɵprov = i0.ɵɵdefineInjectable({ factory: function DateHelperService_Factory() { return DATE_HELPER_SERVICE_FACTORY(i0.ɵɵinject(i0.INJECTOR), i0.ɵɵinject(i1.NZ_DATE_CONFIG, 8)); }, token: DateHelperService, providedIn: "root" });
DateHelperService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root',
                useFactory: DATE_HELPER_SERVICE_FACTORY,
                deps: [Injector, [new Optional(), NZ_DATE_CONFIG]]
            },] }
];
DateHelperService.ctorParameters = () => [
    { type: NzI18nService },
    { type: undefined, decorators: [{ type: Optional }, { type: Inject, args: [NZ_DATE_CONFIG,] }] }
];
/**
 * DateHelper that handles date formats with date-fns
 */
export class DateHelperByDateFns extends DateHelperService {
    getISOWeek(date) {
        return fnsGetISOWeek(date);
    }
    // Use date-fns's "weekStartsOn" to support different locale when "config.firstDayOfWeek" is null
    // https://github.com/date-fns/date-fns/blob/v2.0.0-alpha.27/src/locale/en-US/index.js#L23
    getFirstDayOfWeek() {
        let defaultWeekStartsOn;
        try {
            defaultWeekStartsOn = this.i18n.getDateLocale().options.weekStartsOn;
        }
        catch (e) {
            defaultWeekStartsOn = 1;
        }
        return this.config.firstDayOfWeek == null ? defaultWeekStartsOn : this.config.firstDayOfWeek;
    }
    /**
     * Format a date
     * @see https://date-fns.org/docs/format#description
     * @param date Date
     * @param formatStr format string
     */
    format(date, formatStr) {
        return date ? fnsFormat(date, formatStr, { locale: this.i18n.getDateLocale() }) : '';
    }
    parseDate(text, formatStr) {
        return fnsParse(text, formatStr, new Date(), {
            locale: this.i18n.getDateLocale(),
            weekStartsOn: this.getFirstDayOfWeek()
        });
    }
    parseTime(text, formatStr) {
        return this.parseDate(text, formatStr);
    }
}
DateHelperByDateFns.ɵprov = i0.ɵɵdefineInjectable({ factory: function DateHelperByDateFns_Factory() { return DATE_HELPER_SERVICE_FACTORY(i0.ɵɵinject(i0.INJECTOR), i0.ɵɵinject(i1.NZ_DATE_CONFIG, 8)); }, token: DateHelperByDateFns, providedIn: "root" });
/**
 * DateHelper that handles date formats with angular's date-pipe
 *
 * @see https://github.com/NG-ZORRO/ng-zorro-antd/issues/2406 - DatePipe may cause non-standard week bug, see:
 *
 */
export class DateHelperByDatePipe extends DateHelperService {
    getISOWeek(date) {
        return +this.format(date, 'w');
    }
    getFirstDayOfWeek() {
        if (this.config.firstDayOfWeek === undefined) {
            const locale = this.i18n.getLocaleId();
            return locale && ['zh-cn', 'zh-tw'].indexOf(locale.toLowerCase()) > -1 ? 1 : 0;
        }
        return this.config.firstDayOfWeek;
    }
    format(date, formatStr) {
        return date ? formatDate(date, formatStr, this.i18n.getLocaleId()) : '';
    }
    parseDate(text) {
        return new Date(text);
    }
    parseTime(text, formatStr) {
        const parser = new ɵNgTimeParser(formatStr, this.i18n.getLocaleId());
        return parser.toDate(text);
    }
}
DateHelperByDatePipe.ɵprov = i0.ɵɵdefineInjectable({ factory: function DateHelperByDatePipe_Factory() { return DATE_HELPER_SERVICE_FACTORY(i0.ɵɵinject(i0.INJECTOR), i0.ɵɵinject(i1.NZ_DATE_CONFIG, 8)); }, token: DateHelperByDatePipe, providedIn: "root" });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGF0ZS1oZWxwZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIuLi8uLi8uLi9jb21wb25lbnRzL2kxOG4vIiwic291cmNlcyI6WyJkYXRlLWhlbHBlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7R0FHRztBQUVILE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUM3QyxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3ZFLE9BQU8sU0FBUyxNQUFNLGlCQUFpQixDQUFDO0FBQ3hDLE9BQU8sYUFBYSxNQUFNLHFCQUFxQixDQUFDO0FBQ2hELE9BQU8sUUFBUSxNQUFNLGdCQUFnQixDQUFDO0FBRXRDLE9BQU8sRUFBZ0IsYUFBYSxFQUFFLE1BQU0seUJBQXlCLENBQUM7QUFDdEUsT0FBTyxFQUFFLGVBQWUsRUFBZ0IsY0FBYyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzlFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxtQkFBbUIsQ0FBQzs7O0FBRWxELE1BQU0sVUFBVSwyQkFBMkIsQ0FBQyxRQUFrQixFQUFFLE1BQW9CO0lBQ2xGLE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7SUFDekMsT0FBTyxJQUFJLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksbUJBQW1CLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLG9CQUFvQixDQUFDLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBQztBQUMvRyxDQUFDO0FBRUQ7OztHQUdHO0FBTUgsTUFBTSxPQUFnQixpQkFBaUI7SUFDckMsWUFBc0IsSUFBbUIsRUFBZ0QsTUFBb0I7UUFBdkYsU0FBSSxHQUFKLElBQUksQ0FBZTtRQUFnRCxXQUFNLEdBQU4sTUFBTSxDQUFjO1FBQzNHLElBQUksQ0FBQyxNQUFN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QUM7SUFFRCxTQUFTLENBQUMsSUFBWTtRQUNwQixPQUFPLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3hCLENBQUM7SUFFRCxTQUFTLENBQUMsSUFBWSxFQUFFLFNBQWlCO1FBQ3ZDLE1BQU0sTUFBTSxHQUFHLElBQUksYUFBYSxDQUFDLFNBQVMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7UUFDckUsT0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzdCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vZ2l0aHViLmNvbS9ORy1aT1JSTy9uZy16b3Jyby1hbnRkL2Jsb2IvbWFzdGVyL0xJQ0VOU0VcbiAqL1xuXG5pbXBvcnQgeyBmb3JtYXREYXRlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcbmltcG9ydCB7IEluamVjdCwgSW5qZWN0YWJsZSwgSW5qZWN0b3IsIE9wdGlvbmFsIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQgZm5zRm9ybWF0IGZyb20gJ2RhdGUtZm5zL2Zvcm1hdCc7XG5pbXBvcnQgZm5zR2V0SVNPV2VlayBmcm9tICdkYXRlLWZucy9nZXRJU09XZWVrJztcbmltcG9ydCBmbnNQYXJzZSBmcm9tICdkYXRlLWZucy9wYXJzZSc7XG5cbmltcG9ydCB7IFdlZWtEYXlJbmRleCwgybVOZ1RpbWVQYXJzZXIgfSBmcm9tICduZy16b3Jyby1hbnRkL2NvcmUvdGltZSc7XG5pbXBvcnQgeyBtZXJnZURhdGVDb25maWcsIE56RGF0ZUNvbmZpZywgTlpfREFURV9DT05GSUcgfSBmcm9tICcuL2RhdGUtY29uZmlnJztcbmltcG9ydCB7IE56STE4blNlcnZpY2UgfSBmcm9tICcuL256LWkxOG4uc2VydmljZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBEQVRFX0hFTFBFUl9TRVJWSUNFX0ZBQ1RPUlkoaW5qZWN0b3I6IEluamVjdG9yLCBjb25maWc6IE56RGF0ZUNvbmZpZyk6IERhdGVIZWxwZXJTZXJ2aWNlIHtcbiAgY29uc3QgaTE4biA9IGluamVjdG9yLmdldChOekkxOG5TZXJ2aWNlKTtcbiAgcmV0dXJuIGkxOG4uZ2V0RGF0ZUxvY2FsZSgpID8gbmV3IERhdGVIZWxwZXJCeURhdGVGbnMoaTE4biwgY29uZmlnKSA6IG5ldyBEYXRlSGVscGVyQnlEYXRlUGlwZShpMThuLCBjb25maWcpO1xufVxuXG4vKipcbiAqIEFic3RyYWN0IERhdGVIZWxwZXJTZXJ2aWNlKFRva2VuIHZpYSBDbGFzcylcbiAqIENvbXBhdGliaWxpdHk6IGNvbXBhY3QgZm9yIG9yaWdpbmFsIHVzYWdlIGJ5IGRlZmF1bHQgd2hpY2ggdXNpbmcgRGF0ZVBpcGVcbiAqL1xuQEluamVjdGFibGUoe1xuICBwcm92aWRlZEluOiAncm9vdCcsXG4gIHVzZUZhY3Rvcnk6IERBVEVfSEVMUEVSX1NFUlZJQ0VfRkFDVE9SWSxcbiAgZGVwczogW0luamVjdG9yLCBbbmV3IE9wdGlvbmFsKCksIE5aX0RBVEVfQ09ORklHXV1cbn0pXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgRGF0ZUhlbHBlclNlcnZpY2Uge1xuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgaTE4bjogTnpJMThuU2VydmljZSwgQE9wdGlvbmFsKCkgQEluamVjdChOWl9EQVRFX0NPTkZJRykgcHJvdGVjdGVkIGNvbmZpZzogTnpEYXRlQ29uZmlnKSB7XG4gICAgdGhpcy5jb25maWcgPSBtZXJnZURhdGVDb25maWcodGhpcy5jb25maWcpO1xuICB9XG5cbiAgYWJzdHJhY3QgZ2V0SVNPV2VlayhkYXRlOiBEYXRlKTogbnVtYmVyO1xuICBhYnN0cmFjdCBnZXRGaXJzdERheU9mV2VlaygpOiBXZWVrRGF5SW5kZXg7XG4gIGFic3RyYWN0IGZvcm1hdChkYXRlOiBEYXRlIHwgbnVsbCwgZm9ybWF0U3RyOiBzdHJpbmcpOiBzdHJpbmc7XG4gIGFic3RyYWN0IHBhcnNlRGF0ZSh0ZXh0OiBzdHJpbmcsIGZvcm1hdFN0cj86IHN0cmluZyk6IERhdGU7XG4gIGFic3RyYWN0IHBhcnNlVGltZSh0ZXh0OiBzdHJpbmcsIGZvcm1hdFN0cj86IHN0cmluZyk6IERhdGUgfCB1bmRlZmluZWQ7XG59XG5cbi8qKlxuICogRGF0ZUhlbHBlciB0aGF0IGhhbmRsZXMgZGF0ZSBmb3JtYXRzIHdpdGggZGF0ZS1mbnNcbiAqL1xuZXhwb3J0IGNsYXNzIERhdGVIZWxwZXJCeURhdGVGbnMgZXh0ZW5kcyBEYXRlSGVscGVyU2VydmljZSB7XG4gIGdldElTT1dlZWsoZGF0ZTogRGF0ZSk6IG51bWJlciB7XG4gICAgcmV0dXJuIGZuc0dldElTT1dlZWsoZGF0ZSk7XG4gIH1cblxuICAvLyBVc2UgZGF0ZS1mbnMncyBcIndlZWtTdGFydHNPblwiIHRvIHN1cHBvcnQgZGlmZmVyZW50IGxvY2FsZSB3aGVuIFwiY29uZmlnLmZpcnN0RGF5T2ZXZWVrXCIgaXMgbnVsbFxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vZGF0ZS1mbnMvZGF0ZS1mbnMvYmxvYi92Mi4wLjAtYWxwaGEuMjcvc3JjL2xvY2FsZS9lbi1VUy9pbmRleC5qcyNMMjNcbiAgZ2V0Rmlyc3REYXlPZldlZWsoKTogV2Vla0RheUluZGV4IHtcbiAgICBsZXQgZGVmYXVsdFdlZWtTdGFydHNPbjogV2Vla0RheUluZGV4O1xuICAgIHRyeSB7XG4gICAgICBkZWZhdWx0V2Vla1N0YXJ0c09uID0gdGhpcy5pMThuLmdldERhdGVMb2NhbGUoKS5vcHRpb25zIS53ZWVrU3RhcnRzT24hO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGRlZmF1bHRXZWVrU3RhcnRzT24gPSAxO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5jb25maWcuZmlyc3REYXlPZldlZWsgPT0gbnVsbCA/IGRlZmF1bHRXZWVrU3RhcnRzT24gOiB0aGlzLmNvbmZpZy5maXJzdERheU9mV2VlaztcbiAgfVxuXG4gIC8qKlxuICAgKiBGb3JtYXQgYSBkYXRlXG4gICAqIEBzZWUgaHR0cHM6Ly9kYXRlLWZucy5vcmcvZG9jcy9mb3JtYXQjZGVzY3JpcHRpb25cbiAgICogQHBhcmFtIGRhdGUgRGF0ZVxuICAgKiBAcGFyYW0gZm9ybWF0U3RyIGZvcm1hdCBzdHJpbmdcbiAgICovXG4gIGZvcm1hdChkYXRlOiBEYXRlLCBmb3JtYXRTdHI6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIGRhdGUgPyBmbnNGb3JtYXQoZGF0ZSwgZm9ybWF0U3RyLCB7IGxvY2FsZTogdGhpcy5pMThuLmdldERhdGVMb2NhbGUoKSB9KSA6ICcnO1xuICB9XG5cbiAgcGFyc2VEYXRlKHRleHQ6IHN0cmluZywgZm9ybWF0U3RyOiBzdHJpbmcpOiBEYXRlIHtcbiAgICByZXR1cm4gZm5zUGFyc2UodGV4dCwgZm9ybWF0U3RyLCBuZXcgRGF0ZSgpLCB7XG4gICAgICBsb2NhbGU6IHRoaXMuaTE4bi5nZXREYXRlTG9jYWxlKCksXG4gICAgICB3ZWVrU3RhcnRzT246IHRoaXMuZ2V0Rmlyc3REYXlPZldlZWsoKVxuICAgIH0pO1xuICB9XG5cbiAgcGFyc2VUaW1lKHRleHQ6IHN0cmluZywgZm9ybWF0U3RyOiBzdHJpbmcpOiBEYXRlIHwgdW5kZWZpbmVkIHtcbiAgICByZXR1cm4gdGhpcy5wYXJzZURhdGUodGV4dCwgZm9ybWF0U3RyKTtcbiAgfVxufVxuXG4vKipcbiAqIERhdGVIZWxwZXIgdGhhdCBoYW5kbGVzIGRhdGUgZm9ybWF0cyB3aXRoIGFuZ3VsYXIncyBkYXRlLXBpcGVcbiAqXG4gKiBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9ORy1aT1JSTy9uZy16b3Jyby1hbnRkL2lzc3Vlcy8yNDA2IC0gRGF0ZVBpcGUgbWF5IGNhdXNlIG5vbi1zdGFuZGFyZCB3ZWVrIGJ1Zywgc2VlOlxuICpcbiAqL1xuZXhwb3J0IGNsYXNzIERhdGVIZWxwZXJCeURhdGVQaXBlIGV4dGVuZHMgRGF0ZUhlbHBlclNlcnZpY2Uge1xuICBnZXRJU09XZWVrKGRhdGU6IERhdGUpOiBudW1iZXIge1xuICAgIHJldHVybiArdGhpcy5mb3JtYXQoZGF0ZSwgJ3cnKTtcbiAgfVxuXG4gIGdldEZpcnN0RGF5T2ZXZWVrKCk6IFdlZWtEYXlJbmRleCB7XG4gICAgaWYgKHRoaXMuY29uZmlnLmZpcnN0RGF5T2ZXZWVrID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnN0IGxvY2FsZSA9IHRoaXMuaTE4bi5nZXRMb2NhbGVJZCgpO1xuICAgICAgcmV0dXJuIGxvY2FsZSAmJiBbJ3poLWNuJywgJ3poLXR3J10uaW5kZXhPZihsb2NhbGUudG9Mb3dlckNhc2UoKSkgPiAtMSA/IDEgOiAwO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5jb25maWcuZmlyc3REYXlPZldlZWs7XG4gIH1cblxuICBmb3JtYXQoZGF0ZTogRGF0ZSB8IG51bGwsIGZvcm1hdFN0cjogc3RyaW5nKTogc3RyaW5nIHtcbiAgICByZXR1cm4gZGF0ZSA/IGZvcm1hdERhdGUoZGF0ZSwgZm9ybWF0U3RyLCB0aGlzLmkxOG4uZ2V0TG9jYWxlSWQoKSkhIDogJyc7XG4gIH1cblxuICBwYXJzZURhdGUodGV4dDogc3RyaW5nKTogRGF0ZSB7XG4gICAgcmV0dXJuIG5ldyBEYXRlKHRleHQpO1xuICB9XG5cbiAgcGFyc2VUaW1lKHRleHQ6IHN0cmluZywgZm9ybWF0U3RyOiBzdHJpbmcpOiBEYXRlIHtcbiAgICBjb25zdCBwYXJzZXIgPSBuZXcgybVOZ1RpbWVQYXJzZXIoZm9ybWF0U3RyLCB0aGlzLmkxOG4uZ2V0TG9jYWxlSWQoKSk7XG4gICAgcmV0dXJuIHBhcnNlci50b0RhdGUodGV4dCk7XG4gIH1cbn1cbiJdfQ==