import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BurstsmsIntegrationComponent } from './burstsms-integration.component';

describe('BurstsmsIntegrationComponent', () => {
  let component: BurstsmsIntegrationComponent;
  let fixture: ComponentFixture<BurstsmsIntegrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BurstsmsIntegrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BurstsmsIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
