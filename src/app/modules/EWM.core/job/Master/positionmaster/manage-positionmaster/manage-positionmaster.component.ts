import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { customDropdownConfig } from 'src/app/modules/EWM.core/shared/datamodels';
import { PositionService } from 'src/app/modules/EWM.core/shared/services/position.service';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { ResponceData } from 'src/app/shared/models';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { ServiceListClass } from 'src/app/shared/services/sevicelist';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';

@Component({
  selector: 'app-manage-positionmaster',
  templateUrl: './manage-positionmaster.component.html',
  styleUrls: ['./manage-positionmaster.component.scss']
})
export class ManagePositionmasterComponent implements OnInit {

  addForm: FormGroup;
  submitted = false;
  InputValue: any;
  public loading: boolean = false;
  public actionStatus: string = 'Add';
  public codePattern = '^[A-Z]{5,20}$';
  public isHideExternally: number = 0;
  tempID: string;
  public statusList: any = [];
  public industryId;
  viewModeValue: any;
  public oldPatchValues: any = {};

  industryList: any;
  visible = true;
  selectable = true;
  removable = true;
  addOnBlur = true;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  positionList: any[] = [];

  public dropDownIndustryConfig: customDropdownConfig[] = [];
  public selectedIndustry: any = {};
  public Industries: any[] = [];
  public isBulkEdit:boolean=false;
  public selectedIndustryBulkEdit:string;
  public dropDownBulkEditIndustryConfig: customDropdownConfig[] = [];
  public isShow:boolean=true;
  isPositionduplicateValidation: boolean = true;
  ErrorField: any = [];
  constructor(private fb: FormBuilder, private router: Router, private route: ActivatedRoute,
    public _positionServices: PositionService, private snackBService: SnackBarService,public dialog: MatDialog,
    private commonserviceService: CommonserviceService, public _sidebarService: SidebarService, private serviceListClass: ServiceListClass,
    private translateService: TranslateService) {
    this.addForm = this.fb.group({
      Id: [''],
      PositionName: ['', Validators.required],
      PositionIndustries: ['', Validators.required],
      status: [null],
      StatusName: [[], Validators.required], 
      HideExternally: [false]
    });


    ////// Industry//////////////
    this.dropDownIndustryConfig['IsDisabled'] = false;
    this.dropDownIndustryConfig['apiEndPoint'] = this.serviceListClass.getIndustryAll;
    this.dropDownIndustryConfig['placeholder'] = 'quickjob_industry';
    this.dropDownIndustryConfig['IsManage'] = '/client/core/administrators/industry-master';
    this.dropDownIndustryConfig['IsRequired'] = true;
    this.dropDownIndustryConfig['searchEnable'] = true;
    this.dropDownIndustryConfig['bindLabel'] = 'Description';
    this.dropDownIndustryConfig['multiple'] = true;
    ////// Industry in bulk//////////////
    this.dropDownBulkEditIndustryConfig['IsDisabled'] = false;
    this.dropDownBulkEditIndustryConfig['apiEndPoint'] = this.serviceListClass.getIndustryAll;
    this.dropDownBulkEditIndustryConfig['placeholder'] = 'quickjob_industry';
    this.dropDownBulkEditIndustryConfig['IsRequired'] = true;
    this.dropDownBulkEditIndustryConfig['searchEnable'] = true;
    this.dropDownBulkEditIndustryConfig['bindLabel'] = 'Description';
    this.dropDownBulkEditIndustryConfig['multiple'] = false;
  }


  ngOnInit(): void {
    let URL = this.router.url;
    let URL_AS_LIST;
    if (URL.substring(0, URL.indexOf("?")) == '') {
      URL_AS_LIST = URL.split('/');
    } else {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this._sidebarService.activesubMenuObs.next('masterdata');
    this.getIndustryList();
    this.getStatusList();
    this.route.params.subscribe(
      params => {
        if (params['id'] != undefined) {
          this.actionStatus = 'Edit'
          this.tempID = params['id'];
          this.editForm(this.tempID);
        } 
        this.viewModeValue = params['viewModeData'];
      });

    this.route.queryParams.subscribe((params) => {
      this.viewModeValue = params['viewModeData'];
       if (params['Edit'] != undefined) {
        this.isBulkEdit=true;
        this.actionStatus = 'Edit';
        this.isShow=false;
      }
    })

    //<!-----@suika@EWM-10681 EWM-10818  @03-03-2023 to set default values for status in master data---->
    let status = {StatusId:1,StatusName:'Active'}
    this.onchangeStatus(status)
  
  }


  editForm(Id: String) {
   // alert('dfdfd');
    if(this.actionStatus=='Add' && this.isBulkEdit==false)
    {
      return;
    }
    this.loading = true;
    this.isBulkEdit=false;
    this.actionStatus = 'Edit';
    this._positionServices.getpositionbyid( Id).subscribe(
      (data: ResponceData) => {
        this.loading = false;
        if (data['HttpStatusCode'] == 200) {
          this.oldPatchValues = data.Data;
         // console.log("data?.Data?.Industry ",data?.Data?.Industry);
         this.selectedIndustry = data?.Data?.Industry;
          //this.selectedIndustry=this.industryList.filter(x => this.Industries.map(y => y.Id).includes(x.Id));
         this.Industries = data?.Data?.Industry;
        //  this.Industries=[];
        //  this.Industries = data?.Data?.Industry;
        //  this.selectedIndustry=this.industryList.filter(x => this.Industries.map(y => y.Id).includes(x.Id));
          this.addForm.patchValue({
            Id: Id,
            PositionName: data?.Data?.Position?.PositionName,
            status: data?.Data?.Position?.Status,
            StatusName: data?.Data?.Position?.StatusName,
           PositionIndustries:data?.Data?.Industry
            // PositionIndustries:this.selectedIndustry
          });
          if (data?.Data?.Position?.HideExternally == 1) {
            this.addForm.patchValue({
              HideExternally: true
            })
          } else {
            this.addForm.patchValue({
              HideExternally: false
            })
          }

        
          this.isHideExternally = data?.Data?.Position?.HideExternally;
          this.addForm.get('PositionName').setValidators([Validators.required,this.noWhitespaceValidator()]);

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
    if (actionStatus == 'Add' && !this.isBulkEdit) {
      this.createPosition(value);
    } else  if (actionStatus == 'Add' && this.isBulkEdit) {
      this.bulkUpdatePosition(value);
    } else {      
      //this.updatePosition(value);
      this.onNameChanges();
    }


  }
  bulkUpdatePosition(value: any) { 
    this.loading = true;
    let Obj = {}
    Obj['Id'] = value.Id;
    Obj['Position'] = value.PositionName;
    

    Obj['Status'] = value.status;
    Obj['StatusName'] = value.StatusName;
    
    Obj['HideExternally'] = this.isHideExternally;
    this._positionServices.bulkUpdatePostion(Obj).subscribe(repsonsedata => {
      if (repsonsedata['HttpStatusCode'] == 200) {
        this.loading = false;
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);

        let viewModeData: any = this.viewModeValue;
        this.router.navigate(['./client/core/administrators/position'],
        {queryParams: { viewModeData }});

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



  updatePosition(value) {
    this.loading = true;
    let fromObj = {};
    fromObj = this.oldPatchValues;

    let Obj = {}
    Obj['Id'] = value.Id;
    Obj['PositionName'] = value.PositionName
    Obj['Status'] = value.status;
    Obj['StatusName'] = value.StatusName
    Obj['HideExternally'] = this.isHideExternally;
   
    let JsonObj = {};
    JsonObj['Position'] = Obj;
    JsonObj['Industry'] = this.Industries;

    let addObj = {};

    addObj = [{
      "From": fromObj,
      "To": JsonObj
    }];
    this._positionServices.updatePostion(addObj[0]).subscribe(repsonsedata => {
      if (repsonsedata['HttpStatusCode'] == 200) {
        this.loading = false;
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);

        let viewModeData: any = this.viewModeValue;
        this.router.navigate(['./client/core/administrators/position'],
        {queryParams: { viewModeData }});

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
    this.router.navigate(['./client/core/administrators/position'], {
      queryParams: { viewModeData }
     })
   // this.router.navigate(['./client/core/administrators/position']);

  }


  onNameChanges() {
    let Id;
    if (this.tempID != undefined) {
      Id = this.tempID;
    } else {
      Id = "00000000-0000-0000-0000-000000000000";
    }    
    
    let IndustryId = this.addForm.get("PositionIndustries").value;
    let PositionName = this.addForm.get("PositionName").value;    
    let duplicacyObj = [
      {
        //"PositionId": Id,
        "Industries": IndustryId,
        "PositionName": [{"Id":Id,"PositionName":PositionName}],
      }
    ];
    if (this.addForm.get("PositionName").value) {
      this._positionServices.checkPostionName(duplicacyObj[0]).subscribe(
        repsonsedata => {
          if (repsonsedata['HttpStatusCode'] == 402) {
            if (repsonsedata['Data'] == false) {
              this.addForm.get("PositionName").setErrors({ nameTaken: true });
              this.addForm.get("PositionName").markAsDirty();
            }
          } else if (repsonsedata['HttpStatusCode'] == 204) {
            if (repsonsedata['Data'] == true) {
              this.addForm.get("PositionName").clearValidators();
              this.addForm.get("PositionName").markAsPristine();
              this.addForm.get('PositionName').setValidators([Validators.required,this.noWhitespaceValidator()]);
              if(this.submitted && !this.addForm.invalid){
                this.updatePosition(this.addForm.value);
              }              
            }
          }
          else if (repsonsedata['HttpStatusCode'] == 400) {
            this.addForm.get("PositionName").clearValidators();
            this.addForm.get("PositionName").markAsPristine();
            this.addForm.get('PositionName').setValidators([Validators.required,this.noWhitespaceValidator()]);

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
      this.addForm.get('PositionName').setValidators([Validators.required,this.noWhitespaceValidator()]);

    }
    this.addForm.get('PositionName').updateValueAndValidity();
  }

  getStatusList() {
    this.commonserviceService.getStatusList().subscribe(
      (repsonsedata: ResponceData) => {
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


 
  isPositionValidation: boolean = true;
  isPositionMin: boolean = false;
  isPositionMax: boolean = false;
  add(event: MatChipInputEvent): void {
    const value = event.value;
    const input = event.input;       
    if (value.trim() != null && value.trim() != undefined && value.trim() != '') {
        // Add our Position
        if ((value || '').trim()) {
          if (this.positionList.some(el => el.PositionName == value.trim())) {         
          } else {
           // console.log('value.trim()',value.trim());
            this.positionList.push({ PositionName: value.trim()});
            this.addForm.patchValue({
              PositionName:value.trim()
            });
            this.duplicacyCheckInChip(this.positionList);            
          }
        }
    }else if (this.positionList == undefined || this.positionList == null || this.positionList.length == 0) {
       // this.isPositionValidation = false;
        this.addForm.get("PositionName").clearValidators();
        this.addForm.get("PositionName").setErrors({ required: true });
        this.addForm.get("PositionName").markAsDirty();
      
    }

  


    //Reset the input value
    if (input) {
      input.value = '';
    }

  }

 
  duplicacyCheckInChip(data) {
   // console.log("data ",data);
    if (data) {
      let Id;
      if (this.tempID != undefined) {
        Id = this.tempID;
      } else {
        Id = "00000000-0000-0000-0000-000000000000";
      } 
      let duplicacyObj = [
        {
          "PositionId": Id,
          "Industries": this.Industries,
          "PositionName": data,
        }
      ];
      this._positionServices.checkPostionName(duplicacyObj[0]).subscribe(
        repsonsedata => {
          if (repsonsedata['HttpStatusCode'] == 402) {
            if (repsonsedata['Data'] == false) {
              this.isPositionduplicateValidation = false;
              this.ErrorField = repsonsedata.ErrorFields;
            }
          } else if (repsonsedata['HttpStatusCode'] == 204) {
            if (repsonsedata['Data'] == true) {
              this.isPositionValidation = true;
              this.isPositionduplicateValidation = true;

            }
          }
          else if (repsonsedata['HttpStatusCode'] == 400) {
            this.isPositionduplicateValidation = true;
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
      this.addForm.get('PositionName').setValidators([Validators.required, Validators.maxLength(100),this.noWhitespaceValidator()]);

    }
     this.addForm.get('PositionName').updateValueAndValidity();
  }



  remove(position: any): void {
    const index = this.positionList.indexOf(position);

    if (index >= 0) {
      this.positionList.splice(index, 1);
    }
    // for validation
    if (this.positionList == undefined || this.positionList == null || this.positionList.length == 0) {
     // alert('hrlo');
     // this.isPositionValidation = false;
      this.isPositionduplicateValidation = true;
      this.addForm.get("PositionName").clearValidators();
      this.addForm.get("PositionName").setErrors({ required: true });
      this.addForm.get("PositionName").markAsDirty();
    } else {
      this.isPositionValidation = true;
      this.isPositionduplicateValidation = false;
      this.duplicacyCheckInChip(this.positionList);
    }
  }


  /////industry
 
  onIndustrychange(data) {
    if (data == null || data == "" || data.length == 0) {
      this.addForm.get('PositionIndustries').setValidators([Validators.required]);
      this.selectedIndustry = null;
      this.addForm.patchValue(
        {
          PositionIndustries: null,
        })
      this.addForm.get("PositionIndustries").markAsTouched();
      this.addForm.get("PositionIndustries").markAsDirty();
    }
    else {
      this.addForm.get("PositionIndustries").clearValidators();
      this.addForm.get("PositionIndustries").markAsPristine();
      this.selectedIndustry = data;
      this.Industries = [];
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        this.Industries.push({ Id: element.Id, Description: element.Description })
       
      }

      this.addForm.patchValue(
        {
          PositionIndustries: this.Industries,
        });

    }
  }
  // onIndustrychange(data) {
  //   if (data == null || data == "" || data.length == 0) {
  //     this.selectedIndustry = null;
  //     this.addForm.patchValue(
  //       {
  //         PositionIndustries: null,
  //       })
  //     this.addForm.get('PositionIndustries').setValidators([Validators.required]);
  //     this.addForm.get("PositionIndustries").markAsTouched();
  //     this.addForm.get("PositionIndustries").markAsDirty();
  //   }
  //   else {
  //     this.addForm.get("PositionIndustries").clearValidators();
  //     this.addForm.get("PositionIndustries").markAsPristine();
  //     this.selectedIndustry = data;
  //     this.Industries = [];
  //     for (let index = 0; index < data.length; index++) {
  //       const element = data[index];
  //       this.Industries.push({ Id: element.Id, Description: element.Description })
  //     }

  //     this.addForm.patchValue(
  //       {
  //         PositionIndustries: this.selectedIndustry,
  //       })
  //   }
  // }

  onBulkEditIndustrychange(industrydata)
  {
   // alert('dddsds');
    this.Industries.push({ Id: industrydata.Id, Description: industrydata.Description });
    this.addForm.patchValue(
      {
        PositionIndustries: this.Industries,
      });
      let count;
     this._positionServices.getpositionCount( industrydata.Id).subscribe(
       (data: ResponceData) => {
         this.loading = false;
         if (data['HttpStatusCode'] == 200) {
           count=data.Data.Count;
           const prefixmsg = count;
           const prefixsubtittle = industrydata.Description;
           const message = `label_positionPop`;
           const subtitle = 'label_positionPopedited';
           const title = '';
           const dialogData = new ConfirmDialogModel(title, subtitle, message,prefixmsg,prefixsubtittle);
           const dialogRef = this.dialog.open(ConfirmDialogComponent, {
             maxWidth: "350px",
             data: dialogData,
             panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
             disableClose: true,
           });
           dialogRef.afterClosed().subscribe(dialogResult => {
             if (dialogResult == true) {
               this._positionServices.getpositionbyIndustry( industrydata.Id).subscribe(
               (chdata: ResponceData) => {
                 this.loading = false;
                 if (chdata['HttpStatusCode'] == 200) {
                   this.positionList=chdata.Data;
                   //console.log("this.positionList ",this.positionList);
                   this.addForm.patchValue({
                     PositionName: this.positionList,
                     StatusName: 'Active',
                     status:1
                   });
                  this.actionStatus='Add';
                  this.isShow=true;
                 } else if (chdata['HttpStatusCode'] == 400) {
                   this.loading = false;
                   this.snackBService.showErrorSnackBar(this.translateService.instant(chdata.Message), data.HttpStatusCode.toString());
           
                 } else {
                   this.loading = false;
                   this.snackBService.showErrorSnackBar(this.translateService.instant(chdata.Message), data.HttpStatusCode.toString());
           
                 }
               },
               err => {
                 this.loading = false;
                 this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
           
               });
             }
             else{
              this.actionStatus='Edit';
              this.isShow=false;
              this.addForm.patchValue({
                PositionName:'',
                StatusName: '',
                status:null
              });
             }
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
   
       });
   
     
  }
  
  // onBulkEditIndustrychange(industrydata)
  // {
  //  if(industrydata!=null){
  //   this.Industries.push({ Id: industrydata.Id, Name: industrydata.Description });
  //   this.addForm.patchValue(
  //     {
  //       PositionIndustries: this.Industries,
  //     });
  //     let count;
  //    this._positionServices.getpositionCount( industrydata.Id).subscribe(
  //      (data: ResponceData) => {
  //        this.loading = false;
  //        if (data['HttpStatusCode'] == 200) {
  //          count=data.Data.Count;
  //          const prefixmsg = count;
  //          const prefixsubtittle = industrydata.Description;
  //          const message = `label_positionPop`;
  //          const subtitle = 'label_positionPopedited';
  //          const title = '';
  //          const dialogData = new ConfirmDialogModel(title, subtitle, message,prefixmsg,prefixsubtittle);
  //          const dialogRef = this.dialog.open(ConfirmDialogComponent, {
  //            maxWidth: "350px",
  //            data: dialogData,
  //            panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
  //            disableClose: true,
  //          });
  //          dialogRef.afterClosed().subscribe(dialogResult => {
  //            if (dialogResult == true) {
  //              this._positionServices.getpositionbyIndustry( industrydata.Id).subscribe(
  //              (chdata: ResponceData) => {
  //                this.loading = false;
  //                if (chdata['HttpStatusCode'] == 200) {
  //                  this.positionList=chdata.Data;
  //                  this.addForm.patchValue({
  //                    PositionName: this.positionList,
  //                    StatusName: 'Active',
  //                    status:1
  //                  });
  //                 this.actionStatus='Add';
  //                 this.isShow=true;
  //                } else if (chdata['HttpStatusCode'] == 400) {
  //                  this.loading = false;
  //                  this.snackBService.showErrorSnackBar(this.translateService.instant(chdata.Message), data.HttpStatusCode.toString());
           
  //                } else {
  //                  this.loading = false;
  //                  this.snackBService.showErrorSnackBar(this.translateService.instant(chdata.Message), data.HttpStatusCode.toString());
           
  //                }
  //              },
  //              err => {
  //                this.loading = false;
  //                this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
           
  //              });
  //            }
  //            else{
  //             this.actionStatus='Edit';
  //             this.isShow=false;
  //             this.addForm.patchValue({
  //               PositionName:'',
  //               StatusName: '',
  //               status:null
  //             });
  //            }
  //          });
  //        } else if (data['HttpStatusCode'] == 400) {
  //          this.loading = false;
  //          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
   
  //        } else {
  //          this.loading = false;
  //          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
   
  //        }
  //      },
  //      err => {
  //        this.loading = false;
  //        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
   
  //      });
  //     }
  // }
  onchangeStatus(value) {
    this.addForm.patchValue(
      {
        status: value.StatusId,
        StatusName: value.StatusName,
      }
    )
    }
  setDefaultSignature(e) {
    if (e.checked === false) {
      this.isHideExternally = 0;
    } else {
      this.isHideExternally = 1;
    }

  }


  createPosition(value) {
    this.loading = true;
//console.log(this.positionList," positionList");
    let JsonObj = {}
    JsonObj['Position'] = this.positionList;
  
    JsonObj['PositionIndustries'] = this.Industries;
    JsonObj['Status'] = value.status;
    JsonObj['StatusName'] = value.StatusName;
   
    JsonObj['HideExternally'] = this.isHideExternally;
    this._positionServices.createPostion(JsonObj).subscribe(repsonsedata => {
      if (repsonsedata['HttpStatusCode'] == 200) {
        this.loading = false;
        this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        let viewModeData: any = this.viewModeValue;
         this.router.navigate(['./client/core/administrators/position'], {
           queryParams: { viewModeData }
         })
        //this.router.navigate(['./client/core/administrators/skills']);

      } else if (repsonsedata['HttpStatusCode'] == 400) {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
        this.loading = false;
      }else if (repsonsedata['HttpStatusCode'] == 412) {
        this.isPositionduplicateValidation = false;
        this.ErrorField = repsonsedata.ErrorFields;
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


  getIndustryList() {
    this.commonserviceService.getIndustryActiveList().subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.industryList = repsonsedata.Data;
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
   @Name: noWhitespaceValidator function
   @Who: maneesh
   @When: 29-dec-2022
   @Why: EWM-10076
   @What: Remove whitespace
*/
public isBlank:boolean=false
noWhitespaceValidator(): ValidatorFn {  
  return (control: AbstractControl): ValidationErrors | null => {
    const isWhitespace = (control.value as string || '')?.trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
   
  };
}

}
