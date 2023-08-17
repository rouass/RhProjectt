import { Component, Inject ,Optional,  Input , Output, EventEmitter} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import axios from 'axios';

@Component({
  selector: 'app-explanation-dialog',
  templateUrl: './explanation-dialog.component.html',
})
export class ExplanationDialogComponent {
  public showTextArea: boolean;
  public congeId: string;
  public status: string;
  public explanation: string = '';

  @Output() isParagraphVisibleChanged: EventEmitter<boolean> = new EventEmitter<boolean>();



  constructor(
    public dialogRef: MatDialogRef<ExplanationDialogComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.showTextArea = data?.showTextArea || false;
    this.congeId = data?.congeId || '';
    this.status = data?.status || '';
  }

  onClose(): void {
    this.dialogRef.close();
    this.isParagraphVisibleChanged.emit(false);
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
