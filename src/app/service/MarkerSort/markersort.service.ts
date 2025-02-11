import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MarkersortService {

  private readonly R = 6371; // Radius of Earth in kilometers

  constructor() {}

  // Haversine formula to calculate the distance between two lat/lon points
  private haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return this.R * c;
  }

  // Method to sort data based on proximity to target coordinates
  sortByProximity(data: any[], targetCoords: [number, number][],maxdistance:number): any[] {
    return data.map(item => {
      // Calculate the minimum distance to any target coordinate
      const distances = targetCoords.map(([lat, lon]) =>
        this.haversine(item.latitude, item.longitude, lat, lon)
      );
      const minDistance = Math.min(...distances);
      // Check if within 10 km of any target coordinate
      return { ...item, distance: minDistance, inRange: minDistance <= maxdistance };
    })
    .sort((a, b) => {
      // Prioritize items in range, then by distance
      if (a.inRange && !b.inRange) return -1;
      if (!a.inRange && b.inRange) return 1;
      return a.distance - b.distance;
    });
  }
}
