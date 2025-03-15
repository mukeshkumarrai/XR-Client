import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FunctionalSubExpertiesListComponent } from './functional-sub-experties-list.component';

describe('FunctionalSubExpertiesListComponent', () => {
  let component: FunctionalSubExpertiesListComponent;
  let fixture: ComponentFixture<FunctionalSubExpertiesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FunctionalSubExpertiesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FunctionalSubExpertiesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
