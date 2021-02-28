import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { User } from '@vcp-core/models/user';
import { AuthService } from '@vcp-core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {
  constructor(private formBuilder: FormBuilder, private auth: AuthService, private router: Router) {}

  unsubscribe = new Subject();

  loginForm: FormGroup;
  submitting = false;
  error: any;

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    if (this.loginForm.invalid) {
      return;
    }

    this.submitting = true;
    const { username, password } = this.loginForm.value;

    this.auth
      .login({ username, password } as User)
      .pipe(
        takeUntil(this.unsubscribe),
        finalize(() => {
          this.submitting = false;
        }),
      )
      .subscribe(
        (res) => {
          this.router.navigate(['home']);
        },
        (err: HttpErrorResponse) => {
          this.error = err.error;
        },
      );
  }

  ngOnDestroy() {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }
}
