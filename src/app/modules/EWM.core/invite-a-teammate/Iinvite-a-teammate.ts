/*
     @Type: File, <ts>
    @Name: invite-a-teammate.ts
    @Who: Anup Singh
    @When: 27-May-2021
    @Why: EWM-1434 EWM-1612
    @What: Interface for invite teammate
  */

    export interface IinviteTeammate {
        OrganizationId?: string;
        Teammates?: Iteammate[];
    }

    export interface Iteammate {
        Id?: number;
        UserTypeCode?: string;
        Email?: string;
        FirstName?: string;
        LastName?: string;
    }



