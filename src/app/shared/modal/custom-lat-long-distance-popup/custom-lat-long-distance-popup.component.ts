/*
    @(C): Entire Software
    @Type: File, <ts>
    @Who:  ANUP
    @When: 06-oct-2021
    @Why: EWM-3088 EWM-3181
    @What: This page is creted for disatance count
*/
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
import { ProfileInfoService } from 'src/app/modules/EWM.core/shared/services/profile-info/profile-info.service';
import { QuickpeopleService } from 'src/app/modules/EWM.core/shared/services/quick-people/quickpeople.service';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { CommonserviceService } from '../../services/commonservice/commonservice.service';
import { ServiceListClass } from '../../services/sevicelist';
import { SnackBarService } from '../../services/snackbar/snack-bar.service';
import { AgmInfoWindow, AgmMap, AgmMarker } from '@agm/core';
import { LatLngBounds } from 'ngx-google-places-autocomplete/objects/latLngBounds';


declare var google

@Component({
  selector: 'app-custom-lat-long-distance-popup',
  templateUrl: './custom-lat-long-distance-popup.component.html',
  styleUrls: ['./custom-lat-long-distance-popup.component.scss']
})
export class CustomLatLongDistancePopupComponent implements OnInit {
  loading:boolean=false;
  distanceData: any;
  durationData: any;
  jobAddress: any;
  canAddress: any;
  distanceType: string;
  bounds: LatLngBounds;
  public lat = 24.799448;
  public lng = 120.979021;
  public origin: any;
  public destination: any;
  @ViewChild('AgmMap') agmMap: AgmMap;

  constructor(public dialogRef: MatDialogRef<CustomLatLongDistancePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private commonserviceService: CommonserviceService, private fb: FormBuilder, private snackBService: SnackBarService,
    public dialog: MatDialog, private translateService: TranslateService,
    private profileInfoService: ProfileInfoService,
    private router: ActivatedRoute, private serviceListClass: ServiceListClass) { 
      // this i write because to display a marks on first place and last place
    // this.start_end_mark.push(this.latlng[0]);
    // this.start_end_mark.push(this.latlng[this.latlng.length - 1]);
    }

  ngOnInit(): void {
    this.getDirection();
    this.distanceType= localStorage.getItem('Distance'),
    this.initMap(this.data)

  }

  getDirection() {
    this.origin = { lat: 24.799448, lng: 120.979021 };
    this.destination = { lat: 24.799524, lng: 120.975017 };
  
    // Location within a string
    // this.origin = 'Taipei Main Station';
    // this.destination = 'Taiwan Presidential Office';
  }

  /*
@Type: File, <ts>
@Name: onDismiss function
@Who:  ANUP
@When: 06-oct-2021
@Why: EWM-3088 EWM-3181
@What: For cancel popup
*/
  onDismiss(): void {
    document.getElementsByClassName("candidateLatLong")[0].classList.remove("animate__zoomIn")
    document.getElementsByClassName("candidateLatLong")[0].classList.add("animate__zoomOut");
    setTimeout(() => { this.dialogRef.close(false); }, 200);
  }


  /*
@Type: File, <ts>
@Name: initMap function
@Who:  ANUP
@When: 07-oct-2021
@Why: EWM-3088 EWM-3181
@What: For calculate distance between two lat long 
*/
  initMap(value) {
    this.loading = true;
    const service = new google.maps.DistanceMatrixService();
    // build request
    if ((value.jobAddress != undefined && value.jobAddress != null && value.jobAddress != '') &&
      (value.canAddress != undefined && value.canAddress != null && value.canAddress != '')) {
        this.loading = false;
          //// Start Distance code 
      const origin1 = { lat: parseFloat(value.jobLat), lng: parseFloat(value.jobLong) };
      const origin2 = value.jobAddress;
      const destinationA = value.canAddress;
      const destinationB = { lat: parseFloat(value.canLat), lng: parseFloat(value.canLong) };

      const request = {
        origins: [origin1, origin2],
        destinations: [destinationA, destinationB],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false,
      };
      // get distance matrix response
      service.getDistanceMatrix(request).then((response) => {
        //   put response
        this.distanceData = response.rows[0].elements[0].distance;
        this.durationData = response.rows[0].elements[0].duration;
      });
      this.jobAddress = value.jobAddress;
      this.canAddress = value.canAddress;
    }

    else {
      this.loading = false;
      //// Start Distance code      
      const origin1 = { lat: parseFloat(value.jobLat), lng: parseFloat(value.jobLong) };
      const origin2 = '';
      const destinationA = '';
      const destinationB = { lat: parseFloat(value.canLat), lng: parseFloat(value.canLong) };

      const request = {
        origins: [origin1, origin2],
        destinations: [destinationA, destinationB],
        travelMode: google.maps.TravelMode.DRIVING,
        unitSystem: google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false,
      };
      // get distance matrix response
      service.getDistanceMatrix(request).then((response) => {
        //   put response
        this.distanceData = response.rows[0].elements[1].distance;
        this.durationData = response.rows[0].elements[1].duration;
        // console.log(response, "response", this.distanceData)
      });

      this.jobAddress = value.jobLat + '° N, ' + value.jobLong  + '° E';
      this.canAddress = value.canLat + '° N, ' + value.canLong + '° E';
    }




  }










}
