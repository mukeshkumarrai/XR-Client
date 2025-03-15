/*
    @(C): Entire Software
    @Type: File, <ts>
    @Who:  Adarsh
    @When: 06-oct-2021
    @Why: EWM-6879 EWM-7341
    @What: This page is creted for show distance in google Map
*/
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CandidateService } from 'src/app/modules/EWM.core/shared/services/candidates/candidate.service';
import { ProfileInfoService } from 'src/app/modules/EWM.core/shared/services/profile-info/profile-info.service';
import { QuickpeopleService } from 'src/app/modules/EWM.core/shared/services/quick-people/quickpeople.service';
import { SystemSettingService } from 'src/app/modules/EWM.core/shared/services/system-setting/system-setting.service';
import { CommonserviceService } from '../../services/commonservice/commonservice.service';
import { ServiceListClass } from '../../services/sevicelist';
import { SnackBarService } from '../../services/snackbar/snack-bar.service';
declare var google

@Component({
  selector: 'app-google-maps-location-pop',
  templateUrl: './google-maps-location-pop.component.html',
  styleUrls: ['./google-maps-location-pop.component.scss']
})
export class GoogleMapsLocationPopComponent implements OnInit {

  loading:boolean=false;
  distanceData: any;
  durationData: any;
  jobAddress: any;
  canAddress: any;
  distanceType: string;
  public lat:any;
  public lng:any;

public origin: any;
public destination: any;
public distance:any=0;
  constructor(public dialogRef: MatDialogRef<GoogleMapsLocationPopComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private commonserviceService: CommonserviceService, private fb: FormBuilder, private snackBService: SnackBarService,
    public dialog: MatDialog, private translateService: TranslateService,
    private profileInfoService: ProfileInfoService,private domSanitizer: DomSanitizer,
    private router: ActivatedRoute, private serviceListClass: ServiceListClass) { 
    }

  ngOnInit(): void {
    this.distance = this.data.proximity+' KM';
    this.distanceType= localStorage.getItem('Distance'),
    this.initMap(this.data)
    this.getDirection(this.data);
    this.lat=parseFloat(this.data.jobLat);
    this.lng=parseFloat(this.data.jobLong);
   
  }

  getDirection(value) {
    this.origin = { lat: parseFloat(value.jobLat), lng: parseFloat(value.jobLong) };
    this.destination = { lat: parseFloat(value.canLat), lng: parseFloat(value.canLong) };
  
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

jobLat;
jobLong;
canLat;
canLong;
fullUrl: SafeResourceUrl;
redirectUrl: any;

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
        this.distanceData = this.getDistanceValues(response.rows);
        this.durationData = response.rows[0].elements[0].duration;       
        // if(parseInt(this.distanceType)===2){
        //  this.distance= Math.round((this.distanceData?.value/1000)/1.609) + ' miles';
        // }else{
        //  this.distance  = this.distanceData?.text;
        // }
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
        this.distanceData = this.getDistanceValues(response.rows);
        this.durationData = response.rows[0].elements[1].duration;
        // console.log(response, "response", this.distanceData)
      });
      this.jobAddress = value.jobLat + '° N, ' + value.jobLong  + '° E';
      this.canAddress = value.canLat + '° N, ' + value.canLong + '° E';
    }

    this.jobLat = value.jobLat;
    this.jobLong = value.jobLong;
    this.canLat = value.canLat;
    this.canLong = value.canLong;

    // https://www.google.es/maps/dir/'52.51758801683297,13.397978515625027'/'52.49083837044266,13.369826049804715'
    let mapParameters = this.jobLat+','+this.jobLong+'/'+this.canLat+','+this.canLong;
    this.redirectUrl = 'https://www.google.es/maps/dir/'+mapParameters;
    let URLSanitze:any =  this.domSanitizer.bypassSecurityTrustUrl('https://www.google.es/maps/dir/'+mapParameters)
    this.fullUrl = URLSanitze.changingThisBreaksApplicationSecurity;
  }

  getDistanceValues(responseArray) {
    const distances = [];
    responseArray.forEach((response) => {
      const validElement = response.elements.find((element) => element.status === "OK");
      if (validElement && validElement.distance) {
        distances.push(validElement.distance.text);
      }
    });
    return distances;
  }


}
