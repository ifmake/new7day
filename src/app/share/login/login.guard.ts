import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorage } from '../../common/storage/local.storage';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(
    private storage: LocalStorage,
    private router: Router
  ) {}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      const IsLogin = JSON.parse(this.storage.get('loginer'));
      if (IsLogin.token && IsLogin.token !== '') {
        this.router.navigate(['material/product']);
        return true;
      } else {
        this.router.navigate(['login']);
        return false;
      }
  }
}
