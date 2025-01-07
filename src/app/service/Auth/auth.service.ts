import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'model/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  apiURL = 'http://localhost:8000/api';
  private signedIn = new BehaviorSubject<boolean>(false);
  isSignedIn$ = this.signedIn.asObservable();

  constructor(private http: HttpClient) {
    this.checkSignInStatus(); // Automatically check sign-in status when the service is initialized
  }

  signin(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiURL}/auth/sign-in`, { email, password }, { withCredentials: true });
  }

  signout(): Observable<any> {
    return this.http.get(`${this.apiURL}/auth/sign-out`, { withCredentials: true });
  }

  signup(user: User): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  
    return this.http.post(`${this.apiURL}/auth/sign-up`, user, {
      headers: headers,
      withCredentials: true
    });
  }
  getUserData(): Observable<any> {    
    
    return this.http.get(`${this.apiURL}/user`, { withCredentials: true });
  }

  isAuthenticated(): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiURL}/auth/check`, { withCredentials: true });
  }
  checkDuplicateEmail(email: string): Observable<any> {
    return this.http.get(`${this.apiURL}/auth/check-email/${email}`, { withCredentials: true})
  }

  
  private checkSignInStatus(): void {
    this.isAuthenticated().subscribe({
      next: () => this.signedIn.next(true),
      error: () => this.signedIn.next(false),
    });
  }

  updateSignInStatus(status: boolean): void {
    this.signedIn.next(status); // Update BehaviorSubject directly by using in singin and signout flow
  }
}
