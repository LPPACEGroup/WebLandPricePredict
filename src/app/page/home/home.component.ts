import { Component } from '@angular/core';
import { SvgIconModule } from '../../core/svg-icon/svg-icon/svg-icon.module';
import { ContactPageComponent } from "../contact-page/contact-page.component";
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,

  imports: [SvgIconModule, ContactPageComponent,RouterLink],


  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  scrollToElementbyId(id: string): void {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

}
