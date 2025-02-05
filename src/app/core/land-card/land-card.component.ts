import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandListService } from 'app/service/LandList/land-list.service';
import { FollowLand } from 'model/follow.interface';
import { AuthService } from 'app/service/Auth/auth.service';
@Component({
  selector: 'app-land-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './land-card.component.html',
  styleUrl: './land-card.component.css',
})
export class LandCardComponent {
  @Input() item: any;
  @Output() followChanged = new EventEmitter<any>(); // Emit event to parent
  fowllowState = false;
  tier!: string;
  isFollowingInProgress: boolean = false;

  constructor(
    private landListService: LandListService,
    private auth: AuthService
  ) {}

  onfollow() {
    // Check if the function is already in progress
    if (this.isFollowingInProgress) {
      console.log('Follow action is already in progress');
      return; // Exit if already in progress
    }
    this.auth.getTier().subscribe((data) => {
      this.tier = data;
    });
    // Lock the function
    this.isFollowingInProgress = true;

    this.landListService.getTotalFollowLand().subscribe(
      (response) => {
        console.log(response,this.tier);
        
        if (this.tier === 'Basic') {
          console.log('enter basic');
          alert(
            'Please upgrade your account to Tier1 or higher to use this feature'
          );
          this.isFollowingInProgress = false; // Unlock before exiting
          return;
        } else if (
          (this.tier === 'Tier1' && response < 3) ||
          (this.tier === 'Tier2' && response < 5) ||
          (this.tier === 'Tier3' && response < 10) ||this.fowllowState === true
        ) {
          this.fowllowState = !this.fowllowState;
          const follow: FollowLand = {
            LandDataID: this.item.LandDataID,
            Follow: this.fowllowState,
          };

          this.landListService.followLand(follow).subscribe(
            () => {
              this.followChanged.emit(follow);
              this.isFollowingInProgress = false; // Unlock after successful follow
              console.log('enter emit');
              return;
            },
            (error) => {
              console.error('Error following land:', error);
              this.isFollowingInProgress = false; // Unlock on error
              return;
            }
          );
        } else {
          console.log('enter tier');
          alert(
            'You have reached the limit of follow land for your current tier in land card'
          );
          this.isFollowingInProgress = false; // Unlock before exiting
        }
      },
      (error) => {
        console.error('Error getting total follow land:', error);
        this.isFollowingInProgress = false; // Unlock on error
      }
    );
  }

  ngOnInit() {

    this.fowllowState = this.item.Follow;
  }
}
