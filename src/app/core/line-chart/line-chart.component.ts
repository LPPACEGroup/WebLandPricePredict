import { Component, Input, OnChanges, SimpleChanges } from "@angular/core";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexTitleSubtitle,
  ApexDataLabels,
  ApexFill,
  ApexMarkers,
  ApexYAxis,
  ApexXAxis,
  ApexTooltip,
  NgApexchartsModule
} from "ng-apexcharts";

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [NgApexchartsModule],
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnChanges {
  @Input() dataSeries: { date: string, value: number }[] = [];
  @Input() chartHeight: number = 350; // Default height

  public series!: ApexAxisChartSeries;
  public chart!: ApexChart;
  public dataLabels!: ApexDataLabels;
  public markers!: ApexMarkers;
  public title!: ApexTitleSubtitle;
  public fill!: ApexFill;
  public yaxis!: ApexYAxis;
  public xaxis!: ApexXAxis;
  public tooltip!: ApexTooltip;

  constructor() {
    this.initChartData();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataSeries'] || changes['chartHeight']) {
      this.initChartData();
    }
  }

  public initChartData(): void {
    const dates = this.dataSeries.map(item => [new Date(item.date).getTime(), item.value]);

    this.series = [
      {
        name: "XYZ MOTORS",
        data: dates
      }
    ];
    this.chart = {
      type: "area",
      stacked: false,
      height: this.chartHeight,
      zoom: {
        type: "x",
        enabled: true,
        autoScaleYaxis: true
      },
      toolbar: {
        autoSelected: "zoom"
      }
    };
    this.dataLabels = {
      enabled: false
    };
    this.markers = {
      size: 0
    };
    this.title = {
      text: "Stock Price Movement",
      align: "left"
    };
    this.fill = {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        inverseColors: false,
        opacityFrom: 0.5,
        opacityTo: 0,
        stops: [0, 90, 100]
      }
    };
    this.yaxis = {
      labels: {
        formatter: function(val) {
          return (val / 1000000).toFixed(0);
        }
      },
      title: {
        text: "Price"
      }
    };
    this.xaxis = {
      type: "datetime"
    };
    this.tooltip = {
      shared: false,
      y: {
        formatter: function(val) {
          return (val / 1000000).toFixed(0);
        }
      }
    };
  }
}
