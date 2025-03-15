/*
    @(C): Entire Software
    @Type: File, <ts>
    @Who: Nitin Bhati 
    @When: 07-Feb-2023
    @Why: EWM-9628 EWM-10420
    @What:  This page wil be use  for job configure fields tree checkbox
*/
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {ThemePalette} from '@angular/material/core';
export interface Task {
  isCollapse:boolean
  Name: string;
  IsChecked: boolean;
  color: ThemePalette;
  IsIntermediate:boolean;
  ListColumn?: Task[];
}
@Component({
  selector: 'app-configure-job-field-permission',
  templateUrl: './configure-job-field-permission.component.html',
  styleUrls: ['./configure-job-field-permission.component.scss']
})
export class ConfigureJobFieldPermissionComponent implements OnInit {
  @Input() opened = false;
  @Input() data:any;
  @Output() menudata:EventEmitter<any> = new EventEmitter<any>();
  @Output() toggle: EventEmitter<any> = new EventEmitter<any>();
  constructor() {
   }
  ngOnInit(): void {
   // console.log("data:",this.data);
  }
  
  allComplete: boolean = false;
  updateAllComplete(completed: boolean,subtask:any) {
    if (this.data.ListColumn == null) {
      return;
    }
    this.data.ListColumn.forEach((t:any) => {
     let parentId=0;
      t.ListColumn.forEach((cn:any) => {
        if(cn.Id==subtask.Id)
        {
          cn.IsChecked=completed;
          parentId=cn.parentId;
        }
        else if(cn.Id==subtask.ParentId)
        {
          let chparentId=0;
          cn.ListColumn.forEach((ch:any) => {
            if(ch.Id==subtask.Id)
            {
              ch.IsChecked=completed;
              chparentId=ch.parentId;
            }});
            if(cn.ListColumn.length >0 ){
      cn.IsChecked= cn.ListColumn.every((ch:any)=> ch.IsChecked) && !cn.IsChecked;
            }
      cn.IsIntermediate=(cn.ListColumn.filter((tch:any) => tch.IsChecked).length > 0 ||cn.ListColumn.filter((tch:any) => tch.IsIntermediate).length > 0) && !cn.IsChecked;
         
        }
      });
     if( t.ListColumn.length >0 ){
      t.IsChecked= t.ListColumn.every((cn:any)=> cn.IsChecked) && !t.IsChecked ;}
      t.IsIntermediate=(t.ListColumn.filter((tc:any) => tc.IsChecked).length > 0 ||t.ListColumn.filter((tc:any) => tc.IsIntermediate).length > 0) && !t.IsChecked;
 
      if(t.Id==subtask.Id)
      {
        t.IsChecked=completed;
      }
    });
    this.allComplete = this.data.ListColumn.length > 0 && this.data.ListColumn.every((t:any)=> t.IsChecked );
    this.data.IsChecked=this.allComplete;
    this.data.IsIntermediate=(this.data.ListColumn.filter((tc:any) => tc.IsChecked).length > 0 ||this.data.ListColumn.filter((tc:any) => tc.IsIntermediate).length > 0) && !this.data.IsChecked;
 
    this.menudata.emit(this.data);
  }
    /*
    @Type: File, <ts>
    @Name: someComplete function
    @Who: Nitin Bhati 
    @When: 07-Feb-2023
    @Why: EWM-9628 EWM-10420
    */
  someComplete(): boolean {
    if (this.data.ListColumn == null|| this.data.ListColumn.length == 0) {
      this.allComplete=this.data.IsChecked;
      return false;
    }
    if(this.data.ListColumn.length>0){   
      this.allComplete = this.data.ListColumn != null && this.data.ListColumn.every((t:any)=> t.IsChecked );
     this.data.IsChecked=this.allComplete;
    }
    return (this.data.ListColumn.filter((t:any) => t.IsChecked).length > 0 ||this.data.ListColumn.filter((t:any) => t.IsIntermediate).length > 0)&& !this.allComplete;
  }
  /*
    @Type: File, <ts>
    @Name: setAll function
    @Who: Nitin Bhati 
    @When: 07-Feb-2023
    @Why: EWM-9628 EWM-10420
    */
  setAll(completed:boolean,isChild:boolean,node) {
    if (this.data.ListColumn == null) {
      return;
    }
    if(isChild)
    {
      this.data.ListColumn.forEach((t:any) =>{
       // console.log("data node:",node);
        if(t.Id==node.Id)
        {
          t.IsChecked=completed;
        //   t.ListColumn.forEach((tc:any) => {tc.IsChecked = completed;       
        // });
        //t.IsIntermediate=(t.ListColumn.filter((tch:any)=>tch.IsChecked).length > 0||t.ListColumn.filter((tch:any)=>tch.IsIntermediate).length > 0) && !t.IsChecked
        t.IsIntermediate=t.IsChecked;
       
      }
      else if(t.Id==node.ParentId)
      {  
        t.ListColumn.forEach((tc:any) => {
          if(tc.Id==node.Id){
          tc.IsChecked = completed;
          tc.ListColumn.forEach((tch:any) =>{ tch.IsChecked = completed});
          tc.IsIntermediate=(tc.ListColumn.filter((tch:any)=>tch.IsChecked).length > 0||tc.ListColumn.filter((tch:any)=>tch.IsIntermediate).length > 0) && !tc.IsChecked
          }
        });
        t.IsChecked=t.ListColumn.every((t:any)=> t.IsChecked);
        t.IsIntermediate=(t.ListColumn.filter((tc:any)=>tc.IsChecked).length > 0||t.ListColumn.filter((tc:any)=>tc.IsIntermediate).length > 0) && !t.IsChecked
      }
      });
      this.allComplete = this.data.ListColumn != null && this.data.ListColumn.every((t:any)=> t.IsChecked );
      this.data.IsChecked= this.allComplete;
      this.data.IsIntermediate=(this.data.ListColumn.filter((t:any) => t.IsChecked).length > 0 ||this.data.ListColumn.filter((t:any) => t.IsIntermediate).length > 0)&& !this.allComplete
    }
    else{
    this.allComplete = completed;
    this.data.ListColumn.forEach((t:any) => {
      if(t.IsDefault===0){
        t.IsChecked = completed;
        t.IsIntermediate=false; 
      }
            
    }
    );
    this.data.IsIntermediate=false;
    this.data.IsChecked=completed; 
  }
  this.menudata.emit(this.data);
  }
  /*
    @Type: File, <ts>
    @Name: togglemeu function
    @Who: Nitin Bhati 
    @When: 07-Feb-2023
    @Why: EWM-9628 EWM-10420
    */
  togglemeu(menu:any)
  {
    if (this.data.ListColumn == null) {
    return false;
  }
  this.data.ListColumn.forEach((t:any) => {
    if(t.Id==menu.Id)
    {
      t.isCollapse=!menu.isCollapse;
    }
    else if(t.Id==menu.ParentId)
    {  
      t.ListColumn.forEach((tc:any) => {
        if(tc.Id==menu.Id){
          tc.isCollapse=!menu.isCollapse;
        }
      });
    } 
  });
  }

}
