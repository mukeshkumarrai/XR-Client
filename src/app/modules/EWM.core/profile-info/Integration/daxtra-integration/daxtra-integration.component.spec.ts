import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DaxtraIntegrationComponent } from './daxtra-integration.component';

describe('DaxtraIntegrationComponent', () => {
  let component: DaxtraIntegrationComponent;
  let fixture: ComponentFixture<DaxtraIntegrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DaxtraIntegrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DaxtraIntegrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
