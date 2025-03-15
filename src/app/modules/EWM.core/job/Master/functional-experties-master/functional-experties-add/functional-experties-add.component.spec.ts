import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FunctionalExpertiesAddComponent } from './functional-experties-add.component';

describe('FunctionalExpertiesAddComponent', () => {
  let component: FunctionalExpertiesAddComponent;
  let fixture: ComponentFixture<FunctionalExpertiesAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FunctionalExpertiesAddComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FunctionalExpertiesAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
