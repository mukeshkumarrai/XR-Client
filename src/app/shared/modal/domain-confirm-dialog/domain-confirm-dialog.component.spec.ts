import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainConfirmDialogComponent } from './domain-confirm-dialog.component';

describe('DomainConfirmDialogComponent', () => {
  let component: DomainConfirmDialogComponent;
  let fixture: ComponentFixture<DomainConfirmDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DomainConfirmDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DomainConfirmDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
