import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickCandidateComponent } from './quick-candidate.component';

describe('QuickCandidateComponent', () => {
  let component: QuickCandidateComponent;
  let fixture: ComponentFixture<QuickCandidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ QuickCandidateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(QuickCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
