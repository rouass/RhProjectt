import { Component } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import axios from 'axios';
import { DatePipe } from '@angular/common';
import { DateRange } from 'igniteui-angular';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.css'],
  providers: [DatePipe], // Add DatePipe to providers

})
export class UserInfoComponent {
  public range: DateRange = { start: new Date(), end: new Date(new Date().setDate(new Date().getDate() + 5)) };


  quotes: any;
  holidays: any[] = []; // Array to hold the list of holidays

  currentDateYear: string;
  currentDateTime: string;
  currentTime$: Observable<Date> = interval(1000).pipe(
    map(() => new Date())
  );


  constructor(private http: HttpClient, private router: Router) {
    this.currentDateYear = '';
    this.currentDateTime = '';

 }
  redirectToTimeTracking() {
    this.router.navigate(['/pointage']);
  }
  ngOnInit() {
    this.getCurrentDate();
    this.currentTime$ = interval(1000).pipe(
      map(() => new Date())
    );
      this.getHolidays();
  }

  getCurrentDate() {
    const date = new Date();
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    this.currentDateYear = `${day}/${month}/${year}`;
    this.currentDateTime= `${hours}h${minutes}m`;
  }

  getHolidays() {
  let holidays = [];

    const token = localStorage.getItem('token');
    axios
    .get('http://127.0.0.1:8000/user/listerHoliday')
    .then(response => {
      console.log(response);
      this.holidays = response.data; // Set the list of holidays
    })
    .catch(error => {
      console.log(error);
    });


  }



}
