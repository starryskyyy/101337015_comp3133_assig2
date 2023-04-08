import { Component, OnInit } from '@angular/core';
import { Employee } from '../models/employee';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Router } from "@angular/router";

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})
export class EmployeesComponent implements OnInit {
  employees!: Employee[];
  selectedEmployee!: Employee;
  showDialog = false;

  constructor(private apollo: Apollo, private router: Router) { }

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

  openDialog(employee: Employee) {
    this.apollo.query({
      query: gql`
        query getEmployeeByID("${employee.id}")
      `,
    }).subscribe(result => {
      const employeeData = result.data as { getEmployeeByID: Employee };
      this.selectedEmployee = employeeData.getEmployeeByID;
      this.showDialog = true;
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
}
