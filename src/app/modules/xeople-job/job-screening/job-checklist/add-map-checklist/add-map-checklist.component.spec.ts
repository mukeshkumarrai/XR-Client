import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMapChecklistComponent } from './add-map-checklist.component';

describe('AddMapChecklistComponent', () => {
  let component: AddMapChecklistComponent;
  let fixture: ComponentFixture<AddMapChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddMapChecklistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMapChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
