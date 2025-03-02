import { CommonModule } from '@angular/common';
import { Component, Input, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { DashboardService } from 'app/service/Dashboard/dashboard.service';
import { LandListService } from 'app/service/LandList/land-list.service';

@Component({
  selector: 'app-pinned-property-expand',
  standalone: true,
  imports: [CommonModule,MatIcon],
  templateUrl: './pinned-property-expand.component.html',
  styleUrl: './pinned-property-expand.component.css'
})
export class PinnedPropertyExpandComponent {
 @Input() land: any;
  isDropdownVisible: boolean = false;
  nearbyPlaces: any;
  interestLevel: any;
  interestLevelColor!: string;

  constructor(private landListService:LandListService,private dashBoardService:DashboardService) { }

  ngOnInit() {
    this.landListService
        .getNearbyLandMark(this.land.LandDataID)
        .subscribe(
          (response) => {
            this.nearbyPlaces = response;
          },
          (error) => console.error('Error fetching nearby places:', error)
        );
    this.dashBoardService.interestLevel(this.land.LandDataID).subscribe(
      (response) => {
        console.log(response);
        
        this.interestLevel = response.interest_level;
        switch (this.interestLevel) {
          case 'น่าสนใจมาก':
            this.interestLevelColor = 'text-[#BD60B4]';
            break;
          case 'น่าสนใจ':
            this.interestLevelColor = 'text-[#00A76F]';
            break;
          case 'ปานกลาง':
            this.interestLevelColor = 'text-[#F3C762]';
            break;
          default:
            this.interestLevelColor = 'text-[#A32727]';
        }
      },
      (error) => console.error('Error fetching interest level:', error)
    );
  }



  toggleDropdown() {

    this.isDropdownVisible = !this.isDropdownVisible;

  }

  getIconName(placeType:string)
  {
    return this.dashBoardService.getIconName(placeType);
  }

}
