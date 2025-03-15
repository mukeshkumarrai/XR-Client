/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Suika
  @When: 24-June-2022
  @Why:  EWM-5334 EWM-7001
  @What:  This page will be use for show assesment info By id
*/
import { Component, Inject, Input, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { UserAdministrationService } from 'src/app/modules/EWM.core/shared/services/user-administration/user-administration.service';
import { ResponceData, Userpreferences } from 'src/app/shared/models';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';


@Component({
  selector: 'app-candidate-document-information',
  templateUrl: './candidate-document-information.component.html',
  styleUrls: ['./candidate-document-information.component.scss']
})
export class CandidateDocumentInformationComponent implements OnInit {

  loading: boolean;
  documentInfoList:any={};
  public userpreferences: Userpreferences;
  @Input() CandidateId:any;
  textToSearch:any;
  
  searchSubject$ = new Subject<any>();
  public loadingSearch: boolean;
  public JobId:string;
  constructor(private snackBService:SnackBarService,private jobService: JobService,private routes: ActivatedRoute, private translateService:TranslateService,private _userpreferencesService:UserpreferencesService) {    
      this.userpreferences = this._userpreferencesService.getuserpreferences();
     }

  ngOnInit(): void {
    this.routes.queryParams.subscribe((parms: any) => {
      if (parms?.CandidateId) {
        this.CandidateId=parms?.CandidateId;
    // who:maneesh,what:get jobId when:31/10/2023
        this.JobId=parms?.JobId;
      }
    })
    this.candidateDocumentInfo(this.CandidateId);
    this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
      //  this.loadingSearch = true;
      if(val==''){
        this.clearSearch();
      }else{
        this.highligthSearchText(val);
      } 
         });
  }

    /*
    @Type: File, <ts>
    @Name: candidateDocumentInfo
    @Who: Suika
    @When: 24-June-2022
    @Why:  EWM-5334 EWM-7001
    @What: to get list by info Id 
    */

   candidateDocumentInfo(Id){
    this.loading = true;
    // who:maneesh,what:pass jobId when:31/10/2023
    this.jobService.getCandidateDocumentInfo("?CandidateId="+this.CandidateId+'&JobId=' + this.JobId).subscribe(
      (data: ResponceData) => {
        this.loading = false;
        if (data['HttpStatusCode'] == 200) {
         this.documentInfoList=data.Data;
        } else if (data['HttpStatusCode'] == 204) {
          this.loading = false;
          this.documentInfoList=[];
        }else if (data['HttpStatusCode'] == 400) {
          this.loading = false;
          this.documentInfoList=[];
          this.loadingSearch=false;

          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
        } else {
          this.loading = false;
          this.loadingSearch=false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
        }
      },
      err => {
        this.loading = false;
        this.loadingSearch=false;

        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })

  }

 /*
   @Type: File, <ts>
   @Name: highligthSearchText function
   @Who: adarsh
   @When: 15-11-2022
   @Why: EWM-8903 EWM-9277
   @What: generic function to highlight search text
 */ 
highligthSearchTextVal(e:any){
  let textToSearch = e.target.value
  if(textToSearch!=''){
    //  who:maneesh,what:ewm.10037 fixed loading, when:27/12/2022 
    this.loadingSearch=true;
    this.searchSubject$.next(textToSearch);
  }else{
    this.loadingSearch=false;
    this.searchSubject$.next('');
  }
 
}

  highligthSearchText(textToSearch){
    this.unMarkAll(textToSearch);
    let arr= [];
    textToSearch = textToSearch.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
    let pattern = new RegExp(`${textToSearch}`,"gi");  
    const documentAll = document.getElementsByClassName('inputval') as HTMLCollectionOf<Element> | null;
     for(var x = 0; x<documentAll.length; x++){
      if(documentAll[x].innerHTML.toLowerCase().match(textToSearch.toLowerCase())){
        documentAll[x].innerHTML = documentAll[x].textContent.replace(pattern, match => `<span class="highlight"><mark>${match}</mark></span>`)
        arr.push(textToSearch);
        this.scrollData(); 
      }else{
        documentAll[x].innerHTML = documentAll[x].textContent.replace(pattern, match => match)
      }
  
      setTimeout(() => {
        if(textToSearch!=''){
    //  who:maneesh,what:ewm.10037 fixed loading, when:16/01/2023 
    this.loadingSearch = false; 
    if(arr?.length==0){
          this.loadingSearch=false;

          this.snackBService.showNoRecordDataSnackBar(this.translateService.instant('label_search_nomatch'),'400');  
          this.loadingSearch=false;

           }
          }
      }, 1500);
     
     }
  
    
  }


  /*
   @Type: File, <ts>
   @Name: clearSearch function
   @Who: Suika
   @When: 18-11-2022
   @Why: EWM-8903 EWM-9277
   @What: generic function to clear search text
 */ 
  clearSearch(){  
    this.textToSearch = "";
    let pattern = new RegExp(`${this.textToSearch}`,"gi");
    const documentAll = document.getElementsByClassName('inputval') as HTMLCollectionOf<Element> | null;   
    for(var x = 0; x<documentAll?.length; x++){ 
      documentAll[x].innerHTML =documentAll[x].textContent.replace(pattern, match => match);
    } 
    this.loadingSearch=false;

  }

  unMarkAll(textToSearch){
    let pattern = new RegExp(`${textToSearch}`,"gi");
    const documentAll = document.getElementsByClassName('inputval') as HTMLCollectionOf<Element> | null;   
    for(var x = 0; x<documentAll?.length; x++){ 
      documentAll[x].innerHTML =documentAll[x].textContent.replace(pattern, match => match);
    }
  }

  
scrollData(){
  // debugger;
   const highlightAll = document.getElementsByClassName('highlight') as HTMLCollectionOf<Element> | null;
   console.log( highlightAll[0]," highlightAll[0]");
   highlightAll[0].scrollIntoView({ behavior: "smooth" , block: 'center' });
 }

}
