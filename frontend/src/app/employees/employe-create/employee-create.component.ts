import { Component } from '@angular/core';
import axios  from 'axios';
import { NgForm } from '@angular/forms';
import { employe } from '../employee.model';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-employee-create',
  templateUrl: './employee-create.component.html',
  styleUrls: ['./employee-create.component.css']
})
export class EmployeeCreateComponent {
  constructor(public dialogRef: MatDialogRef<EmployeeCreateComponent>){}
  employe: employe = new employe();

  async AddEmploye(congeForm: NgForm) {
    try {
      const employeObj = {
        name: this.employe.name,
        dateD: this.employe.dateD,
        email: this.employe.email,
        password: this.employe.password,
        isAdmin: false,
        isActive: false,
        tel: this.employe.tel,
      };

      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      };

      const response = await axios.post('http://127.0.0.1:8000/user/ajouter', employeObj, config);

      // Handle the successful response
      console.log(response.data);

      // Reset the form (if needed)
      congeForm.resetForm();
    } catch (error) {
      // Handle the error
      console.error('Error:', error);

      // You can display an error message to the user or perform other error handling actions here
    }
  }


  closePopup(): void {
    this.dialogRef.close();
  }


}
