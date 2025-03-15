import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XeopleSearchSmsComponent } from './xeople-search-sms.component';

describe('XeopleSearchSmsComponent', () => {
  let component: XeopleSearchSmsComponent;
  let fixture: ComponentFixture<XeopleSearchSmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XeopleSearchSmsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XeopleSearchSmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
