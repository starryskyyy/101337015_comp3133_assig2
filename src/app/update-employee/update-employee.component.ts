import { Component } from '@angular/core';
import { EmployeeService } from '../network/employee.service';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector: 'app-update-employee',
  templateUrl: './update-employee.component.html',
  styleUrls: ['./update-employee.component.css']
})
export class UpdateEmployeeComponent {

  employee: any = {};
  errorMessage!: String
  successMessage!: String
  employeeForm!: FormGroup;

  constructor(private employeeService: EmployeeService, private apollo: Apollo, private router: Router) { }

  ngOnInit() {
    this.employee = this.employeeService.getSelectedEmployee();

    this.employeeForm = new FormGroup({
      firstname: new FormControl(this.employee.firstname, Validators.required),
      lastname: new FormControl(this.employee.lastname, Validators.required),
      email: new FormControl(this.employee.email, [Validators.required, Validators.email]),
      gender: new FormControl(this.employee.gender, Validators.required),
      salary: new FormControl(this.employee.salary, Validators.required),
    });
  }

  async updateEmployee() {

    const { firstname, lastname, email, gender, salary } = this.employeeForm.value;
    
    if (!email || !this.employeeForm.controls['email'].valid) {
      this.errorMessage = "Please enter a valid email address.";
      return;
    }

    const salaryQuery = salary ? `salary: ${salary}` : '';
    const mutationQuery = `
  mutation {
    updateEmployee(
      id: "${this.employee.id}",
      firstname: "${firstname}",
      lastname: "${lastname}",
      email: "${email}",
      gender: "${gender}",
      ${salaryQuery}
    ) {
      id
      firstname
      lastname
      email
      gender
      salary
    }
  }
`;
    await this.apollo.mutate({
      mutation: gql`${mutationQuery}`
    }).subscribe(() => {
      this.errorMessage = '';
      this.successMessage = "Employee updated successfully! Redirecting to the home page..."
      // redirect to the homepage after 3 seconds
      setTimeout(() => {
        this.router.navigate(['/homepage']);
      }, 3000);
    }, (error) => {
      if (!salary || !firstname || !lastname || !email) {
        this.errorMessage = "All fields are required";
      } else {
        this.errorMessage = error.message;
      }
    });
  }

  goToHomePage(event: Event) {
    event.preventDefault();
    this.router.navigate(['/homepage']);
  }
}
