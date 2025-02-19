import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartOptions,Chart } from 'chart.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-line-chart-2',
  standalone: true,
  imports: [NgChartsModule,CommonModule],
  templateUrl: './line-chart-2.component.html',
  styleUrl: './line-chart-2.component.css'
})
export class LineChart2Component implements OnChanges {
  @Input() labels: string[] = [];
  @Input() values: number[] = [];


public lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        label: 'ดัชนี',
        data: [],
        borderColor: 'red',
        backgroundColor: 'transparent',
        fill: false,
        tension: 0.4, 
        borderWidth: 1,
        pointBackgroundColor: 'red',
        pointRadius: 0,

      },
      
    ],
  };

  

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
    },
  };

  public lineChartConfig: ChartConfiguration<'line'> = {
    type: 'line',
    data: this.lineChartData,
    options: this.lineChartOptions,
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['labels'] || changes['values']) {
      this.lineChartConfig.data = {
        labels: this.labels,
        datasets: [
          {
            label: 'ดัชนี',
            data: this.values,
            borderColor: 'red',
            backgroundColor: 'transparent',
            fill: false,
            tension: 0.4, 
            borderWidth: 1,
            pointBackgroundColor: 'red',
            pointRadius: 0,

          }
        ],
      };
    }
  }
  

}
