import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@vcp-env/environment';

@Injectable({
  providedIn: 'root',
})
export class UsageService {
  constructor(private http: HttpClient) {}

  getUsage() {
    return this.http.get(`${environment.apiPrefix}/dashboard/spUsage`);
  }
}
