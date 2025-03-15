import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkDeniedComponent } from './link-denied.component';

describe('LinkDeniedComponent', () => {
  let component: LinkDeniedComponent;
  let fixture: ComponentFixture<LinkDeniedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkDeniedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LinkDeniedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
