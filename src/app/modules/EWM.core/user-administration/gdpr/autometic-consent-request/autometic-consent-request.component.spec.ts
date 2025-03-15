import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutometicConsentRequestComponent } from './autometic-consent-request.component';

describe('AutometicConsentRequestComponent', () => {
  let component: AutometicConsentRequestComponent;
  let fixture: ComponentFixture<AutometicConsentRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutometicConsentRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutometicConsentRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
