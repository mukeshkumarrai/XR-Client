import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelatedToModuleComponent } from './related-to-module.component';

describe('RelatedToModuleComponent', () => {
  let component: RelatedToModuleComponent;
  let fixture: ComponentFixture<RelatedToModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelatedToModuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelatedToModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
