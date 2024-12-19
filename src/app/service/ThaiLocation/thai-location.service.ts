import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface ThaiLocationInterface {

  district: string;
  amphoe: string;
  province: string;
  zipcode: number;
  district_code: number;
  amphoe_code: number;
  province_code: number;

}

@Injectable({
  providedIn: 'root'
})
export class ThaiLocationService {

  dataUrl = 'assets/data/ThaiLocation.json';
  constructor(private http:HttpClient) { }

  getThaiLocation() {
    return this.http.get<ThaiLocationInterface[]>(this.dataUrl);
  }

  getProvince() {
    return this.http.get<ThaiLocationInterface[]>(this.dataUrl).toPromise().then(data => {
      let province = data?.map(item => item.province);
      return Array.from(new Set(province));
    });
  }

  getAmphoe() {
    return this.http.get<ThaiLocationInterface[]>(this.dataUrl).toPromise().then(data => {
      let province = data?.map(item => item.amphoe);
      return Array.from(new Set(province));
    });
  }
  getdistrict() {
    return this.http.get<ThaiLocationInterface[]>(this.dataUrl).toPromise().then(data => {
      let province = data?.map(item => item.district);
      return Array.from(new Set(province));
    });
  }
  getPostcode() {
    return this.http.get<ThaiLocationInterface[]>(this.dataUrl).toPromise().then(data => {
      let province = data?.map(item => item.zipcode);
      return Array.from(new Set(province));
    });
  }
}
