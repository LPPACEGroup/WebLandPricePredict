import { Routes } from '@angular/router';
import { HomeComponent } from './page/home/home.component';
import { CalculatorComponent } from './page/calculator/calculator.component';
import { MapComponent } from './page/map/map.component';
import { DashboardComponent } from './page/dashboard/dashboard.component';
import { MonitorComponent } from './page/monitor/monitor.component';

export const routes: Routes = [
    {   path: 'Home', component: HomeComponent },
    { path: 'Map', component: MapComponent },
    { path: 'Dashboard', component: DashboardComponent },
    { path: 'Monitor', component: MonitorComponent },
    { path: 'Calculator', component: CalculatorComponent },
    {path:'**',component:HomeComponent},
];
    