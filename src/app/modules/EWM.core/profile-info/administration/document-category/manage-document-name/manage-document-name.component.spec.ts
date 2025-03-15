import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDocumentNameComponent } from './manage-document-name.component';

describe('ManageDocumentNameComponent', () => {
  let component: ManageDocumentNameComponent;
  let fixture: ComponentFixture<ManageDocumentNameComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageDocumentNameComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageDocumentNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
