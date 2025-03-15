

/*
 @(C): Entire Software
 @Type: File, <TS>
 @Name: IconfigureRule.ts
 @Who: Suika
 @When: 25-Dec-2022
 @Why: EWM-1732 EWM-9629
 @What: For Interface of configure rule method
 */

export interface IconfigureRule {
    Id?:any;
    ApplicationFormId?:any;
    ApplicationFormName?:any;
    CandidateStatus?:any;
    IsWelcomeConfigured?:any;
    TemplateIdCandStatus?:any;
    TemplateCandStatus?:any;
    AlertMessageCandStatus?:any;
    TemplateIdSameJob?:any;
    TemplateSameJob?:any;
    AlertMessageSameJob?:any;
    IsKnockoutConfigured?:any;
    TemplateIdKnockout?:any;
    TemplateKnockout?:any;
    AlertMessageKnockout?:any;
    IsThankyouConfigured?:any;
    TemplateIdThankyou?:any;
    TemplateThankyou?:any;
    SendApplicationAttachment?:any;



}