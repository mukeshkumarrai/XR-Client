import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AfterRevokeAccessMessagePopupComponent } from './after-revoke-access-message-popup.component';

describe('AfterRevokeAccessMessagePopupComponent', () => {
  let component: AfterRevokeAccessMessagePopupComponent;
  let fixture: ComponentFixture<AfterRevokeAccessMessagePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AfterRevokeAccessMessagePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AfterRevokeAccessMessagePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
