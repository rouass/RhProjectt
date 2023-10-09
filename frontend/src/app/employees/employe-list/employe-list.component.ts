import { Component , OnInit} from '@angular/core';
import axios from 'axios';
import { employe } from '../employee.model';
@Component({
  selector: 'app-employe-list',
  templateUrl: './employe-list.component.html',
  styleUrls: ['./employe-list.component.css']
})
export class EmployeListComponent {
  employees: employe[] = [];
  ngOnInit(){
    this.getEmployeesList();
  }
  getEmployeesList() {
    axios
    .get('http://127.0.0.1:8000/user/lister', {

    })
    .then(response => {
      console.log(response.data.employes);

      this.employees = response.data.employes;
    })
    .catch(error => {
      console.log(error);
    });
  }
}
