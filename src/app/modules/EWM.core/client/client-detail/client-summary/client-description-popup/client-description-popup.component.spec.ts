import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientDescriptionPopupComponent } from './client-description-popup.component';

describe('ClientDescriptionPopupComponent', () => {
  let component: ClientDescriptionPopupComponent;
  let fixture: ComponentFixture<ClientDescriptionPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientDescriptionPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientDescriptionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
