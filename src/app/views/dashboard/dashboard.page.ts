import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';

// todo: tree shaking
import * as echarts from 'echarts';

import { UsageService } from './usage.service';

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

  error: any;

  option = {
    dataset: [
      {
        id: 'dataset_raw',
        source: [
          ['contractId', 'contractReferenceNumber', 'contractNumber', 'yearMonth', 'pointsTotal'],
          ['1967322a-c083-4a19-8db0-6bd12e2ded78', 'AMER00007SRV', '104720471883777', '2020-02', 5500],
          ['1967322a-c083-4a19-8db0-6bd12e2ded78', 'AMER00007SRV', '104720471883777', '2020-03', 5500],
          ['1967322a-c083-4a19-8db0-6bd12e2ded78', 'AMER00007SRV', '104720471883777', '2020-04', 5500],
          ['1967322a-c083-4a19-8db0-6bd12e2ded78', 'AMER00007SRV', '104720471883777', '2020-05', 5500],
          ['1967322a-c083-4a19-8db0-6bd12e2ded78', 'AMER00007SRV', '104720471883777', '2020-06', 5500],
          ['1967322a-c083-4a19-8db0-6bd12e2ded78', 'AMER00007SRV', '104720471883777', '2020-07', 5500],
          ['1967322a-c083-4a19-8db0-6bd12e2ded78', 'AMER00007SRV', '104720471883777', '2020-08', 5500],
          ['1967322a-c083-4a19-8db0-6bd12e2ded78', 'AMER00007SRV', '104720471883777', '2020-09', 5500],
          ['1967322a-c083-4a19-8db0-6bd12e2ded78', 'AMER00007SRV', '104720471883777', '2020-10', 6500],
          ['1967322a-c083-4a19-8db0-6bd12e2ded78', 'AMER00007SRV', '104720471883777', '2020-11', 7500],
          ['1967322a-c083-4a19-8db0-6bd12e2ded78', 'AMER00007SRV', '104720471883777', '2020-12', 8500],
          ['1967322a-c083-4a19-8db0-6bd12e2ded78', 'AMER00007SRV', '104720471883777', '2021-01', 9500],
          ['1967322a-c083-4a19-8db0-6bd12e2ded78', 'AMER00007SRV', '104720471883777', '2021-02', 5500],
        ],
      },
      {
        id: 'dataset_since_for_AMER00007SRV',
        fromDatasetId: 'dataset_raw',
        transform: {
          type: 'filter',
          config: {
            and: [
              // { dimension: 'Year', gte: 1950 },
              { dimension: 'contractReferenceNumber', '=': 'AMER00007SRV' },
            ],
          },
        },
      },
    ],
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
    series: [
      {
        type: 'bar',
        smooth: true,
        color: '#0072a3',
        width: 10,
        barWidth: '30%',
        datasetId: 'dataset_since_for_AMER00007SRV',
        showSymbol: false,
        encode: {
          x: 'yearMonth',
          y: 'pointsTotal',
          itemName: 'yearMonth',
          tooltip: ['pointsTotal'],
        },
      },
    ],
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
        },
        (err: HttpErrorResponse) => {
          this.error = err.error;
        },
      );
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
      const myChart = echarts.init(this.usageContainer.nativeElement, null, { renderer: 'svg' });

      myChart.setOption(this.option);
    }, 100);
  }
}
