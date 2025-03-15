import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { customDropdownConfig } from 'src/app/modules/EWM.core/shared/datamodels';
import { ResponceData } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { DocumentService } from 'src/app/shared/services/candidate/document.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { FileUploaderService } from 'src/app/shared/services/file-uploader.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
import { HttpClient } from '@angular/common/http';
import { CustomValidatorService } from 'src/app/shared/services/custome-validator/custom-validator.service';

@Component({
  selector: 'app-manage-candidate-skills',
  templateUrl: './manage-candidate-skills.component.html',
  styleUrls: ['./manage-candidate-skills.component.scss']
})
export class ManageCandidateSkillsComponent implements OnInit {

  @ViewChild('fileInput') fileInput;
  public prevUploadedFileCount: number = 0;
  public prevUploadedFileSize: number = 0;
  public attachmentName: string;
  public docName: any;
  public docId: any;

  addForm: FormGroup;
  categoryList: any = [];
  documentnameList: any = [];
  activestatus: string = 'Add';
  loading: boolean = false;
  dateStart = new Date();
  dateEnd = new Date();
  today = new Date();
  datePublish = new Date();
  endDay= new Date();
  fromDate = '';
  file: any;
  fileType: any;
  fileSize: any;
  fileSizetoShow: string;
  selectedCategory: any;
  public dropDoneConfig: customDropdownConfig[] = [];
  public dropDocumrntnameConfig: customDropdownConfig[] = [];
  public dropDownSkillTagsConfig: customDropdownConfig[] = [];
  resetDdl: Subject<any> = new Subject<any>();
  selectedDocumentname: any;
  showExpdate: boolean;
  hideFileName: boolean = false;
  maxMessage: number = 500;
  filestatus: boolean = true;
  fileViewstatus: boolean = true;
  expiryDateStatus:boolean = false;
  docRequiredStatus:boolean = false;
  fileInfo: string;
  candidateId:string;
  oldPatchValue:any;
  tempId:any;
  public numberPattern = new RegExp(/^(?:100(?:\.0)?|\d{1,1000}?)$/);
  public selectedSkillTags: any = {};
   iconFileType: any;
   documentTypeOptions:any;
  filePathOnServer: any;
  isSave: boolean =false;
  getDateFormat:any;
  
  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<ManageCandidateSkillsComponent>, @Inject(MAT_DIALOG_DATA) public data: any,
    private _services: DocumentService, public uploader: FileUploaderService, private translateService: TranslateService, private snackBService: SnackBarService,
    private _appSetting: AppSettingsService,private http: HttpClient,public candidateService: CandidateService, private serviceListClass: ServiceListClass,private commonserviceService: CommonserviceService,
    private appSettingsService: AppSettingsService) {
    this.fileType = _appSetting.file_file_type_extralarge;
    this.fileSizetoShow = _appSetting.file_file_size_extralarge;
    if (this.fileSizetoShow.includes('KB')) {
      let str = this.fileSizetoShow.replace('KB', '')
      this.fileSize = Number(str) * 1000;
    }
    else if (this.fileSizetoShow.includes('MB')) {
      let str = this.fileSizetoShow.replace('MB', '')
      this.fileSize = Number(str) * 1000000;
    }

    this.candidateId = this.data.candidateId;
    this.tempId = this.data.skilldata.Id;
    this.activestatus = this.data.activestatus;
    this.addForm = this.fb.group({
      SkillName: [''],
      SkillId: [''],
      SkillsTag: [[]],
      Weightage: ['',[Validators.pattern(this.numberPattern)]],
      WeightageId: [''],
      RenewalDate: ['',[CustomValidatorService.dateValidator]],
      RenewalExpiryDate: [],
      UploadDocument: [''],
      FileName: [''],
      FileSize: [0],
    });    

    this.dropDoneConfig['IsDisabled'] = false;
    this.dropDoneConfig['apiEndPoint'] = this.serviceListClass.getDocumentcategory + '?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=Text&FilterParams.FilterValue=Active';
    this.dropDoneConfig['placeholder'] = 'label_category';
    this.dropDoneConfig['searchEnable'] = true;
    this.dropDoneConfig['IsManage'] = 'client/core/administrators/document-category';
    this.dropDoneConfig['IsRequired'] = true;
    this.dropDoneConfig['bindLabel'] = 'CategoryName';
    this.dropDoneConfig['multiple'] = false;

    this.dropDocumrntnameConfig['IsDisabled'] = false;
    this.dropDocumrntnameConfig['placeholder'] = 'label_documentname';
    this.dropDocumrntnameConfig['searchEnable'] = true;
    //this.dropDocumrntnameConfig['IsManage']='client/core/administrators/document-category';
    this.dropDocumrntnameConfig['IsRequired'] = true;
    this.dropDocumrntnameConfig['bindLabel'] = 'DocumentName';
    this.dropDocumrntnameConfig['multiple'] = false;

    this.dropDownSkillTagsConfig['IsDisabled'] = true;
    this.dropDownSkillTagsConfig['apiEndPoint'] = this.serviceListClass.getAllSkillGroupList;
    this.dropDownSkillTagsConfig['placeholder'] = 'label_skillTag';
    this.dropDownSkillTagsConfig['IsManage'] = '/client/core/administrators/skill-group;can=candidate';
    this.dropDownSkillTagsConfig['IsRequired'] = true;
    this.dropDownSkillTagsConfig['searchEnable'] = true;
    this.dropDownSkillTagsConfig['bindLabel'] = 'GroupName';
    this.dropDownSkillTagsConfig['multiple'] = true;
  }
  ngOnInit(): void {
    this.getDateFormat = this.appSettingsService.dateFormatPlaceholder;
    this.http.get("assets/config/document-config.json").subscribe(data => {
      this.documentTypeOptions = JSON.parse(JSON.stringify(data));
     })
    this.getAllSkillById();

    if(this.activestatus=='view'){
      this.addForm.disable();
    }
  }

 /*
   @Type: File, <ts>
   @Name: onSave
   @Who: Nitin Bhati
   @When: 16-sep-2021
   */
   onSave(value) {  
    this.updateSkills(value);
  }
  /*
 @Type: File, <ts>
 @Name: documentDataFetchFromChild
 @Who: Nitin Bhati
 @When: 08-Oct-2021
 @Why: EWM-3227
 @What: for patch document data 
 */
 documentDataFetchFromChild(FileDetails:any){
  let UploadDocument = FileDetails; 
  
  this.fileInfo = UploadDocument.UploadFileName;
  if(this.fileInfo!=""){
    if(this.activestatus=='view'){    
      this.fileViewstatus = false;
    }  
   this.filestatus = false;  
   const list = this.fileInfo.split('.');
   const fileType = list[list.length - 1];
   let FileTypeJson = this.documentTypeOptions.filter(x=>x['type']===fileType.toLocaleLowerCase());
   this.iconFileType= FileTypeJson[0]? FileTypeJson[0].logo:''; 
   this.filePathOnServer= UploadDocument.DocumentUrl;
  // console.log("filePathOnServer",this.filePathOnServer)
  }
  this.addForm.patchValue({
    UploadDocument: UploadDocument.FilePathOnServer,
    FileSize: UploadDocument.SizeOfFile,
    FileName: UploadDocument.UploadFileName
  });
}

onDismiss() {
  document.getElementsByClassName("add_folder")[0].classList.remove("animate__zoomIn")
  document.getElementsByClassName("add_folder")[0].classList.add("animate__zoomOut");
  setTimeout(() => { this.dialogRef.close(false); }, 200);
}


  /* 
 @Type: File, <ts>
 @Name: onSkillTagschange function
 @Who: Anup Singh
 @When: 02-Nov-2021
 @Why: EWM-3132 EWM-3605
 @What: get skill group List and patch
 */
onSkillTagschange(data) {
  if (data == null || data == "" || data.length == 0) {
    this.selectedSkillTags = null;
  }
  else {  
    this.addForm.patchValue({
      'SkillsTag':data
    })
    this.selectedSkillTags = data;
  
  }
}



/*
@Type: File, <ts>
@Name: updateSkills function
@Who: Anup
@When: 16-Aug-2021
@Why: EWM-2242.EWM-2507
@What: Update Skills List
*/
  
      updateSkills(value) {
        this.loading = true;
        let toobj = {};
        toobj['CandidateId']=this.candidateId;
        toobj['SkillName']=value.SkillName;
        toobj['SkillId']=value.SkillId;
        toobj['Id']=this.oldPatchValue.Id;
        toobj['SkillsTag']=value.SkillsTag;
        toobj['Weightage']=parseInt(value.Weightage);
        toobj['WeightageId']=value.WeightageId;
        toobj['RenewalDate']=this.oldPatchValue.RenewalDate;
        toobj['Document']=value.UploadDocument;
        toobj['FileName']=value.FileName;
        toobj['FileSize']=value.FileSize;
        toobj['RenewalExpiryDate']=value.RenewalDate;
        // if (this.oldPatchValue.RenewalDate=='') {
        //   this.isSave=false;
        // }else{
        //   this.isSave=true;
        // }
        // this.isSave=false;
        let updateObj = {
          "From": this.oldPatchValue,
          "To": toobj,
        };       
        this.candidateService.updateCanSkillsData(updateObj).subscribe(
          (repsonsedata: any) => {
            if (repsonsedata.HttpStatusCode === 200) {            
              this.loading = false;
             // this.getAllSkills();
              document.getElementsByClassName("add_folder")[0].classList.remove("animate__zoomIn")
              document.getElementsByClassName("add_folder")[0].classList.add("animate__zoomOut");
              setTimeout(() => { this.dialogRef.close(true); }, 200);
              // this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
            } else if (repsonsedata.HttpStatusCode === 400) {
              this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
              this.loading = false;
            }
            else {
              this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
              this.loading = false;
            }
          },
          err => {
            this.loading = false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          });
    
      }
    
  /*
    @Type: File, <ts>
    @Name: getAllSkills function
    @Who: Anup
    @When: 16-Aug-2021
    @Why: EWM-2242.EWM-2507
    @What: get AllSkills List
    */
   getAllSkillById() {
    this.loading = true;
    this.candidateService.getCanSkillsById('?id=' + this.tempId).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.oldPatchValue = repsonsedata.Data;  
          this.editData();        
          this.loading = false;
        }else if(repsonsedata.HttpStatusCode === 204){
          this.oldPatchValue = [];
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

  editData(){   
    if(this.oldPatchValue.DocumentRequired==1){
      this.docRequiredStatus = true; 
      this.addForm.get('UploadDocument').setValidators([Validators.required]);
    }
    if(this.oldPatchValue.Renewal==1){  
      this.expiryDateStatus = true;  
      // this.addForm.get('RenewalDate').setValidators([Validators.required]);
    }
    this.selectedSkillTags = this.oldPatchValue.SkillTags;
    let expiryDate = this.today;
    if(this.oldPatchValue.RenewalDate!=0){
      expiryDate = new Date(this.oldPatchValue.RenewalDate);
    }
    this.addForm.patchValue({
      'SkillsTag':this.oldPatchValue.SkillTags,
      'SkillName': this.oldPatchValue.SkillName,
      'SkillId': this.oldPatchValue.SkillId,
      'Weightage':this.oldPatchValue.Weightage,
      'WeightageId':this.oldPatchValue.WeightageId,
      'RenewalDate':expiryDate,
      'RenewalExpiryDate':expiryDate,
      //'UploadDocument':this.oldPatchValue.Document,
      //'FileName':this.oldPatchValue.Document,     
    })
   
    let fileObj = {};  
    fileObj['FilePathOnServer'] = this.oldPatchValue.Document;
    fileObj['SizeOfFile'] = this.oldPatchValue.FileSize;
    fileObj['UploadFileName'] = this.oldPatchValue.FileName;
    fileObj['DocumentUrl']=this.oldPatchValue.DocumentUrl;
    this.documentDataFetchFromChild(fileObj);
  }
/*
    @Type: File, <ts>
    @Name: clearEndDate function
    @Who: maneesh
    @When: 14-dec-2022
    @Why: EWM-9802
    @What: For clear end  date 
     */
    clearEndDate(e){
      this.addForm.patchValue({
        RenewalDate: null
      });
    }
}
