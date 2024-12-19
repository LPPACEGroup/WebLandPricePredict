import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { NavbarComponent } from './core/navbar/navbar.component';
import { CarouselComponent } from './core/carousel/carousel.component'; // Adjust the path as necessary
import { AuthService } from './service/Auth/auth.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    NavbarComponent,
    CommonModule,
    HttpClientModule,
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'WebLandPricePredict';
  IsSignedIn: boolean = false;

  constructor(private authService: AuthService, private router: Router) {
    this.authService.isAuthenticated().subscribe({
      next: (isAuthenticated: boolean) => {
        this.IsSignedIn = isAuthenticated;
        if (isAuthenticated) {
          this.router.navigate(['/Home']); // Navigate to Home if authenticated
        } else {
          this.router.navigate(['/Signin']); // Navigate to Signin if not authenticated
          console.log('Not authenticated');
        }
      },
    });
  }
  ngOnInit() {
    this.authService.isSignedIn$.subscribe((isSignedIn) => {
      this.IsSignedIn = isSignedIn;
    });
  }
}
