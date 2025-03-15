import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChildSourceListComponent } from './child-source-list.component';

describe('ChildSourceListComponent', () => {
  let component: ChildSourceListComponent;
  let fixture: ComponentFixture<ChildSourceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChildSourceListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChildSourceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
