import { Component, OnInit, Inject } from '@angular/core';
import { MatSnackBar,MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-seek-post-submit-response',
  templateUrl: './seek-post-submit-response.component.html',
  styleUrls: ['./seek-post-submit-response.component.scss']
})
export class SeekPostSubmitResponseComponent implements OnInit {

  url: any;
  
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any, public snackBar:
  MatSnackBar) {

  }
  ngOnInit() {}

}
