import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemAuditLogNewComponent } from './system-audit-log-new.component';

describe('SystemAuditLogNewComponent', () => {
  let component: SystemAuditLogNewComponent;
  let fixture: ComponentFixture<SystemAuditLogNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SystemAuditLogNewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SystemAuditLogNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
