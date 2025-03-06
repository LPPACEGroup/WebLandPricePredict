import { Component, input, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartOptions,Chart } from 'chart.js';
import { CommonModule } from '@angular/common';
import annotationPlugin from 'chartjs-plugin-annotation';

Chart.register(annotationPlugin);  // Register the annotation plugin


@Component({
  selector: 'app-line-chart',
  standalone: true,
  imports: [NgChartsModule,CommonModule],
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css'],
})
export class LineChartComponent implements OnChanges {
  @Input() labels: string[] = [];
  @Input() values: number[] = [];
  @Input() max_y: number = 300000000;
  @Input() max_y_district = [300000000,300000000,300000000,300000000];

  @Input() chartHeight: number = 350; // Default height
  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;
  @Input() data: any;
  @Input() selectedArea: string = 'แสดงเขตทั้งหมด';


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
    scales: {
      y: {
        max: this.max_y,
      },
    },
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
    console.log(this.data);
    console.log(this.labels);
    
    if (changes['max_y']) {
      this.lineChartOptions.scales = {
        y: {
          max: this.max_y,
        },
      };
    }
    
    if (changes['labels']) {
      this.lineChartData.labels = this.labels;
    }
  
    // if (changes['data'] && this.data) {
    //   this.lineChartData.datasets[0].data = this.data[0]; // Default single dataset
    // }
  
    if (changes['selectedArea'] && this.data) {
      
      if (changes['selectedArea'].currentValue === 'แสดงเขตทั้งหมด') {

        this.lineChartOptions.scales = {
          y: {
            max: this.max_y,
          },
        };

        this.lineChartConfig.data = {
          labels: this.labels, // Ensure labels are set
          datasets: [
            {
              label: 'มีนบุรี',
              data: this.data[0] || [],
              borderColor: 'blue',
              backgroundColor: 'transparent',
              fill: false,
              tension: 0.4,
              borderWidth: 1,
              pointRadius: 0,
            },
            {
              label: 'ลาดกระบัง',
              data: this.data[1] || [],
              borderColor: 'orange',
              backgroundColor: 'transparent',
              fill: false,
              tension: 0.4,
              borderWidth: 1,
              pointRadius: 0,
            },
            {
              label: 'คลองเตย',
              data: this.data[2] || [],
              borderColor: 'green',
              backgroundColor: 'transparent',
              fill: false,
              tension: 0.4,
              borderWidth: 1,
              pointRadius: 0,
            },
            {
              label: 'วัฒนา',
              data: this.data[3] || [],
              borderColor: 'brown',
              backgroundColor: 'transparent',
              fill: false,
              tension: 0.4,
              borderWidth: 1,
              pointRadius: 0,
            },
          ],
        };
      } else {

        // Select only one dataset based on the area
        let areaIndex = 0;
        if (changes['selectedArea'].currentValue === 'เขตมีนบุรี') areaIndex = 0;
        else if (changes['selectedArea'].currentValue === 'เขตลาดกระบัง') areaIndex = 1;
        else if (changes['selectedArea'].currentValue === 'เขตวัฒนา') areaIndex = 2;
        else if (changes['selectedArea'].currentValue === 'เขตคลองเตย') areaIndex = 3;

        this.lineChartOptions.scales = {
          y: {
            max: this.max_y_district[areaIndex],
          },
        };
  
        this.lineChartConfig.data = {
          labels: this.labels,
          datasets: [
            {
              label: this.selectedArea,
              data: this.data[areaIndex] || [],
              borderColor: areaIndex === 0 ? 'blue' : areaIndex === 1 ? 'orange' : areaIndex === 2 ? 'green' : 'brown',
              backgroundColor: 'transparent',
              fill: false,
              tension: 0.4,
              borderWidth: 1,
              pointRadius: 0,
            
            },
          ],
        };
      }
    }
  
    // Update the chart
    if (this.chart) {
      this.chart.chart?.update();
    }
  }
  
}