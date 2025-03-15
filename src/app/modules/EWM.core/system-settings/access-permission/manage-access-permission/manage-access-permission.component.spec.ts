import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageAccessPermissionComponent } from './manage-access-permission.component';

describe('ManageAccessPermissionComponent', () => {
  let component: ManageAccessPermissionComponent;
  let fixture: ComponentFixture<ManageAccessPermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageAccessPermissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageAccessPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
