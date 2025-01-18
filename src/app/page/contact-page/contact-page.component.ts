import { Component } from '@angular/core';
import { SvgIconModule } from '../../core/svg-icon/svg-icon/svg-icon.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SuggestionService } from 'app/service/sugesstion/suggestion.service';

@Component({
  selector: 'app-contact-page',
  standalone: true,
  imports: [SvgIconModule,ReactiveFormsModule,CommonModule],
  templateUrl: './contact-page.component.html',
  styleUrl: './contact-page.component.css'
})
export class ContactPageComponent {
  feedbackForm: FormGroup;
  pressed = false;
  success = false;

  constructor(private fb: FormBuilder,private suggestionService: SuggestionService) {
    this.feedbackForm = this.fb.group({
      feedback: ['', [Validators.required]]
    });
  }

  onSubmit() {
    this.pressed = true;
    this.success = false;
    if (this.feedbackForm.valid) {
      console.log('Form Submitted:', this.feedbackForm.value);
      this.suggestionService.sendSuggestion(this.feedbackForm.value.feedback).subscribe({
        next: (response) => {
          console.log('Response:', response);
          this.success = true;
          this.pressed = false;
        },
        error: (error: any) => {
          console.error('Error:', error);
        }
      });
    } else {
      console.log('Form is invalid!');
    }
  }

}
