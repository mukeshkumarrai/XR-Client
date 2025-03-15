/*
 @(C): Entire Software
 @Type: File, <TS>
 @Name: knock-ques.component.ts
 @Who: Suika
 @When: 24-June-2022
 @Why:  EWM-5334 EWM-7001
 @What: knock ques component
 */
//import { CdkStepHeader, CdkStepper } from '@angular/cdk/stepper';
import { Component, Input, OnInit, QueryList } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStep, MatStepper } from '@angular/material/stepper';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-candidate-knockout-details',
  templateUrl: './candidate-knockout-details.component.html',
  styleUrls: ['./candidate-knockout-details.component.scss']
})
export class CandidateKnockoutDetailsComponent implements OnInit {
  loading: boolean=false;
  knockoutQuestionList:[]=[];
  public knockQuesForm: FormGroup;
  @Input() totalStepsCount:number;
  currentStep: any;
  submitActive: boolean;
  public IsKnockoutSuccess:boolean =false;
  @Input() CandidateId:any;
  textToSearch:any;  
  searchSubject$ = new Subject<any>();
  searchVal: string;
  public loadingSearch: boolean;
  public JobId:string;
  constructor(private snackBService: SnackBarService, private jobService: JobService,private translateService: TranslateService,
    private routes: ActivatedRoute,private fb: FormBuilder,private commonserviceService: CommonserviceService) { 
      this.knockQuesForm = this.fb.group({
      QuesInfo:this.fb.array([])
      });
    }

  ngOnInit(): void {
    this.commonserviceService.onstepperInfoChange.subscribe(res=>{
      this.currentStep=res+1;
      if(this.totalStepsCount==this.currentStep){
        this.submitActive=true;
      }
    })
    this.jobService.isKnockoutSuccess.subscribe(res=>{
      this.IsKnockoutSuccess = res;
    }) 
    this.routes.queryParams.subscribe((parms: any) => {
      if (parms?.CandidateId) {
         this.CandidateId=parms?.CandidateId;
    // who:maneesh,what:get jobId when:31/10/2023
         this.JobId=parms?.JobId;

      }
    })
    this.getKnockoutQuestionById(this.CandidateId);

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
   @Name: QuesInfo
   @Who: Suika
   @When: 24-June-2022
   @Why:  EWM-5334 EWM-7001
   @What: for getting the formarray with this instance
   */
   QuesInfo() : FormArray {
    return this.knockQuesForm.get("QuesInfo") as FormArray
  }
  /*
     @Type: File, <ts>
     @Name: onConfirm function
     @Who: Suika
     @When: 24-June-2022
     @Why:  EWM-5334 EWM-7001
     @What: on save pop-up button file
   */

     onConfirm(): void {
      if (this.knockQuesForm.invalid) {
        return;
      }  
      this.saveKnockOutQues();
      
    }
  
/*
 @Type: File, <ts>
 @Name: saveKnockOutQues
 @Who: Suika
 @When: 24-June-2022
 @Why:  EWM-5334 EWM-7001
 @What: for saving knock out  data
 */

 saveKnockOutQues(){

}

/*
@Type: File, <ts>
@Name: getKnockoutQuestionById function
@Who: Suika
@When: 24-June-2022
@Why:  EWM-5334 EWM-7001
@What: get data list for knockout Question
*/
getKnockoutQuestionById(candidateId: any) {
  this.loading = true;
    // who:maneesh,what:pass jobId when:31/10/2023
  this.jobService.getCandidateKnockoutInfo("?CandidateId="+this.CandidateId +'&JobId=' + this.JobId).subscribe(
    (data: any) => {
      this.loading = false;
      if (data.HttpStatusCode == 200 || data.HttpStatusCode == 204) {
        if(data?.Data!=undefined && data?.Data!=null && data?.Data!=''){
          this.knockoutQuestionList=data?.Data;    
          const control=<FormArray>this.knockQuesForm.controls['QuesInfo'];
          control.clear();
          if(this.knockoutQuestionList.length>0){
            this.knockoutQuestionList.forEach((x,i) => {
            control.push(
               this.fb.group({  
                Id: [x['Id']],
                Question:[x['Question']], 
                correctAnswer: [x['CorrectAnswer']],
                Answer: [x['Answer'],[Validators.required]],
                DisplaySequence:[x['DisplaySequence']]
               })
            )
              });
            }
        }      
      }
      else {
        
        this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
    this.loadingSearch = false;
        this.loading = false;
      }
    },
    err => {
      if (err.StatusCode == undefined) {
        this.loading = false;
      }
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    this.loadingSearch = false;
      this.loading = false;
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
  // this.loadingSearch = true;
  // this.loading = false;
  let textToSearch = e.target.value
  if(textToSearch!=''){
  this.loadingSearch = true;
  // this.loading = false; 
    this.searchSubject$.next(textToSearch);
  }else{
    this.loadingSearch = false;
    this.searchSubject$.next('');
  }
 
}

highligthSearchText(textToSearch){
 // let textToSearch = e.target.value;
 this.unMarkAll();
  let d =  this.QuesInfo().controls.length;
  let arr= [];
    for(var x = 0; x<d; x++){
     const questionName = document.getElementById('questions'+x) as HTMLInputElement | null;
     const answer = document.getElementById('answer'+x) as HTMLInputElement | null;
     const answerNo = document.getElementById('answerNo'+x) as HTMLInputElement | null;
     textToSearch = textToSearch.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
     let pattern = new RegExp(`${textToSearch}`,"gi");
     if(questionName.innerHTML.toLowerCase().match(textToSearch.toLowerCase()) || answer.innerHTML.toLowerCase().match(textToSearch.toLowerCase()) || answerNo.innerHTML.toLowerCase().match(textToSearch.toLowerCase())){   
     arr.push(textToSearch); 
       questionName.innerHTML = questionName.textContent.replace(pattern, match => `<span class="highlight"><mark>${match}</mark></span>`);
       answer.innerHTML = answer.textContent.replace(pattern, match => `<span class="highlight"><mark>${match}</mark></span>`);
       answerNo.innerHTML = answerNo.textContent.replace(pattern, match => `<span class="highlight"><mark>${match}</mark></span>`); 
       this.scrollData();      
     }else{
       questionName.innerHTML = questionName.textContent.replace(pattern, match => match);
       answer.innerHTML = answer.textContent.replace(pattern, match => match);
       answerNo.innerHTML = answerNo.textContent.replace(pattern, match => match);
     }  
    setTimeout(() => {
      if(textToSearch!=''){
    this.loadingSearch = false;
        if(arr?.length==0){
    this.loadingSearch = false;
        this.snackBService.showNoRecordDataSnackBar(this.translateService.instant('label_search_nomatch'),'400');       
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
  this.loadingSearch = false;
  this.textToSearch = "";
  let d =  this.QuesInfo().controls.length;
  for(var x = 0; x<d; x++){
    const questionName = document.getElementById('questions'+x) as HTMLInputElement | null;
    const answer = document.getElementById('answer'+x) as HTMLInputElement | null;
    const answerNo = document.getElementById('answerNo'+x) as HTMLInputElement | null;
    this.textToSearch =  this.textToSearch.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
    let pattern = new RegExp(`${this.textToSearch}`,"gi");
    questionName.innerHTML = questionName.textContent.replace(pattern, match => match)
    answer.innerHTML = answer.textContent.replace(pattern, match => match)
    answerNo.innerHTML = answerNo.textContent.replace(pattern, match => match)
   }
}


unMarkAll(){
  let d =  this.QuesInfo().controls.length;
  for(var x = 0; x<d; x++){
    const questionName = document.getElementById('questions'+x) as HTMLInputElement | null;
    const answer = document.getElementById('answer'+x) as HTMLInputElement | null;
    const answerNo = document.getElementById('answerNo'+x) as HTMLInputElement | null;
    this.textToSearch =  this.textToSearch.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");
    let pattern = new RegExp(`${this.textToSearch}`,"gi");
    questionName.innerHTML = questionName.textContent.replace(pattern, match => match)
    answer.innerHTML = answer.textContent.replace(pattern, match => match)
    answerNo.innerHTML = answerNo.textContent.replace(pattern, match => match)
   }
}

scrollData(){
  this.loadingSearch = false;
  // debugger;
   const highlightAll = document.getElementsByClassName('highlight') as HTMLCollectionOf<Element> | null;
   console.log( highlightAll[0]," highlightAll[0]");
   highlightAll[0].scrollIntoView({ behavior: "smooth" , block: 'center' });
 }

}
