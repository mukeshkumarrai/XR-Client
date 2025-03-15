import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
@Injectable({
  providedIn: 'root'
})
export class TitleService {

  constructor(private title: Title) { }
  setPageTitle(newTitle: string): void {
    this.title.setTitle(newTitle);
  }
}
