import { Component, EventEmitter, Inject, Input, OnInit, Optional, Output } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ResponceData } from 'src/app/shared/models';
import { AppSettingsService } from 'src/app/shared/services/app-settings.service';
import { CommonserviceService } from 'src/app/shared/services/commonservice/commonservice.service';
import { UserpreferencesService } from 'src/app/shared/services/commonservice/userpreferences.service';
import { SidebarService } from 'src/app/shared/services/sidebar/sidebar.service';
import { SnackBarService } from 'src/app/shared/services/snackbar/snack-bar.service';
import { GooglemapComponent } from '../../shared/googlemap/googlemap.component';
import { ClientService } from '../../shared/services/client/client.service';

@Component({
  selector: 'app-client-org',
  templateUrl: './client-org.component.html',
  styleUrls: ['./client-org.component.scss']
})
export class ClientOrgComponent implements OnInit {
  public loading:boolean = false;  
  @Input() clientIdData:any;  
  @Input() clientName:any; 
  @Input() filterConfig:any;
  public  clientId:any;
  public filterConfigData:any;
  public orgStructureData :any = [];
  public viewMode :any ='add';
  background20: any;
  @Output() organisationInfo = new EventEmitter();
  public isPopUp:boolean = false;
  constructor(@Optional() public dialogRef: MatDialogRef<ClientOrgComponent>,@Optional() @Inject(MAT_DIALOG_DATA) public data: any[],private routes: ActivatedRoute, public _sidebarService: SidebarService, public _userpreferencesService: UserpreferencesService, private appSettingsService: AppSettingsService,
    private translateService: TranslateService, private commonserviceService: CommonserviceService,private snackBService: SnackBarService,private clientService: ClientService, public dialog: MatDialog) {
     if(data!=null){
      this.viewMode = data['viewmode'];
      this.clientName = data['clientName'];
      this.background20 = data['background20'];
      this.isPopUp = true;
     }
     }

  ngOnInit(): void {
    this.routes.queryParams.subscribe((value) => {
      if(value.clientId!=undefined && value.clientId!=null && value.clientId!=''){
       this.clientIdData = value.clientId;
      }
    });
  
    this.commonserviceService.onClientSelectId.subscribe(value => {     
      if (value !== null) {
        this.clientIdData = value;  
        this.getOrganisationStructure(this.clientIdData);    
      } 
    })

    this.commonserviceService.onClientOrgFilterSelected.subscribe(value => {     
      if (value !== null) {
        this.filterConfig = value;  
        this.getOrganisationStructure(this.clientIdData);    
      } 
    })

    this.commonserviceService.isClientOrgBackReload.subscribe(value => {     
      if (value !== null || value== true) {
        this.getOrganisationStructure(this.clientIdData);    
      } 
    })

    this.commonserviceService.isClientOrgReload.subscribe(value => {     
      if (value== true) {
        this.reloadOrgChart();
      } 
    })
   
    this.getOrganisationStructure(this.clientIdData);
    let primaryColor = document.documentElement.style.getPropertyValue('--primary-color');
    this.background20 = this.hexToRGB(primaryColor, 0.20);
  
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
 
    reloadOrgChart(){
    let clientid = localStorage.getItem('clientIdOrg');
    // @suika @EWM-12269 @EWM-11814 reload org structure
    this.getOrganisationStructure(this.clientIdData);      
    }
  
  selectNode(nodeData: {Name: string, Location: string}) {
    alert(`Hi All. I'm ${nodeData.Name}. I'm from ${nodeData.Location}.`);   
  }

   /*
@Name: getOrganisationStructure function
@Who: Suika
@When: 18-nov-2021
@Why:EWM-3641 EWM-3840
*/
getOrganisationStructure(clientId: any) {
  this.organisationInfo.emit(true);
  this.loading = true;  
  let jsonObj = {}; 
  jsonObj['ClientId'] = clientId;
  jsonObj['GridId']="Clientdashboard_grid_001";
  jsonObj['FilterParams']=this.filterConfig;
  this.clientService.getOrganisationStructure(jsonObj)
    .subscribe(
      (data: ResponceData) => {
        if (data.HttpStatusCode === 200) {
          this.orgStructureData = data.Data;
          this.loading = false;
          this.organisationInfo.emit(false);
        }
        else if (data.HttpStatusCode === 204) {
          this.orgStructureData = [];
          this.loading = false;
          this.organisationInfo.emit(false);
        }
        else {
          this.snackBService.showErrorSnackBar(this.translateService.instant(data.Message), data.HttpStatusCode);
          this.loading = false;
          this.organisationInfo.emit(false);
        }
      }, err => {
        this.loading = false;
        this.organisationInfo.emit(false);
        this.snackBService.showErrorSnackBar(this.translateService.instant(err.Message), err.StatusCode);

      });

}


onDismiss(){    
  document.getElementsByClassName("quick-modalbox")[0].classList.remove("animate__zoomIn")
  document.getElementsByClassName("quick-modalbox")[0].classList.add("animate__zoomOut");
  setTimeout(() => { this.dialogRef.close(false); }, 200);
  if (this.appSettingsService.isBlurredOn) {
    document.getElementById("main-comp").classList.remove("is-blurred");
  }
}

/*
     @Type: File, <ts>
     @Name: openNewTabForGoogleMapLocation
     @Who: Anup
     @When: 07-oct-2021
     @Why: EWM-3127 EWM3182
     @What: to open New window Tab For Google Map Location show
   */
  // openNewTabForGoogleMapLocation(canData) {
  //   if ((canData.latitude != undefined && canData.latitude != null && canData.latitude != "") &&
  //     (canData.longitude != undefined && canData.longitude != null && canData.longitude != "")) {
  //     let urlloc = "https://www.google.com/maps/place/" + canData.longitude + ',' + canData.longitude;
  //     window.open(urlloc, '_blank');
  //   } else if (canData.addresslinktomap != undefined && canData.addresslinktomap != null && canData.addresslinktomap != "") {
  //     let urlloc = "https://www.google.com/maps/place/" + canData.addresslinktomap;
  //     window.open(urlloc, '_blank');
  //   } else {
  //     // console.log(canData)
  //   }
  // }

  reloadInternalOrgStructure(clientId){   
    localStorage.setItem('clientIdOrg',clientId); 
    this.getOrganisationStructure(clientId);
  }

  /* 
     @Type: File, <ts>
     @Name: openlocationMap
     @Who: Renu
     @When: 29-Dec-2021
     @Why: EWM-4368/4407
     @What: For open client page
   */
     openNewTabForGoogleMapLocation(address) {
      const dialogRef = this.dialog.open(GooglemapComponent, {
        // maxWidth: "1150px",
        // maxHeight: "750px",
        // width:"90%",
        // height:"90%",
        data: new Object({orgStructureData:address}),
        panelClass: ['xeople-modal-full-screen', 'client-dashnoard-expand-modal', 'animate__animated', 'animate__zoomIn'],
        disableClose: true,
      });
      dialogRef.afterClosed().subscribe(result => {
        
         });
    }
}
