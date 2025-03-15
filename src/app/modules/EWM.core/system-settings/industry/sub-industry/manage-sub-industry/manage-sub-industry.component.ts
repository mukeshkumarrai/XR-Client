import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { Industry } from '../../model/industry';

@Component({
  selector: 'app-manage-sub-industry',
  templateUrl: './manage-sub-industry.component.html',
  styleUrls: ['./manage-sub-industry.component.scss']
})
export class ManageSubIndustryComponent implements OnInit {

  addForm: FormGroup;
  submitted = false;
  public loading: boolean = false;
  public actionStatus: string = 'Add';
  public industryJsonObj = {};
  public codePattern = '^[A-Z]{5,20}$';
  public isHideExternally: number = 1;
  public isBuiltIn: number = 0;
  public industryId;
  public IndustryDescription: string;
  public maxCharacterLengthSubHead = 130;
  tempID: string;
  InputValue: any;
  viewModeValue: any;
  public scorePattern = new RegExp(/^(?:100(?:\.0)?|\d{1,3}(?:\.\d{1,2})?)$/);
  public statusList: any = [];
  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute,
    public industryService: SystemSettingService, private snackBService: SnackBarService,
    private translateService: TranslateService, public _sidebarService: SidebarService, private commonserviceService: CommonserviceService) {
    this.addForm = this.fb.group({
      Id: [''],
      displaySequence: ['0', [RxwebValidators.numeric({ isFormat: true }), Validators.maxLength(6)]],
      code: ['', [Validators.required, Validators.pattern(this.codePattern)]],
      description: ['', [Validators.required, Validators.maxLength(100)]],
      externalId: [''],
      score: ['', Validators.pattern(this.scorePattern)],
      status: ["1", Validators.required], //<!-----@suika@EWM-10681 EWM-10818  @03-03-2023 to set default values for status in master data--->    
      hideExternally: [1],
      isBuiltIn: [0],
    });
  }

  ngOnInit(): void {
    let URL = this.router.url;
    // let URL_AS_LIST = URL.split('/');
    let URL_AS_LIST;
    if (URL.substring(0, URL.indexOf("?")) == '') {
      URL_AS_LIST = URL.split('/');
    } else {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this._sidebarService.activesubMenuObs.next('masterdata');
    this.getStatusList();
    //ReactiveFormConfig.set({"validationMessage":{"numeric":"Enter numeric value in the input"}});
    this.IndustryDescription = localStorage.getItem('IndustryDescription');
    this.route.queryParams.subscribe(
      params => {
        if (params['id'] != undefined) {
          this.actionStatus = 'Edit'
          this.tempID = params['id'];
          this.editForm(this.tempID);
        } else {
          this.industryId = localStorage.getItem('IndustryId');
        }
      });

    this.route.queryParams.subscribe((params) => {
      this.viewModeValue = params['viewModeData'];
    })
  }



  /*
   @Type: File, <ts>
   @Name: editForm function
   @Who: Suika
   @When: 13-May-2021
   @Why: ROST-1506
   @What: For setting value in the edit form
  */
  editForm(Id: String) {
    this.loading = true;
    this.industryService.getSubIndustryById('?subIndustryId=' + Id).subscribe(
      (data: Industry) => {
        this.loading = false;
        if (data['HttpStatusCode'] == 200) {
          this.industryId = data.Data.IndustryId;
          this.isBuiltIn = data.Data.IsBuiltIn;
          this.addForm.patchValue({
            Id: data.Data.Id,
            displaySequence: data.Data.Order,
            code: data.Data.Code,
            description: data.Data.Description,
            externalId: data.Data.ExternalId,
            score: data.Data.Score,
            status: data.Data.Status.toString(),
            hideExternally: data.Data.HideExternally,
            isBuiltIn: data.Data.IsBuiltIn,
          });
        } else if (data['HttpStatusCode'] == 400) {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());

        } else {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());

        }
      },
      err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }




  onSave(value, actionStatus) {
    this.submitted = true;
    if (this.addForm.invalid) {
      return;
    }
    if (actionStatus == 'Add') {
      this.createSubIndustry(value);
    } else {
      this.updateSubIndustry(value);
    }


  }

  createSubIndustry(value) {
    this.loading = true;
    let subIndustryId;
    if (this.tempID != undefined) {
      subIndustryId = this.tempID;
    } else {
      subIndustryId = '0';
    }
    this.industryJsonObj['id'] = parseInt(subIndustryId);
    this.industryJsonObj['IndustryId'] = this.industryId;
    this.industryJsonObj['order'] = parseInt(value.displaySequence ? value.displaySequence : 0);
    this.industryJsonObj['Code'] = value.code;
    this.industryJsonObj['Description'] = value.description;
    this.industryJsonObj['ExternalId'] = value.externalId;
    this.industryJsonObj['Score'] = parseFloat(value.score ? value.score : 0.0);
    this.industryJsonObj['status'] = parseInt(value.status);
    this.industryJsonObj['HideExternally'] = this.isHideExternally;
    this.industryJsonObj['IsBuiltIn'] = this.isBuiltIn;
    this.industryService.createSubIndustry(this.industryJsonObj).subscribe(repsonsedata => {

      if (repsonsedata['HttpStatusCode'] == 200) {
        this.loading = false;
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        let viewModeData: any = this.viewModeValue;
        this.router.navigate(['./client/core/administrators/industry-master/sub-industry'], {
          queryParams: { id: this.industryId,viewModeData:viewModeData }
        })
        //this.router.navigate(['./client/core/administrators/industry-master/sub-industry', { id: this.industryId }],);

      } else if (repsonsedata['HttpStatusCode'] == 400) {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        this.loading = false;
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        this.loading = false;
      }
    },
      err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      });

  }

  updateSubIndustry(value) {
    this.loading = true;
    this.industryJsonObj['IndustryId'] = this.industryId;
    this.industryJsonObj['id'] = parseInt(value.Id);
    this.industryJsonObj['order'] = parseInt(value.displaySequence ? value.displaySequence : 0);
    this.industryJsonObj['Code'] = value.code;
    this.industryJsonObj['Description'] = value.description;
    this.industryJsonObj['ExternalId'] = value.externalId;
    this.industryJsonObj['Score'] = parseFloat(value.score ? value.score : 0.0);
    this.industryJsonObj['status'] = parseInt(value.status);
    this.industryJsonObj['HideExternally'] = this.isHideExternally;
    this.industryJsonObj['IsBuiltIn'] = this.isBuiltIn;
    this.industryService.updateSubIndustryById(this.industryJsonObj).subscribe(repsonsedata => {
      if (repsonsedata['HttpStatusCode'] == 200) {
        this.loading = false;
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        let viewModeData: any = this.viewModeValue;
        this.router.navigate(['./client/core/administrators/industry-master/sub-industry'], {
          queryParams: { id: this.industryId,viewModeData:viewModeData}
        })
       // this.router.navigate(['./client/core/administrators/industry-master/sub-industry', { id: this.industryId }]);
      } else if (repsonsedata['HttpStatusCode'] == 400) {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        this.loading = false;
      }
      else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        this.loading = false;
      }
    },
      err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      });

  }

  onCancel(e) {
    e.preventDefault();
    this.addForm.reset();
    this.actionStatus = 'Add';
    let viewModeData: any = this.viewModeValue;
    /*this.router.navigate(['./client/core/administrators/industry-master/sub-industry'], {
      queryParams: { viewModeData }
    })*/
    this.router.navigate(['./client/core/administrators/industry-master/sub-industry']);

  }





  /*
  @Type: File, <ts>
  @Name: onCodeChanges function
  @Who:  Suika
  @When: 13-May-2021
  @Why: EWM-1506
  @What: This function is used for checking duplicacy for code
  */

  onCodeChanges() {
    let alreadyExistCheckObj = {};
    let industryId;
    if (this.tempID != undefined) {
      industryId = this.tempID;
    } else {
      industryId = '';
    }
    alreadyExistCheckObj['Id'] = parseInt(industryId);
    alreadyExistCheckObj['FieldName'] = 'code';
    alreadyExistCheckObj['FieldValue'] = this.addForm.get("code").value;
    alreadyExistCheckObj['IndustryId'] = this.industryId;
    if (this.addForm.get("code").value) {
      this.industryService.checkSubIndustryIsExist(alreadyExistCheckObj).subscribe(
        repsonsedata => {
          if (repsonsedata['HttpStatusCode'] == 200) {
            if (repsonsedata['Data'] == true) {
              this.addForm.get("code").setErrors({ codeTaken: true });
              this.addForm.get("code").markAsDirty();

            } else if (repsonsedata['Data'] == false) {
              this.addForm.get("code").clearValidators();
              this.addForm.get("code").markAsPristine();
              this.addForm.get('code').setValidators([Validators.required, Validators.pattern(this.codePattern)]);

            }
          }
          else if (repsonsedata['HttpStatusCode'] == 400) {
            this.addForm.get("code").clearValidators();
            this.addForm.get("code").markAsPristine();
            this.addForm.get('code').setValidators([Validators.required, Validators.pattern(this.codePattern)]);

          }

          else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
            this.loading = false;
          }
        },
        err => {
          if (err.StatusCode == undefined) {
            this.loading = false;
          }
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          this.loading = false;
        });
    }
    else {
      this.addForm.get('code').setValidators([Validators.required, Validators.pattern(this.codePattern)]);

    }
    this.addForm.get('code').updateValueAndValidity();
  }


  setDefaultSignature(e) {
    if (e.checked === false) {
      this.isHideExternally = 0;
    } else {
      this.isHideExternally = 1;
    }

  }

  setDefaultBuilInSignature(e) {
    if (e.checked === false) {
      this.isBuiltIn = 0;
    } else {
      this.isBuiltIn = 1;
    }
  }


  /*
  @Type: File, <ts>
  @Name: onCodeChanges function
  @Who:  Suika
  @When: 13-May-2021
  @Why: EWM-1506
  @What: This function is used for checking duplicacy for code
  */

  onDescriptionChanges() {
    let alreadyExistCheckObj = {};
    let industryId;
    if (this.tempID != undefined) {
      industryId = this.tempID;
    } else {
      industryId = '';
    }
    alreadyExistCheckObj['Id'] = parseInt(industryId);
    alreadyExistCheckObj['FieldName'] = 'Description';
    alreadyExistCheckObj['FieldValue'] = this.addForm.get("description").value;
    alreadyExistCheckObj['IndustryId'] = this.industryId;
    if (this.addForm.get("description").value) {
      this.industryService.checkSubIndustryIsExist(alreadyExistCheckObj).subscribe(
        repsonsedata => {
          if (repsonsedata['HttpStatusCode'] == 200) {
            if (repsonsedata['Data'] == true) {
              this.addForm.get("description").setErrors({ descriptionTaken: true });
              this.addForm.get("description").markAsDirty();

            } else if (repsonsedata['Data'] == false) {
              this.addForm.get("description").clearValidators();
              this.addForm.get("description").markAsPristine();
              this.addForm.get('description').setValidators([Validators.required, Validators.maxLength(100)]);

            }
          }

          else if (repsonsedata['HttpStatusCode'] == 400) {
            this.addForm.get("description").clearValidators();
            this.addForm.get("description").markAsPristine();
            this.addForm.get('description').setValidators([Validators.required, Validators.maxLength(100)]);

          }

          else {
            this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
            this.loading = false;
          }
        },
        err => {
          if (err.StatusCode == undefined) {
            this.loading = false;
          }
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          this.loading = false;
        });
    }
    else {
      this.addForm.get('description').setValidators([Validators.required, Validators.maxLength(100)]);

    }
    this.addForm.get('description').updateValueAndValidity();
  }




  /*
    @Type: File, <ts>
    @Name: getStatusList function
    @Who:  Suika
    @When: 20-May-2021
    @Why: ROST-1452
    @What: For status listing
   */
  getStatusList() {
    this.commonserviceService.getStatusList().subscribe(
      (repsonsedata: Industry) => {
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



}

