import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { CongeCreateComponent } from '../conge-create/conge-create.component';
import { EmployeeCreateComponent } from 'src/app/employees/employe-create/employee-create.component';
@Component({
  selector: 'app-nav-conge',
  templateUrl: './nav-conge.component.html',
  styleUrls: ['./nav-conge.component.css']
})
export class NavCongeComponent {
  constructor(private dialog: MatDialog , private router: Router) { }
  isAdmin: boolean = false;
  currentPath = this.router.url;

  ngOnInit() {
    this.isAdmin = localStorage.getItem('isAdmin') === 'true';
    console.log("isAdmin :" + this.isAdmin);}


  getCurrentPageText(): string {
    if (this.currentPath === '/congeeDetails') {
      return 'Liste des Congés';
    } else if (this.currentPath === '/notification') {
      return 'Liste de Notifications';
    }  else if (this.currentPath === '/calendar') {
      return 'Liste des Pointages';
    }
    else if (this.currentPath === '/pointage') {
      return 'Pointage';
    }
    else if (this.currentPath === '/employee') {
      return 'Liste des Employées';
    }else {
      return 'Default Text';
    }
  }

  openCreateCongeDialog(): void {
    if (this.currentPath === '/congeeDetails') {
    const dialogRef = this.dialog.open(CongeCreateComponent, {
      width: '500px',
      disableClose: true,
      data: {}
    });

  } else {
    const dialogRef = this.dialog.open(EmployeeCreateComponent, {
      width: '500px',
      disableClose: true,
      data: {}
    });
  }
    };
  }

