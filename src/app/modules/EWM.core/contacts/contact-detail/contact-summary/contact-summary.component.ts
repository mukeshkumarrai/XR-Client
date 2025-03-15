import { Component, ElementRef, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { ButtonTypes, ResponceData, SCREEN_SIZE } from 'src/app/shared/models';
import { AddressData, PersonalData } from 'src/app/shared/models/contact';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { QuickAddContactComponent } from '../../../shared/quick-modal/quick-add-contact/quick-add-contact.component';
import { ClientService } from '../../../shared/services/client/client.service';
import { ContactAddressComponent } from './contact-address/contact-address.component';
import { ContactPersonalInfoComponent } from './contact-personal-info/contact-personal-info.component';
import { ShortNameColorCode } from '@app/shared/models/background-color';
import { JobSMSComponent } from '@app/modules/EWM.core/job/job/job-sms/job-sms.component';
import { SystemSettingService } from '@app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { MatSidenav } from '@angular/material/sidenav';
import { CommonserviceService } from '@app/shared/services/commonservice/commonservice.service';
import { NewEmailComponent } from '@app/modules/EWM.core/shared/quick-modal/new-email/new-email.component';

@Component({
  selector: 'app-contact-summary',
  templateUrl: './contact-summary.component.html',
  styleUrls: ['./contact-summary.component.scss']
})
export class ContactSummaryComponent implements OnInit {
  loading: boolean;
  @Input() contactId: string;
  contactPersonalData: PersonalData;
  generalLoader: boolean = false;
  contactAddressData: AddressData;
  addressLoader: boolean;
  dirctionalLang;
  background10: any;
  background15: any;
  background20: any;
  background30: any;
  background80: any;
  @Output() updateAddress = new EventEmitter();
  animationVar: any;
  smallScreenTagData: any;
  contactPersonadata:any=[]
  contactDetails: any;
  @Input() contactHeaderData:any;
  contactHeaderDataId:string;
  @Input() isSMSStatus:boolean;
  smsHistoryToggel: boolean;
  quickFilterToggel: boolean;
  SMSHistory:any=[]
  largeScreenTag: boolean = true; 
  mobileScreenTag: boolean = false
  candidateMapTagSelected = [];
  largeScreenTagData: any=[];
  MobileMapTagSelected: any=[];
  currentMenuWidth: number;
  sizes = [
    {
      id: SCREEN_SIZE.small, name: 'small',
      css: `showMenu`
    },
    {
      id: SCREEN_SIZE.large, name: 'large',
      css: `hide`
    }
  ];
  prefix: string = 'is-';
  public UserType='CONT';
  @Input() ContactIdString;
  constructor(private clientService: ClientService, public dialogModel: MatDialog,private commonserviceService: CommonserviceService,
    private appSettingsService: AppSettingsService,private snackBService: SnackBarService,private elementRef: ElementRef,
    private translateService: TranslateService,public dialog: MatDialog,private systemSettingService: SystemSettingService, ) {
    this.contactHeaderDataId=this.contactHeaderData?.Id;
     }
  ngOnInit(): void {
    this.animationVar = ButtonTypes;
    let primaryColor = document.documentElement.style.getPropertyValue('--primary-color');

    this.background10 = this.hexToRGB(primaryColor, 0.10);
    this.background15 = this.hexToRGB(primaryColor, 0.15);
    this.background20 = this.hexToRGB(primaryColor, 0.20);
    this.background30 = this.hexToRGB(primaryColor, 0.30);
    this.background80 = this.hexToRGB(primaryColor, 0.80); 

    this.getContactAddressDetails();
    this.getContactPersonalDetails();
    this.currentMenuWidth = window.innerWidth;
  }
  @HostListener("window:resize", ['$event'])
  private onResize(event) {
    this.currentMenuWidth = event.target.innerWidth;
    this.detectScreenSize();
    event.target.innerWidth;
  }
  private detectScreenSize() {
    const currentSize = this.sizes.find(x => {
      // get the HTML element
      const el = this.elementRef.nativeElement.querySelector(`.${this.prefix}${x.id}`);
      // check its display property value
    })
  
    this.mobileMenu(this.contactPersonalData?.Owners);
  }

  mobileMenu(data) {
    if (data) {
      let items = data.slice(0, 4);
      let threeDotItems = data.slice(4, data.length);
      this.MobileMapTagSelected = [];
      this.largeScreenTagData = items;      
      this.smallScreenTagData = threeDotItems;
      if (this.currentMenuWidth > 1312 && this.currentMenuWidth < 1432) {
        this.smallScreenTagData = this.smallScreenTagData.concat(items.splice(0, 3));
        this.MobileMapTagSelected = items;
        this.largeScreenTag = false;
        this.mobileScreenTag = true;
      } else if (this.currentMenuWidth > 981 && this.currentMenuWidth < 1311) {
        this.smallScreenTagData = this.smallScreenTagData.concat(items.splice(1, 5));
        this.MobileMapTagSelected = items;
        this.largeScreenTag = false;
        this.mobileScreenTag = true;
  
      } else if (this.currentMenuWidth > 826 && this.currentMenuWidth < 980) {
        this.smallScreenTagData = this.smallScreenTagData.concat(items.splice(5, 6));
        this.MobileMapTagSelected = items;
        this.largeScreenTag = false;
        this.mobileScreenTag = true;
  
      } else if (this.currentMenuWidth > 551 && this.currentMenuWidth < 825) {
        this.smallScreenTagData = this.smallScreenTagData.concat(items.splice(3, 7));
        this.MobileMapTagSelected = items;
        this.largeScreenTag = false;
        this.mobileScreenTag = true;
  
      } else if (this.currentMenuWidth > 320 && this.currentMenuWidth < 550) {
        this.smallScreenTagData = this.smallScreenTagData.concat(items.splice(1, 8));
        this.MobileMapTagSelected = items;
        this.largeScreenTag = false;
        this.mobileScreenTag = true;
  
      } else {
        // this.getCandidatemappingTagList()
        //this.detectScreenSize();
        this.largeScreenTag = true;
        this.mobileScreenTag = false;
      }
    }
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

    // @Who: Bantee Kumar,@Why:EWM-13723,@When: 12-09-2023,@What: getContactPersonalDetails function  


  getContactPersonalDetails() {
    this.generalLoader = true;
    this.loading = true;
    this.clientService.getContactPersonalDetails(this.contactId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
          this.contactPersonalData = repsonsedata.Data;
          this.mobileMenu(this.contactPersonalData?.Owners);
          // who:maneesh,what:ewm-16068 for contact owners ,when:21/02/2024
          let threeDotItems = this.contactPersonalData?.Owners?.slice(4, this.contactPersonalData?.Owners?.length);
          this.smallScreenTagData = threeDotItems;          
          // this.updateAddress.emit(true); who:maneesh,what:api calling issue so that comment it
          this.loading = false;

        }
        this.generalLoader = false;
      })
  }

 
    // @Who: Bantee Kumar,@Why:EWM-13723,@When: 12-09-2023,@What: openPersonalInfoModal function  

  openPersonalInfoModal(mode) {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialogModel.open(QuickAddContactComponent, {
      data: new Object({ contactId: this.contactId, contactPersonalData: this.contactPersonalData ,pageName:'contact',formType:mode}),
      panelClass: ['xeople-modal-lg', 'add_people', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == true) {
        this.generalLoader = true;
        this.getContactPersonalDetails();
      } else {
        this.generalLoader = false;
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

    // @Who: Bantee Kumar,@Why:EWM-13723,@When: 12-09-2023,@What: getContactAddressDetails function  


  getContactAddressDetails() {
    this.loading = true;
    this.addressLoader = true;
    this.clientService.getContactAddressDetails(this.contactId).subscribe(
      (repsonsedata: ResponceData) => {
        if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
          this.contactAddressData = repsonsedata.Data;
          // this.updateAddress.emit(true); who:maneesh,what:api calling issue so that comment it

        }
        this.loading = false;
        this.addressLoader = false;
      }, err => {
        this.addressLoader = false;
      }
    )
  }


    // @Who: Bantee Kumar,@Why:EWM-13723,@When: 12-09-2023,@What: getAdressById function  

  getAdressById(methodType: string) {
    let contactAddressByIdData: AddressData;
    if (methodType == 'Add') {
      contactAddressByIdData=null;
      this.openDialogContactAdress(methodType,contactAddressByIdData);
    } else {
      this.clientService.getContactAddressDetails(this.contactId).subscribe(
        (repsonsedata: ResponceData) => {
          this.loading = false;
          if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
            contactAddressByIdData = repsonsedata.Data;
            this.openDialogContactAdress(methodType, contactAddressByIdData);
          }
        }, err => {
          this.loading = false;
        })

    }
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.add("is-blurred");
    }
  }

    // @Who: Bantee Kumar,@Why:EWM-13723,@When: 12-09-2023,@What: openDialogContactAdress function  

  openDialogContactAdress(methodType: string, contactAddressByIdData: any) {
    const dialogRef = this.dialogModel.open(ContactAddressComponent, {
      data: new Object({ methodType: methodType, contactId:this.contactId ,AutoFilldata: contactAddressByIdData}),
      panelClass: ['xeople-modal', 'add_canAddress', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == true) {
        this.addressLoader = true;
        this.getContactAddressDetails();
      } else {
        this.addressLoader = false;
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
    // @Who: Bantee Kumar,@Why:EWM-13723,@When: 12-09-2023,@What: deleteContactAddress function  

  deleteContactAddress() {
     
    const message = 'label_titleDialogContent';
    const title = 'label_delete';
    const subTitle = 'candidate_address';
    const dialogData = new ConfirmDialogModel(title, subTitle, message);
    const dialogRef = this.dialogModel.open(DeleteConfirmationComponent, {
      maxWidth: "350px",
      data: dialogData,
      panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(dialogResult => {
      this.addressLoader = true;
      if (dialogResult == true) {
        let location={}
        location['Id']=Number(this.contactId);
        location['LocationId']=this.contactAddressData?.LocationId;

        this.clientService.deleteContactAddress(location).subscribe(
          (data: ResponceData) => {
            if (data.HttpStatusCode == 200) {
              this.getContactAddressDetails();
              this.contactAddressData
              this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());

            } else if (data.HttpStatusCode == 400) {
              this.addressLoader = false;
              this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
            } else {
              this.addressLoader = false;
              this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
            }

          }, err => {
            if (err.StatusCode == undefined) {
              this.loading = false;
            }
            this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
          })
      }
      this.addressLoader = false;
    });
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
    // @Who: Bantee Kumar,@Why:EWM-13723,@When: 12-09-2023,@What: editPersonalInfoModal function  


  editPersonalInfoModal() {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this.dialogModel.open(ContactPersonalInfoComponent, {
      data: new Object({ personalInformationData: this.contactPersonalData,ContactIdString:this.ContactIdString}),
      panelClass: ['xeople-modal-lg', 'add_people', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res == true) {
        this.generalLoader = true;
        this.getCandidateSummaryList();
        this.getContactPersonalDetails();

      } else {
        this.generalLoader = false;
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


    // @Who: Bantee Kumar,@Why:EWM-13723,@When: 12-09-2023,@What: copyContactEmailId function  

  copyContactEmailId(EmailId:any){ 
    // for display and auto hide after some time 
    let el = document.getElementById('autoHide');
    el.style.display = 'block';
    setTimeout(() => {
      let el = document.getElementById('autoHide');
      el.style.display = 'none';
    }, 2000);
    // End 
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = EmailId;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
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

getBackgroundColor(shortName) {
  if (shortName?.length > 0) {
    return ShortNameColorCode[shortName[0]?.toUpperCase()]
  }
}
// who:maneesh,what:ewm-16064 for open send sms ,when:27/02/2024
openJobSMSForCandidate() {  
  console.log('this.contactHeaderData',this.contactHeaderData?.CandidateId);
  console.log('this.contactHeaderDataID',this.contactHeaderData?.Id);

  
  let dataItemObj = {};
  dataItemObj['PhoneNumber'] = this.contactHeaderData?.PhoneNumber;
  dataItemObj['Name'] = this.contactHeaderData?.Name;
  dataItemObj['CandidateId'] = this.contactHeaderData?.Id==null?this.contactHeaderData?.CandidateId:this.contactHeaderData?.Id;
  dataItemObj['PhoneCode'] = this.contactHeaderData?.PhoneCode;
  this.contactHeaderData=dataItemObj;
  const dialogRef = this.dialog.open(JobSMSComponent, {
    data: new Object({ jobdetailsData: this.contactHeaderData,UserType:this.UserType}),
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
// who:maneesh,what:ewm-16064 for open get sms ,when:27/02/2024
getSMSHistory() {
  this.loading = true;
  this.systemSettingService.getSMSHistory('?Id='+this.contactHeaderData?.CandidateId+'&UserType='+this.UserType).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        this.SMSHistory = repsonsedata.Data;
        this.commonserviceService.getContactSummerySms.next(this.SMSHistory);

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
// who:maneesh,waht:ewm-16066 for send email,when:29/02/2024
openNewEmailModal(Id: string,email: string) {
  const message = ``;
  const title = 'label_disabled';
  const subtitle = 'label_securitymfa';
  const dialogData = new ConfirmDialogModel(title, subtitle, message);
  const dialogRef = this.dialog.open(NewEmailComponent, {
    maxWidth: "750px",
    width: "95%",
    height: "100%",
    maxHeight: "100%",
    data: { 'contactEmail': true, 'openType': localStorage.getItem('emailConnection'), 'candidateMail': email, openDocumentPopUpFor: 'Contact', isBulkEmail: false,'candidateId':this.contactHeaderData?.Id},
    panelClass: ['quick-modalbox', 'quickNewEmailModal', 'animate__animated', 'animate__slideInRight'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(dialogResult => {
  })

}

getCandidateSummaryList() {
  this.loading = true;
  this.clientService.getContactSummaryHeader(this.contactId).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
        this.contactHeaderData = repsonsedata.Data;          
        if (this.contactHeaderData?.Id!=null) {
          this.commonserviceService?.getcontactsms.next(true);
          // this.getSMSHistory();
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
}
       