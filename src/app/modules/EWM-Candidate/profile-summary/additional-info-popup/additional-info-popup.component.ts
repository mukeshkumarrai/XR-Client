
/*
@(C): Entire Software
@Type: File, <ts>
@Who: Anup singh
@When: 21-Aug-2021
@Why: EWM-2191 EWM-2586
@What:  This component is used for add additional popup and edit.
*/
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { CustomValidatorService } from 'src/app/shared/services/custome-validator/custom-validator.service';
import { customDescriptionConfig, customDropdownConfig } from 'src/app/modules/EWM.core/shared/datamodels';
import { GeneralInformationService } from 'src/app/modules/EWM.core/shared/services/candidate/general-information.service';
import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
import { QuickJobService } from 'src/app/modules/EWM.core/shared/services/quickJob/quickJob.service';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { EDITOR_CONFIG } from '@app/shared/mention-editor/mention-modal';
import { BehaviorSubject, Subject } from 'rxjs';

@Component({
  selector: 'app-additional-info-popup',
  templateUrl: './additional-info-popup.component.html',
  styleUrls: ['./additional-info-popup.component.scss']
})
export class AdditionalInfoPopupComponent implements OnInit {

  dateStart:Date;
  minDate: Date;
  maxDate = new Date();
  loading: boolean = false;
  submitted = false;
  additionalInfoForm: FormGroup;

  public genderList = [];
  public languageList = [];
  public nationalitiesList = [];
  public currencyList = [];
  public salaryList = [];
  public candidateIdData: any;
  public editData: any = {};

  public onlyNumberPattern = new RegExp(/^(?:100(?:\.0)?|\d{1,20}?)$/);

  selectedDescription: any;
  descrpConfigData: customDescriptionConfig[] = [];
  today = new Date();
  getDateFormat:any;
  public dropDownSalaryUnitConfig: customDropdownConfig[] = [];
  public selectedSalaryUnit: any = {};
  public editorConfig: EDITOR_CONFIG;
  public getEditorVal: string;
  ownerList: string[]=[];
  public showErrorDesc: boolean = false;
  public tagList:any=['Jobs'];
  public basic:any=[];
  showMaxlengthError:boolean=false;
getRequiredValidationMassage: Subject<any> = new Subject<any>();
private maxlenth:number;
maxLengthEditorValue: Subject<any> = new Subject<any>();
ValidationMessage: Subject<any> = new Subject<any>();
public firstTimeImagePasteLength :number;
public labelForDiscription:string;
  constructor(public dialogRef: MatDialogRef<AdditionalInfoPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public candidateService: CandidateService,
     private fb: FormBuilder, private snackBService: SnackBarService,
    public dialog: MatDialog, private translateService: TranslateService, public systemSettingService: SystemSettingService,
    private quickJobService: QuickJobService,
    public _GeneralInformationService: GeneralInformationService,private serviceListClass: ServiceListClass,
    public _userpreferencesService: UserpreferencesService, private appSettingsService: AppSettingsService) {
    this.labelForDiscription = this.data?.label; //by maneesh
    this.candidateIdData = this.data.candidateId;
    this.editData = this.data.candidateAdditionalInfoData; 
    this.descrpConfigData['TextLength'] = 2000;
    this.descrpConfigData['LabelName'] = 'label_CandidateDescription';
    this.descrpConfigData['IsRequired'] = false;  
    this.additionalInfoForm = this.fb.group({
      Id: [],
      CandidateId: [this.data.candidateId],
      CurrentDepartment: ['', [Validators.maxLength(100)]],
      Industry: ['', [Validators.maxLength(100)]],
      CurrentBenifits: ['', [Validators.maxLength(100)]],
      CurrencyId: [null],
      CurrencyName: [],
      // who:maneesh,what:ewm-10635 for decimal value i am remove this validation patern" ,when:03/03/2023, -->
      ExpectedSalary: [],
      SalaryUnitId: [],
      SalaryUnitName: [null],
      ExpectedBenifits: ['', [Validators.maxLength(100)]],
      DateBirth: [new Date(),[CustomValidatorService.dateValidator]],
      GenderId: [null],
      GenderName: [],
      Description: [''],
      Nationalities: [],
      LanguageList: [],


    });

  }

  ngOnInit(): void {
    this.getDateFormat = this.appSettingsService.dateFormatPlaceholder;
    const currentYear = new Date().getFullYear();
    this.minDate = new Date(currentYear - 91, 0, 1);
    this.patchValueInForm(this.editData);
    this.getCurrencyAll();
    this.getAllGender();
    this.getAllLanguage();
    this.getAllNationalities();

    this.dropDownSalaryUnitConfig['IsDisabled'] = false;
    this.dropDownSalaryUnitConfig['apiEndPoint'] = this.serviceListClass.getAllSalary + '?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo';
    this.dropDownSalaryUnitConfig['placeholder'] = 'quickjob_salaryUnit';
    this.dropDownSalaryUnitConfig['IsManage'] = '/client/core/administrators/salaryunit';
    this.dropDownSalaryUnitConfig['IsRequired'] = false;
    this.dropDownSalaryUnitConfig['searchEnable'] = true;
    this.dropDownSalaryUnitConfig['bindLabel'] = 'Name';
    this.dropDownSalaryUnitConfig['multiple'] = false;
         //  @Who: maneesh, @When: 13-03-2024,@Why: EWM-16677-EWM-16207 @What: on changes on kendo editor catch the event here
         this.editorConfig={
          REQUIRED:false,
          DESC_VALUE:null,
          PLACEHOLDER:'label_CandidateDescription',
          Tag:[],
          EditorTools:this.basic,
          MentionStatus:false,
          maxLength:0,
          MaxlengthErrormessage:false,
          JobActionComment:false,
          ValidationMessage:'',
          hideIcon:true


        };
  }

  /*
 @Type: File, <ts>
 @Name: getCurrencyAll function
 @Who:  ANUP
 @When: 21-Aug-2021
 @Why: EWM-2191 EWM-2586
 @What: For showing the getCurrencyAll
 */
  getCurrencyAll() {
    this.quickJobService.getCurrency('?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo'+'&ByPassPaging=true').subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.currencyList = repsonsedata.Data;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }


  /*
 @Type: File, <ts>
 @Name: getAllSalary function
 @Who:  ANUP
 @When: 21-Aug-2021
 @Why: EWM-2191 EWM-2586
 @What: For showing the getAllSalary
 */
  getAllSalary() {
    this.quickJobService.getAllSalary('?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo').subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.salaryList = repsonsedata.Data;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }


  /*
 @Type: File, <ts>
 @Name: getAllGender function
 @Who:  ANUP
 @When: 21-Aug-2021
 @Why: EWM-2191 EWM-2586
 @What: For showing the getAllGender
 */
  getAllGender() {
    this.loading = true;
    this.candidateService.getAllGenderList().subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
          this.loading = false;
          this.genderList = repsonsedata['Data'];
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }

  /*
 @Type: File, <ts>
 @Name: getAllLanguage function
 @Who:  ANUP
 @When: 21-Aug-2021
 @Why: EWM-2191 EWM-2586
 @What: For showing the getAllLanguage
 */
  getAllLanguage() {
    this.loading = true;
    this.candidateService.getAllLanguageList('?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo').subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
          this.loading = false;
          this.languageList = repsonsedata['Data'];
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }

  /*
 @Type: File, <ts>
 @Name: getAllNationalities function
 @Who:  ANUP
 @When: 21-Aug-2021
 @Why: EWM-2191 EWM-2586
 @What: For showing the getAllNationalities
 */
  getAllNationalities() {
    this.loading = true;
    this.candidateService.getAllNationalitiesList('?FilterParams.ColumnName=StatusName&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo').subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
          this.loading = false;
          this.nationalitiesList = repsonsedata['Data'];
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }
  /*
@Type: File, <ts>
@Name: patchValueInForm function
@Who:  ANUP
@When: 21-Aug-2021
@Why: EWM-2191 EWM-2586
@What: For patchValueInForm
*/
patchValueInForm(infoValue) {
  this.loading = true;
  if (infoValue != null && infoValue != undefined) {
    this.loading = false;
   //  who:maneesh,what:ewm-13199 for if  ExpectedSalary 0 then show blank,when:14/08/2023 -->
  if (infoValue.ExpectedSalary==0 ||infoValue.CurrentBenifits==0 || infoValue.ExpectedBenifits==0  ) {
    this.additionalInfoForm.patchValue({
      ExpectedSalary: null,
      CurrentBenifits: null,
      ExpectedBenifits: null,

    })    
    }else{
      this.additionalInfoForm.patchValue({
        ExpectedSalary: infoValue.ExpectedSalary,
        ExpectedBenifits: infoValue.ExpectedBenifits,
        CurrentBenifits: infoValue.CurrentBenifits,
      })
    }
    this.additionalInfoForm.patchValue({
      Id: infoValue.Id,
      CandidateId: infoValue.CandidateId,
      CurrentDepartment: infoValue.CurrentDepartment,
      Industry: infoValue.Industry,
      CurrencyId: infoValue.CurrencyId == 0 ? null : infoValue.CurrencyId,
      CurrencyName: infoValue.CurrencyName,
      //  who:maneesh,what:ewm-9865 for apply custome dropdown this.selectedSalaryUnit,when:02/05/2023 -->
      SalaryUnitId: infoValue.SalaryUnitId,
      SalaryUnitName: infoValue.SalaryUnitName,
    // who:maneesh,what:ewm-10653 patch value null,when:06/03/2023
      DateBirth: infoValue.DateBirth === 0 ? ' ' : new Date(infoValue.DateBirth),
      // DateBirth:new Date(infoValue.DateBirth),
      GenderId:infoValue.GenderId == 0 ? null : infoValue.GenderId,
      GenderName: infoValue.GenderName,
      LanguageList: infoValue.LanguageList,
      Nationalities: infoValue.Nationalities,
      Description: infoValue.Description,
    });
    this.getEditorVal=infoValue.Description; //by maneesh
    this.selectedDescription = infoValue.Description;
    // who:maneesh,what:ewm-10653 patch value null,when:06/03/2023
    this.dateStart= infoValue.DateBirth === 0 ? null : new Date(infoValue.DateBirth)
      if (infoValue.SalaryUnitId != null && infoValue.SalaryUnitId != undefined) {
      this.selectedSalaryUnit = { 
      Id:infoValue.SalaryUnitId,
      SalaryUnitName:infoValue.SalaryUnitName,};      
  }
  if (infoValue.SalaryUnitId ==0) {
    this.selectedSalaryUnit = null;
    this.additionalInfoForm.patchValue({
      SalaryUnitId: null
    })
  }else{
    this.additionalInfoForm.patchValue(
      {
        SalaryUnitId: this.selectedSalaryUnit.Id
      })
  }
  } else {
    this.loading = false;  
  }
}

  /*
@Type: File, <ts>
@Name: onConfirm function
@Who:  ANUP
@When: 21-Aug-2021
@Why: EWM-2191 EWM-2586 
@What: For submit additional info
*/

  onConfirm() {
    if (this.editData != null && this.editData != undefined) {
      this.update(this.additionalInfoForm.value)      
    } else {
      this.Save(this.additionalInfoForm.value);
    }
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }
  }


  /*
 @Type: File, <ts>
 @Name: update function
 @Who:  ANUP
 @When: 21-Aug-2021
 @Why: EWM-2191 EWM-2586 
 @What: For update additional info
 */
  update(value) {
    this.loading = true;
    let formObj = {};
    formObj["Id"] = this.editData.Id,
      formObj["CandidateId"] = this.editData.CandidateId,
      formObj["CurrentDepartment"] = this.editData.CurrentDepartment,
      formObj["Industry"] = this.editData.Industry,
      formObj["CurrentBenifits"] = this.editData.CurrentBenifits,
      formObj["CurrencyId"] = this.editData.CurrencyId,
      formObj["CurrencyName"] = this.editData.CurrencyName,
        // who:maneesh,what:ewm-10635 for decimal value apply parseFloat ,when:03/03/2023,
      formObj["ExpectedSalary"] = parseFloat(value.ExpectedSalary),
      formObj["SalaryUnitId"] = this.editData.SalaryUnitId,
      formObj["SalaryUnitName"] = this.editData.SalaryUnitName,
      formObj["ExpectedBenifits"] = this.editData.ExpectedBenifits,
      formObj["DateBirth"] = new Date(this.editData.DateBirth),
      formObj["GenderId"] = this.editData.GenderId,
      formObj["GenderName"] = this.editData.GenderName,
      formObj["LanguageList"] = this.editData.LanguageList,
      formObj["Nationalities"] = this.editData.Nationalities,
      formObj["Description"] = this.editData.Description

    let saveObj = {};
    saveObj["Id"] = value.Id,
      saveObj["CandidateId"] = value.CandidateId,
      saveObj["CurrentDepartment"] = value.CurrentDepartment,
      saveObj["Industry"] = value.Industry,
      saveObj["CurrentBenifits"] = value.CurrentBenifits,
      saveObj["CurrencyId"] =value.CurrencyId !=null? value.CurrencyId : 0;
      saveObj["CurrencyName"] = value.CurrencyName;
    if (value.ExpectedSalary != undefined && value.ExpectedSalary != null && value.ExpectedSalary != '') {
        // who:maneesh,what:ewm-10635 for decimal value apply parseFloat and ExpectedSalary pass null,when:03/03/2023,
      saveObj["ExpectedSalary"] = parseFloat(value.ExpectedSalary);
    } else {
      saveObj["ExpectedSalary"] = null;
    }
    saveObj["SalaryUnitId"] = value.SalaryUnitId !=null ? value.SalaryUnitId : 0;
      saveObj["SalaryUnitName"] = value.SalaryUnitName,
      saveObj["ExpectedBenifits"] = value.ExpectedBenifits,
      saveObj["DateBirth"] = value.DateBirth,
      saveObj["GenderId"] = value.GenderId !=null? value.GenderId : 0;
      saveObj["GenderName"] = value.GenderName,
      saveObj["LanguageList"] = value.LanguageList,
      saveObj["Nationalities"] = value.Nationalities,
      saveObj["Description"] = value.Description?.trim()

    let updateObj = {
      "From": formObj,
      "To": saveObj,
    };

    this.candidateService.updateAdditionalInfoData(updateObj).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loading = false;
          document.getElementsByClassName("add_additionalInfo")[0].classList.remove("animate__zoomIn")
          document.getElementsByClassName("add_additionalInfo")[0].classList.add("animate__zoomOut");
          setTimeout(() => { this.dialogRef.close(true) }, 200);
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
@Name: Save function
@Who:  ANUP
@When: 21-Aug-2021
@Why: EWM-2191 EWM-2586
@What: For update additional info
*/
  Save(value) {
    this.loading = true;
    let saveObj = {}; 
    // who:maneesh,what:ewm-10635 send null dob add if else condition,when:06/03/2023
    let dob
   if(value.DateBirth===undefined || value.DateBirth===' '){
     dob=null;
   }else{
    dob = this.appSettingsService.getUtcDateFormat(value.DateBirth);
   }
    saveObj["Id"] = value.Id,
      saveObj["CandidateId"] = value.CandidateId,
      saveObj["CurrentDepartment"] = value.CurrentDepartment,
      saveObj["Industry"] = value.Industry,
      saveObj["CurrentBenifits"] = value.CurrentBenifits,
      saveObj["CurrencyId"] = value.CurrencyId !=null? value.CurrencyId : 0;
      saveObj["CurrencyName"] = value.CurrencyName;
      if (value.ExpectedSalary != undefined && value.ExpectedSalary != null && value.ExpectedSalary != '') {
        // who:maneesh,what:ewm-10635 and ewm-13199 for decimal value apply parseFloat and ExpectedSalary pass null ,when:03/03/2023,
        saveObj["ExpectedSalary"] = parseFloat(value.ExpectedSalary);
      } else {
        saveObj["ExpectedSalary"] = null;
      }
    saveObj["SalaryUnitId"] = value.SalaryUnitId !=null? value.SalaryUnitId : 0;
      saveObj["SalaryUnitName"] = value.SalaryUnitName,
      saveObj["ExpectedBenifits"] = value.ExpectedBenifits,
      saveObj["DateBirth"] = dob,
      saveObj["GenderId"] = value.GenderId !=null? value.GenderId : 0;
      saveObj["GenderName"] = value.GenderName,
      saveObj["LanguageList"] = value.LanguageList,
      saveObj["Nationalities"] = value.Nationalities,
      saveObj["Description"] = value.Description,
      this.candidateService.CreateAdditionalInfoData(saveObj).subscribe(
        (repsonsedata: any) => {
          if (repsonsedata.HttpStatusCode === 200) {
            this.loading = false;
            document.getElementsByClassName("add_additionalInfo")[0].classList.remove("animate__zoomIn")
            document.getElementsByClassName("add_additionalInfo")[0].classList.add("animate__zoomOut");
            setTimeout(() => { this.dialogRef.close(true) }, 200);
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
@Name: onDismiss function
@Who:  ANUP
@When: 21-Aug-2021
@Why: EWM-2191 EWM-2586
@What: For close popup
*/
  onDismiss(): void {
    document.getElementsByClassName("add_additionalInfo")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("add_additionalInfo")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.remove("is-blurred");
    }

  }


  /*
   @Type: File, <ts>
   @Name: getDescription function
   @Who:  ANUP
   @When: 06-Sep-2021
   @Why: EWM-2682 EWM-2725
   @What: For get descripyion data
    */
  getDescription(data) {
    // who:maneesh,what:ewm.9929 for remove default style if copy text google this.getEmailText(data) ,when:12/01/2023
    this.getEmailText(data)
    if (data == null || data == undefined || data == "") {
      this.selectedDescription = null;
      this.additionalInfoForm.patchValue({
        Description: '',
      })
    }
    else {
      if (data.length > this.descrpConfigData['TextLength']) {
        this.additionalInfoForm.get("Description").setErrors({ maxLength: true });
      } else {
        this.additionalInfoForm.get("Description").clearValidators();
        this.additionalInfoForm.get("Description").markAsPristine();
        this.selectedDescription = data;
    // who:maneesh,what:ewm.9929 for remove default style if copy text google  this.getEmailText(this.selectedDescription) ,when:11/01/2023
        this.getEmailText(this.selectedDescription)
        this.additionalInfoForm.patchValue({
          Description: data
        })

      }
    }
  }
  /*
    @Type: File, <ts>
    @Name: getEmailText function
    @Who: maneesh
    @When: 12-jan-2023
    @Why: EWM-9929
    @What: For clear default style
     */
  getEmailText(data) {
    let Text = data?.replace(/<[^>]*>/g, '');
    let resText = Text?.replace(/(\r\n|\n|\r)/gm, "");
    let finalText = resText?.trim();
    this.selectedDescription = finalText;
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
      this.additionalInfoForm.patchValue({
        DateBirth: null
      });
    }

    /*
 @Type: File, <ts>
 @Name: decimalFilter function
 @Who:  maneesh
 @When: 03-march-2023
 @Why: EWM-10635
 @What: For showing the decimal value
 */
decimalFilter(event: any) {
  const reg = /^-?\d*(\.\d{0,2})?$/;
  let input = event.target.value + String.fromCharCode(event.charCode);
  if (!reg.test(input)) {
      event.preventDefault();
  }
}
  /////Salary
  /* 
@Type: File, <ts>
@Name: onJobSalaryUnitchange function
@Who: maneesh
@When: 02-may-2023
@Why: EWM-9865 EWM-9865
@What: get salary List
*/
onJobSalaryUnitchange(data) {
  if (data == null || data == "") {
    this.selectedSalaryUnit = null;
    this.additionalInfoForm.patchValue(
      {
        SalaryUnitId: null,
        SalaryUnitName: null,
      }
    )
  }
  else {
    this.additionalInfoForm.get("SalaryUnitId").clearValidators();
    this.additionalInfoForm.get("SalaryUnitId").markAsPristine();
    this.selectedSalaryUnit = data;
    this.additionalInfoForm.patchValue(
      {
        SalaryUnitId: data.Id,
        SalaryUnitName: data.Name,
      }
    )
  }
}
    //who:maneesh,what:ewm-16207 ewm-16358,when:14/03/2024
     getEditorFormInfo(event) {
      this.ownerList = event?.ownerList;
      const sources = event.val?.match(/<img [^>]*src="[^"]*"[^>]*>/gm)
      ?.map(x => x?.replace(/.*src="([^"]*)".*/, '$1'));
      const regex = /<(?!img\s*\/?)[^>]+>/gi;
      let result= event.val?.replace(regex, '\n');
      if (result?.length>2000) {
        this.maxlenth=result?.length;
        this.editConfig();  
        this.showMaxlengthError=true;
      }else if(result?.length<=2000){
        // this.getEditorVal=event?.val;
        this.showMaxlengthError=false;
        this.editorConfig={
          REQUIRED:false,
          DESC_VALUE:null,
          PLACEHOLDER:'',
          Tag:[],
          EditorTools:[],
          MentionStatus:false,
          maxLength:0,
          MaxlengthErrormessage:false,
          JobActionComment:false,
          ValidationMessage:'',
          hideIcon:true
          }
        this.ValidationMessage.next(this.editorConfig);
        this.additionalInfoForm.get('Description').setValue(event?.val);
      }
      else if(sources != undefined && result?.length<=2000 ){
        this.additionalInfoForm.get('Description').setValue(event?.val);    
      }
      if (this.firstTimeImagePasteLength>2000) { //fixed ewm-18494 by maneesh    
        this.maxlenth=this.firstTimeImagePasteLength;
        this.editConfig();  
        this.showMaxlengthError=true;
      }
    }
    
    editConfig(){
      this.editorConfig={
        REQUIRED:false,
        DESC_VALUE:null,
        PLACEHOLDER:'',
        Tag:[],
        EditorTools:[],
        MentionStatus:false,
        maxLength:2000,
        MaxlengthErrormessage:false,
        JobActionComment:false,
        ValidationMessage:this.labelForDiscription=='Employee'?'label_AdditionalInformation_EmployeeDescriptionMaximum':'label_AdditionalInformation_CandidateDescriptionMaximum',
        hideIcon:true
        }
        if (this.maxlenth>2000) {
          this.showMaxlengthError=true;
        }else{
        this.showMaxlengthError=false;
        }
        this.maxLengthEditorValue.next(this.editorConfig);
        this.additionalInfoForm.get('Description').updateValueAndValidity();
        this.additionalInfoForm.get("Description").markAsTouched();
    }
    getEditorImageFormInfo(event){
      const sources = event.val?.match(/<img [^>]*src="[^"]*"[^>]*>/gm)
      ?.map(x => x?.replace(/.*src="([^"]*)".*/, '$1'));
      const regex = /<(?!img\s*\/?)[^>]+>/gi;   
      let result= event.val?.replace(regex, '\n');  
      this.firstTimeImagePasteLength=result?.length; //fixed ewm-18494 by maneesh   
      if (result?.length>2000) {
      this.editConfig();  
      this.showMaxlengthError=true;
    }else if(result?.length<=2000){
      this.showMaxlengthError=false;
      this.additionalInfoForm.get('Description').setValue(event?.val);
      this.editorConfig={
        REQUIRED:false,
        DESC_VALUE:null,
        PLACEHOLDER:'',
        Tag:[],
        EditorTools:[],
        MentionStatus:false,
        maxLength:0,
        MaxlengthErrormessage:false,
        JobActionComment:false,
        ValidationMessage:'',
        hideIcon:true
        }
      this.ValidationMessage.next(this.editorConfig);
    
    }  else if(sources != undefined && result?.length<=2000 ){
      this.additionalInfoForm.get('Description').setValue(event?.val);  
    }
    } 
    }
