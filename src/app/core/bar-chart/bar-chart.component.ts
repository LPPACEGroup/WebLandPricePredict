import { Component, Input, input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartOptions, ChartData, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [NgChartsModule],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.css'
})
export class BarChartComponent implements OnChanges {
  @Input() data: any;
  @Input() selectedLabels!: boolean[];


barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Disable aspect ratio

    scales: {
      y: {
        beginAtZero: true
      },
      
      
    },
    plugins: {
      legend: {
        position: 'top'
      }
    }
  };

  barChartLabels = ['พื้นที่ 1', 'พื้นที่ 2', 'พื้นที่ 3', 'พื้นที่ 4', 'พื้นที่ 5','พื้นที่ 1', 'พื้นที่ 2', 'พื้นที่ 3', 'พื้นที่ 4', 'พื้นที่ 5'];
  barChartType: ChartType = 'bar';
  barChartData: ChartData<'bar'> = {
    labels: this.barChartLabels,
    datasets: [
      { label: 'ราคาเฉลี่ย', data: [], backgroundColor: '#86B6CD' },
      { label: 'ราคาขาย', data: [], backgroundColor: '#C6E6FF' },
      { label: 'ราคาประเมิน', data: [], backgroundColor: '#2749A3' }
    ]
  };

  ngOnChanges(changes: SimpleChanges): void {


      if(changes['data'])
      { console.log(this.data, 'data');
        console.log(this.data.predictPrice, 'predictPrice');
        
        this.barChartData =
        {
          labels: this.data.labels,
          datasets: [
            { label: 'ราคาเฉลี่ย', data:this.data.averagePrice, backgroundColor: '#86B6CD' ,maxBarThickness:32},
            { label: 'ราคาขาย', data: this.data.sellPrice, backgroundColor: '#C6E6FF' ,maxBarThickness:32},
            { label: 'ราคาประเมิน', data: this.data.predictPrice, backgroundColor: '#2749A3' ,maxBarThickness:32}
          ]
        };
      }
      if (changes['selectedLabels'] && this.data) {
        this.updateChartData();
      }



  }
  updateChartData() {
    if (!this.data || !this.selectedLabels) return;
  
    const filteredIndexes = this.selectedLabels
      .map((isSelected, index) => isSelected ? index : -1)
      .filter(index => index !== -1);
  
    this.barChartData = {
      labels: filteredIndexes.map(i => this.data.labels[i]), 
      datasets: [
        { 
          label: 'ราคาเฉลี่ย', 
          data: filteredIndexes.map(i => this.data.averagePrice[i] ?? null), 
          backgroundColor: '#86B6CD', 
          maxBarThickness: 32
        },
        { 
          label: 'ราคาขาย', 
          data: filteredIndexes.map(i => this.data.sellPrice[i] ?? null), 
          backgroundColor: '#C6E6FF', 
          maxBarThickness: 32
        },
        { 
          label: 'ราคาประเมิน', 
          data: filteredIndexes.map(i => this.data.predictPrice[i] ?? null), 
          backgroundColor: '#2749A3', 
          maxBarThickness: 32
        }
      ]
    };
  }
  
  



}
