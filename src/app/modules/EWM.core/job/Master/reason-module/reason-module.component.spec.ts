import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReasonModuleComponent } from './reason-module.component';

describe('ReasonModuleComponent', () => {
  let component: ReasonModuleComponent;
  let fixture: ComponentFixture<ReasonModuleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReasonModuleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReasonModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
