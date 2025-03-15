import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewDocumentComponent } from './create-new-document.component';

describe('CreateNewDocumentComponent', () => {
  let component: CreateNewDocumentComponent;
  let fixture: ComponentFixture<CreateNewDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateNewDocumentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
