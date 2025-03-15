import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateSmsComponent } from './candidate-sms.component';

describe('CandidateSmsComponent', () => {
  let component: CandidateSmsComponent;
  let fixture: ComponentFixture<CandidateSmsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateSmsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateSmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
