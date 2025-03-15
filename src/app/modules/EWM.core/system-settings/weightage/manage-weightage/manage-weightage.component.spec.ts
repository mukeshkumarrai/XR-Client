import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageWeightageComponent } from './manage-weightage.component';

describe('ManageWeightageComponent', () => {
  let component: ManageWeightageComponent;
  let fixture: ComponentFixture<ManageWeightageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageWeightageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageWeightageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
