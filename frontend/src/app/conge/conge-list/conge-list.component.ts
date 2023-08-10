import { Component, OnDestroy, OnInit } from '@angular/core';
import axios from 'axios';
import { Conge } from '../conge.model';
import { ExplanationDialogComponent } from 'src/app/explanation-dialog/explanation-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-conge-list',
  templateUrl: './conge-list.component.html',
  styleUrls: ['./conge-list.component.css']
})
export class CongeListComponent implements OnInit, OnDestroy {
  isAdmin: boolean = false;
   showTextArea = false;
  conges: Conge[] = [];

  typeFilterOptions: any[] = [
    { label: 'All Types', value: '' },
    { label: 'Congés annuels payés', value: 'Congés annuels payés' },
    { label: 'Congés maladie', value: 'Congés maladie' },
    { label: 'Congés sans solde', value: 'Congés sans solde' },
    { label: 'Congés de maternité', value: 'Congés de maternité' },

    // Add more type options as needed
  ];

  statusFilterOptions: any[] = [
    { label: 'All Status', value: '' },
    { label: 'Pending', value: 'pending' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Rejected', value: 'rejected' },
  ];

  selectedTypeFilter: string = ''; // Holds the selected type filter value
  selectedStatusFilter: string = ''; // Holds the selected status filter value

  constructor(private dialog: MatDialog) {}
  /*onIsParagraphVisible(value: boolean) {
    this.showTextArea = value;}*/

    openCreateCongeDialog(congeId: string, status: string): void {
      let showTextArea = status === 'rejected'; // Set showTextArea based on the status

      const dialogRef = this.dialog.open(ExplanationDialogComponent, {
        data: { showTextArea, congeId, status },
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe(result => {
        // Optionally handle any logic after the dialog is closed
      });
    }

  ngOnInit() {
       this.isAdmin = localStorage.getItem('isAdmin') === 'true';
    console.log("isAdmin :" + this.isAdmin);
    this.getCongeList();
  }

  ngOnDestroy() {}



  getCongeList() {
    const token = localStorage.getItem('token'); // Get the token from localStorage or wherever you stored it
    axios
      .get('http://127.0.0.1:8000/conge/lister', {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the 'Authorization' header
        },
      })
      .then(response => {
        console.log(response.data.conges);
        this.conges = response.data.conges;
      })
      .catch(error => {
        console.log(error);
      });
  }
}
