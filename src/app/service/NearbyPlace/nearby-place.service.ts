import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// Define the interfaces here
interface Tag {
  [key: string]: string; // To accommodate various tag key-value pairs
}

export interface Element {
  type: string; // "node", "way", or "relation"
  id: number; // Unique identifier
  lat?: number; // Latitude, present for nodes
  lon?: number; // Longitude, present for nodes
  tags?: Tag; // Tags associated with the element
}

interface OverpassResponse {
  elements: Element[]; // Array of elements returned by the API
}

@Injectable({
  providedIn: 'root'
})
export class NearbyPlacesService {

  private baseUrl: string = 'http://overpass-api.de/api/interpreter';

  constructor(private http: HttpClient) { }

  getRestaurants(latitude: number, longitude: number, radius: number = 5000): Observable<Element[]> {
    const query = `
    [out:json];
    (
      // Places
      node["place"~"city|town|village|hamlet"](around:${radius},${latitude},${longitude});
      way["place"~"city|town|village|hamlet"](around:${radius},${latitude},${longitude});
      relation["place"~"city|town|village|hamlet"](around:${radius},${latitude},${longitude});
    
      // Aerialway and Aeroway
      node["aerialway"="station"](around:${radius},${latitude},${longitude});
      way["aerialway"="station"](around:${radius},${latitude},${longitude});
      relation["aerialway"="station"](around:${radius},${latitude},${longitude});
      node["aeroway"="aerodrome"](around:${radius},${latitude},${longitude});
      way["aeroway"="aerodrome"](around:${radius},${latitude},${longitude});
      relation["aeroway"="aerodrome"](around:${radius},${latitude},${longitude});
    
      // Public Transport
      node["public_transport"~"stop_position|platform|station|stop_area"](around:${radius},${latitude},${longitude});
      way["public_transport"~"stop_position|platform|station|stop_area"](around:${radius},${latitude},${longitude});
      relation["public_transport"~"stop_position|platform|station|stop_area"](around:${radius},${latitude},${longitude});
    
      // Amenities
      node["amenity"~"fast_food|cafe|food_court|restaurant|college|kindergarten|library|school|research_institute|music_school|university|bus_station|car_wash|charging_station|fuel|parking|bank|clinic|dentist|hospital|pharmacy|cinema|fire_station|police|nightclub|post_office|prison|marketplace|planetarium|theatre|monastery"](around:${radius},${latitude},${longitude});
      way["amenity"~"fast_food|cafe|food_court|restaurant|college|kindergarten|library|school|research_institute|music_school|university|bus_station|car_wash|charging_station|fuel|parking|bank|clinic|dentist|hospital|pharmacy|cinema|fire_station|police|nightclub|post_office|prison|marketplace|planetarium|theatre|monastery"](around:${radius},${latitude},${longitude});
      relation["amenity"~"fast_food|cafe|food_court|restaurant|college|kindergarten|library|school|research_institute|music_school|university|bus_station|car_wash|charging_station|fuel|parking|bank|clinic|dentist|hospital|pharmacy|cinema|fire_station|police|nightclub|post_office|prison|marketplace|planetarium|theatre|monastery"](around:${radius},${latitude},${longitude});
    
      // Buildings
      node["building"~"dormitory|commercial|industrial|kiosk|office|supermarket|retail|religious|chapel|church|monastery|mosque|presbytery|shrine|synagogue|temple|college|civic|government|hospital|school|transportation|train_station|sports_hall|sports_centre"](around:${radius},${latitude},${longitude});
      way["building"~"dormitory|commercial|industrial|kiosk|office|supermarket|retail|religious|chapel|church|monastery|mosque|presbytery|shrine|synagogue|temple|college|civic|government|hospital|school|transportation|train_station|sports_hall|sports_centre"](around:${radius},${latitude},${longitude});
      relation["building"~"dormitory|commercial|industrial|kiosk|office|supermarket|retail|religious|chapel|church|monastery|mosque|presbytery|shrine|synagogue|temple|college|civic|government|hospital|school|transportation|train_station|sports_hall|sports_centre"](around:${radius},${latitude},${longitude});
    
      // Emergency Services
      node["emergency"="ambulance_station"](around:${radius},${latitude},${longitude});
      way["emergency"="ambulance_station"](around:${radius},${latitude},${longitude});
      relation["emergency"="ambulance_station"](around:${radius},${latitude},${longitude});
    
      // Cycleways
      node["cycleway"="lane"](around:${radius},${latitude},${longitude});
      way["cycleway"="lane"](around:${radius},${latitude},${longitude});
      relation["cycleway"="lane"](around:${radius},${latitude},${longitude});
    
      // Land Use
      node["landuse"~"commercial|construction|education|industrial|residential|retail|institutional|religious"](around:${radius},${latitude},${longitude});
      way["landuse"~"commercial|construction|education|industrial|residential|retail|institutional|religious"](around:${radius},${latitude},${longitude});
      relation["landuse"~"commercial|construction|education|industrial|residential|retail|institutional|religious"](around:${radius},${latitude},${longitude});
    
      // Leisure Activities
      node["leisure"~"swimming_pool|disc_golf_course|dog_park|fishing|fitness_centre|fitness_station|park|playground|pitch|sports_centre|stadium|swimming_area|swimming_pool|track|water_park"](around:${radius},${latitude},${longitude});
      way["leisure"~"swimming_pool|disc_golf_course|dog_park|fishing|fitness_centre|fitness_station|park|playground|pitch|sports_centre|stadium|swimming_area|swimming_pool|track|water_park"](around:${radius},${latitude},${longitude});
      relation["leisure"~"swimming_pool|disc_golf_course|dog_park|fishing|fitness_centre|fitness_station|park|playground|pitch|sports_centre|stadium|swimming_area|swimming_pool|track|water_park"](around:${radius},${latitude},${longitude});
    
      // Natural Features
      node["natural"~"fell|grassland|water|wetland"](around:${radius},${latitude},${longitude});
      way["natural"~"fell|grassland|water|wetland"](around:${radius},${latitude},${longitude});
      relation["natural"~"fell|grassland|water|wetland"](around:${radius},${latitude},${longitude});
    );
    out center;
    >;
    out skel qt;
    `;
 


    const url = `${this.baseUrl}?data=${encodeURIComponent(query)}`;

    return this.http.get<OverpassResponse>(url).pipe(
      map(response => {
        // Filter to keep only nodes with a name
        return response.elements.filter(element => 
           element.tags 
        );
      })
    );
  }
}
