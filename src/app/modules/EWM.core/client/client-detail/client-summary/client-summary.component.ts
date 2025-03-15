/* @(C): Entire Software
    @Type: File, <html>
    @Name: client-summary.component.html
    @Who: Nitin Bhati
    @When: 22-Nov-2021
    @Why: EWM-3635
    @What:  This page wil be use only for the client summary Component HTML
    */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ConfirmDialogComponent, ConfirmDialogModel } from 'src/app/shared/modal/confirm-dialog/confirm-dialog.component';
import { MatDialog} from '@angular/material/dialog';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { TranslateService } from '@ngx-translate/core';
import { ResponceData } from 'src/app/shared/models';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { Userpreferences } from 'src/app/shared/models';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { delay } from 'rxjs/operators';
import { Icandidate,ClientSummaryModel } from 'src/app/modules/EWM-Candidate/profile-summary/candidate-summary/Icandidate.interface';
import { ClientDescriptionPopupComponent } from './client-description-popup/client-description-popup.component';
import { ClientService } from '../../../shared/services/client/client.service';
import { QuickClientDetailsComponent } from '../quick-client-details/quick-client-details.component';
import { BusinessRegistrationComponent } from './business-registration/business-registration.component';
import { AddemailComponent } from '../../../shared/quick-modal/addemail/addemail.component';
import { AddAddressComponent } from '../../../shared/quick-modal/add-address/add-address.component';
import { SystemSettingService } from '../../../shared/services/system-setting/system-setting.service';
import { AddphonesComponent } from '../../../shared/quick-modal/addphones/addphones.component';
import { ClientOrgComponent } from '../../client-org/client-org.component';
import { FilterDialogComponent } from '../../../job/landingpage/filter-dialog/filter-dialog.component';
import { JobService } from '../../../shared/services/Job/job.service';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { DeleteConfirmationComponent } from 'src/app/shared/modal/confirm-dialog/delete-confirmation/delete-confirmation.component';
import { CandidateFolderFilterComponent } from '@app/modules/EWM-Candidate/profile-summary/candidate-folder-filter/candidate-folder-filter.component';
import { CandidateFolderService } from '@app/modules/EWM.core/shared/services/candidate/candidate-folder.service';
import { ClientFolderFeatureComponent } from './client-folder-feature/client-folder-feature.component';
import { ActivatedRoute } from '@angular/router';
import { CommonFilterDiologComponent } from '@app/modules/EWM.core/job/landingpage/common-filter-diolog/common-filter-diolog.component';
import { CommonFilterdilogService } from '@app/shared/services/common-filterdilog.service';
interface ColumnSetting {
  Field: string;
  Title: string;
  Format?: string;
  Type: 'text' | 'numeric' | 'boolean' | 'date';
  Order: number
}

@Component({
  selector: 'app-client-summary',
  templateUrl: './client-summary.component.html',
  styleUrls: ['./client-summary.component.scss']
})
export class ClientSummaryComponent implements OnInit {
  @Output() isTabLocation = new EventEmitter();
  background10: any;
  background15: any;
  background20: any;
  background30: any;
  background80: any;
  loading: boolean = true;
  public userpreferences: Userpreferences;
  @Input() clientIdData: any;
  public GridDataEducationList: any = [];
  GridDataListCan: any = {};
  public result: string = '';

  public clientDetailsData: any = {};
  public businessRegistrationData: any = {};
  public candidateAddressData: any = [];
  public clientLocationData: any = {};
  public descriptionList: any = [];
  public emergencyContactsData: any = [];
  public candidateFoldersData: any = [];

  public skillsData: any = [];
  public candidateAdditionalInfoData: any = {};
  public candidateExperienceData: any = [];
  public candidateEducationData: any = [];

  public addressLoader: boolean;
  public experienceLoader: boolean;
  public loaderDependent: boolean;
  public businessLoader: boolean
  public generalLoader: boolean;
  public loaderAddInfo: boolean;
  public loaderPhone: boolean;

  public organisationLoader: boolean;
  public userpreferencesDate = 'MMM d y';
  orderlistLeft = [];
  orderlistRight = [];
  ConfigData: any = [];
  @Output() candidateEmail = new EventEmitter<any>();
  @Output() updatedLeadWorkflow = new EventEmitter<any>();
  public emailData:any=[];
  public phoneData:any=[];
  LocationCount: any;
  public countryId: number;
  public countryList=[];
  CompanyLocationspopUp: any;
  addressBarData: any;
  clientDetailsDataIndustry=[];
  clientDetailsDataSubIndustry=[];
  clientLocationDataList: any;
  oldPatchValues: any;
  //clientName: string;
  @Input() clientName: any;
  @Input() HoldingCompany: any;
  holdingCompany:string=''
  public filterCount: number = 0;
  public colArr: any = [];
  public GridId: any = 'ClientDetails_grid_005';
  public filterConfig: any;
  public viewMode:any;
  public columns: ColumnSetting[] = [];
  public orgName:any;
  public clientFilePrefix:any;
  dirctionalLang;
  public folderLoader: boolean;
  updatecase:boolean=false;
  // oldPatchValues: import("d:/apps/Ewm.Web.Client/src/app/modules/EWM-Candidate/profile-summary/candidate-summary/Icandidate.interface").Data;
  @Input() clientType: any;
  constructor(public _dialog: MatDialog, private snackBService: SnackBarService, public candidateService: CandidateService,
   public _sidebarService: SidebarService,private _clientService: ClientService,private clientService: ClientService,
    private translateService: TranslateService,private systemSettingService: SystemSettingService,
    private jobService: JobService, public _userpreferencesService: UserpreferencesService,
    public dialogModel: MatDialog, private commonserviceService: CommonserviceService,private _appSetting: AppSettingsService,private appSettingsService: AppSettingsService,public _CandidateFolderService: CandidateFolderService,private routes: ActivatedRoute,
    private CommonFilterdilogsrvs :CommonFilterdilogService) {
      this.clientFilePrefix = this._appSetting._clientFilePrefix;
     }


  ngOnInit(): void {
    this.userpreferences = this._userpreferencesService.getuserpreferences();
    //this.getFilterConfig();
    // this.commonserviceService.changecandidatesummaryDashboardObs.pipe(delay(0)).subscribe(value => {
    //   if (value === true) {
    //     this.getFilterConfig();
    //   }
    // });
    // who:maneesh,what:ewm-13004 for when edit data then updat details pageXOffset,when:05/07/2023
    this.commonserviceService.updateClientData.subscribe(value => {
      if (value==true && value!='' && value!=undefined) {
       this.clientDetailsList();  
      }
    })
    this.commonserviceService.onOrgSelectFolderId.subscribe(value => {
      if (value !== null) {
        this.reloadApiBasedOnorg();
      }
    });

    this.commonserviceService.onClientSelectId.subscribe(value => {
      if (value !== null) {
        this.clientIdData = value;
      this.reloadApiBasedOnorg();
      } 
    })

    this.commonserviceService.OrgSelectObs.subscribe(value => {
      this.orgName = value;
    })
    this.getFilterConfig(false);   
    this.getPhoneList();
    this.getInternationalization();
    this.clientDetailsList();
    this.getDiscriptiontList();
    this.getBusinessRegistration();
    this.addressChunkList();
   this.getEamilList();
   this.folderChunkList();
    let primaryColor = document.documentElement.style.getPropertyValue('--primary-color');

    this.background10 = this.hexToRGB(primaryColor, 0.10);
    this.background15 = this.hexToRGB(primaryColor, 0.15);
    this.background20 = this.hexToRGB(primaryColor, 0.20);
    this.background30 = this.hexToRGB(primaryColor, 0.30);
    this.background80 = this.hexToRGB(primaryColor, 0.80);

  }

  ngAfterViewInit() { 
    this.routes.queryParams.subscribe((value) => {
      if (value?.uniqueId !=undefined && value.uniqueId!=null && value.uniqueId!='') {
        if(this.clientIdData!=value?.clientId){
          this.clientIdData = value?.clientId;
         this.reloadApiBasedOnorg();
        }
      }
    });
  }
  /*
@Type: File, <ts>
@Name: openLocationTab function
 @Who: Nitin Bhati
@When: 25-Nov-2021
@Why: EWM-3635
@What: For open location tab when we click on location count
*/
  public openLocationTab(){
    this.isTabLocation.emit(true);
  }


  /*
@Type: File, <ts>
@Name: getOrderListRightSide function
@Who: Nitin Bhati
@When: 22-Nov-2021
@Why: EWM-3635
@What: for ordering of right side
*/
  getOrderListRightSide(panelName) {
    let orderId = this.orderlistRight.find(item => item.Title === panelName)
    if (orderId !== undefined) {
      return orderId['Order'];
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

  /*
  @Type: File, <ts>
  @Name: clientDetailsList
  @Who: Nitin Bhati
  @When: 22-Nov-2021
  @Why: EWM-3635
  @What: reintialisation the Client Information list for client
*/
clientDetailsList() {
    this.generalLoader = true;
    this._clientService.getclientDetailsByIdList(this.clientIdData +'&FilterParams.ColumnName=Status&FilterParams.ColumnType=DropDown&FilterParams.FilterValue=active&FilterParams.FilterOption=IsEqualTo').subscribe(
      (repsonsedata: ClientSummaryModel) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.generalLoader = false;
          this.clientDetailsData = repsonsedata.Data;
          this.clientName = repsonsedata.Data?.ClientName;
          this.clientDetailsDataIndustry = repsonsedata.Data?.Industry;
          this.clientDetailsDataSubIndustry = repsonsedata.Data?.SubIndustry;          
        } else {
          // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
          this.generalLoader = false;
        }
      }, err => {
        this.generalLoader = false;
        //  this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }




  /*
      @Type: File, <ts>
      @Name: openQuickClientDetailsInfoModal
      @Who: Nitin Bhati
      @When: 22-Nov-2021
      @Why: EWM-3635
      @What: to open quick add Client Details Information modal dialog
    */
  openQuickClientDetailsInfoModal() {
    const message = ``;
    const title = 'label_disabled';
    const subtitle = 'label_securitymfa';
    const dialogData = new ConfirmDialogModel(title, subtitle, message);
    const dialogRef = this._dialog.open(QuickClientDetailsComponent, {
      // maxWidth: "1000px",
      data: new Object({ clientId: this.clientIdData,clientDetailsData: this.clientDetailsData,clientLeadType:this.clientType }),
      // width: "65%",
      // maxHeight: "85%",
      // data: dialogData,
      panelClass: ['xeople-modal', 'quick-modalbox', 'quickCompany','animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res.resp == true) {
        this.generalLoader = true;
        if(this.clientType==='LEAD'){
          this.updatedLeadWorkflow.emit({leadId:res?.leadWorkflowId,leadName:res?.leadWorkflowIdName,previousleadWorkflowId:res?.previousleadWorkflowId});
        }
        
        this.clientDetailsList();
      } else {
        this.generalLoader = false;
      }
    })
    if (this.appSettingsService.isBlurredOn) {
      document.getElementById("main-comp").classList.add("is-blurred");
    }

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
  @Name: getBusinessRegistration
  @Who: Nitin Bhati
  @When: 22-Nov-2021
  @Why: EWM-3635
  @What: reintialisation the Client Business registration list
*/
isRegisteredName:boolean = false;
getBusinessRegistration() {
  this.businessLoader = true;
  this._clientService.getBusinessRegistrationByIdList(this.clientIdData).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
         this.businessRegistrationData = repsonsedata.Data;
        if( this.businessRegistrationData!=undefined && this.businessRegistrationData!=null &&
          this.businessRegistrationData?.RegisteredName !=undefined 
          && this.businessRegistrationData?.RegisteredName !=null && this.businessRegistrationData?.RegisteredName !=''){
            this.isRegisteredName = false;
          }else{
            this.isRegisteredName = true;
            this.holdingCompany = this.HoldingCompany;
          }
         this.businessLoader = false;
      } else {
        // this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.businessLoader = false;
      }
    }, err => {
      this.businessLoader = false;
      //  this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

    })
}
 /*
      @Type: File, <ts>
      @Name: openBusinessRegistrationModal
      @Who: Nitin Bhati
      @When: 22-Nov-2021
      @Why: EWM-3635
      @What: to open quick Update Business registration Information modal dialog
    */
      openBusinessRegistrationModal() {
        const message = ``;
        const title = 'label_disabled';
        const subtitle = 'label_securitymfa';
        this.businessRegistrationData['isRegisteredName']=this.isRegisteredName;
        this.businessRegistrationData['holdingCompany']=this.holdingCompany;
        const dialogData = new ConfirmDialogModel(title, subtitle, message);
        const dialogRef = this._dialog.open(BusinessRegistrationComponent, {
          data: new Object({ clientId: this.clientIdData,clientDetailsData: this.businessRegistrationData}),
          panelClass: ['xeople-modal', 'quick-business','animate__animated', 'animate__zoomIn'],
          disableClose: true,
        });
        dialogRef.afterClosed().subscribe(res => {
          if (res == true) {
            this.businessLoader = true;
            this.getBusinessRegistration();
          } else {
            this.businessLoader = false;
          }
        })
        if (this._appSetting.isBlurredOn) {
          document.getElementById("main-comp").classList.add("is-blurred");
        }

        // RTL Code
        let dir: string;
        dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
        let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
        for (let i = 0; i < classList.length; i++) {
          classList[i].setAttribute('dir', this.dirctionalLang);
        }

      }
/*
@who:priti
@why:EWM-3853
@when:22-nov-2021
@what:get All description 
*/
  openDescriptionModal(editId, formType,description) {
   const dialogRef = this._dialog.open(ClientDescriptionPopupComponent, {
      data: new Object({ candidateId: this.clientIdData, editId: editId, DescriptionData: description, formType: formType,clientType:this.clientType }),
      panelClass: ['xeople-modal-lg', 'add_description', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.getDiscriptiontList();
      }

    });
    if (this._appSetting.isBlurredOn) {
      document.getElementById("main-comp").classList.add("is-blurred");
    }

    // RTL Code
    let dir: string;
    dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
    let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
    for (let i = 0; i < classList.length; i++) {
      classList[i].setAttribute('dir', this.dirctionalLang);
    }

  }
  
/*
@who:priti
@why:EWM-3853
@when:22-nov-2021
@what:get All description 
*/
  getDiscriptiontList() {
     this.loaderDependent = true;
    this._clientService.getAlldescription("?clientid=" + this.clientIdData).subscribe(
     (repsonsedata: Icandidate) => {
       if (repsonsedata['HttpStatusCode'] == '200' || repsonsedata['HttpStatusCode'] == '204') {
         this.loaderDependent = false;
         this.descriptionList = repsonsedata.Data;
       } else {
         //this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata['Message']), repsonsedata['HttpStatusCode']);
         this.loaderDependent = false;
       }
     }, err => {
       this.loaderDependent = false;
       // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

     })
  }


  /*
      @Type: File, <ts>
      @Name: getAdressById
      @Who: Nitin Bhati
      @When: 24-Nov-2021
      @Why: EWM-3929
      @What: get client adress By Id
    */
  getAdressById(methodType: string, Id: any) {
    let candidateAddressById: any = [];
    if (methodType == 'Add') {
      candidateAddressById = [];
      this.openDialogCandidateAdress(methodType, candidateAddressById);
    } else {
      this._clientService.getClientAdressById('?id=' + Id).subscribe(
        (repsonsedata: ResponceData) => {
          this.loading = false;
          if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
            candidateAddressById = repsonsedata.Data;
            this.openDialogCandidateAdress(methodType, candidateAddressById);
          }
        }, err => {
          this.loading = false;
          //  this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

        })

    }
    if (this._appSetting.isBlurredOn) {
      document.getElementById("main-comp").classList.add("is-blurred");
    }
  }

  /*
      @Type: File, <ts>
      @Name: openDialogCandidateAdress
      @Who: Nitin Bhati
      @When: 24-Nov-2021
      @Why: EWM-3913
      @What: for opening modal address popup
    */
  openDialogCandidateAdress(methodType: string, candidateAddressById: any) {
    const dialogRef = this.dialogModel.open(AddAddressComponent, {
      maxWidth: "700px",
      width: "90%",
      data: new Object({ addressmul: '', emailsChip: 'this.emails', 
      addressBarData: candidateAddressById, countryId: this.countryId, mode:methodType,clientName:this.clientName }),
      panelClass: ['quick-modalbox', , 'add_address', 'animate__animated', 'animate__zoomIn'],
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe(res => {
      if (res.data == undefined) {
        this.addressLoader = false;
        } else {
        this.addressLoader = true;
        //this.addressChunkList();
        this.addressBarData = res.data;
         //console.log(this.addressBarData,"CompanyLocationspopUp")

         let updateObj = [];
    let fromObj = {};
    let toObj = {};
    fromObj = candidateAddressById;
   
    this.addressBarData['Id'] = candidateAddressById.Id;
    this.addressBarData['ClientId'] = this.clientIdData;
     updateObj = [{
      "From": fromObj,
      "To": this.addressBarData
    }];
     this._clientService.updateClientAddress(updateObj[0]).subscribe(
      (responseData: ResponceData) => {
        if (responseData.HttpStatusCode === 200) {
          this.addressLoader = false;
          this.addressChunkList();
          //this.snackBService.showSuccessSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());

        } else {
          this.addressLoader = false;
          this.snackBService.showErrorSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());

        }
      }, err => {
        this.addressLoader = false;
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
         
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
    @Name: addressChunkList
    @Who: Nitin Bhati
      @When: 24-Nov-2021
      @Why: EWM-3913
    @What: reintialisation the address list for client
  */

  addressChunkList() {
    this.addressLoader = true;
    this._clientService.getClientAdressAll('?clientid=' + this.clientIdData).subscribe(
      (repsonsedata: ClientSummaryModel) => {
        if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
          this.addressLoader = false;
          //  who:maneesh,what:ewm-14614 for no record found display,when:06/10/2023 --
          this.clientLocationDataList = repsonsedata.Data;  
         if(repsonsedata.Data!=null){
          this.clientLocationDataList = repsonsedata.Data;  
          if(Object.keys(repsonsedata.Data.LocationDetails).length!=0) {
           this.clientLocationData = repsonsedata.Data.LocationDetails;
         }
         this.LocationCount = repsonsedata.Data;
         }
         } else {
          //  who:maneesh,what:ewm-14614 for no record found display,when:06/10/2023 --
          this.clientLocationDataList = repsonsedata.Data;  
          this.addressLoader = false;
        }
      }, err => {
        this.addressLoader = false;
        //  this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      })
  }

  /*
  @Type: File, <ts>
  @Name: deleteConfirmAddress
  @Who: Nitin Bhati
  @When: 24-Nov-2021
  @Why: EWM-3913
  @What: delete confirmation to delet candidate address
*/

  deleteConfirmAddress(addressData: any) {
    let addressObj = {};
    addressObj = addressData;
    const message = 'label_titleDialogContentSiteDomain';
    const title = 'label_delete';
    const subTitle = 'label_locationAddress';
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
        this._clientService.deleteClientAddress(addressObj).subscribe(
          (data: ResponceData) => {
            if (data.HttpStatusCode == 200) {
              this.addressChunkList();
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
      } else {
        this.addressLoader = false;
      }
    });
  }

 deleteDescription(dependantData: any): void {
  let experienceObj = {};
  experienceObj = dependantData;
  const message = `label_titleDialogContent`;
  const title = '';
  const subTitle = 'label_clientDescription';
  const dialogData = new ConfirmDialogModel(title, subTitle, message);
  const dialogRef = this._dialog.open(DeleteConfirmationComponent, {
    maxWidth: "350px",
    data: dialogData,
    panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(dialogResult => {
    this.loaderDependent = true;
    if (dialogResult == true) {
      this._clientService.deletedescription(experienceObj).subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode == 200) {
            this.getDiscriptiontList();
            this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
            this.loaderDependent = false;
          } else if (data.HttpStatusCode == 400) {
            this.loaderDependent = false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          } else {
            this.loaderDependent = false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          }

        }, err => {
          if (err.StatusCode == undefined) {
            this.loaderDependent = false;
          }
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        })
    } else {
      this.loaderDependent = false;
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

 /*
@who:priti
@why:EWM-3909
@when:24-nov-2021
@what:open email pop up
*/
openEmailModal(action,editId,editonj) {
  let emailsChip=[];
  this.emailData.forEach(element => {
    emailsChip.push({
      email:element.EmailId,
      type:element.EmailTypeId
    });
  });
  let emailobj=[];
  if(editonj!=undefined){
    emailobj.push({
      EmailId:editonj.EmailId,
      Type:editonj.EmailTypeId,
      TypeName:editonj.EmailType,
    });
  }
  let editdata={Email:emailobj};
  let isAddShow=true;
  if(action=='Add')
  {
    isAddShow=false
  }
        /*@Who: Bantee kumar,@When: 10-08-2023,@Why: EWM-13746,@What: Main Email Id should be dynamic*/

  const dialogRef = this._dialog.open(AddemailComponent, {
    data: new Object({ emailmul: null, emailsChip: emailsChip,mode:action,values:editdata,IsAddShow:isAddShow,pageName: 'genralInfoPage', isMainEmailOptionDisabled: this.sendMainEmailSelected,showAddBtn:true }),
    panelClass: ['xeople-modal', 'add_email', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(res => {
    let emailArr = res.data;
    if (emailArr) {
      if(action=='Add')
     { let dataToPost=[];
      for (let j = 0; j < emailArr.length; j++) {
       dataToPost.push({
          ClientId:this.clientIdData,
          EmailId: emailArr[j]['EmailId'],
          EmailTypeId: emailArr[j]['Type'],
          IsDefault: emailArr[j]['IsDefault']
        });
      }
      this.postEmaildata(dataToPost);
    }
    else{
      const datatoPost={
        ClientId:this.clientIdData,
        EmailId: emailArr[0]['EmailId'],
        EmailTypeId: emailArr[0]['Type'],
        IsDefault: emailArr[0]['IsDefault'],
        Id:editId
      }
      this.updateEmaildata(datatoPost)
    }
    }
  })
  if (this._appSetting.isBlurredOn) {
    document.getElementById("main-comp").classList.add("is-blurred");
  }

  // RTL Code
  let dir: string;
  dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
  let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
  for (let i = 0; i < classList.length; i++) {
    classList[i].setAttribute('dir', this.dirctionalLang);
  }

}
  updateEmaildata(datatoPost:any) {
    this._clientService.updateEmail(datatoPost).subscribe(
      (responseData: ResponceData) => {
        if (responseData.HttpStatusCode === 200) {
          this.snackBService.showSuccessSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());
          this.getEamilList();
        } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }
  postEmaildata(emailData: any) {
    this._clientService.createEmail(emailData).subscribe(
      (responseData: ResponceData) => {
        if (responseData.HttpStatusCode === 200) {
        
          this.snackBService.showSuccessSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());
          this.getEamilList();
         } else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());
        }
      }, err => {
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      });
  }
  
 deleteEmail(Data: any): void {
  let experienceObj = {};
  experienceObj = Data;
  const message = `label_titleDialogContent`;
  const title = '';
  const subTitle = 'label_emailDetails';
  const dialogData = new ConfirmDialogModel(title, subTitle, message);
  const dialogRef = this._dialog.open(DeleteConfirmationComponent, {
    maxWidth: "350px",
    data: dialogData,
    panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(dialogResult => {
    this.loaderDependent = true;
    if (dialogResult == true) {
      this._clientService.deleteEmail(experienceObj).subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode == 200) {
            this.getEamilList();
            this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
            this.loaderDependent = false;
          } else if (data.HttpStatusCode == 400) {
            this.loaderDependent = false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          } else {
            this.loaderDependent = false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          }

        }, err => {
          if (err.StatusCode == undefined) {
            this.loaderDependent = false;
          }
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        })
    } else {
      this.loaderDependent = false;
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

/*@who:priti
@why:EWM-3909
@when:24-nov-2021
@what:get All Email 
*/
sendMainEmailSelected:boolean;
  getEamilList() {
     this.loaderAddInfo = true;
    this._clientService.getAllEmail("?clientid=" + this.clientIdData).subscribe(
     (repsonsedata: Icandidate) => {
       if (repsonsedata['HttpStatusCode'] == '200' ) {
         this.loaderAddInfo = false;
         this.emailData = repsonsedata.Data;
        let checkMainEmail =  this.emailData.filter(x => x['EmailType'] === 'Main');
        if (checkMainEmail.length > 0) {
          this.sendMainEmailSelected = true;
        }else{
          this.sendMainEmailSelected = false;
        }
       }else  if (repsonsedata['HttpStatusCode'] == '204') {
        this.loaderAddInfo = false;
        this.emailData=[];
       }
        else {
            this.loaderAddInfo = false;
       }
     }, err => {
       this.loaderAddInfo = false;
       // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

     })
  }
  /*
  @Type: File, <ts>
  @Name: reloadApiBasedOnorg function
  @Who: Nitin Bhati
  @When: 22-Nov-2021
  @Why: EWM-3856
  @What: Reload Api's when user change Client 
 */
  reloadApiBasedOnorg() {
    this.clientDetailsList();
    this.getInternationalization();
    this.getDiscriptiontList();
    this.getBusinessRegistration();
    this.addressChunkList();
    this.getEamilList();
    this.getPhoneList();
    this.folderChunkList();
   }


   getInternationalization() {
    this.systemSettingService.getInternalization().subscribe(
      (repsonsedata:ResponceData) => {
        if (repsonsedata['HttpStatusCode'] ===200) {      
          this.countryId=Number(repsonsedata['Data']['CountryId']);
          this.commonserviceService.ondefultCountry.next(this.countryId);
        }
      }, err => {
       // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
      })
  
    }

/*
  @Type: File, <ts>
  @Name: getPhoneList function
  @Who: Nitin Bhati
  @When: 26-Nov-2021
  @Why: EWM-3911
  @What: For getting data for Phone List
 */
getPhoneList() {
  this.loaderPhone = true;
 this._clientService.getAllPhone("?ClientId="+this.clientIdData).subscribe(
  (repsonsedata: Icandidate) => {
    if (repsonsedata['HttpStatusCode'] == '200') {
      this.loaderPhone = false;
      this.phoneData = repsonsedata.Data;
      }else  if (repsonsedata['HttpStatusCode'] == '204') {
     this.loaderPhone = false;
     this.phoneData=[];
    }
     else {
         this.loaderPhone = false;
    }
  }, err => {
    this.loaderPhone = false;
    // this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
  })
}

 /*
  @Type: File, <ts>
  @Name: openPhoneModal function
  @Who: Nitin Bhati
  @When: 26-Nov-2021
  @Why: EWM-3911
  @What: For open phone popup data
 */
openPhoneModal(action,editId,editonj,index) {  
  let phonesChip=[];
  this.phoneData.forEach(element => {
    phonesChip.push({
      phone: element?.PhoneNumber,
      type: element?.PhoneTypeId,
      Name: element?.PhoneTypeName,
      IsDefault: element?.IsDefault,// true,
      PhoneCode: element?.PhoneCode,
      phoneCodeName:element?.PhoneCode, // @suika @whn 27-03-2023
      CountryId:parseInt(element?.CountryCode)
    });
  });
  let dataPhoneChip = [];
  if(action=='Add' && this.phoneData?.length==0){ //add condition this.phoneData?.length==0 ewm-18042 by maneesh when:25/10/2024
    this.updatecase=false;
    dataPhoneChip = [];
  }else if(action=='Add' && this.phoneData?.length!=0){//add condition this.phoneData?.length!=0 ewm-18042 by maneesh when:25/10/2024
    this.updatecase=false;
    dataPhoneChip = phonesChip;
  }
  else{
    this.updatecase=true;
    dataPhoneChip = phonesChip;
  }
  let emailobj=[];
  if(editonj!=undefined && editonj!=''){
    this.oldPatchValues = editonj[index]; //pass index ewm-18042 by maneesh when:25/10/2024
    emailobj.push({
      PhoneNumber: editonj[index]?.PhoneNumber,
      Type: editonj[index]?.PhoneTypeId,
      TypeName: editonj[index]?.PhoneTypeName, //pass index and change key becouse api key  now PhoneTypeName ewm-18042 by maneesh when:25/10/2024
      IsDefault: editonj[index]?.IsDefault,//true,
      PhoneCode: editonj[index]?.PhoneCode,
      phoneCodeName:editonj[index]?.PhoneCode,
      CountryId:parseInt(editonj[index]?.CountryCode),  // @suika @whn 27-03-2023
    });
    
  }
  let editdata={Phone:emailobj};
  let isAddShow=true;
  if(action=='Add')
  {
    isAddShow=false
  }
  const dialogRef = this._dialog.open(AddphonesComponent, {
    //<!----------@suika @whn 07-08-2023 handle eidt case in client phone details--------------------------------------------->
   
    data: new Object({updatecase:this.updatecase, phonemul: null, phoneChip:dataPhoneChip,mode:action,values:editdata,IsAddShow:isAddShow,iseditId:action=='edit'?true:false,
      hideAddButton:true
     }),
    panelClass: ['xeople-modal', 'add_phone', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(res => {   
    let emailArr = res.data;
    if (emailArr) {
      if(action=='Add')
     { let dataToPost=[];
      for (let j = 0; j < emailArr.length; j++) {
       dataToPost.push({
          ClientId:this.clientIdData,
          PhoneTypeId: emailArr[j]['Type'],
          PhoneTypeName: emailArr[0]['Name'].toString(),
          CountryCode: emailArr[j]['phoneCodeName'],
          PhoneNumber: emailArr[j]['PhoneNumber'],
          IsDefault:emailArr[j]['IsDefault'],// true,
        });
      }
      this.postPhonedata(dataToPost);
    }
    else{      
      const datatoPost={
        Id:editId,
        PhoneCode: emailArr[0]['PhoneCode'].toString(),
        ClientId:this.clientIdData,
        PhoneTypeId: emailArr[0]['Type'],
        PhoneTypeName: emailArr[0]['Name'],
        CountryCode: emailArr[0]['phoneCodeName'].toString(),
        PhoneNumber: emailArr[0]['PhoneNumber'],
        IsDefault:emailArr[0]['IsDefault'],// true,
       }      
      this.updatePhonedata(datatoPost);
    }
    }
  })
  if (this._appSetting.isBlurredOn) {
    document.getElementById("main-comp").classList.add("is-blurred");
  }

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
  @Name: updatePhonedata function
  @Who: Nitin Bhati
  @When: 26-Nov-2021
  @Why: EWM-3911
  @What: For update phoe details data
 */
updatePhonedata(datatoPost:any) {
  let updateObj = [];
  let fromObj = {};
  let toObj = {};
  fromObj = this.oldPatchValues;
 
  datatoPost['ClientId'] = this.clientIdData;
   updateObj = [{
    "From": fromObj,
    "To": datatoPost
  }];
  this._clientService.updatePhone(updateObj[0]).subscribe(
    (responseData: ResponceData) => {
      if (responseData.HttpStatusCode === 200) {
        this.snackBService.showSuccessSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());
        this.getPhoneList();
      } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());
      }
    }, err => {
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    });
}

/*
  @Type: File, <ts>
  @Name: deletePhone function
  @Who: Nitin Bhati
  @When: 26-Nov-2021
  @Why: EWM-3911
  @What: For delete phoe details data
 */
deletePhone(Data: any): void {
  let experienceObj = {};
  experienceObj = Data;
  const message = `label_titleDialogContent`;
  const title = '';
  const subTitle = 'label_phoneDetails';
  const dialogData = new ConfirmDialogModel(title, subTitle, message);
  const dialogRef = this._dialog.open(DeleteConfirmationComponent, {
    maxWidth: "350px",
    data: dialogData,
    panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });
  dialogRef.afterClosed().subscribe(dialogResult => {
    this.loaderPhone = true;
    if (dialogResult == true) {
      this._clientService.deletePhone(experienceObj).subscribe(
        (data: ResponceData) => {
          if (data.HttpStatusCode == 200) {
            this.getPhoneList();
            this.snackBService.showSuccessSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
            this.loaderPhone = false;
          } else if (data.HttpStatusCode == 400) {
            this.loaderPhone = false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          } else {
            this.loaderPhone = false;
            this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode.toString());
          }

        }, err => {
          if (err.StatusCode == undefined) {
            this.loaderPhone = false;
          }
          this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
        })
    } else {
      this.loaderPhone = false;
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

/*
  @Type: File, <ts>
  @Name: postPhonedata function
  @Who: Nitin Bhati
  @When: 26-Nov-2021
  @Why: EWM-3911
  @What: For Add phone details data
 */
postPhonedata(emailData: any) {
  this._clientService.createPhone(emailData).subscribe(
    (responseData: ResponceData) => {
      if (responseData.HttpStatusCode === 200) {
      
        this.snackBService.showSuccessSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());
        this.getPhoneList();
      } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(responseData.Message), responseData.HttpStatusCode.toString());
      }
    }, err => {
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    });
}




/*
      @Type: File, <ts>
      @Name: openOrganisationStructureModal
      @Who: Suika
      @When: 22-Dec-2021
      @Why: EWM-4229
      @What: to open organisation chart
    */
   openOrganisationStructureModal() {      
   const dialogRef = this._dialog.open(ClientOrgComponent, {
     maxWidth: "100vw",
     data: new Object({ clientId: this.clientIdData,clientDetailsData: this.clientDetailsData,viewmode:"view",clientName:this.clientName, background20:this.background20,isPopUP:true }),
    //  height: "60%",
     // data: dialogData,
     panelClass: ['quick-modalbox', 'chart-dashboard', 'client-dashnoard-expand-modal','animate__animated', 'animate__zoomIn'],
     disableClose: true,
   });
   dialogRef.afterClosed().subscribe(res => {
     if (res == true) {
       this.generalLoader = true;
       this.clientDetailsList();
     } else {
       this.generalLoader = false;
     }
   })
   if (this._appSetting.isBlurredOn) {
    document.getElementById("main-comp").classList.add("is-blurred");
  }
 }
  



/*
@Name: downloadOrgStructure function
@Who: Suika
@When: 18-nov-2021
@Why:EWM-3641 EWM-3840
*/
downloadOrgStructure() {
this.loading = true;  
let domainName = localStorage.getItem('tenantDomain');
let orgName = localStorage.getItem('OrganizationName');
let jsonObj = {}; 
jsonObj['ClientId'] = this.clientIdData;
jsonObj['GridId'] = this.GridId;
jsonObj['FilterParams'] = this.filterConfig;
this.clientService.downloadOrganisationStructure(jsonObj)
  .subscribe(
    (data: any) => {
        this.loading = false;
        const Url= URL.createObjectURL(data);
        const fileExt='csv';
        let fileName=this.clientFilePrefix+'-'+domainName+'-'+orgName+'-'+this.clientName+'-'+"organization-chart"+'.'+fileExt;
        this.loading=false;
        this.downloadFile(data,fileName);
    }, err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    });
}

private downloadFile(data,filename) {
  const downloadedFile = new Blob([data], { type: data.type });
  const a = document.createElement('a');
  a.setAttribute('style', 'display:none;');
  document.body.appendChild(a);
  a.download = filename;
  a.href = URL.createObjectURL(downloadedFile);
  a.target = '_blank';
  a.click();
  document.body.removeChild(a);
}


  /*
 @Type: File, <ts>
 @Name: openFilterModalDialog function
 @Who:  Suika
 @When: 29-Oct-2021
 @Why: EWM-3279/33516
 @What: For opening filter  dialog box
  */

 openFilterModalDialog() {
  const dialogRef = this._dialog.open(CommonFilterDiologComponent, {
    data: new Object({ filterObj: this.filterConfig, GridId: this.GridId }),
    panelClass: ['xeople-modal', 'add_filterdialog', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,  
  });

  dialogRef.afterClosed().subscribe(res => {    
    if (res != false) {
      this.loading = true;
     this.filterCount = res.data?.length;  
      let filterParamArr = [];
      res.data.forEach(element => {
        filterParamArr.push({
          'FilterValue': element.ParamValue,
          'ColumnName': element.filterParam.Field,
          'ColumnType': element.filterParam.Type,
          'FilterOption': element.condition,
          'FilterCondition': 'AND'
        })
      });
      this.filterConfig = filterParamArr;
      this.loading = true;
         //by maneesh fixed new CommonFilterDiologComponent stop calling api
         let jsonObjFilterG = {};
         jsonObjFilterG['FilterConfig'] =res?.data?.length=='0'? null:filterParamArr;
         jsonObjFilterG['GridConfig'] = this.colArr;
         jsonObjFilterG['GridId'] = this.GridId;
         this.getLocalStorageData();
         this.setLocalStorageData('commonFilterDataStore',jsonObjFilterG);
         this.setFilterConfig(this.filterConfig);
         this.getClientFilterInfo(this.filterConfig);
    
    }else if(res.data?.length==0){
      this.filterCount =0;
      this.getLocalStorageData();
      this.setLocalStorageData('commonFilterDataStore',null);
      this.setFilterConfig(this.filterConfig);
    }
  })
  if (this._appSetting.isBlurredOn) {
    document.getElementById("main-comp").classList.add("is-blurred");
  }

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
@Name: getClientCount function
@Who: Suika
@When: 27-Oct-2021
@Why: EWM-3279/33516
@What: For getting the client list
*/

setFilterConfig(JobFilter) {
  this.loading = true;
  let jsonObj = {};
  if (JobFilter !== null) {
    jsonObj['FilterConfig'] = this.filterConfig;
  } else {
    jsonObj['FilterConfig'] = [];
  }
  jsonObj['GridId'] = this.GridId;
  jsonObj['CardConfig'] = [];
  jsonObj['GridConfig'] = this.colArr;
  this.jobService.setfilterConfig(jsonObj).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200) {
        // this.filterCount = repsonsedata.Data.length;   coment by maneesh
        this.loading = false;
      } else if (repsonsedata.HttpStatusCode === 204) {
       this.filterCount = 0;
        this.loading = false;
      } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
    }, err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

    })
}



getFilterConfig(loaderValue: boolean) {
  this.loading = loaderValue;
  this.jobService.getfilterConfig(this.GridId).subscribe(
    (repsonsedata: ResponceData) => {
      if (repsonsedata.HttpStatusCode === 200 || repsonsedata.HttpStatusCode === 204) {
        this.loading = false;
        let colArrSelected = [];
        if (repsonsedata.Data !== null) {
          this.colArr = repsonsedata.Data.GridConfig;
          this.filterConfig = repsonsedata.Data.FilterConfig;
          this.getLocalStorageData();
          this.setLocalStorageData('commonFilterDataStore',repsonsedata.Data);
          this.getClientFilterInfo(this.filterConfig);         
          if (this.filterConfig !== null) {
            this.filterCount = this.filterConfig.length;         
          } else {
            this.filterCount = 0;           
          }
          if (repsonsedata.Data.GridConfig.length != 0) {
            colArrSelected = repsonsedata.Data.GridConfig.filter(x => x.Selected == true);
          }
          if (colArrSelected.length !== 0) {
            this.columns = colArrSelected;
          } else {
            this.columns = this.colArr;
          }
        }
      } else {
        this.snackBService.showErrorSnackBar(this.translateService.instant(repsonsedata.Message), repsonsedata.HttpStatusCode);
        this.loading = false;
      }
    }, err => {
      this.loading = false;
      this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);
    })
}


/*
   @Type: File, <ts>
   @Name: clearFilterData function
   @Who:  Suika
   @When: 29-Oct-2021
   @Why: EWM-3279/33516
   @What: FOR DIALOG BOX confirmation
 */

clearFilterData(viewMode): void {
  const message = `label_confirmDialogJob`;
  const title = '';
  const subTitle = 'label_clientLanding';
  const dialogData = new ConfirmDialogModel(title, subTitle, message);
  const dialogRef = this._dialog.open(ConfirmDialogComponent, {
    maxWidth: "350px",
    data: dialogData,
    panelClass: ['custom-modalbox', 'animate__animated', 'animate__zoomIn'],
    disableClose: true,
  });

  dialogRef.afterClosed().subscribe(dialogResult => {
    
    this.result = dialogResult;    
    if (dialogResult == true) {
      this.filterConfig = null;/*@When:27-07-2023 @who: renu @why: EWM-13179 EWM-13182 @What: Filter is showing blank */
      let JobFilter = [];
      this.loading = true;
      this.filterCount = 0;
      this.getLocalStorageData();
      this.setLocalStorageData('commonFilterDataStore',this.filterConfig);
      this.setFilterConfig(this.filterConfig);
      this.filterConfig =[];
      this.getClientFilterInfo(this.filterConfig);
    }
  });
}



getClientFilterInfo(filterConfig){
  this.commonserviceService.onClientOrgFilterSelected.next(filterConfig);
}

reloadOrgChartData(){
  this.commonserviceService.isClientOrgReload.next(true); 
}

backOrgChartData(){
  this.commonserviceService.isClientOrgBackReload.next(true); 
}

 // @suika @EWM-12269 @EWM-11814 reload org structure
getOrganisationInfo(event) {
  this.organisationLoader = event;
}

/*
    @Type: File, <ts>
    @Name: folderChunkList
    @Who: Nitin Bhati
    @When: 23-Jan-2024
    @Why: EWM-15818
    @What: reintialisation the folder list for candidate
  */
    folderChunkList() {
      this.folderLoader = true;
      this._clientService.getClientFilterFolderList('?id=' + this.clientIdData).subscribe(
        (repsonsedata: ResponceData) => {
          if (repsonsedata.HttpStatusCode == '200') {
            this.folderLoader = false;
            this.candidateFoldersData = repsonsedata.Data;
          }else if(repsonsedata.HttpStatusCode == '204') {
            this.folderLoader = false;
            this.candidateFoldersData = [];
          } else {
             this.folderLoader = false;
          }
        }, err => {
          this.folderLoader = false;
        })
    }
  
    /*
         @Type: File, <ts>
         @Name: openQuickFolderModal
         @Who: Nitin Bhati
         @When: 23-Jan-2024
         @Why: EWM-15818
         @What: to open quick add Folder Filter modal dialog
       */
    openQuickFolderModal() {
      const message = ``;
      const title = 'label_disabled';
      const subtitle = 'label_folder';
      const dialogData = new ConfirmDialogModel(title, subtitle, message);
      const dialogRef = this._dialog.open(ClientFolderFeatureComponent, {
        data: new Object({ candidateId: this.clientIdData }),
        // data: dialogData,
        panelClass: ['xeople-modal', 'add_folder', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(res => {
        if (res == false) {
          this.folderLoader = true;
          this.folderChunkList();
        } else {
          this.folderLoader = false;
        }
      })
      if (this.appSettingsService.isBlurredOn) {
        document.getElementById("main-comp").classList.add("is-blurred");
      }
      // RTL Code
      let dir: string;
        dir = document.getElementsByClassName('cdk-global-overlay-wrapper')[0].attributes['dir'].value;
        let classList = document.getElementsByClassName('cdk-global-overlay-wrapper');
        for (let i = 0; i < classList.length; i++) {
          classList[i].setAttribute('dir', this.dirctionalLang);
        }
  
    }
          // Function to get the current config data from localStorage
          getLocalStorageData() {  //by maneesh fixed new CommonFilterDiologComponent stop calling api
            const data = this.CommonFilterdilogsrvs.getLocalStorage('commonFilterDataStore');
            return data ? JSON.parse(data) : {};
          }
 
          // Function to save config data to localStorage
           setLocalStorageData(key, data) {  //by maneesh fixed new CommonFilterDiologComponent stop calling api
            this.CommonFilterdilogsrvs.setLocalStorage(key,JSON.stringify(data));
          }
}
