/*@Type: File, <ts>
@Name: status-master.ts
@Who: Renu
@When: 13-May-2021
@Why: ROST-1586
@What: All response based schema realted variables will be used from here
*/
export class quickpeople {
    Organization:{}
    FirstName: string;
    MiddleName: string;
    LastName: string;
    Title: string;
    Email:{
        Type:any;
        EmailId:any;
    };
    Phone:{
        Type:any;
        PhoneNumber:any;
    };
    SocialProfile:{
        TypeId:any;
        ProfileURL:any;
    };
    Type:any;
    Status:any;
  
}