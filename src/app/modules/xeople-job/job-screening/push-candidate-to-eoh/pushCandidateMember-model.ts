export interface pushCandidateMemberModel {
    Title:              string;
    FirstName:          string;
    FamilyName:         string;
    Gender:             string;
    DOB:                string;
    FullAddress:        string;
    Street:             string;
    SuburbCode:         string;
    SuburbName:         string;
    PostCode:           string;
    Latitude:           string;
    Longitude:          string;
    StateId:            number;
    StateCode:          string;
    StateName:          string;
    CountryId:        number;
    CountryCode:        string;
    CountryName:        string;
    CountryCallingCode: string;
    Email:              string;
    MobileNo:           string;
    QualificationID:    string;
    Qualification:      string;
    Resume:             string;
    OfficeID:           string;
    UserName:           string;
    IndustryID:         string;
    Industry:           string;
    HowDidYouHear:      string;
    OrganizationId:     string;
    TenantID:           string;
    CandidateID:        string;
    OrganizationName:   string;
    PhoneCountryId:     string;
    GenderId:           number;
    CandidateStatus:    string;
    CandidateCreationdDateTime: string;
}

export enum PushCandidatePageType  { 
    "Modal" = 1, 
    "Normal" = 2
 }

 export interface jobActionPushMemeberEOH{
    Title:                      string;
    FirstName:                  string;
    FamilyName:                 string;
    Gender:                     string;
    DOB:                        string;
    Street:                     string;
    FullAddress:                string;
    SuburbName:                 string;
    PostCode:                   string;
    Latitude:                   string;
    Longitude:                  string;
    StateId:                    number;
    StateCode:                  string;
    StateName:                  string;
    CountryId:                  number;
    CountryCode:                string;
    CountryName:                string;
    CountryCallingCode:         string;
    Email:                      string;
    MobileNo:                   string;
    QualificationID:            string;
    Qualification:              string;
    Resume:                     string;
    OfficeID:                   string;
    UserName:                   string;
    IndustryID:                 string;
    Industry:                   string;
    HowDidYouHear:              string;
    OrganizationId:             string;
    TenantID:                   string;
    CandidateID:                string;
    OrganizationName:           string;
    PhoneCountryId:             string;
    GenderId:                   number;
    CandidateStatus:            string;
    CandidateCreationdDateTime: string;
    RecruiterID:                string;
    RecuriterName:              string;
    ScreeningKeyword:           string;
    TemplateId:                 string;
    IsSendEmailToApplicant:     boolean;
    ScreeningNotes:             string;
    EmployementStatusNotes:     string;
    InterviewDate:              string;
    InterviewStartTime:         string;
    InterviewEndTime:           string;
    InterviewTitle:             string;
    TimeZone:                   string;
    Type:                       string;
    HiredDate:                  string;
    MemberPriority:             string;
    MemberPriorityId:           string;
    EmploymentType:             string;
    EmploymentTypeId:           string;
 }
 