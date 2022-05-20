import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { WalletService } from '@core/services/wallet.service';
import { DashboardService } from './dashboard.service';
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
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

const units = {
  year  : 24 * 60 * 60  * 365,
  month : 24 * 60 * 60  * 365/12,
  day   : 24 * 60 * 60 ,
  hour  : 60 * 60 ,
  minute: 60 ,
  second: 1
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
  public lamports_per_sol = LAMPORTS_PER_SOL;

  overview = {floor: 0, totalVolume: 0, highSale: 0};
  revenueOverview = {lastDay: 0, lastWeek: 0, lastMonth: 0, lastYear: 0, all: 0};
  recentSales: any[] = [];
  twitterFeed: any[] = [];
  config = null;


  chartPeriod = 30;

  constructor(private modalService: NgbModal, private dashboardService: DashboardService) {
      
    // Apex Line Area Chart
      this.apexLineChart = {
        series: [
          {
            data: []
          }
        ],
        chart: {
          height: 500,
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
          size: 0,
          strokeWidth: 7,
          strokeOpacity: 1,
          strokeColors: [colors.solid.white],
          colors: [colors.solid.warning]
        },
        colors: [colors.solid.primary],
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        xaxis: {
          categories: []
        },
        tooltip: {
          custom: function (data) {
            return (
              '<div class="px-1 py-50">' +
              '<span>' +
              data.series[data.seriesIndex][data.dataPointIndex] +
              ' sol</span>' +
              '</div>'
            );
          }
        }
      };


   }

  ngOnInit(): void {

    // WalletService.nfts.subscribe( res => console.log(res));

    WalletService.Token.subscribe(token => {
      if(!token) return;
      this.getConfig();

    })



  }

  getConfig(){
    this.dashboardService.getConfig().subscribe(res => {
      this.config = res.data;
      this.getData();
      this.chartData();
    })
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

    this.dashboardService.getRecentSales().subscribe(async res => {
      if(res.data){
        if (res.status === 0 && typeof res.data === 'object') {

          const recentSales = await res.data.map(saleInfo => {
            return new Promise((innerRes, innerRej) => {
              this.dashboardService.getDuckInfo(saleInfo.mint).subscribe({next: res => {
                innerRes({
                  ...saleInfo,
                  duckInfo: res.data
                });
              }, error: (err) => innerRej({code: 404})});
            });


          });

          Promise.all(recentSales).then(res => {
            this.recentSales = res;
          });

        } else {
          this.recentSales = [];
        }
      }
    });

    this.dashboardService.getTwitterFeed().subscribe(res => {
      if(res.data){
        this.twitterFeed = res.data.slice(0,6);
      }
    });
  }



  chartData(){
    this.dashboardService.getRevenueOverTime(this.chartPeriod).subscribe(res => {
      let chartData = res.data.community;
      console.log(chartData);

      let labels = [];
      let val = [];

      for (const data of chartData) {

          labels.push(data.label);
          val.push(Math.round(data.val));
      }

      this.apexLineChart.series = [{
        data: val
      }];
      this.apexLineChart.xaxis = {
        categories: labels
      }

      

      console.log(this.apexLineChartRef);

    })
  }

  chartPeriodChg(_event){
    console.log(this.chartPeriod);
    this.chartData();

  }

  //HELPERS
  FormatStringSlice(text: string, end: number){

    let s = text.slice(0,end);

    return s + '...';

  }

  getRelativeTime(d, d2 = Date.now()){
    let d1 = +new Date(d);

    const elapsed = d1 - Math.floor(d2/1000)

    for (let u in units){
        if (Math.abs(elapsed) > units[u] || u === 'second'){
            const num = Math.round(Math.abs(elapsed)/units[u])
            return `${num} ${u}${num > 1 ? 's' : ''} ago`
        }
    }
  }

  numFormatter(num, digits?, one?) {
    const lookup = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "K" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "G" },
        { value: 1e12, symbol: "T" },
        { value: 1e15, symbol: "P" },
        { value: 1e18, symbol: "E" }
    ];
    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
    const item = lookup.slice().reverse().find(function(item) {
        return num >= item.value;
    });
    if(digits === -1){
        if(num < 10) return parseFloat(`${num}`.substring(0,6)).toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 4,
            useGrouping: false
        })
        else if(100 > num && num >= 10) return Number(num).toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 3,
            useGrouping: false
        })
        else if(1000 > num && num >= 100) return Number(num).toLocaleString("en-US", {
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
            useGrouping: false
        })
        else {
            if(num <= 9999) return Number(num).toLocaleString("en-US", {
                minimumFractionDigits: 0,
                maximumFractionDigits: 1,
                useGrouping: false
            })
            return item ? (num / item.value).toFixed(1).replace(rx, "$1") + item.symbol : "0";
        }
    }
    if(num < 1) return parseFloat(`${num}`.substring(0,4)).toFixed(digits)
    else if(num <= 9999 && !one) return Number(num).toFixed(digits)
    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
  }

  convertSol(sol){

    return parseFloat(sol) * parseFloat(this.config?.conversionRates[0].price);

  }

}
