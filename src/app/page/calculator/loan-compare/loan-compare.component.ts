import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe, CommonModule  } from '@angular/common';

@Component({
  selector: 'app-loan-compare',
  standalone: true,
  imports: [FormsModule, CommonModule],
  providers: [
    DecimalPipe
  ],
  templateUrl: './loan-compare.component.html',
  styleUrl: './loan-compare.component.css'
})
export class LoanCompareComponent {


  preventNegative(event: KeyboardEvent) {
    if (event.key === '-' || event.key === 'e') {
      event.preventDefault();
    }
  }


  loanAmount!: number;
  loanTerm1!: number;
  loanTerm2!: number;
  interest1!: number;
  interest2!: number;

  totalInterest1!: number;
  totalInterest2!: number;
  monthInterest1!: number;
  monthInterest2!: number;

  monthlyPayment1!: number;
  monthlyPayment2!: number;

  totalLoanWithInterest1!: number;
  totalLoanWithInterest2!: number;

  calculate() {
    const P = this.loanAmount;
    const r1 = (this.interest1 / 100) / 12;
    const r2 = (this.interest2 / 100) / 12;
    const n1 = this.loanTerm2 * 12;
    const n2 = this.loanTerm2 * 12;

    if (r1 > 0) {
      this.monthlyPayment1 = (P * r1 * Math.pow(1 + r1, n1)) / (Math.pow(1 + r1, n1) - 1);
    } else {
      this.monthlyPayment1 = P / n1; // For zero interest loans
    }

    if (r2 > 0) {
      this.monthlyPayment2 = (P * r2 * Math.pow(1 + r2, n2)) / (Math.pow(1 + r2, n2) - 1);
    } else {
      this.monthlyPayment2 = P / n2; // For zero interest loans
    }

    this.totalLoanWithInterest1 = this.monthlyPayment1 * n1;
    this.totalInterest1 = this.totalLoanWithInterest1 - P;
    this.monthInterest1 = this.totalInterest1 / n1;

    this.totalLoanWithInterest2 = this.monthlyPayment2 * n2;
    this.totalInterest2 = this.totalLoanWithInterest2 - P;
    this.monthInterest2 = this.totalInterest2 / n2;
}
}
