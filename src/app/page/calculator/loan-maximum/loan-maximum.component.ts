import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe, CommonModule  } from '@angular/common';
import { Directive, HostListener, ElementRef } from '@angular/core';

@Component({
  selector: 'app-loan-maximum',
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [
    DecimalPipe
  ],
  templateUrl: './loan-maximum.component.html',
  styleUrl: './loan-maximum.component.css'
})
export class LoanMaximumComponent {

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

  monthlyIncome!: number;
  loanTerm!: number;
  interestRate!: number;
  DTI!: number;
  monthlyDebt!: number;

  maximumLoanAmount!: number;
  newMonthlyPayment!: number;


calculate() {
    const r = this.interestRate / 12 / 100; // Monthly interest rate
    const n = this.loanTerm * 12; // Total number of months
    const maxEMI = (this.monthlyIncome * this.DTI) / 100 - this.monthlyDebt;

    if (this.monthlyIncome > 0 && this.DTI > 0 && this.interestRate > 0 && this.loanTerm > 0) {
      if (maxEMI <= 0) {
        this.maximumLoanAmount = 0;
        return;
      }
      if (r === 0) {
        this.maximumLoanAmount = maxEMI * n; // If 0% interest, it's just EMI * months
      } else {
        this.maximumLoanAmount = (maxEMI * (1 - Math.pow(1 + r, -n))) / r;
      }
    }

    if (r > 0) {
      this.newMonthlyPayment = (this.maximumLoanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    } else {
      this.newMonthlyPayment = this.maximumLoanAmount / n; // For zero interest loans
    }
  }
}

