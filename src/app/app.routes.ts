import { Routes } from '@angular/router';
import { HomeComponent } from './page/home/home.component';
import { CalculatorComponent } from './page/calculator/calculator.component';
import { DashboardComponent } from './page/dashboard/dashboard.component';
import { MonitorComponent } from './page/monitor/monitor.component';
import { QuestionComponent } from './page/question/question.component';
import { ContactPageComponent } from './page/contact-page/contact-page.component';
import { ProfilePageComponent } from './page/profile-page/profile-page.component';
import { SubscriptionPageComponent } from './page/subscription-page/subscription-page.component';
import { MapPageComponent } from './page/map-page/map-page.component';
import { AdminBlogComponent } from './page/admin-blog/admin-blog.component';
import { AdminSuggestComponent } from './page/admin-suggest/admin-suggest.component';
import { AdminUserManageComponent } from './page/admin-user-manage/admin-user-manage.component';
import { AdminUserProfileComponent } from './page/admin-user-profile/admin-user-profile.component';


export const routes: Routes = [
    { path: 'Home', component: HomeComponent },
    { path: 'Map', component: MapPageComponent },
    { path: 'Dashboard', component: DashboardComponent },
    { path: 'Monitor', component: MonitorComponent },
    { path: 'Calculator', component: CalculatorComponent },
    { path: 'Question', component: QuestionComponent },
    { path: 'Contact', component: ContactPageComponent },
    { path: 'Profile', component: ProfilePageComponent },
    { path: 'Subscription', component: SubscriptionPageComponent },
    { path: 'AdminBlog', component: AdminBlogComponent },
    { path: 'AdminSuggest', component: AdminSuggestComponent },
    { path: 'AdminUserManage', component: AdminUserManageComponent },
    { path: 'AdminUserProfile', component: AdminUserProfileComponent },

    {path:'**',component:HomeComponent},
];
