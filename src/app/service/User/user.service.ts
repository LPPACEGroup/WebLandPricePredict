import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { AuthService } from '../Auth/auth.service';
import { Observable } from 'rxjs';
import { User } from 'model/user.interface';
import {SunmitPayment} from 'model/payment.interface';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private image_URL = 'http://192.168.1.7:30600';

  constructor(private http: HttpClient, private authService: AuthService) { }

  getUserData(): Observable<any> {    
    
    return this.http.get(`${this.authService.apiURL}/user`, { withCredentials: true });
  }
   
updateUser(user: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    });
  
    return this.http.put(`${this.authService.apiURL}/user`, user, {
      headers: headers,
      withCredentials: true
    });
  }
  getProfilePicture(userID: number): Observable<Blob> {
    return this.http.get(`http://192.168.1.7:30600/get_profile/${userID}`, {
      responseType: 'blob'
    });
  }
  uploadPaymentProof(submit_payment:SunmitPayment,file: File): Observable<any> {

    
    const url = `${this.image_URL}/submit_payment`;
    const formData = new FormData();
    formData.append('slip_image', file);
    formData.append('UserID', submit_payment.UserID);
    formData.append('BuyTier', submit_payment.BuyTier);
    formData.append('AccName', submit_payment.AccName);
    formData.append('Telephone', submit_payment.Telephone);
    formData.append('PaidPrice', submit_payment.PaidPrice);
    formData.append('Detail', submit_payment.Detail);
    
    
    return this.http.post<any>(url, formData);

  }

  getUserId(): Observable<any> {
    return this.http.get(`${this.authService.apiURL}/userID`, { withCredentials: true });
  }

  checkVerifyPayment(): Observable<any> {
    return this.http.get(`${this.authService.apiURL}/check-verify-payment`, { withCredentials: true });
  }

   
}
