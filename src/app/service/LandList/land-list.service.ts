import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FollowLand } from 'model/follow.interface';

@Injectable({
  providedIn: 'root'
})
export class LandListService {

  apiURL = 'http://localhost:8000/api';
  constructor(private http:HttpClient) { }

  getData(): Observable<any> {
    return this.http.get(`${this.apiURL}/land`, { withCredentials: true });
  }
  followLand(fr : FollowLand): Observable<any> {
    console.log(fr);
    
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        });
    return this.http.post(`${this.apiURL}/follow-land`,fr, { withCredentials: true,headers: headers });
  }
  readFollowLand(): Observable<any> {
    return this.http.get(`${this.apiURL}/follow-land`, { withCredentials: true });
  }
}
