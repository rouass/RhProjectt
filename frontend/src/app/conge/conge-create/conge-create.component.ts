import { Component } from '@angular/core';
import { Conge } from '../conge.model';
import { NgForm } from '@angular/forms';
import axios from 'axios';
import { ActivatedRoute } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
@Component({
  selector: 'app-conge-create',
  templateUrl: './conge-create.component.html',
  styleUrls: ['./conge-create.component.css']
})
export class CongeCreateComponent {
  userId: string | null = null;
  congeId:string |null= null ;
  constructor(private route: ActivatedRoute , public dialogRef: MatDialogRef<CongeCreateComponent>) {}
  ngOnInit(): void {
    // Get the user ID from the route parameters
    this.userId = this.route.snapshot.paramMap.get('userId');

  }


  conge: Conge = new Conge();
  errorMessage: string ='';
  isButtonDisabled: boolean = true; // Initialize to true

  veriferDate(){
  }
  checkCongeAvailability() {

    if (this.conge.dateD && this.conge.dateF) {
      const differenceMs = new Date(this.conge.dateF).getTime() - new Date(this.conge.dateD).getTime();
      const differenceDays = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
      this.isButtonDisabled = differenceDays > 10 || differenceDays < 0;
      console.log(differenceDays);
      console.log("buuton disabled " +this.isButtonDisabled);

    } else {
      this.isButtonDisabled = true;
      console.log("buuton disabled " + this.isButtonDisabled);

    }
  }



AddConge(congeForm: NgForm) {
  const congeObj = {
    type: this.conge.type,
    dateD: new Date(this.conge.dateD),
    dateF: new Date(this.conge.dateF),
    cause: this.conge.cause,
    userId: localStorage.getItem('userId'),
  };

  const differenceMs = congeObj.dateF.getTime() - congeObj.dateD.getTime();
  const differenceDays = Math.floor(differenceMs / (1000 * 60 * 60 * 24));
  console.log(differenceDays);

  // Include the token in the request headers
  const token = localStorage.getItem('token');
  const config = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  };

  axios.post('http://127.0.0.1:8000/conge/ajouter', congeObj, config)
    .then(response => {
      console.log(response.data); // You can do something with the response here
      this.congeId= response.data.createdConge._id ;
    })
    .catch(error => {
      console.log(error); // You can do something with the error here
    });

  console.log(this.conge.dateD);
  congeForm.resetForm(); // Reset the form after adding the congé
}
closePopup(): void {
  // Close the dialog
  this.dialogRef.close();
}


}
