import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryFilterActivityComponent } from './category-filter-activity.component';

describe('CategoryFilterActivityComponent', () => {
  let component: CategoryFilterActivityComponent;
  let fixture: ComponentFixture<CategoryFilterActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CategoryFilterActivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryFilterActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
