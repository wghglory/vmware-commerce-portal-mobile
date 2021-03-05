import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';

import { UsageService } from './usage.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(private usageService: UsageService) {}

  unsubscribe = new Subject();
  loading = false;

  error: any;

  getUsage() {
    this.loading = true;

    this.usageService
      .getUsage()
      .pipe(
        takeUntil(this.unsubscribe),
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe(
        (res) => {
          console.log(res);
        },
        (err: HttpErrorResponse) => {
          this.error = err.error;
        },
      );
  }

  ngOnInit() {
    this.getUsage();
  }
}
