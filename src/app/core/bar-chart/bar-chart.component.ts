import { Component } from '@angular/core';
import { ChartOptions, ChartData, ChartType } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [NgChartsModule],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.css'
})
export class BarChartComponent {
barChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Disable aspect ratio

    scales: {
      y: {
        beginAtZero: true
      }
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
      { label: 'ราคาเฉลี่ย', data: [2.5, 2.1, 2.3, 2.8, 3.2,2.5, 2.1, 2.3, 2.8, 3.2], backgroundColor: '#86B6CD' },
      { label: 'ราคาขาย', data: [3.0, 2.4, 2.7, 3.1, 3.5,2.5, 2.1, 2.3, 2.8, 3.2], backgroundColor: '#C6E6FF' },
      { label: 'ราคาประเมิน', data: [2.8, 2.6, 2.5, 3.0, 3.1,2.5, 2.1, 2.3, 2.8, 3.2], backgroundColor: '#2749A3' }
    ]
  };
}
