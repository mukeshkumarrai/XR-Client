import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsavedConfirmPopComponent } from './unsaved-confirm-pop.component';

describe('UnsavedConfirmPopComponent', () => {
  let component: UnsavedConfirmPopComponent;
  let fixture: ComponentFixture<UnsavedConfirmPopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UnsavedConfirmPopComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsavedConfirmPopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
