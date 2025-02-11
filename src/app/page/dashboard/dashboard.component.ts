import { Component } from '@angular/core';
import { CollapseComponent } from '../../core/collapse/collapse.component';
import { dataSeries } from "./data-series";
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { PinnedPropertyExpandComponent } from "../../core/pinned-property-expand/pinned-property-expand.component";
import { DashboardFollowComponent } from 'app/core/dashboard-follow/dashboard-follow.component';
import { LandListService } from 'app/service/LandList/land-list.service';
import { CommonModule } from '@angular/common';
<<<<<<< HEAD
import { ChartComponent, ApexAxisChartSeries, ApexChart, ApexXAxis, ApexStroke, ApexGrid } from 'ng-apexcharts';
import { appConfig } from 'app/app.config';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  colors: string[];
  grid: ApexGrid;
};

=======
import { DashboardService } from 'app/service/Dashboard/dashboard.service';
>>>>>>> 5e414c2c8184ab4ccc59207c74473886c7959577
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [  DashboardFollowComponent,CommonModule,ChartComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})



export class DashboardComponent {

  public data1: { date: string, value: number }[] = [];
  public data2: { date: string, value: number }[] = [];
  followedLand = [];

  constructor(   private landListService: LandListService,private dashBoardService: DashboardService,
  ) {
    // ts2 คือเวลา
    let ts2 = 1484418600000;
    let dates = [];
    for (let i = 0; i < 120; i++) {
      ts2 = ts2 + 86400000;
      dates.push({ date: new Date(ts2).toISOString().split('T')[0], value: dataSeries[1][i].value });
    }
    this.data1 = dates;
    this.data2 = dates;

  }

  isDropdownVisible = false;
  toggleDropdown() {

    this.isDropdownVisible = !this.isDropdownVisible;

  }

  ngOnInit() {
    this.landListService.readFollowLand().subscribe((data) => {
      this.followedLand = data;
      // console.log(this.followedLand);

    });
    this.dashBoardService.getDashboardData(4).subscribe({
      next: (response) => {
        console.log(response);
      },
      error: (error: any) => {
        console.error('Error:', error);
      }
    });
  }

  onFollowChanged() {
    this.landListService.readFollowLand().subscribe(response => {

      this.followedLand = response;

    });  }

}
export class SelectMultipleExample {
  toppings = new FormControl('');
  toppingList: string[] = ['แสดงเขตทั้งหมด', 'เขตลาดกระบัง', 'เขตมีนบุรี', 'เขตคลองเตย', 'เขตวัฒนา',];
}
// Add this method to the DashboardComponent class

export class DashboardGraphComponent {
  public chartOptions: Partial<ChartOptions>;

  constructor() {
    this.chartOptions = {
      series: [
        {
          name: "Desktops",
          data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
        }
      ],
      chart: {
        height: 350,
        type: "line"
      },
      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep"]
      },
      stroke: {
        curve: "smooth"
      },
      colors: ["#FF1654", "#247BA0"],
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"],
          opacity: 0.5
        }
      }
    };
  }
}
