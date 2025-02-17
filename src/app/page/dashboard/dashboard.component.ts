import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { CollapseComponent } from '../../core/collapse/collapse.component';
import { dataSeries } from './data-series';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { PinnedPropertyExpandComponent } from '../../core/pinned-property-expand/pinned-property-expand.component';
import { DashboardFollowComponent } from 'app/core/dashboard-follow/dashboard-follow.component';
import { LandListService } from 'app/service/LandList/land-list.service';
import { CommonModule } from '@angular/common';
import { appConfig } from 'app/app.config';

import { DashboardService } from 'app/service/Dashboard/dashboard.service';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartOptions } from 'chart.js';
import { LineChartComponent } from '../../core/line-chart/line-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    DashboardFollowComponent,
    CommonModule,
    NgChartsModule,
    LineChartComponent,
    FormsModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnChanges {
  L_Data_PRED: any[] = [];
  M_Data_PRED: any[] = [];
  K_Data_PRED: any[] = [];
  W_Data_PRED: any[] = [];
  L_Data_AVG: any[] = [];
  M_Data_AVG: any[] = [];
  K_Data_AVG: any[] = [];
  W_Data_AVG: any[] = [];
  labels: any[] = [];
  selected_Data: any[] = [];
  selectedArea = 'แสดงเขตทั้งหมด';
  loading = true;
  last_month_avg : any;

  followedLand = [];

  constructor(
    private landListService: LandListService,
    private dashBoardService: DashboardService
  ) {}

  isDropdownVisible = false;
  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  ngOnInit() {
    this.landListService.readFollowLand().subscribe((data) => {
      this.followedLand = data;
      // console.log(this.followedLand);
    });
    // this.dashBoardService.getDashboardData(12).subscribe({
    //   next: (response) => {
    //     this.L_Data = response.predictions.values.map(
    //       (value: any) => value['price_avg_Lat Krabang']
    //     );
    //     this.M_Data = response.predictions.values.map(
    //       (value: any) => value['price_avg_Min Buri']
    //     );
    //     this.K_Data = response.predictions.values.map(
    //       (value: any) => value['price_avg_Khlong Toei']
    //     );
    //     this.W_Data = response.predictions.values.map(
    //       (value: any) => value['price_avg_Watthana']
    //     );

    //     this.labels = response.predictions.dates.map((date: any) =>
    //       new Date(date).toLocaleString('en-US', { month: 'short' })
    //     );

    //     console.log(this.selectedArea);

    //     this.loading = false;
    //   },
    //   error: (error: any) => {
    //     console.error('Error:', error);
    //     this.loading = false;
    //   },
    // });
    // เป็น 0 เพราะดึงข้อมูลเดือนล่าสุดที่มีใน database เพราะเราไม่มีข้อมูลเดือนก่อน
    this.dashBoardService.getPriceAvg(0).subscribe({
      next: (response) => {
        this.last_month_avg = response;
        this.loading = false;
        console.log(this.last_month_avg[0]['data'][0]['price_avg']);
        
      },
      error: (error) => {
        console.error('Error:', error);
        this.loading = false;
      },
    });
  }

  onFollowChanged() {
    this.landListService.readFollowLand().subscribe((response) => {
      this.followedLand = response;
    });
  }

  getSelectedArea() {
    console.log(this.selectedArea); // Logs the selected value
  }
  onAreaChange(selectedArea: string): void {
    console.log(selectedArea);
  
    if (selectedArea === 'แสดงเขตทั้งหมด') {
      this.selected_Data = this.L_Data_PRED;
    } else if (selectedArea === 'เขตลาดกระบัง') {
      this.selected_Data = this.L_Data_PRED;
    } else if (selectedArea === 'เขตมีนบุรี') {
      this.selected_Data = this.M_Data_PRED;
    } else if (selectedArea === 'เขตคลองเตย') {
      this.selected_Data = this.K_Data_PRED;
    } else if (selectedArea === 'เขตวัฒนา') {
      this.selected_Data = this.W_Data_PRED;
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.selectedArea);

    if (changes['selectedArea']) {
      console.log(this.selectedArea);

      if (this.selectedArea === 'แสดงเขตทั้งหมด') {
        this.selected_Data = this.L_Data_PRED;
      } else if (this.selectedArea === 'เขตลาดกระบัง') {
        this.selected_Data = this.L_Data_PRED;
      } else if (this.selectedArea === 'เขตมีนบุรี') {
        this.selected_Data = this.M_Data_PRED;
      } else if (this.selectedArea === 'เขตคลองเตย') {
        this.selected_Data = this.K_Data_PRED;
      } else if (this.selectedArea === 'เขตวัฒนา') {
        this.selected_Data = this.W_Data_PRED;
      }
    }
  }
}
export class SelectMultipleExample {
  toppings = new FormControl('');
  toppingList: string[] = [
    'แสดงเขตทั้งหมด',
    'เขตลาดกระบัง',
    'เขตมีนบุรี',
    'เขตคลองเตย',
    'เขตวัฒนา',
  ];
}
// Add this method to the DashboardComponent class

export class DashboardGraphComponent {
  constructor() {}
}
