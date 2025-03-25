import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe, CommonModule  } from '@angular/common';

@Component({
  selector: 'app-loan-calculator',
  standalone: true,
  imports: [FormsModule, CommonModule],
    providers: [
      DecimalPipe
    ],
  templateUrl: './loan-calculator.component.html',
  styleUrl: './loan-calculator.component.css'
})
export class LoanCalculatorComponent {

  validatePositiveInput(event: Event, minValue: number) {
    const inputElement = event.target as HTMLInputElement;
    if (parseFloat(inputElement.value) < minValue) {
      inputElement.value = minValue.toString();
    }
  }

  preventNegative(event: KeyboardEvent) {
    if (event.key === '-' || event.key === 'e') {
      event.preventDefault();
    }
  }

  loanAmount!: number;
  interestRate!: number;
  installmentTerm!: number;

  monthlyPayment!: number;

  monthInterest!: number;
  yearInterest!: number;
  totalLoanWithInterest!: number;

calculate() {
      const P = this.loanAmount;
      const r = (this.interestRate / 100) / 12; // Convert annual rate to monthly
      const n = this.installmentTerm * 12; // Convert years to months

      if (r > 0) {
        this.monthlyPayment = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      } else {
        this.monthlyPayment = P / n; // For zero interest loans
      }

      this.totalLoanWithInterest = this.monthlyPayment * n;
      this.yearInterest = this.totalLoanWithInterest - P;
      this.monthInterest = this.yearInterest / n;
}
}
