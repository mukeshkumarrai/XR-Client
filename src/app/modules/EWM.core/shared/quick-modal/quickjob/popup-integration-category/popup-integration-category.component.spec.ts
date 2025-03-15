import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopupIntegrationCategoryComponent } from './popup-integration-category.component';

describe('PopupIntegrationCategoryComponent', () => {
  let component: PopupIntegrationCategoryComponent;
  let fixture: ComponentFixture<PopupIntegrationCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PopupIntegrationCategoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PopupIntegrationCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
