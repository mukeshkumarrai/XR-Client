import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentShareableLinkComponent } from './document-shareable-link.component';

describe('DocumentShareableLinkComponent', () => {
  let component: DocumentShareableLinkComponent;
  let fixture: ComponentFixture<DocumentShareableLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentShareableLinkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentShareableLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
