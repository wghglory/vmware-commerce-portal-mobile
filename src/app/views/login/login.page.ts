import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { CookieService } from 'ngx-cookie-service';

import { Storage } from '@ionic/storage';

import { Login } from '@vcp-core/models/user';
import { AuthService } from '@vcp-core/services/auth.service';
import { CURRENT_USER, XSRF_TOKEN } from '@vcp-share/const';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private navCtrl: NavController,
    private cookieService: CookieService,
    private storage: Storage,
  ) {}

  unsubscribe = new Subject();

  loginForm: FormGroup;
  submitting = false;
  error: any;

  async saveTokenAndUserInfo(user) {
    const token = this.cookieService.get(XSRF_TOKEN);

    this.authService.tokenSubject.next(token);
    this.authService.currentUserSubject.next(user);

    await this.storage.set(XSRF_TOKEN, token); // web: indexedDB
    await this.storage.set(CURRENT_USER, user); // web: indexedDB
  }

  login() {
    if (this.loginForm.invalid) {
      return;
    }

    this.submitting = true;
    const { username, password } = this.loginForm.value;

    this.authService
      .login({ username, password } as Login)
      .pipe(
        takeUntil(this.unsubscribe),
        finalize(() => {
          this.submitting = false;
        }),
      )
      .subscribe(
        async (authRes) => {
          await this.saveTokenAndUserInfo(authRes);

          this.navCtrl.navigateRoot(['/tabs']);
        },
        (err: HttpErrorResponse) => {
          this.error = err.error;
        },
      );
  }

  //to-do make logout method here, is this method being used? not sure
  logout() {
    this.authService.logout();
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['testspadmin@vmware.com.mock', Validators.required],
      password: ['Test@123', Validators.required],
      // username: ['', Validators.required],
      // password: ['', Validators.required],
    });
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
