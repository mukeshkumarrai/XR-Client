import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateConfigureDashboardComponent } from './candidate-configure-dashboard.component';

describe('CandidateConfigureDashboardComponent', () => {
  let component: CandidateConfigureDashboardComponent;
  let fixture: ComponentFixture<CandidateConfigureDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateConfigureDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateConfigureDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
