import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateActivityComponent } from './candidate-activity.component';

describe('CandidateActivityComponent', () => {
  let component: CandidateActivityComponent;
  let fixture: ComponentFixture<CandidateActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateActivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
