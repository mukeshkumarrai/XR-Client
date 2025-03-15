import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactPersonalInfoComponent } from './contact-personal-info.component';

describe('ContactPersonalInfoComponent', () => {
  let component: ContactPersonalInfoComponent;
  let fixture: ComponentFixture<ContactPersonalInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactPersonalInfoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactPersonalInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
