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
  monthlyIncome!: number;
  loanTerm!: number;
  interestRate!: number;
  maximumLoanPercentage!: number;
  monthlyDebt!: number;
  maximumLoanAmount!: number;
  newMonthlyPayment!: number;
  averageLoanRatio = 150;
calculate() {
    // const monthlyIncome = parseFloat(this.monthlyIncome);
    // const loanTerm = parseFloat(this.loanTerm);
    // const interestRate = parseFloat(this.interestRate) / 100 / 12;
    // const maximumLoanPercentage = parseFloat(this.maximumLoanPercentage) / 100;
    // const monthlyDebt = parseFloat(this.monthlyDebt);

    const newInterestRate = this.interestRate / 100 / 12;
    const newMaximumLoanPercentage = this.maximumLoanPercentage / 100;
    const numberOfPayments = this.loanTerm * 12;

    this.maximumLoanAmount = ((this.monthlyIncome - this.monthlyDebt  ) * newMaximumLoanPercentage)* this.averageLoanRatio;

    this.newMonthlyPayment = this.maximumLoanAmount * newInterestRate / (1 - Math.pow(1 + newInterestRate, -numberOfPayments));

  }
}

