import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageRemoveReasonComponent } from './manage-remove-reason.component';

describe('ManageRemoveReasonComponent', () => {
  let component: ManageRemoveReasonComponent;
  let fixture: ComponentFixture<ManageRemoveReasonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageRemoveReasonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageRemoveReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
