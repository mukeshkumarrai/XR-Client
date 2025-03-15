/* 
 @Type: File, <ts>
 @Name: modal class
 @Who: Nitin Bhati
 @When: 21-June-2021
 @Why: EWM-1821
*/
export class JobCategory {
    Message:string;
    HttpStatusCode:any;
    Data: {
        Id: number;
        RegionId: number;
        RegionName: string;
        JobCategory: string;
        Status: number; 
    };  
    PageNumber: number;
    PageSize: number;
    Status: any;
    TotalRecord: number; 
}

export class SubJobCategory {
    Message:string;
    HttpStatusCode:any;
    Data: {
        Id: number;
        JobCategoryId:number;
        JobCategory:string;
        RegionId: number;
        RegionName: string;
        JobSubCategory: string;
        Status: number; 
        FunctionalExpertise:string;
    };  
    PageNumber: number;
    PageSize: number;
    Status: any;
    TotalRecord: number;
  
}
