import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRelatedToModuleComponent } from './add-related-to-module.component';

describe('AddRelatedToModuleComponent', () => {
  let component: AddRelatedToModuleComponent;
  let fixture: ComponentFixture<AddRelatedToModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddRelatedToModuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRelatedToModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
