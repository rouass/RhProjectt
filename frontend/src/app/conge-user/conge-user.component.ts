import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-conge-user',
  templateUrl: './conge-user.component.html',
  styleUrls: ['./conge-user.component.css']
})
export class CongeUserComponent implements OnInit{
  constructor(private http: HttpClient) {}
  isAdmin: boolean = false;

  ngOnInit() {
    this.isAdmin = localStorage.getItem('isAdmin') === 'true';
    console.log("isAdmin :" + this.isAdmin);
  }
}
