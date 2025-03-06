import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MarkersortService {

  // private readonly R = 6371; // Radius of Earth in kilometers

  // constructor() {}

  // // Haversine formula to calculate the distance between two lat/lon points
  // private haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  //   const toRad = (x: number) => (x * Math.PI) / 180;
  //   const dLat = toRad(lat2 - lat1);
  //   const dLon = toRad(lon2 - lon1);
  //   const a = Math.sin(dLat / 2) ** 2 +
  //             Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
  //             Math.sin(dLon / 2) ** 2;
  //   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  //   return this.R * c;
  // }

  // // Method to sort data based on proximity to target coordinates
  // sortByProximity(data: any[], targetCoords: [number, number][],maxdistance:number): any[] {
  //   return data.map(item => {
  //     // Calculate the minimum distance to any target coordinate
      
  //     const distances = targetCoords.map(([lat, lon]) =>
  //       this.haversine(item.latitude, item.longitude, lat, lon)
  //     );
  //     const minDistance = Math.min(...distances);
  //     // Check if within maxdistnace km of any target coordinate
  //     return { ...item, distance: minDistance, inRange: minDistance <= 30 };
  //   })
  //   .sort((a, b) => {
  //     // Prioritize items in range, then by distance
  //     if (a.inRange && !b.inRange) return -1;
  //     if (!a.inRange && b.inRange) return 1;
  //     return a.distance - b.distance;
  //   });
  // }

  private degToRad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radius of the Earth in km
    const dLat = this.degToRad(lat2 - lat1);
    const dLon = this.degToRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degToRad(lat1)) * Math.cos(this.degToRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private getClosestDistance(landLat: number, landLng: number, referencePoints: number[][]): number {
    return Math.min(...referencePoints.map(([lat, lng]) => this.calculateDistance(landLat, landLng, lat, lng)));
  }

  sortByClosestReference(lands: any[], referencePoints: number[][], maxDistance = 3): any[] {
    const landsCopy = [...lands]; // Create a shallow copy of the array
  
    return landsCopy.sort((a, b) => {
      const distA = this.getClosestDistance(a.Latitude, a.Longitude, referencePoints);
      const distB = this.getClosestDistance(b.Latitude, b.Longitude, referencePoints);
  
      const inRangeA = distA <= maxDistance ? 0 : 1;
      const inRangeB = distB <= maxDistance ? 0 : 1;
  
      if (inRangeA !== inRangeB) return inRangeA - inRangeB; // Lands within 3 km come first
      return distA - distB; // Sort within each group by closest distance
    });
  }
  
}
