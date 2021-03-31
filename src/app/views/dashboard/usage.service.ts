import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@vcp-env/environment';

@Injectable({
  providedIn: 'root',
})
export class UsageService {
  constructor(private http: HttpClient) {}

  getUsage() {
    return this.http.get<UsageReport>(`${environment.apiPrefix}/dashboard/spUsage`);
  }
}

export interface UsageReport {
  total: number;
  content: Content[];
}

export interface Content {
  contractId: string;
  contractReferenceNumber: string;
  usages: Usage[];
}

export interface Usage {
  contractNumber: string;
  yearMonth: string;
  pointsTotal: number;
}
