import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MapComponent } from '../../core/map/map.component';
import { SearchApiService } from '../../service/search-api.service';
import { CommonModule } from '@angular/common';
import { LandCardComponent } from '../../core/land-card/land-card.component';

interface LocationResult {
  place_id: number;
  name: string;
  display_name: string;
  lat: string;
  lon: string;
}

@Component({
  selector: 'app-map-page',
  standalone: true,
  imports: [MapComponent, HttpClientModule, CommonModule, LandCardComponent],
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.css']
})
export class MapPageComponent {
  coordinates: [number, number] | null = null;
  loading = false;
  isInputFocused: boolean = false;
  results: LocationResult[] = [];
  
  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild('searchResults') searchResults!: ElementRef;

  constructor(private searchApiService: SearchApiService) {}

  @HostListener('document:click', ['$event'])
  onGlobalClick(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;

    // Check if the click is outside the search input and results container
    if (!this.searchInput.nativeElement.contains(targetElement) && 
        !this.searchResults.nativeElement.contains(targetElement)) {
      this.isInputFocused = false;
    }
  }

  onFocus() {
    this.isInputFocused = true;
    console.log('focus');
  }

  onBlur() {
    // Use timeout to ensure the blur event doesn't interfere with click event
    setTimeout(() => this.isInputFocused = false, 200);
    console.log('blur');
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      // Handle enter key if needed
    }
  }

  onInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const value = inputElement.value;
    console.log('Input changed:', value);
    this.handleSearch(value);
  }

  createRange(number: number) {
    return new Array(number).fill(0).map((n, index) => index + 1);
  }

  changeCoord(lat: string, lon: string) {
    this.coordinates = [parseFloat(lon), parseFloat(lat)];
    console.log(this.coordinates);
  }

  handleSearch(inputValue: string) {
    if (inputValue && inputValue.length > 0) {
      this.searchApiService.searchLocation(inputValue).subscribe(
        (response: LocationResult[]) => {
          console.log('Search results:', response);
          this.results = response || [];
          this.loading = false;
        },
        (error: any) => {
          console.error('Error fetching search results:', error);
          this.loading = false;
        }
      );
    } else {
      this.results = [];
    }
  }
}
