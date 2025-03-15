import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  private previousUrl: string;
  private previousQueryParams: any;

  setPreviousUrl(url: string, queryParams: any) {
    this.previousUrl = url;
    this.previousQueryParams = queryParams;
  }

  getPreviousUrl() {
    return { url: this.previousUrl, queryParams: this.previousQueryParams };
  }
}
