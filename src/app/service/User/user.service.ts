import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { AuthService } from '../Auth/auth.service';
import { Observable } from 'rxjs';
import { User } from 'model/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private image_URL = 'http://192.168.1.7:30600';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getUserData(): Observable<any> {    
    
    return this.http.get(`${this.authService.apiURL}/user`, { withCredentials: true });
  }
   
updateUser(user: User): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  
    return this.http.put(`${this.authService.apiURL}/user`, user, {
      headers: headers,
      withCredentials: true
    });
  }
  getProfilePicture(userID: number): Observable<any> {
    // return this.http.get(`${this.image_URL}/get_profile/${userID}`);
    return this.http.get('http://192.168.1.7:30600/get_profile/10')
  }
   
}
