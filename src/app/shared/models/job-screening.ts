import { FormGroup } from "@angular/forms";

/*--@When:25-05-2023,@who:Renu,@why:EWM-11781 EWM-12517,@what:For job screening model*/
export class JobScreening {
    PageName:string;
    WorkFlowStageName: string;
    WorkFlowStageId: string;
    JobTitle: string;
    JobId: string;
    ClientName: string;
    ClientId: string;
    Address: string;
    CandidateList: candidateEntity[];
    WorkflowId: String;
    WorkflowName: string;
    GridState: GridState;
    SelectedCandidate: candidateEntity[];
    JobReferenceId:string;
    JobHeadCount: number;
    isLastSatgeCand:boolean
}

export interface GridState {
    JobId: string;
    GridId: string;
    JobFilterParams?: (JobFilterParamsEntity)[] | null;
    search: string;
    PageNumber: number;
    PageSize: number;
    OrderBy: string;
    WorkflowId: string;
    Source: string;
}

export interface JobFilterParamsEntity {
    FilterValue: string;
    ColumnName: string;
    ColumnType: string;
    FilterOption: string;
    FilterCondition: string;
}

export class candidateEntity {
    FirstName: string;
    MiddleName: string;
    LastName: string;
    ProfileImage: string;
    PreviewUrl: string;
    CandidateStatus: string;
    IsResume: number;
    StageDisplaySeq: number;
    ActiveJobs: number;
    LastActivity: number;
    StatusId: string;
    StatusName: string;
    StageColorCode: string;
    StageVisibility: number;
    EmailId: string;
    PhoneNumber: string;
    CountryId: number;
    JobTitle: string;
    Designation: string;
    Location: string;
    Latitude: string;
    Longitude: string;
    WorkFlowId: string;
    WorkFlowStageId: string;
    WorkFlowStageName: string;
    Source: string;
    SourceColorCode: string;
    CandidateId: string;
    CandidateName: string;
    IsProfileRead: number;
    IsSelected:number;
    WorkflowName:string;
    WorkFlowName:string;
    StageType:string;
}

export class candResumeCoverLetter {


    CandidateId: string;
    CandidateName: string;
    ImageURL: string;
    ShortName?: null;
    ShortNameColor?: null;
    Emails?: [] | null;
    Phones?: [] | null;
    Resume?: Resume | null;
    CoverLetter?: CoverLetter | null;
    KeywordSearch?: null;
    LastCall: number;
    LastActivity: number;
    Version: string;
    UploadDate: number;
    UploadedBy: string;
    ResumeId: number;
    ResumeUrl: string;
    Comment: string;
    FileName: string;
    UploadFileName: string;
    Data: {} | null;
    Status: boolean;
    HttpStatusCode: number;
    Message: string;
    TotalRecord: number;
    PageNumber: number;
    PageSize: number;
    TotalPages: number;
    ErrorFields?: null;

}

export interface Resume {
    Version: string;
    UploadDate: number;
    UploadedBy: string;
    ResumeId: number;
    ResumeUrl: string;
    Comment: string;
    FileName: string;
    UploadFileName: string;
    CandidateId: string;
}

export interface CoverLetter {
    JobReferenceId?: null;
    ClientName?: null;
    UploadedOn: number;
    VersionName: string;
    UploadedBy: string;
    FileFormat?: null;
    PreviewUrl: string;
    Id: number;
    CandidateId: string;
    Name: string;
    JobId: string;
    JobTitle?: null;
    CoverLetterURL: string;
    ActualFileName: string;
    Source?: null;
    FileSize?: null;
}

export interface ApplicationForm {
    fileType: string;
    bytes: string;
    filename: string;
}
export interface countInfo {
    Activity: ActivityOrChecklist;
    Checklist: ActivityOrChecklist;
    Comments: number;
}
export interface ActivityOrChecklist {
    Completed: number;
    Total: number;
    Pending: number;
}

export interface KeywordSearch {
    ProfileDetails: ProfileDetails;
    SkillDetails?: SkillDetailsEntity | null;
    EducationDetails?: EducationDetailsEntity | null;
    EmploymentHistoryDetails?: EmploymentHistoryDetailsEntity | null;
    ExperienceDetails?: ExperienceDetailsEntity | null;
}

export interface ProfileDetails {
    FullName: string;
    Name: string;
    FamilyName: string;
    Gender: string;
    CountryCode: string;
    MobileNumber: string;
    HomeNumber: string;
    EmailAddress: string;
    City: string;
    Region: string;
    ExecutiveSummary: string;
    MaritalStatus: string;
    ResumeName: string;
    CVParsedBy?: null;
    CVParsedOn: string;
}
export interface SkillDetailsEntity {
    SkillName: string;
    SkillProficiency: string;
    skillUsed?: null;
    skillLastUsed?: string | null;
}
export interface EducationDetailsEntity {
    DegreeName: string;
    DegreeType: string;
    DegreeDate: string;
    StartDate: string;
    EndDate: string;
    schoolType: string;
    SchoolName: string;
}
export interface EmploymentHistoryDetailsEntity {
    OrganizationName: string;
    Designation?: string | null;
    PositionType: string;
    StartDate: string;
    EndDate: string;
    Description: string;
}
export interface ExperienceDetailsEntity {
    PositionName?: null;
    Employer?: null;
    Salary: number;
    CurrencyId: number;
    Currency?: null;
    SalaryUnitId: number;
    SalaryUnit?: null;
    DateStart: string;
    DateEnd?: null;
    Location?: null;
    Description?: null;
    IsCurrent: number;
    ExecutiveBrief: string;
    Level: string;
    MonthOfExperience: number;
    YearsOfExperience: number;
    CandidateId: string;
}

export interface SaveJobStatusTab {
    CandidateList: CandidateList[]
    JobId: string;
    JobName: string;
    WorkflowId: string;
    WorkflowName: string;
    // PreviousStageId: string;
    // PreviousStageName: string;
    NextStageId: string;
    NextStageName: string;
    // CurrentStageDisplaySeq: number;
    NextStageDisplaySeq: number;
    SkipStageName: string;
    ApplicationStatusReasonId: number;
    CandidateProfileStatusId: string;
    CandidateReasonId: number;
    IsRestricted: number;
    RestrictedUntilDate: string;
    RestrictedMessage: string;
    FolderList: FolderList[],
    CandidateProfileStatusName: string;
    JobHeadCount: number;
}

export interface CandidateList {
    CandidateId: string;
    CandidateName: string;
}

export interface FolderList {
    Id: number;
}


export interface ActionsTab {
    [key: string]: string;
}

export interface jobActionsEntity {
    formGroupInfo: FormGroup;
    APIEndPoint: string;
    isChanged: boolean;
    tabName: string
}

/*--@When:23-05-2023,@who:Renu,@why:EWM-17107 EWM-17173,@what:For job screening intervew status screening*/
export class JobScreeningStatus {
    ActivityDate: number;
    ActivityName: string;
    TimeEnd: string;
    TimeStart: string;
    UTCStartDateTime:string;
    UTCEndDateTime:string;
}