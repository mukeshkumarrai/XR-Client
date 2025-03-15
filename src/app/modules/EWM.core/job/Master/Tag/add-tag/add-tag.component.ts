/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Anup Singh
 @When: 21-May-2021
  @Why: EWM-1445 EWM-1596
  @What:  This page will be use for the add Tag Component ts file
*/
import { Component, ElementRef, EventEmitter, OnInit, Output, ViewChild, AfterViewInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataBindingDirective, DataStateChangeEvent, GridComponent, GridDataResult } from '@progress/kendo-angular-grid';
import { MessageService } from '@progress/kendo-angular-l10n';
import { Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SystemSettingService } from '../../../../shared/services/system-setting/system-setting.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ValidateCode } from 'src/app/shared/helper/commonserverside';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { RtlLtrService } from 'src/app/shared/services/language-service/rtl-ltr.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { CommonServiesService } from 'src/app/shared/services/common-servies.service';
import { AppSettingsService } from '../../../../../../shared/services/app-settings.service';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ResponceData } from 'src/app/shared/models/responce.model';
import { statusMaster } from 'src/app/modules/EWM.core/shared/datamodels/status-master';

@Component({
  providers: [MessageService],
  selector: 'app-add-tag',
  templateUrl: './add-tag.component.html',
  styleUrls: ['./add-tag.component.scss']
})
export class AddTagComponent implements OnInit {
  /****************Decalaration of Global Variables*************************/
  // status: boolean = false;
  submitted = false;
  loading: boolean;
  public loadingPopup: boolean;
  @ViewChild('revAdd') revAdd: ElementRef;
  @ViewChild('revAdd1') revAdd1: ElementRef;
  @ViewChild('search') search: ElementRef;
  public categoryList: any[];
  public formtitle: string = 'grid';
  addTagForm: FormGroup;
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  viewMode: string = "listMode";
  public specialcharPattern = "^[A-Za-z0-9 ]+$";
  @Input() name: string;
  canLoad = false;
  pendingLoad = false;
  pagesize;
  loadingscroll: boolean;
  public ascIcon: string;
  private _toolButtons$ = new BehaviorSubject<any[]>([]);
  public toolButtons$: Observable<any> = this._toolButtons$.asObservable();
  totalDataCount: any;
  public auditParameter;
  public idSms = '';

  public disable: boolean = false;
  activestatus: string;
  statusList: [] = []
  viewModeValue: any;
  public primaryBgColor: string;
  public defaultColorValue = "#ffffff";
// color picker varibale 
showColorPallateContainer = false;
color: any = '#2883e9'
selctedColor = '#FFFFFF';
themeColors:[] = [];
standardColor: [] = [];
overlayViewjob = false;
isOpen = false;
isMoreColorClicked!: boolean;
// color picker End  


  /*
  @Type: File, <ts>
  @Name: constructor function
  @Who: Anup Singh
  @When: 21-May-2021
  @Why: EWM-1445 EWM-1597
  @What: constructor for injecting services and formbuilder and other dependency injections
  */
  constructor(private fb: FormBuilder, private commonServiesService: CommonServiesService, private systemSettingService: SystemSettingService, private snackBService: SnackBarService,
    private validateCode: ValidateCode, public _sidebarService: SidebarService, private route: Router,
    private commonserviceService: CommonserviceService, private rtlLtrService: RtlLtrService,
    private messages: MessageService, public dialog: MatDialog, private appSettingsService: AppSettingsService,
    private translateService: TranslateService, private routes: ActivatedRoute,) {
    this.pagesize = this.appSettingsService.pagesize;

    this.addTagForm = this.fb.group({
      Id: [''],
      Name: ['', [Validators.required, Validators.maxLength(50), Validators.minLength(2),this.noWhitespaceValidator()]],
      ColorCode: [],
      Status: [1, [Validators.required]] //   <!-----@suika@EWM-10681 EWM-10818  @03-03-2023 to set default values for status in master data--->
    });

   // this.primaryBgColor = localStorage.getItem('HeaderBackground');

  }
  /*
 @Type: File, <ts>
 @Name: ngOnInit function
 @Who: Anup Singh
 @When: 21-May-2021
 @Why: EWM-1445 EWM-1597
 @What: For calling
 */
  ngOnInit(): void {
    this.getColorCodeAll();
    this.getAllStatus();

    let URL = this.route.url;
    //  let URL_AS_LIST = URL.split('/');
    let URL_AS_LIST;
    if (URL.substring(0, URL.indexOf("?")) == '') {
      URL_AS_LIST = URL.split('/');
    } else {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this._sidebarService.activesubMenuObs.next('masterdata');
    this.commonserviceService.onOrgSelectId.subscribe(value => {
      if (value !== null) {
         this.reloadApiBasedOnorg();
      }
    })

    if (this.routes.snapshot.params.id != null) {
      this.editForm();
      this.disable = true;
      this.activestatus = "Edit";
    } else {
      this.activestatus = "Add";
    }

    ///////geting Data Via Routing from user contact type component///////
    this.routes.queryParams.subscribe((params) => {
      this.viewModeValue = params['ViewModeDataValue'];
    })
    ////////

  }



  // ngAfterViewInit(): void {
  //   this.commonserviceService.onUserLanguageDirections.subscribe(res => {
  //     this.rtlLtrService.gridLtrToRtl(this.revAdd, this.revAdd1, this.search, res);
  //   })
  // }


  /*
  @Type: File, <ts>
  @Name: onCancel() function
  @Who: Anup Singh
  @When: 21-May-2021
  @Why: EWM-1445 EWM-1597
  @What: For Navigate list component and also sending data via routing
 */
  onCancel() {
    ////////For Sending Data Of view mode by routing and also doing routing/////////
    let viewModeData: any = this.viewModeValue;
   /* this.route.navigate(['/client/core/administrators/tag'], {
      queryParams: { viewModeData }
    })*/
    this.route.navigate(['/client/core/administrators/tag']);
    //////////////
  }

  /*
   @Type: File, <ts>
   @Name: getAllStatus function
   @Who: Anup Singh
   @When: 21-May-2021
   @Why: EWM-1445 EWM-1597
   @What: For All status List
   */

  getAllStatus() {
    this.loading = true;
    this.systemSettingService.getAllUserTypeStatus().subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.loading = false;
          this.statusList = repsonsedata['Data'];
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
     @Name: onSave function
     @Who: Anup Singh
    @When: 21-May-2021
    @Why: EWM-1445 EWM-1597
     @What:This function is used for update and save record into database
    */
  onSave(value) {
    this.submitted = true;
    if (this.addTagForm.invalid) {
      return;
    }
    this.onTagNameChanges();

  }

  /*
   @Type: File, <ts>
   @Name: onTagNameChanges Function
   @Who: Anup Singh
   @When: 21-May-2021
   @Why: EWM-1445 EWM-1597
   @What:  For check duplicate value
  */
  public onTagNameChanges() {
    this.loading = false;
    let contactTypeID = this.addTagForm.get("Id").value;
    if (contactTypeID == null) {
      contactTypeID = 0;
    }
    if (contactTypeID == '') {
      contactTypeID = 0;
    }
    this.systemSettingService.checkdTagNameDuplicay('?JobTagName=' + this.addTagForm.get("Name").value + '&Id=' + contactTypeID).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode == 200) {
          if (data.Data == true) {
            this.addTagForm.get("Name").setErrors({ codeTaken: true });
            this.addTagForm.get("Name").markAsDirty();
            this.loading = false;
            this.submitted = false;
          }
        }
        else if (data.HttpStatusCode == 400) {
          if (data.Data == false) {
            this.loading = false;
            //this.addTagForm.get("Name").clearValidators();
            this.addTagForm.get("Name").markAsPristine();
            if (this.addTagForm && this.submitted == true) {
              if (this.routes.snapshot.params.id == null) {
                this.addTagListForm(this.addTagForm.value);
              } else {
                this.editTagListForm(this.addTagForm.value);
              }
            }

          }
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
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



  /*
      @Type: File, <ts>
      @Name: editForm function
      @Who: Anup Singh
      @When: 21-May-2021
      @Why: EWM-1445 EWM-1597
      @Why: use for set value in patch file for showing information.
      @What: .
     */
  editForm() {
    this.loading = true;
    this.systemSettingService.getTagListByID('?id=' + this.routes.snapshot.params.id).subscribe(
      (data: ResponceData) => {
        this.loading = false;
        //this.actionStatus='update';
        if (data.HttpStatusCode == 200) {
          this.addTagForm.patchValue({
            Id: data.Data.Id,
            Name: data.Data.Name,
            Status: data.Data.Status,
            ColorCode: (data.Data.ColorCode == null) ? '#ffffff' : data.Data.ColorCode,

          });
          // who:maneesh,what:ewm-11117 for color picker value change variabel name this.defaultColorValue into  this.selctedColor  when:11/03/2023
          this.selctedColor = (data.Data.ColorCode == null) ? '#ffffff' : data.Data.ColorCode



        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.loading = false;
        }
      },
      err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      })

  }


  /*
      @Type: File, <ts>
      @Name: addTagListForm
     @Who: Anup Singh
     @When: 21-May-2021
     @Why: EWM-1445 EWM-1597
      @What:  For submit the form data
    */
  addTagListForm(value) {
    this.loading = true;
    const formData = new FormData();
    let obj = {};
    obj['Name'] = value.Name;
    obj['Status'] = value.Status;
    // who:maneesh,what:ewm-11117 for color picker value change variabel name this.defaultColorValue into  this.selctedColor  when:11/03/2023
    obj['ColorCode'] =  this.selctedColor;

    var removeJsonId = value;
    delete removeJsonId.Id;
    this.systemSettingService.createTagList(obj).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode = 200) {
          this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          // this.addTagForm.reset();

          ////////For Sending Data Of view mode by routing and also doing routing/////////
          let viewModeData: any = this.viewModeValue;
         /* this.route.navigate(['/client/core/administrators/tag'], {
            queryParams: { viewModeData }
          })*/
          this.route.navigate(['/client/core/administrators/tag']);
          //////////////

          this.loading = false;
          this.formtitle = 'grid';
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.loading = false;
        }
        this.cancel.emit();
      }, err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      })
  }

  /*
   @Type: File, <ts>
   @Name: editTagListForm function
   @Who: Anup Singh
   @When: 21-May-2021
   @Why: EWM-1445 EWM-1597
   @What: use for Edit user Tag List data.

     */
  editTagListForm(value) {
    this.loading = true;
    let obj = {};
    obj['Name'] = value.Name;
    obj['Status'] = value.Status;
          // who:maneesh,what:ewm-11117 for color picker value change variabel name this.defaultColorValue into  this.selctedColor  when:11/03/2023
    obj['ColorCode'] = this.selctedColor;
    obj['Id'] = value.Id;

    this.systemSettingService.updateTagListById(obj).subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode = 200) {
          this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          // this.addTagForm.reset();

          ////////For Sending Data Of view mode by routing and also doing routing/////////
          // let viewModeData: any = this.viewModeValue;
          // this.route.navigate(['/client/core/administrators/tag'], {
          //   queryParams: { viewModeData }
          // })
          let viewModeData: any = this.viewModeValue;
         /* this.route.navigate(['/client/core/administrators/tag'], {
            queryParams: { viewModeData }
          })*/
          this.route.navigate(['/client/core/administrators/tag']);
          //////////////

          this.loading = false;
          this.formtitle = 'grid';
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          this.loading = false;
        }
        this.cancel.emit();
      }, err => {
        if (err.StatusCode == undefined) {
          this.loading = false;
        }
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      })
  }



  /*
  @Type: File, <ts>
  @Name: reloadApiBasedOnorg function
  @Who: Anup Singh
  @When: 21-May-2021
  @Why: EWM-1445 EWM-1597
  @What: Reload Api's when user change organization
*/

  reloadApiBasedOnorg() {
   // this.routes.snapshot.params.id =null;
    this.route.navigate(['/client/core/administrators/tag/add-tag']);
  }

  /* 
   @Type: File, <ts>
   @Name: onChange function
   @Who: Adarsh Singh
   @When: 06-07-2022
   @Why: EWM-7363 EWM-7607
   @What: For change color on chnage while select color
*/
public onChange(getColor: string): void {
  const color = getColor;
  const rgba = color.replace(/^rgba?\(|\s+|\)$/g, '').split(',');
  const hex = `#${((1 << 24) + (parseInt(rgba[0]) << 16) + (parseInt(rgba[1]) << 8) + parseInt(rgba[2])).toString(16).slice(1)}`;
  this.defaultColorValue = hex;
}
/*
   @Type: File, <ts>
   @Name: noWhitespaceValidator function
   @Who: maneesh
   @When: 22-dec-2022
   @Why: EWM-9964
   @What: Remove whitespace 
*/
noWhitespaceValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const isWhitespace = (control.value || '').trim().length === 0;
    return isWhitespace ? { whitespace: true } : null;
  };
}
// color picker start 
/*
  @Type: File, <ts>
  @Name: showColorPallate funtion
  @Who: maneesh
  @When: 10-Mar-2023
  @Why: EWM-11117
  @What: for open color picker dropdown
*/
showColorPallate(e:any) {
  this.overlayViewjob=!this.overlayViewjob;
  this.showColorPallateContainer = !this.showColorPallateContainer;
}
/*
  @Type: File, <ts>
  @Name: onSelectColor funtion
  @Who: maneesh
  @When: 10-Mar-2023
  @Why: EWM-11117
  @What: for which coor we have choose
*/
onSelectColor(codes: any) {
  if(codes){
    this.selctedColor = codes.colorCode;
    this.addTagForm.patchValue({
      ColorCode: this.selctedColor
    })
  }else{
    this.addTagForm.patchValue({
      ColorCode: null
    })
    this.selctedColor = null;
  }
  
}
/*
  @Type: File, <ts>
  @Name: onChaneColor funtion
  @Who: maneesh
  @When: 10-Mar-2023
  @Why: EWM-11117
  @What: selecting color on change
*/
onChaneColor(e: any) {
  this.color = e.target.value;
  this.selctedColor = e.target.value;
  this.addTagForm.patchValue({
    ColorCode: this.selctedColor
  })
}
/*
  @Type: File, <ts>
  @Name: closeTemplate funtion
  @Who: maneesh
  @When: 10-Mar-2023
  @Why: EWM-11117
  @What: close dropdown while click on more label
*/
closeTemplate() {
  this.showColorPallateContainer = true;
  this.isMoreColorClicked = true;
  setTimeout(() => {
    this.isMoreColorClicked = false;
  }, 100);
}
/*
  @Type: File, <ts>
  @Name: getColorCodeAll funtion
  @Who: maneesh
  @When: 10-Mar-2023
  @Why: EWM-11117
  @What: get all custom color code from config file
*/
  getColorCodeAll() {
    this.loading = true;
    this.commonserviceService.getAllColorCode().subscribe((data: statusMaster) => {
      this.loading = false;
      this.themeColors = data[0]?.themeColors;
      this.standardColor = data[1]?.standardColors;
    },
      err => {
        this.loading = false;
      })
  }
// color picker End  

}
