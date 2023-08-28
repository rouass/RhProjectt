import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Pointage } from './pointage.model';
import axios from 'axios';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-tracking-user',
  templateUrl: './tracking-user.component.html',
  styleUrls: ['./tracking-user.component.css']
})
export class TrackingUserComponent implements OnInit {
  currentTime$: Observable<Date> = interval(1000).pipe(
    map(() => new Date())
  );

  constructor(private http: HttpClient , private datePipe: DatePipe) {}

  trackingStarted!: boolean ;
  showClockOutSelect: boolean = false;
  showTakeBreakSelect: boolean = false;
  pointages: Pointage[] = [];

  calculateTimeDifference(heureFP: string, heureDP: string): string {
    const [hoursDP, minutesDP, secondsDP] = heureDP.split(':').map(Number);
if(heureFP ===""){
 const now = new Date();
 const hoursNow = this.addLeadingZero(now.getHours());
 const minutesNow = this.addLeadingZero(now.getMinutes());
 const secondsNow = this.addLeadingZero(now.getSeconds());

 heureFP = `${hoursNow}:${minutesNow}:${secondsNow}`;

}
    const [hoursFP, minutesFP, secondsFP] = heureFP.split(':').map(Number);
    const dateDP = new Date();
    dateDP.setHours(hoursDP, minutesDP, secondsDP);
    const dateFP = new Date();
    dateFP.setHours(hoursFP, minutesFP, secondsFP);
    const timeDifferenceMs = dateFP.getTime() - dateDP.getTime();

    const hoursDiff = Math.floor(timeDifferenceMs / 3600000);
    const minutesDiff = Math.floor((timeDifferenceMs % 3600000) / 60000);
    const secondsDiff = Math.floor((timeDifferenceMs % 60000) / 1000);

    const formattedHours = this.addLeadingZero(hoursDiff);
    const formattedMinutes = this.addLeadingZero(minutesDiff);
    const formattedSeconds = this.addLeadingZero(secondsDiff);

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

addLeadingZero(value: number): string {
    return value.toString().padStart(2, '0');
}








  ngOnInit() {
    this.getPointageList();
    console.log(this.pointages);
    console.log("oninit: " + this.trackingStarted);
    this.trackingStarted = this.getTrackingStartedFromLocalStorage();

    this.currentTime$ = interval(1000).pipe(
      map(() => new Date())
    );
  }

  getTrackingStartedFromLocalStorage(): boolean {
    const trackingStartedStored = localStorage.getItem('trackingStarted');
    return trackingStartedStored === 'true';
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
        this.trackingStarted = false;
        localStorage.setItem('trackingStarted', 'false');
        console.log("starts tracking: " + this.trackingStarted);
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
            if (response.success) {
              this.trackingStarted = true;
              localStorage.setItem('trackingStarted', 'true');
              console.log("starts tracking: " + this.trackingStarted);
              console.log('Pointage created successfully');}
               else {
              this.trackingStarted = false;
              localStorage.setItem('trackingStarted', 'false'); // Store in localStorage

              console.log('Pointage creation failed:', response.error);
            }
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
    axios.get('http://127.0.0.1:8000/pointage/lister', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      console.log(response);

      this.pointages = response.data.pointages;
      console.log(this.pointages);

    })
    .catch(error => {
      console.log(error);
    });


  }
}






