import { Component, OnInit } from '@angular/core';

import { Storage } from '@ionic/storage';

import { CURRENT_USER, XSRF_TOKEN } from '@vcp-share/const';
import { User } from '@vcp-core/models/user';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from '@vcp-core/services/auth.service';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-me',
  templateUrl: './me.page.html',
  styleUrls: ['./me.page.scss'],
})
export class MePage implements OnInit {
  constructor(private storage: Storage, private authService: AuthService,
    private navCtrl: NavController, private cookieService: CookieService) {}

  user: User = {} as User;
  error: any;

  unsubscribe = new Subject();

  get name() {
    return `${this.user.firstName}, ${this.user.lastName}`;
  }

  badgeColor(i: number) {
    switch (i % 3) {
      case 0:
        return 'success';
      case 1:
        return 'tertiary';
      case 2:
        return 'secondary';
      default:
        return '';
    }
  }

  async ngOnInit() {
    const { user } = await this.storage.get(CURRENT_USER);
    this.user = user;
  }

  async removeTokenAndUserInfo() {
    const token = this.cookieService.get(XSRF_TOKEN);

    this.authService.tokenSubject.next('');
    this.authService.currentUserSubject.next(null);

    await this.storage.remove(XSRF_TOKEN);
    await this.storage.remove(CURRENT_USER);
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  // to-do: make logout method in profile page
  logOutOnProfile() {
    this.authService.logout().pipe(
      takeUntil(this.unsubscribe)).subscribe(
      async (authRes) => {
        await this.removeTokenAndUserInfo();
        this.navCtrl.navigateRoot(['/login']);
      },
      (err: HttpErrorResponse) => {
        this.error = err.error;
      }
    );
    
  }

}
