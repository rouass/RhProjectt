import { Component , OnInit } from '@angular/core';
import { dataSharingService } from '../dataSharing.service';
import { HttpClient } from '@angular/common/http';

import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-header',
  templateUrl: './nav-header.component.html',
  styleUrls: ['./nav-header.component.css']
})
export class NavHeaderComponent implements OnInit {
  userName: any;
  notifications: any[] = [];
  isAdmin: boolean = false;


  userId: string | null = null;

  constructor(private dataSharingService: dataSharingService , private router: Router, private http: HttpClient ) {}

  redirectToNotifications() {
    this.router.navigate(['/notification']);
  }
  ngOnInit() {
    this.userName = this.dataSharingService.getUserName();
      const userId = localStorage.getItem('userId');
    console.log("user id mn nav header" + userId);

    this.isAdmin = localStorage.getItem('isAdmin') === 'true';

    this.userId = localStorage.getItem('userId');

    if (!this.userId) {
      console.log('User ID not available. Please log in first.');
    } else {
      console.log('User ID:', this.userId);
      this.getNotifications();
    }
  }
  getNotifications() {
    this.http.get<any[]>(`http://127.0.0.1:8000/user/notifications?userId=${this.userId}`)
      .subscribe(
        (data) => {
          console.log("notification mn notification list " );
          console.log(data);
          this.notifications = data;
        },
        (error) => {
          console.log('Error fetching notifications:', error);
        }
      );
  }

}
