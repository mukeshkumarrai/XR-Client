import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OwnerFilterComponent } from './owner-filter.component';

describe('OwnerFilterComponent', () => {
  let component: OwnerFilterComponent;
  let fixture: ComponentFixture<OwnerFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwnerFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OwnerFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
