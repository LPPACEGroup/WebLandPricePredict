import { Component, input, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [NgChartsModule],
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
})
export class LineChartComponent implements OnChanges {
  @Input() labels: string[] = [];
  @Input() values: number[] = [];
  @Input() chartHeight: number = 350; // Default height
  @Input() color = 'red'; // Default color
  @Input() label = 'ราคา'; // Default label
  @Input() pointColor = 'red'; // Default point color
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      {
        label: 'ราคา',
        data: [],
        borderColor: 'red',
        backgroundColor: 'transparent',
        fill: false,
        tension: 0.4, 
        borderWidth: 1,
        pointBackgroundColor: 'red',
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

  // Detect changes in @Input() and update the chart
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['labels']) {
      this.lineChartData.labels = this.labels;
    }
    if (changes['values']) {
      this.lineChartData.datasets[0].data = this.values;
    }
    if (changes['color']) {
      this.lineChartData.datasets[0].borderColor = this.color;
    }
   if (changes['label']) {
      this.lineChartData.datasets[0].label = this.label;
   }
    if (changes['pointColor']) {
        this.lineChartData.datasets[0].pointBackgroundColor = this.pointColor;
    }
    
    if(this.chart) {
      this.chart.chart?.update();
    }
    
  }
}
