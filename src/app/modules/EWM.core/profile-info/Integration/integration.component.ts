/*
    @(C): Entire Software
    @Type: File, <ts>
    @Who:Priti Srivastava
    @When: 12-July-2021
    @Why:EWM-2114
    @What:  This component is used for show list integrated menu.
*/
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-integration',
  templateUrl: './integration.component.html',
  styleUrls: ['./integration.component.scss']
})
export class IntegrationComponent implements OnInit {
  ActiveMenu: any;
  public loading: boolean = false;
  constructor(private route: Router, private translateService: TranslateService) { }

  ngOnInit(): void {
    let URL = this.route.url;
    let URL_AS_LIST;
    if (URL.substring(0, URL.indexOf("?")) == '') {
      URL_AS_LIST = URL.split('/');
    } else {
      URL_AS_LIST = URL.substring(0, URL.indexOf("?")).split('/');
    }

    this.ActiveMenu = URL_AS_LIST[3]
  }
  goToPage(routePath) {
    this.route.navigate(['./client/core/' + this.ActiveMenu + '/' + routePath]);
  }

}
