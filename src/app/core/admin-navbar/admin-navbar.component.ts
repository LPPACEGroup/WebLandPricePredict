import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NotiComponent } from '../noti/noti.component';
import { SvgIconModule } from '../svg-icon/svg-icon/svg-icon.module';
import { AuthService } from 'app/service/Auth/auth.service';

@Component({
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [RouterLink,SvgIconModule,RouterLinkActive,NotiComponent],
  templateUrl: './admin-navbar.component.html',
  styleUrl: './admin-navbar.component.css'
})

export class AdminNavbarComponent {


  isDropdownOpen = false;

  constructor(    private authService: AuthService,    private router: Router
  
  ) {}
  signout() {
    this.authService.signout().subscribe({
      next: (response: any) => {
        console.log(response);
        this.authService.updateSignInStatus(false);
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
}
