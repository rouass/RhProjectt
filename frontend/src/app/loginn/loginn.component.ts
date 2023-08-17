import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { dataSharingService } from '../dataSharing.service';
import { HttpHeaders, HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-loginn',
  templateUrl: './loginn.component.html',
  styleUrls: ['./loginn.component.css']
})
export class LoginnComponent implements OnInit {
  loginForm!: FormGroup;
  loginError: string = '';
  hide: boolean = true;
  userId: string | null = null; 
  constructor(private http: HttpClient, private router: Router, private snackBar: MatSnackBar,private dataSharingService: dataSharingService) {}

  ngOnInit() {


    this.loginForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)])
    });


  }

  onLogin() {
    const userObj = {
      name: this.loginForm.get('name')?.value,
      password: this.loginForm.get('password')?.value,
    };

    // Send the user credentials to the backend for authentication
    this.http.post<any>('http://127.0.0.1:8000/user/login', userObj, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    }).subscribe(
      (response) => {
        console.log('Login response:', response);

        if (response.success) {
          // Authentication successful, redirect to congeeDetails page
          const { token, isAdmin } = response;
          console.log('Token:', token);
          console.log('isAdmin:', isAdmin);
          localStorage.setItem('token', token); // Save the token in local storage
          localStorage.setItem('isAdmin', isAdmin);
          localStorage.setItem('userId', response._id);
          localStorage.setItem('userName', response.name);
          console.log('Login successful');
          console.log('User name:', userObj.name);
          this.userId = localStorage.getItem('userId');
          console.log(this.userId);
          const userName = userObj.name;
          this.dataSharingService.updateUserName(userName);
          this.router.navigate(['/congeeDetails']);
        } else {
          // Authentication failed, show error message as a snackbar
          const config = new MatSnackBarConfig();
          config.verticalPosition = 'top';
          config.horizontalPosition = 'right';
          config.duration = 4000; // Display duration in milliseconds (optional)
          this.snackBar.open('Login failed: ' + response.message, 'Close', config);
          console.log('Login failed: ' + response.message);
        }
      },
      (error) => {
        // Handle errors
        console.error('Error occurred during login:', error);
        this.snackBar.open('An error occurred during login. Please try again later.', 'Close', {
          duration: 4000, // Display duration in milliseconds (e.g., 5000ms = 5 seconds)
          verticalPosition: 'top',
          horizontalPosition: 'right'
        });
      }
    );
  }


}


 /*axios.post('http://127.0.0.1:8000/user/login', userObj)
    .then(response => {
      console.log(response.data); // You can do something with the response here
    })
    .catch(error => {
      console.log(error); // You can do something with the error here
    });*/

