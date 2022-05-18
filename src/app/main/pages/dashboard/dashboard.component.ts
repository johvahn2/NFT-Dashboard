import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WalletService } from '@core/services/wallet.service';
import { DashboardService } from './dashboard.service';
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexStroke,
  ApexDataLabels,
  ApexXAxis,
  ApexGrid,
  ApexTitleSubtitle,
  ApexTooltip,
  ApexPlotOptions,
  ApexYAxis,
  ApexFill,
  ApexMarkers,
  ApexTheme,
  ApexNonAxisChartSeries,
  ApexLegend,
  ApexResponsive,
  ApexStates
} from 'ng-apexcharts';

import { colors } from 'app/colors.const';

// interface ChartOptions
export interface ChartOptions {
  series?: ApexAxisChartSeries;
  chart?: ApexChart;
  xaxis?: ApexXAxis;
  dataLabels?: ApexDataLabels;
  grid?: ApexGrid;
  stroke?: ApexStroke;
  legend?: ApexLegend;
  title?: ApexTitleSubtitle;
  colors?: string[];
  tooltip?: ApexTooltip;
  plotOptions?: ApexPlotOptions;
  yaxis?: ApexYAxis;
  fill?: ApexFill;
  labels?: string[];
  markers: ApexMarkers;
  theme: ApexTheme;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  @ViewChild('apexLineChartRef') apexLineChartRef: any;

  public apexLineChart: Partial<ChartOptions>;
  public isMenuToggled = false;

  overview = {floor: 0, totalVolume: 0, highSale: 0};
  revenueOverview = {lastDay: 0, lastWeek: 0, lastMonth: 0, lastYear: 0, all: 0};
  recentSales: any[] = [];
  twitterFeed: any[] = [];

  constructor(private modalService: NgbModal, private dashboardService: DashboardService) {
      
    // Apex Line Area Chart
      this.apexLineChart = {
        series: [
          {
            data: [280, 200, 220, 180, 270, 250, 70, 90, 200, 150, 160, 100, 150, 100, 50]
          }
        ],
        chart: {
          height: 400,
          type: 'line',
          zoom: {
            enabled: false
          },
          toolbar: {
            show: false
          }
        },
        grid: {
          xaxis: {
            lines: {
              show: true
            }
          }
        },
        markers: {
          strokeWidth: 7,
          strokeOpacity: 1,
          strokeColors: [colors.solid.white],
          colors: [colors.solid.warning]
        },
        colors: [colors.solid.warning],
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'straight'
        },
        xaxis: {
          categories: [
            '7/12',
            '8/12',
            '9/12',
            '10/12',
            '11/12',
            '12/12',
            '13/12',
            '14/12',
            '15/12',
            '16/12',
            '17/12',
            '18/12',
            '19/12',
            '20/12',
            '21/12'
          ]
        },
        tooltip: {
          custom: function (data) {
            return (
              '<div class="px-1 py-50">' +
              '<span>' +
              data.series[data.seriesIndex][data.dataPointIndex] +
              '%</span>' +
              '</div>'
            );
          }
        }
      };


   }

  ngOnInit(): void {

    WalletService.nfts.subscribe( res => console.log(res));

    // this.getData();


  }


  getData(){
    this.dashboardService.getOverview().subscribe(res => {
      if(res.data){
        this.overview.floor = res.data.floor;
        this.overview.totalVolume = res.data.totalVolume;
        this.overview.highSale = res.data.ceiling;
      }
    });


    this.dashboardService.getRevenueOverview().subscribe(res => {
      if(res.data){
        this.revenueOverview.lastDay = res.data.lastDay;
        this.revenueOverview.lastWeek = res.data.lastWeek;
        this.revenueOverview.lastMonth = res.data.lastMonth;
        this.revenueOverview.lastYear = res.data.lastYear;
        this.revenueOverview.all = res.data.all;
      }
    });

    this.dashboardService.getRecentSales().subscribe(res => {
      if(res.data){
        this.recentSales = res.data;
      }
    });

    this.dashboardService.getTwitterFeed().subscribe(res => {
      if(res.data){
        this.twitterFeed = res.data;
      }
    });
  }

}
