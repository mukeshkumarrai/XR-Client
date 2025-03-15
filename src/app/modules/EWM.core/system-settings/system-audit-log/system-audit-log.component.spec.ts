import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemAuditLogComponent } from './system-audit-log.component';

describe('SystemAuditLogComponent', () => {
  let component: SystemAuditLogComponent;
  let fixture: ComponentFixture<SystemAuditLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemAuditLogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemAuditLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
