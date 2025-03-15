export interface shareClientJSON {
    ClientId: string;
    ParentId: string;
    ParentName:string;
    LocationType: string;
    ServicingOfficeId: string;
    ServicingOffice: string;
    LocationName: string;
    PriorityId: string;
    Priority: string;
    StatusId: string;
    Status: string;
    IndustryId: string;
    Industry: string;
    EOHClientId?: string;
    ShareClientURL:string;
  }

  export enum ClientBtnDetails {
    CANCEL = 'CANCEL',
    SAVE_AND_NEXT = 'SAVE_AND_NEXT',
    SHARE_CLIENT = 'SHARE_CLIENT',
    BACK = 'BACK',
}

export interface ButtonConfig {
  label: string;
  visible: boolean;
}

export interface ModalConfig {
  hideHeader?: boolean; 
}

