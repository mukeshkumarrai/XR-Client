import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DrawerServiceService } from '@app/shared/services/commonservice/drawer-service.service';

@Component({
  selector: 'app-activity-drawer',
  templateUrl: './activity-drawer.component.html',
  styleUrls: ['./activity-drawer.component.scss']
})
export class ActivityDrawerComponent implements OnInit {
  drawer1$ = this._drawerService.drawer1$;
  @Input() ActivityObj:any;
  @Output() closeDrawerMyActivity: EventEmitter<any> = new EventEmitter();
  @Output() myActivityDrawerClose: EventEmitter<any> = new EventEmitter();

  constructor(private _drawerService: DrawerServiceService) { }

  ngOnInit(): void {
  }

  oncloseDrawer() {
    this.closeDrawerMyActivity.emit();
  }

  drawerCloseMyActivity(event: any){
    this.myActivityDrawerClose.emit(event);
  }
}
