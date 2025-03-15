import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-file-previwer',
  templateUrl: './file-previwer.component.html',
  styleUrls: ['./file-previwer.component.scss']
})
export class FilePreviwerComponent implements OnInit {
  @Input() url :any;
  @Input() viewer = 'url';
  public isLoading: boolean = true;
  constructor() { }

  ngOnInit(): void {

   // console.log(this.url,this.viewer);
  }

}
