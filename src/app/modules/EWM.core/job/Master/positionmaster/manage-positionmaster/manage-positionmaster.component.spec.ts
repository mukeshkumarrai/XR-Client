import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagePositionmasterComponent } from './manage-positionmaster.component';

describe('ManagePositionmasterComponent', () => {
  let component: ManagePositionmasterComponent;
  let fixture: ComponentFixture<ManagePositionmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManagePositionmasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePositionmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
