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
  currentLoanTermMonths!: number;

  calculate() {
    const currentMonthlyRate = (this.currentInterestRate / 100) / 12;
    const newMonthlyRate = (this.newInterestRate / 100) / 12;

    const currentLoanTermMonths = this.currentLoanTerm * 12;
    const newLoanTermMonths = this.newLoanTerm * 12;

    let currentMonthlyPaymentCal = this.currentMonthlyPayment

    if (currentMonthlyRate > 0) {
      currentMonthlyPaymentCal = (this.currentLoanAmount * currentMonthlyRate * Math.pow(1 + currentMonthlyRate, currentLoanTermMonths)) / (Math.pow(1 + currentMonthlyRate, currentLoanTermMonths) - 1);
    } else {
      currentMonthlyPaymentCal = this.currentLoanAmount / currentLoanTermMonths; // For zero interest loans
    }

    if (newMonthlyRate > 0) {
      this.newMonthlyPayment = (this.newLoanAmount * newMonthlyRate * Math.pow(1 + newMonthlyRate, newLoanTermMonths)) / (Math.pow(1 + newMonthlyRate, newLoanTermMonths) - 1);
    } else {
      this.newMonthlyPayment = this.newLoanAmount / newLoanTermMonths; // For zero interest loans
    }

    this.currentTotalInterest = (currentMonthlyPaymentCal * currentLoanTermMonths) - this.currentLoanAmount;
    this.newTotalInterest = (this.newMonthlyPayment * newLoanTermMonths) - this.newLoanAmount + this.refinanceCost;

    this.interestSaved = this.currentTotalInterest - this.newTotalInterest;

    this.monthlyDifference = this.currentMonthlyPayment - this.newMonthlyPayment;

    this.currentLoanAmountWithInterest = this.currentLoanAmount + this.currentTotalInterest;
    this.newLoanAmountWithInterest = this.newLoanAmount + this.newTotalInterest;


  }
}

