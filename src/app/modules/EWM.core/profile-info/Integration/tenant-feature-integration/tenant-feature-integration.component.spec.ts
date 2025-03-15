import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TenantfeatureIntegration } from './tenant-feature-integration.component';

describe('TenantfeatureIntegration', () => {
  let component: TenantfeatureIntegration;
  let fixture: ComponentFixture<TenantfeatureIntegration>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TenantfeatureIntegration ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TenantfeatureIntegration);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
