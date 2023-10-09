import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CongeUserComponent } from './conge-user/conge-user.component';
import { LoginnComponent } from './loginn/loginn.component';
import { NotificationComponent } from './notification/notification.component';
import { AuthGuard } from './auth.guard';
import { LoginLayoutComponent } from './login-layout/login-layout.component';
import { CongeListComponent } from './conge/conge-list/conge-list.component';
import { TrackingUserComponent } from './tracking-user/tracking-user.component';
import { CalendarComponent } from './calendar/calendar.component';
import { EmployeListComponent } from './employees/employe-list/employe-list.component';
import { UserInfoComponent } from './user-info/user-info.component';
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
      { path: 'pointage', component: TrackingUserComponent },
      { path:'calendar' , component: CalendarComponent},
      { path:'employee' , component: EmployeListComponent  } ,
      { path:'home' , component:UserInfoComponent } ,


    ],
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
