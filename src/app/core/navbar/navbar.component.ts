import { Component, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NotiComponent } from '../noti/noti.component';
import { SvgIconModule } from '../svg-icon/svg-icon/svg-icon.module';
import { AuthService } from 'app/service/Auth/auth.service';
import { UserService } from 'app/service/User/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, SvgIconModule, RouterLinkActive, NotiComponent,CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  profilePicture: string = '';
  hasUnreadNews: boolean = false;
  isDropdownOpen = false;

  @ViewChild(NotiComponent) notiComponent!: NotiComponent;


  constructor(
    private authService: AuthService,
    private router: Router,
    private userService: UserService
  ) {}
  signout() {
    this.authService.signout().subscribe({
      next: (response: any) => {
        console.log(response);
        this.authService.updateSignInStatus(false);
        this.authService.updateUserRole('');
        this.router.navigate(['/Signin']);
      },
      error: (error: any) => {
        console.log(error);
      },
    });
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  ngOnInit() {
    this.userService.getUserId().subscribe({
      next: (response: any) => {
        this.userService.getProfilePicture(response).subscribe({
          next: (response) => {
            console.log('Profile picture:', response);

            const blob = new Blob([response], { type: response.type });
            this.profilePicture = URL.createObjectURL(blob);
          },
          error: (error) => {
            console.error(error);
          },
        });
      },
      error: (error: any) => {
        console.log(error);
      },
    });

    
  }

  public updateUnreadNewsStatus(hasUnreadNews: boolean) {
    console.log('hasUnreadNews:', hasUnreadNews);
    
    this.hasUnreadNews = hasUnreadNews

    console.log(this.hasUnreadNews);
    
  }

  public triggerMarkAllAsRead() {
    if (this.notiComponent) {
      this.notiComponent.markAllAsRead();
    }
  }
}
