import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XeopleSearchMailComponent } from './xeople-search-mail.component';

describe('XeopleSearchMailComponent', () => {
  let component: XeopleSearchMailComponent;
  let fixture: ComponentFixture<XeopleSearchMailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XeopleSearchMailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XeopleSearchMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
