import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterDialogComponent } from './footer-dialog.component';

describe('FooterDialogComponent', () => {
  let component: FooterDialogComponent;
  let fixture: ComponentFixture<FooterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FooterDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
