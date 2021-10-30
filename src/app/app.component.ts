import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  ApexAxisChartSeries,
  ApexDataLabels,
  ApexFill,
  ApexMarkers,
  ApexStroke,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexXAxis,
  ApexYAxis,
} from 'ng-apexcharts';
import { of } from 'rxjs';
import { map, tap } from 'rxjs/operators';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: any; //ApexChart;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  title: ApexTitleSubtitle;
  fill: ApexFill;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  grid: any; //ApexGrid;
  colors: any;
  toolbar: any;
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  endpoint =
    'https://icufunctions.azurewebsites.net/api/analyse/tracking/historical?Grouping=minute&SessionId=WOUTER';

  public chart1options: Partial<ChartOptions>;
  public chart2options: Partial<ChartOptions>;
  public chart3options: Partial<ChartOptions>;
  public commonOptions: Partial<ChartOptions> = {
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: 'straight',
    },
    toolbar: {
      tools: {
        selection: false,
      },
    },
    markers: {
      size: 6,
      hover: {
        size: 10,
      },
    },
    tooltip: {
      followCursor: false,
      theme: 'dark',
      x: {
        show: false,
      },
      marker: {
        show: false,
      },
      y: {
        title: {
          formatter: function () {
            return '';
          },
        },
      },
    },
    grid: {
      clipMarkers: false,
    },
    xaxis: {
      type: 'datetime',
    },
  };
  data: Object;
  averageNeutral: { x: any; y: any }[];

  constructor(private httpClient: HttpClient) {
    this.initCharts();
  }
  ngOnInit(): void {
    this.setData();
  }

  public initCharts(): void {
    // data
    const data = of([]).pipe(
      map((list: any[]) =>
        list.map((item) => ({
          x: item.createdOn,
          y: item.averageAnger,
        }))
      )
    );

    this.chart1options = {
      series: [
        {
          name: 'Series 1',
          data: [
            {
              x: '02-10-2017 GMT',
              y: 34,
            },
            {
              x: '02-11-2017 GMT',
              y: 43,
            },
            {
              x: '02-12-2017 GMT',
              y: 31,
            },
            {
              x: '02-13-2017 GMT',
              y: 43,
            },
            {
              x: '02-14-2017 GMT',
              y: 33,
            },
            {
              x: '02-15-2017 GMT',
              y: 52,
            },
          ],
        },
      ],
      xaxis: {
        type: 'datetime',
      },
      chart: {
        id: 'fb',
        group: 'social',
        type: 'line',
        height: 160,
      },
      colors: ['#008FFB'],
      yaxis: {
        tickAmount: 2,
        labels: {
          minWidth: 40,
        },
      },
    };

    this.chart2options = {
      series: [
        {
          name: 'chart2',
          data: this.generateDayWiseTimeSeries(
            new Date('11 Feb 2017').getTime(),
            20,
            {
              min: 10,
              max: 30,
            }
          ),
        },
      ],
      chart: {
        id: 'tw',
        group: 'social',
        type: 'line',
        height: 160,
      },
      colors: ['#546E7A'],
      yaxis: {
        tickAmount: 2,
        labels: {
          minWidth: 40,
        },
      },
    };

    this.chart3options = {
      series: [
        {
          name: 'chart3',
          data: this.generateDayWiseTimeSeries(
            new Date('11 Feb 2017').getTime(),
            20,
            {
              min: 10,
              max: 60,
            }
          ),
        },
      ],
      chart: {
        id: 'yt',
        group: 'social',
        type: 'area',
        height: 160,
      },
      colors: ['#00E396'],
      yaxis: {
        tickAmount: 2,
        labels: {
          minWidth: 40,
        },
      },
    };
  }

  public generateDayWiseTimeSeries(baseval, count, yrange): any[] {
    let i = 0;
    let series = [];
    while (i < count) {
      var x = baseval;
      var y =
        Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

      series.push([x, y]);
      baseval += 86400000;
      i++;
    }
    return series;
  }

  public setData() {
    const result = this.httpClient
      .get(this.endpoint)
      .pipe(
        tap((x) => console.log(x)),
        map((list: any[]) =>
          list.map((item) => ({
            x: item.createdOn,
            y: item.averageNeutral,
          }))
        )
      )
      .subscribe((x) => (this.averageNeutral = x));

    console.log(this.averageNeutral);
  }
}
