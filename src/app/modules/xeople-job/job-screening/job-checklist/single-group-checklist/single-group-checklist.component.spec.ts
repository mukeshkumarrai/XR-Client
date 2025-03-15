import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleGroupChecklistComponent } from './single-group-checklist.component';

describe('SingleGroupChecklistComponent', () => {
  let component: SingleGroupChecklistComponent;
  let fixture: ComponentFixture<SingleGroupChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleGroupChecklistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleGroupChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
