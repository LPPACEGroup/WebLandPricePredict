import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PinnedPropertyExpandComponent } from '../pinned-property-expand/pinned-property-expand.component';
import { LandListService } from 'app/service/LandList/land-list.service';
import { FollowLand } from 'model/follow.interface';

@Component({
  selector: 'app-dashboard-follow',
  standalone: true,
  imports: [PinnedPropertyExpandComponent],
  templateUrl: './dashboard-follow.component.html',
  styleUrl: './dashboard-follow.component.css'
})
export class DashboardFollowComponent {
  @Input() land: any;
  @Output() followChanged = new EventEmitter<any>(); // Emit event to parent
  

  fowllowState = true;
  constructor(private landListService:LandListService) { }

  unfollowLand() {
        this.fowllowState = !this.fowllowState;
        const follow: FollowLand = {
          LandDataID: this.land.LandDataID,
          Follow: false
        };
        this.landListService.followLand(follow).subscribe();
        this.followChanged.emit(follow);

  }

}
