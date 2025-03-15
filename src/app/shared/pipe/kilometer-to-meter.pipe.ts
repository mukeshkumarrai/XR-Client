import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'kilometerToMeter'
})
export class KilometerToMeterPipe implements PipeTransform {
  distance: number;

  transform(distancemeter:number,distanceType:number): number {
   
    if(distanceType==2){
      this.distance=0.000621371;
       //let dist=Math.round(distancemeter * this.distance);
       let dist=(distancemeter * this.distance);
       let distanceFinal = dist.toFixed(2);
      let result:any;
      result = distanceFinal + ' Miles'; 
      return result;
    }else{
      this.distance=0.001;
       //let dist=Math.round(distancemeter * this.distance);
      let dist=(distancemeter * this.distance);
      let distanceFinal = dist.toFixed(2);
      let result:any;
      result = distanceFinal + ' KMs'; 
      return result;
    }
    }

}
