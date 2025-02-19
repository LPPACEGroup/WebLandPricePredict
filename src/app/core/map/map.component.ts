import {
  Component,
  Input,
  Output,
  OnChanges,
  EventEmitter,
  SimpleChanges,
} from '@angular/core'; // Import OnChanges and SimpleChanges
import * as L from 'leaflet';
import 'leaflet-control-geocoder';
import 'leaflet-control-geocoder/dist/Control.Geocoder.js';
import { GetJsonService } from 'app/service/GetJson/get-json.service';
import { style } from '@angular/animations';
import { AuthService } from 'app/service/Auth/auth.service';
import { DashboardService } from 'app/service/Dashboard/dashboard.service';

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
  @Output() markerCoordOutput = new EventEmitter<any[]>();

  private markerCoord: any[] = [];
  private map!: L.Map;
  private markersLayer = L.layerGroup();
  private osmLayer!: L.TileLayer;
  private googleSatLayer!: L.TileLayer;
  private markerManage: boolean = false;
  private geodata: any;
  // private p1 = L.geoJSON();
  // private p2 = L.geoJSON();
  // private p3 = L.geoJSON();
  // private p4 = L.geoJSON();
  private colorMap = L.featureGroup();

  tier = "Basic";
  // Initialize the map
  private initMap(): void {
    this.map = L.map('map', {
      center: [13.7299, 100.7782],
      zoom: 14,
      zoomControl: false,
      attributionControl: false,
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

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      if (this.markerManage) {
        const { lat, lng } = e.latlng;
        this.addCustomMarker(lat, lng);
      }
    });

    // this.latkra.addTo(this.map);

    this.osmLayer.addTo(this.map);
    // Add marker layer
    this.markersLayer.addTo(this.map);


    L.geoJSON(this.geodata, {
      style: (feature) => {
        return {
          color: feature ? this.getColor(feature.properties.color) : 'gray', 
          weight: 2, // ความหนาของเส้นขอบ
          opacity: 1, 
          fillOpacity: 0.5, 
        };
      },
    }).addTo(this.map);
    
  }
  // map สีกับ geojson
  getColor(color: any) {
    switch (color) {
      case 1:
        return 'yellow';
      case 2:
        return 'orange';
      case 3:
        return 'brown';
      case 4:
        return 'red';
      case 5:
        return 'purple';
      case 6:
        return 'pink';
      case 7:
        return 'white';
      case 8:
        return 'green';
      case 10:
        return 'blue';
      default:
        return 'black'; 
    }
  }
  // Update the map view based on the provided coordinates
  private updateMapView(coordinates: [number, number]): void {
    if (coordinates) {
      this.map.panTo(new L.LatLng(coordinates[1], coordinates[0]));
      this.map.setZoom(15);
    }
  }

  // Method to add a custom marker at given coordinates
  addCustomMarker(latitude: number, longitude: number): void {
    const customIcon = L.icon({
      iconUrl:
        'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowUrl:
        'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      shadowSize: [41, 41],
    });

    const marker = L.marker([latitude, longitude], { icon: customIcon });
    console.log(this.markerCoord.length);
    
    if (
      (this.tier === 'Tier1' && this.markerCoord.length+1 > 1) ||
      (this.tier === 'Tier2' && this.markerCoord.length+1 > 3) ||
      (this.tier === 'Tier3' && this.markerCoord.length+1 > 10)
    ) {
      alert('You have reached the limit of your tier (' + this.tier + '). Please upgrade your account to a higher tier to add more markers.');
      return;
    }
    this.markerCoord.push([latitude, longitude]);
    
    // marker.bindPopup(
    //   `<b>Custom Location</b><br>Latitude: ${latitude}, Longitude: ${longitude}`
    // );
    marker.on('click', (e: L.LeafletMouseEvent) => {
      if (this.markerManage) {
        this.map.removeLayer(marker);
        this.markerCoord = this.markerCoord.filter(
          (coord) => coord[0] !== latitude && coord[1] !== longitude
        );
        this.markerCoordOutput.emit(this.markerCoord);
      }
    });

    this.markerCoordOutput.emit(this.markerCoord);
    // console.log(this.markerCoord);

    this.markersLayer.addLayer(marker);
  }

  // Handle changes to input properties
  ngOnChanges(changes: SimpleChanges): void {
    // Check for changes in coordinates
    if (changes['coordinates']) {
      this.updateMapView(changes['coordinates'].currentValue);
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
      this.map.removeLayer(this.colorMap)
      this.osmLayer.addTo(this.map);
    } else if (layer === 'satellite') {
      // Switch to Google Satellite Layer
      this.map.removeLayer(this.osmLayer);
      this.map.removeLayer(this.colorMap)
      this.googleSatLayer.addTo(this.map);
    }
    else if (layer === 'colormap') {
      // Switch to Colormap Layer
      this.map.removeLayer(this.osmLayer);
      this.osmLayer.addTo(this.map);
      this.colorMap.addTo(this.map)

    }
  }
  constructor(private getJsonService: GetJsonService, private auth: AuthService ,private dashBoardService: DashboardService) {
    this.getJsonService
      .getJson('assets/layers/latkrabang.geojson')
      .subscribe((data:any) => {
        this.colorMap.addLayer(L.geoJSON(data,{
      style: (feature) => {
        return {
          color: feature ? this.getColor(feature.properties.color) : 'gray', 
          weight: 2, // ความหนาของเส้นขอบ
          opacity: 1, 
          fillOpacity: 0.5, 
        };
      },
    }))
      });
      this.getJsonService
      .getJson('assets/layers/minburi.geojson')
      .subscribe((data:any) => {
        this.colorMap.addLayer(L.geoJSON(data,{
      style: (feature) => {
        return {
          color: feature ? this.getColor(feature.properties.color) : 'gray', 
          weight: 2, // ความหนาของเส้นขอบ
          opacity: 1, 
          fillOpacity: 0.5, 
        };
      },
    }))
      });
      this.getJsonService
      .getJson('assets/layers/khlong_Toei.geojson')
      .subscribe((data:any) => {
        this.colorMap.addLayer(L.geoJSON(data,{
      style: (feature) => {
        return {
          color: feature ? this.getColor(feature.properties.color) : 'gray', 
          weight: 2, // ความหนาของเส้นขอบ
          opacity: 1, 
          fillOpacity: 0.5, 
        };
      },
    }))
      });
      this.getJsonService
      .getJson('assets/layers/watthana.geojson')
      .subscribe((data:any) => {
        this.colorMap.addLayer(L.geoJSON(data,{
      style: (feature) => {
        return {
          color: feature ? this.getColor(feature.properties.color) : 'gray', 
          weight: 2, // ความหนาของเส้นขอบ
          opacity: 1, 
          fillOpacity: 0.5, 
        };
      },
    }))
      });
  }

  ngOnInit() {
    this.auth.getTier().subscribe((data) => {
      this.tier = data;
      
    });
    
  }
  clickZoomin() {
    this.map.zoomIn();
  }
  clickZoomout() {
    this.map.zoomOut();
  }

  // Initialize the map after the view is initialized
  ngAfterViewInit(): void {
    this.initMap();
  }
  toggleMaker(): void {
    console.log(this.tier);
    
    if (this.tier === 'Basic') {
      alert('your are now tier ' + this.tier + '. Please upgrade your account to Tier1 or higher to use this feature');
    }
    else {
      this.markerManage = !this.markerManage;

    }
  }
  checkColor(lat: number, lng: number): string {
    const point = L.latLng(lat, lng);
    let result = 'Point not inside any feature';

    L.geoJSON(this.geodata, {
      onEachFeature: (feature, layer) => {
        if (layer instanceof L.Polygon || layer instanceof L.Polyline) {
          // Check if the layer is of type Polygon or Polyline
          if (layer.getBounds().contains(point)) {
            result = `Color: ${feature.properties.color}`;
          }
        }
      },
    });

    return result;
  }

}
