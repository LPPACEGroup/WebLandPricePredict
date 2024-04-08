import { Routes } from '@angular/router';
import { HomeComponent } from './page/home/home.component';
import { CalculatorComponent } from './page/calculator/calculator.component';

export const routes: Routes = [
    {   path: 'Home', component: HomeComponent },
    { path: 'Calculator', component: CalculatorComponent },
    {path:'**',component:HomeComponent}];
    