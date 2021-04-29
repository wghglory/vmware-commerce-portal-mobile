import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';

import F2 from '@antv/f2';

import { Usage, UsageReport, UsageService } from './usage.service';
import { chartSourceConfig, tooltipConfig } from './chart-config';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage {
  constructor(private usageService: UsageService) {}

  @ViewChild('usageContainer') usageContainer: ElementRef;

  unsubscribe = new Subject();
  loading = false;
  chart;
  usageReport: UsageReport;
  allContracts = 'All Contracts';

  contractReferenceNumbers: string[] = [];
  selectedContractReferenceNumber: string;
  aggData: Usage[] = [];

  error: any;

  get currentData() {
    return this.usageReport?.content.find((c) => c.contractReferenceNumber === this.selectedContractReferenceNumber)
      .usages;
  }

  ngOnInit() {
    this.getUsage();
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
          this.contractReferenceNumbers.push(this.allContracts);
          this.selectedContractReferenceNumber = this.contractReferenceNumbers[0];

          const aggregatedMap = {};
          this.usageReport.content.forEach((c) => {
            c.usages.forEach((u) => {
              if (u.yearMonth in aggregatedMap) {
                aggregatedMap[u.yearMonth] = aggregatedMap[u.yearMonth] + u.pointsTotal;
              } else {
                aggregatedMap[u.yearMonth] = u.pointsTotal;
              }
            });
          });
          for (const m in aggregatedMap) {
            this.aggData.push({
              contractNumber: '',
              yearMonth: m,
              pointsTotal: aggregatedMap[m],
            } as Usage);
          }
          this.aggData.sort((a, b) => {
            if (a.yearMonth < b.yearMonth) {
              return -1;
            } else if (a.yearMonth > b.yearMonth) {
              return 1;
            } else {
              return 0;
            }
          });

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

    if (this.selectedContractReferenceNumber === this.allContracts) {
      this.chart.changeData(this.aggData, chartSourceConfig);
    } else {
      this.chart.changeData(this.currentData, chartSourceConfig);
    }
  }
}
