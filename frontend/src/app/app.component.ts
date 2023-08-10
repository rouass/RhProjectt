import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit {
  constructor(private http: HttpClient, private router: Router) {}
  isAdmin: boolean = false;
  isLoginPage: boolean = false;

  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isLoginPage = event.url === '/login';
      }
    });

    this.isAdmin = localStorage.getItem('isAdmin') === 'true';
    console.log("isAdmin :" + this.isAdmin);


  }
}
