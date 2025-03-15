import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonTypes, ResponceData, Userpreferences } from 'src/app/shared/models';
import { ClientService } from '../../shared/services/client/client.service';
import { ContactHeaderData } from 'src/app/shared/models/contact';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { QuickAddContactComponent } from '../../shared/quick-modal/quick-add-contact/quick-add-contact.component';
import { ContactSummaryComponent } from './contact-summary/contact-summary.component';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { ImageUploadPopupComponent } from '../../shared/image-upload-popup/image-upload-popup.component';
import { ProfileInfoService } from '../../shared/services/profile-info/profile-info.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { TranslateService } from '@ngx-translate/core';
import { ShortNameColorCode } from 'src/app/shared/models/background-color';
import { ModalComponent } from 'src/app/shared/modal/modal.component';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SystemSettingService } from '../../shared/services/system-setting/system-setting.service';
import { MatSidenav } from '@angular/material/sidenav';
import { JobSMSComponent } from '../../job/job/job-sms/job-sms.component';
import { NewEmailComponent } from '../../shared/quick-modal/new-email/new-email.component';
import { CandidateService } from '../../shared/services/candidates/candidate.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ShareContactComponent } from '../../shared/quick-modal/share-contact/share-contact.component';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { CommonServiesService } from '@app/shared/services/common-servies.service';
import { AlertDialogComponent } from '@app/shared/modal/alert-dialog/alert-dialog.component';
import { UserpreferencesService } from '@app/shared/services/commonservice/userpreferences.service';
 

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.scss']
})
export class ContactDetailComponent implements OnInit {
  contactId: string;
  loading: boolean;
  contactHeaderData: ContactHeaderData;
  positionMatTab: any;
  animationVar: any;
  @ViewChild('contactInfoData') contactInfoData: ContactSummaryComponent
  dirctionalLang;
  imagePreviewloading: boolean;
  profileImagePreview: string;
  profileImage: string;
  imagePreviewStatus: boolean;
  background10: any;
  background20: any;
  background30: any;
  background80: any;
  isOpen: boolean = true;
  addressLoader: boolean;
  dataTotalJob:number;
  public ActiveMenu: string;
  public   SMSHistory: any=[];
  candidateIdData: string;
  contactDetails: any;
  ContactSmsHistroyId: string;
  @ViewChild('smsHistoryDrawer') public smsHistoryDrawer: MatSidenav;
  burstSMSRegistrationCode: string;
  isSMSStatus: boolean;
  valuedata:boolean=false;
  public userType='CONT';
  public ConTactPhoneNumber:any=[];
  public sms:boolean=false;
  public contactPhone:number;
  candidateDetails: any;
  isSmsHistoryForm: boolean = false;
  smsHistoryToggel: boolean;
  quickFilterToggel: boolean;
  contactIdData:string;
  callDataCount:number;
  destroy$: Subject<boolean> = new Subject<boolean>();
  ContactIdString:string;
  ContactIdName: any;
  PhoneNo: any;
  ShortName:string;
  eohRegistrationCode: string;
  public IsEOHIntergrated: boolean=false;
  extractEnableCanCheck: number=0;
  brandAppSetting: any=[];
  EOHLogo: any;
  onSynchedClientData:any=[];
  tabType: string='summary';
  public userpreferences: Userpreferences;
  constructor(private clientService: ClientService, private routes: ActivatedRoute,
    private commonserviceService: CommonserviceService,private commonServiesService: CommonServiesService,
    public dialogModel: MatDialog, private appSettingsService: AppSettingsService,
    private _profileInfoService: ProfileInfoService, private snackBService: SnackBarService,
    private translateService: TranslateService, private route: Router,public _sidebarService: SidebarService,
    private systemSettingService: SystemSettingService, public dialog: MatDialog, public candidateService: CandidateService,public _userpreferencesService: UserpreferencesService) {
    this.burstSMSRegistrationCode = this.appSettingsService?.burstSMSRegistrationCode;
    this.eohRegistrationCode = this.appSettingsService.eohRegistrationCode;
    this.brandAppSetting = this.appSettingsService.brandAppSetting;
    this.routes.queryParams.subscribe((value) => {
      this.contactId = value?.ContactId;       
      this.ContactIdString = value?.ContactIdString; 
      this.ContactIdName = value?.ContactName; 
      this.PhoneNo = value?.PhoneNo; 
      this.ShortName = value?.ShortName; 
      sessionStorage.setItem('ContactCallShortName',this.ShortName ); //by maneesh
      sessionStorage.setItem('ContactCallPhoneNo',this.PhoneNo ); //by maneesh      
      sessionStorage.setItem('ContactCallcontactId',this.ContactIdString ); //by maneesh   
      sessionStorage.setItem('ContactCallContactIdName',this.ContactIdName ); //by maneesh 
      localStorage.setItem('contactIdForNUmberTyp',this.contactId ); //by maneesh           
    });
    this.getCandidateSummaryList();
  }

  ngOnInit(): void {
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    let URL = this.route.url;
    let URL_AS_LIST;
    if (URL.substring(0, URL.indexOf("?")) == '') {
      URL_AS_LIST = URL.split('/');
    } else {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }
    this.ActiveMenu = URL_AS_LIST[3];
    this._sidebarService.searchEnable.next('1');

    this._sidebarService.activeCoreRouteObs.next(URL_AS_LIST[2]);

    this._sidebarService.subManuGroup.next(URL_AS_LIST[3]);
    this._sidebarService.activesubMenuObs.next(URL_AS_LIST[4]);
    this._sidebarService.activesubMenuObs.next('contact-list');
    this.routes.queryParams.subscribe((value) => {
      this.contactId = value?.ContactId;
    });
    this.commonserviceService.onUserLanguageDirections.subscribe(res => {
      this.positionMatTab = res;
    });
    this.animationVar = ButtonTypes;
    let primaryColor = document.documentElement.style.getPropertyValue('--primary-color');
    this.background20 = this.hexToRGB(primaryColor, 0.20);

    let otherIntegrations = JSON.parse(localStorage.getItem('otherIntegrations'));
    let EOHIntegrationSubscribe = JSON.parse(localStorage.getItem('EOHIntegration'));
    let eohRegistrationCode=otherIntegrations?.filter(res=>res?.RegistrationCode==this.eohRegistrationCode);
    this.IsEOHIntergrated =  eohRegistrationCode[0]?.Connected;
    this.extractEnableCanCheck= EOHIntegrationSubscribe?.contactExtractEnable;
    const filteredBrands = this.brandAppSetting?.filter(brand => brand?.Xeople === 'Xeople');
    this.EOHLogo=filteredBrands[0]?.logo;

    this.getIntegrationCheckSMSstatus(); 
    this.commonserviceService?.getcontactsmsHistroy?.subscribe(res => {
      // this.contactHeaderData=res; 
      if (res==true) {
        this.getCandidateSummaryList();      
      }     
     }) 
     this.commonserviceService.countRefreshForContact.subscribe(res => {
      if (res?.contact==true) {
      this.countVxtCall(res?.contactId);     
      }
    });
  }
// who:maneesh,what:ewm-16064 for open get sms ,when:27/02/2024
  getSMSHistory() {
    this.loading = true;
    this.systemSettingService.getSMSHistory('?Id='+this.contactHeaderData?.Id+'&UserType='+this.userType).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata.HttpStatusCode === 200) {
          this.SMSHistory = repsonsedata.Data;          
          this.loading = false;
        }else if(repsonsedata.HttpStatusCode === 204){
          this.SMSHistory = [];
          this.loading = false;
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.loading = false;
        }
      })
  
  }
  hexToRGB(hex, alpha) {
    var r = parseInt(hex.slice(1, 3), 16),
      g = parseInt(hex.slice(3, 5), 16),
      b = parseInt(hex.slice(5, 7), 16);
    if (alpha) {
      return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
      return "rgb(" + r + ", " + g + ", " + b + ")";
    }
  }


  toggle() {
    this.isOpen = !this.isOpen;
  }


  dataUpdateAddress(value) {
    this.valuedata=value;
    if (value == true) {
      this.getCandidateSummaryList();
    }
  }

  getCandidateSummaryList() {
    this.loading = true;
    this.clientService.getContactSummaryHeader(this.contactId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
          this.contactHeaderData = repsonsedata.Data;    
          localStorage.removeItem('ContactCallLogData');
          sessionStorage.setItem('ContactCallLogDatass',JSON.stringify(repsonsedata?.Data) ); //by maneesh           
          if (this.contactHeaderData?.Id!=null) {
            this.sms=true; 
            this.ConTactPhoneNumber = repsonsedata.Data;            
            this.contactPhone=this.ConTactPhoneNumber?.PhoneNumber;
            // sessionStorage.setItem('contactPhone',this.contactPhone ); //by maneesh           
            this.commonserviceService?.getcontactsms.next(this.contactHeaderData);
            localStorage.setItem('ContactCallLogData',JSON.stringify(repsonsedata?.Data) ); //by maneesh
            this.commonserviceService?.getContactDataForRedirect.next(localStorage.setItem('ContactCallLogData',JSON.stringify(repsonsedata?.Data) ));
            this.getSMSHistory();
            // this.countVxtCall(this.contactHeaderData?.Id);
           } 
          const pageTitle= 'label_Menucontacts';
          const subpageTitle = ' | ' +this.contactHeaderData.Name;
          this.commonserviceService.setTitle(pageTitle, subpageTitle);
          this.loading = false;
        }
      }, err => {
        this.loading = false;
      })
  }


  editContactInfoModal() {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialogModel.open(QuickAddContactComponent, {
      data: new Object({ contactId: this.contactId, pageName: 'contact',ContactIdString:this.ContactIdString }),
      panelClass: ['xeople-modal-lg', 'quickAddContact', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == true) {
        this.contactInfoData.getContactPersonalDetails();
        this.contactInfoData.getContactAddressDetails();
        this.getCandidateSummaryList();
      } else {
      }
    })

    // RTL Code
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }

    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.add("is-blurred");
    }
  }




  croppedImage: string = '';
  croppingImage() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.id = "modal-component";
    dialogConfig.height = "";
    dialogConfig.width = "100%";
    dialogConfig.panelClass = 'myDialogCroppingImage';
    dialogConfig.data = new Object({ type: this.appSettingsService.getImageTypeSmall(), size: this.appSettingsService.getImageSizeMedium(), ratioStatus:true , recommendedDimensionSize:true, recommendedDimensionWidth:'700',recommendedDimensionHeight:'700' });
    const modalDialog = this.dialogModel.open(ImageUploadPopupComponent, dialogConfig);
    modalDialog.afterClosed().subscribe(res => {
      if (res.data != undefined && res.data != '') {
        this.croppedImage = res.data;
        this.uploadImageFileInBase64();
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


  uploadImageFileInBase64() {
    this.imagePreviewloading = true;
    const formData = { 'base64ImageString': this.croppedImage };
    this._profileInfoService.ImageUploadBase64(formData).subscribe(
      repsonsedata => {
        this.profileImagePreview = "";
        this.profileImage = '';
        this.imagePreviewStatus = false;
        this.profileImage = repsonsedata.Data[0].FilePathOnServer;
        this.profileImagePreview = repsonsedata.Data[0].Preview;
        this.updateContactImage(this.profileImage)
        if (!this.profileImagePreview) {
          this.profileImagePreview = "/assets/user.svg";
        } else {
          this.profileImagePreview;
        }
        localStorage.setItem('Image', '2');
        this.imagePreviewloading = false;
      }, err => {
        //this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.imagePreviewloading = false;
      })
  }


  updateContactImage(profileImage) {
    this.loading = true;
    let imageUpdateObj = {}
    imageUpdateObj['Image'] = profileImage;
    imageUpdateObj['Id'] = Number(this.contactId);

    this.clientService.updateContactImage(imageUpdateObj).subscribe(
      repsonsedata => {
        this.loading = false;
        if (repsonsedata.HttpStatusCode == 200) {
          this.loading = false;
          this.getCandidateSummaryList();
          this.snackBService.showSuccessSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);
        } else {
          this.loading = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.Httpstatuscode);

        }
      }, err => {
        // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        this.loading = false;
      })

  }


  getBackgroundColor(shortName) {
    if (shortName?.length > 0) {
      return ShortNameColorCode[shortName[0]?.toUpperCase()]
    }
  }

  openDialog(Image): void {
    let data: any;
    data = { "title": 'title', "type": 'Image', "content": Image };
    const dialogRef = this.dialogModel.open(ModalComponent, {
      width: '220px',
      disableClose: true,
      data: data,
      panelClass: ['imageModal', 'animate__animated', 'animate__zoomIn']
    });
    dialogRef.afterClosed().subscribe(result => {
    });
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



  deleteContact() {
    // let contactId = {}
    // contactId['id'] = this.contactId;
    const message = 'label_titleDialogContent';
    const title = 'label_deleteEmp';
    const subTitle = 'label_asCandidate';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialogModel.open(DeleteConfirmationComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult == true) {
        this.clientService.deleteContact(this.contactId).subscribe(
          (data: ResponceData) => {
            if (data.HttpStatusCode === 200) {
              this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
              this.route.navigate(['./client/cont/contacts/contact-list']);
            } else if (data.HttpStatusCode === 400) {
              this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
            } else {
              this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
            }
          }, err => {
            if (err.StatusCode == undefined) {
              this.loading = false;
            }
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          })
      }
    });

    // RTL Code
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }

  }



  fetchDataFromSMSHistory(event){
    if(event){
    this.smsHistoryToggel = false;
    this.quickFilterToggel=true;
      this.smsHistoryDrawer.close();
    }
  }
// who:maneesh,what:ewm-16064 for open send sms ,when:27/02/2024
  openJobSMSForCandidate(can) {
    let dataItemObj = {};
    dataItemObj['PhoneNumber'] = this.contactHeaderData?.PhoneNo;
    dataItemObj['Name'] = this.contactHeaderData?.Name;
    dataItemObj['CandidateId'] = this.contactHeaderData?.Id;
    dataItemObj['PhoneCode'] = this.contactHeaderData?.PhoneCode;
    const dialogRef = this.dialog.open(JobSMSComponent, {
      data: new Object({ jobdetailsData: this.contactHeaderData,UserType:this.userType}),
      panelClass: ['xeople-modal', 'JobSMSForCandidate', 'JobSMSForCandidate', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {  
        this.getSMSHistory();
      }
      this.loading = false;
      this.smsHistoryToggel = false;
      this.quickFilterToggel=true;
    })
    let dir: string;
      dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
      let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
      for (let i = 0; i < classList.length; i++) {
        classList[i].setAttribute('dir', this.dirctionalLang);
      }
  }


getIntegrationCheckSMSstatus() {
  this.systemSettingService.getIntegrationCheckstatus(this.burstSMSRegistrationCode).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {

        if (repsonsedata.Data) {
          this.isSMSStatus = repsonsedata.Data?.Connected;  
        }
      } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
      }
    }, err => {
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}

// who:maneesh,waht:ewm-16066 for send email,when:29/02/2024
openNewEmailModal(ContactId: string,email: string) {
  const message = ``;
  const title = 'label_disabled';
  const subtitle = 'label_securitymfa';
  const dialogData = new ConfirmDialogModel(title, subtitle, message);
  const dialogRef = this.dialog.open(NewEmailComponent, {
    maxWidth: "750px",
    width: "95%",
    height: "100%",
    maxHeight: "100%",
    data: { 'contactEmail': true, 'openType': localStorage.getItem('emailConnection'), 'candidateMail': email, openDocumentPopUpFor: 'Contact', isBulkEmail: false,'candidateId':ContactId },
    panelClass: ['quick-modalbox', 'quickNewEmailModal', 'animate__animated', 'animate__slideInRight'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(dialogResult => {
  })

}
// <!-- who:maneesh,what:ewm-16561 for open chat histry overly  smsHistoryDetails,when:28/03/2024 -->
smsHistoryDetails(can) {  
  this.contactPhone=can?.PhoneNumber; //who:maneesh as discuss with ankit rajput sir this line use for send sms btn enabel and disable
  this.contactIdData = can?.Id;
  this.getSMSHistory();
  this.smsHistoryToggel = true;
  this.quickFilterToggel=false;
  setTimeout(() => {
    this.openDrawer(can);
  }, 1000);
}

openDrawer(can){
  setTimeout(() => {
    if(this.SMSHistory.length>0){
      this.smsHistoryDrawer.open();
      this.isSmsHistoryForm = true;
      this.contactIdData = can?.Id;
      let dataItemObj = {};
  dataItemObj['PhoneNumber'] = can?.PhoneNumber;
  dataItemObj['Name'] = can?.Name;
  dataItemObj['CandidateId'] = can?.Id;
  dataItemObj['PhoneCode'] = can?.PhoneCode;
  can=dataItemObj;
       this.candidateDetails = can;
    }else{
      this.openJobSMSForCandidate(can)
    }
  }, 1500);
}

toggleDrawer(start: any) {
  localStorage.removeItem('selectEmailTemp');
  this.smsHistoryToggel = false;
  this.quickFilterToggel=true;
  start.toggle();
}


//by maneesh for vxt count
countVxtCall(Id) {
this.candidateService.countVxtCall("?id=" + Id + "&usertype=" + 'CONT').pipe(takeUntil(this.destroy$)).subscribe(
   (repsonsedata: ResponceData) => {
     if (repsonsedata.HttpStatusCode === 200) {
       this.loading = false;
       this.callDataCount =  repsonsedata.Data;
     } else if (repsonsedata.HttpStatusCode === 204) {
       this.callDataCount =  repsonsedata.Data;
       this.loading = false;
     } else {
       //  this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
       this.loading = false;
     }
   }, err => {
     this.loading = false;
     // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
   })
}
shareContactModal(){
  if(this.contactHeaderData?.EOHId !==null && this.contactHeaderData?.EOHId !==''){
    const message = this.contactHeaderData?.Name +' '+this.translateService.instant('label_ShareContactEOHAlreadyPush')+this.contactHeaderData?.EOHId;
    const title = ''
    const subTitle = '';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialog.open(AlertDialogComponent, {
      maxWidth: "350px",
      data: {dialogData, isButtonShow: true},
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    }else{
      const message = ``;
      const title = 'label_disabled';
      const subtitle = 'label_securitymfa';
      const dialogData = new ConfirmDialogModel(title, subtitle, message);
      const dialogRef = this.dialogModel.open(ShareContactComponent, {
        data: new Object({ contactId: this.contactId, pageName: 'contact',ContactIdString:this.ContactIdString,onSynchedClientData:this.onSynchedClientData,tabType:this.tabType}),
        panelClass: ['xeople-modal', 'share-contact-eoh', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res == true) {
          this.contactInfoData.getContactPersonalDetails();
          this.contactInfoData.getContactAddressDetails();
          this.getCandidateSummaryList();
        }
      })
  }
     // RTL Code
     let dir: string;
     dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
     let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
     for (let i = 0; i < classList.length; i++) {
       classList[i].setAttribute('dir', this.dirctionalLang);
     }
}

onSynchedClient(value){
  this.onSynchedClientData=value;
}

onTabChange(event: MatTabChangeEvent) {
  this.tabType=event?.tab?.textLabel;
}
redirectOnMarketPlace(){
  this.route.navigateByUrl(this.commonServiesService.getIntegrationRedirection(this.eohRegistrationCode))
}  
alertDialog(){
  const message = this.translateService.instant('label_ContactEOHAlert');
  const title = ''
  const subTitle = '';
  const dialogData = new ConfirmDialogModel(title, subTitle, message);
  const dialogRef = this.dialog.open(AlertDialogComponent, {
    maxWidth: "350px",
    data: {dialogData, isButtonShow: true},
    panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });

}
}
