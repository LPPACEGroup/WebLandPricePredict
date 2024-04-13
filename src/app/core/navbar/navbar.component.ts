import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink,SvgIconComponent,RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

}
