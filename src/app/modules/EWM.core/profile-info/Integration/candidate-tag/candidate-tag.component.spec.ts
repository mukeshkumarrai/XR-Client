import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateTagComponent } from './candidate-tag.component';

describe('CandidateTagComponent', () => {
  let component: CandidateTagComponent;
  let fixture: ComponentFixture<CandidateTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CandidateTagComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
