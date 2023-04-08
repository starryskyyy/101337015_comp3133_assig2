import { Component } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent {
  employeeForm = new FormGroup({
    firstname: new FormControl("", Validators.required),
    lastname: new FormControl("", Validators.required),
    email: new FormControl("", [Validators.required, Validators.email]),
    gender: new FormControl("", Validators.required),
    salary: new FormControl(null, Validators.required)
  });

  errorMessage!: String
  successMessage!: String

  constructor(private apollo: Apollo, private router: Router) { }

  async addEmployee() {
    if (this.employeeForm.value.salary === null) {
      // Set the error message and display it to the user
      this.errorMessage = 'Salary is required';
      return;
    }
    // Send the signup request to the server
    await this.apollo.mutate({
      mutation: gql`
        mutation {
          addEmployee(
            firstname: "${this.employeeForm.value.firstname}",
            lastname: "${this.employeeForm.value.lastname}",
            email: "${this.employeeForm.value.email}",
            gender: "${this.employeeForm.value.gender}",
            salary: ${this.employeeForm.value.salary}
          ) {
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
      // set the success message and clear the form
      this.employeeForm.reset();
      this.errorMessage = '';
      this.successMessage = "Employee created successfully! Redirecting to the home page..."
      // redirect to the homepage after 3 seconds
      setTimeout(() => {
        this.router.navigate(['/homepage']);
      }, 3000);
    }, (error) => {
      this.errorMessage = error.message;
    });
  }

  goToHomePage(event: Event) {
    event.preventDefault();
    this.router.navigate(['/homepage']);
  }

}
