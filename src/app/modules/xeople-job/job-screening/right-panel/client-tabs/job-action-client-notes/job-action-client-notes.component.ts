//  who:maneesh:what:ewm-13775 for create job action candidate notes,when:06/09/2023
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ButtonTypes, ResponceData, Userpreferences } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { HttpClient } from '@angular/common/http';
import { debounceTime } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { JobScreening } from 'src/app/shared/models/job-screening';
import { GetClientNotesListModel } from 'src/app/shared/models/job-action-clientTab-notelist'
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { JobActionAddClientNotesComponent } from '../job-action-add-client-notes/job-action-add-client-notes.component';
import { ClientService } from 'src/app/modules/EWM.core/shared/services/client/client.service';
import { ShortNameColorCode } from '@app/shared/models/background-color';


@Component({
  selector: 'app-job-action-client-notes',
  templateUrl: './job-action-client-notes.component.html',
  styleUrls: ['./job-action-client-notes.component.scss']
})
export class JobActionClientNotesComponent implements OnInit {
  public candidateid:string;
  public loadingscroll: boolean;
  public loading: boolean;
  public gridList: any = [];
  public pagesize: number;
  public pagneNo: number;
  public yearFilterRes: number;
  public monthFilterRes: string;
  public GridId="JobNotes_grid_001";
  public isReadMore: any[] = [false];
  public ToDate: string;
  public FromDate: string;
  public OwnerIds: any=[];
  public hoverIndex:number = -1;
  public timelineMonth:string;
  public timelineYear:number;
  @Input() jobId: string;
  public userpreferences: Userpreferences;
  public documentTypeOptions:any=[];
  public searchSubject$ = new Subject<any>();
  public searchValue: string = "";
  public loadingSearch: boolean;
  public orderBy:string='LastUpdated,desc';
  public userType:string='CAND';
  public tabIndex:number=6;
  public getNotesList: Subscription;
  public selectedCandidate: Subscription;
  public searchNotes: Subscription;
  public candidateName:string;
  public clientId:string;
  public notestabIndex:number=6
  animationVar: any;
  public gridListData: any = [];
  public searchData:string='';
  constructor(public dialog: MatDialog, private jobService: JobService,private http: HttpClient,
    private appSettingsService: AppSettingsService,public _userpreferencesService: UserpreferencesService,
    private commonserviceService: CommonserviceService,private clientService: ClientService,) {
    this.pagneNo = this.appSettingsService?.pageOption;
    this.pagesize = appSettingsService?.pagesize;
    this.yearFilterRes=0;
    this.http.get("assets/config/document-config.json").subscribe(data => {
      this.documentTypeOptions = JSON.parse(JSON.stringify(data));      
    })
    this.commonserviceService.notesClientId.subscribe((res=>{
      this.clientId=res;     
    }))
  }
  ngOnInit(): void {
    this.userpreferences = this._userpreferencesService?.getuserpreferences();
    this.searchNotes= this.searchSubject$.pipe(debounceTime(1000)).subscribe(value => {
      this.loadingSearch = true;
      this.NotesList(this.jobId, this.yearFilterRes, this.monthFilterRes, this.pagneNo,value); 
    });
    this.selectedCandidate = this.commonserviceService.getJobScreeningInfo().subscribe((res: JobScreening) => {
    let candidateList = res?.SelectedCandidate;          
    if (candidateList?.length>0) {
      this.searchValue = ''; 
      this.candidateid = candidateList[0]?.CandidateId;
      this.candidateName = candidateList[0]?.CandidateName;
      this.NotesList(this.jobId, this.yearFilterRes, this.monthFilterRes, this.pagneNo,this.searchValue);
}
  });
  this.animationVar = ButtonTypes;
  }
//  who:maneesh:what:ewm-13875 for unsubscribe ,function:ngOnDestroy,when:06/09/2023
ngOnDestroy() {
    this.getNotesList?.unsubscribe();
    this.selectedCandidate?.unsubscribe();
    this.searchNotes?.unsubscribe();
  }
//  who:maneesh:what:ewm-13875 for NotesList ,function:NotesList,when:06/09/2023
  NotesList(jobId: string, year: number, month: string, pageNo:number,searchValue:string) {
    this.searchData=searchValue;
    this.timelineMonth = month;
    this.timelineYear = year;  
    this.yearFilterRes = year;
    this.monthFilterRes = month;
    let jsonObj :GetClientNotesListModel;
    jsonObj={
      ClientId :this.clientId,
      Year :this.yearFilterRes ? this.yearFilterRes : 0,
      Month :this.monthFilterRes ? this.monthFilterRes : '',
      OwnerIds :[],
      CategoryIds :[],
      NotesFilterParams :[],
      PageNumber :pageNo,
      PageSize : this.pagesize,
      OrderBy : this.orderBy,
      GridId :this.GridId,
      FromDate :this.FromDate ? this.FromDate : null,
      ToDate : this.ToDate ? this.ToDate : null,
      Search:searchValue
    }
    this.loading = true;
        this.getNotesList=this.clientService.fetchClientNotesAll(jsonObj).subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode === 200) {
            this.gridList = data.Data; 
            this.gridListData = data.Data;
            this.searchData='disableOwwnerFilterIcon';//who:maneesh,what:ewm-15409 for disabled all filtericon,when:13/12/2023
            this.loading = false;
            this.loadingSearch = false;
          }
          else if (data.HttpStatusCode === 204) {
            this.gridList = data.Data;
            this.gridListData = data.Data;
            this.loading = false;
            this.loadingSearch = false;
          }
          else {
            this.gridListData = data.Data;
            this.loading = false; 
            this.loadingSearch = false;
          }
        }, err => {
          this.loading = false;
          this.loadingSearch = false;
        });

  }
//  who:maneesh:what:ewm-13875 for onHover in icon ,function:onHover,when:06/09/2023
  onHover(i: number) {
    this.hoverIndex = i;
    var element = document.getElementById("flex-box-hover");
    if (i != -1) {
      element.classList.add("test");
    } else {
      this.hoverIndex = i;
      element.classList.remove("test");
    }
  }
  
//  who:maneesh:what:ewm-13875 for openNoteListDataModel ,function:openNoteListDataModel,when:06/09/2023
  openNoteListDataModel() {
    let jsonObj = {};
    jsonObj['JobId'] = this.jobId;
    jsonObj['Candidatesids'] = this.candidateid;
    jsonObj['candidateName'] = this.candidateName;
    const dialogRef = this.dialog.open(JobActionAddClientNotesComponent, {
      data: jsonObj,
      panelClass: ['xeople-drawer', 'quick-modal-drawer', 'animate__animated', 'animate__slideInRight'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
   if (res==true) {
    this.NotesList(this.jobId, this.yearFilterRes, this.monthFilterRes, this.pagneNo,this.searchValue);
  }
    })
  }
//  who:maneesh:what:ewm-13875 for openNoteListDataModel ,function:openNoteListDataModel,when:06/09/2023
  manageNotes() {
    let URL = '/client/core/clients/list/client-detail?clientId='+this.clientId +'&cliTabIndex='+this.notestabIndex;
     window.open(URL, '_blank')
    }
//  who:maneesh:what:ewm-13875 for getIcon when upload document ,function:getIcon,when:06/09/2023
    getIcon(uploadDocument) {
      if (uploadDocument) {
        const list = uploadDocument?.split('.');
        const fileType = list[list.length - 1];
        let FileTypeJson = this.documentTypeOptions?.filter(x => x['type'] === fileType?.toLocaleLowerCase());
        if (FileTypeJson[0]) {
          let logo = FileTypeJson[0].logo;
          return logo;
        }
      }
    }
//  who:maneesh:what:ewm-13875 for searchdata ,function:onFilter,when:06/09/2023
    public onFilter(inputValue: string): void {
      if (inputValue?.length > 0 && inputValue?.length < 3) {
        this.loadingSearch = false;
        return;
      }
      this.pagneNo = 1;
      this.searchSubject$.next(inputValue);
    }
//  who:maneesh:what:ewm-13875 for clear searchdata ,function:onFilterClear,when:06/09/2023
    public onFilterClear(): void {
      this.searchValue = ''; 
      this.NotesList(this.jobId, this.yearFilterRes, this.monthFilterRes, this.pagneNo,this.searchValue);
      this.searchData='inputValue';

    }
                /*
  @Name: getBackgroundColor function
  @Who: maneesh
  @When: 22-11-2023
  @Why: EWM-15031
  @What: set background color
*/
getBackgroundColor(shortName) {
  if (shortName?.length > 0) {
    return ShortNameColorCode[shortName[0]?.toUpperCase()]
  }
}
    /*
  @Type: File, <ts>
  @Name: refreshComponent function
  @Who:maneesh
  @When: 12-12-2023
  @Why: EWM-15409
  @What: refreshComponent for refress  get client list
*/
refreshComponent(){
  this.NotesList(this.jobId, this.yearFilterRes, this.monthFilterRes, this.pagneNo,this.searchValue);
}

    mouseoverAnimation(matIconId, animationName) {
      let amin = localStorage.getItem('animation');
      if (Number(amin) != 0) {
        document.getElementById(matIconId).classList.add(animationName);
      }
    }
    mouseleaveAnimation(matIconId, animationName) {
      document.getElementById(matIconId).classList.remove(animationName)
    }
}


