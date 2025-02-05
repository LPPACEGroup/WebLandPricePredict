import { Routes } from '@angular/router';
import { HomeComponent } from './page/home/home.component';
import { CalculatorComponent } from './page/calculator/calculator.component';
import { DashboardComponent } from './page/dashboard/dashboard.component';
import { MonitorComponent } from './page/monitor/monitor.component';
import { QuestionComponent } from './page/question/question.component';
import { ContactPageComponent } from './page/contact-page/contact-page.component';
import { ProfilePageComponent } from './page/profile-page/profile-page.component';
import { MapPageComponent } from './page/map-page/map-page.component';
import { AdminBlogComponent } from './page/admin-blog/admin-blog.component';
import { AdminSuggestComponent } from './page/admin-suggest/admin-suggest.component';
import { AdminUserManageComponent } from './page/admin-user-manage/admin-user-manage.component';
import { AdminUserProfileComponent } from './page/admin-user-profile/admin-user-profile.component';
import { SigninPageComponent } from './page/signin-page/signin-page.component';
import { SignupPageComponent } from './page/signup-page/signup-page.component';
import { PaymentComponent } from './page/payment/payment.component';

import { AuthGuard } from './auth.guard';
import { ForgetpasswordComponent } from './page/forgetpassword/forgetpassword.component';
import { ResetpasswordComponent } from './page/resetpassword/resetpassword.component';

export const routes: Routes = [
    { path: 'Signin', component: SigninPageComponent },
    { path: 'Signup', component: SignupPageComponent },
    {path:'ForgotPassword',component:ForgetpasswordComponent},
    {path: 'ResetPassword',component:ResetpasswordComponent},

    { path: 'Home', component: HomeComponent, canActivate: [AuthGuard] ,data: { roles: ['User'] }},
    { path: 'Map', component: MapPageComponent, canActivate: [AuthGuard] },
    { path: 'Dashboard', component: DashboardComponent, canActivate: [AuthGuard] ,data: { roles: ['User'] }},
    { path: 'Monitor', component: MonitorComponent, canActivate: [AuthGuard] ,data: { roles: ['User'] }},
    { path: 'Calculator', component: CalculatorComponent, canActivate: [AuthGuard],data: { roles: ['User'] } },
    { path: 'Question', component: QuestionComponent, canActivate: [AuthGuard],data: { roles: ['User'] } },
    { path: 'Contact', component: ContactPageComponent, canActivate: [AuthGuard] ,data: { roles: ['User'] }},
    { path: 'Profile', component: ProfilePageComponent, canActivate: [AuthGuard] ,data: { roles: ['User'] }},
    {path:"Payment/:tier",component:PaymentComponent,canActivate:[AuthGuard],data:{roles:['User']}},
    { path: 'AdminBlog', component: AdminBlogComponent ,data: { roles: ['Admin'] }},
    { path: 'AdminSuggest', component: AdminSuggestComponent, canActivate: [AuthGuard] ,data: { roles: ['Admin'] }},
    { path: 'AdminUserManage', component: AdminUserManageComponent , canActivate: [AuthGuard],data: { roles: ['Admin'] }},
    {path:'UserPaymentManage/:id',component:AdminUserProfileComponent,canActivate:[AuthGuard],data:{roles:['Admin']}},





  { path: '**', redirectTo: '/Signin' },
];
