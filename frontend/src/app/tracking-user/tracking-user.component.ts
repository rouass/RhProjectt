import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Pointage } from './pointage.model';
import axios from 'axios';
import { Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-tracking-user',
  templateUrl: './tracking-user.component.html',
  styleUrls: ['./tracking-user.component.css'],
  providers: [DatePipe],
})
export class TrackingUserComponent implements OnInit {


  storedNumFois!: number;
numFois: number = 0;
  currentTime$: Observable<Date> = interval(1000).pipe(
    map(() => new Date())
  );



  formattedDate!: string;
  currentDate: string;
  totalWorkedTime!: string ;

  constructor(private http: HttpClient , private datePipe: DatePipe) {
    const currentDate = new Date();
    const formattedDate = this.datePipe.transform(currentDate, 'MMMM d, y');
    if (formattedDate !== null) {
      this.currentDate = formattedDate;
    } else {
      this.currentDate = 'Date not available';
    }
    console.log("construcor this.totalWorkedTime " +  this.totalWorkedTime);
    this.calculateTotalWorkedTime();
  }

  ngOnInit() {
    this.getPointageList();
    this.getFirstPointage();
    console.log(this.pointages);
    console.log("oninit: " + this.trackingStarted);
    this.trackingStarted = this.getTrackingStartedFromLocalStorage();

    this.currentTime$ = interval(1000).pipe(
      map(() => new Date())
    );
      console.log("this.totalWorkedTime" + this.totalWorkedTime);
this.calculateTotalWorkedTime() ;
  }

  trackingStarted!: boolean ;
  showClockOutSelect: boolean = false;
  showTakeBreakSelect: boolean = false;
  pointages: Pointage[] = [];
  firstPoinatge : Pointage[] =[];
  calculateTimeDifference(heureFP: string, heureDP: string): string {
        const [hoursDP, minutesDP, secondsDP] = heureDP.split(':').map(Number);
        if(heureFP ===""){
        const now = new Date();
        const hoursNow = this.addLeadingZero(now.getHours());
        const minutesNow = this.addLeadingZero(now.getMinutes());
        const secondsNow = this.addLeadingZero(now.getSeconds());
        heureFP = `${hoursNow}:${minutesNow}:${secondsNow}`;
       // console.log("heureFP === vide " + heureFP);
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


  getTrackingStartedFromLocalStorage(): boolean {
    const trackingStartedStored = localStorage.getItem('trackingStarted');
    return trackingStartedStored === 'true';
  }

  pauseTracking(status:string){
    try{
    this.trackingStarted = false;
    this.showClockOutSelect = true;
    this.showTakeBreakSelect = true;
    const currentDate: Date = new Date();
    const hours: number = currentDate.getHours();
    const minutes: number = currentDate.getMinutes();
    const seconds: number = currentDate.getSeconds();


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
        if(status==='finJob'){
          localStorage.setItem('numFois','-1');
        }

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
      const formattedDate = new Date().toLocaleDateString('en-GB');
      console.log(currentDate);

      this.storedNumFois = parseInt(localStorage.getItem('numFois') || '0', 10);
      if (this.storedNumFois !== null) {
        this.storedNumFois += 1;
        localStorage.setItem('numFois', this.storedNumFois.toString());
        console.log("localStorage.getItem('numFois') after increment: " + localStorage.getItem('numFois'));
      }



      const pointageObj = {
        type: 'debut du travail',
        heureDP: `${this.addLeadingZero(hours)}:${this.addLeadingZero(minutes)}:${this.addLeadingZero(seconds)}`,
        heureDF: null,
        date: formattedDate,
        numFois: this.storedNumFois,
      };

      this.numFois += 1;
      console.log("after updated" + this.numFois);

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
              localStorage.setItem('trackingStarted', 'false');

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

  getFirstPointage() {
    const token = localStorage.getItem('token');
    axios.get('http://127.0.0.1:8000/pointage/listerFirstPointage', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then(response => {
      console.log(response);
      this.firstPoinatge = response.data.pointages;

      if (this.firstPoinatge && this.firstPoinatge.length > 0) {
        console.log("firstPoinatge", this.firstPoinatge[0].heureDP);
      } else {
        console.log("firstPoinatge is undefined or empty");
      }
    })
    .catch(error => {
      console.log(error);
    });
  }



addTime(time1: string, time2: string): string {
  const [hours1, minutes1, seconds1] = time1.split(':').map(Number);
  const [hours2, minutes2, seconds2] = time2.split(':').map(Number);

  let totalHours = hours1 + hours2;
  let totalMinutes = minutes1 + minutes2;
  let totalSeconds = seconds1 + seconds2;

  if (totalSeconds >= 60) {
    totalMinutes += Math.floor(totalSeconds / 60);
    totalSeconds %= 60;
  }

  if (totalMinutes >= 60) {
    totalHours += Math.floor(totalMinutes / 60);
    totalMinutes %= 60;
  }

  const formattedHours = this.addLeadingZero(totalHours);
  const formattedMinutes = this.addLeadingZero(totalMinutes);
  const formattedSeconds = this.addLeadingZero(totalSeconds);

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

calculateTotalWorkedTime() {
  let totalWorkedTime = '00:00:00';
  if (this.pointages && Array.isArray(this.pointages)) {
    for (const pointage of this.pointages) {
      if (pointage.heureFP == null) {
        let heureDP = String(pointage.heureDP);

        const now = new Date();
        const hoursNow = this.addLeadingZero(now.getHours());
        const minutesNow = this.addLeadingZero(now.getMinutes());
        const secondsNow = this.addLeadingZero(now.getSeconds());
        let heureFP = `${hoursNow}:${minutesNow}:${secondsNow}`;
        const timeDifference = this.calculateTimeDifference(heureFP, heureDP);
        totalWorkedTime = this.addTime(totalWorkedTime, timeDifference);
      }
      if (pointage && typeof pointage.heureFP === 'string' && typeof pointage.heureDP === 'string') {
        const timeDifference = this.calculateTimeDifference(pointage.heureFP, pointage.heureDP);
        totalWorkedTime = this.addTime(totalWorkedTime, timeDifference);
      }
    }
  }
  return totalWorkedTime;
}



}
