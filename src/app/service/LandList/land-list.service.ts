import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FollowLand } from 'model/follow.interface';
import { AuthService } from '../Auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LandListService {

  apiURL = 'http://localhost:8000/api';
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

  getLandImage(id: number): Observable<any> {
    return this.http.get(`${this.image_URL}/get_land_images/fe461e28-f839-4575-ad1b-6e149f05ba60`);
  }
}
