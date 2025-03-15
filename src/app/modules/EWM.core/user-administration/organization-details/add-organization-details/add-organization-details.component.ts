
// last changes by Adarsh singh for split up in miltiple component 06 April 22 EWM1581-EWM 5862

import { Component, ElementRef, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Address } from 'ngx-google-places-autocomplete/objects/address';
import { ButtonTypes, ResponceData } from 'src/app/shared/models';
import { AgmMap, MapsAPILoader } from '@agm/core';
import { DataBindingDirective } from '@progress/kendo-angular-grid';
import { UserAdministrationService } from '../../../shared/services/user-administration/user-administration.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { RtlLtrService } from 'src/app/shared/services/language-service/rtl-ltr.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { MatDialog, MatDialogConfig, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ImageUploadService } from 'src/app/shared/services/image-upload/image-upload.service';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { ImageUploadPopupComponent } from '../../../shared/image-upload-popup/image-upload-popup.component';
import { AddressBarComponent } from 'src/app/shared/address-bar/address-bar.component';
import { AddemailComponent } from '../../../shared/quick-modal/addemail/addemail.component';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { AddphonesComponent } from '../../../shared/quick-modal/addphones/addphones.component';


@Component({
  selector: 'app-add-organization-details',
  templateUrl: './add-organization-details.component.html',
  styleUrls: ['./add-organization-details.component.scss']
})
export class AddOrganizationDetailsComponent implements OnInit {

  /*
  @Type: File, <ts>
  @Name: product-plan.component.html
  @Who: Renu
  @When: 20-Sep-2020
  @Why: ROST-307
  @What: decalration of global variables
   */
  @ViewChild(DataBindingDirective) dataBinding: DataBindingDirective;
  @ViewChild('gridAdd') gridAdd: ElementRef;
  @ViewChild('gridAdd1') gridAdd1: ElementRef;
  @ViewChild('search') search: ElementRef;
  public gridData: any[];
  public gridRegion: any[];
  public buttonCount = 5;
  public info = true;
  public type: 'numeric' | 'input' = 'numeric';
  public previousNext = true;
  public pageSize = 5;
  public gridView: any[];
  public mySelection: string[] = [];
  public active = false;
  public isNew = false;
  public editDataItem: String;
  @Output() cancel: EventEmitter<any> = new EventEmitter();
  organizationFrom: FormGroup;
  submitted = false;
  countryArray: any = [{ "id": 1, "name": "Europe" }, { "id": 2, "name": "Asia" }, { "id": 3, "name": "Americas" }, { "id": 4, "name": "Oceania" }];
  fileBinary: File;
  @ViewChild('fileInput') fileInput: ElementRef;
  myproductIcon = '';
  myfilename = '';
  selectedFiles = '';
  fileType;
  result: string = '';
  formtitle: string = 'grid';
  public loading: boolean;
  private rtl = false;
  private ltr = true;
  //public imageUrl=environment.imageUrl;
  public filePathOnServer: string;
  filePatImagePreview: string;
  organizationArray = {};
  viewMode: string = "listMode";
  //public activestatus: string;
  activestatus: string = 'Add';
  canLoad = false;
  pendingLoad = false;
  pagesize;
  pagneNo = 1;
  loadingscroll: boolean;
  public ascIcon: string;
  public descIcon: string;
  sortingValue: string = "OrganizationName,asc";
  public sortedcolumnName: string = "OrganizationName";
  public sortDirection = 'asc';
  isvisible: boolean;
  public maxCharacterLength = 80;
  public maxCharacterLengthName = 40;
  imagePreview: string;
  imagePreviewStatus: boolean = false;
  public imagePreviewloading: boolean = false;
  countryList = [];
  public searchValue: string = "";
  croppedImage: any;
  public maxCharacterLengthSubHead = 130;
  public loadingPopup: boolean;
  pageNumbers = 1
  pageSizes = '200'
  moreCountry: any;
  bufferSize = 50;
  numberOfItemsFromEndBeforeFetchingMore = 10;
  countryBuffer = [];
  totalDataCount: any;
  selectedValue: any;
  public next: number = 0;
  public listDataview: any[] = [];
  public loadingSearch: boolean;
  public specialcharPattern = "[A-Za-z0-9. ]+$";
  public specialcharPatternBrn = "[A-Z0-9. ]+$";
  // animate and scroll page size
  pageOption: any;
  animationState = false;
  // animate and scroll page size
  animationVar: any;
  // regEx =  /^(?![0-9]+$)[A-Za-z0-9_-]{2,5}$/;
  regEx = /^[A-Za-z0-9_-]{2,5}$/;

  public tempID: any;
  getOrgId: any;
  currentValueById: any;
  actionType = 'Add'
  emails: any = [];
  public numberPattern = "^[0-9]*$";
  public emailArr: any;
  public phoneArr: any;
  public emailPattern:string; //= "^[a-zA-Z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$";
  removable = true;
  public oldPatchValues: any;
 //urlPattern: RegExp = new RegExp(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/igm);
 urlPattern='(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
  urlArrayString: any=[];

  /*
  @Type: File, <ts>
  @Name: constructor function
  @Who: Renu
  @When: 20-Sep-2020
  @Why: ROST-307
  @What: For injection of service class and other dependencies
   */
  constructor(private fb: FormBuilder, private _userAdministrationService: UserAdministrationService, private _imageUploadService: ImageUploadService, private snackBService: SnackBarService, private route: Router, public _sidebarService: SidebarService, public _dialog: MatDialog,
    private commonserviceService: CommonserviceService, private rtlLtrService: RtlLtrService, public dialog: MatDialog,
    private appSettingsService: AppSettingsService, private translateService: TranslateService, private router: ActivatedRoute,
  ) {
    this.emailPattern=this.appSettingsService.emailPattern;
    // page option from config file
    this.pageOption = this.appSettingsService.pageOption;
    // page option from config file
    this.pagesize = this.appSettingsService.pagesize;
    //Who:Ankit Rawat, What:EWM-16893 EWM-16894 Increased organization name length 30 to 50 characters, When:30Apr24
    this.organizationFrom = this.fb.group({
      OrganizationName: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
      LogoPath: [''],
      Country_ID: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
      CountryName: [''],
      Address1: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(100)]],
      Address2: [''],
      City: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30)]],
      State: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
      Zip: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30), Validators.pattern("^[0-9]*$")]],
      BRN: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(30), Validators.pattern(this.specialcharPatternBrn)]],
      Key: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(5), Validators.pattern(this.regEx)]],
      CareerSiteURL: ['',[Validators.maxLength(253),Validators.pattern(this.urlPattern)]],
      OrgId: [''],
      Id: [''],
      LogoPathUrl: [''],
      emailmul: this.fb.group({
        emailInfo: this.fb.array([this.createemail()])
      }),
      phonemul: this.fb.group({
        phoneInfo: this.fb.array([this.createphone()])
      }),
    })
    // this.activityStatus = data?.mode;

  }

  public ngOnInit() {
    let URL = this.route.url;
    let URL_AS_LIST = URL.split('/');

    /*  @Who: Anup Singh @When: 22-Dec-2021 @Why: EWM-3842 EWM-4086 (for side menu coreRouting)*/
    this._sidebarService.activeCoreRouteObs.next(URL_AS_LIST[2]);
    //
    this.router.queryParams.subscribe(
      params => {
        if (params.id != undefined && params.id != null && params.id != '') {
          this.actionType = 'Edit';
          this.getOrgId = params.id;
          this.getOrgById(this.getOrgId)
        }
        else { }

      })

    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    // <!-- who:bantee,what:ewm-14488 Some of country names are not coming in add organisation page,when:28/09/2023 -->

    // this.getCountryInfo();

    this.animationVar = ButtonTypes;
  }
  ngAfterViewInit(): void {
    this.commonserviceService.onUserLanguageDirections.subscribe(res => {
      this.rtlLtrService.gridLtrToRtl(this.gridAdd, this.gridAdd, this.search, res);
    })
  }
  get f() { return this.organizationFrom.controls; }

  /* 
    @Type: File, <ts>
    @Name: animate delaAnimation function
    @Who: Amit Rajput
    @When: 19-Jan-2022
    @Why: EWM-4368 EWM-4526
    @What: creating animation
  */

  animate() {
    this.animationState = false;
    setTimeout(() => {
      this.animationState = true;
    }, 0);
  }

  delaAnimation(i: number) {
    if (i <= 25) {
      return 0 + i * 80;
    }
    else {
      return 0;
    }
  }



  mouseoverAnimation(matIconId, animationName) {
    let amin = localStorage.getItem('animation');
    if (Number(amin) != 0) {
      document.getElementById(matIconId).classList.add(animationName);
    }
  }
  mouseleaveAnimation(matIconId, animationName) {
    document.getElementById(matIconId).classList.remove(animationName)
  }

  /*
    @Type: File, <ts>
    @Name: editForm function
    @Who: Nitin Bhati
    @When: 31-Oct-2020
    @Why: use for set value in patch file for showing information.
    @What: .
  */
  editForm(items) {
    this.filePatImagePreview = items.PrviewUrl;
    setTimeout(() => {
      this.selectedValue = { 'Id': Number(items.OrganizationAddress[0].Country_ID), CountryName: items.OrganizationAddress[0].CountryName };
      this.ddlchange(this.selectedValue);
    }, 2000)

    this.emailArr = items.Email;
    if (this.emailArr) {
      for (let j = 0; j < this.emailArr.length; j++) {
        this.emails.push({
          email: this.emailArr[j]['EmailId'],
          type: this.emailArr[j]['TypeId'],
          Name: this.emailArr[j]['Type'],
          // IsDefault: this.emailArr[j]['IsDefault']
          EmailId: this.emailArr[j]['EmailId'],
          Type: this.emailArr[j]['TypeId'],
        })
      }
    }

    this.phoneArr = items.Phone;
    if (this.phoneArr) {
      for (let j = 0; j < this.phoneArr.length; j++) {
        let emailData = this.phoneArr[j];
        let d = true;
        this.phone.push({
          TypeId: emailData['TypeId'],
          TypeName: emailData['Type'],
          type: emailData['TypeId'],
          Type: emailData['TypeId'],
          Name: emailData['Type'],
          PhoneNumber: emailData['PhoneNumber'],
          IsDefault: true,
          PhoneCode: emailData['CountryId'],
          phoneCodeName: emailData['PhoneCode']
        })
      }
    }
    this.PhonePopUpData = this.phone;
    this.EmailPopUpData = this.emails;

    this.organizationFrom.controls["Key"].disable();
    this.organizationFrom.patchValue({
      Id: items.OrganizationAddress[0].Id,
      OrganizationName: items.OrganizationName,
      CareerSiteURL: items.CareerSiteURL,
      CountryName: items.OrganizationAddress[0].CountryName,
      Country_ID: items.OrganizationAddress[0].Country_ID,
      Address1: items.OrganizationAddress[0].Address1,
      Address2: items.OrganizationAddress[0].Address2,
      City: items.OrganizationAddress[0].City,
      State: items.OrganizationAddress[0].State,
      Zip: items.OrganizationAddress[0].Zip,
      BRN: items.OrganizationAddress[0].BRN,
      OrgId: items.OrganizationAddress[0].OrgId,
      LogoPath: items.LogoPath,
      Key: items.Key.toUpperCase(),
      phonemul: this.phone,
      emailmul: []
    });
    this.patch('', ''); 

    this.activestatus = 'Update';
    //@who:priti;@why:EWM-4099;@when:9-dec-2021;@What:put if condition for null or blank url-->
    if (items.PrviewUrl != undefined && items.PrviewUrl != null && items.PrviewUrl != '') {
      this.imagePreviewStatus = true;
      this.imagePreview = items.PrviewUrl;
      this.filePathOnServer = items.LogoPath;
    }
    else {
      this.imagePreviewStatus = false;
    }

  }

  patch(emailId, typeId) {
    // alert('eee')
    const control = <FormGroup>this.organizationFrom.get('emailmul');
    const childcontrol = <FormArray>control.controls.emailInfo;
    childcontrol.clear();
    childcontrol.push(this.patchValues(emailId, typeId))
    //console.log("childpatch:",childcontrol);
    this.organizationFrom.patchValue({
      emailmul: childcontrol
    })
  }

  patchValues(emailId, typeId) {
    return this.fb.group({
      EmailId: [emailId],
      Type: [typeId]
    })
  }

  public addHandler() {
    //this.editDataItem = new CountryMaster();
    this.isNew = true;
  }
  public editHandler({ dataItem }) {
    this.editDataItem = dataItem;
    this.isNew = false;
  }
  /*
    @Type: File, <ts>
    @Name: onCancel function
    @Who: Nitin Bhati
    @When: 26-Nov-2020
    @Why: ROST-428
    @What: Function will call when user click on cancel button.
  */
  public onCancel(e): void {
    this.formtitle = 'grid';
    this.active = true;
    this.organizationFrom.reset();
    this.imagePreviewStatus = false;
    this.activestatus = 'Add';

    e.preventDefault();
    // this.closeForm();
    // this.organizationFrom.reset();
    this.filePathOnServer = '';
    this.filePatImagePreview = '';
  }
  /*
  @Type: File, <ts>
  @Name: closeForm function
  @Who: Nitin Bhati
  @When: 26-Nov-2020
  @Why: ROST-428
  @What: Function will call on clock event of popup responsible for closing pop up.
  */
  private closeForm(): void {
    this.active = false;
    this.cancel.emit();
  }
  /*
    @Type: File, <ts>
    @Name: selectFile function
    @Who: Nitin Bhati
    @When: 26-Nov-2020
    @Why: ROST-428
    @What: trigger on onchange event on input file.For capturing the image file realted info
  */
  selectFile(fileInput: any) {
    this.selectedFiles = fileInput.target.files;
    this.fileBinary = fileInput.target.files[0];
    const files = fileInput.target.files;
    const file = files[0];
    const extensionArray = ['png', 'gif', 'jpeg'];
    const filetype = file.type;
    this.fileType = filetype;
    const fileExtention = this.fileType.substring(6);
    const fileExtentionValidation = extensionArray.findIndex(item => item === fileExtention.toLowerCase());
    if (fileExtentionValidation > -1) {
      this.uploadImageFile(this.fileBinary);
      localStorage.setItem('Image', '1');
      this.fileInput.nativeElement.value = "";
    } else {
      this.fileInput.nativeElement.value = "";
      this.snackBService.showErrorSnackBar("Image is not a valid format.", '');
    }
  }
  /*
    @Type: File, <ts>
    @Name: upload Image function
    @Who: Nitin Bhati
    @When: 26-Nov-2020
    @Why: ROST-428
    @What: use for upload image on server
  */
  uploadImageFile(file) {
    this.imagePreviewloading = true;
    const formData = new FormData();
    formData.append('file', file);
    this._imageUploadService.addImageUploadFile(formData).subscribe(
      repsonsedata => {
        this.filePathOnServer = repsonsedata.data[0].filePathOnServer;
        this.filePatImagePreview = repsonsedata.data[0].preview;
        localStorage.setItem('Image', '2');
        this.fileInput.nativeElement.value = "";
        this.imagePreviewloading = false;
        this.imagePreviewStatus = true;
      }, err => {
        this.loading = false;
        this.fileInput.nativeElement.value = "";
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.imagePreviewloading = false;
      })
  }
  /*
    @Type: File, <ts>
    @Name: onSave function
    @Who: Nitin Bhati
    @When: 26-Nov-2020
    @Why: ROST-428
    @What: This function is used for update and save record into database.
  */
  onSave(value, actionStatus) {
    this.submitted = true;
    if (this.organizationFrom.invalid) {
      return;
    }
    if (this.activestatus == 'Update') {
      this.editProduct(value);
    } else {
      this.addProduct(value);
    }
  }
  /*
    @Type: File, <ts>
    @Name: addProduct function
    @Who: Nitin Bhati
    @When: 26-Nov-2020
    @Why: ROST-428
    @What:  For submit the form data
  */
  addProduct(value) {

    this.pagneNo = 1;
    let emailJson = [];
    let phoneJson = [];

    this.emails.forEach(function (elem) {
      elem.Type = parseInt(elem.Type);
      elem.EmailId = elem.EmailId;
      emailJson.push({ "TypeId": elem.type, "Type": elem.Name, "EmailId": elem.email });
    });

    this.phone.forEach(function (elem) {
      elem.Type = parseInt(elem.Type);
      elem.PhoneNumber = elem.PhoneNumber;
      phoneJson.push({
        "TypeId": elem.TypeId,
        "Type": elem.Name,
        "PhoneNumber": elem.PhoneNumber,
        // "IsDefault": elem.IsDefault,
        "PhoneCode": elem.PhoneCode.toString(),
      });
    });

    this.organizationArray['OrganizationAddress'] = [{
      "Name": value.OrganizationName,
      // "Country_ID": value.Country_ID.Id,
      // "CountryName": value.Country_ID.CountryName,
      // @who:priti;@why:EWM-4098;@when:9-dec-2021;@what: country data is not  capturing
      "Country_ID": Number(value.Country_ID),
      "CountryName": value.CountryName,
      "AddressType": "tenant",
      "Address1": value.Address1,
      "Address2": value.Address2,
      "City": value.City,
      "State": value.State,
      "Zip": value.Zip,
      "BRN": value.BRN,
      "Phone": '',

    }]

    this.organizationArray['OrganizationName'] = value.OrganizationName;
    this.organizationArray['LogoPath'] = this.filePathOnServer;
    this.organizationArray['Key'] = value.Key;
    this.organizationArray['CareerSiteURL'] = value.CareerSiteURL;
    this.organizationArray['Phone'] = phoneJson;
    this.organizationArray['Email'] = emailJson;


    this.loading = true;
    this._userAdministrationService.AddOrganization(this.organizationArray).subscribe(
      repsonsedata => {
        this.active = false;
        if (repsonsedata.Httpstatuscode = 200) {
          this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
          this.searchValue = "";
          this.route.navigate(['./client/core/administrators/organization-details']);
          this.removeImage();
          this.commonserviceService.onOrganizationAdd.next(1);
          this.organizationFrom.reset();
          this.selectedValue = 0;

          this.loading = false;

        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
          this.loading = false;
        }
        this.cancel.emit();
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }
  /*
    @Type: File, <ts>
    @Name: editProduct function
    @Who: Nitin Bhati
    @When: 26-Nov-2020
    @Why: ROST-428
    @What: use for Edit Feature.
  */
  editProduct(value) {
    if (this.viewMode === 'cardMode') {
      this.isvisible = true;
    } else {
      this.isvisible = false;
    }
    this.pagneNo = 1;
    let emailJson = [];
    let phoneJson = [];

    this.emails.forEach(function (elem) {
      elem.Type = parseInt(elem.Type);
      elem.EmailId = elem.EmailId;
      emailJson.push({ "TypeId": elem.type, "Type": elem.Name, "EmailId": elem.email });
    });
    
    if (this.isClick == true) {
      this.phone.forEach(function (elem) {
        phoneJson.push({
          "TypeId": elem.TypeId,
          "Type": elem.Name,
          "PhoneNumber": elem.PhoneNumber,
          // "IsDefault": elem.IsDefault,
          "PhoneCode": String(elem.PhoneCode),
        });
      });
    }else{
      this.phone.forEach(function (elem) {
        phoneJson.push({
          "TypeId": elem.TypeId,
          "Type": elem.TypeName,
          "PhoneNumber": elem.PhoneNumber,
          // "IsDefault": elem.IsDefault,
          "PhoneCode": String(elem.PhoneCode),
        });
      });
    }

    this.organizationArray['OrganizationAddress'] = [{
      "Id": value.Id,
      "OrgId": value.OrgId,
      "Name": value.OrganizationName,
      "CountryName": value.CountryName,
      "Country_ID": Number(value.Country_ID),
      "AddressType": "tenant",
      "Address1": value.Address1,
      "Address2": value.Address2,
      "City": value.City,
      "State": value.State,
      "Zip": value.Zip,
      "BRN": value.BRN,
      "Phone": ""
    }]

    this.organizationArray['OrganizationId'] = value.OrgId;
    this.organizationArray['OrganizationName'] = value.OrganizationName;
    this.organizationArray['LogoPath'] = this.filePathOnServer;
    this.organizationArray['Key'] = value.Key;
    this.organizationArray['CareerSiteURL'] = value.CareerSiteURL;
    this.organizationArray['Phone'] = phoneJson;
    this.organizationArray['Email'] = emailJson;

    this.loading = true;
    this._userAdministrationService.updateOrganization(this.organizationArray).subscribe(
      repsonsedata => {
        this.active = false;
        if (repsonsedata.Httpstatuscode = 200) {
          this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
          this.commonserviceService.onOrganizationAdd.next(1);//29 june 2021 priti,EWM-1766
          this.route.navigate(['./client/core/administrators/organization-details']);
          this.organizationFrom.reset();
          this.selectedValue = 0;//29 june 2021 priti,EWM-1766

          this.loading = false;

        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
          this.loading = false;
        }
        this.cancel.emit();
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }


  /*
@Type: File, <ts>
@Name: editForm function
@Who: Renu
@When: 18-May-2021
@Why: ROST-2104
@What: For setting value in the edit form
*/

  getOrgById(Id: Number) {
    this.loading = true;
    this._userAdministrationService.getOrganizationById(Id).subscribe(
      (data: ResponceData) => {
        this.loading = false;
        if (data.HttpStatusCode === 200) {
          this.currentValueById = data.Data;
          this.editForm(this.currentValueById)
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
    @Name: system look and feel info
    @Who: Mukesh kumar rai
    @When: 26-Nov-2020
    @Why: ROST-428
    @What: Restore Defaout value
  */
  removeImage() {
    this.pagneNo = 1;
    this.filePathOnServer = '';
    this.filePatImagePreview = '';
    this.imagePreviewStatus = false;
  }
  /**
      @(C): Entire Software
      @Type: Function
      @Who: Mukesh kumar rai
      @When: 10-Sept-2020
      @Why:  Open for modal window
      @What: This function responsible to open and close the modal window.
      @Return: None
      @Params :
      1. param -button name so we can check it come from which link.
     */
  openDialog(Image): void {
    let data: any;
    data = { "title": 'title', "type": 'Image', "content": Image };
    const dialogRef = this._dialog.open(ModalComponent, {
      width: '240px',
      disableClose: true,
      data: data,
      panelClass: ['imageModal', 'animate__animated', 'animate__zoomIn']
    });
    //Entire Software : Mukesh kumar Rai : 15-Sep-2020 : popup modal data return after closing modal
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  /**
    @(C): Entire Software
    @Type: Function
    @Who: Satya Prakash
    @When: 15-Dec-2020
    @Why:  Switch mode List and card
    @What: This function responsible to change list and card view
   */
  switchListMode(viewMode) {
    let listHeader = document.getElementById("listHeader");
    if (viewMode === 'cardMode') {
      this.maxCharacterLength = 80;
      this.maxCharacterLengthName = 40;
      this.viewMode = "cardMode";
      this.isvisible = true;
      this.animate();
    } else {
      this.maxCharacterLength = 80;
      this.maxCharacterLengthName = 40;
      this.viewMode = "listMode";
      this.isvisible = false;
      this.animate();
    }
  }


  /*
@Type: File, <ts>
@Name: onScrollDown function
@Who: Renu
@When: 30-Dec-2020
@Why: ROST-485
@What: for pagination whenever user scroll down
*/

  onScrollDown(ev?) {
    this.loadingscroll = true;
    if (this.canLoad) {
      // Change value of checkers
      this.canLoad = false;
      this.pendingLoad = false;
      // Append elements
      /*  @Who: priti @When: 27-Apr-2021 @Why: EWM-1416 (add condition)*/
      if (this.totalDataCount > this.gridData.length) {
        this.pagneNo = this.pagneNo + 1;
        this.userOrganizationListScroll(this.pagesize, this.pagneNo, this.sortingValue);
      } else {
        this.loadingscroll = false;
      }
    } else {
      this.loadingscroll = false;
      this.pendingLoad = true;
    }
  }


  /*
    @Type: File, <ts>
    @Name: userOrganizationListScroll function
    @Who: Renu
    @When: 30-Dec-2020
    @Why: ROST-488
    @What: service call for listing sms list data on scroll
    */
  userOrganizationListScroll(pagesize, pagneNo, sortingValue) {
    // this.loadingscroll=true;
    this._userAdministrationService.getOrganizationInfo(pagesize, pagneNo, sortingValue, this.searchValue).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.loadingscroll = false;
          this.gridView = repsonsedata['Data'];
          // this.listData=repsonsedata['Data'];
          let nextgridView = [];
          nextgridView = repsonsedata['Data'];
          this.gridData = this.gridData.concat(nextgridView);
          // this.reloadListData();
          // this.doNext();
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loadingscroll = false;
        }
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }


  getCountryInfo() {
    this._userAdministrationService.getCountryInfo(this.pageNumbers, this.pageSizes).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.countryList = repsonsedata['Data'];
        }
      }, err => {
        this.loading = false;

      })
  }
  /*
  @Type: File, <ts>
   @Name: User Type master
   @Who: Priti Srivastava
   @When: 22-jan-2021
   @Why: EWM-700
   @What: use for upload image on server
 */
  uploadImageFileByUrl() {
    let file = '';
    this.imagePreviewloading = true;
    file = this.organizationFrom.controls.LogoPathUrl.value;
    let strlist = file.split('.');
    const extensionArray = ['png', 'gif', 'jpeg', 'jpg'];
    const fileExtention = strlist[strlist.length - 1];
    const fileExtentionValidation = extensionArray.findIndex(item => fileExtention.toLowerCase().includes(item));
    if (fileExtentionValidation < 0) {
      this.imagePreviewloading = false;
      this.snackBService.showErrorSnackBar("Image is not a valid format.", '');
      return;
    }
    const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    let match = file.match(reg);
    if (match[1] == undefined) {
      this.imagePreviewloading = false;
      this.snackBService.showErrorSnackBar("URL is not in valid format.", '');
      return;
    }
    this._imageUploadService.addImageByUrl(file).subscribe(
      repsonsedata => {
        this.organizationFrom.get('LogoPathUrl').setValue('');
        this.filePathOnServer = repsonsedata.data[0].filePathOnServer;
        //this.filePatImagePreview = repsonsedata[0].preview;
        this.croppingImage(2, repsonsedata.data[0].preview);
        // this.imagePreviewStatus = true;
        localStorage.setItem('Image', '2');
        this.imagePreviewloading = false;
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.imagePreviewloading = false;
      });
  }
  /*
    @Type: File, <ts>
    @Name: upload Image function
    @Who: Priti Srivastava
    @When: 29-jan-2021
    @Why: EWM-681
    @What: use for upload image on server
  */
  uploadImageFileInBase64() {
    this.imagePreviewloading = true;
    const formData = { 'base64ImageString': this.croppedImage };
    this._imageUploadService.ImageUploadBase64(formData).subscribe(
      repsonsedata => {
        this.imagePreviewStatus = true;
        this.filePathOnServer = repsonsedata.Data[0].FilePathOnServer;
        this.filePatImagePreview = repsonsedata.Data[0].Preview;
        localStorage.setItem('Image', '2');
        this.imagePreviewloading = false;
      }, err => {
        this.loading = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.imagePreviewloading = false;
      })
  }

  /*
    @Type: File, <ts>
    @Name: croppingImage Image function
    @Who: Renu
    @When: 23-Mar-2021
    @Why: EWM-1054
    @What: use for upload image on server - modified
  */

  croppingImage(uploadMethod: any, logoPreviewUrl: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "";
    dialogConfig.width = "100%";
    dialogConfig.panelClass = 'myDialogCroppingImage';
    // @when:10-feb-2021 @who:priti @why:EWM-882  @What: pass data to image component to check size and type of image
    dialogConfig.data = new Object({ type: this.appSettingsService.getImageTypeSmall(), size: this.appSettingsService.getImageSizeLarge(), uploadMethod: uploadMethod, imageData: logoPreviewUrl,ratioStatus:false , recommendedDimensionSize:true, recommendedDimensionWidth:'250',recommendedDimensionHeight:'70' });
    const modalDialog = this._dialog.open(ImageUploadPopupComponent, dialogConfig);
    modalDialog.afterClosed().subscribe(res => {
      if (res.data != undefined && res.data != '') {
        this.croppedImage = res.data;
        this.uploadImageFileInBase64();
      }
    })
  }

  /*
      @Type: File, <ts>
      @Name: getsearchDataList function
      @Who: Nitin Bhati
      @When: 20-march-2021
      @Why: EWM-1205
      @What: use for upload image on server
    */
  getsearchDataList(event: any) {
    this.loadingPopup = true;
    if (event.target.value) {
      this._userAdministrationService.fetchCountryInfoSearch(event.target.value).subscribe(
        repsonsedata => {
          if (repsonsedata['HttpStatusCode'] == '200') {
            this.countryList = repsonsedata['Data'];
            this.loadingPopup = false;
          }
        }, err => {
          this.loading = false;
          this.loadingPopup = false;
        })

    } else {
      this.pagneNo = 1;
      this.getCountryInfo();
      this.loadingPopup = false;
    }
  }


  /*
    @Type: File, <ts>
    @Name: fetchMoreCountry
    @Who: Nitin Bhati
    @When: 20-March-2021
    @Why: EWM-1205
    @What: to scroll all country related info
    */
  private fetchMoreCountry() {
    this.loadingPopup = false;
    this.pageNumbers = this.pageNumbers + 1;
    this._userAdministrationService.getCountryInfo(this.pageNumbers, this.pageSizes).subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.moreCountry = repsonsedata['Data'];
          this.countryList = this.countryList.concat(this.moreCountry);
          this.loadingPopup = false;
        }
      }, err => {
        this.loading = false;
        this.loadingPopup = false;
      })

  }






  /*
  
    @Who: Suika
    @When: 16-june-2021
    @Why: EWM-1876
    @What: get selected data
  */
  ddlchange(data) {
    if (data == null || data == "") {
      this.organizationFrom.get("Country_ID").setErrors({ required: true });
      this.organizationFrom.get("Country_ID").markAsTouched();
      this.organizationFrom.get("Country_ID").markAsDirty();
    }
    else {
      this.organizationFrom.get("Country_ID").clearValidators();
      this.organizationFrom.get("Country_ID").markAsPristine();
      this.selectedValue = data;
      this.organizationFrom.patchValue(
        {
          Country_ID: data.Id,
          CountryName: data.CountryName
        }
      )
    }
  }


  //////////////////// get data For Address Field From Address Bar Popup  @Anup Kumar Singh/////////////////

  @ViewChild(AgmMap, { static: true }) public agmMap: AgmMap;

  openDialogforAddressBar() {
    const dialogRef = this.dialog.open(AddressBarComponent, {
      maxWidth: "750px",
      // data: dialogData,
      panelClass: ['quick-modalbox', 'add_addressBar', 'animate__animated', 'animate__slideInDown'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(address => {

      this.fetchDataFromAddressBar(address)
    })

  }


  fetchDataFromAddressBar(address: Address) {
    //console.log(address, "address" )

    let latitude = address.geometry.location.lat();
    let longitude = address.geometry.location.lng();
    // console.log("lat "+latitude);
    // console.log("long "+longitude);

    let addressOne: any = "";
    let addressTwo: any = "";

    for (let index = 0; index < address.address_components.length; index++) {
      const element = address.address_components[index];

      switch (element.types[0]) {
        case "locality":
          addressOne += element.long_name + " ";
          break;

        case "street_number":
          addressOne += element.long_name + " ";
          break;

        case "route":
          addressTwo += element.long_name + " ";
          break;

        case "neighborhood":
          addressTwo += element.long_name + " ";
          break;


        case "administrative_area_level_2":
          this.organizationFrom.patchValue({ City: element.long_name });
          break;

        case "administrative_area_level_1":
          this.organizationFrom.patchValue({ State: element.long_name });
          break;

        case "country":
          this.organizationFrom.patchValue({ Country_Id: element.long_name });
          // this.selectedValue = element.long_name
          break;

        case "postal_code":
          this.organizationFrom.patchValue({ Zip: element.long_name });
          break;

        default:
          break;
      }

      this.organizationFrom.patchValue({ Address1: addressOne });
      this.organizationFrom.patchValue({ Address2: addressTwo });

      //  this.organizationFrom.patchValue({ lat: latitude });
      //  this.organizationFrom.patchValue({ lng: longitude });

    }
  }
  /**@what: for animation @by: renu on @date: 03/07/2021 */
  doNext() {
    if (this.next < this.gridData.length) {
      this.listDataview.push(this.gridData[this.next++]);
    }
  }

  /**@what: for clearing and reload issues @by: renu on @date: 03/07/2021 */
  reloadListData() {
    this.next = 0;
    this.listDataview = [];
  }

  /* 
     @Type: File, <ts>
     @Name: duplicayCheck function
     @Who: Nitin Bhati
     @When: 11-Nov-2021
     @Why: EWM-3710
     @What: For checking duplicacy for key type
    */
  duplicayCheck() {
    this._userAdministrationService.checkDuplicityOrganizationKey(this.organizationFrom.get("Key").value).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 402) {
          if (repsonsedata.Status == false) {

            this.organizationFrom.get("Key").setErrors({ codeTaken: true });
            this.organizationFrom.get("Key").markAsDirty();

          }
        } else if (repsonsedata.HttpStatusCode === 204) {
          if (repsonsedata.Status == true) {

            this.organizationFrom.get("Key").clearValidators();
            this.organizationFrom.get("Key").markAsPristine();
            this.organizationFrom.get('Key').setValidators([Validators.required, Validators.minLength(2), Validators.maxLength(5), Validators.pattern(this.regEx)]);

          }
        }
        else if (repsonsedata.HttpStatusCode == 400) {
          this.organizationFrom.get("Key").clearValidators();
          this.organizationFrom.get("Key").markAsPristine();
          this.organizationFrom.get('Key').setValidators([Validators.required, Validators.minLength(2), Validators.maxLength(5), Validators.pattern(this.regEx)]);
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode.toString());
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
   @Name: createemail
   @Who: Adarsh singh
   @When: 24-Aug-2022
   @Why: EWM-7880 ewm-8367
   @What: when user click on add to create form group with same formcontrol
   */
  createemail(): FormGroup {
    return this.fb.group({
      EmailId: ['', [Validators.required, Validators.pattern(this.emailPattern), Validators.maxLength(100), RxwebValidators.unique()]],
      Type: [[], [Validators.required, RxwebValidators.unique()]]
    });
  }


  /*
  @Type: File, <ts>
  @Name: createphone
  @Who: Adarsh singh
  @When: 24-Aug-2022
  @Why: EWM-7880 ewm-8367
  @What: when user click on add to create form group with same formcontrol
   */

  createphone(): FormGroup {
    return this.fb.group({
      PhoneNumber: ['', [Validators.pattern(this.numberPattern), Validators.maxLength(20), Validators.minLength(5), RxwebValidators.unique()]],
      Type: [[], [RxwebValidators.unique()]],
      phoneCode: [''],
      phoneCodeName: []
    });
  }


  /* 
  @Type: File, <ts>
  @Name: addEmail
  @Who: Adarsh singh
  @When: 24-Aug-2022
  @Why: EWM-7880 ewm-8367
  @What: for opening the email dialog box
  */
  public activityStatus: any;
  actionEmail:any;
  public EmailPopUpData = [];
  addEmail() {

    if (this.emails.length ==0) {
      this.actionEmail = 'Add';
    }else{
      this.actionEmail = "edit";
    }
    this.organizationFrom.get('emailmul').reset();
    const dialogRef = this.dialog.open(AddemailComponent, {
      data: new Object({ emailmul: this.organizationFrom.get('emailmul'), emailsChip: this.emails, mode: this.actionEmail, pageName: 'orgPage', values: {Email:this.emails} }),
      panelClass: ['xeople-modal', 'add_email', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      this.emailArr = res.data;
      
      if (res.data != '') {
        if (this.emailArr) {
          this.EmailPopUpData = this.emailArr;
          this.emails = [];
          for (let j = 0; j < this.emailArr.length; j++) {
            this.emails.push({
              email: this.emailArr[j]['EmailId'],
              EmailId: this.emailArr[j]['EmailId'],
              type: this.emailArr[j]['Type'],
              Type: this.emailArr[j]['Type'],
              IsDefault: this.emailArr[j]['IsDefault'],
              Name: this.emailArr[j]['Name']
            })
          }
          
          const control = this.organizationFrom.get("emailmul").get("emailInfo") as FormArray;
          control.clear();
          this.emailArr.forEach((x) => {
            control.push(
               this.fb.group({      
                EmailId: [x.EmailId,[Validators.pattern(this.emailPattern),Validators.maxLength(100),RxwebValidators.unique()]],
                Type: [x.Type,[Validators.required, RxwebValidators.unique()]],
                TypeName:[x.Name]
               })
             );
           });
        }
      } else {
        if (this.emails.length == 0) {
          const control = this.organizationFrom.get("emailmul").get("emailInfo") as FormArray
          control.clear();
          control.push(
            this.fb.group({
              EmailId: ['', [Validators.required, Validators.pattern(this.emailPattern), Validators.maxLength(100), RxwebValidators.unique()]],
              Type: [[], [RxwebValidators.unique()]],
              TypeName: ['']
            })
          )
        }
        else {
          const control = this.organizationFrom.get("emailmul").get("emailInfo") as FormArray
          control.clear();
          control.push(
            this.fb.group({
              EmailId: ['', [Validators.pattern(this.emailPattern), Validators.maxLength(100), RxwebValidators.unique()]],
              Type: [[], [RxwebValidators.unique()]],
              TypeName: ['']
            })
          )
        }
      }
      
    })
  }

  /* 
   @Type: File, <ts>
   @Name: addPhone
   @Who: Adarsh singh
   @When: 24-Aug-2022
   @Why: EWM-7880 ewm-8367
   @What: for opening the phone dialog box
 */
  phone: any = [];
  public PhonePopUpData = [];
  action = 'Add';
  isClick = false;

  addPhone() {
    if (this.phone.length ==0) {
      this.action = 'Add';
    }else{
      this.action = "edit";
    }
    this.organizationFrom.get('phonemul').reset();
    const dialogRef = this.dialog.open(AddphonesComponent, {
      data: new Object({ phonemul: this.organizationFrom.get('phonemul'), mode: this.action, phoneChip: [], pageName: 'orgPage', values: { Phone: this.PhonePopUpData } }),
      panelClass: ['xeople-modal', 'add_phone', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      this.phoneArr = res.data;
      if (this.phoneArr) {
        this.PhonePopUpData = this.phoneArr;
        this.phone = [];
        this.isClick = true;
        for (let j = 0; j < this.phoneArr.length; j++) {
          this.phone.push({
            PhoneNumber: this.phoneArr[j]['PhoneNumber'],
            phone: this.phoneArr[j]['PhoneNumber'],
            TypeId: this.phoneArr[j]['Type'],
            type: this.phoneArr[j]['Type'],
            Name: this.phoneArr[j]['Name'],
            IsDefault: this.phoneArr[j]['IsDefault'],
            PhoneCode: this.phoneArr[j]['PhoneCode'],
            phoneCodeName: this.phoneArr[j]['phoneCodeName'],
            CountryId: this.phoneArr[j]['CountryId']
          })
        }
        let str = JSON.stringify(this.phone,(k, v) =>  v === null ? 1 : v);
        let result = JSON.parse(str);
        this.phone= result
      }
    })
  }


  /*
  @Type: File, <ts>
  @Name: remove
  @Who: Adarsh singh
  @When: 24-Aug-2022
  @Why: EWM-7880 ewm-8367
  @What: to remove single chip via input
  */
  remove(items: any, type: string): void {
    if (type == 'email') {
      const index = this.emails.indexOf(items);
      if (index >= 0) {
        this.emails.splice(index, 1);
      }
      if (this.emails.length == 0) {
        this.organizationFrom.controls['emailmul'].setErrors({ 'required': true });
      }

    } else if (type == 'phone') {
      const index = this.phone.indexOf(items);
      if (index >= 0) {
        this.phone.splice(index, 1);
      }

    }

  }

  duplicayCheckCareerUrl() {
   let careerUrl=this.organizationFrom.get("CareerSiteURL").value
   let subString = careerUrl.split( '.' );
    this.urlArrayString=[]
    subString?.forEach((x,i)=>{
      if(i !=0){
        this.urlArrayString.push(x)
      }
      });
     if(careerUrl.substring(0,8).toLowerCase()=='https://' || careerUrl.substring(0,7).toLowerCase()=='http://' ){
       this.urlArrayString.forEach(y=>{
         if(y?.length<=63){
          this.organizationFrom.get("CareerSiteURL").clearValidators();
          this.organizationFrom.get("CareerSiteURL").markAsPristine();
          this.organizationFrom.get('CareerSiteURL').setValidators([Validators.maxLength(253),Validators.pattern(this.urlPattern)]);
         }else{
          this.organizationFrom.get("CareerSiteURL").setErrors({ codeTakenUrl: true });
          this.organizationFrom.get("CareerSiteURL").markAsDirty();
         }
       }

       )
     }else{
      this.organizationFrom.get("CareerSiteURL").setErrors({ codeTakenUrl: true });
      this.organizationFrom.get("CareerSiteURL").markAsDirty();
     
    }
   
  }

}
