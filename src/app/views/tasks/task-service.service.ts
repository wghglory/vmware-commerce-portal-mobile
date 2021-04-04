import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@vcp-env/environment';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private http: HttpClient) {}

  getTaskCount() {
    return this.http.get<TaskCount>(`${environment.apiPrefix}/taskCount`);
  }

  getTasks() {
    return this.http.get<Tasks>(`${environment.apiPrefix}/tasks?sort=createdTime,asc&limit=10000`);
  }
}

export interface TaskCount {
  count: number;
}

export interface Tasks {
  total: number;
  content: Content[];
}

export interface Content {
  id: string;
  name: string;
  resourceType: string;
  resourceId: string;
  createdTime: string;
  data: Data[];
}

export interface Data {
  month: number;
  contractSKU: string;
  trackType: string;
  year: number;
  contractType: string;
  yearMonth: string;
  aggregator: Aggregator[];
  serviceProvider: ServiceProvider[];
  createdTime: string;
}

export interface Aggregator {
  name: string;
  id: string;
}

export interface ServiceProvider {
  name: string;
  id: string;
}
