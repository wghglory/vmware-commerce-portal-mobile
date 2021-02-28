import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot } from '@angular/router';
import { NavController } from '@ionic/angular';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private navCtrl: NavController) {}

  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const hasToken = await this.authService.fetchStorage();

    if (hasToken) {
      return true;
    } else {
      this.navCtrl.navigateRoot('/login', { queryParams: { returnUrl: state.url } });
      return false;
    }
  }
}
