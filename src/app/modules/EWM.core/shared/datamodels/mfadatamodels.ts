/**
   @(C): Entire Software
   @Type: ts
   @Name: common.modal.ts
   @Who: Mukesh Kumar rai
   @When: 16-Sept-2020
   @Why: All model class
   @What: This file contain All common model class
  */
export interface appQRdata {
  QrCodeUrl: string;
  ManualEntryKey: string;
  Account: string;

};
export interface SecurityQuestion {
  Id: number;
  Question: string;
};
export interface QuestionList {
  SecurityId: number;
  Answer: string;
};
export interface CreateUserMfa {
  AlternateEmailID: string;
  QuestionList: QuestionList[];
};

