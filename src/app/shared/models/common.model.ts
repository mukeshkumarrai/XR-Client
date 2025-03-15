/**
   @(C): Entire Software
   @Type: ts
   @Name: common.modal.ts
   @Who: Mukesh Kumar rai
   @When: 16-Sept-2020
   @Why: All model class
   @What: This file contain All common model class
  */
export class PeriodicElement {
  name: string;
  position: number;
  paymentdate: string;
  symbol: string;
};
export class LoginResponce {
  Username: string;
  Password: string;
  Domain: string;
  IsRemember: boolean;
  Device: string;
  MFA: Number;
  MfaType: Number;
  MfaKey: string;
  KeyId: Number;
  KeyA: string;
  SuppressMfa30: Number;

}
export class Timezone {
  value: string;
  viewValue: string;
}
export class Useraccess {
  component: string;
  control_add: boolean;
  control_update: boolean;
  control_edit: boolean;
  control_detele: boolean;
  control_view: boolean;

}
export class Userpreferences {
  timezone: string;
  timeformate: string;
  dateformate:string;
}
export class Usertrack {
  date: {
    user: {
      page: {
        starttime: string;
        endtime: string;
      }
    };

  };

}
export class menuItem {
  Id: number;
  Name: string;
  SearchEnable: string;
  Position: string;
  Menu: subMenuItem[];
}
export class subMenuItem {
  ParentId: number;
  Id: number;
  Name: string;
  Location: string;
  ModuleId: number;
  IsChecked: boolean;
  IsIntermediate: boolean;

}

export class permissions{
  HttpStatusCode: number;
  Message:string;
  Status:boolean;
  Data:{
        AccessLevel:string;
        AccessLevelId: number;
        Add: string;
        Comment: string;
        numberDataPermissionName: string;
        DataType: string;
        Delete: string;
        Edit: string;
        ExportReport: string;
        Print: string;
        SendEmail: string;
        SendSms: string;
        View: string;
  }
}

