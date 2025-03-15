import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureJobFieldPermissionComponent } from './configure-job-field-permission.component';

describe('ConfigureJobFieldPermissionComponent', () => {
  let component: ConfigureJobFieldPermissionComponent;
  let fixture: ComponentFixture<ConfigureJobFieldPermissionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigureJobFieldPermissionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureJobFieldPermissionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
