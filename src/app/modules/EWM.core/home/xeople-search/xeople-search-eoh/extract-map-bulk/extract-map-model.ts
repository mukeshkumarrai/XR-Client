export interface Res {
    Data: Daum[]
    Status: boolean
    HttpStatusCode: number
    Message: string
  }
  
  export interface Daum {
    ExternalId: string
    Title: string
    ProfilePicture?: string
    FirstName: string
    LastName: string
    Email: string
    UniqueId: number
    Gender: string
    DateOfHire: string
    Status: string
    Reason?: string
    Office: string
    Priority: string
    Resume: string
    MemberAppKeyAndroid?: string
    MemberAppKeyIOS?: string
    GlobalId: any
    CountryCode: string
    PhoneNo: string
    AddressLine1: string
    AddressLine2: string
    Country: string
    City: string
    Postalcode: string
    Industry: string
    Expertise: string
    Qualification: string
    Experience: string
    EmergencyName: string
    EmergencyRelation: string
    EmergencyMobileNo: string
    EmployeeStatusNotes: string
    LastShiftWorked?: string
    NoOfShifts: number
    ScreeningNotes: string
    Latitude: string
    Longitude: string
    IsCandidateAlreadyExists: boolean
    CandidateId: any
    IsCandidateCreated: boolean
    IsCandidateMappedWithJob: boolean
    StatusMessage: string
    IssueDescription: string
    IsCandidateCreationLogInserted: boolean
    Suburb:string
    District:string
    State:string
  }
  
export const ExtractMapKeys: any[] =[
      {
        "key": "General",
        "value": "Title,Profile Picture,FirstName,LastName,Email,UniqueId,ExternalId,Gender,DateofHire,Status,Reason,Office,Resume,MemberAppKeyAndroid,MemberAppKeyIOS,GlobalId",
        "checked":true,
        "disabled":true
       
      },
      {
        "key": "Contact",
        "value": "CountryCode,PhoneNo,AddressLine1,AddressLine2,Country,City,District,Postalcode",
        "checked":true,
        "disabled":true
      },
      {
        "key": "Skill & Experience",
        "value": "Industry,Expertise,Qualification,Experience",
        "checked":true,
        "disabled":false
      },
      {
        "key": "Emergency contact",
        "value": "EmergencyName,EmergencyRelation,EmergencyMobileNo",
        "checked":true,
        "disabled":false
       
      },
      {
        "key": "Notes",
        "value": "EmployeeStatusNotes,LastShiftWorked,NoOfShifts,ScreeningNotes,Priority",
        "checked":true,
        "disabled":false
       
      }
    ]
  
