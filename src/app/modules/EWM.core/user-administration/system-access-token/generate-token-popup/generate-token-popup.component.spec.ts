import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateTokenPopupComponent } from './generate-token-popup.component';

describe('GenerateTokenPopupComponent', () => {
  let component: GenerateTokenPopupComponent;
  let fixture: ComponentFixture<GenerateTokenPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateTokenPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenerateTokenPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
