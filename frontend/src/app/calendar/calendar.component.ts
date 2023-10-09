import { Component, signal, ChangeDetectorRef , OnInit } from '@angular/core';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import axios from 'axios';
import { Tracking } from '../tracking-user/tracking.model';
import { Pointage } from '../tracking-user/pointage.model';
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})
export class CalendarComponent implements OnInit {
  totalWorkedTime: string = '00:00:00';
  trackers: Tracking[] = [];
  pointages: Pointage[] = [];
  userTotalTimeMap: { [userId: string]: string } = {};
  selectedDate = true ;

  calendarOptions = signal<CalendarOptions>({
    plugins: [
      interactionPlugin,
      dayGridPlugin,
      timeGridPlugin,
      listPlugin,
    ],
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth'
    },
    initialView: 'dayGridMonth',
    weekends: true,
    editable: true,
    selectable: true,
    selectMirror: true,
    dayMaxEvents: true,
    select: this.handleDateSelect.bind(this),
    /* you can update a remote database when these fire:
    eventAdd:
    eventChange:
    eventRemove:
    */
  });
  currentEvents = signal<EventApi[]>([]);

  constructor(private changeDetector: ChangeDetectorRef) {  }
  timerInterval: any; // Interval for updating the timer
  ngOnInit() {
    const currentDate = new Date();
    const currentFormattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;

    // Compare formattedDate with the currentFormattedDate
  //  console.log('The selected date matches the current date.');

    // Appel de la fonction pour récupérer la liste des pointages
    this.getPointageList();
    this.timerInterval = setInterval(() => {
      this.getPointageList();
    }, 1000);
  }

  getPointageList() {
    axios.get('http://127.0.0.1:8000/pointage/lister', {})
      .then(response => {
        //console.log(response);
        this.pointages = response.data.pointages;
        //console.log(this.pointages);

        // Une fois que les données sont disponibles, appelez calculateTotalWorkedTime
        this.userTotalTimeMap = this.calculateTotalWorkedTime(this.pointages);
       // console.log(this.userTotalTimeMap);
      })
      .catch(error => {
        console.log(error);
      });
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const selectedDate = selectInfo.start;
    const formattedDate = `${selectedDate.getDate().toString().padStart(2, '0')}/${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}/${selectedDate.getFullYear()}`;

    const currentDate = new Date();

// Format the current date in the same way as formattedDate
const currentFormattedDate = `${currentDate.getDate().toString().padStart(2, '0')}/${(currentDate.getMonth() + 1).toString().padStart(2, '0')}/${currentDate.getFullYear()}`;

// Compare formattedDate with the currentFormattedDate
if (formattedDate !== currentFormattedDate) {
  this.getCongeList(formattedDate);
  console.log('The selected date does not match the current date.');
  this.selectedDate = false ;
}
else{
  this.selectedDate = true;
}
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect(); // clear date selection
  }

  getCongeList(date: string) {
    axios
      .get('http://127.0.0.1:8000/timeTracker/listerListTimeTracker', {
        params: {
          date: { date }, // Send the date as an object with a "date" property
        },
      })
      .then(response => {
        console.log("date in the getCongeList function", response.config.params.date);
        this.trackers = response.data.listTime; // Assuming the response structure has a "listTime" property
        console.log(this.trackers);
      })
      .catch(error => {
        console.error(error);
      });
  }

  addLeadingZero(value: number): string {
    return value.toString().padStart(2, '0');
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

  calculateTimeDifference(heureFP: string, heureDP: string): string {
    const [hoursDP, minutesDP, secondsDP] = heureDP.split(':').map(Number);
   // console.log("heureFP" , typeof heureDP );

    /*if (heureFP === null || (typeof heureFP === 'string' && heureFP.trim() === "")) {
    console.log("heure farii8");

    const now = new Date();
    const hoursNow = this.addLeadingZero(now.getHours());
    const minutesNow = this.addLeadingZero(now.getMinutes());
    const secondsNow = this.addLeadingZero(now.getSeconds());
    heureFP = `${hoursNow}:${minutesNow}:${secondsNow}`;
   // console.log("heureFP === vide " + heureFP);
    }*/
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


calculateTotalWorkedTime(pointages: Pointage[]): { [userId: string]: string } {
 //this.getPointageList();
  const userTotalTimeMap: { [userId: string]: string } = {}; // Store total working time for each user

  for (const pointage of pointages) {
    const userId = pointage.userId;

    if (!userTotalTimeMap[userId]) {
      userTotalTimeMap[userId] = '00:00:00';
    }
   // console.log("pointage.heureFP" , typeof(pointage.heureFP));
   //console.log("pointage.heureFP" ,typeof pointage.heureFP);
   if (typeof pointage.heureFP === "object"){
   // console.log("heure farii8");

const now = new Date();
const hoursNow = this.addLeadingZero(now.getHours());
const minutesNow = this.addLeadingZero(now.getMinutes());
const secondsNow = this.addLeadingZero(now.getSeconds());
pointage.heureFP = `${hoursNow}:${minutesNow}:${secondsNow}`;
const timeDifference = this.calculateTimeDifference(String(pointage.heureFP), String(pointage.heureDP));
userTotalTimeMap[userId] = this.addTime(userTotalTimeMap[userId], timeDifference);
pointage.heureFP= "" ;
//console.log(pointage.heureFP);

  }
  //console.log(' pointage.heureFP', pointage.heureFP);
else{
    if (pointage.heureDP != null ) {
      const timeDifference = this.calculateTimeDifference(String(pointage.heureFP), String(pointage.heureDP));
      userTotalTimeMap[userId] = this.addTime(userTotalTimeMap[userId], timeDifference);
      //console.log(userTotalTimeMap[userId] );

    }}
  }

  return userTotalTimeMap; // Return the result
}




}
