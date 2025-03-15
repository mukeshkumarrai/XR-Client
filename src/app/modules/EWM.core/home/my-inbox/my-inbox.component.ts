/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Naresh Singh
  @When: 05-Sep-2021
  @Why: EWM-2511 EWM-2707
  @What:  This page will be use for the Inbox Email component ts file
*/

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SidebarService } from '../../../../shared/services/sidebar/sidebar.service';
import { SnackBarService } from '../../../../shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { ResponceData, Userpreferences } from 'src/app/shared/models';
import { MatDialog } from '@angular/material/dialog';
import { NewEmailComponent } from 'src/app/modules/EWM.core/shared/quick-modal/new-email/new-email.component';
import { ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { EmailConfirmDialogComponent } from 'src/app/shared/modal/email-confirm-dialog/email-confirm-dialog.component';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { MailServiceService } from '../../../../shared/services/email-service/mail-service.service'
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { DisconnectEmailComponent } from 'src/app/shared/modal/disconnect-email/disconnect-email.component';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { ShortNameColorCode } from 'src/app/shared/models/background-color';

enum Tab{
  'Inbox',
  'Draft',
   'Sent',
   'Templates'
   }
@Component({
  selector: 'app-my-inbox',
  templateUrl: './my-inbox.component.html',
  styleUrls: ['./my-inbox.component.scss']
})
export class MyInboxComponent implements OnInit {

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
  public mailInBoxCount: number;
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
  //public candidateEmail:any;
  public positionMatDrawer: string ;
  public mailSentCount: number;
  ActivedraftId: any=null;
  positionMatTab: any;
  public isFavouritChecked:boolean = false;
  searchSubject$ = new Subject<any>();
  LastSyncDate: number;
  public currentDate=new Date();
  constructor(public _sidebarService: SidebarService, private router: Router,private routes: ActivatedRoute,
    private translateService: TranslateService, public dialogObj: MatDialog,private snackBService: SnackBarService,
    public dialog: MatDialog,private appSettingsService: AppSettingsService,private mailService: MailServiceService,
    public _userpreferencesService: UserpreferencesService, public _snackBarService: SnackBarService,
    private commonServiesService: CommonServiesService,private commonserviceService: CommonserviceService,
    ) {
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
    this.checkEmailConnection();
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



    this.commonserviceService.onUserLanguageDirections.subscribe(res => {
      this.positionMatTab=res;
    });

    this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {  
      this.loadingSearch = true;
      this.getFilterValue(val);
       });
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
   @When: 30-Sept-2021
   @Why: EWM-2641 EWM-3073
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
      data:{'res':responseData,'mailRespondType':mailRespondType,'openType':this.emailConnection,'toEnableEmail':true},
      panelClass: ['quick-modalbox', 'quickNewEmailModal', 'animate__animated', 'animate__slideInRight'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult) {
        this.pagneNo=1;
        this.sortingValue='';
        this.searchValue='';
        if(this.tabActive=='Draft'){
          if(dialogResult.draft==true){
            this.getDraftList(this.pagesize,this.pagneNo,this.sortingValue,this.searchValue);
          }else{
            this.deleteDraft( this.pagneNo, this.sortingValue, this.searchValue);
          }
        }else if(this.tabActive=='Inbox'){
          if(this.isFavouritChecked){
            this.fetchFavoriteMailList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue,'')
          }else{
            this.fetchInboxList(this.pagesize,this.pagneNo,this.sortingValue,this.searchValue,'');
          }
        }else if(this.tabActive=='Sent'){
          setTimeout(()=>{
            this.fetchSendList(this.pagesize,this.pagneNo,this.sortingValue,this.searchValue);
          },2000)
        }
        setTimeout(()=>{
          this.getMailCount();
        },2000)
      }
    })

  }

  deleteDraft(pagneNo,sortingValue,searchValue){
    let deleteObj={};
    deleteObj['draftId']=this.ActivedraftId;
    this.mailService.deleteDraftMailById(this.ActivedraftId).subscribe(
      (repsonsedata:ResponceData) => {
        if (repsonsedata.HttpStatusCode===200) {
          this.ActivedraftId=null;
          this.getDraftList(this.pagesize,pagneNo,sortingValue,searchValue);
        }  else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }

  // mouseEnter(index:number) {
  //  if(this.showMarkImportantIcon[index]!=true)
  //   {
  //     this.changeImpIcon[index] = true;
  //   }
  // }

  // mouseLeave(index:number) {
  //   this.changeImpIcon[index] = false;
  // }
  showEmailSection(){
    this.showEmailDetails = true;
  }

   /*
  @Type: File, <ts>
  @Name: reloadPage function
   @Who: Renu
   @When: 21-Sept-2021
   @Why: EWM-2511 EWM-2704
  @What: refresh the data
  */
  reloadPage() : void{
    this.loading=true;
    this.pagneNo=1;
  // this.fetchInboxList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue,'');
    if(this.isFavouritChecked){
     this.fetchFavoriteMailList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue,'')
    }else{
      this.fetchInboxList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue,'');
    }
    this.getMailCount();
    // if(this.tabActive=='Draft'){
    //   this.getDraftList(this.pagesize,this.pagneNo,this.sortingValue,this.searchValue);
    // }else if(this.tabActive=='Inbox'){
    // this.fetchInboxList(this.pagesize,this.pagneNo,this.sortingValue,this.searchValue,'');
    // }else if(this.tabActive=='Sent'){
    // this.fetchSendList(this.pagesize,this.pagneNo,this.sortingValue,this.searchValue);
    // }
    // this.getMailCount();
  }

  /*
  @Type: File, <ts>
  @Name: enableDisableRule function
   @Who: Renu
   @When: 21-Sept-2021
   @Why: EWM-2511 EWM-2704
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
   @When: 21-Sept-2021
   @Why: EWM-2511 EWM-2704
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
   @When: 21-Sept-2021
   @Why: EWM-2511 EWM-2704
  @What: service call for send List data
  */
 sendEmail;
  fetchSendList(pagesize, pagneNo, sortingValue, searchVal) {
    this.loading = true;
    this.mailService.fetchSendMailList(pagesize, pagneNo, sortingValue, searchVal).subscribe(
      (repsonsedata:ResponceData) => {
        if (repsonsedata.HttpStatusCode===200) {
          this.loading = false;
          this.totalDataCount = repsonsedata.TotalRecord;
          this.sendEmail = repsonsedata.Data.EmailTo;
          // <!-- who:bantee,what:ewm-13955 Api changes data issue fixed ,when:29/08/2023 -->

          this.sendEmailData = repsonsedata.Data.UserMailList;

        } else if( repsonsedata.HttpStatusCode === 204 ){
          this.totalDataCount = repsonsedata.TotalRecord;
          this.sendEmailData =[];
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
  @Name: checkEmailConnection function
   @Who: Renu
   @When: 21-Sept-2021
   @Why: EWM-2511 EWM-2704
  @What: check email connection is established or not
  */
  checkEmailConnection(){
    this.mailService.getUserIsEmailConnected().subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode === 200) {
          if(data.Data.IsEmailConnected==1){
           this.emailConnection=true;
          }else{
            this.emailConnection=false;
          }
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
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
  @Why: EWM-2511 EWM-2704
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
 @Why: EWM-2511 EWM-2704
 @What: To get more data from server on page scroll.
 */

 fetchMoreRecord(pagesize, pagneNo, sortingValue) {
  this.mailService.fetchMailList(pagesize, pagneNo, sortingValue, this.searchValue,'').subscribe(
    (repsonsedata:ResponceData) => {
      if (repsonsedata.HttpStatusCode===200) {
        this.loadingscroll = false;
        this.totalDataCount = repsonsedata.TotalRecord;
        let nextgridView: any = [];
        nextgridView = repsonsedata.Data.UserMailList;
        this.listView = this.listView.concat(nextgridView);
      } else if(repsonsedata.HttpStatusCode === 204 ) {
        this.totalDataCount = repsonsedata.TotalRecord;
         this.loadingscroll = false;
         this.listView =[];
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
 @Why: EWM-2511 EWM-2704
 @What: To get deatil data based on unique Id
 */
getDetailsInfo(UniqueId){
  this.loading=true;
  this.IsSelected=UniqueId;
 this.listView?.filter(x=>{
    if(x['UniqueId']==UniqueId)
    {
      x['IsRead']=1;
    }
  }
 );
  this.mailService.fetchMailDetails(UniqueId,this.tabActive).subscribe(
    (repsonsedata:ResponceData) => {
      if (repsonsedata.HttpStatusCode===200) {
        this.loading = false;
        this.getMailCount();
        this.totalDataCount = repsonsedata.TotalRecord;
        this.listViewDetails = repsonsedata.Data;
      } else if(repsonsedata.HttpStatusCode === 204 ) {
        this.totalDataCount = repsonsedata.TotalRecord;
        this.listViewDetails = [];
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
 @Why: EWM-2511 EWM-2704
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
 @Name: getMailCount
 @Who: Renu
 @When: 23-Sept-2021
 @Why: EWM-2511 EWM-2704
 @What: To get mail count Info
 */
  getMailCount(){
    //this.loading=true;
    this.mailService.fetchMailCount().subscribe(
      (repsonsedata:ResponceData) => {
        if (repsonsedata.HttpStatusCode===200) {
          this.loading = false;
          this.mailInBoxCount = repsonsedata.Data.Inbox;
          this.mailDraftCount = repsonsedata.Data.Drafts;
          this.mailSentCount = repsonsedata.Data.Sent;

        } else if(repsonsedata.HttpStatusCode === 204 ) {
          this.mailInBoxCount = repsonsedata.Data.Inbox;
          this.mailDraftCount = repsonsedata.Data.Drafts;
          this.mailSentCount = repsonsedata.Data.Sent;
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
 @Name: emailDownloadAttachement
 @Who: Renu
 @When: 23-Sept-2021
 @Why: EWM-2511 EWM-2704
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
        /*--@when:21-06-2023,@why:12810,@who: nitin Bhati----*/
        //  const fileExt=fileExtention[data?.type];
        //  let fileName= name+'.'+fileExt;
        let fileName= name;
         this.loading=false;
         this.downloadFile(data,fileName);
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
 @Name: ActiveTab
 @Who: Renu
 @When: 23-Sept-2021
 @Why: EWM-2641 EWM-2996
 @What: To get active tab list
 */

  ActiveTab(event)
  {
    this.ActivedraftId=null;
    this.hideEmailSection();
    this.pagneNo=1;
    this.sortingValue='';
    this.searchValue='';
    this.tabActive=Tab[event.index];
    if(this.tabActive=='Draft'){
      this.getDraftList(this.pagesize,this.pagneNo,this.sortingValue,this.searchValue);
    }else if(this.tabActive=='Inbox'){
      //this.fetchInboxList(this.pagesize,this.pagneNo,this.sortingValue,this.searchValue,'');
      if(this.isFavouritChecked){
        this.fetchFavoriteMailList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue,'')
      }else{
        this.fetchInboxList(this.pagesize,this.pagneNo,this.sortingValue,this.searchValue,'');
      }
    }else if(this.tabActive=='Sent'){
      this.fetchSendList(this.pagesize,this.pagneNo,this.sortingValue,this.searchValue);
    }
}


 /*
 @Type: File, <ts>
 @Name: getDraftList
 @Who: Renu
 @When: 23-Sept-2021
 @Why: EWM-2641 EWM-2996
 @What: To get draft mail list information
 */
getDraftList(pagesize, pagneNo, sortingValue, searchVal){
    this.loading = true;
    this.mailService.getDraftMail(pagesize, pagneNo, sortingValue, searchVal).subscribe(
      (repsonsedata:ResponceData) => {
        if (repsonsedata.HttpStatusCode===200) {
          this.loading = false;
          this.totalDataCount = repsonsedata.TotalRecord;
          this.listViewDraft = repsonsedata.Data;
        } else if( repsonsedata.HttpStatusCode === 204 ){
          this.totalDataCount = repsonsedata.TotalRecord;
          this.listViewDraft = [];
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
  @Name: checkEmailConnection function
   @Who: Renu
   @When: 21-Sept-2021
   @Why: EWM-2511 EWM-2704
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
sendEmailData:any;
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
    if(this.tabActive=='Inbox'){
      this.mailService.fetchMailList(this.pagesize, this.pagneNo, this.sortingValue,searchValue,'').subscribe(
        (repsonsedata:ResponceData) => {
          if (repsonsedata.HttpStatusCode===200) {
            this.loading = false;
            this.loadingSearch = false;
            this.totalDataCount = repsonsedata.TotalRecord;
          // <!-- who:bantee,what:ewm-13955 Api changes data issue fixed ,when:29/08/2023 -->

            this.listView = repsonsedata.Data.UserMailList;
          } else if( repsonsedata.HttpStatusCode === 204 ){
            this.totalDataCount = repsonsedata.TotalRecord;
            this.listView = [];
           this.loading = false;
           this.loadingSearch = false;
          } else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
            this.loading = false;
            this.loadingSearch = false;
          }      }, err => {
          this.loading = false;
          this.loadingSearch = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

        })

    }else if(this.tabActive=='Draft'){
      this.mailService.getDraftMail(this.pagesize, this.pagneNo, this.sortingValue,searchValue).subscribe(
        (repsonsedata:ResponceData) => {
          if (repsonsedata.HttpStatusCode===200) {
            this.loading = false;
            this.loadingSearch = false;
            this.totalDataCount = repsonsedata.TotalRecord;
            this.listViewDraft = repsonsedata.Data;
          } else if( repsonsedata.HttpStatusCode === 204 ){
            this.totalDataCount = repsonsedata.TotalRecord;
            this.listViewDraft = repsonsedata.Data;
           this.loading = false;
           this.loadingSearch = false;
          } else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
            this.loading = false;
            this.loadingSearch = false;
          }      }, err => {
          this.loading = false;
          this.loadingSearch = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

        })


    }else if(this.tabActive=='Sent')
    {
      this.mailService.fetchSendMailList(this.pagesize, this.pagneNo, this.sortingValue,searchValue).subscribe(
        (repsonsedata:ResponceData) => {
          if (repsonsedata.HttpStatusCode===200) {
            this.loading = false;
            this.loadingSearch = false;
            this.totalDataCount = repsonsedata.TotalRecord;
          // <!-- who:bantee,what:ewm-13955 Api changes data issue fixed ,when:29/08/2023 -->

            this.sendEmailData = repsonsedata.Data.UserMailList;
            this.sendEmail = repsonsedata.Data.EmailTo;
          } else if( repsonsedata.HttpStatusCode === 204 ){
            this.totalDataCount = repsonsedata.TotalRecord;
            this.sendEmailData = repsonsedata.Data;

           this.loading = false;
           this.loadingSearch = false;
          } else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
            this.loading = false;
            this.loadingSearch = false;
          }      }, err => {
          this.loading = false;
          this.loadingSearch = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

        })
    }else{
      this.loadingSearch=false;
      this.loading=false;
    }
  }

/*
@Name: onFilterClear function
@Who: Nitin
@When: 21-Aug-2021
@Why: EWM-2502
@What: use Clear for Searching records
*/
public onFilterClear(): void {
  this.pagneNo=1;
  this.sortingValue='';
  this.searchValue='';
  if(this.tabActive=='Draft'){
    this.getDraftList(this.pagesize,this.pagneNo,this.sortingValue,this.searchValue);
  }else if(this.tabActive=='Inbox'){
 // this.fetchInboxList(this.pagesize,this.pagneNo,this.sortingValue,this.searchValue,'');
 if(this.isFavouritChecked){
  this.fetchFavoriteMailList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue,'')
}else{
  this.fetchInboxList(this.pagesize,this.pagneNo,this.sortingValue,this.searchValue,'');
}
  }else if(this.tabActive=='Sent'){
  this.fetchSendList(this.pagesize,this.pagneNo,this.sortingValue,this.searchValue);
  }
  this.getMailCount();

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
    this.isFavouritChecked = true;
   this.fetchFavoriteMailList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue,'')
  }else{
    this.isFavouritChecked = false;
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
fetchFavoriteMailList(pagesize, pagneNo, sortingValue, searchVal,Imp){
  if(Imp=='Imp'){
    this.loading = false;
  }else{
    this.loading = true;
  }

  this.mailService.fetchFavoriteMailList(pagesize, pagneNo, sortingValue, searchVal,'').subscribe(
    (repsonsedata:ResponceData) => {
      if (repsonsedata.HttpStatusCode===200) {
        this.loading = false;
        this.totalDataCount = repsonsedata.TotalRecord;
        this.listView = repsonsedata.Data;
      } else if( repsonsedata.HttpStatusCode === 204 ){
        this.listView = [];
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
    this.getMailCount();
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
@Type: File, <ts>
@Name: disConnectEmail function
@Who: Renu
@When: 22-Sept-2021
@Why: ROST-2511 ROST-2704
@What: service call for email disconnection
*/

disConnectEmail(): void {
  const message = `label_areYouSureDisconnectionMsg`;
  const title = '';
  const subTitle = '';
  const dialogData = new ConfirmDialogModel(title, subTitle, message);
  const dialogRef = this.dialog.open(EmailConfirmDialogComponent, {
    maxWidth: "350px",
    data: dialogData,
    panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });

  dialogRef.afterClosed().subscribe(dialogResult => {
    if (dialogResult == true) {
      this.emaildisconnection();
    }
  })

}
/*
@Type: File, <ts>
@Name: emaildisconnection function
@Who: Renu
@When: 22-Sept-2021
@Why: ROST-2511 ROST-2704
@What: service call for email disconnection
*/
emaildisconnection() {
  this.loading = true;
  this.mailService.emailDisconnection().subscribe(
    (data: ResponceData) => {
      if (data.HttpStatusCode === 200) {
        this.emailConnection=false;
        // <!---------@When: 19-12-2022 @who:Adarsh singh @why: EWM-9908 --------->
        let isEmail:any = 0;
        localStorage.setItem("emailConnection", isEmail);
        // end 
        const message = ``;
        const title = 'label_disabled';
        const subtitle = 'label_securitymfa';
        const dialogData = new ConfirmDialogModel(title, subtitle, message);
        const dialogRef = this.dialog.open(DisconnectEmailComponent, {
          maxWidth: '350px',
          panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
          disableClose: true,
        });
        this.fetchInboxList(this.pagesize, this.pagneNo, this.sortingValue, this.searchValue,'');
      }

      //this._snackBarService.showSuccessSnackBar(this.translateService.instant(data.Message), String(data.HttpStatusCode));
      this.loading = false;

    }, err => {
      this.loading = false;
      this._snackBarService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

    })
}


    /*
  @Type: File, <ts>
  @Name: onScrollDownDraft
  @Who: Renu
  @When: 28-Sept-2021
  @Why: EWM-2641 EWM-2996
  @What: To add data on page scroll for draft
  */

  onScrollDownDraft(ev?) {
    this.loadingscroll = true;
    if (this.canLoad) {
      this.canLoad = false;
      this.pendingLoad = false;
      if (this.totalDataCount > this.listView.length) {
        this.pagneNo = this.pagneNo + 1;
        this.fetchMoreDraftRecord(this.pagesize, this.pagneNo, this.sortingValue);
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
 @Name: fetchMoreDraftRecord
 @Who: Renu
 @When: 22-Sept-2021
 @Why: EWM-2641 EWM-2996
 @What: To get more data from server on page scroll.
 */

 fetchMoreDraftRecord(pagesize, pagneNo, sortingValue) {
  this.mailService.getDraftMail(pagesize, pagneNo, sortingValue, this.searchValue).subscribe(
    (repsonsedata:ResponceData) => {
      if (repsonsedata.HttpStatusCode===200) {
        this.loadingscroll = false;
        this.totalDataCount = repsonsedata.TotalRecord;
        let nextgridView: any = [];
        nextgridView = repsonsedata.Data;
        this.listView = this.listView.concat(nextgridView);
      } else if(repsonsedata.HttpStatusCode === 204 ) {
        this.totalDataCount = repsonsedata.TotalRecord;
        this.listView = [];
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
 @Name: getDraftInfo
 @Who: Renu
 @When: 22-Sept-2021
 @Why: EWM-2641 EWM-2996
 @What: To get individual draft info on click details
 */
getDraftInfo(UniqueId:any){
  this.loading = true;
  this.ActivedraftId=UniqueId;
  this.mailService.emailDraftDetail(UniqueId).subscribe(
    (repsonsedata:ResponceData) => {
      if (repsonsedata.HttpStatusCode===200) {
        this.loading = false;
        this.openNewEmailModal(repsonsedata.Data,'');
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
   @When: 21-Sept-2021
   @Why: EWM-2511 EWM-2704
  @What: service call for List data
  */
//  <!-----@When:  27-07-2023 @Who : bantee @why: EWM-13394---->

  fetchInboxList(pagesize, pagneNo, sortingValue, searchVal,Imp) {
    if(Imp=='Imp'){
      this.loading = false;
    }else{
      this.loading = true;
    }
    this.mailService.fetchMailList(pagesize, pagneNo, sortingValue, searchVal,'').subscribe(
      (repsonsedata:ResponceData) => {
        if (repsonsedata.HttpStatusCode===200) {
          this.loading = false;
          this.totalDataCount = repsonsedata.TotalRecord;
          this.listView = repsonsedata.Data.UserMailList;
          this.LastSyncDate=repsonsedata.Data.LastSyncDate;
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
  @Name: getBackgroundColor function
  @Who: maneesh
  @When: 14-07-2023
  @Why: EWM-13145
  @What: set background color
*/
getBackgroundColor(shortName) {
  if (shortName?.length > 0) {
    return ShortNameColorCode[shortName[0]?.toUpperCase()]
  }
}

}

