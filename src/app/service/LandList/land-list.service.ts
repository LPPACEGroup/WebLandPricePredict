import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FollowLand } from 'model/follow.interface';
import { AuthService } from '../Auth/auth.service';



@Injectable({
  providedIn: 'root'
})
export class LandListService {

  apiURL = 'http://192.168.1.7:30080/api';
  private image_URL = 'http://192.168.1.7:30600';

  constructor(private http:HttpClient, private auth :AuthService) { }

  getData(): Observable<any> {
    return this.http.get(`${this.apiURL}/land`, { withCredentials: true });
  }
  followLand(fr : FollowLand): Observable<any> {
    
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        });
    return this.http.post(`${this.apiURL}/follow-land`,fr, { withCredentials: true,headers: headers });
    
  }
  readFollowLand(): Observable<any> {
    return this.http.get(`${this.apiURL}/follow-land`, { withCredentials: true });
  }

  getTotalFollowLand(): Observable<any> {
    return this.http.get(`${this.apiURL}/total-follow`, { withCredentials: true });
  }

  getLandImages(landDataId: string): Observable<any> {
    const url = `${this.image_URL}/get_land_images/${landDataId}`;
    return this.http.get<any>(url);
  }

  // Fetch single land image by image_id
  getLandImage(imageId: string): Observable<Blob> {
    const url = `${this.image_URL}/get_land_image/${imageId}`;
    return this.http.get(url, { responseType: 'blob' });
  }

  getNearbyLandMark(land_id:string): Observable<any> {
    return this.http.get(`${this.apiURL}/nearby-land/${land_id}`, { withCredentials: true });
  }
}
