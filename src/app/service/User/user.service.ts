import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { AuthService } from '../Auth/auth.service';
import { Observable } from 'rxjs';
import { User } from 'model/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {

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

   
}
