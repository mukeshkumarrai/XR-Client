export class CandidateDetails {
    CandidateId: string;
    CandidateName:string;
    PreviewImageURL: string;
    Emails: Array<EmailEntity>;
    Phones:Array<PhoneEitity>;
    Resume: ResumeObject;
    CoverLetter: coverletterObject
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
