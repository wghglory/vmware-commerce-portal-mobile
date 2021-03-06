import { AfterViewInit, Component } from '@angular/core';

import F2 from '@antv/f2';

@Component({
  selector: 'app-me',
  templateUrl: './me.page.html',
  styleUrls: ['./me.page.scss'],
})
export class MePage implements AfterViewInit {
  ngAfterViewInit() {
    const data = [
      { genre: 'Sports', sold: 275 },
      { genre: 'Strategy', sold: 115 },
      { genre: 'Action', sold: 120 },
      { genre: 'Shooter', sold: 350 },
      { genre: 'Other', sold: 150 },
    ];

    setTimeout(() => {
      // Step 1: create Chart instance
      const chart = new F2.Chart({
        id: 'myChart',
        pixelRatio: window.devicePixelRatio,
      });

      // Step 2: Load data
      chart.source(data);

      // Step 3：create chart with genre for xAxis and sold for yAxis
      chart.interval().position('genre*sold').color('genre');

      console.log(chart);

      // Step 4: render
      chart.render();
    }, 500);
  }
}
