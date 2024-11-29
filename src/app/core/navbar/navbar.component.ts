import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NotiComponent } from '../noti/noti.component';
import { SvgIconModule } from '../svg-icon/svg-icon/svg-icon.module';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink,SvgIconModule,RouterLinkActive,NotiComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent {
  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
}
