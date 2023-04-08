import { Component, OnInit } from '@angular/core';
import { Employee } from '../models/employee';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Router } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { EmployeeService } from '../network/employee.service';


@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {

  employees!: Employee[];
  selectedEmployee!: Employee;
  showDialog = false;
  showUpdateDialog = false;

  constructor(private apollo: Apollo, private router: Router, private employeeService: EmployeeService) { }

  ngOnInit() {
    this.apollo.query({
      query: gql`
        query {
          getEmployees {
            id
            firstname
            lastname
            email
            gender
            salary
          }
        }
      `
    }).subscribe(result => {
      const employeesData = result.data as { getEmployees: Employee[] };
      this.employees = employeesData.getEmployees;
    });
  }

  closeDialog() {
    this.showDialog = false;
  }

  goToLogin(event: Event) {
    event.preventDefault();
    this.router.navigate(['/']);
  }

  goToAddEmployee(event: Event) {
    event.preventDefault();
    this.router.navigate(['/new-employee']);
  }


  goToUpdate(event: Event, employee: Employee) {
    this.employeeService.setSelectedEmployee(employee);
    event.preventDefault();
    this.router.navigate(['/update-employee']);
  }


}




