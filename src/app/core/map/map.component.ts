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
import shp from 'shpjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent implements OnChanges {
  @Input() coordinates: [number, number] | null = null; // Input property to receive coordinates
  @Input() selectedMapLayer: string = 'osm'; // Default map layer
  @Output() markerCoordOutput = new EventEmitter<any[]>();

  private markerCoord: any[] = [];
  private map!: L.Map;
  private markersLayer = L.layerGroup();
  private osmLayer!: L.TileLayer;
  private googleSatLayer!: L.TileLayer;
  markerManage: boolean = false;
  private geodata: any;
  // private p1 = L.geoJSON();
  // private p2 = L.geoJSON();
  // private p3 = L.geoJSON();
  // private p4 = L.geoJSON();
  private colorMap = L.featureGroup();
  private mrt = L.featureGroup();
  private bts = L.featureGroup();
  private lineweights = 4
  private radius = 500;

  tier = 'Basic';
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
  
    const radius = this.radius; // Radius in meters
    const circle = L.circle([latitude, longitude], {
      color: 'blue',
      fillColor: 'blue',
      fillOpacity: 0.2,
      radius: radius,
    });
  
    console.log(this.markerCoord.length);
    if (
      (this.tier === 'Tier1' && this.markerCoord.length + 1 > 1) ||
      (this.tier === 'Tier2' && this.markerCoord.length + 1 > 3) ||
      (this.tier === 'Tier3' && this.markerCoord.length + 1 > 10)
    ) {
      const modal = document.getElementById(
        'warn_marker_1'
      ) as HTMLDialogElement;
      modal.showModal();
      return;
    }
  
    this.markerCoord.push([latitude, longitude]);

    // marker.bindPopup(
    //   `<b>Custom Location</b><br>Latitude: ${latitude}, Longitude: ${longitude}`
    // );
  
    // remove if click on marker when markerManage is true
    marker.on('click', (e: L.LeafletMouseEvent) => {
      if (this.markerManage) {
        this.map.removeLayer(marker);
        this.map.removeLayer(circle); // Remove the circle when marker is removed
        this.markerCoord = this.markerCoord.filter(
          (coord) => coord[0] !== latitude && coord[1] !== longitude
        );
        this.markerCoordOutput.emit(this.markerCoord);
      }
    });
  
    this.markerCoordOutput.emit(this.markerCoord);
  
    this.markersLayer.addLayer(marker);
    this.markersLayer.addLayer(circle); // Add circle to the same layer as markers
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
    // Remove all layers before switching
    this.map.removeLayer(this.osmLayer);
    this.map.removeLayer(this.googleSatLayer);
    this.map.removeLayer(this.colorMap);
    this.map.removeLayer(this.mrt);
    this.map.removeLayer(this.bts);

    if (layer === 'osm') {
      this.osmLayer.addTo(this.map);
    } else if (layer === 'satellite') {
      this.googleSatLayer.addTo(this.map);
    } else if (layer === 'colormap') {
      this.osmLayer.addTo(this.map);
      this.colorMap.addTo(this.map);
    } else if (layer === 'mrt') {
      this.osmLayer.addTo(this.map);
      this.mrt.addTo(this.map);
    } else if (layer === 'bts') {
      this.osmLayer.addTo(this.map);
      this.bts.addTo(this.map);
    }
  }

  constructor(
    private getJsonService: GetJsonService,
    private auth: AuthService,
    private dashBoardService: DashboardService
  ) {
    //  get geojson and add to colorMap layer
    this.getJsonService
      .getJson('assets/layers/latkrabang.geojson')
      .subscribe((data: any) => {
        this.colorMap.addLayer(
          L.geoJSON(data, {
            style: (feature) => {
              return {
                color: feature
                  ? this.getColor(feature.properties.color)
                  : 'gray',
                weight: 2, // ความหนาของเส้นขอบ
                opacity: 1,
                fillOpacity: 0.5,
              };
            },
          })
        );
      });
    this.getJsonService
      .getJson('assets/layers/minburi.geojson')
      .subscribe((data: any) => {
        this.colorMap.addLayer(
          L.geoJSON(data, {
            style: (feature) => {
              return {
                color: feature
                  ? this.getColor(feature.properties.color)
                  : 'gray',
                weight: 2, // ความหนาของเส้นขอบ
                opacity: 1,
                fillOpacity: 0.5,
              };
            },
          })
        );
      });
    this.getJsonService
      .getJson('assets/layers/khlong_Toei.geojson')
      .subscribe((data: any) => {
        this.colorMap.addLayer(
          L.geoJSON(data, {
            style: (feature) => {
              return {
                color: feature
                  ? this.getColor(feature.properties.color)
                  : 'gray',
                weight: 2, // ความหนาของเส้นขอบ
                opacity: 1,
                fillOpacity: 0.5,
              };
            },
          })
        );
      });
    this.getJsonService
      .getJson('assets/layers/watthana.geojson')
      .subscribe((data: any) => {
        this.colorMap.addLayer(
          L.geoJSON(data, {
            style: (feature) => {
              return {
                color: feature
                  ? this.getColor(feature.properties.color)
                  : 'gray',
                weight: 2, // ความหนาของเส้นขอบ
                opacity: 1,
                fillOpacity: 0.5,
              };
            },
          })
        );
      });

    // config bts and mrt

    // Mapping of GeoJSON files to their names
    const lineNames = {
      'Green Line.geojson': 'Green Line',
      'Hard Green Line.geojson': 'Hard Green Line',
      'Light Red Line.geojson': 'Light Red Line',
      'Middle Red Line.geojson': 'Middle Red Line',
      'Pink Line.geojson': 'Pink Line',
      'Red Line.geojson': 'Red Line',
      'Yellow Line.geojson': 'Yellow Line',
      'Blue.geojson': 'Blue Line',
      'Purple.geojson': 'Purple Line',
      'Yellow.geojson': 'Yellow Line',
    };
    


    // get geojson and add to mrt layer
    this.getJsonService
      .getJson('assets/layers/mrt/Blue.geojson')
      .subscribe((data: any) => {
        this.mrt.addLayer(
          L.geoJSON(data, {
            style: (feature) => {
              return {
                color: 'blue',
                weight: this.lineweights, // ความหนาของเส้นขอบ
                opacity: 1,
                fillOpacity: 0.5,
              };
            },onEachFeature: (feature, layer) => {
              // Use the name mapping
              const name = lineNames['Blue.geojson'];
              layer.bindTooltip(name, { permanent: false, direction: 'top' });
            },
          })
        );
      });
    this.getJsonService
      .getJson('assets/layers/mrt/Purple.geojson')
      .subscribe((data: any) => {
        this.mrt.addLayer(
          L.geoJSON(data, {
            style: (feature) => {
              return {
                color: 'purple',
                weight: this.lineweights, // ความหนาของเส้นขอบ
                opacity: 1,
                fillOpacity: 0.5,
              };
            },onEachFeature: (feature, layer) => {
              // Use the name mapping
              const name = lineNames['Purple.geojson'];
              layer.bindTooltip(name, { permanent: false, direction: 'top' });
            },
          })
        );
      });
    this.getJsonService
      .getJson('assets/layers/mrt/Yellow.geojson')
      .subscribe((data: any) => {
        this.mrt.addLayer(
          L.geoJSON(data, {
            style: (feature) => {
              return {
                color: 'yellow',
                weight: this.lineweights, // ความหนาของเส้นขอบ
                opacity: 1,
                fillOpacity: 0.5,
              };
            },onEachFeature: (feature, layer) => {
              // Use the name mapping
              const name = lineNames['Yellow.geojson'];
              layer.bindTooltip(name, { permanent: false, direction: 'top' });
            },
          })
        );
      });


    
    this.getJsonService
      .getJson('assets/layers/bts/Green Line.geojson')
      .subscribe((data: any) => {
        this.bts.addLayer(
          L.geoJSON(data, {
            style: (feature) => {
              return {
                color: '#77cb00',
                weight: this.lineweights,
                opacity: 1,
                fillOpacity: 0.5,
              };
            },
            onEachFeature: (feature, layer) => {
              // Use the name mapping
              const name = lineNames['Green Line.geojson'];
              layer.bindTooltip(name, { permanent: false, direction: 'top' });
            },
          })
        );
      });

    this.getJsonService
      .getJson('assets/layers/bts/Hard Green Line.geojson')
      .subscribe((data: any) => {
        this.bts.addLayer(
          L.geoJSON(data, {
            style: (feature) => {
              return {
                color: '#246b5b',
                weight: this.lineweights,
                opacity: 1,
                fillOpacity: 0.5,
              };
            },
            onEachFeature: (feature, layer) => {
              // Use the name mapping
              const name = lineNames['Hard Green Line.geojson'];
              layer.bindTooltip(name, { permanent: false, direction: 'top' });
            },
          })
        );
      });

    this.getJsonService
      .getJson('assets/layers/bts/Ligth_Red_Line.geojson')
      .subscribe((data: any) => {
        this.bts.addLayer(
          L.geoJSON(data, {
            style: (feature) => {
              return {
                color: '#f95558',
                weight: this.lineweights,
                opacity: 1,
                fillOpacity: 0.5,
              };
            },
            onEachFeature: (feature, layer) => {
              // Use the name mapping
              const name = lineNames['Light Red Line.geojson'];
              layer.bindTooltip(name, { permanent: false, direction: 'top' });
            },
          })
        );
      });

    this.getJsonService
      .getJson('assets/layers/bts/Middle Red Line.geojson')
      .subscribe((data: any) => {
        this.bts.addLayer(
          L.geoJSON(data, {
            style: (feature) => {
              return {
                color: '#dd0f19',
                weight: this.lineweights,
                opacity: 1,
                fillOpacity: 0.5,
              };
            },
            onEachFeature: (feature, layer) => {
              // Use the name mapping
              const name = lineNames['Middle Red Line.geojson'];
              layer.bindTooltip(name, { permanent: false, direction: 'top' });
            },
          })
        );
      });

    this.getJsonService
      .getJson('assets/layers/bts/Pink Line.geojson')
      .subscribe((data: any) => {
        this.bts.addLayer(
          L.geoJSON(data, {
            style: (feature) => {
              return {
                color: '#eda0c2',
                weight: this.lineweights,
                opacity: 1,
                fillOpacity: 0.5,
              };
            },
            onEachFeature: (feature, layer) => {
              // Use the name mapping
              const name = lineNames['Pink Line.geojson'];
              layer.bindTooltip(name, { permanent: false, direction: 'top' });
            },
          })
        );
      });

    this.getJsonService
      .getJson('assets/layers/bts/Red Line.geojson')
      .subscribe((data: any) => {
        this.bts.addLayer(
          L.geoJSON(data, {
            style: (feature) => {
              return {
                color: '#FF0000',
                weight: this.lineweights,
                opacity: 1,
                fillOpacity: 0.5,
              };
            },
            onEachFeature: (feature, layer) => {
              // Use the name mapping
              const name = lineNames['Red Line.geojson'];
              layer.bindTooltip(name, { permanent: false, direction: 'top' });
            },
          })
        );
      });

    this.getJsonService
      .getJson('assets/layers/bts/Yellow Line.geojson')
      .subscribe((data: any) => {
        this.bts.addLayer(
          L.geoJSON(data, {
            style: (feature) => {
              return {
                color: '#ffbb00',
                weight: this.lineweights,
                opacity: 1,
                fillOpacity: 0.5,
              };
            },
            onEachFeature: (feature, layer) => {
              // Use the name mapping
              const name = lineNames['Yellow Line.geojson'];
              layer.bindTooltip(name, { permanent: false, direction: 'top' });
            },
          })
        );
      });

      
  }

  ngOnInit() {
    this.auth.getTier().subscribe((data) => {
      this.tier = data;

      if (this.tier === 'Basic') {
        this.radius = 0;
      }
      else if (this.tier === 'Tier1') {
        this.radius = 2000;
      }
      else if (this.tier === 'Tier2') {
        this.radius = 4000;
      }
      else if (this.tier === 'Tier3') {
        this.radius = 8000;
      }
      
    });
    // Add this function to adjust weight based on zoom level


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

    this.map.on('zoom', () => {
      const zoomLevel = this.map.getZoom();
      console.log(zoomLevel);
      let weight = 4;
      if (zoomLevel >= 12) {
        weight = 4+zoomLevel/6;
      }
      else
      {
        weight = 4-zoomLevel/4;
      }
      
      this.bts.eachLayer(function (layer) {
        if (layer instanceof L.GeoJSON) {
          layer.setStyle({
            weight: weight, // Apply zoom-based weight
          });
        }
      });

      this.mrt.eachLayer(function (layer) {
        if (layer instanceof L.GeoJSON) {
          layer.setStyle({
            weight: weight, // Apply zoom-based weight
          });
        }
      }
      );
    });
    


  }
  toggleMaker(): void {
    console.log(this.tier);

    if (this.tier === 'Basic') {
      const modal = document.getElementById(
        'warn_marker_2'
      ) as HTMLDialogElement;
      modal.showModal();
    } else {
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
  private loadShapefile(
    zipUrl: string,
    layerName: string,
    callback?: (layer: L.Layer) => void
  ) {
    fetch(zipUrl)
      .then((response) => response.arrayBuffer())
      .then((buffer) => shp(buffer)) // Convert ZIP to GeoJSON
      .then((geojson) => {
        const layer = L.geoJSON(geojson, {
          pointToLayer: (feature, latlng) => {
            return L.circleMarker(latlng, {
              radius: 5, // Adjust size
              color: 'blue', // Outline color
              fillColor: 'blue', // Fill color
              fillOpacity: 0.8,
            });
          },
        });

        if (callback) callback(layer);
      })
      .catch((error) => console.error(`Error loading ${layerName}:`, error));
  }
}
