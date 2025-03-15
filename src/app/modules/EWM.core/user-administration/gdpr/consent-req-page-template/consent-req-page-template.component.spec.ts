import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsentReqPageTemplateComponent } from './consent-req-page-template.component';

describe('ConsentReqPageTemplateComponent', () => {
  let component: ConsentReqPageTemplateComponent;
  let fixture: ComponentFixture<ConsentReqPageTemplateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsentReqPageTemplateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsentReqPageTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
