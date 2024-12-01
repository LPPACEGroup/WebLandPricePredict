import { Component } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { LoanCalculatorComponent } from './loan-calculator/loan-calculator.component';
import { LoanCompareComponent } from './loan-compare/loan-compare.component';
import { RefinanceComponent } from './refinance/refinance.component';
import { APRComponent } from './apr/apr.component';
import { MonthlyInstallmentComponent } from './monthly-installment/monthly-installment.component';
import { LoanMaximumComponent } from './loan-maximum/loan-maximum.component';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [MatTabsModule,LoanCalculatorComponent,LoanCompareComponent,RefinanceComponent,APRComponent,MonthlyInstallmentComponent,LoanMaximumComponent],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.css'
})
export class CalculatorComponent {

}
