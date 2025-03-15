import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-session-switching',
  templateUrl: './session-switching.component.html',
  styleUrls: ['./session-switching.component.scss']
})
export class SessionSwitchingComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

/*
  @Name: refreshSessionUser
  @Who: Renu
  @When: 27-June-2022
  @Why:  ROST-6960 Rost-7025
  @What: landing page before login to system

*/
  refreshSessionUser(){
   window.location.reload();
   localStorage.setItem('SessionOverRide','0');
  }
}
