import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecuritymfaComponent } from './securitymfa.component';

describe('SecuritymfaComponent', () => {
  let component: SecuritymfaComponent;
  let fixture: ComponentFixture<SecuritymfaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecuritymfaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecuritymfaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
