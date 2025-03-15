/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who:Renu
  @When:19-Oct-2021
  @Why: EWM-1733 EWM-3126
  @What:  This page will be use for the Inbox Email component ts file for particular candidate
*/
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarService } from '../../../shared/services/sidebar/sidebar.service';
import { SnackBarService } from '../../../shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { ResponceData, Userpreferences } from '../../../shared/models';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { NewEmailComponent } from '../../../modules/EWM.core/shared/quick-modal/new-email/new-email.component';
import { ConfirmDialogModel } from '../../../shared/modal/confirm-dialog/confirm-dialog.component';
import { EmailConfirmDialogComponent } from '../../../shared/modal/email-confirm-dialog/email-confirm-dialog.component';
import { AppSettingsService } from '../../../shared/services/app-settings.service';
import { MailServiceService } from '../../../shared/services/email-service/mail-service.service'
import { UserpreferencesService } from '../../../shared/services/commonservice/userpreferences.service';
import { DisconnectEmailComponent } from '../../../shared/modal/disconnect-email/disconnect-email.component';
import { CommonServiesService } from '../../../shared/services/common-servies.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';


enum fileExtention{
  "application/zip"="zip",
  "application/pdf"="pdf",
  "application/vnd.openxmlformatsofficedocument.spreadsheetml.sheet"="xlsx",
  "text/plain"="txt",
  "application/vnd.ms-word"="doc",
  "application/vnd.ms-excel"="xls",
  "image/png"="png",
  "image/jpeg"="jpeg",
  "image/gif"="gif",
  "text/csv"="csv"
}



@Component({
  selector: 'app-candidate-inbox',
  templateUrl: './candidate-inbox.component.html',
  styleUrls: ['./candidate-inbox.component.scss']
})
export class CandidateInboxComponent implements OnInit {
  public showEmailDetails : boolean = false;
  public showEmailClass : boolean = false;
  public showMarkImportantIcon : any[] = [];
  public maticonImporttant :any= "error_outline";
  public toggleColor = true;
  public changeImpIcon:any[]=[];
  public loading:boolean=false;
  public emailJson:any;
  public totalDataCount: number;
  public listView: any;
  public pagesize;
  public pagneNo = 1;
  public sortingValue: any='';
  public searchValue: any='';
  public emailConnection: boolean;
  public canLoad = false;
  public pendingLoad = false;
  public loadingscroll: boolean;
  public status: boolean;
  public listViewDetails:any={};
  public userpreferences: Userpreferences;
  @Output() mailInBoxCount= new EventEmitter();
  public mailDraftCount: any;
  public counter: any=0;
  public tabActive: string='Inbox';
  public selectedTabIndex: any=0;
  public loadingSearch: boolean;
  public searchVal: string = '';
  public IsSelected:any;
  public checkArr=[];
  public finalArr=[];
  public listViewDraft=[];
  public listViewSend=[];
  @Input() candidateEmail: any;
  public positionMatDrawer: string = 'start';
  searchSubject$ = new Subject<any>(); 
  @Output() scrollChanges: EventEmitter<number> =   new EventEmitter();
  @Input() category:string;
  @Input() candidateId:string;
  constructor(public _sidebarService: SidebarService, private router: Router,private routes: ActivatedRoute,
    private translateService: TranslateService, public dialogObj: MatDialog,private snackBService: SnackBarService,
    public dialog: MatDialog,private appSettingsService: AppSettingsService,private mailService: MailServiceService,
    public _userpreferencesService: UserpreferencesService, public _snackBarService: SnackBarService, 
    private commonServiesService: CommonServiesService,private commonserviceService: CommonserviceService) {
      this.pagesize = this.appSettingsService.pagesize;
    }

  ngOnInit(): void {
    let URL = this.router.url;
    //  let URL_AS_LIST = URL.split('/');
    let URL_AS_LIST;
    if(URL.substring(0, URL.indexOf("?"))==''){
     URL_AS_LIST = URL.split('/');
    }else
    {
     URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }    
      this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
      this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
      // <!---------@When: 23-Aug-2023 @who:Adarsh singh @why: EWM-13921--------->
      let enc:string = btoa('selectedCand');
      this.candidateEmail = this.candidateEmail ?? localStorage.getItem(enc);
      // end 
    this.getMailCount();
    this.fetchInboxList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue,'');
    setInterval(() => {
      this.canLoad = true;
      if (this.pendingLoad) {
        this.onScrollDown();
      }
    }, 2000);
        
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    this.commonserviceService.onUserLanguageDirections.subscribe(res => {
      this.dirChange(res);
    });

    this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => { 
      this.loadingSearch = true;
      this.getFilterValue(val);
       });
  }

  divScroll(event){
    this.scrollChanges.emit(event);
  }
  clickEvent() {
    this.status = !this.status;
    this.counter++;
    if (this.counter >1) {
     this.status=true;
    }
   
  }
  
   /* 
  @Type: File, <ts>
  @Name: openNewEmailModal function
   @Who: Renu
   @When:19-Oct-2021
   @Why: EWM-1733 EWM-3126
  @What: opening new mail
  */
  openNewEmailModal(responseData:any,mailRespondType:string) {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialog.open(NewEmailComponent, {
      maxWidth: "750px",
      width: "95%",
      maxHeight: "100%",
      height: "100%",
      data:{'res':responseData,'mailRespondType':mailRespondType,'openType':localStorage.getItem('emailConnection'),'candidateMail':this.candidateEmail,openDocumentPopUpFor:this.category,candidateId:this.candidateId},
      panelClass: ['quick-modalbox', 'quickNewEmailModal', 'animate__animated', 'animate__slideInRight'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.pagneNo=1;
        this.sortingValue='';
        this.searchValue='';
        this.fetchInboxList(this.pagesize,this.pagneNo,this.sortingValue,this.searchValue,'');
      }
    })
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.add("is-blurred");
    }

  }

 
  showEmailSection(){
    this.showEmailDetails = true;
  }

   /* 
  @Type: File, <ts>
  @Name: reloadPage function
   @Who: Renu
   @When:19-Oct-2021
   @Why: EWM-1733 EWM-3126
  @What: refresh the data 
  */
  reloadPage() : void{
    this.loading=true;
    this.pagneNo=1;
    this.fetchInboxList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue,'');

  }

  /* 
  @Type: File, <ts>
  @Name: enableDisableRule function
   @Who: Renu
   @When:19-Oct-2021
   @Why: EWM-1733 EWM-3126
  @What:on click mark as fav
  */

  enableDisableRule(index:number,markImp:number,UniqueId:any) {
    if(markImp!=1){
     // this.toggleColor = !this.toggleColor;
      this.showMarkImportantIcon[index]=true;
      this.changeImpIcon[index]=false;
      //this.maticonImporttant[index] = "error";
      //event.stopPropagation();
    }else{
      this.showMarkImportantIcon[index]=false;
      this.changeImpIcon[index]=false;
    }
   this.markAsImportant(UniqueId,markImp,'Imp');
  }

   
/* 
  @Type: File, <ts>
  @Name: hideEmailSection function
   @Who: Renu
   @When:19-Oct-2021
   @Why: EWM-1733 EWM-3126
  @What: hide mail section
  */

  hideEmailSection(){
    this.status=false;
    this.IsSelected='';
    //document.getElementsByClassName("openingMailSectionRight")[0].classList.remove("")
    //document.getElementsByClassName("openingMailSectionRight")[0].classList.remove("animate__fadeInRightBig");
   // document.getElementsByClassName("openingMailSectionRight")[0].classList.add("animate__fadeInLeftBig");
    //this.showEmailClass = false;
  }

  
/* 
  @Type: File, <ts>
  @Name: fetchSendList function
   @Who: Renu
   @When:19-Oct-2021
   @Why: EWM-1733 EWM-3126
  @What: service call for send List data
  */
  fetchSendList(pagesize, pagneNo, sortingValue, searchVal) {
    this.loading = true;
    this.mailService.fetchSendMailList(pagesize, pagneNo, sortingValue, searchVal).subscribe(
      (repsonsedata:ResponceData) => {
        if (repsonsedata.HttpStatusCode===200) {
          this.loading = false;
          this.totalDataCount = repsonsedata.TotalRecord;
          this.listViewSend = repsonsedata.Data;
        } else if( repsonsedata.HttpStatusCode === 204 ){
          this.totalDataCount = repsonsedata.TotalRecord;
         this.loading = false;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }


    /*
  @Type: File, <ts>
  @Name: onScrollDown
  @Who: Renu
  @When: 22-Sept-2021
  @Why: EWM-1733 EWM-3126
  @What: To add data on page scroll.
  */

  onScrollDown(ev?) {
    this.loadingscroll = true;
    if (this.canLoad) {
      this.canLoad = false;
      this.pendingLoad = false;
      if (this.totalDataCount > this.listView.length) {
        this.pagneNo = this.pagneNo + 1;
        this.fetchMoreRecord(this.pagesize, this.pagneNo, this.sortingValue);
      } else {
        this.loadingscroll = false;
      }
    } else {
      this.loadingscroll = false;
      this.pendingLoad = true;
    }
  }

  /*
 @Type: File, <ts>
 @Name: fetchMoreRecord
 @Who: Renu
 @When: 22-Sept-2021
 @Why: EWM-1733 EWM-3126
 @What: To get more data from server on page scroll.
 */

 fetchMoreRecord(pagesize, pagneNo, sortingValue) {
  // <!---------@When: 23-Aug-2023 @who:Adarsh singh @why: EWM-13918 @Desc- wrong API was calling here --------->
  this.mailService.fetchCandidateMailList(pagesize, pagneNo, sortingValue, this.searchValue,this.candidateEmail).subscribe(
    (repsonsedata:ResponceData) => {
      if (repsonsedata.HttpStatusCode===200) {
        this.loadingscroll = false;
        this.totalDataCount = repsonsedata.TotalRecord;
        let nextgridView: any = [];
        nextgridView = repsonsedata.Data;
        this.listView = this.listView.concat(nextgridView);
      } else if(repsonsedata.HttpStatusCode === 204 ) {
        this.totalDataCount = repsonsedata.TotalRecord;
         this.loadingscroll = false;
        }else  {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
    }, err => {
      this.loadingscroll = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

    })
}


  /*
 @Type: File, <ts>
 @Name: getDetailsInfo
 @Who: Renu
 @When: 23-Sept-2021
 @Why: EWM-1733 EWM-3126
 @What: To get deatil data based on unique Id
 */
getDetailsInfo(UniqueId){
  this.loading=true;
  this.IsSelected=UniqueId;
 this.listView.filter(x=>{
    if(x['UniqueId']==UniqueId)
    {
      x['IsRead']=1;
    }
  }
 );
  this.mailService.fetchMailDetails(UniqueId).subscribe(
    (repsonsedata:ResponceData) => {
      if (repsonsedata.HttpStatusCode===200) {
        this.loading = false; 
        this.totalDataCount = repsonsedata.TotalRecord;
        this.listViewDetails = repsonsedata.Data;
      } else if(repsonsedata.HttpStatusCode === 204 ) {
        this.totalDataCount = repsonsedata.TotalRecord;
         this.loading = false;
        }else  {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
    }, err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

    })
}


  /*
 @Type: File, <ts>
 @Name: sortName
 @Who: Renu
 @When: 23-Sept-2021
 @Why: EWM-1733 EWM-3126
 @What: To get short name if user profile image not present
 */
 sortName(fisrtName, lastName) {​​​​​​
  if(fisrtName|| lastName){
    const Name = fisrtName + " " + lastName;
    const ShortName = Name.split(/\s/).reduce((response,word)=> response+=word.slice(0,1),'');
    return ShortName.toUpperCase();
  }
  }​​​​​​

   
 /*
 @Type: File, <ts>
 @Name: emailDownloadAttachement
 @Who: Renu
 @When: 23-Sept-2021
 @Why: EWM-1733 EWM-3126
 @What: To get maildownload attachement
 */
 emailDownloadAttachement(EmailGuid:any,AttachmentId:any,name:any){
  this.loading=true;
  let downloadObj={};
  downloadObj['EmailGuid']=EmailGuid;
  downloadObj['AttachmentId']=AttachmentId;
  this.mailService.emailDownloadAttachement(downloadObj).subscribe(
      (data:any)=>{
        const Url= URL.createObjectURL(data)
         const fileExt=fileExtention[data.type];
          this.loading=false;
         this.downloadFile(data,name);
         })  
      
}

 /*
 @Type: File, <ts>
 @Name: downloadFile
 @Who: Renu
 @When: 23-Sept-2021
 @Why: EWM-2641 EWM-2996
 @What: To get maildownload attachement
 */
private downloadFile(data,filename) {
  const downloadedFile = new Blob([data], { type: data.type });
  const a = document.createElement('a');
  a.setAttribute('style', 'display:none;');
  document.body.appendChild(a);
  a.download = filename;
  a.href = URL.createObjectURL(downloadedFile);
  a.target = '_blank';
  a.click();
  document.body.removeChild(a);
}



  /* 
  @Type: File, <ts>
  @Name: checkEmailConnection function
   @Who: Renu
   @When:19-Oct-2021
   @Why: EWM-1733 EWM-3126
  @What: check email connection is established or not
  */
  markAsImportant(UniqueId:any,markImp:any,Imp:string){
    let markAsImp={};
    markAsImp['EmailGuid']=UniqueId;
    if(markImp==1){
      markAsImp['IsFavourite']=0;
    }else{
      markAsImp['IsFavourite']=1;
    }
  
    this.mailService.markAsImportant(markAsImp).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode === 200) {  
         this.fetchInboxList(this.pagesize,this.pagneNo,this.sortingValue,this.searchValue,Imp); 
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
        }
      }, err => {
       this.loading = false;
       this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
    }

     /*
@Name: onFilter function
@Who: Renu
@When: 15-May-2021
@Why: EWM-1500
@What: use for Searching records
*/
  public onFilter(inputValue: string): void {
    this.loading = false;
    if (inputValue.length > 0 && inputValue.length < 3) {
      this.loadingSearch = false;
      return;
    }
    this.pagneNo = 1;
    this.searchSubject$.next(inputValue); 
    
  }

  getFilterValue(searchValue){
    this.mailService.fetchCandidateMailList(this.pagesize, this.pagneNo, this.sortingValue,searchValue,this.candidateEmail).subscribe(
      (repsonsedata:ResponceData) => {
        if (repsonsedata.HttpStatusCode===200) {
          this.loading = false;
          this.loadingSearch = false;
          this.totalDataCount = repsonsedata.TotalRecord;
          this.listView = repsonsedata.Data;
        } else if( repsonsedata.HttpStatusCode === 204 ){
          this.totalDataCount = repsonsedata.TotalRecord;
          this.listView = [];
         this.loading = false;
         this.loadingSearch = false;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }      }, err => {
        this.loading = false;
        this.loadingSearch = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }

/*
@Name: onFilterClear function
@Who: Nitin
@When: 21-Aug-2021
@Why: EWM-2502
@What: use Clear for Searching records
*/
public onFilterClear(): void {
  this.searchValue='';
  this.fetchInboxList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue,'');
}


/*
@Name: ShowOnlyImportantFilter function
@Who: Renu
@When: 24-Sep-2021
@Why: EWM-2996
@What: filter only important records
*/
ShowOnlyImportantFilter(event:any){
  this.pagneNo=1;
  if(event.checked){
   this.fetchFavoriteMailList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue,'',this.candidateEmail)
  }else{
    this.pagneNo=1;
    this.fetchInboxList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue,'');
  }
}

/*
@Name: fetchFavoriteMailList function
@Who: Renu
@When: 24-Sep-2021
@Why: EWM-2996
@What: filter only fave records
*/
fetchFavoriteMailList(pagesize, pagneNo, sortingValue, searchVal,Imp,candidateEmail){
  if(Imp=='Imp'){
    this.loading = false;
  }else{
    this.loading = true;
  }
 
  this.mailService.fetchFavoriteMailList(pagesize, pagneNo, sortingValue, searchVal,candidateEmail).subscribe(
    (repsonsedata:ResponceData) => {
      if (repsonsedata.HttpStatusCode===200) {
        this.loading = false;
        this.totalDataCount = repsonsedata.TotalRecord;
        this.listView = repsonsedata.Data;
      } else if( repsonsedata.HttpStatusCode === 204 ){
        this.totalDataCount = repsonsedata.TotalRecord;
        this.listView = [];
       this.loading = false;
      } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
    }, err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

    })
}

/*
@Name: checkmultipleInfo function
@Who: Renu
@When: 24-Sep-2021
@Why: EWM-2996
@What: mark as read/unread for multiple mails
*/
checkmultipleInfo(uniqueId:any,event:any){
if(event==true){
  this.checkArr.push(uniqueId);
}
}

/*
@Name: updateMarkAsReadUnRead function
@Who: Renu
@When: 24-Sep-2021
@Why: EWM-2996
@What: mark as read/unread for multiple mails
*/
updateMarkAsReadUnRead(status:number){
  this.finalArr=[];
this.checkArr.forEach(x=>{
  this.finalArr.push({
  'EmailGuid':x,
  'IsRead':status
})
})
this.checkArr=[];
let obj={};
obj['ReadUnread']=this.finalArr;
this.loading=true;
this.mailService.markAsUnRead(obj).subscribe(
  (repsonsedata:ResponceData) => {
    if (repsonsedata.HttpStatusCode===200) {
      this.loading = false;
    this.fetchInboxList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue,'');
  
    }  else {
      this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      this.loading = false;
    }      
  }, err => {
    this.loading = false;
    this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

  })

}

 
 /*
@Name: footer.component.ts
@Who: Nitin
@When: 09-Oct-2020
@Why: ROST-247
@What: Implementation of Footer Section Flip with Logo Icon
*/
dirChange(res) {
  if (res == 'ltr') {
    this.positionMatDrawer = 'start';
  } else {
    this.positionMatDrawer = 'end';
  }
}

/* 
  @Type: File, <ts>
  @Name: fetchInboxList function
   @Who: Renu
   @When:19-Oct-2021
   @Why: EWM-1733 EWM-3126
  @What: service call for List data
  */
  fetchInboxList(pagesize, pagneNo, sortingValue, searchVal,Imp) {  
    if(Imp=='Imp'){
      this.loading = false;
    }else{
      this.loading = true;
    }   
    this.loading = true;
    this.mailService.fetchCandidateMailList(pagesize, pagneNo, sortingValue, searchVal,this.candidateEmail).subscribe(
      (repsonsedata:ResponceData) => {
        if (repsonsedata.HttpStatusCode===200) {
          this.totalDataCount = repsonsedata.TotalRecord;
          this.listView = repsonsedata.Data;
          this.loading = false;
        } else if( repsonsedata.HttpStatusCode === 204 ){
          this.totalDataCount = repsonsedata.TotalRecord;
          this.listView = [];
         this.loading = false;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }

  /*
 @Type: File, <ts>
 @Name: getMailCount
 @Who: Renu
 @When: 20-Oct-2021
 @Why: EWM-1733 EWM-3126
 @What: To get mail count Info for particular candidate
 */
 getMailCount(){
  this.loading=true;
 // alert(this.candidateEmail);
  this.mailService.fetchMailCandidateCount(this.candidateEmail).subscribe(
    (repsonsedata:ResponceData) => {
      if (repsonsedata.HttpStatusCode===200) {
        // this.loading = false;
        this.mailInBoxCount.emit(repsonsedata.Data?.Inbox);
      } else if(repsonsedata.HttpStatusCode === 204 ) {
        this.loading = false;
        this.mailInBoxCount.emit(repsonsedata.Data?.Inbox);
        }else  {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
    }, err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

    })
}
}
