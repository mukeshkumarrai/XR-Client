export class CandidateSourceList {
    From: CandidateSource;
    To: CandidateSource;
}

export class CandidateSourceFolder{
    FolderId: number;
    FolderName: string;
}

export class CandidateSourceTag{
    TagId: number;
    TagName: string;
}

export class CandidateSource{
    SourceId: number;
    ApplicationSource: string;
    ApplicationSourceKey: string;
    Description: string;
    StatusId: string;
    StatusName: string;
    StatusColor: string;
    LastUpdated: number;
    CandidateSourceFolder:Array<CandidateSourceFolder>;
    CandidateSourceTag: Array<CandidateSourceTag>;
  }

  export class CreateCandidateSource{
    Description: string;
    ApplicationSource: string;
    StatusId: string;
    StatusName: string;
    CandidateSourceFolder:Array<CandidateSourceFolder>;
    CandidateSourceTag: Array<CandidateSourceTag>;
    LastUpdated:number;
    StatusColor:string;
  }
  export class CreateCandidateChildSource{
    Description: string;
    ApplicationSource: string;
    StatusId: string;
    StatusName: string;

  }
