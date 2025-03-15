import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BroadbeanIntegrationComponent } from './broadbean-integration.component';

describe('BroadbeanIntegrationComponent', () => {
  let component: BroadbeanIntegrationComponent;
  let fixture: ComponentFixture<BroadbeanIntegrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BroadbeanIntegrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BroadbeanIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
