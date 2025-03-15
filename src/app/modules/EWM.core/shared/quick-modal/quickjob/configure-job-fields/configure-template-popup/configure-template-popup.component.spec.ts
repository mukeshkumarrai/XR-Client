import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigureTemplatePopupComponent } from './configure-template-popup.component';

describe('ConfigureTemplatePopupComponent', () => {
  let component: ConfigureTemplatePopupComponent;
  let fixture: ComponentFixture<ConfigureTemplatePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfigureTemplatePopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigureTemplatePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
