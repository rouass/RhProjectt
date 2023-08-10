import { Component, Inject ,Optional,  Input , Output, EventEmitter} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import axios from 'axios';

@Component({
  selector: 'app-explanation-dialog',
  templateUrl: './explanation-dialog.component.html',
})
export class ExplanationDialogComponent {
  public showTextArea: boolean; // Make the property public
  public congeId: string; // Declare the congeId property
  public status: string;
  public explanation: string = ''; // Declare and initialize the explanation property

  @Output() isParagraphVisibleChanged: EventEmitter<boolean> = new EventEmitter<boolean>();



  constructor(
    public dialogRef: MatDialogRef<ExplanationDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.showTextArea = data?.showTextArea || false; // Initialize showTextArea from the data passed to the dialog
    this.congeId = data?.congeId || ''; // Initialize congeId from the data passed to the dialog
    this.status = data?.status || '';
  }

  onClose(): void {
    this.dialogRef.close(); // Close the dialog when "Annuler" is clicked
    this.isParagraphVisibleChanged.emit(false); // Emit event to set isParagraphVisible to false
  }




  updateCongeStatus() {
    const requestData = {
      congeId: this.congeId,
      status: this.status,
      explanation: this.explanation,
    };

    console.log('requestData:', requestData);

    const token = localStorage.getItem('token');
    axios
      .post(`http://127.0.0.1:8000/conge/updateStatus/${requestData.congeId}`, requestData, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
      .then(response => {
        console.log('Response:', response.data);
      })
      .catch(error => {
        console.log('Error:', error);
      });

    this.dialogRef.close();
    this.isParagraphVisibleChanged.emit(false);
  }


}
