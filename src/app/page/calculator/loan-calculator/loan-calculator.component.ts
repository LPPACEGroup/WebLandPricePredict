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
loanAmount!: number;
interestRate!: number;
installmentTerm!: number;
monthlyPayment!: number;
monthInterest!: number;
  yearInterest!: number;
  totalLoanWithInterest!: number;
  principalPayment!: number;


calculate() {
  const monthlyInterestRate = this.interestRate / 100 / 12;
  const numberOfPayments = this.installmentTerm * 12;

  this.monthlyPayment = (this.loanAmount * monthlyInterestRate) /
    (1 - Math.pow(1 + monthlyInterestRate, -numberOfPayments));

    this.monthInterest = this.monthlyPayment * monthlyInterestRate;
    this.yearInterest = this.monthInterest * 12 * this.installmentTerm;
    this.totalLoanWithInterest = this.monthlyPayment * numberOfPayments;
}
}
