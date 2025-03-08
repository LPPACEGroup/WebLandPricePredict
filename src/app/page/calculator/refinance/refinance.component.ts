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
  currentLoanTerm!: number;
  currentInterestRate!: number;

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
    const currentMonthlyRate = this.currentInterestRate / 100 / 12;
    const newMonthlyRate = this.newInterestRate / 100 / 12;

    const currentLoanTermMonths = this.currentLoanTerm * 12;
    const newLoanTermMonths = this.newLoanTerm * 12;

    const currentMonthlyPayment = this.currentLoanAmount * currentMonthlyRate / (1 - Math.pow(1 + currentMonthlyRate, -currentLoanTermMonths));
    const newMonthlyPayment = this.newLoanAmount * newMonthlyRate / (1 - Math.pow(1 + newMonthlyRate, -newLoanTermMonths));

    this.currentTotalInterest = (currentMonthlyPayment * currentLoanTermMonths) - this.currentLoanAmount;
    this.newTotalInterest = (newMonthlyPayment * newLoanTermMonths) - this.newLoanAmount + this.refinanceCost;

    this.interestSaved = this.currentTotalInterest - this.newTotalInterest;
    this.newMonthlyPayment = newMonthlyPayment;
    this.monthlyDifference = currentMonthlyPayment - newMonthlyPayment;
    this.currentLoanAmountWithInterest = this.currentLoanAmount + this.currentTotalInterest;
    this.newLoanAmountWithInterest = this.newLoanAmount + this.newTotalInterest;


  }
}

