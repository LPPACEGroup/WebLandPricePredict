import { Component, Input, OnChanges, SimpleChanges } from '@angular/core'; // Import OnChanges and SimpleChanges
import * as L from 'leaflet';
import 'leaflet-control-geocoder';
import 'leaflet-control-geocoder/dist/Control.Geocoder.js'; // Add this line

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css',
})
export class MapComponent implements OnChanges {
  // Implement OnChanges
  @Input() coordinates: [number, number] | null = null; // Input property to receive coordinates
  @Input()   landList: any[] = [];

  private map!: L.Map;
  private markersLayer = L.layerGroup();

  private initMap(): void {
    this.map = L.map('map', {
      center: [39.8282, -98.5795],
      zoom: 14,
    });
    const tiles = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 21,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );

    tiles.addTo(this.map);
    this.markersLayer.addTo(this.map);
    // var wmsLayer = L.tileLayer.wms('https://ms.longdo.com/mapproxy/service', {
    //   layers: 'dol_4326',
    //   format: 'image/png',
    //   transparent: true,
    //   crs: L.CRS.EPSG3857,
    // });

    // wmsLayer.addTo(this.map);
    // var wmsUrl = './service.xml';

    // L.tileLayer
    //   .wms(wmsUrl, {
    //     layers: 'dol_4326',
    //     format: 'image/png',
    //     transparent: true,
    //     attribution: 'Your attribution here',
    //   })
    //   .addTo(this.map);
  }

  updateMapView(coordinates: [number, number]) {
    if (coordinates) {
      //plan map ไปที่ coordinate ที่อยู่ตอนนี้
      this.map.panTo(new L.LatLng(coordinates[1], coordinates[0]));
      this.map.setZoom(15);
    }
  }
  private renderMarkers(): void {
    // Clear the previous markers
    this.markersLayer.clearLayers();

    // Loop through landList and add markers
    this.landList.forEach(land => {
      if (land.latitude && land.longitude) {
        const marker = L.marker([land.latitude, land.longitude]);
        marker.bindPopup(`<b>${land.location}</b><br>${land.description}`); // Add popup info (optional)
        this.markersLayer.addLayer(marker); // Add marker to the markers layer
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['coordinates']) {
      this.updateMapView(changes['coordinates'].currentValue);
    }
    if (changes['landList']) {
      this.renderMarkers(); 
    }
  }

  ngAfterViewInit(): void {
    this.initMap();
    
  }
}

