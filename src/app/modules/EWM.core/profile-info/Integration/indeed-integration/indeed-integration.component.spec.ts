import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndeedIntegrationComponent } from './indeed-integration.component';

describe('IndeedIntegrationComponent', () => {
  let component: IndeedIntegrationComponent;
  let fixture: ComponentFixture<IndeedIntegrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndeedIntegrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndeedIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
