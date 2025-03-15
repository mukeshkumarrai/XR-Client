import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateBulkSmsComponent } from './candidate-bulk-sms.component';

describe('CandidateBulkSmsComponent', () => {
  let component: CandidateBulkSmsComponent;
  let fixture: ComponentFixture<CandidateBulkSmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateBulkSmsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateBulkSmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
