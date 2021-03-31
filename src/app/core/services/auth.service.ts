import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Storage } from '@ionic/storage';

import { BehaviorSubject, Observable } from 'rxjs';

import { environment } from '@vcp-env/environment.prod';
import { XSRF_TOKEN, CURRENT_USER } from '@vcp-share/const';

import { AuthResponse, Login } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private httpClient: HttpClient, private storage: Storage) {}

  tokenSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  currentUserSubject: BehaviorSubject<AuthResponse> = new BehaviorSubject<AuthResponse>(null);

  get token() {
    return this.tokenSubject.value;
  }

  get currentUser(): AuthResponse {
    return this.currentUserSubject.value;
  }

  fetchStorage() {
    return this.storage
      .forEach((v, k) => {
        if (k === XSRF_TOKEN) {
          this.tokenSubject.next(v);
        } else if (k === CURRENT_USER) {
          this.currentUserSubject.next(v);
        }
      })
      .then(() => {
        // console.log(this.token, this.currentUser);
        return this.token !== '';
      });
  }

  login(data: Login): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${environment.apiPrefix}/iam/session`, data);
  }

  logout(): Observable<void> {
    return this.httpClient.delete<void>(`${environment.apiPrefix}/iam/session`);
  }
}
