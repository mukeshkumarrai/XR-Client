import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContactRelatedToComponent } from './add-contact-related-to.component';

describe('AddContactRelatedToComponent', () => {
  let component: AddContactRelatedToComponent;
  let fixture: ComponentFixture<AddContactRelatedToComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddContactRelatedToComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddContactRelatedToComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
