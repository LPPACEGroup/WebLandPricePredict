import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe, CommonModule  } from '@angular/common';
import { Directive, HostListener, ElementRef } from '@angular/core';

@Component({
  selector: 'app-refinance',
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [
    DecimalPipe
  ],
  templateUrl: './refinance.component.html',
  styleUrl: './refinance.component.css'
})
export class RefinanceComponent {

// formatNumber($event: KeyboardEvent) {
//   const input = $event.target as HTMLInputElement;
//   let value = input.value.replace(/,/g, '');
//   value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
//   input.value = value;
// }

  // current
  currentLoanAmount!: number;
  currentMonthlyPayment! : number;
  currentInterestRate!: number;
  currentLoanTerm!: number;

  // new
  newLoanAmount!: number;
  newLoanTerm!: number;
  refinanceCost!: number;
  newInterestRate!: number;

// cal
  interestSaved!: number;
  newMonthlyPayment!: number;
  monthlyDifference!: number;
  currentTotalInterest!: number;
  newTotalInterest!: number;
  currentLoanAmountWithInterest!: number;
  newLoanAmountWithInterest!: number;


  calculate() {
    const currentMonthlyInterestRate = this.currentInterestRate / 100 / 12;
    const currentNumberOfPayments = this.currentLoanTerm * 12;

    const newMonthlyInterestRate = this.newInterestRate / 100 / 12;
    const newNumberOfPayments = this.newLoanTerm * 12;

    this.currentMonthlyPayment = ((this.currentLoanAmount + this.refinanceCost) * currentMonthlyInterestRate) /
      (1 - Math.pow(1 + currentMonthlyInterestRate, -currentNumberOfPayments));

    this.newMonthlyPayment = ((this.newLoanAmount + this.refinanceCost) * newMonthlyInterestRate) /
      (1 - Math.pow(1 + newMonthlyInterestRate, -newNumberOfPayments));

      this.currentTotalInterest = (this.currentMonthlyPayment * currentNumberOfPayments) - this.currentLoanAmount;
      this.newTotalInterest = (this.newMonthlyPayment * newNumberOfPayments) - this.newLoanAmount;

      this.interestSaved = this.currentTotalInterest - this.newTotalInterest;
      this.monthlyDifference = this.currentMonthlyPayment - this.newMonthlyPayment;

      this.currentLoanAmountWithInterest = this.currentLoanAmount + this.currentTotalInterest;
      this.newLoanAmountWithInterest = this.newLoanAmount + this.newTotalInterest;
  }
}

