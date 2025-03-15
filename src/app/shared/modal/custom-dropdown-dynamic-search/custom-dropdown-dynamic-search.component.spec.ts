import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomDropdownDynamicSearchComponent } from './custom-dropdown-dynamic-search.component';

describe('CustomDropdownDynamicSearchComponent', () => {
  let component: CustomDropdownDynamicSearchComponent;
  let fixture: ComponentFixture<CustomDropdownDynamicSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomDropdownDynamicSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomDropdownDynamicSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
