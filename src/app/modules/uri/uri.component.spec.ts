import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UriComponent } from './uri.component';

describe('UriComponent', () => {
  let component: UriComponent;
  let fixture: ComponentFixture<UriComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UriComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UriComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
