import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoverLetterPopupComponent } from './cover-letter-popup.component';

describe('CoverLetterPopupComponent', () => {
  let component: CoverLetterPopupComponent;
  let fixture: ComponentFixture<CoverLetterPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoverLetterPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoverLetterPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
