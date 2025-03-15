import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverLetterUploadComponent } from './cover-letter-upload.component';

describe('CoverLetterUploadComponent', () => {
  let component: CoverLetterUploadComponent;
  let fixture: ComponentFixture<CoverLetterUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoverLetterUploadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoverLetterUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
