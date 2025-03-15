import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { EditorComponent } from '@progress/kendo-angular-editor';
import { Subject, Subscription } from 'rxjs';
import { ImageUploadAdvancedComponent } from 'src/app/modules/EWM.core/shared/image-upload-advanced/image-upload-advanced.component';
import { ImageUploadPopupComponent } from 'src/app/modules/EWM.core/shared/image-upload-popup/image-upload-popup.component';
import { JobService } from 'src/app/modules/EWM.core/shared/services/Job/job.service';
import { QuickJobService } from 'src/app/modules/EWM.core/shared/services/quickJob/quickJob.service';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { UserAdministrationService } from 'src/app/modules/EWM.core/shared/services/user-administration/user-administration.service';
import { ImageUploadKendoEditorPopComponent } from 'src/app/shared/modal/image-upload-kendo-editor-pop/image-upload-kendo-editor-pop.component';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { ButtonTypes, ResponceData } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { ImageUploadService } from 'src/app/shared/services/image-upload/image-upload.service';
import { KendoEditorImageUploaderService } from 'src/app/shared/services/kendo-editor-image-upload/kendo-editor-image-upload.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { AlertPopupAutoFillAppResumeComponent } from './alert-popup-auto-fill-app-resume/alert-popup-auto-fill-app-resume.component';
import { OrganizationInfoComponent } from './organization-info/organization-info.component';
import { EDITOR_CONFIG } from '@app/shared/mention-editor/mention-modal';

@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss']
})
export class WelcomePageComponent implements OnInit {
  @Input() welcomeIdData: any;
  loading: boolean = false;
  welcomeForm: FormGroup;
  public headingCount: any = 150;
  public subHeadingCount: any = 250;
  public opicityData = "0.5";
  public previewImage: string = '';
  imagePreview: string;
  imagePreviewStatus: boolean;
  logoPreviewStatus: boolean = false;
  public logoPreviewloading: boolean = false;
  public imagePreviewloading: boolean = false;
  public logoPreviewUrl: string;
  public searchListUser: any = [];
  public logoImagePath: string;
  public faviconmagePath: string;
  public FaviconPreviewUrl: String;
  imagePreviewfaviconStatus: boolean;
  croppedImage: any;
  public imagePreviewFeviconloading: boolean = false;
  daxtraRegistrationCode: any;
  headingInputValue: string = '';
  subHeadingInputValue: string = '';
  defaultSubHeading: string;
  defaultHeading: string;
  public orgInfo: [] = [];
  public loadingPopup: boolean;
  public searchValue: string = "";
  public noRecordFound: boolean = false;
  public pagesize = 500;
  public pageNo = 1;
  public PreviewUrl: string;
  public seelctedRecruiter: string = '';
  public RecruiterArr: any[] = [];
  public selectedIn: any = {};
  filePathOnServer: any;
  croppedLogo: any;
  animationVar: any;
  logoAbsoluteUrl: any;
  orgAbsoluteImage: any;
  dirctionalLang;
  // public searchValue: string = "";
//  kendo image uploader Adarsh singh 01-Aug-2023
@ViewChild('editor') editor: EditorComponent;
subscription$: Subscription;
// End 
public editorConfig: EDITOR_CONFIG;
public getEditorVal: string;
ownerList: string[]=[];
public showErrorDesc: boolean = false;
public tagList:any=['jobs'];
public basic:any=[];
maxLengthEditorValue: Subject<any> = new Subject<any>();
showMaxlengthError:boolean=false;
public maxlenth:number;
getRequiredValidationMassage: Subject<any> = new Subject<any>();

  constructor(public dialog: MatDialog, private snackBService: SnackBarService, public _sidebarService: SidebarService, private _appSetting: AppSettingsService, private routes: ActivatedRoute,
    private fb: FormBuilder, private _userAdministrationService: UserAdministrationService, private quickJobService: QuickJobService,
    private _imageUploadService: ImageUploadService, private translateService: TranslateService, private _SystemSettingService: SystemSettingService,
    public _userpreferencesService: UserpreferencesService, private _KendoEditorImageUploaderService: KendoEditorImageUploaderService,
    private systemSettingService: SystemSettingService, private commonService: CommonserviceService, private jobService: JobService) {
    this.daxtraRegistrationCode = this._appSetting.daxtraRegistrationCode;
    this.welcomeForm = this.fb.group({
      Id: [0],
      ApplicationFormId: [0],
      BannerImageURL: [''],
      Heading: ['', [Validators.maxLength(150)]],
      SubHeading: ['', [Validators.maxLength(250)]],
      BannerTransparency: [100000],
      AboutUs: [''],
      IsResume: [0, [Validators.required]],
      IsCoverLetter: [0, [Validators.required]],
      IsAutoFill: [false],
      IsOrgInfo: [false],
      orgLogo: [],
      recruiter: [null],
      UserId: [],
      Email: [],
      UserName: [],
      PhoneNo: [],
      ProfileImageUrl: []
    })

    this.PreviewUrl = "/assets/user.svg";
  }

  ngOnInit(): void {

    this.recruiterList(this.searchValue);
    this.routes.queryParams.subscribe((parms: any) => {
      if (parms?.Id) {
        this.welcomeForm.patchValue({
          ApplicationFormId: parseInt(parms?.Id),
        })
        this.getWelcomePageDataById(parseInt(parms?.Id))
      }
    });

    this.sendDataToParent();
    this.animationVar = ButtonTypes;
    this.editorConfig={
      REQUIRED:false,
      DESC_VALUE:null,
      PLACEHOLDER:'label_Aboutus',
      Tag:[],
      EditorTools:[],
      MentionStatus:false,
      maxLength:0,
      MaxlengthErrormessage:false,
      JobActionComment:false
    }
  }


  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + '%';
    }

    return value;
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
@Name: getWelcomePageDataById function
@Who: Anup singh
@When: 17-05-2022
@Why: EWM-6554 EWM-6678
@What: get data
*/
  getWelcomePageDataById(ApplicationFormId: any) {
    this.loading = true;
    this.jobService.fetchWelComePageDataById('?applicationId=' + ApplicationFormId).subscribe(
      (data: any) => {
        this.loading = false;
        if (data.HttpStatusCode == 200 || data.HttpStatusCode == 204) {
          this.defaultHeading = "Experience the X Factor with Xeople";
          this.defaultSubHeading = "Empowering People through Simplification and Innovation";
          this.loading = false;
          if (data?.Data != undefined && data?.Data != null && data?.Data != '') {
            this.defaultHeading = "Experience the X Factor with Xeople";
            this.defaultSubHeading = "Empowering People through Simplification and Innovation";
            if (data?.Data?.BannerImageURL != '') {
              this.imagePreviewStatus = true;
              this.logoPreviewUrl = data?.Data?.BannerImageURL;
              this.logoAbsoluteUrl = data?.Data?.BannerImage;
            } else {
              this.welcomeForm.get('BannerTransparency').disable();
              this.imagePreviewStatus = false;
              this.logoPreviewUrl = data?.Data?.BannerImageURL;
              this.logoAbsoluteUrl = data?.Data?.BannerImage;
            }

            if (data?.Data?.OrganizationLogo == '') {
              this.getOrganizationInfo();
            } else {
              this.previewImage = data?.Data?.OrganizationlogoURL;
              this.orgAbsoluteImage = data?.Data?.OrganizationLogo;
              this.logoPreviewStatus = true;
              this.welcomeForm.patchValue({
                'orgLogo': this.orgAbsoluteImage
              })
            }

            this.welcomeForm.patchValue({
              Id: data?.Data?.Id,
              ApplicationFormId: ApplicationFormId,
              BannerImageURL: this.logoAbsoluteUrl,
              Heading: data?.Data?.Heading,
              SubHeading: data?.Data?.SubHeading,
              BannerTransparency: (data?.Data?.BannerTransparency) * 1000,
              AboutUs: data?.Data?.AboutUs,
              IsResume: data?.Data?.IsResume,
              IsCoverLetter: data?.Data?.IsCoverLetter,
              IsAutoFill: (data?.Data?.IsAutoFill == 1) ? true : false,
              UserId: data?.Data?.RecruiterId,
              Email: data?.Data?.RecruiterEmail,
              UserName: data?.Data?.RecruiterName,
              PhoneNo: data?.Data?.RecruiterPhone,
              ProfileImageUrl: data?.Data?.RecruiterProfileImage,
              IsOrgInfo: (data?.Data?.IsOrgnizationContactEnabled==1)?true:false,
              recruiter: data?.Data?.RecruiterId
             
            });
            this.getEditorVal=data?.Data?.AboutUs,
            this.seelctedRecruiter=data?.Data?.RecruiterId;
            this.headingInputValue=data?.Data?.Heading;
            this.subHeadingInputValue=data?.Data?.SubHeading;
            this.inputCountHeadingValue(this.headingInputValue);
            this.inputCountSubHeadingValue(this.subHeadingInputValue);
            this.opicityData = ((data?.Data?.BannerTransparency) / 100).toString();


            // this.selectedIn={'UserId':data?.Data?.RecruiterId}
            this.sendDataToParent();
          }
          else {
            this.welcomeForm.get('BannerTransparency').disable();
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
      })

  }

  /*
@Type: File, <ts>
@Name: sendDataToParent function
@Who: Anup singh
@When: 17-05-2022
@Why: EWM-6554 EWM-6678
@What: send form data parent to child
*/
  sendDataToParent() {
    this.commonService.configueApplicationForm.next(this.welcomeForm)
    
  }

  /*
@Type: File, <ts>
@Name: bannerImageTransparency function
@Who: Anup singh
@When: 18-05-2022
@Why: EWM-6554 EWM-6678
@What: banner Image Transparency
*/
  bannerImageTransparency() {
    this.opicityData = ((this.welcomeForm.controls['BannerTransparency'].value) / (1000 * 100)).toString();
  }

  /*
@Type: File, <ts>
@Name: inputCountHeadingValue function
@Who: Anup singh
@When: 17-05-2022
@Why: EWM-6554 EWM-6678
@What: input count for heading
*/

  inputCountHeadingValue(headingData) {
    this.headingCount = 150 - headingData.length;
    this.headingInputValue = headingData;
  }

  /*
@Type: File, <ts>
@Name: inputCountSubHeadingValue function
@Who: Anup singh
@When: 17-05-2022
@Why: EWM-6554 EWM-6678
@What: input count for sub heading
*/
  inputCountSubHeadingValue(subheadingData) {
    this.subHeadingCount = 250 - subheadingData.length;
    this.subHeadingInputValue = subheadingData;
  }


  /*
  @Type: File, <ts>
  @Name: openDialog function
  @Who: Anup singh
  @When: 17-05-2022
  @Why: EWM-6554 EWM-6678
  @What: open dialog for image
  */
  openDialog(Image): void {
    let data: any;

    data = { "title": 'title', "type": 'Image', "content": Image };

    const dialogRef = this.dialog.open(ModalComponent, {
      width: '220px',
      disableClose: true,
      data: data,
      panelClass: ['imageModal', 'animate__animated', 'animate__zoomIn']
    });
    //Entire Software : Mukesh kumar Rai : 15-Sep-2020 : popup modal data return after closing modal
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  /*
@Type: File, <ts>
@Name: remove function
@Who: Anup singh
@When: 17-05-2022
@Why: EWM-6554 EWM-6678
@What: for remove image
*/
  remove(type) {
    if (type === 'logo') {
      this.logoImagePath = '';
      this.logoPreviewUrl = '';
      this.imagePreviewStatus = false;
      this.welcomeForm.patchValue({
        BannerImageURL: this.logoAbsoluteUrl,
        BannerTransparency: 100000
      });
      this.welcomeForm.get('BannerTransparency').disable();
      this.sendDataToParent();
    }
    if (type === 'favicon') {
      this.faviconmagePath = '';
      this.FaviconPreviewUrl = '';
      this.imagePreviewfaviconStatus = false;
    }

  }


  /*
  @Type: File, <ts>
  @Name: croppingImage function
  @Who: Anup singh
  @When: 17-05-2022
  @Why: EWM-6554 EWM-6678
  @What: for cropping image
  */
  croppingImage(type: any, uploadMethod: any, logoPreviewUrl: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "";
    dialogConfig.width = "100%";
    dialogConfig.panelClass = 'myDialogCroppingImage';
    // @when:10-feb-2021 @who:priti @why:EWM-882  @What: pass data to image component to check size and type of image
    dialogConfig.data = new Object({ type: this._appSetting.getImageTypeSmall(), size: this._appSetting.getImageSizeLarge(), uploadMethod: uploadMethod, imageData: logoPreviewUrl,ratioStatus:false , recommendedDimensionSize:true,recommendedDimensionWidth:'1920',recommendedDimensionHeight:'350' });
    console.log("adds", dialogConfig.data );
    const modalDialog = this.dialog.open(ImageUploadPopupComponent, dialogConfig);
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
  @Name: uploadImageFileInBase64 function
  @Who: Anup singh
  @When: 17-05-2022
  @Why: EWM-6554 EWM-6678
  @What: for image upload
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
          this.welcomeForm.patchValue({
            BannerImageURL: this.logoImagePath,
            BannerTransparency: 50000
          });
          this.welcomeForm.get('BannerTransparency').enable();
          this.opicityData = ((this.welcomeForm.controls['BannerTransparency'].value) / (1000 * 100)).toString();
          this.sendDataToParent();
        }
        if (type === 'favicon') {
          this.faviconmagePath = repsonsedata.Data[0].FilePathOnServer;
          this.FaviconPreviewUrl = repsonsedata.Data[0].Preview;
          this.imagePreviewfaviconStatus = true;
        }

        localStorage.setItem('Image', '2');
        this.imagePreviewloading = false;
        this.imagePreviewFeviconloading = false;
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.imagePreviewloading = false;
        this.imagePreviewFeviconloading = false;
      })
  }


  /*
  @Type: File, <ts>
  @Name: inputCountSubHeadingValue function
  @Who: Anup singh
  @When: 18-05-2022
  @Why: EWM-6554 EWM-6678
  @What: check dextra enable if enabel then toggle enable
  */
  onChangeToggleOrg(event) {
    if (event?.checked == true) {
      this.welcomeForm.patchValue({
        IsOrgInfo: true,
      });
    } else {
      this.welcomeForm.patchValue({
        IsOrgInfo: false,
      });
    }
    this.sendDataToParent();
  }
  visibilityStatusFordaxtra: boolean
  applicationFromResume(isResume) {
    if (isResume?.checked == true) {
      this.loading = true;
      this._SystemSettingService.getIntegrationCheckstatus(this.daxtraRegistrationCode).subscribe(
        (repsonsedata: any) => {
          if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
            this.loading = false;
            if (repsonsedata.Data) {
              this.visibilityStatusFordaxtra = repsonsedata.Data?.Connected;
              if (this.visibilityStatusFordaxtra == true) {
                this.welcomeForm.patchValue({
                  IsAutoFill: true,
                });
              } else {
                this.openModelForapplicationFromResumeAlert();
                this.welcomeForm.patchValue({
                  IsAutoFill: false,
                });
              }

            }
          } else {
            this.loading = false;
            // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          }
        }, err => {
          this.loading = false;
          //this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        })
    }

  }


  /*
  @Type: File, <ts>
  @Name: openModelForapplicationFromResumeAlert function
  @Who: Anup singh
  @When: 18-05-2022
  @Why: EWM-6554 EWM-6678
  @What: open for alert 
  */
  openModelForapplicationFromResumeAlert() {
    const dialogRef = this.dialog.open(AlertPopupAutoFillAppResumeComponent, {
      //  data: new Object({ Id: value.Id, clientId:this.data?.clientId}),
      panelClass: ['custom-modalbox', 'resumeParse', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
      maxWidth: "350px",
    });
    dialogRef.afterClosed().subscribe(res => {
      this.welcomeForm.patchValue({
        IsAutoFill: false,
      });
    });
  }

  /*
 @Type: File, <ts>
 @Name: getOrganizationInfo
 @Who: Renu
 @When: 04-Oct-2022
 @Why: ROST-8902 EWM-9111
 @What: for organization info
 */
getOrganizationInfo(){
  this._userAdministrationService.getOrganizationById(localStorage.getItem('OrganizationId')).subscribe(
    (data: any) => {
      this.loading = false;
      if (data.HttpStatusCode === 200) {
        // this.openOrgInfoModal(data.Data);
       this.orgInfo=data.Data;
       if(this.previewImage=='' && data.Data?.PrviewUrl){
        this.previewImage=data.Data?.PrviewUrl;
        this.orgAbsoluteImage=data?.Data?.PrviewUrl;
        this.logoPreviewStatus=true;
        this.welcomeForm.patchValue({
          'orgLogo':  data.Data?.LogoPath
        })
       }
        
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
   @Name: openOrgInfoModal
   @Who: Renu
   @When: 04-Oct-2022
   @Why: ROST-8902 EWM-9111
   @What: for organization info details
   */

  openOrgInfoModal() {
    this.getOrganizationInfo();
    setTimeout(() => {
      const dialogRef = this.dialog.open(OrganizationInfoComponent, {
        data: new Object({ orgInfo: this.orgInfo }),
        panelClass: ['xeople-modal', 'schedule-overflow', 'AddSchedule', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe((res) => {
        if (res.isSchedule == true) {

        }
      })
      // RTL Code
      let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }
    }, 500);

  }
  /*
 @Type: File, <ts>
 @Name: removeLogo
 @Who: Renu
 @When: 14-April-2022
 @Why: ROST-1732 EWM-5427
 @What: for remove org logo
 */


  removeLogo() {
    this.previewImage = '';
    this.logoPreviewStatus = false;
    this.welcomeForm.patchValue({
      'orgLogo': ''
    })
  }
  /*
 @Type: File, <ts>
 @Name: croppingImage
 @Who: Renu
 @When: 14-April-2022
 @Why: ROST-1732 EWM-5427
 @What: for cropping image logo
 */

  croppinglogo(uploadMethod: any, logoPreviewUrl: any) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "";
    dialogConfig.width = "100%";
    dialogConfig.panelClass = 'myDialogCroppingImage';
    dialogConfig.data = new Object({ type: this._appSetting.getImageTypeSmall(), size: this._appSetting.getImageSizeSmall(), uploadMethod: uploadMethod, imageData: logoPreviewUrl, title: 'Add Logo', ratioStatus:false , recommendedDimensionSize:true, recommendedDimensionWidth:'250',recommendedDimensionHeight:'70' });

    const modalDialog = this.dialog.open(ImageUploadAdvancedComponent, dialogConfig);
    modalDialog.afterClosed().subscribe(res => {
      if (res != undefined && res.data != undefined && res.data != '') {
        this.logoPreviewStatus = true;
        //  this.previewImage = res.data;
        this.croppedLogo = res.data;

        this.uploadLogoBase64();

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
   @Name: recruiterList()
   @Who: Renu
   @When: 08-Oct-2022
   @Why: EWM-8902 EWM-9112
   @What: get the recruiter list 
  */
  recruiterList(inputValue) {

    this.loadingPopup = true;
    //Why:change the api for EWM.9579 ,who:maneesh ,when:01/12/2022
    // this.quickJobService.fetchUserInviteListOnbasisSearch(this.pagesize, this.pageNo, this.searchValue).subscribe(

    this.systemSettingService.getAllEmployeeList(inputValue).subscribe(
      (repsonsedata: any) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.loadingPopup = false;
          this.searchListUser = repsonsedata.Data;
          this.noRecordFound = false;

        } else if (repsonsedata.HttpStatusCode === 204) {
          this.loadingPopup = false;
          this.searchListUser = repsonsedata.Data;;
          this.noRecordFound = true;

        }
        else if (repsonsedata.HttpStatusCode === 400 && repsonsedata.Data == null) {
          this.loadingPopup = false;
          this.noRecordFound = false;
          this.searchListUser = [];
        }
        else {
          this.loadingPopup = false;
          this.noRecordFound = false;

        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loadingPopup = false;
        this.noRecordFound = false

      })
  }

 /*
   @Type: File, <ts>
    @Name: AddRecruiter
    @Who: Bantee
    @When: 31-Jan-2023
    @Why: EWM-10338 EWM-10343
    @What: adding recruiter from the dropdown
  */

  //@When: 02-12-2022 @who:maneesh @why: EWM-9573 what:change the key 

  AddRecruiter(Id: any) {
    if (Id == '' || Id == undefined) {
      this.welcomeForm.patchValue({
        'recruiter': null
      })
    } else {
      const selectedRecruiter = this.searchListUser?.filter(x => x.Id == Id);

      this.welcomeForm.patchValue({
        'UserId': selectedRecruiter[0].Id,
        'Email': selectedRecruiter[0].Email,
        'UserName': selectedRecruiter[0].Name,
        'PhoneNo': selectedRecruiter[0].PhoneNumber,
        'ProfileImageUrl': selectedRecruiter[0].ProfilePicturePreview


      })
    }



    this.sendDataToParent();
  }

  /*
@Who: Renu
@When: 28-june-2021
@Why: EWM-1895
@What: to compare objects selected
*/
  compareFn(c1: any, c2: any): boolean {
    return c1 && c2 ? c1.UserId === c2.UserId : c1 === c2;
  }

  uploadLogoBase64() {
    this.logoPreviewloading = true;
    if (this.croppedLogo) {
      const formData = { 'base64ImageString': this.croppedLogo };
      // this._imageUploadService.ImageUploadBase64(formData).subscribe(
      // repsonsedata => {
      this.logoPreviewStatus = true;
      localStorage.setItem('Image', '2');
      let result = this._imageUploadService.uploadByUrlMethod(this.croppedLogo, 1);
      result.subscribe((res: any) => {
        if (res) {
          this.logoPreviewloading = false;
          this.previewImage = res?.imagePreview;
          this.filePathOnServer = res?.filePathOnServer;
          this.welcomeForm.get('orgLogo').setValue(this.filePathOnServer);
          this.sendDataToParent();
        } else {
          this.logoPreviewloading = false;
        }
      }, err => {
        //this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

        this.logoPreviewloading = false;
      })
      // }) 
    } else {

      this.logoPreviewloading = false;
    }

  }
  /*
 @Type: File, <ts>
 @Name: sortName
 @Who: Renu
 @When: 09-Oct-2021
 @Why: EWM-8902 EWM-9112
 @What: To get short name if user profile image not present
 */
  sortName(fisrtName, lastName) {
    if (fisrtName || lastName) {
      const Name = fisrtName + lastName;
      const ShortName = Name.split(/\s/).reduce((response, word) => response += word.slice(0, 1), '');
      return ShortName.toUpperCase();
    }
  }

  /*
  @Type: File, <ts>
  @Name: openImageUpload function
  @Who: Adarsh singh
  @When: 1-Aug-2023
  @Why: EWM-13233
  @What: open modal for set image in kendo editor
*/  
 openImageUpload(): void {
  const dialogRef = this.dialog.open(ImageUploadKendoEditorPopComponent, {
    data: new Object({ type: this._appSetting.imageUploadConfigForKendoEditor['file_img_type_small'], size: this._appSetting.imageUploadConfigForKendoEditor['file_img_size_small'] }),
    panelClass: ['myDialogCroppingImage', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
    width: '100%'
  });
   dialogRef.afterClosed().subscribe(res => {
     if (res.data != undefined && res.data != '') {
       this.loading = true;
       if (res.event === 1) {
        this.subscription$ = this._KendoEditorImageUploaderService.uploadImageFileInBase64(res.data).subscribe(res => {
           this.editor.exec('insertImage', res);
            this.loading = false;
         })
       }
       else {
        this.subscription$ = this._KendoEditorImageUploaderService.getImageInfoByURL(res.uploadByUrl).subscribe(res => {
           this.editor.exec('insertImage', res);
           this.loading = false;
         })
       }
     }
   })
}

ngOnDestroy(){
  this.subscription$?.unsubscribe();
}
//who:maneesh,what:ewm-16207 ewm-16358 for new speech editor,when:14/03/2024
getEditorFormInfo(event) {
  this.ownerList = event?.ownerList;
  const sources = event.val?.match(/<img [^>]*src="[^"]*"[^>]*>/gm)
  ?.map(x => x?.replace(/.*src="([^"]*)".*/, '$1'));
  //  if(sources == undefined && event?.val==null ){
  //   this.editConfigRequired();
  //   this.showMaxlengthError=true;
  //   this.welcomeForm.get('AboutUs').setValue('');
  //   this.welcomeForm.get('AboutUs').setValidators([Validators.required]);
  //   this.welcomeForm.get('AboutUs').updateValueAndValidity();
  //   this.welcomeForm.get("AboutUs").markAsTouched();
  //   this.sendDataToParent();
  // }
  // else if(sources == undefined && event?.val==''){
  //   this.editConfigRequired();
  //   this.showMaxlengthError=true;
  //   this.welcomeForm.get('AboutUs').setValue('');
  //   this.welcomeForm.get('AboutUs').setValidators([Validators.required]);
  //   this.welcomeForm.get('AboutUs').updateValueAndValidity();
  //   this.welcomeForm.get("AboutUs").markAsTouched();
  //   this.sendDataToParent();
  // }else if(sources != undefined && event?.val!=''){
  //   this.showMaxlengthError=false;
  //   this.welcomeForm.get('AboutUs').setValue(event?.val);
  //   this.welcomeForm.get('AboutUs').clearValidators();
  //   this.welcomeForm.get('AboutUs').markAsPristine(); 
  //   this.sendDataToParent();
  // }else if(event?.val!=''){
  //   this.showMaxlengthError=false;
  //   this.welcomeForm.get('AboutUs').setValue(event?.val);
  //   this.welcomeForm.get('AboutUs').clearValidators();
  //   this.welcomeForm.get('AboutUs').markAsPristine();
  //   this.sendDataToParent();
  // }
  this.showMaxlengthError=false;
    this.welcomeForm.get('AboutUs').setValue(event?.val);
    this.welcomeForm.get('AboutUs').clearValidators();
    this.welcomeForm.get('AboutUs').markAsPristine();
    this.sendDataToParent();
}


getEditorImageFormInfo(event){
  const sources = event.val?.match(/<img [^>]*src="[^"]*"[^>]*>/gm)
  ?.map(x => x?.replace(/.*src="([^"]*)".*/, '$1'));
  this.showMaxlengthError=false;
//   if(sources == undefined && event?.val==null ){
//   this.editConfigRequired();
//   this.showMaxlengthError=true;
//   this.welcomeForm.get('AboutUs').setValue('');
//   this.welcomeForm.get('AboutUs').setValidators([Validators.required]);
//   this.welcomeForm.get('AboutUs').updateValueAndValidity();
//   this.welcomeForm.get("AboutUs").markAsTouched();
//   this.sendDataToParent();

// }
// else if(sources == undefined && event?.val==''){
//   this.editConfigRequired();
//   this.showMaxlengthError=true;
//   this.welcomeForm.get('AboutUs').setValue('');
//   this.welcomeForm.get('AboutUs').setValidators([Validators.required]);
//   this.welcomeForm.get('AboutUs').updateValueAndValidity();
//   this.welcomeForm.get("AboutUs").markAsTouched();
//   this.sendDataToParent();

// }else if(sources != undefined && event?.val!=''){
//   this.showMaxlengthError=false;
//   this.welcomeForm.get('AboutUs').setValue(event?.val);
//   this.welcomeForm.get('AboutUs').clearValidators();
//   this.welcomeForm.get('AboutUs').markAsPristine();
//   this.sendDataToParent();
// }else if(event?.val!=''){
//   this.showMaxlengthError=false;
//   this.welcomeForm.get('AboutUs').setValue(event?.val);
//   this.welcomeForm.get('AboutUs').clearValidators();
//   this.welcomeForm.get('AboutUs').markAsPristine();
//   this.sendDataToParent();
// }
this.showMaxlengthError=false;
  this.welcomeForm.get('AboutUs').setValue(event?.val);
  this.welcomeForm.get('AboutUs').clearValidators();
  this.welcomeForm.get('AboutUs').markAsPristine();
  this.sendDataToParent();
}
editConfigRequired(){
  this.editorConfig={
    REQUIRED:false,
    DESC_VALUE:null,
    PLACEHOLDER:'label_Aboutus',
    Tag:[],
    EditorTools:[],
    MentionStatus:false,
    maxLength:0,
    MaxlengthErrormessage:false,
    JobActionComment:false
  }
    this.getRequiredValidationMassage.next(this.editorConfig);
    this.welcomeForm.get('AboutUs').updateValueAndValidity();
    this.welcomeForm.get("AboutUs").markAsTouched();

}
}
