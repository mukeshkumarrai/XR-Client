import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerFilterActivityComponent } from './owner-filter-activity.component';

describe('OwnerFilterActivityComponent', () => {
  let component: OwnerFilterActivityComponent;
  let fixture: ComponentFixture<OwnerFilterActivityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwnerFilterActivityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerFilterActivityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
