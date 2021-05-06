import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@vcp-env/environment';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class SubmitService {
  constructor(private httpClient: HttpClient) {}

  submit(data: Submission, rID: string): Observable<any>{
    return this.httpClient.post<Submission>(`${environment.apiPrefix}/mbo/${rID}/updateUsage`, data);
  }
}

export interface Submission {
  serviceProviderPurchaseOrder: number;
  usages: [];
  comment: string;
  submit: true;
  zeroUsage: false;
}
