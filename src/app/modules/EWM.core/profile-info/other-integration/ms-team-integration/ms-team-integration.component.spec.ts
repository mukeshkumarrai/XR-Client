import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsTeamIntegrationComponent } from './ms-team-integration.component';

describe('MsTeamIntegrationComponent', () => {
  let component: MsTeamIntegrationComponent;
  let fixture: ComponentFixture<MsTeamIntegrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MsTeamIntegrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MsTeamIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
