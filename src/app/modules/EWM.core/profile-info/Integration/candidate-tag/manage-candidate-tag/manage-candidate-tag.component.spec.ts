import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageCandidateTagComponent } from './manage-candidate-tag.component';

describe('ManageCandidateTagComponent', () => {
  let component: ManageCandidateTagComponent;
  let fixture: ComponentFixture<ManageCandidateTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageCandidateTagComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageCandidateTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
