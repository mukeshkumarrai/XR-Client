import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageUserTypeMasterComponent } from './manage-user-type-master.component';

describe('ManageUserTypeMasterComponent', () => {
  let component: ManageUserTypeMasterComponent;
  let fixture: ComponentFixture<ManageUserTypeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageUserTypeMasterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageUserTypeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
