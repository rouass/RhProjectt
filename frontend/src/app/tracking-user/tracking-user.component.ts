import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Pointage } from './pointage.model';
import axios from 'axios';


@Component({
  selector: 'app-tracking-user',
  templateUrl: './tracking-user.component.html',
  styleUrls: ['./tracking-user.component.css']
})
export class TrackingUserComponent implements OnInit {
  currentTime: Date = new Date();
  constructor(private http: HttpClient) {}

  trackingStarted: boolean = false;
  showClockOutSelect: boolean = false;
  showTakeBreakSelect: boolean = false;
  pointages: Pointage[] = [];

  ngOnInit() {
    this.getPointageList();

  }

  private addLeadingZero(value: number): string {
    return value < 10 ? `0${value}` : value.toString();
  }

  pauseTracking(){
    try{

    this.trackingStarted = false;
    this.showClockOutSelect = true;
    this.showTakeBreakSelect = true;
    const currentDate: Date = new Date();
    const hours: number = currentDate.getHours();
    const minutes: number = currentDate.getMinutes();
    const seconds: number = currentDate.getSeconds();
    const formattedDate: string = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;


    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    const pointageObjPause = {
      heureFP: `${this.addLeadingZero(hours)}:${this.addLeadingZero(minutes)}:${this.addLeadingZero(seconds)}`,
    };

    this.http.post('http://127.0.0.1:8000/pointage/modifier', pointageObjPause, { headers })
    .subscribe(
      (response: any) => {
        console.log('hii');
        console.log(response);
      },
      (error: any) => {
        console.log('Error making HTTP request:', error);

      }
    );
} catch (error) {
  console.log('An error occurred:', error);
}

  }


  startTracking() {
    try {
      this.trackingStarted = true;
      this.showClockOutSelect = false;
      this.showTakeBreakSelect = false;
      const currentDate: Date = new Date();

      const hours: number = currentDate.getHours();
      const minutes: number = currentDate.getMinutes();
      const seconds: number = currentDate.getSeconds();

      const formattedDate: string = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;

      const pointageObj = {
        type: 'debut du travail',
        heureDP: `${this.addLeadingZero(hours)}:${this.addLeadingZero(minutes)}:${this.addLeadingZero(seconds)}`,
        heureDF: null,
        date: formattedDate,
      };

      const token = localStorage.getItem('token');
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      });

      this.http.post('http://127.0.0.1:8000/pointage/ajouter', pointageObj, { headers })
        .subscribe(
          (response: any) => {
            console.log(response);
          },
          (error: any) => {
            console.log('Error making HTTP request:', error);
           
          }
        );
    } catch (error) {
      console.log('An error occurred:', error);
    }
  }

  getPointageList(){

      const token = localStorage.getItem('token');
      axios.get('http://127.0.0.1:8000/conge/lister', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(response => {
        this.pointages = response.data.conges;
        console.log(this.pointages);

      })
      .catch(error => {
        console.log(error);
      });


    }
  }
