import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NotiComponent } from '../noti/noti.component';
import { SvgIconModule } from '../svg-icon/svg-icon/svg-icon.module';
import { AuthService } from 'app/service/Auth/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink,SvgIconModule,RouterLinkActive,NotiComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent {


  isDropdownOpen = false;

  constructor(    private authService: AuthService,    private router: Router
  
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
}
