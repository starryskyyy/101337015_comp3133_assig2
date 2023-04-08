import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  selectedEmployee: any;

  constructor() { }

  setSelectedEmployee(employee: any) {
    this.selectedEmployee = employee;
  }

  getSelectedEmployee() {
    return this.selectedEmployee;
  }
}
