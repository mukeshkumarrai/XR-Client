import { FormGroup } from "@angular/forms";

/*--@When:25-05-2023,@who:Renu,@why:EWM-11781 EWM-12517,@what:For job screening model*/
export interface jobAction {
    From: FromArray;
    To: ToArray;
  }
  export interface FromArray {
    Id: number;
    TabName: string;
    StageTypeInternalCode: string;
    StageTypeName: string;
    IsSelected: number;
  }
  export interface ToArray {
    Id: number;
    TabName: string;
    StageTypeInternalCode: string;
    StageTypeName: string;
    IsSelected: number;
  }

  export interface JobActionUpdateToggle {
    From: JobActionFromToggleArray;
    To: JobActionToToggleArray;
  }
  export interface JobActionFromToggleArray {
    Id: number;
    TabName: string;
    TabDisplayName: string;
    IsTabShow: number;
    ChangeKey: string;
  }
  export interface JobActionToToggleArray {
    Id: number;
    TabName: string;
    TabDisplayName: string;
    IsTabShow: number;
    ChangeKey: string;
  }
  export interface JobActionUpdateName {
    From: JobActionFromToggleArray;
    To: JobActionToToggleArray;
  }
  export interface JobActionFromNameArray {
    Id: number;
    TabName: string;
    TabDisplayName: string;
    IsTabShow: number;
    ChangeKey: string;
  }
  export interface JobActionToNameArray {
    Id: number;
    TabName: string;
    TabDisplayName: string;
    IsTabShow: number;
    ChangeKey: string;
  }

  export interface UpdateSequenceModel {
    From?: (FromEntityOrToEntity)[] | null;
    To?: (FromEntityOrToEntity)[] | null;
  }
  export interface FromEntityOrToEntity {
    Id: number;
    TabName: string;
    DisplaySequence: number;
  }

  
  