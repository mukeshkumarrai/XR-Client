import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalInformationFormComponent } from './personal-information-form.component';

describe('PersonalInformationFormComponent', () => {
  let component: PersonalInformationFormComponent;
  let fixture: ComponentFixture<PersonalInformationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalInformationFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonalInformationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
