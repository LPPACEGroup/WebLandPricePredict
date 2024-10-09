import { Component, Input, OnChanges, SimpleChanges } from '@angular/core'; // Import OnChanges and SimpleChanges
import * as L from 'leaflet';
import 'leaflet-control-geocoder';
import 'leaflet-control-geocoder/dist/Control.Geocoder.js'; // Add this line

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnChanges {
  @Input() coordinates: [number, number] | null = null; // Input property to receive coordinates
  @Input() landList: any[] = [];
  @Input() selectedMapLayer: string = 'osm'; // Default map layer

  private map!: L.Map;
  private markersLayer = L.layerGroup();
  private osmLayer!: L.TileLayer;
  private googleSatLayer!: L.TileLayer;

  // Initialize the map
  private initMap(): void {
    this.map = L.map('map', {
      center: [13.7299, 100.7782],
      zoom: 14,
    });

    // OSM Layer
    this.osmLayer = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 21,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );

    // Google Satellite Layer
    this.googleSatLayer = L.tileLayer(
      'http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
      {
        maxZoom: 21,
        subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
      }
    );

    // Set default map layer to OSM
    this.osmLayer.addTo(this.map);

    // Add marker layer
    this.markersLayer.addTo(this.map);
  }

  // Update the map view based on the provided coordinates
  private updateMapView(coordinates: [number, number]): void {
    if (coordinates) {
      this.map.panTo(new L.LatLng(coordinates[1], coordinates[0]));
      this.map.setZoom(15);
    }
  }

  // Render markers based on the landList
  private renderMarkers(): void {
    this.markersLayer.clearLayers();

    // Loop through landList and add markers
    this.landList.forEach((land) => {
      if (land.latitude && land.longitude) {
        const marker = L.marker([land.latitude, land.longitude]);
        marker.bindPopup(`<b>${land.location}</b><br>${land.description}`);
        this.markersLayer.addLayer(marker); // Add marker to the markers layer
      }
    });
  }

  // Handle changes to input properties
  ngOnChanges(changes: SimpleChanges): void {
    // Check for changes in coordinates
    if (changes['coordinates']) {
      this.updateMapView(changes['coordinates'].currentValue);
    }

    // Check for changes in landList
    if (changes['landList']) {
      this.renderMarkers();
    }

    // Check for changes in selectedMapLayer
    if (changes['selectedMapLayer']) {
      this.switchMapLayer(changes['selectedMapLayer'].currentValue);
    }
  }

  // Switch between OSM and Google Satellite layers
  private switchMapLayer(layer: string): void {
    if (layer === 'osm') {
      // Switch to OSM Layer
      this.map.removeLayer(this.googleSatLayer);
      this.osmLayer.addTo(this.map);
    } else if (layer === 'satellite') {
      // Switch to Google Satellite Layer
      this.map.removeLayer(this.osmLayer);
      this.googleSatLayer.addTo(this.map);
    }
  }

  // Initialize the map after the view is initialized
  ngAfterViewInit(): void {
    this.initMap();
  }
}
