import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCandidateDegreeTypeComponent } from './manage-candidate-degree-type.component';

describe('ManageCandidateDegreeTypeComponent', () => {
  let component: ManageCandidateDegreeTypeComponent;
  let fixture: ComponentFixture<ManageCandidateDegreeTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageCandidateDegreeTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCandidateDegreeTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
