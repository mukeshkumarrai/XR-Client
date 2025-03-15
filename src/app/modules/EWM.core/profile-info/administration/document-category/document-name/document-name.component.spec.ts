import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentNameComponent } from './document-name.component';

describe('DocumentNameComponent', () => {
  let component: DocumentNameComponent;
  let fixture: ComponentFixture<DocumentNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentNameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
