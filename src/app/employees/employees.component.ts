import { Component, OnInit } from '@angular/core';
import { Employee } from '../models/employee';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Router } from "@angular/router";

interface UpdateEmployeeResponse {
  updateEmployee: Employee;
}

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

  updateEmployee(updatedEmployee: Employee) {
    this.apollo.mutate({
      mutation: gql`
        mutation updateEmployee($id: ID!, $input: UpdateEmployeeInput!) {
          updateEmployee(id: $id, input: $input) {
            id
            firstname
            lastname
            email
            gender
            salary
          }
        }
      `,
      variables: {
        id: updatedEmployee.id,
        input: {
          firstname: updatedEmployee.firstname,
          lastname: updatedEmployee.lastname,
          email: updatedEmployee.email,
          gender: updatedEmployee.gender,
          salary: updatedEmployee.salary,
        },
      },
    }).subscribe(result => {
      // Update the selected employee with the updated data
      this.selectedEmployee = (result.data as UpdateEmployeeResponse).updateEmployee;
      // Hide the update dialog
      this.showUpdateDialog = false;
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

  goToUpdateEmployee(event: Event) {
    event.preventDefault();
    this.router.navigate(['/update-employee']);
  }
}
