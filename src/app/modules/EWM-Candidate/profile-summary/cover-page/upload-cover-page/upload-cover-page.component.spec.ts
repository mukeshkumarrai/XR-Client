import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadCoverPageComponent } from './upload-cover-page.component';

describe('UploadCoverPageComponent', () => {
  let component: UploadCoverPageComponent;
  let fixture: ComponentFixture<UploadCoverPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadCoverPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UploadCoverPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
