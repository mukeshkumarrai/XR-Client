/**
   @(C): Entire Software
   @Type: ts
   @Name: common.modal.ts
   @Who: Mukesh Kumar rai
   @When: 16-Sept-2020
   @Why: All model class
   @What: This file contain All common model class
  */
export interface PeriodicElement {
  name: string;
  position: number;
  paymentdate: string;
  symbol: string;
};

export interface UserEmailIntegration {
  SyncCalendar: number;
  SyncEmails: number;
  EmailProvider: string;
  Email: string;
  IsEmailConnected: number;
  DaysToSyncCalendar:number;
};

export interface statusList {
  Data: {
    StatusId: number;
    StatusName: string;
  }
  Status: number;
  HttpStatusCode: any;
  Message: string;
  TotalRecord: number;

}


export interface customDropdownConfig {
  IsRefresh: boolean;
  apiEndPoint: string;
  IsDisabled: boolean;
  IsRequired: boolean;
  searchEnable: boolean;
  placeholder: any;
  IsManage: any;
  bindLabel: string;
  multiple: boolean;  
  /*******************@suika**@EWM-10681 handle staus clear button*******************/
  isClearable:boolean;
}


export interface customDescriptionConfig {
  TextLength: number;
  LabelName: string;
  IsRequired: boolean;

}
