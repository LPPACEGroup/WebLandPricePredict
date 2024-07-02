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

  private map!: L.Map;

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
      // Logic to update the map view based on the new coordinates
      // console.log('Updating map view to:', coordinates);
      this.map.panTo(new L.LatLng(coordinates[1], coordinates[0]));
      this.map.setZoom(15);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['coordinates']) {
      this.updateMapView(changes['coordinates'].currentValue);
    }
  }

  ngAfterViewInit(): void {
    this.initMap();
  }
}
