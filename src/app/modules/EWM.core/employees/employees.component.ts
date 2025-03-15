import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnInit {

  public loadingscroll: boolean;  
  public formtitle: string = 'grid';
  public auditParameter;  
  public loading: boolean;
  constructor() { }

  ngOnInit(): void {
  }

  onScrollDown(ev?) {}
}

