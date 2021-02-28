import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Storage } from '@ionic/storage';

import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { environment } from '@vcp-env/environment.prod';

import { AuthResponse, User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authSubject = new BehaviorSubject(false);

  constructor(private httpClient: HttpClient, private storage: Storage) {}

  login(user: User): Observable<AuthResponse> {
    return this.httpClient.post(`${environment.apiPrefix}/session`, user).pipe(
      tap(async (res: AuthResponse) => {
        if (res.user) {
          // todo: update based on real API response
          await this.storage.set('TOKEN', res.user.token); // web: indexedDB
          this.authSubject.next(true);
        }
      }),
    );
  }

  async logout() {
    await this.storage.remove('TOKEN');
    this.authSubject.next(false);
  }

  isAuthenticated() {
    return this.authSubject.asObservable();
  }
}
