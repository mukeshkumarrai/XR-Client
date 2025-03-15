import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FunctionalExpertiesListComponent } from './functional-experties-list.component';

describe('FunctionalExpertiesListComponent', () => {
  let component: FunctionalExpertiesListComponent;
  let fixture: ComponentFixture<FunctionalExpertiesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FunctionalExpertiesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FunctionalExpertiesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
