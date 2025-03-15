import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilePreviwerPopupComponent } from './file-previwer-popup.component';

describe('FilePreviwerPopupComponent', () => {
  let component: FilePreviwerPopupComponent;
  let fixture: ComponentFixture<FilePreviwerPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilePreviwerPopupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilePreviwerPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
