export class Employee {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    gender: string;
    salary: number;
    onClick?: () => void; // Add a property for the click event
    
    constructor(id: number, firstname: string, lastname: string, email:string, gender:string, salary: number) {
      this.id = id;
      this.firstname = firstname;
      this.lastname = lastname;
      this.email = email;
      this.gender = gender;
      this.salary = salary;
    }
  }