export interface EDITOR_CONFIG {
    REQUIRED: boolean; // True and false
    DESC_VALUE: String;
    PLACEHOLDER:String;
    Tag:[],
    EditorTools:[],
    MentionStatus:boolean,
    maxLength:number,
    MaxlengthErrormessage:boolean,
    JobActionComment:boolean,
    ValidationMessage?: string | null; // Making Validation optional
    DISABLED?: boolean | null; // Making DISABLED WOHOLE EDITOR optional
    hideIcon?: boolean | null; // hide icon for additional information EDITOR in candidate and employee menu summery pageoptional
    hideIconForAddCommonCallLog?: boolean | null; // hide icon for EDITOR in add call log


}
   
