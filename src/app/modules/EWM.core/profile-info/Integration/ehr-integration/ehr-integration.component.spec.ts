import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EhrIntegrationComponent } from './ehr-integration.component';

describe('EhrIntegrationComponent', () => {
  let component: EhrIntegrationComponent;
  let fixture: ComponentFixture<EhrIntegrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EhrIntegrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EhrIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
