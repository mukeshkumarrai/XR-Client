import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewApiTokenPopupComponent } from './new-api-token-popup.component';

describe('NewApiTokenPopupComponent', () => {
  let component: NewApiTokenPopupComponent;
  let fixture: ComponentFixture<NewApiTokenPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewApiTokenPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewApiTokenPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
