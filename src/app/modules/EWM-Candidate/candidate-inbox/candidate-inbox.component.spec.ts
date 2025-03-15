import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateInboxComponent } from './candidate-inbox.component';

describe('CandidateInboxComponent', () => {
  let component: CandidateInboxComponent;
  let fixture: ComponentFixture<CandidateInboxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateInboxComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateInboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
