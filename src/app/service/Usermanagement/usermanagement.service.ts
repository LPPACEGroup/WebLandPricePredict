import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UsermanagementService {

  apiURL = 'http://localhost:8000/api';
  constructor(private http: HttpClient) {

   }

   getuserList(): Observable<any> {
    return this.http.get(`${this.apiURL}/user-management`, { withCredentials: true });
   }
   getUserPayment(userID: number): Observable<any> {
    return this.http.get(`${this.apiURL}/user-management/${userID}`, { withCredentials: true });
   }
   adminEditUser(userID: number,UserUpdate:any):Observable<any>{

    return this.http.put(`${this.apiURL}/user-management/${userID}`,UserUpdate,{withCredentials:true})
   }

    deleteUser(userID: number): Observable<any> {
      return this.http.delete(`${this.apiURL}/user-management/${userID}`, { withCredentials: true });
    }
    updateTier(userID: number, tier: any): Observable<any> {
      return this.http.put(`${this.apiURL}/user-management/${userID}/tier`, tier, { withCredentials: true });
    }
    updateverify(userID: number, verification: any): Observable<any> {
      return this.http.put(`${this.apiURL}/user-management/${userID}/verification`, verification, { withCredentials: true });
    }
}
