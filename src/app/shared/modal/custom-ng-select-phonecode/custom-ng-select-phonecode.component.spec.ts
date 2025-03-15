import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomNgSelectPhonecodeComponent } from './custom-ng-select-phonecode.component';

describe('CustomNgSelectPhonecodeComponent', () => {
  let component: CustomNgSelectPhonecodeComponent;
  let fixture: ComponentFixture<CustomNgSelectPhonecodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomNgSelectPhonecodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomNgSelectPhonecodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
