import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientConfigDashboardPopComponent } from './client-config-dashboard-pop.component';

describe('ClientConfigDashboardPopComponent', () => {
  let component: ClientConfigDashboardPopComponent;
  let fixture: ComponentFixture<ClientConfigDashboardPopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientConfigDashboardPopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientConfigDashboardPopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
