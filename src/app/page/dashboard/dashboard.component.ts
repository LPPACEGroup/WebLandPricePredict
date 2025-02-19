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
import { BarChartComponent } from 'app/core/bar-chart/bar-chart.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    DashboardFollowComponent,
    CommonModule,
    NgChartsModule,
    LineChartComponent,
    FormsModule,
    BarChartComponent
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
      console.log(this.followedLand);
      
      // console.log(this.followedLand);
    });
  


    this.dashBoardService.getPriceAvg(47).subscribe({
      next: (response) => {
        this.AVG_Data = this.transformData(response);
        // console.log(this.AVG_Data);
        this.AVG_DATE = response.map((entry: any) => entry.year_month);
        this.dashBoardService.getDashboardData(4).subscribe({
          next: (response) => {
            console.log(response);
            const pred = this.transformData2(response);
            //try to get key because to access object value 
            const first_key = Object.keys(response.percentage_changes)[0];

            this.pred_table = [[response.predictions.values[0]['price_avg_Min Buri'],response.percentage_changes[first_key]['Min Buri']],
            [response.predictions.values[0]['price_avg_Lat Krabang'],response.percentage_changes[first_key]['Lat Krabang']],
            [response.predictions.values[0]['price_avg_Watthana'],response.percentage_changes[first_key]['Watthana']],
            [response.predictions.values[0]['price_avg_Khlong Toei'],response.percentage_changes[first_key]['Khlong Toei']]];

            
            

            this.PRED_Data = this.AVG_Data.map((arr: number[], index: number) => arr.concat(pred[index]));
            
            const pred_date = response.predictions.dates.map((date: string | any[]) => {
              const yearMonth = date.slice(0, 7); // Extracts 'YYYY-MM' part from 'YYYY-MM-DD'
              return yearMonth;
            });
            this.PRED_DATE= this.AVG_DATE.concat(pred_date);


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

            // this.loading = false;
          },
          error: (error) => {
            console.error('Error:', error);
            this.loading = false;
          },
        });
      },
      error: (error) => {
        console.error('Error:', error);
        this.loading = false;
      },
    });
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

    // if (selectedArea === 'แสดงเขตทั้งหมด') {
    //   this.selected_Data = this.L_Data_PRED;
    // } else if (selectedArea === 'เขตลาดกระบัง') {
    //   this.selected_Data = this.L_Data_PRED;
    // } else if (selectedArea === 'เขตมีนบุรี') {
    //   this.selected_Data = this.M_Data_PRED;
    // } else if (selectedArea === 'เขตคลองเตย') {
    //   this.selected_Data = this.K_Data_PRED;
    // } else if (selectedArea === 'เขตวัฒนา') {
    //   this.selected_Data = this.W_Data_PRED;
    // }
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.selectedArea);

    // if (changes['selectedArea']) {
    //   console.log(this.selectedArea);

    //   if (this.selectedArea === 'แสดงเขตทั้งหมด') {
    //     this.selected_Data = this.L_Data_PRED;
    //   } else if (this.selectedArea === 'เขตลาดกระบัง') {
    //     this.selected_Data = this.L_Data_PRED;
    //   } else if (this.selectedArea === 'เขตมีนบุรี') {
    //     this.selected_Data = this.M_Data_PRED;
    //   } else if (this.selectedArea === 'เขตคลองเตย') {
    //     this.selected_Data = this.K_Data_PRED;
    //   } else if (this.selectedArea === 'เขตวัฒนา') {
    //     this.selected_Data = this.W_Data_PRED;
    //   }
    // }
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
