import { Component } from '@angular/core';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm = new FormGroup({
    username: new FormControl("", Validators.required),
    password: new FormControl("", Validators.required)
  });
  
  errorMessage!: String

  constructor(private apollo: Apollo, private router: Router) { }

  async login() {
    // Send the login request to the server
    await this.apollo.query({
      query: gql`
      query {
        login(username: "${this.loginForm.value.username}", password: "${this.loginForm.value.password}")
      }
        `
    }).subscribe(result => {
      // @ts-expect-error if wrong password
      if (result.data.login === "Invalid username or password") {
        this.errorMessage = "Invalid username or password"
      }
      else {
        // redirect to the homepage
        this.router.navigate(["/homepage"]);
      }
    });
  }

  goToSignUp(event: Event) {
    event.preventDefault();
    this.router.navigate(['/signup']);
  }
}
