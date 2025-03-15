/*
  @(C): Entire Software
  @Type: File, <ts>
  @Who: Satya Prakash
  @When: 19-Nov-2020
  @Why: ROST-356 ROST-402
  @What:  This page will be use for the look and feel Component ts file
*/
import { Component, ComponentFactoryResolver, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { Router } from '@angular/router';
import { SystemLookFeelService } from '../../shared/services/look-n-feel/system-look-feel.service';
import { SnackBarService } from '../../../../shared/services/snackbar/snack-bar.service';
import { GetSystemlookfeel, ResponceData, Userpreferences } from '../../../../shared/models/index';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { SidebarService } from '../../../../shared/services/sidebar/sidebar.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { ImageUploadPopupComponent } from '../../shared/image-upload-popup/image-upload-popup.component';
import { ImageUploadService } from 'src/app/shared/services/image-upload/image-upload.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { statusMaster } from '../../shared/datamodels/status-master';


@Component({
  selector: 'app-look-and-feel',
  templateUrl: './look-and-feel.component.html',
  styleUrls: ['./look-and-feel.component.scss']
})

export class LookAndFeelComponent implements OnInit {
  /****************Decalaration of Global Variables*************************/
  public loading: boolean;
  public logoPreviewUrl: string;
  public logoImagePath: string;
  public faviconmagePath: string;
  public FaviconPreviewUrl: any;
  public SystemLookFeelInfo: GetSystemlookfeel;
  public selectedFiles = '';
  public fileBinary: File;
  public selectedColor: string = '';
  public dayFormats: any[];
  public timeFormats: any[];
  public dayMonthYearFormats: any[];
  public selectedTime_format: string;
  public selectedDay_format: string;
  public selectedDayMonthYearFormat: string;
  public completeDatetimeFormat: string;
  fileType;


  public primaryBgColor: string;
  public primaryTxtColor: string;
  public highlightBgColor: string;
  public highlightTxtColor: string;
  SystemLookFeelForm: FormGroup;
  primaryColor: string;
  secondaryColor: string;
  public Is_iso_standard: Number;
  public uncheck: boolean = false;
  @ViewChild('fileInput') fileInput: ElementRef;

  imagePreview: string;
  imagePreviewStatus: boolean;
  public imagePreviewloading: boolean = false;
  imagePreviewfaviconStatus: boolean;
  public imagePreviewFeviconloading: boolean = false;
  HighlightColor: string;
  HeaderBackground: string;
  HighlightBackground: string;
  HeaderColor: string;
  croppedImage: any;
  blob: any;
  imgResultBeforeCompress: string;
  imgResultAfterCompress: string;

  public distanceUnit:any=[];
  public showKmMsg:boolean=true;
 // color picker varibale 
showColorPallateContainer = false;
showColorPallat=false;
showColorPallatHighlightbackground=false;
showColorPallatHighlightcolor=false;
color: any = '#2883e9'
selctedColor = '#FFFFFF';
selctedHeadercolor='#FFFFFF';
selctedHighlightbackground='#FFFFFF';
selectHighlightcolor='#FFFFFF';
themeColors:[] = [];
standardColor: [] = [];
overlayViewjob = false;
overlayView=false;
isOpen = false;
isMoreColorClicked!: boolean;
  previewChangescolor: HTMLInputElement;
  dirctionalLang;
  preview: any;
  public logourl: string;
  public Faviconurl: string;
  public previewChange: boolean;
// color picker End 
  constructor(public _systemLookFeelService: SystemLookFeelService,
    public _snackBarService: SnackBarService,
    private translateService: TranslateService,
    private route: Router,
    private _formGroup: FormBuilder,
    public _dialog: MatDialog,
    public _sidebarService: SidebarService, private commonserviceService: CommonserviceService,
    private _imageUploadService: ImageUploadService,
    private _appSetting: AppSettingsService,
    private _userpreferencesService: UserpreferencesService,
  ) {

    // this.logoPreviewUrl = '/assets/logo.png';
    // this.FaviconPreviewUrl = '/assets/fab.png';
    this.primaryBgColor = localStorage.getItem('HeaderBackground');
    this.primaryTxtColor = localStorage.getItem('HeaderColor');
    this.highlightBgColor = localStorage.getItem('HighlightBackground');
    this.highlightTxtColor = localStorage.getItem('HighlightColor');
    this.selectedDayMonthYearFormat = '';
    this.completeDatetimeFormat = '';
    this.selectedTime_format = '';
    this.completeDatetimeFormat = this.selectedDayMonthYearFormat + ' ' + this.selectedTime_format;
    this.SystemLookFeelForm = this._formGroup.group({
      LogoUrl: [''],
      FaviconUrl: [''],
      Header_background: [''],
      Header_color: ['', Validators.required],

      Highlight_background: ['', Validators.required],
      Highlight_color: ['', Validators.required],
      Time_format: ['', Validators.required],

      Day_format: ['', Validators.required],
      Complete_datetime_format: [''],
      Day_month_year_format: ['', Validators.required],
      Is_iso_standard: ['', Validators.required],
      FaviconTextUrl: [''],
      LogoTextUrl: [''],
      Distance :['',Validators.required],

    });

  }

  changeTheme(primary: string, secondary: string, highlightprimary: string, highlightsecondary: string) {
    document.documentElement.style.setProperty('--primary-color', primary);
    document.documentElement.style.setProperty('--secondary-color', secondary);
    document.documentElement.style.setProperty('--highlightprimary-color', highlightprimary);
    document.documentElement.style.setProperty('--highlightsecondary-color', highlightsecondary);
  }
  dateToday: number = Date.now();
  ngOnInit(): void {
    this.getColorCodeAll()
    let URL = this.route.url;
    let URL_AS_LIST = URL.split('/');
    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this.getSystemDatetimeFormats();
    this.getAllProximity();
    this.getSystemLookFeelInfo();
    this.commonserviceService.onHeaderColorSelect.subscribe(value => {
      this.HeaderColor = localStorage.getItem('HeaderColor');
    })
    this.commonserviceService.onHighlightBackgroundSelect.subscribe(value => {
      this.HighlightBackground = localStorage.getItem('HighlightBackground');
    })
    this.commonserviceService.onHeaderBackgroundSelect.subscribe(value => {
      this.HeaderBackground = localStorage.getItem('HeaderBackground');
    })
    this.commonserviceService.onHighlightColorSelect.subscribe(value => {
      this.HighlightColor = localStorage.getItem('HighlightColor');
    })
    this.commonserviceService.onOrgSelectId.subscribe(value => {
      if (value !== null) {
        this.reloadApiBasedOnorg();
      }
    })



  }



  changeSelectBox(value, selectBox) {
    if (selectBox === 'Time_format') {
      this.selectedTime_format = value;
    }
    if (selectBox === 'Day_format') {
      this.selectedDay_format = value;
    }
    if (selectBox === 'Day_month_year_format') {
      this.selectedDayMonthYearFormat = value;
    }
    if (this.selectedDayMonthYearFormat===null||this.selectedTime_format===null||this.selectedDayMonthYearFormat===undefined||this.selectedDayMonthYearFormat===''||this.selectedTime_format===undefined||this.selectedTime_format===''){
      this.completeDatetimeFormat = 'NA'
    } else {
      this.completeDatetimeFormat = this.selectedDayMonthYearFormat + ' ' + this.selectedTime_format;
    }

    this._userpreferencesService.changeDateFormat(this.completeDatetimeFormat);
  }
  /*
  @Type: File, <ts>
  @Name: system look and feel info
  @Who: Mukesh kumar rai
  @When: 26-Nov-2020
  @Why: ROST-403
  @What: to get allsystem look and feel related Information
*/
  getSystemLookFeelInfo() {
    this.loading = true;
    this._systemLookFeelService.getSystemLookFeelInfo().subscribe(
      (data: ResponceData) => {
        this.loading = false;
        if (data.HttpStatusCode == 200) {
          
          this.SystemLookFeelInfo = data.Data;
          if (this.SystemLookFeelInfo.PreviewLogoUrl != '') {
            this.imagePreviewStatus = true;
            this.logoPreviewUrl = this.SystemLookFeelInfo.PreviewLogoUrl;
          } else {
            this.imagePreviewStatus = false;
            this.logoPreviewUrl = this.SystemLookFeelInfo.PreviewLogoUrl;
          }
          this.logoImagePath = this.SystemLookFeelInfo.LogoUrl;
          this.faviconmagePath = this.SystemLookFeelInfo.FaviconUrl;
          if (this.SystemLookFeelInfo.PreviewFaviconUrl != '') {
            this.imagePreviewfaviconStatus = true;
            this.FaviconPreviewUrl = this.SystemLookFeelInfo.PreviewFaviconUrl;
          } else {
            this.imagePreviewfaviconStatus = false;
            this.FaviconPreviewUrl = this.SystemLookFeelInfo.PreviewFaviconUrl;
          }
          // who:maneesh,what:ewm-11374 for when no image then no value patch ,when:16/03/2023
          if (this.logoImagePath=='' || this.logoImagePath===null) {
            this.imagePreviewStatus=false;
          }
          this.selectedDayMonthYearFormat = this.SystemLookFeelInfo.Day_month_year_format;
          this.selectedTime_format = this.SystemLookFeelInfo.Time_format;
          this.primaryBgColor = this.SystemLookFeelInfo.Header_background;
          this.primaryTxtColor = this.SystemLookFeelInfo.Header_color;
          this.highlightBgColor = this.SystemLookFeelInfo.Highlight_background;
          this.highlightTxtColor = this.SystemLookFeelInfo.Highlight_color;
          this.Is_iso_standard = this.SystemLookFeelInfo.Is_iso_standard;
         // this.Distance = this.SystemLookFeelInfo.Distance;
         localStorage.setItem('DistanceUnit', this.SystemLookFeelInfo.DistanceUnit);    /*@When:27-07-2023 @who: renu @why: EWM-13179 EWM-13284 @What: to get disance unit in xeople search*/
         if(this.SystemLookFeelInfo?.Distance===1){
          this.showKmMsg=true;
          }else{
            this.showKmMsg=false;
          }
          this.SystemLookFeelForm.patchValue({
            'LogoUrl': this.logoImagePath,
            'FaviconUrl': this.faviconmagePath,
            'Header_background': this.primaryBgColor,
            'Header_color': this.primaryTxtColor,
            'Highlight_background': this.highlightBgColor,
            'Highlight_color': this.highlightTxtColor,

            'Time_format': this.SystemLookFeelInfo.Time_format,
            'Day_format': this.SystemLookFeelInfo.Day_format,
            'Complete_datetime_format': this.SystemLookFeelInfo.Complete_datetime_format,
            'Day_month_year_format': this.SystemLookFeelInfo.Day_month_year_format,
            'Is_iso_standard': this.Is_iso_standard,
            'Distance' : this.SystemLookFeelInfo.Distance,
          });
        // who:maneesh,what:ewm:11677 for handel preview check and uncheck when logo and favicon icon upload,when:19/05/2023
          this.logourl=this.logoPreviewUrl;
          this.Faviconurl=this.FaviconPreviewUrl;
          this.selctedColor=this.primaryBgColor;
          this.selctedHeadercolor=this.primaryTxtColor;
          this.selctedHighlightbackground= this.highlightBgColor;
          this.selectHighlightcolor=this.highlightTxtColor;
          this.completeDatetimeFormat = this.selectedDayMonthYearFormat + ' ' + this.selectedTime_format;
          this.commonserviceService.onOrganizationLogo.next(this.SystemLookFeelInfo.PreviewLogoUrl)
          // who:maneesh,what:ewm-11124  for color picker when:12/03/2023
          this.changeTheme(localStorage.getItem('HeaderBackground'), localStorage.getItem('HeaderColor'), localStorage.getItem('HighlightBackground'), localStorage.getItem('HighlightColor'));
          // <!---------@When: 27-03-2023 EWM-10688 @who:Adarsh singh @Desc- Set selected date format--------->
          // let dateFormat = this.dayMonthYearFormats.find(e => e.Value === this.selectedDayMonthYearFormat);
          // localStorage.setItem('DateFormat', dateFormat['Key']);
          // End 
          // --------@When: 20-APR-2023 @who:Adarsh singh @why: EWM-12005 --------
          localStorage.setItem('FaviconUrl', this.SystemLookFeelInfo?.PreviewFaviconUrl);
          this.commonserviceService.onFavicon.next(this.SystemLookFeelInfo?.PreviewFaviconUrl)
        }
      }, err => {
        this.loading = false;
        this._snackBarService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  /*
  @Type: File, <ts>
  @Name: system look and feel info
  @Who: Mukesh kumar rai
  @When: 26-Nov-2020
  @Why: ROST-403
  @What: to get all get-system-datetimeformats related Information
*/
  getSystemDatetimeFormats() {
    this.loading = true;
    this._systemLookFeelService.getSystemDatetimeFormats().subscribe(
      (data: ResponceData) => {
        this.loading = false;
        if (data.HttpStatusCode == 200) {
          this.SystemLookFeelInfo = data.Data;
          this.dayFormats = data['Data']['DayFormats'];
          this.timeFormats = data['Data']['TimeFormats'];
          this.dayMonthYearFormats = data['Data']['DayMonthYearFormats'];

        }
      }, err => {
        this.loading = false;
        this._snackBarService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  }
  updateSysteminfo(value) {
    this.loading = true;
    value['LogoUrl'] = this.logoImagePath;
    value['FaviconUrl'] = this.faviconmagePath;
    // who:maneesh,what:ewm-11124 change variabel for color picker when:12/03/2023
    value['Header_background'] = this.selctedColor;
    value['Header_color'] = this.selctedHeadercolor;
    value['Highlight_background'] = this.selctedHighlightbackground;
    value['Highlight_color'] = this.selectHighlightcolor;
    value['Is_iso_standard'] = Number(this.Is_iso_standard);
    value['Complete_datetime_format'] = this.selectedDayMonthYearFormat + ' ' + this.selectedTime_format;
    //value['FaviconUrl'] = this.faviconmagePath;
    //this.submitted = true;
    if (this.SystemLookFeelForm.invalid) {
      return;
    } else {
      this._systemLookFeelService.updateSystemLookFeelInfo(JSON.stringify(value)).subscribe(
        (data: ResponceData) => {
          this.loading = false;
          if (data.HttpStatusCode == 200) {
            localStorage.setItem('Distance', value.Distance);
            //this._snackBarService.showSuccessSnackBar(this.translateService.instant('label_snackbarsuccessmsg'), data.HttpStatusCode.toString());
            this.commonserviceService.onHeaderColorSelect.next(localStorage.setItem('HeaderColor', this.selctedHeadercolor));
            this.commonserviceService.onHighlightBackgroundSelect.next(localStorage.setItem('HighlightBackground', this.selctedHighlightbackground));
            this.commonserviceService.onHeaderBackgroundSelect.next(localStorage.setItem('HeaderBackground', this.selctedColor));
            this.commonserviceService.onHighlightColorSelect.next(localStorage.setItem('HighlightColor', this.selectHighlightcolor));

            localStorage.setItem('DateTimeFormat', data.Data['Complete_datetime_format']);
            localStorage.setItem('DateFormat', data.Data['Day_month_year_format']);
            this._appSetting.dateTimeFormatViaLookAndFeel.next(data.Data['Day_month_year_format']);
            this.getSystemLookFeelInfo();
            
          } else {
            this._snackBarService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
            this.loading = false;
          }
        }, err => {
          this._snackBarService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          this.loading = false;
        })
    }
  }
  /*
  @Type: File, <ts>
  @Name: system look and feel info
  @Who: Mukesh kumar rai
  @When: 26-Nov-2020
  @Why: ROST-403
  @What: trigger on onchange event on input file.For capturing the image file realted info
*/
  // selectFile(fileInput: any, type) {
  //   this.selectedFiles = fileInput.target.files;
  //   this.fileBinary = fileInput.target.files[0];
  //   Array.from(fileInput.target.files).forEach((file: File) => {
  //     // this.myfilename = file.name;
  //   });
  //   const files = fileInput.target.files;
  //   const file = files[0];
  //   const extensionArray = ['png', 'gif', 'jpeg'];
  //   const filetype = file.type;
  //   this.fileType = filetype;
  //   const fileExtention = this.fileType.substring(6);
  //   const fileExtentionValidation = extensionArray.findIndex(item => item === fileExtention.toLowerCase());
  //   if (fileExtentionValidation > -1) {
  //     this.uploadImageFile(this.fileBinary, type);
  //     localStorage.setItem('Image', '1');
  //     this.fileInput.nativeElement.value = "";
  //   } else {
  //     this.fileInput.nativeElement.value = "";
  //     this._snackBarService.showErrorSnackBar("Image is not a valid format.", '');
  //   }

  // }
  // /*
  //  @Type: File, <ts>
  //   @Name: system look and feel info
  //   @Who: Mukesh kumar rai
  //   @When: 26-Nov-2020
  //   @Why: ROST-403
  //   @What: use for upload image on server
  // */
  // uploadImageFile(file, type) {
  //   if (type === 'logo'){
  //     this.imagePreviewloading = true;
  //   }
  //   if (type === 'favicon'){
  //     this.imagePreviewFeviconloading = true;
  //   }
  //   const formData = new FormData();
  //   formData.append('file', file);
  //   //this.loading = true;
  //   this._systemLookFeelService.addImageUploadFile(formData).subscribe(
  //     repsonsedata => {
  //       if (type === 'logo') {
  //         this.logoImagePath = repsonsedata[0].filePathOnServer;
  //         this.logoPreviewUrl = repsonsedata[0].preview;
  //          this.imagePreviewStatus=true;
  //       }
  //       if (type === 'favicon') {
  //         this.faviconmagePath = repsonsedata[0].filePathOnServer;
  //         this.FaviconPreviewUrl = repsonsedata[0].preview;
  //          this.imagePreviewfaviconStatus=true;
  //       }

  //       this.fileInput.nativeElement.value = "";
  //       localStorage.setItem('Image', '2');
  //       this.imagePreviewloading = false;
  //       this.imagePreviewFeviconloading = false;
  //        }, err => {
  //       this._snackBarService.showErrorSnackBar("Internal Server Error Occur.", err.StatusCode);
  //       this.imagePreviewloading = false;
  //       this.imagePreviewFeviconloading = false;
  //     })
  // }
  /*
  @Type: File, <ts>
  @Name: system look and feel info
  @Who: Mukesh kumar rai
  @When: 26-Nov-2020
  @Why: ROST-403
  @What: Restore Defaout value
*/
  remove(type) {
   if (type === 'logo') {
      this.logoImagePath = '';
      this.logoPreviewUrl = '';
      this.imagePreviewStatus = false;
      // who:maneesh,what:ewm-11600 localStorage.setItem('LogoUrl','');,when:28/03/2023
      localStorage.setItem('LogoUrl','');
    }
    if (type === 'favicon') {
      this.faviconmagePath = '';
      this.FaviconPreviewUrl = '';
      this.imagePreviewfaviconStatus = false;
    }
      // who:maneesh,what:ewm-11677 for remove logo and preview if preview check on,when:03/07/2023;
    if (type === 'logo'&& this.previewChange) {
      this.logoImagePath = '';
      this.logoPreviewUrl = '';
      this.imagePreviewStatus = false;
      this.commonserviceService.onOrganizationLogo.next(this.logoPreviewUrl )
      localStorage.setItem('LogoUrl','');
    }else if(type === 'favicon'&& this.previewChange){
      this.faviconmagePath = '';
      this.FaviconPreviewUrl = '';
      localStorage.setItem('FaviconUrl', this.FaviconPreviewUrl);
      this.commonserviceService.onFavicon.next(this.FaviconPreviewUrl); 
    }
  }
  openDialog(Image): void {
    let data: any;

    data = { "title": 'title', "type": 'Image', "content": Image };

    const dialogRef = this._dialog.open(ModalComponent, {
      width: '220px',
      disableClose: true,
      data: data,
      panelClass:  ['imageModal', 'animate__animated','animate__zoomIn']
    });
    //Entire Software : Mukesh kumar Rai : 15-Sep-2020 : popup modal data return after closing modal
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  /*
  @Type: File, <ts>
  @Name: eventCheckOnClick function
  @Who: Renu
  @When: 02-Dec-2020
  @Why:  Rost-258
  @What: for show / hide preview on button click
  */

  eventCheckOnClick(event) {
    let previewChanges = <HTMLInputElement>document.getElementById("lokndkFell-preview-button");
    this.previewChange=previewChanges.checked
    this.previewChangescolor = <HTMLInputElement>document.getElementById("lokndkFell-preview-button");        
    if (previewChanges.checked) {
      this.uncheck = true;
      this.changeTheme(this.primaryBgColor, this.primaryTxtColor, this.highlightBgColor, this.highlightTxtColor)
    } else {
      this.uncheck = false;
      this.changeTheme(localStorage.getItem('HeaderBackground'), localStorage.getItem('HeaderColor'), localStorage.getItem('HighlightBackground'), localStorage.getItem('HighlightColor'));
    } 
        // who:maneesh,what:ewm:11677 for handel preview check and uncheck when logo and favicon icon upload,when:19/05/2023
   if (previewChanges.checked) {
      this.uncheck = true;
      this.commonserviceService.onOrganizationLogo.next(this.logoPreviewUrl )
      localStorage.setItem('FaviconUrl', this.FaviconPreviewUrl);
      this.commonserviceService.onFavicon.next(this.FaviconPreviewUrl)
    }else{
      this.uncheck = false;
      this.SystemLookFeelForm.patchValue({
        'LogoUrl': this.logourl,
        'FaviconUrl': this.Faviconurl,
      });
      this.commonserviceService.onOrganizationLogo.next(this.logourl )
      this.commonserviceService.onFavicon.next(this.Faviconurl)
      localStorage.setItem('FaviconUrl',this.Faviconurl);
    }
  }

  /*
  @Type: File, <ts>
  @Name: setDefaultTheme function
  @Who: Renu
  @When: 02-Dec-2020
  @Why:  Rost-258
  @What: for setting deafult theme
  */

  setDefaultTheme(event) { 
    // who:maneesh,what:ewm-12466 comment this and when click on set default button then set default color,when:18/05/2023   
    this.uncheck = false;
    this.selctedColor='#5844DA'
    this.selctedHeadercolor='#ffffff'
    this.selctedHighlightbackground='#CE0086'
    this.selectHighlightcolor='#ffffff'
    this.primaryBgColor=this.selctedColor;  
    this.primaryTxtColor  = this.selctedHeadercolor;  
    this.highlightBgColor=  this.selctedHighlightbackground;   
    this.highlightTxtColor=  this.selectHighlightcolor; 
    this.SystemLookFeelForm.patchValue({
      'Highlight_color':  this.selectHighlightcolor,
      'Highlight_background': this.selctedHighlightbackground,
      'Header_color': this.selctedHeadercolor,
      'Header_background':  this.selctedColor
    })
  }

  CheckboxChange() {
    //this.uncheck=false;
    if (this.uncheck == true) {
      this.changeTheme(this.primaryBgColor, this.primaryTxtColor, this.highlightBgColor, this.highlightTxtColor)

    } else {
      this.changeTheme(localStorage.getItem('HeaderBackground'), localStorage.getItem('HeaderColor'), localStorage.getItem('HighlightBackground'), localStorage.getItem('HighlightColor'));

    }

  }
  /*
     @Type: File, <ts>
      @Name: system look and feel info
      @Who: Priti Srivastava
      @When: 21-jan-2021
      @Why: EWM-700
      @What: use for upload image on server
    */
  uploadImageFileByUrl(type) {
    let file = '';
    if (type === 'logo') {
      this.imagePreviewloading = true;
      file = this.SystemLookFeelForm.controls.LogoTextUrl.value;
    }
    if (type === 'favicon') {
      this.imagePreviewFeviconloading = true;
      file = this.SystemLookFeelForm.controls.FaviconTextUrl.value;
    }

    let strlist = file.split('.');
    const extensionArray = ['png', 'gif', 'jpeg', 'jpg'];
    const fileExtention = strlist[strlist.length - 1];
    //const fileExtentionValidation = extensionArray.findIndex(item => item === fileExtention.toLowerCase());
    const fileExtentionValidation = extensionArray.findIndex(item => fileExtention.toLowerCase().includes(item));
    if (fileExtentionValidation < 0) {
      this.imagePreviewloading = false;
      this.imagePreviewFeviconloading = false;
      this._snackBarService.showErrorSnackBar("Image is not a valid format.", '');
      return;
    }
    const reg = '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?';
    let match = file.match(reg);
    if (match[1] == undefined) {
      this.imagePreviewloading = false;
      this.imagePreviewFeviconloading = false;
      this._snackBarService.showErrorSnackBar("URL is not in valid format.", '');
      return;
    }
    this._systemLookFeelService.addImageByUrl(file).subscribe(
      repsonsedata => {
        if (type === 'logo') {
          this.logoImagePath = repsonsedata.data[0].filePathOnServer;
          //this.logoPreviewUrl = repsonsedata[0].preview;
          this.SystemLookFeelForm.get('LogoTextUrl').setValue('');
          this.croppingImage('logo', 2, repsonsedata.data[0].preview);
          // this.imagePreviewStatus=true;

        }
        if (type === 'favicon') {
          this.faviconmagePath = repsonsedata.data[0].filePathOnServer;
          //this.FaviconPreviewUrl = repsonsedata[0].preview;
          this.SystemLookFeelForm.get('FaviconTextUrl').setValue('');
          this.croppingImage('favicon', 2, repsonsedata.data[0].preview);
          // this.imagePreviewfaviconStatus=true;
        }
        localStorage.setItem('Image', '2');
        this.imagePreviewloading = false;
        this.imagePreviewFeviconloading = false;
      }, err => {
        this._snackBarService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.imagePreviewloading = false;
        this.imagePreviewFeviconloading = false;
      })
  }
  /*
      @Type: File, <ts>
      @Name: upload Image function
      @Who: Priti Srivastava
      @When: 29-jan-2021
      @Why: EWM-681
      @What: use for upload image on server
    */

  uploadImageFileInBase64(type) {
    if (type === 'logo') {
      this.imagePreviewloading = true;
    }
    if (type === 'favicon') {
      this.imagePreviewFeviconloading = true;
    }

    const formData = { 'base64ImageString': this.croppedImage };
    this._imageUploadService.ImageUploadBase64(formData).subscribe(
      repsonsedata => {
        if (type === 'logo') {
          this.logoImagePath = repsonsedata.Data[0].FilePathOnServer;
          this.logoPreviewUrl = repsonsedata.Data[0].Preview;
          this.imagePreviewStatus = true;
        }
        if (type === 'favicon') {
          this.faviconmagePath = repsonsedata.Data[0].FilePathOnServer;
          this.FaviconPreviewUrl = repsonsedata.Data[0].Preview;
          this.imagePreviewfaviconStatus = true;
        }
        // who:maneesh,what:ewm:11677 for handel preview check and uncheck when logo and favicon icon upload,when:19/05/2023
        if (this.previewChange) {
          this.uncheck = true;
          this.commonserviceService.onOrganizationLogo.next(this.logoPreviewUrl )
          localStorage.setItem('FaviconUrl', this.FaviconPreviewUrl);
          this.commonserviceService.onFavicon.next(this.FaviconPreviewUrl)
        }
        localStorage.setItem('Image', '2');
        this.imagePreviewloading = false;
        this.imagePreviewFeviconloading = false;
      }, err => {
        this._snackBarService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.imagePreviewloading = false;
        this.imagePreviewFeviconloading = false;
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
  croppingImage(type: any, uploadMethod: any, logoPreviewUrl: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "";
    dialogConfig.width = "100%";
    dialogConfig.panelClass = ['myDialogCroppingImage', 'animate__animated','animate__zoomIn'];
    // @when:10-feb-2021 @who:priti @why:EWM-882  @What: pass data to image component to check size and type of image
    if (type === 'favicon'){
      dialogConfig.data = new Object({ type: this._appSetting.getImageTypeSmall(), size: this._appSetting.getImageSizeMedium(), uploadMethod: uploadMethod, imageData: logoPreviewUrl,ratioStatus:false , recommendedDimensionSize:true, recommendedDimensionWidth:'50',recommendedDimensionHeight:'50'});
    }
    if (type === 'logo'){
      dialogConfig.data = new Object({ type: this._appSetting.getImageTypeSmall(), size: this._appSetting.getImageSizeMedium(), uploadMethod: uploadMethod, imageData: logoPreviewUrl,ratioStatus:false , recommendedDimensionSize:true, recommendedDimensionWidth:'125',recommendedDimensionHeight:'50'});
    }
    const modalDialog = this._dialog.open(ImageUploadPopupComponent, dialogConfig);
    modalDialog.afterClosed().subscribe(res => {
      if (res.data != undefined && res.data != '') {
        this.croppedImage = res.data;
        this.uploadImageFileInBase64(type);
      }
    })
    // RTL Code
    let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }

  }


  /*
  @Type: File, <ts>
  @Name: reloadApiBasedOnorg function
  @Who: Renu
  @When: 13-Apr-2021
  @Why: EWM-1356
  @What: Reload Api's when user change organization
*/

  reloadApiBasedOnorg() {
    this.getSystemDatetimeFormats();
    this.getSystemLookFeelInfo();
  }


    /*
   @Type: File, <ts>
   @Name: changeDistanceProximity function
   @Who: Anup Singh
   @When: 26-Oct-2021
   @Why: EWM-3276 EWM-3498
   @What: For change dropdown value change i icon message
   */
  changeDistanceProximity(value){
    if(value===1){
    this.showKmMsg=true;
    }else{
      this.showKmMsg=false;
    }
  }


   /*
   @Type: File, <ts>
   @Name: getAllProximity function
   @Who: Anup Singh
   @When: 26-Oct-2021
   @Why: EWM-3276 EWM-3498
   @What: For All Proximity List
   */
  getAllProximity() {
    this.loading = true;
    this._systemLookFeelService.fetchAllProximity().subscribe(
      repsonsedata => {
        if (repsonsedata['HttpStatusCode'] == '200') {
          this.loading = false;
          this.distanceUnit = repsonsedata['Data'];
        } else {
         // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
        //this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }
  // color picker start 
/*
  @Type: File, <ts>
  @Name: showColorPallate funtion
  @Who: maneesh
  @When: 11-Mar-2023
  @Why: EWM-11124
  @What: for open color picker dropdown
*/
showColorPallate(e:any,forWhich:any) {
  if(forWhich==='headerBg'){
    this.overlayViewjob=!this.overlayViewjob;
    this.showColorPallateContainer = !this.showColorPallateContainer;
  }else if(forWhich==='Headercolor'){
    this.overlayView=!this.overlayView;
    this.showColorPallat = !this.showColorPallat;
  }
  else if(forWhich==='Highlightbackground'){
    this.overlayViewjob=!this.overlayViewjob;
    this.showColorPallatHighlightbackground = !this.showColorPallatHighlightbackground;
  }else if(forWhich==='Highlightcolor'){
    this.overlayViewjob=!this.overlayViewjob;
    this.showColorPallatHighlightcolor = !this.showColorPallatHighlightcolor;
  }
}
/*
  @Type: File, <ts>
  @Name: onSelectColor funtion
  @Who: maneesh
  @When: 11-Mar-2023
  @Why: EWM-11124
  @What: for which coor we have choose
*/
onSelectColor(codes: any,type:any) {   
  // if(codes){    
    if(codes && type==='Headerbackground'){
      this.selctedColor = codes.colorCode; 
    // who:maneesh,what:ewm-12466 for select color then check preview check box color change display this.primaryBgColor=this.selctedColor,when:18/05/2023   
      this.primaryBgColor=this.selctedColor;    
      this.SystemLookFeelForm.patchValue({
        Header_background: this.selctedColor
      })
    if (this.previewChangescolor!=undefined) {
      if (this.previewChangescolor.checked ) {
        this.uncheck = true;  
        this.changeTheme(this.selctedColor, this.primaryTxtColor, this.highlightBgColor, this.highlightTxtColor)
      } else {
        this.uncheck = false;
        this.changeTheme(localStorage.getItem('HeaderBackground'), localStorage.getItem('HeaderColor'), localStorage.getItem('HighlightBackground'), localStorage.getItem('HighlightColor'));
      } 
    }
     
     
    }else if(codes && type==='Headercolor'){
      this.selctedHeadercolor = codes.colorCode;
    // who:maneesh,what:ewm-12472 for select color then check preview check box color change display this.primaryBgColor=this.selctedColor,when:18/05/2023   
      this.primaryTxtColor  = this.selctedHeadercolor;  
      this.SystemLookFeelForm.patchValue({
        Header_color: this.selctedHeadercolor
      })
      if (this.previewChangescolor!=undefined) {
      if (this.previewChangescolor.checked) {
        this.uncheck = true;  
        this.changeTheme(this.selctedColor, this.selctedHeadercolor, this.highlightBgColor, this.highlightTxtColor)
      } else {
        this.uncheck = false;
        this.changeTheme(localStorage.getItem('HeaderBackground'), localStorage.getItem('HeaderColor'), localStorage.getItem('HighlightBackground'), localStorage.getItem('HighlightColor'));
      }
    }
    }else if(codes && type==='Highlightbackground'){
      this.selctedHighlightbackground = codes.colorCode;
    // who:maneesh,what:ewm-12472 for select color then check preview check box color change display this.primaryBgColor=this.selctedColor,when:18/05/2023   
      this.highlightBgColor=  this.selctedHighlightbackground;   
      this.SystemLookFeelForm.patchValue({
        Highlight_background: this.selctedHighlightbackground
      })
      if (this.previewChangescolor!=undefined) {
      if (this.previewChangescolor.checked) {
        this.uncheck = true;  
        this.changeTheme(this.selctedColor, this.selctedHeadercolor, this.selctedHighlightbackground, this.highlightTxtColor)
      } else {
        this.uncheck = false;
        this.changeTheme(localStorage.getItem('HeaderBackground'), localStorage.getItem('HeaderColor'), localStorage.getItem('HighlightBackground'), localStorage.getItem('HighlightColor'));
      }
    }
    }else if(codes && type==='Highlightcolor'){
      this.selectHighlightcolor = codes.colorCode;
    // who:maneesh,what:ewm-12472 for select color then check preview check box color change display this.primaryBgColor=this.selctedColor,when:18/05/2023   
      this.highlightTxtColor=  this.selectHighlightcolor;  
      this.SystemLookFeelForm.patchValue({
        Highlight_color: this.selectHighlightcolor
      })
      if (this.previewChangescolor!=undefined) {
      if (this.previewChangescolor.checked) {
        this.uncheck = true;  
        this.changeTheme(this.selctedColor, this.selctedHeadercolor, this.selctedHighlightbackground, this.selectHighlightcolor)
      } else {
        this.uncheck = false;
        this.changeTheme(localStorage.getItem('HeaderBackground'), localStorage.getItem('HeaderColor'), localStorage.getItem('HighlightBackground'), localStorage.getItem('HighlightColor'));
      }
    }
    }else if(codes===null && type==='Headerbackground'){
      this.SystemLookFeelForm.patchValue({
        Header_background: this.selctedColor
      })
      this.selctedColor = '#FFFFFF';
    
    }else if(codes===null && type==='Headercolor'){
      this.SystemLookFeelForm.patchValue({
        Header_color: this.selctedHeadercolor
      })
      this.selctedHeadercolor ='#FFFFFF';
    
    }else if(codes===null && type==='Highlightcolor'){
      this.SystemLookFeelForm.patchValue({
        Highlight_color: this.selectHighlightcolor
      })
    this.selectHighlightcolor='#FFFFFF';
    }else if(codes===null && type==='Highlightbackground'){
      this.SystemLookFeelForm.patchValue({
        Highlight_background: this.selctedHighlightbackground
      })
      this.selctedHighlightbackground='#FFFFFF';
    }
  
}
/*
  @Type: File, <ts>
  @Name: onChaneColor funtion
  @Who: maneesh
  @When: 11-Mar-2023
  @Why: EWM-11124
  @What: selecting color on change
*/
onChaneColor(e: any,type:any) {
  this.color = e.target.value;  
    if(this.selctedHighlightbackground && type==='Highlightcolor'){
      this.selectHighlightcolor = e.target.value;
       this.SystemLookFeelForm.patchValue({
        Highlight_color: this.selectHighlightcolor
  })
  if (this.previewChangescolor!=undefined) {
    if (this.previewChangescolor.checked) {
      this.uncheck = true; 
      this.changeTheme(this.selctedColor, this.selctedHeadercolor, this.selctedHighlightbackground, this.selectHighlightcolor)
    } else {
      this.uncheck = false;
      this.changeTheme(localStorage.getItem('HeaderBackground'), localStorage.getItem('HeaderColor'), localStorage.getItem('HighlightBackground'), localStorage.getItem('HighlightColor'));
    }
  }
}
if(this.selctedHighlightbackground && type==='Highlightbackground'){
  this.selctedHighlightbackground = e.target.value;

  this.SystemLookFeelForm.patchValue({
    Highlight_background: this.selctedHighlightbackground
})
if (this.previewChangescolor!=undefined) {
if (this.previewChangescolor.checked) {
 this.uncheck = true;  
 this.changeTheme(this.selctedColor, this.selctedHeadercolor, this.selctedHighlightbackground, this.selectHighlightcolor)
} else {
 this.uncheck = false;
 this.changeTheme(localStorage.getItem('HeaderBackground'), localStorage.getItem('HeaderColor'), localStorage.getItem('HighlightBackground'), localStorage.getItem('HighlightColor'));
}
}
}
if(this.selctedHighlightbackground && type==='Headerbackground'){
  this.selctedColor = e.target.value;
  this.SystemLookFeelForm.patchValue({
    Header_background: this.selctedColor
})
if (this.previewChangescolor!=undefined) {
if (this.previewChangescolor.checked) {
 this.uncheck = true;  
 this.changeTheme(this.selctedColor, this.selctedHeadercolor, this.selctedHighlightbackground, this.selectHighlightcolor)
} else {
 this.uncheck = false;
 this.changeTheme(localStorage.getItem('HeaderBackground'), localStorage.getItem('HeaderColor'), localStorage.getItem('HighlightBackground'), localStorage.getItem('HighlightColor'));
}
}
}

if(this.selctedHighlightbackground && type==='Headercolor'){
  this.selctedHeadercolor = e.target.value;
  this.SystemLookFeelForm.patchValue({
    Header_color: this.selctedHeadercolor
})
if (this.previewChangescolor!=undefined) {
if (this.previewChangescolor.checked) {
 this.uncheck = true;  
 this.changeTheme(this.selctedColor, this.selctedHeadercolor, this.selctedHighlightbackground, this.selectHighlightcolor)
} else {
 this.uncheck = false;
 this.changeTheme(localStorage.getItem('HeaderBackground'), localStorage.getItem('HeaderColor'), localStorage.getItem('HighlightBackground'), localStorage.getItem('HighlightColor'));
}
}
}
}
/*
  @Type: File, <ts>
  @Name: closeTemplate funtion
  @Who: maneesh
  @When: 11-Mar-2023
  @Why: EWM-11124
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
  @When: 11-Mar-2023
  @Why: EWM-11124
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
