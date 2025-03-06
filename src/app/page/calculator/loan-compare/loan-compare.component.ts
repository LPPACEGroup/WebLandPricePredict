import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-loan-compare',
  standalone: true,
  imports: [FormsModule],
  providers: [
    DecimalPipe
  ],
  templateUrl: './loan-compare.component.html',
  styleUrl: './loan-compare.component.css'
})
export class LoanCompareComponent {
  loanAmount!: number;
  loanTerm1!: number;
  loanTerm2!: number;
  interest1!: number;
  interest2!: number;

  monthAmount1!: number;
  monthAmount2!: number;
  totalInterest1!: number;
  totalInterest2!: number;
  monthInterest1!: number;
  monthInterest2!: number;

  monthlyPayment1!: number;
  monthlyPayment2!: number;

  calculate() {
    // 1st loan
    const principalAmount = this.loanAmount;
    const interest1 = this.interest1 / 100;
    this.monthAmount1 = this.loanTerm1 * 12;

    this.totalInterest1 = principalAmount*interest1*this.loanTerm1;
    this.monthInterest1 = this.totalInterest1/this.monthAmount1;

    const principalPerMonth1 = principalAmount / this.monthAmount1;
    this.monthlyPayment1 = principalPerMonth1 + this.monthInterest1;

    // 2nd loan

    const interest2 = this.interest2 / 100;
    this.monthAmount2 = this.loanTerm2 * 12;

    this.totalInterest2 = principalAmount*interest2*this.loanTerm1;
    this.monthInterest2 = this.totalInterest2/this.monthAmount1;

    const principalPerMonth2 = principalAmount / this.monthAmount2;
    this.monthlyPayment2 = principalPerMonth2 + this.monthInterest2;

}
}
