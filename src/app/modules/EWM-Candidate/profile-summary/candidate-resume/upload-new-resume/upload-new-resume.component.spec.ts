import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadNewResumeComponent } from './upload-new-resume.component';

describe('UploadNewResumeComponent', () => {
  let component: UploadNewResumeComponent;
  let fixture: ComponentFixture<UploadNewResumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadNewResumeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadNewResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
