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
  @Input() tier!: string;
  isFollowingInProgress: boolean = false;
  images: {
    id: string;
    mimeType: string;
    filePath: string;
    blobUrl?: string;
  }[] = [];
  imageBlobUrls: string = '';

  constructor(
    private landListService: LandListService,
    private auth: AuthService
  ) {}

  onfollow() {
    if (this.isFollowingInProgress) {
      console.log('Follow action is already in progress');
      return;
    }

    this.isFollowingInProgress = true;

    // First, get the user's tier

    // Then, get the total follow count
    this.landListService.getTotalFollowLand().subscribe(
      (response) => {
        console.log('Total follows:', response, 'Tier:', this.tier);

        if (this.tier === 'Basic') {
          const modal = document.getElementById(
            'warn_follow_1'
          ) as HTMLDialogElement;
          modal.showModal();
          this.isFollowingInProgress = false;
          return;
        } else if (
          (this.tier === 'Tier1' && response < 1) ||
          (this.tier === 'Tier2' && response < 3) ||
          (this.tier === 'Tier3' && response < 10) ||
          this.fowllowState === true
        ) {
          this.fowllowState = !this.fowllowState;
          const follow: FollowLand = {
            LandDataID: this.item.LandDataID,
            Follow: this.fowllowState,
          };

          this.landListService.followLand(follow).subscribe(
            () => {
              this.followChanged.emit(follow);
              this.isFollowingInProgress = false;
              console.log('Follow state changed:', follow);
            },
            (error) => {
              console.error('Error following land:', error);
              this.isFollowingInProgress = false;
            }
          );
        } else {
          const modal = document.getElementById(
            'warn_follow_2'
          ) as HTMLDialogElement;
          modal.showModal();
          this.isFollowingInProgress = false;
        }
      },
      (error) => {
        console.error('Error getting total follow land:', error);
        this.isFollowingInProgress = false;
      }
    );
  }

  ngOnInit() {
    this.fowllowState = this.item.Follow;

    this.landListService.getLandImages(this.item.LandDataID).subscribe(
      (response: {
        total_images: any;
        images: { image_id: any; mime_type: any; file_path: any }[];
      }) => {
        // console.log('Total images:', response.total_images);
        this.images = response.images.map(
          (img: { image_id: any; mime_type: any; file_path: any }) => ({
            id: img.image_id,
            mimeType: img.mime_type,
            filePath: img.file_path,
          })
        );
        this.landListService.getLandImage(this.images[0].id).subscribe(
          (blob: Blob) => {
            const url = URL.createObjectURL(blob);
            this.imageBlobUrls = url;
          },
          (error: any) => {
            console.error('Error getting land image:', error);
          }
        );
      },
      (error: any) => {
        console.error('Error getting land images:', error);
      }
    );
  }
}
