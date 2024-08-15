import { Injectable } from '@angular/core';
import { HttpClient ,HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchApiService {

  private baseUrl = 'https://nominatim.openstreetmap.org/search';

  constructor(private http: HttpClient) {}

  searchLocation(query: string): Observable<any> {
    
    const params = {
      q: query,
      format: 'jsonv2'
    };
    const headers = new HttpHeaders()
    .set('accept-language', 'th');
    return this.http.get(this.baseUrl, { params ,headers});
  }
}
