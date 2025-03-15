import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupChecklistComponent } from './group-checklist.component';

describe('GroupChecklistComponent', () => {
  let component: GroupChecklistComponent;
  let fixture: ComponentFixture<GroupChecklistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GroupChecklistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupChecklistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
