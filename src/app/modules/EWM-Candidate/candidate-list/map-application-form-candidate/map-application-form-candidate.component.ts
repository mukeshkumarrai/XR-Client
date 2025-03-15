import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ServiceListClass } from '../../../../shared/services/sevicelist';
import { ResponceData, ButtonTypes } from 'src/app/shared/models';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { UserAdministrationService } from 'src/app/modules/EWM.core/shared/services/user-administration/user-administration.service';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { ShortUrlService } from '@app/shared/services/shortUrlService/short-url.service';

@Component({
  selector: 'app-map-application-form-candidate',
  templateUrl: './map-application-form-candidate.component.html',
  styleUrls: ['./map-application-form-candidate.component.scss']
})
export class MapApplicationFormCandidateComponent implements OnInit {
  public loading: boolean = false;
  public gridView: any;
  public totalDataCount: any;
  public searchVal: string = '';
  public pagesize: any;
  public pagneNo: any;
  public sortingValue: any = '';
  public canLoad = false;
  public pendingLoad = false;
  public viewMode = 'cardMode';
  public formtitle = 'grid';
  public inputArray: any = [];
  public isDelete: any;
  public loadingSearch: boolean = false;
  public selectedRelation: any = {};
  public perWorkflowMapMaxAessment: number = 1;
  public newArray: any = [];
  JobId: any;
  gridListData: any = [];
  ApplicationFormId: number;
  public result: string = '';
  loadingscroll: boolean;
  animationVar : any;
  // applicationFormName: string;
  public applicationFormName:any={};

  applicationFormNamePatch: string;
  isChecked;
  searchSubject$ = new Subject<any>();
  public hideChip :boolean;
  allGridListData: any = [];
  applicationFormId;
  isNotMappedClicked: boolean = false;
  clickedData:any;
  isCoppied: boolean;
  applicationLinkExpire: string;
  shareJobApplicationUrl: string;
  applicationBaseUrl: string;
  PageNumber: any;
  TotalPages: number;
  public isResponseGet:any=[-1];
  public isResponseGetData:boolean;
  unsubShortUrl:Subscription;
  constructor(public dialog: MatDialog, public dialogRef: MatDialogRef<MapApplicationFormCandidateComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private translateService: TranslateService, private userAdministrationService: UserAdministrationService, private serviceListClass: ServiceListClass,
    private snackBService: SnackBarService, private appSettingsService: AppSettingsService, private jobService: JobService,
    private bitly: ShortUrlService) {
    // page option from config file    
    this.applicationBaseUrl =  this.appSettingsService.applicationBaseUrl; 
    this.applicationLinkExpire = this.appSettingsService.applicationLinkExprire; 
    this.pagneNo = this.appSettingsService.pageOption;
    this.pagesize = this.appSettingsService.pagesize;
  }
  /*
      @Type: File, <ts>
      @Name: ngOnInit
      @Who: Nitin Bhati
      @When: 20-12-2022
      @Why: EWM-9875
      @What: For ngOnit function.
     */
  ngOnInit(): void {
    const subdomain=localStorage.getItem("tenantDomain");  
    const orgId=localStorage.getItem("OrganizationId");  
    this.shareJobApplicationUrl = this.applicationBaseUrl+'/candidate/apply?mode=apply&domain='+subdomain+'&orgId='+orgId;   
     
    this.getApplicationJobMappingToJobAll(this.JobId, this.searchVal, this.pagneNo, this.pagesize, this.sortingValue, true);
    setInterval(() => {
      this.canLoad = true;
      if (this.pendingLoad) {
        this.onScrollDown();
      }
    }, 2000);
    this.animationVar = ButtonTypes;
    this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
      this.loadingSearch = true;
      this.pagneNo=1;
      this.getApplicationJobMappingToJobAllSearch(this.JobId, val, this.pagneNo, this.pagesize, this.sortingValue, true);
       });
  }

  shorthandUrl(shareJobApplicationUrl: any){
    let uriEncodeJson = {};
    uriEncodeJson['CompleteUrl'] = shareJobApplicationUrl;
    try{
      this.bitly.shortenUrl(uriEncodeJson).subscribe((link:ResponceData) => {
       this.applicationBaseUrl= link.Data?.ShortUrl;
        },err=>{
          console.error(err);
        }
      );
    }catch(e){
      console.error(e);
    }
  }
  /*
   @Type: File, <ts>
   @Name: getApplicationJobMappingToJobAll
   @Who: Nitin Bhati
   @When: 20-12-2022
    @Why: EWM-9875
   @What: To get more data from server on page scroll.
  */
  getApplicationJobMappingToJobAll(jobId: string, search: string, pageNo: number, pageSize: number, sortingValue: string, isLoader: boolean) {
    if (isLoader) {
      this.loading = true;
    } else {
      this.loading = false;
    }
    this.jobService.getApplicationFormAllWithoutFilter(this.pagesize, pageNo,sortingValue,search).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200') {
          this.loadingscroll = false;
          this.loading = false;
          let nextgridView = [];
          nextgridView = repsonsedata.Data;
          this.gridView = repsonsedata.Data;
          //this.gridListData = repsonsedata.Data;
          this.gridListData = this.gridListData.concat(nextgridView);
          this.allGridListData = [...repsonsedata.Data]
          // added soting methode by Adarsh singh on 22-11-2022 fro EWM-9065
          // this.gridListData.sort((firstItem, secondItem) => secondItem.IsMapped - firstItem.IsMapped);
          this.totalDataCount = repsonsedata.TotalRecord;
          this.TotalPages = repsonsedata.TotalPages;
          // if(this.gridView.length)
          // {
          //   this.gridView.filter(x=>{
          //     if(x['Id']==this.data?.applicationFormName?.Id)
          //     {
          //       x['IsDefault']=1;
          //     }else{
          //       x['IsDefault']=0;
          //     }
          //   });
           
          // }else{
          //   this.gridView.forEach(element => {
          //     element['IsDefault'] = 0;
          //     element['IsMapped'] = 0;
          //   }); 
            
          // }
        } else if(repsonsedata.HttpStatusCode == '204') {
          this.loadingscroll = false;
          this.loading = false;
          this.gridListData = [];
          this.allGridListData = [];
         }else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
          this.loadingscroll = false;
        }
      }, err => {
        this.loading = false;
        this.loadingscroll = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  /*
  @Type: File, <ts>
  @Name: onScrollDown
  @Who: Nitin Bhati
  @When: 20-12-2022
  @Why: EWM-9875
  @What: To add data on page scroll.
  */
  onScrollDown() {
    this.loadingscroll = true;
    if (this.canLoad) {
      this.canLoad = false;
      this.pendingLoad = false;
      if (this.totalDataCount > this.gridListData.length) {
        this.pagneNo = this.pagneNo + 1;
        if(this.pagneNo<=this.TotalPages){
          this.getApplicationJobMappingToJobAll(this.JobId, this.searchVal, this.pagneNo, this.pagesize, this.sortingValue, false);
        }
        } else {
        this.loading = false;
        this.loadingscroll = false;
      }
    } else {
      this.loading = false;
      this.loadingscroll = false;
      this.pendingLoad = true;
    }
  }
  /*
  @Name: onFilter function
  @Who: Nitin Bhati
  @When: 20-12-2022
  @Why: EWM-9875
  @What: use for Searching records
  */
  public onFilter(inputValue: string): void {
    this.loading = false;
    this.loadingSearch = true;
     if (inputValue.length > 0 && inputValue.length < 3) {
      this.loadingSearch = false;
      return;
    }
   this.searchSubject$.next(inputValue);

  }
    /*
      @Type: File, <ts>
      @Name: getApplicationJobMappingToJobAllFilter
      @Who: Nitin Bhati
      @When: 20-12-2022
      @Why: EWM-9875
      @What: To search data into application form.
     */
  getApplicationJobMappingToJobAllFilter(jobId: string, search: string, pageNo: number, pageSize: number, sortingValue: string, isLoader: boolean) {
    this.loading = true;
    this.pagneNo=1;
    this.jobService.getApplicationFormAllWithoutFilter(pageSize, pageNo,sortingValue,search).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200') {
          this.loading = false;
          this.gridListData = repsonsedata.Data;
          this.gridView = repsonsedata.Data;
          // added soting methode by Adarsh singh on 22-11-2022 fro EWM-9065
          // this.gridListData.sort((firstItem, secondItem) => secondItem.IsMapped - firstItem.IsMapped);
          this.totalDataCount = repsonsedata.TotalRecord;
        } else if(repsonsedata.HttpStatusCode == '204') {
           this.loading = false;
          this.gridListData = [];
         }else {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
         }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

    /*
      @Type: File, <ts>
      @Name: getApplicationJobMappingToJobAllFilter
      @Who: Nitin Bhati
      @When: 20-12-2022
      @Why: EWM-9875
      @What: To search data into application form.
     */
      getApplicationJobMappingToJobAllSearch(jobId: string, search: string, pageNo: number, pageSize: number, sortingValue: string, isLoader: boolean) {
        this.loadingSearch = true;
        this.jobService.getApplicationFormAllWithoutFilter(pageSize, pageNo,sortingValue,search).subscribe(
          (repsonsedata: ResponceData) => {
            if (repsonsedata.HttpStatusCode == '200') {
              this.loadingSearch = false;
              this.gridView = repsonsedata.Data;
              this.gridListData = repsonsedata.Data;
              // added soting methode by Adarsh singh on 22-11-2022 fro EWM-9065
              // this.gridListData.sort((firstItem, secondItem) => secondItem.IsMapped - firstItem.IsMapped);
              this.totalDataCount = repsonsedata.TotalRecord;
            } else if(repsonsedata.HttpStatusCode == '204') {
               this.loadingSearch = false;
              this.gridListData = [];
             }else {
              this.loadingSearch = false;
              this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
             }
          }, err => {
            this.loadingSearch = false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          })
      }
 
  /*
      @Type: File, <ts>
      @Name: getCandidateMapAppId
      @Who: Nitin Bhati
      @When: 20-12-2022
      @Why: EWM-9875
      @What: For view candidate view.
     */
  getCandidateMapAppId(id) {
    let parm='?applicationId='+id+'&mode=preview'+'&type=cand';
    let manageurl='./application/apply'+parm;
    window.open(manageurl, '_blank');
    // let navigate = './client/core/administrators/application-form/application-form-configure' + '?Id=' + id;
    // window.open(navigate, '_blank');
  }

  mouseoverAnimation(matIconId, animationName) {
    let amin= localStorage.getItem('animation');
    if(Number(amin) !=0){
      document.getElementById(matIconId).classList.add(animationName);
    }
  }
  mouseleaveAnimation(matIconId, animationName) {
    document.getElementById(matIconId).classList.remove(animationName)
  }

  /*
      @Type: File, <ts>
      @Name: getApplicationJobMappingToJobAllWithoutConcat
      @Who: Nitin Bhati
      @When: 20-12-2022
      @Why: EWM-9875
      @What: To get more data from server on page scroll.
     */
  getApplicationJobMappingToJobAllWithoutConcat() {
    this.pagneNo = 1;
    this.jobService.getApplicationJobMappingToJob(this.JobId, this.searchVal, this.pagneNo, this.pagesize, this.sortingValue).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode == '200') {
          this.loading = false;
          this.loadingSearch = false;
          this.gridListData = repsonsedata?.Data;
          this.gridView = repsonsedata?.Data;
      // <!---------@When: 03-12-2022 @who:Adarsh singh @why: EWM-9675 --------->
          if (this.isNotMappedClicked) {
          this.applicationFormName=this.applicationFormNamePatch;
            this.inputArray=[];
            const data = this.inputArray.filter(x => x['Id'] == this.clickedData.Id);
            if (data == '') {
              this.inputArray.push(this.clickedData);
            }
          }
          this.isNotMappedClicked = false;
          // End 
          // added soting methode by Adarsh singh on 22-11-2022 fro EWM-9065
          // this.gridListData.sort((firstItem, secondItem) => secondItem.IsMapped - firstItem.IsMapped);
          
        } else if(repsonsedata.HttpStatusCode == '204'){
          this.loading = false;
          this.loadingSearch = false;
          this.gridListData = [];
        } else {
          this.loading = false;
          this.loadingSearch = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
         }
      }, err => {
        this.loading = false;
        this.loadingSearch = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }


  /*
     @Type: File, <ts>
     @Name: onDismiss
     @Who: Nitin Bhati
     @When: 20-12-2022
      @Why: EWM-9875
     @What: For dismiss button .
    */
  onDismiss() {
    document.getElementsByClassName("add-assessment-modal")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add-assessment-modal")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({ res: false,Name: this.applicationFormName,Id: this.ApplicationFormId }); }, 200);
  }
  /*
      @Type: File, <ts>
      @Name: onSave
      @Who: Nitin Bhati
      @When: 20-12-2022
      @Why: EWM-9875
      @What: For Save button.
     */
  onSave() {
    document.getElementsByClassName("add-assessment-modal")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add-assessment-modal")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close({ res: true,Name: this.applicationFormName,Id: this.ApplicationFormId }); }, 200);
  }

 /*
      @Type: File, <ts>
      @Name: copyJobApplicationUrl
      @Who: Nitin Bhati
      @When: 20-12-2022
      @Why: EWM-9875
      @What: For copy candidate URL.
     */
    // by maneesh,what ewm-16750 when:22/05/2024 for fixed copy url
  copyJobApplicationUrl(Application,Id,index){ 
    this.isResponseGet[index] = index; //by maneesh
    let uriEncodeJson = {};
    uriEncodeJson['CompleteUrl'] = this.shareJobApplicationUrl+'&applicationId='+Id;
    try{
     this.unsubShortUrl= this.bitly.shortenUrl(uriEncodeJson).subscribe((link:ResponceData) => {
        if (link.Data?.ShortUrl!=undefined && link.Data?.ShortUrl!=null) {
         this.applicationBaseUrl= link.Data?.ShortUrl; 
         this.isResponseGet[index] = null; //by maneesh
         this.isResponseGetData=true;
         this.isCoppied = true;
        }
    this.isResponseGet[index] = null;
       this.gridView.filter(x => {
        if (x['Id'] === Id) {
          x['IsMapped'] = 1;
        }else{
          x['IsMapped'] = 0;
        }
      });
      setTimeout(() => {
        this.isCoppied = false;
      }, 3000);
      let selBox = document.createElement('textarea');
      selBox.style.position = 'fixed';
      selBox.style.left = '0';
      selBox.style.top = '0';
      selBox.style.opacity = '0';
      selBox.value =this.applicationBaseUrl;
      document.body.appendChild(selBox);
      selBox.focus();
      selBox.select();
      document.execCommand('copy');
      document.body.removeChild(selBox);
        },err=>{
          console.error(err);
        }
      );
    }catch(e){
      console.error(e);
    }
    // this.isResponseGetData=false;
    
  }
   /*
    @Type: File, <ts>
    @Name: getApplicationJobMappingToJobAll
    @Who: Nitin Bhati
    @When: 20-12-2022
    @Why: EWM-9875
    @What: To get more data from server on page scroll.
   */
    public onFilterClear(): void {
      this.searchVal = '';
      this.pagneNo=1;
     this.getApplicationJobMappingToJobAllFilter(this.JobId, this.searchVal, this.pagneNo, this.pagesize, this.sortingValue, true);
      //this.getApplicationJobMappingToJobAll(this.JobId, this.searchVal, this.pagneNo, this.pagesize, this.sortingValue, true);
    }

    ngOnDestroy(){
      this.unsubShortUrl?.unsubscribe();
    }
}

