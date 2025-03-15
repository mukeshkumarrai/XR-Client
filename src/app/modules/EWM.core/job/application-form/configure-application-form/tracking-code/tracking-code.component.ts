import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-tracking-code',
  templateUrl: './tracking-code.component.html',
  styleUrls: ['./tracking-code.component.scss']
})
export class TrackingCodeComponent implements OnInit {
  @Input() trackingCodeIdData: any;

  constructor() { }

  ngOnInit(): void {
  }

}
