import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandListService } from 'app/service/LandList/land-list.service';
import { FollowLand } from 'model/follow.interface';
@Component({
  selector: 'app-land-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './land-card.component.html',
  styleUrl: './land-card.component.css'
})
export class LandCardComponent {
  @Input() item: any;
  @Output() followChanged = new EventEmitter<any>(); // Emit event to parent
  fowllowState = false;
  constructor(private landListService : LandListService) {}

  onfollow() {
    this.fowllowState = !this.fowllowState;
    const follow: FollowLand = {
      LandDataID: this.item.LandDataID,
      Follow: this.fowllowState
    };
    this.landListService.followLand(follow).subscribe();
    this.followChanged.emit(follow);
  }

  ngOnInit() {
    this.fowllowState = this.item.Follow;
    
  }
}
