// data-sharing.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class dataSharingService {
  private userName: any;

  constructor() {}

  // Method to update the shared data
  updateUserName(data: any) {
    this.userName = data;
  }

  // Method to access the shared data
  getUserName() {
    return this.userName;
  }
}
