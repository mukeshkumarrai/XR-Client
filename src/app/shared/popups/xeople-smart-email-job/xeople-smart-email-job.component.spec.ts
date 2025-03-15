import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XeopleSmartEmailJobComponent } from './xeople-smart-email-job.component';

describe('XeopleSmartEmailJobComponent', () => {
  let component: XeopleSmartEmailJobComponent;
  let fixture: ComponentFixture<XeopleSmartEmailJobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XeopleSmartEmailJobComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XeopleSmartEmailJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
