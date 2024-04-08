import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-draw';
import 'leaflet-draw/dist/leaflet.draw';

import { OSMDataService } from '../osm-data.service'; // Import your service for handling OSM data requests
interface OverpassElement {
  type: string;
  id: number;
  lat: number;
  lon: number;
  tags: {
    [key: string]: string;
    name: string;
  };
}
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit {
  private map!: L.Map

  constructor(private osmDataService: OSMDataService) {} // Inject your service here

  
  private initMap(): void {
    this.map = L.map('map', {
      center: [ 13.7563, 100.5018 ],
      zoom: 14
    });
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });


    tiles.addTo(this.map);
    this.map.on('click', (event: any) => {
      const latitude = event.latlng.lat;
      const longitude = event.latlng.lng;

    });
    // เป็นtoolที่ใช้ draw พวก polygon ไม่ก็ marker
    var drawnItems = new L.FeatureGroup();
    const drawControl = new L.Control.Draw(
      {
        draw: {
          polygon:false,
          marker:{

          },
          circle:false,
          rectangle:false,
          circlemarker:false,
          polyline:false
        },
        edit: {
            featureGroup: drawnItems,
        }
    });
    this.map.addControl(drawControl);

    // event เกิดเมื่อมีการ draw เกิดขึ้น
    this.map.on(L.Draw.Event.CREATED, (event: any) => {
      const layer = event.layer;
      // ทำการเอาพิกัดมา
      const center = layer.getLatLng();
      const latitude = center['lat']
      const longitude = center['lng']
      // draw circle ตรงที่add พิกัด 
      L.circle([latitude,longitude], {radius:5000}).addTo(this.map);
      // querry
      // this.queryOSMData(latitude, longitude);
      // ทำการแปลง lat lng เป็นที่อยู่
      // this.address(latitude, longitude)
      this.map.addLayer(layer);
      this.fetchDataFromOverpass(latitude,longitude)
    });

  }

  private queryOSMData(latitude: number, longitude: number): void {
    // Call your OSM data service to fetch data based on the clicked coordinates
    this.osmDataService.getOSMData(latitude, longitude, 3000) // 5 km radius, adjust as needed
      .subscribe(data => {
        console.log('OSM Data:', data);
      });
  }

  private addMarker(latitude: number, longitude: number): void {
    L.marker([latitude, longitude],).addTo(this.map);
  }

  private address(latitude: number, longitude: number): void {
    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`, {
      headers: {
        'User-Agent': 'ID of your APP/service/website/etc. v0.1'
      }
    }).then(res => res.json())
      .then(res => {
        console.log(res.display_name)
        console.log(res.address)
    })  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.initMap();
  }

  

  private fetchDataFromOverpass(latitude: number, longitude: number): void {
    const overpassUrl = 'https://overpass-api.de/api/interpreter';
    // เลือก tag กับระยะ (เมตร ในที่นี้เลือก restaurant)
    const overpassQuery = `[out:json];
                           node(around:${5000}, ${latitude}, ${longitude})["amenity"="restaurant"];
                           out;`;

    fetch(overpassUrl, {
      method: 'POST',
      body: overpassQuery
    })
    .then(response => response.json())
    .then(data => {
      if (data && data.elements) {
        // เอา มาแค่ tag name ถ้าจะเอาอย่างอื่นอ่าจจะต้องใช้อย่างอื่น
        const restaurantNames = data.elements.map((element: OverpassElement) => element.tags.name|| 'Restaurant');
        console.log(restaurantNames);  // Print restaurant names to console log
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
  }
}
