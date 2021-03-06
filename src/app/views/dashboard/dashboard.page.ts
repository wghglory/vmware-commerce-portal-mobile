import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';

// todo: tree shaking
import * as echarts from 'echarts';

import { UsageReport, UsageService } from './usage.service';

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
  echartDataset = [['contractId', 'contractReferenceNumber', 'contractNumber', 'yearMonth', 'pointsTotal']];
  contractReferenceNumbers = [];

  error: any;

  option = {
    dataset: [],
    grid: {
      left: '20%',
    },
    title: {
      // text: 'Usage Report for Last 12 Months',
      // left: 'center',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
        label: {
          formatter: function (params) {
            const d = new Date(params.value);
            // If axis.type is 'time'
            return d.toLocaleString('en-us', { year: 'numeric', month: 'short' });
          },
        },
      },
    },
    xAxis: {
      type: 'time',
      nameLocation: 'middle',
      offset: 10,
      boundaryGap: true,
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
        alignWithLabel: true,
      },
      axisLabel: {
        // interval: 1,
        // color: '#ccc',
      },
    },
    yAxis: {
      name: 'Points',
      nameGap: 20,
      offset: 10,
      splitNumber: 4,
      nameTextStyle: {
        align: 'right',
        verticalAlign: 'bottom',
      },
    },
    series: [],
  };

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
          this.drawChart(res);
        },
        (err: HttpErrorResponse) => {
          this.error = err.error;
        },
      );
  }

  drawChart(data: UsageReport) {
    let source: any[] = [['contractId', 'contractReferenceNumber', 'contractNumber', 'yearMonth', 'pointsTotal']];
    let datasetItems = [];
    let series = [];

    data.content.forEach((c) => {
      this.contractReferenceNumbers.push(c.contractReferenceNumber);

      datasetItems.push({
        id: `dataset_for_${c.contractReferenceNumber}`,
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

    // initial series
    series = [
      {
        type: 'bar',
        smooth: true,
        color: '#0072a3',
        width: 10,
        barWidth: '30%',
        datasetId: `dataset_for_${this.contractReferenceNumbers[0]}`,
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
      // {
      //   id: 'dataset_for_AMER00007SRV',
      //   fromDatasetId: 'dataset_raw',
      //   transform: {
      //     type: 'filter',
      //     config: {
      //       and: [
      //         // { dimension: 'Year', gte: 1950 },
      //         { dimension: 'contractReferenceNumber', '=': 'AMER00007SRV' },
      //       ],
      //     },
      //   },
      // },
    ];

    this.option = {
      ...this.option,
      dataset,
      series,
    };

    console.log(this.option);

    this.echartInstance.setOption(this.option);

    return dataset;
  }

  ngOnInit() {
    this.getUsage();
  }

  ngAfterViewInit() {
    // init echarts
    setTimeout(() => {
      // dynamically set echarts size
      console.log(`${this.dashboardContainer.nativeElement.offsetWidth}px`);
      // this.usageContainer.nativeElement.style.width = `${this.usageContainer.nativeElement.offsetWidth}px`;
      // initialize the echarts instance
      this.echartInstance = echarts.init(this.usageContainer.nativeElement, null, { renderer: 'svg' });

      // this.echartInstance.setOption(this.option);
    }, 100);
  }
}
