import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedFilterCandidateComponent } from './advanced-filter-candidate.component';

describe('AdvancedFilterCandidateComponent', () => {
  let component: AdvancedFilterCandidateComponent;
  let fixture: ComponentFixture<AdvancedFilterCandidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedFilterCandidateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedFilterCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
