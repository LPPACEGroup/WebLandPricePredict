import { Component } from '@angular/core';
import { CollapseComponent } from '../../core/collapse/collapse.component';

import { dataSeries } from "./data-series";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CollapseComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  public data1: { date: string, value: number }[] = [];
  public data2: { date: string, value: number }[] = [];

  constructor() {
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

}

// Add this method to the DashboardComponent class
