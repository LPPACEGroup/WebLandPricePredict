import { Component } from '@angular/core';
import { CollapseComponent } from '../../core/collapse/collapse.component';

@Component({
  selector: 'app-question',
  standalone: true,
  imports: [CollapseComponent],
  templateUrl: './question.component.html',
  styleUrl: './question.component.css'
})
export class QuestionComponent {

}
