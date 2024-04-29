import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { SvgIconComponent } from '../svg-icon/svg-icon.component';
import { NotiComponent } from '../noti/noti.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink,SvgIconComponent,RouterLinkActive,NotiComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {

}
