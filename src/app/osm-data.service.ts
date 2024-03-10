import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OSMDataService {

  constructor(private http: HttpClient) { }

  getOSMData(latitude: number, longitude: number, radius: number) {
    const overpassURL = "http://overpass-api.de/api/interpreter";
    const overpassQuery = `[out:json];
    (
      node(around:${radius},${latitude},${longitude});
      way(around:${radius},${latitude},${longitude});
      relation(around:${radius},${latitude},${longitude});
    );
    out;`;

    return this.http.get<any>(overpassURL, { params: { data: overpassQuery } });
  }
}
// ถ้าจะใช้ได้ต้อง import http client ใน app.config.ts ด้วย