import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { CongeCreateComponent } from '../conge-create/conge-create.component';
@Component({
  selector: 'app-nav-conge',
  templateUrl: './nav-conge.component.html',
  styleUrls: ['./nav-conge.component.css']
})
export class NavCongeComponent {
  constructor(private dialog: MatDialog , private router: Router) { }
  isAdmin: boolean = false;

  ngOnInit() {
    this.isAdmin = localStorage.getItem('isAdmin') === 'true';
    console.log("isAdmin :" + this.isAdmin);}


  getCurrentPageText(): string {
    const currentPath = this.router.url;
    if (currentPath === '/congeeDetails') {
      return 'Liste des congés';
    } else if (currentPath === '/notification') {
      return 'Liste de notifications';
    } else {
      return 'Default Text';
    }
  }

  openCreateCongeDialog(): void {
    const dialogRef = this.dialog.open(CongeCreateComponent, {
      width: '500px',
      disableClose: true,
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

}
