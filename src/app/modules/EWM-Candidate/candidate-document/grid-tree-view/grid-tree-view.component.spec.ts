import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridTreeViewComponent } from './grid-tree-view.component';

describe('GridTreeViewComponent', () => {
  let component: GridTreeViewComponent;
  let fixture: ComponentFixture<GridTreeViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GridTreeViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GridTreeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
