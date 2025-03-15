import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertLeadClientComponent } from './convert-lead-client.component';

describe('ConvertLeadClientComponent', () => {
  let component: ConvertLeadClientComponent;
  let fixture: ComponentFixture<ConvertLeadClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConvertLeadClientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvertLeadClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
