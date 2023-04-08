import { Component } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {

  signupForm = new FormGroup({
    username: new FormControl("", Validators.required),
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", Validators.required)
  });

  errorMessage!: String
  successMessage!: String

  constructor(private apollo: Apollo, private router: Router) { }

  async signup() {
    // Send the signup request to the server
    await this.apollo.mutate({
      mutation: gql`
                mutation {
                  signup(
                        username: "${this.signupForm.value.username}",
                        email: "${this.signupForm.value.email}",
                        password: "${this.signupForm.value.password}"
                    ) {
                        username
                        email
                    }
                }
            `,
    }).subscribe(result => {
      // set the success message and clear the form
      this.signupForm.reset();
      this.errorMessage = '';
      this.successMessage = "Account created successfully! Redirecting to the login page..."
      // redirect to the homepage after 3 seconds
      setTimeout(() => {
        this.router.navigate(['/']);
      }, 3000);
    }, (error) => {
      this.errorMessage = error.message;
    });
  }

  goToLogin(event: Event) {
    event.preventDefault();
    this.router.navigate(['/']);
  }
}

