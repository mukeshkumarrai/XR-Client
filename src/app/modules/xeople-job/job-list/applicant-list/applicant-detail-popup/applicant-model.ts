export class CandidateDetails {
    CandidateId: string;
    Name:string;
    ShortName:string;
    CandidateImage: string;
    CandidateEmail: string;
    LastActivityDate:string;
    PhoneNumber:string;
    Phonecode: string;
    StatusName: string;
    StatusColorCode: string;
    Emails: Array<EmailEntity>;
    Phones:Array<PhoneEitity>;
}
export class ResumeObject{
      CandidateId: string;
      Comment: string;
      FileName: string;
      UploadFileName: string;
      Version: string;
      UploadDate: number;
      UploadedBy: string;
      ResumeId: number;
      ResumeUrl: string;
}
export class coverletterObject{
    Id: number;
    CandidateId:  string;
    Name: string;
    JobId:  string;
    JobTitle:  string;
    CoverLetterURL:  string;
    ActualFileName:  string;
    Source:  string;
    FileSize:  string;
    JobReferenceId:  string;
    ClientName:  string;
    UploadedOn: number;
    VersionName:  string;
    UploadedBy:  string;
    FileFormat:  string;
    PreviewUrl:  string;
}
export class EmailEntity {
    Type:number;
    TypeName:string;
    EmailId:string;
    IsDefault:boolean
}

export class PhoneEitity{
    Type:number;
    TypeName:string;
    PhoneNumber:string;
    PhoneCode:string;
    CountryId:number;
    IsDefault:boolean
}