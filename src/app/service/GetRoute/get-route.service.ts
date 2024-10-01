import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GetRouteService {

  private osrmBaseUrl = 'http://router.project-osrm.org'; // OSRM public instance URL

  constructor(private http: HttpClient) { }

  /**
   * Get route distance from OSRM between start and end points
   * @param start [longitude, latitude] of the start point
   * @param end [longitude, latitude] of the end point
   * @param profile vehicle type (driving, walking, cycling)
   * @returns Observable of the distance in meters
   */
  getRouteDistance(start: [number, number], end: [number, number], profile: string = 'driving'): Observable<number> {
    const coordinates = `${start.join(',')};${end.join(',')}`;
    const url = `${this.osrmBaseUrl}/route/v1/${profile}/${coordinates}`;

    const params = new HttpParams()
      .set('overview', 'false')  // Disable geometry if you don't need the full route
      .set('geometries', 'geojson')  // Still can keep it for Leaflet integration if needed
      .set('steps', 'false');  // We don't need the steps for distance calculation

    return this.http.get<any>(url, { params }).pipe(
      map(response => response.routes[0]?.distance || 0), // Get the distance in meters
      catchError(() => of(0)) // Return 0 on error
    );
  }

  /**
   * Get nearby places within a 5 km route distance
   * @param start [longitude, latitude] of the start point
   * @param nearbyPlaces Array of nearby places
   * @returns Observable of nearby places within 5 km
   */
  getNearbyPlacesWithinDistance(start: [number, number], nearbyPlaces: { lat: number, lon: number }[]): Observable<{ lat: number, lon: number }[]> {
    const distanceThreshold = 5000; // 5 km in meters

    // Create an array of Observables for each nearby place's distance
    const distanceObservables = nearbyPlaces.map(place => {
      return this.getRouteDistance(start, [place.lon, place.lat]).pipe(
        map(distance => ({
          ...place,
          distance // Attach the distance to the place object
        }))
      );
    });

    // Combine the Observables and filter based on distance
    return forkJoin(distanceObservables).pipe(
      map(results => results.filter(result => result.distance < distanceThreshold)) // Filter places within 5 km
    );
  }
}
