import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RevokeActivityAccessComponent } from './revoke-activity-access.component';

describe('RevokeActivityAccessComponent', () => {
  let component: RevokeActivityAccessComponent;
  let fixture: ComponentFixture<RevokeActivityAccessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RevokeActivityAccessComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RevokeActivityAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
