/*
    @(C): Entire Software
    @Type: File, <ts>
    @Who: priti srivastava
    @When: 19-march-2021
    @Why: EWM-1124
    @What:  This page wil be use  for tree checkbox
*/
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {ThemePalette} from '@angular/material/core';
export interface Task {
  isCollapse:boolean
  Name: string;
  IsChecked: boolean;
  color: ThemePalette;
  IsIntermediate:boolean;
  Children?: Task[];
}

@Component({
  selector: 'app-user-role-permission',
  templateUrl: './user-role-permission.component.html',
  styleUrls: ['./user-role-permission.component.scss']
})
export class UserRolePermissionComponent implements OnInit {
  @Input() opened = false;
  @Input() data:any;
  @Output() menudata:EventEmitter<any> = new EventEmitter<any>();
  @Output() toggle: EventEmitter<any> = new EventEmitter<any>();
  constructor() {
   }
  ngOnInit(): void {
  }
  allComplete: boolean = false;
  updateAllComplete(completed: boolean,subtask:any) {
    if (this.data.Children == null) {
      return;
    }
    this.data.Children.forEach((t:any) => {
     let parentId=0;
      t.Children.forEach((cn:any) => {
        if(cn.Id==subtask.Id)
        {
          cn.IsChecked=completed;
          parentId=cn.parentId;
        }
        else if(cn.Id==subtask.ParentId)
        {
          let chparentId=0;
          cn.Children.forEach((ch:any) => {
            if(ch.Id==subtask.Id)
            {
              ch.IsChecked=completed;
              chparentId=ch.parentId;
            }});
            if(cn.Children.length >0 ){
      cn.IsChecked= cn.Children.every((ch:any)=> ch.IsChecked) && !cn.IsChecked;
            }
      cn.IsIntermediate=(cn.Children.filter((tch:any) => tch.IsChecked).length > 0 ||cn.Children.filter((tch:any) => tch.IsIntermediate).length > 0) && !cn.IsChecked;
         
        }
      });
     if( t.Children.length >0 ){
      t.IsChecked= t.Children.every((cn:any)=> cn.IsChecked) && !t.IsChecked ;}
      t.IsIntermediate=(t.Children.filter((tc:any) => tc.IsChecked).length > 0 ||t.Children.filter((tc:any) => tc.IsIntermediate).length > 0) && !t.IsChecked;
 
      if(t.Id==subtask.Id)
      {
        t.IsChecked=completed;
      }
    });
    this.allComplete = this.data.Children.length > 0 && this.data.Children.every((t:any)=> t.IsChecked );
    this.data.IsChecked=this.allComplete;
    this.data.IsIntermediate=(this.data.Children.filter((tc:any) => tc.IsChecked).length > 0 ||this.data.Children.filter((tc:any) => tc.IsIntermediate).length > 0) && !this.data.IsChecked;
 
    this.menudata.emit(this.data);
  }

  someComplete(): boolean {
    if (this.data.Children == null|| this.data.Children.length == 0) {
      this.allComplete=this.data.IsChecked;
      return false;
    }
    if(this.data.Children.length>0){   
      this.allComplete = this.data.Children != null && this.data.Children.every((t:any)=> t.IsChecked );
     this.data.IsChecked=this.allComplete;
    }
    return (this.data.Children.filter((t:any) => t.IsChecked).length > 0 ||this.data.Children.filter((t:any) => t.IsIntermediate).length > 0)&& !this.allComplete;
  }
  setAll(completed:boolean,isChild:boolean,node) {
    if (this.data.Children == null) {
      return;
    }
    if(isChild)
    {
      this.data.Children.forEach((t:any) =>{
        if(t.Id==node.Id)
        {t.IsChecked=completed;
          t.Children.forEach((tc:any) => {tc.IsChecked = completed;
          tc.Children.forEach((tch:any) =>{ tch.IsChecked = completed});
          tc.IsIntermediate=(tc.Children.filter((tch:any)=>tch.IsChecked).length > 0||tc.Children.filter((tch:any)=>tch.IsIntermediate).length > 0) && !tc.IsChecked
       
        });
        t.IsIntermediate=(t.Children.filter((tch:any)=>tch.IsChecked).length > 0||t.Children.filter((tch:any)=>tch.IsIntermediate).length > 0) && !t.IsChecked
       
      }
      else if(t.Id==node.ParentId)
      {  
        t.Children.forEach((tc:any) => {
          if(tc.Id==node.Id){
          tc.IsChecked = completed;
          tc.Children.forEach((tch:any) =>{ tch.IsChecked = completed});
          tc.IsIntermediate=(tc.Children.filter((tch:any)=>tch.IsChecked).length > 0||tc.Children.filter((tch:any)=>tch.IsIntermediate).length > 0) && !tc.IsChecked
          }
        });
        t.IsChecked=t.Children.every((t:any)=> t.IsChecked);
        t.IsIntermediate=(t.Children.filter((tc:any)=>tc.IsChecked).length > 0||t.Children.filter((tc:any)=>tc.IsIntermediate).length > 0) && !t.IsChecked
      }
      });
      this.allComplete = this.data.Children != null && this.data.Children.every((t:any)=> t.IsChecked );
      this.data.IsChecked= this.allComplete;
      this.data.IsIntermediate=(this.data.Children.filter((t:any) => t.IsChecked).length > 0 ||this.data.Children.filter((t:any) => t.IsIntermediate).length > 0)&& !this.allComplete
    }
    else{
    this.allComplete = completed;
    this.data.Children.forEach((t:any) => {t.IsChecked = completed;
          t.IsIntermediate=false;
          t.Children.forEach((tc:any) =>{ tc.IsChecked = completed;
          tc.IsIntermediate=false;
          tc.Children.forEach((tch:any) =>{ tch.IsChecked = completed
          tch.IsIntermediate=false; 
          })
          });
    }
    );
    this.data.IsIntermediate=false;
    this.data.IsChecked=completed; 
  }
  this.menudata.emit(this.data);
  }
  togglemeu(menu:any)
  {
    if (this.data.Children == null) {
    return false;
  }
  this.data.Children.forEach((t:any) => {
    if(t.Id==menu.Id)
    {
      t.isCollapse=!menu.isCollapse;
    }
    else if(t.Id==menu.ParentId)
    {  
      t.Children.forEach((tc:any) => {
        if(tc.Id==menu.Id){
          tc.isCollapse=!menu.isCollapse;
        }
      });
    } 
  });
  }
  
}
