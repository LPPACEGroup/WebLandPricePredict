import { CommonModule } from '@angular/common';
import { Component, Input, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { DashboardService } from 'app/service/Dashboard/dashboard.service';
import { LandListService } from 'app/service/LandList/land-list.service';

@Component({
  selector: 'app-pinned-property-expand',
  standalone: true,
  imports: [CommonModule, MatIcon, FormsModule],
  templateUrl: './pinned-property-expand.component.html',
  styleUrl: './pinned-property-expand.component.css',
})
export class PinnedPropertyExpandComponent {
  @Input() land: any;
  isDropdownVisible: boolean = false;
  nearbyPlaces: any;
  interestLevel: any;
  interestLevelColor!: string;
  landCitytype: string = '';
  landTaxType: string = 'chooseType';
  firstHouse: string = '0';
  legalEntity: string = '0';;
  landTax = '-'

  constructor(
    private landListService: LandListService,
    private dashBoardService: DashboardService
  ) {}

  ngOnInit() {
    this.landListService.getNearbyLandMark(this.land.LandDataID).subscribe(
      (response) => {
        this.nearbyPlaces = response;
      },
      (error) => console.error('Error fetching nearby places:', error)
    );
    this.dashBoardService.interestLevel(this.land.LandDataID).subscribe(
      (response) => {

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
    switch (this.land.Land_CityColor) {
      case 'red':
        this.landCitytype = 'ที่ดินประเภทพานิชบกรรม';
        break;
      case 'green':
        this.landCitytype = 'ที่ดินประเภทชนบทและเกษตกรรม';
        break;
      case 'brown':
        this.landCitytype = 'ที่ดินประเภทที่อยู่อาศัยหนาแน่นมาก';
        break;
      case 'orange':
        this.landCitytype = 'ที่ดินประเภทที่อยู่อาศัยหนาแน่นปลานกลาง';
        break;
      case 'lightgreen':
        this.landCitytype = 'ที่ดินประเภทอนุรักษย์ชนบทและเกษตกรรม';
        break;
      case 'yellow':
        this.landCitytype = 'ที่ดินประเภทที่อยู่อาศัยหนาแน่นน้อย';
        break;
      case 'purple':
        this.landCitytype = 'ที่ดินประเภทอุตสาหกรรม';
        break;
      case 'blue':
        this.landCitytype =
          'ที่ดินประเภทสถาบันราชการ การสาธารณูปโภคและสาธารณูปการ';
        break;
      case 'lightbrown':
        this.landCitytype = 'ที่ดินประเภทอนุรักษ์และส่งเสริมศิลปวัฒนธรรมไทย';
        break;
      case 'lightpurple':
        this.landCitytype = 'ที่ดินประเภทคลังสินค้า';
        break;
      default:
        this.landCitytype = 'ไม่มีข้อมูล';
    }
  }

  onAdditionalChange($event: any) {
    let payload = null;
    this.landTax = '-'

    
    if (this.landTaxType=='commercial'){
      payload = {
        "LandDataID": this.land.LandDataID,
        "LandType": 1,
      }
    }
    else if (this.landTaxType=='deserted'){
      
      payload = {
        "LandDataID": this.land.LandDataID,
        "LandType": 2,
      }
    }
    else if (this.landTaxType=='residential' &&this.firstHouse !='0'){
      payload = {
        "LandDataID": this.land.LandDataID,
        "LandType": 3,
        "AdditionalInfo": parseInt(this.firstHouse),
      }
    }
    else if (this.landTaxType=='agricultural' && this.legalEntity !='0'){
      payload = {
        "LandDataID": this.land.LandDataID,
        "LandType": 4,
        "AdditionalInfo": parseInt(this.legalEntity),
      }
    }
    
    if (payload != null) {

      this.dashBoardService.landTax(payload).subscribe(
        (response) => {
          
          
          this.landTax = response.tax_amount;          
        },
        (error) => console.error('Error fetching land tax:', error)
      );
    }
  }

  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  getIconName(placeType: string) {
    return this.dashBoardService.getIconName(placeType);
  }
}
