import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddChecklistGroupComponent } from './add-checklist-group.component';

describe('AddChecklistGroupComponent', () => {
  let component: AddChecklistGroupComponent;
  let fixture: ComponentFixture<AddChecklistGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddChecklistGroupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddChecklistGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
