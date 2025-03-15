import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddImportantLinksComponent } from './add-important-links.component';

describe('AddImportantLinksComponent', () => {
  let component: AddImportantLinksComponent;
  let fixture: ComponentFixture<AddImportantLinksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddImportantLinksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddImportantLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
