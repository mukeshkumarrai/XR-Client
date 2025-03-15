import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevokeClientAccessComponent } from './revoke-client-access.component';

describe('RevokeClientAccessComponent', () => {
  let component: RevokeClientAccessComponent;
  let fixture: ComponentFixture<RevokeClientAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevokeClientAccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevokeClientAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
