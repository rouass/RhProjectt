import { Component, OnDestroy, OnInit , ViewChild } from '@angular/core';
import axios from 'axios';
import { Conge } from '../conge.model';
import { ExplanationDialogComponent } from 'src/app/explanation-dialog/explanation-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator'; // Import PageEvent
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
@Component({
  selector: 'app-conge-list',
  templateUrl: './conge-list.component.html',
  styleUrls: ['./conge-list.component.css']
})
export class CongeListComponent implements OnInit, OnDestroy {
  isAdmin: boolean = false;
   showTextArea = false;
  conges: Conge[] = [];
  pageSize =5; // Number of items per page
  page = 1; // Current page
  length : number =0 ;
  displayedConges: Conge[] = [];
  dataSource: MatTableDataSource<Conge> = new MatTableDataSource<Conge>();
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  typeFilterOptions: any[] = [
    { label: 'All Types', value: '' },
    { label: 'Congés annuels payés', value: 'Congés annuels payés' },
    { label: 'Congés maladie', value: 'Congés maladie' },
    { label: 'Congés sans solde', value: 'Congés sans solde' },
    { label: 'Congés de maternité', value: 'Congés de maternité' },


  ];

  statusFilterOptions: any[] = [
    { label: 'All Status', value: '' },
    { label: 'Pending', value: 'pending' },
    { label: 'Confirmed', value: 'confirmed' },
    { label: 'Rejected', value: 'rejected' },
  ];

  selectedTypeFilter: string = '';
  selectedStatusFilter: string = '';

  constructor(private dialog: MatDialog) {}
  /*onIsParagraphVisible(value: boolean) {
    this.showTextArea = value;}*/

    openCreateCongeDialog(congeId: string, status: string): void {
      let showTextArea = status === 'rejected';

      const dialogRef = this.dialog.open(ExplanationDialogComponent, {
        data: { showTextArea, congeId, status },
        disableClose: true,
      });

      dialogRef.afterClosed().subscribe(result => {
      });
    }

  ngOnInit() {
       this.isAdmin = localStorage.getItem('isAdmin') === 'true';
    console.log("isAdmin :" + this.isAdmin);
    this.getCongeList();
    this.dataSource.data = this.conges;
    this.dataSource.paginator = this.paginator;
      this.updateDisplayedConges();

      /*this.length= this.conges.length;
      console.log(this.length);*/
  }

  ngOnDestroy() {}



  getCongeList() {
    const token = localStorage.getItem('token');
    axios
    .get('http://127.0.0.1:8000/conge/lister', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      this.conges = response.data.conges;
      this.length = this.conges.length;

      this.dataSource.data = this.conges;

      this.updateDisplayedConges();
    })
    .catch(error => {
      console.log(error);
    });


  }

  handlePageEvent(event: PageEvent): void {
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDisplayedConges();
  }



  updateDisplayedConges() {
    const startIndex = (this.page - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    console.log(`startIndex: ${startIndex}, endIndex: ${endIndex}`);
    this.displayedConges = this.conges.slice(startIndex, endIndex);
  }


}
