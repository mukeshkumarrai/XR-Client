import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignContactComponent } from './assign-contact.component';

describe('AssignContactComponent', () => {
  let component: AssignContactComponent;
  let fixture: ComponentFixture<AssignContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignContactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
