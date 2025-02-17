import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  apiURL = 'http://192.168.1.7:30070"';
  baseUrl = 'http://localhost:8000/api';
  constructor(private http: HttpClient) {
  }

  getDashboardData(month:number): Observable<any> {
    return this.http.get(`http://192.168.1.7:30070/predict/${month}`);
  }
  getPriceAvg(month:number): Observable<any> {
    return this.http.get(`${this.baseUrl}/price_avg_last_n_months/${month}` );
  }
}
