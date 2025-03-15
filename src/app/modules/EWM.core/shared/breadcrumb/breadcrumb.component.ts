import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TextChangeLngService } from 'src/app/shared/services/commonservice/text-change-lng.service';

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  @Input() pageLabel:any;
  lngClient_Emp:any;
  innerlabel:any;
  outterlabel:any;
  
  constructor(private router: Router,private route: ActivatedRoute,private textChangeLngService:TextChangeLngService,) { }

  ngOnInit(): void {
    let str=this.pageLabel.split(',');
    if(str.length>1){
    this.innerlabel=str[0];
    this.outterlabel=str[1];
    }
    else{
      this.outterlabel=str[0]
    }
    if(this.outterlabel=='label_employeeTag'){
     // this.lngClient_Emp=this.textChangeLngService.getDataEmployee('singular');
    }else {
     // this.lngClient_Emp=this.textChangeLngService.getData('singular');
    }
   
  }


  redirect(){
    this.router.navigate(['./client/core/administrators/masterdata']);
  }
  redirectToJob(){
    this.router.navigate(['./client/core/job/list']);  
  }
}
