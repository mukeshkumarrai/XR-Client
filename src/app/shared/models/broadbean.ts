
/*
   @Type: ts
   @Name: Braodbean
   @Who:Adarsh singh
   @When: 06-Feb-2023
   @Why: export  Broadbean model
*/
export class Broadbean {
    transaction: {
        // config: {
        //     stylesheet: string;
        // },
        filters: {
            job_reference: string;
        },
        advert: {
            job_title: string;
            job_reference: string;
            job_type: string;
            location_query: string;
            industry: string;
            salary_from: Number;
            salary_to: Number;
            salary_currency: string;
            salary_per: string;
            // salary_benefits: string;
            summary: string;
            job_description: string;
        },
        applyonline: {
            url: string;
        },
        stylesheet: {
            posting_form: string;
            // dashboard: string;
        },
        notify_on_delivery: string,
        redirect_on_completion: {
            url: any;
            auto: string;
        }
        // search: {
        //     candidate_import_url: any;
        // },
        // close_on_completion: string;
    }
    job_id: string;
    workflowId: string;

}


export interface BroadbeanPosting {
    JobTitle: string;
    JobReferenceId: string;
    JobTypeName: string;
    Location: string;
    IndustryName: string;
    SalaryMin: number;
    SalaryMax: number;
    CurrencyName: string;
    SalaryUnitName: string;
    salaryBenefits: string;
    JobDescription: string;
    ApplicationFormId: number;
    ApplicationFormName: string;
    WorkflowId: string;
    Id: string;
    PublishedOnSeek: number;
    PublishedOnIndeed: number;
}

  export interface BroadbeanJobPostedDetails {
    Data: JobBoardDetails[]
    Status: boolean
    HttpStatusCode:any
    Message: string
    TotalRecord: number
    PageNumber: number
    PageSize: number
    TotalPages: number
    ErrorFields: any
  }
  
  export interface JobBoardDetails {
    JobBoardId: string
    JobBoard: string
    PublishedOn: number
    ExpiredOn: number
    JobBoardPublishStatus: number
    ExpressionOfInterest: number
  }