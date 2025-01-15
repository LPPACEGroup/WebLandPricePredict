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
import { AdminCreateBlogComponent } from './core/admin-create-blog/admin-create-blog.component';
import { AdminDelBlogComponent } from './core/admin-del-blog/admin-del-blog.component';
import { ConfirmPaymentComponent } from './core/confirm-payment/confirm-payment.component';
import { ConfirmLogoutComponent } from './core/confirm-logout/confirm-logout.component';


import { AuthGuard } from './auth.guard';

export const routes: Routes = [
  { path: 'Signin', component: SigninPageComponent },
  { path: 'Signup', component: SignupPageComponent },

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

  { path: 'AdminCreateBlog', component: AdminCreateBlogComponent },
  { path: 'AdminDelBlog', component: AdminDelBlogComponent },
  { path: 'ConfirmPayment', component: ConfirmPaymentComponent },
  { path: 'ConfirmLogout', component: ConfirmLogoutComponent },

  { path: '**', redirectTo: '/Signin' },
];
