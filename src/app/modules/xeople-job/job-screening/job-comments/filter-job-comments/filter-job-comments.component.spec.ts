import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterJobCommentsComponent } from './filter-job-comments.component';

describe('FilterJobCommentsComponent', () => {
  let component: FilterJobCommentsComponent;
  let fixture: ComponentFixture<FilterJobCommentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterJobCommentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterJobCommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
