import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { Daum, ExtractMapKeys, Res } from "./extract-map-model";
import { XeopleSearchService } from 'src/app/modules/EWM.core/shared/services/xeople-search/xeople-search.service';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatHorizontalStepper, MatStepper } from '@angular/material/stepper';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { ExcelService } from 'src/app/modules/EWM.core/shared/services/excel.service';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-extract-map-bulk',
  templateUrl: './extract-map-bulk.component.html',
  styleUrls: ['./extract-map-bulk.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}
  }]
})
export class ExtractMapBulkComponent implements OnInit {
  isEditable = false;
  loading: boolean=false;
  ExtractMapKeys:any[]=ExtractMapKeys;
  selectedCanForExtract: string[]=[];
  ExtractMapCan: Daum[]=[];
  activeStepperIndex: number=0;
  @ViewChild(MatHorizontalStepper) stepper: MatHorizontalStepper;
  extractedCanStatus: Daum[];
  successCandidate: number=0;
  FailedCandidate: number=0;
  extractedCanfailArr: Daum[];
  displayedColumns: string[] = ['ExternalId', 'FirstName','IsCandidateCreated','StatusMessage'];
  JobDetails: {Id:string,JobTitle:string};
  methodType: string;
  completed: boolean=false;
  state: string;


  constructor(public commonserviceService: CommonserviceService,public dialogRef: MatDialogRef<ExtractMapBulkComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private appSettingsService: AppSettingsService,public xeopleSearchService:XeopleSearchService,private excelService: ExcelService) { 
      this.selectedCanForExtract=data?.selectedCanForExtract;
      this.methodType=data?.method;
    }

  ngOnInit(): void {
    this.commonserviceService.getFilterInfoEOH.subscribe((data) => {
      this.JobDetails = data?.JobDetails;
    });  

  }
  /* @Name: onDismiss @Who: renu @When: 15-Sept-2023 @Why:EWM-13707 EWM-13846 @What: closing dialog pop up */
  onDismiss()
  {
    document.getElementsByClassName("view_extract")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("view_extract")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
    this.ExtractMapKeys.forEach(x => {
        x['checked']=true;
    });
  }
 /* @Name: extractEOHMembers @Who: renu @When: 15-Sept-2023 @Why:EWM-13707 EWM-13846 @What: on extact button */
  extractEOHMembers(){
    this.loading=true;
    let apiObj = {};
    apiObj['MemberId']=this.selectedCanForExtract?.map(item => item['CandidateId']).join();
    apiObj['Tags']=this.ExtractMapKeys.filter(x=>x['checked']==true).map(item => {
      return item['value'];
    }).join(",");
    this.xeopleSearchService.XeopleExtractMembers(apiObj).subscribe(
      (repsonsedata: Res) => {
        this.loading = false;
        if (repsonsedata.HttpStatusCode === 200) {
          this.ExtractMapCan=repsonsedata?.Data;
          this.createExtractedCandidate();
        }
      }, err => {
         this.loading = false;
      })
  }

/* @Name: createExtractedCandidate @Who: renu @When: 15-Sept-2023 @Why:EWM-13707 EWM-13846 @What: to created extracted can eoh into xeople */
  createExtractedCandidate(){
    this.loading=true;
    let canObj={};
    canObj['EOHCandidates']=this.ExtractMapCan;
    canObj['MapWithJob']=(this.methodType.toLowerCase()=='extractmap' && this.JobDetails?.Id)?true:false;
    canObj['JobId']=(this.methodType.toLowerCase()=='extractmap' && this.JobDetails?.Id)?this.JobDetails?.Id:null;
    this.xeopleSearchService.SaveXeopleExtractMembers(canObj).subscribe(
      (repsonsedata: Res) => {
        this.loading = false;
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 400) {
          this.stepper.selected.completed = true;
         
          this.stepper.next();
         
          this.completed = true;
          this.state = 'done';
          this.extractedCanStatus=repsonsedata.Data['EOHCandidates'];
          this.extractedCanfailArr=this.extractedCanStatus.filter(x=>x['IsCandidateCreated']==false);
          this.successCandidate=this.extractedCanStatus.filter(x=>x['IsCandidateCreated']==true)?.length;
          this.FailedCandidate=this.extractedCanStatus.filter(x=>x['IsCandidateCreated']==false)?.length;
          this.extractedCanStatus.forEach(element => {
            if(typeof element?.DateOfHire!='undefined' && element?.DateOfHire)
            element['DateOfHire'] = formatDate(new Date(element?.DateOfHire), 'dd-MM-YYYY', 'en_US'); 
          });;
        }
      }, err => {
         this.loading = false;
      })
  }

 /* @Name: onSectionChange @Who: renu @When: 15-Sept-2023 @Why:EWM-13707 EWM-13846 @What: on section changes */
  onSectionChange(event: MatCheckbox,data){
    this.ExtractMapKeys.forEach(x => {
      if(x?.key?.toLowerCase()==data?.key?.toLowerCase())
        x['checked']=event.checked;
    });
  }

/* @Name: onStepChange @Who: renu @When: 15-Sept-2023 @Why:EWM-13707 EWM-13846 @What: to check current active index */
public onStepChange(event: MatStepper): void {
  this.activeStepperIndex=event?.selectedIndex;
}
/* @Name: generateFailedMembersExcel @Who: renu @When: 15-Sept-2023 @Why:EWM-13707 EWM-13846 @What: to download failed excel members */
generateFailedMembersExcel(){
  let ExcelData=this.extractedCanStatus.map(({ExternalId, Title,FirstName,LastName,UniqueId,Email,Gender,DateOfHire,Status,Reason,Office,Priority,
    Resume,MemberAppKeyAndroid,MemberAppKeyIOS,GlobalId,CountryCode,PhoneNo,AddressLine1,AddressLine2,Country,State,District,Postalcode,Industry,Expertise,
    Experience,EmergencyName,EmergencyRelation,EmergencyMobileNo,LastShiftWorked,EmployeeStatusNotes,ScreeningNotes,NoOfShifts,
    IsCandidateCreated,StatusMessage,IssueDescription}) => 
  ({ExternalId, Title,FirstName,LastName,UniqueId,Email,Gender,DateOfHire,Status,Reason,Office,Priority,Resume,MemberAppKeyAndroid,
    MemberAppKeyIOS,GlobalId,CountryCode,PhoneNo,AddressLine1,AddressLine2,Country,State,District,Postalcode,Industry,Expertise,
    Experience,EmergencyName,EmergencyRelation,EmergencyMobileNo,LastShiftWorked,EmployeeStatusNotes,ScreeningNotes,NoOfShifts,
    IsCandidateCreated,StatusMessage,IssueDescription}));
  this.excelService.generateExcel(ExcelData,'bulkextract');
}


}
