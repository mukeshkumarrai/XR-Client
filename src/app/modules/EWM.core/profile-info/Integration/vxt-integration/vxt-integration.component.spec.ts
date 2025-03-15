import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VxtIntegrationComponent } from './vxt-integration.component';

describe('VxtIntegrationComponent', () => {
  let component: VxtIntegrationComponent;
  let fixture: ComponentFixture<VxtIntegrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VxtIntegrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VxtIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
