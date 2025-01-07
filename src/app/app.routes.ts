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
import { SigninPageComponent } from './page/signin-page/signin-page.component';
import { SignupPageComponent } from './page/signup-page/signup-page.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
    { path: 'Signin', component: SigninPageComponent },
    { path: 'Signup', component: SignupPageComponent },

    { path: 'Home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'Map', component: MapPageComponent, canActivate: [AuthGuard] },
    { path: 'Dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'Monitor', component: MonitorComponent, canActivate: [AuthGuard] },
    { path: 'Calculator', component: CalculatorComponent, canActivate: [AuthGuard] },
    { path: 'Question', component: QuestionComponent, canActivate: [AuthGuard] },
    { path: 'Contact', component: ContactPageComponent, canActivate: [AuthGuard] },
    { path: 'Profile', component: ProfilePageComponent, canActivate: [AuthGuard] },
    { path: 'Subscription', component: SubscriptionPageComponent, canActivate: [AuthGuard] },
    { path: 'AdminBlog', component: AdminBlogComponent },
    { path: 'AdminSuggest', component: AdminSuggestComponent },
    { path: 'AdminUserManage', component: AdminUserManageComponent },
    { path: 'AdminUserProfile', component: AdminUserProfileComponent },

    { path: '**', redirectTo: '/Signin' },  
];
