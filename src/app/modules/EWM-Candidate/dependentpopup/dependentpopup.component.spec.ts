import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DependentpopupComponent } from './dependentpopup.component';

describe('DependentpopupComponent', () => {
  let component: DependentpopupComponent;
  let fixture: ComponentFixture<DependentpopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DependentpopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DependentpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
