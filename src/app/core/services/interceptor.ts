import { Injectable, Provider } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';

import { from, Observable, throwError } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';

import { Storage } from '@ionic/storage';

import { XSRF_TOKEN } from '@vcp-share/const';

import { environment } from '@vcp-env/environment';

import { AuthService } from './auth.service';

// add token to further request header if any
@Injectable({
  providedIn: 'root',
})
export class TokenInterceptor implements HttpInterceptor {
  constructor(private storage: Storage) {}

  intercept(request: HttpRequest<any>, next: HttpHandler) {
    return from(this.storage.get(XSRF_TOKEN)).pipe(
      mergeMap((token: string) => {
        if (token) {
          const headers = {};
          headers[XSRF_TOKEN] = encodeURI(token);

          request = request.clone({
            // headers: req.headers.set('Content-Type', content_type),
            setHeaders: headers,
          });
        }

        return next.handle(request);
      }),
    );
  }
}

@Injectable({
  providedIn: 'root',
})
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err) => {
        // except login page, any 401 API response will kick user to login
        if (err.status === 401 && !request.url.includes('iam/session')) {
          // auto logout if 401 response returned from api
          this.authService.logout();
          location.reload();
        }

        return throwError(err);
      }),
    );
  }
}

// change api host for production
@Injectable({
  providedIn: 'root',
})
export class ApiHostInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    if (environment.production) {
      const apiReq = req.clone({
        url: req.url.replace(environment.apiPrefix, environment.apiUrl),
      });
      return next.handle(apiReq);
    }
    return next.handle(req);
  }
}

export const providers: Provider[] = [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ApiHostInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: ErrorInterceptor,
    multi: true,
  },
];
