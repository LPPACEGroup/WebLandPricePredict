import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  apiURL = environment.PD_URL;
  baseUrl = environment.BE_URL;
  ServerAPI = environment.API_URL;
  Land_estimate = environment.LE_URL;

  constructor(private http: HttpClient) {
  }

  getDashboardData(month:number): Observable<any> {
    return this.http.get(`${this.apiURL}/predict/${month}`);
  }
  getPriceAvg(month:number): Observable<any> {
    return this.http.get(`${this.baseUrl}/price_avg_last_n_months/${month}` );
  }

  goodSale(districts:string): Observable<any> {
    return this.http.get(`${this.ServerAPI}/get_goodsale_analytics?districts=${districts}`);
  }

  interestLevel(id:string): Observable<any> {
    return this.http.get(`${this.Land_estimate}/api/land/estimate/${id}`);
  }

  landTax(payload:any): Observable<any> {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    return this.http.post(`${this.ServerAPI}/calculate_land_tax`, payload, { headers });
  }

  getIconName(placeType: string): string {
        
    switch (placeType) {
      case 'university':
        return 'school';
      case 'tourist_attraction':
        return 'attractions';
      case 'station':
        return 'train';
      case 'shopping':
        return 'shopping_bag';
      case 'school':
        return 'school';
      case 'public_transport':
        return 'directions_bus';
      case 'park':
        return 'park';
      case 'other':
        return 'category';
      case 'main_road':
        return 'add_road';
      case 'hospital':
        return 'local_hospital';
      case 'historic_site':
        return 'account_balance';
      case 'commercial':
        return 'storefront';
      default:
        return 'place';
    }
  }
  

}
