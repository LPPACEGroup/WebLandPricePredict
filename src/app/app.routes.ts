import { Routes } from '@angular/router';
import { HomeComponent } from './page/home/home.component';
import { CalculatorComponent } from './page/calculator/calculator.component';
import { MapComponent } from './page/map/map.component';
import { DashboardComponent } from './page/dashboard/dashboard.component';
import { MonitorComponent } from './page/monitor/monitor.component';
import { QuestionComponent } from './page/question/question.component';
import { ContactPageComponent } from './page/contact-page/contact-page.component';
import { ProfilePageComponent } from './page/profile-page/profile-page.component';
import { SubscriptionPageComponent } from './page/subscription-page/subscription-page.component';

export const routes: Routes = [
    {   path: 'Home', component: HomeComponent },
    { path: 'Map', component: MapComponent },
    { path: 'Dashboard', component: DashboardComponent },
    { path: 'Monitor', component: MonitorComponent },
    { path: 'Calculator', component: CalculatorComponent },
    { path: 'Question', component: QuestionComponent },
    { path: 'Contact', component: ContactPageComponent },
    { path: 'Profile', component: ProfilePageComponent },
    { path: 'Subscription', component: SubscriptionPageComponent },

    {path:'**',component:HomeComponent},
];
    