import { AfterViewInit, Component, ElementRef, ViewChild, OnInit } from '@angular/core';

import F2 from '@antv/f2';

import { HttpErrorResponse } from '@angular/common/http';

import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';

import { Storage } from '@ionic/storage';

import { CURRENT_USER } from '@vcp-share/const';
import { User } from '@vcp-core/models/user';

import { Usage, UsageReport, UsageService } from '../dashboard//usage.service';
import { chartSourceConfig, tooltipConfig } from './chart-config';

@Component({
  selector: 'app-me',
  templateUrl: './me.page.html',
  styleUrls: ['./me.page.scss'],
})
export class MePage implements AfterViewInit, OnInit {
  constructor(private usageService: UsageService, private storage: Storage) {}

  @ViewChild('usageContainer') usageContainer: ElementRef;

  unsubscribe = new Subject();
  loading = false;
  chart;
  usageReport: UsageReport;

  contractReferenceNumbers: string[] = [];
  selectedContractReferenceNumber: string;

  error: any;
  user: User = {} as User;

  get currentData() {
    return this.usageReport?.content.find((c) => c.contractReferenceNumber === this.selectedContractReferenceNumber)
      .usages;
  }

  get name() {
    return `${this.user.firstName}, ${this.user.lastName}`;
  }

  badgeColor(i: number) {
    switch (i % 3) {
      case 0:
        return 'success';
      case 1:
        return 'tertiary';
      case 2:
        return 'secondary';
      default:
        return '';
    }
  }

  async ngOnInit() {
    this.getUsage();

    const { user } = await this.storage.get(CURRENT_USER);
    this.user = user;
  }

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
          this.usageReport = res;

          this.contractReferenceNumbers = res.content.map((c) => c.contractReferenceNumber);
          this.selectedContractReferenceNumber = this.contractReferenceNumbers[0];

          this.drawChart();
        },
        (err: HttpErrorResponse) => {
          this.error = err.error;
        },
      );
  }

  private drawChart() {
    // Step 1: create Chart instance
    this.chart = new F2.Chart<Usage>({
      id: 'myChart',
      width: this.usageContainer.nativeElement.offsetWidth,
      height: 260,
      pixelRatio: window.devicePixelRatio,
    });

    // Step 2: Load data
    this.chart.source(this.currentData, chartSourceConfig);

    this.chart.tooltip(tooltipConfig);

    // Step 3：create chart with genre for xAxis and sold for yAxis
    this.chart.interval().position('yearMonth*pointsTotal').color('l(90) 0:#1890ff 1:#70cdd0'); // gradient

    // Step 4: render
    this.chart.render();
  }

  changeContractNumber(e) {
    this.selectedContractReferenceNumber = e.detail.value;

    this.chart.changeData(this.currentData, chartSourceConfig);
  }

  ngAfterViewInit() {
    // setTimeout(() => {
    //   // if data is local, put chart initialization here, because it need the parent element and canvas ready.
    // }, 500);
  }
}
