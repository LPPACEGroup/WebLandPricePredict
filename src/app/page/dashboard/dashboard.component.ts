import { Component, NgModule, OnChanges, OnDestroy, SimpleChanges } from '@angular/core';
import { CollapseComponent } from '../../core/collapse/collapse.component';
import { dataSeries } from './data-series';
import { FormControl, FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
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
import { BarChartComponent } from 'app/core/bar-chart/bar-chart.component';
import { forkJoin, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    DashboardFollowComponent,
    CommonModule,
    NgChartsModule,
    LineChartComponent,
    FormsModule,
    BarChartComponent,FormsModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnChanges,OnDestroy {

  AVG_Data: any;
  PRED_Data: any;
  labels: any[] = [];
  AVG_DATE: any[] = [];
  PRED_DATE: any[] = [];
  selected_Data: any[] = [];
  selectedArea = 'แสดงเขตทั้งหมด';
  loading = true;
  last_month_avg: any;
  pred_table: any;
  followedLand = [];
  
  private destroy$ = new Subject<void>();
  selectedLabels: boolean[] = [];

  comparePrice: {
    averagePrice: number[];
    sellPrice: number[];
    predictPrice: number[];
    labels: string[];
  } = {
    averagePrice: [],
    sellPrice: [],
    predictPrice: [],
    labels: [],

  };
  

  constructor(
    private landListService: LandListService,
    private dashBoardService: DashboardService
  ) {}

  isDropdownVisible = false;
  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  checkedChange() {
    this.selectedLabels = this.selectedLabels.map(label=>label);
      
  }
  ngOnInit(): void {
    this.dashBoardService.getPriceAvg(47).pipe(
      switchMap(response => {
        this.AVG_Data = this.transformData(response);
        this.AVG_DATE = response.map((entry: any) => entry.year_month);

        return forkJoin({
          followedLand: this.landListService.readFollowLand(),
          dashboardData: this.dashBoardService.getDashboardData(4),
          lastMonthAvg: this.dashBoardService.getPriceAvg(0)
        });
      }),
      takeUntil(this.destroy$) // Automatically unsubscribe when component is destroyed
    ).subscribe({
      next: ({ followedLand, dashboardData, lastMonthAvg }) => {
        this.followedLand = followedLand;
        console.log(this.followedLand);

        this.comparePrice.sellPrice = followedLand.map((land: { Price: number }) => land.Price);
        this.comparePrice.predictPrice = followedLand.map((land: { EstimatePrice: number }) => land.EstimatePrice);
        this.comparePrice.labels = followedLand.map((_: any, index: number) => `พื้นที่ ${index + 1}`);
        this.selectedLabels = new Array(this.comparePrice.labels.length).fill(true);


        // Extracting prediction data
        const keys = Object.keys(dashboardData.percentage_changes);
        const last_key = keys[keys.length - 1]; 
        

        this.pred_table = [
          [dashboardData.predictions.values[3]['price_avg_Min Buri'], dashboardData.percentage_changes[last_key]['Min Buri']],
          [dashboardData.predictions.values[3]['price_avg_Lat Krabang'], dashboardData.percentage_changes[last_key]['Lat Krabang']],
          [dashboardData.predictions.values[3]['price_avg_Watthana'], dashboardData.percentage_changes[last_key]['Watthana']],
          [dashboardData.predictions.values[3]['price_avg_Khlong Toei'], dashboardData.percentage_changes[last_key]['Khlong Toei']]
        ];

        const pred = this.transformData2(dashboardData);
        console.log(dashboardData, "pred");
        
        this.PRED_Data = this.AVG_Data.map((arr: number[], index: number) => arr.concat(pred[index]));

        const pred_date = dashboardData.predictions.dates.map((date: string) => date.slice(0, 7));
        this.PRED_DATE = this.AVG_DATE.concat(pred_date);

        // Assign last month average
        this.last_month_avg = lastMonthAvg;
        this.comparePrice.averagePrice = followedLand.map((land: { LocationID: number }) =>
          this.getAveragePricebyLocationId(land.LocationID)
        );

        console.log(this.comparePrice, "sssss");

        this.loading = false;
      },
      error: (error) => {
        console.error('Error:', error);
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getAveragePricebyLocationId(locationId: number) {

    if(locationId === 1){
      return this.last_month_avg[0]['data'][0]['price_avg'];
    }else if(locationId === 2){
      return this.last_month_avg[0]['data'][1]['price_avg'];
    }else if(locationId === 3){
      return this.last_month_avg[0]['data'][2]['price_avg'];
    }else if(locationId === 4){
      return this.last_month_avg[0]['data'][3]['price_avg'];
    }
  }

  transformData(data: MonthlyData[]): number[][] {
    const transformedData: number[][] = [];
  
    data.forEach((entry) => {
      entry.data.forEach((location) => {
        const locationIndex = location.LocationID - 1; // Ensure the index starts from 0
  
        // Initialize the array for that location if it doesn't exist
        if (!transformedData[locationIndex]) {
          transformedData[locationIndex] = [];
        }
  
        // Push the price_avg into the array for that location
        transformedData[locationIndex].push(location.price_avg);
      });
    });
  
    return transformedData;
  }

  transformData2(data: any) {
    const transformedData2: number[][] = [[], [], [], []]; // Array for 4 locations
  
    const priceData = data.predictions.values; // Array of objects
  
    priceData.forEach((entry: any) => {
      transformedData2[0].push(entry['price_avg_Min Buri']);
      transformedData2[1].push(entry['price_avg_Lat Krabang']);
      transformedData2[2].push(entry['price_avg_Watthana']);
      transformedData2[3].push(entry['price_avg_Khlong Toei']);
    });
  
    return transformedData2;
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


  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.selectedArea);

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

interface LocationData {
  LocationID: number;
  price_avg: number;
}

interface MonthlyData {
  year_month: string;
  data: LocationData[];
}
