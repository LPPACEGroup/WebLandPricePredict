import { Component, ElementRef, HostListener, ViewChild, OnInit } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MapComponent } from '../../core/map/map.component';
import { SearchApiService } from '../../service/SearchLand/search-api.service';
import { CommonModule } from '@angular/common';
import { LandCardComponent } from '../../core/land-card/land-card.component';
import { LandListService } from '../../service/LandList/land-list.service';
import { NearbyPlacesService } from 'app/service/NearbyPlace/nearby-place.service'; // Ensure the import is correct
import { Element } from 'app/service/NearbyPlace/nearby-place.service'; // Ensure the import is correct
import { GetRouteService } from 'app/service/GetRoute/get-route.service';
import { MarkersortService } from 'app/service/MarkerSort/markersort.service'; // Ensure the import is correct
import {MatIconModule} from '@angular/material/icon';
import {MatSliderModule} from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

interface LocationResult {
  place_id: number;
  name: string;
  display_name: string;
  lat: string;
  lon: string;
}
export class PriceSlider{
  minPrice= 0;
  maxPrice= 100000000;
  leftPrice= this.minPrice;
  rightPrice= this.maxPrice;
}
export class AreaSlider{
  minArea= 0;
  maxArea= 99999 ;
  leftArea= this.minArea;
  rightArea= this.maxArea;
}

@Component({
  selector: 'app-map-page',
  standalone: true,
  imports: [MapComponent, HttpClientModule, CommonModule, LandCardComponent, MatIconModule,MatSliderModule,FormsModule,MatInputModule,MatFormFieldModule],
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.css']
})


export class MapPageComponent implements OnInit {
  
  coordinates: [number, number] | null = null;
  loading = false;
  isInputFocused: boolean = false;
  results: LocationResult[] = [];
  selectedLand: any;
  nearbyPlaces: Element[] = []; // Change to Element[] type
  selectedMapLayer: string = 'osm';
  activeMarker: any[] = [];
  markerCoord: any[] = [];
  landList: any[] = [];
  sortedLandList: any[] = [];
  filteredLandList: any[] = [];
  matches: any[] = [];
  istoggleLandBar: boolean = false;
  fastsellState = false;
  searchValue: string = '';

  Priceslider = new PriceSlider();
  Areaslider = new AreaSlider();

  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild('searchResults') searchResults!: ElementRef;

  constructor(
    private searchApiService: SearchApiService,
    private landListService: LandListService,
    private nearbyPlacesService: NearbyPlacesService, // Correct casing
    private getRouteService : GetRouteService,
    private markerSortService: MarkersortService // Add the service to the constructor
  ) {}


  @HostListener('document:click', ['$event'])
  onGlobalClick(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;

    // Check if the click is outside the search input and results container
    if (!this.searchInput.nativeElement.contains(targetElement) &&
        !this.searchResults.nativeElement.contains(targetElement)) {
      this.isInputFocused = false;
    }
  }


  ngOnInit(): void {
    this.landListService.getData().subscribe(response => {
      console.log(response);
      
      this.landList = response;
      this.filteredLandList = this.landList;
      this.sortedLandList = this.landList;
    });
    
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
  onCardClick(event: MouseEvent) {
    const modal =document.getElementById('fullland_detail') as HTMLDialogElement;  
    const target = event.target as HTMLElement;

    if(!target.closest('.followbutton') ) {
      modal.showModal();
    }
 

  }
  toggleLandBar(){
    this.istoggleLandBar = !this.istoggleLandBar;
    
  }
  onFastSellClick(event: Event){
    const toggleSwitch = event.target as HTMLInputElement;
    const modal =document.getElementById('fastsell_Confirm') as HTMLDialogElement;  
    toggleSwitch.checked = !toggleSwitch.checked;  
    if (!toggleSwitch.checked){
      modal.showModal();

    }
    else{
      toggleSwitch.checked = false;
      this.fastsellState = false;
    }
    
  }
  

  confirmFastSell(){
    this.fastsellState = true;
    
  }

  

  onInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.searchValue = inputElement.value;
    this.handleSearch(this.searchValue);
    
  }

  createRange(number: number) {
    return new Array(number).fill(0).map((n, index) => index + 1);
  }

  changeCoord(lat: string, lon: string) {
    this.coordinates = [parseFloat(lon), parseFloat(lat)];
    console.log(this.coordinates);
  }

  handleSearch(inputValue: string) {

    // รวม location กับ description ของแต่ละที่ดินเข้าด้วยกันแล้ว ค้นหาด้วย inputValue
    if (inputValue && inputValue.length > 0) {
      this.matches  = [];
      this.matches= this.landList.filter((land) => { 
        const combinedText = `${land.location} ${land.description}`;
        // if(combinedText.includes(inputValue)) {
        //   this.matches.push(land);
        // }
        return combinedText.includes(inputValue)
      });
    }
    else {
      this.matches = this.landList;
    }



    const inrange = this.matches.filter(land =>{
      const x =land.price >= this.Priceslider.leftPrice && land.price <= this.Priceslider.rightPrice && land.size >= this.Areaslider.leftArea && land.size <= this.Areaslider.rightArea;
      return x
    })

    this.filteredLandList = this.matches &&inrange;
    
    this.sortedLandList = this.markerSortService.sortByProximity(this.filteredLandList, this.markerCoord);

    console.log('nigga');
    
  }
  onMapOptionChange(option: string): void {
    this.selectedMapLayer = option;
  }
  markerCoordUpdate(coord: any): void {
    this.markerCoord = coord;
    // console.log(this.markerCoord);
    // console.log(this.landList);
    this.sortedLandList = this.markerSortService.sortByProximity(this.filteredLandList, this.markerCoord);
    
    
  }
  leftPriceChange(event: any){
    const inputElement = event.target as HTMLInputElement;
    const value = parseInt(inputElement.value)*1000000;
    if (value<this.Priceslider.minPrice){
      this.Priceslider.leftPrice = this.Priceslider.minPrice;
    }
    else if (value>this.Priceslider.rightPrice){
      this.Priceslider.leftPrice = this.Priceslider.rightPrice;
    }
    else{
      this.Priceslider.leftPrice = value;
    }
    this.handleSearch(this.searchValue);
  }
  rightPriceChange(event: any){
    const inputElement = event.target as HTMLInputElement;
    const value = parseInt(inputElement.value)*1000000;
    if (value>this.Priceslider.maxPrice){
      this.Priceslider.rightPrice = this.Priceslider.maxPrice;
    }
    else if (value<this.Priceslider.leftPrice){
      this.Priceslider.rightPrice = this.Priceslider.leftPrice;
    }
    else{
      this.Priceslider.rightPrice = value;
    }
    this.handleSearch(this.searchValue);
    
  }

  leftAreaChange(event: any){
    const inputElement = event.target as HTMLInputElement;
    const value = parseInt(inputElement.value);
    if (value<this.Areaslider.minArea){
      this.Areaslider.leftArea = this.Areaslider.minArea;
    }
    else if (value>this.Areaslider.rightArea){
      this.Areaslider.leftArea = this.Areaslider.rightArea;
    }
    else{
      this.Areaslider.leftArea = value;
    }
        this.handleSearch(this.searchValue);

  }
  rightAreaChange(event: any){
    const inputElement = event.target as HTMLInputElement;
    const value = parseInt(inputElement.value);
    if (value>this.Areaslider.maxArea){
      this.Areaslider.rightArea = this.Areaslider.maxArea;
    }
    else if (value<this.Areaslider.leftArea){
      this.Areaslider.rightArea = this.Areaslider.leftArea;
    }
    else{
      this.Areaslider.rightArea = value;
    }
    this.handleSearch(this.searchValue);
    
  }



  validateNumberInput(event: KeyboardEvent): void {
    const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab']; // Allow navigation keys
    const inputChar = event.key;
  
    // Allow digits, one dot, and minus sign only at the start
    const currentValue = (event.target as HTMLInputElement).value;
    if (
      !allowedKeys.includes(inputChar) &&
      !(/^\d$/.test(inputChar) || 
        (inputChar === '.' && !currentValue.includes('.')) || 
        (inputChar === '-' && currentValue === ''))
    ) {
      event.preventDefault(); // Block disallowed keys
    }
  }
  
  
}
