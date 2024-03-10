import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { OSMDataService } from '../osm-data.service'; // Import your service for handling OSM data requests

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
      console.log('Latitude:', latitude, 'Longitude:', longitude);
      
      // Call a method to handle the query using the latitude and longitude
      // this.queryOSMData(latitude, longitude);
      this.address(latitude, longitude)
    });
  }

  private queryOSMData(latitude: number, longitude: number): void {
    // Call your OSM data service to fetch data based on the clicked coordinates
    this.osmDataService.getOSMData(latitude, longitude, 5000) // 5 km radius, adjust as needed
      .subscribe(data => {
        console.log('OSM Data:', data);
      });
  }

  private addMarker(latitude: number, longitude: number): void {
    const marker = L.marker([latitude, longitude]).addTo(this.map);
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
}
