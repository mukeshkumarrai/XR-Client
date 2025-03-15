import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersistFilterComponent } from './persist-filter.component';

describe('PersistFilterComponent', () => {
  let component: PersistFilterComponent;
  let fixture: ComponentFixture<PersistFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersistFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersistFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
