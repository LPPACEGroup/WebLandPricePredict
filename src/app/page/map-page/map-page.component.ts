import {
  Component,
  ElementRef,
  HostListener,
  ViewChild,
  OnInit,
  OnDestroy,
} from '@angular/core';
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
import { MatIconModule } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FollowLand } from 'model/follow.interface';
import { AuthService } from 'app/service/Auth/auth.service';
import { AfterViewInit } from '@angular/core';
import { DashboardService } from 'app/service/Dashboard/dashboard.service';
import { LineChart2Component } from 'app/core/line-chart-2/line-chart-2.component';
import { forkJoin, Subject } from 'rxjs';
import { switchMap } from 'rxjs/operators';

interface LocationResult {
  place_id: number;
  name: string;
  display_name: string;
  lat: string;
  lon: string;
}
export class PriceSlider {
  minPrice = 0;
  maxPrice = 100000000;
  leftPrice = this.minPrice;
  rightPrice = this.maxPrice;
}
export class AreaSlider {
  minArea = 0;
  maxArea = 1000;
  leftArea = this.minArea;
  rightArea = this.maxArea;
}

@Component({
  selector: 'app-map-page',
  standalone: true,
  imports: [
    MapComponent,
    HttpClientModule,
    CommonModule,
    LandCardComponent,
    MatIconModule,
    MatSliderModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    LineChart2Component,
    FormsModule,
  ],
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.css'],
})
export class MapPageComponent implements OnInit, OnDestroy {
  coordinates: [number, number] | null = null;
  isInputFocused: boolean = false;
  results: LocationResult[] = [];
  selectedLand: any;
  nearbyPlaces: any;
  selectedMapLayer: string = 'osm';
  activeMarker: any[] = [];
  markerCoord: any[] = [];
  landList: any[] = [];
  sortedLandList: any[] = [];
  filteredLandList: any[] = [];
  matches: any[] = [];
  istoggleLandBar: boolean = false;
  istogglePriceBox: boolean = false;
  searchValue: string = '';
  fowllowState = false;
  tier = '';
  maxdistance = 0;
  Priceslider = new PriceSlider();
  Areaslider = new AreaSlider();
  total_followLand = 0;
  landImage: any;
  image_URL = '';
  currentIndex = 0;
  max = 2;
  date: any;
  value: any;
  loading: boolean = true;
  private destroy$ = new Subject<void>();
  qoq = {
    'Min Buri': 0,
    'Lat Krabang': 0,
    'Khlong Toei': 0,
    Watthana: 0,
  };
  yoy = {
    'Min Buri': 0,
    'Lat Krabang': 0,
    'Khlong Toei': 0,
    Watthana: 0,
  };
  districtSelect = {
    MinBuri: false,
    LatKrabang: false,
    KhlongToei: false,
    Watthana: false,
  };
  @ViewChild('searchInput') searchInput!: ElementRef;
  @ViewChild('searchResults') searchResults!: ElementRef;

  constructor(
    private searchApiService: SearchApiService,
    private landListService: LandListService,
    private nearbyPlacesService: NearbyPlacesService, // Correct casing
    private getRouteService: GetRouteService,
    private markerSortService: MarkersortService, // Add the service to the constructor
    private auth: AuthService,
    private dashBoardService: DashboardService
  ) {}

  @HostListener('document:click', ['$event'])
  onGlobalClick(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;

    // Check if the click is outside the search input and results container
    if (
      !this.searchInput.nativeElement.contains(targetElement) &&
      !this.searchResults.nativeElement.contains(targetElement)
    ) {
      this.isInputFocused = false;
    }
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.loading = false;
      console.log(' stop loading', this.loading);
    }, 3000);

    this.auth.getTier().subscribe((response) => {
      this.tier = response;
      this.maxdistance = this.getMaxDistance(this.tier);
    });

    this.landListService
      .getData()
      .pipe(
        switchMap((landList) => {
          this.landList = landList;
          this.filteredLandList = this.landList;
          this.sortedLandList = this.landList;
          console.log('landList:', landList);
          

          // Fetch data for multiple locations in parallel
          return forkJoin({
            minBuri: this.dashBoardService.goodSale('Min Buri'),
            latKrabang: this.dashBoardService.goodSale('Lat Krabang'),
            khlongToei: this.dashBoardService.goodSale('Khlong Toei'),
            watthana: this.dashBoardService.goodSale('Watthana'),
          });
        })
      )
      .subscribe(({ minBuri, latKrabang, khlongToei, watthana }) => {
        this.processSaleData('Min Buri', minBuri);
        this.processSaleData('Lat Krabang', latKrabang);
        this.processSaleData('Khlong Toei', khlongToei);
        this.processSaleData('Watthana', watthana);
      });
  }

  getMaxDistance(tier: string): number {
    switch (tier) {
      case 'Tier1':
        return 2;
      case 'Tier2':
        return 4;
      case 'Tier3':
        return 8;
      default:
        return 0;
    }
  }

  processSaleData(
    area: 'Min Buri' | 'Lat Krabang' | 'Khlong Toei' | 'Watthana',
    data: any
  ): void {
    this.yoy[area] =
      data.data[area].quarterly_analytics[
        data.data[area].quarterly_analytics.length - 1
      ].yoy;
    this.qoq[area] =
      data.data[area].quarterly_analytics[
        data.data[area].quarterly_analytics.length - 1
      ].qoq;

    if (area === 'Min Buri') {
      this.date = data.data[area].monthly_indices
        .map(
          ({ month, year }: { month: number; year: number }) =>
            `${year}-${month.toString().padStart(2, '0')}`
        )
        .reverse();

      this.value = data.data[area].monthly_indices
        .map(({ index }: { index: number }) => index)
        .reverse();
    }
  }

  images: {
    index: number;
    id: string;
    mimeType: string;
    filePath: string;
    blobUrl?: string;
  }[] = [];

  fetchLandImages(landDataId: string): void {
    this.landListService.getLandImages(landDataId).subscribe(
      (response) => {
        console.log('Total images:', response.total_images);
        this.images = response.images.map(
          (
            img: { image_id: any; mime_type: any; file_path: any },
            index: number
          ) => ({
            index: index, // Start from 1 instead of 0
            id: img.image_id,
            mimeType: img.mime_type,
            filePath: img.file_path,
          })
        );
        this.max = this.images.length;

        // Fetch image blobs
        this.images.forEach((image) => {
          this.landListService.getLandImage(image.id).subscribe((blob) => {
            image.blobUrl = URL.createObjectURL(blob);
          });
        });
      },
      (error) => console.error('Error fetching land images:', error)
    );
  }

  onFollowChanged(event: any) {
    // Check if the user is on the Basic tier

    this.landListService.getData().subscribe((response) => {
      console.log(response);

      this.landList = response;
      this.filteredLandList = this.landList;
      this.sortedLandList = this.landList;
      this.handleSearch(this.searchValue);
    });
  }

  onFocus() {
    this.isInputFocused = true;
    console.log('focus');
  }

  onBlur() {
    // Use timeout to ensure the blur event doesn't interfere with click event
    setTimeout(() => (this.isInputFocused = false), 200);
    console.log('blur');
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      // Handle enter key if needed
    }
  }
  onfollow() {
    this.auth.getTier().subscribe((data) => {
      this.tier = data;
    });
    // restrict user follow land based on tier
    this.landListService.getTotalFollowLand().subscribe(
      (response) => {
        console.log(response, this.tier);

        if (this.tier === 'Basic') {
          const modal = document.getElementById(
            'warn_follow_1'
          ) as HTMLDialogElement;
          modal.showModal();

          return;
        } else if (
          (this.tier === 'Tier1' && response < 1) ||
          (this.tier === 'Tier2' && response < 3) ||
          (this.tier === 'Tier3' && response < 10) ||
          this.fowllowState === true
        ) {
          this.fowllowState = !this.fowllowState;
          const follow: FollowLand = {
            LandDataID: this.selectedLand.LandDataID,
            Follow: this.fowllowState,
          };
          this.landListService.followLand(follow).subscribe();
          this.onFollowChanged(follow);
        } else {
          console.log('enter tier');

          const modal = document.getElementById(
            'warn_follow_2'
          ) as HTMLDialogElement;
          modal.showModal();
        }
      },
      (error) => {
        console.error('Error getting total follow land:', error);
      }
    );

    // this.fowllowState = !this.fowllowState;
    // const follow: FollowLand = {
    //   LandDataID: this.selectedLand.LandDataID,
    //   Follow: this.fowllowState,
    // };
    // this.landListService.followLand(follow).subscribe();
    // this.onFollowChanged(follow);
  }
  onCardClick(item: any, event: MouseEvent) {
    const modal = document.getElementById(
      'fullland_detail'
    ) as HTMLDialogElement;
    const target = event.target as HTMLElement;

    if (!target.closest('.followbutton')) {
      this.selectedLand = item;
      this.fowllowState = this.selectedLand.Follow;
      console.log(this.selectedLand);
      
      this.landListService
        .getNearbyLandMark(this.selectedLand.LandDataID)
        .subscribe(
          (response) => {

            this.nearbyPlaces = this.nearbyPlaceFilter(response);

          },
          (error) => console.error('Error fetching nearby places:', error)
        );
      modal.showModal();
    }
  }

  districtSelectChange(event: any) {
    this.handleSearch(this.searchValue);
  }

  nearbyPlaceFilter(places: any) {
    places.sort((a: any, b: any) => a.Distance - b.Distance);

    const selectedPlaces: any[] = [];
    const placeTypeMap = new Map<string, any[]>();

    // Categorize places by PlaceType
    for (const place of places) {
      if (!placeTypeMap.has(place.PlaceType)) {
        placeTypeMap.set(place.PlaceType, []);
      }
      placeTypeMap.get(place.PlaceType)!.push(place);
    }

    console.log(placeTypeMap);

    while (selectedPlaces.length < 3 && placeTypeMap.size > 0) {
      for (const [_, placeList] of placeTypeMap) {
        if (placeList.length > 0 && selectedPlaces.length < 8) {
          selectedPlaces.push(placeList.shift()!);
        }
      }
    }

    // If not enough, fill the rest with the nearest remaining places
    while (selectedPlaces.length < 8) {
      let added = false;
      for (const [_, placeList] of placeTypeMap) {
        if (placeList.length > 0 && selectedPlaces.length < 8) {
          selectedPlaces.push(placeList.shift()!);
          added = true;
        }
      }
      if (!added) break; // Break if no more places are available
      
    }

    return selectedPlaces;
  }

  toggleLandBar() {
    this.istoggleLandBar = !this.istoggleLandBar;
  }
  togglePriceBox() {
    this.istogglePriceBox = !this.istogglePriceBox;
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

  // ใช้เพื่อปรับ landlist เมื่อมีการ filter หรือ sort เปลี่ยน
  handleSearch(inputValue: string) {
    // รวม location กับ description ของแต่ละที่ดินเข้าด้วยกันแล้ว ค้นหาด้วย inputValue
    if (inputValue && inputValue.length > 0) {
      this.matches = [];
      this.matches = this.landList.filter((land) => {
        const combinedText = `${land.LocationName} ${land.Description} ${land.LandTitle}`;
        // if(combinedText.includes(inputValue)) {
        //   this.matches.push(land);
        // }
        return combinedText.includes(inputValue);
      });
    } else {
      this.matches = this.landList;
    }
    
    

    const inrange = this.matches.filter((land) => {
      const x =
        land.Price >= this.Priceslider.leftPrice &&
        land.Price <= this.Priceslider.rightPrice &&
        land.Size >= this.Areaslider.leftArea &&
        land.Size <= this.Areaslider.rightArea;
      return x;
    });

    this.filteredLandList = this.matches && inrange;
    this.filteredLandList = this.filterLands();

    console.log(this.filteredLandList);

    this.sortedLandList = this.markerSortService.sortByClosestReference(
      this.filteredLandList,
      this.markerCoord,
      this.maxdistance
    );
  }

  filterLands() {
    // Mapping English district keys to Thai names
    const districtMapping: { [key: string]: string } = {
      MinBuri: 'มีนบุรี',
      LatKrabang: 'ลาดกระบัง',
      KhlongToei: 'คลองเตย',
      Watthana: 'วัฒนา',
    };

    // Get selected districts in Thai
    const selectedDistricts = Object.keys(this.districtSelect)
      .filter(
        (district) =>
          this.districtSelect[district as keyof typeof this.districtSelect]
      )
      .map((district) => districtMapping[district]); // Convert to Thai

    // If no districts are selected, return all lands
    if (selectedDistricts.length === 0) {
      return this.filteredLandList;
    }

    // Filter lands based on selected districts
    return this.filteredLandList.filter((land) =>
      selectedDistricts.includes(land.LocationName)
    );
  }

  onMapOptionChange(option: string): void {
    this.selectedMapLayer = option;
  }
  markerCoordUpdate(coord: any): void {
    this.markerCoord = coord;

    this.sortedLandList = this.markerSortService.sortByClosestReference(
      this.filteredLandList,
      this.markerCoord,
      this.maxdistance
    );
  }
  leftPriceChange(event: any) {
    const inputElement = event.target as HTMLInputElement;
    const value = parseInt(inputElement.value) * 1000000;
    if (value < this.Priceslider.minPrice) {
      this.Priceslider.leftPrice = this.Priceslider.minPrice;
    } else if (value > this.Priceslider.rightPrice) {
      this.Priceslider.leftPrice = this.Priceslider.rightPrice;
    } else {
      this.Priceslider.leftPrice = value;
    }
    this.handleSearch(this.searchValue);
  }
  rightPriceChange(event: any) {
    const inputElement = event.target as HTMLInputElement;
    const value = parseInt(inputElement.value) * 1000000;
    if (value > this.Priceslider.maxPrice) {
      this.Priceslider.rightPrice = this.Priceslider.maxPrice;
    } else if (value < this.Priceslider.leftPrice) {
      this.Priceslider.rightPrice = this.Priceslider.leftPrice;
    } else {
      this.Priceslider.rightPrice = value;
    }
    this.handleSearch(this.searchValue);
  }

  leftAreaChange(event: any) {
    const inputElement = event.target as HTMLInputElement;
    const value = parseInt(inputElement.value);
    if (value < this.Areaslider.minArea) {
      this.Areaslider.leftArea = this.Areaslider.minArea;
    } else if (value > this.Areaslider.rightArea) {
      this.Areaslider.leftArea = this.Areaslider.rightArea;
    } else {
      this.Areaslider.leftArea = value;
    }
    this.handleSearch(this.searchValue);
  }
  rightAreaChange(event: any) {
    const inputElement = event.target as HTMLInputElement;
    const value = parseInt(inputElement.value);
    if (value > this.Areaslider.maxArea) {
      this.Areaslider.rightArea = this.Areaslider.maxArea;
    } else if (value < this.Areaslider.leftArea) {
      this.Areaslider.rightArea = this.Areaslider.leftArea;
    } else {
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
      !(
        /^\d$/.test(inputChar) ||
        (inputChar === '.' && !currentValue.includes('.')) ||
        (inputChar === '-' && currentValue === '')
      )
    ) {
      event.preventDefault(); // Block disallowed keys
    }
  }

  prevSlide(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.max - 1;
    }
  }

  nextSlide(): void {
    if (this.currentIndex < this.max - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
  }

  autoSlide(): void {
    setInterval(() => {
      this.nextSlide();
    }, 3000);
  }

  getIconName(placeType: string): string {
    return this.dashBoardService.getIconName(placeType);
    // return 'place';
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete(); // Clean up the subject
  }

  closeModal() {
    // Close the modal
    const modal = document.getElementById(
      'fullland_detail'
    ) as HTMLDialogElement;

    document.getElementById('carousel-container')?.scrollIntoView();
    modal.close();
  }
}
