import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCandidateSourceComponent } from './manage-candidate-source.component';

describe('ManageCandidateSourceComponent', () => {
  let component: ManageCandidateSourceComponent;
  let fixture: ComponentFixture<ManageCandidateSourceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageCandidateSourceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCandidateSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
