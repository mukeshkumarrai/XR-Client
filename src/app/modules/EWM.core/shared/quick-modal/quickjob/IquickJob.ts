
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
    StateName?:any;

    OrganizationName?: any;
    ClientName?:any;
    AddressLinkToMap?:any;
    Latitude?:any;
    Longitude?:any;
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
        SalaryBandName?:string;
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
        workflowName?:String;
        ApplicationFormId?: number;
        ApplicationFormName?:string;
        StatusColorCode?:string;
        JobExpiryDays?:any;
        Owners?: IOwner[];
    }

    export interface IjobBoards {
        PublishDate?: string;
        IsDisable?: number;
        // KnockOut?:number;   /*--@who: Nitin Bhati,@When:11-05-2023,@Why:12363--*/
        // ManageAccessId?:string;
        // ApplicationFormId?: number;
        // ApplicationFormName?:string;

    }


    export interface IOwner {
        OwnerId: string;
        IsPrimary: number;
    }



