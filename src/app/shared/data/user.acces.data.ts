/**
   @(C): Entire Software
   @Type: ts
   @Name: user.access.data.ts
   @Who: Mukesh Kumar rai
   @When: 23-Sept-2020
   @Why: ROST-205
   @What: Dummy data for user access
  */
import { Injectable } from '@angular/core';
import { Useraccess } from '../models/common.model';

let useraccess: Useraccess[] = [
  {
    component: 'commonfunction',
    control_add: false,
    control_update: false,
    control_edit: false,
    control_detele: false,
    control_view: false
  },
  {
    component: 'grid',
    control_add: false,
    control_update: false,
    control_edit: false,
    control_detele: false,
    control_view: false
  }
]

@Injectable()
export class UserAccessService {
  Getuseraccess() {
    return useraccess;
  }

}
