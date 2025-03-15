import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { GeneralInformationService } from 'src/app/modules/EWM.core/shared/services/candidate/general-information.service';
import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
import { ResponceData, Userpreferences } from 'src/app/shared/models';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-candidate-jobresume-parse',
  templateUrl: './candidate-jobresume-parse.component.html',
  styleUrls: ['./candidate-jobresume-parse.component.scss']
})
export class CandidateJobresumeParseComponent implements OnInit {

  public parseResumeData: any = {};
  public canParseResumeData: any = {};
  public generalInformationData: any = {};
  public canProfileData: any = {};
  public canSkillsData: any = {};
  public canEducationData: any = {};
  public canEmploymentData: any = {};
  public canExperienceData: any = {};
  public generalLoader: boolean;
  public loading: boolean = true;
  background10: any;
  background15: any;
  background20: any;
  background30: any;
  background80: any;
  @Input() candidateId: any;
  @Input() FileName: any;
  @Input() FilePath:any;
  @Input() DemoDoc: any;
  @Input() UploadFileName: any;
  @Input() isNewResumeLoading: any;
  orderlistLeft = [];
  public candidateResumeData: any = {};
  @Input () xeopleSearchData :any;
  // @Input()CandidateId:any;
  @Input()candidateName:any;

  loadingSearch:boolean=false;
  textToSearch:any;
  
  searchSubject$ = new Subject<any>();
  isSearchTextNotFound:boolean=false;   
  public userpreferences: Userpreferences;
  constructor(public candidateService: CandidateService, private routes: ActivatedRoute, public dialog: MatDialog, private fb: FormBuilder,
    private snackBService: SnackBarService, private translateService: TranslateService,
    public _userpreferencesService: UserpreferencesService,private commonService: CommonserviceService) { }

  ngOnInit(): void {
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    let primaryColor = document.documentElement.style.getPropertyValue('--primary-color');
    this.background10 = this.hexToRGB(primaryColor, 0.10);
    this.background15 = this.hexToRGB(primaryColor, 0.15);
    this.background20 = this.hexToRGB(primaryColor, 0.20);
    this.background30 = this.hexToRGB(primaryColor, 0.30);
    this.background80 = this.hexToRGB(primaryColor, 0.80);
    this.routes.queryParams.subscribe((value) => {
      if (value.CandidateId != undefined && value.CandidateId != null && value.CandidateId != '') {
        this.candidateId = value.CandidateId;
      }
    });
    this.getResumeByCandidateId();
    //this.parseResume(); 
    this.commonService.xeopleSearchServicedata.subscribe((data)=>{
      this.xeopleSearchData=data;
      this.candidateName =data?.candidateName;
      }) 

      this.searchSubject$.pipe(debounceTime(1000)).subscribe(val => {
        if(val==''){
          this.clearSearch();
        }else{
          this.highligthSearchText(val);
        } 
         });
  }
/*
@Type: File, <ts>
@Name: getResumeByCandidateId
@Who: Suika
@When: 13-Dec-2021
@Why: EWM-4147
@What: get candidate resume parse list for candidate
*/
  getResumeByCandidateId() {
    let FileObj = {};
    this.generalLoader = true;
    this.candidateService.getResumeDetailsById('?CandidateId=' + this.candidateId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.canParseResumeData = repsonsedata.Data;
          this.canProfileData = this.canParseResumeData?.ProfileDetails;
          this.candidateResumeData = this.canParseResumeData;
          // this.canEmploymentData = this.canParseResumeData;
          // this.canExperienceData = this.canParseResumeData;
          // this.canSkillsData = this.canParseResumeData;
          this.generalLoader = false;
        } else if (repsonsedata.HttpStatusCode === 204) {
          this.canParseResumeData = [];
          this.canProfileData = [];
          // this.canEducationData = [];
          // this.canEmploymentData = [];
          // this.canExperienceData = [];
          // this.canSkillsData = [];
          this.candidateResumeData=[];
          this.generalLoader = false;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.generalLoader = false;
        }
      }, err => {
        this.loading = false;
        //  this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }


  hexToRGB(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);
    if (alpha) {
      return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
      return "rgb(" + r + ", " + g + ", " + b + ")";
    }
  }

  /*
@Type: File, <ts>
@Name: getOrderListLeftSide function
@Who: Anup
@When: 04-oct-2021
@Why: EWM-3088 EWM-3138
@What: for ordering of left side
*/
  getOrderListLeftSide(panelName) {
    let orderId = this.orderlistLeft.find(item => item.Title === panelName)
    if (orderId !== undefined) {
      return orderId['Order'];
    }
  }





    /*
   @Type: File, <ts>
   @Name: highligthSearchText function
   @Who: Suika
   @When: 11-05-2023
   @Why: EWM-11775 EWM-12373
   @What: generic function to highlight search text
 */
highligthSearchTextVal(e:any){
  let textToSearch = e.target.value
  if(textToSearch!=''){
    // who:maneesh,what:ewm.10018 fixed loading, when:27/12/2022
  this.loadingSearch = true;

    this.searchSubject$.next(textToSearch);
  }else{
  this.loadingSearch = false;

    this.searchSubject$.next('');
  }
 
}



  /*
   @Type: File, <ts>
   @Name: highligthSearchText function
   @Who: Suika
   @When: 11-05-2023
   @Why: EWM-11775 EWM-12373
   @What: generic function to highlight search text
 */  
highligthSearchText(textToSearch){
  //let textToSearch = e.target.value
  this.unMarkAll(textToSearch);
  this.textToSearch  = textToSearch.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");   
  let pattern = new RegExp(`${textToSearch}`,"gi");
  const documentAll = document.getElementsByClassName('inputval') as HTMLCollectionOf<Element> | null; 
  
  let arr= [];
  for(var x = 0; x<documentAll?.length; x++){
    if(documentAll[x].innerHTML.toLowerCase().match(textToSearch.toLowerCase())){      
      documentAll[x].innerHTML = documentAll[x].textContent.replace(pattern, match => `<span class="highlight"><mark>${match}</mark></span>`);
      this.isSearchTextNotFound = false;
      arr.push(textToSearch);
      this.scrollData();
    }else{
      documentAll[x].innerHTML = documentAll[x].textContent.replace(pattern, match => match);
     // window.scroll(0, 0);
     this.scrollTop();
    
    }
  } 

  setTimeout(() => {
    if(textToSearch!=''){
      if(arr?.length==0){      
       this.snackBService.showNoRecordDataSnackBar(this.translateService.instant('label_search_nomatch'),'400');       
      }
    }
  }, 1500);
  this.loadingSearch = false; 

}

  /*
   @Type: File, <ts>
   @Name: clearSearch function
   @Who: Suika
   @When: 11-05-2023
   @Why: EWM-11775 EWM-12373
   @What: generic function to clear search text
 */  
clearSearch(){  
  this.textToSearch = "";
  let pattern = new RegExp(`${this.textToSearch}`,"gi");
  const documentAll = document.getElementsByClassName('inputval') as HTMLCollectionOf<Element> | null;   
  for(var x = 0; x<documentAll?.length; x++){ 
    documentAll[x].innerHTML =documentAll[x].textContent.replace(pattern, match => match);
  } 
   this.scrollTop();
}


  /*
   @Type: File, <ts>
   @Name: unMarkAll function
   @Who: Suika
   @When: 11-05-2023
   @Why: EWM-11775 EWM-12373
   @What: generic function to unmark search text
 */
unMarkAll(textToSearch){
  let pattern = new RegExp(`${textToSearch}`,"gi");
    const documentAll = document.getElementsByClassName('inputval') as HTMLCollectionOf<Element> | null;   
    for(var x = 0; x<documentAll?.length; x++){
      documentAll[x].innerHTML =documentAll[x].textContent.replace(pattern, match => match);
    }
}


  /*
   @Type: File, <ts>
   @Name: scrollData function
   @Who: Suika
   @When: 11-05-2023
   @Why: EWM-11775 EWM-12373
   @What: generic function to scroll search text
 */
scrollData(){
 // debugger;
  const highlightAll = document.getElementsByClassName('highlight') as HTMLCollectionOf<Element> | null;
  highlightAll[0].scrollIntoView({ behavior: "smooth" , block: 'center' });
}


  /*
   @Type: File, <ts>
   @Name: scrollTop function
   @Who: Suika
   @When: 11-05-2023
   @Why: EWM-11775 EWM-12373
   @What: generic function to scroll top
 */
scrollTop(){
const maindiv = document.getElementById('scrolltop');
maindiv.scrollTop = 0;
}
}



