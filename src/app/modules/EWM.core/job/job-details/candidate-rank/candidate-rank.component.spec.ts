import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateRankComponent } from './candidate-rank.component';

describe('CandidateRankComponent', () => {
  let component: CandidateRankComponent;
  let fixture: ComponentFixture<CandidateRankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateRankComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateRankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
