import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'; // Import HttpClientModule
import { MapComponent } from '../../core/map/map.component';
import { SearchApiService } from '../../service/search-api.service';

@Component({
  selector: 'app-map-page',
  standalone: true,
  imports: [MapComponent, HttpClientModule], // Include HttpClientModule here
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.css']
})
export class MapPageComponent {
  coordinates: [number, number] | null = null;  constructor(private searchApiService: SearchApiService) {}

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.handleSearch(event);
    }
  }

  handleSearch(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const searchTerm = inputElement.value.trim();
    console.log(searchTerm);
    
    if (searchTerm) {
      this.searchApiService.searchLocation(searchTerm).subscribe(
        (response: any) => {
          console.log('Search results:', response);
          // Check if features array is not empty
          if (response.features && response.features.length > 0) {
            // Extract the first set of coordinates
            const firstCoordinates = response.features[0].geometry.coordinates;
            console.log('First Coordinates:', firstCoordinates);
            // You can use these coordinates to set a map view or perform other operations
            this.coordinates = firstCoordinates;

          } else {
            console.log('No features found.');
          }
        
        },
        (error: any) => {
          console.error('Error fetching search results:', error);
        }
      );
    }
  }
}
