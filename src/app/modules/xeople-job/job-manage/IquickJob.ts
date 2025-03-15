
/*
 @(C): Entire Software
 @Type: File, <TS>
 @Name: Iquickjob.ts
 @Who: Anup
 @When: 25-June-2022
 @Why: EWM-1749 EWM-1900
 @What: For Interface of quick job submit method
 */

 export interface IquickJob {
    JobId?:string;
    ReferenceId?: string;
    Title?: string;
    ClientId?: string;
    Address1?: string;
    Address2?: string;
    CountryId?: number;
    CountryName?: string;
    StateId?: number;
    City?: string;
    ZipCode?: string;
    JobDetails?: IjobDetails;
    Salary?: Isalary;
    JobDescription?: IjobDescription;
    JobAdvance?: IjobAdvance;
    JobBoards?: IjobBoards;
    JobUrl?: any;
    OrganizationName?: any;
    ClientName?:any;
    AddressLinkToMap?:any;
    Latitude?:any;
    Longitude?:any;
    StateName?:any;
    DistrictSuburb?:any;
}

export interface IjobDetails {
    JobCategoryId?: string;
    JobSubCategoryId?: number[];
    Industries?: any[];
    SubIndustries?: any[];
    Qualifications?: any[];
    ExperienceId?:  number[];
    JobTypeId?: string;
    JobSubTypeId?: number;
    Expertise?: any[];
    SubExpertise?: any[];
    SkillList?: number[];
    Skills?: string;
    // JobExpiryDays?: number;
    // WorkFlowId?: string;
    // StatusColorCode?: string;
}

export interface Isalary {
    CurrencyId?: number;
    CurrencyName?: string;
    CurrencySymbol?: string;
    SalaryUnitId?: number;
    SalaryBandId?: number;
    SalaryBandName?: string;
    SalaryUnitName?: string;
    Bonus?: number;
    Equity?: number;
    HideSalary?:number;
}

export interface IjobDescription {
    Description?: string;
    InternalNotes?: string;
    JobTagId?: number[];
}

export interface IjobAdvance {
    HeadCount?: number;
    OpenDate?: string;
    FillDate?: string;
    OwnerId?: any[];
    Contact?: string[];
    JobRank?: number;
    HideCompany?: any;
    BrandId?: number;
    BrandName?: string;
    ProjectId?: number;
    JobRankColorCodeURL?: any;
    JobRankColorCode?: any;
    AccessId?: any;
    AccessName?: any;
    GrantAccessList?: any;
    ReasonId?: any;
    ReasonName?: any;
    StatusId?: string;
    StatusName?: string;
    WorkFlowId?:String;
    ApplicationFormId?: number;
    ApplicationFormName?:string;
    StatusColorCode?:string
    JobExpiryDays?:any
}

export interface IjobBoards {
    PublishDate?: string;
    IsDisable?: number;
    // KnockOut?:number;
    // ManageAccessId?:string;
    
}

export interface jobDetails{
    JobId?: string,
    JobTitle?:string,
    JobName?: string,
    CandidateId?:[string],
    CandidateName?: string,
    WorkflowId?: string,
    WorkflowName?: string,
    StageId?: string,
    StageName?: string,
    StageDisplaySeq?: 0
}

export interface WorkflowChangeStagesData {
Parent: string,
Child: string,
Subchild: string
}


export interface closeJobData{
JobId?: string,
JobTitle?:string,
StatusId?:string,
StatusName?:string,
ReasonId?: 0,
ReasonName?:string;
WorkflowId?: string,
WorkflowName?: string,
CandidateList?: [
{
  CandidateId?:string,
  CandidateName?:string,
  CurrentStageId?: string,
  CurrentStageName?: string,
  EmailId?:string
}
],
MoveCandidate?: IMoveCandidate,
DelinkCandidate?: IDelinkCandidate,
CandidateMail?:ICandidateMail
}

export interface IDelinkCandidate{
StatusId?: string,
StatusName?: string,
ReasonId?: 0,
ReasonName?: string,
Comment?: string,  
}

export interface  ICandidateMail {
PageUrl?: string,
To?:[],
Cc?: string,
Body?: string,
Attachment?: boolean,
Files?: any[],
Subject?:string,
JobId?: string,
MailProvider?: 0,
BodyType?:string,
CandidateList?: [
  {
    ModuleType?:string,
    Id?: string,
    EmailTo?:string,
  }
],
RelatedToInternalCode?: string,
Bcc?: string,
DefaultSignature?: any
}


export interface  IMoveCandidate {
NextStageId?: string,
NextStageName?: string,
NextStageDisplaySeq?: 0
}