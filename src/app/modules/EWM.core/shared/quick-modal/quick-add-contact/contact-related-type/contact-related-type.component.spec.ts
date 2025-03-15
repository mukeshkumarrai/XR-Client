import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactRelatedTypeComponent } from './contact-related-type.component';

describe('ContactRelatedTypeComponent', () => {
  let component: ContactRelatedTypeComponent;
  let fixture: ComponentFixture<ContactRelatedTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactRelatedTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactRelatedTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
