import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FunctionalSubExpertiesAddComponent } from './functional-sub-experties-add.component';

describe('FunctionalSubExpertiesAddComponent', () => {
  let component: FunctionalSubExpertiesAddComponent;
  let fixture: ComponentFixture<FunctionalSubExpertiesAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FunctionalSubExpertiesAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FunctionalSubExpertiesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
