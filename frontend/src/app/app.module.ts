import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import{ HttpClientModule} from "@angular/common/http"
import { RouterModule, Routes } from '@angular/router';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CongeCreateComponent } from './conge/conge-create/conge-create.component';
import { CongeListComponent } from './conge/conge-list/conge-list.component';
import { NavHeaderComponent } from './nav-header/nav-header.component';
import { SideNavbarComponent } from './side-navbar/side-navbar.component';
import { SideNavComponent } from './side-nav/side-nav.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { dataSharingService } from './dataSharing.service';

import{MatToolbarModule} from '@angular/material/toolbar';
import{MatSidenavModule} from '@angular/material/sidenav';
import{MatIconModule} from '@angular/material/icon';
import{MatListModule} from '@angular/material/list';
import{MatButtonModule} from '@angular/material/button';
import{MatMenuModule} from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardModule } from '@angular/material/card';
import {MatInputModule} from '@angular/material/input'
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { AuthGuard } from './auth.guard';
import { MatSelectModule } from '@angular/material/select'; // Make sure to import from 'select' instead of 'mat-select'
import { MatFormFieldModule } from '@angular/material/form-field';



import { CongeUserComponent } from './conge-user/conge-user.component';
import { LoginComponent } from './login/login.component';
import { LoginnComponent } from './loginn/loginn.component';
import { AlertModalComponent } from './shared/alert-modal/alert-modal.component';
import { AdminSidenavComponent } from './admin-sidenav/admin-sidenav.component';
import { NavCongeComponent } from './conge/nav-conge/nav-conge.component';
import { MatBadgeModule } from '@angular/material/badge';
import { NotificationComponent } from './notification/notification.component';
import { LoginLayoutComponent } from './login-layout/login-layout.component';
import { ExplanationDialogComponent } from './explanation-dialog/explanation-dialog.component';



@NgModule({
  declarations: [
    AppComponent,
    CongeCreateComponent,
    CongeListComponent,
    NavHeaderComponent,
    SideNavComponent ,
    SideNavbarComponent,
    CongeUserComponent,
    LoginComponent,
    LoginnComponent,
    AlertModalComponent,
    AdminSidenavComponent,
    NavCongeComponent,
    NotificationComponent,
    LoginLayoutComponent,
    ExplanationDialogComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    RouterModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatButtonModule,
    MatMenuModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatDialogModule,
    MatBadgeModule,
    MatSelectModule,
    MatFormFieldModule,
  ],
  providers: [AuthGuard, dataSharingService],
  bootstrap: [AppComponent]
})
export class AppModule { }
