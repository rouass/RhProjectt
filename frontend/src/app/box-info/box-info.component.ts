import { Component } from '@angular/core';

@Component({
  selector: 'app-box-info',
  templateUrl: './box-info.component.html',
  styleUrls: ['./box-info.component.css']
})
export class BoxInfoComponent {
  currentDateYear: string;
  currentDateTime: string;


  constructor() {
    this.currentDateYear = '';
    this.currentDateTime = '';

  }

  ngOnInit() {
    this.getCurrentDate();
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

}
