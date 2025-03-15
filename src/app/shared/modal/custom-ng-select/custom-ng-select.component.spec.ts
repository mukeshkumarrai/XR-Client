import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomNgSelectComponent } from './custom-ng-select.component';

describe('CustomNgSelectComponent', () => {
  let component: CustomNgSelectComponent;
  let fixture: ComponentFixture<CustomNgSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomNgSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomNgSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
