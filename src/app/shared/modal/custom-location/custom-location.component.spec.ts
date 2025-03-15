import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomLocationComponent } from './custom-location.component';

describe('CustomLocationComponent', () => {
  let component: CustomLocationComponent;
  let fixture: ComponentFixture<CustomLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomLocationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
