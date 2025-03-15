import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherIntegrationComponent } from './other-integration.component';

describe('OtherIntegrationComponent', () => {
  let component: OtherIntegrationComponent;
  let fixture: ComponentFixture<OtherIntegrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OtherIntegrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
