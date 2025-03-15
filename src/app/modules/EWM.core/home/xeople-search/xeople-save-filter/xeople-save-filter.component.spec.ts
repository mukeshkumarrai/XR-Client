import { ComponentFixture, TestBed } from '@angular/core/testing';

import { XeopleSaveFilterComponent } from './xeople-save-filter.component';

describe('XeopleSaveFilterComponent', () => {
  let component: XeopleSaveFilterComponent;
  let fixture: ComponentFixture<XeopleSaveFilterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ XeopleSaveFilterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(XeopleSaveFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
