  // who:maneesh,what:ewm-13870 export CandidateAddNotes model, when:24/05/2023
export  class AddNotesModel { 
        NoteTitle: string;
        Description: string;
        NotesDate: string;
        CategoryId: number;
        CategoryName: string;
        AccessId: number;
        AccessName: string
        GrantAccesList:GrantAccesList[];
        NotesURL: string;
        Files: Files[];
        RelatedToIds:RelatedToIds[];
        NotesContacts?:[];  //Who:Ankit Rawat, What:EWM-16073 EWM-16234 Add new control Contact Dropdown, When:27Feb24,
        XRNotifications:XRNotifications;
    }
    export interface XRNotifications {
        UserProfilePic: string;
        NotifyUser: NotifyUser[];
        NavigateUrl: string;
        CompletePath: string;
      }
      export interface NotifyUser {
        ID: string;
        Name: string;
        ProfilePath: string;
        UserType: string;
        ShortName?:string;
        ProfileImage?:string;
      }
    export interface Files {
        Path: string;
        Name: string;
        Size: number;
        PreviewUrl: string; 
}
export interface GrantAccesList {
        UserId: string;
        EmailId: string;
        UserName: string;
        Id: number;
        Mode: number; 
}
export interface RelatedToIds {
        Name: string;
        UserType: string;
        Id: number;
}
