import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TokenCreateConfirmBoxPopupComponent } from './token-create-confirm-box-popup.component';

describe('TokenCreateConfirmBoxPopupComponent', () => {
  let component: TokenCreateConfirmBoxPopupComponent;
  let fixture: ComponentFixture<TokenCreateConfirmBoxPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TokenCreateConfirmBoxPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TokenCreateConfirmBoxPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
