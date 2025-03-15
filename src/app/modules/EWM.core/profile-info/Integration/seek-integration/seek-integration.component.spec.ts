import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeekIntegrationComponent } from './seek-integration.component';

describe('SeekIntegrationComponent', () => {
  let component: SeekIntegrationComponent;
  let fixture: ComponentFixture<SeekIntegrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeekIntegrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeekIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
