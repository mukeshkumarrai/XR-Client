import { AgmMap } from '@agm/core';
import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LatLngBounds } from 'ngx-google-places-autocomplete/objects/latLngBounds';
interface marker {
  id:string;
	lat: number;
	lng: number;
  label?: string;
  ClientId:string;
  ClientName:string;
  CountryCode:string;
  CountryName:string;
  CountryId:number;
  Address:string;
	draggable: boolean;
  ZipCode:string;
  icon:string;
}

@Component({
  selector: 'app-googlemap',
  templateUrl: './googlemap.component.html',
  styleUrls: ['./googlemap.component.scss']
})
export class GooglemapComponent implements OnInit {
  // google maps zoom level
  zoom: number = 4;
  minClusterSize = 2;
  // initial center position for the map
  lat: number =  26.8309535;
  lng: number =  80.9244566;
  infoWindowOpened = null;
  previous_info_window = null;
  public dasboardMapPopUpData:any;
  public dasboardMapAllData: any;
dasboardMapData: any;
markers: marker[]=[];
clientdata:any[]=[];
public lattList= [];
public longList= [];
@ViewChild('AgmMap') agmMap: AgmMap;

constructor( @Inject(MAT_DIALOG_DATA) public data: any,@Optional() public dialogRef: MatDialogRef<GooglemapComponent>) { 
 this.dasboardMapData=data['orgStructureData'];
}

ngOnInit(): void {
  let latsum = 0;
  let longsum = 0;
  let count = 1;
 this.dasboardMapData.forEach(res=>{  
   this.markers.push({
     id:res.id,
     lat: Number(res.latitude),
     lng:  Number(res.longitude),
     label:'',
     ClientId:res.clientId,
     ClientName:res.clientname,
     CountryCode:'',
     CountryId:0,
     CountryName:res.country,
     Address:res.addresslinktomap,
     draggable: false,
     ZipCode:res.zippostalcode,
     icon:'/assets/icons/marker.png'
   });
  //  longsum += Number(res.longitude);
  //  latsum += Number(res.latitude);
  //  count ++;
 })
//  this.lat = (latsum)/count ;
//  this.lng = (longsum)/ count; 

}

clickedMarker(ClientId: number,infoWindow, index: number) {
 if (this.previous_info_window == null)
 this.previous_info_window = infoWindow;
else{
 this.infoWindowOpened = infoWindow
 this.previous_info_window.close()
}
this.previous_info_window = infoWindow;
this.dasboardMapPopUpData =  this.dasboardMapData.filter(x => x.id == ClientId);


}

mapReady(map) {
 map.setOptions({ 
  // zoom: 1,
  // minZoom: 1,
   zoomControl: "true",
   zoomControlOptions: {
     position: google.maps.ControlPosition.TOP_RIGHT
   },
   fullscreenControl: false,
   fullscreenControlOptions: {
     position:  google.maps.ControlPosition.TOP_RIGHT,
   },
 });
 //this.loader = true;
 map.addListener("dragend", () => {
   //this.loader = false;
   // do something with centerLatitude/centerLongitude
 });
}

mapClicked($event: any) {
 if (this.previous_info_window != null ) {
   this.previous_info_window.close()
   }

}

markerDragEnd(m: marker, $event: MouseEvent) {
}

onDismiss(){    
 
 document.getElementsByClassName("client-dashnoard-expand-modal")[0].classList.remove("animate__zoomIn")
 document.getElementsByClassName("client-dashnoard-expand-modal")[0].classList.add("animate__zoomOut");
 setTimeout(() => { this.dialogRef.close(false); }, 200);
}

ngAfterViewInit() {
  this.agmMap.mapReady.subscribe(map => {
    const bounds: LatLngBounds = new google.maps.LatLngBounds();
    for (const mm of this.markers) {
      bounds.extend(new google.maps.LatLng(mm.lat, mm.lng));
    }
    map.fitBounds(bounds);
  });
}

}
