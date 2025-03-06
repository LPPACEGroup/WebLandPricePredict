import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'model/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // ต้องเปลี่ยนเป็น ชื่อ service backend ที่เราตั้งไว้
  apiURL = 'http://192.168.1.7:30080/api';
  private image_URL = 'http://192.168.1.7:30600';

  private signedIn = new BehaviorSubject<boolean>(false);
  isSignedIn$ = this.signedIn.asObservable();
  private role = new BehaviorSubject<string>('');
  role$ = this.role.asObservable();

  constructor(private http: HttpClient) {
    this.checkSignInStatus(); // Automatically check sign-in status when the service is initialized
    this.checkUserRole();
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

  checkUnauthorizedDuplicateEmail(email: string): Observable<any> {
    return this.http.get(`${this.apiURL}/check-email/${email}`)
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
  checkRole(): Observable<any> {
    return this.http.get(`${this.apiURL}/auth/check-role`, { withCredentials: true });
  }
  private checkUserRole(): void {
    this.checkRole().subscribe({
      
      next: (role) => {this.role.next(role['role'])
      }
    });
  }
  updateUserRole(role: string): void {
    this.role.next(role);
  }

  forgetPassword(email: string): Observable<any> {
    return this.http.post(`${this.apiURL}/auth/forget-password`, {email}, { withCredentials: true });
  }
  
  resetPassword(token:string,new_password: string): Observable<any> {
    return this.http.post(`${this.apiURL}/auth/reset-password`, {token,new_password}, { withCredentials: true });
  }

  uploadProfile(userID: number, file: File): Observable<any> {
    
    const url = `${this.image_URL}/upload_profile`;
    const formData = new FormData();
    formData.append('UserID', userID.toString());
    formData.append('profile_image', file);
    
    
    return this.http.post<any>(url, formData);
  }

  getTier(): Observable<any> {
    return this.http.get(`${this.apiURL}/auth/tier` ,{ withCredentials: true });
  }


}
