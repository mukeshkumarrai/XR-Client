import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestGdprContentPageComponent } from './request-gdpr-content-page.component';

describe('RequestGdprContentPageComponent', () => {
  let component: RequestGdprContentPageComponent;
  let fixture: ComponentFixture<RequestGdprContentPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestGdprContentPageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestGdprContentPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
