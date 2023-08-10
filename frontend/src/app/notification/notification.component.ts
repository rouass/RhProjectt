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


  userId: string | null = null; // Initialize with null, and it will be set on successful login
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
      // Assuming 'rowIndex' is the index of the notification in the 'notifications' array
      const notificationId = rowIndex // Assuming each notification object has an '_id' property

      // Get the authentication token from where it is stored (e.g., local storage, cookies, etc.)
      const token = localStorage.getItem('token'); // Get the token from localStorage or wherever you stored it

      axios.delete(`http://127.0.0.1:8000/user/deleteNotification/${notificationId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the 'Authorization' header
        },
      })
      .then((response: any) => {
          if (response.data.success) {
              // Notification deleted successfully
              this.notifications.splice(rowIndex, 1);
    // Emit the event with the updated length:
    this.notificationsChanged.emit(this.notifications.length);
          }
      })
      .catch((error: any) => {
          console.log(error);
          // Handle the error
          // You might want to show an error message or perform other actions here
      });
  }




}

