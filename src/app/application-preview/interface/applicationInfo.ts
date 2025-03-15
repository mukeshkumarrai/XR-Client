export interface documentInfo {
      FileName: string;
      DocumentId: number;
      DocumentName: string;
      CategoryId: number;
      CategoryName: string;
      ReferenceId: string;
      StartDate: string;
      EndDate: string;
      UploadDocument: string;
      Comment: string;
  }

  export interface personalInfo {
    FirstName: string;
    LastName: string;
    ProfilePicture: string;
    ResumeFilePath: string;
    ResumeName: string;
    Emails: [];
    Phones: [];
    Address: [];
    CurrentSalary: number;
    CurrencyId: number;
    Currency: string;
    SalaryUnitId:number;
    SalaryUnit: string;
    NoticePeriod: number;
    Skills: [];
    Experiences: [];
    Educations: [];
  }
  
  export interface knockOutInfo {
    Id:number;
    Question: string;
    Answer: number;
    DisplaySequence: number;
  }