import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuggestionService {
  apiURL = 'http://localhost:8000/api';
  constructor(private http: HttpClient) {

   }

   sendSuggestion(suggestion: string): Observable<any> {
    if (!suggestion) {
      console.error('Suggestion is empty or null');
      return throwError(() => new Error('Suggestion cannot be empty'));
    }
  
    console.log('Sending suggestion:', suggestion);
  
    return this.http.post(
      `${this.apiURL}/suggestion`,
      { suggestion },
      { withCredentials: true }
    );
  }
  
}
