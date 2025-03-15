import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestGdprpopupComponent } from './request-gdprpopup.component';

describe('RequestGdprpopupComponent', () => {
  let component: RequestGdprpopupComponent;
  let fixture: ComponentFixture<RequestGdprpopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestGdprpopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestGdprpopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
