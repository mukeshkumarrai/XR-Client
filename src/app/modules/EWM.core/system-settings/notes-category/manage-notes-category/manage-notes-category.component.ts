/*
  @(C): Entire Software
  @Type: File, <ts>
  @Name: manage-note-category.component.ts
  @Who: Nitin Bhati
  @When: 10-Dec-2021
  @Why: EWM-4140
  @What: Note Category master edit/add manage forms
 */

  import { Component, OnInit } from '@angular/core';
  import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
  import { ActivatedRoute, Router } from '@angular/router';
  import { TranslateService } from '@ngx-translate/core';
  import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
  import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
  import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
  import { statusList } from '../../../shared/datamodels/common.model';
  import { ProfileInfoService } from 'src/app/modules/EWM.core/shared/services/profile-info/profile-info.service';
  import { ResponceData } from 'src/app/shared/models';
  import { TextChangeLngService } from 'src/app/shared/services/commonservice/text-change-lng.service';
  import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
  import { ServiceListClass } from 'src/app/shared/services/sevicelist';
  import { customDropdownConfig } from 'src/app/modules/EWM.core/shared/datamodels/common.model';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-manage-notes-category',
  templateUrl: './manage-notes-category.component.html',
  styleUrls: ['./manage-notes-category.component.scss']
})
export class ManageNotesCategoryComponent implements OnInit {

 
  /**********************All generic variables declarations for accessing any where inside functions********/
  addForm: FormGroup;
  public loading: boolean = false;
  public activestatus: string = 'Add';
  public primaryBgColor: string;
  public tempID: number;
  public submitted = false;
  public addObj = {};
  public specialcharPattern = "[A-Za-z0-9 ]+$";
  public statusList: any = [];
  public viewMode: any;
  public codePattern = new RegExp(/^[A-Z0-9]{1,20}$/); //^[A-Z0-9]{1,20}$
  visibility: number = 0;
  public visibilityID: number;
  visibilityStatus = false;
  client: any;
  public dropDoneConfig: customDropdownConfig[] = [];
  public selectedRelation: any = {};
  public industryList: any = [];
  public isHideExternally: number = 0;
  public oldPatchValues: any;
  public StatusData: any[];
  public StatusDataName;
  public StatusDataId;
  iconData: any;
  userTypeList: { StatusId: number; StatusName: string; };
  public AddObj = {};
  /* 
  @Type: File, <ts>
  @Name: constructor function
  @Who: Nitin Bhati
  @When: 10-Dec-2021
  @Why: EWM-4140
  @What: For injection of service class and other dependencies
  */

  constructor(private fb: FormBuilder, private translateService: TranslateService, private router: ActivatedRoute,
    private snackBService: SnackBarService, private clientTagService: ProfileInfoService, private route: Router,
    private textChangeLngService: TextChangeLngService,
    public _sidebarService: SidebarService, private commonserviceService: CommonserviceService, private _SystemSettingService: SystemSettingService, private serviceListClass: ServiceListClass, private http: HttpClient) {
    this.addForm = this.fb.group({
      Id: [''],
      //  @Who: maneesh, @When: 29-dec-2022,@Why: EWM-10075 addnoWhitespaceValidator
      NoteCategory: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(1),this.noWhitespaceValidator()]],
      UserType: [[], Validators.required],
      CategoryIcon: [[], Validators.required],
      Status: ["1", Validators.required] //<!-----@suika@EWM-10681 EWM-10818  @03-03-2023 to set default values for status in master data---->
    });
  }

  ngOnInit(): void {
    this.http.get<any>("assets/config/icon-name.json").subscribe((data)=>
      this.iconData = data
    )
    
    this.getuserTypeList();
    this.getStatusList();
    let URL = this.route.url;
    // let URL_AS_LIST = URL.split('/');
    let URL_AS_LIST;
    if (URL.substring(0, URL.indexOf("?")) == '') {
      URL_AS_LIST = URL.split('/');
    } else {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this.router.queryParams.subscribe(
      params => {
        if (params['Id'] != undefined) {
          this.activestatus = 'Edit'
          this.tempID = params['Id'];
          this.visibilityID = parseInt(params['R']);
          this.editForm(this.tempID);
        } else {
          this.activestatus = 'Add';
        }
        if (params['V'] != undefined) {
          this.viewMode = params['V'];
        }

      });
  }
  /*
   @Type: File, <ts>
   @Name: editForm function
   @Who: Nitin Bhati
   @When: 10-Dec-2021
   @Why: EWM-4140
   @What: For setting value in the edit form
  */
  editForm(Id: Number) {
    this.loading = true;
    this._SystemSettingService.getNotesCategoryByID('?id=' + Id).subscribe(
      (data: ResponceData) => {
        this.loading = false;
        if (data.HttpStatusCode === 200) {
          this.addForm.patchValue({
            Id: data.Data.Id,
            UserType: data.Data.UserType,
            NoteCategory: data.Data.CategoryName,
            CategoryIcon: data.Data.IconName,
            Status: data.Data.Status.toString(),
          });
          this.oldPatchValues = data['Data'];
          this.StatusDataName = data.Data.StatusName;
          this.StatusDataId = data.Data.Status;
        }
        else {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
        }
      },
      err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  /*
     @Type: File, <ts>
     @Name: onSave function
     @Who: Nitin Bhati
     @When: 10-Dec-2021
     @Why: EWM-4140
     @What: For checking wheather the data save or edit on the basis on active satatus
    */
  onSave(value: any, activestatus: any) {
    this.submitted = true;
    if (this.addForm.invalid) {
      return;
    }
    //  if (this.activestatus == 'Add') {
    //    this.createWeightageMaster(value);
    //  } else {
    //    this.updateWeightageMaster(value);
    //  }
    this.activestatus = activestatus;
    this.duplicayCheck(value);
  }
  /*
      @Type: File, <ts>
      @Name: createNoteCategoryMaster function
      @Who: Nitin Bhati
      @When: 10-Dec-2021
      @Why: EWM-4140
      @What: For saving data for Note Category master
     */
  createNoteCategoryMaster(value: any) {
    this.loading = true;
    this.AddObj['CategoryName'] = value.NoteCategory;
    this.AddObj['UserType'] = value.UserType;
    this.AddObj['IconName'] = value.CategoryIcon;
    this.AddObj['Status'] = parseInt(value.Status);
    this._SystemSettingService.notesCategoryCreate(this.AddObj).subscribe((repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
         this.route.navigate(['./client/core/administrators/notes-category'], { queryParams: { V: this.viewMode } });
        //this.route.navigate(['./client/core/administrators/weightage']);
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
     @Name: updateNoteCategoryMaster function
     @Who: Nitin Bhati
     @When: 10-Dec-2021
     @Why: EWM-4140
     @What: For saving data for Note category master
    */
    updateNoteCategoryMaster(value: any) {
    this.loading = true;
    let updateObj = [];
    let fromObj = {};
    let toObj = {};
    fromObj = this.oldPatchValues;
  
    toObj['Id'] = value.Id;
    toObj['UserType'] = value.UserType;
    toObj['CategoryName'] = value.NoteCategory;
    toObj['IconName'] = value.CategoryIcon;
    toObj['Status'] = parseInt(value.Status);
    updateObj = [{
      "From": fromObj,
      "To": toObj
    }];
    this._SystemSettingService.updateNotesCategory(updateObj[0]).subscribe((repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.loading = false;
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.route.navigate(['./client/core/administrators/notes-category'], { queryParams: { V: this.viewMode } });
        //this.route.navigate(['./client/core/administrators/weightage']);
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
   @Name: duplicayCheck function
   @Who: Nitin Bhati
   @When: 10-Dec-2021
   @Why: EWM-4140
   @What: For checking duplicacy for Note category type
  */
   duplicayCheck(value) {
    let duplicacyExist = {};
    let notecategoryId;
    if (this.tempID != undefined) {
      notecategoryId = this.tempID;
    } else {
      notecategoryId = 0;
    }
    if (value == '') {
      value = 0;
      return false;
    }
    duplicacyExist['usertype'] = this.addForm.get("UserType").value;
    duplicacyExist['categoryname'] = this.addForm.get("NoteCategory").value;
    duplicacyExist['id'] = Number(notecategoryId);
    this._SystemSettingService.checkNotesCategoryDuplicacy(duplicacyExist).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 402) {
          if (repsonsedata.Status == false) {
           
              this.addForm.get("NoteCategory").setErrors({ codeTaken: true });
              this.addForm.get("NoteCategory").markAsDirty();
              this.submitted = false;
            
          } 
         } else if (repsonsedata.HttpStatusCode === 204) {
         if (repsonsedata.Status == true) {     
              this.addForm.get("NoteCategory").clearValidators();
              this.addForm.get("NoteCategory").markAsPristine();
              this.addForm.get('NoteCategory').setValidators([Validators.required, Validators.maxLength(50), Validators.minLength(1),this.noWhitespaceValidator()]);
              this.addForm.get("NoteCategory").updateValueAndValidity();
              if (this.addForm && this.submitted == true) { 
                if (this.activestatus == 'Add') {
                  this.createNoteCategoryMaster(this.addForm.value);
                } else if(this.activestatus == 'Edit') {
                  this.updateNoteCategoryMaster(this.addForm.value);
                }
              }
            
          }

        } else {
       
            this.addForm.get("NoteCategory").clearValidators();
            this.addForm.get("NoteCategory").markAsPristine();
            this.addForm.get('NoteCategory').setValidators([Validators.required, Validators.maxLength(50), Validators.minLength(1),,this.noWhitespaceValidator()]);

          }
        
        // this.addForm.get('Code').updateValueAndValidity();
        // this.addForm.get('Description').updateValueAndValidity();
      //  @Who: bantee, @When: 29-08-2023,@Why: EWM-13484 Note Category: multiple record created when we click of save button
        this.submitted=false;

      },
      err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      });
  }
  /* 
     @Type: File, <ts>
     @Name: getStatusList function
     @Who: Nitin Bhati
     @When: 10-Dec-2021
     @Why: EWM-4140
     @What: For status listing 
    */
  getStatusList() {
    this.commonserviceService.getStatusList().subscribe(
      (repsonsedata: statusList) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.statusList = repsonsedata.Data;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }

  /* 
   @Type: File, <ts>
   @Name: clickStatusID function
   @Who: Nitin Bhati
   @When: 10-Dec-2021
   @Why: EWM-4140
   @What: For status Click event
  */
  clickStatusID(Id) {
    this.StatusData = this.statusList.filter((dl: any) => dl.StatusId == Id);
    this.StatusDataName = this.StatusData[0].StatusName;
    this.StatusDataId = this.StatusData[0].StatusId;
  }
 


  /* 
   @Type: File, <ts>
   @Name: getuserTypeList function
   @Who: Nitin Bhati
   @When: 10-Dec-2021
   @Why: EWM-4140
   @What: For user Type listing 
  */
   getuserTypeList() {
    this._SystemSettingService.getUserTypeList().subscribe(
      (repsonsedata: statusList) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.userTypeList = repsonsedata.Data;
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }

  changeCategory(){
    //this.addForm.get("NoteCategory").reset();
   let Notcategoryname= this.addForm.get("NoteCategory").value;
    if (Notcategoryname !== null) {
      this.duplicayCheck(Notcategoryname);
      } 
     
  }
/*
   @Type: File, <ts>
   @Name: noWhitespaceValidator function
   @Who: maneesh
   @When: 29-dec-2022
   @Why: EWM-10075
   @What: Remove whitespace
*/
noWhitespaceValidator(): ValidatorFn {  
  return (control: AbstractControl): ValidationErrors | null => {
    const isWhitespace = (control.value as string || '')?.trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  };
}
}
