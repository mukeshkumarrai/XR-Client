/**
   @(C): Entire Software
   @Type: ts
   @Name: has-permission.directive.ts
   @Who: renu
   @When: 06-Sept-2021
   @Why: #ROST-2295
   @What: This directive work for user based page wise permission for button ADD/edit/view
  */
 
import { Directive, ElementRef, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { permissions } from '../models/common.model';
import { CommonserviceService } from '../services/commonservice/commonservice.service';

@Directive({
  selector: '[appHasPermission]'
})
export class HasPermissionDirective {

  private currentUser;
  private permissions :string;
  private isHidden = true;

  /*
  @Type: File, <ts>
  @Name: constructor
  @Who: Renu
  @When: 07-Sept-2021
  @Why: EWM-2295
  @What: serive file injection
  */

  constructor(
    private element: ElementRef,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private commonserviceService:CommonserviceService
  ) {

  }

  /*
  @Type: File, <ts>
  @Name: ngOnInit
  @Who: Renu
  @When: 07-Sept-2021
  @Why: EWM-2295
  @What: on load functions
  */
  ngOnInit() {
  
      this.commonserviceService.currentUserPermission.subscribe(user => {
      this.currentUser = [user];
      this.updateView();
    });
  }

   /*
  @Type: File, <ts>
  @Name: appHasPermission
  @Who: Renu
  @When: 07-Sept-2021
  @Why: EWM-2295
  @What: to set api returned initial value
  */
  @Input()
  set appHasPermission(val) {
    this.permissions = val;
    this.updateView();
  }

  /*
  @Type: File, <ts>
  @Name: updateView
  @Who: Renu
  @When: 07-Sept-2021
  @Why: EWM-2295
  @What: to check permission and show/hide buttons accordingly
  */
  private updateView() {
    if (this.checkPermission()) {
      if(this.isHidden) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.isHidden = false;
      }
    } else {
      this.isHidden = true;
      this.viewContainer.clear();
    }
  }

  /*
  @Type: File, <ts>
  @Name: checkPermission
  @Who: Renu
  @When: 07-Sept-2021
  @Why: EWM-2295
  @What: to check permission and show/hide buttons accordingly and return a boolean value
  */

  private checkPermission() {
    let hasPermission = false;
    let userPermission=this.permissions[0].toUpperCase();
    if(this.currentUser){
      this.currentUser.forEach(x => {
        if(x!=null){
          const permissionFound=Object.keys(x).find(x => x.toUpperCase() === userPermission);
          if(permissionFound && x[permissionFound]=='Y')
        {
          hasPermission = true;
        }else {
          hasPermission = false;
        }
        }
         
     });
    }
    return hasPermission;
    }
}
