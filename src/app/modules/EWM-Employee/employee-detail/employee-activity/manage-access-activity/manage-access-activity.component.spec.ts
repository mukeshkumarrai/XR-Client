import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAccessActivityComponent } from './manage-access-activity.component';

describe('ManageAccessActivityComponent', () => {
  let component: ManageAccessActivityComponent;
  let fixture: ComponentFixture<ManageAccessActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageAccessActivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAccessActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
