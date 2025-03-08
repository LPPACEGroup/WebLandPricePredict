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
            { label: 'ราคาเฉลี่ย', data:this.data.averagePrice, backgroundColor: '#86B6CD' },
            { label: 'ราคาขาย', data: this.data.sellPrice, backgroundColor: '#C6E6FF' },
            { label: 'ราคาประเมิน', data: this.data.predictPrice, backgroundColor: '#2749A3' }
          ]
        };
      }
      if (changes['selectedLabels'] && this.data) {
        this.updateChartData();
      }



  }
  updateChartData() {
    // ตั้งค่าเริ่มต้นเพื่อป้องกัน undefined หรือ null
    const labels = this.data?.labels || [];
    const averagePrice = this.data?.averagePrice || [];
    const sellPrice = this.data?.sellPrice || [];
    const predictPrice = this.data?.predictPrice || [];

    const filteredLabels = labels.map((label: string, i: number) =>
      this.selectedLabels[i] !== null ? (this.selectedLabels[i] ? label : null) : null
    );

    const filteredAveragePrice = averagePrice.map((price: number, i: number) =>
      this.selectedLabels[i] !== null ? (this.selectedLabels[i] ? price : null) : null
    );

    const filteredSellPrice = sellPrice.map((price: number, i: number) =>
      this.selectedLabels[i] !== null ? (this.selectedLabels[i] ? price : null) : null
    );

    const filteredpredictPrice = predictPrice.map((price: number, i: number) =>
      this.selectedLabels[i] !== null ? (this.selectedLabels[i] ? price : null) : null
    );

    // อัปเดตกราฟ
    this.barChartData = {
      labels: filteredLabels,
      datasets: [
        { label: 'ราคาเฉลี่ย', data: filteredAveragePrice, backgroundColor: '#86B6CD' },
        { label: 'ราคาขาย', data: filteredSellPrice, backgroundColor: '#C6E6FF' },
        { label: 'ราคาประเมิน', data: filteredpredictPrice, backgroundColor: '#2749A3' }
      ]
    };
  }



}
