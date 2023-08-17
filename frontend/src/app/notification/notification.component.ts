import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import axios from 'axios';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {

  notifications: any[] = [];
  isAdmin: boolean = false;


  userId: string | null = null;
  @Output() notificationsChanged = new EventEmitter<number>();

  constructor(private http: HttpClient) { }
  ngOnInit() {
    this.isAdmin = localStorage.getItem('isAdmin') === 'true';

    this.userId = localStorage.getItem('userId');

    if (!this.userId) {
      console.log('User ID not available. Please log in first.');
    } else {
      console.log('User ID:', this.userId);
      this.getNotifications();
    }
    this.notificationsChanged.emit(this.notifications.length);

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


  deleteNotification(rowIndex: number) {
      const notificationId = rowIndex
      const token = localStorage.getItem('token');

      axios.delete(`http://127.0.0.1:8000/user/deleteNotification/${notificationId}`, {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      })
      .then((response: any) => {
          if (response.data.success) {
              this.notifications.splice(rowIndex, 1);
    this.notificationsChanged.emit(this.notifications.length);
          }
      })
      .catch((error: any) => {
          console.log(error);
      });
  }




}

