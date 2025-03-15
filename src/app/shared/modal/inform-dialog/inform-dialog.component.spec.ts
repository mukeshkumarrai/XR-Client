import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformDialogComponent } from './inform-dialog.component';

describe('InformDialogComponent', () => {
  let component: InformDialogComponent;
  let fixture: ComponentFixture<InformDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InformDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InformDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
