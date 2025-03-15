import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ProfileInfoService } from 'src/app/modules/EWM.core/shared/services/profile-info/profile-info.service';
import { CommonserviceService } from '../../services/commonservice/commonservice.service';
import { ServiceListClass } from '../../services/sevicelist';
import { SnackBarService } from '../../services/snackbar/snack-bar.service';
declare var google

@Component({
  selector: 'app-job-details-card-viewgoogle-maps-location-pop',
  templateUrl: './job-details-card-viewgoogle-maps-location-pop.component.html',
  styleUrls: ['./job-details-card-viewgoogle-maps-location-pop.component.scss']
})
export class JobDetailsCardViewgoogleMapsLocationPopComponent implements OnInit {

  loading:boolean=false;
  distanceData: any;
  durationData: any;
  jobAddress: string;
  canAddress: string;
  distanceType: string;
  public lat:any;
  public lng:any;

public origin: any;
public destination: any;
public distance:any;

jobLat: string;
jobLong: string;
canLat: string;
canLong: string;
fullUrl: SafeResourceUrl;
redirectUrl: any;

  constructor(public dialogRef: MatDialogRef<JobDetailsCardViewgoogleMapsLocationPopComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private commonserviceService: CommonserviceService, private fb: FormBuilder, private snackBService: SnackBarService,
    public dialog: MatDialog, private translateService: TranslateService,
    private profileInfoService: ProfileInfoService,private domSanitizer: DomSanitizer,
    private router: ActivatedRoute, private serviceListClass: ServiceListClass) { 
    }

  ngOnInit(): void {
    this.distance = 0;
    this.distanceType= localStorage.getItem('Distance'),
    this.initMap(this.data)
    this.getDirection(this.data);
    this.lat=parseFloat(this.data.jobLat);
    this.lng=parseFloat(this.data.jobLong);
   
  }

  getDirection(value) {
    this.origin = { lat: parseFloat(value.jobLat), lng: parseFloat(value.jobLong) };
    this.destination = { lat: parseFloat(value.canLat), lng: parseFloat(value.canLong) };
  }

  /*
@Type: File, <ts>
@Name: onDismiss function
@Who:  Adarsh singh
@When: 09-09-2023
@Why: EWM-13814 EWM-13877
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
@Who:  Adarsh singh
@When: 09-09-2023
@Why: EWM-13814 EWM-13877
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
        if(parseInt(this.distanceType)===2){
         this.distance= Math.round((this.distanceData?.value/1000)/1.609) + ' miles';
        }else{
         this.distance  = this.distanceData?.text;
        }
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


}
