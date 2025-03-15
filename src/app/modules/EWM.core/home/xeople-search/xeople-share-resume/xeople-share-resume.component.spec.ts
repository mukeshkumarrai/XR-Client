import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XeopleShareResumeComponent } from './xeople-share-resume.component';

describe('XeopleShareResumeComponent', () => {
  let component: XeopleShareResumeComponent;
  let fixture: ComponentFixture<XeopleShareResumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XeopleShareResumeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XeopleShareResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
