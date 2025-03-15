import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoomCallIntegrationComponent } from './zoom-call-integration.component';

describe('ZoomCallIntegrationComponent', () => {
  let component: ZoomCallIntegrationComponent;
  let fixture: ComponentFixture<ZoomCallIntegrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZoomCallIntegrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoomCallIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
