import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';

// todo: tree shaking
import * as echarts from 'echarts';

import { UsageReport, UsageService } from './usage.service';
import { echartOption } from './echart-config';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage {
  constructor(private usageService: UsageService) {}

  @ViewChild('dashboardContainer') dashboardContainer: ElementRef;
  @ViewChild('usageContainer') usageContainer: ElementRef;

  unsubscribe = new Subject();
  loading = false;
  echartInstance;
  option = echartOption;

  contractReferenceNumbers: string[] = [];
  selectedContractReferenceNumber: string;

  error: any;

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
          this.drawChart(res);
        },
        (err: HttpErrorResponse) => {
          this.error = err.error;
        },
      );
  }

  private drawChart(data: UsageReport) {
    let { source, datasetItems, initialContractReferenceNumber } = this.buildEChartSourceAndDatasetItems(data);

    this.selectedContractReferenceNumber = initialContractReferenceNumber;

    // initial series
    let { dataset, series } = this.buildEChartDataset(source, datasetItems);

    this.option = {
      ...this.option,
      dataset,
      series,
    };

    // dynamically set echarts size
    // console.log(`${this.dashboardContainer.nativeElement.offsetWidth}px`);
    this.echartInstance = echarts.init(this.usageContainer.nativeElement, null, { renderer: 'svg' });
    this.echartInstance.setOption(this.option);
  }

  private buildEChartDataset(source: any[], datasetItems: any[]) {
    let series = [
      {
        type: 'bar',
        smooth: true,
        color: '#0072a3',
        width: 10,
        barWidth: '30%',
        datasetId: this.contractReferenceNumbers[0],
        showSymbol: false,
        encode: {
          x: 'yearMonth',
          y: 'pointsTotal',
          itemName: 'yearMonth',
          tooltip: ['pointsTotal'],
        },
      },
    ];

    let dataset = [
      {
        id: 'dataset_raw',
        source,
      },
      ...datasetItems,
    ];
    return { dataset, series };
  }

  private buildEChartSourceAndDatasetItems(data: UsageReport) {
    let source: any[] = [['contractId', 'contractReferenceNumber', 'contractNumber', 'yearMonth', 'pointsTotal']];
    let datasetItems = [];

    data.content.forEach((c) => {
      this.contractReferenceNumbers.push(c.contractReferenceNumber);

      datasetItems.push({
        id: c.contractReferenceNumber,
        fromDatasetId: 'dataset_raw',
        transform: {
          type: 'filter',
          config: {
            and: [{ dimension: 'contractReferenceNumber', '=': c.contractReferenceNumber }],
          },
        },
      });

      c.usages.forEach((u) => {
        source.push([c.contractId, c.contractReferenceNumber, u.contractNumber, u.yearMonth, u.pointsTotal]);
      });
    });
    return { source, datasetItems, initialContractReferenceNumber: this.contractReferenceNumbers[0] };
  }

  changeContractNumber(e) {
    this.selectedContractReferenceNumber = e.detail.value;

    // update series to update view
    let seriesItem = { ...this.option.series[0], datasetId: this.selectedContractReferenceNumber };
    this.option = {
      ...this.option,
      series: [seriesItem],
    };
    this.echartInstance.setOption(this.option);
  }
}
