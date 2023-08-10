import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CongeUserComponent } from './conge-user/conge-user.component';
import { LoginnComponent } from './loginn/loginn.component';
import { NotificationComponent } from './notification/notification.component';
import { AuthGuard } from './auth.guard';
import { LoginLayoutComponent } from './login-layout/login-layout.component';
import { CongeListComponent } from './conge/conge-list/conge-list.component';

const routes: Routes = [
   { path: '', redirectTo: '/login', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginLayoutComponent, // Use the new layout for the login page
    children: [{ path: '', component: LoginnComponent }]
  },
  {
    path: '',
    component: CongeUserComponent,
    canActivate: [AuthGuard],
    children: [
      { path: 'congeeDetails', component: CongeListComponent},
      { path: 'notification', component: NotificationComponent },
    ],
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
