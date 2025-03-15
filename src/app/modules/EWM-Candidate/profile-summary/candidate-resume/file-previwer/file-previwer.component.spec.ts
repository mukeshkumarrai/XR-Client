import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilePreviwerComponent } from './file-previwer.component';

describe('FilePreviwerComponent', () => {
  let component: FilePreviwerComponent;
  let fixture: ComponentFixture<FilePreviwerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilePreviwerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilePreviwerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
