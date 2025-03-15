import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScreeningActionComponent } from './screening-action.component';

describe('ScreeningActionComponent', () => {
  let component: ScreeningActionComponent;
  let fixture: ComponentFixture<ScreeningActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScreeningActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScreeningActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
